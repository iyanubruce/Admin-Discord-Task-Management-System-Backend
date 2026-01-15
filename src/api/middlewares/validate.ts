import { ZodObject, ZodError } from "zod";
import { Request, Response, NextFunction } from "express";

type ValidationSchema = {
  body?: ZodObject<any>;
  params?: ZodObject<any>;
  query?: ZodObject<any>;
};

export const validate = (schema: ValidationSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const allErrors: Array<{ field: string; message: string }> = [];

      const isRequired = (zodSchema: any, key: string) => {
        return !zodSchema.shape[key].isOptional();
      };

      // Check for invalid fields in body
      if (schema.body && req.body && Object.keys(req.body).length > 0) {
        const validBodyFields = Object.keys(schema.body.shape);
        const bodyKeys = Object.keys(req.body);
        const invalidBodyKeys = bodyKeys.filter(
          (k) => !validBodyFields.includes(k)
        );

        if (invalidBodyKeys.length > 0) {
          allErrors.push({
            field: "body",
            message: `Invalid field(s) in body: '${invalidBodyKeys.join(
              "', '"
            )}'. Valid fields for body are: ${validBodyFields.join(", ")}`,
          });
        }
      }

      // Check for invalid fields in query
      if (schema.query && req.query && Object.keys(req.query).length > 0) {
        const validQueryFields = Object.keys(schema.query.shape);
        const queryKeys = Object.keys(req.query);
        const invalidQueryKeys = queryKeys.filter(
          (k) => !validQueryFields.includes(k)
        );

        if (invalidQueryKeys.length > 0) {
          allErrors.push({
            field: "query",
            message: `Invalid field(s) in query: '${invalidQueryKeys.join(
              "', '"
            )}'. Valid fields for query are: ${validQueryFields.join(", ")}`,
          });
        }
      }

      // Check for missing required fields in body
      if (schema.body && (!req.body || Object.keys(req.body).length === 0)) {
        const bodyShape = schema.body.shape;
        const requiredFields = Object.keys(bodyShape)
          .filter((key) => isRequired(schema.body!, key))
          .map((key) => ({
            field: key,
            message: `${key} is required`,
          }));

        if (requiredFields.length > 0) {
          allErrors.push(
            ...requiredFields.map((f) => ({ ...f, field: `body.${f.field}` }))
          );
        }
      }

      // Check for missing required fields in query
      if (schema.query && (!req.query || Object.keys(req.query).length === 0)) {
        const queryShape = schema.query.shape;
        const requiredFields = Object.keys(queryShape)
          .filter((key) => isRequired(schema.query!, key))
          .map((key) => ({
            field: key,
            message: `${key} is required`,
          }));

        if (requiredFields.length > 0) {
          allErrors.push(
            ...requiredFields.map((f) => ({ ...f, field: `query.${f.field}` }))
          );
        }
      }

      // If there are invalid or missing fields, return them all at once
      if (allErrors.length > 0) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed. Please check your inputs.",
          data: allErrors,
        });
      }

      // Validate with Zod (for type validation, not structure)

      if (schema.body) {
        schema.body.parse(req.body);
      }

      if (schema.params) {
        schema.params.parse(req.params);
      }

      if (schema.query) {
        schema.query.parse(req.query);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((err) => ({
          field: err.path.join(".") || "unknown",
          message: err.message,
        }));

        return res.status(400).json({
          status: "error",
          message: "Validation failed. Please check your inputs.",
          data: errors,
        });
      }
      next(error);
    }
  };
};
