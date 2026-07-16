---
title: "Feature Specification: standalone save second-writer guard"
description: "Prevent standalone generate-context Step 11.5 from opening a direct SQLite writer when the mk-spec-memory daemon is already running, and route freshness to MCP memory_index_scan instead."
trigger_phrases:
  - "standalone save second writer guard"
  - "Step 11.5 daemon guard"
  - "mk-spec-memory daemon live detection"
  - "memory_index_scan workaround"
  - "026 007 013 standalone save second writer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard"
    last_updated_at: "2026-05-29T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented standalone save daemon guard"
    next_safe_action: "Run staged verification"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Should launcher lease acquisition be reused? No, it is the wrong layer and still opens the DB too late."
---
# Feature Specification: Standalone Save Second-Writer Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (SQLite single-writer reliability hardening) |
| **Status** | implemented |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent** | `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`generate-context.js` Step 11.5 unconditionally imported `@spec-kit/mcp-server/api/indexing`, called `initializeIndexingRuntime()`, and then ran `reindexSpecDocs()`. That path opens the standalone process's own better-sqlite3 connection to `context-index.sqlite` and writes FTS5 plus `embedding_cache` rows directly. When the mk-spec-memory daemon is already running, the standalone save process becomes a second SQLite writer against the daemon-owned WAL.

### Purpose
Preserve the single-writer invariant. Standalone saves must write canonical docs first, then skip direct spec-doc indexing when the live daemon is detected and instruct operators to finish freshness through daemon-owned MCP `memory_index_scan`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a synchronous, dependency-free daemon detector for the launcher lease file.
- Extract the existing PID liveness probe so workflow lock cleanup and daemon detection share the same ESRCH-tolerant behavior.
- Guard Step 11.5 before importing the indexing runtime so daemon-up saves never open the second writer.
- Harden Step 11.5 catch diagnostics for known contention signatures.
- Document the interim `/memory:save` operator contract.
- Add focused vitest coverage for daemon detection and Step 11.5 daemon-up skip behavior.

### Out of Scope
- Changing the mk-spec-memory daemon, launcher startup flow, or launcher-vs-launcher lease acquisition.
- Using `acquireIndexScanLease` as a save guard; it is acquired after a DB connection opens and does not prevent the second writer.
- Changing sibling packets 009, 010, 012, DB files, WAL recovery, or SQLite pragmas.
- Generating `description.json` or `graph-metadata.json` for this child packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/scripts/core/daemon-detect.ts` | Create | Resolve the canonical launcher lease and report live mk-spec-memory daemon PID state |
| `.opencode/skills/system-spec-kit/scripts/core/workflow.ts` | Modify | Share PID liveness, skip Step 11.5 direct indexing when the daemon is alive, and diagnose contention fallback errors |
| `.opencode/skills/system-spec-kit/scripts/tests/daemon-detect.vitest.ts` | Create | Cover live PID, dead PID, and missing lease cases |
| `.opencode/skills/system-spec-kit/scripts/tests/workflow-step115-daemon-guard.vitest.ts` | Create | Cover daemon-up skip and contention warning behavior |
| `.opencode/commands/memory/save.md` | Modify | Document daemon-down standalone indexing and daemon-up MCP indexing contract |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/013-standalone-save-second-writer-guard/*.md` | Create | Level 2 packet docs and checklist |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Detect a running mk-spec-memory daemon before Step 11.5 imports indexing | Step 11.5 calls `isSpecMemoryDaemonAlive()` before `import('@spec-kit/mcp-server/api/indexing')` |
| REQ-002 | Daemon-up saves must not open the standalone indexing runtime | When detector returns alive, `initializeIndexingRuntime()` and `reindexSpecDocs()` are not called |
| REQ-003 | Standalone daemon-down saves keep the existing direct indexing path | When detector returns not alive, Step 11.5 still imports indexing, initializes runtime, and calls `reindexSpecDocs()` |
| REQ-004 | Known second-writer symptoms must surface a specific diagnosis | Catch handling for `embedding_cache` UNIQUE, `SQLITE_BUSY`, and `vector_index is null` names daemon/contention risk and the `memory_index_scan` workaround |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Operator docs must state the daemon-up/down contract | `/memory:save` docs explain standalone direct indexing only when daemon is down and MCP scan when daemon is up |
| REQ-006 | Focused tests must lock the detector and skip path | Vitest covers live/dead/missing leases and daemon-up skip without invoking the indexing runtime |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With a live launcher lease PID, Step 11.5 logs a loud skip message and does not import the indexing API.
- **SC-002**: With no live daemon, Step 11.5 behavior remains the existing standalone reindex path.
- **SC-003**: Catch diagnostics distinguish daemon/contention signatures from generic skip warnings.
- **SC-004**: Scripts build, focused scripts vitest, and strict packet validation pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Lease PID can be stale or unreadable | Low | Missing, corrupt, or dead leases return `alive:false`, preserving standalone behavior |
| Risk | Skipped Step 11.5 leaves retrieval stale | Medium | Skip message and command docs provide targeted MCP `memory_index_scan` follow-up; docs are already written before indexing |
| Risk | Overusing launcher lease as an acquisition lock would be wrong | High | Detector is read-only and never acquires the launcher lease |
| Dependency | Launcher lease shape remains `{pid, ownerPid, childPid, startedAt}` | Medium | Detector accepts either `pid` or `ownerPid` as the liveness PID |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Daemon detection is synchronous and cheap: one JSON read plus `process.kill(pid, 0)`.

### Security
- **NFR-S01**: No new network surface, external command, or secret handling.

### Reliability
- **NFR-R01**: Daemon-up saves preserve the SQLite single-writer boundary.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Lease Boundaries
- Missing or unparseable launcher lease returns `{ alive: false }`.
- Dead PID returns `{ alive: false }`.
- EPERM-style liveness uncertainty remains treated as alive through the shared `isProcessAlive` behavior.

### Error Scenarios
- `embedding_cache` UNIQUE, `SQLITE_BUSY`, and `vector_index is null` errors produce a contention diagnosis and MCP scan workaround.
- Other unexpected Step 11.5 errors keep the generic skip warning.

### State Transitions
- Daemon down -> standalone Step 11.5 direct writer remains allowed.
- Daemon up -> canonical docs stay written, Step 11.5 direct indexing is skipped, MCP owns reindex freshness.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 11/25 | One new helper, one workflow guard, two tests, one command doc |
| Risk | 16/25 | Touches save/indexing reliability and operator guidance |
| Research | 7/20 | Builds directly on verified investigation w12z0lv4u and daemon reliability siblings |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

