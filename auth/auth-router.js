const router = require("express").Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { jwtSecret, hashRounds } = require("../config/secrets");

const Users = require("../users/users-model");

router.post("/register", (req, res) => {
  let credentials = req.body;
  const hash = bcrypt.hashSync(credentials.password, hashRounds);
  credentials.password = hash;
  Users.add(credentials)
    .then((newUser) => {
      const token = generateToken(newUser);
      res.status(201).json({ newUser, token });
    })
    .catch((err) => {
      res.status(500).json({ message: "Error adding user" });
    });
});

router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then((user) => {
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);
        res.status(200).json({ message: `Welcome ${user.username}`, token });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: "Error logging in" });
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username
  };
  const options = {
    expiresIn: "1d"
  };

  return jwt.sign(payload, jwtSecret, options);
}

module.exports = router;
