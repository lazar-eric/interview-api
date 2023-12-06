import express from 'express';

import { Routes } from '@amaui/api';

import RootRoute from './root.route';
import MediaRoute from './media.route';
import InvoiceRoute from './invoice.route';
import ContractRoute from './contract.route';

const routes = [
  RootRoute,
  MediaRoute,
  InvoiceRoute,
  ContractRoute
];

// Register all the routes
export default function (app: express.Application) {
  // Moves through all class definitions
  // and extracts all the routes details
  // attached to it by reference
  // and appends each as a route
  // to the app
  Routes(routes, app);
}
