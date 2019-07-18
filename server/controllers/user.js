const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { tokenVerify, adminRoleVerify } = require('../middlewares/authentication');


app.post('/user',(req,res) => {
    let body = req.body;
    console.log(body)
    let user = new User({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password,10),
        role: body.role,
        status: body.status
    })
    user.save((err,userDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.status(201).json({
            ok: true,
            user: userDB
        })
    })
})

app.put('/user/:id', [tokenVerify, adminRoleVerify], (req,res) =>{
    let id = req.params.id;
    console.log(id)
    let body = _.pick(req.body,['name','role','status', 'img']);
    console.log(body)
    User.findByIdAndUpdate(id,body,{ new: true, runValidators: true, useFindAndModify: false },(err,userDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if(!userDB){
            return res.status(404).json({
                ok: false,
                message: {
                    err: `el id ${id} no existe`
                }
            })
        }
        res.status(200).json({
            ok: true,
            user: userDB
        })
    })
})

app.get('/user/:id', [tokenVerify], (req,res) =>{
    let id = req.params.id;
    User.findById(id,(err,userDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if(!userDB){
            return res.status(404).json({
                ok: false,
                message: {
                    err: `el id ${id} no existe`
                }
            })
        }
        res.status(200).json({
            ok: true,
            user: userDB
        })
    })
})

app.delete('/user/:id', [tokenVerify, adminRoleVerify], (req,res) =>{
    let id = req.params.id;
    let statusChange = {
        status: false
    }
    User.findByIdAndUpdate(id,statusChange, { new: true, runValidators: true, useFindAndModify: false }, (err,userDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if(!userDB){
            return res.status(404).json({
                ok: false,
                message: {
                    err: `el id ${id} no existe`
                }
            })
        }
        res.status(200).json({
            ok: true,
            user: userDB
        })
    })
})

app.get('/users', [tokenVerify], (req,res) =>{
    let limit = Number(req.query.limit);
    let skip = Number(req.query.skip);
    User.find({ status: true })
        .limit(limit)
        .skip(skip)
        .exec((err,usersDB) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                users: usersDB
            })
        })

})

module.exports = app;