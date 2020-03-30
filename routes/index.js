const express = require('express');
const router = express.Router();
const Blockchain = require('../util/blockchain')

router.post('/', async (req, res, next) => {
  const { account, pubKey } = req.body
  const bc = new Blockchain()
  bc.setAccount('admin', '2yquS3ySrGWPEKywCPzX4RTJugqRh7kJSo5aehsLYPEWkUxBWA39oMrZ7ZxuM4fgyXYs2cPwh5n8aNNpH5x2VyK1')
  const transaction = bc.iost.newAccount(
    account,
    'admin',
    pubKey,
    pubKey,
    1000,
    1000
  )

  const result = await bc
    .sendTransaction(transaction)
    .catch(async err => {
      console.log(err)
      throw err
    })

  res.send(result)
});

module.exports = router;
