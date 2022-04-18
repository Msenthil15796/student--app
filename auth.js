const jwt = require("jsonwebtoken");

function verifytoken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if (bearerHeader !== "undefined") {
    const token = bearerHeader.split(" ")[1];

    jwt.verify(token, "secretKey", async (err, user) => {
      if (err) {
        console.log(err);
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "jwt err" });
  }
}

module.exports = verifytoken;
