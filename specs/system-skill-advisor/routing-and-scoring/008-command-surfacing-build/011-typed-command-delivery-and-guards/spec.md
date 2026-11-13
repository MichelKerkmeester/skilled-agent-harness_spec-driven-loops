---
title: "Feature Specification: Phase 11: typed-command-delivery-and-guards"
description: "Seven of 44 typed slash commands reach the model with no command, and eight more reach it with a command but no policy. This phase makes a typed tracked command travel on the top recommendation with its policy, 44 of 44, measures it in the command capture and adds three small guards from the research: a command visibility count in the mirror check, hook health in the advisor status and a head length test with a brief cost script."
trigger_phrases:
  - "typed command delivery and guards"
  - "phase 11 typed command delivery"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: typed-command-delivery-and-guards

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-reachability-and-attribution |
| **Successor** | None |
| **Handoff Criteria** | The command capture prints `attachedMetrics.typed.combined` 44 of 44, every pinned floor holds and the three guards run in their checks |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy (`../spec.md`). Its main part closes the typed gap that phases 003 to 005 left: a typed command must reach the model on the top recommendation. Its second part builds three small guards from `../009-ux-performance-cross-cli-research/research/research.md` section 9: the second half of rank 9, rank 12 and two items of rank 14.

**Scope Boundary**: The command table generator and its generated block, the typed command helpers, one ordering step in the scorer, the recommend handler, the command capture and its baseline, one new head test, one new cost script, the runtime mirror check, the advisor status output and its schema, the advisor leg text of `/doctor:setup`, one install guide step and the READMEs that describe them. The brief text, the scorer weights, `AGENTS.md` and every command file stay as they are.

**Dependencies**:
- Phase 005 adds `command`, `policy` and `ownerSkillId` to a recommendation and the policy to the brief head. This phase builds on that contract and edits the same handler and attach module.
- Phase 008 edits `advisor-status.ts`, `doctor-setup.yaml` and `INSTALL-SKILLED.md`. Phase 010 edits the routing-accuracy README. No task here starts before those three phases are committed.

**Deliverables**:
- A typed tracked command literal makes the top recommendation carry that command, its policy and its owner when the top is the command row or its owner.
- A typed command with no scorer row of its own puts its owner skill first.
- Every attached command carries its policy, including the eight with no active bridge.
- `attachedMetrics.typed` and a per-row list in the command capture, at 44 of 44.
- A visibility count and a collapse guard in `sync-runtime-mirrors.cjs --check`, hook health in `advisor_status` and the `/doctor:setup` advisor leg, a prove-it install step, a head length test and `measure-brief-cost.mjs`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A user who types a tracked slash command has already chosen the workflow, yet 7 of the 44 typed corpus rows reach the model with no command in the head at all. The top recommendation is the command's owner skill (or another skill) and nothing attaches the command to it. Of the 13 rows that do get a command attached by a hub's compiled route, 8 get it with no policy, because the generated policy table lists only commands whose bridge is active in some runtime. The model then sees a skill name where the user named a runnable workflow.

### Purpose
Every typed tracked command reaches the model as `<owner> → <command> (<policy>)`, measured as 44 of 44 in the committed capture, with no pinned number lower than today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran from the repository root of the worktree on 2026-11-13 at 00:31Z, at commit `f8a7f6fc10`, while workers were building phases 005 and 010. The output is verbatim. `live.json` is the capture's output written to the scratchpad. `live.err` stayed empty. `probe2.mjs` is a scratchpad script that scores corpus rows by id under the capture's fixture regime and prints the two leading ids, never the prompt.

```text
$ git rev-parse --short HEAD
f8a7f6fc10
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs > live.json 2>live.err
$ jq -c '.metrics.typed_recall_at_1, .metrics.false_offer' live.json
{"correct":24,"total":44}
{"count":0,"total":35}
$ jq -c '[.rows | to_entries[] | select(.key|endswith("-typed-01"))] as $t | .attachedMetrics.attachedRows as $a | {own: ([$t[]|select(.value.top1)]|length), attached: ([$t[]|select((.value.top1|not) and $a[.key]==.value.expected_command)]|length), none: [$t[]|select((.value.top1|not) and ($a[.key]!=.value.expected_command))|.key+" top="+.value.top]}' live.json
{"own":24,"attached":13,"none":["cmd-create-goal-typed-01 top=system-spec-kit","cmd-create-skill-parent-typed-01 top=mcp-tooling","cmd-deep-research-typed-01 top=system-deep-loop","cmd-deep-review-typed-01 top=system-deep-loop","cmd-prompt-improve-typed-01 top=sk-prompt","cmd-speckit-resume-typed-01 top=system-spec-kit","cmd-speckit-save-typed-01 top=system-spec-kit"]}
$ jq -r '.attachedMetrics.attachedRows | to_entries[] | select(.key|endswith("-typed-01")) | .value' live.json | sort -u | while read c; do printf '%s policy=%s\n' "$c" "$(rg -c "^  '$c': '" .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts || echo 0)"; done
/create:benchmark policy=0
/create:changelog policy=1
/create:command policy=0
/create:diff policy=0
/create:feature-catalog policy=1
/create:readme policy=1
/create:repo-rule policy=0
/create:skill policy=1
/create:with-human-voice policy=0
/deep:ai-council policy=0
/design:chart policy=0
/design:diagram policy=0
/design:extract policy=0
$ node probe2.mjs "$PWD" cmd-create-goal-typed-01 cmd-create-skill-parent-typed-01 cmd-deep-research-typed-01 cmd-deep-review-typed-01 cmd-prompt-improve-typed-01 cmd-speckit-resume-typed-01 cmd-speckit-save-typed-01
cmd-create-goal-typed-01 system-spec-kit=0.655 sk-doc=0.220865
cmd-create-skill-parent-typed-01 mcp-tooling=0.331998 sk-doc=0.264047
cmd-deep-research-typed-01 system-deep-loop=0.535736
cmd-deep-review-typed-01 system-deep-loop=0.62907 sk-code=0.512667
cmd-prompt-improve-typed-01 sk-prompt=0.702729 command-prompt-improve=0.62
cmd-speckit-resume-typed-01 system-spec-kit=0.594075 command-speckit-resume=0.66
cmd-speckit-save-typed-01 system-spec-kit=0.757183 command-speckit-save=0.72
$ for id in cmd-deep-research-typed-01 cmd-deep-review-typed-01 cmd-deep-ai-council-typed-01; do jq -r --arg id $id 'select(.id==$id).prompt' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl | node .skilled/bin/compiled-route.cjs --hub system-deep-loop --prompt-stdin | jq -c --arg id $id '{id:$id, action, selectionKind, targets:[.targets[]?|.workflowMode]}'; done
{"id":"cmd-deep-research-typed-01","action":"defer","selectionKind":null,"targets":[]}
{"id":"cmd-deep-review-typed-01","action":"defer","selectionKind":null,"targets":[]}
{"id":"cmd-deep-ai-council-typed-01","action":"route","selectionKind":"single","targets":["ai-council"]}
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"/speckit:resume cache work"}' --format json | jq -c '{status, top: .data.recommendations[0] | {skillId, kind, command, policy, ownerSkillId}, second: .data.recommendations[1] | {skillId, command, policy}}'
{"status":"ok","top":{"skillId":"system-spec-kit","kind":"skill","command":null,"policy":null,"ownerSkillId":null},"second":{"skillId":"command-speckit-resume","command":"/speckit:resume","policy":"start"}}
$ node .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[159,50,20,5]
$ jq -c '.metrics | {slash_variant, agreement, typed_reach_top3}' live.json
{"slash_variant":{"reached_top3":5,"named_total":8,"offered_on_partial":0,"partial_total":4},"agreement":{"correct":7,"total":9},"typed_reach_top3":{"correct":27,"total":44}}
$ jq -c '.attachedMetrics.false_offer_attached' live.json
{"count":0,"total":35}
$ node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check | jq -r .status
stale
$ node -e "<count claude-commands mirrors per folder from buildExpectedLinks()>"
create 13 true
deep 3 false
design 3 false
doctor 17 false
 1 false
prompt 1 false
speckit 7 false
visible 33
```

The deriver printed `stale` because a worker was mid-edit, so its fresh state is recorded again by T001. The last command counts the Claude command mirrors per folder, `true` meaning the folder holds `skill.md`. The folder with an empty name is the private, untracked `local-skilled-alignment.md`, so the 44 tracked commands show as 32 on Claude Code: 31 outside `create/` plus the one entry the collapsed folder becomes. No holdout row was opened. Every probed row has split `none`.

### Cause per Row
Each row names the cause in code, read on 2026-11-13. `ADV` is `.skilled/skills/system-skill-advisor/runtime`.
- `/create:goal`: the typed literal gives `sk-doc` no evidence. Its bridge is off in the TypeScript scorer (`command-bridges.generated.json`, `command-create-goal` with `runtime.typescript.enabled` false) and `PHRASE_BOOSTS` has no entry for it (`ADV/lib/scorer/lanes/explicit.ts:92-99`). The word `packet` boosts `system-spec-kit` by 0.55 (`explicit.ts:53`), which wins at 0.655 against 0.221. `system-spec-kit` is not a compiled hub (`ADV/lib/compiled-routing-flag.ts:14-22`), so nothing attaches a command.
- `/create:skill-parent`: the same missing owner evidence, and `mcp-tooling` wins on shared tokens (0.332 against 0.264). `mcp-tooling` is a compiled hub but has no row in `MODE_COMMANDS` (`ADV/lib/command-attach.ts:15-41`), so `attachCommand` returns nothing.
- `/deep:research` and `/deep:review`: the owner `system-deep-loop` is top through `PHRASE_BOOSTS` (`explicit.ts:97-98`), but the deep-loop compiled route answers `action: defer` for these prompts, so `attachCommand` stops at `command-attach.ts:237`. The `/deep:` depth gate at `command-attach.ts:259` would have passed.
- `/prompt:improve`: the owner `sk-prompt` outscores the command row (0.703 against 0.62) through `system prompt` (`explicit.ts:177`) and the `prompt` token. `sk-prompt` is not a compiled hub.
- `/speckit:resume`: the command row scores higher (0.66 against 0.594) but the ordering puts its owner first on purpose: the explicit lane adds 0.4 to the owner and takes 1.0 from the row (`explicit.ts:346-348`) and the primary intent step adds 0.16 and takes 0.12 (`ADV/lib/scorer/fusion.ts:784-786`, `ADV/lib/scorer/scoring-constants.ts:226-227`). The ambiguity corpus pins this owner as gold (row `rr-iter3-123`), and the Python reference folds the row into its owner (`scoring-compatibility.json` `pythonOwnerNormalization`, `"command-speckit-resume": "system-spec-kit"`). The live CLI output above shows the result: the top carries no command and the second entry does.
- `/speckit:save`: the owner `system-spec-kit` outscores the command row (0.757 against 0.72) on ordinary lane evidence. It is not a compiled hub.
- The eight attached commands with no policy: the deriver skips an entry whose bridge is off in both runtimes before it records a policy (`ADV/scripts/command-bridges/derive-command-bridges.cjs:1153`), and the handler reads the policy from that table (`ADV/handlers/advisor-recommend.ts:475`).

Three typed rows carry a corpus `expected_policy` that differs from the policy the generated tables give the command they reach: `cmd-doctor-env-typed-01` (label `ask`, `/doctor:env list` is `run`), `cmd-doctor-update-typed-01` (label `start`, `/doctor:update` is `ask`) and `cmd-design-extract-typed-01` (label `start`, `/design:extract` is `ask`). This was read by comparing each typed row's label with the policy tables in `command-attach.ts` and `command-bridges.generated.json`. The phase measures the policy the system delivers and reports the three disagreements by id in T020.

Five of the seven rows have their owner on top, so a rule that attaches a typed command to its owner fixes them without moving any score. The two `/create:*` rows have a wrong top, so they need the owner placed first. Moving any score instead would break pins: `/speckit:resume` on its owner is gold in the ambiguity corpus.

### Research Claims Checked in Code
- Rank 9: `create/skill.md` collapses its folder on Claude Code. Confirmed by `../007-per-runtime-behaviour-proof/scratch/g5/result.txt` (listing A shows one `create` entry and no `create:readme`).
- Rank 9: `--check` prints `claude 32/44` today. Refuted: `checkMirrors` prints only a PASS line or drift lines (`.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs:316-346`). The number itself is right: the count above gives 32 of 44.
- Rank 9: `--check` is where a guard blocks a new collapse. Confirmed: the pre-commit hook runs it (`.skilled/scripts/git-hooks/pre-commit:437`).
- Rank 12: `advisor_status` reports no hook health. Confirmed: the strict output schema has no such field (`ADV/schemas/advisor-tool-schemas.ts:415`), and `readAdvisorHookHealthSection` (`ADV/lib/metrics.ts:483`) is read only by `advisor-validate.ts:618`. Its `rollingP95Ms` counts cache-hit invocations only (`metrics.ts:475-476`), so the field is documented as such.
- Rank 12: `/doctor:setup` prints SKIP when the daemon is cold. Confirmed: `.skilled/commands/doctor/assets/doctor-setup.yaml:57`.
- Rank 12 against phase 008: phase 008 adds semantic lane fields to `advisor_status` (its T013, T017 and T022) and an embedder leg after the advisor leg (its T023). It adds no hook health, so nothing here is dropped, and these tasks run after it.
- Rank 14: a 140-byte head guard exists, with the worst head at 136 bytes. Refuted: no 140-byte limit is in the code. The renderer caps a single head at `DEFAULT_TOKEN_CAP` 80 times `TOKEN_TO_CHAR_ESTIMATE` 4, which is 320 characters, and truncates past it silently with `...` (`ADV/lib/render.ts:98`, `:101`, `:143`). Phase 005's golden test uses the same 320 (`ADV/tests/command-brief-golden.vitest.ts:11`). The head test uses 320 bytes and also fails on a truncated head.
- Rank 14: no brief cost script exists. Confirmed: `ADV/scripts` holds `measure-embedder-cost.mjs` and no `measure-brief-cost.mjs`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Typed delivery: a generated table of every tracked command with its policy, owner and whether it has a scorer row, the typed command helpers, the owner-first ordering step, the handler step that attaches a typed command to the top and the policy for every hub-attached command.
- Measurement: `attachedMetrics.typed` and `attachedMetrics.typedRows` in the command capture, and a recaptured baseline.
- Guards: the visibility count and collapse guard (rank 9, second half), hook health in status, the setup leg and the install guide (rank 12), the head length test and `measure-brief-cost.mjs` (rank 14, two items).

### Out of Scope
- Rank 7, the command document path in the head. It waits on the after arm of phase 007, which shows which runtimes still decline.
- Rank 8, the policy clause in the Gate 2 bullet. Phase 006 froze that text.
- Rank 11, the embed deadline as a real abort. It belongs to phase 008's embed deadline work.
- Rank 13, collapsing the hook spawns. It is conditional on a slow cold start, and the cold start measured fine: a true cold first prompt took 611 to 844 ms against a 2,500 ms budget (`../010-reachability-and-attribution/scratch/cold-arena-result.txt`).
- The first half of rank 9 and the other items of rank 14.
- Renaming any command, including `.skilled/commands/create/skill.md`. Decision Q025 rules it out.
- Any write to a home-folder config and any install.
- Changing any scorer weight, the `/speckit:resume` disambiguation or the Python scorer.
- Reconciling the three corpus policy labels that disagree with the delivered policy. A corpus edit changes the corpus hash the baseline is pinned to, and which side is right is a policy call for the operator.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` | Modify | Emit `TRACKED_COMMANDS` in the generated rows block |
| `ADV/lib/command-attach.ts` | Modify | The `TrackedCommand` shape, the regenerated block, `typedCommandIn` and `typedCommandForTop` |
| `ADV/tests/command-attach.vitest.ts` | Modify | Cases for the two helpers |
| `ADV/lib/scorer/fusion.ts` | Modify | `rankTypedCommandOwnerFirst` after the doctor helper handoff |
| `ADV/tests/scorer/typed-command-owner.vitest.ts` | Create | Cases for the ordering step |
| `ADV/handlers/advisor-recommend.ts` | Modify | `attachTypedCommand` on both return paths and the policy for hub-attached commands |
| `ADV/tests/handlers/advisor-recommend-typed-command.vitest.ts` | Create | Cases for `attachTypedCommand` |
| `ADV/tests/command-head-length.vitest.ts` | Create | Head length over every tracked command |
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` and `command-routing-baseline.json` | Modify | The typed block, the per-row list and the recapture |
| `ADV/scripts/measure-brief-cost.mjs` | Create | Brief bytes and estimated tokens per typed row |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-runtime-mirrors.cjs`, its test and its README | Modify | Visibility line and collapse guard |
| `ADV/schemas/advisor-tool-schemas.ts`, `ADV/handlers/advisor-status.ts`, `ADV/tests/handlers/advisor-status.vitest.ts` | Modify | `hookHealth` in the status output |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modify | Hook health under the advisor leg |
| `INSTALL-SKILLED.md` | Modify | One prove-it step |
| `ADV/scripts/routing-accuracy/README.md`, `ADV/scripts/command-bridges/README.md` | Modify | The typed block, the cost script and the new table |

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. The restraint pass for each new file: the ordering test and the handler test are new files because their subjects are new exported functions and the existing suites are being edited by phase 005. The head test is new because no current test walks every tracked command. `measure-brief-cost.mjs` is new because no script measures the brief, and it spawns the hook itself instead of importing `command-offer.mjs`, which phase 010 is still building. The `TRACKED_COMMANDS` table is one table, not a second policy map, because the handler, the ordering step and the capture all need policy, owner and scorer row together.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The deriver writes `TRACKED_COMMANDS` into the generated block of `command-attach.ts`: one row per bridge entry, keyed by its runnable string, with `policy`, `ownerSkillId` and `scorerRow` (true when the TypeScript bridge is enabled), whether or not the bridge is active. The deriver's check prints `fresh`. |
| REQ-002 | `typedCommandIn(prompt)` returns the longest `TRACKED_COMMANDS` key typed as its own token, and `typedCommandForTop(topSkillId, prompt)` returns that key's row when the top is its owner or a command row with the same command. |
| REQ-003 | When the prompt types a command with no scorer row and its owner passes the threshold below rank 1, the scorer puts the owner first and leaves every other order unchanged. |
| REQ-004 | The recommend handler gives the top recommendation the typed command, its policy and its owner whenever `typedCommandForTop` returns a row, on the cached and the uncached path, and a hub-attached command takes its policy from `TRACKED_COMMANDS`. |
| REQ-005 | The command capture reports `attachedMetrics.typed` with `own`, `attached`, `combined` and `total` and `attachedMetrics.typedRows` keyed by row id with no prompt text, and the committed baseline reads `combined` 44 of 44. |
| REQ-006 | The floors hold: typed recall at least 24 of 44, false offers exactly 0 of 35, attached false offers 0 of 35, slash-variant reach at least 5, scorer eval at least `[159,50,20]` with false fire at most 5, the typecheck and the Python test exit 0, the deriver check prints `fresh` and the parity and slice tests pass. |
| REQ-007 | No added code comment names a spec path, phase number, task id, ADR or REQ id, and `AGENTS.md` and `.skilled/commands/create/` are unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `sync-runtime-mirrors.cjs --check` prints `visibility claude 32/44, cursor 44/44` on this tree, and exits 1 with a `COLLAPSE` line when any command folder other than `create/` holds a `skill.md`. |
| REQ-009 | `advisor_status` carries `hookHealth` with `invocations`, `rollingP95Ms`, `rollingFailOpenRate` and `rollingCacheHitRate` when the diagnostics file holds records, the `/doctor:setup` advisor leg shows it without changing the leg's status and `INSTALL-SKILLED.md` has one command that prints a recommendation. |
| REQ-010 | A head test renders the head for every tracked command and fails when one is over 320 bytes or truncated. |
| REQ-011 | `measure-brief-cost.mjs` prints the brief's bytes and estimated tokens for each typed row, refuses a holdout row and removes its sandbox. |
| REQ-012 | The routing-accuracy, command-bridges and runtime-mirrors READMEs describe the new keys, the table, the script and the check line. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `jq -c '.attachedMetrics.typed' command-routing-baseline.json` prints `{"own":24,"attached":20,"combined":44,"total":44}`.
- **SC-002**: The Claude prompt hook, run in a sandboxed socket directory on each of the 44 typed rows, prints a head whose command matches the row's command and that carries a policy, and only the three rows named in section 2 disagree with their `expected_policy` label.
- **SC-003**: Every pinned floor in REQ-006 prints a number no lower than its before value in `scratch/before.txt`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 005, 008 and 010 edit the same files | A task here would collide with a worker | The coordinator confirms all three are committed before wave 1, and each task re-reads its anchor |
| Risk | The owner-first step changes a scorer-eval row | Med: a pinned number could drop | It fires only for a typed command with no scorer row, and T022 reruns every floor against `scratch/before.txt` |
| Risk | The owner and a lower command row render the same label | Low: an ambiguous head could read the same command twice | T014's cases cover the single head, and T020 checks the real heads of all 44 rows |
| Risk | A typed literal inside a path or a longer name matches | Med: a wrong command attaches | The detector needs a token boundary on both sides and prefers the longest key, with cases in T008 |
| Risk | The capture's live numbers move after the scorer change | Low: the slice test fails until the recapture | T017 rebuilds and recaptures with `--write` in one task |
| Risk | The hook check or the cost script leaves a daemon running | Low | Both use a sandboxed socket directory and stop only a process that names it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The typed step adds no subprocess. It is one scan of the prompt against the table per recommendation call.

### Security
- **NFR-S01**: No task reads or prints holdout prompt text. The cost script and the hook check filter on `split` before they read a prompt and print ids only.
- **NFR-S02**: No task writes to the home folder. The diagnostics file `advisor_status` reads lives under the system temp folder.

### Reliability
- **NFR-R01**: A prompt with no typed command, or a typed command whose owner is not on top, leaves the recommendation exactly as it was.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no slash returns no typed command, and nothing changes.
- Maximum input: `/create:skill-parent` matches its own key and never the shorter `/create:skill`, and a partial such as `/create:sk` matches nothing.
- Failure path: a typed command whose owner does not pass the threshold leaves the order alone, and the head shows the skill as before.
- A path such as `docs/create:goal.md` is not a typed command, because the character before the slash is a letter.
- A bare `/doctor:git` with no route has no key of its own, so the existing typed doctor ordering keeps handling it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | About 20 files and 700 lines across the advisor runtime, one mirror script, one doctor asset and the install guide |
| Risk | 12/25 | One scorer ordering step and a recaptured ratchet baseline, guarded by every floor |
| Research | 5/20 | The causes and the claims are read in code |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

Each answer below is an autonomous decision under the packet goal's D1 ("Run autonomously and ask the operator nothing. Take the recommended option"), recorded on 2026-11-13.

- Fix the typed gap in scoring or in delivery? Decision: in delivery, with one ordering step for the two rows whose top is wrong (Recommended). Five rows already have the owner on top, and the `/speckit:resume` owner is pinned gold, so moving scores would lower pinned numbers. Attaching the typed command to its owner changes no score.
- One rule or seven cases? Decision: one rule (Recommended). A typed tracked command literal makes the top recommendation carry that command when the top is the command row or its owner. It fixes `/deep:research`, `/deep:review`, `/prompt:improve`, `/speckit:resume` and `/speckit:save` directly. The owner-first step, which fires only for a typed command with no scorer row, makes the rule reach `/create:goal` and `/create:skill-parent`.
- Does the typed command override a hub's compiled route command? Decision: yes (Recommended). The user typed it, which is stronger evidence than a routed mode.
- Where does the policy come from? Decision: one generated `TRACKED_COMMANDS` table from the deriver, covering every bridge entry (Recommended). It also gives the eight hub-attached commands their policy. `COMMAND_POLICIES` stays, unused by the handler after T016, because removing a generated export is outside this scope.
- Does the capture's `attached` count need a policy? Decision: yes, an attached row counts only when the command matches and a policy resolves (Recommended). `own` counts like the plain block, because every command row the scorer can rank carries a policy.
- Which policy counts as delivered? Decision: the policy the generated tables give the command in the head, not the corpus `expected_policy` label (Recommended). Three labels disagree, and fixing labels is outside this phase.
- Does the Python scorer get the owner-first step? Decision: no (Recommended). No parity test case holds a typed command with no scorer row, so the parity test and the Python test stay as the guard and run in T022.
- What is the head limit? Decision: 320 bytes, the renderer's own single-head cap, plus a check that the head is not truncated (Recommended). The research's 140-byte guard does not exist in code.
- Which runtimes does the visibility count cover? Decision: Claude Code by the folder rule and Cursor as flat names (Recommended). OpenCode's folder behaviour is unproven (research question 3), so it is not counted.
- Does a new file inside `create/` fail the guard? Decision: no, only a new `skill.md` in another folder fails (Recommended). That is the act that collapses a folder, and the existing case stays on a one-entry allowlist.
- When is `hookHealth` present? Decision: only when the diagnostics file holds at least one record (Recommended), so a fresh install shows no zero p95 that reads like a measurement.
- Does the setup leg change status on hook health? Decision: no, it only shows it (Recommended). The route invariant keeps the leg read-only, and the research ruled out a new leg.
- The child goal and binding row that the plan workflow asks for when a parent has a `goal.md`. Decision: skipped (Recommended). The brief for this phase forbids editing the parent's `goal.md`, and sibling 010 has no child goal either.
- The workflow's explorer agents, its `research/research.md` output and its continuity save. Decision: skipped (Recommended). The causes and the claims were read in code directly, the research exists in phase 009 and the spec authoring card forbids `generate-context.js` in a planning worker.
- The level. Decision: Level 2 as the brief states (Recommended).
- `implementation-summary.md`. Decision: not scaffolded now (Recommended). The last task writes it.

### Open

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Research**: `../009-ux-performance-cross-cli-research/research/research.md`
