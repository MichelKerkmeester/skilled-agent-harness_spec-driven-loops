---
title: "Tasks: Phase 5: v1-reference-purge"
description: "Ordered tasks for the OpenCode 1 reference purge: baseline, code, tests, docs, generated files, verification."
trigger_phrases:
  - "v1 reference purge tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 5: v1-reference-purge

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create the worktree from origin/main (`worktrees/493-v1-reference-purge`). Verify: `git status -sb` prints `## worktrees/493-v1-reference-purge...origin/main`.
- [x] T002 Run the phase 004 gate, the whole deep-loop vitest and the doctor suite as the baseline (`scratch` copy of `gate.sh`). Verify: every leg prints exit 0.
- [x] T003 Inventory every consumer of `'unsupported'` and every reader of the version corpus. Verify: `rg -n "'unsupported'|\"unsupported\"" .skilled .opencode .github` lists the four parsers, the rule engine, the wrapper and the tests.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Drop the major-1 branch from both resolvers and the battery parser, and narrow their JSDoc to `'v2' | 'unknown'` (`opencode-version.mjs`, `opencode-version.cjs`, `opencode-version-battery.cjs`). Verify: `rg -n "unsupported" ` over them prints nothing.
- [x] T005 Hold `UNRESOLVED_FAMILIES` to `unknown` (`dispatch-rule-checks.mjs`). Verify: `node --test .skilled/hooks/cli-dispatch/lib/dispatch-rule-checks.test.mjs` prints `fail 0`.
- [x] T006 Remove the wrapper's version probe and refusal, keeping the `--standalone` insertion (`.skilled/bin/skilled-loop`). Verify: `bash -n` exits 0 and the wrapper suite passes.
- [x] T007 Remove the battery's unsupported-binary detail (`opencode-version-battery.cjs`). Verify: the battery suite passes 49 of 49.
- [x] T008 Remove the `remove-v1` mode, its helpers and the `opencode1` name in `check`, and make `classify_version` print only `v2` or `unknown` (`opencode-setup.sh`). Verify: `bash -n` and `shellcheck` print nothing.
- [x] T009 Replace the v1 corpus rows with the same shapes on v2 or another major (`opencode-version-corpus.json`). Verify: the corpus holds 13 rows.
- [x] T010 Rewrite the refusal tests onto `3.0.0` samples and delete the tests of removed code. Verify: every touched suite prints `fail 0`.
- [x] T011 [P] Delete or rewrite every OpenCode 1 observation in docs, CI, the plugin inventory and the sk-git fixture, and teach the fixture parity test the one edit. Verify: the sweep lists no hand-written file.
- [x] T012 Regenerate the trigger index and retrieval fixtures. Verify: `generate-trigger-index.mjs` exits 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Rerun the gate, the whole deep-loop vitest, the doctor suite and sk-skill-convert. Verify: every leg prints exit 0 and the totals differ from the baseline only by the named removals.
- [x] T014 Run the live battery on OpenCode 2.3.2. Verify: `node .skilled/commands/doctor/scripts/opencode-version-battery.cjs --family=v2 --json` exits 0.
- [x] T015 Run the runtime-mirrors checkers in check-only form. Verify: `sync-runtime-mirrors.cjs --check` prints `PASS`.
- [x] T016 Mark phase 003's `justified.txt` superseded and rerun its replacement checks. Verify: all three print 0.
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

- [x] CHK-001 [P0] Requirements documented in spec.md [Evidence: spec.md §4 REQ-001 to REQ-007]
- [x] CHK-002 [P0] Technical approach defined in plan.md [Evidence: plan.md §1 and the affected-surfaces table]
- [x] CHK-003 [P1] Dependencies identified and available [Evidence: OpenCode 2.3.2 answers the live battery]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [Evidence: `bash -n` on both shell scripts and `shellcheck opencode-setup.sh` print nothing]
- [x] CHK-011 [P0] No console errors or warnings [Evidence: gate logs show no new warning]
- [x] CHK-012 [P1] Error handling implemented [Evidence: an unknown major still throws `E_OPENCODE_UNRESOLVED` in the deep loop]
- [x] CHK-013 [P1] Code follows project patterns [Evidence: deletions only, in each file's existing style]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [Evidence: acceptance-criteria.md]
- [x] CHK-021 [P0] Manual testing complete [Evidence: live battery exit 0 on 2.3.2]
- [x] CHK-022 [P1] Edge cases tested [Evidence: empty, joined, CRLF and other-major outputs in the parity and adversarial tests]
- [x] CHK-023 [P1] Error scenarios validated [Evidence: P1, P3 and the lineage refusal test assert "was not supported"]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class [Evidence: class-of-bug, one family value across four parsers and three consumers]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed [Evidence: `rg -n "major === 1"` found the three JS parsers, and `classify_version` is the shell copy]
- [x] CHK-FIX-003 [P0] Consumer inventory completed [Evidence: plan.md affected-surfaces table]
- [x] CHK-FIX-004 [P0] Parser fixes include adversarial table tests [Evidence: joined, CRLF, path-qualified, empty and noisy rows in the corpus and the pinned tables]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed [Evidence: plan.md, 4 parsers by the shared 13-row corpus]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed [Evidence: the OPENCODE_BIN and PATH-order cases still run]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range [Evidence: implementation-summary.md names the commits]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [Evidence: diff adds no credential]
- [x] CHK-031 [P0] Input validation implemented [Evidence: the anchored version pattern is unchanged]
- [x] CHK-032 [P1] Auth/authz working correctly [Evidence: N/A, no auth path touched]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [Evidence: this packet]
- [x] CHK-041 [P1] Code comments adequate [Evidence: comments that named OpenCode 1 rewritten to the current rule]
- [x] CHK-042 [P2] README updated (if applicable) [Evidence: root README, cli-opencode README, workflows README, doctor tests README]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [Evidence: gate logs live in the session scratchpad]
- [x] CHK-051 [P1] scratch/ cleaned before completion [Evidence: `scratch/` holds only `.gitkeep`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---
