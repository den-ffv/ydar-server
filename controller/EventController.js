import Event from "../models/Event.js";

// Подключение к MongoDB
//mongoose.connect('mongodb://localhost:27017/Test', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//});
class PostController 
{
  async createPost(req, res, next) {
    try {
      const { imageUrl, title, content, location } = req.body;
      const event = await Event.create({
        imageUrl: imageUrl,
        title: title,
        content: content,
        location: location,
      });
      return res.status(200).json({ event });
    } catch (err) {
      console.error(err);
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
      const allPosts = await Event.find({});
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
      const eventId = req.params.id;
      const { imageUrl, title, content, location } = req.body;
      const updatedPost = await Event.findByIdAndUpdate(
        eventId,
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
  
      return res.status(200).json({ message: "Post updated successfully", updatedPost });
    } catch (res) {
      console.error(err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }

  async deletePost(req, res, next) {
    try {
      const eventId = req.params.id;
      const result = await Event.deleteOne({ _id: eventId });
  
      if (result.n === 0) {
        return res.status(404).json({ message: "Post not found" });
      }
  
      return res.status(200).json({ message: "Post deleted successfully 🥳" });
    } catch (res) {
      console.log(err);
      res.status(500).json({ message: "Internal server error", error: err });
    }
  }
}

export default new PostController();
