const express = require('express')
const fileUpload = require('express-fileupload')
var bodyParser = require('body-parser')
const connectDB = require('./config/db')
const path = require('path')
var cors = require('cors')
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use('/uploads', express.static('uploads'))

connectDB()

app.use(fileUpload({
    createParentPath: true
}))
app.use (function (req, res, next) {
    var schema = (req.headers['x-forwarded-proto'] || '').toLowerCase()
    if (req.headers.host.indexOf('localhost') < 0 && schema !== 'https') {
        res.redirect('https://' + req.headers.host + req.url);
    }
    next()
})
app.use('/user', require('./routes/api/user'))
app.use('/cars', require('./routes/api/cars'))
app.use('/company', require('./routes/api/company'))
app.use('/auth', require('./routes/api/auth'))
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname))
})


app.listen(PORT, () => { console.log(`port ${PORT}`) })