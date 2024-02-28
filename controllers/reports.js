const Report = require('../models/report');
const Orders = require('../models/order');
const Expenses = require('../models/expenses');
const Start = require('../models/start');
const moment = require('moment-timezone');

exports.getDashboardData = (req, res) => {
  if (req.method !== 'GET') return res.status(401).json({ message: 'Invalid method' });

  const filterBy = req.query.filterBy;
  const filterValue = req.query.filterValue;

  const getStartDate = () => {
    let startDate;
    if (filterBy === 'year') startDate = moment.tz(`${filterValue}-01-01`, 'Asia/Manila').startOf('year');
    if (filterBy === 'quarter') {
      let filter = filterValue.split('_');
      let quarter = filter[0];
      let year = filter[1];
      if (quarter === 'Q1') startDate = moment.tz(`${year}-01-01`, 'Asia/Manila').startOf('quarter');
      if (quarter === 'Q2') startDate = moment.tz(`${year}-04-01`, 'Asia/Manila').startOf('quarter');
      if (quarter === 'Q3') startDate = moment.tz(`${year}-07-01`, 'Asia/Manila').startOf('quarter');
      if (quarter === 'Q4') startDate = moment.tz(`${year}-10-01`, 'Asia/Manila').startOf('quarter');
    }
    if (filterBy === 'month') {
      let filter = filterValue.split('_');
      let month = filter[0];
      let year = filter[1];
      startDate = moment.tz({ year, month }, 'Asia/Manila').startOf('month');
    }

    return startDate;
  };

  const getEndDate = () => {
    let endDate;
    if (filterBy === 'year') endDate = moment.tz(`${filterValue}-01-01`, 'Asia/Manila').endOf('year');
    if (filterBy === 'quarter') {
      let filter = filterValue.split('_');
      let quarter = filter[0];
      let year = filter[1];
      if (quarter === 'Q1') endDate = moment.tz(`${year}-01-01`, 'Asia/Manila').endOf('quarter');
      if (quarter === 'Q2') endDate = moment.tz(`${year}-04-01`, 'Asia/Manila').endOf('quarter');
      if (quarter === 'Q3') endDate = moment.tz(`${year}-07-01`, 'Asia/Manila').endOf('quarter');
      if (quarter === 'Q4') endDate = moment.tz(`${year}-10-01`, 'Asia/Manila').endOf('quarter');
    }
    if (filterBy === 'month') {
      let filter = filterValue.split('_');
      let month = filter[0];
      let year = filter[1];
      endDate = moment.tz({ year, month }, 'Asia/Manila').endOf('month');
    }
    return endDate;
  };

  Report.find({
    date: {
      $gte: getStartDate(),
      $lt: getEndDate(),
    },
  })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(400).json({ status: 'Failed', message: error.message, error }));
};

exports.getDailyReportData = (req, res) => {
  if (req.method !== 'GET') return res.status(401).json({ message: 'Invalid method' });

  let start = moment.tz(req.query.date, 'Asia/Manila').startOf('day');
  let end = moment.tz(req.query.date, 'Asia/Manila').endOf('day');

  const salesListRequest = Orders.find({
    $or: [{ downPaymentDate: { $gte: start, $lt: end } }, { paymentDate: { $gte: start, $lt: end } }],
  });

  const expenseListRequest = Expenses.find({ expenseDate: { $gte: start, $lt: end } });

  Promise.all([salesListRequest, expenseListRequest])
    .then(([salesList, expenseList]) => {
      return res.status(200).json({ success: true, data: { salesList, expenseList } });
    })
    .catch((error) => {
      return res.status(500).json({ success: false, error });
    });
};

exports.getMonthStartValue = (req, res) => {
  if (req.method !== 'GET') return res.status(401).json({ message: 'Invalid method' });

  Start.find({ date: req.query.date })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getMonthlyReport = (req, res) => {
  if (req.method !== 'GET') return res.status(401).json({ message: 'Invalid method' });

  Report.find({
    date: {
      $gte: moment.tz(req.query.date, 'Asia/Manila').startOf('month'),
      $lt: moment.tz(req.query.date, 'Asia/Manila').endOf('month'),
    },
  })
    .then((data) => res.status(200).json({ data }))
    .catch((error) => res.status(400).json({ error }));
};
