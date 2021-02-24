const express = require('express')
const Company = require('../../models/company')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const auth = require('../../middleaware/auth')

router.get('/', async(req, res, next)=> {
  try{
    const user = await Company.find({})
    res.json(user)
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

router.get('/:userId', [], async (req, res, next) => {
  try {
    const id = req.params.userId
    const user = await Company.findOne({_id : id})
    if (user) {
      res.json(user)
    } else {
      res.status(404).send({ "error": "user not found" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})

router.delete('/:userId', async(req, res, next) => {
  try {
    const id = req.params.userId
    const user = await Company.findOneAndDelete({_id : id})
    if (user) {
      res.json(user)
    } else {
      res.status(404).send({ "error": "user not found" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})

router.patch('/:userId', [
  check('storename', 'please inform the storename of the car.').not().isEmpty(),
  check('fakename', 'fakename is not valid').not().isEmpty(),
  check('legalowner', 'Please inform the legalowner of the car').not().isEmpty(),
  check('adress', 'Please insert a adress').not().isEmpty(),
  check('telnumber', 'Please inform the date you were born').not().isEmpty(),
  check('storemail', 'Please insert a storemail').isEmail(),
], async (request, res, next) => {
  try {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() })
      return
    }
    const id = request.params.userId 
    let bodyRequest = request.body
    const update = { $set: bodyRequest }
    const user = await Company.findByIdAndUpdate(id, update, { new: true })
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ error: "Company doesn't exist" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})

router.post('/', [
  check('storename', 'please inform your Full Name.').not().isEmpty(),
  check('fakename', 'fakename is not valid').not().isEmpty(),
  check('legalowner', 'Please inform your legalowner').not().isEmpty(),
  check('adress', 'Please insert a adress').not().isEmpty(),
  check('telnumber', 'Please inform the date you were born').not().isEmpty(),
  check('storemail', 'Please insert a storemail').isEmail(),
], async (req, res, next) => {
  try {
    let { storename, fakename, legalowner, adress, telnumber, storemail, date } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      let user = new Company({ storename, fakename, legalowner, adress, telnumber, storemail, date })
      await user.save()
      if (user.id) {
        res.json(user);
      }
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})

module.exports = router