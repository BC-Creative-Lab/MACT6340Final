import express from "express";
const app = express();
const port = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
    res.send("Hello World");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

document.addEventListener("DOMContentLoaded", function () {
    const currentPage = window.location.pathname.split("/").pop(); 
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach(link => {
        const linkPage = link.getAttribute("href");
        if (linkPage === currentPage) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
});
