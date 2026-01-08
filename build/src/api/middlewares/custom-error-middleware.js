"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customErrorMiddleware = customErrorMiddleware;
function customErrorMiddleware(err, req, res, next) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
}
