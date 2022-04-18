const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Admin = require("../schemas/adminSchema");
const verifytoken = require("../auth");
const jwt = require("jsonwebtoken");
const Question = require("../schemas/questionSchema");

router.post("/register", async (req, res) => {
  try {
    const checkEmail = await Admin.findOne({ email: req.body.email });
    if (!checkEmail) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userData = {
          id: req.body.id,
          name: req.body.name,
          password: hashedPassword,
          email: req.body.email,
          role: "Admin",
        };
        const user = await Admin.create(userData);

        res.json({
          data: user,
          message: "You are registered as Admin",
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      res.json({ error: "User already exists" });
      throw new Error("User already exists");
    }
  } catch (err) {
    console.log(err);
  }
});

//login
router.post("/login", async (req, res) => {
  try {
    const user = await Admin.findOne({ email: req.body.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (passwordMatch && user.role === "Admin") {
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
    }
  } catch (err) {
    console.log(err);
  }
});

//getall
router.get("/questions", verifytoken, async (req, res) => {
  try {
    if (req.user.user.role == "Admin") {
      try {
        const question = await Question.find({});

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
          if (req.user.user.role == "Admin") {
            try {
              const question = await Question.findById(req.params.id);

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

//addQuestions
router.post("/addQuestions", verifytoken, async (req, res) => {
  try {
        if (req.user.user.role == "Admin") {
          try {
            const questionData = {
              id: req.body.id,
              question: req.body.question,
              choices: [...req.body.choices],
              marks: req.body.marks,
              isApproved: true,
            };
            const question = await Question.create(questionData);

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

//approve questions
router.put("/approveQuestion/:id", verifytoken, async (req, res) => {
  if (req.body._id === req.params.id) {
    try {
          if (req.user.user.role == "Admin") {
            try {
              const approvedquestion = await Question.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
              );

              res.json({
                approvedquestion,
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

//update
router.patch("/editQuestion/:id", verifytoken, async (req, res) => {
  if (req.body._id === req.params.id) {
    try {
          if (req.user.user.role == "Admin") {
            try {
              const questionData = {
                id: req.body.id,
                question: req.body.question,
                choices: [...req.body.choices],
                marks: req.body.marks,
              };
              const question = await Question.findByIdAndUpdate(
                req.params.id,
                questionData,
                { new: true }
              );

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

//delete
router.delete("/deleteQuestion/:id", verifytoken, async (req, res) => {
  if (req.body._id === req.params.id) {
    try {
          if (req.user.user.role == "Admin") {
            try {
              const question = await Question.findByIdAndDelete(req.params.id);

              res.json({
                question,
                Message: "Question deleted",
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
