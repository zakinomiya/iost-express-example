'use strict'
const IOST = require('iost')
const bs58 = require('bs58')
const RPCURL = process.env.RPCURL
const CHAINID = process.env.CHAINID

console.log(RPCURL, CHAINID)

module.exports = class Blockchain {
  constructor() {
    this.iost = new IOST.IOST({
      gasRatio: 1,
      delay: 0,
      expiration: 90,
      defaultLimit: 'unlimited',
    })
    this.rpc = new IOST.RPC(new IOST.HTTPProvider(RPCURL))
    this.iost.setRPC(this.rpc)
  }

  setAccount = (accountName, secKey) => {
    const account = new IOST.Account(accountName)
    const sec = bs58.decode(secKey)
    const kp = new IOST.KeyPair(sec)

    account.addKeyPair(kp, 'owner')
    account.addKeyPair(kp, 'active')
    this.iost.setAccount(account)
  }

  sendTransaction = transaction => {
    transaction.setChainID(CHAINID)
    transaction.addApprove('iost', 10000)
    let txId = ''
    return new Promise((resolve, reject) => {
      this.iost
        .signAndSend(transaction)
        .on('pending', res => {
          console.info('transaction id is : ', res)
          txId = res
        })
        .on('success', res => {
          console.info('transaction succeeded : ', res)
          res.txId = txId
          return resolve(res)
        })
        .on('failed', err => {
          console.info('transaction failed : ', err)
          return reject(err)
        })
    })
  }
}