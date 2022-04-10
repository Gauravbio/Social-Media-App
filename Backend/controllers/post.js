const Post =require("../models/Post");
const User=require("../models/User");
const cloudinary=require("cloudinary");

exports.createPost= async (req,res)=> {
    try {
        const myCloud=await cloudinary.v2.uploader.upload(req.body.image,{
            folder:"posts"
        });
        const newPostData= {
            caption:req.body.caption,
            image:{
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            },
            owner: req.user._id,
        };

        const post=await Post.create(newPostData);

        const user=await User.findById(req.user._id);

        user.posts.unshift(post._id);
        await user.save();

        res.status(201).json({
            success:true,
            message:"Post created",
            post,
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};

exports.deletePost=  async(req,res) => {
    try {
        
        const post = await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({
                success:false,
                message:"post not found",
            })
        }

        if(post.owner.toString()!==req.user._id.toString()) {
            re.status(401).json({
                success:false,
                message:"unauthorized",
            });
        }

        await cloudinary.v2.uploader.destroy(post.image.public_id);

        await post.remove();
        const user=await User.findById(req.user._id);

        const index= user.posts.indexOf(req.params.id);
        user.posts.splice(index,1);
        await user.save();

        res.status(200).json({
            success:true,
            message:"post deleted",
        });
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}

exports.likeAndUnlikePost= async(req,res) => {
    try {
        const post=await Post.findById(req.params.id);
        if(!post) {
            return res.status(404).json({
                success:false,
                message:"post not found",
            })
        }

        if(post.likes.includes(req.user._id)) {
            const index=post.likes.indexOf(req.user._id);

            post.likes.splice(index,1);
            await post.save();

            return res.status(200).json({
                success:true,
                message:"post unliked",
            });
        }else {
            post.likes.push(req.user._id);
            await post.save();

            return res.status(200).json({
                success:true,
                message:"post liked",
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        })
    }
};

exports.getPostOfFollowing =async (req,res) => {
        try {
            const user=await User.findById(req.user._id);

            const posts= await Post.find({
                owner:{
                    $in:user.following,
                }
            }).populate("owner likes comments.user")

            res.status(200).json({
                success:true,
                posts:posts.reverse(),
            })
        } catch (error) {
            res.status(500).json({
                success:false,
                message:error.message,
            });
        }
};

exports.updateCaption= async (req,res) => {
    try {
        const post=await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({
                 succes:false,
                 message:"post not found",
            });
        }

        if(post.owner.toString() !==req.user._id.toString()) {
            return res.status(401).json({
                succes:false,
                message:"Unauthorized",
            });
        } 

        post.caption=req.body.caption;
        await post.save();
        res.status(200).json({
            succes:true,
            message:"Post updated",
        });
    } catch (error) {
        res.stat(500).json({
            succes:false,
            message:error.message,
        })
    }
};

exports.commentOnPost=async (req,res)=> {
    try {
        const post=await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({
                success:true,
                message:"post not found",
            });
        }

        let commentIndex=-1;

        //checking if commment alrady exists
        post.comments.forEach((item,index) => {
            
            if(item.user.toString() === req.user._id.toString()) {
                commentIndex=index;
            }
        });

        if (commentIndex !==-1) {
            post.comments[commentIndex].comment=req.body.comment;

            await post.save();
            res.status(200).json({
                success:true,
                message:"Comment updated",
            })
        } else {
            post.comments.push({
                user:req.user._id,
                comment:req.body.comment,
            });

            await post.save();
            return res.status(200).json({
                success:true,
                message:"Comment added",
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
};

exports.deleteComment=async (req,res) => {
    try {
        const post =await Post.findById(req.params.id);

        if(!post) {
            return res.status(404).json({
                success:false,
                message:"post not found"
            });
        }

        //checking if owner wants to delete
        if(post.owner.toString()==req.user._id.toString()) {

            if(req.body.commentId===undefined) {
                return res.status(400).json({
                    success:false,
                    message:"Comment id required",
                })
            }
            post.comments.forEach((item,index) => {
            
                if(item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index,1);
                }
            });

            await post.save();

            return res.status(200).json({
                success:true,
                message:"Comment deleted",
            })

        }else {

            post.comments.forEach((item,index) => {
            
                if(item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(index,1);
                }
            });

            await post.save();
            return res.status(200).json({
                success:true,
                message:"Your comment deleted",
            })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message,
        });
    }
}