---
title: "Tasks: Repo doc debt reference and coverage fixes"
description: "Ordered tasks and verification checklist for the README reference and coverage fixes."
trigger_phrases:
  - "reference and coverage fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Repo doc debt reference and coverage fixes

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

Two sets recur below. `R` is the 59 READMEs in scope, and `V` is `validate_document.py --type readme`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the finding list from the audit's own extract and resolve functions (`R`). Verify: 96 broken and 13 coverage, and the 96 sit in 52 of the 59 READMEs.
- [x] T002 Classify every finding under the four rules (`R`). Verify: the evidence table carries 96 rows split 19 rule 1, 10 rule 2, 11 rule 3 and 56 rule 4.
- [x] T003 [P] Capture the before numbers (`R`). Verify: the fast checker prints 96 broken / 13 coverage, and `V` exits 0 on 59 of 59.
- [x] T004 [P] Group the READMEs by tree (`R`). Verify: 22 under `system-spec-kit`, 14 under `.skilled/hooks`, 4 under `sk-doc` and 12 elsewhere, with 35 READMEs carrying exactly one finding.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Leave the 19 rule-1 items as written (`R`). Verify: `git check-ignore -v` matches for each, as in `.gitignore:299:*.log` and `.gitignore:386:.skilled/hooks/hook-flags.env`.
- [x] T006 Leave the 10 rule-2 items as written (`.skilled/skills/system-spec-kit/runtime/**/README.md`). Verify: each resolves from its nearest `package.json` ancestor, as in `runtime/handlers/save/README.md` naming `handlers/save/spec-folder-mutex.ts`, which exists under `runtime/`.
- [x] T007 Rewrite the 11 rule-3 placeholder names (`R`). Verify: `.skilled/skills/sk-doc/sk-create-agent/README.md` reads `.skilled/agents/<agent-name>.md`, and none of the 27 findings left holds a rule-3 item.
- [x] T008 Replace the symlink targets in hook READMEs with the repository path of the same file (`.skilled/hooks/**/README.md`). Verify: `readlink` confirms each target, as in `.skilled/hooks/git-hooks-check/README.md` naming `.skilled/bin/check-git-hooks.sh`.
- [x] T009 Point the compiled `.js` names at their tracked `.ts` sources (`R`). Verify: each cited `.ts` file is in `git ls-files`, as in `runtime/lib/config/README.md` naming `capability-flags.ts` and `spec-doc-paths.ts`.
- [x] T010 Rewrite the two test commands to run from the skill root with `--config vitest.config.ts` (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md`). Verify: the spec-gate suite passes 9 tests, the retrieval suites pass 222 tests in 6 files, and `node --check` exits 0.
- [x] T011 Fix the retrieval index path (`.skilled/skills/system-spec-kit/runtime/cli/retrieval/README.md`). Verify: `../../data/trigger-index.json` from `runtime/cli/retrieval/` is `runtime/data/trigger-index.json`, which `git ls-files` lists.
- [x] T012 Complete the truncated autostash log name (`.skilled/scripts/git-hooks/README.md`). Verify: `.skilled/logs/autostash-orphan-alerts.log` exists and `git check-ignore -v` matches `.gitignore:299:*.log`.
- [x] T013 Describe the three findings with no target in words (`.skilled/bin/README.md`, `.skilled/skills/system-spec-kit/runtime/cli/sweep/README.md`, `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md`). Verify: no README names a `.opencode/specs` path, and the doctor-commands README no longer claims `.skilled/release/base.json` is in the tree.
- [x] T014 Add one accurate mention per coverage artifact (`R`). Verify: the fast checker prints 0 coverage findings, and each mention names the artifact its folder actually holds.
- [x] T015 Write one patch entry per touched skill and move its carriers (`*/changelog/v<next>.md`). Verify: 11 entries exist, each passes `V` and `hvr_scan` with 0 hard blockers, and every carrier for a skill names the same version.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Rerun the fast checker (`R`). Verify: 27 broken / 0 coverage, and the 27 are 17 rule-1 and 10 rule-2 items.
- [x] T017 Validate every README in scope (`R`). Verify: `V` exits 0 on 59 of 59.
- [x] T018 Run the two README tests (`.skilled/skills/sk-doc/scripts/tests/`). Verify: `SUMMARY: discovery=pass exclusions=21/21 manifest=reproducible` and `PARITY PASS: verdict diff is empty`, both exit 0 with no baseline rewrite.
- [x] T019 Run the markdown link guard (`.opencode/skills/system-spec-kit/runtime/cli/check-markdown-links.cjs`). Verify: `7663 files, 13976 links checked, 0 broken`, exit 0.
- [x] T020 Run the hub invariant check and the Hermes sync (`.skilled/skills/sk-doc`, `.skilled/skills/sk-code`, `.skilled/skills/mcp-tooling`, `.skilled/skills/system-deep-loop`). Verify: `parent-skill-check.cjs` exits 0 on all four hubs with every hard invariant met and 0 warnings, and the sync prints `Wrote 0 of 67 Hermes skill copies`.
- [x] T021 Validate this packet (`specs/sk-doc/070-repo-doc-debt/005-reference-and-coverage-fixes`). Verify: `validate.sh --strict` prints `RESULT: PASSED` with Errors 0 and Warnings 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The fast checker prints 27 broken and 0 coverage, `V` exits 0 on 59 of 59, and both README tests pass
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

A blocked task keeps `[B]` and its reason in this file rather than turning into a silent skip.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: spec.md section 4
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: plan.md section 3
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: plan.md section 6
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every edited README passes its validator. Evidence: `V` exits 0 on 59 of 59
- [x] CHK-011 [P0] No new validator warning on an edited README. Evidence: the same run, before and after, exits 0 on 59 of 59
- [x] CHK-012 [P1] Failure path handled: a reference with no target is described in words, not pointed at a guess. Evidence: the `.opencode/specs`, `.skilled/release/base.json` and promotion-report items
- [x] CHK-013 [P1] Edits follow the owning README template. Evidence: `V` on every edited file, plus diff review of each section
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: acceptance-criteria.md
- [x] CHK-021 [P0] Diffs reviewed for lost facts and invented targets. Evidence: every diff read; path and placeholder edits only, plus 13 added sentences
- [x] CHK-022 [P1] Edge cases checked. Evidence: the 11-finding README took one batched edit, and the coverage-only README got a sentence with no path edit
- [x] CHK-023 [P1] Before and after counts measured from reruns. Evidence: fast checker 96 broken / 13 coverage before, 27 broken / 0 coverage after
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: the compiled `.js` names are `class-of-bug` (one suffix rule), the symlink targets are `class-of-bug` (one path convention), the placeholder names are `class-of-bug`, and the gitignored and package-relative items are `matrix/evidence` and stay
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: `git ls-files '*.ts'` shows every source the compiled names now cite, and `git check-ignore -v` matches every rule-1 path
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: plan.md affected-surfaces table names the 59 READMEs, the audit exclusions, the changelog carriers, the manifest and the link guard
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Evidence: the truncated name covers the delimiter case, the symlink spelt from the link's folder covers outside-root, the compiled `.js` name covers the fallback, and a second checker pass covers no-op
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: plan.md names the rule axis and the tree axis, and the evidence table carries one row per finding
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: N/A, the two rewritten test commands run with `--config vitest.config.ts` from the skill root and read no process-wide state
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: every count comes from a final-state rerun over the 59 READMEs in scope
- [x] CHK-FIX-008 [P2] Every finding left in place names the tree or the lane that owns it. Evidence: implementation-summary.md Known Limitations
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: documentation-only diff
- [x] CHK-031 [P0] Input validation implemented. Evidence: N/A, no code changed; the audit's own functions produced every finding
- [x] CHK-032 [P1] Auth/authz working correctly. Evidence: N/A, no service and no credential
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: `validate.sh --strict` on this folder prints `RESULT: PASSED`
- [x] CHK-041 [P1] Code comments adequate. Evidence: N/A, no code changed
- [x] CHK-042 [P2] README updated where in scope. Evidence: Files Changed table in implementation-summary.md
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: the finding list, the evidence table and the checker output sat in the session scratchpad, outside the repo
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `ls -a scratch` lists `.gitkeep` only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->
