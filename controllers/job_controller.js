const Application = require('../models/application.model');
const Job = require('../models/job.model');
const sendMessage = require('../kafka/producer');

exports.applyJob = async (req, res) => {

  const userId = req.user.userId;
  // coming from JWT middleware
  const { jobId } = req.body;
  // Check already applied
  const exist = await Application.findOne({
    userId,
    jobId
  });
  if (exist) {
    return res.status(400).json({ msg: 'Already applied' });
  }
  // Save application
  const newApply = new Application({ userId, jobId });
  await newApply.save();
  // Send Kafka event
  await sendMessage({ event: 'JOB_APPLIED', userId, jobId });
  res.json({ msg: 'Applied successfully' });
};

exports.getAppliedJobs = async (req, res) => {
  const userId = req.user.userId;
  const applied = await Application
    .find({ userId })
    .select('jobId');
  // only fetch jobId
  res.json(applied);
};

exports.createJob = async (req, res) => {
  const userId = req.user.userId;
  console.log("userId", userId);
  const { title, company, location, salary} = req.body;
  const newJob = new Job({ title, company, location, salary, userId });
  await newJob.save();
  res.json({ msg: 'Job created successfully', job: newJob });
}

exports.getJobStats = async (req, res) => {
  const userId = req.user.userId;
  console.log("userId", userId);
  const jobs = await Job.find({ userId });
  console.log(jobs,"jobs");
  res.status(200).send({ msg: 'Job list fetched successfully', job: jobs });
}   
