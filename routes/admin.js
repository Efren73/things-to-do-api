var express = require('express');
var router = express.Router();

const admin = require ('firebase-admin')
const db = require('../firebase')
/* GET users listing. */
router.get('/', async function(req, res, next) {
  const cityRef = db.collection('ADMIN').doc('0OpGAjITYggUgCDnA9BZ');
  const doc = await cityRef.get();
  if (!doc.exists) {
    console.log('No such document!');
  } else {
    console.log('Document data:', doc.data());
  }
res.send('respond with a resource');
});


module.exports = router;