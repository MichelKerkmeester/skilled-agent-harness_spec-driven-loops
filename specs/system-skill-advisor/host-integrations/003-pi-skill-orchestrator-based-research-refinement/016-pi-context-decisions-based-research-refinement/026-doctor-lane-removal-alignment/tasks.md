---
title: "Tasks: Align the doctor surface with the removed advisor lane"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "doctor lane removal alignment tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Align the doctor surface with the removed advisor lane

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

`DOCTOR` is `.skilled/commands/doctor`. `SWEEP` is `.skilled/skills/system-spec-kit/runtime/cli/retrieval/sweep-lane-residue.mjs`. `ADVISOR` is `.skilled/skills/system-skill-advisor/runtime`. `FOLDER` is `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/026-doctor-lane-removal-alignment`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baselines on `a34344e6a47` before any edit (`spec.md` Measured Behavior). Verify: the doctor suite prints `ℹ pass 1427`, route validation prints `31 routes validated, 11 warnings`, repo mode prints `live` 0 with 47 of 47, and `sync-runtime-mirrors.cjs --check` prints `260 mirrors`. Evidence: all four recorded in `spec.md` Measured Behavior during planning, with exit 0 each.
- [ ] T002 Observe a current copy's apply on a fixture (REQ-002). Use a temp repo and a fixture HOME from the `makeFixture` pattern in `DOCTOR/scripts/tests/release-update.test.cjs`, never the worktree (024 D6). Run `release-update.cjs apply` twice at one release and record the second run's exit and its `writes` array. Verify: the second run exits 0 with an empty `writes` array, and the note records whether `doctor-update-apply.yaml` phase 7 is reached. Evidence: —
- [ ] T003 Observe the linked refusal (REQ-003). Use `makeVendoredLayout`, replace the project's `.skilled` with a symlink to an outside checkout, and run `release-update.cjs apply --dry-run` from it. Verify: the command exits non-zero and prints the message the guide will quote. Evidence: —
- [ ] T004 [P] Confirm the advisor ratchets run before any edit. From `ADVISOR`, run `npx vitest run tests/routing-golden-prompts.vitest.ts tests/doctor-routing-slice.vitest.ts tests/command-routing-slice.vitest.ts tests/routing-registry-drift-guard.vitest.ts`. Verify: it exits 0 and prints its pass count. Evidence: —
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Write the per-install cleanup into `INSTALL-SKILLED.md` section 5, the update row at line 308 (REQ-001), using the commands that T002 and T003 confirm. Verify: `rg -n 'sweep-lane-residue.mjs machine' INSTALL-SKILLED.md` prints one line, and `rg -n 'doctor/update apply' INSTALL-SKILLED.md` prints one line.
- [ ] T006 [P] Correct the advisor Upgrade Notes at `.skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md`, lines 160 to 166 (REQ-009). Verify: `rg -n 'Every reader takes both steps' .skilled/skills/system-skill-advisor/changelog/v2.0.0.0.md` prints nothing.
- [ ] T007 [P] Correct the cleanup pointer at `DOCTOR/assets/doctor-update-presentation.txt` line 459 (REQ-009). Verify: `rg -n 'pointed to' DOCTOR/assets/doctor-update-presentation.txt` prints the linked-install wording, and `node --test DOCTOR/scripts/tests/doctor-update-contract.test.cjs` exits 0.
- [ ] T008 Add one helper-match case per cleanup phrase to `DOCTOR/scripts/tests/doctor-helper-match.test.cjs` (REQ-011). Verify: `node --test DOCTOR/scripts/tests/doctor-helper-match.test.cjs` fails on the new cases before T009.
- [ ] T009 Add the cleanup phrases to the `/doctor:update` route's `trigger_phrases` in `DOCTOR/_routes.yaml`, lines 782 to 790 (REQ-004, REQ-005). The starting list is "remove leftovers from the retired advisor lane", "clean up what the retired lane left behind", "remove leftover model files after upgrade", "clean embedding model", "advisor model server still running", "lane residue CI failing", "delete the pulled shared model" and "retired advisor lane cleanup". Keep only the phrases that G3 shows routing to `/doctor:update`, and keep each at three words or more. Verify: `bash DOCTOR/scripts/route-validate.sh` prints `31 routes validated`, and the term check in plan.md section 5 prints no hit.
- [ ] T010 Rebuild the advisor bridges from the route: `node ADVISOR/scripts/command-bridges/derive-command-bridges.cjs` in write mode (REQ-006). Verify: `node ADVISOR/scripts/command-bridges/derive-command-bridges.cjs --check` exits 0 and prints `"changed": []`.
- [ ] T011 Bump the doctor release. Set `.skilled/skills/system-skilled-doctor/SKILL.md` line 5 to `1.3.0.0`, and create `.skilled/skills/system-skilled-doctor/changelog/v1.3.0.0.md` in the shape of `v1.2.0.0.md`, with the six items in plan.md section 3 and the gate-safe wording (REQ-007). Verify: `rg -n '^version: 1.3.0.0' .skilled/skills/system-skilled-doctor/SKILL.md` prints one line, and `ls .skilled/skills/system-skilled-doctor/changelog/v1.3.0.0.md` lists the file.
- [ ] T012 [P] Name the cleanup in the doctor README `/doctor:update` row at line 42 (REQ-010). Verify: `rg -n 'cleanup' .skilled/skills/system-skilled-doctor/README.md` prints line 42.
- [ ] T013 [P] Update `.skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` to six legs and 26 rows, and add the delivery leg with its two scripts, its DEGRADED and ERROR rules, and its repair lines from `DOCTOR/assets/doctor-setup.yaml` line 60 (REQ-008). Verify: `rg -n 'five|25' .skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` prints no line that counts legs or rows, and `rg -c 'delivery' .skilled/manual-testing-playbook/doctor-commands/doctor-setup-run.md` prints at least 1.
- [ ] T014 Regenerate the leaf manifest only if the check reports drift. Run `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs --check .skilled/skills/system-skilled-doctor`, and when it fails, run its `--write` once (REQ-007). Verify: the `--check` run exits 0.
- [ ] T015 Check each new sentence outside `specs/` against `IDENTIFIER_TERMS` and `PROSE_TERMS` in `SWEEP` before it is saved, in `_routes.yaml`, `INSTALL-SKILLED.md`, the advisor changelog, the presentation, the README, the playbook and the new changelog. Verify: a case-insensitive `node -e` check prints `hits=0` for each file.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run gates G1 to G7 from plan.md section 5 and read each output and exit status. Verify: `node --test DOCTOR/scripts/tests/*.test.cjs` prints `ℹ fail 0`, route validation prints `31 routes validated`, the four vitest files exit 0, and `sync-runtime-mirrors.cjs --check` prints `260 mirrors`.
- [ ] T017 Confirm the cleanup prompts route (REQ-004). Verify: each of "clean embedding model", "advisor model server still running", "lane residue CI failing" and "remove Ollama leftovers" prints a `/doctor:update` candidate from `node DOCTOR/scripts/doctor-helper-match.cjs -- "<prompt>"`, and the last one's known limit stays in spec.md.
- [ ] T018 Run repo mode and the gate test (G8). Verify: `node SWEEP repo --json` exits 0 with `allowlistRowsMatched` 47 of 47 and `live` 0, and `node --test DOCTOR/scripts/tests/lane-residue-gate.test.cjs` exits 0.
- [ ] T019 Repair derived metadata on this packet and on 016: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <folder> --apply`, once for each folder. Verify: each command exits 0 and names the files it rewrote.
- [ ] T020 Validate this packet and 016 strictly (G9). Verify: `SPECKIT_DRAFT_AUTO_REPAIR=0 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict` prints `RESULT: PASSED` for each folder.
- [ ] T021 Regenerate the trigger index as the last write (G10), after `tsc --build` in `.skilled/skills/system-spec-kit/shared`. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` exits 0, and no packet or tool file changes after it.
- [ ] T022 Re-run route validation and repo mode once after T021, read-only. Verify: each exits 0 with the counts that T016 and T018 printed.
- [ ] T023 Mark each acceptance criterion Met with its observed output, or name it unmet. Verify: `rg -n '\| Unmet \|' acceptance-criteria.md` prints nothing.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`, with T002 and T003 closed by their observed output
- [ ] No `[B]` blocked tasks remaining
- [ ] Each Met acceptance criterion names the output it observed
- [ ] The implementation commit holds every file in `spec.md` Files to Change, and nothing outside it
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] The current-copy and linked observations (T002, T003) are recorded before any edit to `INSTALL-SKILLED.md` (T005).
- [ ] CHK-002 [P0] Every REQ in `spec.md` section 4 has an acceptance row in `acceptance-criteria.md`, checked by `rg -c 'REQ-0' acceptance-criteria.md`.
- [ ] CHK-003 [P1] The advisor ratchets pass before any edit (T004).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] `doctor-helper-match.test.cjs` and `release-update.test.cjs` pass with `node --test` (T008, T002, T003).
- [ ] CHK-011 [P0] `_routes.yaml` parses, and `route-validate.sh` exits 0 (T009).
- [ ] CHK-012 [P1] Route validation shows no warning beyond the 11 at baseline.
- [ ] CHK-013 [P1] The new changelog follows the `v1.2.0.0.md` shape: frontmatter, lead paragraph, "What's New at a Glance" and "Upgrade".
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria are Met (T023).
- [ ] CHK-021 [P0] The four cleanup prompts route to `/doctor:update` (T017).
- [ ] CHK-022 [P1] The held-out routing fixture is unedited, so `git diff --stat` on it prints nothing.
- [ ] CHK-023 [P1] Repo mode reports live 0 after the edits (T018).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No fixture run wrote to the operator's HOME or to the worktree's state folder, checked by `git status --short` after T002 and T003.
- [ ] CHK-031 [P0] The guide tells no user to delete a file by hand.
- [ ] CHK-032 [P1] No credential is read or written by a changed file, checked by `rg -n -i 'token|secret|password'` on each changed file.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `INSTALL-SKILLED.md`, the advisor changelog, the presentation and the README agree on the cleanup commands (REQ-009, REQ-010).
- [ ] CHK-041 [P1] The playbook counts match `doctor-setup-presentation.txt` section 2 (26 rows) and `doctor-setup.yaml` (six legs) (REQ-008).
- [ ] CHK-042 [P2] Row 26 of the 016 phase map matches rows 24 and 25 in format.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Fixture output lives in a temp directory or in `scratch/`, and `git status --short` shows only the planned files.
- [ ] CHK-051 [P1] `scratch/` holds no leftover fixture output at closure.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-21
<!-- /ANCHOR:summary -->

---
