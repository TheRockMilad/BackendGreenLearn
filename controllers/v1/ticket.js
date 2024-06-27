const departmentsModel = require("./../../models/department");
const departmentsSubModel = require("./../../models/department-sub");
const ticketsModel = require("./../../models/ticket");

exports.create = async (req, res) => {
  const { departmentID, departmentSubID, priority, title, body, course } =
    req.body;

  const ticket = await ticketsModel.create({
    departmentID,
    departmentSubID,
    priority,
    title,
    body,
    course,
    user: req.user._id,
    answer: 0,
    isAnswer: 0,
  });

  const mainTicket = await ticketsModel
    .findOne({ _id: ticket._id })
    .populate("departmentID")
    .populate("departmentSubID")
    .populate("user")
    .lean();

  return res.status(201).json(mainTicket);
};

exports.getAll = async (req, res) => {
  const tickets = await ticketsModel
    .find({ answer: 0 })
    .populate("departmentID", "title")
    .populate("departmentSubID", "title")
    .populate("user", "name")
    .lean();

  return res.json(tickets);
};

exports.userTickets = async (req, res) => {
  const tickets = await ticketsModel
    .find({ user: req.user._id })
    .sort({ _id: -1 })
    .populate("departmentID")
    .populate("departmentSubID")
    .populate("user")
    .lean();

  return res.json(tickets);
};

exports.departments = async (req, res) => {
  const departments = await departmentsModel.find();
  return res.json(departments);
};

exports.departmentsSubs = async (req, res) => {
  const departmentSubs = await departmentsSubModel
    .find({
      parent: req.params.id,
    })
    .lean();

  return res.json(departmentSubs);
};

exports.setAnswer = async (req, res) => {
  const { body, ticketID } = req.body;
  console.log("1111", req.body);

  const ticket = await ticketsModel.findOne({ _id: ticketID }).lean();

  const answer = await ticketsModel.create({
    title: "پاسخ تیکت شما",
    body,
    parent: ticketID,
    priority: ticket.priority,
    user: req.user._id,
    isAnswer: 1,
    answer: 0,
    departmentID: ticket.departmentID,
    departmentSubID: ticket.departmentSubID,
  });

  await ticketsModel.findOneAndUpdate(
    { _id: ticketID },
    {
      answer: 1,
    }
  );

  return res.status(201).json(answer);
};

exports.getAnswer = async (req, res) => {
  const { id } = req.params;
  const ticket = await ticketsModel.findOne({ _id: id });
  const ticketAnswer = await ticketsModel.findOne({ parent: id });

  return res.json({
    ticket,
    ticketAnswer: ticketAnswer ? ticketAnswer : null,
  });
};
