---
title: "Goal: Phase 7: playbook-catalog-readme-alignment"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "playbook catalog readme alignment goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment"
    last_updated_at: "2026-10-23T15:55:00Z"
    last_updated_by: "author"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "054-weak-model-spec-authoring-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: playbook-catalog-readme-alignment

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Give every behavior phases 2 to 5 create one operator scenario, one catalog entry and an aligned paragraph in each doc that describes it, so a weak model reads the same rule wherever it looks.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The eight new scenarios live in one new category, `manual-testing-playbook/template-authoring/`, with IDs 476 to 483. |
| D2 | The catalog gets four new leaves under `feature-catalog/tooling-and-scripts/`, one per surface, with one root entry each. |
| D3 | This phase verifies the phase 3 edits in `template-guide.md` and `validation-rules.md` and does not write them again. |
| D4 | Scenarios 476, 477 and 478 create a throwaway track under `specs/zz-pb-*` and remove it in the last step. Scenarios 479, 480 and 482 use a `mktemp -d` folder and remove it. Scenario 481 reads `SKILL.md` with no fixture. Scenario 483 creates `specs/zz-pb-card/001-card-authoring` and removes it. |
| D5 | The eight scenario texts, the four catalog texts and every old and new doc string are frozen in `plan.md` before the first dispatch. |
| D6 | Phase 8 runs the scenarios. This phase only proves that each file is well formed and that every command names a path that exists. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/system-spec-kit/manual-testing-playbook --format text` prints `violations=0` and exits 0, and the root index lists each id 476 to 483 exactly once, so a count over the eight ids prints `8`
- [x] `python3 .skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-spec-kit` prints `PASS: 0 violations` (met in the deviation 5 form: the `PACKAGE system-spec-kit: PASS` verdict line with `violations=0` and exit 0, because the same two baseline notes print at the start tree)
- [x] `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py` prints `VALID` for every edited or created document
- [x] `vitest run runtime/cli/tests/playbook-provenance-paths.vitest.ts` prints `Tests  3 passed (3)` and `vitest run runtime/cli/tests/workflow-invariance.vitest.ts` prints `Tests  2 passed (2)`
- [x] The spec-kit suite at close matches `scratch/baseline/suite-start.txt` on the `Test Files`, `Tests` and `exit=` lines
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this phase> --strict` prints `RESULT: PASSED` with `Errors: 0`
- [x] `git status --porcelain` at phase close lists no changed path outside the file table in `spec.md` section 3 and this phase folder
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Phase opened | Done | HEAD `538b8b19cb` on `12522be61c`; X0 precheck passed, status clean outside the phase 001 scratch folder |
| Start commit | `538b8b19cb829c0b2f5c7305db4f07e44af88e60` | `scratch/baseline/start-commit.txt` |
| Suite baseline recorded | Done | Reused the amendment commit's end suite, `004-template-section-fill-guidance/scratch/amend/suite-end.txt`, copied to `scratch/baseline/suite-start.txt`. Last line `exit=0`. No code changed between `12522be61c` and the start commit (the diff holds only phase 006 records) |
| Lane A scenarios written | Done | Eight files copied by script from `plan.md` 3.2 to 3.9, each with five `## ` headings. Scenario 483 amended first (see the amendment section below) |
| Lane B catalog written | Done | Four leaves copied by script from `plan.md` 3.10.1 to 3.10.4, each with four `## ` headings |
| Lane C docs aligned | Done | 14 old and new pairs applied as exact single-occurrence replacements, and `template-guide.md` verified with `PLACEHOLDER]` count 0 |
| Playbook index updated | Done | Category bullet and section 7.9; ids 476 to 483 once each, `template-authoring/` count 9 |
| Catalog index updated | Done | Four root blocks C1 to C4; four headings once each, four leaf links |
| Package validators green | Done | Playbook `PASS ... scenarios=110 categories=11 operator=96 violations=0 warnings=1` exit 0. Catalog `PACKAGE system-spec-kit: PASS tier=fail violations=0` exit 0 with the same two notes as the start tree |
| Frontier review done | Done | cli-devin swe-2-max, read-only, fourth attempt returned 28 lines (0 P0, 0 P1, 28 P2). All 28 recorded in the T016 block below |
| Phase closeable | Done | Strict validation `RESULT: PASSED`; all twelve acceptance rows Met |
| Next phase ready | Done | Phase 008 can start from this phase's commit: the playbook validator is green and the eight scenario paths exist under `manual-testing-playbook/template-authoring/` |

### Deviations and findings

| Item | Note |
|------|------|
| Reference overlap with phase 3 | Phase 3 replaces five `PLACEHOLDER` lines in `template-guide.md` and inserts the lifecycle section in `validation-rules.md`. This phase verifies both and writes only the summary rows phase 3 leaves. |
| Placeholder scan false positive | `spec/check-placeholders.sh` reports the value token examples inside fenced code blocks in `plan.md` and `tasks.md`. A fenced block is not an unfilled placeholder, so the docs keep the literal commands and this entry records the scan result. |
| Changelog line left as shared template text | The `spec.md` Changelog line names `../changelog/` and phase 9 writes the packet changelog. |
| decision-record.md line left as shared template text | The acceptance criteria waiver line names `decision-record.md`, and the ADRs live in `plan.md` L3. The line is shared template text in every phase. |
| Generated metadata refresh | A spec-doc edit changes the hashed source docs, so `repair-derived.cjs --apply` re-derives `graph-metadata.json` after the last doc write. No file other than `graph-metadata.json` changed in that repair. |
| Executors on 2026-10-24 (supersedes the OpenCode and Task-tool wording) | The conductor decided that the worker is the phase agent itself. Every frozen block (scenarios, leaves, edits, index rows) was copied by script from `plan.md` and `tasks.md`, never retyped, and old and new pairs were applied as exact single-occurrence replacements (`scratch/frozen/edits-applied.json`). The OpenCode, DeepSeek, Task-tool and cli-codex wording in `plan.md` and `tasks.md` is history and is not rewritten, except inside scenario 483. The only external dispatch is the T015 review on cli-devin swe-2-max |
| T001 precheck on 2026-10-24 | The `opencode.json` check is stale. It was replaced by `command -v devin` (printed `devin`) and `devin auth status` (printed `Logged in (via Devin)`). The three predecessor artifacts printed `drift-guard-present`, `card-guard-present` and `card-present`. Output in `scratch/baseline/t001.txt` |
| Suite baseline reuse (T002) | The amendment commit's end suite was reused as the start suite. The diff from `12522be61c` to the start commit holds only phase 006 record files, so the code is the same. `scratch/baseline/suite-start.txt` ends `exit=0` with `Test Files  276 passed \| 3 skipped (279)` and `Tests  4162 passed \| 21 skipped (4183)` |
| T010 verify form (deviation 5) | `validate_catalog_package.py` prints `PASS: 0 violations` only with an empty violation list. Two `note` entries, `ignored_path_absent` in `session-relaunch-loop.md:95` and `spec-validation-rule-engine.md:29`, sit in files this phase does not own and print at the start tree too. The verify was accepted as the `PACKAGE system-spec-kit: PASS tier=fail violations=0` verdict line with exit 0 and the same two notes. `scratch/baseline/catalog-start.txt` and `scratch/validation/catalog.txt` are identical, `exit=0` line included (`diff` prints nothing), and an earlier compare printed `CATALOG_NOTES_SAME`. AC-003, AC-004 and CHK-022 carry the same form |
| Start and end counts | Playbook validator `scenarios=102 categories=10 operator=88` became `scenarios=110 categories=11 operator=96`. `playbook_md` 104 became 112, `catalog_leaf_md` 58 became 62, `README.md` lines 696 became 700, `templates/README.md` lines 225 became 236. Every start value equals the runbook value |
| Frozen text and the commit hook | The commit hook bumps `version:` lines in touched docs, so shipped files were compared with the frozen blocks with `version:` lines excluded. The 12 new files matched the frozen text before the commit |
| README references count | `README.md` line 449 says `references/ (41 files)`. Phase 5 added the card, so `find references -type f` now prints 42. No frozen edit covers it and this phase did not touch it. Finding for the operator |
| Conductor fix after the review | The conductor commit "docs(system-spec-kit): correct the README reference count and draft rule" fixed the `README.md` references count (`41 files` became `42 files`) and the line 538 advice, which now says a Draft packet stamped v2.3 or later may warn and still pass strict and any other packet fails on an unfilled token (review finding `README.md:538` in `scratch/review/T015.txt`). The other three forwarded P2s are handed to phase 008: the tool lists of scenarios 479 and 482 lack `awk` and `rg`, and scenario 483 leaves its pointer file in this phase's `scratch/verify/` |
| Record fixes after the second amendment (2026-10-24) | A read-only verifier found five record defects after `9a0b4a935e`. (1) The Known Limitations items for the `README.md` line 538 rule and the `references/ (41 files)` count in `implementation-summary.md`, and the matching changelog Follow-Ups, now say `fixed by 9a0b4a935e` and keep their history. (2) The claim of 84 path and link references had no committed evidence. `scratch/validation/check-paths.py` now checks the 12 new files under `.skilled` and `scratch/validation/paths.txt` prints `refs 73 resolved 72 unresolved 1`. The one left is the output file scenario 483 writes when it runs, so both records say 72 of 73. (3) `scratch/review/T015.attempts.log` is excluded by `.gitignore` (`*.log`), so it was copied to `scratch/review/T015.attempts.txt` and the citation repointed. (4) The catalog start and end outputs are identical, not different on the exit line, and the wording was corrected. (5) The generated changelog line `Tasks complete - 67 completed task item(s)` was kept at 67. The verifier's count of 68 matches the status-legend row at `tasks.md:24` as well as the 67 checked task and checklist rows. `grep -cE '^\s*-\s*\[[xX]\]' tasks.md` prints 67, so 68 would be false. |
| Suite at close (T014) | A fresh run with `SPECKIT_TEST_RUN_TIMEOUT_MS=1800000` took 2283 seconds and ended `exit=0` with `Test Files  276 passed \| 3 skipped (279)`, `Tests  4162 passed \| 21 skipped (4183)`, then `184 passed \| 3 skipped (187)` and `2085 passed \| 20 skipped (2105)`. The start and end summary lines are identical (`SUITE_SAME`) and the exit line matches phase 001 (`PHASE1_EXIT_SAME`). The phase 001 delta is the test count growth of phases 2 to 6 (`scratch/baseline/suite-delta-phase1.txt`). The `authorized-ledger` lock flake did not occur |
| Review dispatch (T015) | Four cli-devin swe-2-max attempts under `--permission-mode auto`. Attempts 1 to 3 ended with no result line because the reviewer tried a tool call that auto mode refused (`rejected a tool call that requires confirmation` in the err file). Attempt 4 used a brief that lists the files to read and no others, with numbered copies of the scripts and tests under `scratch/review/sources/`, and returned 28 lines. The working tree was unchanged by the reviewer. Log in `scratch/review/T015.attempts.txt` |
| Packet changelog | `nested-changelog.js --write` ran after validation. The generator copies raw task text, so its Added, Changed and Fixed sections were rewritten by hand from the implementation summary |

### Scenario 483 amendment (before 483 was copied)

The frozen block in `plan.md` section 3.9 named a DeepSeek worker through an OpenCode Task subagent. The cli-pi DeepSeek route returned a 402 daily billing limit on 2026-10-24 (`004-template-section-fill-guidance/scratch/amend/B.err`), and phase 005 already ran this exact Level 1 task on swe-2-max three times cleanly. The worker became cli-devin swe-2-max, the parent D8 benchmark subject. `plan.md` was amended first and then copied. The headings, the ID 483 and the rest of the frozen text are unchanged. The step 3 text now says to describe the `--quiet` flag and not to add it, the brief bans edits outside `specs/zz-pb-card/`, and a free-tier rate-limit reply is a retry and not a FAIL. Each change below is a fragment, before then after. The full strings are in `scratch/baseline/amend-483.json`, and the unamended plan is `scratch/baseline/plan.before-483.md`.

1. Before: `This scenario validates that a DeepSeek worker can scaffold`
   After: `This scenario validates that a cli-devin swe-2-max worker can scaffold`
2. Before: `It dispatches one DeepSeek worker with the card`
   After: `It dispatches one cli-devin swe-2-max worker with the card`
3. Before: `Prove that a DeepSeek worker writes a Level 1 packet`
   After: `Prove that a cli-devin swe-2-max worker writes a Level 1 packet`
4. Before: `an interactive OpenCode v2 session whose opencode.json names llmgateway/deepseek-v4.1-flash-1017, and phase 5 closed so the card exists. The scenario needs network ac ...`
   After: `the devin CLI on PATH with devin auth status printing Logged in, the operator's approval for --permission-mode dangerous on this run, and phase 5 closed so the ca ...`
5. Before: `dispatch the subagent with the Task tool, validate`
   After: `dispatch the worker with cli-devin, validate`
6. Before: `- Expected signals: The subagent returns a final reply. The packet`
   After: `- Expected signals: The worker returns a final reply and devin exits 0. The packet`
7. Before: `- Pass/fail: PASS if the subagent returns a reply,`
   After: `- Pass/fail: PASS if the worker returns a reply,`
8. Before: `Run steps 1, 3 and 4 from the checkout root in one shell session. Step 1 writes the scratch path to a fixed file, so step 3 recovers it after the Task call. Step 2 uses t ...`
   After: `Run steps 1 to 4 from the checkout root. Step 1 writes the scratch path to a fixed file, so each later step recovers it. Step 2 runs the devin CLI. This scenario spends ...`
9. Before: `You are a dispatched Task subagent. This repository's AGENTS.md treats a dispatched worker as pre-resolved for the spec-folder question, and this prompt is that pre-resol ...`
   After: `You are a non-interactive dispatched worker. AI_SESSION_CHILD=1 and / SYSTEM_SPEC_GATE_ENFORCE=0 are set in your environment, which this repository's AGENTS.md / defines ...`
10. Before: `and any edit outside specs/zz-pb-card/. / `
   After: `and any edit outside specs/zz-pb-card/. Do not edit recommend-level.sh. Do not edit anything under .skilled/. / `
11. Before: `3. Fill spec.md, plan.md, tasks.md and implementation-summary.md for this feature: add a --quiet flag to .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level. ...`
   After: `3. Fill spec.md, plan.md, tasks.md and implementation-summary.md. Describe this feature in the packet and do not build it: a --quiet flag for .skilled/skills/system-spec- ...`
12. Before: `2. Dispatch one worker with the Task tool. /  / text / Dispatch with the Task tool: subagent_type general, description 483, prompt = the full text of the brief wri ...`
   After: `2. Dispatch one worker with cli-devin. /  / bash / OUT="$(cat specs/system-speckit/054-weak-model-spec-authoring/007-playbook-catalog-readme-alignment/scratch/verify/s ...`
13. Before: `Step 2 leaves the reply file in the scratch path holding the worker's last RESULT line.`
   After: `Step 2 prints devin_exit=0, then the worker's last RESULT line, and leaves the reply file in the scratch path.`
14. Before: `- **Pass**: The subagent returns a reply,`
   After: `- **Pass**: The worker returns a reply,`
15. Before: `- **Fail**: The subagent returns no reply,`
   After: `- **Fail**: The worker returns no reply,`
16. Before: `so read $OUT/reply.txt and check that the session model is llmgateway/deepseek-v4.1-flash-1017 before retrying.`
   After: `so read $OUT/reply.txt and $OUT/reply.err and check that devin auth status prints Logged in before retrying. A free-tier rate-limit reply is a retry and not a FAI ...`
17. Before: `Provenance: manual only - Task tool subagent on llmgateway/deepseek-v4.1-flash-1017#max`
   After: `Provenance: manual only - cli-devin swe-2-max, permission mode dangerous`
18. Before: `\| A DeepSeek worker writes a Level 1 packet from the card alone \|`
   After: `\| A cli-devin swe-2-max worker writes a Level 1 packet from the card alone \|`

### T016 review outcomes

The reviewer returned 28 P2 lines and no P0 or P1 line. Each quoted fragment was found in the named file. The brief fixes only P0 and P1 findings, and the scenario and leaf text is frozen, so every P2 is recorded and not applied. Twenty-four are serial commas in frozen prose (voice style, no behavior change). Four are substantive and are handed to phase 8 and the operator: the `README.md` line 538 advice drops the v2.3 stamp condition, scenarios 479 and 482 list their tools without `awk` and `rg` (both appear in the scripts), and scenario 483 stores its pointer file under this phase's `scratch/verify/` and never removes it.

```text
T016-RECORDED .skilled/skills/system-spec-kit/README.md:64 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/README.md:538 real but P2, README advice drops the v2.3 condition, forwarded to the operator
T016-RECORDED .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:690 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/template-section-fill-guidance.md:28 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/example-drift-guard.md:30 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/feature-catalog/tooling-and-scripts/spec-authoring-card.md:38 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md:28 real but P2, preconditions list lacks awk and rg, forwarded to phase 8
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md:30 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/authoring-card-sync-guard.md:100 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md:28 real but P2, preconditions list lacks awk and rg, forwarded to phase 8
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md:97 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md:87 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/golden-render-all-levels.md:88 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-warning-while-draft.md:22 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-warning-while-draft.md:86 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-warning-while-draft.md:87 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md:12 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md:22 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md:93 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md:94 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-gate-legacy-stamp-unchanged.md:22 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-gate-legacy-stamp-unchanged.md:96 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-gate-legacy-stamp-unchanged.md:97 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:24 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:28 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:112 real but P2, scenario 483 pointer path stays in this phase scratch folder, forwarded to phase 8
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:118 frozen prose, serial comma is style only, deferred
T016-RECORDED .skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/level-1-packet-authored-from-card.md:130 frozen prose, serial comma is style only, deferred
```

<!-- /ANCHOR:log -->
