---
title: "045 Shared Daemon Suite Runner"
description: "Build a direct MCP client runner for the 24-- local LLM query-intelligence suite so scenarios execute through shared Memory and CocoIndex MCP daemons instead of one child agent per scenario."
trigger_phrases:
  - "045 shared daemon suite runner"
  - "run mcp direct"
  - "single daemon scenario runner"
  - "24-- shared daemon validation"
importance_tier: "critical"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner"
    last_updated_at: "2026-05-14T17:53:33Z"
    last_updated_by: "cli-codex-gpt-5-5-high"
    recent_action: "Wired second cocoindex_code MCP client; 403/404/407/410 PASS via shared daemon"
    next_safe_action: "Operator: optional full-suite run 401-415; operator: commit grouping"
    blockers: []
    key_files:
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs"
      - "_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000045"
      session_id: "046-shared-daemon-suite-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Gate 3: E - phase folder 046-shared-daemon-suite-runner"
      - "Branch: main; no branches and no commits"
      - "SpawnAgent forbidden and not used"
      - "CocoIndex execution is handled by a second shared StdioClientTransport to cocoindex_code, while memory scenarios stay on spec_kit_memory."
---
# Feature Specification: 045 Shared Daemon Suite Runner

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Shipped |
| **Created** | 2026-05-14 |
| **Branch** | main |
| **Parent Spec** | `../spec.md` (`014-local-embeddings-migration`) |
| **Phase** | 045 |
| **Depends On** | `../044-suite-revalidation/` |
| **Evidence Dir** | `_sandbox/24--local-llm-query-intelligence/evidence/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 043 proved that one `codex exec` child per scenario is the wrong architecture for this suite. Each child starts its own MCP daemon stack, which can contend with the main session's local llama-cpp Metal context before scenario logic runs.

### Purpose
Create a direct Node MCP client runner that starts shared Spec Kit Memory and CocoIndex MCP daemons, executes mechanically parseable scenario calls through the right JSON-RPC connection, and writes TSV evidence without child agents or nested `codex exec`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Scaffold this Level 2 packet with canonical anchors and metadata.
- Inspect the Spec Kit Memory launcher and MCP SDK client wiring.
- Create `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs`.
- Execute memory scenarios through one `StdioClientTransport` connection to `.opencode/bin/spec-kit-memory-launcher.cjs`.
- Execute CocoIndex scenarios through one `StdioClientTransport` connection to `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp`.
- Write `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv`.
- Smoke scenarios 403, 404, 407, and 410 and capture honest verdicts.
- Add a small parser helper unit test if straightforward.

### Out of Scope
- Modifying the 043 runner.
- Modifying Spec Kit Memory daemon source.
- Creating branches, commits, or PRs.
- Using SpawnAgent.
- Installing packages or using the network.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/046-shared-daemon-suite-runner/` | Create | Level 2 packet docs and metadata. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-mcp-direct.mjs` | Create | Direct MCP suite runner using shared memory and CocoIndex daemons. |
| `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` | Generate | Smoke and suite summary rows. |
| `_sandbox/24--local-llm-query-intelligence/410/workload.json` | Generate | Canned 50-query latency workload. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Create | Unit coverage for the playbook tool-call parser. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Runner avoids child agents and nested `codex exec`. | Source contains no SpawnAgent, `codex exec`, or `opencode run` dispatch path. |
| REQ-002 | Runner starts the memory launcher once. | Script creates one `StdioClientTransport` for `.opencode/bin/spec-kit-memory-launcher.cjs`. |
| REQ-003 | Runner performs MCP handshake and tool discovery. | Script calls `client.connect()` and `client.listTools()` before scenario execution. |
| REQ-004 | Runner emits scenario JSON rows and writes TSV evidence. | Smoke run writes `run-2026-05-14-shared-daemon.summary.tsv` with `scenario`, `verdict`, `key_metric`, `detail`. |
| REQ-005 | Unsupported tool surfaces do not masquerade as PASS. | CocoIndex-only calls are SKIP when `cocoindex_code.search` is not exposed by the connected daemon. |
| REQ-006 | Strict packet validation runs. | `validate.sh <045 packet> --strict` result is recorded. |

## REQ-010: Runner starts a second StdioClientTransport for cocoindex_code
- AC: Script creates one StdioClientTransport for `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp`
- AC: cocoindex_code.search calls are routed through this transport

## SC-001 (revised): Runner uses one MCP client connection per daemon surface
- AC: spec_kit_memory client connects to memory launcher
- AC: cocoindex_code client connects to CocoIndex MCP daemon

## REQ-011: Runner survives partial connect failure without crashing during cleanup
- AC: Failed daemon connections emit diagnostic rows
- AC: Remaining connected clients are properly closed in finally
- AC: Stderr streams are ended for both connected and failed daemons

## REQ-012: Runner times out daemon connections that hang during MCP handshake
- AC: client.connect() wrapped in configurable timeout (default 60s)
- AC: Timeout emits a diagnostic row and marks the client as disconnected

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Scenario parser handles playbook MCP call syntax. | Unit test covers `mcp__server__tool({ ... })` and `memory_search({ ... })`. |
| REQ-008 | Scenario 410 is fully automated. | Smoke run reports latency percentiles and qps from real `memory_search` calls. |
| REQ-009 | Complex narrative scenarios fail closed. | Generic runner returns SKIP for missing or unparsable tool calls. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Runner uses one MCP client connection PER daemon surface (memory + cocoindex_code).
- **SC-002**: Smoke command exits 0 and the daemon terminates cleanly.
- **SC-003**: Scenario 410 returns PASS from real memory searches.
- **SC-004**: Scenario 403 either runs through a real CocoIndex MCP surface or records an explicit SKIP reason.
- **SC-005**: Packet docs capture the architecture, limitations, smoke result, and full-suite recipe.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `@modelcontextprotocol/sdk` under `mcp_server/node_modules` | Bare imports do not resolve from `_sandbox`. | Resolve SDK modules relative to `@spec-kit/mcp-server/package.json`. |
| Dependency | Spec Kit Memory daemon | Memory scenarios depend on the daemon starting and listing tools. | Use SDK handshake and write daemon stderr to a capped evidence log. |
| Dependency | CocoIndex MCP | Scenarios 403, 404, and 407 need `cocoindex_code.search`, which is a separate MCP surface. | Spawn one shared CocoIndex MCP client and route calls by `call.server`. |
| Risk | Startup scan logs overwhelm evidence | The daemon can print large background-scan output. | Cap daemon stderr evidence at 200000 bytes. |
| Risk | Latency scenario is system-load sensitive | 410 can vary across runs. | Record cold and steady metrics separately. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Scenario 410 records p50, p95, p99, and qps from the steady run.
- **NFR-P02**: The runner keeps daemon stderr bounded so evidence remains reviewable.

### Security
- **NFR-S01**: The runner does not write secrets or modify scenario playbooks.
- **NFR-S02**: Tool-call parsing is limited to repository playbook content.

### Reliability
- **NFR-R01**: Unsupported scenario surfaces return SKIP instead of aborting the suite.
- **NFR-R02**: The runner closes the MCP client in a `finally` path.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Missing playbook file: return SKIP with the missing scenario prefix.
- Empty TEST EXECUTION section: return SKIP with "0 parseable MCP calls".
- CocoIndex-only playbook: route to the CocoIndex client and return SKIP unless `search` is present in that client's `listTools()`.

### Error Scenarios
- MCP tool error: return FAIL for the scenario row and continue to summary writing.
- Tool timeout: fail the active scenario with the timeout detail.
- Daemon stderr flood: cap the evidence log at 200000 bytes.

### State Transitions
- Full shared-daemon support: mark memory and CocoIndex scenarios executable when the per-server tool surface is connected.
- Smoke mismatch: keep packet unshipped if requested baseline-PASS scenarios fail or skip.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One runner, one parser unit test, Level 2 docs, generated evidence. |
| Risk | 18/25 | MCP stdio lifecycle plus scenario parsing and local model startup behavior. |
| Research | 14/20 | Required launcher, SDK, tool-list, 043, and playbook inspection. |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Answered: 045 uses a second shared MCP client connection for CocoIndex while still avoiding per-scenario child agents.
<!-- /ANCHOR:questions -->
