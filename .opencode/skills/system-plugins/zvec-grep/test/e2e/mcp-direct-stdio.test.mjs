import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { cp, mkdir } from "node:fs/promises";
import { connect, createServer } from "node:net";
import { join, resolve } from "node:path";
import test from "node:test";
import {
  cliPath,
  createTemporaryDirectory,
  runCli,
} from "../helpers/fixtures.mjs";
import { createFakeEmbeddingServer } from "../helpers/fake-embedding.mjs";
import { readInstanceRecord } from "../../dist/daemon/server-controller.js";

const MCP_PROTOCOL_VERSION = "2026-07-28";
const REQUEST_TIMEOUT_MS = 60_000;

function availablePort() {
  return new Promise((resolvePort, reject) => {
    const server = createServer();
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      server.close((error) => (error ? reject(error) : resolvePort(port)));
    });
  });
}

function portIsListening(port) {
  return new Promise((resolveListening) => {
    const socket = connect({ host: "127.0.0.1", port });
    const finish = (listening) => {
      socket.destroy();
      resolveListening(listening);
    };
    socket.setTimeout(2_000);
    socket.on("connect", () => finish(true));
    socket.on("timeout", () => finish(false));
    socket.on("error", () => finish(false));
  });
}

/**
 * Minimal newline-delimited JSON-RPC client. The published client SDK is
 * deliberately avoided here so the test exercises the wire contract of a real
 * `zg server --stdio --mode direct` child process.
 */
function connectStdio(child, transcript) {
  const pending = new Map();
  let buffer = "";
  let nextId = 0;

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    buffer += chunk;
    let newline = buffer.indexOf("\n");
    while (newline >= 0) {
      const line = buffer.slice(0, newline).trim();
      buffer = buffer.slice(newline + 1);
      newline = buffer.indexOf("\n");
      if (!line) continue;
      const message = JSON.parse(line);
      transcript.push({ direction: "server", message });
      const resolvePending = pending.get(message.id);
      if (resolvePending) {
        pending.delete(message.id);
        resolvePending(message);
      }
    }
  });

  const send = (message) => {
    transcript.push({ direction: "client", message });
    child.stdin.write(`${JSON.stringify(message)}\n`);
  };

  return {
    notify(method, params) {
      send({ jsonrpc: "2.0", method, params });
    },
    async request(method, params) {
      const id = ++nextId;
      const response = new Promise((resolvePending, reject) => {
        const timer = setTimeout(() => {
          pending.delete(id);
          reject(
            new Error(`${method} timed out after ${REQUEST_TIMEOUT_MS}ms`),
          );
        }, REQUEST_TIMEOUT_MS);
        pending.set(id, (message) => {
          clearTimeout(timer);
          resolvePending(message);
        });
      });
      send({ jsonrpc: "2.0", id, method, params });
      const message = await response;
      assert.equal(
        message.error,
        undefined,
        `${method} failed: ${JSON.stringify(message.error)}`,
      );
      return message.result;
    },
  };
}

test(
  "direct-mode stdio MCP answers a search over the repository documentation",
  { timeout: 300_000 },
  async (t) => {
    const temporaryDirectory = await createTemporaryDirectory(
      t,
      "zvec-grep-direct-stdio-",
    );
    const root = join(temporaryDirectory, "repo");
    const home = join(temporaryDirectory, "home");
    await mkdir(root, { recursive: true });
    // Index this repository's own docs/ inside a temporary workspace so the
    // index never lands in the working tree.
    await cp(resolve("docs"), join(root, "docs"), { recursive: true });

    const endpoint = await createFakeEmbeddingServer(t);
    // A daemon started for this home would listen here. Nothing may.
    const serverPort = await availablePort();
    const env = {
      HOME: home,
      USERPROFILE: home,
      NO_COLOR: "1",
      ZVEC_GREP_HOME: home,
      ZVEC_GREP_SERVER_URL: `http://127.0.0.1:${serverPort}/mcp`,
      ZVEC_GREP_EMBEDDING: "qwen/text-embedding-v4",
      ZVEC_GREP_API_KEY: "test-key",
      ZVEC_GREP_ENDPOINT: endpoint,
    };
    assert.equal(await portIsListening(serverPort), false);

    const indexed = await runCli(
      ["index", "--mode", "direct", "--allow-remote", root],
      { cwd: root, env, timeout: 240_000 },
    );
    assert.match(indexed.stdout, /Workspace index/);

    const transcript = [];
    const child = spawn(
      process.execPath,
      ["--liftoff-only", cliPath, "server", "--stdio", "--mode", "direct"],
      { cwd: root, env: { ...process.env, ...env }, windowsHide: true },
    );
    let stderr = "";
    child.stderr.setEncoding("utf8");
    child.stderr.on("data", (chunk) => (stderr += chunk));
    const exited = new Promise((resolvePending) =>
      child.on("exit", (code) => resolvePending(code)),
    );
    t.after(async () => {
      child.kill("SIGKILL");
      await exited;
    });

    const client = connectStdio(child, transcript);
    const initialized = await client.request("initialize", {
      protocolVersion: MCP_PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: "direct-stdio-e2e", version: "1.0.0" },
    });
    assert.equal(initialized.serverInfo.name, "zvec-grep");
    assert.equal(typeof initialized.protocolVersion, "string");
    assert.match(initialized.instructions, /zvec_grep_search/);
    client.notify("notifications/initialized", {});

    const listed = await client.request("tools/list", {});
    assert.deepEqual(
      listed.tools.map((tool) => tool.name).toSorted(),
      ["zvec_grep_search"],
      "direct mode serves the default agent toolset",
    );

    const called = await client.request("tools/call", {
      name: "zvec_grep_search",
      arguments: {
        root,
        // Lexical routes need no embedding call, so the search stays offline
        // and no Remote Embedding authorization is involved.
        fts: ["loopback"],
        limit: 3,
        freshness: "eventual",
        autoUpdate: false,
      },
    });
    assert.notEqual(called.isError, true, JSON.stringify(called.content));
    const text = called.content[0].text;
    assert.match(text, /^freshness: (?:fresh|possibly_stale)\n/);
    assert.match(text, /docs\/06-server\.md/);
    assert.match(text, /loopback/);

    // Nothing may listen while the direct server is serving: it owns stdio
    // only, and must not have started a daemon on the side.
    assert.equal(await portIsListening(serverPort), false);
    assert.equal(await readInstanceRecord(home), undefined);

    // The child owns the whole lifecycle: closing stdin must end the process
    // without leaving a daemon or a listener behind.
    child.stdin.end();
    assert.equal(await exited, 0, stderr);
    assert.equal(await portIsListening(serverPort), false);
    assert.equal(await readInstanceRecord(home), undefined);
    const status = await runCli(["server", "status", "--home", home], {
      cwd: root,
      env,
    });
    assert.match(status.stdout, /Server: stopped/);
  },
);
