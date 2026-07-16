---
title: "Implementation Plan: 045 Shared Daemon Suite Runner"
description: "Implement a direct Node MCP client runner that connects to shared Spec Kit Memory and CocoIndex daemons, parses playbook tool calls, and routes each call by MCP server."
trigger_phrases:
  - "045 implementation plan"
  - "shared daemon runner plan"
  - "run mcp direct plan"
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
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000045"
      session_id: "046-shared-daemon-suite-runner"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "CocoIndex execution is handled by a second shared StdioClientTransport to cocoindex_code, while memory scenarios stay on spec_kit_memory."
---
# Implementation Plan: 045 Shared Daemon Suite Runner

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM, MCP SDK 1.26.0 |
| **Framework** | `@modelcontextprotocol/sdk` `Client` + `StdioClientTransport` |
| **Storage** | Existing Spec Kit Memory SQLite and generated TSV evidence |
| **Testing** | Node syntax check, Vitest helper test, smoke scenarios 403/404/407/410, strict spec validation |

### Overview
The runner lives in `_sandbox` and resolves the MCP SDK from the Spec Kit Memory server workspace because the repo root does not expose that package. It starts `.opencode/bin/spec-kit-memory-launcher.cjs` once, starts `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp` once, lists tools per server, routes parsed scenario calls by `call.server`, and writes a summary TSV.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified: memory launcher, CocoIndex launcher, MCP SDK, and playbook files.

### Definition of Done
- [x] Runner implemented without child agents.
- [x] Parser helper test passing.
- [x] Smoke command executed with captured verdicts.
- [x] Docs updated with shipped status and CocoIndex wiring evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-process suite driver with two stdio MCP transports.

### Key Components
- **SDK resolver**: Uses `createRequire()` rooted at `.opencode/skills/system-spec-kit/mcp_server/package.json` so ESM imports resolve without installing root dependencies.
- **Memory MCP client**: Creates one `Client` and one `StdioClientTransport` for `.opencode/bin/spec-kit-memory-launcher.cjs`.
- **CocoIndex MCP client**: Creates one `Client` and one `StdioClientTransport` for `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/ccc mcp`.
- **Playbook parser**: Extracts `mcp__server__tool({ ... })` and `memory_tool({ ... })` calls from TEST EXECUTION sections.
- **Scenario executor**: Selects the correct client by `call.server`, checks tool availability per server, and has a dedicated memory-only 410 latency path.
- **Evidence writer**: Emits JSON rows to stdout and writes a TSV summary.

### Data Flow
CLI scenario selection flows into playbook file discovery. The runner handshakes with both daemons, lists tools per server, maps each scenario into tool calls or a dedicated executor, routes each call to the owning MCP client, then writes one `{scenario, verdict, key_metric, detail}` row per scenario.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/spec-kit-memory-launcher.cjs` | Existing memory daemon launcher | Read-only discovery | `sed`/`rg` showed it spawns `dist/context-server.js` with `stdio: inherit`. |
| `_sandbox/.../run-mcp-direct.mjs` | Suite driver | Update | `node --check` and smoke command. |
| `mcp_server/tests/shared-daemon-runner-helpers.vitest.ts` | Parser unit coverage | Create | `npx vitest run tests/shared-daemon-runner-helpers.vitest.ts`. |
| CocoIndex MCP daemon | Existing semantic code search MCP surface | Read-only execution | `search` listed and scenarios 403/404/407 passed through one shared client. |
| 043 runner | Failed child-process attempt | Unchanged | Not modified. |
| Spec Kit Memory daemon source | MCP server implementation | Unchanged | Not modified. |

Required inventories:
- Same-class producers: direct search found the launcher stdio binding and MCP server `StdioServerTransport` use.
- Consumers of changed symbols: only the new runner test imports `parseScenarioToolCalls`.
- Matrix axes: memory tool available, CocoIndex tool unavailable, parseable call, non-parseable narrative scenario, missing playbook.
- Algorithm invariant: unavailable tool surfaces return SKIP, and available surfaces route to their owning client.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold Level 2 packet.
- [x] Inspect 043 failure context.
- [x] Inspect launcher, SDK version, and memory daemon tool list.

### Phase 2: Core Implementation
- [x] Create direct MCP runner.
- [x] Add parser helper export.
- [x] Implement dedicated 410 latency automation.
- [x] Add unavailable-tool SKIP behavior.

### Phase 3: Verification
- [x] Run parser unit test.
- [x] Run smoke scenarios 403 and 410.
- [x] Update packet docs and implementation summary.

### Phase 2 - CocoIndex Wiring
- [x] Add a second `StdioClientTransport` for `cocoindex_code`.
- [x] Track `memoryToolNames` and `cocoindexToolNames` separately.
- [x] Route generic scenario calls through the selected client based on `call.server`.
- [x] Add bounded CocoIndex daemon readiness handling for startup indexing.
- [x] Re-smoke scenarios 403, 404, 407, and 410 with PASS verdicts.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Syntax | Runner parses as Node ESM | `node --check` |
| Unit | Playbook tool-call parser | Vitest |
| Integration | Direct MCP handshake, per-server tool list, scenario 403/404/407/410 smoke | `node run-mcp-direct.mjs --scenarios 403,404,407,410` |
| Spec | Level 2 packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@modelcontextprotocol/sdk` 1.26.0 | Internal installed dependency | Green | Runner cannot start MCP client without it. |
| Spec Kit Memory launcher | Internal executable | Green | Runner cannot execute memory scenarios without it. |
| CocoIndex MCP search | Separate MCP surface | Green | 403, 404, and 407 execute through the shared CocoIndex client. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Runner causes unexpected evidence churn or proves misleading.
- **Procedure**: Remove the 045 packet, `_sandbox/.../run-mcp-direct.mjs`, generated shared-daemon evidence files, generated workload JSON, and the parser vitest. No daemon source rollback is needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Discovery -> Runner implementation -> Parser unit test -> Smoke run -> Packet docs -> Strict validation
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Discovery | 043 context and launcher reads | Runner implementation |
| Runner implementation | Discovery | Smoke run |
| Verification | Runner implementation | Completion metadata |
| Documentation | Smoke result | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and discovery | Medium | 30-45 minutes |
| Core implementation | Medium | 60-90 minutes |
| Verification and docs | Medium | 30-60 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No production daemon source changed.
- [x] No branch or commit created.
- [x] Runner isolated to `_sandbox`.

### Rollback Procedure
1. Delete the new runner and generated shared-daemon evidence.
2. Delete the 045 packet folder.
3. Delete the parser helper vitest.
4. Re-run `git status --short` to confirm only unrelated prior changes remain.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Remove generated files only.
<!-- /ANCHOR:enhanced-rollback -->
