const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Student = require("../schemas/studentShema");
const jwt = require("jsonwebtoken");
const Question = require("../schemas/questionSchema");
const verifytoken = require("../auth");

//login
router.post("/login", async (req, res) => {
  try {
    const user = await Student.findOne({ email: req.body.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (passwordMatch && user.role === "Student") {
        let token = jwt.sign({ user: user }, "secretKey", {
          expiresIn: "1h",
        });
        res.json({
          token: token,
          user,
        });
      } else {
        res.json({
          error: "Something went wrong",
        });
      }
    } else {
      res.json({ Error: "Student details not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

//get
router.get("/questions", verifytoken, async (req, res) => {
  try {
        if (req.user.user.role == "Student") {
          try {
            const question = await Question.find({ isApproved: true });

            res.json({
              question,
            });
          } catch (err) {
            console.log(err);
          }
        } else {
          res.json({
            message: "Your not authroised to DO this action",
          });
        }
  } catch (err) {
    console.log(err);
  }
});

//getbyID
router.get("/question/:id", verifytoken, async (req, res) => {
  if (req.body._id === req.params.id) {
    try {
          if (req.user.user.role == "Student") {
            try {
              const question = await Question.findOne({
                _id: req.params.id,
                isApproved: true,
              });

              res.json({
                question,
              });
            } catch (err) {
              console.log(err);
            }
          } else {
            res.json({
              message: "Your not authroised to DO this action",
            });
          }
    } catch (err) {
      console.log(err);
    }
  } else {
    res.status(401).json("Nothing found");
  }
});

module.exports = router;
