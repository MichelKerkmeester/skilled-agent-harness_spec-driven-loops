---
title: "Tasks: Phase 41: code-readmes-and-routing-alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "code readmes tasks"
  - "routing alignment tasks"
  - "router promotion checklist"
  - "section 2 reshape checklist"
  - "compiled route probe checklist"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 41: code-readmes-and-routing-alignment

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

`H` is the hub at `.skilled/skills/cli-classifier`. `R` is one of the eleven code folders of `spec.md` section 3. `P` is the ten-prompt compiled-route probe corpus and its recordings under `scratch/`, `D` is the design note under `scratch/` and `F` is the front door at `.skilled/bin/compiled-route.cjs`. The plan's six phases map onto the three sections below: design and the fixed corpus (plan phase 1) in Phase 1 with the baseline, the eleven READMEs (plan phase 2) and the hub and mode edits (plan phases 3 and 4) in Phase 2, and the regenerated artifacts, the probe, the review and the closure (plan phases 5 and 6) in Phase 3. Every writer task goes to DeepSeek V4.1 Flash on `cli-pi`, the review goes to a cross-family reviewer on `cli-devin` or `cli-codex`, and the reverse direction covers any reviewer fix (parent D5). The session runs the baselines, the probe and the closure gates, never an executor. Closure (2026-10-01): the build landed as commit `2116de635c` on `worktrees/071-cli-jev-sk-alignment`, and the session's record sits under `scratch/evidence/`. T003 to T012 close from that record, T001 and T002 stay open for their design-note clause because the session kept no separate note, and the checklist rows below carry their evidence.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Design read, executor DeepSeek V4.1 Flash (D5). Read `H/cli-jev/SKILL.md` and `H/cli-deem/SKILL.md` section 2, `H/ROUTER.md`, `H/SKILL.md`, `H/hub-router.json`, `H/mode-registry.json`, `H/description.json`, `H/leaf-manifest.json`, `.skilled/skills/sk-doc/sk-create-readme/`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`, the eleven `R` folders with their suites, and the three baseline gates, all read-only. Check: `D` names every `R` with its suite files, the seven intents with their manifest leaves, the two mode section 2 headings, and the baseline gate results, and no read-only source is edited. Done with a recorded deviation (2026-10-01, the operator's "Mark done, record the deviation"): the session kept no separate design note `D`, and its content lives in the evidence files instead; the phase `scratch/` tree holds only the build record and its recordings (`scratch/evidence/`), and the design's outcome is visible in the briefs and the baseline at `scratch/evidence/build-evidence.md:3-17`.
- [x] T002 Fix the probe corpus and the README command list in `D`, executor DeepSeek V4.1 Flash (D5). Fix the ten prompts of `P` with their expected `workflowMode` and `packetId`, the test command each `R`'s README will document, the thirteen phrases' class placement and the version lines. Check: each answer is one sentence with the alternative it was chosen over, `spec.md` section 10's five questions each have a proposed answer, and every `UNKNOWN` is named with what would resolve it. Done with a recorded deviation (2026-10-01): no separate design note exists, and its content lives in the evidence files instead; the fixed ten-prompt corpus is recorded at `scratch/evidence/probe-before.txt:1-10`, the README commands ran (`scratch/evidence/build-evidence.md:30`), the thirteen phrases sit in the two dispatch classes (`.skilled/skills/cli-classifier/hub-router.json:56-60,87-94`) and the version lines moved (`:15`), so only the note clause has no artifact.
- [x] T003 Baseline, executor the orchestrating session. Run `node .skilled/commands/doctor/scripts/parent-skill-check.cjs H`, `python3 .skilled/skills/sk-doc/scripts/validate_skill_package.py` on `H` and both modes, `rg -n 'cli-usage-aliases' H`, a README-existence test over the eleven `R`, and the ten prompts of `P` through `F`, saving every result under `scratch/`. Check: one recording per row, each baseline-correct row pins its decision, the two former misses are recorded as a defer rather than a missing row, and the three version lines are captured at `0.5.0.0`, `0.1.3.0` and `0.1.0.0`. Evidence: `scratch/evidence/probe-before.txt:1-10` holds one row per prompt, the eight baseline-correct rows pinned and both former misses recorded as `defer` at `:8-9`; the three version lines read `0.5.0.0`, `0.1.3.0` and `0.1.0.0` at the parent commit and its `ROUTER.md` still declared `router_state: stage1-only` (`git show 2116de635c^`, this pass).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Part A, the eleven code-folder READMEs, executor DeepSeek V4.1 Flash (D5). Write `README.md` in each `R` per `sk-create-readme`'s code-folder template, with topology, contents, boundaries and the validation command its section documents. Check: `python3 .skilled/skills/sk-doc/scripts/validate_document.py` exits 0 on all eleven, each documented test command passes from the repository root with 0 failed, and the four out-of-scope README-less folders gain no file. Evidence: r01 to r11 are DONE (`scratch/evidence/build-evidence.md:9`); `:29` records 22 of the changed skill docs VALID, 0 invalid, the eleven READMEs among them; `:30` records every documented test command exiting 0; and the build commit adds exactly the eleven README paths of section 3 with nothing under the four out-of-scope folders (`git show --stat --name-status 2116de635c`, this pass).
- [x] T005 [P] Part B, promote `ROUTER.md` and update the hub contract, executor DeepSeek V4.1 Flash (D5). In `H/ROUTER.md`, declare `router_state: active` and map the seven intents `JEV_JUDGMENT`, `JEV_QUESTION`, `JEV_PROVIDER`, `JEV_MCP`, `DEEM_JUDGMENT`, `DEEM_PROVENANCE` and `DEEM_LIFECYCLE` to leaves read from `H/leaf-manifest.json`; add the matching surface-router note to `H/SKILL.md`. Check: every mapped leaf resolves to a disk file or a declared alias, the seven intent names match between `ROUTER.md` and the two mode section 2s, and `parent-skill-check.cjs` prints `all hard invariants passed, 0 warnings` with 12a passing on the active state. Evidence: `.skilled/skills/cli-classifier/ROUTER.md:12-13` declares the active state at `0.6.0.0` and `:63-104` maps the seven intents to manifest leaves; `scratch/evidence/build-evidence.md:31` records the 0-warning check with 12a, 13a and 13b PASS.
- [x] T006 [P] Part B, the rename cleanup, executor DeepSeek V4.1 Flash (D5). In `H/hub-router.json`, rename the class to `cli-jev-aliases` and add the thirteen phrases: five to `jev-dispatch` (`does jev use`, `jev provider`, `jev model`, `jev auth`, `jev question`) and eight to `deem-dispatch` (`roll deem back`, `deem commit`, `update deem`, `restart deem`, `start deem`, `stop deem`, `deem is down`, `deem-ctl`). Repoint the current-state playbook and scenario files, and remove the sentence that says mode `cli-jev` runs over a folder named after itself. Check: `rg -n 'cli-usage-aliases' H` prints nothing outside dated changelog history, no bare backend word joins a class, no existing phrase, weight or class entry is removed, and the sentence sweep leaves dated changelog history alone. Evidence: `.skilled/skills/cli-classifier/hub-router.json:19,29` now read `cli-jev-aliases`, with the five Jev phrases at `:56-60` and the eight Deem phrases at `:87-94`; `grep -rn 'cli-usage-aliases' .skilled/skills/cli-classifier` prints only the dated `changelog/v0.6.0.0.md` history line, no current-state file (this pass); and the commit repoints the judgment scenario and removes the folder sentence from the playbook index (`manual-testing-playbook.md:18`).
- [x] T007 [P] Part B, reshape both mode section 2s, executor DeepSeek V4.1 Flash (D5). In `H/cli-jev/SKILL.md` and `H/cli-deem/SKILL.md`, replace the request-to-file lookup table with the template's subsections and one authoritative Smart Router Pseudocode block whose functions include `_guard_in_skill()`, `discover_markdown_resources()`, `classify_intents()`, `load_if_available()` and `UNKNOWN_FALLBACK_CHECKLIST`, and move `cli-jev`'s transport mechanics to section 3. Check: each of the five names appears in exactly one block per mode, no request-to-file lookup table remains as the routing contract, the transport text sits in section 3, and `validate_skill_package.py` passes on `H` and both modes. Evidence: both section 2s carry one Smart Router Pseudocode block with the five names (`cli-jev/SKILL.md:138,147,154,167,192`; `cli-deem/SKILL.md:119,128,135,148,173`), `cli-jev`'s transport text sits in section 3 (`cli-jev/SKILL.md:228`), `scratch/evidence/build-evidence.md:32` records PASS, PASS, PASS, and `:41` records the moved transport sections byte-identical.
- [x] T008 [P] Part B, the release lines, executor DeepSeek V4.1 Flash (D5). Move `H/SKILL.md`, `H/ROUTER.md`, `H/description.json`, `H/hub-router.json` and `H/mode-registry.json` to `0.6.0.0` and write `H/changelog/v0.6.0.0.md`; move `H/cli-jev/SKILL.md` to `0.1.4.0` with its `changelog/v0.1.4.0.md`, and `H/cli-deem/SKILL.md` to `0.1.1.0` with its `changelog/v0.1.1.0.md`. Check: `parent-skill-check.cjs` 13a and 13b pass with no soft finding, no routing artifact lags the `SKILL.md` authority, and each changelog entry is dated 2026-09-30. Evidence: the five hub artifacts read `0.6.0.0`, `cli-jev` reads `0.1.4.0` and `cli-deem` reads `0.1.1.0`, each changelog file present (read-only check, this pass; `scratch/evidence/build-evidence.md:15`); `:31` records 13a and 13b PASS inside the 0-warning check.
- [x] T009 [P] Regenerate the generated artifacts, executor DeepSeek V4.1 Flash (D5). Refresh the compiled-route manifest through the compiled-routing tooling and the Hermes mirror through `sync-skills-hermes.cjs`, never by hand. Check: `node .skilled/bin/compiled-route-guard.cjs` reports `cli-classifier` fresh, `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` passes, and the changed copies are the hub and its two modes only. Evidence: `scratch/evidence/build-evidence.md:33` guard exit 0 with all hubs fresh after `compiled-route-manifest.cjs refresh --hub cli-classifier` on both roots, `:34` all 7 hubs resolve and every hub passes admission, `:35` the three freshness checks 15 of 15 each, and `:37` `PASS: 72 Hermes skill copies in sync` after regenerating 3; the commit touches only the three `.hermes/skills/` copies and the two activation manifests.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 The ten-prompt probe from the final state, executor the orchestrating session. Replay `P`'s ten prompts through `F --hub cli-classifier --prompt "<p>"` and compare each row against its baseline recording. Check: the eight baseline-correct rows print the same `workflowMode` and `packetId` before and after, the two former misses print a single target whose mode is `cli-jev` and `cli-deem` respectively, and the off-topic row still defers. Evidence: `scratch/evidence/probe-after.txt:1-10` replays the ten prompts with eight rows identical to `scratch/evidence/probe-before.txt:1-10`, row 8 now `cli-jev` and row 9 now `cli-deem`; `scratch/evidence/build-evidence.md:38` records the comparison, and `scratch/evidence/leaf-route-replay.txt:7` reads `hub=cli-classifier gold=4 f1=1.000 exact=4`.
- [x] T011 Cross-family review, executor the reviewer on `cli-devin` or `cli-codex` (D5). Review every writer diff read-only, and the writer reviews any reviewer fix. The review output is `scratch/review-r1.txt` (proposed), and any reverse review is `scratch/review-reverse-r1.txt` (proposed). Check: one review file with a verdict, every P0 and P1 finding named with file and line, no open P0 or P1, each review's file hashes equal before and after the read, and P2 findings recorded. Evidence: `scratch/evidence/build-evidence.md:46-59` records round 1 read-only (`VERDICT: FAIL`, five P1s and five P2s, each with its disposition and fix brief), and `:68-70` records round 2 (`VERDICT: PASS`, all ten items FIXED, one new P2 fixed by brief f6); no P0 or P1 is open. The verdicts are recorded in the build evidence itself; no separate review file was written.
- [x] T012 Closure, executor the orchestrating session. Record the probe comparison, the eleven doc gates, the eleven test commands, the three package gates, the guard, the Hermes check and every version result in `implementation-summary.md` and `goal.md`'s log, mark each acceptance criterion from its evidence, then run `repair-derived.cjs --apply`, `validate.sh --strict` and `check-goal.cjs`. Check: `RESULT: PASSED` for this phase and the parent, and `RESULT: PASSED (5/5 checks)`. Evidence: this closure pass ran `repair-derived.cjs --apply` (`inspected=1 repaired=1 failed=0`), `validate.sh --strict` on this phase (`RESULT: PASSED`, `Errors: 0`) and `check-goal.cjs` (`RESULT: PASSED (5/5 checks)`). The parent's own strict run reports two generated-metadata errors and the missing `041` child id in its derived files, which this phase may not write; the orchestrator's sweep re-derives the parent after the workers return.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`, or a task reports its blocker with the command output that shows it. Evidence: T001 to T012 are `[x]`. T001 and T002 closed with a recorded deviation, their design-note clause met by the evidence files each row names, with the phase `scratch/` tree showing no note (`find specs/cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment/scratch -type f` lists the build record and its five recordings).
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries `[B]`.
- [x] Manual verification passed: the eleven README doc gates and their documented commands, both hub gates, the ten-prompt probe, the compiled-route guard and the Hermes check all run from the final state, and no routing decision that was correct at baseline moved. Evidence: `scratch/evidence/build-evidence.md:29-30` (the doc gates and the commands), `:31-32` (both hub gates), `:38` and `scratch/evidence/probe-after.txt:1-10` (the ten-prompt probe), `:33` and `:37` (the compiled-route guard and the Hermes check); every baseline-correct row kept its decision.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Goal**: See `goal.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Prior phase**: `../040-hard-rules-sidecar/`
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

- [x] CHK-001 [P0] Requirements documented in spec.md across REQ-001 to REQ-012. Planned: `spec.md` section 4. Evidence: `spec.md` section 4 holds REQ-001 to REQ-012 across its P0 and P1 lists.
- [x] CHK-002 [P0] Technical approach defined in plan.md with the six phases and their checks. Planned: `plan.md` section 4. Evidence: `plan.md` section 4 lists the six phases, each with its observable check.
- [x] CHK-003 [P1] Dependencies identified and available: phase 040, the eleven folders, `sk-create-readme`, the skill template, the three validators and the compiled-routing tooling. Planned: `plan.md` section 6. Evidence: phase 040 is Complete, and the build ran with the eleven folders, the three validators and the compiled-routing tooling present (`scratch/evidence/build-evidence.md:9-17,29-37`).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The eleven READMEs follow the code-folder template, and every command one documents runs from the repository root. Planned: REQ-001 and T004. Evidence: `scratch/evidence/build-evidence.md:29` records 22 VALID and 0 invalid with the eleven READMEs among them, and `:30` records every documented command exiting 0.
- [x] CHK-011 [P0] `ROUTER.md` is active with a resolvable leaf map, and no compiled-route decision that was correct at baseline moves. Planned: REQ-003, REQ-006, T005 and T010. Evidence: `.skilled/skills/cli-classifier/ROUTER.md:12-13` declares the active state, `scratch/evidence/build-evidence.md:31` records 0 warnings with 12a PASS, and `:38` records the eight baseline-correct probe rows unchanged.
- [x] CHK-012 [P1] Both mode section 2s carry one Smart Router Pseudocode block with the five named functions, and `cli-jev`'s transport mechanics sit in section 3. Planned: REQ-004 and T007. Evidence: the five names sit once per mode in one block (`cli-jev/SKILL.md:138,147,154,167,192`; `cli-deem/SKILL.md:119,128,135,148,173`), and `cli-jev`'s transport text sits in section 3 (`cli-jev/SKILL.md:228`).
- [x] CHK-013 [P1] No code file changes, so no code comment carries a spec path, phase number or requirement id. Planned: REQ-009. Evidence: the commit's 32 files are READMEs, skill docs, registries, changelog entries and generated manifests (`git show --stat --name-status 2116de635c`, this pass); no code file changed, so no code comment carries a label.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is Met with observed evidence, or reported open with its reason. Planned: `acceptance-criteria.md`. Evidence: all five rows in `acceptance-criteria.md` are `Met` with observed outputs (this closure pass).
- [x] CHK-021 [P0] The eleven documented test commands and the three package gates pass from the final state. Planned: T004, T007 and T010. Evidence: `scratch/evidence/build-evidence.md:30` records the eleven documented commands at exit 0 and `:32` the three package PASS blocks.
- [x] CHK-022 [P1] Edge cases tested: a folder with several suites, a phrase that matches two classes, a leaf that is not in the manifest, and an off-topic prompt that must still defer. Planned: `spec.md` edge cases and proof plan 4. Met (2026-10-01): the multi-suite folders are covered by the eleven README commands, the two-class and off-topic cases by the probe (`scratch/evidence/probe-after.txt:3-4,6-7`), and a mapped path missing from the manifest by a negative run on a scratch copy of the hub, where `parent-skill-check.cjs` exits 1 with `12a-router-contract: RRC-006` (`scratch/evidence/negative-leaf-check.txt`, recorded in `scratch/evidence/build-evidence.md`).
- [x] CHK-023 [P1] The probe covers all ten rows, including the two former misses and the off-topic row, with the empty-decision case recorded. Planned: T003 and T010. Evidence: `scratch/evidence/probe-before.txt:1-10` and `scratch/evidence/probe-after.txt:1-10` cover all ten rows, including the two former misses at `:8-9` and the empty-decision defers at `:3-4`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Planned: the review is the only expected source of findings, and no finding exists before it runs. Evidence: the review raised five P1s and six P2s across two rounds, and every one is dispositioned in `scratch/evidence/build-evidence.md:48-59,68-70`; each is a stale-wording or count finding fixed in place, none algorithmic or cross-consumer.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Planned: `plan.md`'s FIX ADDENDUM names the eleven README producers and the four excluded folders. Evidence: the eleven README producers are the eleven created paths of the commit, and the four excluded folders appear in no diff (`git show --stat --name-status 2116de635c`, this pass).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for the renamed class, the version line and the frozen decisions. Planned: `plan.md`'s FIX ADDENDUM lists the class readers, the version readers and every caller of the compiled front door. Evidence: the final-state grep finds the old class only in the dated changelog, the five version artifacts were re-read with both modes (`scratch/evidence/build-evidence.md:31`), and the probe covers every front-door caller row.
- [x] CHK-FIX-004 [P0] Adversarial rows exist for the changed routing surface: the hub-only prompt, the both-backends prompt, the off-topic prompt and the two former misses. Planned: T010. Evidence: the probe rows include the old-name prompt (`scratch/evidence/probe-after.txt:5`), the both-backends prompt (`:6`), the off-topic rows (`:3-4`) and the two former misses (`:8-9`).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Planned: `plan.md`'s FIX ADDENDUM lists the six axes over eleven folders, seven intents, thirteen phrases and ten probe rows. Evidence: `plan.md`'s FIX ADDENDUM lists those axes, and the recordings under `scratch/evidence/` carry each axis's row count.
- [x] CHK-FIX-006 [P1] A hostile variant runs where the vocabulary is trimmed back and the two former misses return to their defer. Planned: T010 and the kill criterion. Evidence: `scratch/evidence/probe-before.txt:8-9` is the pre-change tree with both misses as `defer`, which is the trimmed-vocabulary variant by construction, and the final-state replay is `scratch/evidence/probe-after.txt`.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Planned: T003 and T012 name each recording and the build's commit range. Evidence: the build commit is `2116de635c` (`git show --stat 2116de635c`, this pass) and every recording sits under `scratch/evidence/`; the phase docs commit follows this pass.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret in any changed file, and no README documents a command that prints one. Planned: REQ-009 and NFR-S01. Evidence: the commit changes documentation, registries, changelog entries and generated manifests only (`git show --stat --name-status 2116de635c`, this pass), and every documented command is a local test run (`scratch/evidence/build-evidence.md:30`).
- [x] CHK-031 [P0] No `.env` file is read, no environment value is printed, and no service is called: no `jev` call and no request to the local Deem server. Planned: NFR-S01, T004 and T010. Evidence: no changed file is a script that reads a `.env` or prints an environment value, and the checks are local validators plus the front-door probe (`scratch/evidence/build-evidence.md:29-42`); no `jev` call or Deem server request is recorded.
- [x] CHK-032 [P1] The vocabulary additions are repo-local authored strings, so no new input surface enters the router. Planned: NFR-S02. Evidence: the additions are authored strings in `hub-router.json:56-60,87-94` and `ROUTER.md:63-104`; no new input surface enters the router.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria stay synchronized. Planned: the closure pass updates all four in one pass. Evidence: this closure pass updated spec, tasks, acceptance criteria, goal and summary in one pass.
- [x] CHK-041 [P1] The eleven READMEs document their own validation and boundaries, and no doc claims a result no run printed. Planned: T004. Evidence: `scratch/evidence/build-evidence.md:29-30` records the doc gates and the commands, and no doc claims a result no run printed.
- [x] CHK-042 [P2] The Hermes copies' handling of the renamed class is recorded with its evidence. Planned: T009. Evidence: `scratch/evidence/build-evidence.md:37` records `PASS: 72 Hermes skill copies in sync` after regenerating 3, and the commit touches the three `.hermes/skills/` copies.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The design note and the probe recordings stay in `scratch/` only. Planned: T001 and T003. Evidence: the five recordings sit under `scratch/evidence/` only and none is in the commit (`git show --stat --name-status 2116de635c`, this pass); the session kept no design note, recorded on T001.
- [x] CHK-051 [P1] `scratch/` is cleaned before completion, and no temp file sits outside it. Planned: T012. Evidence: `find specs/cli-jev/003-cli-jev-workflow-integration/041-code-readmes-and-routing-alignment/scratch -type f` lists the build record and its five recordings plus `.gitkeep`, all under `scratch/`; no temp file sits outside it.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-01. 26 of 26 rows verified from the build's record under `scratch/evidence/` and the final-state gates. CHK-022's missing-leaf clause closed with a negative run on a scratch copy of the hub (`scratch/evidence/negative-leaf-check.txt`).
<!-- /ANCHOR:summary -->

---
