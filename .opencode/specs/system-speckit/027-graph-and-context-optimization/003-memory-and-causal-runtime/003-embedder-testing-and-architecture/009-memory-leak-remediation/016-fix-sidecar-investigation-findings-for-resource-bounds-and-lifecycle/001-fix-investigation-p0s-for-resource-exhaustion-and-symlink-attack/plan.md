---
title: "Plan: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack"
description: "Implementation plan for closing F12, F13, and F47 with explicit parsing bounds and safe temp-file creation."
trigger_phrases:
  - "arc 010 p0 plan"
  - "F12 F13 F47 plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack"
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "planned-p0-remediation-child"
    next_safe_action: "implement-bounded-sidecar-ipc"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100020010100020010100020010100020010100020010100020010100020010"
      session_id: "010-002-001-p0"
      parent_session_id: null
    completion_pct: 0
---
# Plan: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Node IPC |
| **Surface** | system-spec-kit embedder sidecar and rerank sidecar ensure helper |
| **Evidence** | `../../001-deep-research-drift-and-simplification/research/research.md`, `../../001-deep-research-drift-and-simplification/research/findings-registry.json` |
| **Findings** | F12, F13, F47 |

### Overview
The phase adds explicit resource caps at the IPC boundaries before JSON parsing or allocation, and replaces predictable ledger temp files with an exclusive crypto-random write pattern.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Finding IDs, fingerprints, and file lines are captured.
- [x] P0 scope is limited to F12, F13, and F47.
- [x] Research artifacts remain read-only.

### Definition of Done
- [ ] F12, F13, and F47 checklist rows are closed with commit and test evidence.
- [ ] Targeted tests assert rejection or termination behavior.
- [ ] Phase and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- No sidecar JSON boundary parses a line above the configured max line length.
- No sidecar buffer grows beyond a configured max buffer size while waiting for newline framing.
- No worker accepts an `input` array above the configured max batch size.
- No ledger temp file uses a predictable name or non-exclusive creation path.

### Affected Surfaces

| Surface | Findings | Invariant |
|---------|----------|-----------|
| `sidecar-client.ts` stdout handling | F12 | Bounded line and buffer before `JSON.parse`. |
| `ensure-rerank-sidecar.cjs` ledger writes | F13 | Crypto-random temp suffix plus exclusive creation. |
| `sidecar-worker.ts` stdin parsing | F47 | Bounded line and bounded `input` array. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Bound Client Stdout
Implement F12 by guarding chunk accumulation and line parsing in `handleStdout`.

### Phase 2: Harden Ledger Temp Writes
Implement F13 by replacing `process.pid + Date.now()` temp suffixes with `crypto.randomBytes(16).toString('hex')` and exclusive `'wx'` creation.

### Phase 3: Bound Worker Stdin
Implement F47 by rejecting oversized lines and oversized `input` arrays before provider allocation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Area | Required Evidence |
|-----------|-------------------|
| Client stdout | Oversized line and oversized pending buffer are rejected and child cleanup runs. |
| Ledger temp write | Existing temp path collision does not overwrite; generated suffix is non-predictable in production. |
| Worker stdin | Oversized JSON line and oversized `input` arrays fail before embedding work starts. |
| Spec docs | This child and parent `validate.sh --strict` exit 0. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing sidecar tests | Test suite | Expected | Need nearby fixtures for resource-bound assertions. |
| Node crypto API | Runtime | Available | Required for unpredictable temp suffixes. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a cap breaks legitimate batches, keep the named constants and tune only the configured values with test evidence. If the temp-file write path breaks fixtures, retain production exclusivity and adjust tests through dependency injection rather than weakening production behavior.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| P0 fixes | Arc 010/001 research registry | P1 remediation phases |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Implementation | 1 dispatch | Three localized P0 fixes. |
| Verification | 1 pass | Targeted tests and strict validation. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

On validation failure, record the failing command in `implementation-summary.md` and keep changes scoped to the three P0 surfaces until the failure is resolved.
<!-- /ANCHOR:enhanced-rollback -->
