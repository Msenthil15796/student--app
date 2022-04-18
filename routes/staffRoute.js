const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Staff = require("../schemas/staffSchema");
const Question = require("../schemas/questionSchema");
const Student = require('../schemas/studentShema');
const jwt = require("jsonwebtoken");
const verifytoken = require("../auth");

//register
router.post("/register", async (req, res) => {
  try {
    const checkEmail = await Staff.findOne({ email: req.body.email });
    if (!checkEmail) {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        const userData = {
          id: req.body.id,
          name: req.body.name,
          password: hashedPassword,
          email: req.body.email,
          role: "Staff",
        };
        const user = await Staff.create(userData);

        res.json({
          data: user,
          message: "You are registered as Staff",
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
    const user = await Staff.findOne({ email: req.body.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (passwordMatch && user.role === "Staff") {
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

//get
router.get("/questions", verifytoken, async (req, res) => {
  try {
        if (req.user.user.role == "Staff") {
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
          if (req.user.user.role == "Staff") {
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
        if (req.user.user.role == "Staff") {
          try {
            const questionData = {
              id: req.body.id,
              question: req.body.question,
              choices: [...req.body.choices],
              marks: req.body.marks,
              isApproved:false,
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

//update
router.patch("/editQuestion/:id", verifytoken, async (req, res) => {
  if (req.body._id === req.params.id) {
    try {
          if (req.user.user.role == "Staff") {
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
          if (req.user.user.role == "Staff") {
            try {
              const question = await Question.findByIdAndDelete(req.params.id);

              res.json({
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

//=================================ADD STUDENT============================================//
router.post("/addStudent", verifytoken ,async (req, res) => {
      if (req.user.user.role == "Staff") {
        try {
          const checkEmail = await Student.findOne({
            email: req.body.email,
          });
          if (!checkEmail) {
            try {
              const hashedPassword = await bcrypt.hash(req.body.password, 10);

              const studentData = {
                id: req.body.id,
                name: req.body.name,
                password: hashedPassword,
                email: req.body.email,
                role: "Student",
              };
              const student = await Student.create(studentData);

              res.json({
                data: student,
                message: `New Student added: ${student.name}`,
              });
            } catch (err) {
              console.log(err);
            }
          } else {
            res.json({ error: "Student details already exists" });
            throw new Error("Student details already exists");
          }
        } catch (err) {
          console.log(err);
        }
      } else {
        res.json({
          message: "Your not authroised to DO this action",
        });
      }
});
module.exports = router;
