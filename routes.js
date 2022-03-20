const express = require('express');
const router = express.Router();
const scraper = require('./app/services/scraper');

router.get('/', scraper.scrape);
router.post('/submit-url', scraper.scrape);

module.exports = router;