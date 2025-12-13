import express from "express";

const app = express();
const port = 3001;
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static("public"));




app.get("/", (req, res) => {
    res.render("index");
});

app.get("/projects", (req, res) => {
    res.render("projects");
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
  res.status(500).render("error.ejs", {
    title: "Server Error (500)",
    body: "Something went wrong on our end.",
  });
});




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


 