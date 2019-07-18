const express = require('express');
const app = express();
const _ = require('underscore');
const Equipment = require('../models/equipment');
const { tokenVerify, adminRoleVerify, ingemedVerify } = require('../middlewares/authentication');

app.post('/equipment',[ tokenVerify, adminRoleVerify ],(req,res) =>{
    let body = req.body;
    console.log(body)
    let equipment = new Equipment({
        name: body.name,
        code: body.code,
        brand: body.brand,
        model: body.model,
        status: body.status,
        series: body.series,
        area: body.area
    })
    equipment.save((err,equipmentDB) =>{
        if (err) {
            console.error(err)
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.status(201).json({
            ok: true,
            equipment: equipmentDB
        })
    })
})

app.put('/equipment/:id',[tokenVerify,adminRoleVerify],(req,res) =>{
    let id = req.params.id;
    let body = _.pick(req.body,['name','code','brand','model','status','series','area']);
    Equipment.findByIdAndUpdate(id,body,{ new: true, runValidators: true, useFindAndModify: false },(err,equipmentDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!equipmentDB) {
            return res.status(404),json({
                ok: false,
                message: {
                    error: `The id ${id} does not exist`
                }
            })
        }
        res.status(200).json({
            ok: true,
            equipment: equipmentDB
        })
    })
})

app.get('/equipment/:id', [ tokenVerify, ingemedVerify ],(req,res) =>{
    let id = req.params.id;
    Equipment.findById(id,(err,equipmentDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!equipmentDB) {
            return res.status(404),json({
                ok: false,
                message: {
                    error: `The id ${id} does not exist`
                }
            })
        }
        res.status(200).json({
            ok: true,
            equipment: equipmentDB
        })
    })
})

app.delete('/equipment/:id', [ tokenVerify, adminRoleVerify ], (req,res) =>{
    let id = req.params.id;
    let statusChange = {
        status: false
    }
    Equipment.findOneAndUpdate(id,statusChange, { useFindAndModify: false, new: true, runValidators: true }, (err,equipmentDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!equipmentDB) {
            return res.status(404),json({
                ok: false,
                message: {
                    error: `The id ${id} does not exist`
                }
            })
        }
        res.status(200).json({
            ok: true,
            equipment: equipmentDB
        })
    })
})

app.get('/equipments',[ tokenVerify, ingemedVerify ],(req, res) =>{
    let limit = Number(req.query.limit);
    let skip = Number(req.query.skip);
    Equipment.find({ status: true })
        .limit(limit)
        .skip(skip)
        .exec((err,equipmentsDB) =>{
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                equipments: equipmentsDB
            })
        })
})

module.exports = app;