const express = require("express");
const app = express();
const path = require("path");
const fs = require('node:fs');

app.use(express.json());
app.use(express.urlencoded({extended : true}));

app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Ensure files directory exists
if (!fs.existsSync("./files")) {
    fs.mkdirSync("./files");
}

app.use(function(req, res, next){
    console.log("Yeah its working good!!");
    next();
});


//HOME
// HOME
app.get("/", function(req, res){
    fs.readdir("./files", function(err, files){
        if(err) {
            console.log(err);
            return res.render("index", {notes: [], files: []});
        }

        let notes = [];

        files.forEach(function(file) {
            let data = fs.readFileSync(`./files/${file}`, "utf-8");
            let lines = data.split('\n');
            
            notes.push({
                title: file.replace(/^(.+?)-\d+\.txt$/, '$1') || file,
                description: lines[0] || "",
                date: (lines[1] || "").replace('Date: ', ''),
                filename: file
            });
        });

        res.render("index", {notes, files});
    });
});


// SUBMIT
app.post("/submit", function(req, res){
    const {title, description, date} = req.body;

    let safeTitle = title.replace(/[^a-zA-Z0-9]/g, "");
    let filename = safeTitle + "-" + Date.now() + ".txt";

    fs.writeFile(`./files/${filename}`, `${description}\nDate: ${date}`, function(err){
        if(err) console.log(err);
        else console.log("File created successfully");
    });

    res.redirect("/");
});


// READ
app.get("/read/:filename", function(req, res){
    let file = req.params.filename;

    fs.readFile(`./files/${file}`, "utf-8", function(err, data){
        if(err) console.log(err);
        else {
            let lines = data.split('\n');
            let description = lines[0] || "";
            let dateStr = lines[1] ? lines[1].replace('Date: ', '') : "";
            let titleFromFile = file.split('-').slice(0, -1).join('-') || file.replace('.txt', '');
            
            res.render("read", {data, file, title: titleFromFile, description, date: dateStr});
        }
    });
});


// DELETE
app.post("/delete/:filename", function(req, res){
    let file = req.params.filename;

    fs.unlink(`./files/${file}`, function(err){
        if(err) {
            console.log(err);
            res.status(500).send("Error deleting file");
        }
        else {
            console.log("File deleted successfully");
            res.redirect("/");
        }
    });
});


// UPDATE
app.post("/update/:filename", function(req, res){
    let file = req.params.filename;
    const {title, description, date} = req.body;

    fs.unlink(`./files/${file}`, function(err){
        if(err) {
            console.log(err);
        } else {
            let safeTitle = title.replace(/[^a-zA-Z0-9]/g, "");
            let newFilename = safeTitle + "-" + Date.now() + ".txt";

            fs.writeFile(`./files/${newFilename}`, `${description}\nDate: ${date}`, function(err){
                if(err) console.log(err);
                else console.log("File updated successfully");
            });
        }
    });

    res.redirect("/");
});


app.listen(3000);