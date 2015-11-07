﻿'use strict';
var azure = require('azure-storage'),
    fs = require('fs'),
    path = require('path'),
    when = require('when'),
    nodefn = require('when/node'),
    options = {};


function azurestore(config){
    options = config || {};
    options.connectionString = options.connectionString || process.env.AZURE_STORAGE_CONNECTION_STRING;
};

azurestore.prototype.save = function (image) {
    var fileService = azure.createBlobService(options.connectionString);
    var uniqueName = new Date().getMonth() +"/" + new Date().getFullYear()+"/"+ image.name;
    return nodefn.call(fileService.createContainerIfNotExists.bind(fileService), 'ghost', {publicAccessLevel: 'blob'})
    .then(nodefn.call(fileService.createBlockBlobFromLocalFile.bind(fileService), 'ghost', uniqueName, image.path))
    .then(function(){
        return fileService.getUrl('ghost', uniqueName);
    });
};

azurestore.prototype.serve = function () {
    return function (req, res, next) {
        next();
    };
};




module.exports = azurestore;