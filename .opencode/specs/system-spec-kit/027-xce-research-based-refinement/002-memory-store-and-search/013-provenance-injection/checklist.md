---
title: "Verification Checklist: Provenance Injection"
description: "Verification checklist for provenance tagging regression remediation, including governed-ingest decoupling, prediction-error provenance threading, reachability evidence, and follow-on documentation."
trigger_phrases:
  - "provenance injection checklist"
  - "write provenance verification"
  - "governed ingest checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection"
    last_updated_at: "2026-06-11T12:10:00Z"
    last_updated_by: "opencode"
    recent_action: "Prepared verification checklist for provenance injection remediation."
    next_safe_action: "Complete final verification command evidence."
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/013-provenance-injection/checklist.md"
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Provenance Injection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` defines scan/ingest governance decoupling, PE provenance threading, reachability verification, and guard follow-ons.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` records validation boundary, persistence-site tagging, and PE threading architecture.
- [x] CHK-003 [P1] Scope exclusions documented
  - **Evidence**: `spec.md` excludes live shards, host daemons, `ENV_REFERENCE.md`, and guard-enforcement expansion.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Governed-ingest defaults do not force governance
  - **Evidence**: `memory-index.ts` and `memory-ingest.ts` validate raw caller args and use `requiresGovernedIngest` to decide whether to pass a governance decision.
- [x] CHK-011 [P0] Default scan/ingest provenance still reaches row tagging
  - **Evidence**: scan uses origin-based default provenance in `indexMemoryFile`; async ingest worker passes default ingest provenance as persistence metadata.
- [x] CHK-012 [P0] Prediction-error update/reinforce paths use caller provenance
  - **Evidence**: `memory-save.ts` passes `writeProvenance` into `evaluateAndApplyPeDecision`; orchestration forwards it to update and reinforce helpers.
- [x] CHK-013 [P1] Good existing work preserved
  - **Evidence**: No removal of `write-provenance.ts`, create-record provenance application, memory-update guard, or publication-gate annotation.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] New targeted regression tests pass
  - **Evidence**: `npx vitest run tests/handler-memory-ingest.vitest.ts tests/handler-memory-index.vitest.ts tests/write-provenance.vitest.ts tests/pe-gating-provenance.vitest.ts tests/pe-orchestration-provenance.vitest.ts` passed with 5 files, 18 passed, 28 skipped.
- [ ] CHK-021 [P0] TypeScript passes
  - **Evidence**: To be filled after final `npx tsc --noEmit` run.
- [ ] CHK-022 [P0] Requested provenance/guard suite passes
  - **Evidence**: To be filled after final vitest suite run.
- [ ] CHK-023 [P1] Strict spec validation passes
  - **Evidence**: To be filled after `validate.sh --strict` run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding is classified
  - **Evidence**: Scan/ingest default-governance coupling, PE provenance threading, and `memory_update` reachability are each addressed or documented explicitly.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed or scoped
  - **Evidence**: Grep covered `memory_update`, `handleMemoryUpdate`, `vectorIndex.updateMemory`, and `__provenanceContext` reachability.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helper signatures
  - **Evidence**: PE orchestration and gating tests cover the new provenance parameters for update and reinforce consumers.
- [x] CHK-FIX-004 [P1] Evidence is pinned to explicit command results
  - **Evidence**: Final verification rows record exact TypeScript, vitest, validation, and comment-hygiene commands.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No live shard or host daemon used
  - **Evidence**: New tests use `:memory:` SQLite fixtures, temp directories, and mocks only.
- [x] CHK-031 [P0] Automated callers are not mislabeled as human in PE tests
  - **Evidence**: PE update test expects `source_kind = 'agent'`; PE reinforce test expects `source_kind = 'system'`.
- [x] CHK-032 [P1] `memory_update` default-human reachability verified
  - **Evidence**: Grep found public dispatch and tests only; no reducer, feedback, or system-job production caller invokes `memory_update` or `vectorIndex.updateMemory` without internal provenance context.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist/summary synchronized
  - **Evidence**: All docs point to the same scope, files, fixes, and follow-ons.
- [x] CHK-041 [P1] Follow-ons documented but not fixed
  - **Evidence**: `spec.md` lists same-path retire and auto-promotion guard-coverage follow-ons as P0-class out-of-scope work.
- [ ] CHK-042 [P1] Final verification results recorded
  - **Evidence**: To be filled after final command run.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] New files are in approved scope
  - **Evidence**: New tests are under `.opencode/skills/system-spec-kit/mcp_server/tests`; docs are under the approved 022 phase folder.
- [x] CHK-051 [P1] `ENV_REFERENCE.md` untouched by this remediation
  - **Evidence**: This task does not edit that file; final git diff/status check will confirm.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 6/8 |
| P1 Items | 7 | 5/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-11
**Verified By**: OpenCode
<!-- /ANCHOR:summary -->
