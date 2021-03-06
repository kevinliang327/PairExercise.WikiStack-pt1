const express = require("express");
const morgan = require("morgan");
const methodOverride = require("method-override");
const app = express();

const layout = require("./views/layout.js");
const { db, Page, User } = require("./models");
const wikiRouter = require("./routes/wiki");
const userRouter = require("./routes/users");

app.use(morgan("dev"));
app.use(express.static("/public"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(methodOverride("_method")); // configure methodOverride to look for '_method'

app.get("/", (req, res) => {
  res.redirect("/wiki");
});

app.use("/wiki", wikiRouter);
app.use("/users", userRouter);

db.authenticate().then(() => {
  console.log("connected to the database");
});

const PORT = 3000;

const init = async () => {
  try {
    await db.sync();
    // make sure that you have a PORT constant
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}!`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

init();
