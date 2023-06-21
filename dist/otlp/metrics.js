"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exposeMetricsEndpoint = exports.recordMetrics = void 0;
const prom_client_1 = require("prom-client");
// Initialize default metrics
(0, prom_client_1.collectDefaultMetrics)();
// Define your custom metrics
const apiRequestsTotal = new prom_client_1.Gauge({
    name: "api_requests_total",
    help: "Total number of API requests",
});
// Middleware for recording metrics
function recordMetrics(req, res, next) {
    // Increase the request counter
    apiRequestsTotal.inc();
    next();
}
exports.recordMetrics = recordMetrics;
// Expose Prometheus metrics endpoint
function exposeMetricsEndpoint(app) {
    app.get("/metrics", (req, res) => {
        res.set("Content-Type", prom_client_1.register.contentType);
        res.end(prom_client_1.register.metrics());
    });
}
exports.exposeMetricsEndpoint = exposeMetricsEndpoint;
