'use strict'

var User = require('../models/user.model');
var Class = require('../models/class.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

//-- ADMIN --

//CREATE INIT
function createInit(req,res){
    let user = new User();
    user.password = 'kdslearn';
    user.username = 'ADMIN';
    user.access = true;

    User.findOne({username: user.username}, (err, userFind)=>{
            if(err){
                console.log('Error general');
            }else if(userFind){
                console.log('no se puede agregar un nuevo usuario administrador');
            }else{
                bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                    if(err){
                        console.log('Error al crear el usuario');
                    }else if(passwordHash){
                       
                        user.username = 'ADMIN'
                        user.name='ADMIN'
                        user.role = 'ROLE_ADMIN'    
                        user.password = passwordHash;
                        user.access = true;
                            
                        user.save((err, userSaved)=>{
                            
                            if(err){
                                console.log('Error al crear el usuario');
                            }else if(userSaved){
                                console.log('Usuario administrador creado');
                            }else{
                                console.log('Usuario administrador no creado');
                            }
                        })
                    }else{
                        console.log('No se encriptó la contraseña');
                    } 
                })
            }
    })
}

//GET USERS ACCESS
function getUsers(req, res){
    User.find({access: true}).exec((err, user)=>{
        if(err){
            res.status(500).send({message: 'ERROR GENERAL', err});
        }else if(user){
            res.status(200).send({message: 'Usuarios encontrados', users:user});
        }else{
            res.status(404).send({message: 'No se encontraron registros'})
        }
    })
}

//GET PENdING USERS
function getPendingUsers(req, res){
    User.find({access: false}).exec((err, user)=>{
        if(err){
            res.status(500).send({message: 'ERROR GENERAL', err});
        }else if(user){
            res.status(200).send({message: 'Usuarios encontrados', users:user});
        }else{
            res.status(404).send({message: 'No se encontraron registros'})
        }
    })
}

//GET ACCESS
function getAccess(req, res){
    let userId = req.params.idU;

    User.findById(userId, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: 'ERROR GENERAL', err});
        }else if(userFind){
            User.findByIdAndUpdate(userId, {$set:{access:true}}, (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'ERROR GENERAL', err});
                }else if(userUpdated){
                    return res.send({message: 'Usuario actualizado: ', userUpdated});
                }else{
                    return res.send({message: 'No se pudo dar acceso'});
                }
            })
        }else{
            return res.status(404).send({message: 'Usuario no encontrado'});
        }
    })
}

//REMOVE ACCESS
function removeAccess(req, res){
    let userId = req.params.idU;

    User.findById(userId, (err, userFind)=>{
        if(err){
            return res.status(500).send({message: 'ERROR GENERAL', err});
        }else if(userFind){
            User.findByIdAndUpdate(userId, {$set:{access:false}}, (err, userUpdated)=>{
                if(err){
                    res.status(500).send({message: 'ERROR GENERAL', err});
                }else if(userUpdated){
                    return res.send({message: 'Usuario actualizado: ', userUpdated});
                }else{
                    return res.send({message: 'No se pudo dar acceso'});
                }
            })
        }else{
            return res.status(404).send({message: 'Usuario no encontrado'});
        }
    })
}

//DELETE USERS ADMIN
function deleteUserByAdmin(req, res){
    let userId = req.params.idU;
    let params = req.body;
    let adminId = req.params.idAdmin;
    if(adminId !=req.user.sub){
        return res.status(403).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'Error general'})
            }else if(userFind){
                if(userFind.role == 'ROLE_ADMIN'){
                    res.status(403).send({message: 'No se puede eliminar un usuario administrador'})
                }else{
                    User.findByIdAndRemove(userId, (err, userFind)=>{
                        if(err){
                            res.status(500).send({message: 'Error general'})
                        }else if(userFind){
                            res.status(200).send({message: 'Eliminado exitosamente', userRemoved:userFind})
                        }else{
                            res.status(403).send({message: 'Error al eliminar'})
                        }
                    })   
                }
                
            }else{
                res.status(403).send({message: 'Usuario inexistente'})
            }

        })
    }
}

//-- USERS --

//LOGIN
function login(req, res){
    var params = req.body;
    var user = new User();
    
    if(params.username && params.password){
            User.findOne({username: params.username}, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'ERROR GENERAL', err});
                }else if(userFind){
                    if(userFind.access == true){
                        bcrypt.compare(params.password, userFind.password, (err, passwordCheck)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al comparar contraseñas'});
                            }else if(passwordCheck){
                                if(params.gettoken){
                                    res.send({
                                        token: jwt.createToken(userFind),
                                        user: userFind
                                    })
                                }else{
                                    return res.send({message: 'Usuario logueado'});
                                }
                            }else{
                                return res.status(403).send({message: 'Usuario o contraseña incorrectos'});
                            }
                        })
                    }else{
                        return res.status(401).send({message: 'Aun no tienes acceso a la plataforma'})
                    }
                }else{
                    return res.status(401).send({message: 'Usuario no encontrado'});
                }
            })
        }else{
            return res.status(404).send({message: 'Por favor introduce los campos obligatorios'});
        }
}

//UPDATE
function updateUser(req, res){
    let userId = req.params.idU;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.password || update.role){
            return res.status(401).send({message: 'No puedes actualizar la contraseña ni el rol desde esta función'});
        }else{
            if(update.username){
                User.findOne({username: update.username.toLowerCase()}, (err, userFind)=>{
                    if(err){
                        return res.status(500).send({message: 'ERROR GENERAL', err});
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'ERROR GENERAL AL INTENTAR ACTUALIZAR', err});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado: ', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar tu usuario'})
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de usuario ya en uso'});
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'ERROR GENERAL AL INTENTAR ACTUALIZAR', err});
                            }else if(userUpdated){
                                return res.send({message: 'Usuario actualizado: ', userUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar tu usuario'})
                            }
                        })
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, update, {new:true}, (err, userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'ERROR GENERAL AL INTENTAR ACTUALIZAR', err});
                    }else if(userUpdated){
                        return res.send({message: 'Usuario Actualizado: ', userUpdated});
                    }else{
                        return res.send({message: 'No se pudo actualizar tu usuario'});
                    }
                })
            }
        }
    }
}

//UPLOAD IMAGE
function uploadImage(req, res){
    var userId = req.params.idU;
    var fileName = 'Sin Imagen';
    if(userId != req.user.sub){
        res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(req.files){
            var filePath = req.files.image.path;
            var fileSplit = filePath.split('\\');
            var fileName  = fileSplit[2];
            var ext = fileName.split('.');
            var fileExt = ext[1];
            if(fileExt == 'png' ||
                fileExt == 'jpg' ||
                fileExt == 'jpeg' ||
                fileExt == 'gif'){
                    User.findByIdAndUpdate(userId, {image: fileName}, {new: true}, (err, userUpdated)=>{
                        if(err){
                            return res.status(500).send({message: 'ERROR GENERAL', err});
                        }else if(userUpdated){
                            return res.send({user: userUpdated, userImage: userUpdated.image});
                        }
                    })
                }else{
                    fs.unlink(filePath, (err)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al eliminar y la extensión no es válida', err});
                        }else{
                            return res.status(403).send({message: 'Extensión no válida, archivo eliminado'});
                        }
                    })
                }
        }else{
            return res.status(404).send({message: 'No has subido una imagen'});
        }
    }
}

function getImage(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/user/' + fileName;

    fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Imagen inexistente'});
        }
    })
}

//----DELETE USER
function deleteUser(req, res){
    let userId = req.params.idU;
    let params = req.body;
    if(userId !=req.user.sub){
        return res.status(403).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL',err})
            }else if(userFind){
                if(userFind.role == 'ROLE_ADMIN'){
                    res.status(403).send({message: 'No se puede eliminar un usuario administrador'})
                }else{
                    if(params.password){
                        bcrypt.compare(params.password, userFind.password, (err, passwordCheck)=>{
                            if(err){
                                res.status(500).send({message: 'ERROR GENERAL',err})
                            }else if(passwordCheck){
                                    User.findByIdAndRemove(userId, (err, userFind)=>{
                                        if(err){
                                            res.status(500).send({message: 'ERROR GENERAL',err})
                                        }else if(userFind){
                                            res.status(200).send({message: 'Eliminado exitosamente', userRemoved:userFind})
                                        }else{
                                            res.status(403).send({message: 'Error al eliminar'})
                                        }
                                    })
                            }else{
                                res.status(403).send({message: 'Contraseña incorrecta'})
                            }
                        })
                    }else{
                        res.status(200).send({message:'Ingrese la contraseña del usuario para eliminar'})
                    }
                }
                
            }else{
                res.status(403).send({message: 'Usuario inexistente'})
            }

        })
    }
}

//--------STUDENT------------

//SAVE STUDENT
function studentSave(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.lastname && params.username && params.password && params.correo){
        User.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(userFind){
                return res.send({message: 'El nombre de usuario que ingresaste ya está en uso, ingresa otro nuevo'});
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseña'});
                    }else if(passwordHash){
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.password = passwordHash;
                        user.phone = params.phone;
                        user.role = "ROLE_STUDENT";
                        user.access = true;
                        user.correo = params.correo;
                        user.save((err, userSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'ERROR GENERAL AL GUARDAR EL USUARIO ESTUDIANTE', err});
                            }else if(userSaved){
                                return res.send({message: 'Usuario estudiante creado exitosamente', userSaved});
                            }else{
                                return res.status(500).send({message: 'No se guardó el usuario', err});
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'La contraseña no se ha encriptado'});
                    }
                })
            }
        })
    
    }else{
        return res.status(401).send({message: 'Por favor envía los datos mínimos para la creación del usuario'})
    }
}

//--------TEACHER------------

//----SAVE TEACHER
function teacherSave(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.lastname && params.username && params.password && params.correo){
        User.findOne({username: params.username}, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(userFind){
                return res.send({message: 'El nombre de usuario que ingresaste ya está en uso, ingresa otro nuevo'});
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al comparar contraseña'});
                    }else if(passwordHash){
                        user.name = params.name;
                        user.lastname = params.lastname;
                        user.username = params.username;
                        user.password = passwordHash;
                        user.phone = params.phone;
                        user.role = "ROLE_TEACHER";
                        user.access = false;
                        user.correo = params.correo;
                        user.save((err, userSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'ERROR GENERAL AL GUARDAR EL USUARIO PROFESOR', err});
                            }else if(userSaved){
                                return res.send({message: 'Usuario profesor creado exitosamente', userSaved});
                            }else{
                                return res.status(500).send({message: 'No se guardó el usuario', err});
                            }
                        })
                    }else{
                        return res.status(403).send({message: 'La contraseña no se ha encriptado'});
                    }
                })
            }
        })
    
    }else{
        return res.status(401).send({message: 'Por favor envía los datos mínimos para la creación del usuario'})
    }
} 

//----INSCRIPTION
function inscription (req,res){
    var studentId = req.params.idS;
    var classId = req.params.idC;
        Class.findOne(({student:studentId, _id:classId}), (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(userFind){
                return res.send({message: 'Ya estás inscrito, no puedes hacerlo nuevamente'});
            }else{
        Class.findById(classId, (err, classFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(classFind){
                Class.findByIdAndUpdate(classId, {$push:{student: studentId}}, {new: true}, (err, pushStudent)=>{
                    if(err){
                        res.status(500).send({message: 'Error al inscribirse al curso', err});
                    }else if(pushStudent){
                        return res.status(200).send({message: 'Inscripción completada', pushStudent});
                    }else{
                        res.status(200).send({message: 'no seteado pero en la base de datos'});
                    }
                }) 
            }else{
                res.status(403).send({message: 'Clase no encontrada'});
            }
        })
    }
        })
    

}

//DELETE INSCRIPTION
function deleteInscription (req, res){
    let studentId = req.params.idS;
    let classId = req.params.idC;
    if(studentId != req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'});
    }else{
    Class.findById(classId, (err, classFind)=>{
        if(err){
           res.status(500).send({message: 'ERROR GENERAL', err})
        }else if(classFind){
       Class.findOneAndUpdate({_id: classId, student: studentId},
           {$pull: {student: studentId}}, {new:true}, (err, inscriptionDeleted)=>{
               if(err){
                   return res.status(500).send({message: 'ERROR GENERAL', err})
               }else if(inscriptionDeleted){
                   Class.findByIdAndRemove(studentId, (err, inscriptionRemoved)=>{
                       if(err){
                           return res.status(500).send({message: 'Error general', err})
                       }else if(inscriptionRemoved){
                           return res.send({message: 'La inscripción fue eliminada correctamente', inscriptionDeleted});
                       }else{
                           return res.status(404).send({message: 'La inscripción fue eliminada correctamente', inscriptionDeleted})
                       }
                   })
               }else{
                   return res.status(404).send({message: 'La inscripción no fue encontrada o ya fue eliminada'})
               }
           })
        }else{
        }
    })
}
}

module.exports = {
    //ALL USERS
    login,
    updateUser,
    deleteUser,
    uploadImage,
    getImage,
    //ADMIN
    createInit,
    getUsers,
    getAccess,
    removeAccess,
    getPendingUsers,
    deleteUserByAdmin,
    //STUDENT
    studentSave,
    inscription,
    deleteInscription,
    //TEACHER
    teacherSave
}

