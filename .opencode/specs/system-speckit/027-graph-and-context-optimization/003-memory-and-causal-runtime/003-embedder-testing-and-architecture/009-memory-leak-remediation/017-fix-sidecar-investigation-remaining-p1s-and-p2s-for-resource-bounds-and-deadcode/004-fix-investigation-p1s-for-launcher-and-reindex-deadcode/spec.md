---
title: "Spec: Launcher and Reindex P1 Finding Closure"
description: "Level 2 packet closing F15, F49, and F105 across ensure-rerank-sidecar.cjs and reindex.ts."
trigger_phrases:
  - "arc 010 003 004 launcher reindex p1"
  - "F15 F49 F105 remediation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/017-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "Closed launcher/reindex P1 findings F15, F49, F105"
    next_safe_action: "Commit handoff only; no git mutation performed"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/bin/lib/ensure-rerank-sidecar.vitest.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0100030040100030040100030040100030040100030040100030040100030040"
      session_id: "010-003-004-launcher-reindex-p1"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "F105 default chosen: delete dead cancellation-polling branches and document unsupported runtime cancellation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Launcher and Reindex P1 Finding Closure

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Completed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (010/003) |
| **Handoff Criteria** | 3 P1 closed; launcher vitest green; reindex tests green; typecheck green; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rerank sidecar launcher still had two P1 process-boundary risks: F15 owner-token publication could leave a partially written or race-observed token, and F49 spawned the sidecar with blanket parent environment inheritance. The embedder reindex loop also kept F105 cancellation polling branches even though production has no cancellation caller, adding dead DB reads and implying a feature that is not wired.

### Purpose
Close the three P1 findings with surgical edits, fixture coverage, and packet-local documentation that records why runtime cancellation remains unsupported for this phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F15 atomic owner-token creation in `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- F49 child-process environment allowlist in `.opencode/bin/lib/ensure-rerank-sidecar.cjs`.
- F105 deletion of dead cancellation polling in `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts`.
- Fixture tests in `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts`.
- Existing reindex test verification.
- Packet docs in this folder.

### Out of Scope
- Touching `sidecar-worker.ts`, `execution-router.ts`, `sidecar-client.ts`, or barrel exports. Those belong to sibling phase children.
- Wiring a new MCP cancellation tool for reindex jobs.
- Git commit or branch mutation.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | Add lock-protected atomic owner-token write and child env allowlist |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modify | Add F15 atomic/concurrency fixtures and F49 env fixture |
| `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts` | Modify | Remove dead cancellation status helper and two polling branches |
| `<this-folder>/decision-record.md` | Create | Record owner-token, env allowlist, and F105 cancellation decisions |
| `<this-folder>/*.md` | Modify | Fill Level 2 packet docs and verification evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Close F15 owner-token write race | Token creation uses random temp path, `openSync(..., 'wx', 0o600)`, `fsyncSync`, and atomic publish under an exclusive lock; fixture proves concurrent processes return one token |
| REQ-002 | Close F49 env leakage | Spawned sidecar env is built from an allowlist and explicit overrides; fixture proves `PATH` and `SPECKIT_*` pass while a custom secret is stripped |
| REQ-003 | Close F105 dead reindex polling | `getCancellationStatus` and both `runJob` cancellation polls are removed; reindex tests still pass |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Preserve launcher behavior | Existing active launcher vitest cases pass |
| REQ-005 | Preserve reindex behavior | `embedder-reindex.vitest.ts` and `mcp_server/tests/embedders/` pass |
| REQ-006 | Document F105 decision | `decision-record.md` records deletion instead of wiring production cancellation |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 3 P1 findings closed: F15, F49, F105.
- **SC-002**: 3 new launcher fixtures pass.
- **SC-003**: Existing reindex tests pass.
- **SC-004**: Typecheck and strict spec validation exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Owner-token race handling can deadlock on stale lock | Medium | Bound wait to 2000ms and fail closed if token never appears |
| Risk | Env allowlist may omit a sidecar runtime variable | Medium | Allow system keys, `LC_*`, `SPECKIT_*`, `RERANK_*`, and `HF_*`; sidecar start.sh still performs its own scrub |
| Risk | Removing cancellation polls changes test-only cancellation semantics if a job is cancelled while running | Low | Production has zero caller; queued cancellation remains tested through `cancelJob` before `resumeReindexJobs` |
| Dependency | Existing Vitest and typecheck tooling | Medium | Use installed `mcp_server/node_modules/vitest` when root command path is unavailable |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Reindex no longer performs per-batch cancellation status SELECTs for an unreachable production state.

### Security
- **NFR-S01**: Child process env propagation follows least privilege.
- **NFR-S02**: Owner-token file publication avoids partial-token observation and concurrent writer corruption.

### Reliability
- **NFR-R01**: Concurrent launcher processes converge on one owner token.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty existing owner-token file: treated as absent and regenerated by the lock holder.
- Missing token file while another process holds the lock: loser waits briefly for the winning token.
- Parent env contains unrelated secret: secret is not copied into the spawned sidecar env.

### Error Scenarios
- Random temp path collision: `wx` fails closed.
- Stale owner-token lock with no token: wait times out and propagates the original exclusive-create error.
- Reindex job starts in `cancelled`: still exits before running because the initial status guard remains.

### State Transitions
- Queued job cancellation before run remains supported through existing `cancelJob` behavior.
- Mid-run cancellation is documented as unsupported until a real production caller is introduced.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 2 source files, 1 test file, 3 findings |
| Risk | 14/25 | Process env and owner-token persistence are security-sensitive |
| Research | 6/20 | Findings and sibling precedents already existed |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. F105 uses the requested default: delete dead branches and document removal.
<!-- /ANCHOR:questions -->
