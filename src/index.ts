import http from 'http';
import os from 'os';
import cluster from 'cluster';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import methodOverride from 'method-override';
import cors from 'cors';

import config from 'config';
import { error, init, start } from 'middleware';
import { DeelService } from 'services';
import Routes from './routes';

const test = config.value.env === 'test';

const cpus = os.cpus().length;

export let server: http.Server;

export const run = async () => {
  let exitStarted: boolean;

  const port = config.value.port;

  // App

  const app = express();

  app.set('subdomain offset', 1);

  app.set('trust proxy', true);

  // start
  app.use(start);

  app.set('json spaces', 2);

  // Improves security by updating outgoing request headers
  // to prevent spoofing on sensitive values
  app.use(helmet());

  // Enables gziping responses if allowed to
  app.use(compression());

  // Enables PUT, DELETE methods for browsers
  // that don't support them
  app.use(methodOverride());

  // Allows incoming requests from any origin
  // public api
  app.use(cors({
    origin: '*'
  }));

  // limit
  // Todo: add middleware to handle throttling the api usage for attacks or spam, that reaches the api
  // app.use(limit);

  // Middleware body parsers for POST, PUT requests
  // to parse form, json data
  app.use(express.urlencoded({
    limit: config.value.limits.request,
    extended: true
  }));

  app.use(express.json({
    limit: config.value.limits.request
  }));

  // Services

  // In test environment we will manually
  // start the db, and end it
  if (!test) {
    // mysql
    // await mongo.connection;

    // init
    await DeelService.init();
  }

  // Process

  const clean = async () => {
    try {
      // mysql
      // await mongo.disconnect;
    }
    catch (error) {
      console.warn('Clean', error);
    }
  };

  const exit = (type: string) => async () => {
    // console.log(`!@ Exit`, type);

    // Multiple exit, teardown signals can be received
    // at the same time, and we only need to exit once
    if (!exitStarted) {
      exitStarted = true;

      // console.log(`Exiting pid`, process.pid);

      await clean();

      process.exit(0);
    }
  };

  // Process errors

  process.on('unhandledRejection', error => {
    console.warn('!@ Unhandled rejection', error);

    exit('Unhandled rejection');
  });

  process.on('uncaughtException', error => {
    console.warn('!@ Unhandled exception', error);

    exit('Unhandled exception');
  });

  process.on('message', async (message: string) => {
    if (message === 'shutdown') exit('Shutdown message');
  });

  process.on('SIGINT', exit('SIGINT'));

  process.on('SIGTERM', exit('SIGTERM'));

  // process.on('exit', (code: string) => console.log(`@ Exit process`, code));

  // Server errors

  app.on('error', async (error: any) => {
    switch (error.code) {
      case 'EACCES':
        console.error(`${port} requires elevated priviliges`);

        break;

      case 'EADDRINUSE':
        console.error(`${port} is already in use`);

        break;

      // Other unhanled errors
      default:
        throw error;
    }

    await exit('App error');

    // Exit the process
    process.exit(1);
  });

  // Main

  // init
  app.use(init);

  // routes
  Routes(app);

  // error
  app.use(error);

  const httpServer = http.createServer(app);

  // Listen
  server = httpServer.listen(port, () => console.info(`api started 🌱 \nport: ${port}\npid: ${process.pid}\n`));
};

// With clustering
// or better use pm2 as the process manager
// or custom implementation below
if (cluster.isPrimary) {
  // Create a server for each CPU as forked process
  for (let i = 0; i < cpus; i++) cluster.fork();

  cluster.on('online', function (worker) {
    console.log(`Worker, pid: ${worker.process.pid} started`);
  });

  cluster.on('exit', function (worker, code, signal) {
    console.log(`Worker, pid: ${worker.process.pid} closed`);
  });
}
else {
  run();
}

// Without clustering
// run();
