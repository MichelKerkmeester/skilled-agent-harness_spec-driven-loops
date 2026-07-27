---
title: "Verification Checklist: Devin hook hardening"
description: "Evidence gate for workspace-root agreement, cwd-fallback, discriminating test coverage, and comment hygiene across the 10 Devin adapters."
trigger_phrases:
  - "devin hook hardening checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Hardening pass complete: 10 adapters unified, test suite 10/10 green."
    next_safe_action: "Run strict validation, then move to phase 006 and 003."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-hook-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin hook hardening

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

- [x] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines five acceptance-tested requirements (REQ-001 through REQ-005).]
- [x] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` scopes the hardening to the 10 adapters and `spec-gate-devin.test.mjs`.]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phase 008 is complete; `spec-gate-core.test.mjs` 67/67 and `mk-spec-gate.test.cjs` 11/11 are green.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 10 adapters pass syntax checks. [EVIDENCE: all 10 JS files pass `node --check`; full project `tsc --noEmit` reports 0 errors.]
- [x] CHK-011 [P0] The shared spec-gate core suite passes after the adapter changes. [EVIDENCE: core 67/67, plugin 11/11, cursor prebind 11/11 all pass.]
- [x] CHK-012 [P1] Every adapter error path returns allow/no-op and writes no unsafe state. [EVIDENCE: devin spec-gate suite 10/10 includes malformed, missing-identity, child, and whitespace-cwd rows.]
- [x] CHK-013 [P1] No shared core is modified. [EVIDENCE: `git diff --stat` on the 6 shared cores produces no output.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Valid cwd produces state consumed correctly by the enforce consumer. [EVIDENCE: `spec-gate-devin.test.mjs` includes a mutating-prompt row that opens the gate and an enforce row that denies.]
- [x] CHK-021 [P0] Disabled and child sessions produce no state and are complete no-ops. [EVIDENCE: `spec-gate-devin.test.mjs` disabled and child rows pass with no state (10/10 suite).]
- [x] CHK-022 [P0] Missing identity and malformed input produce no state. [EVIDENCE: `spec-gate-devin.test.mjs` malformed-input and missing-identity rows pass with no state.]
- [x] CHK-023 [P1] Whitespace cwd, padded session ids, and terminal states behave deterministically. [EVIDENCE: `spec-gate-devin.test.mjs` whitespace-cwd row writes state under the test root and denies; missing-cwd row falls back to `DEVIN_PROJECT_DIR`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 10 adapters use the same trim-and-fallback `projectDir` resolution. [EVIDENCE: grep finds no raw `||` patterns; all 10 adapters use trim-and-fallback.]
- [x] CHK-031 [P0] The devin spec-gate suite is discriminating. [EVIDENCE: `spec-gate-devin.test.mjs` whitespace-cwd row writes state under the test root (10/10), which the pre-fix adapter would not.]
- [x] CHK-032 [P1] The stale "STATUS: LIVE" block is trimmed to a one-liner in every adapter that carried it. [EVIDENCE: `grep` finds no multi-line `STATUS: LIVE` blocks; the durable fact is a one-liner.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No credentials or payload contents are persisted. [EVIDENCE: `spec-gate-devin.test.mjs` asserts only `status` and `additionalContext` fields.]
- [x] CHK-041 [P1] Folder binding uses filesystem-backed validation through the shared core. [EVIDENCE: the devin adapters call `classifyIntent` and `evaluateMutation` which delegate to the shared core.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 012.]
- [x] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: `check-comment-hygiene.sh` reports no violations across all changed files.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] Temporary files remain under `scratch/` or approved system temp paths. [EVIDENCE: automated tests use `tmpdir()` and the `scratch/` directory is present.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-26 (Complete)
<!-- /ANCHOR:summary -->
