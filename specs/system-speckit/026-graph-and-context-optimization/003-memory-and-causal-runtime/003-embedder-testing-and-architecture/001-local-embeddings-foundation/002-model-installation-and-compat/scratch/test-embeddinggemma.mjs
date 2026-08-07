import { pipeline } from '@huggingface/transformers';
const t0 = Date.now();
let pipe, errMsg = null;
try {
  pipe = await pipeline('feature-extraction', 'google/embeddinggemma-300m', { dtype: 'fp32' });
} catch (e) {
  errMsg = e.message || String(e);
}
const loadMs = Date.now() - t0;

if (errMsg) {
  console.log(JSON.stringify({ load_ms: loadMs, error: errMsg.slice(0, 800) }));
  process.exit(1);
}

const t1 = Date.now();
const out = await pipe('hello world', { pooling: 'mean', normalize: true });
const encodeMs = Date.now() - t1;

const data = out.data instanceof Float32Array ? out.data : new Float32Array(out.data);
const norm = Math.sqrt(Array.from(data).reduce((s, x) => s + x * x, 0));

console.log(JSON.stringify({
  load_ms: loadMs,
  encode_ms: encodeMs,
  dims: Array.from(out.dims),
  first5: Array.from(data.slice(0, 5)).map(x => Math.round(x * 1e5) / 1e5),
  norm: Math.round(norm * 1e4) / 1e4
}, null, 2));
