express = require('express')
const router = express.Router()
const Categoy = require('../models/Category')
const auth = require('../models/auth')
const adminAuth = require('../models/adminAuth')

const { check, validationResult } = require('express-validator')


//@router POST api/category
//@desc Create Category 
// @accss Private
router.post('/', [
    check('name','Name is required').trim().not().isEmpty()
], auth, adminAuth, async (req, res) => {
    res.send('ok')
})

module.exports = router