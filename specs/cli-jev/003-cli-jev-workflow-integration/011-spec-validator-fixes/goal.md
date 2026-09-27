---
title: "Goal: Phase 11: spec-validator-fixes"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "spec validator fixes goal"
  - "ac coverage unresolved citation criteria"
  - "check-goal goal.md path criteria"
  - "spec validator owner decision"
  - "create.sh phase label criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes"
    last_updated_at: "2026-09-27T12:20:00Z"
    last_updated_by: "opus-5.5-high-leaf"
    recent_action: "Amended the directive with the create.sh phase-label fix"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-workflow-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Does the system-spec-kit owner want option A, B or C for counting unresolved citations"
      - "Does the system-spec-kit owner want option A, B or C for detecting a phase label that disagrees with its folder number"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 11: spec-validator-fixes

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `AC_COVERAGE` report each cited `file:line` that names no readable file or a line outside it, make `check-goal.cjs` accept a path ending in `goal.md` and make `create.sh --phase --parent` label each child it adds with its folder's number, without changing any of the three tools' pass, fail, exit or labeling behavior for any other input.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Report only. An unresolved citation adds one `Unresolved evidence citation(s):` detail and still counts as coverage. The floor, `SPECKIT_AC_COVERAGE_CUTOFF`, the enforce switch, the advisory default and the covered count stay unchanged until the `system-spec-kit` owner picks option B or C |
| D2 | A cited path resolves as an absolute path, else in the packet folder, else in the repository root from `git -C <folder> rev-parse --show-toplevel` with the working directory as fallback. It must name a readable file and a line from 1 to that file's line count |
| D3 | `check-goal.cjs` changes only in `main()`. The exported functions, the four checks and the exit codes 0, 1 and 2 stay as they are |
| D4 | Each fix follows its owner's contract: `system-spec-kit` for `check-ac-coverage.sh`, `create.sh` and `validation-rules.md`, `sk-create-goal` for `check-goal.cjs` and its `scripts/README.md`. Code comments carry no spec path, phase number or REQ or task id |
| D5 | `create.sh` reads each appended child's phase number from its folder's `NNN` prefix, base 10, for the three labels only. Detecting a label that disagrees with its folder number, in `validate.sh` or `repair-derived.cjs`, waits for the `system-spec-kit` owner |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` ends `0 failed` with more than 25 passed, including cases where a missing file and a line past the end each put their AC id in an `Unresolved evidence citation(s):` detail
- [ ] The 25 `expect`, `expect_source` and `expect_status` calls that existed on 2026-09-27 in `tests/check-ac-coverage.sh` pass with no edit, and `git diff` on `check-ac-coverage.sh` changes no line that increments `covered`
- [ ] `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint/goal.md` exits 0 and prints `RESULT: PASSED (4/4 checks)`, and the same command on that folder's `spec.md` exits 2 with `packet path is not a directory`
- [ ] `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` reports `fail 0` with more than 15 passing
- [ ] `rg -n 'nresolved' .skilled/skills/system-spec-kit/references/validation/validation-rules.md` and `rg -n 'goal.md' .skilled/skills/sk-doc/sk-create-goal/scripts/README.md` each return the new line
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` ends `0 failed` with more than 10 passed, including a case where children appended after `001-foundation` carry "Phase 2" and "Phase 3" in `description.json`, `graph-metadata.json` and the `spec.md` title
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
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
| Planning documents | Done | `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md` and this goal authored from the orchestrator brief's `011-spec-validator-fixes` section and 007 `research.md` section 6 (line 466), question 48 (line 1171) and ledger row 97 (line 1468) |
| Citations reopened | Done | `check-ac-coverage.sh:291`, `:327` and `:346` hold the shape test and its uses. `check-goal.cjs:681-689` is the exports block, `:693` sets the exit code from `main()` and `:697` sets exit 2 on a thrown error. `check-goal.cjs:89-92` throws `packet path is not a directory` |
| Baseline | Done | 2026-09-27: `tests/check-ac-coverage.sh` printed `25 passed, 0 failed`. `node --test .../sk-create-goal/scripts/tests/` printed `tests 15`, `pass 15`, `fail 0`. `check-goal.cjs .../006-goal-criteria-lint/goal.md` exited 2 with `packet path is not a directory`, and the folder exited 0 with `RESULT: PASSED (4/4 checks)` |
| Corpus scan | Done | Read-only scan of 374 `acceptance-criteria.md` files outside `z_archive`: 2,395 rows, 787 with a citation shape, 1,112 citations, 657 resolve, 455 name no file, 0 out of range. 56 of the 97 packets at or above the 0.9 floor would fall under it if unresolved citations stopped counting |
| Owner history | Done | `git log -5` on 2026-09-27: `check-ac-coverage.sh` and its test last changed in `ec33385ae5e` (2026-09-17, source-root move). `validation-rules.md` last in `ab725ca7ae2` (2026-09-25). `check-goal.cjs` and its test last in `062ac6e4f5` (2026-09-26), `scripts/README.md` the same. `git status --short` on all six files was empty, so nothing is in flight |
| Build | Pending | Nothing is built. The phase is Planned |
| create.sh label amendment | Done | 2026-09-27: added REQ-009 to REQ-011, AC-009 to AC-011, D5 and criterion 6 at the coordinator's request, from the orchestrator's observation while adding phases 010 to 017. Reopened `create.sh:1489`, `:1511` and `:1523`, which build labels from `_i`, and `:1236`, `:1252` and `:1541`, which already use `_phase_number`. Baseline `test-phase-system.sh`: `10 passed, 0 failed (of 10)`. `create.sh` last changed in `e7a347928b` (2026-09-24) with no uncommitted change, and no sibling phase names it. Scan: 14 of 27 `Phase N:` labels in 2,183 `description.json` files disagree with their folder |
| Folder label | Done | 2026-09-27: `description.json` changed from "Phase 2: spec-validator-fixes" to "Phase 11: spec-validator-fixes", the form siblings 013 and 016 use |

### Deviations and findings

| Item | Note |
|------|------|
| Scaffold title | The scaffold titled every document "Phase 2". This is Phase 11 of 17, as the titles and `spec.md` metadata now say |
| Report only instead of an uncounted citation | The brief asks for a resolution rule and how an unresolved citation is reported. Counting it as uncovered would drop 56 of 97 at-floor packets under the floor, many of them citing skill-relative paths such as `runtime/cli/rules/check-ac-coverage.sh:381`. That keeps 015's floor and cutoff outcomes intact, and the counting choice is recorded as an owner decision in `spec.md` section 10 |
| Collision with phase 006 | 006 plans `git diff --quiet -- .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs` after its build and copies parser lines `:135-144`, `:162-201` and `:207-212`. This build edits `main()` only, below those lines. The orchestrator picks the order: commit 011 first, or run 006's check before 011 starts |
| Shape test limit | `has_file_line()` does not match a range such as `file:12-20`, because `-` is not in its trailing character class. Left alone: changing the shape test changes the covered count |
| README mismatch | `sk-create-goal/scripts/README.md` section 5 says `--all` exits 2 when any goal has a finding. `check-goal.cjs:666` exits 2 only on read errors. Out of scope here, reported for the sk-create-goal owner |
| Criteria in the objective | The objective is one sentence, as phase 006 does. The criteria reach the operator verbatim through the chat slice, which carries this criteria section |
<!-- /ANCHOR:log -->
