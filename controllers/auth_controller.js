const express = require('express');
const User = require('../models/user.model.js');
const Job = require('../models/job.model.js');
const sendMessage = require('../kafka/producer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { email, password } = req.body
  //check user exist 
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).send("User already exists.")
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();
  // 2. Send Kafka event
  await sendMessage({
    event: 'USER_REGISTER',
    email: email
  });
  // 3. Send response
  res.json({ status: 200, msg: 'Registered successfully', role: req.body.role });
}

exports.login = async (req, res) => {
  const { email, password } = req.body
  //check user exist 
  const existingUser = await User.findOne({ email });
  console.log(existingUser, "existingUser")
  if (!existingUser) {
    return res.status(400).json({ msg: 'Invalid email' });
  }
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(400).json({ msg: 'Invalid password' });
  }
  let user_token = await generatetoken(existingUser);
  res.json({
    msg: 'Login success',
    token: user_token,
    role: existingUser.role,
    userId: existingUser._id
  });
}
exports.getDashboard = async (req, res) => {
  // userId from middleware
  const userId = req.user.userId;
  // fetch jobs
  const jobs = await Job.find().limit(10);
  res.json({ userId,totalJobs: jobs.length,jobs});
};

exports.seedJobs = async (req, res) => {
  const sampleJobs = [
    { title: 'Software Engineer', company: 'Tech Corp', location: 'New York' },
    { title: 'Data Analyst', company: 'Data Inc', location: 'San Francisco' },
    { title: 'Product Manager', company: 'Business Solutions', location: 'Chicago' }
  ];
  await Job.insertMany(sampleJobs);
  res.json({ msg: 'Sample jobs seeded' });
}
async function generatetoken(user) {
  console.log(user.role ,"user.role ")
  const token = jwt.sign({ userId: user._id, role: "admin" },   // payload
    process.env.JWT_SECRET,
    { expiresIn: '1d' });
  return token;
} 