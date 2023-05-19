import {
  CompositePropagator,
  W3CTraceContextPropagator,
  W3CBaggagePropagator,
} from '@opentelemetry/core';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { JaegerPropagator } from '@opentelemetry/propagator-jaeger';
import { B3InjectEncoding, B3Propagator } from '@opentelemetry/propagator-b3';
import {
  ExporterConfig,
  PrometheusExporter,
} from '@opentelemetry/exporter-prometheus';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';
import * as process from 'process';

// get the name of the service from the .env file
// import dotenv = require('dotenv');
// const path = `${__dirname}/.env.local`.replace('/dist', '');
// const e = dotenv.config({ path });
// if (e.parsed.OTEL_SERVICE_NAME) {
//   const name: string = e.parsed.OTEL_SERVICE_NAME;
//   process.env['OTEL_SERVICE_NAME'] = name;
// }

const jaegerHost = process.env.JAEGER_HOST || 'localhost';
const metricPort = process.env.METRICS_PORT || '8081';

const config: ExporterConfig = {
  endpoint: `http://${jaegerHost}:14268/api/traces`,
};

console.log('Jaeger: ', config.endpoint);
console.log(`Metrics: localhost:${metricPort}`);

const otelSDK = new NodeSDK({
  metricReader: new PrometheusExporter({
    port: +metricPort,
  }),
  spanProcessor: new BatchSpanProcessor(new JaegerExporter(config)),
  contextManager: new AsyncLocalStorageContextManager(),
  textMapPropagator: new CompositePropagator({
    propagators: [
      new JaegerPropagator(),
      new W3CTraceContextPropagator(),
      new W3CBaggagePropagator(),
      new B3Propagator(),
      new B3Propagator({
        injectEncoding: B3InjectEncoding.MULTI_HEADER,
      }),
    ],
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

export default otelSDK;

// You can also use the shutdown method to gracefully shut down the SDK before process shutdown
// or on some operating system signal.
// process.on('SIGTERM', () => {
//   otelSDK
//     .shutdown()
//     .then(
//       () => console.log('SDK shut down successfully'),
//       (err) => console.log('Error shutting down SDK', err)
//     )
//     .finally(() => process.exit(0));
// });
