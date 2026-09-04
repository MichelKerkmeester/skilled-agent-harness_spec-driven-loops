import assert from "node:assert/strict";
import { mkdir, mkdtemp, realpath, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { Client, InMemoryTransport } from "@modelcontextprotocol/client";
import { DaemonBackend } from "../../dist/daemon/backend.js";
import {
  DirectBackend,
  DIRECT_SERVER_STATUS_UNAVAILABLE_MESSAGE,
} from "../../dist/mcp/direct-backend.js";
import {
  createZvecGrepMcpServer,
  ZVEC_GREP_FULL_DIRECT_MCP_INSTRUCTIONS,
  ZVEC_GREP_FULL_MCP_INSTRUCTIONS,
} from "../../dist/mcp/tools.js";
import { createZvecGrep } from "../../dist/index.js";
import { FakeEmbeddingModel } from "../helpers/fake-embedding.mjs";

const noopWatchManagerFactory = () => ({
  start() {},
  flushPending: async () => {},
  close: async () => {},
});

function createDirectBackend() {
  return new DirectBackend({
    createService: (options) =>
      createZvecGrep({ ...options, embeddingModel: new FakeEmbeddingModel() }),
  });
}

function createDaemonBackend() {
  return new DaemonBackend({
    version: "1.0.0",
    modelPoolOptions: { createModel: () => new FakeEmbeddingModel() },
    createService: (options) =>
      createZvecGrep({ ...options, embeddingModel: new FakeEmbeddingModel() }),
    watchManagerFactory: noopWatchManagerFactory,
  });
}

async function createWorkspace(t) {
  const temporaryDirectory = await mkdtemp(
    join(tmpdir(), "zvec-grep-direct-mcp-"),
  );
  const root = join(temporaryDirectory, "repo");
  await mkdir(join(root, "src"), { recursive: true });
  await writeFile(
    join(root, "src", "theme.ts"),
    [
      "export function loadTheme() {",
      "  // restore the persisted theme preference",
      "  return readStoredTheme() ?? 'light';",
      "}",
      "",
    ].join("\n"),
  );
  await writeFile(
    join(root, "src", "unrelated.ts"),
    "export const UnrelatedConstant = 7;\n",
  );
  t.after(() => rm(temporaryDirectory, { recursive: true, force: true }));
  return root;
}

async function connect(t, backend, options = {}) {
  const server = createZvecGrepMcpServer(backend, "1.0.0", options);
  const client = new Client({ name: "direct-backend-test", version: "1.0.0" });
  const [clientTransport, serverTransport] =
    InMemoryTransport.createLinkedPair();
  await Promise.all([
    server.connect(serverTransport),
    client.connect(clientTransport),
  ]);
  t.after(async () => {
    await client.close();
    await server.close();
  });
  return client;
}

function searchArguments(root) {
  return {
    root,
    query: "restore the persisted theme preference",
    fts: ["loadTheme"],
    limit: 5,
    freshness: "eventual",
    // A daemon would schedule a background reconcile here; direct mode has no
    // background worker, so both sides are pinned to the current index.
    autoUpdate: false,
  };
}

function toolText(result) {
  assert.notEqual(result.isError, true, JSON.stringify(result.content));
  assert.equal(result.content.length, 1);
  assert.equal(result.content[0].type, "text");
  return result.content[0].text;
}

test("direct search returns the daemon-backed tool result byte for byte", async (t) => {
  const root = await createWorkspace(t);
  const direct = createDirectBackend();
  t.after(() => direct.close());
  const indexed = await direct.index({ root, wait: true });
  assert.equal(indexed.state, "succeeded");
  assert.equal(indexed.jobId, "direct");
  assert.equal(indexed.action, "index");

  // The daemon backend only activates a Workspace runtime for reads here, so
  // it never competes with the direct service for the write lease.
  const daemon = createDaemonBackend();
  t.after(() => daemon.close());

  const directClient = await connect(t, direct);
  const daemonClient = await connect(t, daemon);
  const call = { name: "zvec_grep_search", arguments: searchArguments(root) };
  const directText = toolText(await directClient.callTool(call));
  const daemonText = toolText(await daemonClient.callTool(call));

  assert.equal(directText, daemonText);
  assert.match(directText, /^freshness: fresh\n/);
  assert.match(directText, /#1 .*src\/theme\.ts/);
  assert.match(directText, /Q1 \[primary\]: restore the persisted theme/);
  assert.match(directText, /Q2 \[supplemental\]: loadTheme/);

  // The daemon now holds a Workspace lease. Direct searches keep working
  // against it, while a direct write is refused instead of racing the daemon.
  assert.equal(toolText(await directClient.callTool(call)), daemonText);
  await assert.rejects(
    direct.index({ root, wait: true }),
    /DAEMON_LEASE_ACTIVE|daemon/i,
  );
});

test("direct search reports staleness without advertising a background refresh", async (t) => {
  const root = await createWorkspace(t);
  const direct = createDirectBackend();
  t.after(() => direct.close());
  await direct.index({ root, wait: true });
  const client = await connect(t, direct);

  const fresh = toolText(
    await client.callTool({
      name: "zvec_grep_search",
      arguments: searchArguments(root),
    }),
  );
  assert.match(fresh, /^freshness: fresh\n/);

  await writeFile(
    join(root, "src", "added-after-index.ts"),
    "export const AddedAfterIndex = 1;\n",
  );
  const stale = toolText(
    await client.callTool({
      name: "zvec_grep_search",
      arguments: searchArguments(root),
    }),
  );
  assert.match(stale, /^freshness: possibly_stale\n/);
  assert.doesNotMatch(stale, /background_refresh/);
  assert.doesNotMatch(stale, /served_from_current_index/);
});

test("direct wait_for_fresh updates the index inside the search call", async (t) => {
  const root = await createWorkspace(t);
  const direct = createDirectBackend();
  t.after(() => direct.close());
  await direct.index({ root, wait: true });
  await writeFile(
    join(root, "src", "late-theme.ts"),
    "export const LateThemeToggle = 'dark';\n",
  );

  const client = await connect(t, direct);
  const text = toolText(
    await client.callTool({
      name: "zvec_grep_search",
      arguments: {
        root,
        fts: ["LateThemeToggle"],
        limit: 5,
        freshness: "wait_for_fresh",
        autoUpdate: true,
      },
    }),
  );
  assert.match(text, /^freshness: fresh\n/);
  assert.match(text, /src\/late-theme\.ts/);
});

test("the full direct toolset omits the daemon-only server status tool", async (t) => {
  const root = await createWorkspace(t);
  const direct = createDirectBackend();
  t.after(() => direct.close());
  const client = await connect(t, direct, {
    toolset: "full",
    includeServerStatusTool: false,
  });

  const listed = await client.listTools();
  assert.deepEqual(listed.tools.map((tool) => tool.name).toSorted(), [
    "zvec_grep_index",
    "zvec_grep_index_drop",
    "zvec_grep_index_status",
    "zvec_grep_rg",
    "zvec_grep_search",
  ]);

  const instructions = client.getInstructions();
  assert.equal(instructions, ZVEC_GREP_FULL_DIRECT_MCP_INSTRUCTIONS);
  assert.notEqual(instructions, ZVEC_GREP_FULL_MCP_INSTRUCTIONS);
  assert.doesNotMatch(instructions, /zvec_grep_server_status/);
  assert.match(ZVEC_GREP_FULL_MCP_INSTRUCTIONS, /zvec_grep_server_status/);

  await assert.rejects(
    client.callTool({ name: "zvec_grep_server_status", arguments: {} }),
    (error) => error?.code === -32602 && /not found/i.test(error.message),
  );
  await assert.rejects(direct.serverStatus(), (error) => {
    assert.match(error.message, /DIRECT_MODE_NO_DAEMON/);
    assert.match(error.message, /no daemon is present/);
    assert.ok(DIRECT_SERVER_STATUS_UNAVAILABLE_MESSAGE.includes("direct mode"));
    return true;
  });

  const indexed = await client.callTool({
    name: "zvec_grep_index",
    arguments: { root, wait: true },
  });
  assert.equal(indexed.structuredContent.state, "succeeded");
  assert.equal(indexed.structuredContent.job_id, "direct");

  const status = await client.callTool({
    name: "zvec_grep_index_status",
    arguments: { root },
  });
  assert.equal(status.structuredContent.indexed, true);
  // Roots are canonicalized the same way the daemon canonicalizes them.
  assert.equal(status.structuredContent.root, await realpath(root));
  // Runtime state belongs to a daemon runtime and must not be invented here.
  assert.equal(status.structuredContent.runtime, undefined);
  assert.equal(
    status.structuredContent.persistent.workspace_index.embedding.provider,
    "test",
  );

  const searched = toolText(
    await client.callTool({
      name: "zvec_grep_search",
      arguments: searchArguments(root),
    }),
  );
  assert.match(searched, /src\/theme\.ts/);
});

test("direct index rejects drop combined with index options", async (t) => {
  const root = await createWorkspace(t);
  const direct = createDirectBackend();
  t.after(() => direct.close());

  await assert.rejects(
    direct.index({ root, drop: true, rebuild: true }),
    /INVALID_ARGUMENT.*drop cannot be combined with rebuild/s,
  );

  await direct.index({ root, wait: true });
  const dropped = await direct.index({ root, drop: true });
  assert.deepEqual(
    {
      jobId: dropped.jobId,
      action: dropped.action,
      state: dropped.state,
      dropped: dropped.dropped,
    },
    { jobId: "drop", action: "drop", state: "succeeded", dropped: true },
  );
});

test("a closed direct backend refuses further work", async (t) => {
  const root = await createWorkspace(t);
  const direct = createDirectBackend();
  await direct.index({ root, wait: true });
  await direct.close();
  await assert.rejects(direct.indexStatus({ root }), /DIRECT_BACKEND_CLOSED/);
});
