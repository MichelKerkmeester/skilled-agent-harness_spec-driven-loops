---
title: "Feature Specification: Wire a second live code-graph daemon into the substrate stress harness"
description: "Start a dedicated mk-code-index daemon alongside mk-spec-memory in the substrate harness, and give both spawned daemons short IPC socket dirs, so scenarios 403/404/407 execute against a real second daemon (PASS) and the suite is green by default instead of red on deep checkouts."
trigger_phrases:
  - "substrate code-graph 2nd daemon"
  - "substrate two real daemons"
  - "substrate sun_path socket dir fix"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/004-substrate-codegraph-2nd-daemon"
    last_updated_at: "2026-05-31T05:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wired 2nd daemon + short socket dirs; vitest 3x green"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003655"
      session_id: "036-005-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The empty-graph blocker that deferred this 3x was resolved by populating the code-graph DB (70278 nodes) via a claude2-dispatched code_graph_scan; with the graph populated, 403/404/407 execute against the 2nd daemon (PASS), and the harness self-set short socket dirs make the suite green without any external env var."
---
# Feature Specification: Wire a second live code-graph daemon into the substrate stress harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Completed (2026-05-31) |
| **Created** | 2026-05-31 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening |
| **Predecessor** | system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/002-substrate-codegraph-scenarios |
| **Successor** | None |
| **Handoff Criteria** | The substrate harness starts a dedicated mk-code-index daemon, both daemons use short IPC socket dirs, scenarios 403/404/407 execute (PASS), 410 stays PASS/PARTIAL, the vitest passes 3x consecutive, no graph-metadata mass-write, comment-hygiene clean. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Two defects compounded in `run-substrate-stress-harness.mjs`. First, packet 002 corrected scenarios 403/404/407 to call `mcp__mk_code_index__code_graph_context`, but the runner only ever connected the `mk-spec-memory` daemon — `selectClientForServer` returned `null` for `mk_code_index`, so those scenarios SKIPped and never exercised the code-graph path. Second, the runner spawned its daemons WITHOUT a short `SPECKIT_IPC_SOCKET_DIR`, so each daemon's `context-server` tried to `listen()` on its in-`database/daemon-ipc.sock` path (~134 chars from this repo root) → `EINVAL` (exceeds the ~104-byte macOS `sun_path` limit) → child died → `runner:mk-spec-memory=FAIL` → all scenarios SKIP → the vitest FAILED. The suite was therefore RED by default on this operator's deep checkout (it only passed when a caller exported a short socket dir by hand).

### Purpose
Make the substrate suite genuinely exercise two real daemons AND be green by default: start a dedicated code-graph daemon, route `mk_code_index` to it, and have the harness self-assign short, distinct, pre-created IPC socket dirs to both spawned daemons so no caller env var is required.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a `shortSocketDir(slug)` helper that returns (and creates) a per-daemon dir under `os.tmpdir()` (an allowed, short socket root).
- Pass `SPECKIT_IPC_SOCKET_DIR: shortSocketDir('mem')` to the existing memory daemon's env.
- Add a second `connectSharedClient` for `mk-code-index` (its own `shortSocketDir('cg')`, bridge disabled, maintainer mode OFF so no INDEX_* scan / graph-metadata mass-write), register it under `clients`/`toolNameSets`, and extend `selectClientForServer` to route `mk_code_index` / `mk-code-index`.
- Update the now-stale vitest description + two comments to the two-daemon reality (assertions unchanged).

### Out of Scope
- Populating the code-graph DB — done separately (a `code_graph_scan` dispatched via claude2 earlier this session; the DB is a gitignored generated artifact).
- Tightening the vitest to forbid SKIP for 403/404/407. SKIP is retained as a tolerated fallback so an empty graph or a transient code-graph startup failure degrades to SKIP rather than flaking the shared suite. (Noted as a possible future hardening.)
- `.env.local` maintainer-mode behavior; the code-graph daemon, its DB, and the scenario playbooks.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modify | Short socket dirs for both daemons + 2nd daemon connection + routing |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modify | Sync stale description + 2 comments to two-daemon reality (assertions unchanged) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both daemons get short IPC socket dirs | Each spawned daemon's `SPECKIT_IPC_SOCKET_DIR` is a short, pre-created `os.tmpdir()` subdir; neither hits sun_path EINVAL. |
| REQ-002 | Second real daemon connected + routed | The runner starts a dedicated mk-code-index daemon, registers its client + tool-name set, and `selectClientForServer` routes `mk_code_index`. |
| REQ-003 | Scenarios execute | 403/404/407 produce PASS (not SKIP, not FAIL); 410 stays PASS/PARTIAL; 0 runner-FAIL rows. |
| REQ-004 | Green by default + no regression | `npm run stress:substrate` passes with NO external env var, 3x consecutive (clean start each). |
| REQ-005 | No mass-write hazard | Running the suite dirties 0 graph-metadata.json files (maintainer mode off, no INDEX_* scan). |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Hygiene + scope | Comment-hygiene 0 violations; vitest `expect(...)` assertions byte-unchanged; only the 2 substrate files touched. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The substrate suite exercises the code-graph path through a real second daemon — 403/404/407 = PASS — proving end-to-end two-daemon coverage.
- **SC-002**: The suite is green by default (no caller env), converting a red-at-HEAD test (verified: `1 failed | 2 passed` with the change stashed) to reliably green (verified: `3 passed / 9 tests` 3x consecutive).

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Code-graph daemon fails to connect | runner:mk-code-index FAIL → test fails | De-risked via a standalone probe (connect + code_graph_context returned content); SKIP retained as tolerated fallback if it ever cannot start |
| Risk | Maintainer-mode INDEX_* scan rewrites graph-metadata | daemon-index-staging-hazard | Maintainer mode left OFF; verified 0 graph-metadata files dirtied before/after across all runs |
| Risk | sun_path overflow from deep socket path | listen() EINVAL | Both daemons use short pre-created os.tmpdir() subdirs |
| Risk | Empty code-graph DB → hollow PASS | False green | The DB was populated (70278 nodes) before this wiring; an empty graph would degrade to tolerated SKIP, not a silent pass |
| Dependency | populated code-graph.sqlite | Scenarios resolving nodes | Populated this session via claude2-dispatched code_graph_scan |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Adds one daemon spawn + connect (~seconds) to the substrate run; well within the existing 240s vitest budget.

### Security
- **NFR-S01**: Reuses the runner's env denylist (no token/secret env passed to either child); no new external input.

### Reliability
- **NFR-R01**: Dedicated child daemons (bridge disabled) never contend with the operator's long-running daemons; `client.close()` tears them down. Short socket dirs make the suite robust to deep checkout paths.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### State Transitions
- Both daemons connect + graph populated: 403/404/407 execute → PASS, 410 PASS. Correct.
- A daemon cannot start: a `runner:<name> FAIL` row appears → vitest fails loudly (no silent green). Correct.
- Code-graph connects but graph empty: scenarios degrade to tolerated SKIP, not a false PASS. Acceptable.
- Stale `.unclean-shutdown` marker from a prior SIGKILL: the memory daemon's boot path handles it; a clean start clears it deterministically.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Socket-dir helper + 2nd daemon connection + routing + comment sync in a test harness |
| Risk | 9/25 | Touches a (red-at-HEAD) shared test; mitigated by probe-first + stash-compare + 3x green + mass-write check |
| Research | 9/20 | Read the full harness, the launcher socket/bridge logic + allowlist, the vitest assertions, the daemon stderr; ran a standalone probe + a stash-baseline comparison |
| **Total** | **27/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the vitest forbid SKIP for 403/404/407 to hard-enforce the wiring? Deferred — keeping SKIP tolerated avoids CI flake on a transient code-graph startup or an unpopulated graph in environments that do not pre-scan; revisit if silent SKIP regressions become a concern.

<!-- /ANCHOR:questions -->
