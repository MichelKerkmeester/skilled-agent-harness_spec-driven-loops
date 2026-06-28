---
title: "Atomic State: SHA-256 Integrity Helpers"
description: "Registry and config JSON snapshots are loaded between iterations with no integrity check, allowing tampered or partially-written files to silently corrupt a loop session on resume."
trigger_phrases:
  - "atomic-state-integrity-helpers"
  - "sha256-snapshot-integrity"
  - "integrity-stamp-verify"
  - "registry-json-integrity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/156-agent-loops-improved/002-implementation/002-deep-loop-runtime/002-atomic-state-integrity-helpers"
    last_updated_at: "2026-06-28T14:01:53Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec.md from research.md §5.1"
    next_safe_action: "Create plan.md and tasks.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-atomic-state-integrity-helpers"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: Atomic State — SHA-256 Integrity Helpers

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 18 |
| **Predecessor** | 001-atomic-state-serialize-diff |
| **Successor** | 003-atomic-state-deferred-writer |
| **Handoff Criteria** | `computeIntegrityHash`, `stampIntegrity`, and `verifyIntegrity` are exported; warn-on-mismatch path is exercised in tests; JSONL exclusion is documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the deep-loop-runtime recs specification.

**Scope Boundary**: Adds `computeIntegrityHash`, `stampIntegrity`, and `verifyIntegrity` functions to `atomic-state.ts` for object/registry JSON only; JSONL end-to-end integrity is explicitly excluded.

**Dependencies**:
- 001-atomic-state-serialize-diff (atomic-state.ts already touched; this phase adds to it)

**Deliverables**:
- Three exported integrity functions in `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

There is no integrity check on loaded registry or config JSON between iterations; a partially-written snapshot or externally tampered file is indistinguishable from a clean one and silently corrupts the loop session on resume. Mutation operations proceed against stale or corrupted data with no warning surfaced to the operator. This leaves the loop vulnerable to subtle state drift that is hard to diagnose after the fact.

### Purpose

Add `computeIntegrityHash`, `stampIntegrity`, and `verifyIntegrity` so every JSON snapshot load can be verified against a stored hash and operators receive a warn-level log on mismatch before any mutation proceeds.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `computeIntegrityHash(obj: unknown): string` that serializes the object canonically and returns a `sha256:<hex>` digest
- Add `stampIntegrity<T extends object>(obj: T): T & { _integrity: string }` that attaches the hash as `_integrity` before write
- Add `verifyIntegrity(obj: unknown): boolean` that recomputes the hash and compares against `obj._integrity`; emits a `console.warn` on mismatch and returns `false` without throwing
- Apply warn-first (not fail-fast) on mismatch: mutation is not blocked in this phase; fail-fast is a deliberate follow-up once operators confirm the warning surfaces
- Scope is object/registry JSON only — explicitly excludes JSONL

### Out of Scope

- JSONL end-to-end integrity — needs sidecar or per-record design, explicitly deferred
- Fail-fast on mismatch — deliberate follow-up after operators confirm warning surfaces in practice
- Key rotation or signing beyond SHA-256 hash comparison

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/atomic-state.ts` | Modify | Add `computeIntegrityHash`, `stampIntegrity`, `verifyIntegrity` exports |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Implement `computeIntegrityHash`, `stampIntegrity`, and `verifyIntegrity` for object/registry JSON with SHA-256 and warn-first mismatch reporting | All three functions are exported; `verifyIntegrity` returns `false` and emits `console.warn` on a tampered object; returns `true` on a clean object |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Document the JSONL exclusion and warn-first rationale in JSDoc on `verifyIntegrity` | JSDoc comment states JSONL is excluded, references the deferred sidecar design, and notes that fail-fast is a follow-up |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `verifyIntegrity` returns `true` for an unmodified stamped object and `false` (with a `console.warn`) for any object whose `_integrity` field does not match the recomputed hash
- **SC-002**: TypeScript compilation passes with zero new type errors; no mutation is blocked by mismatch in this phase (warn only)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Evidence | `external/kasper/src/state.ts:150-177,1048-1059`; `CHANGELOG.md:34-35` (reference only — NOT our code) | Low | Read-only citation from research.md §5.1 |
| Risk | Warn-first may allow a tampered snapshot to proceed one iteration before an operator notices | Med | Decision is deliberate — fail-fast is a tracked follow-up once operators confirm the warning surfaces in telemetry |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None at this time.
<!-- /ANCHOR:questions -->

---

> **Provenance:** research.md §5.1, (iters 19, 43)

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
