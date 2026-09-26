---
title: "Tasks: Phase 9: verification-and-closeout"
description: "Tasks to run the goal-authoring playbook, prove the real accept path, measure routing and close the packet."
trigger_phrases:
  - "sk-create-goal closeout tasks"
  - "goal playbook verdicts"
  - "real goal accept-path test"
  - "phase acceptance closure"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 9: verification-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P0]` | Required blocker |
| `[P1]` | Required or approved deferral |
| `[P2]` | Optional |

**Task Format**: `T### [P0|P1|P2] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm Phases 006-008 meet their incoming handoffs. Read their final acceptance criteria and implementation summaries, check the four command mirrors with `test -f`, and run the Phase 008 playbook validator (specs/sk-doc/060-create-goal-mode/006-goal-conformance-check/, 007-hub-routing-integration/, 008-command-and-playbook/). Evidence: 006, 007 and 008 each printed `RESULT: PASSED` under `validate.sh --strict`; `test -f` found the Claude, Cursor, Codex, Pi and Hermes copies of `/create:goal`; `validate-playbook-package.cjs` printed `PASS` with `scenarios=8`.
- [x] T002 [P0] Read the playbook root and enumerate the eight canonical scenario files in index order; save their paths before execution (.skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/). Evidence: eight files in `goal-authoring/`, run in index order SCG-001 to SCG-008.
- [x] T003 [P0] Recheck the real target's current phase map and parent goal. Use `017-memory-database-decommission` only if its phase-007 binding gap remains; save the original parent goal before an authoring run (specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/goal.md). Evidence: `scratch/accept-path/check-before.txt` fails `missing-binding-row` for `007-decommission-review-p1-p2-fixes/goal.md`; the original parent goal is saved as `scratch/accept-path/parent-goal.before.md`. The parent's phase map names phase 7 `007-deep-review-remediation`, a different name from the folder on disk (`scratch/accept-path/phase-map-vs-disk.txt`).
- [x] T004 [P0] Read the accepted Phase 004 operation decision, Phase 006 checker instructions, `sk-create-readme` contract and changelog contracts. Record the changelog nested-target question without making it a dependency (specs/sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/, 006-goal-conformance-check/, .skilled/skills/sk-doc/sk-create-readme/SKILL.md, .skilled/skills/sk-doc/sk-create-changelog/SKILL.md). Evidence: the accepted operation for this gap is `phase-add`; the changelog question is answered at T011.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P0] Execute all eight scenarios as written. Record each final `PASS`, `FAIL` or `SKIP`, its reason and its evidence path in the dated sk-doc benchmark report and this phase's implementation summary; fix in-scope failures and rerun them (sk-create-manual-testing-playbook/SKILL.md:297-312, 352-360). Evidence: 8 PASS, 0 FAIL, 0 SKIP in `.skilled/skills/sk-doc/benchmark/reports/2026-09-26--manual-testing-playbook--create-goal/results.csv`; raw records in `scratch/playbook-run/`.
- [x] T006 [P0] Invoke `/create:goal` using the accepted Phase 004 operation on a real packet with a current goal gap. Run the Phase 006 completeness check, verify every direct phase goal path with `test -f`, and capture `node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo-root>` output showing `packet_budget=ok` (specs/system-speckit/033-system-speckit-v4/017-memory-database-decommission/). Evidence: the `/create:goal` `:auto` workflow ran `phase-add` on 017; `scratch/accept-path/check-after.txt` prints `RESULT: PASSED (4/4 checks)` for the parent and the new child; `goal-packet.txt` reads `packet_durable_chars=3728` and `packet_budget=ok`; `phase-goals.txt` lists seven `PRESENT` rows.
- [x] T007 [P0] Replay the same ten newcomer prompts from Phase 007 through `node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<same prompt>"}' --format json` and `node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "<same prompt>"`. Record ten rows, exact outputs, exit statuses and counts for advisor, mode and joint reachability (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:109-127). Evidence: `scratch/routing-final.txt`; 10 of 10 route `[sk-create-goal]` at the hub, 9 of 10 have advisor top `sk-doc`, joint 9 of 10; every command exit 0.
- [x] T008 [P0] Replay all six fixed session-goal and host-command controls through both routing commands; require zero `sk-create-goal` targets, and record any mismatch without treating an unavailable command as a pass (specs/sk-doc/060-create-goal-mode/007-hub-routing-integration/plan.md:131-133). Evidence: the six probes all return `defer []` at the hub, so 0 of 6 reach `sk-create-goal`; every command exit 0.
- [x] T009 [P0] Invoke `/create:readme` through `sk-create-readme` for the mode folder. Run `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-doc/sk-create-goal/README.md --type readme` and `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py .skilled/skills/sk-doc/sk-create-goal/README.md` (sk-create-readme/SKILL.md:165-180, 290-327). Evidence: `validate_document.py` prints `VALID` with 0 issues, exit 0; `hvr_scan.py` reports 0 hard blockers.
- [x] T010 [P0] Write `.skilled/skills/sk-doc/sk-create-goal/changelog/v1.0.0.0.md` directly in the sibling mode format. Create `.skilled/changelog/sk-doc/create-goal` as a relative directory symlink only if the path is absent, then verify the changelog file through the link (specs/sk-doc/060-create-goal-mode/spec.md:109; specs/sk-doc/z_archive/040-create-repo-rules/007-validation-and-changelog/implementation-summary.md:81-89, 101-103). Evidence: both `test -f` checks succeed; `readlink` prints `../../skills/sk-doc/sk-create-goal/changelog`.
- [x] T011 [P1] Resolve whether `sk-create-changelog` global mode supports `sk-doc/create-goal` by reading its current contract and recording the evidence. Keep the direct changelog write independent of the answer (sk-create-changelog/SKILL.md:58-60, 184-190). Evidence: unsupported. `sk-create-changelog/SKILL.md:190` accepts one kebab-case segment matching `^[a-z0-9]+(?:-[a-z0-9]+)*$`, so `sk-doc/create-goal` is rejected. The direct write and link did not depend on it.
- [x] T012 [P0] Write this phase's matching nested spec changelog with `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/sk-doc/060-create-goal-mode/009-verification-and-closeout --write` (sk-create-changelog/SKILL.md:219-230). Evidence: `specs/sk-doc/060-create-goal-mode/changelog/changelog-060-009-verification-and-closeout.md` exists.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 [P0] Rerun the Phase 006 conformance check against its positive fixture, every named negative fixture and the real target packet. Require the positive case to pass and each negative case to fail for its named reason (specs/sk-doc/060-create-goal-mode/spec.md:147; specs/sk-doc/060-create-goal-mode/goal.md:108-110). Evidence: `node --test` passes 8 of 8; the positive fixture passes all four checks and each of the six negative fixtures fails only its named check; the checker prints `RESULT: PASSED (4/4 checks)` on 017.
- [x] T014 [P0] Close each acceptance row in all nine phases against observed evidence. Align the child `spec.md`, `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md` statuses with the parent map and goal log (specs/sk-doc/060-create-goal-mode/spec.md:119-136; validation-rules.md:68-93). Evidence: all nine child `acceptance-criteria.md` files read `Status: Complete` and `Closeable: Yes`; the 006, 007 and 008 headers were closed here, their rows already `Met`; parent map row 9 and the goal log agree.
- [x] T015 [P0] Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` and verify the mode's required parent completion surfaces (parent-skills-nested-packets.md:240-255). Evidence: `OK: parent-skill-check — all hard invariants passed, 0 warnings`.
- [x] T016 [P0] Run `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/060-create-goal-mode --recursive --strict`; read output and exit status and require `RESULT: PASSED` (validation-rules.md:765-780). Evidence: `RESULT: PASSED` for the parent and all nine children.
- [x] T017 [P0] Check the exact mode README, mode changelog, nested phase changelog, dated report and hub symlink paths; use `test -f`, `test -L` and `readlink` to prove the link resolves to the release file. Evidence: the README, mode changelog, nested phase changelog and dated report exist; `test -L` succeeds and the link resolves to `v1.0.0.0.md`.
- [x] T018 [P1] Update the phase implementation summary and every evidence row from the final checks. Leave no `Unmet`, unsupported waiver or mismatched status in the parent packet (acceptance-criteria.md; specs/sk-doc/060-create-goal-mode/goal.md). Evidence: `implementation-summary.md` records the final checks; no `Unmet` row or waiver remains in the packet.
- [x] T019 [P0] After the last edit, run the five runtime-mirror checks named in REQ-010 and record each output line and exit status (operator-approved amendment). Evidence: `170 mirrors across 8 trees are in sync`, `34 prompts are in sync` for Codex, Pi and Hermes, and `71 Hermes skill copies in sync`, each exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] [P0] Every P0 task has observed evidence and each P1 task is complete or has an approved deferral.
- [x] [P0] All eight playbook scenarios have a final verdict and the real accept path passes.
- [x] [P0] The ten-prompt result records both routing outcomes and the joint count.
- [x] [P0] Every phase acceptance row is closeable and all packet status records agree.
- [x] [P0] Recursive strict validation prints `RESULT: PASSED`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Acceptance criteria**: See `acceptance-criteria.md`.
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

- [x] CHK-001 [P0] Phase 006, 007 and 008 incoming handoffs are evidenced before this phase starts.
- [x] CHK-002 [P0] The ten-prompt set and eight playbook files are read and enumerated before execution.
- [x] CHK-003 [P1] The real goal target still has a genuine binding gap and its original goal is backed up.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The real accept path uses `/create:goal` and the Phase 004 accepted operation.
- [x] CHK-011 [P0] The Phase 006 checker proves its positive and named negative cases.
- [x] CHK-012 [P1] The README and changelog prose pass their applicable Human Voice and document checks.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Eight scenario results include a verdict, reason and evidence path.
- [x] CHK-021 [P0] Goal packet output reports `packet_budget=ok` and every phase goal path exists.
- [x] CHK-022 [P0] Ten newcomer prompts have advisor and compiled-route outcomes and a recorded joint count.
- [x] CHK-023 [P0] Recursive strict validation prints `RESULT: PASSED`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Not applicable. This phase verifies documentation and routing behavior; it is not a code-finding remediation phase.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The real goal run writes packet documents only and does not call session-goal bind, set, update or resend actions.
- [x] CHK-031 [P1] The original target goal is restorable and no credential or production data is captured in the run record.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Parent, child and current-phase status fields agree with acceptance evidence.
- [x] CHK-041 [P0] The direct mode changelog, hub directory link and nested phase changelog resolve.
- [x] CHK-042 [P1] The README follows the `sk-create-readme` contract and its Human Voice scan has no hard blockers.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The run record and release artifacts use only the paths listed in `spec.md`.
- [x] CHK-051 [P1] Temporary copies and scratch output are removed after their evidence is filed.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-26
<!-- /ANCHOR:summary -->
