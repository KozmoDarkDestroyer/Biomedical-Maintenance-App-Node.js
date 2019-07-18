const express = require('express');
const app = express();
const _ = require('underscore');
const Maintenance = require('../models/maintenance');
const { tokenVerify, adminRoleVerify, ingemedVerify } = require('../middlewares/authentication');

app.post('/maintenance',[ tokenVerify, ingemedVerify ],(req,res) =>{
    let body = req.body;
    let maintenance = new Maintenance({
        description: body.description,
        user: req.user,
        equipment: body.equipment,
        notice: body.notice
    })
    maintenance.save((err,maintenanceDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        res.status(201).json({
            ok: true,
            maintenance: maintenanceDB
        })
    })
})

app.put('/maintenance/:id',[ tokenVerify, ingemedVerify ],(req,res) =>{
    let id = req.params.id;
    let body = _.pick(req.body,['description','equipment','notice']);
    Maintenance.findByIdAndUpdate(id,body,{ new: true, runValidators: true, useFindAndModify: false },(err, maintenanceDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })    
        }
        if (!maintenanceDB) {
            return res.status(404).json({
                ok: false,
                message: {
                    err: `The id ${id} does not exist`
                }
            })
        }
        res.status(200).json({
            ok: true,
            maintenance: maintenanceDB
        })
    })
})

app.get('/maintenances',[ tokenVerify, ingemedVerify ],(req,res) =>{
    let limit = Number(req.query.limit);
    let skip = Number(req.query.skip);
    Maintenance.find({})
        .populate('notice','description user')
        .populate('user','name role email')
        .populate('equipment','name code area')
        .limit(limit)
        .skip(skip)
        .exec((err,maintenancesDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                maintenances: maintenancesDB
            })
        })
})

app.get('/maintenance/:id',[ tokenVerify, ingemedVerify ],(req,res) =>{
    let id = req.params.id;
    Maintenance.findById(id,(err,maintenanceDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })    
        }
        if (!maintenanceDB) {
            return res.status(404).json({
                ok: false,
                message: {
                    err: `The id ${id} does not exist`
                }
            })
        }
        res.status(200).json({
            ok: true,
            maintenance: maintenanceDB
        })
    })
})

app.delete('/maintenance/:id',[ tokenVerify, ingemedVerify ],(req,res) =>{
    let id = req.params.id;
    let statusChange = {
        status: false
    }
    Maintenance.findByIdAndUpdate(id,statusChange,{ new: true, runValidators: true, useFindAndModify: false },(err, maintenanceDB) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })    
        }
        if (!maintenanceDB) {
            return res.status(404).json({
                ok: false,
                message: {
                    err: `The id ${id} does not exist`
                }
            })
        }
        res.status(200).json({
            ok: true,
            maintenance: maintenanceDB
        })
    })
})

module.exports = app;