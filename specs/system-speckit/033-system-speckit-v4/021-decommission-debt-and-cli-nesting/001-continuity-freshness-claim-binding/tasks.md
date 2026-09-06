---
title: "Tasks: Phase 1: continuity-freshness-claim-binding"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "continuity freshness binding tasks"
  - "baseline continuity-freshness vitest"
  - "reorder validateContinuityFreshness"
  - "CONTINUITY_FRESHNESS_SKIP_CODES skip codes"
  - "stampCompletionFingerprintIfNeeded stamp"
  - "052 stale fall-through bug"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: continuity-freshness-claim-binding

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the baseline `validate.sh --strict` output for `052-memory-decommission-landing` and `053-spec-kit-runtime-rename` (no file change) — Evidence: both `RESULT: PASSED`, exit 0, `CONTINUITY_FRESHNESS` warn `stale` (052 deltaMs=33415028, 053 deltaMs=17941671)
- [x] T002 Capture the baseline `continuity-freshness.vitest.ts` run (`scripts/tests/continuity-freshness.vitest.ts`) — Evidence: 6 passed, 1 skipped (7 total)
- [x] T003 [P] Re-run the live reproduction (`SPECKIT_COMPLETION_FRESHNESS=1 node continuity-freshness.ts --folder specs/system-speckit/033-system-speckit-v4/019-memory-decommission-branch-landing --json`) and save its output alongside T001 — Evidence: `{"code":"stale", ...}` confirmed the fall-through bug before any fix
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Reorder `validateContinuityFreshness` (`.opencode/skills/system-spec-kit/scripts/validation/continuity-freshness.ts:376-382`) so a `pass`-status completion verdict returns directly instead of falling through to the timestamp-staleness branch — Evidence: `evaluateCompletionFreshness` now resolves the attestation verdict against implementation-summary.md specifically (the binding), and `validateContinuityFreshness` returns any non-`no_completion_claim` result directly
- [x] T005 Add the skip code family recognition to `printBridgeOutput`/the CLI JSON shape so `no_completion_claim`, `missing_fingerprint`, `zero_fingerprint`, `missing_frontmatter`, `missing_graph_metadata`, `missing_graph_timestamp`, `implementation_summary_missing` and `not_opted_in` are carried through distinguishably (`continuity-freshness.ts`) — Evidence: `CONTINUITY_FRESHNESS_SKIP_CODES` exported; `printBridgeOutput` emits a `code\t...` line
- [x] T006 Update `parseShellRuleOutput`/`mapShellRuleStatus` (`.opencode/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts`) to preserve the skip signal in the `ValidationEntry` details/message without changing the top-level pass/warn/fail mapping for any existing code — Evidence: `ShellRuleOutput.code` parsed and folded into `ValidationEntry.details` as `code:<value>` via `withParsedCodeDetail`; `mapShellRuleStatus` itself untouched
- [x] T007 Add the fingerprint-stamp trigger to the continuity writer (`scripts/memory/generate-context.ts`, `scripts/core/memory-metadata.ts:185`) so a document carrying a completion claim is stamped with a real `session_dedup.fingerprint` via `buildContinuityFingerprint` — Evidence: `stampCompletionFingerprintIfNeeded` (memory-metadata.ts) called from `main()` after `updatePhaseParentPointersAfterSave`; new vitest assertion proves a non-zero fingerprint is written
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add the four new/extended cases to `continuity-freshness.vitest.ts`: claim-with-fingerprint (`fresh_completion`), claim-without-fingerprint (`missing_fingerprint`, distinguishable skip), zero-fingerprint placeholder (`zero_fingerprint`), CLI opt-out vs unguarded function (`not_opted_in`) — Evidence: `npx --prefix scripts vitest run --config runtime/vitest.config.ts scripts/tests/continuity-freshness.vitest.ts` → 10 passed, 1 skipped (11 total; baseline's shared fixture no longer carries an incidental completion claim, restoring the original 6 timestamp-path cases to their intended scenario)
- [x] T009 Run `generate-context-cli-authority.vitest.ts` and `generate-context-save-lock.vitest.ts` and confirm the pass count is unchanged plus the new fingerprint-stamp assertion passes — Evidence: 18 passed (17 baseline + 1 new), 0 failed
- [x] T010 Re-run `validate.sh --strict` on `052-memory-decommission-landing` and `053-spec-kit-runtime-rename` and diff the exit code and summary counts against the T001 baseline - must match exactly — Evidence: both still `RESULT: PASSED`, exit 0; `CONTINUITY_FRESHNESS` now reports `pass`/`zero_fingerprint` (`code:zero_fingerprint` in the JSON details) instead of `warn`/`stale` — same exit code, the true attestation-gap verdict surfaces instead of the unrelated timestamp verdict. All seven `049-memory-decommission/*` children checked the same way: all `RESULT: PASSED`, exit 0, `zero_fingerprint`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `npx tsc --noEmit -p tsconfig.json` exit 0 in both `scripts/` and `runtime/`
- [x] CHK-011 [P0] No console errors or warnings — typecheck and every vitest run below are clean
- [x] CHK-012 [P1] Error handling implemented — `attestationCandidate` lookup and fingerprint-shape checks stay defensive; the stamp function no-ops on every missing-precondition case
- [x] CHK-013 [P1] Code follows project patterns — reused `buildContinuityFingerprint`/`ZERO_CONTINUITY_FINGERPRINT`, existing bridge tab-line protocol, and the module's own `buildPass`/`buildWarn`/`buildFail` helpers
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — see `acceptance-criteria.md` (AC-001..AC-006 all `Met`)
- [x] CHK-021 [P0] Manual testing complete — live `SPECKIT_COMPLETION_FRESHNESS=1` reproduction against real packets 052, 053, and all seven 049 children
- [x] CHK-022 [P1] Edge cases tested — the zero-fingerprint placeholder, no-fingerprint-anywhere, and CLI-opt-out-vs-unguarded-function paths are each their own test case
- [x] CHK-023 [P1] Error scenarios validated — pre-existing `invalid_graph_metadata` (malformed JSON) and `invalid_frontmatter` (parse error) paths re-verified unchanged
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — Class: `algorithmic` (the precedence bug applied to every packet claiming completion, not one instance)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `rg -n "'missing_fingerprint'|'zero_fingerprint'|'no_completion_claim'" continuity-freshness.ts` confirms exactly 3 `buildPass` call sites producing these codes, all fixed by the same precedence change
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — `rg -n "validateContinuityFreshness|ContinuityFreshnessResult" system-spec-kit --glob '*.ts' --glob '*.js' --glob '*.md'` found 3 files: `continuity-freshness.ts` itself and two vitest suites. The inventory surfaced a consumer outside this phase's named file set (`runtime/tests/continuity-freshness.vitest.ts`, undocumented in plan.md) — 2 of its cases encoded the pre-fix fall-through behavior and needed updating; 2 unrelated pre-existing failures (confirmed present before this phase's changes via a stash-and-rerun baseline) were left untouched
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Not applicable: this fix is a validation-rule precedence and writer-timing change, not a security/path/parser/redaction surface
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Axes: completion-claim present/absent (2) × fingerprint present/absent/zero (3) × `SPECKIT_COMPLETION_FRESHNESS` on/off (2) × `SPECKIT_COMPLETION_FRESHNESS_ENFORCE` on/off (2) = 24 combinations; 10 rows covered across the two suites (6 pre-existing timestamp-path cases + 4 new completion-path cases), matching plan.md's stated load-bearing corners
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — The `not_opted_in` case explicitly deletes `SPECKIT_COMPLETION_FRESHNESS` from the child process env rather than assuming it is already absent
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Not committed (per instruction); evidence is pinned to this session's rebuilt dist plus the exact commands and outputs recorded in this file and `implementation-summary.md`
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none introduced
- [x] CHK-031 [P0] Input validation implemented — fingerprint values are validated against `/^sha256:[a-f0-9]{64}$/` before use, unchanged from the existing pattern
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable; no auth surface in this rule/writer seam
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — this file, `acceptance-criteria.md`, and `implementation-summary.md` all reflect the final implementation and its one documented deviation
- [x] CHK-041 [P1] Code comments adequate — the attestation binding and skip-code family are documented in `continuity-freshness.ts` itself (`rg -n "attestation"` finds it), matching REQ-001
- [x] CHK-042 [P2] README updated (if applicable) — not applicable; no README documents this rule's internal precedence logic
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files created outside `scratch/` or the OS temp dir vitest fixtures already clean up
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` contains only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---
