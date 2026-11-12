// Read-only probe of the running Ollama through the shared adapter.
// Usage: node embed-probe.mjs <repo root>
const root = process.argv[2];
const reg = await import(`${root}/.skilled/skills/system-spec-kit/shared/dist/embeddings/registry.js`);
const { OllamaAdapter } = await import(`${root}/.skilled/skills/system-spec-kit/shared/dist/embeddings/adapters/ollama.js`);
const manifest = reg.getManifest('nomic-embed-text-v1.5');

function stats(xs) {
  const s = [...xs].sort((a, b) => a - b);
  const q = (p) => s[Math.min(s.length - 1, Math.ceil(p * s.length) - 1)];
  return { n: s.length, medianMs: +q(0.5).toFixed(2), p95Ms: +q(0.95).toFixed(2), maxMs: +s[s.length - 1].toFixed(2) };
}

async function timed(adapter, text) {
  const t = performance.now();
  try {
    await adapter.embed([text], { inputType: 'query' });
    return { ok: true, ms: performance.now() - t };
  } catch (e) {
    return { ok: false, ms: performance.now() - t, error: e.name, message: String(e.message).slice(0, 120) };
  }
}

const warm = new OllamaAdapter(manifest);
const times = [];
for (let i = 0; i < 30; i++) times.push((await timed(warm, `check the advisor setup ${i}`)).ms);
console.log(JSON.stringify({ case: 'warm', ...stats(times) }));

const absent = new OllamaAdapter(manifest, { baseUrl: 'http://127.0.0.1:9' });
const a = await timed(absent, 'server absent');
console.log(JSON.stringify({ case: 'server_absent', ...a, ms: +a.ms.toFixed(2) }));

const missing = new OllamaAdapter({ ...manifest, ollamaName: 'not-a-pulled-model:v0' });
const m = await timed(missing, 'model not pulled');
console.log(JSON.stringify({ case: 'model_not_pulled', ...m, ms: +m.ms.toFixed(2) }));
console.log(JSON.stringify({ case: 'model_not_pulled_probe', ...(await missing.availability()) }));

const slow = new OllamaAdapter(manifest, { timeoutMs: 1 });
const s = await timed(slow, 'slow call');
console.log(JSON.stringify({ case: 'deadline_1ms', ...s, ms: +s.ms.toFixed(2) }));
