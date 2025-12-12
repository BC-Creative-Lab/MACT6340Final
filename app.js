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


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


 