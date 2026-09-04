#!/usr/bin/env node
// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ TEST HARNESS: hf-model-server shutdown-signal subprocess                   ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ Spawned as a real child process by hf-model-server-shutdown.vitest.ts so   ║
// ║ the busy-shutdown regression test can send a genuine OS signal and        ║
// ║ observe genuine process exit behavior. Reuses the production module's own ║
// ║ createHfModelServer()/installShutdownHandlers() — the only thing this     ║
// ║ harness supplies is a fake, delay-controllable loadModel so the drill is  ║
// ║ deterministic and network-independent (no real onnx model download).     ║
// ╚══════════════════════════════════════════════════════════════════════════╝

'use strict';

const path = require('path');

const serverModule = require(path.resolve(__dirname, '..', '..', '..', '..', '..', '..', 'bin', 'hf-model-server.cjs'));

const loadDelayMs = Number.parseInt(process.env.TEST_HF_FAKE_LOAD_DELAY_MS || '0', 10);
const embedDelayMs = Number.parseInt(process.env.TEST_HF_FAKE_EMBED_DELAY_MS || '0', 10);

async function fakeLoadModel() {
  if (loadDelayMs > 0) {
    await new Promise((resolve) => setTimeout(resolve, loadDelayMs));
  }
  const extractor = async (input) => {
    if (embedDelayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, embedDelayMs));
    }
    const texts = Array.isArray(input) ? input : [input];
    const dim = 3;
    const data = new Float32Array(texts.length * dim).fill(1);
    return Array.isArray(input) ? { data, dims: [texts.length, dim] } : { data };
  };
  extractor.dispose = async () => undefined;
  extractor.model = { sessions: { main: {} } };
  return { extractor, device: 'cpu', loadTimeMs: loadDelayMs };
}

async function run() {
  const app = serverModule.createHfModelServer({ loadModel: fakeLoadModel, selfWarm: false });
  const handle = await app.listen();
  process.stderr.write(`[test-harness] listening at ${handle.endpoint}\n`);
  serverModule.installShutdownHandlers(app);
}

run().catch((error) => {
  process.stderr.write(`[test-harness] ${error.stack || error.message}\n`);
  process.exitCode = 1;
});
