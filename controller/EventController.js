import EventModel from "../models/Event.js";

// Подключение к MongoDB
//mongoose.connect('mongodb://localhost:27017/Test', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//});
class PostController 
{
  async createPost(req, res, next)
  {
    try
    {
      const {imageUrl, title, content, location} = req.body;
      const Event = await EventModel.create
      ({
        imageUrl: imageUrl, 
        title: title,
        content: content,
        location: location,
      });
      return res.status(200).json({Event})
    }catch (res) {
      console.log(err);
      res.status(400).json({ message: "Create Post error", err });
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }
  async readOnePost(req, res, next) {
    try {
      const eventId = req.params.id ;
      const post = await Event.findById(eventId);;
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(200).json(post);
    } catch (res) {
      console.error(err);
      res.status(400).json({ message: "Error fetching posts", error: err });
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }
  
  async readAllPost(req, res, next)
  {
    try {
      const allPosts = await EventModel.find({});
      if(!allPosts) 
      { 
        return res.status(400).json("Error fetching posts")
      }
      return res.status(200).json(allPosts);
    } catch (res) {
      console.error(err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }
  async updatePost(req, res, next) {
    try {
      const { id, imageUrl, title, content, location } = req.body;
      const post = await Event.findById(id);;
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      const updatedPost = await EventModel.updateOne(
        { _id: id },
        {
          imageUrl: imageUrl,
          title: title,
          content: content,
          location: location,
        }
      );
      return res.status(200).json({ message: "Post updated successfully" });
    } catch (res) {
      console.error(err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }

  async deletePost(req, res, next)
  {
    try
    {
      const { id } = req.body;
      const result = await EventModel.deleteOne({ _id: id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      return res.status(200).json({ message: "Post deleted successfully 🥳" });
    }
    catch(res)
    {
      console.log(err);
      res.status(400).json({ message: "Delete post error", err });
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }
}

export default new PostController();
