'use strict'
var express = require('express');
var api = express.Router();
var mdAuth = require('../middlewares/authenticated'); 
var connectMultiparty = require('connect-multiparty');
var userController = require('../controllers/user.controller');
var classController = require('../controllers/class.controller');
var mdUpload = connectMultiparty({ uploadDir: './uploads/user'});

//var mdUpload = connectMultiparty({ uploadDir: './uploads/users'});

//ALL USERS
api.post('/login', userController.login);
api.put('/deleteUser/:idU', mdAuth.ensureAuth, userController.deleteUser); 
api.put('/updateUser/:idU', mdAuth.ensureAuth, userController.updateUser);
api.put('/uploadImage/:idU', [mdAuth.ensureAuth, mdUpload], userController.uploadImage);
api.get('/getImage/:fileName', [mdUpload], userController.getImage);

//ADMIN
api.delete('/deleteuserByAdmin/:idU/:idAdmin', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.deleteUserByAdmin);
api.put('/getAccess/:idU', userController.getAccess);
api.put('/removeAccess/:idU', userController.removeAccess);
api.delete('/deleteClassAdmin/:idA/:idC', mdAuth.ensureAuthAdmin, classController.deleteClassAdmin);
api.get('/getUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getUsers);
api.get('/getPendingUsers', [mdAuth.ensureAuth, mdAuth.ensureAuthAdmin], userController.getPendingUsers);

//STUDENT
api.post('/studentSave', userController.studentSave);
api.put('/inscription/:idS/:idC',userController.inscription);
api.delete('/deleteInscription/:idS/:idC', mdAuth.ensureAuth, userController.deleteInscription);

//TEACHER
api.post('/teacherSave', userController.teacherSave);

//CLASS
api.post('/saveClass/:id' ,mdAuth.ensureAuth,classController.saveClass);
api.delete('/deleteClass/:idT/:idC', mdAuth.ensureAuth,classController.deleteClass);
api.put('/updateClass/:idU/:idC', mdAuth.ensureAuth,classController.updateClass);
api.get('/listClassByS/:idS', classController.listClassByS);
api.get('/listClassByT/:idT', classController.listClassByT);
api.get('/allClasses/:idU', mdAuth.ensureAuth, classController.allClasses);
api.get('/getClass/:idC', classController.getClass);

//COMMENT
api.put('/saveComment/:idU/:idC', mdAuth.ensureAuth, classController.saveComment);
api.delete('/deleteComment/:idU/:idCl/:idCo', mdAuth.ensureAuth, classController.deleteComment);
api.put('/updateComment/:idU/:idCl/:idCo', mdAuth.ensureAuth, classController.updateComment);
api.get('/getComments/:idU/:idC', classController.getComments);
api.get('/getVideo/:idU/:idC', classController.getVideo);
api.put('/uploadImageC/:idU/:idC', [mdAuth.ensureAuth, mdUpload], classController.uploadImageC);
api.get('/getImageC/:fileName', [mdUpload], classController.getImageC);

//FILES
api.get('/getImageC/:fileName', [mdUpload], classController.getImageC);
api.get('/getFiles/:idC', mdAuth.ensureAuth, classController.getFiles);

module.exports = api;