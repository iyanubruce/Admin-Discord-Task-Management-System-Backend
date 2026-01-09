import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidationSchema = {
  body?: ZodObject<any>;
  params?: ZodObject<any>;
  query?: ZodObject<any>;
};

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate body
      if (schema.body) {
        schema.body.parse(req.body);
      }

      // Validate params
      if (schema.params) {
        schema.params.parse(req.params);
      }

      // Validate query
      if (schema.query) {
        schema.query.parse(req.query);
      }

      next();
    } catch (error) {
      next(error); // Let error handler format ZodError
    }
  };
};
