const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const nodemailer = require("nodemailer");
const Faculty = require("../models/faculty");
const router = express.Router();

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

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    //console.log(name, email, password)
    if (!(name && email && password)) {
      return res
        .status(401)
        .json({ status: "error", error: "missing details" });
    }
    const duplicatefaculty = await Faculty.findOne({ email: email });
    //console.log(duplicatefaculty)
    if (duplicatefaculty)
      return res
        .status(401)
        .json({ status: "error", error: "email already in use" });
    const hashPassword = await bcrypt.hash(password, 10);
    const newfaculty = await Faculty.create({
      name: name,
      email: email,
      password: hashPassword,
    });
    console.log(newfaculty);
    if (!newfaculty)
      return res
        .status(401)
        .json({ status: "error", error: "error in creating faculty" });
    const token = await jwt.sign(
      { id: newfaculty._id, email: newfaculty.email },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    //console.log(newfaculty)

    return res.status(201).json({ status: "success", accessToken: token });
  } catch (error) {
    return res.status(401).json({ status: "error", error: error });
  }
});

router.get("/forgotPassword", async (req, res) => {
  const email = req.body.email;
  console.log(email);
  if (!email) return res.status(400).json({ error: "Enter ur Email Id..." });
  const user = await Faculty.findOne({ email });
  console.log(user);
  if (!user)
    return res
      .status(400)
      .json({ error: "User with given Email doesnt exist..." });

  const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_KEY, {
    expiresIn: "15m",
  });

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "helplineiiitdmk@gmail.com",
      pass: "iiitdmk@123",
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
  const updatedFaculty = await Faculty.updateOne({ resetLink: token });
  if (!updatedFaculty)
    return res.status(400).json({ error: "reset Password error" });
  //transporter.sendMail()
  transporter.sendMail(data, (error, body) => {
    if (error) return res.status(400).json({ error: error.message });
    return res.status(200).json({
      message: "Email has been sent, please follow the instructions",
    });
  });
});

router.post("/updatePassword", async (req, res) => {
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
});

module.exports = router;
