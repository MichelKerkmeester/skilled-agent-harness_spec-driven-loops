---
title: "Tasks: CI efficiency release docs"
description: "Ordered tasks for the eleven changelog entries, the audit doc fixes and the gates that prove them, one hub at a time."
trigger_phrases:
  - "ci efficiency release docs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: CI efficiency release docs

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

Shell variables used by the commands below. Run every command from the repository root.

```bash
P=specs/system-speckit/055-ci-efficiency-release-docs
V=.skilled/skills/sk-doc/shared/scripts/validate_document.py
```

**Task Format**: `T### [P?] Action (file path)`, followed by a verify clause that names the command and the output it prints.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the worktree contains origin/main (repository history). Verify: `git merge-base --is-ancestor origin/main HEAD; echo $?` prints `0`. Evidence 2026-10-25: the literal `git merge-base --is-ancestor origin/main HEAD` printed exit 1, because origin/main moved to cdb16f3208 after the push. Run against the pinned base instead: `git merge-base --is-ancestor bb9b9d1c09 HEAD` printed exit 0. Pre-commit comparison checked against the named base, as the closure brief allows.
- [x] T002 Confirm each target changelog path from Phase 2 is absent on origin/main (`changelog/` folders of the eleven decided entries). Verify: `git cat-file -e origin/main:<target path>; echo $?` prints `128` for each path. A path that prints `0` is a collision, and it goes to the operator before any write. Evidence 2026-10-25: for each of the eleven paths, `git cat-file -e bb9b9d1c09:<path>` printed 128 (absent at base), `git cat-file -e <introducing sha>:<path>` printed 0 and `git cat-file -e HEAD:<path>` printed 0. Checked against base because the paths now exist on origin/main.
- [x] T003 [P] Record the gate baseline before any edit (`.skilled/commands/doctor/scripts/`, `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/`). Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints `OK: parent-skill-check`. Evidence 2026-10-25: `sync-runtime-mirrors.cjs --check` printed `[runtime-mirror-sync] PASS: 194 mirrors across 8 trees are in sync.` with exit 0. `parent-skill-check.cjs` printed `OK: parent-skill-check, all hard invariants passed, 0 warnings` with exit 0.
- [x] T004 [P] Record the changelog link baseline (`.skilled/changelog/`). Verify: the link scan in T040 prints exactly two paths, the style-library bundle `changelog` folder and the spec `templates/changelog` folder. Evidence 2026-10-25: the link scan in T040 printed exactly the style-library bundle changelog folder and the spec templates changelog folder. 57 links in total.
- [x] T005 [P] Find each audit phrase in its current file before editing that line (every file in Phase 2). Verify: `rg -n -F '<phrase>' <file>` prints the current line number, and a phrase that prints nothing sends the item to the rejected list below. Evidence 2026-10-25: sampled ten audit phrases at base bb9b9d1c09 with `git show bb9b9d1c09:<file> | rg -n`. ROUTER.md lines 26, 30, 41, 189 and 214. sk-code README lines 117 and 131. sk-code-skilled README line 36. feature-catalog line 9. doctor-setup-run.md lines 29 and 71. parent-skills-nested-packets.md lines 58, 171 and 284. sk-code-quality SKILL.md line 325. root README lines 770 and 1239. This is a sample. The full 49-item audit list is not in this packet.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation, one hub at a time

**Working-tree state.** Every Phase 2 task stays `[ ]` until its verify passes at commit time. Another writer already left most of these edits uncommitted in the working tree, and the untracked changelog entries exist. Run a task's verify before its edit. A verify that already passes keeps its edit: confirm it on commit and do not rewrite it. At the check that wrote this note (2026-10-25, working tree on bb9b9d1c09), the verify fails for T009, T010 and T020, so those edits are still open.

### Hub 1: sk-code family

- [x] T006 Write the major-release hub entry in the expanded format (`.skilled/skills/sk-code/changelog/v3.0.0.0.md`). It covers the removed Webflow and Obsidian surfaces, the reversed detection precedence, the deleted shared paths and the removed PERFORMANCE intent. It also states that the v2.4.0.0 entry names two runtime keywords the hub never shipped. Verify: `rg -n 'v2.4.0.0' .skilled/skills/sk-code/changelog/v3.0.0.0.md` prints the correction line. Evidence 2026-10-25: `rg -n 'v2.4.0.0' .skilled/skills/sk-code/changelog/v3.0.0.0.md` printed lines 40, 100 and 102. Line 102 holds the correction. Exit 0.
- [x] T007 Move the sk-code hub to 3.0.0.0 in its carriers (`.skilled/skills/sk-code/SKILL.md`, `description.json`, `mode-registry.json`, `hub-router.json`, and the newest-entry link in `README.md`). Verify: `rg -n -F '2.4.0.0' .skilled/skills/sk-code/SKILL.md .skilled/skills/sk-code/description.json .skilled/skills/sk-code/mode-registry.json .skilled/skills/sk-code/hub-router.json .skilled/skills/sk-code/README.md` prints no line. Evidence 2026-10-25: `rg -n -F '2.4.0.0'` over the five files printed nothing and exited 1.
- [x] T008 Fix the hub README surface guidance (`.skilled/skills/sk-code/README.md`): step 3 of "Add Your Own Surface" (line 135 at baseline), step 5 of "Remove A Surface" (line 125), the check 5l wording (line 133, which warns and does not fail) and the detection-order sentence (line 90). Verify: `rg -n 'surfaceDetection' .skilled/skills/sk-code/README.md` prints at least two lines, and `rg -n 'SURFACE_FALLBACK_INVALID' .skilled/skills/sk-code/README.md` prints the check 5l line. Evidence 2026-10-25: `rg -n 'surfaceDetection' .skilled/skills/sk-code/README.md` printed lines 125 and 135. `rg -n 'SURFACE_FALLBACK_INVALID'` printed line 133, the check 5l wording.
- [x] T009 Add the "Add a Private Surface Outside the Hub" subsection (README lines 106 to 108), the `/doctor:ci` sentence (line 152) and the setup-battery row (line 174) to `.skilled/skills/sk-code/README.md`. Verify: `rg -n 'Outside the Hub|doctor:ci' .skilled/skills/sk-code/README.md` prints at least three lines. Evidence 2026-10-26: applied in commit `2d068d4b7f`, which adds the `Add a Private Surface Outside the Hub` subsection with four steps. `rg -n 'Outside the Hub|doctor:ci' .skilled/skills/sk-code/README.md` prints 3 lines (139, 163 and 186). The README edition moved from 2.2.20.0 to 2.2.21.0. The 2026-10-25 closure pass found the subsection absent, and the coordinator made the edit after it.
- [x] T010 Replace the detected-surface wording in the router (`.skilled/skills/sk-code/ROUTER.md`), found by `rg -n 'SKILLED ?(/|or) ?UNKNOWN|OpenCode language sub-detection'` (lines 26, 30, 41, 189 and 214 at baseline). The plain phrase `language sub-detection` is not in the pattern, because line 69 (`For SKILLED surface, run language sub-detection`) is correct wording. Verify: the same `rg` command prints no line. At the check that wrote this note it still printed line 189, `(a declared specific surface, SKILLED or UNKNOWN)`. Evidence 2026-10-26: applied in commit `2d068d4b7f`. Line 189 now reads `(a declared specific surface, the SKILLED fallback or UNKNOWN)`, and the same `rg` command prints no line (exit 1). The ROUTER.md edition moved from 2.2.20.0 to 2.2.21.0.
- [x] T011 Add the sk-code-skilled entry (`.skilled/skills/sk-code/sk-code-skilled/changelog/v2.0.1.0.md`), move its `SKILL.md` to 2.0.1.0, and fix its README lines 36 and 72. Verify: `rg -n '^version: 2.0.1.0' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` prints one line, and `rg -n 'only surface packet' .skilled/skills/sk-code/sk-code-skilled/README.md` prints no line. Evidence 2026-10-25: `rg -n '^version: 2.0.1.0' .skilled/skills/sk-code/sk-code-skilled/SKILL.md` printed line 5. `rg -n 'only surface packet' .skilled/skills/sk-code/sk-code-skilled/README.md` printed nothing.
- [x] T012 Add the sk-code-review entry (`.skilled/skills/sk-code/sk-code-review/changelog/v1.8.0.0.md`) for the Extension Floors section and the list-valued surface evidence. Move its `SKILL.md` to 1.8.0.0, fix `references/review-core.md` line 68, and add the sk-code-ci row to the README related table (line 153). Verify: `rg -n '^version: 1.8.0.0' .skilled/skills/sk-code/sk-code-review/SKILL.md` prints one line, and `rg -n 'sk-code-ci' .skilled/skills/sk-code/sk-code-review/README.md` prints the new row. Evidence 2026-10-25: `rg -n '^version: 1.8.0.0' .skilled/skills/sk-code/sk-code-review/SKILL.md` printed line 5. `rg -n 'sk-code-ci' .skilled/skills/sk-code/sk-code-review/README.md` printed line 154, the new row.
- [x] T013 Add the sk-code-ci entry (`.skilled/skills/sk-code/sk-code-ci/changelog/v1.1.0.0.md`) for the `/doctor:ci` command with its report, scaffold and toggle routes, the `persist-credentials` rule and the protected-set correction. Move its `SKILL.md` to 1.1.0.0. Verify: `rg -n '^version: 1.1.0.0' .skilled/skills/sk-code/sk-code-ci/SKILL.md` prints one line. Evidence 2026-10-25: `rg -n '^version: 1.1.0.0' .skilled/skills/sk-code/sk-code-ci/SKILL.md` printed line 5.
- [x] T014 Fix the CI packet text that names doctor commands without `/doctor:ci` (`.skilled/skills/sk-code/sk-code-ci/SKILL.md` line 90, `.skilled/skills/sk-code/sk-code-ci/README.md` lines 43 and 74 to 82). Verify: `rg -n 'doctor:ci' .skilled/skills/sk-code/sk-code-ci/SKILL.md .skilled/skills/sk-code/sk-code-ci/README.md` prints at least two lines. Evidence 2026-10-25: `rg -n 'doctor:ci'` over the two sk-code-ci files printed three lines: SKILL.md line 90 and README lines 43 and 82.
- [x] T015 Add the sk-code-quality entry (`.skilled/skills/sk-code/sk-code-quality/changelog/v1.4.1.0.md`) for the removed Obsidian checklist rows and the moved code style guide. Move its `SKILL.md` to 1.4.1.0, fix the `resolved_surface` template (line 215) and relabel the style-guide link (line 325). Verify: `rg -n 'resolved_surface: <declared' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints the template line, and `rg -n 'Shared code style' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints no line. Evidence 2026-10-25: `rg -n 'resolved_surface: <declared'` printed line 215 with the new template. `rg -n 'Shared code style'` printed nothing and exited 1.

- [x] T016 Fix the sk-code feature catalog's Current Reality block (`.skilled/skills/sk-code/feature-catalog/feature-catalog.md` lines 33 to 35): state the declared detection order, and set `last_updated` on line 9 to 2026-10-25. Verify: `rg -n '2026-10-10' .skilled/skills/sk-code/feature-catalog/feature-catalog.md` prints no line, and `rg -n 'surfaceDetection' .skilled/skills/sk-code/feature-catalog/feature-catalog.md` prints the new sentence. Evidence 2026-10-25: `rg -n '2026-10-10'` over the feature catalog printed nothing and exited 1. `rg -n 'surfaceDetection'` printed line 35, the declared detection order sentence.
- [x] T017 Fix the sk-code manual testing playbook coverage note (`.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` lines 38 to 41): add the CI surface bundling scenario, and state that detection precedence is covered by automated tests rather than a scenario. Verify: `rg -n -i 'CI surface bundling|Detection precedence' .skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md` prints one line, the coverage note that holds both phrases (line 50 at the check that wrote this note). Evidence 2026-10-25: `rg -n -i 'CI surface bundling|Detection precedence'` printed one line, 50, which holds both phrases.

### Hub 2: system-skill-advisor

- [x] T018 Add the advisor entry (`.skilled/skills/system-skill-advisor/changelog/v0.17.0.0.md`) for the operator-private skill roots, the `/doctor:ci` bridges and their read-only floor, the vocabulary removals and the new docs, and move `SKILL.md` to 0.17.0.0. The entry names no operator-private skill. Verify: `rg -n '^version: 0.17.0.0' .skilled/skills/system-skill-advisor/SKILL.md` prints one line. Evidence 2026-10-25: `rg -n '^version: 0.17.0.0' .skilled/skills/system-skill-advisor/SKILL.md` printed line 5. The changelog entry names no operator-private skill, checked by the T044 scan.
- [x] T019 Update the doctor routing page (`.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` lines 27 and 31) so the active bridges include `/doctor:ci report`, `scaffold` and `toggle`, and the ranking paragraph describes the read-only floor. Verify: `rg -n 'doctor:ci' .skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` prints at least one line. Evidence 2026-10-25: `rg -n 'doctor:ci'` over doctor-command-routing.md printed line 27, which lists `/doctor:ci report`, `scaffold` and `toggle` as active bridges.
- [x] T020 Correct the daemon sentence in `.skilled/skills/system-skill-advisor/README.md` (line 152) and in `.skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/private-skill-containment.md` (line 24). The new clause says a daemon started without the variable skips every private skill whose link points outside the skills root. Verify: `rg -n 'skips every private skill' .skilled/skills/system-skill-advisor/README.md .skilled/skills/system-skill-advisor/feature-catalog/auto-indexing/private-skill-containment.md` prints both files. Evidence 2026-10-26: applied in commit `c3ca0efaa9`. `rg -n 'skips every private skill'` over the two files prints README.md line 152 and private-skill-containment.md line 24. The README edition moved from 0.12.5.0 to 0.12.6.0.
- [x] T021 Change the doctor setup row count from 17 to 18 in `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md` (lines 29 and 71). Another writer already made this change in the working tree (uncommitted, checked during this packet), so the task keeps it and T048 confirms it on commit. Verify: `sed -n '15,40p' .skilled/commands/doctor/assets/doctor-setup-presentation.txt | grep -c '^| .*/doctor'` prints `18`, and `rg -n '17 rows' .skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md` prints no line. Evidence 2026-10-25: `sed -n '15,40p' .skilled/commands/doctor/assets/doctor-setup-presentation.txt | grep -c '^| .*/doctor'` printed 18. `rg -n '17 rows'` on doctor-setup-run.md printed nothing and exited 1.

### Hub 3: system-spec-kit and its Hermes mirror

- [x] T022 Add the spec-kit entry (`.skilled/skills/system-spec-kit/changelog/v2.9.2.0.md`) for the hf-local lease fail-fast, the Hermes private-skill skip, playbook scenario 484, the speckit complete `not_for` line and the test fixes. Move `SKILL.md` to 2.9.2.0. Verify: `rg -n '^version: 2.9.2.0' .skilled/skills/system-spec-kit/SKILL.md` prints one line. Evidence 2026-10-25: `rg -n '^version: 2.9.2.0' .skilled/skills/system-spec-kit/SKILL.md` printed line 5.
- [x] T023 Correct the Hermes README skip list (`.skilled/skills/system-spec-kit/runtime/cli/hermes/README.md` line 21) and the spec-check sentence in `.skilled/skills/system-spec-kit/ARCHITECTURE.md` (line 105), which gains the `SKILLED_CI` and `SKILLED_CI_TESTS` condition. Verify: `rg -n 'SKILLED_CI' .skilled/skills/system-spec-kit/ARCHITECTURE.md` prints one line, and `rg -n 'private|local' .skilled/skills/system-spec-kit/runtime/cli/hermes/README.md` prints the new skip sentence. Evidence 2026-10-25: `rg -n 'SKILLED_CI' .skilled/skills/system-spec-kit/ARCHITECTURE.md` printed line 105, one line. `rg -n 'private|local' .skilled/skills/system-spec-kit/runtime/cli/hermes/README.md` printed line 21, the operator-private skip sentence.
- [x] T024 Add `/doctor:ci` to the doctor catalog pages (`.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md`, `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md` line 884, and `.skilled/skills/system-spec-kit/feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md`). Recount the routers from `ls .skilled/commands/doctor/*.md` (eleven files at baseline) before changing any count, because the audit's "Seven" to "Eight" arithmetic was not rechecked. Verify: `rg -n 'doctor:ci' .skilled/skills/system-spec-kit/feature-catalog` prints a line in each of the three files. Evidence 2026-10-25: `rg -n 'doctor:ci'` over the feature catalog printed a line in each of category-overview.md, feature-catalog.md (line 884) and maintenance/doctor-router-and-manifest-dispatch.md. `ls .skilled/commands/doctor/*.md` lists 11 files. The catalog names eight routers, and the list in the text has eight names.
- [x] T025 Add a `/doctor:ci` line to the cross-playbook list (`.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` line 26). The line says `/doctor:ci` has no manual scenario and is covered by its script tests. Verify: `rg -n 'doctor:ci' .skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md` prints one line. Evidence 2026-10-25: `rg -n 'doctor:ci'` over the spec-kit doctor-commands README printed line 26, one line.

### Hub 4: sk-doc family (T026 is blocked on open question 1)

- [x] T026 Write the sk-doc hub entry and move the hub carriers (`.skilled/skills/sk-doc/SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`, the mirror `.hermes/skills/sk-doc/SKILL.md` and the activation manifest `activation/sk-doc/manifest.json`) to the number the operator confirms. The decided 2.3.12.0 already names a released entry, so this task waits. The entry records the dropped cite-drift redirect rows, the playbook allowlist change and the code-folder fixtures. Verify: `test -e .skilled/skills/sk-doc/changelog/<confirmed version>.md; echo $?` prints `0` after the entry is written. Evidence 2026-10-25: `test -e .skilled/skills/sk-doc/changelog/v2.3.13.0.md; echo $?` printed 0. Resolved by open question 1 with 2.3.13.0, see deviation a. Was [B].
  - Deviation a: the sk-doc hub entry is 2.3.13.0, not the decided 2.3.12.0. Commit `c301fa4bc7` had already released `v2.3.12.0.md` before this packet wrote its entry. The 2.3.13.0 entry records the redirect, allowlist and README-fixture changes from commits `e3beac65f4`, `028bd0f5cd` and `d6ab55d155`. All three are ancestors of `c301fa4bc7`, so this entry is the first release record of those changes. The writer found four redirect rows removed, not three. Verified: `git show e3beac65f4 -- .skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` removes four `from` keys, three Webflow folders and one Obsidian spec folder. Open question 1 in spec.md is answered with this.
- [x] T027 Add the sk-create-skill entry (`.skilled/skills/sk-doc/sk-create-skill/changelog/v1.5.6.0.md`) for the fleet root-metadata gate, the operator-private root exclusion and the upgrade reference, and move `SKILL.md` to 1.5.6.0. Verify: `rg -n '^version: 1.5.6.0' .skilled/skills/sk-doc/sk-create-skill/SKILL.md` prints one line. Evidence 2026-10-25: `rg -n '^version: 1.5.6.0' .skilled/skills/sk-doc/sk-create-skill/SKILL.md` printed line 5.
- [x] T028 Fix the sk-create-skill references. Update the violation-code table and enforcement list in `references/shared/skill-root-metadata-contract.md` (lines 131 to 143), and the discovery sentence at line 123 (the audit cited line 121). Confirm `references/skill/upgrading-a-skill-to-v4.md` line 134, which another writer already changed in the working tree (keep it, and confirm it on commit). Replace the `code-webflow` example in `references/parent-skill/parent-skills-nested-packets.md` (lines 58, 171 and 284 at baseline) and the worked example in `references/parent-skill/parent-hub-router-schema.md` (19 lines at baseline: 27, 69, 100, 111, 123, 141, 151, 153, 154, 192, 195, 218, 219, 223, 242, 244, 249, 256 and 301) with the live surfaces. The verify covers the whole folder, so every one of those lines must change. Verify: `rg -n 'code-webflow' .skilled/skills/sk-doc/sk-create-skill/references/parent-skill` prints no line, and `rg -n 'GRAPH_METADATA_INVALID_SURFACE_DETECTION' .skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md` prints the new row. Evidence 2026-10-25: `rg -n 'code-webflow' .skilled/skills/sk-doc/sk-create-skill/references/parent-skill` printed nothing and exited 1. `rg -n 'GRAPH_METADATA_INVALID_SURFACE_DETECTION'` on skill-root-metadata-contract.md printed line 147, the new table row, and line 130.
- [x] T029 Add the sk-create-command entry (`.skilled/skills/sk-doc/sk-create-command/changelog/v1.0.5.0.md`) for the `/doctor:ci` contract entries and the destructive-policy lines, and move `SKILL.md` to 1.0.5.0. Verify: `rg -n '^version: 1.0.5.0' .skilled/skills/sk-doc/sk-create-command/SKILL.md` prints one line. Evidence 2026-10-25: `rg -n '^version: 1.0.5.0' .skilled/skills/sk-doc/sk-create-command/SKILL.md` printed line 5.

### Hub 5: sk-git

- [x] T030 Add the sk-git entry (`.skilled/skills/sk-git/changelog/v1.9.5.0.md`) for the placeholder ClickUp server exclusion in worktree provisioning (commit `c48cc8ed24`), and move `SKILL.md` to 1.9.5.0. Commit `0bf53bfadc` stays out of this entry because it sits outside the program. Verify: `rg -n '^version: 1.9.5.0' .skilled/skills/sk-git/SKILL.md` prints one line. Evidence 2026-10-25: `rg -n '^version: 1.9.5.0' .skilled/skills/sk-git/SKILL.md` printed line 6.

### Hub 6: root README and command docs

- [x] T031 Change the DOCTOR intro in the root `README.md` from "Ten commands" to "Eleven commands". Verify: `rg -n 'Eleven commands check' README.md` prints one line. Evidence 2026-10-25: `rg -n 'Eleven commands check' README.md` printed line 1239.
- [x] T032 Add the `/doctor:ci [report|scaffold|toggle]` entry to the root `README.md` DOCTOR section after `/doctor:sk-code`, with the three routes described in the audit. Verify: `rg -n 'doctor:ci' README.md` prints a line between the DOCTOR heading and the UTILITY heading. Evidence 2026-10-25: DOCTOR heading at line 1237 and UTILITY heading at line 1300. `rg -n 'doctor:ci' README.md` printed line 1268, between them.
- [x] T033 Add `/doctor:ci` to the root `README.md` summary paragraph in the doctor overview (line 213), and add a CI bullet to "Off Switches" that names the six `SKILLED_CI*` variables and the rule that only the literal `off` disables a job. Verify: `rg -n 'SKILLED_CI' README.md` prints at least one line. Evidence 2026-10-25: `rg -n 'SKILLED_CI' README.md` printed lines 1272 and 1520. Line 1520 is the Off Switches CI bullet, which names the six variables and says only the literal off disables a job.
- [x] T034 Replace the "One native surface" wording in the root `README.md` sk-code entry (lines 768 to 772, which include line 770, applied once) and in "What Adapting sk-code Looks Like" (lines 1451 to 1457) with the two-surface description. Verify: `rg -n 'One native surface|ships one native surface' README.md` prints no line. Evidence 2026-10-25: `rg -n 'One native surface|ships one native surface' README.md` printed nothing and exited 1.
- [x] T035 Add `ci.md` to the doctor tree in `.skilled/commands/README.txt` (lines 101 to 113), add `sk-code-ci` to the sk-code row in `.skilled/skills/README.txt` (line 60), and reword the presentation sentence in `.skilled/commands/doctor/assets/doctor-setup.yaml` (line 52) to match the table. Verify: `rg -n 'ci.md' .skilled/commands/README.txt` prints one line, and `rg -n 'sk-code-ci' .skilled/skills/README.txt` prints one line. Evidence 2026-10-25: `rg -n 'ci.md' .skilled/commands/README.txt` printed line 107. `rg -n 'sk-code-ci' .skilled/skills/README.txt` printed line 60.
- [x] T036 Update `.github/workflows/README.md`: the gate-inputs row (line 36) also covers composite actions, a short subsection describes `.github/actions/setup/action.yml` and its `cache` input, the daily schedule of `playbook-operator-contract.yml` appears (line 65), and the switches section and RELATED list point to `/doctor:ci` (lines 107 to 109). Verify: `rg -n 'actions/setup|doctor:ci' .github/workflows/README.md` prints at least three lines. Evidence 2026-10-25: `rg -n 'actions/setup|doctor:ci' .github/workflows/README.md` printed lines 99, 103 and 120.

### Rejected or deferred audit items

These items are not tasks, and the reason for each one stands in the packet.

- `.skilled/skills/sk-code/changelog/v2.4.0.0.md` line 24 (released). Rejected as an edit. The false keyword claim is corrected in the v3.0.0.0 entry (T006).
- `.skilled/changelog/skilled/README.md` lines 22 to 26 (framework folder). Out of scope. The operator decides at release time (open question 2).
- Root `README.md` line 770. Duplicates lines 768 to 772. Applied once, in T034.
- The "Seven" to "Eight" count lines in the spec-kit doctor catalogs (`feature-catalog/doctor-commands/category-overview.md` and two other pages). Deferred to T024, where the recount decides the number.
- `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` and `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json`. Not doc text. Recorded in the sk-doc hub entry (T026).
- Commit `0bf53bfadc` (sk-git opencode2 rename). Outside the program, so it stays out of the sk-git entry (T030).
- `.skilled/skills/sk-code/sk-code-quality/changelog/v1.4.0.0.md` and two quality checklists that name the operator-private skill. Not in the audit's doc-fix list, and privacy-sensitive. Open question 3, not changed here.
- `.skilled/commands/create/assets/create-skill-parent-auto.yaml`. Outside the touched docs. Open question 4, not changed here.
- Deviation d (scope): a writer had edited `.skilled/changelog/skilled/README.md`, which spec.md's out-of-scope list and REQ-005 exclude. The edit was reverted before any commit, and `git status --porcelain -- .skilled/changelog/skilled` prints nothing. The edit is saved as a patch for the operator at `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/dc90f89a-3498-4cd7-9381-9e7dc39789b2/scratchpad/skilled-changelog-readme.patch`. That README still names `v4.0.0.4.md` as the unreleased entry, and both `v4.0.0.4.md` and `v4.0.0.14.md` exist in the folder. Open question 2 stays with the operator.
- Deviation e (left open by choice, also listed in implementation-summary.md Known Limitations): sk-code `ROUTER.md` section numbering jumps from 3 to 6 at HEAD, the same before and after this work. Its sections are cited by number, so renumbering is a separate change. Pre-existing HVR findings on lines this packet did not change are not fixed. The operator recorded them, and this closure run did not re-observe them. sk-create-skill v1.5.6.0 does not mention the `047-020-recorded-picks.jsonl` fixture or the `leaf-resource-contract.test.cjs` id renames, because the changelog template leaves test-fixture housekeeping out. `validate_document.py` without `--type` reads the sk-code feature catalog as the readme type, so those files need `--type`.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification and Delivery

- [x] T037 Regenerate the Hermes mirrors after every SKILL.md edit, with `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs`, and never by hand. The script reads every `.skilled/skills/**/SKILL.md` and writes each skill's mirror under `.hermes/skills/`, so every bumped skill changes, not only system-spec-kit. The sk-doc hub mirror follows T026. Verify: `rg -n '^version: ' .hermes/skills/{sk-code,sk-code-skilled,sk-code-review,sk-code-ci,sk-code-quality,system-skill-advisor,system-spec-kit,sk-create-skill,sk-create-command,sk-git}/SKILL.md` prints ten lines, each stating the decided version from plan.md section 3. Evidence 2026-10-25: `rg -n '^version: '` over the `.hermes/skills` SKILL.md mirrors printed one line per mirror with the decided version: sk-code 3.0.0.0, sk-code-skilled 2.0.1.0, sk-code-review 1.8.0.0, sk-code-ci 1.1.0.0, sk-code-quality 1.4.1.0, system-skill-advisor 0.17.0.0, system-spec-kit 2.9.2.0, sk-create-skill 1.5.6.0, sk-create-command 1.0.5.0, sk-git 1.9.5.0, and sk-doc 2.3.13.0 for the hub. Exit 0.
- [x] T038 Derive the document edition of each edited doc whose own frontmatter carries a `version` field, following `sk-create-frontmatter`, and check each derived value once more (the edited docs from Phase 2). Verify: `rg -n '^version:' <each edited doc>` prints one value per file, and each value matches the derivation. Evidence 2026-10-25: `rg -m1 '^version:'` on the 59 edited markdown files gave one value per file. Each edition matches the raise rule in `sk-create-frontmatter/references/frontmatter-versioning.md` section 4, third segment plus one with the fourth reset, checked base to HEAD. Each SKILL.md equals the newest changelog entry. New docs start at 1.0.0.0. The rule was checked by arithmetic, not by running the pre-commit bump.
- [x] T039 Run the version carrier sweep for the eleven decided skills, using the carrier list in plan.md section 3, which includes each `.hermes/skills/<skill>/SKILL.md` mirror (the sk-doc hub stays out until T026 is done). Verify: `rg -n -F '<old version>' <carrier files>` prints no line for each skill. Activation manifests carry no version string, so check them with `git status --porcelain -- .skilled/bin/lib/compiled-routing/013-live-activation/activation/`, which must list `activation/sk-code/manifest.json` (and `activation/sk-doc/manifest.json` after T026). Evidence 2026-10-25: `rg -n -F` over each bumped skill's carriers, with the old version read from `git show bb9b9d1c09:<SKILL.md>`, printed no line for any old version: 2.4.0.0, 2.0.0.0, 1.7.1.0, 1.0.0.0, 1.4.0.0, 0.16.3.0, 2.9.1.0, 1.5.5.0, 1.0.4.0, 1.9.4.0 and 2.3.12.0 for the hub. Activation manifests carry no version string. `git show --name-only d19f17b062` lists `activation/sk-code/manifest.json`, and `git show --name-only 19ba5c662d` lists `activation/sk-doc/manifest.json`. The literal `git status --porcelain` form prints nothing now, because both commits are in HEAD, so the commit lists are the evidence.
- [x] T040 Run the changelog link scan over every skill and mode changelog folder: `comm -23 <(find .skilled/skills -type d -name changelog -not -path '*/z_archive/*' -not -path '*/node_modules/*' | while read -r d; do (cd "$d" && pwd -P); done | sort -u) <(find .skilled/changelog -type l | while read -r l; do (cd "$(dirname "$l")" && cd "$(readlink "$(basename "$l")")" && pwd -P); done | sort -u)`. Verify: it prints exactly the two paths recorded in T004 and nothing else. Evidence 2026-10-25: the link scan printed exactly two paths, the style-library bundle changelog folder and the spec templates changelog folder, and nothing else. Exit 0.
- [x] T041 Run `python3 "$V"` on every markdown file the work created or edited, with an explicit `--type`, because auto-detection does not recognise packet files. Use `spec` for packet files, `changelog` for changelog entries, and the matching type for other pages. Verify: `python3 "$V" --type <type> <file>; echo $?` prints `0` for each file. Evidence 2026-10-25: `validate_document.py --type <type> <file>` over the 59 markdown files the six commits changed exited 0 on each file (59 total, 0 nonzero). Types came from the path: changelog for entries, skill for SKILL.md, readme, reference, feature_catalog, playbook and playbook_feature for the rest.
- [x] T042 Run the gates: the mirror sync, route validation, the router-sync guard and the hub parent check. Verify: `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs --check` prints `PASS`, `bash .skilled/commands/doctor/scripts/route-validate.sh` prints `OK: route-validate`, `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`, and `node .skilled/commands/doctor/scripts/parent-skill-check.cjs` prints `OK: parent-skill-check` with no new warning against T003. Evidence 2026-10-25: mirror sync printed `[runtime-mirror-sync] PASS: 194 mirrors across 8 trees are in sync.` with exit 0. route-validate printed `OK: route-validate, 17 routes validated, 2 warnings` with exit 0, and the two warnings are informational `--dry-run` flag notes on routes these commits do not touch. router-sync printed `router-sync: 5/5 checks passed` with exit 0. parent-skill-check printed `OK: parent-skill-check, all hard invariants passed, 0 warnings` with exit 0. Against T003 the parent-skill warnings count is unchanged at 0.
- [x] T043 Check the released-entry and framework guards. Verify: `git diff --diff-filter=M --name-only origin/main -- '*/changelog/v*.md'` and `git diff --name-only origin/main -- .skilled/changelog/skilled` both print nothing. Evidence 2026-10-25: the literal `git diff --diff-filter=M --name-only origin/main -- '*/changelog/v*.md'` and `git diff --name-only origin/main -- .skilled/changelog/skilled` both printed nothing and exited 0. Amended to the pinned base: the `diff-filter=M` count of released entries is 0 in the base to HEAD range and in each of the six commits, and no path under the framework folder changed.
- [x] T044 Run the privacy and style scan on added lines. Verify: `git diff -U0 origin/main | grep '^+' | grep -c -- "$(printf '\342\200\224')"` prints `0`, and `git diff -U0 origin/main | grep '^+' | grep -c -E 'local-[a-z0-9]'` prints `0`. Evidence 2026-10-25: per commit, the added lines held 0 em dashes and 0 `local-[a-z0-9]` matches for all six commits. The literal `git diff -U0 origin/main` scans also printed 0 and 0.
- [x] T045 Check that no code file changed. Verify: `git diff --name-only origin/main | grep -E '\.(ts|js|cjs|mjs|py|sh)$'` prints nothing. Evidence 2026-10-25: `git show --name-only` over the six commits, filtered to ts, js, cjs, mjs, py and sh, printed nothing (grep exit 1). The literal origin/main form also printed nothing.
- [x] T046 Read each new entry against the change it describes, and find that change in `git show --stat <sha>` for a commit the audit lists. Verify: `git show --stat <sha>` prints each path the entry names. Evidence 2026-10-25: read all eleven entries. Each entry is a new file in its commit. Every path an entry names resolves at HEAD, and the shared references the v3.0.0.0 entry says were deleted are absent. Behaviour claims were read against the change, not re-run. Two entries name spec folders outside this packet, recorded in implementation-summary.md Known Limitations.
- [x] T047 Commit the sk-code family as one commit, staging only its paths, the Hermes mirrors the regeneration wrote for them and the re-minted activation manifest. Verify: `git show --stat HEAD` lists only `.skilled/skills/sk-code` paths, the mirrors `.hermes/skills/sk-code`, `sk-code-skilled`, `sk-code-review`, `sk-code-ci` and `sk-code-quality`, and `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json`. The commit hook or the refresh command in plan.md section 3 supplies that manifest before the commit. Evidence 2026-10-25: `git show --stat d19f17b062` lists 25 files under `.skilled/skills/sk-code/`, plus `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` and the authored twin of that manifest under `specs/sk-doc/z_archive/`. The mirror clause is not met in this commit, see deviation b. The twin path is listed by the commit and is not in the as-written verify. Deviation f applies.
  - Deviation b: each hub commit carries only its own `.skilled/skills/<hub>` paths. The Hermes mirrors land together in `cdd611f210` with the root docs. Reason: the pre-commit mirror-parity gate (`.skilled/scripts/git-hooks/pre-commit`, lines 278 to 290) blocks any commit that stages a mirror output while another mirror output is dirty, so a per-hub commit with its own mirror would need `SPECKIT_SKIP_MIRROR_PARITY=1`. The gate's fix line says to stage the mirrors together. The as-written mirror clauses of T047 to T051 are met only under this deviation, and each is verified against the named commit.
- [x] T048 Commit the system-skill-advisor family as one commit. Verify: `git show --stat HEAD` lists only `.skilled/skills/system-skill-advisor` paths and `.hermes/skills/system-skill-advisor`. Evidence 2026-10-25: `git show --stat ef39b28497` lists 6 files, all under `.skilled/skills/system-skill-advisor/`. The mirror clause is covered by deviation b. Deviation f applies.
  - Deviation f (CI failure): the Message Contract run failed for this commit. See the note under T053.
- [x] T049 Commit the system-spec-kit family, with its Hermes mirror, as one commit. Verify: `git show --stat HEAD` lists only `.skilled/skills/system-spec-kit` and `.hermes/skills/system-spec-kit` paths. Evidence 2026-10-25: `git show --stat 068f774a3b` lists 8 files, all under `.skilled/skills/system-spec-kit/`. The mirror clause is covered by deviation b. Deviation f applies.
  - Deviation f (CI failure): the Message Contract run failed for this commit. See the note under T053.
- [x] T050 Commit the sk-doc family once T026 is done. Verify: `git show --stat HEAD` lists only `.skilled/skills/sk-doc` paths, the mirrors `.hermes/skills/sk-doc`, `.hermes/skills/sk-create-skill` and `.hermes/skills/sk-create-command`, and `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json`. Evidence 2026-10-25: `git show --stat 19ba5c662d` lists 15 files under `.skilled/skills/sk-doc/`, plus `activation/sk-doc/manifest.json` and the authored twin under `specs/sk-doc/z_archive/`. The mirrors land in `cdd611f210`, see deviation b. Was [B], resolved by deviation a. Deviation f applies.
  - Deviation f (CI failure): the Message Contract run failed for this commit. See the note under T053.
- [x] T051 Commit sk-git as one commit. Verify: `git show --stat HEAD` lists only `.skilled/skills/sk-git` paths and `.hermes/skills/sk-git`. Evidence 2026-10-25: `git show --stat 1dae97a865` lists 2 files, both under `.skilled/skills/sk-git/`. The mirror clause is covered by deviation b. Deviation f applies.
  - Deviation f (CI failure): the Message Contract run failed for this commit. See the note under T053.
- [x] T052 Commit the root and command docs as one commit (`README.md`, `.skilled/commands/`, `.skilled/skills/README.txt`, `.github/workflows/README.md`). Verify: `git show --stat HEAD` lists only those paths. Evidence 2026-10-25: `git show --stat cdd611f210` lists 16 files: `README.md`, `.github/workflows/README.md`, `.skilled/commands/README.txt`, `.skilled/commands/doctor/assets/doctor-setup.yaml`, `.skilled/skills/README.txt` and the eleven Hermes mirrors. No other path. The mirrors land here with the root docs, see deviation b. Deviation f applies.
  - Deviation f (CI failure): the Message Contract run failed for this commit. See the note under T053.
- [x] T053 Push the branch after the operator's yes, through sk-git's push command. Verify: `git rev-parse HEAD` equals `git rev-parse origin/worktrees/218-ci-efficiency-build` after the push. Evidence 2026-10-26: the check is amended (deviation c), because the CI bot's trigger-index rebuild commit `cdb16f3208` landed on main after the push, so HEAD and origin/main can no longer be equal by construction. The amended check is `git merge-base --is-ancestor cdd611f210 origin/main`, which exited 0 after `git fetch`. The six docs commits reached main through `git replay` onto origin/main and a push of the replayed tip to `refs/heads/main`. The two follow-up commits and this packet commit were then rebased locally onto `cdb16f3208` and pushed as a fast-forward, which this commit cannot record about itself.
  - Deviation c: the push went straight to main by replaying the commits onto origin/main (`git replay`, then `git push origin <sha>:refs/heads/main`), under the operator's standing instruction from 2026-10-25. As written, `git rev-parse HEAD origin/main` no longer prints the same sha twice, because origin/main moved to `cdb16f3208`, a trigger index rebuild that is not from this packet. The worktree branch was not pushed.
  - Deviation f (CI failure, reported by the coordinator): the Message Contract workflow, run 40242193992, concluded failure on `cdd611f210` (event push). `gh run view` confirms the conclusion. Each of the six commits failed `[trailer.spec-exists]`, because each Spec trailer names `system-speckit/055-ci-efficiency-release-docs` and main did not hold that folder. This packet folder was untracked when the six commits were pushed. The local `validate-message.mjs --commit` check passed only because the folder exists in the working tree. The failed run stays failed, because a rerun checks out the same tree. Lesson: commit the packet before, or together with, the first commit whose Spec trailer cites it. The fix is a packet commit to main, which the coordinator makes after closure. No task or AC is marked on the basis that CI was green on `cdd611f210`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence 2026-10-26: `grep -cE '^- \[ \] T[0-9]{3}' tasks.md` prints `0`.
- [x] No `[B]` blocked tasks remaining. T026 and T050 are resolved by deviation a.
- [x] Manual verification passed. Evidence 2026-10-26: the T042 gates print their PASS or OK lines, and all twelve rows in acceptance-criteria.md are Met.
- [x] The artifact that proves the work is done: the commits exist, and `git status --porcelain` shows no path of a committed hub. Evidence 2026-10-25: the six commits are ancestors of origin/main (T053 ancestry check, exit 0). The packet folder lands in the commit that carries this line, see deviation f.
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

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 11.
- [x] CHK-002 [P0] Technical approach defined in plan.md: `rg -c '^### Step ' plan.md` prints 4.
- [x] CHK-003 [P1] Dependencies identified and available. Identified in plan.md section 6. Open question 1 is answered with 2.3.13.0, see deviation a. Evidence 2026-10-25: T026 and T050 resolved.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No code file changed: T045 prints nothing. Evidence 2026-10-25: T045 printed nothing.
- [x] CHK-011 [P0] No gate prints a failure: the T042 gates print their PASS or OK lines. Evidence 2026-10-25: the T042 gates printed PASS or OK lines, and parent-skill-check reported 0 warnings. The content failures T009, T010 and T020 were fixed in `2d068d4b7f` and `c3ca0efaa9`, and on 2026-10-26 verify-doc-claims printed 4/4, router-sync 5/5 and parent-skill-check OK with 0 warnings.
- [x] CHK-012 [P1] N/A: no code path changes, so error handling does not apply.
- [x] CHK-013 [P1] Each new entry follows its skill's newest entry, and only the sk-code hub entry uses the expanded major-release format. Evidence 2026-10-26: `grep -c '^## '` on each new entry against its predecessor. Ten entries carry the compact pair `What's New at a Glance` and `Upgrade`. Their predecessors carry two H2 sections, except `sk-code-ci` v1.0.0.0 (3) and `sk-code-skilled` v2.0.0.0 (5), which were a first release and a major. The sk-code hub entry v3.0.0.0 alone carries the expanded shape, seven H2 sections ending in `Upgrade Notes`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria in acceptance-criteria.md are Met. Evidence 2026-10-26: `rg -c '\| Unmet \|' acceptance-criteria.md` prints nothing, and twelve rows read Met.
- [x] CHK-021 [P0] T046 completed for all eleven entries. Evidence 2026-10-25: T046 read all eleven entries and resolved each named path at HEAD.
- [x] CHK-022 [P1] Edge cases: the released-entry and privacy guards (T043, T044) print nothing. Evidence 2026-10-25: T043 and T044 printed nothing or 0.
- [x] CHK-023 [P1] Error scenarios: each failing gate is fixed in its source file, and the gate itself stays as it is. Evidence 2026-10-26: T009 and T010 were fixed in the sk-code README and ROUTER.md (`2d068d4b7f`), and T020 in the advisor README (`c3ca0efaa9`). No check or gate file changed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each audit item has a disposition in tasks.md: applied at its current line, or rejected with a reason. Evidence 2026-10-26: the table under Audit Item Dispositions below gives each of the 49 items its task, and item 35 its rejection reason.
- [x] CHK-FIX-002 [P0] Same-class inventory: `rg -l 'doctor:ci'` over the skill docs and root docs names every doc the audit lists for it. Evidence 2026-10-25: `rg -c 'doctor:ci'` over the listed docs: 14 of 15 name the command. `.skilled/skills/README.txt` names sk-code-ci, the row T035 checks, and not the command.
- [x] CHK-FIX-003 [P0] Consumer inventory: the hub newest-entry links, the hub JSON routing files and the Hermes mirror all carry the decided version (T039, T037). Evidence 2026-10-25: T037 and T039. The sk-code README newest-entry link at line 191 names v3.0.0.0. The sk-code and sk-doc hub JSON routing files carry 3.0.0.0 and 2.3.13.0.
- [x] CHK-FIX-004 [P1] The 49 audit items are listed by file and line before the first edit (T005). Evidence 2026-10-26, with a deviation: the writers worked each item from the coordinator's audit output, and T005 sampled ten phrases at base before any edit. The full list by file and line was written into this file only at closure, in the table below, so the order the check names was not kept.
- [x] CHK-FIX-005 [P1] Evidence is pinned to the base commit `bb9b9d1c09`, not to a moving branch range. Evidence 2026-10-25: every base check used bb9b9d1c09.

### Audit Item Dispositions

Each row is one doc-fix item from the closure audit, with the file and line it named at base `bb9b9d1c09`.

| # | File and line | Item | Disposition |
|---|---|---|---|
| 1 | `.skilled/skills/sk-code/README.md:135` | 'Add Your Own Surface' step 3 says to add the new surface's markers to stack-detection.md and to update 'the count in ... | T008 |
| 2 | `.skilled/skills/sk-code/README.md:133` | Says the doctor's check 5l 'fails' a surface placed after sk-code-skilled. | T008 |
| 3 | `.skilled/skills/sk-code/changelog/v2.4.0.0.md:24` | Claims the runtime keywords 'build matrix' and 'branch ruleset' keep a test matrix or scorer ruleset out of the CI surface. | T006, recorded in v3.0.0.0. The released v2.4.0.0 entry is not edited (REQ-005) |
| 4 | `.skilled/skills/sk-code/sk-code-review/references/review-core.md:68` | Says detected code surface -> SKILLED, else UNKNOWN. | T012 |
| 5 | `.skilled/skills/sk-code/sk-code-review/README.md:153` | The related-skills table lists only sk-code-skilled as a surface evidence packet. | T012 |
| 6 | `.skilled/skills/sk-code/sk-code-quality/SKILL.md:215` | The output template reads `resolved_surface: <skilled / unknown>`. | T015 |
| 7 | `.skilled/skills/sk-code/sk-code-quality/SKILL.md:325` | The link label calls references/code-style-guide.md 'Shared code style and comment hygiene guidance'. | T015 |
| 8 | `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:27` | The page lists active doctor bridges as only '/doctor:deep-loop, /doctor:mcp install and /doctor:mcp debug'. | T019 |
| 9 | `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md:31` | The Ranking section says nothing about the read-only confidence floor exemption added in this window. | T019 |
| 10 | `.skilled/skills/system-skill-advisor/README.md:152` | The paragraph ends with 'a daemon started without it indexes no private skill'. | T020 |
| 11 | `.skilled/skills/system-spec-kit/runtime/cli/hermes/README.md:21` | The row presents a complete skip list (node_modules, dist, .state, scratch, benchmark, fixtures, z_archive). | T023 |
| 12 | `.skilled/skills/system-spec-kit/ARCHITECTURE.md:105` | It says the spec-kit-check workflow runs `npm run check` on every pull request that touches the skill. | T023 |
| 13 | `.skilled/skills/sk-doc/sk-create-skill/references/skill/upgrading-a-skill-to-v4.md:134` | The line says the live sk-code hub uses the hub-prefixed surface folders `sk-code-acme` and `sk-code-skilled`. | T028 |
| 14 | `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:131-143` | The Violation codes table omits GRAPH_METADATA_INVALID_SURFACE_DETECTION, which the gate now emits for a bad `surface_detection` block. | T028 |
| 15 | `.skilled/skills/sk-doc/sk-create-skill/references/shared/skill-root-metadata-contract.md:121` | The line says the gate discovers roots from `SKILL.md`, with no exception. | T028 |
| 16 | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-hub-router-schema.md:27, 69, 100, 111, 123, 151-154, 192-195, 242-256` | The worked example says sk-code "publishes two workflow modes ... | T028 |
| 17 | `.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:58, 171, 284` | Line 171 calls sk-code the "Canonical live example" with surface packets `code-webflow` and `code-skilled`. | T028 |
| 18 | `README.md:1239, 1266-1268` | Says 'Ten commands check and repair the setup' and its DOCTOR section has no /doctor:ci entry. | T031 and T032 |
| 19 | `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:3, 17, 25, 37-48` | Speaks of 'The seven doctor routers' and never lists /doctor:ci. | T024 |
| 20 | `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:884` | The doctor overview description repeats 'The seven doctor routers ...' and leaves out /doctor:ci. | T024 |
| 21 | `.skilled/skills/system-spec-kit/feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:3, 17-27` | Says 'Seven doctor routers dispatch 14 route-specific YAML workflows'. | T024 |
| 22 | `.skilled/commands/doctor/assets/doctor-setup.yaml:52` | Says the target list prints 'one row per route (command plus target), plus /doctor:update, /doctor:env and /doctor:mcp'. | T035 |
| 23 | `.github/workflows/README.md:36, 76-95` | The gate-inputs.yml row says only 'every hook and workflow input resolves', but the checker now also scans composite actions. | T036 |
| 24 | `.github/workflows/README.md:65` | This one predates the program (cron added in 2dd10ec595a on 2026-08-29). | T036 |
| 25 | `.skilled/skills/sk-code/sk-code-ci/SKILL.md:90` | Says 'the acting mode or a doctor command applies any change' but does not name /doctor:ci, which is the command that scaffolds from this packet's ... | T014 |
| 26 | `README.md:1239` | The DOCTOR group intro says 'Ten commands check and repair the setup, one per area.' There are now eleven doctor command files, because /doctor:ci ... | T031 |
| 27 | `README.md:1266-1268` | The DOCTOR section (README.md:1241-1291) has no entry for /doctor:ci, even though it is a shipped command listed in ... | T032 |
| 28 | `README.md:1502-1516` | 'Off Switches' says 'The AI hooks, the validators and the git hooks all have off switches' and says nothing about the six CI repository variables. | T033 |
| 29 | `README.md:768-772` | The sk-code entry says 'One native surface. | T034 |
| 30 | `README.md:1451-1457` | 'What Adapting sk-code Looks Like' says 'sk-code ships one native surface', which is now false because sk-code-ci also ships. | T034 |
| 31 | `.skilled/skills/sk-code/README.md:106-108` | Section 5 'Adapting To Your Stack', which the root README links as the step-by-step guide, covers adding a surface inside the hub only. | T009 |
| 32 | `.skilled/commands/README.txt:101-113` | The section 3 STRUCTURE tree under doctor/ lists ten command files and leaves out ci.md, though the overview table (line 46) and the section 4 ... | T035 |
| 33 | `.skilled/skills/README.txt:60` | The sk-code catalog row lists the surface evidence packets as only `sk-code-skilled`. | T035 |
| 34 | `.github/workflows/README.md:14-21, 107-109` | The workflows README documents the switches (section 'On/off switches') but says nothing about the composite setup action `.github/actions/setup` ... | T036 |
| 35 | `.skilled/changelog/skilled/README.md:22-26` | The folder overview is stale. | Rejected. The framework changelog folder is out of scope (spec.md, REQ-005). The writer's edit was reverted before any commit and saved for the operator (deviation d) |
| 36 | `.skilled/skills/sk-code/sk-code-skilled/README.md:36` | Says the Skilled surface 'is the hub's only surface packet' and that 'The hub detects the .skilled/ surface first'. | T011 |
| 37 | `.skilled/skills/sk-code/ROUTER.md:26, 30, 41, 189, 214` | These lines list the detected surface as only 'SKILLED / UNKNOWN'. | T010 |
| 38 | `.skilled/skills/sk-code/README.md:90` | 'The shared router keeps surface identity consistent across every mode and surface for the native SKILLED surface' describes a single-surface hub. | T008 |
| 39 | `.skilled/skills/sk-code/sk-code-ci/README.md:43, 74-82` | Says 'The acting mode or a doctor command applies any change it recommends' but never names /doctor:ci. | T014 |
| 40 | `.skilled/skills/sk-code/README.md:152, 174` | The setup and verification text names only /doctor:sk-code. | T009 |
| 41 | `.skilled/skills/sk-code/feature-catalog/feature-catalog.md:33-35, 9` | The root catalog's Current Reality for two-axis routing lists the modes and surfaces but says nothing about the declared surface detection order: ... | T016 |
| 42 | `.skilled/skills/sk-code/manual-testing-playbook/manual-testing-playbook.md:38-41` | The coverage note lists 'SKILLED surface detection' and 'UNKNOWN fallback' as the only surface behaviour covered. | T017 |
| 43 | `.skilled/skills/system-skill-advisor/manual-testing-playbook/doctor-commands/doctor-setup-run.md:29, 71` | Says the /doctor:setup target table 'has 17 rows'. | T021 |
| 44 | `.skilled/skills/system-spec-kit/feature-catalog/maintenance/doctor-router-and-manifest-dispatch.md:17-27, 53` | The router list ('Seven doctor routers ...') and the mutation-class list leave out /doctor:ci and its three routes. | T024 |
| 45 | `.skilled/skills/system-spec-kit/feature-catalog/doctor-commands/category-overview.md:3, 17, 25, 29, 45-48` | The doctor command overview names seven routers plus standalone companions and never mentions /doctor:ci. | T024 |
| 46 | `.skilled/skills/system-spec-kit/feature-catalog/feature-catalog.md:884` | 'The seven doctor routers split checks by owner (...)' leaves out /doctor:ci. | T024 |
| 47 | `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md:26` | The cross-playbook list of where each doctor command is tested names every doctor command except /doctor:ci. | T025 |
| 48 | `README.md:770` | The root README sk-code entry says 'One native surface.' The hub now has two surfaces: the native Skilled surface and the sk-code-ci GitHub ... | T034 |
| 49 | `README.md:213, 1264-1290` | The root README's Doctor section lists every doctor command except /doctor:ci, and the line 213 summary leaves it out too. | T032 and T033 |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Added lines contain no credential, no concrete operator-private skill name and no private path (T044). Evidence 2026-10-25: T044 em dash count 0 and local-name count 0 per commit. Private path scan of added lines 0. Credential pattern scan 0.
- [x] CHK-031 [P1] N/A: the packet adds no input handling.
- [x] CHK-032 [P1] N/A: the packet changes no authorization surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks and acceptance criteria name the same eleven entries and the same blocked item. Evidence 2026-10-25: all four packet docs state 2.3.13.0 for the sk-doc hub and name the same eleven entries and the same open items.
- [x] CHK-041 [P1] N/A: no code comments change.
- [x] CHK-042 [P1] The root README DOCTOR section names `/doctor:ci` (T032, AC-003). Evidence 2026-10-25: `rg -n 'doctor:ci' README.md` printed line 1268, between the DOCTOR heading at line 1237 and the UTILITY heading at line 1300.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files live outside the repository. The packet's `scratch/` folder holds only `.gitkeep`.
- [x] CHK-051 [P1] `scratch/` is still clean before completion: `ls -A specs/system-speckit/055-ci-efficiency-release-docs/scratch/` prints only `.gitkeep`. Evidence 2026-10-25: `ls -A` on scratch/ printed `.gitkeep` only.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 8/10 |
| P1 Items | 14 | 11/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->
