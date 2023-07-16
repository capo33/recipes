import path from "path";
import multer from "multer";
import express from "express";

const router = express.Router();

 
// Set Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/')
  },
  // we describe how we want the filename to be formatted
  filename: (req, file, cb) => {
    console.log(file);
    //extname = extension name of the file (e.g. .jpg, .png, .pdf)
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path?.extname(file.originalname)}`
    );
  },
});

// Check File Type
const checkFileType = (file, cb) => {
  // Allowed extensions
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    // cb = callback
    cb("Error: Images Only!");
  }
};

// Init Upload
const upload = multer({
  storage,
  limits: { fileSize: 1000000 }, // 1MB
  fileFilter: (req, file, cb) => {
    checkFileType(file, cb);
  },
});

// @route POST /upload
// @desc Uploads file to DB
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image Uploaded Successfully",
    image: `/${req.file.path.replace(/\\/g, "/")}`,
  });
});

export default router;
