// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ cli-deem tests                                                            ║
// ╚══════════════════════════════════════════════════════════════════════════╝
// ───────────────────────────────────────────────────────────────────
// MODULE: cli-deem tests
// ───────────────────────────────────────────────────────────────────
// Spawns the client against an in-process fake server. The spawn is
// asynchronous so this process can answer the request. A synchronous spawn
// would deadlock on that server.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { execFileSync, spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { performance } from 'node:perf_hooks';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const CLI_PATH = fileURLToPath(new URL('../cli-deem.mjs', import.meta.url));
const MODEL_DIR_NAME = '0123456789abcdef0123456789abcdef01234567';
const HEALTHY_BODY = {
  status: 'ok',
  backend: 'torch',
  model: 'deem-0.8-v1',
};

// Same keys the client drops, so git in this process cannot aim the fixture
// at the caller repository.
const GIT_ENV_REDIRECTORS = [
  'GIT_DIR',
  'GIT_WORK_TREE',
  'GIT_COMMON_DIR',
  'GIT_INDEX_FILE',
  'GIT_OBJECT_DIRECTORY',
  'GIT_ALTERNATE_OBJECT_DIRECTORIES',
  'GIT_CONFIG',
  'GIT_CONFIG_GLOBAL',
  'GIT_CONFIG_SYSTEM',
  'GIT_CONFIG_COUNT',
  'GIT_NAMESPACE',
  'GIT_CEILING_DIRECTORIES',
];

// ─────────────────────────────────────────────────────────────────────────────
// 3. HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Environment copy with git directory redirects removed.
 * @returns {NodeJS.ProcessEnv} Environment safe for a temp repository
 */
function envWithoutGitRedirects() {
  const env = { ...process.env };
  for (const key of GIT_ENV_REDIRECTORS) {
    delete env[key];
  }
  return env;
}

/**
 * Listen on an ephemeral port, record each request, and hand the response
 * to the caller.
 * @param {(req: import('node:http').IncomingMessage, res: import('node:http').ServerResponse) => void} handler
 * @returns {Promise<{ url: string, requests: Array<{ method: string, url: string, headers: import('node:http').IncomingHttpHeaders, body: unknown }>, close: () => Promise<void> }>}
 */
function startFake(handler) {
  const requests = [];
  const server = http.createServer((req, res) => {
    const chunks = [];
    req.on('data', (chunk) => {
      chunks.push(chunk);
    });
    req.on('end', () => {
      const raw = Buffer.concat(chunks).toString('utf8');
      let body = null;
      if (raw !== '') {
        try {
          body = JSON.parse(raw);
        } catch {
          body = null;
        }
      }
      requests.push({
        method: req.method,
        url: req.url,
        headers: req.headers,
        body,
      });
      handler(req, res);
    });
  });

  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error('fake server did not bind a port'));
        return;
      }
      resolve({
        url: `http://127.0.0.1:${address.port}`,
        requests,
        close() {
          return new Promise((done, fail) => {
            server.close((error) => {
              if (error) {
                fail(error);
                return;
              }
              done();
            });
          });
        },
      });
    });
  });
}

/**
 * Bind an ephemeral port, close it, and return the URL that just closed.
 * @returns {Promise<string>} URL whose port is no longer listening
 */
function closedUrl() {
  const server = http.createServer();
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();
      if (address === null || typeof address === 'string') {
        reject(new Error('closed url has no port'));
        return;
      }
      const url = `http://127.0.0.1:${address.port}`;
      server.close((error) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(url);
      });
    });
  });
}

/**
 * Spawn the client. The URL port must not be 8300.
 * @param {string[]} args - Arguments after the script path
 * @param {{ url: string, home: string, input?: string }} options - Server URL, home, and stdin
 * @returns {Promise<{ code: number | null, stdout: string, stderr: string }>}
 */
function runCli(args, options) {
  let port = null;
  try {
    port = new URL(options.url).port;
  } catch {
    // A URL that does not parse is refused before any socket opens.
  }
  if (port !== null) {
    assert.notEqual(port, '8300');
  }

  const env = envWithoutGitRedirects();
  env.CLI_DEEM_URL = options.url;
  env.CLI_DEEM_HOME = options.home;

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [CLI_PATH, ...args], {
      env,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const stdoutChunks = [];
    const stderrChunks = [];
    let settled = false;

    child.stdout.on('data', (chunk) => {
      stdoutChunks.push(chunk);
    });
    child.stderr.on('data', (chunk) => {
      stderrChunks.push(chunk);
    });
    child.on('error', (error) => {
      if (settled) {
        return;
      }
      settled = true;
      reject(error);
    });
    child.stdin.on('error', (error) => {
      if (error.code === 'EPIPE' || settled) {
        return;
      }
      settled = true;
      reject(error);
    });
    child.on('close', (code) => {
      if (settled) {
        return;
      }
      settled = true;
      resolve({
        code,
        stdout: Buffer.concat(stdoutChunks).toString('utf8'),
        stderr: Buffer.concat(stderrChunks).toString('utf8'),
      });
    });
    child.stdin.write(options.input ?? '');
    child.stdin.end();
  });
}

/**
 * Build a temp home with a checkpoint symlink and one empty source commit.
 * @returns {{ home: string, modelCommit: string, sourceCommit: string }}
 */
function makeHome() {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-deem-'));
  try {
    const modelDir = path.join(home, 'models', MODEL_DIR_NAME);
    fs.mkdirSync(modelDir, { recursive: true });
    fs.symlinkSync(MODEL_DIR_NAME, path.join(home, 'models', 'current'));

    const src = path.join(home, 'src');
    const env = envWithoutGitRedirects();
    execFileSync('git', ['init', '-q', src], { env, stdio: 'ignore' });
    execFileSync(
      'git',
      [
        '-C',
        src,
        '-c',
        'core.hooksPath=/dev/null',
        '-c',
        'commit.gpgsign=false',
        '-c',
        'user.name=t',
        '-c',
        'user.email=t@t',
        'commit',
        '--allow-empty',
        '-q',
        '-m',
        'x',
      ],
      { env, stdio: 'ignore' },
    );

    const modelCommit = path.basename(
      fs.readlinkSync(path.join(home, 'models', 'current')),
    );
    const sourceCommit = execFileSync(
      'git',
      ['-C', src, 'rev-parse', 'HEAD'],
      {
        env,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      },
    ).trim();
    return { home, modelCommit, sourceCommit };
  } catch (error) {
    fs.rmSync(home, { recursive: true, force: true });
    throw error;
  }
}

/**
 * Write a JSON response and finish it.
 * @param {import('node:http').ServerResponse} res - Fake response
 * @param {number} status - HTTP status
 * @param {unknown} payload - JSON payload
 */
function replyJson(res, status, payload) {
  const text = JSON.stringify(payload);
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(text);
}

/**
 * Remove a temp home created by makeHome.
 * @param {string} home - Directory to remove
 */
function removeHome(home) {
  fs.rmSync(home, { recursive: true, force: true });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. CORE LOGIC
// ─────────────────────────────────────────────────────────────────────────────

test('health prints the pinned model and the commit pair', { timeout: 20000 }, async () => {
  const laid = makeHome();
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, HEALTHY_BODY);
  });
  try {
    const result = await runCli(['health'], { url: fake.url, home: laid.home });
    assert.equal(result.code, 0);
    const printed = JSON.parse(result.stdout);
    assert.equal(printed.backend, 'torch');
    assert.equal(printed.model, 'deem-0.8-v1');
    assert.equal(printed.model_commit, laid.modelCommit);
    assert.equal(printed.source_commit, laid.sourceCommit);
  } finally {
    await fake.close();
    removeHome(laid.home);
  }
});

test('health refuses a stub backend', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, { ...HEALTHY_BODY, backend: 'stub' });
  });
  try {
    const result = await runCli(['health'], { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 3);
  } finally {
    await fake.close();
  }
});

test('health refuses an ensemble that contains stub', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, { ...HEALTHY_BODY, backend: 'ensemble:torch+stub' });
  });
  try {
    const result = await runCli(['health'], { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 3);
  } finally {
    await fake.close();
  }
});

test('health refuses a model other than the pin', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, { ...HEALTHY_BODY, model: 'deem-1.5' });
  });
  try {
    const result = await runCli(['health'], { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 3);
  } finally {
    await fake.close();
  }
});

test('health exits 4 when nothing is listening', { timeout: 20000 }, async () => {
  const url = await closedUrl();
  const result = await runCli(['health'], { url, home: os.tmpdir() });
  assert.equal(result.code, 4);
});

test('health exits 4 when health returns 500', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    res.writeHead(500);
    res.end('unavailable');
  });
  try {
    const result = await runCli(['health'], { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 4);
  } finally {
    await fake.close();
  }
});

test('health exits 2 when the checkpoint link is missing', { timeout: 20000 }, async () => {
  const home = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-deem-'));
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, HEALTHY_BODY);
  });
  try {
    const result = await runCli(['health'], { url: fake.url, home });
    assert.equal(result.code, 2);
    assert.equal(result.stderr.includes('missing checkpoint link'), true);
  } finally {
    await fake.close();
    removeHome(home);
  }
});

test('an unknown subcommand exits 2 without a request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, HEALTHY_BODY);
  });
  try {
    const result = await runCli(['bogus'], { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 2);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

test('health rejects a question flag', { timeout: 20000 }, async () => {
  const url = await closedUrl();
  const result = await runCli(['health', '-q', 'x'], { url, home: os.tmpdir() });
  assert.equal(result.code, 2);
});

const CHOICE_ARGS = [
  'choice',
  '-q',
  'Which path?',
  '-s',
  'the state',
  '-o',
  'fast=Take the fast path',
  '-o',
  'safe=Take the safe path',
];

const CHOICE_BODY = {
  id: 'deem-t',
  object: 'systemone.completion',
  model: 'deem-0.8-v1',
  answers: {
    answer: {
      type: 'choice',
      choice: 'Take the safe path',
      probabilities: {
        'Take the fast path': 0.2,
        'Take the safe path': 0.8,
      },
      confidence: 0.6,
      temperature: 1,
    },
  },
  usage: { questions: 1 },
};

test('choice translates descriptions back to the submitted keys', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_BODY);
  });
  try {
    const result = await runCli(CHOICE_ARGS, { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 0);
    const printed = JSON.parse(result.stdout);
    assert.equal(printed.answers.answer.choice, 'safe');
    assert.deepEqual(printed.answers.answer.probabilities, { fast: 0.2, safe: 0.8 });
    assert.equal(fake.requests.length, 1);
    assert.equal(fake.requests[0].method, 'POST');
    assert.equal(fake.requests[0].url, '/v1/systemone');
    assert.deepEqual(fake.requests[0].body, {
      state: 'the state',
      questions: {
        answer: {
          type: 'choice',
          instructions: 'Which path?',
          options: ['Take the fast path', 'Take the safe path'],
        },
      },
    });
    assert.equal(fake.requests[0].headers.authorization, undefined);
  } finally {
    await fake.close();
  }
});

test('score translates a level to its zero-based position', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, {
      id: 'deem-t',
      object: 'systemone.completion',
      model: 'deem-0.8-v1',
      answers: {
        answer: {
          type: 'score',
          level: 'medium',
          probabilities: { low: 0.1, medium: 0.7, high: 0.2 },
          expected: 1.1,
          confidence: 0.5,
          temperature: 1,
        },
      },
      usage: { questions: 1 },
    });
  });
  try {
    const result = await runCli(
      ['score', '-q', 'How severe?', '-s', 'x', '-l', 'low', '-l', 'medium', '-l', 'high'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 0);
    const printed = JSON.parse(result.stdout);
    assert.equal(printed.answers.answer.score, 1);
    assert.deepEqual(printed.answers.answer.probabilities, { 0: 0.1, 1: 0.7, 2: 0.2 });
    assert.equal(printed.answers.answer.expected, 1.1);
    assert.equal(Object.hasOwn(printed.answers.answer, 'level'), false);
    assert.equal(fake.requests.length, 1);
    assert.deepEqual(fake.requests[0].body.questions.answer.levels, ['low', 'medium', 'high']);
  } finally {
    await fake.close();
  }
});

test('noul reads the state from stdin and renames value', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, {
      id: 'deem-t',
      object: 'systemone.completion',
      model: 'deem-0.8-v1',
      answers: {
        answer: {
          type: 'noul',
          value: 0.73,
          confidence: 0.46,
          temperature: 1,
        },
      },
      usage: { questions: 1 },
    });
  });
  try {
    const result = await runCli(
      ['noul', '-q', 'Is it urgent?'],
      { url: fake.url, home: os.tmpdir(), input: 'server down since 9am' },
    );
    assert.equal(result.code, 0);
    const printed = JSON.parse(result.stdout);
    assert.equal(printed.answers.answer.noul, 0.73);
    assert.equal(Object.hasOwn(printed.answers.answer, 'value'), false);
    assert.equal(fake.requests[0].body.state, 'server down since 9am');
    assert.deepEqual(fake.requests[0].body.questions.answer, {
      type: 'noul',
      instructions: 'Is it urgent?',
    });
  } finally {
    await fake.close();
  }
});

test('choice --value prints only the submitted key', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_BODY);
  });
  try {
    const result = await runCli(
      [...CHOICE_ARGS, '--value'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 0);
    assert.equal(result.stdout.trim(), 'safe');
  } finally {
    await fake.close();
  }
});

test('a 400 from systemone exits 1', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 400, { error: 'bad request' });
  });
  try {
    const result = await runCli(
      ['noul', '-q', 'Is it urgent?', '-s', 'x'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 1);
  } finally {
    await fake.close();
  }
});

test('a 500 from systemone exits 4', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 500, { error: 'unavailable' });
  });
  try {
    const result = await runCli(
      ['noul', '-q', 'Is it urgent?', '-s', 'x'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 4);
  } finally {
    await fake.close();
  }
});

test('systemone refuses a model other than the pin', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, {
      model: 'deem-1.5',
      answers: { answer: { type: 'noul', value: 0.1 } },
    });
  });
  try {
    const result = await runCli(
      ['noul', '-q', 'Is it urgent?', '-s', 'x'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 3);
  } finally {
    await fake.close();
  }
});

test('a choice option without an equals sign exits 2 before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_BODY);
  });
  try {
    const result = await runCli(
      ['choice', '-q', 'x', '-s', 'y', '-o', 'noequals'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 2);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

const CHOICE_NAMING_OPTION_ONE = {
  model: 'deem-0.8-v1',
  answers: {
    answer: {
      type: 'choice',
      choice: 'option 1',
    },
  },
};

/**
 * Build choice argv with keys o1..oN and descriptions "option 1".. "option N".
 * @param {number} count - How many -o pairs to append
 * @returns {string[]}
 */
function choiceArgs(count) {
  const args = ['choice', '-q', 'x', '-s', 'y'];
  for (let index = 1; index <= count; index += 1) {
    args.push('-o', `o${index}=option ${index}`);
  }
  return args;
}

test('choice with 26 options is sent', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_NAMING_OPTION_ONE);
  });
  try {
    const result = await runCli(choiceArgs(26), { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 0);
    assert.equal(fake.requests.length, 1);
    assert.equal(fake.requests[0].body.questions.answer.options.length, 26);
  } finally {
    await fake.close();
  }
});

test('choice with 27 options exits 2 before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_NAMING_OPTION_ONE);
  });
  try {
    const result = await runCli(choiceArgs(27), { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 2);
    assert.equal(result.stderr.includes('26-option cap'), true);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

test('choice with a duplicate description exits 2 before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_NAMING_OPTION_ONE);
  });
  try {
    const result = await runCli(
      ['choice', '-q', 'x', '-s', 'y', '-o', 'a=Same', '-o', 'b=Same'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 2);
    assert.equal(result.stderr.includes('duplicate option description'), true);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

test('choice with a duplicate key exits 2 before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, {
      model: 'deem-0.8-v1',
      answers: {
        answer: {
          type: 'choice',
          choice: 'Alpha',
        },
      },
    });
  });
  try {
    const result = await runCli(
      ['choice', '-q', 'Pick', '-s', 'x', '-o', 'a=Alpha', '-o', 'a=Beta'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 2);
    assert.equal(result.stderr.includes('duplicate option key'), true);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

test('noul rejects an option flag before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_NAMING_OPTION_ONE);
  });
  try {
    const result = await runCli(
      ['noul', '-q', 'x', '-s', 'y', '-o', 'a=b'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 2);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

test('score without a level exits 2 before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_NAMING_OPTION_ONE);
  });
  try {
    const result = await runCli(
      ['score', '-q', 'x', '-s', 'y'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 2);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

test('choice without an option exits 2 before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, CHOICE_NAMING_OPTION_ONE);
  });
  try {
    const result = await runCli(
      ['choice', '-q', 'x', '-s', 'y'],
      { url: fake.url, home: os.tmpdir() },
    );
    assert.equal(result.code, 2);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

const RUN_MIXED_INPUT = '{"state":"s","questions":{"u":{"type":"noul","instructions":"urgent?"},"s":{"type":"score","instructions":"severity?","levels":["lo","hi"]}}}';

/**
 * Build a Deem batch of noul questions keyed q1..qN.
 * @param {number} count - How many questions to include
 * @returns {{ state: string, questions: Record<string, { type: string, instructions: string }> }}
 */
function noulBatchRequest(count) {
  const questions = {};
  for (let index = 1; index <= count; index += 1) {
    questions[`q${index}`] = { type: 'noul', instructions: `q${index}` };
  }
  return { state: 's', questions };
}

/**
 * Fake body that answers every q1..qN noul question with the same value.
 * @param {number} count - How many answers to include
 * @returns {{ model: string, answers: Record<string, { type: string, value: number, confidence: number, temperature: number }> }}
 */
function noulBatchResponse(count) {
  const answers = {};
  for (let index = 1; index <= count; index += 1) {
    answers[`q${index}`] = {
      type: 'noul',
      value: 0.5,
      confidence: 0,
      temperature: 1,
    };
  }
  return { model: 'deem-0.8-v1', answers };
}

test('run sends a file of 64 noul questions', { timeout: 20000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-deem-run-'));
  const requestPath = path.join(dir, 'request.json');
  fs.writeFileSync(requestPath, JSON.stringify(noulBatchRequest(64)));
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, noulBatchResponse(64));
  });
  try {
    const result = await runCli(['run', requestPath], { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 0);
    assert.equal(fake.requests.length, 1);
    assert.equal(Object.keys(fake.requests[0].body.questions).length, 64);
    const printed = JSON.parse(result.stdout);
    assert.equal(printed.answers.q1.noul, 0.5);
  } finally {
    await fake.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('run rejects 65 questions before any request', { timeout: 20000 }, async () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cli-deem-run-'));
  const requestPath = path.join(dir, 'request.json');
  fs.writeFileSync(requestPath, JSON.stringify(noulBatchRequest(65)));
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, noulBatchResponse(65));
  });
  try {
    const result = await runCli(['run', requestPath], { url: fake.url, home: os.tmpdir() });
    assert.equal(result.code, 2);
    assert.equal(result.stderr.includes('64-question cap'), true);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test('run translates a stdin batch of noul and score', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, {
      model: 'deem-0.8-v1',
      answers: {
        u: { type: 'noul', value: 0.9 },
        s: {
          type: 'score',
          level: 'hi',
          probabilities: { lo: 0.3, hi: 0.7 },
          expected: 0.7,
        },
      },
    });
  });
  try {
    const result = await runCli(
      ['run', '-'],
      { url: fake.url, home: os.tmpdir(), input: RUN_MIXED_INPUT },
    );
    assert.equal(result.code, 0);
    const printed = JSON.parse(result.stdout);
    assert.equal(printed.answers.u.noul, 0.9);
    assert.equal(printed.answers.s.score, 1);
    assert.deepEqual(printed.answers.s.probabilities, { 0: 0.3, 1: 0.7 });
  } finally {
    await fake.close();
  }
});

test('run rejects --value before any request', { timeout: 20000 }, async () => {
  const fake = await startFake((_req, res) => {
    replyJson(res, 200, { model: 'deem-0.8-v1', answers: {} });
  });
  try {
    const result = await runCli(
      ['run', '-', '--value'],
      { url: fake.url, home: os.tmpdir(), input: RUN_MIXED_INPUT },
    );
    assert.equal(result.code, 2);
    assert.equal(fake.requests.length, 0);
  } finally {
    await fake.close();
  }
});

test('every subcommand exits 4 when nothing is listening', { timeout: 20000 }, async () => {
  const url = await closedUrl();
  const cases = [
    { args: ['health'] },
    { args: ['noul', '-q', 'x', '-s', 'y'] },
    { args: ['choice', '-q', 'x', '-s', 'y', '-o', 'a=A', '-o', 'b=B'] },
    { args: ['score', '-q', 'x', '-s', 'y', '-l', 'lo', '-l', 'hi'] },
    { args: ['run', '-'], input: RUN_MIXED_INPUT },
  ];
  for (const item of cases) {
    const result = await runCli(item.args, {
      url,
      home: os.tmpdir(),
      input: item.input,
    });
    assert.equal(result.code, 4);
  }
});

test('health --hook exits 4 inside the hook budget', { timeout: 20000 }, async () => {
  const held = [];
  const fake = await startFake((_req, res) => {
    held.push(res);
  });
  try {
    const started = performance.now();
    const result = await runCli(['health', '--hook'], { url: fake.url, home: os.tmpdir() });
    const elapsed = performance.now() - started;
    assert.equal(result.code, 4);
    assert.equal(result.stderr.includes('timed out after 500 ms'), true);
    assert.equal(elapsed < 1500, true);
  } finally {
    for (const res of held) {
      res.socket?.destroy();
    }
    await fake.close();
  }
});

test('health exits 4 after the health timeout', { timeout: 20000 }, async () => {
  const held = [];
  const fake = await startFake((_req, res) => {
    held.push(res);
  });
  try {
    const started = performance.now();
    const result = await runCli(['health'], { url: fake.url, home: os.tmpdir() });
    const elapsed = performance.now() - started;
    assert.equal(result.code, 4);
    assert.equal(result.stderr.includes('timed out after 2000 ms'), true);
    assert.equal(elapsed >= 1900, true);
    assert.equal(elapsed < 6000, true);
  } finally {
    for (const res of held) {
      res.socket?.destroy();
    }
    await fake.close();
  }
});

test('health refuses a URL that is not loopback', { timeout: 20000 }, async () => {
  const result = await runCli(['health'], {
    url: 'http://192.0.2.1:9',
    home: os.tmpdir(),
  });
  assert.equal(result.code, 2);
  assert.equal(result.stderr.includes('CLI_DEEM_URL must be http://'), true);
  assert.equal(result.stdout, '');
});

test('health refuses a malformed URL', { timeout: 20000 }, async () => {
  const result = await runCli(['health'], {
    url: 'http://[bad',
    home: os.tmpdir(),
  });
  assert.equal(result.code, 2);
  assert.equal(result.stderr.includes('CLI_DEEM_URL must be http://'), true);
  assert.equal(result.stdout, '');
});

test('health --hook dials an IPv6 loopback without a name lookup', { timeout: 20000 }, async () => {
  const closed = await closedUrl();
  const port = new URL(closed).port;
  const result = await runCli(['health', '--hook'], {
    url: `http://[::1]:${port}`,
    home: os.tmpdir(),
  });
  assert.equal(result.code, 4);
  assert.equal(result.stderr.includes('ENOTFOUND'), false);
});
