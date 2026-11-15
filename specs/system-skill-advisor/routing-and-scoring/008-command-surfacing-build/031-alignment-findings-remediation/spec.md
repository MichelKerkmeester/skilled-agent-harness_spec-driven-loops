---
title: "Feature Specification: Phase 31: alignment-findings-remediation"
description: "A report-only alignment run on this branch found 4 P0 and 9 P1 findings. This phase fixes the in-scope ones: the command-reference validator learns `.vibe`, CI runs the three Vibe mirror checks, the release note stops saying a mentioned command is not offered, the advisor playbook covers the offer gates, the policy word and the Vibe document line, and four routing probes are tuned or declined against the floors. It proves the four P0 battery rows predate the branch and hands every other P2 back."
trigger_phrases:
  - "alignment findings remediation"
  - "phase 31 alignment findings remediation"
  - "vibe command reference allowlist"
  - "vibe mirror checks in ci"
  - "mention is not a request release note"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 31: alignment-findings-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 31 of 31 |
| **Predecessor** | 030-vibe-runtime-parity |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]` except T015, which is `[B]` because P07 was declined (the operator accepted the decline, Q073), every suite reports 0 failed, the floor and eval lines equal their before lines, `scratch/matrix-after.txt` shows each built finding line changed as SC-001 states, the fix is committed, the Opus review reports no open P0 or P1, the recheck result is recorded as REQ-012 states, `scratch/handback.md` lists every handed-back finding and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 31** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). On 2026-11-15 a report-only `/local-skilled-alignment` run read the whole branch against `origin/main` at head `07ab40fc211` (run folder `~/.local/state/local-skilled-alignment/352-command-surfacing-research/20261115T123946Z`, called RUN here). It reported 46 findings: 4 P0, 9 P1 and 33 P2, with 3 more overturned by its critic. The operator chose a new 008 phase for the work. The goal criterion is that a recheck of the branch reports 0 P0 and 0 P1, and section 10 explains why the recheck tool cannot print that on its own.

**Scope Boundary**: the command-reference validator, two CI workflows and their README line, the advisor release note and one feature catalog page, the advisor playbook with three new scenarios and its census test, and the routing metadata of the advisor and the doctor skill with the compiled skill graph. Every P2 not named here, the Vibe gaps packet 004 owns, the alignment tool's own surface map and every committed baseline stay as they are.

**Dependencies**:
- Phase 030 is Complete and committed, and the last catch-up merge `682ca792315` is in (T001 checks both).
- No model session runs here except the DeepSeek workers, the Opus verifiers and the one Opus reviewer the dispatch names.
- Main keeps moving: `origin/main` read `abf02ba1e6c` at the start of planning and `d67182e887b` at its end. Main has already fixed the three P0 battery rows that fail on this branch (section 2), so the next catch-up merge, which is the coordinator's call, clears them.

**Deliverables**:
- A command-reference validator that accepts `.vibe`, with its self-test green.
- CI that runs the three Vibe mirror checks and fires on a `.vibe/` change where it fires on a `.dsh/` change.
- A release note and a catalog page that state the offer rule the code ships.
- Three playbook scenarios that pass the package validator.
- A per-probe routing decision for P01, P02, P04, P07 and P11, each built and floor-gated or declined with its reason.
- A record of each P0 battery row on the merge base and on `origin/main`, and `scratch/handback.md` for every finding this phase does not build.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The branch ships the Vibe runtime rows, but the command-reference validator rejects the `.vibe/agents/` row this branch added and no CI job checks a Vibe mirror, so a Vibe drift can merge with every check green. The release note promises that a command the prompt only mentions is not offered while the code offers it, the playbook has no scenario for the offer gates, the policy word or the Vibe document line, five routing probes miss their skill, and four CI-gated battery rows fail with no record of whether this branch caused them.

### Purpose
Every in-scope P0 and P1 finding is either fixed with a check that failed before and passes after, or recorded as pre-existing with evidence from the merge base and `origin/main`, while the routing floors stay byte-equal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-15, worktree HEAD 07ab40fc211, run from the repository root. PH is this phase folder.
# The matrix prints one line per finding this phase builds or proves. It writes nothing in the checkout.

$ zsh $PH/scratch/planning/finding-matrix.sh
D01 validator   exit=1 FAIL  1 unresolved command reference(s):
D01 self-test   [self-test] real tree resolves clean: FAIL (1 unresolved)
X01 command-tree-parity   vibe-checks=0 vibe-filters=0 dsh-filters=2
X01 spec-kit-check   vibe-checks=0 vibe-filters=0 dsh-filters=0
D03 docs        only-mentions=3
D03 cli         ["the /create:sk-skill command is slow","sk-doc","/create:sk-skill","start"]
D03 cli         ["what does /create:sk-skill do","sk-doc",null,null]
BS401 playbook  scenario-files=50 new-ids=0 test-pin="live 50-scenario"
PRB P01         [["cli-external-orchestration","cli-mistral-vibe",0.95],["system-skill-advisor",null,0.845]]
PRB P02         [["sk-prompt",null,0.832],["sk-code",null,0.82]]
PRB P04         [["sk-prompt",null,0.82]]
PRB P07         []
PRB P11         [["sk-doc","sk-create-quality-control",0.82],["sk-code",null,0.82]]
BAT01 dist      system-spec-kit/runtime=stale
BAT01 dist      system-spec-kit/runtime/cli=stale
BAT02 package   FAIL package=system-spec-kit scenarios=124 violations=1
BAT06 links     check-markdown-links: 7603 files, 14899 links checked, 5 broken
BAT07 strict    failed-packages=[package=system-spec-kit]

$ node .skilled/commands/scripts/validate-command-references.cjs
FAIL  1 unresolved command reference(s):
  .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:160  [runtime-dir]  .vibe/agents/  (U+2014) not an allowlisted runtime dir (.skilled, .opencode, .claude, .codex, .cursor, .devin, .pi, .dsh)
$ git -c core.fsmonitor=false diff --stat origin/main -- .skilled/commands/scripts/validate-command-references.cjs .skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml
 .../commands/doctor/assets/doctor-runtime-mirrors.yaml     | 14 ++++++++++++--

$ for s in prompts agents skills; do node .skilled/skills/system-spec-kit/runtime/cli/vibe/sync-$s-vibe.cjs --check | tail -1; done
[vibe-prompt-sync] PASS: 45 prompt stubs are in sync.
[vibe-agent-sync] PASS: 11 agent profiles are in sync.
[vibe-skill-sync] PASS: 55 skill links are in sync.
$ actionlint .github/workflows/command-tree-parity.yml .github/workflows/spec-kit-check.yml; echo $?
0

$ printf '%s' '{"prompt":"/create:sk-skill for a new linter skill"}' | node .skilled/bin/skill-advisor.cjs advisor_recommend --json - --format json | jq -c '.data.recommendations[0] | {skillId, command, policy}'
{"skillId":"sk-doc","command":"/create:sk-skill","policy":"start"}
$ rg -n "only mentions" <the advisor skill and its docs>
.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:45:- **A mention is not a request.** A command the prompt only mentions, refuses or asks about is not offered.
.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:136:A command the prompt only mentions, refuses or asks about is not offered. A request that states history and then asks keeps its command.
.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:41:`attachCommand()` returns no command when the prompt only mentions, refuses or asks about it, ...

# The three offer gates, read from advisor_recommend (first two rows, skill command policy):
do not run /create:readme, just tell me what it covers  -> sk-doc null null
what does /create:readme do                             -> sk-doc null null
write a readme for the utils folder                     -> sk-doc /create:readme start
write a readme for the utils folder, no edits yet       -> sk-doc null null
fix the typo on line 12 of the scripts readme           -> sk-doc null null
Check my git hooks setup                                -> sk-git null null, command-doctor-git-setup /doctor:git setup run

# The policy word, Claude hook dist, TMPDIR in a temporary folder removed after the run:
child=0 Advisor: live; use sk-git 0.83/0.16 pass.  /  Also: /doctor:git setup (run)
child=1 Advisor: live; use sk-git 0.83/0.16 pass.  /  Also: /doctor:git setup (run)
child=0 [update skilled to the latest version] Advisor: live; use system-skilled-doctor → /doctor:update (ask) 0.82/0.20 pass.
child=1 [update skilled to the latest version] Advisor: live; use system-skilled-doctor → /doctor:update (parent-named only) 0.82/0.20 pass.

# The Vibe document line, buildAdvisorPart with AI_SESSION_CHILD unset and TMPDIR and the state folder temporary:
Advisor: live; use sk-doc → /create:readme (start) 0.95/0.12 pass.
Command documents (read in full before taking one): /create:readme is .skilled/commands/create/readme.md.

$ node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json --top=3 -- "the linter does not appear in my tool list" | jq -c '.candidates'
[]

$ git check-ignore -v .skilled/skills/system-spec-kit/runtime/dist .skilled/skills/system-spec-kit/runtime/cli/dist
.gitignore:60:dist/	.skilled/skills/system-spec-kit/runtime/dist
.gitignore:60:dist/	.skilled/skills/system-spec-kit/runtime/cli/dist
$ npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check 2>&1 | tail -4
  Stale dist for system-spec-kit/runtime entry default; build with: cd .skilled/skills/system-spec-kit/runtime && npm run build
  Stale dist for system-spec-kit/runtime/cli entry default; build with: cd .skilled/skills/system-spec-kit/runtime/cli && npm run build
  compiled siblings beside a source: 0 undeclared, 0 declared
exit 1

$ zsh $PH/scratch/planning/extract-check.sh origin/main
ref origin/main d67182e887b
links    check-markdown-links: 7603 files, 14910 links checked, 0 broken
package  PASS package=system-spec-kit tier=FAIL_CLOSED scenarios=125 categories=9 operator=111 routing_gold_excluded=14 violations=0 warnings=2
strict   failed-packages=[] errors=0
$ zsh $PH/scratch/planning/extract-check.sh 28a6d40f81f      # the merge base RUN names
ref 28a6d40f81f 28a6d40f81f
links    check-markdown-links: 7601 files, 14899 links checked, 5 broken
package  FAIL package=system-spec-kit tier=FAIL_CLOSED scenarios=124 categories=9 operator=110 routing_gold_excluded=14 violations=1 warnings=2   BAKED_RUN_TRANSCRIPT tooling-and-scripts/setup-native-module-health-and-mcp-installation.md:55 dated run evidence appears in scenario truth
strict   failed-packages=[package=system-spec-kit] errors=0
$ zsh $PH/scratch/planning/extract-check.sh HEAD
ref HEAD 07ab40fc211
links    check-markdown-links: 7601 files, 14899 links checked, 5 broken
package  FAIL package=system-spec-kit tier=FAIL_CLOSED scenarios=124 categories=9 operator=110 routing_gold_excluded=14 violations=1 warnings=2   BAKED_RUN_TRANSCRIPT tooling-and-scripts/setup-native-module-health-and-mcp-installation.md:55 dated run evidence appears in scenario truth
strict   failed-packages=[package=system-spec-kit] errors=0
$ find "${TMPDIR%/}" -maxdepth 1 -name 'align-*' | wc -l
       0
$ for f in <the playbook file> <the three link sources>; do git diff --quiet 28a6d40f81f -- $f; echo $?; done
0 0 0 0

$ FLOOR; EVAL      # the two capture commands tasks.md names
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":2,"attached":0,"combined":2,"total":44}
[160,49,21,5]
$ node $RAD/capture-command-routing-baseline.mjs | jq -c '.attachedMetrics.typed'
{"own":24,"attached":19,"combined":43,"total":44}
```
<!-- /ANCHOR:measured-behavior -->

Each in-scope finding reproduces. The validator exits 1 on the `.vibe/agents/` row, and the diff shows this branch added that row and left the validator as it was, so D-01 is the branch's. Neither workflow names a Vibe check, while `command-tree-parity.yml` filters on `.dsh/**` twice and `spec-kit-check.yml` names no DSH check and no `.dsh/**` filter at all. A bare naming of `/create:sk-skill` is offered with `start`, and the two docs say three times that a mention is not offered. The playbook holds 50 scenarios and no scenario for any of the five behaviours B-S4-01 names. Probes P02, P04, P07 and P11 miss their skill and P01 puts the advisor second at 0.845.

Three P0 rows predate the branch. On the merge base `28a6d40f81f` the link check finds 5 broken links and the playbook package fails on `BAKED_RUN_TRANSCRIPT`, the four files behind those rows are byte-equal on the branch, and `origin/main` passes all three because main fixed them after the last catch-up merge. BAT-01 is a local build state: both `dist` folders are gitignored and stale, so `git archive` cannot test it. The probe compares the top `skillId` with the expected id exactly (`run-probes.cjs:97-99`), which is why the critic refused P08, whose top row was the right doctor command. The helper ranker returns no candidate for the P07 prompt, so its strong cue `does not appear` never reaches a hand-off.

### Mechanism per Path

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `SAD` is `.skilled/skills/system-skill-advisor` and `PB` is `SAD/manual-testing-playbook`.

| Finding | Where it comes from | Decision |
|---------|---------------------|----------|
| D-01 (P1), BAT-05 (P2) | `RUNTIME_DIR_ALLOWLIST` lists eight runtime folders and no `.vibe` (`.skilled/commands/scripts/validate-command-references.cjs:46`), while the doctor mirrors asset names `.vibe/agents/` at line 160 | Append `'.vibe'` last, the exact string RUN's literal fix names, so the recheck reads it resolved (D1 in `plan.md`, T003) |
| X-01 (P1) | `command-tree-parity.yml:143-148` runs the three DSH checks in the `dsh-mirror` job and filters on `.dsh/**` at lines 19 and 45. `spec-kit-check.yml:321-332` runs nine mirror checks with no DSH or Vibe line | Three Vibe lines beside the DSH step and in the mirror parity step, `.vibe/**` beside each `.dsh/**` (D2, T004) |
| D-03 (P1) | `typedCommandForTop` (`ADV/lib/command-attach.ts:253-261`) and `attachCommand` both withhold a command only when `commandOnlyMentioned` sees an ask or decline lead (`:414-445`). `SAD/changelog/v1.1.0.0.md:45`, `:136` and `SAD/feature-catalog/cli-surface/advisor-recommend.md:41` say a mention alone is not offered | The operator's answer: the docs change and the code stays (D3, T005) |
| B-S4-01 (P1) | NC-011 is the only command-attachment scenario (`PB/native-cli-tools/hub-command-attachment.md`). The census test pins 50 scenarios three times (`ADV/tests/manual-testing-playbook.vitest.ts:45-58`) and the root playbook states 50 at lines 36, 40 and 133 | Three new scenarios, NC-012, CL-009 and CL-010, one test-first task each (D4, T006 to T008) |
| PRB-01 (P01) | cli-mistral-vibe ranks first at 0.95, the advisor second at 0.845 | Declined (D5) |
| PRB-02 (P02), PRB-03 (P04), PRB-06 (P11) | The advisor's `intent_signals` hold no Vibe, hook-health or transcript phrase (`SAD/graph-metadata.json`). D-04 is the same gap | Phrases in the advisor's `intent_signals`, one probe per task, each floor-gated (D5, T009, T011, T013) |
| PRB-04 (P07) | No skill passes, and the helper ranker returns no candidate | A phrase in the doctor skill's `intent_signals`, floor-gated (D5, T015) |
| BAT-01 (P0) | Gitignored `dist` folders older than their sources | Rebuild both and rerun the check (D6, T002) |
| BAT-02, BAT-07 (P0) | `tooling-and-scripts/setup-native-module-health-and-mcp-installation.md:55`, byte-equal to the merge base, fixed on main | Recorded as pre-existing with both extracts (D6, T002) |
| BAT-06 (P0) | Five links into `specs/hooks-plugins-extensions/goal-and-directive-hooks/`, a folder no tree holds, from three benchmark `source.md` files byte-equal to the merge base, fixed on main | Recorded as pre-existing with both extracts (D6, T002) |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Accept `.vibe` in the command-reference validator, and run the three Vibe mirror checks in CI with `.vibe/**` beside each `.dsh/**` filter.
- Correct the release note and the catalog page to the offer rule the code ships, and fold in one Vibe sentence the release note lacks (C-05).
- Add three advisor playbook scenarios for the offer gates, the policy word and the Vibe document line.
- Tune or decline each upheld probe against the floors, and prove or rebuild each P0 battery row.
- Write `scratch/handback.md` for every finding this phase does not build, and run the recheck report-only.

Restraint pass. Building nothing fails for D-01, X-01, D-03 and B-S4-01: each matrix line above shows the gap. The three scenario files are new because no scenario runs the offer gates, the Claude hook in a child session or the Vibe hook, and folding three withholding gates into NC-011 would make one pass or fail answer for six rules. Each probe change is one phrase list in a file that exists. No new module, option, layer or dependency. The planning probes live in this folder.

### Out of Scope
Each item is listed in `scratch/handback.md` with its file and owner.
- **Every P2 not named in scope**, including A-01, A-02, B-S2-01 to B-S2-03, B-S3-01, B-S3-02, X-02 to X-06, C-02, C-04, C-06, C-07, C-09, D-02, D-05, ENV-01 and BAT-03 and BAT-04, and the pre-existing P2s A-03 to A-05, B-S4-02, C-01, C-08, D-06 and D-07. D-04 is closed only if T009 lands a Vibe phrase.
- **The Vibe gaps of packet 004.** The operator's answer of 2026-11-15 keeps them with 004. That includes `.vibe/SYNC.md:115`, which says no CI job names a Vibe generator and becomes false once T004 lands.
- **The alignment surface map's S11 row.** `.skilled/commands/assets/local-skilled-alignment` is a link into the main checkout's private command, and the change is three check rows and two globs, not one line.
- **A catch-up merge of `origin/main`.** It would clear BAT-02, BAT-06 and BAT-07 on this branch, and it is the coordinator's call.
- **Hand edits to the three P0 files main already fixed.** They would collide with main's fix at the next merge.
- **A code change to `commandOnlyMentioned`.** The operator's answer keeps the code.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/scripts/validate-command-references.cjs` | Modify | `.vibe` joins the runtime folder allowlist |
| `.github/workflows/command-tree-parity.yml` | Modify | `.vibe/**` beside `.dsh/**` twice, and a Vibe step after the DSH step |
| `.github/workflows/spec-kit-check.yml` | Modify | Three Vibe lines at the end of the mirror parity step |
| `.github/workflows/README.md` | Modify | Line 30 names the Vibe copies |
| `SAD/changelog/v1.1.0.0.md` | Modify | The offer rule at lines 45 and 136, and one Vibe sentence |
| `SAD/feature-catalog/cli-surface/advisor-recommend.md` | Modify | The offer rule at line 41 |
| `PB/native-cli-tools/command-offer-fit-gates.md` | Create | NC-012, the refusal and ask gate, the no-edit gate and the small-edit gate |
| `PB/cli-hooks-and-plugin/brief-command-policy-word.md` | Create | CL-009, the policy word on the head and the companion line in a parent and a child session |
| `PB/cli-hooks-and-plugin/vibe-command-documents.md` | Create | CL-010, the Vibe command-document line |
| `PB/manual-testing-playbook.md` | Modify | Census, category rows and coverage for the three scenarios |
| `ADV/tests/manual-testing-playbook.vitest.ts` | Modify | The census pins move from 50 to 53 |
| `SAD/graph-metadata.json` | Modify | `intent_signals` phrases for P02, P04 and P11 |
| `.skilled/skills/system-skilled-doctor/graph-metadata.json` | Modify | `intent_signals` phrases for P07 |
| `ADV/scripts/skill-graph.json` | Modify | Recompiled from the two metadata files |

No other file outside this phase folder changes. A probe the floors decline leaves its metadata file and the compiled graph as they were.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node .skilled/commands/scripts/validate-command-references.cjs` exits 0 and its `--self-test` prints `real tree resolves clean: PASS`, and the allowlist line equals RUN's literal fix text with `'.vibe'` last. |
| REQ-002 | `command-tree-parity.yml` runs `sync-skills-vibe.cjs`, `sync-prompts-vibe.cjs` and `sync-agents-vibe.cjs` with `--check` after the DSH step and filters on `.vibe/**` in both trigger lists, `spec-kit-check.yml` runs the same three checks in its mirror parity step, `actionlint` exits 0 on both and the six check lines exit 0 when run by hand through `.opencode/`. |
| REQ-003 | The release note and the catalog page say a command the prompt refuses or asks about is not offered and a command named with no ask or decline lead is offered. `rg -c 'only mentions'` finds nothing in either file, and no file under `ADV/lib` changes. |
| REQ-004 | The advisor playbook holds 53 scenarios, NC-012, CL-009 and CL-010 among them, the census test passes at 53 after failing at 50, and `validate-playbook-package.cjs --package SAD/manual-testing-playbook` prints `PASS package=system-skill-advisor` with `scenarios=53` and `violations=0`. |
| REQ-005 | The floor lines and the eval line equal their before lines after every probe task and at the end, `BUILD` and `TC` exit 0, `VALL` reports 0 failed and `DT` reports `fail 0`. |
| REQ-006 | BAT-01: after both `dist` rebuilds, `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` exits 0 and `git status --porcelain` prints nothing new. BAT-02, BAT-06 and BAT-07: `scratch/battery-origin.txt` holds the extract lines for the merge base and for `origin/main` with its hash, and each row is recorded as pre-existing or, if the branch fails where both extracts pass, fixed by a new task. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | P02, P04 and P11 each end with the advisor as the top `skillId` and P07 with the doctor skill as the top `skillId`, or the probe's line in `scratch/probe-decisions.txt` names the moved floor or eval numbers that declined it. P01 is recorded as declined with its reason. |
| REQ-008 | After any metadata change, `skill_graph_compiler.py --validate-only`, `skill-graph-freshness.cjs --strict`, `ci-skill-root-metadata.cjs`, `ci-skill-derived-freshness.cjs`, `ci-leaf-manifest-freshness.cjs` and `generate-router-intent-signals.cjs --check` exit 0, and no `derived` block changes. |
| REQ-009 | NC-012 pins the three gates with the six prompts of the Measured Behavior block, CL-009 pins `(run)` on the read-only companion in both sessions and `(ask)` against `(parent-named only)` on `/doctor:update`, and CL-010 pins the `Command documents` line. Each expected line was observed by the worker before it was written. |
| REQ-010 | No code comment added here names a spec path, a phase, a task, a finding or a decision id, no added doc line holds an em dash or a semicolon, and the diff touches no file outside `FILES` and this folder, no row file, no committed baseline, no package file and nothing under `.vibe/`. |
| REQ-011 | One Opus reviewer reads the fix diff and reports 0 P0 and 0 P1, or each P0 and P1 it reports becomes a task that is fixed, committed and rechecked before the close-out. |
| REQ-012 | `/local-skilled-alignment --recheck=RUN` runs report-only and prints `new=0`. Its `resolved` list holds BAT-01, BAT-05 and D-01. Each other in-scope P0 and P1 id appears as `still_open` with a pre-existing record from T002, or as `needs_review` with the task line that resolved it, and every remaining `still_open` id is in `scratch/handback.md`. RUN still exists after the run. |
| REQ-013 | `scratch/handback.md` lists every P2 this phase does not build and the `.vibe/SYNC.md:115` line, each with its id, file and owner. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `zsh $PH/scratch/planning/finding-matrix.sh` prints `exit=0` and `PASS` on its two D01 lines, `vibe-checks=3 vibe-filters=2` for `command-tree-parity` and `vibe-checks=3 vibe-filters=0` for `spec-kit-check`, `only-mentions=0`, the same two D03 cli lines as before, `scenario-files=53 new-ids=3 test-pin="live 53-scenario"`, each PRB line T009 to T015 built with the expected skill first, and `fresh` on both BAT01 lines.
- **SC-002**: `cmp` of each floor and eval after file with its before file prints nothing and exits 0.
- **SC-003**: The recheck result reads as REQ-012 states.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Main keeps moving and already fixed three P0 rows | A hand fix here would conflict at the next merge | The rows are recorded, not edited, and T002 runs both extracts again at build time with the `origin/main` hash |
| Risk | A routing phrase tuned on one probe lifts or drops a sealed or fresh row | High: the holdout counts are the untuned evidence | Every probe change is gated by `cmp` of the floor and eval files, a move reverts it, and no task reads a fresh or sealed row |
| Risk | A phrase fits the probe's own words and nothing else | Med: the probe passes and a real paraphrase still misses | Each probe has one paraphrase written at planning (D5) whose result is reported, not gated |
| Risk | The metadata edit is made without the rescan or the recompile | Med: the CLI probe reads the old SQLite index, or CI's freshness check fails | Each probe task runs `skill_graph_scan --trusted` and the compiler, and REQ-008 gates the freshness checks |
| Risk | A Vibe CI step fails on a clean runner | Med: CI turns red on an unrelated pull request | Both jobs install the spec-kit workspace, the parity job now builds the shared package that `sync-agents-vibe.cjs` loads from `dist`, and T004 runs the exact lines through `.opencode/` |
| Risk | The census or a new link breaks a fleet check | Low | The census test and the link check run in T006 to T008 and in the gates |
| Risk | The recheck prunes RUN | Low: the before record is lost | The run root holds 5 runs and the prune keeps 10, and T023 checks RUN exists after |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: Each Vibe CI step adds three node runs to a job that already installed its workspace, and no new job or install.

### Security
- **NFR-S01**: No task reads, prints or logs a holdout or fresh prompt. `command-prompts.jsonl`, `holdout-prompts.jsonl` and `behaviour-fresh-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, and every `git diff`, `show` or `log -p` over a path that includes a row file excludes them.
- **NFR-S02**: The hook probes in CL-009 and CL-010 run with `TMPDIR` and the directive state folder in a temporary folder that the run removes, so no real health record or receipt changes.

### Reliability
- **NFR-R01**: A probe change that moves a floor is reverted with its rescan and recompile, so the checkout returns to the before state.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a checkout with no `.vibe/` tree still passes the validator, because the allowlist only widens, and the Vibe CI lines then report their own drift as they do for DSH.
- Maximum input: a prompt that refuses one command and asks for another keeps the second, as the existing or-list cases show. NC-012 pins one refusal, one question and one request.
- Failure path: a probe whose phrase moves a floor is declined and reverted. An extract whose validator prints no package line counts as cannot run, never as a failure on main.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Fourteen files, three new scenario files, about 550 lines, mostly playbook prose |
| Risk | 9/25 | One validator line and CI lines, two doc corrections and routing data gated by byte-equal floors |
| Research | 10/20 | Thirteen findings re-run, three battery rows traced to the merge base and to main, one decision taken by the operator |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None blocks planning. The planner asked no one. Each point the dispatch left open is decided below and recorded, open for the coordinator or the operator to overturn.

- A1. Level: `recommend-level.sh --loc 550 --files 16` printed Level 2, score 45.
- A2. The plan ran under `/speckit:plan :auto` with the setup bound by the dispatch: this folder, Level 2, execution mode auto, no relationships, research intent `fix_bug`. Confirm checkpoints were skipped, as `:auto` skips them. Step 5's four exploration agents were not dispatched, because this planner may dispatch none, and the same reads were done inline. Step 6 did not run `generate-context.js`, and no child `goal.md` was written, as in phases 024 to 030: the dispatch's finish step replaces the save. The summary scaffold sits in `scratch/` until the close-out.
- A3. The goal criterion cannot be printed by the recheck alone. `recheck.cjs` reruns only the failing battery rows and tests only literal findings (`classifyFindings` skips battery rows and files every judgment finding under `needs_review`), it never reruns probes, and the handed-back P2 rows stay `still_open`, so it prints `STATUS=OPEN` and exits 1. BAT-02, BAT-06 and BAT-07 also stay `still_open` until a catch-up merge. REQ-012 states what the recheck must show instead, and the 0 P0 and 0 P1 reading is the record of REQ-012 plus the per-task evidence.
- A4. The dispatch's test for the P0 rows, whether a check fails on `origin/main` too, gives the wrong answer here: main passes all three, so read literally it would call them branch-caused. The files are byte-equal to the merge base, which fails all three, so T002 records both extracts and calls a row pre-existing when the merge base fails it and the branch did not change its files.
- A5. There is no PRB-05. RUN numbered the findings by probe order and P08, its fifth failing probe, was refused by the critic. The upheld probes map as PRB-01 to P01, PRB-02 to P02, PRB-03 to P04, PRB-04 to P07 and PRB-06 to P11.
- A6. "Beside the DSH ones" applies to `command-tree-parity.yml` only. `spec-kit-check.yml` names no DSH check and no `.dsh/**` filter, so it gains the three checks in its mirror parity step and, by the dispatch's own rule, no `.vibe/**` filter. A Vibe-only change still fires `command-tree-parity.yml`, and the mirror comment in `spec-kit-check.yml` now says so.
- A7. The phase 20 row of the parent spec repeats the old offer sentence. It describes what that closed phase set out to build, so it stays, and the shipped docs carry the rule.
- A8. Workers are DeepSeek v4.1 flash max on OpenCode Go, one task per session, each checked by an Opus verifier before the next task in its lane, as the dispatch and phases 020 to 030 set.
<!-- /ANCHOR:questions -->

---
