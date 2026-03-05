const express = require("express");
const { registerStudent, getAllStudents, getSingleStudent, updateStudent, deleteStudent } = require("../controllers/userController");
const upload = require("../middleware/uploadMiddleware");
const multer = require("multer");

const router = express.Router();

// router.post(
//     "/register",
//     upload.single("face"),
//     registerStudent
// );
router.post("/register", (req, res, next) => {
    upload.single("face")(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({ success: false, message: err.message });
        } else if (err) {
            return res.status(400).json({ success: false, message: err.message });
        }
        next();
    });
}, registerStudent);
router.get("/all", getAllStudents);
router.get("/single/:id", getSingleStudent);
router.put("/update/:id", upload.single("face"), updateStudent);
router.delete("/delete/:id", deleteStudent);


module.exports = router;