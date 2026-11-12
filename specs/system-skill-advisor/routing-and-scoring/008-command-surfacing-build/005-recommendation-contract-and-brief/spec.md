---
title: "Feature Specification: Phase 5: recommendation-contract-and-brief"
description: "The recommendation carries no command kind, policy or owner, and the hook brief prints raw command ids such as command-speckit-save. This phase adds the four fields, prints the command and its policy in the brief head for every family, states the degraded-path contract and retires the allow-list and the hand-authored bridge leftovers."
trigger_phrases:
  - "recommendation contract and brief"
  - "phase 5 recommendation contract and brief"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: recommendation-contract-and-brief

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 7 |
| **Predecessor** | 004-command-meaning-matching |
| **Successor** | 006-gate-2-binding-and-runtime-pointers |
| **Handoff Criteria** | The recommendation and the brief carry the command and its policy. The schema test and the six golden briefs pass, and `save context` returns one entry that carries `/speckit:save` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the build that makes the skill advisor surface every tracked slash command with a run-or-ask policy and brings a chat-only request onto a proper workflow (`../spec.md`). It delivers the review's R3, L6, L12 and G6, then L1 and L7 (`../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md` sections 3 and 4).

**Scope Boundary**: The public recommendation fields, the hook brief head, the degraded-path contract, the allow-list retirement and the hand-authored bridge leftovers. Scoring, the policies themselves, `AGENTS.md` and the runtime pointers stay as they are. The group labelled CARRY-003 holds three criteria phase 003 left unmet and can be kept or dropped as one unit.

**Dependencies**:
- Phase 002 shipped `commandPolicies` in the generated bridge file and `derivePolicy` in the deriver.
- Phase 003 shipped the optional `command` field, `attachCommand`, the generated `MODE_COMMANDS` block and the same-owner ambiguity rule.
- Phase 004 shipped the command vectors and the meaning anchor. This phase does not touch them.
- Phase 007 takes its before-measurement on the branch tip first. No code task of this phase starts before the coordinator confirms that run is done.

**Deliverables**:
- Four recommendation fields filled from one generated table, `kind`, `command`, `policy` and `ownerSkillId`.
- A brief head of the form `use <owner> → <command> (<policy>)` for every command family, proven by six golden briefs.
- A stated and tested contract for a degraded result.
- The allow-list file and the dead ids retired, and the hand-authored bridge constants deleted.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A model that reads the hook brief sees `use command-speckit-save` or `use command-spec-kit-plan`, a raw scorer id that names no slash command and no policy. The public recommendation carries a `command` field only when a hub attaches one, and it never carries a policy, a kind or an owner, so a caller cannot tell whether to run, start or ask. When the daemon is down, the local Python scorer returns command rows such as `command-create-readme` for a plain prompt, and nothing says what a degraded brief may show.

### Purpose
Every recommendation that names a command tells the model three things in a brief head that fits the 80-token cap: the runnable slash string, whether to run it, start it or ask first and which skill owns it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Every command ran from the repository root on 2026-11-12 at commit `fe20ca1c36`, except the last two, which ran from `.skilled/skills/system-skill-advisor/runtime`. The output is verbatim.

```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"save context"}' --format json | jq -c '[.data.recommendations[] | {skillId, command}]'
[{"skillId":"command-speckit-save","command":null},{"skillId":"system-spec-kit","command":null},{"skillId":"cli-external-orchestration","command":null}]
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"save context"}' --format json | jq '[.data.recommendations[] | select(.command == "/speckit:save")] | length'
0
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"/speckit:plan add a login page"}' --format json | jq -c '.data.ambiguous, .data.recommendations[0]'
false
{"skillId":"command-spec-kit-plan","score":0.563727,"confidence":0.823,"uncertainty":0.16,"dominantLane":"explicit_author","status":"active"}
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"create a readme for the utils folder","options":{"includeCompiledRoute":true}}' --format json | jq -c '[.data.recommendations[] | {skillId, command, kind, policy}]'
[{"skillId":"sk-doc","command":"/create:readme","kind":null,"policy":null},{"skillId":"system-spec-kit","command":null,"kind":null,"policy":null},{"skillId":"mcp-tooling","command":null,"kind":null,"policy":null}]
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"show me which packets mention the token cap"}' --format json | jq -c '.data.recommendations'
[]
$ printf '{"prompt":"/speckit:plan add a login page",...}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | jq -r '.hookSpecificOutput.additionalContext' | head -1
Advisor: live; use command-spec-kit-plan 0.82/0.16 pass.
$ printf '{"prompt":"save context for this packet before I stop for the day",...}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | jq -r '.hookSpecificOutput.additionalContext' | head -1
Advisor: live; use command-speckit-save 0.89/0.12 pass.
$ printf '{"prompt":"please improve this prompt so the worker follows it better",...}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | jq -r '.hookSpecificOutput.additionalContext' | head -1
Advisor: live; use sk-prompt 0.89/0.12 pass.
$ printf '{"prompt":"create a readme for the utils folder",...}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | jq -r '.hookSpecificOutput.additionalContext' | head -1
Advisor: live; use sk-doc 0.95/0.12 pass.
$ printf '{"prompt":"turn off the comment hygiene git hook",...}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | jq -r '.hookSpecificOutput.additionalContext' | head -1
Advisor: live; ambiguous: /doctor:git hooks 0.82/0.12 vs sk-git 0.86/0.16 pass.
$ printf '{"prompt":"save context",...}' | node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js | jq -r '.hookSpecificOutput.additionalContext' | head -1
Advisor: prompt skipped.
$ SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py 'create a readme for the utils folder' | jq -c '[.[0:3][] | {skill, kind, source, passes_threshold}]'
Native advisor unavailable (FORCE_LOCAL; freshness=unavailable); falling back to local Python scorer.
Skill graph: loaded from SQLite
[{"skill":"sk-doc","kind":"skill","source":"local","passes_threshold":true},{"skill":"system-spec-kit","kind":"skill","source":"local","passes_threshold":true},{"skill":"command-create-readme","kind":"command","source":"local","passes_threshold":true}]
$ rg -n '^  (kind|policy|ownerSkillId|command|argumentHint):' .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts
313:  command: z.string().min(1).optional(),
521:  kind: z.enum(['workspace', 'skill']),
$ sed -n '/BEGIN GENERATED DOCTOR COMMANDS/,/END GENERATED DOCTOR COMMANDS/p' .skilled/skills/system-skill-advisor/runtime/lib/render.ts | grep -c "'command-doctor-"
35
$ jq -c '[.commandPolicies | group_by(.command)[] | (map(.policy) | if index("ask") then "ask" elif index("start") then "start" else "run" end)] | group_by(.) | map({(.[0]): length}) | add' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
{"ask":17,"run":7,"start":20}
$ jq -c '[.commandPolicies[] | select(.command == "/doctor:update") | "\(.route):\(.policy)"]' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/command-bridges.generated.json
["align:start","apply:ask","check:run","compat:ask","record-base:ask","rollback:ask"]
$ node .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs --check | jq -c '{status, counts}'
{"status":"fresh","counts":{"commandMetadata":23,"allowList":4,"doctorRoutes":35,"generated":62,"typescriptActive":45,"pythonActive":51}}
$ jq -c '[.[].id]' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/allow-list.json
["command-spec-kit-plan","command-spec-kit-complete","command-spec-kit-implement","command-spec-kit-resume"]
$ jq -c '[.python[].id | select(test("spec-kit"))]' .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json
["command-spec-kit-plan","command-spec-kit-complete","command-spec-kit-implement","command-spec-kit-deep-research","command-spec-kit-deep-review","command-spec-kit-resume"]
$ rg -n 'HAND_AUTHORED_COMMAND_BRIDGE' .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py .skilled/skills/system-skill-advisor/runtime/lib .skilled/skills/system-skill-advisor/runtime/tests
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2304:HAND_AUTHORED_COMMAND_BRIDGES = {
.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2374:HAND_AUTHORED_COMMAND_BRIDGE_OWNER_NORMALIZATION = {
$ rg -n 'readonly routingEnabled' .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts
66:  readonly routingEnabled?: boolean;
$ rg -c 'command-spec-kit-(plan|complete|implement|resume)\b' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl .skilled/skills/system-skill-advisor/runtime/scripts/fixtures .skilled/skills/system-skill-advisor/runtime/tests
.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl:1
.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl:1
.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl:1
.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json:2
.skilled/skills/system-skill-advisor/runtime/tests/scorer/same-owner-ambiguity.vitest.ts:2
$ rg -n 'command-spec|memory:save|command-memory-save' AGENTS.md | wc -l
       0
$ node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.holdout_top1.correct,.metrics.ambiguity_top1.correct,.metrics.gold_none_false_fire.value]'
[159,50,20,5]
$ node scripts/routing-accuracy/capture-command-routing-baseline.mjs | jq -c '.metrics.typed_recall_at_1, .attachedMetrics.plain, .metrics.false_offer, .attachedMetrics.typed_same_owner_ambiguous'
{"correct":24,"total":44}
{"tune":{"own":2,"attached":7,"combined":9,"total":45},"holdout":{"own":0,"attached":0,"combined":0,"total":44}}
{"count":0,"total":35}
["cmd-create-agent-typed-01"]
```

The holdout count above is a line count only. No holdout prompt text was read.

The reach check below ran from the repository root on the same commit with Ollama serving `nomic-embed-text:v1.5`, so command rows score on meaning. It exited 1. The output is the last eight lines, verbatim.

```text
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs --hub sk-doc
FAIL sk-doc                       declared=257 wrong-hub=  0 outranked=  4 no-reach=  0 allowed=  6 probe-error=  0 operator-local=  0
       outranked  create an agent                            create:agent=0.8200, sk-doc=0.8265
       outranked  opencode agent                             create:agent=0.8000, sk-code=0.9069
       outranked  deterministic scenario                     create:manual-testing-playbook=0.8000, sk-doc=0.8329
       outranked  manual test scenario                       create:manual-testing-playbook=0.8200, sk-doc=0.9204

checked=1 hub(s), wrong-hub=0, outranked=4, no-reach=0, allowed=6, probe-error=0, operator-local=0
advisor generation: 83
RESULT: FAILED
```

The near-miss row `nm-sk-doc-01` sits in split `none`, so its prompt may be read. The probe below imports the built scorer with `VITEST` set, as the capture does, and prints each named skill's positive lane contributions. It ran from the repository root on the same commit. The output is verbatim.

```text
$ jq -c '.rows["nm-sk-doc-01"]' .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json
{"expected_command":null,"top":"system-skilled-doctor","top1":false,"top3":false,"offered":false}
$ node <scratchpad>/nm-probe.mjs .skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/scorer/fusion.js . "fix the typo in the heading of the setup guide"
system-skilled-doctor 0.82 0.1302 [["lexical",0.056,["token:setup"]],["derived_generated",0.0662,["derived:setup"]],["semantic_shadow",0.008,["shadow:test-fallback"]]]
sk-code 0.82 0.0969 [["lexical",0.0812,["token:typo","token:heading","token:debug"]],["graph_causal",0.0157,["edge:mcp-tooling->sk-code:enhances","edge:sk-design->sk-code:enhances"]]]
sk-design 0.82 0.0640 [["lexical",0.056,["token:guide"]],["semantic_shadow",0.008,["shadow:test-fallback"]]]
count 4 skdoc index -1
```

`sk-doc` is not among the scored rows at all, and `sk-code` holds `typo` and `heading`. Which source file and field projects each of those tokens is UNKNOWN until the trace in `tasks.md` runs. A plain `rg -w "typo|heading"` over the four skills' `ROUTER.md`, `SKILL.md`, `hub-router.json` and `graph-metadata.json` printed nothing.

In each of the four rows the winner is a command row that `sk-doc` owns. `rankShippedFleet` in that script counts a hit only when the first shipped `skillId` equals the probed hub, and the public recommendation carries no owner it could read instead.

### What Already Exists
Each part was read in the code on 2026-11-12. `ADV` is `.skilled/skills/system-skill-advisor/runtime`.
- An optional `command` field on `AdvisorRecommendationSchema` (`ADV/schemas/advisor-tool-schemas.ts`), set only when a hub attaches a mode command through `attachCommand` (`ADV/lib/command-attach.ts`) in `enrichCompiledRoutes` (`ADV/handlers/advisor-recommend.ts`).
- The schema object is `.strict()`, so an unknown fifth field is already rejected.
- `kind` exists on the scored recommendation (`ScoredRecommendation.kind` in `ADV/lib/scorer/types.ts`) and `publicRecommendation` drops it.
- A hub never repeats a command whose own row ranks in the same result (`BRIDGE_COMMAND_BY_ID` and `alreadyOffered` in `enrichCompiledRoutes`). The option `compiledRouteTopOnly` exists. Neither is planned again.
- The CLI hook path keeps `command` (`recommendationFromCli` in `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts`) and retries once without a rejected option for an older daemon (`invokeAdvisorRecommendPayload` and `COMPILED_ROUTE_OPTION_KEYS` in `ADV/skill-advisor-cli.ts`).
- The doctor runnable string with its route target, such as `/doctor:git hooks`, is generated into `DOCTOR_COMMAND_STRINGS` (`ADV/lib/render.ts`) by `renderDoctorCommandStrings` (`ADV/scripts/command-bridges/derive-command-bridges.cjs`). That covers the L6 runnable string for doctor rows.
- One policy per command and per doctor route is generated as `commandPolicies` by `derivePolicy` and `commandPolicies` in the deriver.
- The TypeScript hand-authored array is gone from `ADV/lib/scorer/projection.ts`, and all 62 generated rows set `routingEnabled` (45 true, 17 false).
- The allow-list holds 4 rows, not 8. `/spec_kit`, `/memory:save`, `/prompt` and the umbrella `command-spec-kit` have no allow-list row, and `AGENTS.md` names none of the retired ids.
- No two TypeScript-enabled rows share a runnable string (counted from the generated file).

### What Is Missing
- `kind`, `policy` and `ownerSkillId` on the public recommendation, and `command` on a command row's own entry.
- A brief label for any non-doctor command row and any attached command. Today the head prints the raw id or the hub skill alone.
- A policy for `/doctor:update`, whose bridge names no action while its six actions carry three different policies.
- A stated contract for a degraded result. The local Python scorer returns `command-create-readme` as a passing row for a plain prompt.
- The four allow-list ids, the Python `"/prompt"` lexical row and owner branch, the two Python hand-authored constants and the optional `routingEnabled` type.
- An owner-aware hit in the router vocabulary reach check. Without it the check fails on `sk-doc` with real embeddings on, because a meaning-passed command that `sk-doc` owns ranks first.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Generate one table `COMMAND_ROWS` in `ADV/lib/command-attach.ts`, keyed by every id a scorer can return for a command entry, holding its runnable `command`, `policy` and `ownerSkillId`, plus `COMMAND_POLICIES` keyed by runnable string. It replaces the doctor-only `DOCTOR_COMMAND_STRINGS`.
- Add `kind`, `policy` and `ownerSkillId` to the public recommendation and fill all four fields from that table in the handler, the CLI fallback and the renderer.
- Render the brief head as `use <owner> → <command> (<policy>)` for a recommendation that names a command, with no consequence line (L12).
- State and test the degraded contract on the CLI's `degraded: true` path.
- Retire the allow-list file, its four ids and the Python `/prompt` residue, delete the Python hand-authored constants and make `routingEnabled` required (L7).
- Make `nm-sk-doc-01` route to `sk-doc` by correcting the routing signal at its source, never by a phrase copied from its prompt.
- Make `rankShippedFleet` in `ci-router-vocabulary-reach.cjs` count a winning command row whose `ownerSkillId` is the probed hub as a hit.
- CARRY-003: clear the typed `/create:agent` ambiguity, prove that a metadata command with no compatibility row is active and reach `/speckit:search` from the review's probe prompt.

### Out of Scope
- Raising the brief token cap. The research eliminated it, and the new head fits 80 tokens.
- A consequence line or argument state in the brief (L6, L12). The command's own setup asks for its arguments.
- An `argumentHint` field. No current caller reads it, and the operator answered no.
- Changing a policy, a risk class or a scoring weight. Phase 002 owns the policies, and the four pinned numbers are a floor.
- The `Also:` companion line. It keeps its doctor-only trigger and its runnable label.
- `AGENTS.md`, the Gate 2 sentence and the runtime pointers. Phase 006 owns them.
- The Python-only ids `command-spec-kit-deep-research` and `command-spec-kit-deep-review`, the TypeScript compatibility ids `create:agent` and `create:manual-testing-playbook`, and the alias folds that map old ids onto live ones. The operator chose to rename only the four allow-list ids.
- Typed `/memory:save` as prompt vocabulary in `explicit.ts`, `fusion.ts`, the Python scorer and the Gate 3 classifier. It matches what a user types, and five labelled corpus rows type it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` | Modify | Emit `COMMAND_ROWS` and `COMMAND_POLICIES`, stop emitting the doctor block, stop reading the allow-list |
| `ADV/lib/command-attach.ts` | Modify | The generated block and `commandRowFor` |
| `ADV/schemas/advisor-tool-schemas.ts` | Modify | `kind`, `policy` and `ownerSkillId` on the recommendation |
| `ADV/lib/subprocess.ts` | Modify | Optional `command`, `policy` and `ownerSkillId` on `AdvisorRecommendation` |
| `ADV/handlers/advisor-recommend.ts` | Modify | Fill the fields, and give an attached command its policy |
| `ADV/lib/render.ts` | Modify | The new head label, the doctor block removed |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Keep `kind`, `policy` and `ownerSkillId` |
| `ADV/skill-advisor-cli.ts` | Modify | The degraded contract in `degradedRecommendations` |
| `ADV/lib/scorer/projection.ts` | Modify | `routingEnabled` required, regenerated block |
| `ADV/scripts/skill_advisor.py` | Modify | Hand constants and `/prompt` residue deleted, four ids re-pointed |
| `ADV/scripts/command-bridges/allow-list.json` | Delete | Its four rows come from `system-spec-kit/command-metadata.json` |
| `ADV/scripts/command-bridges/scoring-compatibility.json` | Modify | Four Python rows and one owner key deleted |
| `ADV/lib/scorer/lanes/explicit.ts`, `ADV/lib/scorer/fusion.ts`, `ADV/lib/scorer/scoring-constants.ts` | Modify | Re-point `command-spec-kit-resume` and `command-spec-kit-plan` |
| Gold and fixture files listed in the measured block | Modify | Relabel the four ids by script, without reading prompt text |
| The one routing source file the `nm-sk-doc-01` trace names | Modify | One signal corrected at its source |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs`, `scripts/tests/ci-router-vocabulary-reach.test.cjs` | Modify | Owner-aware hit and two fixture cases |
| `ADV/lib/scorer/ambiguity.ts`, `.skilled/skills/system-spec-kit/command-metadata.json` | Modify | CARRY-003 (a) and (c) |
| Tests under `ADV/tests/` | Create, Modify | Schema, golden briefs, degraded contract, old daemon, CARRY-003 (b) |
| `hooks/skill-advisor-hook.md`, `feature-catalog/cli-surface/advisor-recommend.md`, `ADV/scripts/command-bridges/README.md` | Modify | The fields, the brief form and the degraded contract |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `AdvisorRecommendationSchema` accepts `kind` (`skill` or `command`), `command`, `policy` (`run`, `start` or `ask`) and `ownerSkillId`, and rejects an unknown field such as `consequence`. The schema test covers both. |
| REQ-002 | Every recommendation carries `kind`. A command row carries its runnable `command`, `policy` and `ownerSkillId` from `COMMAND_ROWS`, and a hub row with an attached command carries that command's `policy`. `/speckit:plan add a login page` returns a top entry with `command` `/speckit:plan`, `policy` `start` and `ownerSkillId` `system-spec-kit`. |
| REQ-003 | A recommendation that names a command renders its brief head as `use <owner> → <command> (<policy>)`. Six golden briefs, one per family (create, deep, design, doctor, speckit, prompt), match their exact heads and are at most 320 characters before `\nDirectives:`. No live head for the six measured prompts contains `command-`. |
| REQ-004 | `save context` through `advisor_recommend` returns exactly one entry whose `command` is `/speckit:save`. |
| REQ-018 | With real embeddings on, `ci-router-vocabulary-reach.cjs --hub sk-doc` prints `RESULT: PASSED` with `outranked=0`, because a winning command row whose `ownerSkillId` is the probed hub counts as a hit. A fixture where a command owned by a different hub wins still counts as `outranked` or `wrong-hub`. |
| REQ-005 | The floors hold: the pinned capture prints `[159,50,20,5]`, the default command capture prints typed 24 of 44, tune combined 9 of 45, holdout combined 0 of 44 and false offers 0 of 35, the policy rollup prints `{"ask":17,"run":7,"start":20}`, `derive-command-bridges.cjs --check` prints `fresh` and `npm test` in `ADV` reports 0 failed. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | On a CLI result with `degraded: true`, a command row whose bare slash command appears in the prompt keeps its `command`, `policy` and `ownerSkillId`. Any other command row is replaced by its owner skill with no command, and a duplicate owner is dropped. A test covers a typed and a plain prompt. |
| REQ-007 | A CLI output from an older daemon that carries no new field still renders the command and policy, read from `COMMAND_ROWS` by id. A hook test pins it. |
| REQ-008 | A bridge whose runnable string names no action on a command with several actions takes the strictest action policy, so `command-doctor-update` reads `ask`. |
| REQ-009 | `allow-list.json` is deleted. `command-speckit-plan`, `-complete`, `-implement` and `-resume` replace the four `command-spec-kit-*` ids in both scorers. Every gold and fixture label is relabelled by script and listed. No file under `ADV` outside a changelog and the dated `shadow-diff.md` record names an old id. |
| REQ-010 | The Python `"/prompt"` lexical row and the `command == "/prompt"` owner branch are deleted. The alias folds in `aliases.ts` and the Python alias table stay. |
| REQ-011 | `HAND_AUTHORED_COMMAND_BRIDGES` and `HAND_AUTHORED_COMMAND_BRIDGE_OWNER_NORMALIZATION` are deleted from the Python scorer. `CommandBridgeProjection.routingEnabled` is required and `scoringCommandBridges` keeps rows with `routingEnabled === true`. |
| REQ-012 | The brief for a git hooks prompt shows `/doctor:git hooks`, and the recommendation adds no `argumentHint` field. |
| REQ-013 | `hooks/skill-advisor-hook.md`, `feature-catalog/cli-surface/advisor-recommend.md` and `ADV/scripts/command-bridges/README.md` describe the four fields, the head form and the degraded contract, and no longer describe the allow-list as live. |
| REQ-019 | The near-miss row `nm-sk-doc-01` (`fix the typo in the heading of the setup guide`, split `none`) has top `sk-doc` and no command after a re-capture. The fix corrects the routing signal at its source and adds no string of two or more consecutive words from that prompt. Typed recall, tune and holdout plain recall, false offers and the four pinned numbers are not lower. |
| REQ-014 | `git diff --quiet HEAD -- AGENTS.md` exits 0, and the Claude hook over the 44 tune prompts stays within +25 ms median and +40 ms p95 of a same-session baseline, each the middle of three runs. |

### CARRY-003 - Criteria phase 003 left unmet (keep or drop as one group)

| ID | Requirement |
|----|-------------|
| REQ-015 | CARRY-003 (a): the default command capture prints `[]` for `typed_same_owner_ambiguous`, with the pinned numbers unchanged. |
| REQ-016 | CARRY-003 (b): `scoring-compatibility.json` lists no `command-spec-kit-plan`, `-complete`, `-implement` or `-resume` row, and a fixture test proves that a metadata command with no compatibility row is active in both runtimes. |
| REQ-017 | CARRY-003 (c): `show me which packets mention the token cap` returns a passing entry with `command` `/speckit:search` and `policy` `run`, with false offers still 0 of 35. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The six golden briefs pass and the live head for `/speckit:plan add a login page` reads `use system-spec-kit → /speckit:plan (start)`.
- **SC-002**: `save context` returns one entry carrying `/speckit:save`, and the schema test passes.
- **SC-003**: The pinned capture prints `[159,50,20,5]` and the default command capture prints the numbers in the measured block.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 007's before-measurement on the branch tip | A code change first would leave phase 007 with no clean baseline | Wave 0 is read-only, and wave 1 waits for the coordinator's confirmation |
| Risk | The `nm-sk-doc-01` fix moves other rows | Med: a correction to a shared token changes other prompts | The four pinned numbers, typed and plain recall and false offers must not be lower after the re-capture |
| Dependency | The generated bridge file and its deriver | The table has no data when the deriver is stale | Every wave that edits a deriver input ends with `--check` printing `fresh` |
| Risk | Renaming four scored ids moves a gold label out of step | High: the pinned numbers drop | Relabel by script in the same wave, then the pinned capture must print `[159,50,20,5]` |
| Risk | A new head form breaks brief tests across hooks and legacy suites | Med: many expected strings change | One task per test file, each changing only expected heads |
| Risk | A daemon on the old build answers without the new fields | Med: the brief falls back to raw ids | The renderer reads `COMMAND_ROWS` by id when a field is missing, and a hook test pins it |
| Risk | The CARRY-003 (a) fix changes ambiguity for other prompts | Med: the ambiguity count moves | The pinned capture is the gate, and the fix is reverted and marked blocked if it moves |
| Risk | The owner-aware hit hides a real misroute | Med: a command of another hub reads as a hit | Only a command row whose `ownerSkillId` equals the probed hub counts, and a fixture pins the other-hub case |
| Risk | The CARRY-003 (c) phrase is written for a known probe prompt | Med: it scores that prompt and little else | The tune reach and false-offer counts must hold, and the group can be dropped as one unit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The hook stays within +25 ms median and +40 ms p95 of a same-session baseline. The change adds table lookups and no subprocess.

### Security
- **NFR-S01**: The renderer stays the prompt-boundary guard. Every label part passes `sanitizeSkillLabel`, and the policy word is one of three fixed values.
- **NFR-S02**: No relabel step prints or reads holdout prompt text.

### Reliability
- **NFR-R01**: A missing field, an unknown id or an absent policy renders today's label, never an error.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a result with no passing recommendation renders the existing `no skill matched` fallback.
- Maximum input: the longest head, an ambiguous pair of two command labels, stays under the 120-token ambiguous cap.
- Failure path: a command row whose id has no `COMMAND_ROWS` entry renders its sanitized id as today, and the deriver test asserts every scored id has an entry.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | About 24 files and 700 lines across the deriver, the handler, the renderer, the CLI, the Python scorer and tests |
| Risk | 13/25 | A public output contract changes and four scored ids are renamed |
| Research | 6/20 | The review names each change, and the code read is done |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

### Resolved

The operator answered all four through the question dialog on 2026-11-12.

- How far does the id retirement go? Decision: "Rename the four, drop /prompt (Recommended)". The four allow-list ids become `command-speckit-*`, the Python `/prompt` residue goes, the alias folds stay, and the Python deep ids and the TypeScript `create:*` compatibility ids stay as a recorded limitation. REQ-018 does not need their rename, because `COMMAND_ROWS` keys `create:agent` and `create:manual-testing-playbook` as they are, so both carry `ownerSkillId` `sk-doc`.
- What may a degraded brief show? Decision: "Only a typed command (Recommended)". A command shows only when the prompt types it, otherwise the owner skill shows with no command.
- What policy does `/doctor:update` carry when its bridge names no action? Decision: "The strictest: ask (Recommended)".
- Does the recommendation gain `argumentHint`? Decision: "No (Recommended)".
- Does CARRY-003 stay in this phase? Decision: yes, by the earlier answer "Carry three, settle five (Recommended)". Phase 003's ADR-017 points at this group.
- Is the `nm-sk-doc-01` miss fixed here? Decision: "Fix it in phase 005 (Recommended)". It is REQ-019.
- When does phase 007 take its before-measurement? Decision: "Now, on today's branch tip (Recommended)". No code task of this phase starts before the coordinator confirms that run is done.

### Open

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Review**: `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`
