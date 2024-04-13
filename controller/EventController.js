import Event from "../models/Event.js";

// Подключение к MongoDB
//mongoose.connect('mongodb://localhost:27017/Test', {
//  useNewUrlParser: true,
//  useUnifiedTopology: true,
//});
class EventController 
{
  async createEvent(req, res, next) {
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
      return res.status(400).json({ message: "Error when create event", error: err });
    }
  }
  
  async readOneEvent(req, res, next) {
    try {
      const eventId = req.params.id ;
      const post = await Event.findById(eventId);;
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      return res.status(200).json({post});
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error fetching posts", error: err });
    }
  }
  
  async readAllEvents(req, res, next)
  {
    try {
      const allPosts = await Event.find({});
      if(!allPosts) 
      { 
        return res.status(400).json("Error fetching posts")
      }
      return res.status(200).json({allPosts});
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error fetching posts", error: err });
    }
  }
  async updateEvent(req, res, next) {
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
    } catch (err) {
      console.error(err);
      return res.status(400).json({ message: "Error when update event", error: err });
    }
  }

  async deleteEvent(req, res, next) {
    try {
      const eventId = req.params.id;
      const result = await Event.findById(eventId);
  
      if (!result) {
        return res.status(404).json({ message: "Post not found" });
      }
      await Event.deleteOne({_id:eventId})
      return res.status(200).json({ message: "Post deleted successfully 🥳" });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Error when deleted event", error: err });
    }
  }
}

export default new EventController();
