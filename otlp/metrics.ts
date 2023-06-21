import { Request, Response } from "express";
import { NextFunction } from "express";
import { collectDefaultMetrics, register, Gauge } from "prom-client";

// Initialize default metrics
collectDefaultMetrics();

// Define your custom metrics
const apiRequestsTotal = new Gauge({
  name: "api_requests_total",
  help: "Total number of API requests",
});

// Middleware for recording metrics
export function recordMetrics(req: Request, res: Response, next: NextFunction) {
  // Increase the request counter
  apiRequestsTotal.inc();

  next();
}

// Expose Prometheus metrics endpoint
export function exposeMetricsEndpoint(app: any) {
  app.get("/metrics", (req: Request, res: Response) => {
    res.set("Content-Type", register.contentType);
    res.end(register.metrics());
  });
}
