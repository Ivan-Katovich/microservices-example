const express = require('express');
const path = require('path');
const middlewareLogger = require('morgan');
const CustomLogger = require('./public/javascripts/support/log');
const ServiceRegistry = require('./public/javascripts/lib/serviceRegistry');
const serviceRegistry = new ServiceRegistry(CustomLogger.logger);

const indexRouter = require('./routes');
const usersRouter = require('./routes/users');

const service = express();

service.use(middlewareLogger('dev'));

service.use(express.json());
service.use(express.urlencoded({ extended: false }));
service.use(express.static(path.join(__dirname, 'public')));

service.put('/register/:servicename/:serviceversion/:serviceport', (req, res) => {
    const {servicename, serviceversion, serviceport} = req.params;
    const serviceip = req.socket.remoteAddress.includes('::') ?
        `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;
    const serviceKey = serviceRegistry.register(servicename, serviceversion, serviceip, serviceport);
    return res.json({result: serviceKey});
})

service.delete('/register/:servicename/:serviceversion/:serviceport', (req, res) => {
    const {servicename, serviceversion, serviceport} = req.params;
    const serviceip = req.socket.remoteAddress.includes('::') ?
        `[${req.socket.remoteAddress}]` : req.socket.remoteAddress;
    const serviceKey = serviceRegistry.unregister(servicename, serviceversion, serviceip, serviceport);
    return res.json({result: serviceKey});
})

service.get('/find/:servicename/:serviceversion', (req, res) => {
    const {servicename, serviceversion} = req.params;
    const svc = serviceRegistry.get(servicename, serviceversion);
    if (!svc) return res.status(404).json({result: 'Service not found'});
    return res.json(svc);
})

service.use('/', indexRouter);
service.use('/users', usersRouter);

module.exports = service;
