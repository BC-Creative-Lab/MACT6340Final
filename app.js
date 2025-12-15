import express from "express";
import * as utils from "./utils/utils.js";
import * as db from "./utils/database.js";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";

let projects = [];

const app = express();
app.use(cors());
const port = 3001;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));

await db.connect();



app.get("/", async (req, res, next) => {
  try {
    // TEMPORARY: no real DB logic yet
    // This lets the splash + page render without crashing

    let featuredProject = null;
    let homeProjects = [];

    try {
      await db.connect();
      const projects = await db.getAllProjects();

      featuredProject = projects[0] ?? null;
      homeProjects = projects.slice(1, 4);
    } catch (dbErr) {
      console.log("DB not ready yet, rendering homepage without projects");
    }

    res.render("index", { featuredProject, homeProjects });
  } catch (err) {
    next(err);
  }
});


app.get("/projects", async (req, res, next) => {
  try {
    await db.connect();
    const projectArray = await db.getAllPublishedProjects();
    res.render("projects", { projectArray });
  } catch (err) {
    next(err);
  }
});



app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// if no routes matched, show 404 page
app.use((req, res) => {
  res.status(404).render("404");
});

// general error handling
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).render("404");
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


 