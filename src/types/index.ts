import express from 'express';

export interface IRequest extends express.Request {
  id: string;

  duration: {
    start: number;
  };

  user: any;
}

export interface IResponse extends express.Response {

}

export interface INext extends express.NextFunction {

}
