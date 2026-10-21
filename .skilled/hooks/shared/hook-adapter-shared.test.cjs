// ───────────────────────────────────────────────────────────────────
// MODULE: Shared Hook Adapter Tests
// ───────────────────────────────────────────────────────────────────
"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const HELPER_PATH = path.join(__dirname, "hook-adapter-shared.cjs");

// The child reads stdin through the helper the way a hook adapter does, then
// reports the text it got and how long the read took, measured inside the child.
// A JSON options argument lets a test set its own deadline and byte cap.
const READER_SCRIPT = `
const { readStdin } = require(process.argv[1]);
const options = process.argv[2] ? JSON.parse(process.argv[2]) : {};
const started = Date.now();
readStdin(options).then((text) => {
  process.stdout.write(JSON.stringify({ text, elapsedMs: Date.now() - started }));
});
`;

// A fake stdin can emit the whole default cap synchronously, without moving
// 64 MiB through a pipe. Only the length travels back, because a reader without
// a cap would hold the full string.
const DEFAULT_CAP_SCRIPT = `
const { EventEmitter } = require('node:events');
const { readStdin } = require(process.argv[1]);
const chunk = Buffer.alloc(64 * 1024, 0x61);
const chunkCount = Number(process.argv[2]);
const fake = new EventEmitter();
fake.pause = () => {};
Object.defineProperty(process, 'stdin', { value: fake, configurable: true });
readStdin().then((text) => {
  process.stdout.write(JSON.stringify({ length: text.length }));
});
for (let i = 0; i < chunkCount; i++) fake.emit('data', chunk);
fake.emit('end');
`;

test("never-closed stdin resolves at the deadline with the bytes read, and the process exits", async () => {
  const partial = '{"tool_name":"Write"';
  const child = spawn(process.execPath, ["-e", READER_SCRIPT, HELPER_PATH], {
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stdout = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stdin.write(partial);

  const killer = setTimeout(() => child.kill("SIGKILL"), 13000);
  const exit = await new Promise((resolve) => {
    child.on("close", (code, signal) => resolve({ code, signal }));
  });
  clearTimeout(killer);

  assert.equal(exit.signal, null);
  assert.equal(exit.code, 0);
  const { text, elapsedMs } = JSON.parse(stdout);
  assert.equal(text, partial);
  assert.ok(elapsedMs >= 2950 && elapsedMs < 8000, `elapsedMs was ${elapsedMs}`);
});

test("input that ends before the deadline comes back whole", () => {
  const input = JSON.stringify({
    tool_name: "Write",
    tool_input: { file_path: "a.js" },
    cwd: "/x",
  });
  const result = spawnSync(process.execPath, ["-e", READER_SCRIPT, HELPER_PATH], {
    input,
    encoding: "utf8",
    timeout: 10000,
  });

  assert.equal(result.status, 0);
  const { text, elapsedMs } = JSON.parse(result.stdout);
  assert.equal(text, input);
  assert.ok(elapsedMs < 3000, `elapsedMs was ${elapsedMs}`);
});

test("a payload under maxBytes comes back whole", () => {
  const input = `{"tool_name":"Write","padding":"${"x".repeat(900)}"}`;
  const result = spawnSync(
    process.execPath,
    ["-e", READER_SCRIPT, HELPER_PATH, JSON.stringify({ maxBytes: 1024 })],
    { input, encoding: "utf8", timeout: 10000 },
  );

  assert.equal(result.status, 0);
  const { text } = JSON.parse(result.stdout);
  assert.equal(text, input);
});

test("a stream past maxBytes resolves empty before the deadline", async () => {
  const child = spawn(
    process.execPath,
    ["-e", READER_SCRIPT, HELPER_PATH, JSON.stringify({ timeoutMs: 5000, maxBytes: 1024 })],
    { stdio: ["pipe", "pipe", "pipe"] },
  );
  let stdout = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    stdout += chunk;
  });
  child.stdin.write("x".repeat(4096));

  const killer = setTimeout(() => child.kill("SIGKILL"), 9000);
  const exit = await new Promise((resolve) => {
    child.on("close", (code, signal) => resolve({ code, signal }));
  });
  clearTimeout(killer);

  assert.equal(exit.signal, null);
  assert.equal(exit.code, 0);
  const { text, elapsedMs } = JSON.parse(stdout);
  assert.equal(text, "");
  assert.ok(elapsedMs < 2000, `elapsedMs was ${elapsedMs}`);
});

test("the default cap is 64 MiB", () => {
  const atCap = spawnSync(process.execPath, ["-e", DEFAULT_CAP_SCRIPT, HELPER_PATH, "1024"], {
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(atCap.status, 0);
  assert.equal(JSON.parse(atCap.stdout).length, 64 * 1024 * 1024);

  const pastCap = spawnSync(process.execPath, ["-e", DEFAULT_CAP_SCRIPT, HELPER_PATH, "1025"], {
    encoding: "utf8",
    timeout: 15000,
  });
  assert.equal(pastCap.status, 0);
  assert.equal(JSON.parse(pastCap.stdout).length, 0);
});
