---
title: "Feature Specification: Phase 12: plain-offer-reach"
description: "A plain request gets its command offered on only 9 of 45 tune rows, and 11 of the 16 plain chat rows of the after arm got no offer at all. This phase names the doctor command the helper's ranker already found, adds task-shaped aliases to the sk-doc and deep-loop hubs, pairs each deep mode with a scorer anchor, labels a hub that needs a mode and, last, anchors three create rows."
trigger_phrases:
  - "plain offer reach"
  - "phase 12 plain offer reach"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: plain-offer-reach

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 13 |
| **Predecessor** | 011-typed-command-delivery-and-guards |
| **Successor** | 013-attribution-and-install-reach |
| **Handoff Criteria** | The committed command baseline reads `attachedMetrics.plain.tune.combined` above 9 of 45, every floor holds after every wave and the brief head carries `(needs a mode)` for a hub that withholds its command |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy (`../spec.md`). It builds ranks 1, 4, 6, 7 and 12 of `../009-ux-performance-cross-cli-research/research/research-segment-2.md`, with the detail from `lineages/offer-reach/research.md` recommendations 1 to 4 and `lineages/ux-cost-2/research.md` recommendation 3.

**Scope Boundary**: The doctor hand-off module and its call site in the scorer, the doctor routing slice labels, the `sk-doc` and `system-deep-loop` hub routers with their two activation manifests, the explicit lane's phrase table, one attach helper, the recommendation schema and type, the recommend handler, the CLI fallback reader, the brief renderer and its golden test, the command baseline, the hook guide and the doctor feature catalog page. `AGENTS.md`, `.skilled/commands/create/`, every `ROUTER.md`, every canary fixture, the Python scorer and every scorer weight stay as they are.

**Dependencies**:
- Phase 011 edits `command-attach.ts`, `fusion.ts`, `advisor-recommend.ts`, `advisor-tool-schemas.ts`, the command capture and its baseline. No wave 1 task starts before phase 011 is committed.
- The floors are the ones phase 011 leaves: typed recall 24 of 44, the typed block 44 of 44, false offers 0 of 35 and the scorer eval at or above `[159,50,20]` with false fire at most 5.

**Deliverables**:
- The doctor hand-off offers the command the helper's ranker put first when that command runs without asking, and the helper otherwise. `stopped converging` counts as a wrong state. A plain repair request with no ranked command gets the helper.
- Six task-shaped aliases on four `sk-doc` modes and one alias on each of the three deep-loop modes, each hub refreshed.
- One explicit anchor per deep-loop mode, then, only when the floors stay put, three narrow anchors for the create rows whose top is wrong.
- A `needsMode` flag on a hub recommendation whose route defers or asks to clarify, rendered as `<hub> (needs a mode)` in the brief head.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A plain request rarely gets its command: the committed capture offers the expected command on 9 of 45 plain tune rows, and in the after arm of phase 007 the brief carried a command on 5 of the 16 plain chat rows, 2 of them the generic `/doctor:helper`. The cause is not obedience. The doctor hand-off finds the exact command and then names the helper, the hubs miss ordinary rewordings of their modes and a deferring hub reaches the model as a bare skill name with no hint that it held a command back.

### Purpose
Raise plain tune offers above 9 of 45 in the committed capture, with every chat row that has a measured cause gaining an offer on paper, and no pinned floor lower than today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran from the worktree root on 2026-11-13 at commit `731967bc25`, while phase 011 workers had uncommitted edits in the advisor runtime. `live.json` is the capture's output in a temporary folder. The output is verbatim. No holdout prompt was opened. Every prompt below is a tune row.

```text
$ git rev-parse --short HEAD
731967bc25
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs > live.json
$ jq -c '.metrics.typed_recall_at_1, .metrics.false_offer, .attachedMetrics.false_offer_attached, .attachedMetrics.typed, .attachedMetrics.plain.tune' live.json
{"correct":24,"total":44}
{"count":0,"total":35}
{"count":0,"total":35}
{"own":24,"attached":20,"combined":44,"total":44}
{"own":2,"attached":7,"combined":9,"total":45}
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[160,50,21,5]
$ jq -r '[.rowId, (.offeredCommand // "-")] | @tsv' ../007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl | grep plain-tune | sort | uniq -c
   6 cmd-create-agent-plain-tune-01	-
   6 cmd-create-agent-plain-tune-02	-
   6 cmd-create-benchmark-plain-tune-01	/create:benchmark
   6 cmd-create-changelog-plain-tune-01	/create:changelog
   6 cmd-create-command-plain-tune-01	-
   6 cmd-create-diff-plain-tune-01	-
   6 cmd-create-feature-catalog-plain-tune-01	/create:feature-catalog
   6 cmd-create-goal-plain-tune-01	-
   6 cmd-create-manual-testing-playbook-plain-tune-01	-
   6 cmd-deep-ai-council-plain-tune-01	-
   6 cmd-deep-research-plain-tune-01	-
   6 cmd-deep-review-plain-tune-01	-
   6 cmd-doctor-agents-md-plain-tune-01	/doctor:helper
   6 cmd-doctor-ci-plain-tune-01	/doctor:helper
   6 cmd-doctor-deep-loop-plain-tune-01	-
   6 cmd-doctor-helper-plain-tune-01	-
$ node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json --top=2 -- "confirm the AGENTS.md sections in this repo have not drifted" | jq -c '[.candidates[] | {runnable, command, target, section, mutating, score, matchedPhrase}]'
[{"runnable":"/doctor:agents-md check","command":"/doctor:agents-md","target":"check","section":"routes","mutating":"read-only","score":12.781,"matchedPhrase":"agents md section check"},{"runnable":"/doctor:agents-md embed","command":"/doctor:agents-md","target":"embed","section":"routes","mutating":"mutates","score":11.172,"matchedPhrase":"embed the shipped agents md sections"}]
$ node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json --top=2 -- "show me every GitHub Actions workflow and whether each is enabled" | jq -c '[.candidates[] | {runnable, command, target, section, mutating, score, matchedPhrase}]'
[{"runnable":"/doctor:ci report","command":"/doctor:ci","target":"report","section":"routes","mutating":"read-only","score":12.301,"matchedPhrase":"github actions drift report"},{"runnable":"/doctor:ci scaffold","command":"/doctor:ci","target":"scaffold","section":"routes","mutating":"mutates","score":12.301,"matchedPhrase":"scaffold a github actions workflow"}]
$ node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json --top=1 -- "my research loop stopped converging and I cannot see why" | jq -c '[.candidates[] | {runnable, score}]'
[{"runnable":"/doctor:deep-loop","score":16.249}]
$ node .skilled/commands/doctor/scripts/doctor-helper-match.cjs --json --top=2 -- "I have a problem and want the right repair path suggested with reasons" | jq -c '.status, .candidates'
"no_match"
[]
$ node $F/scratch/planning/probe-tops.mjs "$PWD" .skilled/skills/system-skill-advisor/runtime/dist/runtime cmd-doctor-agents-md-plain-tune-01 cmd-doctor-deep-loop-plain-tune-01 cmd-deep-review-plain-tune-01 cmd-deep-research-plain-tune-01 cmd-deep-ai-council-plain-tune-01 cmd-create-goal-plain-tune-01 cmd-create-command-plain-tune-01 cmd-create-manual-testing-playbook-plain-tune-01
cmd-create-command-plain-tune-01	sk-prompt:0.82
cmd-create-goal-plain-tune-01	system-spec-kit:0.84 sk-doc:0.82 mcp-tooling:0.82
cmd-create-manual-testing-playbook-plain-tune-01	sk-code:0.82
cmd-doctor-agents-md-plain-tune-01	command-doctor-helper:0.8
cmd-doctor-deep-loop-plain-tune-01	system-deep-loop:0.88
cmd-deep-ai-council-plain-tune-01	
cmd-deep-research-plain-tune-01	
cmd-deep-review-plain-tune-01	sk-code:0.82
$ for id in cmd-create-agent-plain-tune-01 cmd-create-agent-plain-tune-02 cmd-create-command-plain-tune-01 cmd-create-diff-plain-tune-01 cmd-create-goal-plain-tune-01; do printf '%s ' $id; jq -r --arg id $id 'select(.id==$id and .split!="holdout").prompt' $C | node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt-stdin | jq -c '{action, selectionKind, t:[.targets[]?|.workflowMode]}'; done
cmd-create-agent-plain-tune-01 {"action":"clarify","selectionKind":null,"t":[]}
cmd-create-agent-plain-tune-02 {"action":"defer","selectionKind":null,"t":[]}
cmd-create-command-plain-tune-01 {"action":"route","selectionKind":"single","t":["sk-create-quality-control"]}
cmd-create-diff-plain-tune-01 {"action":"defer","selectionKind":null,"t":[]}
cmd-create-goal-plain-tune-01 {"action":"defer","selectionKind":null,"t":[]}
$ for id in cmd-deep-ai-council-plain-tune-01 cmd-deep-research-plain-tune-01 cmd-deep-review-plain-tune-01; do printf '%s ' $id; jq -r --arg id $id 'select(.id==$id and .split!="holdout").prompt' $C | node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt-stdin | jq -c '{action, selectionKind, t:[.targets[]?|.workflowMode]}'; done
cmd-deep-ai-council-plain-tune-01 {"action":"defer","selectionKind":null,"t":[]}
cmd-deep-research-plain-tune-01 {"action":"defer","selectionKind":null,"t":[]}
cmd-deep-review-plain-tune-01 {"action":"defer","selectionKind":null,"t":[]}
$ for h in sk-doc system-deep-loop; do node .skilled/bin/compiled-route-manifest.cjs freshness --hub $h --skill-root .skilled/skills/$h | jq -r .causeCode; done; node .skilled/bin/compiled-route-guard.cjs --json | jq .failures; node .skilled/bin/compiled-route-sync.cjs --check | tail -1
fresh
fresh
0
all 55 served copies match their authored files
```

`$F` is this phase folder and `$C` is the command corpus `ADV/scripts/routing-accuracy/command-prompts.jsonl`. `probe-tops.mjs` scores corpus rows by id under the capture's fixture regime and prints only the passing ids, never a prompt. The passing top on both doctor rows that the after arm delivered as `/doctor:helper` carries the reason `doctor helper hand-off: /doctor:helper ranks /doctor:agents-md first for this problem`, and the CI row reads the same with `/doctor:ci`.

### Cause per Family
`ADV` is `.skilled/skills/system-skill-advisor/runtime`.
- Doctor, 4 chat rows. `applyDoctorHelperHandoff` (`ADV/lib/scorer/fusion.ts:1104`) inserts `command-doctor-helper` whenever the ranker matches, although `matchDoctorProblem` (`ADV/lib/scorer/doctor-helper-handoff.ts:143`) already holds the ranked command. The ranker's candidate carries `runnable` (`/doctor:agents-md check`), which `COMMAND_ROWS` maps to a bridge id with policy `run` (`ADV/lib/command-attach.ts:74`, `:77`, `:80`). The deep-loop row never reaches the ranker: a skill passes and `STRONG_PROBLEM_CUE` (`doctor-helper-handoff.ts:51-58`) has no `stopped converging`. The helper row has no candidate at all, so nothing is inserted.
- `sk-doc`, 3 chat rows with `sk-doc` on top (`agent-01`, `agent-02`, `diff`). The hub clarifies or defers because its vocabulary misses the wording: `agent definition`, `specialist persona file` and `before and after my rewrite` are not keywords (`.skilled/skills/sk-doc/hub-router.json`). Scoring is keyword count times mode weight with an ambiguity delta of 1 (`.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/lib/router.cjs:195-218`).
- Deep loop, 3 chat rows. Two have no passing skill and one has `sk-code` on top through the `audit` token (`ADV/lib/scorer/lanes/explicit.ts:28`). All three defer in the hub. The depth gate in `attachCommand` already passes on `everything you can`, `many passes` and `several models` (`command-attach.ts:306-323`).
- Create with a wrong top, 3 chat rows. `create-command` loses to `sk-prompt` on the `prompt` token, `create-goal` loses to `system-spec-kit` on `packet` and `create-manual-testing-playbook` loses to `sk-code`.
- Label. `attachCommand` returns nothing for a `defer` or `clarify` route (`command-attach.ts:361`) and the head then shows the bare skill (`ADV/lib/render.ts:588`).

### Research Claims Checked in Code
- Rank 1, "construct the matched run bridge before the early return when the only passing doctor bridge is the helper". Refuted as the place to change. On both delivered rows the helper is the hand-off's own insertion (the reason string above), not a passing helper bridge. A helper that passes on its own wording is the right answer for `find the right doctor command` (`doctor-prompts.jsonl` rows `doctor-b-helper-03` and `-04`). The change goes into the insertion instead.
- Rank 1, policy from `TRACKED_COMMANDS` or a `COMMAND_ROWS` scan. Confirmed for `COMMAND_ROWS`: the insertion needs the bridge id, which only `COMMAND_ROWS` keys hold.
- Rank 4, "plus the compiled policy snapshot and canary cases". Refuted for the snapshot: no compiled policy file is committed. `compiled-route.cjs` compiles each hub's policy from `hub-router.json` at call time through the hub's `harness/build-artifacts.cjs` `loadSnapshot`, and the activation manifest pins only the policy hash, which `compiled-route-manifest.cjs refresh` rewrites. The canary fixtures are inputs listed in the served closure with an authored copy under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/`, so this phase leaves them alone. A simulation over all 22 `sk-doc` and 7 deep-loop canary prompts changed no outcome (`scratch/planning/sim-hub-aliases.txt`).
- Rank 4, "manual: test script package, walk through by hand" and "skill-parent: hub skill". Dropped. Neither row has `sk-doc` on top, so the alias moves nothing.
- Rank 6, files `command-attach.ts`, `render.ts` and the golden test. Incomplete. The flag also has to cross `ADV/schemas/advisor-tool-schemas.ts` (the schema is `.strict()`), `ADV/lib/subprocess.ts`, `ADV/handlers/advisor-recommend.ts` and `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`, the same path phase 005 used for `policy`.
- Rank 7, "the depth gate already passes" on all three rows. Confirmed in `DEPTH_WORDING`.
- Rank 12, "Capture top-1 is the command row on the 3 rows". Refuted for two rows: `/create:goal` and `/create:command` have no TypeScript scorer row (`TRACKED_COMMANDS` `scorerRow: false`, `command-attach.ts:181`, `:184`). Their anchor lifts `sk-doc` and the hub alias carries the command. Only `/create:manual-testing-playbook` has a row (`create:manual-testing-playbook`). The research also named "matching calibration conditions in `fusion.ts`". The simulation needed none.

### Simulation Before the Plan
Each wave's code change was applied to a copy of the built runtime in a temporary folder and every non-holdout corpus row was scored again. The diffs are in `scratch/planning/`.
- Wave A changed exactly six tune rows and two doctor slice rows, and no labeled, scorer holdout or ambiguity row (`sim-wave-a.txt`).
- Wave B changed the route of exactly five tune rows and no canary (`sim-hub-aliases.txt`).
- Wave D changed the top of exactly the three deep rows, and its hub aliases changed exactly their routes.
- Wave E changed the top of exactly the three create rows, and D plus E changed no scorer eval row (`sim-wave-d-e.txt`).
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Name the matched doctor command in the hand-off when its policy is `run`, add the gerund cue and insert the helper for a plain repair request with no ranked command (rank 1).
- Add six multi-word aliases to four `sk-doc` modes and refresh the hub (rank 4).
- Flag a hub recommendation whose route defers or clarifies and render `(needs a mode)` in the head (rank 6).
- Add one explicit anchor and one hub alias per deep-loop mode as its own wave (rank 7).
- Add three narrow create anchors last, only when wave D leaves the floors unchanged (rank 12).

### Out of Scope
- Ranks 2, 3, 5, 8, 9, 10, 11 and 13. They belong to phase 013.
- Rank 14, a Gate 2 clause for a skill-only brief. It waits on the operator and `AGENTS.md` is frozen.
- Rank 15, re-embedding command intent signals. Declined for this round in the research.
- Any `ROUTER.md` edit. Its keyword list is prose for the model and no check ties it to `hub-router.json`.
- Any canary fixture edit. The fixtures are served files with an authored twin in the archive.
- Any scorer weight, the Python scorer and the OpenCode plugin's recommendation mapper, which drops `command` and `policy` today.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/lib/scorer/doctor-helper-handoff.ts`, `ADV/tests/doctor-helper-handoff.vitest.ts` | Modify | `runnable` on a match, the gerund cue, `genericRepairCue` |
| `ADV/lib/scorer/fusion.ts` | Modify | `runnableDoctorBridgeId` and the hand-off insertion |
| `ADV/tests/scorer/doctor-handoff-command.vitest.ts` | Create | Cases for the named command, the ask fallback and the repair request |
| `ADV/scripts/routing-accuracy/doctor-prompts.jsonl` | Modify | Three hand-off rows relabelled to the command now offered |
| `.skilled/skills/sk-doc/hub-router.json`, `.skilled/skills/system-deep-loop/hub-router.json` | Modify | Six and three keywords |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/{sk-doc,system-deep-loop}/manifest.json` and their copies under `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/` | Modify (generated) | Refreshed after each hub edit |
| `ADV/lib/command-attach.ts`, `ADV/tests/command-attach.vitest.ts` | Modify | `routeNeedsMode` |
| `ADV/schemas/advisor-tool-schemas.ts`, `ADV/lib/subprocess.ts` | Modify | `needsMode` on a recommendation |
| `ADV/handlers/advisor-recommend.ts`, `ADV/tests/handlers/advisor-recommend-compiled-route-option.vitest.ts` | Modify | Set `needsMode` in the compiled route enrichment |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`, `ADV/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Modify | Keep `needsMode` from the CLI |
| `ADV/lib/render.ts`, `ADV/tests/command-brief-golden.vitest.ts` | Modify | The label and its golden heads |
| `ADV/lib/scorer/lanes/explicit.ts` | Modify | Three deep anchors, then three create anchors |
| `ADV/scripts/routing-accuracy/command-routing-baseline.json` | Modify (generated) | Recaptured after waves A, B, D and E |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/doctor-command-routing.md` | Modify | The label and the named doctor command |
| `ADV/lib/prompt-policy.ts`, `ADV/tests/legacy/advisor-prompt-policy.vitest.ts` | Modify (amendment) | Read `sk-`, `system-`, `cli-` and `mcp-` skill names as explicit skill markers |

Scope amendment, taken by the coordinator on 2026-11-13 under goal decision D1 and not by the operator: the prompt policy file and its test joined the scope because the live hook skipped `use the system-deep-loop skill`, the exact prompt AC-005 names, while the policy read only `sk-` names as skill markers.

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. The restraint pass: one new file, the hand-off test, because its subject is a new exported function and the existing doctor test file holds only the module's pure helpers. `needsMode` is a new optional field rather than a reuse of `compiledRoute`, because the CLI fallback and the plugin drop `compiledRoute` before the brief renders.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | When the doctor hand-off fires and the ranker's first candidate has a `command-doctor-*` row in `COMMAND_ROWS` with policy `run` that the projection holds, the inserted recommendation is that row, and otherwise it is `command-doctor-helper`. A helper that passes on its own wording is left alone. |
| REQ-002 | `stopped converg` followed by word characters is a strong cue, and with no passing skill and no ranked candidate a prompt holding `repair path` or `i have a problem` gets the helper. |
| REQ-003 | The `sk-doc` hub gains exactly `agent definition`, `specialist persona file`, `before and after my rewrite`, `intent file`, `prompt shortcut` and `confirm flag`, and only the five tune rows named in `tasks.md` change route among every non-holdout corpus row and canary prompt. The hub serves fresh, the guard reports 0 failures and the sync check matches every served copy. |
| REQ-004 | A recommendation for a hub listed in `MODE_COMMANDS` whose compiled route answers `defer` or `clarify`, and that carries no command, has `needsMode: true` and renders `use <hub> (needs a mode)`. The golden test pins both the new head and the head of a command that wins over the flag. Every other golden head is unchanged. |
| REQ-005 | The three deep anchors and the three deep hub aliases make the three deep tune rows top `system-deep-loop` and carry `/deep:research`, `/deep:review` and `/deep:ai-council` with policy `ask`, while `nm-system-deep-loop-01` keeps its route and offers nothing. |
| REQ-006 | After every wave typed recall is at least 24 of 44, false offers and attached false offers are exactly 0 of 35, the typed block equals its before line, the scorer eval is no lower than `[159,50,20]` and its before line with false fire at most 5, and the Python test, the parity test and the advisor suite report 0 failed. |
| REQ-007 | No added code comment names a spec path, phase number, task id, ADR or REQ id. `AGENTS.md` and `.skilled/commands/create/` are unchanged, no dependency is added and no task reads or prints a holdout prompt. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | When wave D leaves the floors unchanged, three anchors make `create-command` and `create-goal` top `sk-doc` with their command attached and `create-manual-testing-playbook` top its command row. When it does not, wave E is recorded as skipped with the line that moved. |
| REQ-009 | The committed baseline reads `attachedMetrics.plain.tune.combined` above 9 of 45, and the 16 plain chat rows each carry their command at top 1, attached or in the top three. |
| REQ-010 | The hook guide describes the label and the doctor feature catalog page describes the named command and the repair request. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq -c '.attachedMetrics.plain.tune' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` prints a `combined` above 9. The expectation per wave is 14 after A, 17 after B, 17 after C, 20 after D and 23 after E. Only the floors are a hard gate.
- **SC-002**: Of the 16 plain chat rows, the expectation is 7 with an offer after A, 10 after B, 13 after D and 16 after E, counted from the baseline as top 1, attached or top 3.
- **SC-003**: Every floor in REQ-006 prints its before value or better in `scratch/after-<wave>.txt` after every wave.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 011 is still editing `command-attach.ts`, `fusion.ts`, `advisor-recommend.ts`, the schema and the baseline | A task here would collide with a worker | The coordinator confirms phase 011 is committed before wave 1, and every task re-reads its anchor text |
| Risk | The CI row's two ranked candidates tie at 12.301 (`report` run, `scaffold` ask) | Med: a tie order change would bring the helper back on that row | The test pins the ranker's rank 1. The helper is the safe fallback, never a wrong command |
| Risk | An alias reaches a must-not-start or near-miss row | High: a false offer breaks the floor | Each hub task diffs the route of every non-holdout row and canary prompt against wave 0 and the floor check counts attached false offers |
| Risk | The deep anchors reorder other rows | Med: the scorer eval could drop | The simulation changed no eval row. The wave D floor check gates wave E |
| Risk | A hub edit leaves the hub serving `legacy` | High: phase 006 measured tune recall falling from 9 to 6 | Every hub task ends with the refresh, the copy, the freshness check, the guard and the sync check |
| Risk | The live advisor CLI answered from the Python scorer on 2026-11-13 (reason format `Matched: !...`, no `compiledRoute`) | Med: a live hook run may not exercise the TypeScript path | Did not reproduce at build time: the CLI answered from the native scorer, likely because the built `dist` was stale when the planner ran, which is inferred and not confirmed |
| Risk | `refresh` also rewrites `fence-state.json` | Low: the sync check would name a mismatched served copy | UNKNOWN. Phase 006 saw only `manifest.json` change. The sync check is in every hub task |
| Risk | The OpenCode plugin's `cliRecommendations` drops `command`, `policy` and `needsMode` | Med: the label and the commands do not reach OpenCode through that mapper | Out of scope here and recorded for phase 013 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The hand-off adds one scan of `COMMAND_ROWS` (under 60 rows) per prompt that already reached the ranker, and no subprocess.
- **NFR-P02**: The label adds 15 bytes to a head that already withheld its command, and nothing to any other head.

### Security
- **NFR-S01**: No task reads or prints holdout prompt text. Every route and score loop filters `split` before it reads a prompt and prints ids only.
- **NFR-S02**: No task writes to the home folder or installs anything.

### Reliability
- **NFR-R01**: A ranked command that asks first, or one with no bridge in the projection, keeps the existing helper behaviour.
- **NFR-R02**: A hub outside `MODE_COMMANDS` never carries `needsMode`, so the `sk-code` and `mcp-tooling` heads stay as they are.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no ranked candidate and no repair phrase inserts nothing, as today.
- Maximum input: a prompt with a passing skill and `I have a problem with my CSS layout` keeps `sk-code` alone, because the repair insertion needs no passing skill.
- Failure path: when the ranker script is missing, `matchDoctorProblem` returns null and only the repair phrase can insert the helper.
- A typed `/deep:review` on a deferring hub carries the command, and the label is dropped because a command wins.
- `nm-system-deep-loop-01` routes to `research` on `research loop` and stays silent, because the depth gate finds no effort wording.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 20 files and 300 lines across the advisor runtime, two hub routers and their manifests |
| Risk | 13/25 | Two scorer changes and two hub vocabularies, each behind a floor check and a recapture |
| Research | 4/20 | The causes, the claims and every wave's effect are measured or simulated |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

Each answer below is an autonomous decision under the packet goal's D1 ("Run autonomously and ask the operator nothing. Take the recommended option"), recorded on 2026-11-13.

- Where does the doctor change go? Decision: in the insertion, not the early return (Recommended). The delivered helper is the insertion, and a helper that passes on its own words is the right answer for a request to pick a doctor command.
- Which ranked commands are offered by name? Decision: only a `run` command (Recommended). An `ask` command goes through the helper, which explains the choice before anything changes.
- Which repair phrases insert the helper? Decision: `repair path` and `i have a problem`, only with no passing skill (Recommended). Both are absent from all 31 silence rows.
- Which `sk-doc` aliases? Decision: the six that move a measured row now or after wave E (Recommended). `readme`, `repo-rule`, `manual-testing-playbook` and `skill-parent` aliases moved no row with `sk-doc` on top, and the `readme` alias turned a route into a clarify.
- Why two aliases for `/create:command`? Decision: `prompt shortcut` alone ties with `sk-create-quality-control`, which matches `flag` in the same prompt (Recommended). `confirm flag` names the `:auto` and `:confirm` suffix a command author writes.
- Which hubs carry the label? Decision: the three in `MODE_COMMANDS` (Recommended). Only they withhold a command, and the label on `sk-code` would add bytes with nothing to offer.
- What decides wave E? Decision: the wave D floor check against the wave C line (Recommended). See `plan.md` section 4.
- The child goal and the continuity save. Decision: skipped (Recommended). The brief for this planning pass forbids both, as it did for phase 011.

### Open

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research-segment-2.md`
