---
title: "Tasks: Phase 1: ownership-transfer"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "ownership transfer tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: ownership-transfer

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Capture the baseline of every gate (`../scratch/baseline/`). Verify: `tail -1 ../scratch/baseline/*.txt` prints `exit=0` for each, with the advisor vitest at `3204 passed | 4 skipped`.
- [x] T002 Find the owner source (`derive-command-bridges.cjs`). Verify: `rg -n skill_agent .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` prints the tag parser.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Retag the six routers (`.skilled/commands/doctor/{ci,deep-loop,git,sk-code,sk-skill,skill-advisor}.md`). Verify: `grep -h skill_agent .skilled/commands/doctor/*.md | sort | uniq -c` prints `17 <!-- skill_agent: system-skilled-doctor -->`.
- [x] T004 Regenerate the bridges (`derive-command-bridges.cjs`). Verify: `--check` prints `"changed": []`.
- [x] T005 Rebuild the advisor and rescan the skill graph (`system-skill-advisor/runtime`). Verify: `npm run build` and `skill_graph_scan --trusted` exit 0.
- [x] T006 Count a hub's own attachment as owner-led (`scripts/routing-accuracy/capture-command-routing-baseline.mjs`). Verify: `command-routing-slice.vitest.ts` passes its stage-split test.
- [x] T007 Recapture the command routing baseline (`scripts/routing-accuracy/command-routing-baseline.json`). Verify: the diff changes only `capturedAtSha`, `agreement.correct` and the `ownerLed`, `routed` and `neither` stage counts.
- [x] T008 Update the owner pins (`tests/command-brief-golden.vitest.ts`, `tests/render-child-session.vitest.ts`, `doctor-ci-contract.test.cjs`, `doctor-sk-skill-contract.test.cjs`). Verify: the four files pass.
- [x] T009 Rewrite the skill's ownership text (`system-skilled-doctor/{SKILL.md,README.md,graph-metadata.json}`). Verify: `rg -n "Does NOT own" .skilled/skills/system-skilled-doctor/SKILL.md` prints nothing.
- [x] T010 Rewrite the repo-level ownership text (`README.md`, `.skilled/commands/README.txt`, spec-kit feature catalog). Verify: `rg -c "by owner" .skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Rerun the doctor suites (`.skilled/commands/doctor/scripts/tests/run-all.sh`). Verify: prints `7 suite(s) passed, 0 failed`.
- [x] T012 Rerun the advisor vitest and Python tests (`system-skill-advisor/runtime`). Verify: `3204 passed | 4 skipped` and `26 passed`.
- [x] T013 Rerun phrase reach (`doctor-phrase-reach.cjs`). Verify: prints `STATUS=OK phrases=262 bridges=35`.
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

A blocked task is marked `[B]` with the blocker named on its line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available: the deriver and the advisor build
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `derive-command-bridges.cjs --check` prints `"changed": []`
- [x] CHK-011 [P0] No test prints a failure: run-all, advisor vitest and pytest all exit 0
- [x] CHK-012 [P1] The deriver's named error for a router with no tag is unchanged
- [x] CHK-013 [P1] The new comment in the capture script states the durable reason and no packet id
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual probes of the helper, update and near-miss prompts match the baseline picks
- [x] CHK-022 [P1] Edge case: the deep-loop hub still attaches `/doctor:deep-loop` to a stuck-run complaint
- [x] CHK-023 [P1] Error scenario: a broader description that outranked command bridges was found and rejected
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`, one producer (the tag) with generated, test and doc consumers.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: all seventeen routers checked, six changed.
- [x] CHK-FIX-003 [P0] Consumer inventory: generated rows, slices, goldens, contract tests and docs, each listed in `plan.md`.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix: six commands by four consumer kinds, all covered by the suites above.
- [x] CHK-FIX-006 [P1] N/A: no test reads new process-wide state.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the worktree diff on `worktrees/541-own-all-doctor-commands`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] N/A: no input surface changed
- [x] CHK-032 [P1] N/A: no auth surface changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated: the skill README lists all seventeen commands
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the gate evidence the summary cites
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 19 | 19/19 |
| P2 Items | 5 | 5/5 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section
- [x] CHK-101 [P1] All ADRs have status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale
- [x] CHK-103 [P2] N/A: no migration path; the deriver regenerates the rows
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] N/A (NFR-P01): no runtime path changed
- [x] CHK-111 [P1] N/A: no throughput target
- [x] CHK-112 [P2] N/A: no load path
- [x] CHK-113 [P2] N/A: no benchmark applies
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented in `plan.md`
- [x] CHK-121 [P1] The advisor `dist` is rebuilt after the regeneration
- [x] CHK-123 [P1] N/A: no runbook; the deriver's README covers regeneration
- [x] CHK-124 [P2] N/A: no deployment
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Independent review dispatched to a second model family, read-only
- [x] CHK-131 [P1] N/A: no dependency added
- [x] CHK-132 [P2] N/A: no web surface
- [x] CHK-133 [P2] N/A: no data handling
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] N/A: no API documentation
- [x] CHK-142 [P2] User-facing documentation updated: root README section 11
- [x] CHK-143 [P2] Knowledge transfer documented in `implementation-summary.md`
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Owner of the change | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
