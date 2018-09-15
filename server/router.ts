import { Router } from 'express';
import * as fs from 'fs';
import { DB } from './db.model';

import { default as db } from './services.json';

export const router = Router();

router.get('/services', (req, res) => {
  res.json(db);
});

router.post('/save', (req, res) => {
  save(req.body, res);
});

router.post('/delete', (req, res) => {
  deleteService(req.body, res);
});

function save(data, res) {
  if (data.systemId === null) {
    console.log('New service request');
    db.findIndex( (system: DB) => system.name.includes(data.name)) > -1 ? newService(data) : newSystem(data);
  } else {
    existingService(data);
  }
  fs.writeFileSync('./server/services.json', JSON.stringify(db, undefined, 4));
  res.send(db);
}

function newSystem(data) {
  db.push({
    id: db.length + 1,
    name: data.systemName,
    services: [{
      id: 1,
      name: data.serviceName,
      description: data.description,
      url: data.url,
      method: data.method,
      headers: data.headers,
      sampleRequest: data.sampleRequest,
      sampkeResponse: data.sampleResponse
    }]
  });
}

function newService(data) {
  const systemindex = db.findIndex( (system: DB) => system.name === data.name);
  db[systemindex].services.push({
    id: data.serviceId,
    name: data.serviceName,
    description: data.description,
    url: data.url,
    method: data.method,
    headers: data.headers,
    sampleRequest: data.sampleRequest,
    sampleResponse: data.sampleResponse
  });
}

function existingService(data) {
  db.forEach((system: DB, systemindex) => {
    if (system.id === data.systemId) {
      const serviceindex = system.services.findIndex(service => service.id === data.serviceId);
      db[systemindex].id = data.systemId;
      db[systemindex].name = data.systemName;
      db[systemindex].services[serviceindex].id = data.serviceId;
      db[systemindex].services[serviceindex].method = data.method;
      db[systemindex].services[serviceindex].url = data.url;
      db[systemindex].services[serviceindex].headers = data.headers;
      db[systemindex].services[serviceindex].name = data.serviceName;
      db[systemindex].services[serviceindex].sampleRequest = data.sampleRequest;
      db[systemindex].services[serviceindex].sampleResponse = data.sampleResponse;
      db[systemindex].services[serviceindex].description = data.description;
    }
  });
}

function deleteService(req, res) {
  const id = req.id;
  const systemId = id.split('_')[0];
  const serviceId = id.split('_')[1];
  const systemindex = db.findIndex( system => system.id.toString() === systemId.toString());
  const serviceindex = db[systemindex].services.findIndex( service => service.id.toString() === serviceId.toString());
  db[systemindex].services.splice(serviceindex, 1);
  fs.writeFileSync('./server/services.json', JSON.stringify(db, undefined, 4));
  /*db.forEach( (system: DB, systemindex) => {
    console.log('each system');
    console.log(system.id);
    if (system.id === systemId) {
      console.log('system yes');
      system.services.forEach( (service, serviceindex) => {
        if (service.id === serviceId) {
          console.log('service yes');
          db[systemindex].services.splice(serviceindex, 1);
          if (db[systemindex].services.length === 0) {
            db.splice(systemindex, 1);
          }
          console.log(db[systemindex]);
          fs.writeFileSync('./server/services.json', db);
        }
      });
    }
  });*/
  res.send(db);
}