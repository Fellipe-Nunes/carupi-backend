const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')


// @route    POST /auth
// @desc     Authenticate user & get token
// @access   Public
router.post('/',[
  check('username', 'Please include a valid username').exists(),
  check('password', 'password is required').exists()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  }
  const { username, password } = req.body

  try{
      let user = await User.findOne({ username }).select('id password username is_active is_admin')
      if (!user) {
          return res.status(404).json({ errors: [{ msg: 'user does not exist' }] })
      }else{
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return res.status(400).json({ errors: [{ msg: 'wrong password, try again' }] })
          }else{
              if (user.is_active == false){
                return res.status(403).json({ errors: [{ msg: 'user is not active' }] })
              }
              const payload = {
                  user: {
                    id: user.id,
                    username: user.username
                  }
              }


              jwt.sign( payload, config.get('jwtSecret'), { expiresIn: '5 days' },
                  (err, token) => {
                    if (err) throw err
                    res.json({ token })
                  }
                )
          }
      }

  } catch (err) {
    console.error(err.message)
    res.status(500).send('Server error')
  }

})

module.exports = router