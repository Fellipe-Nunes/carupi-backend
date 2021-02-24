const express = require('express')
const User = require('../../models/user')
const Company = require('../../models/company')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const bcrypt = require('bcryptjs')
const auth = require('../../middleaware/auth')

router.get('/',auth, async(req, res, next)=> {
  try{
    const user = await User.find({})
    res.json(user)
  }catch(err){
    console.error(err.message)
    res.status(500).send({"error" : "Server Error"})
  }
})

router.get('/:userId', [], async (req, res, next) => {
  try {
    const id = req.params.userId
    const user = await User.findOne({_id : id})
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
    const user = await User.findOneAndDelete({_id : id})
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

router.patch('/:userId', auth, async (request, res, next) => {
  try {
    const errors = validationResult(request)
    if (!errors.isEmpty()) {
      res.status(400).send({ errors: errors.array() })
      return
    }
    const id = request.params.userId
    const salt = await bcrypt.genSalt(10)
    
    let bodyRequest = request.body

    if(bodyRequest.password){
      bodyRequest.password = await bcrypt.hash(bodyRequest.password, salt)
    }
    const update = { $set: bodyRequest }
    const user = await User.findByIdAndUpdate(id, update, { new: true })
    if (user) {
      res.send(user)
    } else {
      res.status(404).send({ "error": MSGS.USER404 })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})


router.post('/', [
  check('fullname', 'please inform your Full Name.').not().isEmpty(),
  check('email', 'email is not valid').isEmail(),
  check('username', 'Please inform your username').not().isEmpty(),
  check('password', 'Please insert a password').not().isEmpty(),
  check('birthdate', 'Please inform the date you were born').not().isEmpty(),
], async (req, res, next) => {
  try {
    let { fullname, email, username, password, company, birthdate, is_admin, is_active, date } = req.body

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      let company_model = await Company.findOne({ _id: company })
      if (company_model) {
          await User.findOne({ company: company_model.id })
          let user = new User({ fullname, email, username, password, company, birthdate, is_admin, is_active, date })
          await user.save()
          if (user.id) {
            res.json(user);
          }
      }
      else {
        res.status(404).send({ "error": "user not found" })
      }

    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Error" })
  }
})

module.exports = router