const express = require('express')
const Cars = require('../../models/cars')
const Company = require('../../models/company')
const { check, validationResult } = require('express-validator')
const router = express.Router()
const auth = require('../../middleaware/auth')
const file = require('../../middleaware/file')
const MSGS = require('../../messages')
const config = require('config')
const company = require('../../models/company')

router.get('/',async (req, res, next) => {
  try {
    let varcar = await Cars.find(req.query).populate('company')
    const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
    varcar = varcar.map(function(cars) {
      cars.photo = `${BUCKET_PUBLIC_PATH}${cars.photo}`
      return cars
    })
    res.json(varcar)
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})

router.get('/:userId', [], async (req, res, next) => {
  try {
    const id = req.params.userId
    const user = await Cars.findOne({_id : id})
    if (user) {
      res.json(user)
    } else {
      res.status(404).send({ "error": "user not found" })
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": "Server Errorr" })
  }
})

router.delete('/:userId', async(req, res, next) => {
  try {
    const id = req.params.userId
    const user = await Cars.findOneAndDelete({_id : id})
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

router.patch('/:userId', auth, file, async (req, res, next) => {
  try {
      req.body.last_modified_by = req.user.id
      if(req.body.photo_name){
        req.body.photo = `cars/${req.body.photo_name}`
      }
      const zzz = await Cars.findByIdAndUpdate(req.params.userId, { $set: req.body }, { new: true })
      if(zzz){
          res.json(zzz)
      }else{
          res.status(404).send({ "error": MSGS.PRODUCT404 }) 
      }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})

router.post('/', [
  check('brand', 'please inform your Full Name.').not().isEmpty(),
  check('carmodel', 'carmodel is not valid').not().isEmpty(),
  check('year', 'Please inform your year').not().isEmpty(),
  check('chassis', 'Please insert a chassis').not().isEmpty(),
  check('carstatus', 'Please inform the date you were born').not().isEmpty(),
  check('carplate', 'Please insert a carplate').not().isEmpty(),
  check('color', 'Please insert a color').not().isEmpty(),
  check('fueltype', 'Please insert a fueltype').not().isEmpty(),
  check('location', 'Please insert a location').not().isEmpty(),
], auth, file, async (req, res, next) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    } else {
      req.body.photo = `cars/${req.body.photo_name}`
      let company_model = Company.findOne({ _id: company })
      Cars.findOne({ location: company_model.id })
      let cars = new Cars(req.body)
      cars.last_modified_by = req.user.id
      await cars.save()
      if (cars.id) {
        const BUCKET_PUBLIC_PATH = process.env.BUCKET_PUBLIC_PATH || config.get('BUCKET_PUBLIC_PATH')
        cars.photo = `${BUCKET_PUBLIC_PATH}${cars.photo}`
        res.json(cars)
      }
    }
  } catch (err) {
    console.error(err.message)
    res.status(500).send({ "error": MSGS.GENERIC_ERROR })
  }
})

module.exports = router