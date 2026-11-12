// ───────────────────────────────────────────────────────────────────
// MODULE: EMBEDDER COST MEASUREMENT
// ───────────────────────────────────────────────────────────────────
//
// Records what the local embedder costs so a reader can reproduce the numbers
// the install guides quote. The server probes read the Ollama version, the
// model's size on disk, the loaded size and expiry and the resident memory of
// `ollama serve` and its model runner. The embedding section then times the
// query embedding the scoring path sends, 30 times, through the shared
// adapter, and keeps the first call apart so a cold start has its own number.
// A final section times five end-to-end `advisor_recommend` calls, so the same
// run also reports the wait a prompt hook pays for a route.
// The run writes, starts and unloads nothing: a cold sample loads the model as
// any first query would, and Ollama's own idle timer unloads it later.
//
// Usage:
//   node measure-embedder-cost.mjs    # print one JSON object to stdout
//
// A server that does not answer leaves every number unreachable, so the run
// stops there with exit 2 and names the URL it tried.

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import { execFileSync, spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { OllamaAdapter } from '../../../system-spec-kit/shared/dist/embeddings/adapters/ollama.js';
import { getManifest } from '../../../system-spec-kit/shared/dist/embeddings/registry.js';

// ───────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const MODEL_NAME = 'nomic-embed-text:v1.5';
const MODEL_MANIFEST = 'nomic-embed-text-v1.5';
const DEFAULT_BASE_URL = 'http://127.0.0.1:11434';
const PROBE_TIMEOUT_MS = 5000;
const WARM_SAMPLE_COUNT = 30;
const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '../../../../..');
const CLI_PATH = resolve(REPO_ROOT, '.skilled/bin/skill-advisor.cjs');
const CLI_TIMEOUT_MS = 120000;
const CLI_PROMPTS = [
  'review this pull request for type safety',
  'debug the failing scorer test',
  'write a guide for the install step',
  'design a chart for the cost table',
  'plan the release checklist order',
];

// ───────────────────────────────────────────────────────────────────
// 3. SERVER PROBES
// ───────────────────────────────────────────────────────────────────

function ollamaBaseUrl() {
  const configured = process.env.OLLAMA_BASE_URL?.trim();
  return (configured && configured.length > 0 ? configured : DEFAULT_BASE_URL).replace(/\/+$/, '');
}

async function getJson(url) {
  const response = await fetch(url, { signal: AbortSignal.timeout(PROBE_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`GET ${url} returned HTTP ${response.status}`);
  return response.json();
}

// The size on disk belongs to the pulled model, not to the loaded copy, so it
// comes from `/api/tags`. A missing tag makes the measurement impossible and is
// reported rather than printed as a null a reader could mistake for zero.
function modelFromTags(tags) {
  const listed = Array.isArray(tags?.models) ? tags.models : [];
  const model = listed.find((entry) => entry?.name === MODEL_NAME);
  if (!model) throw new Error(`${MODEL_NAME} is not in GET /api/tags`);
  return { name: model.name, sizeBytes: model.size ?? null };
}

// `/api/ps` lists one entry per loaded model and keeps the loaded copy's size
// apart from the size on disk. No matching entry means the model is unloaded,
// which is a state the cost reader has to see rather than an error.
function loadedFromPs(ps) {
  const listed = Array.isArray(ps?.models) ? ps.models : [];
  const model = listed.find((entry) => entry?.name === MODEL_NAME);
  if (!model) return null;
  return {
    name: model.name,
    sizeBytes: model.size ?? null,
    sizeVramBytes: model.size_vram ?? null,
    expiresAt: model.expires_at ?? null,
  };
}

// `ps -axo` prints one row per process, with the command last so it may hold
// spaces. A wrapper shell that mentions `ollama serve` in its own command line
// is excluded by requiring the executable at the start of the row to be ollama,
// not merely by finding that text later in it.
function processRows() {
  const output = execFileSync('ps', ['-axo', 'pid,rss,command'], { encoding: 'utf8' });
  const rows = [];
  for (const line of output.split('\n')) {
    const match = /^\s*(\d+)\s+(\d+)\s+(.*)$/.exec(line);
    if (match === null) continue;
    rows.push({ pid: Number(match[1]), rssKb: Number(match[2]), command: match[3] });
  }
  return rows;
}

function memoryFromProcesses(rows) {
  const serve = rows.find((row) => /^\S*ollama\s+serve(?:\s|$)/.test(row.command));
  const runner = rows.find((row) => /(?:^|\/)llama-server(?:\s|$)/.test(row.command) || /\bollama\s+runner(?:\s|$)/.test(row.command));
  return {
    servePid: serve?.pid ?? null,
    serveRssKb: serve?.rssKb ?? null,
    runnerPid: runner?.pid ?? null,
    runnerRssKb: runner?.rssKb ?? null,
  };
}

async function measureServer() {
  const baseUrl = ollamaBaseUrl();
  let version;
  try {
    const payload = await getJson(`${baseUrl}/api/version`);
    version = typeof payload?.version === 'string' ? payload.version : null;
  } catch {
    process.stderr.write(`ollama server not answering at ${baseUrl}\n`);
    process.exit(2);
  }

  const [tags, ps] = await Promise.all([getJson(`${baseUrl}/api/tags`), getJson(`${baseUrl}/api/ps`)]);
  return {
    server: { url: baseUrl, version },
    model: modelFromTags(tags),
    loaded: loadedFromPs(ps),
    memory: memoryFromProcesses(processRows()),
  };
}

// ───────────────────────────────────────────────────────────────────
// 4. EMBEDDING MEASUREMENT
// ───────────────────────────────────────────────────────────────────

// Percentiles use the nearest-rank definition the runtime metrics report with,
// so a p95 here and a p95 in a routing capture count the same way.
function percentile(values, fraction) {
  const sorted = [...values].sort((a, b) => a - b);
  const rank = Math.min(sorted.length - 1, Math.ceil(fraction * sorted.length) - 1);
  return sorted[rank];
}

function roundMs(value) {
  return Number(value.toFixed(2));
}

function summariseSamples(samples) {
  return {
    n: samples.length,
    medianMs: roundMs(percentile(samples, 0.5)),
    p95Ms: roundMs(percentile(samples, 0.95)),
  };
}

async function embedOnce(adapter, text) {
  const started = performance.now();
  await adapter.embed([text], { inputType: 'query' });
  return performance.now() - started;
}

// The first call is measured on its own. When the model was unloaded it pays the
// load and is the cold number, and when it was already loaded it is a discarded
// warm-up, so the 30 timed calls that follow are warm samples in either state.
// Distinct texts keep a repeated query from measuring a repeat-hit shortcut
// instead of the embedding path a real prompt takes.
async function measureEmbeddings(baseUrl, startedCold) {
  const manifest = getManifest(MODEL_MANIFEST);
  if (manifest === undefined) throw new Error(`embedder manifest ${MODEL_MANIFEST} is not registered`);
  const adapter = new OllamaAdapter(manifest, { baseUrl });

  const firstCallMs = roundMs(await embedOnce(adapter, 'measure the embedder cost 0'));
  const samples = [];
  for (let index = 1; index <= WARM_SAMPLE_COUNT; index += 1) {
    samples.push(await embedOnce(adapter, `measure the embedder cost ${index}`));
  }

  return {
    warm: summariseSamples(samples),
    cold: startedCold ? { firstCallMs } : null,
    coldReason: startedCold ? null : 'model already loaded',
  };
}

// ───────────────────────────────────────────────────────────────────
// 5. CLI MEASUREMENT
// ───────────────────────────────────────────────────────────────────

// Each call spawns the CLI the prompt hook spawns, so the number includes the
// process start, the daemon round trip and the scoring, which is the wait a user
// of the hook pays. Distinct prompts keep a repeat-hit shortcut out of the
// timing and cover more of the scorer than one sentence would.
function measureCliOnce(prompt) {
  const started = performance.now();
  const result = spawnSync(
    process.execPath,
    [CLI_PATH, 'advisor_recommend', '--json', JSON.stringify({ prompt }), '--format', 'json'],
    { cwd: REPO_ROOT, encoding: 'utf8', timeout: CLI_TIMEOUT_MS },
  );
  const elapsedMs = performance.now() - started;
  if (result.error) throw new Error(`advisor_recommend failed: ${result.error.message}`);
  if (result.status !== 0) {
    const detail = (result.stderr ?? '').trim().split('\n')[0];
    throw new Error(`advisor_recommend exited ${result.status}${detail.length > 0 ? `: ${detail}` : ''}`);
  }
  return elapsedMs;
}

function measureCli() {
  const samples = CLI_PROMPTS.map((prompt) => roundMs(measureCliOnce(prompt)));
  return { ms: samples, medianMs: roundMs(percentile(samples, 0.5)) };
}

// ───────────────────────────────────────────────────────────────────
// 6. CLI ENTRY
// ───────────────────────────────────────────────────────────────────

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const measured = await measureServer();
    // An unloaded model is the only state in which the next embed pays the load,
    // so it is also the only state where the serve memory is still idle.
    const startedCold = measured.loaded === null;
    const embeddings = await measureEmbeddings(measured.server.url, startedCold);
    const cost = {
      server: measured.server,
      model: measured.model,
      loaded: measured.loaded,
      memory: measured.memory,
      idle: startedCold ? { serveRssKb: measured.memory.serveRssKb } : null,
      warm: embeddings.warm,
      cold: embeddings.cold,
      coldReason: embeddings.coldReason,
      cli: measureCli(),
    };
    console.log(JSON.stringify(cost, null, 2));
  } catch (error) {
    process.stderr.write(`measure-embedder-cost.mjs: ${error.message}\n`);
    process.exit(2);
  }
}
