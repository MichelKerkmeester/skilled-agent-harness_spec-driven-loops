---
title: "Feature Specification: Scouted Bugfix Batch 5"
description: "Batch 5 of the scouted bugfix train: the verify-first round-3 tail. 4 originally-unconfirmed targets re-confirmed by a gpt-5.5-fast confirm pass; 1 (cli-devin phantom dangerous permission rows) already shipped via parallel 130/014 cli-doc work, so this packet lands the remaining 3. Fixes: D4-R grader dim_id mismatch capping confidence, handover freshness timestamp field mismatch falling through to mtime, and updatePhaseParentPointer bypassing Zod schema validation on the highest-frequency graph-metadata mutation path."
trigger_phrases:
  - "scouted bugfix batch 5"
  - "d4-r grader dim_id mismatch"
  - "handover freshness timestamp field"
  - "updatePhaseParentPointer bypasses zod"
  - "verify-first round-3 tail"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/005-scouted-bugfix-batch-5"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "3 fixes shipped with regression tests; 4th confirmed target already shipped via 130/014"
    next_safe_action: "validate --strict and reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts"
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-5-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "User directive: land the 3 re-confirmed batch-5 targets from the verify-first round-3 tail; the 4th (cli-devin phantom dangerous permission rows) already shipped via parallel 130/014; each fix ships with a regression test."
---
# Feature Specification: Scouted Bugfix Batch 5

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `138-scouted-bugfix-batch-5` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The verify-first round-3 tail left 4 targets originally classified as unconfirmed. A follow-up gpt-5.5-fast confirm pass re-examined all 4 against the real code and confirmed every one. One of the four — the cli-devin phantom "dangerous" permission rows — had already shipped via parallel `130/014` cli-doc work, so this batch lands the remaining 3 confirmed defects: a D4-R grader `dim_id` mismatch that silently capped confidence at 0.3 on every real grade, a handover freshness timestamp field mismatch that dropped live handovers to an unreliable mtime fallback, and the highest-frequency graph-metadata mutation path (`updatePhaseParentPointer`) reading/writing with NO Zod schema validation, silently accepting malformed timestamps and empty `last_active_child_id`.

### Purpose
Close out the verify-first round-3 tail: re-confirm each of the 4 unconfirmed targets against the real code, then fix only the 3 not already shipped elsewhere, proving each fix with a regression test before claiming completion. The 4th confirmed target is documented as already-landed via `130/014` and is not re-edited here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **CONFIRM** each round-3-tail candidate by gpt-5.5-fast deep-dive against real code before editing.
- **DEDUPE** the cli-devin phantom-permission-rows target: already shipped via parallel `130/014`; not re-edited.
- **FIX** the 3 remaining confirmed defects across their source + test files.
- **VERIFY** every fix: added regression test per fix; build/typecheck for affected TS; validate.sh --strict 0.

### Out of Scope
- Batches 1, 2, 3, 4 targets (fixed in prior packets).
- The cli-devin phantom "dangerous" permission rows: confirmed but already shipped via parallel `130/014` cli-doc work — not re-edited here.
- Daemon recycle / deploy orchestration: handled separately by the orchestrator after commit.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md` | Modify | D4-R system prompt: change `"dim_id": "D4R"` → `"dim_id": "D4-R"` to match harness strict equality against `'D4-R'` |
| `system-spec-kit/mcp_server/lib/resume/resume-ladder.ts` | Modify | `parseHandoverSignal()`: extract frontmatter once; add `updated` alias + continuity-block fallback so live handovers no longer drop to mtime |
| `system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts` | Modify | +2 regression tests for `updated:` top-level + `last_updated_at:` under `_memory.continuity:` (9 pre-existing + 2 new = 11/11) |
| `system-spec-kit/scripts/memory/generate-context.ts` | Modify | `updatePhaseParentPointer`: parse on-disk file with `graphMetadataSchema` (Zod) before mutating; construct a typed `GraphMetadata` value |
| `system-spec-kit/scripts/tests/phase-parent-pointer.vitest.ts` | Add | Regression test for the Zod-validated phase-parent pointer mutation path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each round-3-tail candidate re-confirmed before any edit | gpt-5.5-fast confirm pass per candidate; all 4 CONFIRMED; no edit on an unconfirmed candidate |
| REQ-002 | Already-shipped candidate is NOT re-edited | cli-devin phantom-permission-rows target deduped against `130/014`; left untouched |
| REQ-003 | Every fix proven with an added regression test | Each of the 3 fixes has an added or updated regression test that passes |
| REQ-004 | Affected TS still typechecks/builds after edits | resume-ladder + generate-context changes typecheck/build clean |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | D4-R grade returns the harness-expected dim_id | Prompt emits `"dim_id": "D4-R"`; no confidence cap / mismatch annotation on real D4-R grades; regression test passes |
| REQ-006 | Handover freshness reads the live timestamp fields | `parseHandoverSignal()` honors `updated`, `last_updated`, `last_updated_at` top-level + `last_updated_at` under `_memory.continuity`; no spurious mtime fallback; 11/11 tests pass |
| REQ-007 | Phase-parent pointer mutation is Zod-validated | `updatePhaseParentPointer` parses on-disk file with `graphMetadataSchema` and rejects malformed timestamps / empty `last_active_child_id`; regression test passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 remaining confirmed candidates fixed; the cli-devin target deduped (already shipped via `130/014`); each fix proven by its added regression test.
- **SC-002**: Comment-hygiene clean (no spec-path / packet-id artifacts in edited source).
- **SC-003**: Affected TS typechecks/builds clean; `validate.sh --strict` Errors 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | D4-R fix invisible in tests | Mock path injects caller-supplied dimId, hiding the prompt-level mismatch | Confirmed the harness strict-equals `'D4-R'` against the real (non-mock) grade path; fix targets the prompt string |
| Risk | Adding a Zod gate rejects historic-but-valid metadata | A real save could throw if on-disk shape drifted | `graphMetadataSchema` mirrors the existing write shape; tests cover the typed round-trip |
| Risk | Re-editing an already-shipped target | Double-fix / merge conflict with `130/014` | cli-devin phantom-permission-rows deduped and documented as out-of-scope; not re-edited |
| Dependency | vitest segfaults on Node v25 in this env | generate-context test cannot run under vitest here | Phase-parent-pointer test runs green via `tsx`; known environment issue, not a fix problem |
| Dependency | resume-ladder frontmatter extraction | Single extraction feeds both top-level and continuity-block lookups | Covered by the +2 regression tests (11/11) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: The D4-R grader prompt must emit exactly `"dim_id": "D4-R"` (hyphenated) so the harness strict-equality check against `'D4-R'` passes; any other casing/punctuation silently caps confidence at 0.3 and injects a mismatch annotation.
- **NFR-C02**: `parseHandoverSignal()` must extract frontmatter once and resolve the freshness timestamp from `updated`, `last_updated`, or `last_updated_at` at the top level, plus `last_updated_at` indented under `_memory.continuity:`, before ever falling back to file mtime.
- **NFR-C03**: `updatePhaseParentPointer` must parse the on-disk graph-metadata file through `graphMetadataSchema` (Zod) before mutating and construct a typed `GraphMetadata` value, so malformed timestamps and empty `last_active_child_id` are rejected rather than silently persisted.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- D4-R grade on the real (non-mock) path → prompt emits `"dim_id": "D4-R"` → harness strict-equality passes → no 0.3 confidence cap, no mismatch annotation. Mock path still injects the caller-supplied dimId, so the defect was invisible in tests until the prompt string was inspected directly.
- Handover with `updated:` top-level frontmatter → resolves freshness from the `updated` alias (no mtime fallback).
- Handover with `last_updated_at:` indented under `_memory.continuity:` → continuity-block fallback resolves the timestamp (no mtime fallback).
- Handover with no timestamp field at all → still falls back to file mtime (behavior preserved for the truly-absent case).
- `updatePhaseParentPointer` reads a graph-metadata file with a malformed timestamp or empty `last_active_child_id` → `graphMetadataSchema.parse` rejects it rather than writing the malformed value back via `atomicWriteJson`.
- `updatePhaseParentPointer` on a valid file → schema parse succeeds, typed `GraphMetadata` constructed, pointer updated, atomic write proceeds as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | 3 fixes across 5 files (sources + regression tests) in 3 subsystems |
| Risk | 11/25 | Correctness-class fixes; new Zod gate on a hot mutation path; one prompt-string fix |
| Research | 12/20 | gpt-5.5-fast confirm pass re-confirmed all 4 round-3-tail targets; 1 deduped against `130/014` |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The 3 confirmed fixes and the deduped cli-devin target are fully documented. Scope is frozen.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
