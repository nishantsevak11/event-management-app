const express = require("express");
const Event = require("../models/Event");
const jwt = require("jsonwebtoken");
const { getIO } = require("../socket"); 
const moment = require("moment");  

const router = express.Router();

// Middleware to check authentication
const authenticate = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ message: "Access Denied, No Token Provided" });
  }

  try {
    const tokenParts = token.split(" ");
    const actualToken = tokenParts.length === 2 ? tokenParts[1] : token;

    const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Token" });
  }
};

//  Create an Event 
router.post("/create", authenticate, async (req, res) => {
  const { name, description, date, time, location,category  } = req.body;


  if (!category) {
    return res.status(400).json({ message: "Category is required!" });
  }

  try {
    const event = new Event({
      name,
      description,
      date,
      time,
      location,
      category,
      createdBy: req.user.userId,
    });
    await event.save();

    const io = getIO(); 
    io.emit("new_event", event); 

    res.json(event);
  } catch (error) {
    console.error("Event Creation Error:", error);
    res.status(500).json({ message: "Error creating event" });
  }
});




// Get Events 
router.get("/", async (req, res) => {
  try {
    const { category, dateFilter, filterType } = req.query;
    let filter = {};
    const today = moment().startOf("day").toDate();  


    if (category) filter.category = category;

    
    if (filterType === "upcoming") {
      filter.date = { $gte: today };  

      if (dateFilter === "today") {
        filter.date = { 
          $gte: today, 
          $lt: moment(today).endOf("day").toDate() 
        };
      } else if (dateFilter === "week") {
        filter.date = { 
          $gte: today, 
          $lt: moment(today).add(7, "days").toDate() 
        };
      } else if (dateFilter === "month") {
        filter.date = { 
          $gte: moment(today).startOf("month").toDate(), 
          $lt: moment(today).endOf("month").toDate() 
        };
      } else if (dateFilter === "year") {
        filter.date = { 
          $gte: moment(today).startOf("year").toDate(), 
          $lt: moment(today).endOf("year").toDate() 
        };
      }
    }


    if (filterType === "past") {
      filter.date = { $lt: today }; 
    }

    const events = await Event.find(filter).populate("createdBy", "_id name");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: "Error fetching events" });
  }
});










router.put('/:id', authenticate, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.assign(event, req.body);
        await event.save();

        const io = getIO();
        io.emit('event_updated', event);  

        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error updating event' });
    }
});


router.delete('/:id', authenticate, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.createdBy.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await event.deleteOne();

        const io = getIO();
        io.emit('event_deleted', { eventId: req.params.id });  

        res.json({ message: 'Event deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting event' });
    }
});

router.post('/join/:id', authenticate, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) return res.status(404).json({ message: 'Event not found' });

       
        if (event.attendeeList.includes(req.user.userId)) {
            return res.status(400).json({ message: 'You have already joined this event!' });
        }

        event.attendeeList.push(req.user.userId); 
        event.attendees += 1; 
        await event.save();

        const io = getIO();
        io.emit('attendee_joined', event); 

        res.json({ message: 'You joined the event!', event });
    } catch (error) {
        res.status(500).json({ message: 'Error joining event' });
    }
});


//  Middleware to Prevent Guests from Certain Actions
const blockGuest = (req, res, next) => {
  if (req.user.userId === "guest") {
      return res.status(403).json({ message: "Guests cannot perform this action" });
  }
  next();
};

//  Prevent Guests from Creating Events
router.post('/create', authenticate, blockGuest, async (req, res) => {
  const { name, description, date, time, location } = req.body;

  try {
      const event = new Event({ 
          name, 
          description, 
          date, 
          time, 
          location, 
          createdBy: req.user.userId 
      });
      await event.save();

      const io = getIO();
      io.emit('new_event', event);  

      res.json(event);
  } catch (error) {
      res.status(500).json({ message: 'Error creating event' });
  }
});

//  Prevent Guests from Joining Events
router.post('/join/:id', authenticate, blockGuest, async (req, res) => {
  try {
      const event = await Event.findById(req.params.id);

      if (!event) return res.status(404).json({ message: 'Event not found' });

      if (event.attendeeList.includes(req.user.userId)) {
          return res.status(400).json({ message: 'You have already joined this event!' });
      }

      event.attendeeList.push(req.user.userId);
      event.attendees += 1;
      await event.save();

      const io = getIO();
      io.emit('attendee_joined', event);

      res.json({ message: 'You joined the event!', event });
  } catch (error) {
      res.status(500).json({ message: 'Error joining event' });
  }
});


module.exports = router;
