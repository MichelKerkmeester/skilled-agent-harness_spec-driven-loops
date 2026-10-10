"use strict";

const { test } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const { spawn, spawnSync } = require("node:child_process");

const HELPER_PATH = path.join(__dirname, "hook-adapter-shared.cjs");

// The child reads stdin through the helper the way a hook adapter does, then
// reports the text it got and how long the read took, measured inside the child.
const READER_SCRIPT = `
const { readStdin } = require(process.argv[1]);
const started = Date.now();
readStdin().then((text) => {
  process.stdout.write(JSON.stringify({ text, elapsedMs: Date.now() - started }));
});
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
  assert.ok(elapsedMs >= 2950 && elapsedMs < 4500, `elapsedMs was ${elapsedMs}`);
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
