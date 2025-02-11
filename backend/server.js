const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const { initSocket } = require("./socket"); 

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());


const io = initSocket(server); 



// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log(" MongoDB Connected"))
  .catch((err) => console.error(err));




const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/event");

app.use("/auth", authRoutes);
app.use("/events", eventRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
