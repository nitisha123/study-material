const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");

const users = require("./routes/api/users");
const lessons = require("./routes/api/lessons");
const words = require("./routes/api/words");

const app = express();

// Bodyparser middleware
app.use(
    bodyParser.urlencoded({
      extended: false
    })
  );

app.use(bodyParser.json());

const dbURL =  "mongodb://localhost:27017/study-material";

//connect to MongoDB
mongoose
    .connect(process.env.MONGODB_URI || dbURL,
    { useUnifiedTopology:true, useNewUrlParser: true }
    )
    .then(() => console.log("MongoDB successfully connected"))
    .catch(err => console.log(err));

// Routes
app.use("/api/users", users);
app.use("/api/lessons", lessons);
app.use("/api/words", words);

app.use('/public', express.static(path.join(__dirname, "./public")));


const port = 4000;

app.listen(port,()=>console.log(`Server up and running on port ${port}`));