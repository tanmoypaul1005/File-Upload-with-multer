const express = require('express')
const app = express();
const multer = require('multer');
const path = require('path');
const port = 3000;

//File Upload Folder
const UPLOADS_FOLDER = "./uploads/"


//define the storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_FOLDER)
    },
    filename: (req, file, cb) => {
        const fileExt = path.extname(file.originalname);
        fileName = file.originalname.replace(fileExt, "").toLowerCase().split(" ").join("-") + "-" + Date.now();
        cb(null, fileName + fileExt)

    }
})


//preapre the final multer upload object
let upload = multer({
    storage: storage,
    limits: {
        fileSize: 10000000000000,
    },
    fileFilter: (req, file, cb) => {
        if (file.fieldname === "avatar") {
            if (
                file.mimetype === "image/png" ||
                file.mimetype === "image/jpg" ||
                file.mimetype === "image/jpeg"
            ) {
                cb(null, true)
            } else {
                cb(new Error("only jpg png or jpeg format allowed!"));
            }
        } else if (file.fieldname === "doc") {
            if (file.mimetype === "application/pdf") {
                cb(null, true)
            } else { cb(new Error("Only pdf Format Allowed!")) }
        } else { cb(new Error("There was an unknown error!")) }


    }
});

//multifal file
app.post('/', upload.fields([
    { "name": "avatar", maxCount: 1 },
    { "name": "doc", maxCount: 2 }
]), (req, res) => {
    res.send('Hello World!');
})

// app.post('/', upload.single("avatar"), (req, res) => {
//     res.send('Hello World!');
// });

app.use((err, req, res, next) => {
    if (err) {
        if (err instanceof multer.MulterError) {
            res.status(500).send("There was a upload Error")
        } else { res.status(500).send(err.message); }
    } else { res.send("Success"); }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})