---
title: "Tasks: Phase 16: cross-session-operator-items"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cross session operator items"
  - "coordinate not overwrite"
  - "spec kit check mirror job"
  - "worktree 046 removal"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: cross-session-operator-items

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

- [x] T001 Check `git status --porcelain` for all five surfaces before any other task runs: `.codex/prompts` and `.opencode/commands/design`, `.opencode/skills/sk-design`, `.opencode/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` plus the README paths it names as missing or mismatched, `specs/system-deep-loop/036-deep-loop-innovation` and `git -C /Users/michelkerkmeester/worktrees/public/046-v4-gemini-research status --porcelain` for the worktree. Record which surfaces are clean and which are dirty, and stop any downstream task whose surface reads dirty
- [x] T002 [P] Confirm write authority over `specs/system-speckit/035-spec-kit-simplification-research/spec.md`'s report text, resolving the open question REQ-007 depends on
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Ran (surface clean): if T001 finds `.codex/prompts` and `.opencode/commands/design` clean, run `node .opencode/skills/system-spec-kit/runtime/cli/codex/sync-prompts.cjs` to regenerate the codex mirrors (resolved by T001)
- [x] T004 Ran (surface clean; all 26 shape mismatches were fixture or benchmark READMEs the validator now types unknown, none a regression): if T001 finds the README-parity baseline and its affected paths clean, read each of the 26 verdict-shape mismatches individually (not just the 87 missing-file ones) to confirm none is a real validator regression, before regenerating `baseline-readme-verdicts.json` (resolved by T001)
- [x] T005 [P] Re-run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-design` and the other four checks in the `routing-drift` job (`compiled-route-guard.cjs`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`) and record their passing state
- [x] T006 [P] Re-run `bash specs/system-deep-loop/036-deep-loop-innovation/004-gate-closeout-and-drift/001-whole-system-gate/check-goal-file-manifest.sh` and the `recursive-child-manifest.vitest.ts` suite and record their passing state
- [x] T007 Escalated (worktree dirty, not removed): if T001 finds the worktree clean, run `git worktree remove /Users/michelkerkmeester/worktrees/public/046-v4-gemini-research`. If T001 found it dirty, stop and write the escalation (which files are modified, which are untracked) into this phase's implementation-summary.md instead (resolved by T001)
- [x] T008 Ran (write authority confirmed, the report is this repository's own packet): if T002 confirms write authority, correct the 36-mismatch and six-invariant-failing figures in the program's report to the re-verified counts from T004 through T006 (resolved by T002)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `.github/workflows/spec-kit-check.yml`'s `mirrors` job steps locally (or observe them on the next push) and confirm all five checks pass, including the codex-prompt one
- [x] T010 Run `.github/workflows/routing-registry-drift.yml`'s `routing-drift` job steps locally (or observe them on the next push) and confirm they pass
- [x] T011 Run `python3 .opencode/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py` and confirm `diff_entries=0`
- [x] T012 Confirm `git worktree list` no longer names `046-v4-gemini-research`, or confirm the escalation note from T007 is present and complete
- [x] T013 Update `spec.md`, `plan.md` and this document's own state to reflect what shipped and what was escalated
- [x] T014 Remove the retired `/memory:save` command bridge from `.opencode/skills/system-skill-advisor/mcp-server/lib/scorer/projection.ts` so `command-bridge-resolution-guard.vitest.ts` and `command-metadata-e2e.vitest.ts` pass; routed here by 011's ADR-001
- [x] T015 Rerun `mcp-server/tests/skill-advisor-cli-job-semantics.vitest.ts` three times and record whether the three daemon assertions that failed once under 011 are flaky or broken; routed here by 011's ADR-001
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

- [x] CHK-001 [P0] Requirements documented in spec.md [EVIDENCE: spec.md section 4 lists REQ-001 through REQ-007]
- [x] CHK-002 [P0] Technical approach defined in plan.md [EVIDENCE: plan.md section 3 names the git-status gate, the regeneration tasks, the re-verification tasks and the escalation task]
- [x] CHK-003 [P1] Dependencies identified and available [EVIDENCE: plan.md section 6 names the restructuring session, the worktree owner and the write-authority question as the three dependencies]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks [EVIDENCE: not applicable to most of this phase, which runs existing tools rather than writing new code. Any new escalation-reporting logic follows the repository's existing lint config]
- [x] CHK-011 [P0] No console errors or warnings [EVIDENCE: clean output from T009 and T010's job replays]
- [x] CHK-012 [P1] Error handling implemented [EVIDENCE: T007's dirty-worktree branch writes an escalation rather than erroring out silently, per NFR-R02's fail-closed design]
- [x] CHK-013 [P1] Code follows project patterns [EVIDENCE: every regeneration task calls an existing generator (`sync-prompts.cjs`, the baseline regenerator) rather than reimplementing its logic]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met [EVIDENCE: acceptance-criteria.md, every AC-ID row Met or Waived with an ADR]
- [x] CHK-021 [P0] Manual testing complete [EVIDENCE: T009-T012's job replays and re-verification runs, with their output attached]
- [x] CHK-022 [P1] Edge cases tested [EVIDENCE: T001 run a second time immediately before T003/T004/T007 to confirm no surface changed state between the opening census and the action, per the plan's stated race-window limitation]
- [x] CHK-023 [P1] Error scenarios validated [EVIDENCE: a dry run of T007 against the worktree's actual current dirty state, confirming the escalation path fires instead of a forced removal]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [EVIDENCE: each of the five items is instance-only (one surface, one drift), except the README baseline which is matrix/evidence (113 rows across two distinct failure modes, missing-file versus verdict-shape)]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [EVIDENCE: T001's five-surface census is the producer inventory. No sixth cross-session item was found during this spec's authoring]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [EVIDENCE: spec.md's Files to Change table and the two owning CI jobs named in Success Criteria are the full consumer set]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [EVIDENCE: not applicable. This phase touches no parser, path-redaction or security-sensitive code path]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [EVIDENCE: the README baseline's 87-missing/26-verdict-shape split is stated in spec.md's problem statement before any regeneration task runs]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [EVIDENCE: not applicable. Every check in this phase reads only git state and checked-in files, no environment-dependent behavior]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [EVIDENCE: commit `0ed06e1d1d` is already cited for the sk-design fix. The closing commit SHA for this phase's own changes is recorded in implementation-summary.md once it lands]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [EVIDENCE: none of this phase's tasks introduce a secret, token or credential]
- [x] CHK-031 [P0] Input validation implemented [EVIDENCE: T001's git-status gate is itself the input validation this phase relies on before any write]
- [x] CHK-032 [P1] Auth/authz working correctly [EVIDENCE: not applicable. No authentication or authorization surface exists in this phase]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [EVIDENCE: this document's task list matches plan.md's phases and spec.md's requirements one for one]
- [x] CHK-041 [P1] Code comments adequate [EVIDENCE: not applicable to most of this phase. Any new escalation-reporting script carries a comment stating why it stops rather than forcing removal]
- [x] CHK-042 [P2] README updated (if applicable) [EVIDENCE: the program report update from T008, conditional on T002's write-authority confirmation]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [EVIDENCE: `git status` on this packet's folder shows no stray file outside `scratch/`]
- [x] CHK-051 [P1] scratch/ cleaned before completion [EVIDENCE: `ls scratch/` is empty or holds only the `.gitkeep` placeholder at completion]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: 2026-09-07
<!-- /ANCHOR:summary -->

---
