---
title: "Spec: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104"
description: "Level 2 packet closing rerank sidecar deferred P2 findings for filesystem durability, state-dir validation, health payload shape, spawn logging, DI, and helper extraction."
trigger_phrases:
  - "020 003 filesystem durability"
  - "F22 F28 F59 F66 F67 F72 F89 F103 F104 sidecar"
  - "ensure rerank sidecar durability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/003-fix-deferred-p2s-for-filesystem-durability"
    last_updated_at: "2026-05-23T10:31:09Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/bin/lib/ensure-rerank-sidecar.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0200030200030200030200030200030200030200030200030200030200030200"
      session_id: "020-003-filesystem-durability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User pre-approved this Level 2 spec folder and branch main."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Filesystem Durability Closure for F22 F28 F59 F66 F67 F72 F89 F103 F104

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (020 deferred P2 bucket parent) |
| **Predecessors** | `../001-fix-deferred-p2s-for-test-only-and-shared-exports/decision-record.md`; `../002-fix-deferred-p2s-for-env-and-config-behavior/decision-record.md`; `../../010-sidecar-hardening/003-fix-sidecar-investigation-f15-atomic-writes/004-f15-atomic-write/decision-record.md` if present |
| **Handoff Criteria** | F22/F28/F59/F66/F67/F72/F89/F103/F104 closed; requested vitest suites green; mcp-server typecheck green; strict validate exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Nine deferred P2 findings remain in the rerank sidecar launcher durability surface. The current launcher needs stronger rename durability, consistent temp naming, state directory validation, owner-only log permissions, stable log fd stdio, normalized health payloads, caller-consistent `skipIfDisabled` handling, dependency injection seams for tests, and a smaller orchestrator split into focused helpers.

### Purpose
Close the bucket with bounded behavior changes, regression fixtures, and ADRs that document crash durability and compatibility effects.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend the F15 atomic-write baseline with directory fsync after rename.
- Standardize temp names on `crypto.randomBytes(16).toString('hex')`.
- Validate `RERANK_SIDECAR_STATE_DIR` before launcher state is used.
- Open sidecar log files with mode `0600`.
- Spawn with `stdio: ['ignore', logFd, logFd]` when logging is enabled.
- Normalize health payloads to `{ status, port, ownerCount, lastReapTs }`.
- Add internal dependency injection while preserving the public `ensureRerankSidecar` signature.
- Split the largest launcher function into focused internal helpers.
- Add focused fixtures in `ensure-rerank-sidecar.vitest.ts`.

### Out of Scope
- Modifying `sidecar-client.ts`, `sidecar-worker.ts`, `execution-router.ts`, `reindex.ts`, `registry.ts`, or `index.ts`.
- Changing provider selection, rerank model behavior, worker protocol, or request payloads.
- Git commit or branch mutation.
- Broad sidecar architecture refactors beyond helper extraction inside the launcher.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | Modify | Durability, validation, health payload, spawn stdio, DI, and helper extraction |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | Modify | Regression fixtures for the nine findings |
| `<this-folder>/*.md` | Modify | Record plan, ADRs, checklist evidence, verification, and handoff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F72 directory fsync parity | Every atomic write rename path fsyncs the containing directory after successful rename |
| REQ-002 | F104 random temp naming | Persistent temp files use a `crypto.randomBytes(16).toString('hex')` suffix |
| REQ-003 | F89 state-dir validation | Relative, traversal, outside-home, and non-writable state dirs fail with stderr and non-zero launcher exit |
| REQ-004 | F103 log mode | Log files are opened with owner-only `0600` mode |
| REQ-005 | F66 spawn stdio | Logging spawn uses `stdio: ['ignore', logFd, logFd]` |
| REQ-006 | F59 health shape | Health probes return `{ status, port, ownerCount, lastReapTs }` with stable field names and types |
| REQ-007 | F22 skipIfDisabled consistency | All callers follow the same disabled-sidecar skip behavior |
| REQ-008 | F28 DI hook | Tests can inject spawn, fetch, fs, and process dependencies without changing the public API |
| REQ-009 | F67 helper split | Largest launcher function is split into focused helpers while preserving behavior |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Preserve targeted tests | Requested bin and embedders vitest commands exit 0 |
| REQ-011 | Preserve type safety | `npm run typecheck --workspace=@spec-kit/mcp-server` exits 0 |
| REQ-012 | Preserve packet docs | `validate.sh <spec-folder> --strict` exits 0 before source edits and at completion |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All nine findings are marked closed in `checklist.md`.
- **SC-002**: Atomic persistent writes durably persist file contents and containing-directory rename metadata where the platform supports directory fsync.
- **SC-003**: State-dir rejection is explicit and test-covered.
- **SC-004**: Log files use owner-only permissions and child stdio shape is stable.
- **SC-005**: Health payload shape is fixture-protected.
- **SC-006**: All requested verification commands exit 0 unless halt-on-first-regression triggers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Directory fsync is platform-sensitive | Medium | Best-effort helper closes descriptors and documents unsupported cases |
| Risk | State-dir validation rejects prior relative paths | Medium | Fail early with clear stderr and document compatibility impact |
| Risk | Log mode `0600` may reduce ops readability | Medium | Choose sensitivity over broad readability and document local owner access |
| Risk | DI refactor changes launcher flow | Medium | Preserve public API and add fixtures around injected dependencies |
| Dependency | F15 atomic-write baseline | High | Extend existing wx + random temp + rename pattern rather than replacing it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Directory fsync occurs only after persistent atomic writes, not health polling.

### Security
- **NFR-S01**: Log files are owner-readable and owner-writable only.
- **NFR-S02**: Rejected state-dir paths are reported without exposing secrets beyond the path supplied by the operator.

### Reliability
- **NFR-R01**: Rename metadata is durably flushed after atomic writes when the platform supports directory fsync.
- **NFR-R02**: Targeted test suites pass before completion.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- State dir must be absolute, normalized, under `$HOME`, and not contain traversal segments.
- Health payload fields must stay present even when no owner ledger exists.

### Error Scenarios
- Directory fsync failures after rename fail the write rather than claiming durable persistence.
- Invalid state-dir input exits non-zero with a clear stderr message.

### State Transitions
- Existing valid state dirs under `$HOME` continue to work.
- Persistent state writes move through random temp file, fsync file, rename, fsync containing directory.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One launcher plus focused tests and packet docs |
| Risk | 17/25 | Crash/restart durability and path validation are observable |
| Research | 10/20 | Requires predecessor ADRs and F15 atomic-write baseline reads |
| **Total** | **45/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. User specified scope, predecessor, verification, and no-commit constraint.
<!-- /ANCHOR:questions -->
