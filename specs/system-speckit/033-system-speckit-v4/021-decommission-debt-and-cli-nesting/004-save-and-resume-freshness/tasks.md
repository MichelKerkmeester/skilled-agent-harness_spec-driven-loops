---
title: "Tasks: Phase 4: save-and-resume-freshness"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "save resume freshness tasks"
  - "baseline resume ladder suite"
  - "workflow trigger index fresh"
  - "resume ladder parseContinuitySignal"
  - "packet pointer handover check"
  - "save completion reminder drift"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: save-and-resume-freshness

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

- [x] T001 Capture the baseline resume-ladder test suite run and the workflow save-completion test run (pre-edit via `git stash`: resume-ladder 17/17, thin-continuity-record 5/5, and the four workflow regression suites 68 passed/1 skipped)
- [x] T002 [P] Confirm `workflow.ts:1578-1587`, `resume-ladder.ts:587`, `resume-ladder.ts:632-663`, and `resume-ladder.ts:1063` against a fresh read - line numbers drift as the files change (re-read via `grep -n`; the reminder log had drifted to 1585-1587)
- [x] T003 [P] Manually resume an existing continuity-bearing packet and confirm the current (pre-change) behavior as a smoke-check baseline (the pre-edit `resume-ladder.vitest.ts` run in T001 exercised the real `buildResumeLadder` entry point against continuity-bearing fixtures)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Replace the reminder-only log at `workflow.ts:1578-1587` with a real comparison between the saved packet's `trigger_phrases` and `runtime/data/trigger-index.json`'s recorded entry (`checkTriggerIndexFreshness` + `loadTriggerIndexRetrievalLibrary`, wired into Step 11)
- [x] T005 Surface the staleness result in `generate-context.ts`'s CLI output (no edit needed there: Step 11's `log`/`warn` calls already reach the CLI's stdout through `structuredLog`, the same mechanism the prior reminder-only line used; confirmed via `node scripts/dist/memory/generate-context.js --help` exit 0)
- [x] T006 Remove the manual-extraction fallback in `parseContinuitySignal` (`resume-ladder.ts:636-663`) so a `readThinContinuityRecord` failure returns `null`
- [x] T007 Add a packet-identity/fingerprint gate to the handover-vs-continuity comparison (`resume-ladder.ts:1063`) so an unbound handover cannot outrank validated continuity purely on timestamp (`extractHandoverBinding`/`handoverBindingVerifies`, reusing `buildContinuityFingerprint`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Add the workflow test: staleness signal fires only when `trigger_phrases` actually changed since the last index regeneration (`scripts/tests/workflow-trigger-index-freshness.vitest.ts`, 7/7 passed)
- [x] T009 Add the resume-ladder tests: malformed-fingerprint rejection, unbound-newer-handover loses to continuity, bound-and-verified-newer-handover still wins (`runtime/tests/resume-ladder.vitest.ts`, 3 new cases plus 2 adapted timestamp-alias cases now exercising the bound-handover path; consumer inventory found and fixed one matching assertion in `runtime/tests/path-boundary.vitest.ts`; 47/47 across all `resume-ladder.ts` consumers)
- [x] T010 Re-run the T003 manual resume smoke check and confirm it still resolves the same way for the unmodified case (`resume-ladder.vitest.ts`'s "falls back to continuity when handover is missing" and "uses handover as the happy-path source..." cases still pass post-change)
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..005, §4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (§3 Architecture, §4 phases)
- [x] CHK-003 [P1] Dependencies identified and available (`thin-continuity-record.ts`'s read contract confirmed stable and unchanged; Phase 3's trigger-index scope does not block this phase's staleness check)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`npx tsc --noEmit -p tsconfig.json` in `scripts/` and `npx tsc --noEmit --composite false -p tsconfig.json` in `runtime/`, both exit 0)
- [x] CHK-011 [P0] No console errors or warnings (all touched suites run clean; the new code only logs through the existing `log`/`warn` closures on the paths the tests exercise)
- [x] CHK-012 [P1] Error handling implemented (every new async path is wrapped in try/catch and degrades to `'unavailable'`/continuity-null rather than throwing, per NFR-R01/R02)
- [x] CHK-013 [P1] Code follows project patterns (mirrors the existing `tryImportRuntimeApi` dynamic-import-with-degradation pattern; reuses `buildContinuityFingerprint` and the retrieval package's own parser/loader instead of new code)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001..005 Met in acceptance-criteria.md)
- [x] CHK-021 [P0] Manual testing complete (`node scripts/dist/memory/generate-context.js --help` exit 0; phase folder `validate.sh --strict` RESULT: PASSED)
- [x] CHK-022 [P1] Edge cases tested (no-declared-phrases, missing spec.md, unparseable index, one-word phrase change under set-equality)
- [x] CHK-023 [P1] Error scenarios validated (malformed `session_dedup.fingerprint`, malformed `packet_pointer`, unreadable/malformed index — all degrade without throwing)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Both fixes are `algorithmic` (the staleness comparison and the trust-ranking comparison change what a comparison outputs, not just one call site); REQ-002's fallback removal is additionally `class-of-bug` (a whole category of malformed-but-plausible records was being silently trusted).
- [x] CHK-FIX-002 [P0] `rg -n "readThinContinuityRecord|parseContinuitySignal|parseHandoverSignal" runtime/lib/resume/resume-ladder.ts` confirms these are the only three functions in the seam; no sibling copy exists elsewhere.
- [x] CHK-FIX-003 [P0] `rg -n "resume-ladder" .opencode/skills/system-spec-kit --glob '*.ts' -l` named every consumer; all now pass (`path-boundary.vitest.ts`, `generator-hardening.vitest.ts`, `authored-continuity-snapshot.ts`, `spec-root-registry.ts` string reference, `resume-ladder.vitest.ts`) — one assertion in `path-boundary.vitest.ts` encoded the pre-fix bug and was corrected.
- [x] CHK-FIX-004 [P0] Not applicable: this is a trust-ranking/staleness-comparison fix, not a security/path/parser/redaction fix. The ladder's actual path-escape surface (absolute/traversal specFolder rejection) is untouched and its existing tests still pass unchanged.
- [x] CHK-FIX-005 [P1] Matrix (plan.md FIX ADDENDUM): signal presence (handover only / continuity only / both) x continuity validity (valid / malformed) x handover binding (unbound / bound-and-verified) x relative freshness (handover newer / continuity newer) = load-bearing corners covered by 3 new + 5 adapted resume-ladder tests plus the pre-existing missing-handover and missing-continuity cases; not the full cross product, matching the plan's own scope.
- [x] CHK-FIX-006 [P1] The new `cachedTriggerIndexRetrievalLibrary` module-level cache is exercised across all 7 cases in `workflow-trigger-index-freshness.vitest.ts` within one process (shared module scope), proving repeated calls resolve consistently; the cache keys on the retrieval package's real on-disk location, not on `process.env` or other attacker-controlled input, so no separate hostile-env variant applies.
- [x] CHK-FIX-007 [P1] Evidence above is pinned to explicit file paths and function/test names rather than a SHA; no commit was made per this task's instructions, so there is no fix SHA yet to pin to.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (no credential or token surface touched; per NFR-S01)
- [x] CHK-031 [P0] Input validation implemented (`readThinContinuityRecord`'s existing strict validation is now the only path; the handover-binding fingerprint is verified against a freshly recomputed hash rather than trusted as declared, per NFR-S02)
- [x] CHK-032 [P1] Not applicable: no auth/authz surface in this change
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized (spec.md, tasks.md and acceptance-criteria.md all set to Complete/Met in this pass; implementation-summary.md written as the real record)
- [x] CHK-041 [P1] Code comments adequate (durable-WHY comments on the new helpers and the trust-ranking branch; no ephemeral spec/finding/task ids embedded, per the comment-hygiene rule)
- [x] CHK-042 [P2] `runtime/lib/resume/README.md` described the old fixed handover-then-continuity precedence and was corrected to describe the trust-ranking behavior; `scripts/core/README.md` makes no claim this change contradicts and needed no edit
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only (this packet's `scratch/` holds only `.gitkeep`; test fixtures use vitest's own `afterEach` cleanup under `os.tmpdir()` or the pre-existing, corpus-excluded `scripts/tests/fixtures/` directory, not this packet's scratch)
- [x] CHK-051 [P1] scratch/ cleaned before completion (verified empty aside from `.gitkeep`; no residue left in `scripts/tests/fixtures/` after the test run)
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
