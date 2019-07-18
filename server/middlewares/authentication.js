const jwt = require('jsonwebtoken');

const tokenVerify = (req,res,next) => {
    let token = req.get('token');
    jwt.verify(token,'este-es-el-seed-desarrollo',(err,payload) =>{
        if (err) {
            return res.status(400).json({
                ok: false,
                message: err
            })
        }
        req.user = payload.user;
        next();
    })
}

const adminRoleVerify = (req,res,next) => {
    let user = req.user;
    if (user.role == 'ADMIN') {
        next();
    }
    else{
        res.status(401).json({
            ok: false,
            message:{
                err: `Only the administrator is authorized`
            }
        })
    }
}

const ingemedVerify = (req,res,next) =>{
    let body = req.user;
    if (body.role == 'INGEMED' 
    || body.role == 'TECMED' 
    || body.role == 'PRACMED'
    || body.role == 'ADMIN') {
        next();
    }
    else{
        res.status(401).json({
            ok: false,
            message:{
                err: `Only the personal is authorized`
            }
        })
    }
}

const userVerify = (req,res,next) =>{
    let body = req.user;
    if (body.role == 'USER') {
        next();
    }
    else{
        res.status(401).json({
            ok: false,
            message:{
                err: `Only the user is authorized`
            }
        })
    }
}

module.exports = {
    adminRoleVerify,
    tokenVerify,
    ingemedVerify,
    userVerify
}