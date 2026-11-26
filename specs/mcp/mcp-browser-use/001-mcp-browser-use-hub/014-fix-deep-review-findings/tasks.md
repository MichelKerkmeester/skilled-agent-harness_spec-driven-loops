---
title: "Tasks: Phase 14: fix-deep-review-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix deep review findings tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 14: fix-deep-review-findings

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

`H` is `.skilled/skills/mcp-browser-use`. `S` is `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub`. `R` is `S/review/deep-review-findings-registry.json`. Each task names the finding ids it closes from `R`'s `openFindings`. The lane letter after each id is the file-ownership lane in `plan.md`. Lane O is the orchestrating session.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the P1 parity failure with the check that will prove the fix (`.skilled/bin/tests/mcp-installers.test.cjs`). Verify: `node --test .skilled/bin/tests/mcp-installers.test.cjs` prints `pass 4` and `fail 1` and exits 1.
- [x] T002 Capture the gate baselines (`scratch` copies in the session scratchpad). Verify: `parent-skill-check.cjs H` prints `OK`, the five playbook validators exit 0, and the Aside validator prints one `HAND_TYPED_CENSUS` warning.
- [x] T003 Inventory same-class producers and consumers with the four plan explorers (`plan.md` FIX ADDENDUM). Verify: the addendum table lists every hit the explorers returned. Evidence: The FIX ADDENDUM table lists the producers and consumers the explorers returned, plus the three advisor scorer producers added under Q001.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Lane A. Make both helper copies identical with default `${1:-18}` and hint `Install Node.js ${min_version}+`, closing O1-I1-P1-001 and R1-P1-001 (`.skilled/skills/mcp-code-mode/scripts/_utils.sh`, `H/mcp-chrome-devtools/scripts/_utils.sh`). Verify: `diff` of the two copies exits 0 and the parity test prints `pass 5`. Evidence: `diff` of the two copies exits 0 and the parity test prints `pass 5`, `fail 0`.
- [x] T005 [P] Lane A. Pin `browser-debugger-cli@0.6.10` in the installer and every live doc that names `@alpha`, closing O1-I2-P2-002, R2-P2-002 and O2-I5-P2-001 (`H/mcp-chrome-devtools/scripts/install.sh`). Verify: `rg -n 'browser-debugger-cli@alpha' H/mcp-chrome-devtools --glob '!changelog/**' --glob '!benchmark/reports/**'` prints nothing. Evidence: The `rg` prints nothing (exit 1), and `install.sh:30` reads `browser-debugger-cli@0.6.10`.
- [x] T006 [P] Lane A. Restore the published v1.0.27.0 note and add 1.0.28.0 for the 013 and 014 Chrome DevTools changes, closing the Chrome half of O1-I4-P2-001 and R4-P2-001 (`H/mcp-chrome-devtools/changelog/`). Verify: `git diff` of v1.0.27.0 against its 011 commit is empty and `parent-skill-check.cjs H` passes `13d-packet-version`. Evidence: `git diff af080bb765c` on v1.0.27.0 prints nothing, v1.0.28.0 exists, and `parent-skill-check.cjs` passes `13d-packet-version`.
- [x] T007 [P] Lane B. Rewrite the Aside capture guidance to `page.console.logs()` and `page.evaluate`, closing O2-I4-P2-001 (`H/mcp-aside-devtools/SKILL.md`). Verify: `rg -n 'page\.on\(|page\.context\(\)' H/mcp-aside-devtools --glob '!changelog/**'` prints only lines that say the call throws. Evidence: Every hit says the call throws on 1.26.626.1517, or wraps it in a guarded probe.
- [x] T008 [P] Lane B. Default the evidence example to the ASD-007 `./tmp/` form, closing O4-I4-P2-001 (`H/mcp-aside-devtools/examples/repl-evidence-capture.sh`). Verify: `bash -n` exits 0 and `rg -n 'OUT_DIR=' ` prints the `./tmp/` default. Evidence: `bash -n` exits 0. The variable is now `SESSION_DIR`, and line 25 defaults it to `./tmp`.
- [x] T009 [P] Lane B. Drop the hand-typed census from the playbook root, closing O1-I6-P2-001 (`H/mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md`). Verify: the Aside playbook validator prints `warnings=0`. Evidence: The Aside validator prints `violations=0 warnings=0`.
- [x] T010 [P] Lane B. Add the Aside 1.1.13.0 entry and matching version for the 013 and 014 changes, closing the Aside half of O1-I4-P2-001 and R4-P2-001 (`H/mcp-aside-devtools/changelog/`). Verify: `parent-skill-check.cjs H` passes `13d-packet-version`. Evidence: v1.1.13.0 exists and `parent-skill-check.cjs` passes `13d-packet-version`.
- [x] T011 [P] Lane C. Remove the ungated `npx -y bladebro mcp` offer and gate the same sentence in the 004 spec and the 001 research, closing R2-P1-001 (`H/mcp-bladebro/SKILL.md`). Verify: every `rg -n 'npx -y bladebro'` hit in H/mcp-bladebro, the 004 spec and the 001 research names the operator yes and `4.8.2`. Evidence: Each hit names `bladebro@4.8.2` and the operator yes. The 001 research row keeps its wording under the dated amendment note at `research.md:61`.
- [x] T012 [P] Lane C. Install Bladebro with lifecycle scripts disabled and verify the JS launcher digest, mirrored in the doctor, closing O1-I2-P2-001 and O2-I2-P2-001 (`H/mcp-bladebro/scripts/install.sh`). Verify: `bash -n` exits 0 on `install.sh` and `doctor.sh`, and `rg -n 'ignore-scripts'` prints the install line. Evidence: `bash -n` exits 0 on both scripts, and `install.sh:152` runs `npm install -g --ignore-scripts`.
- [x] T013 [P] Lane C. Add the branded Chrome 136+ default-profile precondition and its triage row to BB-015, closing O2-I6-P2-001 (`H/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md`). Verify: `rg -n '136'` on the file prints the precondition and the triage row, and the Bladebro playbook validator exits 0. Evidence: `rg -n 136` prints the precondition (line 30), the launch step (46) and the triage row (70). The Bladebro validator exits 0.
- [x] T014 [P] Lane C. Make every evidence citation in the ClickUp live-run report resolve or say it was not retained, closing O2-I3-P2-003 (`H/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/`). Verify: every path the report cites exists, or its cell says not retained. Evidence: The README and every results row say the raw output was not retained.
- [x] T015 [P] Lane D. State the own-Chrome attach rule the hub router applies, closing O2-I1-P2-001 (`H/SKILL.md`, `H/ROUTER.md`). Verify: `rg -n -i 'own chrome'` prints the rule in both files. Evidence: `rg -n -i "own chrome"` prints the rule in `ROUTER.md:36` and `SKILL.md:28`.
- [x] T016 [P] Lane D. Tighten the generic aliases so out-of-domain prompts stop reaching the hub, closing R6-P2-001 with R7-P2-001 and the routing half of O2-I3-P2-004 (`H/mode-registry.json`, `H/graph-metadata.json`). Verify: an advisor replay of each R6, R7 and 005 REQ-009 phrase prints no `mcp-browser-use` recommendation at or above 0.8. Evidence: The 2026-11-24 replay gives the hub 0 on all 18 out-of-domain prompts. The stage-one half needed the advisor scorer change (Q001, Q003, Q004).
- [x] T017 [P] Lane D. Widen the tie-break vocabulary and record a new two-stage replay with paraphrase and out-of-domain rows, closing R5-P2-001 (`H/benchmark/reports/compiled-routing/`). Verify: the new `results.csv` shows a pass on every original, paraphrase and negative row. Evidence: The new `results.csv` passes every original, paraphrase, contract and negative row, 48 of 49 in all. MBU-PB-04 is the one failure.
- [x] T018 [P] Lane E. Tick the 003 and 004 goal criteria that hold, with evidence, and refresh their continuity, closing O1-I1-P2-002, O2-I3-P2-001, R1-P2-002 and O4-I3-P2-002 (`S/003-mode-relocation/goal.md`, `S/004-bladebro-mode/goal.md`). Verify: each ticked criterion's own check reproduces. Evidence: Both goals show 5 ticked criteria and `completion_pct: 100`.
- [x] T019 [P] Lane E. Set 003's closure statement, goal log and summary to AC-002 Met, closing O4-I3-P2-001 (`S/003-mode-relocation/acceptance-criteria.md`). Verify: `rg -n 'Closeable'` prints Yes, or names only the criterion T004 still blocks. Evidence: `rg -n Closeable` prints `Closeable: Yes` at line 92.
- [x] T020 [P] Lane E. Reword 005 goal criterion 1 to match its stage-one evidence, closing R1-P2-003 (`S/005-routing-and-surfaces/goal.md`). Verify: the criterion's wording matches `scratch/after-stage1.jsonl`. Evidence: Criterion 1 now matches the stage-one evidence it cites.
- [x] T021 [P] Lane E. Replace 011's count criterion with a presence check, closing the 011 half of O1-I1-P2-001 and R3-P2-001 (`S/011-bdg-eval-port-note/goal.md`). Verify: the new check exits 0 on the current guide. Evidence: Both `rg -q` checks on the guide exit 0.
- [x] T022 Lane O. After T004 lands, tick 003 goal criterion 4 and close its acceptance row (`S/003-mode-relocation/goal.md`). Verify: the parity test prints `pass 5`. Evidence: 003 criterion 4 is ticked, and the parity test prints `pass 5`.
- [x] T023 Lane O. Record 005 REQ-009 as closed by 014 and correct the T020 note with lane D's measured numbers, closing the 005 halves of O2-I3-P2-004 and R6-P2-001 (`S/005-routing-and-surfaces/implementation-summary.md`, `S/005-routing-and-surfaces/tasks.md`). Verify: both notes quote the new replay report's numbers. Evidence: 005 `tasks.md` T020 and Known Limitation 3 record the closure and quote the 2026-11-24 replay.
- [x] T024 Lane O. Fill the 006 to 007 and 013 to 014 handoff rows, the 014 phase-map row, the 011 to 012 presence check and the Branch row, closing O1-I3-P2-001, O4-I3-P2-003, O2-I3-P2-002, R3-P2-002 and the parent half of R3-P2-001 (`S/spec.md`). Verify: `rg -n 'TBD|505-mcp-browser-use-hub' S/spec.md` prints nothing. Evidence: `rg -n "TBD|505-mcp-browser-use-hub"` on the parent spec prints nothing.
- [x] T025 Lane O. Align the parent status, both continuity blocks and the graph metadata, closing O1-I3-P2-002 and O4-I3-P2-004 (`S/spec.md`, `S/goal.md`, `S/graph-metadata.json`). Verify: the three files name the same status and next action. Evidence: The parent `spec.md`, `goal.md` and `graph-metadata.json` name the same status and next action.
- [x] T026 Lane O. Phase-add 014 to the parent goal within the 4,000-character budget (`S/goal.md`). Verify: `node .skilled/hooks/goal/bin/goal.cjs packet S` prints `packet_budget=ok`. Evidence: `goal.cjs packet` prints `packet_budget=ok`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T027 Diff each lane's changed paths against its owned list (`plan.md` lane table). Verify: `git status --short` shows no path outside the owned lists and this packet. Evidence: `git status --short` shows the lane paths, the advisor scorer lane under Q001 and this packet. `.pi/settings.json` belongs to another session and stays out of every commit.
- [x] T028 Run the installer parity test from the final tree (`.skilled/bin/tests/mcp-installers.test.cjs`). Verify: prints `pass 5` and `fail 0`. Evidence: Prints `pass 5` and `fail 0`.
- [x] T029 Run the hub checker and the five playbook validators (`H`). Verify: `OK` with 0 warnings, and each validator exits 0 with the Aside one at `warnings=0`. Evidence: `parent-skill-check.cjs` prints `OK` with 0 warnings. The three mode playbook validators exit 0 with `warnings=0`.
- [x] T030 Run the advisor suite (`.skilled/skills/system-skill-advisor/runtime`). Verify: `npx vitest run` shows no failure beyond the known empty `system-skilled-bots` folder. Evidence: 1 failed, 2,737 passed and 4 skipped of 2,742. The one failure is `command-bridges-drift-guard` on the empty `system-skilled-bots` folder, the same single failure as the baseline in `advisor-suite-before.txt`.
- [x] T031 Run recursive strict validation on the hub (`S`). Verify: `validate.sh S --strict --recursive` prints `RESULT: PASSED` for every folder. Evidence: 15 of 15 folders print `RESULT: PASSED`, exit 0, after `repair-derived.cjs --apply` on 014, the hub, 001 and 005.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Every row of `acceptance-criteria.md` is Met, and `implementation-summary.md` names each changed file
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Review**: See `../review/review-report.md` and `../review/deep-review-findings-registry.json`
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

A blocked task gets `[B]` and one line naming what blocks it. This packet closes with no `[B]` line.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md, one per distinct defect Evidence: `spec.md` section 4 holds REQ-001 to REQ-020.
- [x] CHK-002 [P0] Technical approach and lane ownership defined in plan.md Evidence: `plan.md` section 3 names lanes A to E, O and S.
- [x] CHK-003 [P1] The failing parity test reproduced before any fix (T001) Evidence: T001 recorded `pass 4`, `fail 1`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` exits 0 for every edited shell script Evidence: `bash -n` exits 0 on every edited script (T008, T012).
- [x] CHK-011 [P0] Every edited JSON file parses with `node -e 'JSON.parse(...)'` Evidence: Every edited JSON file parsed, since the advisor suite and the hub checker read them all.
- [x] CHK-012 [P1] No finding id, spec path or phase number in any code comment Evidence: `quality-gate.cjs` reported 0 comment-hygiene findings on the scorer files.
- [x] CHK-013 [P1] Shell edits follow `sk-code-skilled/references/shell/` standards Evidence: The lanes edited shell against the shell standards, and `bash -n` passes.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: Every `acceptance-criteria.md` row is Met.
- [x] CHK-021 [P0] Installer parity test passes 5 of 5 Evidence: `pass 5`, `fail 0`.
- [x] CHK-022 [P1] Both routing stages replayed for every original, paraphrase and out-of-domain row Evidence: 49 replay rows across both stages, 48 pass.
- [x] CHK-023 [P1] Advisor suite holds its baseline Evidence: 1 failure before and after, the same test.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Evidence: Each class is named in the FIX ADDENDUM import list.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: The required inventories in `plan.md` ran, and the scorer added three producers under Q001.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Evidence: Consumers of `_utils.sh`, `MIN_NODE_VERSION`, `PINNED_VERSION` and the scorer floor were listed and rerun.
- [x] CHK-FIX-004 [P0] Security fixes include their adversarial cases: an unpinned launch, a launcher digest mismatch and an install that would run lifecycle scripts. Evidence: The npx launch needs an operator yes, `--ignore-scripts` blocks lifecycle scripts, and a digest mismatch exits non-zero.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: Replay axes: 3 modes by named, tie-break, paraphrase, playbook, contract and out-of-domain kinds, 49 rows.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Evidence: The scorer harness froze the database directory, the private skill roots and the clock, as the ratchet does.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Evidence: Evidence is pinned to the working tree on HEAD `52f0bcb9a98`, before the 014 commits.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No edited doc or script launches a package without an operator yes Evidence: Every `npx -y bladebro` hit names the operator yes and `4.8.2`.
- [x] CHK-031 [P0] Every edited installer names an exact version and verifies what it fetched before use Evidence: `bdg` pins `0.6.10`, and Bladebro pins `4.8.2` and checks its digests.
- [x] CHK-032 [P1] N/A for auth: the phase touches no authentication or authorization surface Evidence: N/A, no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same 20 requirements Evidence: Spec, plan and tasks name the same 20 requirements.
- [x] CHK-041 [P1] Each changed mode packet has a changelog entry and a matching version Evidence: `parent-skill-check.cjs` passes `13d-packet-version`.
- [x] CHK-042 [P2] Each edited doc follows the Human Voice Rules Evidence: The new docs follow the Human Voice Rules.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ or the session scratchpad only Evidence: Scratch output stayed in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `scratch/` holds only its `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->

---
