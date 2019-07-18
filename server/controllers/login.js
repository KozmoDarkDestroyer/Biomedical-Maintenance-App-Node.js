const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app = express();
const User = require('../models/user');
const config = require('../config/config');

app.post('/login',(req,res) =>{
    let body = req.body;
    console.log(body.email)
    User.findOne({ email: body.email },(err,userDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!userDB) {
            return res.status(404).json({
                ok: false,
                message: {
                    err: `The email or password is incorrect`
                }
            })
        }
        if (!bcrypt.compareSync(body.password,userDB.password)) {
            return res.status(400).json({
                ok: false,
                message: {
                    err: `The email or password is incorrect`
                }
            })
        }
        let token = jwt.sign({ user: userDB },config.AUTH_JWT_SECRET,{ expiresIn: config.TOKEN_EXPIRATION });
        res.status(200).json({
            ok: true,
            user: userDB,
            token
        })
    })
})

module.exports = app;
