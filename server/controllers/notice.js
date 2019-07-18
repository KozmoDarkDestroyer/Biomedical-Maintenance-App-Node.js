const express = require('express');
const app = express();
const _ = require('underscore');
const Notice = require('../models/notice');
const { tokenVerify, adminRoleVerify, userVerify, ingemedVerify } = require('../middlewares/authentication');

app.post('/notice',[ tokenVerify, userVerify ],(req,res) =>{
    let body = req.body;
    let notice = new Notice({
        name: body.name,
        equipment: body.equipment,
        description: body.description,
        user: req.user
    })
    notice.save((err,noticeDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.status(201).json({
            ok: true,
            notice: noticeDB
        })
    })
})

app.put('/notice/:id',[ tokenVerify ], (req,res) =>{
    let id = req.params.id;
    let body;
    let user = req.user;
    console.log(user.role)
    if (user.role == 'USER') {
        body = _.pick(req.body,['name','equipment','description']);
        Notice.findByIdAndUpdate(id,body, { new: true, runValidators: true, useFindAndModify: false }, (err,noticeDB) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            if (!noticeDB) {
                return res.status(404).json({
                    ok: false,
                    message: {
                        err: `The id ${id} does not exist`
                    }
                })
            }
            res.status(200).json({
                ok: true,
                notice: noticeDB
            })
        })
    }
    else if (  user.role == 'INGEMED'
            || user.role == 'TECMED'
            || user.role == 'ADMIN'  ) {
        body = _.pick(req.body,['status']);
        Notice.findByIdAndUpdate(id,body, { new: true, runValidators: true, useFindAndModify: false }, (err,noticeDB) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            if (!noticeDB) {
                return res.status(404).json({
                    ok: false,
                    message: {
                        err: `The id ${id} does not exist`
                    }
                })
            }
            res.status(200).json({
                ok: true,
                notice: noticeDB
            })
        })
    }
})

app.get('/notices',[ tokenVerify ],(req,res) =>{
    let limit = Number(req.query.limit);
    let skip = Number(req.query.skip);
    let user = req.user;
    
    if (user.role == 'USER') {
        Notice.find({ user: req.user._id })
        .populate('equipment','name code')
        .limit(limit)
        .skip(skip)
        .exec((err, noticesDB) =>{
            if (err) {
                return status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                notices: noticesDB
            })
        })
    }
    else if (  user.role == 'PRACMED'
            || user.role == 'INGEMED'
            || user.role == 'TECMED'
            || user.role == 'ADMIN') {
        Notice.find({})
        .populate('equipment', 'name code brand model series area')
        .populate('user')
        .limit(limit)
        .skip(skip)
        .exec((err, noticesDB) =>{
            if (err) {
                return status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                notices: noticesDB
            })
        })
    }

    
})

module.exports = app;