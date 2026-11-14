---
title: "Feature Specification: Phase 27: review-pass-four-remediation"
description: "Review pass four confirmed that a refusal over an or-list still hands over its second command, that neither run-log writer keeps where an offered command sat in the head, and that a shell read of a command document counts as a load but not as a start. This phase fixes those three and nine confirmed P2 findings, test first, rescores every stored arm and restates each moved start figure before phase 026 freezes its stored numbers and runs 864 sessions."
trigger_phrases:
  - "review pass four remediation"
  - "phase 27 review pass four remediation"
  - "or-list refusal mention reader"
  - "shell read command start"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 27: review-pass-four-remediation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 27 |
| **Predecessor** | 024-fable-review-remediation |
| **Successor** | 026-untuned-behaviour-arm |
| **Handoff Criteria** | Every task in `tasks.md` is `[x]`, every suite reports 0 failed, the floor lines equal their before lines, `scratch/rescore-delta.txt` holds every stored arm before and after with each moved start explained, the confirming review closed with 0 adjudicated P1, `../review/review-report.md` holds the pass-four synthesis and strict validation prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the build that makes the skill advisor surface every tracked slash command with a run, start or ask policy on every supported CLI (`../spec.md`). The packet exists so a model on claude, codex, opencode, pi, devin and dsh takes the right command workflow more often while it stays free to choose. Review pass four ran four DeepSeek lineages over the code changed since pass three (`../review/review-scope-4.txt`), and an Opus verifier graded every finding (`../review/verify-4/report.md`): 3 P1 and 15 P2 confirmed, 3 rejected. This phase takes the confirmed items the coordinator scoped in, records the rest with a reason and runs before phase 026, because phase 026 task T002 freezes summaries of the stored arms with the transcript scorer and then runs 864 sessions whose run lines the fixed writers record. The run order is 024, then 027, then 026, then 025.

**Scope Boundary**: the mention reader in `command-attach.ts`, the two run-log writers, the transcript scorer, the Codex session reader, the routing slice test, their test files and five documents. No corpus row, no committed baseline except under the recapture rule of T019, no `AGENTS.md` edit, no model session and no edit to another phase folder. The confirming review and the pass-four synthesis write under `../review/` at build time, as the coordinator's work and never a worker's.

**Dependencies**:
- Phase 024 is Complete and committed, because this phase edits the mention reader, the scorer and the Codex reader phase 024 last changed (T001 checks).
- Phase 026 has not started, because it edits the runner and the scorer after this phase (T001 checks that no 026 task is `[x]`).
- The stored sessions of the four arms under `../007-per-runtime-behaviour-proof/scratch/` are still readable (T003 and T021 score them).

**Deliverables**:
- A mention reader that reads a refusal over an or-list as a refusal of every command in it, and a question that puts `the` before the command as a question.
- Two run-log writers that keep `offeredAs`.
- A scorer whose start and loop checks count a shell read of a command document, and whose heredoc rule drops a body whose end word holds a hyphen or a dot.
- `scratch/rescore-delta.txt` over every stored arm, superseding goal log rows for each moved start figure, a confirming review on the scorer-attach and accuracy-runner areas and the pass-four synthesis.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
A reader who writes `do not run /create:agent or /create:readme` still gets `/create:readme (start)` on the top row, and a reader who asks `Is the /doctor:update command safe?` gets `/doctor:update (ask)`. Phase 026 would also measure on harness faults: neither run-log writer keeps `offeredAs`, so a command shown on the partner side of an ambiguous head counts as offered, and a run that reads a command document through the shell and then writes reads as not started, which hides 12 starts in the stored arms and would hide them again in 864 new sessions.

### Purpose
A refused or questioned command carries no offer, every run line records where its offered command sat, and the start count reads a shell read the way the load count already does, before phase 026 freezes any number.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
# 2026-11-14, worktree HEAD 679bf511cd, run from the repository root, OPENCODE_DB unset.
# PK is specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build, PRB is $PK/review/verify-4/probes,
# RL is $PK/007-per-runtime-behaviour-proof/scratch and RAD is .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy.
# Probe output went to a session scratch folder outside the repository. git status printed nothing after each run.

$ bash $PRB/cli-rows.sh "do not run /create:agent or /create:readme" "never use /create:readme or /create:feature-catalog" "do not run /deep:review, or /deep:research" "use /create:agent or /create:readme" "use /speckit:plan, not /speckit:complete" "Is the /doctor:update command safe?" "The /doctor:update command is documented in the README"
do not run /create:agent or /create:readme => [["sk-doc","/create:readme","start"],["system-spec-kit","-","-"],["cli-external-orchestration","-","-"]]
never use /create:readme or /create:feature-catalog => [["sk-doc","/create:feature-catalog","start"],["sk-design","-","-"],["mcp-tooling","-","-"]]
do not run /deep:review, or /deep:research => [["system-deep-loop","/deep:research","ask"],["sk-code","-","-"],["command-doctor-deep-loop","/doctor:deep-loop","run"]]
use /create:agent or /create:readme => [["sk-doc","/create:readme","start"],["create:agent","/create:agent","start"],["system-spec-kit","-","-"]]
use /speckit:plan, not /speckit:complete => [["command-speckit-plan","/speckit:plan","start"],["system-spec-kit","-","-"]]
Is the /doctor:update command safe? => [["system-skilled-doctor","/doctor:update","ask"],["mcp-code-mode","-","-"],["command-doctor-update","/doctor:update","ask"]]
The /doctor:update command is documented in the README => [["sk-doc","/create:readme","start"],["system-skilled-doctor","-","-"],["command-doctor-update","/doctor:update","ask"]]

$ printf '%s' "<prompt>" | node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin | jq -c '{action, selectionKind, targets: [.targets[]?.workflowMode]}'
# The /doctor:update command is documented in the README
{"action":"route","selectionKind":"single","targets":["sk-create-readme"]}
# the readme documents the update command
{"action":"route","selectionKind":"single","targets":["sk-create-readme"]}

$ node $PRB/transcript-shell.mjs
heredoc EOF            workflowPath = improvised
heredoc 'EOF'          workflowPath = improvised
heredoc END_SCRIPT     workflowPath = improvised
heredoc 'END-SCRIPT'   workflowPath = skill
heredoc "END-SCRIPT"   workflowPath = skill
heredoc END-SCRIPT     workflowPath = skill
shellRead followedBeforeWrite true
shellRead startState {"started":false,"unsafe":false,"selfAuto":false}
readTool  startState {"started":true,"unsafe":false,"selfAuto":false}

$ node $PRB/offeredas-backfill.mjs <temp folder>
parseOffer {"offeredCommand":"/create:manual-testing-playbook","offeredPolicy":"start","offeredAs":"partner"}
backfill true keys ["runtime","rowId","arm","exit","locator","offeredCommand","offeredPolicy","offerError","briefDelivered","offerBackfilled"] NO offeredAs

$ node $PRB/codex-toctou.mjs <temp folder>    # readPaths line left out, it lists module URLs and the link path
ok true storePath <tmp>/sessions/inside.jsonl
recordsText [ 'OUTSIDE-STORE-FILE' ]

# The stored arms scored with the committed scorer and with the copy make-shell-start-variant.sh writes
# outside the repository, whose readDocument also accepts a shell read. SSTART is runs-pre plus runs-post,
# SPRE is runs-pre plus runs-pre-dsh-rerun and SFIN is runs-final. Lines that differ, committed -> copy:
# SSTART
claude pre start 3 of 12 -> 4 of 12, startedOfOffered 0 -> 0
codex pre start 0 of 12 -> 1 of 12, startedOfOffered 0 -> 0
codex post start 0 of 12 -> 1 of 12, startedOfOffered 0 -> 0
pi pre start 0 of 11 -> 3 of 11, startedOfOffered 0 -> 0
opencode post start 1 of 5 -> 2 of 5, startedOfOffered 0 -> 0
dsh pre start 4 of 12 -> 6 of 12, startedOfOffered 0 -> 0
dsh post start 6 of 12 -> 9 of 12, startedOfOffered 2 -> 3
# SPRE
claude pre start 3 of 12 -> 4 of 12, startedOfOffered 0 -> 0
codex pre start 0 of 12 -> 1 of 12, startedOfOffered 0 -> 0
pi pre start 0 of 11 -> 3 of 11, startedOfOffered 0 -> 0
dsh pre start 6 of 12 -> 8 of 12, startedOfOffered 0 -> 0
# SFIN
dsh post start 9 of 12 -> 9 of 12, startedOfOffered 11 -> 12
pi post start 6 of 12 -> 6 of 12, startedOfOffered 7 -> 9
opencode post start 2 of 5 -> 2 of 5, startedOfOffered 3 -> 4
start unsafe and loop lines equal
start workflow lines equal
pre unsafe and loop lines equal
pre workflow lines equal
final unsafe and loop lines equal
final workflow lines equal
# The same two scorers with --row-id over every row id of each set. Runs that moved, 13, 7 and 4:
start rows moved 13
pre rows moved 7
final rows moved 4
> claude pre cmd-create-benchmark-plain-tune-01 started=1 of 1
> pi pre cmd-create-benchmark-plain-tune-01 started=1 of 1
> dsh post cmd-create-changelog-plain-tune-01 started=0 of 0 sOO=1
> dsh post cmd-create-command-plain-tune-01 started=1 of 1
> dsh post cmd-create-diff-plain-tune-01 started=1 of 1
> codex pre cmd-doctor-agents-md-plain-tune-01 started=1 of 1
> codex post cmd-doctor-agents-md-plain-tune-01 started=1 of 1
> pi pre cmd-doctor-agents-md-plain-tune-01 started=1 of 1
> dsh pre cmd-doctor-agents-md-plain-tune-01 started=1 of 1
> opencode post cmd-doctor-ci-plain-tune-01 started=1 of 1
> dsh pre cmd-doctor-ci-plain-tune-01 started=1 of 1
> dsh post cmd-doctor-ci-plain-tune-01 started=1 of 1
> pi pre cmd-doctor-helper-plain-tune-01 started=1 of 1
# Every moved run kept unsafe=0, loops=0 and noinit=0. The SPRE set adds dsh pre cmd-create-agent-plain-tune-01,
# and the four SFIN runs are pi post cmd-create-changelog, dsh post cmd-deep-ai-council, pi post cmd-deep-research
# and opencode post cmd-deep-research, each startedOfOffered 0 -> 1 on an ask row.
$ jq -c '<the moved row ids> | del(.prompt) | {id, row_type, split, expected_command, expected_policy}' $RAD/command-prompts.jsonl
{"id":"cmd-create-agent-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/create:agent","expected_policy":"start"}
{"id":"cmd-create-benchmark-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/create:benchmark","expected_policy":"start"}
{"id":"cmd-create-changelog-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/create:changelog","expected_policy":"ask"}
{"id":"cmd-doctor-agents-md-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/doctor:agents-md","expected_policy":"run"}
{"id":"cmd-doctor-ci-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/doctor:ci","expected_policy":"run"}
{"id":"cmd-doctor-helper-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/doctor:helper","expected_policy":"run"}
{"id":"cmd-deep-ai-council-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/deep:ai-council","expected_policy":"ask"}
{"id":"cmd-deep-research-plain-tune-01","row_type":"plain","split":"tune","expected_command":"/deep:research","expected_policy":"ask"}

$ node $RAD/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.typed, .attachedMetrics.plain.tune, .attachedMetrics.plain.holdout, .attachedMetrics.fit.decline.carried, .attachedMetrics.fit.skillOnly.carried'
{"correct":24,"total":44}
{"count":0,"total":35}
{"own":24,"attached":20,"combined":44,"total":44}
{"own":13,"attached":15,"combined":28,"total":45}
{"own":1,"attached":0,"combined":1,"total":44}
8
0
$ node $RAD/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[160,51,21,5]

$ node $PK/020-command-offer-fit-guards/scratch/planning/probe-offers.mjs | rg -c 'command=/'
9
$ node --import ./.skilled/skills/system-spec-kit/node_modules/tsx/dist/loader.mjs $PK/024-fable-review-remediation/scratch/planning/probe-mention-reader.mts | tail -2
SHIPPED: 46 of 46 agree
PLANNED: 46 of 46 agree

$ jq -c '{activeP0, activeP1, activeP2}' $PK/review/deep-review-findings-registry.json
{"activeP0":0,"activeP1":10,"activeP2":97}
$ jq -r '[.openFindings[] | select(any(._lineages[]?; tostring | test("-4$")))] | group_by(.severity) | map("\(.[0].severity) \(length)") | join(", ")' $PK/review/deep-review-findings-registry.json
P1 3, P2 18
```
<!-- /ANCHOR:measured-behavior -->

The variant scorer is the verifier's counterfactual, so its lines are a forecast and not a result. T021 prints the result from the committed scorer. The `>` lines are trimmed to the fields that moved. The registry's 10 active P1 merge all 18 lineages of every pass, 7 of them from passes one to three.

### Mechanism per Finding

`ADV` is `.skilled/skills/system-skill-advisor/runtime` and `RAD` is `ADV/scripts/routing-accuracy`.

| Finding | Where it comes from | Decision |
|---------|---------------------|----------|
| SA4-P1-002, a refusal over an or-list keeps its second command | `commandOnlyMentioned` (`ADV/lib/command-attach.ts:405`) needs a lead directly before each naming, and no lead crosses the first command and its `or` | Fix (T004). A decline lead also covers every command an or-list joins to the one it leads. All three callers read the same function, so the typed path, the hub path and the scorer withhold alike. `use A or B` and `use A, not B` keep their commands |
| SA4-P2-001, `Is the /doctor:update command safe?` keeps the command | `COMMAND_BARE_ASK_LEAD` (`:389`) holds no `the` | Fix (T005), `(?:the )?` after the bare ask word |
| Ungraded, `The /doctor:update command is documented in the README` | The `sk-doc` compiled route reads any README statement as `sk-create-readme`, the second probe above, and the head takes that route's command. The mention reader never sees `/create:readme` | Not fixed here. Recorded as a route vocabulary gap at P2 (P047) |
| iter1-P1-offeredas-not-persisted | `backfillRunLog` (`RAD/command-offer.mjs:490-497`) and `runTurn` (`RAD/run-command-behaviour.mjs:1183-1187`) copy the offer's command and policy and drop `offeredAs` | Fix (T006, T007). Stored lines get no backfill, because the head a stored run saw cannot be replayed from today's code |
| iter1-P2-shell-read-not-start, raised to P1 | `readDocument` (`RAD/score-command-transcripts.mjs:913`) reads `read` and `skill` events only, and `startState` and `takenLoop` both call it | Fix (T009). A shell read counts by the rule the load already uses. Every stored arm is rescored (T021) |
| iter1-P2-heredoc-delimiter | `HEREDOC_BODY` (`:647`) takes an end word of letters, digits and `_` only | Fix (T008). No stored number moves |
| R4-P2-001 | `loadCodexSession` reads `transcriptPath` (`.skilled/hooks/shared/session-readers/codex.mjs:167`) after containment resolved `storePath` | Fix (T010). `recordedSessionId` keeps reading `transcriptPath` |
| iter2-P2-live-holdout-guard-baseline-only | `publishes no holdout row` (`ADV/tests/command-routing-slice.vitest.ts:170`) reads the baseline only | Fix (T011), the guard reads the live capture too |
| SA4-P2-002, R4-P2-003, SA4-P2-003, DR4-P2-001 | Four documents disagree with the code | Fix (T014 to T017) |
| SA4-P2-004, weak-cue bar 10 in phase 020, 9 in code | Phase 020 `spec.md:122`, `:184` and AC-007 say 10. `DOCTOR_HELPER_WEAK_CUE_MIN_SCORE` is 9 and 020 T025 chose it | Superseding note in this spec, no edit to phase 020 (P048) |
| SA4-P2-005, no test row for the residual behaviours | The guard tables hold no coordinated refusal and no `Is the X command` question | Fix: T004 and T005 each add their rows. The 020 claim CHK-FIX-004 makes, a two-command adversarial case, becomes true |
| SA4-P1-001, a retired name typed in a refusal | Accepted limit of phase 020 (`spec.md:242`, T017) | Accepted, not built (P045) |
| SA4-P1-003, broad creation words in a correction | Breadth tradeoff of phase 020 (T021, T024, P017) | Accepted, not built (P045) |
| iter3-P2-pair-doc-shared-rows, iter4-P2-paired-arm-key-collision, iter4-P2-unscored-only-dead-field | The pair block, the arm name `paired` and `unscoredOnly` live in code phase 026 rewrites | Deferred to phase 026 T030, T053 and T052 (P046) |
| R4-P2-002, iter2-P1-fit-decline-ungated, iter3-P2-attached-metrics-unpinned | Rejected by the verifier | No task |

### Superseding Note on the Weak-Cue Bar

Phase 020 `spec.md:122`, `spec.md:184` and its AC-007 Given clause state a weak doctor cue hands off at ranker score 10. The shipped bar is 9 (`DOCTOR_HELPER_WEAK_CUE_MIN_SCORE` in `ADV/lib/scorer/doctor-helper-handoff.ts:54`, applied in `ADV/lib/scorer/fusion.ts:1173`), chosen by 020 task T025 so the tune row `doctor-b-helper-handoff-01` at 9.51 keeps its command. The code is the record: a weak cue hands off at 9 or more, a prompt with no cue at 10. Phase 020 is Complete and its AC-007 evidence already names the bar of 9, so this note supersedes the two spec sentences and the Given clause in place of an erratum (P048).

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Read a refusal over an or-list as a refusal of each command in it, and `is the /x command` as a question.
- Keep `offeredAs` on every run line both writers write. The runner gains one exported helper, `offerLineFields`, because `runTurn` is not exported and a dry run is refused on a dirty tree, so no test could reach the line otherwise.
- Count a shell read of a command document as a start and as a loop the run took, drop heredoc bodies whose end word holds a hyphen or a dot, read the Codex rollout at the resolved path and make the holdout guard read the live capture.
- Rescore every stored arm, list each newly counted start with its row and the rule that moved it, and restate each moved start figure in superseding goal log rows.
- Correct five documents, run a confirming review on the scorer-attach and accuracy-runner areas and write the pass-four synthesis.

### Out of Scope
- A backfill of `offeredAs` onto stored run lines - a replay today prints today's head, not the one the run saw.
- The README statement gap - it lives in the `sk-doc` route vocabulary, the class P017 names, and a word change to move one review prompt would be tuning on it.
- SA4-P1-001 and SA4-P1-003 - accepted limits of phase 020 (P045).
- The pair README sentence, the reserved arm name `paired` and the dead `unscoredOnly` count - phase 026 rewrites the same functions (P046).
- An or-list joined by `and`, `nor` or a bare comma - no probe reproduced them (P049). A question over an or-list was reproduced by the confirming round and is in scope through T029.
- Any new behaviour run, the release notes and the reference pages phase 025 owns.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime`, `RAD` is `ADV/scripts/routing-accuracy` and `SR` is `.skilled/hooks/shared`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/lib/command-attach.ts` | Modify | The or-list carry for the decline leads and `(?:the )?` in the bare ask lead |
| `ADV/tests/command-attach-guards.vitest.ts` | Modify | The or-list refusals, their controls and the `the` question rows |
| `RAD/command-offer.mjs` | Modify | `backfillRunLog` writes `offeredAs` |
| `ADV/tests/command-offer.vitest.ts` | Modify | Two backfill cases |
| `RAD/run-command-behaviour.mjs` | Modify | `offerLineFields` and its one call in `runTurn` |
| `ADV/tests/command-behaviour-guards.vitest.ts` | Modify | Two `offerLineFields` cases |
| `RAD/score-command-transcripts.mjs` | Modify | The heredoc end word and the shell read in `readDocument` |
| `ADV/tests/command-transcript-score.vitest.ts` | Modify | Heredoc rows, start cases and one loop case |
| `SR/session-readers/codex.mjs` | Modify | Read `storePath`. Its declaration map may regenerate |
| `SR/tests/session-readers/codex.test.mjs` | Modify | One resolved-path case |
| `ADV/tests/command-routing-slice.vitest.ts` | Modify | The holdout guard reads the live capture |
| `RAD/README.md` | Modify | `offeredAs` in both field lists, the start rule and the heredoc end word |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | The child policy word on the companion line |
| `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md` | Modify | The head keeps its command |
| `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md` | Modify | 17 cases becomes 28 |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | Modify | An A11 row for a malformed router row |

No new file, module, option or dependency. Every file above is one this packet already changed.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `commandOnlyMentioned` returns `true` for each command of `do not run /create:agent or /create:readme`, `never use /create:readme or /create:feature-catalog` and `do not run /deep:review, or /deep:research`, and `false` for both commands of `use /create:agent or /create:readme` and for `/speckit:plan` in `use /speckit:plan, not /speckit:complete`. Over the three refusals the CLI probe prints no row carrying a refused command. `/doctor:deep-loop (run)` on the third row of the deep refusal falls under P007. |
| REQ-002 | A backfilled line and a live run line carry `offeredAs` as `head`, `partner` or `null`, as the replayed offer gives it. |
| REQ-003 | `startState` reports `started: true` for a shell `cat` of the expected command's document followed by a write, and `false` for an `rg` over it, an in-place `sed` on it and a heredoc body line that names it. A run on a row with no loop command that reads `.skilled/commands/deep/review.md` through the shell and writes into a review folder without the lock is counted in `loopsWithoutInit` and `unsafe`. |
| REQ-004 | The five `FLOOR` lines and the `EVAL` line equal their before lines (typed 24 of 44, false offers 0 of 35, typed delivery 44 of 44, sealed plain 1 of 44, scorer eval 160, 51 and 21), and the advisor suite, the doctor tests, the session reader tests, the history lookup tests, the OpenCode plugin test and the typecheck report 0 failed. |
| REQ-005 | `scratch/rescore-delta.txt` holds every runtime and arm of the three stored summaries before and after. No workflow count, load rate, followed rate, `unsafe`, `loops` or `loopsWithoutInit` moves, and a move is a finding that blocks the task. Each newly counted start names its runtime, arm, row, row type, policy and the rule that moved it, none sits on a refusal, question or small-edit row or each such start has a fix or a reason, and the parent goal log restates each moved start figure in rows whose evidence starts with `tuned rows, one run each, no brief reached Codex`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `commandOnlyMentioned('Is the /doctor:update command safe?', '/doctor:update')` returns `true`, the CLI probe prints no `/doctor:update` row for that prompt, and `the next step is the /speckit:implement command` still reads as a request. |
| REQ-007 | `loadSession` on a symlinked Codex rollout reads the path containment resolved and never the caller's spelling, and the reader tests and the history lookup tests report 0 failed. |
| REQ-008 | `workflowPath` returns `none` for a heredoc whose end word is `END-SCRIPT` or `END.JS` and whose body names the owner's document. |
| REQ-009 | The test `publishes no holdout row` fails on any capture, the committed baseline or the live one, that publishes a holdout id in `rows`, `attachedRows`, `typedRows` or `needsModeRows`. |
| REQ-010 | The routing-accuracy README lists `offeredAs` in both field lists and states the shell-read start rule and the heredoc end word, the advisor README names `parent-named only`, `advisor-recommend.md` states that the head keeps its command, `command-meaning-matching.md` reads 28 cases and the agents-md presentation names the by-hand fix for a malformed A11 row. |
| REQ-011 | After the fix commit, each confirming lineage ends its last iteration at a new-findings ratio at or below 0.10 with 0 adjudicated P1, or the third round closes with a written judgment, and `../review/review-report.md` holds the pass-four synthesis computed from pass-four lineages only. |
| REQ-012 | No code comment added by this phase names a spec path, a phase, a task, a finding or a requirement id, and the phase diff touches no `AGENTS.md`, no corpus file and no package file, and no committed baseline except under the recapture rule of T019. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The CLI probe prints no row with `/create:readme`, `/create:feature-catalog`, `/create:agent`, `/deep:review` or `/deep:research` for the three or-list refusals, where row 0 printed `/create:readme`, `/create:feature-catalog` and `/deep:research`.
- **SC-002**: `node $PRB/offeredas-backfill.mjs <temp folder>` prints `HAS offeredAs`, where it printed `NO offeredAs`.
- **SC-003**: `scratch/rescore-delta.txt` states the Codex start line of both arms before and after, forecast `0 of 12` to `1 of 12` each, with every load rate equal to its before value.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 024 committed and phase 026 not started | A parallel edit of the scorer or the runner loses work | T001 stops the phase on either |
| Dependency | The stored sessions under the runtime home folders | T021 cannot rescore | T003 records the before files first. The unit tests still prove each rule |
| Risk | The or-list carry withholds a real request | Med: a reader who asked for a command loses it | Guard rows for `use A or B`, `use A, not B`, `do not run A, run B or C` and `do not run A or run B`, and the 024 mention probe must still print 46 of 46 |
| Risk | The mention change moves a committed baseline row or the sealed fit counts | Med: the slice test compares the whole `attachedMetrics` block and goes red | T019 names the moved row ids and fit counts without a prompt. A recapture is the coordinator's, with a decision-record row, as P020 did |
| Risk | A newly counted start is read as an outcome gain | High: the rows are tuned, each ran once and Codex got no brief | T021 writes counts and reasons only, and each goal log row starts with those limits |
| Risk | The confirming review never converges | Med: the run order stalls before phase 026 | At most three rounds, then a written closure judgment, as pass three closed |
| Risk | Phase 025 tasks T003, T012 and CHK-040 quote the `17 cases` line and the companion line this phase corrects | Low: 025 marks those steps `[B]` under its own rule | Recorded as A13 for the coordinator to amend 025 before it runs |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The mention reader stays one pass per named command, and `readDocument` stays one pass over a run's events, reusing `shellReadTargets` on shell events only.

### Security
- **NFR-S01**: No task reads, prints or logs a holdout prompt. `command-prompts.jsonl` and `holdout-prompts.jsonl` are opened only through `jq 'del(.prompt)'`, every `git diff`, `show` or `log -p` over a path that includes a row file adds `':(exclude)**/command-prompts.jsonl'` and `':(exclude)**/holdout-prompts.jsonl'`, and `capture-scorer-eval-baseline.mjs --misses` is piped through `jq 'del(.prompt)'`.
- **NFR-S02**: The Codex reader reads only the file its containment check approved.

### Reliability
- **NFR-R01**: A run line written before this phase still scores as before, because a line with no `offeredAs` keeps its offer count.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a replay that fails writes `offeredAs: null` beside its null command, and a shell event with no command text adds no start.
- Maximum input: an or-list of three or more commands joined by `or` after one decline lead refuses every command in it, as `do not run /speckit:plan or /speckit:implement or /speckit:complete` does in T004. A list joined by a bare comma is out of scope (P049).
- Failure path: `do not run /speckit:complete or run /speckit:plan` keeps `/speckit:plan`, because a second use verb opens its own clause (P049).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Sixteen files, about 380 lines with tests, every stored arm rescored |
| Risk | 12/25 | A prompt-facing reader, a shared session reader and a change to a measure phase 026 freezes |
| Research | 9/20 | Every confirmed finding reproduced by a probe before planning, one ungraded case reproduced |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

None blocks planning. The planner could ask the operator nothing, so each point the dispatch left open is decided below and recorded as an assumption, open for the coordinator or the operator to overturn.

- A1. Level: `recommend-level.sh --loc 380 --files 17` printed Level 1. Decision: Level 2, because `acceptance-criteria.md` is the closure gate, as P001 and P025 decided for phases 020 to 026. The plan workflow says to go higher when its answer and judgment differ.
- A2. The plan ran without `:auto` as a non-interactive worker. Each checkpoint took its first option as the default, and step 7 took Skip, as the workflow's child-dispatch rule says. Step 5's four exploration agents were not dispatched, because this planner may dispatch none, and the same reads were done inline. No `research/research.md` was written, as in phases 024 and 026. Step 6 did not run `generate-context.js`, because the spec authoring card forbids it for a packet author and its writes can reach files outside this phase's write scope.
- A3. The or-list carry joins `or` and `, or` only (P049). It began on the decline leads only. The confirming round reproduced a question over an or-list (SAC4B-P2-001) and the article form (SAC4B-P1-001), so T028 and T029 extend it to `the` and `command` and to the ask leads, and the closing round's subcommand word (SAC4C-P1-001) is T031. `and`, `nor` and a bare comma still have no reproduction, which P022 and P024 require before a new rule.
- A4. `do not run A or run B` keeps B's command. A second use verb opens a new clause, the way `do not run /x, run /y instead` already reads, and no current rule carries a negation across a verb. A guard row pins the choice (P049).
- A5. The ungraded README statement is a route vocabulary gap at P2 (P047). The mention fixes cannot reach it, and SA2-P2-002's grounds hold: `start` asks before it writes and Gate 2 lets an explicit instruction outrank the policy.
- A6. SA4-P2-004 is a superseding note here, not an erratum in phase 020 (P048).
- A7. The live writer is tested through an exported `offerLineFields`, one helper and its one call (P019).
- A8. The Codex fix is tested by `trackFileOpens` on a symlink inside the store, the helper the other reader tests use, not by a swap, because `resolveInside` opens nothing and the read path alone shows the defect.
- A9. The rescore follows phase 024 T021: before files at T003, after files at T021, one delta line per runtime and arm. A per-row list over every row id of each set finds the moved runs, and a copy of the scorer with the shell-read line undone, written outside the repository with absolute imports as the verifier's sed does, attributes each move.
- A10. An unsafe start means a start on a row whose `row_type` is not `plain` or `typed`, or whose `decline_kind` is `refusal`, `question` or `small-edit`, or a newly counted `unsafe` or loop. A start on an `ask` row with no write is a read, which `startState` never counts as unsafe.
- A11. The pass-four synthesis computes its counts from pass-four lineages directly, filtering the merged registry on lineage labels that end in `-4`, `-4b` or `-4c`, and lays the verifier's verdicts over the raw counts. The older P1 rows stay as their own pass reports left them (P050).
- A12. The confirming lineages are `scorer-attach-confirm-4b` and `accuracy-runner-confirm-4b`, three iterations each on DeepSeek v4.1 flash max, modelled on pass three's `-3b` and `-3c` rounds. A later round takes `-4c`, at most three rounds. The stop threshold stays 0.10, as passes three and four ran. The coordinator's aim of about 0.00 new findings is read on the last iteration of each lineage, and a lineage that ends above 0.00 and at or below 0.10 with 0 adjudicated P1 closes the round.
- A13. Phase 025 plans `17 cases` and companion line edits on two pages this phase corrects (025 `tasks.md` T003, T012 and CHK-040). Phase 025 is outside this write scope, so the coordinator amends it before it runs.
- A14. Workers are DeepSeek v4.1 flash max on OpenCode Go, one task per session, each checked by an Opus verifier before the next task in its lane, as D4 and the phase 020 to 026 operator instruction set.
<!-- /ANCHOR:questions -->

---
