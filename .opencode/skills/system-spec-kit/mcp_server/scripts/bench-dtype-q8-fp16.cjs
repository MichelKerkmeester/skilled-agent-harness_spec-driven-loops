#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// BENCH: hf-model-server dtype comparison (q8 vs fp16) — 031/005
// ───────────────────────────────────────────────────────────────
// Spawns the REAL hf-model-server twice (HF_EMBEDDINGS_DTYPE=q8 then fp16) against a cached
// onnx model, embeds a fixed fixture, and reports per-request p50/p95 (from /api/health.timing)
// plus a cosine-recall delta between the two dtypes. Numbers gate the device-aware DEFAULT_DTYPE
// decision (REQ-006) — DO NOT change DEFAULT_DTYPE without a measured fp16/MPS win.
//
// SAFETY: this bench NEVER opens the live memory DB — it benches embed latency on an in-process
// text fixture only. If recall were ever extended to real corpus rows, copy the DB first
// (fs.copyFileSync) and open ONLY the copy; never open mcp_server/database read-write.
//
// SELF-SKIP: in a checkout where the model cannot load (e.g. onnxruntime-common unresolvable in
// the @huggingface/transformers tree, the current state of this repo), the server reports
// state==='error'; this script prints a skip notice and exits 0 so it is CI-safe.
//
// Usage: node bench-dtype-q8-fp16.cjs [--model <hf-id>] [--cap-ms <n>]

'use strict';

const { spawn } = require('node:child_process');
const { request } = require('node:http');
const { existsSync, mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join } = require('node:path');

const SERVER = join(__dirname, '..', '..', '..', '..', 'bin', 'hf-model-server.cjs');
const MODEL = argValue('--model') || 'onnx-community/embeddinggemma-300m-ONNX';
const READY_CAP_MS = Number.parseInt(argValue('--cap-ms') || '120000', 10);
const FIXTURE = [
  'The quick brown fox jumps over the lazy dog.',
  'Embedding models map text into dense vectors.',
  'Local inference avoids cloud egress and keeps data on device.',
  'Quantization trades a little accuracy for speed and memory.',
];

function argValue(flag) {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

function httpJson(socketPath, method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? undefined : Buffer.from(JSON.stringify(body));
    const req = request(
      { socketPath, method, path, timeout: 30000,
        headers: payload ? { 'content-type': 'application/json', 'content-length': payload.length } : {} },
      (res) => {
        const chunks = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          let parsed = text;
          try { parsed = text ? JSON.parse(text) : ''; } catch { /* text */ }
          resolve({ status: res.statusCode, body: parsed });
        });
      },
    );
    req.on('error', reject);
    req.on('timeout', () => req.destroy(new Error('request timeout')));
    if (payload) req.write(payload);
    req.end();
  });
}

async function waitReady(socketPath, capMs) {
  const deadline = Date.now() + capMs;
  while (Date.now() < deadline) {
    if (existsSync(socketPath)) {
      try {
        const h = await httpJson(socketPath, 'GET', '/api/health');
        const state = h.body && h.body.state;
        if (state === 'ready') return 'ready';
        if (state === 'error') return 'error';
      } catch { /* keep polling */ }
    }
    await sleep(500);
  }
  return 'timeout';
}

function cosine(a, b) {
  let dot = 0; let na = 0; let nb = 0;
  for (let i = 0; i < a.length; i += 1) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
  return na && nb ? dot / (Math.sqrt(na) * Math.sqrt(nb)) : 0;
}

async function benchDtype(dtype) {
  const dir = mkdtempSync(join(tmpdir(), `bench-${dtype}-`));
  const socketPath = join(dir, 'hf-embed.sock');
  const child = spawn(process.execPath, [SERVER], {
    env: { ...process.env, HF_EMBED_SERVER_URL: `unix://${socketPath}`, HF_EMBEDDINGS_MODEL: MODEL, HF_EMBEDDINGS_DTYPE: dtype },
    stdio: 'ignore',
  });
  try {
    const state = await waitReady(socketPath, READY_CAP_MS);
    if (state !== 'ready') {
      return { dtype, skipped: true, state };
    }
    const vectors = [];
    for (const text of FIXTURE) {
      const res = await httpJson(socketPath, 'POST', '/api/embed', { model: MODEL, input: [text] });
      if (res.status !== 200) throw new Error(`embed failed (${res.status}): ${JSON.stringify(res.body)}`);
      vectors.push(res.body.embeddings[0]);
    }
    const health = await httpJson(socketPath, 'GET', '/api/health');
    const timing = (health.body && health.body.timing) || {};
    return { dtype, skipped: false, p50Ms: timing.p50Ms, p95Ms: timing.p95Ms, count: timing.count, vectors };
  } finally {
    try { child.kill('SIGKILL'); } catch { /* dead */ }
    try { rmSync(dir, { recursive: true, force: true }); } catch { /* best effort */ }
  }
}

async function main() {
  console.log(`[bench-dtype] model=${MODEL} fixture=${FIXTURE.length} rows; spawning q8 then fp16...`);
  const q8 = await benchDtype('q8');
  if (q8.skipped) {
    console.log(`[bench-dtype] MODEL-LESS: server state='${q8.state}' (model could not load — e.g. unresolvable onnxruntime-common). Skipping; numbers gate the DEFAULT_DTYPE decision and are deferred to a working-onnxruntime host. exit 0`);
    return;
  }
  const fp16 = await benchDtype('fp16');
  if (fp16.skipped) {
    console.log(`[bench-dtype] q8 ran but fp16 state='${fp16.state}'; cannot compare. exit 0`);
    return;
  }
  const recall = q8.vectors.map((v, i) => cosine(v, fp16.vectors[i]));
  const meanRecall = recall.reduce((s, x) => s + x, 0) / recall.length;
  console.log(JSON.stringify({
    model: MODEL,
    q8: { p50Ms: q8.p50Ms, p95Ms: q8.p95Ms, count: q8.count },
    fp16: { p50Ms: fp16.p50Ms, p95Ms: fp16.p95Ms, count: fp16.count },
    meanCosineRecall_q8_vs_fp16: meanRecall,
    note: 'Only make DEFAULT_DTYPE device-aware if fp16/MPS beats q8 on p50/p95 with acceptable recall (>=~0.98).',
  }, null, 2));
}

main().catch((err) => {
  console.error(`[bench-dtype] error: ${err && err.message ? err.message : err}`);
  process.exit(1);
});
