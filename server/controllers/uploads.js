const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Equipment = require('../models/equipment');
const Maintenence = require('../models/maintenance');
const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type;
    console.log(type)
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({ 
            ok: false,
            err: {
                message: `No file has been selected`
            }
        })
    }

    let validTypes = ['user','equipment','manuals', 'reports']; 
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `The allowed types are: ` + validTypes.join(', ')
            }
        })
    }

    let file = req.files.file; 
    let trimmedName = file.name.split('.'); 
    let extension = trimmedName[trimmedName.length - 1];
    let validExtensions;

    if (type == 'manuals' || type == 'reports') {
        validExtensions = ['pdf'];
    }
    
    else if (type == 'equipment' || type == 'user') {
        validExtensions = ['png', 'jpg', 'gif', 'jpeg'];
    }

    console.log(validExtensions)

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            error: {
                message: `The allowed extensions are: ` + validExtensions.join(', ')
            }
        })
    }

    let fileName = `${ id }-${ new Date().getMilliseconds() }.${ extension }`; //-> Nombra los archivos con el id-milisegundos.extension para controlar en el servidor

    file.mv(`uploads/${ type }/${ fileName }`, (err) => { // -> path donde se va a almacenar el archivo
        if (err) {
            res.status(400).json({
                ok: false,
                err
            })
        }

        if (type == 'user') {
            userImage(id, res, fileName, type);
        }
        else if (type == 'equipment') {
            equipmentImage(id, res, fileName, type);
        }
        else if (type == 'manuals'){
            equipmentDocument(id, res, fileName, type);
        }
        else if (type == 'reports') {
            maintenenceDocument(id, res, fileName, type)
        }
    })
});

function userImage(id, res, fileName, type) {
    User.findById(id, (err, userDB) => {
        if (err) {
            deleteFile(fileName, type)
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!userDB) {
            deleteFile(fileName, type)
            return res.status(404).json({
                ok: false,
                error: {
                    message: `The user with id ${ id } does not exist`
                }
            })
        }

        deleteFile(userDB.img, type) 

        userDB.img = fileName;

        userDB.save((err, usDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                user: usDB,
                img: fileName
            })
        })

    })
}

function equipmentImage(id, res, fileName, type) {
    Equipment.findById(id, (err, equipmentDB) => {
        if (err) {
            deleteFile(fileName, type)
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!equipmentDB) {
            deleteFile(fileName, type)
            return res.status(404).json({
                ok: false,
                error: {
                    message: `The user with id ${ id } does not exist`
                }
            })
        }

        deleteFile(equipmentDB.img, type) 

        equipmentDB.img = fileName;

        equipmentDB.save((err, eqDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                user: eqDB,
                img: fileName
            })
        })

    })
}

function equipmentDocument(id, res, fileName, type) {
    Equipment.findById(id, (err, equipmentDB) => {
        if (err) {
            deleteFile(fileName, type)
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!equipmentDB) {
            deleteFile(fileName, type)
            return res.status(404).json({
                ok: false,
                error: {
                    message: `The user with id ${ id } does not exist`
                }
            })
        }

        deleteFile(equipmentDB.manual, type) 

        equipmentDB.manual = fileName;

        equipmentDB.save((err, eqDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                user: eqDB,
                manual: fileName
            })
        })

    })
}

function maintenenceDocument(id, res, fileName, type) {
    Maintenence.findById(id, (err, maintenanceDB) => {
        if (err) {
            deleteFile(fileName,type);
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        if (!maintenanceDB) {
            deleteFile(fileName,type);
            return res.status(404).json({
                ok: false,
                error: {
                    message: `The user with id ${ id } does not exist`
                }
            })
        }

        maintenanceDB.report = fileName;

        maintenanceDB.save((err, mtDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    message: err
                })
            }
            res.status(200).json({
                ok: true,
                user: mtDB,
                manual: fileName
            })
        })

    })
}

function deleteFile(fileName, type) {
    let pathImage = path.resolve(__dirname, `../../uploads/${ type }/${ fileName }`) 

    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
}

module.exports = app;