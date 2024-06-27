const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (_, res) => {
  res.json({ title: 'Task1' });
});

module.exports = router;
