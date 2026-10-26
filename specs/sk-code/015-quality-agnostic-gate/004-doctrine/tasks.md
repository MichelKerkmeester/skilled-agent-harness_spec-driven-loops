---
title: "Tasks: Phase 4: doctrine"
description: "Ordered tasks for the sk-code doctrine amendment, each naming its file and a verify command with its expected output."
trigger_phrases:
  - "phase 4 doctrine tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 4: doctrine

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

Every path and command runs from the repository root. Paths are written in full, so each verify command runs as written.

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Recheck every design line this phase repeats, after the earlier phases land. Read only. Files: `.skilled/skills/sk-code/shared/references/phase-detection.md`, `.skilled/skills/sk-code/shared/references/stack-detection.md`, `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`, `.skilled/skills/sk-code/shared/references/workflow-verify.md`, `.skilled/skills/sk-code/shared/references/workflow-implement.md`, `.skilled/skills/sk-code/shared/references/workflow-debug.md`, `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md`, the three files in `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/`, `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` and `.skilled/skills/sk-code/sk-code-quality/SKILL.md`. Record any moved line in the packet log. Verify: `rg -n "No claim about an unsupported surface" .skilled/skills/sk-code/shared/references/phase-detection.md` prints one line starting `109:`. Evidence 2026-10-26: `rg -n "No claim about an unsupported surface" .skilled/skills/sk-code/shared/references/phase-detection.md` printed one line starting `109:`, exit 0. `git show HEAD:<file> | sed -n '<line>p'` matched every other cited line in the shared references, the three checklists, the style guide and the SKILLED checklist. Two lines in `sk-code-quality/SKILL.md` had moved, because phase 002 rewrote that file: the P0 table opens at line 224 with its pointer sentence on line 222, not lines 190 to 196, and ESCALATE IF item 1 sits on line 291, not 254. Both moves are recorded in the goal.md log.
- [x] T002 Confirm the earlier phases landed. Read only. Files: `.skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` (phase 002), `.skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` (phase 002) and `.skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` (phase 003). Verify: `ls .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md .skilled/skills/sk-code/sk-code-quality/assets/quality-config.template.json` names all three paths with no error. Evidence 2026-10-26: `ls` named `quality-gate.cjs` and `runner-contract.md` and printed `No such file or directory` for `quality-config.template.json`, exit 1. Deviation: phase 003 builds in another worktree and is not on main, so under the coordinator's ruling this phase takes the names `.sk-code/quality.json`, `quality-gate.cjs` and `/doctor:sk-code quality` from phase 003's `spec.md` as written and does not wait for its code. Phases 001 and 002 are on main, confirmed by the two files that exist and by their implementation summaries.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Shared doctrine

- [x] T003 [P] Amend Iron Law 3 at line 109 of `.skilled/skills/sk-code/shared/references/phase-detection.md` to the ADR-001 text. It names the universal floor, the runner's built-in checks and `.sk-code/quality.json`. Verify: `rg -n "An UNKNOWN surface gets the universal floor" .skilled/skills/sk-code/shared/references/phase-detection.md` prints one line starting `109:`. Evidence 2026-10-26: the Verify printed one line, `109:`, whose text opens `3. **No claim about an unsupported surface.** An UNKNOWN surface gets the universal floor` and ends `No other standard and no discovered command applies.`, exit 0.
- [x] T004 [P] Amend the UNKNOWN row at line 32 and order step 4 at line 49 of `.skilled/skills/sk-code/shared/references/stack-detection.md` to the same rule. Verify: `rg -n "built-in checks" .skilled/skills/sk-code/shared/references/stack-detection.md` prints two lines, starting `32:` and `49:`. Evidence 2026-10-26: the Verify printed two lines, starting `32:` and `49:`, exit 0.
- [x] T005 Amend the UNKNOWN row at line 122 of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`, so it names the universal floor and the built-in checks. Amend the restraint citation at line 57 to cite the repository's `AGENTS.md` and `.skilled/repo-rules/` when present. Verify: `rg -n "The universal floor in sections 3 to 5" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line starting `144:` (authored as `122:`, amended by ADR-005), and `rg -n "Restraint Signals table in the repository" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line starting `57:`. Evidence 2026-10-26: run before T006, the first Verify printed one line starting `122:` and the second one line starting `57:`, both exit 0. After T006 to T008 added 22 lines above it, the UNKNOWN row lands on line 144, so the final-tree check reads `144:` (ADR-005). The restraint line stays on `57:`.
- [x] T006 Add to `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` the review-severity sentence under section 2, and the universal floor definition at the top of section 3. The floor is sections 3 to 5, and every surface gets it, UNKNOWN included. Verify: `rg -n "universal floor is sections 3 to 5|Review keeps its ids" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints two lines. Evidence 2026-10-26: the Verify printed two lines, `73:` (Review keeps its ids) and `79:` (the floor definition), exit 0.
- [x] T007 Add `### Mechanical Floor (every surface)` at the top of section 3 of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`, as a table with three rows: parse failure, merge-conflict markers and credential signature. The parse row marks a plain JavaScript finding as heuristic and states that it does not block. Verify: `rg -n "^### Mechanical Floor" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line, and `rg -n "heuristic and does not block" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line. Evidence 2026-10-26: `rg -n "^### Mechanical Floor"` printed one line, `81:`, and `rg -n "heuristic and does not block"` printed one line, `87:`, each exit 0.
- [x] T008 Convert the rule lists of sections 3 (P0), 4 (P1) and 5 (P2) of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` into tables. Each table keeps every rule's wording, and each table gets a `Review severity` column that carries the ADR-003 default. Verify: `rg -c "Review severity" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints `4`. Evidence 2026-10-26: the Verify printed `4`, exit 0: the mechanical floor table and the three rule tables each carry the column, and every rule keeps its wording.
- [x] T009 Replace workflow step 2 at lines 131 to 140 of `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`. It runs `quality-gate.cjs` on the changed files, and the comment-hygiene check stays as one of its sensors. Verify: `rg -n "quality-gate.cjs" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` prints one line, `155:` (authored as a line from 131 to 140, amended by ADR-005). Evidence 2026-10-26: the Verify printed one line, `155:`, exit 0. The authored range 131 to 140 was the step's place before T006 to T008 added 22 lines above it. Step 2 now spans lines 153 to 155, so the check reads `155:` (ADR-005).

### Checklists and style

- [x] T010 [P] Retitle `.skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` as the SKILLED house checklist. Change the title and description at lines 2 and 3, the first two trigger phrases at lines 5 and 6, the heading at line 14 and the intro at line 16. The intro names the SKILLED condition. Verify: `rg -n "^# SKILLED House Code Quality Checklist" .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints `14:`, and `rg -n "apply to all code files" .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md` prints no line. Evidence 2026-10-26: the first Verify printed `14:# SKILLED House Code Quality Checklist` and the second printed no line (exit 1). Deviation: lines 24 and 28 of the Purpose and Usage text also said the checklist applies across all languages and to every code change, so both now say SKILLED, to keep the file from contradicting its own title.
- [x] T011 [P] Replace the operator-private skill id with "an operator-private Webflow surface skill" in `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` at lines 37 and 57, and in `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md` at line 40. Verify: `rg -l "local-" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/` prints nothing, and `rg -c "operator-private Webflow surface skill" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` prints `2`. Evidence 2026-10-26: `rg -l "local-"` printed nothing (exit 1), and `rg -c "operator-private Webflow surface skill"` on the naming file printed `2`.
- [x] T012 [P] Move CHK-CSS-09 at line 65 of `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` from P0 to P2. Its neighbours CHK-CSS-10 and CHK-CSS-11 stay at P1. Verify: `rg -n "CHK-CSS-09" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md` prints one line starting `65:` that holds the P2 tag. Evidence 2026-10-26: the Verify printed one line starting `65:` that holds the P2 tag, exit 0. Deviation: two rows in the verification template still read CHK-CSS-09 as P0, the CSS summary counts at line 72 and the CSS pass criteria at line 102, so both now follow the P2 tier.
- [x] T013 [P] Replace `Gate Result: [PASS/BLOCKED]` at lines 53 and 76 of `.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` with the runner gate values `NO_BLOCKER_FOUND`, `BLOCKED`, `NOTHING_CHECKED`, `UNVERIFIED` and `ERROR`. Verify: `rg -n "Gate Result" .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md` prints lines starting `53:` and `76:`, and each names `NO_BLOCKER_FOUND`. Evidence 2026-10-26: the Verify printed exactly two lines, `53:` and `76:`, each naming `NO_BLOCKER_FOUND`, exit 0. Line 32 also states that the result line copies the runner's gate and that no value means pass.
- [x] T014 [P] Replace the two lines that name this user's projects in `.skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` at lines 40 and 105 with neutral pointers to the repository's `AGENTS.md`, when present. Verify: `rg -n -F "this user's projects" .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints no line, `rg -n -F "project CLAUDE.md" .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints no line, and `rg -n "when present" .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints lines starting `40:` and `105:`. Evidence 2026-10-26: the two `-F` greps printed no line (exit 1 each), and `rg -n "when present"` printed lines starting `40:` and `105:`, exit 0. The line 105 heading also lost its em dash.
- [x] T015 Add one sentence above the P0 table at lines 190 to 196 of `.skilled/skills/sk-code/sk-code-quality/SKILL.md`. It links to standards section 3 at `../shared/references/universal/code-quality-standards.md`, and it says the tier rules and the P0 categories live there. In the same file, replace ESCALATE IF item 1, "Surface detection is ambiguous after reading `../shared/references/stack-detection.md`", with "A required P0 check is UNVERIFIED and only the operator can name or install its tool", because the amended Iron Law 3 no longer blocks an UNKNOWN surface. Verify: `rg -n -F 'Surface detection is ambiguous' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints no line, and `rg -n "tier rules and the P0 categories" .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints one line starting `222:` (authored as `192:`, amended by ADR-005). Evidence 2026-10-26: `rg -n -F 'Surface detection is ambiguous'` printed no line (exit 1), and `rg -n "tier rules and the P0 categories"` printed one line starting `222:`, exit 0. Deviation: phase 002 had already put a one-sentence pointer to section 3 on line 222, above the table that now opens at line 224, so this task replaced that sentence instead of adding a second one, and the check reads `222:` (ADR-005).

### Handoffs

- [x] T016 [P] Name the runner in the handoff lines of `.skilled/skills/sk-code/shared/references/workflow-implement.md` at lines 41 and 119, and of `.skilled/skills/sk-code/shared/references/workflow-debug.md` at lines 41 and 147. Each line says the `sk-code-quality` mode runs `quality-gate.cjs` first. Verify: `rg -n "quality-gate.cjs" .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/shared/references/workflow-debug.md` prints four lines, starting `41:` and `119:` for the implement file, and `41:` and `147:` for the debug file. Evidence 2026-10-26: the Verify printed four lines, `41:` and `119:` in the implement file and `41:` and `147:` in the debug file, exit 0.
- [x] T017 Amend `.skilled/skills/sk-code/shared/references/workflow-verify.md`. Line 55 states that the quality config names quality checks only, so it never supplies the verification command set. Line 56 reads the runner's `gate`, `checker_outputs` and `unverified` fields, and any field that still reads `PENDING_AGENT_JUDGMENT`. It hands back to quality only on `BLOCKED`, `ERROR` or a field still reading `PENDING_AGENT_JUDGMENT`, handles `UNVERIFIED` and `NOTHING_CHECKED` itself, and it names the three readers of the run verdict: this step, the @code RETURN `Quality Gate` field and `sk-code-review` as input evidence. Line 47 keeps its wording, and line 55 keeps "before claiming anything", so phase 005 can confirm both lines unchanged in meaning. This phase is the only one that edits `workflow-verify.md` (ADR-004). Verify: `rg -n "never supplies" .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line starting `55:`, and `rg -n "checker_outputs" .skilled/skills/sk-code/shared/references/workflow-verify.md` prints one line starting `56:`. Evidence 2026-10-26: `rg -n "never supplies"` printed one line starting `55:` and `rg -n "checker_outputs"` one line starting `56:`, each exit 0. Line 47 is unchanged, and line 55 keeps "before claiming anything".

### Versions and changelogs

- [x] T018 Bump the frontmatter `version` in eleven files: `phase-detection.md`, `stack-detection.md`, `code-quality-standards.md`, `workflow-verify.md`, `workflow-implement.md`, `workflow-debug.md` and `universal-checklist.md`, all under `.skilled/skills/sk-code/`, then `naming-init-formatting-and-css.md`, `overview-header-and-comments.md`, `verification-quick-reference-and-related.md` and `code-style-guide.md`, all under `.skilled/skills/sk-code/sk-code-quality/`. Each moves one patch step above its value at T001. Verify: `rg -n "^version:" .skilled/skills/sk-code/shared/references/phase-detection.md .skilled/skills/sk-code/shared/references/stack-detection.md .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md .skilled/skills/sk-code/shared/references/workflow-verify.md .skilled/skills/sk-code/shared/references/workflow-implement.md .skilled/skills/sk-code/shared/references/workflow-debug.md .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/naming-init-formatting-and-css.md .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/verification-quick-reference-and-related.md .skilled/skills/sk-code/sk-code-quality/references/code-style-guide.md` prints a version above its T001 value for each of the eleven files. Evidence 2026-10-26: the Verify printed one version per file, each one patch step above HEAD: phase-detection 1.5.5.0, stack-detection 2.2.8.0, code-quality-standards 1.5.5.0, workflow-verify 2.2.2.0, workflow-implement 2.1.4.0, workflow-debug 1.1.2.0, universal-checklist 1.0.3.0, naming-init-formatting-and-css 1.5.3.0, overview-header-and-comments 1.5.4.0, verification-quick-reference-and-related 1.5.3.0 and code-style-guide 2.2.5.0.
- [x] T019 Bump the package versions and write their changelogs. Files: `.skilled/skills/sk-code/SKILL.md` line 5, `.skilled/skills/sk-code/hub-router.json` line 3, `.skilled/skills/sk-code/mode-registry.json` line 3 and `.skilled/skills/sk-code/description.json` line 4, each from its value at T001, which is 3.3.0.0 once phases 001 to 003 land, so one patch step gives 3.3.1.0. Then `.skilled/skills/sk-code/sk-code-quality/SKILL.md` line 5, from its value at T001 (1.7.0.0 once phases 001 to 003 land), and `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` line 5, from 2.0.1.0 to 2.0.2.0. Each package that changed gets one new real file in its own `changelog/` folder, named for its new version. Symlinks are not allowed. Verify: `rg -n "^version:" .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/sk-code-quality/SKILL.md .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints three values, each above its starting value, and `rg -n "\"version\"" .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/description.json` prints the same new hub value in each file. Evidence 2026-10-26: the first Verify printed `3.4.0.0`, `1.8.0.0` and `2.1.0.0`, and the second printed `"version": "3.4.0.0"` in each of the three JSON files. New real files: `changelog/v3.4.0.0.md`, `sk-code-quality/changelog/v1.8.0.0.md` and `sk-code-skilled/changelog/v2.1.0.0.md`. Deviation: the coordinator pre-assigned the versions so this phase and phase 003 do not collide. The hub moves from 3.2.0.0 to 3.4.0.0 and sk-code-quality from 1.6.0.0 to 1.8.0.0, because phase 003 takes 3.3.0.0 and 1.7.0.0, and sk-code-skilled moves to its next minor, 2.1.0.0, because phase 002 already used 2.0.2.0. The hub `README.md` newest-entry row now names `v3.4.0.0.md`, with its edition raised to 2.2.24.0, and the three Hermes copies were regenerated by `sync-skills-hermes.cjs`.
- [x] T020 Write the packet changelog entry `changelog-015-004-doctrine.md` in `specs/sk-code/015-quality-agnostic-gate/changelog/`. This file sits outside this folder and is written only at landing. Verify: `ls specs/sk-code/015-quality-agnostic-gate/changelog/changelog-015-004-doctrine.md` prints that path with no error. Evidence 2026-10-26: written by `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/sk-code/015-quality-agnostic-gate/004-doctrine --write`, and the Verify printed the path, exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T021 Ask `sk-code-review` to confirm each row of the review-severity column in `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` against `.skilled/skills/sk-code/sk-code-review/references/review-core.md` section 2. Record each changed row in ADR-003 with the reviewer's reason. Verify: the review reply names every row, `rg -c "Review severity" .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` still prints `4`, and ADR-003 lists every changed row. Evidence 2026-10-26: the `sk-code-review` mode was loaded, its `SKILL.md` and `references/review-core.md`, and each of the twenty rows was checked against section 2. ADR-003 names every row with its verdict and reason: eighteen confirmed and two changed from the default, error message quality to P2 and type-safety split by whether the type check fails. `rg -c "Review severity"` still printed `4`. Deviation: the task asks review to answer, and the coordinator ruled that this phase gets the confirmation itself by loading the review mode and checking each row, with ADR-003 set to Accepted, pending operator confirmation at program end. Confirmed by the operator 2026-10-26.
- [x] T022 Run the document validator on each changed Markdown file. Files: the eleven edited docs, `.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `.skilled/skills/sk-code/SKILL.md`, `.skilled/skills/sk-code/sk-code-skilled/SKILL.md` and the three new changelog files. Verify: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` exits 0 for each file. Evidence 2026-10-26: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py <file>` printed `VALID` and `Total issues: 0`, exit 0, for each of the eleven docs, the three `SKILL.md` files, the hub `README.md` and the three Hermes copies. The three changelog files passed with `--type changelog`, `VALID` and 0 issues each.
- [x] T023 Run the drift-guard umbrella, then scan the changed doctrine for credential values. Verify: `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` exits 0, and its last line reads `run-all-drift-guards: all 4 guards PASSED`. The baseline at authoring time was that line with 10 non-blocking warnings. Also `rg -n "AKIA[0-9A-Z]{16}|ghp_[A-Za-z0-9]{36}" .skilled/skills/sk-code/shared .skilled/skills/sk-code/sk-code-skilled/assets/checklists .skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist` prints no line. Evidence 2026-10-26: the umbrella exited 0 and its last line read `run-all-drift-guards: all 4 guards PASSED, 10 non-blocking warning(s)`, the same ten warnings as the baseline and none in a touched file. The first run failed doc-claims on a packet-relative code span in step 2, which now names the full path. The credential grep printed no line (exit 1).
- [x] T024 Confirm released changelog entries did not change. Verify: `GIT_CONFIG_COUNT=1 GIT_CONFIG_KEY_0=core.fsmonitor GIT_CONFIG_VALUE_0=false git diff --numstat HEAD -- .skilled/skills/sk-code/changelog .skilled/skills/sk-code/sk-code-quality/changelog .skilled/skills/sk-code/sk-code-skilled/changelog` prints no row whose second column is not `0`. Evidence 2026-10-26: the Verify printed no row, exit 0. The three new entries are untracked new files, and no released entry changed.
- [x] T025 Refresh the derived packet metadata. Files: `description.json`, `graph-metadata.json` and this folder. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder specs/sk-code/015-quality-agnostic-gate/004-doctrine --apply` exits 0. Evidence 2026-10-26: the Verify exited 0.
- [x] T026 Run the strict packet validator after T025. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/004-doctrine --strict --no-recursive` prints `RESULT: PASSED` as its last line, with `Errors: 0`. Evidence 2026-10-26: the Verify printed `Errors: 0` and `RESULT: PASSED` as its last line, exit 0.
- [x] T027 Fill `implementation-summary.md` with the files, the commands and their results. Set each acceptance row to `Met` only with its observed evidence. Files: `specs/sk-code/015-quality-agnostic-gate/004-doctrine/implementation-summary.md` and `specs/sk-code/015-quality-agnostic-gate/004-doctrine/acceptance-criteria.md`. Verify: `rg -n "^\| AC-" specs/sk-code/015-quality-agnostic-gate/004-doctrine/acceptance-criteria.md` prints all sixteen rows, and each Status cell reads `Met`. Evidence 2026-10-26: `rg -n "^\| AC-"` printed all sixteen rows, and each Status cell reads `Met`.
- [x] T028 Check that the scratch folder holds only its placeholder file. Verify: `ls -A specs/sk-code/015-quality-agnostic-gate/004-doctrine/scratch` prints `.gitkeep` only. Evidence 2026-10-26: the Verify printed `.gitkeep` only.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (T021 review confirmation and T027 evidence)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`, whose AC rows give the grep forms for each task
- **Decisions**: See `decision-record.md` for ADR-001 to ADR-005
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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-014 in spec.md section 4)
- [x] CHK-002 [P0] Technical approach defined in plan.md (sections 1 to 3)
- [x] CHK-003 [P1] Dependencies identified and available. Phases 001 to 003 are not landed. Checked by T002. Evidence 2026-10-26: T002. Phases 001 and 002 are on main, and their runner and contract files exist. Phase 003 is not, so its names come from its `spec.md` as the coordinator ruled.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] This phase changes no code file. `git diff --name-only HEAD` lists only `.md` and `.json` paths for the doctrine change. Evidence 2026-10-26: `git diff --name-only HEAD` plus `git ls-files --others --exclude-standard` lists 36 paths outside `scratch/`, every one `.md` or `.json`: 25 under `.skilled/` and `.hermes/`, and 11 under `specs/`, among them the activation manifest's authored twin and the parent's `spec.md` and `graph-metadata.json`.
- [x] CHK-011 [P0] N/A. No code runs in this phase, so no console output exists to check. Evidence 2026-10-26: N/A confirmed by CHK-010, no code file changed.
- [x] CHK-012 [P1] N/A. The phase adds no code, so no error handling changes. Evidence 2026-10-26: N/A confirmed by CHK-010, no code file changed.
- [x] CHK-013 [P1] Each edited doc keeps its own heading and table shape, checked by T022. Evidence 2026-10-26: T022, `validate_document.py` printed `VALID` with 0 issues for every changed doc. The three rule lists became tables with the same headings, as ADR-003 decided.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001 to AC-016). Evidence 2026-10-26: all sixteen rows in `acceptance-criteria.md` read Met, with three line anchors amended by ADR-005.
- [x] CHK-021 [P0] Manual testing complete. `sk-code-review` confirmed the review-severity column (T021). Evidence 2026-10-26: T021. Every row of the column was checked against the loaded `sk-code-review` contract and recorded in ADR-003.
- [x] CHK-022 [P1] Edge cases tested. The empty-input case in spec.md is covered by AC-001 and AC-004. Evidence 2026-10-26: AC-001 and AC-004 greps printed their lines. The UNKNOWN case now names the floor and the built-in checks only.
- [x] CHK-023 [P1] Error scenarios validated. A reviewer change to a row is recorded in ADR-003 (T021). Evidence 2026-10-26: ADR-003 records the two changed rows, error message quality and type-safety enforcement, each with its reason.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. The findings in the packet log are: class-of-bug for the operator-private id, cross-consumer for Iron Law 3 and instance-only for the CHK-CSS-09 severity. Evidence 2026-10-26: the classes are recorded in the goal.md log with the findings they cover.
- [x] CHK-FIX-002 [P0] The same-class producer inventory is complete. Seven other tracked files name the operator-private id. They are listed in the open questions as outside this phase. Evidence 2026-10-26: `git ls-files -- .skilled | xargs rg -l` for the two private ids, outside `.skilled/specs/`, lists nine files. Two are released changelog entries that are never edited, and seven are tests or fixtures, which matches the open question in spec.md.
- [x] CHK-FIX-003 [P0] The consumer inventory for Iron Law 3 covers `stack-detection.md`, `workflow-verify.md` and `sk-code-quality/SKILL.md`. Checked by T004 and T017. The UNKNOWN escalation line in `sk-code-quality/SKILL.md` is checked by T015. Evidence 2026-10-26: T004, T015 and T017 verified the three consumers. A grep for the old wording across `.skilled/skills/sk-code` and `.skilled/agents` found no other reader, and `phase-detection.md` line 71 only points at the law.
- [x] CHK-FIX-004 [P0] N/A. The phase changes no parser, path or redaction code. The parser floor is built by phase 002. Evidence 2026-10-26: N/A confirmed by CHK-010.
- [x] CHK-FIX-005 [P1] N/A. The phase has no matrix axes. Evidence 2026-10-26: N/A, the phase has no matrix axes.
- [x] CHK-FIX-006 [P1] N/A. The phase reads no process-wide state. Evidence 2026-10-26: N/A, no process-wide state is read.
- [x] CHK-FIX-007 [P1] Evidence cites the landing commit, not a branch range. Checked at landing. Evidence 2026-10-26: every evidence line names a command run on the working tree over HEAD `f69e5cd2e8`, and none cites a branch range. Deviation: this worker never commits, so the landing sha is the coordinator's to add at landing.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. The signature grep in T023 prints no line. Evidence 2026-10-26: the T023 credential grep printed no line, exit 1.
- [x] CHK-031 [P0] N/A. The phase adds no input path. Evidence 2026-10-26: N/A confirmed by CHK-010.
- [x] CHK-032 [P1] N/A. The phase adds no auth or authorization path. Evidence 2026-10-26: N/A confirmed by CHK-010.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same lines, requirements and AC rows. Evidence 2026-10-26: spec, plan and tasks name the same starting lines, REQ ids and AC rows. ADR-005 maps the three amended anchors to the lines they land on, and the goal.md log records the two lines phase 002 had moved.
- [x] CHK-041 [P1] N/A. The phase adds no code comment. Evidence 2026-10-26: N/A confirmed by CHK-010, and the comment-hygiene checker skipped all 36 changed files as Markdown or JSON, exit 2 with no finding.
- [x] CHK-042 [P2] The hub `README.md` changed only its newest-entry row and its edition, and no other README sits in the changed set. Evidence 2026-10-26: `python3 .skilled/skills/sk-doc/shared/scripts/validate_document.py .skilled/skills/sk-code/README.md` printed `VALID: .skilled/skills/sk-code/README.md`, `Document type: readme`, `Total issues: 0`, exit 0.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The design source sits outside the repository, and nothing from it is copied into the tree
- [x] CHK-051 [P1] scratch/ cleaned before completion. Checked by T028. Evidence 2026-10-26: T028.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26
<!-- /ANCHOR:summary -->

---

