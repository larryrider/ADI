const request = require('supertest');
const express = require('express');
const mysql = require('mysql')
const app = require('../main')
const database = require('../database')
const auth = require('../auth')

var mysqlPool = mysql.createPool(database.db_config);


describe('TESTS_API', function(){
    //token de admin:admin logueado con 365 dias de validez (25/10/2017) - (25/10/2018)
    const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJhZG1pbiIsInBhc3N3b3JkIjoiYWRtaW4iLCJpYXQiOjE1MDg4OTIwMTgsImV4cCI6MTU0MDQyODAxOH0.EtajOb9-Tc5rrS8Ct3nOdvo61QEZJH_v1sjDgG9OmC4'
    const user = "ADItestADI"
    const pass = "ADItestADI"
    const url = "ADItestADI"
    const title = "ADItestADI"

    describe('Test GET /users', function() {
        before(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(? , ?)', [user, pass], function(){
                done()
            })
        })
        after(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function(){
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            request(app)
            .get('/users')
            .expect(401, done)
        })
        it('Al estar logueado', function(done) {
            request(app)
            .get('/users')
            .set('Authorization', token)
            .expect(200, done)
        })
    })
    
    describe('Test POST /users', function() {
        beforeEach(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function(){
                done()
            })
        })
        afterEach(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function(){
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            request(app)
            .post('/users')
            .send({
                "username" : user,
                "password" : pass
            })
            .expect(201, done)
        })
        it('Al estar logueado', function(done) {
            request(app)
            .post('/users')
            .send({
                "username" : user,
                "password" : pass
            })
            .set('Authorization', token)
            .expect(201, done)
        })
    })

    describe('Test GET /users/:id', function() {
        before(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(? , ?)', [user, pass], function(){
                done()
            })
        })
        after(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function(){
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                if(response.length>0){
                    request(app)
                    .get('/users/'+response[0].id)
                    .expect(401, done)
                }
            })
        })
        it('Al estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                request(app)
                .get('/users/'+response[0].id)
                .set('Authorization', token)
                .expect(200, done)
            })
        })
    })

    describe('Test PUT /users/:id', function() {
        beforeEach(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(? , ?)', [user, pass], function(){
                done()
            })
        })
        afterEach(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function(){
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                request(app)
                .put('/users/'+response[0].id)
                .send({
                    "username" : user,
                    "password" : pass
                })
                .expect(401, done)
            })
        })
        it('Al estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                request(app)
                .put('/users/'+response[0].id)
                .set('Authorization', auth.createToken(response[0].id, user, pass))
                .send({
                    "username" : user,
                    "password" : pass
                })
                .expect(200, done)
            })
        })
    })

    describe('Test DELETE /users/:id', function() {
        beforeEach(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(? , ?)', [user, pass], function(){
                done()
            })
        })
        afterEach(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function() {
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                request(app)
                .delete('/users/'+response[0].id)
                .send({
                    "username" : user,
                    "password" : pass
                })
                .expect(401, done)
            })
        })
        it('Al estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                request(app)
                .delete('/users/'+response[0].id)
                .set('Authorization', auth.createToken(response[0].id, user, pass))
                .send({
                    "username" : user,
                    "password" : pass
                })
                .expect(204, done)
            })
        })
    })

    describe('Test GET /users/:id/photos', function() {
        var idUser
        before(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(?,?)', [user, pass], function(){
                excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                    idUser = response[0].id
                    excuteQuery('INSERT INTO photos(idUser, url, title) VALUES(?, ?, ?)', 
                                [idUser, url, title], function() {
                        done()
                    })
                })
            })
        })
        after(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function() {
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            request(app)
            .get('/users/'+ idUser +'/photos')
            .expect(401, done)
        })
        it('Al estar logueado', function(done) {
            request(app)
            .get('/users/'+ idUser +'/photos')
            .set('Authorization', token)
            .expect(200, done)
        })
    })

    describe('Test GET /users/:id/photos/:idPhoto', function() {
        var idUser
        before(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(?,?)', [user, pass], function(){
                excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                    idUser = response[0].id
                    excuteQuery('INSERT INTO photos(idUser, url, title) VALUES(?, ?, ?)', 
                                [idUser, url, title], function() {
                        done()
                    })
                })
            })
        })
        after(function(done){
            excuteQuery('DELETE FROM users WHERE username=\"test\"', function() {
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            excuteQuery('SELECT id FROM photos WHERE idUser=?', [idUser], function(response) {
                request(app)
                .get('/users/'+ idUser +'/photos/' + response[0].id)
                .expect(401, done)
            })
        })
        it('Al estar logueado', function(done) {
            excuteQuery('SELECT id FROM photos WHERE idUser=?', [idUser], function(response) {
                request(app)
                .get('/users/'+ idUser +'/photos/' + response[0].id)
                .set('Authorization', token)
                .expect(200, done)
            })
        })
    })

    describe('Test POST /users/:id/photos', function() {
        before(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(?, ?)', [user, pass], function(){
                done()
            })
        })
        after(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function() {
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                request(app)
                .post('/users/'+ response[0].id + '/photos')
                .send({
                    "url" : url,
                    "title" : title
                })
                .expect(401, done)
            })
        })
        it('Al estar logueado', function(done) {
            excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                request(app)
                .post('/users/'+ response[0].id + '/photos')
                .send({
                    "url" : url,
                    "title" : title
                })
                .set('Authorization', auth.createToken(response[0].id, user, pass))
                .expect(201, done)
            })
        })
    })

    describe('Test PUT /users/:id/photos/:idPhoto', function() {
        var idUser
        beforeEach(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(?,?)', [user, pass], function(){
                excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                    idUser = response[0].id
                    excuteQuery('INSERT INTO photos(idUser, url, title) VALUES(?, ?, ?)', 
                                [idUser, url, title], function() {
                        done()
                    })
                })
            })
        })
        afterEach(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function() {
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            excuteQuery('SELECT id FROM photos WHERE idUser=?', [idUser], function(response) {
                request(app)
                .put('/users/'+idUser+'/photos/'+response[0].id)
                .send({
                    "url" : url,
                    "title" : title
                })
                .expect(401, done)
            })
        })
        it('Al estar logueado', function(done) {
            excuteQuery('SELECT id FROM photos WHERE idUser=?', [idUser], function(response) {
                request(app)
                .put('/users/'+idUser+'/photos/'+response[0].id)
                .set('Authorization', auth.createToken(idUser, user, pass))
                .send({
                    "url" : url,
                    "title" : title
                })
                .expect(200, done)
            })
        })
    })

    describe('Test DELETE /users/:id/photos/:idPhoto', function() {
        var idUser
        beforeEach(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(?,?)',[user, pass], function(){
                excuteQuery('SELECT id FROM users WHERE username=?', [user], function(response) {
                    idUser = response[0].id
                    excuteQuery('INSERT INTO photos(idUser, url, title) VALUES(?, ?, ?)', 
                                [idUser, url, title], function() {
                        done()
                    })
                })
            })
        })
        afterEach(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function() {
                done()
            })
        })

        it('Al no estar logueado', function(done) {
            excuteQuery('SELECT id FROM photos WHERE idUser=?', [idUser], function(response) {
                request(app)
                .delete('/users/'+idUser+'/photos/'+response[0].id)
                .expect(401, done)
            })
        })
        it('Al estar logueado', function(done) {
            excuteQuery('SELECT id FROM photos WHERE idUser=?', [idUser], function(response) {
                request(app)
                .delete('/users/'+idUser+'/photos/'+response[0].id)
                .set('Authorization', auth.createToken(idUser, user, pass))
                .expect(204, done)
            })
        })
    })

    describe('Test LOGIN /login', function() {
        beforeEach(function(done){
            excuteQuery('INSERT INTO users(username, password) VALUES(?,?)',[user, pass], function(){
                done()
            })
        })
        afterEach(function(done){
            excuteQuery('DELETE FROM users WHERE username=?', [user], function() {
                done()
            })
        })

        it('Login de un usuario que no existe', function(done) {
            excuteQuery('DELETE FROM users WHERE username=?', [user], function() {
                request(app)
                .post('/login')
                .send({
                    "username" : user,
                    "password" : pass
                })
                .expect(401, done)
            })
        })
        it('Login de un usuario con malas credenciales', function(done) {
            request(app)
            .post('/login')
            .send({
                "username" : user,
                "password" : pass + pass
            })
            .expect(401, done)
        })
        it('Login de un usuario correcto', function(done) {
            request(app)
            .post('/login')
            .send({
                "username" : user,
                "password" : pass
            })
            .expect(200, done)
        })
    })
})

function excuteQuery(query, params, callback){
    mysqlPool.getConnection(function(err, db) {
        if(!err){
            db.query(query, params, function(err, response) {
                callback(response)
            })
        } else{
            console.log(err)
        }
        db.release()
    })
}