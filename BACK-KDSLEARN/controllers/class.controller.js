'use strict'

var User = require('../models/user.model');
var Class = require('../models/class.model');
var Comment = require('../models/comment.model');
var File = require('../models/file.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var fs = require('fs');
var path = require('path');

//SAVE
function saveClass (req, res){
    let userId = req.params.id;  
    var clas = new Class();
    var params = req.body;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        if(params.name && params.description){
            Class.findOne({name: params.name}, (err, classFind)=>{
                if(err){
                    res.status(500).send({message: 'ERROR GENERAL', err})
                }else if(classFind){
                    res.status(200).send({message: 'La materia ya fue creada'})
                }else{                       
                    User.findOne({_id: userId}, (err, userFind)=>{
                        if(err){
                            res.status(500).send({message:'ERROR GENERAL', err})
                        }else if(userFind){
                            if (userFind.role == 'ROLE_TEACHER') {
                                clas.name = params.name;
                                clas.description = params.description;
                                clas.teacher =  userId;    
                                clas.video = params.video;                                 
                                clas.save((err, classSaved)=>{
                                
                           if(err){
                                res.status(500).send({message: 'ERROR GENERAL', err})
                            }else if(classSaved){    
                                User.findById(userId, (err, userFind)=>{
                                    if(err){
                                        res.status(500).send({message: 'ERROR GENERAL', err})
                                    }else if(userFind){
                                        res.status(200).send({message: 'Materia registrada con éxito', savedC: classSaved, userFind}) 
                                      
                                    }else{
                                        res.status(401).send({message: 'No se pudo registrar la materia'})
                                    }
                                })
                            }else{
                                res.status(401).send({message: 'No se pudo registrar la materia'})
                                }
                               })                      
                                }else{
                                res.status(401).send({message: 'No tiene autorización para registrar una materia'})
                                }

                        }else{
                            res.status(500).send({message:'Usuario no encontrado'})
                        }
                    })  
                }
            })
        }else{
            res.status(401).send({message: 'Ingrese los datos minimos para el registro de la materia'})
        }
    }
}

//UPDATE
function updateClass(req, res){
    let userId = req.params.idU;
    let classId = req.params.idC;
    let update = req.body;
    if(userId != req.user.sub){
        return res.status(404).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.name){
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'ERROR GENERAL', err});
                }else if(userFind){
                    Class.findById(classId,(err, classFind)=>{
                        if (err) {
                            return res.status(500).send({message: 'ERROR GENERAL AL ACTUALIZAR LA MATERIA'});
                        }else if (classFind) {
                            if (classFind.admin == userId || userFind.role == 'ROLE_TEACHER') {
                                Class.findByIdAndUpdate(classId, update, {new: true}, (err, updateClass)=>{
                                    if(err){
                                        return res.status(500).send({message: 'ERROR GENERAL AL ACTUALIZAR LA MATERIA'});
                                    }else if(updateClass){
                                        return res.send({message: 'Materia actualizada con éxito', updateClass});
                                    }else{
                                        return res.status(401).send({message: 'No se pudo actualizar la materia'});
                                    }
                                })
                            }else{
                                return res.status(401).send({message: 'No tiene autorización para actualizar esta materia'});
                            }
                        }else{
                            return res.status(401).send({message: 'No se pudo encontrar la materia solicitada'});
                        }
                    })
                   
                }else{
                    return res.status(404).send({message: 'Usuario inexistente'});
                }
            }) 
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos mínimos para actualizar la materia'});
        }       
    }
}

//DELETE
function deleteClass(req, res){
    let teacherId = req.params.idT;
    let classId = req.params.idC;
    if(teacherId !=req.user.sub){
        return res.status(403).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        Class.findById(classId, (err, classFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(classFind){
                if(classFind.teacher == teacherId){
                    Class.findByIdAndRemove(classId, (err, classRemoved)=>{
                        if(err){
                            res.status(500).send({message: 'ERROR GENERAL', err});
                        }else if(classRemoved){
                            res.status(200).send({message: 'Clase eliminada correctamente'});
                        }else{
                            res.status(403).send({message: 'No se eliminó la clase'});
                        }
                    }) 
                }else{
                    res.status(403).send({message: 'No puedes eliminar esta clase'});
                }
            }else{
                res.status(403).send({message: 'No se encontró la clase'});
            }
        }) 
    }
}

//DELETE CLASS ADMIN
function deleteClassAdmin(req, res){
    let adminId = req.params.idA;
    let classId = req.params.idC;

    if(adminId != req.user.sub){
        return res.status(403).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        Class.findById(classId, (err, classFind)=>{
            if(err){
                return res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(classFind){
                Class.findByIdAndRemove(classId, (err, classRemoved)=>{
                    if(err){
                        return res.status(500).send({message: 'ERROR GENERAL', err});
                    }else if(classRemoved){
                        return res.send({message: 'Clase eliminada correctamente'});
                    }else{
                        return res.status(403).send({message: 'No se pudo eliminar esta clase'})
                    }
                })
            }
        })
    }
}

//GET ALL CLASSES
function allClasses(req, res){
    let userId = req.params.idU;
    if(userId !=req.user.sub){
        return res.status(403).send({message: 'No tienes permisos para realizar esta acción'})
    }else{
        Class.find({}, (err, classes)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(classes){
                res.status(200).send({message: 'Clases disponibles', classes});
            }else{
                res.status(403).send({message: 'No se encontraron clases'});
            }
        }).populate('user: teacher')

    }
}

//LIST CLASS BY TEACHER
function listClassByT(req, res){
    Class.find({teacher: req.params.idT}).exec((err, classFind)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(classFind){
            console.log(classFind)
            res.send({message: 'Estas son tus cursos: ', classF:classFind});
        }else{
            res.status(404).send({message: 'No hay registros'});
        }
    })
}

//LIST CLASS BY STUDENT
function listClassByS(req, res){
    Class.find({student:{$in :[req.params.idS]}}).exec((err, classFind)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else if(classFind){
            console.log(classFind)
            res.send({message: 'Estas son tus cursos: ', classFind});
        }else{
            res.status(404).send({message: 'No hay registros'});
        }
    })
}

//COMMENT
//SAVE COMMENT
function saveComment(req, res){
    var comment = new Comment();
    let userId = req.params.idU;
    let commentId = req.params.idC;
    let params = req.body;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
       User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err})
            }else if (userFind){
                if (userFind.role == 'ROLE_TEACHER') {
                if(params.title && params.comm){
                    comment.title= params.title;
                    comment.comm = params.comm;
                    comment.link1 = params.link1;
                    comment.link2 = params.link2;
                    comment.link3 = params.link3;
                    comment.link4 = params.link4;
                    comment.link5 = params.link5;
                    Class.findByIdAndUpdate(commentId, {$push: {comments: comment}}, {new: true}, (err, comentSaved)=>{
                        if(err){
                            res.status(500).send({message: 'ERROR GENERAL', err})
                        }else if(comentSaved){
                            res.status(200).send({message: 'Comentario realizado', comentSaved});
                        }else{
                            res.status(418).send({message: 'Comentario no agregado'});
                        }
                    })
                }else{
                    res.status(404).send({message: 'Ingrese los datos mínimos, título y comentario'})
                } 
                }else{
                    res.status(404).send({message: 'No tienes permisos para agregar un comentario'})
                } 

            }else{
                res.status(200).send({message: 'No hay ningun registro'})
            }
        })
    }
}

//DELETE
function deleteComment(req, res){
    let userId = req.params.idU;
    let classId = req.params.idCl;
    let commentId = req.params.idCo ;
    let update = req.body;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err})
            }else if (userFind){
                if (userFind.role == 'ROLE_TEACHER') {
                Class.findOneAndUpdate({_id: classId, 'comments._id':commentId}, 
                    {$pull:{comments:{_id : commentId}}}, {new: true}, (err, commentRemoved)=>{
                        if(err){
                            res.status(500).send({message: 'ERROR GENERAL', err})
                        }else if(commentRemoved){
                            res.status(200).send({message: 'El comentario fue eliminado, el cambio se reflejará cuando ingreses de nuevo a tus publicaciones.'})
                        }else{
                            res.status(200).send({message: 'El comentario no fue encontrado o ya eliminado'})
                        }  
                })
            }else{
                res.status(404).send({message: 'No tienes permisos para eliminar un comentario'})
            } 
            }else{
                res.status(200).send({message: 'No hay ningun registro'})
            }
        })
    }
}

//UPDATE 
function updateComment(req, res){
    let userId = req.params.idU;
    let classId = req.params.idCl;
    let commentId = req.params.idCo;
    let update = req.body;
    if(userId !=req.user.sub){
        res.status(403).send({message: 'No puede acceder a esta funcion'})
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err})
            }else if (userFind){
                if (userFind.role == 'ROLE_TEACHER') {
        Class.findById(classId, (err, classFind)=>{
            if(err){
                res.status(500).send({message: 'ERROR GENERAL', err});
            }else if(classFind){
                Class.findOneAndUpdate({_id:classId, 'comments._id': commentId},
                {'comments.$.title': update.title, 
                'comments.$.comm': update.comm,
                'comments.$.link': update.link}, {new:true}, (err, commentUpdated)=>{
                    if(err){
                        res.status(500).send({message: 'ERROR GENERAL', err});
                    }else if(commentUpdated){
                        res.status(200).send({message: 'El comentario se actualizó:', commentUpdated});
                    }else{
                        res.status(404).send({message: 'El comentario no fue actualizado'});
                    }
                })
            }else{
                res.status(200).send({message: 'El usuario que ingresaste no existe'});
            }
        })
                }else{
                res.status(404).send({message: 'No tienes permisos para eliminar un comentario'})
                }        
            }else{
                res.status(200).send({message: 'No existe ningún comentario'})
            }
        })
    }   
}

//GET   
function getComments(req, res){
    let userId = req.params.idU;
    let classId = req.params.idC;
    Class.findById(classId, (err, commentsFind)=>{
        if(err){
            res.status(500).send({message: 'ERROR GENERAL', err});
        }else if(commentsFind){
            res.status(200).send({message: 'Los comentarios son los siguientes: ', comments: commentsFind.comments});
        }else{
            res.status(418).send({message: 'No existen comentarios para mostrar', err});
        }
    })
}

//GETCLASS
function getClass(req, res){
    let classId = req.params.idC;
    Class.findById(classId, (err, classFind)=>{
        if(err){
            res.status(500).send({message: 'ERROR GENERAL', err});
        }else if(classFind){
            res.send({message: 'Clase encontrada: ', class: classFind});
        }else{
            res.status(400).send({message: 'No existe esta clase'});
        }
    })

}

//GET VIDEO
function getVideo(req, res){
    let userId = req.params.idU;
    let classId = req.params.idC;
    Class.findById(classId, (err, classFind)=>{
        if(err){
            res.status(500).send({message: 'ERROR GENERAL', err});
        }else if(classFind){
            res.status(200).send({message: 'El video es el siguiente: ', video: classFind.video});
        }else{
            res.status(418).send({message: 'No existen videos para mostrar', err});
        }
    })
}

//UPLOAD DOCUMENTS
function uploadImageC(req, res){
    var comment = new Comment();
    var userId = req.params.idU;
    var classId = req.params.idC;
    var commentId = req.params.idCl;
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
                fileExt == 'gif' || 
                fileExt == 'pdf' ||
                fileExt == 'docx' ||
                fileExt == 'pptx' ||
                fileExt == 'mp4' ||
                fileExt == 'xlsx' ||
                fileExt == 'txt'){
                    Class.findById(classId, (err, classFind)=>{
                        if(err){
                            res.status(500).send({message:'ERROR GENERAL', err})
                        }else if(classFind){
                            Class.findByIdAndUpdate(classId, {$push:{files: fileName}}, {new: true}, (err, commentUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'ERROR GENERAL', err});
                                }else if(commentUpdated){
                                    res.send({message:'Guardado prueba', commentUpdated})
                                }else{
                                    return res.send({message: 'Guardado, pero no seteado' });
                                }
                            })
                            
                        }else{
                            res.status(500).send({message:'Clase no encontrada'})
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

function getImageC(req, res){
    var fileName = req.params.fileName;
    var pathFile = './uploads/user/' + fileName;
    fs.exists(pathFile, (exists)=>{
        if(exists){
            return res.sendFile(path.resolve(pathFile))
        }else{
           return res.status(404).send({message: 'Archivo inexistente'});
        }
    })
}

function getFiles(req, res){
    let classId = req.params.idC;
    Class.findById(classId,(err, filesFind)=>{
        if(err){
            res.status(500).send({message: 'Error general al mostrar los archivos'});
        }else if(filesFind){
            res.status(200).send({message: 'Los archivos de la clase son los siguientes: ', archivos: filesFind.files});
        }else{
            res.status(418).send({message: 'La clase que ingresaste no fue encontrada', err});
        }
    })
}



    module.exports = {
        saveClass,
        deleteClass,
        deleteClassAdmin,
        updateClass,
        listClassByS,
        listClassByT,
        saveComment,
        deleteComment,
        updateComment,
        getComments,
        allClasses,
        uploadImageC,
        getImageC,
        getClass,
        getFiles,
        getVideo
    }
    