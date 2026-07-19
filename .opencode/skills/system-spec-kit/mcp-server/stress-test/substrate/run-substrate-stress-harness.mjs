#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { spawnSync } from 'node:child_process';

const SCRIPT_DIR = path.dirname(new URL(import.meta.url).pathname);
const REPO_ROOT = path.resolve(SCRIPT_DIR, '../../../../../..');
const MEMORY_SERVER_ROOT = path.join(REPO_ROOT, '.opencode/skills/system-spec-kit/mcp-server');
const SANDBOX_RUN_DIR = path.join(REPO_ROOT, '_sandbox/local-llm-query-intelligence');
const SANDBOX_EVIDENCE_DIR = path.join(SANDBOX_RUN_DIR, 'evidence');
const PLAYBOOK_DIR = path.join(
  REPO_ROOT,
  '.opencode/skills/system-spec-kit/manual-testing-playbook/local-llm-query-intelligence',
);
const SUMMARY_TSV = path.join(
  SANDBOX_EVIDENCE_DIR,
  'run-2026-05-14-shared-daemon.summary.tsv',
);
const MEMORY_DAEMON_STDERR_LOG = path.join(
  SANDBOX_EVIDENCE_DIR,
  'run-2026-05-14-shared-daemon.daemon.stderr.log',
);
const CODE_INDEX_DAEMON_STDERR_LOG = path.join(
  SANDBOX_EVIDENCE_DIR,
  'run-2026-05-14-shared-daemon.code-index.stderr.log',
);
// Each spawned daemon needs a SHORT, EXISTING IPC socket directory. The default
// in-database socket path (under mcp-server/database/, ~134 chars from this repo
// root) blows past the macOS sun_path limit (~104 bytes), so the daemon's listen()
// fails with EINVAL and the child dies before the client can connect. os.tmpdir()
// is a short socket root allowed by both daemons (the code-graph server's allowlist
// is cwd / os.tmpdir() / /tmp) and is portable to Linux CI. Each daemon gets its
// own subdir so two daemons never collide on the same daemon-ipc.sock filename, and
// the dir is created up front because listen() on a missing directory also fails
// with EINVAL. Done here so the suite is green without the caller exporting any env.
function shortSocketDir(slug) {
  const dir = path.join(os.tmpdir(), `spk-substrate-${slug}`);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
const DAEMON_STDERR_CAP_BYTES = 200000;
const CONNECT_TIMEOUT_MS = 60000;
export const DEFAULT_SCENARIOS = Array.from({ length: 15 }, (_, index) => 401 + index);
const DAEMON_ENV_DENYLIST = /^(GITHUB_TOKEN|GITLAB_TOKEN|NPM_TOKEN|GH_TOKEN|AWS_|GCP_|GOOGLE_|AZURE_|SLACK_|DISCORD_|TWILIO_|STRIPE_|SSH_|GPG_|GNUPGHOME|PASSWORD|SECRET)/i;

// Stable id for this harness run. Stamped into the summary TSV and used to name the
// fallback sidecar so a reader can always tell which run produced a given evidence file.
export const RUN_ID = new Date().toISOString().replace(/[:.]/g, '-');

// A live PID alone does not prove ownership: after a hard crash the OS can recycle the
// crashed daemon's PID. Accept an owner only when its real start time matches the lease's
// recorded start time within this tolerance (clock granularity + write lag).
const LEASE_START_TOLERANCE_MS = 2000;

// Forced OFF in the spawned code-index child. The launcher loads .env.local and, when
// SPECKIT_CODE_GRAPH_MAINTAINER_MODE=true is set there, runs a full INDEX_* scan that rewrites
// graph-metadata across the tree. The launcher's env loader is set-if-absent, so these explicit
// values win — a clean-env / CI harness run can no longer mutate the working tree.
export const CODE_INDEX_INDEX_SUPPRESSION = {
  SPECKIT_CODE_GRAPH_MAINTAINER_MODE: 'false',
  SPECKIT_CODE_GRAPH_INDEX_SKILLS: 'false',
  SPECKIT_CODE_GRAPH_INDEX_AGENTS: 'false',
  SPECKIT_CODE_GRAPH_INDEX_COMMANDS: 'false',
  SPECKIT_CODE_GRAPH_INDEX_SPECS: 'false',
  SPECKIT_CODE_GRAPH_INDEX_PLUGINS: 'false',
};

const sdkRequire = createRequire(path.join(MEMORY_SERVER_ROOT, 'package.json'));
const { Client } = await import(pathToFileURL(sdkRequire.resolve('@modelcontextprotocol/sdk/client/index.js')));
const { StdioClientTransport } = await import(
  pathToFileURL(sdkRequire.resolve('@modelcontextprotocol/sdk/client/stdio.js'))
);

function buildDaemonEnv(extras = {}) {
  const env = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (value === undefined || DAEMON_ENV_DENYLIST.test(key)) continue;
    env[key] = value;
  }
  return { ...env, ...extras };
}

export function parseScenarioList(value) {
  if (!value) return DEFAULT_SCENARIOS;
  const scenarios = [];
  for (const part of value.split(',')) {
    const trimmed = part.trim();
    const range = trimmed.match(/^(\d+)-(\d+)$/);
    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      for (let n = start; n <= end; n += 1) scenarios.push(n);
      continue;
    }
    if (/^\d+$/.test(trimmed)) scenarios.push(Number(trimmed));
  }
  return [...new Set(scenarios)].sort((a, b) => a - b);
}

function parseArgs(argv) {
  const options = { scenarios: DEFAULT_SCENARIOS, stderrLog: true, clean: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--scenarios') {
      options.scenarios = parseScenarioList(argv[i + 1]);
      i += 1;
    } else if (arg.startsWith('--scenarios=')) {
      options.scenarios = parseScenarioList(arg.slice('--scenarios='.length));
    } else if (arg === '--no-stderr-log') {
      options.stderrLog = false;
    } else if (arg === '--clean') {
      options.clean = true;
    }
  }
  return options;
}

function findScenarioFile(scenario) {
  const prefix = `${scenario}-`;
  const entries = fs.readdirSync(PLAYBOOK_DIR);
  const match = entries.find((entry) => entry.startsWith(prefix) && entry.endsWith('.md'));
  if (match) return path.join(PLAYBOOK_DIR, match);

  for (const entry of entries) {
    if (!entry.endsWith('.md')) continue;
    const candidate = path.join(PLAYBOOK_DIR, entry);
    const markdown = fs.readFileSync(candidate, 'utf8');
    const scenarioPattern = new RegExp(`(?:title:\\s*["']?|^#\\s+)${scenario}(?!\\d)`, 'm');
    if (scenarioPattern.test(markdown)) return candidate;
  }
  return null;
}

function section(markdown, heading) {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = markdown.match(new RegExp(`^##\\s+\\d+\\.\\s+${escaped}\\s*$`, 'im'));
  if (!match || match.index === undefined) return '';
  const start = match.index + match[0].length;
  const rest = markdown.slice(start);
  const next = rest.search(/^##\s+\d+\./m);
  return next >= 0 ? rest.slice(0, next) : rest;
}

function findMatchingParen(source, openIndex) {
  let depth = 0;
  let quote = null;
  let escaped = false;
  for (let i = openIndex; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === quote) {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') {
      quote = ch;
    } else if (ch === '(') {
      depth += 1;
    } else if (ch === ')') {
      depth -= 1;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function normalizeToolName(server, tool) {
  return tool;
}

export function normalizeArguments(toolName, args) {
  const normalized = { ...args };
  if (toolName === 'search' && typeof normalized.num_results === 'number' && normalized.limit === undefined) {
    normalized.limit = normalized.num_results;
    delete normalized.num_results;
  }
  return normalized;
}

export function selectClientForServer(clients, server) {
  if (server === 'mk_spec_memory' || server === 'mk-spec-memory') {
    return clients.mk_spec_memory ?? clients['mk-spec-memory'] ?? null;
  }
  if (server === 'mk_code_index' || server === 'mk-code-index') {
    return clients.mk_code_index ?? clients['mk-code-index'] ?? null;
  }
  return null;
}

function decodeSingleQuotedString(inner) {
  let decoded = '';
  for (let i = 0; i < inner.length; i += 1) {
    const ch = inner[i];
    if (ch !== '\\') {
      decoded += ch;
      continue;
    }
    i += 1;
    if (i >= inner.length) {
      decoded += '\\';
      break;
    }
    const escaped = inner[i];
    if (escaped === 'n') decoded += '\n';
    else if (escaped === 'r') decoded += '\r';
    else if (escaped === 't') decoded += '\t';
    else if (escaped === 'b') decoded += '\b';
    else if (escaped === 'f') decoded += '\f';
    else if (escaped === 'v') decoded += '\v';
    else if (escaped === '0') decoded += '\0';
    else decoded += escaped;
  }
  return decoded;
}

export function parseObjectLiteral(source) {
  const trimmed = source.trim();
  if (!trimmed) return {};
  try {
    const value = JSON.parse(trimmed);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('tool arguments are not an object');
    }
    return value;
  } catch {
    const normalized = trimmed
      .replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":')
      .replace(/'((?:[^'\\]|\\.)*?)'/g, (_, inner) => JSON.stringify(decodeSingleQuotedString(inner)))
      .replace(/,(\s*[}\]])/g, '$1');
    const value = JSON.parse(normalized);
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('tool arguments are not an object');
    }
    return value;
  }
}

export function parseScenarioToolCalls(markdown) {
  const execution = section(markdown, 'TEST EXECUTION') || markdown;
  const calls = [];
  const pattern = /\b(mcp__([A-Za-z0-9_]+)__([A-Za-z0-9_]+)|(memory_[A-Za-z0-9_]+))\s*\(/g;
  let match;
  while ((match = pattern.exec(execution)) !== null) {
    const openIndex = execution.indexOf('(', match.index);
    const closeIndex = findMatchingParen(execution, openIndex);
    if (closeIndex < 0) continue;
    const argsSource = execution.slice(openIndex + 1, closeIndex);
    const server = match[2] || 'mk_spec_memory';
    const tool = normalizeToolName(server, match[3] || match[4]);
    try {
      calls.push({
        server,
        tool,
        arguments: normalizeArguments(tool, parseObjectLiteral(argsSource)),
        raw: execution.slice(match.index, closeIndex + 1),
      });
    } catch (error) {
      calls.push({
        server,
        tool,
        arguments: {},
        raw: execution.slice(match.index, closeIndex + 1),
        parseError: error instanceof Error ? error.message : String(error),
      });
    }
    pattern.lastIndex = closeIndex + 1;
  }
  return calls;
}

function parseToolJson(response) {
  const first = response?.content?.find((entry) => entry?.type === 'text' && typeof entry.text === 'string');
  if (!first) return null;
  try {
    return JSON.parse(first.text);
  } catch {
    return { text: first.text };
  }
}

async function callTool(client, name, args, timeoutMs = 120000) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`tool timeout after ${timeoutMs}ms: ${name}`)), timeoutMs).unref();
  });
  return Promise.race([
    client.callTool({ name, arguments: args }, undefined, { timeout: timeoutMs }),
    timeout,
  ]);
}

function responseFailureMessage(response) {
  if (response?.isError) return 'MCP tool returned isError=true';
  const parsed = response?.structuredContent ?? parseToolJson(response);
  if (parsed?.error) return String(parsed.error);
  if (parsed?.status === 'error' || parsed?.status === 'failed') {
    return String(parsed.message ?? `status=${parsed.status}`);
  }
  if (typeof parsed?.code === 'string' && parsed.code.toLowerCase().includes('error')) {
    return String(parsed.message ?? parsed.error ?? `code=${parsed.code}`);
  }
  if (parsed?.ok === false) return String(parsed.message ?? 'ok=false');
  if (parsed?.success === false) return String(parsed.message ?? 'success=false');
  return null;
}

async function callScenarioTool(client, call) {
  return callTool(client, call.tool, call.arguments);
}

function createCappedStderrStream(logPath) {
  const stream = fs.createWriteStream(logPath, { flags: 'w' });
  let bytes = 0;
  return {
    stream,
    attach(transport) {
      transport.stderr?.on('data', (chunk) => {
        if (bytes >= DAEMON_STDERR_CAP_BYTES) return;
        const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(String(chunk));
        const remaining = DAEMON_STDERR_CAP_BYTES - bytes;
        stream.write(buffer.subarray(0, remaining));
        bytes += Math.min(buffer.length, remaining);
        if (bytes >= DAEMON_STDERR_CAP_BYTES) {
          stream.write('\n[shared-daemon-runner] stderr log capped at 200000 bytes\n');
        }
      });
    },
    end() {
      return new Promise((resolve) => stream.end(resolve));
    },
  };
}

function createNullStderrDrain() {
  return {
    attach(transport) {
      transport.stderr?.resume();
    },
    end() {
      return Promise.resolve();
    },
  };
}

function isPidAlive(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    // ESRCH means the pid is gone; EPERM means it exists but is owned elsewhere (still alive).
    return error && typeof error === 'object' && error.code === 'EPERM';
  }
}

// Wall-clock start time of a process, in epoch ms, or null when unknowable. `ps -o lstart=`
// is portable across macOS/BSD and Linux procps; the PID is integer-validated so no untrusted
// value reaches the argv. Returns null (not throw) on any failure so callers can fall back.
export function processStartedAt(pid) {
  if (!Number.isInteger(pid) || pid <= 0) return null;
  const result = spawnSync('ps', ['-o', 'lstart=', '-p', String(pid)], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  if (result.status !== 0 || !result.stdout) return null;
  const parsed = Date.parse(result.stdout.trim());
  return Number.isFinite(parsed) ? parsed : null;
}

// True only when `pid` is alive AND provably the same process that wrote the lease. A live PID
// whose start time differs from the lease's recorded start (beyond tolerance) is a recycled PID,
// not the owner. When the lease has no start time, or the process start time is unreadable, fall
// back to liveness-only so behavior never regresses below the prior check.
export function leaseOwnerMatch(pid, leaseStartMs) {
  if (!isPidAlive(pid)) return false;
  if (!Number.isFinite(leaseStartMs)) return true;
  const procStart = processStartedAt(pid);
  if (procStart === null) return true;
  return Math.abs(procStart - leaseStartMs) <= LEASE_START_TOLERANCE_MS;
}

// A connect failure is only a real substrate failure when nothing legitimately owns the
// single-writer lease. During an interactive session the operator's daemon holds that lease and
// the harness disables bridging, so the spawned child can neither acquire the lease nor bridge —
// it exits with LEASE_HELD_BY and the client sees "Connection closed". That is expected, not a
// regression, so it must be reported as a tolerated SKIP rather than FAIL. Probe the on-disk owner
// lease for a live holder to tell the two apart; a genuine startup crash leaves no live owner and
// stays FAIL.
function liveOwnerForService(name) {
  let leasePath;
  let pidFields;
  let startedAtField;
  if (name === 'mk-spec-memory') {
    leasePath = path.join(MEMORY_SERVER_ROOT, 'database', '.mk-spec-memory-launcher.json');
    pidFields = ['ownerPid', 'pid'];
    startedAtField = 'startedAt';
  } else if (name === 'mk-code-index') {
    leasePath = path.join(
      REPO_ROOT,
      '.opencode/skills/system-code-graph/mcp-server/database',
      '.code-graph-owner.json',
    );
    pidFields = ['ownerPid'];
    startedAtField = 'startedAtIso';
  } else {
    return null;
  }
  try {
    const lease = JSON.parse(fs.readFileSync(leasePath, 'utf8'));
    const leaseStartMs = Date.parse(lease?.[startedAtField]);
    for (const field of pidFields) {
      const pid = lease?.[field];
      // Liveness + start-time identity: a recycled PID (alive, but a different process than the
      // one that wrote the lease) must NOT be accepted, or it would mask a genuine crash as SKIP.
      if (leaseOwnerMatch(pid, leaseStartMs)) return { ownerPid: pid, leasePath };
    }
  } catch {
    // No lease file, unreadable, or unparseable -> treat as no live owner.
  }
  return null;
}

async function connectSharedClient({ name, transportOptions, stderrLog }) {
  const stderr = stderrLog ? createCappedStderrStream(stderrLog) : createNullStderrDrain();
  const transport = new StdioClientTransport({
    ...transportOptions,
    stderr: 'pipe',
  });
  stderr.attach(transport);

  const client = new Client({ name: `shared-daemon-suite-runner-${name}`, version: '0.1.0' });
  try {
    await Promise.race([
      client.connect(transport),
      new Promise((_, reject) => {
        const timer = setTimeout(
          () => reject(new Error(`${name} client connect timeout after ${CONNECT_TIMEOUT_MS}ms`)),
          CONNECT_TIMEOUT_MS,
        );
        timer.unref();
      }),
    ]);
    const listed = await client.listTools();
    return {
      client,
      toolNames: new Set(listed.tools.map((tool) => tool.name)),
      stderr,
      diagnostic: null,
    };
  } catch (error) {
    await client.close().catch(() => {});
    const baseDetail = error instanceof Error ? error.message : String(error);
    const liveOwner = liveOwnerForService(name);
    const diagnostic = liveOwner
      ? {
          scenario: `runner:${name}`,
          verdict: 'SKIP',
          key_metric: `${name} owned by live daemon pid ${liveOwner.ownerPid}`,
          detail: `Connection skipped: a live single-writer owner (pid ${liveOwner.ownerPid}) holds the lease and bridging is disabled, so the harness cannot spawn a dedicated child. Expected during an interactive session; stop operator daemons for a fully hermetic exercise. Underlying connect error: ${baseDetail}`,
        }
      : {
          scenario: `runner:${name}`,
          verdict: 'FAIL',
          key_metric: `${name} connect failed`,
          detail: baseDetail,
        };
    return {
      client: null,
      toolNames: new Set(),
      stderr,
      diagnostic,
    };
  }
}

export function percentile(values, p) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, Math.min(sorted.length - 1, index))];
}

function buildLatencyWorkload() {
  const short = [
    'resume',
    'memory save',
    'ollama embed',
    'gate 3',
    'validate',
    'handover',
    'checkpoint',
    'drift',
    'causal',
    'search',
    'spec docs',
    'graph',
    'retry',
    'embedding',
    'provider',
    'latency',
  ];
  const medium = [
    'How does memory_search rank canonical spec documents?',
    'Find context about local Ollama embedding worker failures.',
    'What packet documented the Metal context contention?',
    'Show prior work on query expansion context size.',
    'Find implementation summaries for substrate repair followups.',
    'Which specs mention IPC observability?',
    'Find validation evidence for token aware chunking.',
    'Search for memory save pipeline enforcement notes.',
    'Locate graph metadata backfill context.',
    'Find prior handover notes for local LLM work.',
    'What tests cover embedding expansion bounds?',
    'Find docs about startup recovery and resume.',
    'Search packet context for V-rule hard blocks.',
    'Find references to semantic lane sweeps.',
    'What changed in template contract validation?',
    'Find notes about pending embedding retry.',
    'Search for shared daemon architecture notes.',
  ];
  const long = Array.from({ length: 16 }, (_, index) => (
    `Long mixed query ${index + 1}: find the packet evidence explaining how the local LLM memory ` +
    'substrate handles embedding provider selection, startup scans, failed embedding retries, ' +
    'semantic search ranking, and strict validation during the 026 graph and context optimization wave.'
  ));
  return [...short, ...medium, ...long];
}

async function runLatencyScenario(client) {
  const workload = buildLatencyWorkload();
  const workloadDir = path.join(REPO_ROOT, '_sandbox/local-llm-query-intelligence/410');
  fs.mkdirSync(workloadDir, { recursive: true });
  fs.writeFileSync(path.join(workloadDir, 'workload.json'), `${JSON.stringify(workload, null, 2)}\n`);

  const runOnce = async () => {
    const timings = [];
    for (const query of workload) {
      const t0 = performance.now();
      await callTool(client, 'memory_search', {
        query,
        limit: 5,
        includeContent: false,
        includeConstitutional: false,
        enableCausalBoost: false,
        enableSessionBoost: false,
        enableDedup: true,
        rerank: false,
      });
      timings.push(performance.now() - t0);
    }
    const totalMs = timings.reduce((sum, value) => sum + value, 0);
    return {
      p50: percentile(timings, 50),
      p95: percentile(timings, 95),
      p99: percentile(timings, 99),
      qps: workload.length / (totalMs / 1000),
    };
  };

  await callTool(client, 'memory_health', {});
  const cold = await runOnce();
  const steady = await runOnce();
  await callTool(client, 'memory_health', {});

  const passedTargets = [
    steady.p50 <= 200,
    steady.p95 <= 800,
    steady.p99 <= 2000,
    steady.qps >= 5,
  ].filter(Boolean).length;
  const verdict = passedTargets === 4 ? 'PASS' : passedTargets >= 2 ? 'PARTIAL' : 'FAIL';
  return {
    verdict,
    key_metric: `steady p50=${Math.round(steady.p50)}ms p95=${Math.round(steady.p95)}ms p99=${Math.round(steady.p99)}ms qps=${steady.qps.toFixed(2)}`,
    detail: `cold p50=${Math.round(cold.p50)}ms p95=${Math.round(cold.p95)}ms p99=${Math.round(cold.p99)}ms qps=${cold.qps.toFixed(2)}; targets met ${passedTargets}/4`,
  };
}

export function checkToolAvailability(calls, toolNameSets) {
  const unavailable = calls
    .filter((call) => !call.parseError)
    .find((call) => {
      const toolNames = toolNameSets[call.server];
      return !toolNames || !toolNames.has(call.tool);
    });
  if (!unavailable) return { available: true };
  return {
    available: false,
    server: unavailable.server,
    tool: unavailable.tool,
    reason: `Connected shared daemon does not expose ${unavailable.server}.${unavailable.tool}.`,
  };
}

export async function executeScenarioCalls(clients, calls) {
  const results = [];
  for (const call of calls.filter((entry) => !entry.parseError)) {
    const client = selectClientForServer(clients, call.server);
    if (!client) {
      results.push({
        call,
        ok: false,
        error: `Shared daemon client for ${call.server} is not connected.`,
      });
      continue;
    }
    try {
      const response = await callScenarioTool(client, call);
      const failureMessage = responseFailureMessage(response);
      results.push({
        call,
        ok: !failureMessage,
        error: failureMessage || undefined,
      });
    } catch (error) {
      results.push({
        call,
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
  const succeeded = results.filter((result) => result.ok).length;
  const failed = results.length - succeeded;
  const firstError = results.find((result) => !result.ok) ?? null;
  return { results, succeeded, failed, firstError };
}

function assembleVerdict(scenario, calls, availability, exec) {
  if (calls.length === 0) {
    return {
      scenario,
      verdict: 'SKIP',
      key_metric: '0 parseable MCP calls',
      detail: 'No mechanically parseable MCP tool calls in TEST EXECUTION.',
    };
  }

  if (!availability.available) {
    return {
      scenario,
      verdict: 'SKIP',
      key_metric: `${availability.tool} unavailable`,
      detail: availability.reason,
    };
  }

  const parseErrors = calls.filter((call) => call.parseError);
  const firstParseError = parseErrors[0];
  if (!exec || exec.results.length === 0) {
    return {
      scenario,
      verdict: 'SKIP',
      key_metric: `0/${calls.length} calls executed`,
      detail: firstParseError
        ? `Could not parse ${firstParseError.tool}: ${firstParseError.parseError}`
        : 'No executable MCP calls in TEST EXECUTION.',
    };
  }

  if (exec.failed > 0) {
    const failed = exec.firstError;
    const reason = failed?.error ?? 'unknown error';
    const tool = failed?.call?.tool ?? 'unknown';
    const parseDetail = parseErrors.length > 0 ? `; parse errors: ${parseErrors.length}` : '';
    return {
      scenario,
      verdict: 'FAIL',
      key_metric: `${exec.succeeded}/${calls.length} calls succeeded; first failure: ${tool}(${reason})`,
      detail: `${tool} returned an error response: ${reason}${parseDetail}`,
    };
  }

  if (parseErrors.length > 0) {
    return {
      scenario,
      verdict: 'PARTIAL',
      key_metric: `${exec.succeeded}/${calls.length} calls succeeded`,
      detail: `${exec.succeeded}/${exec.results.length} executable calls succeeded; ${parseErrors.length} parse errors; first parse error: ${firstParseError.tool}(${firstParseError.parseError})`,
    };
  }

  return {
    scenario,
    verdict: 'PASS',
    key_metric: `${exec.succeeded}/${calls.length} calls succeeded`,
    detail: 'All mechanically parsed MCP calls completed through the shared daemon.',
  };
}

async function runGenericScenario(clients, toolNameSets, scenario, markdown) {
  const calls = parseScenarioToolCalls(markdown);
  const availability = checkToolAvailability(calls, toolNameSets);
  if (!availability.available) return assembleVerdict(scenario, calls, availability, null);
  const exec = await executeScenarioCalls(clients, calls);
  return assembleVerdict(scenario, calls, availability, exec);
}

async function runScenario(clients, toolNameSets, scenario) {
  const file = findScenarioFile(scenario);
  if (!file) {
    return {
      scenario,
      verdict: 'SKIP',
      key_metric: 'missing playbook',
      detail: `No ${scenario}-*.md file found.`,
    };
  }
  const markdown = fs.readFileSync(file, 'utf8');
  if (scenario === 410 && toolNameSets.mk_spec_memory?.has('memory_search')) {
    return { scenario, ...(await runLatencyScenario(clients.mk_spec_memory)) };
  }
  return runGenericScenario(clients, toolNameSets, scenario, markdown);
}

// Render the summary TSV. A `run_id` column lets a reader confirm which run produced the rows;
// it is the trailing column so existing readers that take only scenario/verdict are unaffected.
export function renderSummaryTsv(rows, runId = RUN_ID) {
  const header = 'scenario\tverdict\tkey_metric\tdetail\trun_id\n';
  const body = rows
    .map((row) => [row.scenario, row.verdict, row.key_metric, row.detail, runId]
      .map((value) => String(value).replace(/\t/g, ' ').replace(/\n/g, ' '))
      .join('\t'))
    .join('\n');
  return `${header}${body}\n`;
}

// Run-id-suffixed fallback path used when the canonical TSV is locked.
export function summarySidecarPath(runId = RUN_ID) {
  return `${SUMMARY_TSV}.${runId}.tsv`;
}

// Write the payload to the canonical TSV. On EPERM (another writer holds a lock) the prior file
// must NOT be silently kept — a reader would mistake a prior run's pids/verdicts for this run's.
// Current evidence is redirected to a run-id sidecar so nothing is lost and stale data stays
// distinguishable. `write`/`warn` are injectable so the EPERM branch is testable without a real
// locked file. Returns the resolved target path and whether the fallback fired.
export function writeSummaryWithFallback(payload, { write = (p, d) => fs.writeFileSync(p, d), warn = console.warn } = {}) {
  try {
    write(SUMMARY_TSV, payload);
    return { target: SUMMARY_TSV, fallback: false };
  } catch (error) {
    const code = error && typeof error === 'object' && 'code' in error ? error.code : null;
    if (code === 'EPERM') {
      const sidecar = summarySidecarPath();
      try {
        write(sidecar, payload);
        warn(`[substrate-stress-harness] summary TSV is locked; wrote this run's evidence to ${sidecar}`);
        return { target: sidecar, fallback: true };
      } catch (sidecarError) {
        const detail = sidecarError instanceof Error ? sidecarError.message : String(sidecarError);
        warn(`[substrate-stress-harness] summary TSV locked and sidecar write failed: ${detail}`);
        return { target: null, fallback: true };
      }
    }
    throw error;
  }
}

function writeSummary(rows) {
  return writeSummaryWithFallback(renderSummaryTsv(rows));
}

// Opt-in full isolation for clean-env / CI verification: when SPECKIT_SUBSTRATE_HERMETIC=1, give
// the code-index child its own throwaway DB dir (within repo root, required by the launcher's path
// guard) so it acquires its OWN lease instead of contending with a live operator daemon. Default
// (unset) keeps the normal skip-not-fail behavior unchanged. Returns the dir path or null.
export function hermeticCodeIndexDbDir(runId = RUN_ID) {
  if (process.env.SPECKIT_SUBSTRATE_HERMETIC !== '1') return null;
  return path.join(REPO_ROOT, '_sandbox/local-llm-query-intelligence/.tmp-cg-db', runId);
}

function hermeticCodeIndexExtras() {
  const dir = hermeticCodeIndexDbDir();
  if (!dir) return {};
  fs.mkdirSync(dir, { recursive: true });
  return { SPECKIT_CODE_GRAPH_DB_DIR: dir };
}

// The sandbox under the repo root holds only regenerated run artifacts: the summary TSV and a
// workload dump, plus a throwaway hermetic code-graph DB. The DB is scratch and is always removed
// once the daemons are closed. `clean` additionally drops the whole sandbox for standalone runs;
// the vitest runner omits it because it reads the summary TSV after the harness process exits and
// clears the sandbox itself.
function cleanupSandbox({ clean = false } = {}) {
  try {
    fs.rmSync(path.join(SANDBOX_RUN_DIR, '.tmp-cg-db'), { recursive: true, force: true });
  } catch {
    // best-effort scratch cleanup
  }
  if (clean) {
    try {
      fs.rmSync(SANDBOX_RUN_DIR, { recursive: true, force: true });
      // Drop the now-empty _sandbox parent too. rmdir fails closed if anything else lives there.
      fs.rmdirSync(path.dirname(SANDBOX_RUN_DIR));
    } catch {
      // best-effort cleanup; a shared or non-empty parent is left in place
    }
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  fs.mkdirSync(SANDBOX_EVIDENCE_DIR, { recursive: true });
  const rows = [];
  const connections = [];
  try {
    const memoryConnection = await connectSharedClient({
      name: 'mk-spec-memory',
      transportOptions: {
        command: process.execPath,
        args: ['.opencode/bin/mk-spec-memory-launcher.cjs'],
        cwd: REPO_ROOT,
        env: buildDaemonEnv({
          SPECKIT_RETRY_ENABLED: 'false',
          // Test isolation: spawn a dedicated child daemon instead of bridging to
          // a long-running operator daemon. Also avoids macOS sun_path overflow
          // when the default bridge socket path exceeds 104 chars (the default
          // path under mcp-server/database/ is ~134 chars from this repo root).
          SPECKIT_LAUNCHER_BRIDGE_DISABLED: '1',
          SPECKIT_IPC_SOCKET_DIR: shortSocketDir('mem'),
        }),
      },
      stderrLog: options.stderrLog ? MEMORY_DAEMON_STDERR_LOG : null,
    });
    connections.push(memoryConnection);

    // Second real daemon: the code-graph index. Scenarios 403, 404 and 407 call
    // mcp__mk_code_index__code_graph_context, so they only execute against a real
    // daemon when this is connected — otherwise they SKIP. Dedicated child (bridge
    // disabled, its own short socket dir). Maintainer mode and all INDEX_* flags are
    // explicitly forced OFF: the launcher would otherwise load .env.local and run a
    // full INDEX_* scan that rewrites graph-metadata across the tree. The graph must
    // already be populated (run code_graph_scan once) for the scenarios to resolve
    // nodes; an empty graph yields tolerated SKIP/blocked.
    const codeIndexConnection = await connectSharedClient({
      name: 'mk-code-index',
      transportOptions: {
        command: process.execPath,
        args: ['.opencode/bin/mk-code-index-launcher.cjs'],
        cwd: REPO_ROOT,
        env: buildDaemonEnv({
          SPECKIT_LAUNCHER_BRIDGE_DISABLED: '1',
          SPECKIT_IPC_SOCKET_DIR: shortSocketDir('cg'),
          ...CODE_INDEX_INDEX_SUPPRESSION,
          ...hermeticCodeIndexExtras(),
        }),
      },
      stderrLog: options.stderrLog ? CODE_INDEX_DAEMON_STDERR_LOG : null,
    });
    connections.push(codeIndexConnection);

    for (const connection of connections) {
      if (connection.diagnostic) {
        rows.push(connection.diagnostic);
        console.log(JSON.stringify(connection.diagnostic));
      }
    }

    const clients = {
      mk_spec_memory: memoryConnection.client,
      mk_code_index: codeIndexConnection.client,
    };
    const toolNameSets = {
      mk_spec_memory: memoryConnection.toolNames,
      mk_code_index: codeIndexConnection.toolNames,
    };
    for (const scenario of options.scenarios) {
      const row = await runScenario(clients, toolNameSets, scenario);
      rows.push(row);
      console.log(JSON.stringify(row));
    }
  } finally {
    writeSummary(rows);
    await Promise.all(connections.map((connection) =>
      connection.client ? connection.client.close().catch(() => {}) : Promise.resolve()
    ));
    await Promise.all(connections.map((connection) => connection.stderr.end()));
    cleanupSandbox({ clean: options.clean });
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.stack : String(error));
    process.exit(1);
  });
}
