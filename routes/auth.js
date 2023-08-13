const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const Faculty = require("../models/faculty");
const router = express.Router();
const middleware = require("../middleware/validateToken");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password))
      return res
        .status(401)
        .json({ status: "error", error: "missing details" });

    const faculty = await Faculty.findOne({ email: email });
    if (!faculty)
      return res
        .status(401)
        .json({ status: "error", error: "no faculty with given credintails" });
    if (await bcrypt.compare(password, faculty.password)) {
      const token = jwt.sign(
        { id: faculty._id, email: faculty.email },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      return res.status(201).json({ status: "success", accessToken: token });
    }
    return res
      .status(401)
      .json({ status: "error", error: "Invalid Credintials" });
  } catch (error) {
    return res.status(401).json({ status: "error", error: error });
  }
});

router.post("/create", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!(name && email && password)) {
      return res
        .status(401)
        .json({ status: "error", error: "missing details" });
    }
    const duplicatefaculty = await Faculty.findOne({ email: email });
    if (duplicatefaculty)
      return res
        .status(401)
        .json({ status: "error", error: "email already in use" });
    const hashPassword = await bcrypt.hash(password, 10);
    const newfaculty = await faculty.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    if (!newfaculty)
      return res
        .status(401)
        .json({ status: "error", error: "error in creating faculty" });
    const token = await jwt.sign(
      { id: newfaculty._id, email: newfaculty.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(201).json({ status: "success", accessToken: token });
  } catch (error) {
    return res.status(401).json({ status: "error", error: error });
  }
});

function forgotPassword(req, res) {
  const email = req.body.email;
  Faculty.findone({ email }, (err, user) => {
    if (err || !user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }

    const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "15m",
    });

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.GOOGLE_APP_EMAIL,
        pass: process.env.GOOGLE_APP_PW,
      },
    });
    const data = {
      from: "noreply@helloworld.com",
      to: email,
      subject: "Reset Account Password Link",
      html: `
    <h3>Please click the link below to reset your password </h3>
    <p>${process.env.CLIENT_URL}/resetpassword/${token}</p>`,
    };

    return Faculty.updateOne({ resetLink: token }, (err, user) => {
      if (err) {
        return res.status(400).json({ error: "reset Password error" });
      } else {
        transporter.sendMail(data, function (error, body) {
          if (error) {
            return res.status(400).json({ error: error.message });
          }
          return res
            .status(200)
            .json({
              message: "Email has been sent, please follow the instructions",
            });
        });
      }
    });
  });
}

async function updatePassword(req, res) {
  const { token, password } = req.body;
  if (token) {
    jwt.verify(
      token,
      process.env.RESET_PASSWORD_KEY,
      function (error, decodedData) {
        if (error) {
          return res
            .status(400)
            .json({ error: "Incorrect token or it is expired" });
        }
        Faculty.findOne({ resetLink: token }, (err, user) => {
          if (err || !user) {
            return res
              .status(400)
              .json({ error: "User with this token doesnt exist" });
          }
          user.password = password;
          user.save((err, result) => {
            if (err) {
              return res.status(400).json({ error: "Reset Password Error" });
            } else {
              return res
                .status(200)
                .json({ message: "Your Password has been changed" });
            }
          });
        });
      }
    );
  } else {
    return res.status(401).json({ error: "Authentication Error" });
  }
}

module.exports = router;
