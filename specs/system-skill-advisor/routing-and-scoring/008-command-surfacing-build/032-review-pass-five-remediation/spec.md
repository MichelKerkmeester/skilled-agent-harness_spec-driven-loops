---
title: "Feature Specification: Phase 32: review-pass-five-remediation"
description: "Review pass five confirmed 2 P1 and 29 P2 findings on this branch. This phase fixes them in four lanes: the transcript scorer counts an in-place shell edit as a write, the arena builder refuses a dirty source or a stale build and records what it copied, the runner checks for a remote before every live turn, the kill-switch docs and tests name every switch name, the Vibe hook and the doctor read what they claim, and eight docs match the code. The stored arms are rescored, the fix is reviewed by Opus and re-reviewed by DeepSeek on its own diff."
trigger_phrases:
  - "review pass five remediation"
  - "phase 32 review pass five remediation"
  - "in-place shell write scorer"
  - "arena builder stale dist refusal"
  - "remote guard every live turn"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 32: review-pass-five-remediation

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
| **Phase** | 32 of 32 |
| **Predecessor** | 031-alignment-findings-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, every suite reports 0 failed, the floor and eval lines equal their before lines, `scratch/probes-after.txt` shows each built probe line as SC-001 states, the stored arms are rescored with every moved figure restated, the fix is committed, the Opus review and the DeepSeek re-review leave no open P0 or P1, the pass-five synthesis is in `../review/review-report.md` and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 32** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). Review pass five read the code this branch changed since pass four with four DeepSeek lineages, one per area: `accuracy-runner-5`, `kill-switch-cli-5`, `vibe-hooks-doctor-5` and `docs-metadata-5` (`../review/deep-review-fanout-config-pass-5.json`). An Opus verifier graded every finding read-only at `2427bc4c4b6` and wrote `../review/verify-5/report.md`: 2 P1, 29 P2 and 1 rejected, with its probes in `../review/verify-5/probes/`. The merged registry `../review/deep-review-findings-registry.json` holds the same 32 rows under lineages that end in `-5`.

**Scope Boundary**: the transcript scorer, the arena builder, the behaviour runner and the offer replay with their tests and README, the advisor switch rows of `ENV-REFERENCE.md`, the CP-003 playbook scenario, two kill-switch tests and the lib README, the Vibe prompt part, the Claude prompt hook, the hook contract doc, the doctor wiring check and two doctor tests, and eight advisor docs and generated leaf files. Every finding the plan records rather than builds is listed in `plan.md` decision D13.

**Dependencies**:
- Phase 031 is Complete and committed, and the catch-up merge `2427bc4c4b6` is in HEAD (T001 checks both).
- No model session runs here except the DeepSeek workers, the Opus verifiers, the one Opus reviewer and the DeepSeek re-review lineages the plan names.
- `origin/main` read `534768825bf` at planning, 19 commits past the merge base `9414e518bd5`. Of every file this phase changes, main touched only `ENV-REFERENCE.md`, and only its Vibe key paragraph near line 512, never rows 74 and 75.

**Deliverables**:
- A transcript scorer that reads `sed -i`, `perl -i`, `tee`, `cp`, `mv`, `rm`, `mkdir` and `touch` as writes, reads a `COMMAND:` line only where it opens its line outside a quote or a fence, and tallies a command with and without its mode suffix together.
- An arena builder that refuses a dirty source, a stale copied `dist` and a copied symlink that leaves the source, names tracked dotenv files, copies with `cp -c` only on macOS, owns the marker name and records the source status in the marker.
- A runner that checks for a remote before every live turn, with comments that name the credential overrides as the push boundary.
- Kill-switch docs, a playbook control step and tests that name all ten switch names, and a lib README tree that matches the folder.
- A Vibe part and a Claude hook that read what they claim, a doctor wiring check that reads `match`, and a hook contract that names Vibe.
- Eight doc fixes, the regenerated leaf files, a rescore of the stored arms and the pass-five synthesis.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
The workflow measure misses every write a model makes with an in-place shell edit, so a run that edits a file with `sed -i` or `tee` reads as safe and as a non-start, and the goal log cannot explain `unsafe` row by row. The behaviour arena copies the working tree's build into a checkout of HEAD with no check that the two agree, so a live arm can measure a build nobody committed while its marker names the commit.

### Purpose
Both P1 findings read differently on their own probes after the fix, every confirmed P2 is fixed or recorded with its reason, the stored arms are rescored with each moved figure restated, and the routing floors stay byte-equal.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-15, worktree HEAD 1d9fdd6231e, run from the repository root.
# V5 is ../review/verify-5/probes, RAD is .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy,
# PH is this phase folder. No probe opens a row file, and each removes the folders it made.

# P1 one: in-place shell writes
$ node $V5/shell-inplace-write.mjs; echo "exit=$?"
redirect      kinds=write unsafe=true loopInit=false
sed -i        kinds=shell unsafe=false loopInit=null
perl -pi      kinds=shell unsafe=false loopInit=null
tee           kinds=shell unsafe=false loopInit=null
cp            kinds=shell unsafe=false loopInit=null
python write  kinds=shell unsafe=false loopInit=null
decline row, cat doc then redirect startedCommand=/deep:review
decline row, cat doc then sed -i   startedCommand=null
exit=0
$ node <normalize and startedCommand on one Bash call each, for /deep:review>
cat .skilled/commands/deep/review.md > notes.md      kinds=write startedCommand=null
cat .skilled/commands/deep/review.md | tee notes.md  kinds=shell startedCommand=null
cp .skilled/commands/deep/review.md x.md             kinds=shell startedCommand=null
cat .skilled/commands/deep/review.md                 kinds=shell startedCommand=null

# P1 two: the arena build is not the commit
$ bash $V5/arena-provenance.sh "$PWD/$RAD/prepare-behaviour-arena.mjs"; echo "exit=$?"
== A: source edited and rebuilt, nothing committed
{"ok":true,"dest":"/tmp/v5-arena-probe/arena-a","head":"c848b6f231dee9636f87d6993e9082c13941a0d4","copied":["dist"]}
builder exit=0
arena src.js: v1  arena dist/out.js: built-from-v2-uncommitted  marker head: c848b6f231de
== B: source committed clean at v3, dist still holds the v2 build
source status lines: 0
{"ok":true,"dest":"/tmp/v5-arena-probe/arena-b","head":"7a4fa8603fcbcc1ac56429e599d85bf369cdcf44","copied":["dist"]}
builder exit=0
arena src.js: v3  arena dist/out.js: built-from-v2-uncommitted
mtime src.js 1794763682.800127872  mtime dist/out.js 1794763682.861999988  source src.js 1794763682.322500046  source dist/out.js 1794763682.142556393
== C: a dist symlink that points outside the source
{"ok":true,"dest":"/tmp/v5-arena-probe/arena-c","head":"7a4fa8603fcbcc1ac56429e599d85bf369cdcf44","copied":["dist"]}
builder exit=0
dist/linked in arena: /tmp/v5-arena-probe/outside
outside file readable from the arena: yes
cleaned: yes
exit=0

# The same builder, one case per temporary source so no refusal hides the next case
$ bash $PH/scratch/planning/arena-cases.sh "$PWD/$RAD/prepare-behaviour-arena.mjs"; echo "exit=$?"
A exit=0 {"ok":true,"code":null} source-status-lines=1
B exit=0 {"ok":true,"code":null} source-status-lines=0
C exit=0 {"ok":true,"code":null} outside-readable=yes
D exit=0 {"ok":true,"code":null} marker-lines=1 marker-second-line=
E exit=0 {"ok":true,"code":null} arena-has-env-example=yes
exit=0
$ find "${TMPDIR%/}" -maxdepth 1 -name 'arena-cases.*' | wc -l
       0

# The stale rule of plan.md D2 measured on this checkout: every ignored dist tree copyPlan would copy,
# its newest file against the newest tracked file in its folder outside dist/ and node_modules/
$ node <a read-only walk in the shape of copyPlan, then git check-ignore and git ls-files per tree> "$PWD"
fresh .skilled/skills/mcp-code-mode/mcp-server/dist built=2026-11-12T09:35:09.911Z newestSource=2026-11-12T09:24:39.041Z
fresh .skilled/skills/sk-design/sk-design-md-generator/backend/dist built=2026-11-12T09:29:23.320Z newestSource=2026-11-12T09:24:39.656Z
fresh .skilled/skills/system-skill-advisor/runtime/dist built=2026-11-15T16:25:41.187Z newestSource=2026-11-15T16:24:49.381Z
fresh .skilled/skills/system-spec-kit/runtime/cli/dist built=2026-11-15T16:25:39.304Z newestSource=2026-11-15T16:24:49.241Z
fresh .skilled/skills/system-spec-kit/runtime/dist built=2026-11-15T16:32:46.734Z newestSource=2026-11-15T16:24:49.241Z
fresh .skilled/skills/system-spec-kit/shared/dist built=2026-11-15T10:53:44.703Z newestSource=2026-11-15T09:09:54.888Z
ignored dist trees=6 stale=0

# The P2 probes of the verifier
$ node $V5/command-line-cases.mjs
quoted marker commandLines [{"seq":0,"command":"/deep:review","state":"started","count":1}]
quoted marker startedCommand /deep:review
quoted marker startState {"started":true,"unsafe":false,"selfAuto":false}
suffix pair commandLines [{"seq":0,"command":"/deep:review","state":"offered","count":1},{"seq":0,"command":"/deep:review:auto","state":"started","count":1}]
same pair commandLines [{"seq":0,"command":"/deep:review","state":"offered","count":2},{"seq":0,"command":"/deep:review","state":"started","count":2}]
$ node $V5/remote-guard.mjs
turn 1 guard (the only call runTurn makes): null
status paths before 0 after 0 (the restore sees no change)
restoreTurn: {"restored":true,"leftoverPaths":[]}
remotes after restore: "origin"
guard if it ran before turn 2: {"ok":false,"code":"remote_present","remotes":["origin"]}
turn 2 push through the surviving remote: exit 0
guard with no remote: null
push to an explicit URL with no remote: exit 0
cleaned
$ node $V5/vibe-part.mjs
directive-only changed: true
directive-only tail: "Command documents (read in full before taking one): /speckit:save is .skilled/commands/speckit/save.md."
headed changed: false
parent_session_id set -> ""
agent_id only -> "Advisor: sk-doc 0.91"

# The doctor wiring check on a turn-start block Vibe runs only on an agent spawn, and on the real file
$ bash $PH/scratch/planning/wiring-match.sh .skilled/commands/doctor/scripts/hook-wiring-check.cjs; echo "exit=$?"
match=agents_spawn ok vibe exit=0
match=main ok vibe exit=0
exit=0
$ node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root . | grep vibe
ok vibe

# The Claude hook's fixed six-hop path to the shared resolver, from source and from dist
$ node -e '<resolve ../../../../../../hooks/shared/hook-flags.cjs from each file and test existsSync>'
system-skill-advisor/hooks/claude/user-prompt-submit.ts -> <the parent of the repository root>/hooks/shared/hook-flags.cjs false
dist/hooks/claude/user-prompt-submit.js -> <root>/.skilled/hooks/shared/hook-flags.cjs true

# The switch names the resolver honors for the advisor
$ node -e '<hookFlagDecision("skill-advisor", {MK_HOOKS_DISABLED:"1"}, {})>'
{"enabled":false,"key":"MK_HOOKS_DISABLED","reason":"master"}
$ node -e '<MASTER_FLAG, MASTER_ALIASES, concernFlag("skill-advisor"), LEGACY_ALIASES["skill-advisor"]>'
10 ["SYSTEM_HOOKS_DISABLED","MK_HOOKS_DISABLED","SYSTEM_SKILL_ADVISOR_DISABLED","SYSTEM_SKILL_ADVISOR_HOOK_DISABLED","SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED","MK_SKILL_ADVISOR_DISABLED","MK_SKILL_ADVISOR_HOOK_DISABLED","MK_SKILL_ADVISOR_PLUGIN_DISABLED","SPECKIT_SKILL_ADVISOR_HOOK_DISABLED","SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED"]
$ rg -c "MK_HOOKS_DISABLED|MK_SKILL_ADVISOR" .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md
(no output)
$ node -e '<hookFlagDecision("skill-advisor", {[alias]:"1"}, {}).enabled for each legacy alias>'
SYSTEM_SKILL_ADVISOR_HOOK_DISABLED false
SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED false
MK_SKILL_ADVISOR_DISABLED false
MK_SKILL_ADVISOR_HOOK_DISABLED false
MK_SKILL_ADVISOR_PLUGIN_DISABLED false
SPECKIT_SKILL_ADVISOR_HOOK_DISABLED false
SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED false

# Counts behind the docs findings
$ <each tracked top-level entry of runtime/lib missing from the README tree at :98-120>
NOT-IN-TREE advisor-disabled.ts
NOT-IN-TREE caller-context.ts
NOT-IN-TREE compiled-routing-flag.ts
NOT-IN-TREE df-idf.ts
NOT-IN-TREE private-skill-target.cjs
NOT-IN-TREE private-skill-target.ts
NOT-IN-TREE route-exclusions.ts
(folders on disk: auth compat cross-skill-edges daemon derived embedders freshness ipc lifecycle scorer shadow shared skill-graph utils, the tree names five of them)
$ <top-level .ts files of runtime/tests named in tests/README.md>
top-level listed 38 of 90
$ grep -c '"embeddingText"' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
47
$ git -c core.fsmonitor=false ls-files | grep -E '(^|/)\.env'
.env.example
specs/system-speckit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/graphrag-hybrid/.env.example
$ <symlinks under every dist and node_modules tree, and the tracked ones git clones>
links-in-build-trees=110 abs=0 outside=0
tracked symlinks 652, of them absolute and resolving outside the checkout: 4, all under specs/**/scratch

# Other files main changed since the merge base
$ git -c core.fsmonitor=false diff --stat 9414e518bd5 origin/main -- <every file this phase changes>
 .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md | 2 +-
 1 file changed, 1 insertion(+), 1 deletion(-)
```
<!-- /ANCHOR:measured-behavior -->

Both P1 findings reproduce at `1d9fdd6231e`. A redirect into a review file is a write and marks the run unsafe, while `sed -i`, `perl -pi`, `tee`, `cp` and a Python write to the same file stay a plain shell call. On a decline row a `cat` of the command document followed by `sed -i` gives no start, where the same `cat` and a redirect give `/deep:review`. The builder exits 0 on a source whose working tree holds an uncommitted edit (arena `src.js` reads `v1` while `dist/out.js` reads `built-from-v2-uncommitted`), and on a clean source whose `dist` is older than its source, so a clean-tree check alone would not close the gap.

The verifier graded `iter3-P1-remote-guard-first-turn-only` a P2 because the remote check was never the push boundary: with no remote at all a push to an explicit file URL exits 0. The registry still lists it as P1, and this plan grades it P2 as the verifier did. Three counts here differ from the verifier's. The lib README misses seven tracked files, which the verifier counted as six with the `.cjs` and `.ts` pair as one, and nine of its fourteen folders. The tests README names 38 of 90 top-level files, where the verifier counted 39 of 91. The build trees hold 110 links, where the verifier counted 80, and none of them leaves the checkout either way. The four tracked absolute links that do leave it arrive through `git clone`, which no `copyPath` change reaches.

### Mechanism per Path

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `SAD` is `.skilled/skills/system-skill-advisor`, `RAD` is `ADV/scripts/routing-accuracy` and `DS` is `.skilled/commands/doctor/scripts`.

| Finding | Where it comes from | Decision |
|---------|---------------------|----------|
| `iter1-P1-shell-writes-invisible` (P1) | `normalize` (`RAD/score-command-transcripts.mjs:372-415`) emits `write` only for a redirect or an `apply_patch` body. Every other shell call is `shell`. The read rule already skips `sed -i` (`:735-736`) | A write event per target for `sed -i`, `perl -i`, `tee`, `cp`, `mv`, `rm`, `mkdir` and `touch` (D1, T003) |
| `iter3-P1-arena-build-not-the-commit` (P1) | `buildArena` (`RAD/prepare-behaviour-arena.mjs:310-327`) clones HEAD, then `copyPlan` copies the source's ignored `dist` and `node_modules` and stamps each `dist` with the copy time. Nothing compares the source tree with HEAD or a build with its source | Refuse a dirty source and a stale `dist`, and record the source status in the marker (D2, T007) |
| `iter3-P1-remote-guard-first-turn-only` (graded P2) | `runTurn` calls `liveArmRefusal` only when `isFirst` (`RAD/run-command-behaviour.mjs:1264-1274`), and its caller passes `index === 0` (`:1403`). The comment at `:610-613` calls a remote the one way out | An exported `turnRefusal` before every live turn, and comments that name the `childEnv` credential overrides (`:1002`, `:1034-1035`) as the boundary (D3, T012) |
| Arena header sentence (seen outside, not graded) | `RAD/prepare-behaviour-arena.mjs:5-10` says a live turn cannot reach anything outside its checkout | Narrowed to remotes and credentials (D3, T013) |
| `iter1-P2-quoted-command-line-is-a-start` | `COMMAND_LINE` matches anywhere in a line (`RAD/score-command-transcripts.mjs:504-505`) | A marker counts only where it opens its line after list or emphasis markup, outside a quote or a fence (D4, T004) |
| `iter1-P2-mode-suffix-hides-repeat` | `commandLines` tallies the raw match (`:534-536`) | Tally on namespace and name through `commandParts` (D4, T005) |
| `iter2-P2-symlink-escapes-arena` | `copyPath` and `runCp` (`:226-269`) copy a link as a link | Refuse a link whose real path leaves the source (D5, T008) |
| `iter2-P2-tracked-dotenv-cloned` | `holdsDotenv` runs only in `copyPath` (`:218-224`, `:257-269`), and a clone brings every tracked file | Name tracked dotenv files in the output and the marker, and narrow the two sentences that say none arrives (D6, T009) |
| `iter2-P2-macos-only-copy-flag` | `runCp` always spawns `cp -Rc` (`:227`) | `-c` on darwin only, through an exported `copyArgs` (D7, T010) |
| `iter4-P2-marker-literal-duplicated` | `MARK` at `RAD/prepare-behaviour-arena.mjs:61` and `RAD/run-command-behaviour.mjs:523`, a literal at `RAD/command-offer.mjs:358`, and two tests that write it by hand (`ADV/tests/command-behaviour-guards.vitest.ts:286`, `ADV/tests/command-offer.vitest.ts:573`) | The builder exports `MARK` behind an entry guard and the others import it (D7, T006) |
| `iter4-P2-arena-copy-path-untested` | The builder cases commit only `AGENTS.md` and `CLAUDE.md` (`ADV/tests/command-behaviour-guards.vitest.ts:407-468`) | A case with an ignored `dist` holding a dotenv file (T011) |
| `iter2-P2-env-alias-column`, `iter2-P2-env-source-column` | `ENV-REFERENCE.md:74` says "No aliases" and `:75` lists four aliases and two sources | The master alias, the three `MK_` names and the three direct-call sources (D8, T015) |
| `iter2-P2-cp003-control-aliases` | `SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49` unsets 4 of the 10 names | All ten (T016) |
| `iter3-P2-launcher-switch-fixture` | `ADV/tests/launcher-bootstrap.vitest.ts:124-131` sets 2 of the 10 names | All ten (T017) |
| `iter3-P2-cli-mk-alias-filter` | `ADV/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:219-221` filters out every `MK_` name | The three `MK_` names join the cases (T018) |
| `iter3-P2-lib-readme-tree` | `ADV/lib/README.md:98-120` | Every tracked top-level file and folder (D8, T019) |
| `R1-P2-001` | `withCommandDocuments` (`SAD/hooks/vibe/prompt-advisor.mjs:123-127`) finds no `\nDirectives:` when the context starts with it, so the whole context counts as the head | A context that starts with `Directives:` comes back unchanged (T020) |
| `R4-P2-001` | `headReceiptDir` reads `process.env` (`:68-72`) while `buildAdvisorPart` takes `env` (`:203-206`) | The injected `env` reaches the receipt path (T021) |
| `R2-P2-001` | `skillAdvisorHookEnabled` counts six hops (`SAD/hooks/claude/user-prompt-submit.ts:68-77`), which leaves the repository from source | Walk up as `ADV/lib/advisor-disabled.ts:50-68` does (D9, T022) |
| `R3-P2-001` | `tomlCommands` keeps only `type` and `command` (`DS/hook-wiring-check.cjs:233-254`) | Read `match`, and accept a `pre_agent` block only when it is absent or `main` (D9, T023) |
| `R4-P2-002` | The test at `DS/tests/doctor-runtime-mirrors-contract.test.cjs:203` is named for DSH and walks DSH and Vibe | Renamed (T024) |
| `R2-P2-002`, `R3-P2-002` | `SAD/hooks/skill-advisor-hook.md:173` and `:175` split the aliases by adapter. `:3`, `:84` and the start table at `:102-112` omit Vibe | Every alias silences every adapter and the direct call, and Vibe joins all three places (T025) |
| `R1-P2-002` | Rejected by the verifier: `cli-mistral-vibe/references/guards-and-hooks.md:184` and `:195` document `parent_session_id` | Recorded, not built (D13) |
| `DM5-P2-001` | `SAD/feature-catalog/scorer-fusion/command-meaning-matching.md:26` says 46 | 47 (T026) |
| `DM5-P2-002` | `SAD/manual-testing-playbook/manual-testing-playbook.md:103` names `NN__category_name/`, `:38` and `:350` the gap-09 slot | The feature-named folders, both gap-09 lines gone (T027) |
| `DM5-P2-003` | `:155` and `:189` schedule `CL-004..CL-010` while `:194` says CL-004 is not authored | `CL-001, CL-005..CL-010` (T028) |
| `DM5-P2-007` | `:30` persists `PASS`, `FAIL` or `SKIP` while `:84`, `:121` and `:128` use `PARTIAL` | `PARTIAL` leaves the root (D10, T029) |
| `DM5-P2-004` | `SAD/changelog/v1.1.0.0.md:251` says the old name has no alias while `:106` and `:206` say it reads as the new one | The old name has no command file and reads as `/create:sk-skill` (T030) |
| `DM5-P2-008` | `:176` says `loadRate` counts runs that loaded a workflow, and the scorer counts `command` and `skill` only (`RAD/score-command-transcripts.mjs:1863-1866`) | The sentence names the two paths and no number changes (D10, T031) |
| `DM5-P2-005` | `ADV/tests/README.md` section 4 names 38 of 90 top-level files | Every tracked top-level file and folder (T032) |
| `DM5-P2-006` | `SAD/leaf-scopes.json` lists the Claude, lib and Pi hook READMEs and not `hooks/dsh/README.md` | Added, and the leaf files regenerated (T033) |

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Fix both P1 findings in the transcript scorer and the arena builder, test first, and rescore the stored arms of phase 007 with every moved figure restated.
- Fix the eight other accuracy-runner findings and the arena header sentence the verifier saw outside its grading.
- Fix the six kill-switch findings, the seven confirmed Vibe and doctor findings and the eight docs findings.
- Review the fix diff once with Opus, then re-review it with DeepSeek lineages in rounds `5b` and at most `5c`, and write the pass-five synthesis.

Restraint pass. Building nothing leaves each probe line of the Measured Behavior block as it reads. No new file outside this phase folder. Three new exports, each for a named reason: `MARK` so one literal exists, `copyArgs` so the Linux branch has a test, and `turnRefusal` so the every-turn guard has a test seam, since `runTurn` spawns a model and a dry run skips the guard. The entry guard in the builder is the `invokedDirectly` pattern two sibling scripts already use (`RAD/run-command-behaviour.mjs:1482-1491`, `RAD/score-command-transcripts.mjs:2267-2276`), and without it importing `MARK` would run the builder. No new module, option, layer or dependency.

### Out of Scope
Each item is recorded in `plan.md` D13 with its file and reason.
- **`R1-P2-002`**, rejected by the verifier.
- **A Python or other interpreter write**, such as `python3 -c "open(...,'w')"`. Its target is only known by running the code.
- **The four tracked absolute symlinks under `specs/**/scratch`.** They arrive through `git clone`, not through `copyPath`.
- **The same fixed six-hop resolver path** in `SAD/hooks/claude/directive-lifecycle-boundary.ts:18` and thirteen `system-spec-kit/runtime/hooks` sources. No finding grades them and every compiled copy resolves.
- **Scoring phase 026's arm.** The operator stopped it before scoring (its ADR-001), so the rescore reads phase 007's stored sets only.
- **A catch-up merge of `origin/main`.** It is the coordinator's call.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `RAD/score-command-transcripts.mjs` | Modify | Shell writes, the anchored `COMMAND:` line and the suffix tally |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | The cases for those three |
| `RAD/prepare-behaviour-arena.mjs` | Modify | Entry guard, `MARK` and `copyArgs` exports, the source, stale, link and dotenv checks, the marker lines and the header |
| `RAD/run-command-behaviour.mjs` | Modify | `turnRefusal` before every live turn, the imported `MARK` and two comments |
| `RAD/command-offer.mjs` | Modify | The imported `MARK` |
| `ADV/tests/command-behaviour-guards.vitest.ts` | Modify | The builder cases, the copy-path case and the guard case |
| `ADV/tests/command-offer.vitest.ts` | Modify | The imported `MARK` |
| `RAD/README.md` | Modify | The builder's refusals, its output field and the every-turn guard |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | Modify | Rows 74 and 75 |
| `SAD/manual-testing-playbook/compat-and-disable/global-disable-flag.md` | Modify | The CP-003 control line |
| `ADV/tests/launcher-bootstrap.vitest.ts` | Modify | The fixture names all ten |
| `ADV/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts` | Modify | The `MK_` cases |
| `ADV/lib/README.md` | Modify | The directory tree |
| `SAD/hooks/vibe/prompt-advisor.mjs` | Modify | The directive-only context and the receipt `env` |
| `ADV/tests/hooks/vibe-prompt-advisor.vitest.ts` | Modify | The cases for those two |
| `SAD/hooks/claude/user-prompt-submit.ts` | Modify | The walk-up to the resolver |
| `ADV/tests/hooks/claude-user-prompt-submit-hook.vitest.ts` | Modify | The switch case from source |
| `SAD/hooks/skill-advisor-hook.md` | Modify | The alias rows and Vibe |
| `DS/hook-wiring-check.cjs` | Modify | The `match` selector |
| `DS/tests/hook-wiring-check.test.cjs` | Modify | The `match` cases |
| `DS/tests/doctor-runtime-mirrors-contract.test.cjs` | Modify | The test name |
| `SAD/feature-catalog/scorer-fusion/command-meaning-matching.md` | Modify | 47 |
| `SAD/manual-testing-playbook/manual-testing-playbook.md` | Modify | Folders, gap-09, the CL range and `PARTIAL` |
| `SAD/changelog/v1.1.0.0.md` | Modify | The alias line and the `loadRate` sentence |
| `ADV/tests/README.md` | Modify | The directory tree |
| `SAD/leaf-scopes.json` | Modify | The DSH hook README |
| `SAD/leaf-manifest.json`, `SAD/leaf-aliases.json` | Regenerate | From the leaf scopes |

No other file outside this phase folder and `../review/` changes. The compiled `ADV/dist` is rebuilt and gitignored.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `node $V5/shell-inplace-write.mjs` prints `kinds=write unsafe=true loopInit=false` for the redirect, `sed -i`, `perl -pi`, `tee` and `cp` lines, the `python write` line unchanged, and `startedCommand=/deep:review` on both decline lines. |
| REQ-002 | `arena-cases.sh` prints `A exit=2` with `source_dirty`, `B exit=2` with `stale_build` and `D exit=0` with `marker-lines=3 marker-second-line=source_clean`, and `arena-provenance.sh` prints `builder exit=2` for its cases A and B. |
| REQ-003 | The floor lines and the eval line equal their before lines, `BUILD` and `TC` exit 0, `VALL` reports 0 failed, `DT` and `VT` report `fail 0`, and `VMIR`, `META` and `PBV` pass. |
| REQ-004 | No code comment added here names a spec path, a phase, a task, a finding, a lineage or a decision id, no added doc line holds an em dash or a semicolon, no row file and no committed baseline changes, and the diff touches no file outside the Files to Change table, this folder and `../review/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The eight other accuracy-runner findings and the header sentence read fixed: `command-line-cases.mjs` prints `commandLines []` and `started:false` on the quoted marker and `count:2` twice on the suffix pair, `arena-cases.sh` prints `C exit=2` with `symlink_escape` and `E exit=0` with `"trackedDotenv":[".env.example"]`, `turnRefusal` returns `remote_present` before a later turn, `rg -c "'skilled-behaviour-arena'"` finds the literal once, and the copy-path case passes. |
| REQ-006 | The six kill-switch findings read fixed: both `ENV-REFERENCE.md` rows name every alias and source, the CP-003 control unsets ten names, the launcher fixture sets ten, the CLI cases run all ten names with no `MK_` filter, and the lib README tree names every tracked top-level entry. |
| REQ-007 | The seven confirmed Vibe and doctor findings read fixed: `vibe-part.mjs` prints `directive-only changed: false`, a receipt follows the injected `env`, the Claude hook from source honors `SYSTEM_SKILL_ADVISOR_DISABLED`, `hook-wiring-check.cjs` prints `hook-missing vibe` for `match = "agents_spawn"`, the contract test is renamed and the hook contract names Vibe in its three places and says every alias silences every adapter. `R1-P2-002` is recorded as rejected. |
| REQ-008 | The eight docs findings read fixed, `PBV` prints `PASS package=system-skill-advisor`, the changelog shape check prints `PASS`, `DOCV` exits 0 on each changed doc, and `META` exits 0 after the leaf files are regenerated. |
| REQ-009 | The stored sets of phase 007 are rescored after lane A, `scratch/rescore-delta.txt` names every moved figure with its runtime, arm, row and rule, and each moved figure quoted in a packet doc is restated or named in the goal log with `PLOG`. |
| REQ-010 | One Opus reviewer reads the fix diff and reports 0 P0 and 0 P1, or each one it reports reproduces into a task that is fixed, committed and read again. |
| REQ-011 | DeepSeek lineages re-read the fix diff in round `5b` and, after a reproduced P1, round `5c`, and no round past `5c` runs. Every P0 and P1 they report has a reproduction line, and `../review/review-report.md` holds the pass-five synthesis with pass four kept as `../review/review-report-pass-4.md`. |
| REQ-012 | Every finding `plan.md` D13 records rather than builds still names a file and line that holds at close. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `scratch/probes-after.txt` holds the after lines REQ-001, REQ-002, REQ-005 and REQ-007 name, the `python write` line and the `remote-guard.mjs` lines equal to their before lines, and `wiring-match.sh` printing `match=agents_spawn hook-missing vibe .vibe/hooks.toml exit=1` and `match=main ok vibe exit=0`.
- **SC-002**: `cmp` of each floor and eval after file with its before file prints nothing and exits 0.
- **SC-003**: The Opus review and the last DeepSeek round leave 0 open P0 and 0 open P1, as `../review/review-report.md` states.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 031 committed and the catch-up merge in HEAD | The before lines would read another tree | T001 checks both and stops the phase |
| Risk | The new write events and the anchored `COMMAND:` line move stored start, unsafe and load figures | High: the goal log and two docs quote those figures | T034 rescores the three stored sets, writes every moved run with its rule and restates each quoted figure through `PLOG` or a follow-up task |
| Risk | A write target parsed from the wrong word, such as the script of `sed -i` | Med: a run reads unsafe for a file it never touched | The target is the last non-option word for `sed`, `perl`, `cp` and `mv`, every non-option word for `tee`, `rm`, `mkdir` and `touch`, and a case pins each spelling |
| Risk | The stale rule refuses a correct build after a checkout restamps a source or a doc in the package folder changes, as T015's edit of `ENV-REFERENCE.md` will for `system-spec-kit/runtime/dist` | Med: an operator rebuilds before an arena | The refusal names every stale folder, and a rebuild of each is the remedy. A false refusal costs one build, a false pass measures a build nobody committed. At planning all six ignored `dist` trees read fresh |
| Risk | The link check walks every copied tree once more, before the clone | Low: `holdsDotenv` already walks each tree during the copy | One walk per tree, and none inside another |
| Risk | Importing the builder runs it | High: a test or the runner would build an arena on import | T006 adds the entry guard before anything imports from the file |
| Risk | The re-review round reports a defect in the fix | Med | A reproduced P1 becomes a task and a `5c` round reads its commit, and no round past `5c` runs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The arena build adds one `git status`, one `git ls-files` per copied `dist`, one `git ls-files` for tracked dotenv names and one walk of each copied tree before the clone.

### Security
- **NFR-S01**: No task reads, prints or logs a row prompt or a session store's prompt text. `command-prompts.jsonl`, `holdout-prompts.jsonl` and `behaviour-fresh-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, and every `git diff`, `show` or `log -p` over a path that includes a row file excludes them.
- **NFR-S02**: An arena never receives a copied link whose real path leaves its source, and every probe that builds an arena or a repository does so under a `mktemp` folder it removes.

### Reliability
- **NFR-R01**: A dry run of the runner still spawns nothing and refuses nothing it refused before.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: `tee` with no file argument and `mkdir` with only options stay a plain shell call, and a source with no ignored build tree copies nothing and still writes the marker.
- Maximum input: one shell call that runs `cp a b && sed -i '' x c && rm d` emits one write per target in order, and a source with many `dist` trees is checked tree by tree and its refusal names every stale one.
- Failure path: a dirty source, a stale build and an escaping link each exit 2 with a code before the clone, so no half-built arena is left. A dangling link in a copied tree counts as escaping, because its target cannot be checked.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Twenty-eight files, about 600 lines, half of them tests |
| Risk | 12/25 | Two scorer rules that move stored figures, one builder that gains three refusals and docs gated by validators |
| Research | 10/20 | Thirty-two findings re-read, five probes rerun and one planning probe written |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None blocks planning. The planner asked no one. Each point the dispatch left open is decided below and in `plan.md`, open for the coordinator or the operator to overturn.

- A1. Level: `recommend-level.sh --loc 600 --files 27` printed Level 2, score 49.
- A2. The plan ran under `/speckit:plan :auto` with the setup bound by the dispatch: this folder, Level 2, execution mode auto, no relationships, research intent `fix_bug`. Confirm checkpoints were skipped, as `:auto` skips them. Step 5's four exploration agents were not dispatched, because this planner may dispatch none, and the same reads were done inline. Its `check-prerequisites.sh --json --paths-only` ran and exited 0. Step 6 did not run the continuity writer, because the dispatch's finish step replaces the save, as in phases 024 to 031. No child `goal.md` was written and no `/create:goal <parent> phase-add` ran, because `goal.cjs packet` on the parent prints `packet_durable_chars=3972` of 4,000, which leaves no room for a binding row. The goal row the dispatch names went into the parent goal log. The summary scaffold sits in `scratch/` until the close-out.
- A3. `iter3-P1-remote-guard-first-turn-only` is a P2 here, as the verifier graded it, while the registry row still says P1. The registry is merged output and is not edited by this phase.
- A4. The verifier's fix for `DM5-P2-007` adds `PARTIAL` to the persistence line. The playbook package contract points the other way, so this plan removes `PARTIAL` instead (`plan.md` D10).
- A5. The verifier's fix for `iter2-P2-tracked-dotenv-cloned` offers to refuse. This repository commits a root `.env.example`, so a refusal would refuse every arena built here. The builder names the file instead (`plan.md` D6).
- A6. The rescore covers phase 007's stored sets only. Phase 026's arm stays unscored, because the operator stopped it before scoring.
- A7. Workers are DeepSeek v4.1 flash max on OpenCode Go, one task per session, each checked by an Opus verifier before the next task in its lane, as the dispatch and phases 020 to 031 set.
<!-- /ANCHOR:questions -->

---
