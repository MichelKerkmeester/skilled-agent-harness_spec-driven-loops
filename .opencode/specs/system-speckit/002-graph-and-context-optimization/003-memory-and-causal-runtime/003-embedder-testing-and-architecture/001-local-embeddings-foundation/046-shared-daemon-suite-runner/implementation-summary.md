---
title: "Implementation Summary: 045 Shared Daemon Suite Runner"
description: "Documents the direct MCP suite runner, two-client shared-daemon architecture, and 403/404/407/410 smoke result."
trigger_phrases:
  - "045 implementation summary"
  - "shared daemon suite runner summary"
  - "run mcp direct results"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner"
    last_updated_at: "2026-05-14T17:53:33Z"
    last_updated_by: "cli-codex-gpt-5-5-high"
    recent_action: "Wired second cocoindex_code MCP client; 403/404/407/410 PASS via shared daemon"
    next_safe_action: "Operator: optional full-suite run 401-415; operator: commit grouping"
    blockers: []
    key_files:
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs"
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000045"
      session_id: "046-shared-daemon-suite-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "SDK version: @modelcontextprotocol/sdk 1.26.0."
      - "Launcher binding: spec-kit-memory-launcher.cjs spawns context-server.js with stdio inherit."
      - "CocoIndex execution is handled by a second shared StdioClientTransport to cocoindex_code, while memory scenarios stay on spec_kit_memory."
      - "Smoke result: exit 0; 403 PASS; 404 PASS; 407 PASS; 410 PASS."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner` |
| **Started** | 2026-05-14 |
| **Completed** | 2026-05-14 |
| **Level** | 2 |
| **Status** | SHIPPED |
| **Evidence Dir** | `_sandbox/24--local-llm-query-intelligence/evidence/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet replaces 043's per-scenario child-agent shape with a direct MCP runner that uses shared MCP daemon connections. Memory-backed scenarios run through one Spec Kit Memory client, CocoIndex scenarios run through one CocoIndex client, and the runner still fails closed for unknown or unavailable server surfaces.

### MCP Client Architecture

The runner lives at `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs`. It resolves `@modelcontextprotocol/sdk` from `.opencode/skills/system-spec-kit/mcp_server/package.json`, creates one `Client` for `spec_kit_memory`, and creates a second `Client` for `cocoindex_code`.

Discovery showed the launcher starts `.opencode/skills/system-spec-kit/mcp_server/dist/context-server.js` with `stdio: inherit`. That means the SDK client can use the launcher as the stdio server command and the launched memory daemon receives the same JSON-RPC stdin/stdout stream.

### What Was Added

- A second `StdioClientTransport` for `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp`.
- Separate capped stderr evidence logs for the memory daemon and CocoIndex daemon.
- Per-server tool discovery sets so unavailable-tool checks inspect the right MCP surface.
- A routing map that dispatches `spec_kit_memory` calls to the memory client and `cocoindex_code` calls to the CocoIndex client.
- A pure `selectClientForServer()` helper with unit coverage for memory, CocoIndex, and unknown server cases.
- Bounded CocoIndex daemon readiness handling so startup indexing does not turn the first search into a false scenario failure.

### Scenario Coverage

| Scenario Class | Runner Behavior |
|----------------|-----------------|
| Memory MCP calls such as `memory_search`, `memory_save`, `memory_health` | Fully automated when calls are mechanically parseable. |
| Scenario 410 latency | Fully automated with a generated 50-query workload, cold run, steady run, p50/p95/p99/qps metrics. |
| CocoIndex-only calls such as `mcp__cocoindex_code__search` | Fully automated through the shared CocoIndex client when `search` is listed. |
| Complex narrative scenarios without parseable MCP calls | SKIP with a reason. |
| Missing playbook files | SKIP with a missing-file reason. |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` | Updated | Direct MCP suite runner with memory and CocoIndex clients. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` | Generated | Smoke summary TSV. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.daemon.stderr.log` | Generated | Capped daemon stderr evidence. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.cocoindex.stderr.log` | Generated | Capped CocoIndex daemon stderr evidence. |
| `_sandbox/24--local-llm-query-intelligence/410/workload.json` | Generated | Reproducible 50-query workload for 410. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Updated | Unit coverage for parser and routing helpers. |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner/` | Updated | Level 2 packet docs and metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The packet was scaffolded from Level 2 templates, then filled with the user-bound scope. I inspected the 043 failure summary, the memory launcher, the MCP server transport, the installed SDK version, and playbook scenarios 403, 404, 407, and 410 before writing the runner.

The runner was smoked with:

```bash
node _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs --scenarios 403,404,407,410 </dev/null
```

The command exited 0. It did not crash either daemon, and it wrote one TSV row for each requested scenario.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Resolve SDK imports relative to `@spec-kit/mcp-server` | Bare ESM imports do not resolve from `_sandbox` because the repo root has no matching `node_modules`. |
| Use one transport per MCP surface | This preserves the architectural point of 045: shared daemons, no child agents, no per-scenario MCP server stack. Proxying CocoIndex through memory would reduce one client connection, but it would couple two MCP surfaces and hide CocoIndex transport failures behind memory diagnostics. |
| Spawn a second StdioClientTransport for cocoindex_code instead of proxying through memory daemon | Two transports keeps each daemon's tool surface authoritative — cocoindex_code listTools() includes `search` and `cocoindex_refresh_index` which the memory daemon will never expose. Proxying would require maintaining a shadow tool registry inside the memory daemon, double the maintenance surface. Cost: two stderr streams + one extra subprocess startup. Acceptable for evidence tooling. |
| Route by `call.server` | Memory and CocoIndex expose different tool namespaces; per-server routing prevents false unavailable-tool decisions. |
| Add dedicated 410 automation | 410 is a clean memory-search scenario and gives a real positive smoke signal for the one-daemon path. |
| Cap daemon stderr logging | Startup scans can produce large background logs; capped evidence is enough to debug startup without bloating the packet. |
| Wait for CocoIndex daemon readiness | `ccc mcp` triggers background indexing; bounded readiness handling keeps startup work from being reported as scenario failure. |
| Substrate runner promoted to canonical vitest gate (049-substrate-stress-coverage) | The harness lives at `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`; the sandbox path stays as the operator-facing evidence tool. They share the TSV output for continuity. Sync manually until automated mirror lands. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| SDK version discovery | PASS: `@modelcontextprotocol/sdk` version `1.26.0`. |
| Launcher discovery | PASS: launcher starts `dist/context-server.js` with `stdio: inherit`. |
| Tool discovery | PASS: memory daemon lists memory tools; CocoIndex daemon lists `search` and `cocoindex_refresh_index`. |
| Runner syntax | PASS: `node --check _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` exited 0. |
| Parser and routing unit test | PASS: `npx vitest run tests/shared-daemon-runner-helpers.vitest.ts` exited 0 with 1 file / 2 tests passing. |
| Smoke 403/404/407/410 | PASS: command exited 0; 403 PASS; 404 PASS; 407 PASS; 410 PASS. |
| Smoke TSV | PASS: `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` written. |
| Strict validate | PASS: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner --strict` exited 0 with 0 errors and 0 warnings. |

### Smoke Rows

| Scenario | Verdict | Key Metric | Detail |
|----------|---------|------------|--------|
| 403 | PASS | `4/4 calls succeeded` | All mechanically parsed MCP calls completed through the shared daemon. |
| 404 | PASS | `3/3 calls succeeded` | All mechanically parsed MCP calls completed through the shared daemon. |
| 407 | PASS | `3/3 calls succeeded` | All mechanically parsed MCP calls completed through the shared daemon. |
| 410 | PASS | `steady p50=7ms p95=8ms p99=760ms qps=44.31` | Cold p50=11ms p95=106ms p99=1837ms qps=14.96; targets met 4/4. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:run-recipe -->
## Full Suite Recipe

Run the current v1 suite driver from repo root:

```bash
node _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs </dev/null
```

Run a targeted smoke:

```bash
node _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs --scenarios 403,404,407,410 </dev/null
```

Disable daemon stderr evidence capture when paths, queries, or stack traces are sensitive:

```bash
node _sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs --no-stderr-log --scenarios 403,404,407,410 </dev/null
```

Read results:

```bash
cat _sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv
```
<!-- /ANCHOR:run-recipe -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **CocoIndex now wired.** Scenarios 403, 404, and 407 execute through the second shared `cocoindex_code` MCP client; the runner still returns SKIP if a future server name has no connected client or listed tool.
2. **The parser is intentionally conservative.** It handles direct MCP call blocks and memory tool calls, but narrative validation scenarios still SKIP.
3. **410 is system-load sensitive.** The runner records cold and steady metrics separately; compare steady-state values for pass/fail.
4. **Daemon stderr is capped.** The evidence log is useful for startup diagnosis, not a complete daemon transcript.
5. **Daemon stderr logs may capture sensitive output.** Capped at 200KB per daemon; if the daemon prints query strings, file paths, or stack traces, they land in `_sandbox/.../evidence/run-2026-05-14-shared-daemon.{daemon,cocoindex}.stderr.log`. Operators with sensitivity concerns can pass `--no-stderr-log` to disable capture (added in same commit as this note).
<!-- /ANCHOR:limitations -->
