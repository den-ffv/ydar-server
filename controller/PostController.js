import Post from "../models/Post.js";

class postController {
  async createPost(req, res, next) {
    try {
      const { imageUrl, title, content, location } = req.body;
      const post = await Post.create({
        imageUrl: imageUrl,
        title: title,
        content: content,
        location: location,
      });
      return res.status(200).json({ post });
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Error when create posts", error: err });
    }
  }

  async readOnePost(req, res, next) {
    try {
      const postId = req.params.id;
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(200).json({ post });
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Error fetching posts", error: err });
    }
  }

  async readAllPost(req, res, next) {
    try {
      const allPosts = await Post.find({});
      if (!allPosts) {
        return res.status(400).json("Error fetching posts");
      }
      return res.status(200).json({ allPosts });
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Error fetching posts", error: err });
    }
  }
  async updatePost(req, res, next) {
    try {
      const postId = req.params.id;
      const { imageUrl, title, content, location } = req.body;
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
          imageUrl: imageUrl,
          title: title,
          content: content,
          location: location,
        },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      return res
        .status(200)
        .json({ message: "Post updated successfully", updatedPost });
    } catch (err) {
      console.error(err);
      return res
        .status(400)
        .json({ message: "Error when update post", error: err });
    }
  }

  async deletePost(req, res, next) {
    try {
      const postId = req.params.id;
      const result = await Post.findById(postId);

      if (!result) {
        return res.status(404).json({ message: "Post not found" });
      }
      await Post.deleteOne({ _id: postId });
      return res.status(200).json({ message: "Post deleted successfully 🥳" });
    } catch (err) {
      console.log(err);
      return res
        .status(400)
        .json({ message: "Error when deleted post", error: err });
    }
  }
}

export default new postController();
