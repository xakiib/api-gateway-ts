import express, { Express, Request, Response } from "express";
import { exposeMetricsEndpoint, recordMetrics } from "./otlp/metrics";
import { Kafka } from "kafkajs";
import { createProxyMiddleware } from "http-proxy-middleware";

const app: Express = express();
const port = 4000;

const authProxy = createProxyMiddleware({
  target: "http://localhost:4003/api/v1/",
  changeOrigin: true,
  pathRewrite: {
    "^/api": "ebdigital", // Replace '/api' with the route prefix you want to remove or modify
    // Additional path rewrite rules, if needed
    // '^/old-route': '/new-route',
  },
  onProxyReq: (proxyReq, request, response) => {
    console.log("im in proxy request");
    console.log(proxyReq.getHeaders());
    proxyReq.setHeader("Authorization", "Bearer your-access-token");
    response.send(JSON.stringify("OK"));
  },

});

app.use("/api", authProxy);


// app.use(exposeMetricsEndpoint, recordMetrics);
app.get("/", async (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});



app.listen(port, async () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
