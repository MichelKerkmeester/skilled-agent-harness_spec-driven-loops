---
title: "Tasks: Phase 25: release-notes-and-doc-sync"
description: "Ordered worker-sized tasks that collect the facts of phases 019 to 024 in one file, extend the open advisor changelog entry v1.1.0.0 with three sections inside its shape ceilings and correct six reference pages, then trace every added number back to a closed phase."
trigger_phrases:
  - "release notes and doc sync tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 25: release-notes-and-doc-sync

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
| `[C]` | Coordinator task: a gate, a fact collection, a check over every file or the close-out. No worker runs it |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Every command runs from the repository root unless a task says `in ADV`. Set the path names once with `export SKA=.skilled/skills/system-skill-advisor ADV=.skilled/skills/system-skill-advisor/runtime SKD=.skilled/skills/sk-doc PK=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build PH=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/025-release-notes-and-doc-sync SP=specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/025-release-notes-and-doc-sync/scratch`.
- `G` is `git -c core.fsmonitor=false`. `BASE` is the commit T001 records.
- `CL` is `$SKA/changelog/v1.1.0.0.md`. `LR` is `$ADV/lib/README.md` and `TR` is `$ADV/tests/README.md`. `FA` is `$SKA/feature-catalog/cli-surface/advisor-recommend.md`, `FM` is `$SKA/feature-catalog/scorer-fusion/command-meaning-matching.md` and `FD` is `$SKA/feature-catalog/scorer-fusion/doctor-command-routing.md`. `BR` is `$ADV/scripts/command-bridges/README.md`. `SEVEN` is those seven files.
- `FACTS` is `$SP/release-facts.txt`, the file T002 writes. It is the only source of a number, a file name or a behaviour sentence for every doc task.
- `SHAPE` is `python3 $SKD/sk-create-changelog/scripts/check_changelog_shape.py $CL`, which must print `PASS` for the file and `SUMMARY files=1 pass=1 fail=0`. `DOC <file>` is `python3 $SKD/shared/scripts/validate_document.py <file>`, which must exit 0. `HVR <file>` is `python3 $SKD/sk-create-with-human-voice/scripts/hvr_scan.py <file>`, read for findings on the lines the task added. `CAT` is `python3 $SKD/sk-create-feature-catalog/scripts/validate_catalog_package.py --package system-skill-advisor`, which must exit 0.
- `VX <file>` is `env -u AI_SESSION_CHILD npx vitest run <file>` in `ADV`.
- `ADDED <file>` is `G diff BASE -U0 -- <file> | rg '^\+[^+]'`, the lines the phase added to that file.

Rules for every task:
- Each task is one change to the one file it names: one section, one table row or one sentence. Re-read the file before the first edit. When a line, heading or string the task quotes is not in the file, change nothing and mark the task `[B]` with the line found in its place.
- A `.md` edit routes through `sk-doc` before the first write: read `$SKD/ROUTER.md` and load what it resolves. A changelog task loads the changelog mode, `$SKD/sk-create-changelog/SKILL.md` and `assets/changelog-template.md`, and follows its rules for extending an open entry. A README task loads `$SKD/sk-create-readme/assets/readme-code-template.md` for the row shape it edits. A feature catalog task loads `$SKD/sk-create-feature-catalog/references/README.md`. Where a loaded contract and this task line disagree, follow the contract and say so in the evidence.
- Every number, file name and behaviour sentence a task writes is in `FACTS` with the closed-phase file and line it came from. A fact that is not there is not written. No number is copied from this plan, from a spec of this phase or from memory.
- No sentence says or implies that the brief makes a model follow a correct workflow more often, and no rate is called a gain. The words that are true are: the measure counts a workflow opened before the first write, on tuned rows with one run each.
- A doc sentence holds no em dash and no semicolon, names no phase number, task id, finding id or spec path, and quotes no corpus prompt. An example prompt is one `FACTS` quotes from a committed test file or probe.
- No worker edits a code file, a test, a version carrier (`SKILL.md`, `description.json`, `hub-router.json`, `mode-registry.json`), another changelog entry, the root release note, `AGENTS.md` or another phase folder. No worker runs the full suite, a capture, a daemon or a model session.
- When a verify prints something other than the expected output, do not bend the text to match it. Mark the task `[B]` with the printed line.

Worker lanes. Lane C owns `CL` and runs T004 to T008 in order. Lanes L, T, F1, F2, F3 and B own `LR`, `TR`, `FA`, `FM`, `FD` and `BR` and run T009, T010, T011, T012, T013 and T014, one task each. The seven lanes share no file and run in parallel after T003. `[P]` marks the first task of each lane.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 [C] Confirm the six phases are closed and the entry is still open (`$SP/before.txt`). Run `rg -c '\*\*Status\*\* \| Complete' $PK/019-workflow-outcome-measure/spec.md $PK/020-command-offer-fit-guards/spec.md $PK/021-brief-head-parity/spec.md $PK/022-workflow-measure-soundness/spec.md $PK/023-untuned-outcome-evidence/spec.md $PK/024-fable-review-remediation/spec.md`, `G show origin/main:$SKA/SKILL.md | rg -c '^version: 1.0.0.0$'` on the `origin/main` this checkout already holds, with no fetch, `G status --porcelain -- SEVEN`, `G rev-parse --short HEAD`, `wc -l $CL`, `rg -c 'section:' $CL`, `rg -c '^#### ' $CL`, `SHAPE`, `DOC` on each of `SEVEN`, `CAT`, and `G diff --stat origin/main -- .skilled .opencode | rg -o '^ \.(skilled/skills/[^/]+|skilled/hooks/[^/]+|opencode/plugins)' | sort | uniq -c`, and write each command with its output or exit code into `before.txt`. Verify: the first `rg` prints 1 for each of the six files, the version check prints 1, the `status` prints nothing, `SHAPE` prints `SUMMARY files=1 pass=1 fail=0`, every `DOC` run and `CAT` exit 0 and `wc -l` prints at most 280. When a phase is not Complete or the version check prints nothing, stop and mark the phase `[B]` with that line: an entry that already shipped is not extended. When the component list names a skill other than `system-skill-advisor` whose files phases 019 to 024 changed, write it into the parent goal log as an item with no changelog entry and change nothing. Amended 2026-11-15, before any task ran: the first `rg` also runs over `$PK/026-untuned-behaviour-arm/spec.md`, `$PK/027-review-pass-four-remediation/spec.md` and `$PK/028-direct-call-off-switch/spec.md` and prints 1 for each, and the component check covers phases 026 to 028 as well. Evidence: before.txt: nine phases Complete (1 each), origin/main SKILL.md version 1.0.0.0 (1), SEVEN status empty, BASE 8a5f3214522, CL 168 lines, 9 tags, 17 H4, SHAPE pass, every DOC and CAT exit 0; the component list names other skills, logged in the goal log
- [x] T002 [C] Collect the facts (`FACTS`). For each of the six phases, in order, write a heading `## <number> <folder slug>` and under it copy, word for word and each with its source as `<file>:<line>`, the lines of that phase's `implementation-summary.md` that state what changed for a user, the files it changed, the numbers it printed and the limits it names. Under `## 024` also copy the Codex lines of `$PK/024-fable-review-remediation/scratch/rescore-delta.txt`. Under a last heading `## checks` write the last result line of each suite phase 024 recorded in its `scratch/after.txt`, the five floor lines of its `scratch/floor-after.txt` and the case count `VX tests/command-meaning-anchor.vitest.ts` prints. Write nothing that is not a copy. Verify: `rg -c -e '^## (019|020|021|022|023|024) ' $FACTS` prints 6, `rg -c -e '^## checks$' $FACTS` prints 1, `rg -c -e 'implementation-summary\.md:[0-9]+' $FACTS` prints at least 18 and `rg -c -e 'Tests +[0-9]+ passed' $FACTS` prints at least 1. Amended 2026-11-15, before any task ran: after `## 024`, write `## 026 untuned-behaviour-arm`, `## 027 review-pass-four-remediation` and `## 028 direct-call-off-switch` the same way. Under `## 026` copy the summary lines that say the harness was built and the arm was stopped before scoring, and no rate. Under `## checks` take the suite lines of `$PK/028-direct-call-off-switch/scratch/after.txt` and the floor lines of its `scratch/floor-after.txt`, which supersede phase 024's. The amended Verify reads 9 for the phase heading count over `^## (019|020|021|022|023|024|026|027|028) ` and at least 27 for the `implementation-summary.md:` references. Evidence: release-facts.txt: 9 phase headings, 1 checks block, 291 implementation-summary references, 9 Tests lines, VX meaning-anchor 28 passed; checks taken from the direct-call phase after.txt and floor-after.txt as amended
- [x] T003 [C] Record each stale statement (`$SP/stale-before.txt`). Run `rg -n -F '17 cases' $TR $FM`, `rg -n 'command-attach.ts' $LR`, `rg -c 'commandOnlyMentioned' $LR`, `rg -n -F 'only the top pick can carry' $FA`, `rg -c -e 'mention|refus|question about' $FA`, `rg -n -F 'Also: /doctor:' $FD $BR $SKA/README.md` and `rg -c -e 'uncertainty' $FM`, and write each command with its output. Verify: the first `rg` prints one line for each of the two files, the third and fifth print nothing, the fourth prints one line, and the `Also:` search prints one line for `FD`, one for `BR` and one for `$SKA/README.md`, the last of which holds `(<policy>)`. When a statement is no longer in its page, write that into the file and mark the task that corrects it `[B]`. Evidence: stale-before.txt: 17 cases in TR only (FM already reads 28, T012 amended), command-attach.ts row present, commandOnlyMentioned 0, top-only sentence 1 line, mention/refus/question 0, Also: one line each in FD, BR and the skill README, uncertainty 0
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

### Lane C: the changelog entry
- [x] T004 [P] Add the section `Command Fit` (`CL`). Place it directly after the section `No-Edit Prompts` and before `Renamed Command`, as an H2 with at most five H4 items, each two to four sentences, in the voice the entry already has. The items cover, from the `## 020` and `## 024` blocks of `FACTS`: a command the request only mentions, refuses or asks about is not offered, the refusal wordings added later (`no need to run`, `stop using`), a question about a command gets no start offer and a question mark ends the sentence before it, a request that states history and then asks (`please start it`, `why not use`) keeps its command, and a small correction inside an existing readme, catalog or playbook keeps the skill and carries no creation command. State the weak doctor cue only when `FACTS` holds a line for it. Verify: `rg -c '^## Command Fit$' $CL` prints 1, `rg -c '^#### ' $CL` prints at most 22, `wc -l $CL` prints at most 215 and `SHAPE` prints `SUMMARY files=1 pass=1 fail=0`. Amended 2026-11-15, before any task ran: the items also cover, from the `## 027` block, that a refusal over a list of commands refuses every command in it and that a question opening with `is the` before a command reads as a question. The section still holds at most five H4 items. Evidence: Command Fit 1 (after No-Edit Prompts, before Renamed Command), five H4 items covering mentions, refusals including the list and the /x form, questions including is the, small corrections and the weak cue (FACTS line 31), H4 22, 192 lines, SHAPE pass; the only ; is the file's &nbsp; spacer
- [x] T005 Add the section `One Head on Every Runtime` (`CL`). After T004. Place it directly after `Command Fit`, as an H2 with at most three H4 items from the `## 021` block of `FACTS`: the head row carries its command under every request shape, the OpenCode brief leads with the row that passed and asks for the top pick's route alone as every hook does, and the companion line prints its policy word and never repeats a command the head names. Verify: `rg -c '^## One Head on Every Runtime$' $CL` prints 1, `rg -c '^#### ' $CL` prints at most 25, `wc -l $CL` prints at most 235 and `SHAPE` prints `SUMMARY files=1 pass=1 fail=0`. Evidence: One Head on Every Runtime 1, after Command Fit, three H4 items (head row command, OpenCode passing row, companion policy word; the Also: /doctor:update (ask) example is in FACTS), H4 25, 208 lines, SHAPE pass
- [x] T006 Add the section `Workflow Measure` (`CL`). After T005. Place it directly after `One Head on Every Runtime`, as an H2 with at most five H4 items from the `## 019`, `## 022`, `## 023` and `## 024` blocks of `FACTS`: what the transcript summary counts (a run that opened the command's own workflow, the owning skill's own workflow, another mode, one that asked as its policy says, one that improvised and one that did nothing) with the load rate and the followed rate, the load shapes it reads (a read tool, a skill tool, a shell read, a prompt mirror, a Codex shell step), what it does not count (a search, a heredoc line, a write outside the checkout), the counts on sealed rows the capture prints, and one item named for the limits. The limits item holds this sentence word for word: `The rates count a workflow opened before the first write, on tuned rows with one run each, so they do not show that the brief makes a model follow a correct workflow more often.` Quote a rate only as `FACTS` prints it, with its runtime and arm, and quote at most one line of rates. Verify: `rg -c '^## Workflow Measure$' $CL` prints 1, `rg -c -F 'so they do not show that the brief makes a model follow a correct workflow more often' $CL` prints 1, `rg -c '^#### ' $CL` prints at most 30, `wc -l $CL` prints at most 265 and `SHAPE` prints `SUMMARY files=1 pass=1 fail=0`. Amended 2026-11-15, before any task ran: the section may hold a sixth item, from the `## 026` block only: a harness can now run the same fresh rows with the advisor off and on and pairs them per row, and its first arm was stopped before any scoring, so it gives no rate. The amended Verify caps `^#### ` at 31 and `wc -l` at 272. Evidence: Workflow Measure 1, six H4 items (paths and rates, load shapes, what does not count, sealed counts, limits with the exact sentence, the paired arm as not scored), H4 31, 238 lines, SHAPE pass; coordinator reworded the last item to say the first arm was stopped, without naming the operator
- [x] T019 Add one item to `Hook Health` (`CL`). After T006 and before T007. Added 2026-11-15 for phase 028. As the last H4 item of the section `Hook Health`, two to four sentences from the `## 028` block of `FACTS`: the direct `advisor_recommend` call now reads `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` or `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` set to `1` in the caller's own process and abstains before it asks a daemon or runs the local scorer, and the launcher no longer passes those names to a daemon it starts. Verify: `rg -c -F 'HOOK_DISABLED' $CL` prints at least 1, `rg -c '^#### ' $CL` prints at most 32, `wc -l $CL` prints at most 278 and `SHAPE` prints `SUMMARY files=1 pass=1 fail=0`. Evidence: Hook Health item The Direct Call Reads the Switch, placed before the closing Smaller Fixes list as the file keeps that list last; HOOK_DISABLED 1, H4 32, 242 lines, SHAPE pass
- [x] T007 Add the glance bullets and the opening sentence (`CL`). After T006. In `What's New at a Glance`, add at most five bullets in the form the list already uses, a bold sentence, one plain sentence and a section tag: at most two tagged `<!-- section: Command Fit -->`, one tagged `<!-- section: One Head on Every Runtime -->` and at most two tagged `<!-- section: Workflow Measure -->`. Place each group where its section sits among the sections, so the tags stay in section order. In `Why This Release`, add one or two sentences saying the release also stops offering a command where none fits the request and adds a measure of which workflow a run opened. Verify: `rg -c 'section:' $CL` prints at least 12 and at most 14, `rg -c -F '<!-- section: Workflow Measure -->' $CL` prints at least 1, `wc -l $CL` prints at most 275 and `SHAPE` prints `SUMMARY files=1 pass=1 fail=0`. Amended 2026-11-15, before any task ran: one more bullet may be tagged `<!-- section: Hook Health -->` for the T019 item, so the amended Verify reads at least 12 and at most 15 tags and caps `wc -l` at 285. Evidence: five glance bullets (two Command Fit, one One Head, two Workflow Measure), no optional Hook Health bullet; two sentences added to Why This Release; tags 14, Workflow Measure tags 2, 249 lines, SHAPE pass
- [x] T008 Bring the check numbers and the upgrade notes up to date (`CL`). After T007. In `How It Was Checked`, under `Tests and Scenarios`, replace the suite line with the file and test counts the `## checks` block of `FACTS` holds for the advisor suite, and add one line for the session reader tests and one for the floors (typed recall and false offers) as that block prints them. In `Upgrade Notes`, add one line only when `FACTS` names a field or a behaviour a caller must act on, such as a script that reads the `offered` count of the transcript summary. Add no other line. Verify: `rg -c -F '1,813 tests passed' $CL` prints nothing, every number in `ADDED $CL` under `How It Was Checked` appears in the `## checks` block of `FACTS`, `wc -l $CL` prints at most 280, `SHAPE` prints `SUMMARY files=1 pass=1 fail=0` and `DOC $CL` exits 0. Amended 2026-11-15, before any task ran: the amended Verify caps `wc -l` at 290. Evidence: suite line now 185 files, 2121 passed, 6 skipped (FACTS after.txt:26-27); floors line 24 of 44 and 0 of 35 (FACTS floor-after.txt:1-2); the session reader line was removed by the coordinator because the checks block of FACTS holds no session reader run; one upgrade note for the offered count, backed by the 022 block (offeredAs, partner); 1,813 gone, 251 lines, SHAPE pass, DOC exit 0

### Lane L: the lib README
- [x] T009 [P] Name the mention reader and the small-edit gate in the `command-attach.ts` row (`LR`). In the table row that starts ``| `command-attach.ts` |``, after the sentence that ends `gets no command.`, add two sentences from the `## 020` and `## 024` blocks of `FACTS`: ``commandOnlyMentioned()` reads how the prompt names a command, and a command the prompt refuses or asks about is not offered unless a later clause asks for it.`` and ``A correction inside an existing document carries no `/create:readme`, `/create:feature-catalog` or `/create:manual-testing-playbook`.`` Then run `rg -c '^import ' $ADV/lib/command-attach.ts`. When it prints a number, delete the row's sentence `The module has no imports.` When it prints nothing, leave that sentence. Verify: `rg -c 'commandOnlyMentioned' $LR` prints 1, `rg -c -F '/create:manual-testing-playbook' $LR` prints at least 1, the row is still one table line and `DOC $LR` exits 0. Evidence: commandOnlyMentioned 1, /create:manual-testing-playbook 1, row still one line, DOC exit 0

### Lane T: the tests README
- [x] T010 [P] Correct the case count of the meaning anchor test (`TR`). Run `VX tests/command-meaning-anchor.vitest.ts` and read the count on its `Tests` line. In the row that starts ``| `command-meaning-anchor.vitest.ts` |``, replace `17 cases` with that count and the word `cases`. When the row's list of what the cases cover leaves out a group the test file's `describe` and `it` names show, add that group in at most one clause. Verify: `rg -c -F '17 cases' $TR` prints nothing, the count in the row equals the count the test run printed and the count in the `## checks` block of `FACTS`, and `DOC $TR` exits 0. Evidence: row reads 28 cases (VX and FACTS 28), 17 cases gone, DOC exit 0

### Lane F1: the advisor recommend page
- [x] T011 [P] Correct the top-only sentence and state when a command is withheld (`FA`). In the paragraph that starts `The request option `options.compiledRouteTopOnly``, replace `so only the top pick can carry `compiledRoute` or `command`` with `so only the top pick can carry `compiledRoute`, and the first recommendation gets its `command` under every request shape`, after checking that sentence against the `## 021` block of `FACTS` and the handler line it names. Directly after the paragraph that starts `A hub also leaves `command` off`, add one paragraph of at most three sentences from the `## 020` block: `attachCommand()` returns no command when the prompt only mentions, refuses or asks about it, when the prompt rules out a change and when the prompt asks for a correction inside an existing readme, catalog or playbook. Verify: `rg -c -F 'only the top pick can carry `compiledRoute` or `command`' $FA` prints nothing, `rg -c -F 'under every request shape' $FA` prints 1, `rg -c -e 'refuses or asks about' $FA` prints 1, `DOC $FA` exits 0 and `CAT` exits 0. Evidence: old top-only clause gone, under every request shape 1, refuses or asks about 1, DOC and CAT exit 0

### Lane F2: the command meaning page
- [x] T012 [P] Correct the case count and state the uncertainty bar (`FM`). In the table row for `command-meaning-anchor.vitest.ts`, replace `17 cases` with the count in the `## checks` block of `FACTS` and the word `cases`. In the paragraph that starts `A meaning pass lifts a command past the read-only confidence floor`, add one sentence from the `## 020` block of `FACTS` that states the uncertainty bar a meaning-passed command row must clear before the brief shows it, with the name of the function that applies it as `FACTS` gives it. When `FACTS` holds no line for that bar, add no sentence and say so in the evidence. Verify: `rg -c -F '17 cases' $FM` prints nothing, `rg -c -e 'uncertainty' $FM` prints at least 1 or the evidence quotes the missing `FACTS` line, `DOC $FM` exits 0 and `CAT` exits 0. Amended 2026-11-15, before any task ran: the row already reads `28 cases`, so do not replace it: check that 28 matches the count the `## checks` block holds for `command-meaning-anchor.vitest.ts`, and mark this half `[B]` with both numbers when they differ. The uncertainty sentence half stands. Evidence: row already 28 cases, equal to the VX count in FACTS (no replace, as amended); uncertainty sentence added (rg 1), DOC and CAT exit 0. The sentence names requireCommandPhraseAnchor, which FACTS does not hold: it is backed by fusion.ts:901-906, where that function takes uncertaintyThreshold, and T016 traces it to that code line

### Lane F3: the doctor command page
- [x] T013 [P] Show the companion line with its policy word (`FD`). In the paragraph that starts `The renderer reads a generated lookup of runnable strings`, replace the companion line the page shows, the code span that starts ``Also: /doctor:<command>``, with ``Also: /doctor:<command> <target> (<policy>)``, and add after that sentence: `The policy is run, start or ask, and the line is left out when the head already names that command.` The same rule stands in `$SKA/README.md` on the line `stale-before.txt` records. Use its wording where the two would differ. Verify: `rg -c -F 'Also: /doctor:<command> <target> (<policy>)' $FD` prints 1, `rg -c -F 'left out when the head already names that command' $FD` prints 1, `DOC $FD` exits 0 and `CAT` exits 0. Evidence: companion line and left-out sentence 1 each, DOC and CAT exit 0

### Lane B: the command bridges README
- [x] T014 [P] Show the companion line with its policy word (`BR`). In the paragraph that starts `A doctor bridge passes on its own wording (an explicit-author phrase match).`, replace the code span that starts ``Also: /doctor:<command>`` with ``Also: /doctor:<command> <target> (<policy>)``, and add after that sentence: `The policy is run, start or ask, and the line is left out when the head already names that command.` Verify: `rg -c -F 'Also: /doctor:<command> <target> (<policy>)' $BR` prints 1, `rg -c -F 'left out when the head already names that command' $BR` prints 1, `DOC $BR` exits 0 and `VX tests/command-attach-guards.vitest.ts` reports 0 failed, because its case `the command-bridges README names every command row field` reads this file. Evidence: companion line 1, left-out sentence 1, DOC exit 0, command-attach-guards 146 of 146
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T015 [C] Run every document check (`$SP/after.txt`). Run `SHAPE`, `DOC` on each of `SEVEN`, `HVR $CL`, `CAT`, `python3 $SKD/sk-create-readme/scripts/check_readme_references.py $LR $TR $BR` when that script takes file arguments, `wc -l $CL`, `rg -c 'section:' $CL` and `rg -c '^#### ' $CL`, and write each command with its output or exit code into `after.txt`. Verify: `SHAPE` prints `SUMMARY files=1 pass=1 fail=0`, every `DOC` run and `CAT` exit 0, `wc -l` prints at most 280, the tag count is at most 14 and the item count at most 32, and `HVR` names no finding on a line in `ADDED $CL`. Evidence: after.txt: SHAPE SUMMARY files=1 pass=1 fail=0, DOC exit 0 on all seven, CAT exit 0, 251 lines, tags 14, items 32. Two deviations recorded in after.txt: check_readme_references exits 1 on eight paths that all predate this phase and sit on lines it did not change, and HVR lists seven review-level candidates on added lines (six clause-joining commas, one 'do not show' in the limits sentence) with no hard blocker, left as written
- [x] T016 [C] Trace every added number and claim (`$SP/fact-check.txt`). For each of `SEVEN`, list every number in `ADDED <file>` with the line of `FACTS` that holds it, and every behaviour sentence with the `FACTS` line and the code line that back it. Then run `ADDED $CL | rg -i -e 'more often|improv(es|ed) (the )?(rate|outcome)|gain|proves|shows that the brief'`. An independent verifier, not the session that wrote the lines, repeats the trace on the changelog. Verify: `rg -c -e '^UNTRACED' $SP/fact-check.txt` prints nothing, the gain search prints only the limits sentence T006 names, and `rg -c -e '^verifier: (PASS|FAIL)' $SP/fact-check.txt` prints 1 with `PASS`. Evidence: fact-check.txt: tracer wrote 129 TRACED, 1 TRACED-CODE-ONLY, 54 UNTRACED. Coordinator split the 54: 44 PREEXISTING and 3 PREEXISTING-WRONG (sentences present at BASE in single-line paragraphs the phase edited; the three BR sentences the code contradicts go to the summary as a follow-up), 3 new code-backed sentences relabelled TRACED-CODE-ONLY, the two-rates heading traced to FACTS:88, and 3 fixed (CL shell readers, CL first run, BR policy word gains parent-named only). Independent verifier on the changelog: 7 FAIL then all fixed, one reopened pronoun fixed, final verifier: PASS. UNTRACED 0, verifier line 1 PASS, gain search 1 line (the limits sentence)
- [x] T017 [C] Check the boundaries (`$SP/boundaries.txt`). Write each command with its output or exit code. Verify: `G diff --name-only BASE -- . ':!specs'` names exactly `SEVEN`, `G diff --quiet BASE -- AGENTS.md $SKA/SKILL.md $SKA/description.json` exits 0, `G diff --stat BASE -- '*.ts' '*.mjs' '*.cjs' '*.js' '*.json'` prints nothing outside `specs/`, `ls $SKA/changelog | rg -c '^v1\.1\.'` prints 1 and `ADDED $CL | rg -c -e 'specs/|REQ-0|ADR-0|AC-0|\bT0[0-9]{2}\b|\b[Pp]hase 0?[0-9]{2}\b'` prints nothing. Evidence: boundaries.txt: name-only diff outside specs names exactly the seven files; AGENTS.md, SKILL.md and description.json unchanged (exit 0); no code or json diff outside specs; one v1.1 changelog; the id search over added changelog lines prints nothing (ran without the word anchors, so broader than written)
- [x] T018 [C] Write the results and close the phase (`$PH/implementation-summary.md`). Copy `$SP/implementation-summary.scaffold.md` to `$PH/implementation-summary.md` and fill it: `BASE`, the seven files with what each gained, the line, tag and item counts of the changelog before and after, the case count used, every `[B]` task and the root release note item that waits on the operator. Mark each row of `acceptance-criteria.md` with the evidence observed, set the status in `spec.md` and the phase 25 row of `../spec.md` to `Complete`, append one row to the parent goal log with `node .skilled/hooks/goal/bin/goal.cjs packet-log $PK "<item> | <state> | <evidence>" --workspace "$PWD"` that names the entry extended and the six pages corrected, then run `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder $PH --apply`. Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $PH --strict` prints `RESULT: PASSED` and `rg -c "\| Unmet \|" $PH/acceptance-criteria.md` prints nothing. Evidence: implementation-summary.md written from the scaffold; AC 8 of 8 Met, Unmet 0; spec.md and parent row 25 Complete; goal row logged; repair-derived applied to the phase and the parent; validate --strict RESULT: PASSED (AC-001's check rewritten with three -e patterns, the same search, because the validator split the row on the pipes inside its regex)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `scratch/after.txt` holds `SUMMARY files=1 pass=1 fail=0` for the changelog
- [x] `scratch/fact-check.txt` holds no `UNTRACED` line and one `verifier: PASS` line
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **The changelog contract**: `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`
- **The pages phases 020 and 021 left**: the limitations lists of `../020-command-offer-fit-guards/implementation-summary.md` and `../021-brief-head-parity/implementation-summary.md`
- **The alignment finding**: C-01 in the parent goal log, row "Alignment P1 findings B-01 and C-01"
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A `[B]` task stops its lane only. The coordinator records the printed line in the parent goal log and decides. A fact that cannot be traced is removed from the page, never reworded until it passes.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] Phases 019 to 024 read `Complete` and `origin/main` ships advisor version 1.0.0.0 (T001).
- [x] CHK-002 [P0] `FACTS` holds six phase blocks and a `checks` block, each line with its source (T002).
- [x] CHK-003 [P1] `$SP/stale-before.txt` holds each stale statement as its page prints it (T003).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `SHAPE` prints `SUMMARY files=1 pass=1 fail=0` (T015).
- [x] CHK-011 [P0] `DOC` exits 0 on each of the seven files and `CAT` exits 0 (T015).
- [x] CHK-012 [P1] No added line holds an em dash, a semicolon, a phase number, a task id or a spec path (T017).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every added number traces to `FACTS`, and the verifier line reads `PASS` (T016).
- [x] CHK-021 [P0] The gain search prints only the limits sentence (T016).
- [x] CHK-022 [P1] The case count in `TR` and `FM` equals the count the test run printed (T010, T012).
- [x] CHK-023 [P1] `VX tests/command-attach-guards.vitest.ts` reports 0 failed after the `BR` edit (T014).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No added line quotes a corpus prompt: every example prompt in `ADDED $CL` stands in `FACTS` with a test file or probe as its source.
- [x] CHK-031 [P1] No published release, tag or version carrier changed (T017).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] `FD`, `BR` and `$SKA/README.md` show the same companion line (T013, T014).
- [x] CHK-041 [P1] `LR` and `FA` describe the withheld command in words that agree with the changelog's `Command Fit` section (T004, T009, T011).
- [x] CHK-042 [P2] The changelog's glance bullets keep the order of its sections (T007).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] `FACTS`, the before, after and fact-check files live under `scratch/` (T002, T015, T016).
- [x] CHK-051 [P1] `G diff --name-only BASE -- . ':!specs'` names the seven files and nothing else (T017).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 9 | 0/9 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-11-14
<!-- /ANCHOR:summary -->

---
