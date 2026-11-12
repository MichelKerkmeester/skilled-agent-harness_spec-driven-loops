---
title: "Feature Specification: Phase 3: plain-chat-command-reach"
description: "A prompt typed in plain chat never reaches the slash command that fits it: plain recall at 1 is 0 of 44 on both corpus splits. This phase attaches hub commands to their owner skill's recommendation, gives the 8 commands with no hub mode their own scored rows from hand-authored phrases, adds diagnostic phrases to the doctor routes and makes activation and the read-only flag follow the command metadata."
trigger_phrases:
  - "plain chat command reach"
  - "phase 3 plain chat command reach"
  - "attach command to owner skill"
  - "command intent phrases"
  - "same owner collapse"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3-plus-govern | v2.4 -->
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: Phase 3: plain-chat-command-reach

---

## EXECUTIVE SUMMARY

A user who describes a job in plain words never gets the slash command that owns it. The phase 1 capture reports plain recall at 1 as 0 of 44 on tune and 0 of 44 on holdout. This phase attaches a hub command to its owner skill's recommendation when the compiled hub resolves one mode, gives the 8 commands with no hub mode one scored row each from hand-authored phrases, adds user wording to the doctor routes in `_routes.yaml` and makes activation, the read-only flag and same-owner ranking follow the command metadata. The proof is the extended phase 1 harness reporting own-row reach and attached reach per split against the baseline, with false offers at 0 of 35 and the four pinned numbers no worse.

**Key Decisions**: attach hub commands to the owner skill instead of scoring them as candidates (review R2 part A), one shared pure attach function that the handler and the harness both call so the harness measures what ships, replace the umbrella ids now and bring doctor plain-chat reach into this phase (operator, 2026-11-12)

**Critical Dependencies**: the phase 1 corpus and baseline, the phase 2 metadata and `commandPolicies`, and the doctor phrase reach probe and doctor routing slice that hold doctor routing

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-12 |
| **Branch** | `worktrees/352-command-surfacing-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-command-inventory-and-risk-metadata |
| **Successor** | 004-command-meaning-matching |
| **Handoff Criteria** | Command recall rises against the phase 1 baseline with no drop in the four existing numbers, and no typed command is ambiguous with its own owner |
**Status note**: closed Complete on 2026-11-12 by operator decision. Holdout plain recall stayed at 0 of 44 and is waived (ADR-016 in `decision-record.md`). The other unmet criteria are waived, superseded by phase 004 or carried to phase 005 (ADR-017 to ADR-020).
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Build command surfacing in the skill advisor so every tracked slash command reaches the model with a run-or-ask policy and a chat-only request reaches a proper workflow specification.

**Scope Boundary**: Scoring, attachment and measurement only. This phase adds an optional `command` field to a recommendation, phrases for 8 commands, more diagnostic phrases on the doctor routes and the activation and ranking rules that follow from the metadata. It renders nothing new in the brief, which is phase 005, and it does not edit `AGENTS.md`, which is phase 006.

**Dependencies**:
- Phase 001: `command-prompts.jsonl`, `capture-command-routing-baseline.mjs`, `command-routing-baseline.json` and `tests/command-routing-slice.vitest.ts`.
- Phase 002: the `mutating` class on every command, the two new metadata files and `commandPolicies` in `command-bridges.generated.json`.
- The review's R2, R10a, L2 and L3 in `../../007-command-surfacing-and-workflow-enforcement/research/synthesis-review.md`, under operator decisions D1 to D5 in section 13 of `../../007-command-surfacing-and-workflow-enforcement/research/research.md`.

**Deliverables**:
- A harness that reports own-row reach and attached reach separately, proven to change no existing number before any scorer change.
- A `command` field on the owner skill's recommendation for the 19 hub commands, carried through the handler, the schema and the hook.
- One scored row per command, from hand-authored phrases, for the 8 commands with no hub mode.
- Activation and the read-only flag derived from the metadata for non-doctor commands.
- A same-owner collapse so a command row and its owner skill never form an ambiguous pair.
- More diagnostic phrases on the doctor routes in `.skilled/commands/doctor/_routes.yaml`, with the phrase reach probe exiting 0 and the doctor routing slice passing.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The advisor reaches a plain-chat prompt with a skill and never with the command that owns the job. Hub commands are disabled as scoring candidates, the public recommendation from `publicRecommendation` (`ADV/handlers/advisor-recommend.ts:306`) has no `command` field, and the compiled route that names the resolved mode carries no command either. The 8 commands with no hub mode have no phrases a user would type, and their activation is a hand-kept list in `scoring-compatibility.json` where an unlisted id is silently off. A typed `/speckit:plan` is ambiguous with its own owner skill.

### Purpose
A plain-chat prompt that fits a tracked command reaches that command, either as a field on its owner skill's recommendation or as the command's own row, with no new false offer and no drop in the pinned skill-routing numbers.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd .skilled/skills/system-skill-advisor/runtime
$ node scripts/routing-accuracy/capture-command-routing-baseline.mjs | jq -c .metrics
{"typed_recall_at_1":{"correct":19,"total":44},"typed_reach_top3":{"correct":19,"total":44},"plain_recall_at_1":{"tune":{"correct":0,"total":44},"holdout":{"correct":0,"total":44}},"plain_reach_top3":{"tune":{"correct":1,"total":44},"holdout":{"correct":0,"total":44}},"false_offer":{"count":0,"total":35},"slash_variant":{"reached_top3":2,"named_total":8,"offered_on_partial":0,"partial_total":4},"agreement":{"correct":7,"total":12}}
$ node scripts/routing-accuracy/capture-scorer-eval-baseline.mjs | jq -c '[.metrics.full_corpus_top1.correct,.metrics.full_corpus_top1.total,.metrics.holdout_top1.correct,.metrics.holdout_top1.total,.metrics.ambiguity_top1.correct,.metrics.ambiguity_top1.total,.metrics.gold_none_false_fire.value]'
[158,195,50,66,20,24,5]
$ jq -c 'select(.split!="none") | [.split,(.expected_command|split(":")[0])]' scripts/routing-accuracy/command-prompts.jsonl | sort | uniq -c
  13 ["holdout","/create"]
   3 ["holdout","/deep"]
   3 ["holdout","/design"]
  17 ["holdout","/doctor"]
   1 ["holdout","/prompt"]
   7 ["holdout","/speckit"]
  13 ["tune","/create"]
   3 ["tune","/deep"]
   3 ["tune","/design"]
  17 ["tune","/doctor"]
   1 ["tune","/prompt"]
   7 ["tune","/speckit"]
$ node --input-type=module -e "const {scoreAdvisorPrompt:s}=await import(process.cwd()+'/dist/runtime/lib/scorer/fusion.js');const r=s('/speckit:plan add a login page',{workspaceRoot:process.cwd()});console.log(JSON.stringify({ambiguous:r.ambiguous,top:r.recommendations.slice(0,2).map(x=>[x.skill,+x.score.toFixed(3),x.confidence])}))"
{"ambiguous":true,"top":[["command-spec-kit",0.532,0.82],["system-spec-kit",0.55,0.82]]}
$ jq -c '[.rows | to_entries[] | select(.key | test("^cmd-doctor-.*-plain-tune-")) | {(.value.expected_command): .value.top}] | add' scripts/routing-accuracy/command-routing-baseline.json
{"/doctor:agents-md":"command-doctor-helper","/doctor:ci":"command-doctor-helper","/doctor:deep-loop":"system-deep-loop","/doctor:env":"system-spec-kit","/doctor:git":"sk-git","/doctor:helper":null,"/doctor:install":null,"/doctor:mcp":"mcp-code-mode","/doctor:overlay":"command-doctor-helper","/doctor:runtime-mirrors":"command-doctor-helper","/doctor:setup":null,"/doctor:sk-code":"sk-code","/doctor:sk-skill":"sk-doc","/doctor:skill-advisor":"system-skill-advisor","/doctor:speckit":null,"/doctor:symlink":null,"/doctor:update":null}
$ jq '[.rows | to_entries[] | select((.key|test("^cmd-doctor-")) and (.key|test("doctor-helper")|not) and .value.top=="command-doctor-helper")] | length' scripts/routing-accuracy/command-routing-baseline.json
7
$ node ../../../commands/doctor/scripts/doctor-phrase-reach.cjs --json | jq -c '{status,bridges,missed}'
{"status":"ok","bridges":35,"missed":0}
$ node scripts/command-bridges/derive-command-bridges.cjs --check | jq -c .
{"status":"fresh","counts":{"commandMetadata":23,"allowList":8,"doctorRoutes":35,"generated":66,"typescriptActive":40,"pythonActive":50},"changed":[]}
```

Plain recall at 1 is 0 of 44 on both splits and plain top 3 is 1 of 44 on tune and 0 of 44 on holdout. Per split, 19 plain rows belong to hub commands (13 `/create`, 3 `/deep`, 3 `/design`), 8 to commands with no hub mode (7 `/speckit`, 1 `/prompt`) and 17 to `/doctor`. All 44 are in scope, so the ceiling for this phase is 44 of 44 per split. All 17 doctor tune rows miss today: `command-doctor-helper` wins 4 of them, an owner skill wins 7 and 6 get no recommendation at all. Across every doctor row in the baseline, 7 that belong to another doctor command have `command-doctor-helper` on top. The phrase reach probe reports all 35 doctor bridges served. The four pinned numbers are 158 of 195, 50 of 66, 20 of 24 and 5 gold-none false fires. A typed `/speckit:plan` returns `ambiguous: true` with `command-spec-kit` and `system-spec-kit` both at confidence 0.82.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Extend `capture-command-routing-baseline.mjs` so a row also counts as reached when the top recommendation is the command's owner skill and carries the expected command, and report own-row reach and attached reach separately.
- Attach a hub command to its owner skill's recommendation when the compiled route is `action: route` with `selectionKind: single` and the mode's registry row has a `command`, through one shared pure function called by the handler and the harness, and carry the field through the schema and the hook.
- Hand-author intent phrases for the 7 `/speckit` commands and `/prompt:improve` and project one scored row per command in both scorers.
- Make a non-doctor command with metadata active by construction and drive `isReadOnlyRoute` from `mutating` for non-doctor rows.
- Collapse rows that share one command before the top-K cut, and keep a command row and its own owner skill out of one ambiguous pair.
- Author more diagnostic phrases per doctor route, standalone command and `/doctor:mcp` sub-action in `.skilled/commands/doctor/_routes.yaml`, as words users type, checked against tune rows only.

### Out of Scope
- Any new line or field in the brief - phase 005 owns the output contract and the brief wording.
- Editing `AGENTS.md`, including `AGENTS.md:89`, which names `command-spec-kit` - phase 006 owns the binding. Superseded in part on 2026-11-12: the operator had the retired id renamed in Gate 4 (plan ADR-015).
- A penalty on an owner skill to let a doctor route win - the fix for a diagnostic question is a phrase on the route.
- Changing the hand-written doctor activation entries in `scoring-compatibility.json` - every doctor bridge is already active.
- Retiring the four `/speckit` allow-list rows and the file - review L1, placed in phase 005. The four umbrella rows were removed in this phase under ADR-005.
- Making the 17 disabled hub rows scoring candidates - part A keeps the owner skill as the scored candidate.
- Reading any holdout row's prompt - holdout rows are scored, never read, so phrases are checked against tune rows only.

### Files to Change

`ADV` is `.skilled/skills/system-skill-advisor/runtime`. Rows marked (A) carry out the umbrella-id replacement the operator decided on 2026-11-12 (plan.md ADR-005).

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | Modify | Attached reach beside own-row reach, using the shared attach function and the compiled route front door |
| `ADV/lib/command-attach.ts` | Create | The pure attach function and a generated block mapping `workflowMode` to `command` |
| `ADV/handlers/advisor-recommend.ts` | Modify | `enrichCompiledRoutes` (`:415`) and `publicRecommendation` (`:306`) call the attach function |
| `ADV/schemas/advisor-tool-schemas.ts` | Modify | An optional `command` string beside `workflowMode` and `compiledRoute` (`:307-308`) |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Ask for the compiled route of the top passing hub (`:212-226`) and keep `command` in `recommendationFromCli` (`:338-355`) |
| `ADV/scripts/command-bridges/derive-command-bridges.cjs` | Modify | Mode lookup, phrase projection, activation by construction, `isReadOnlyRoute` (`:554-556`) for non-doctor rows |
| `ADV/scripts/command-bridges/scoring-compatibility.json` | Modify | Non-doctor activation rows removed where the metadata now decides |
| `ADV/scripts/command-bridges/command-bridges.generated.json` | Modify | Regenerated |
| `ADV/lib/scorer/projection.ts`, `ADV/scripts/skill_advisor.py` | Modify | Regenerated bridge blocks, and the same-owner collapse in the Python ranking |
| `ADV/lib/scorer/fusion.ts`, `ADV/lib/scorer/ambiguity.ts` | Modify | Same-owner collapse before top-K and the same-owner exclusion from the ambiguity cluster |
| `ADV/lib/scorer/lanes/explicit.ts` | Modify (A) | Boosts at `:92-99` and the penalty at `:351-354` move from the umbrella ids to the per-command ids |
| `.skilled/skills/system-spec-kit/command-metadata.json`, `.skilled/skills/sk-prompt/command-metadata.json` | Modify | Hand-authored phrases in `userIntent.ownedSignals` for 7 and 1 commands |
| `ADV/scripts/routing-accuracy/labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` | Modify (A) | Gold labels naming an umbrella id move to the per-command id, each relabel listed |
| `ADV/scripts/routing-accuracy/scorer-eval-baseline.json`, `command-routing-baseline.json` | Modify | Re-captured after the operator reads the delta |
| `ADV/tests/command-bridges-drift-guard.vitest.ts` | Modify | The pinned 5 and 15 active non-doctor counts follow the generated activation |
| `ADV/tests/scorer/native-scorer.vitest.ts`, `ADV/tests/python/test_skill_advisor.py`, `ADV/tests/parity/fixtures/local-native-approved-divergences.json` | Modify (A) | Umbrella ids replaced by the per-command ids |
| `ADV/tests/command-attach.vitest.ts` | Create | Planned for the attach rule and the hook carry-through. Not created |
| `ADV/tests/scorer/same-owner-ambiguity.vitest.ts` | Create | Built in its place for the same-owner rule |
| `.skilled/commands/doctor/_routes.yaml` | Modify, then reverted | More `trigger_phrases` per doctor entry. Built, measured and reverted under plan ADR-007, so the file matches its committed state |

Files changed in the build that the plan did not name, listed for the operator's review: `ADV/scripts/command-bridges/allow-list.json` (four umbrella rows deleted), `ADV/lib/scorer/aliases.ts` (one id re-pointed), `ADV/scripts/fixtures/gate2-golden-prompts.jsonl` and `ADV/scripts/fixtures/skill-advisor-regression-cases.jsonl` (labels re-pointed), and the re-pinned tests `tests/scorer/doctor-ordering.vitest.ts`, `tests/compat/shim.vitest.ts`, `tests/legacy/advisor-graph-health.vitest.ts`, `tests/legacy/advisor-corpus-parity.vitest.ts`, `tests/parity/python-ts-parity.vitest.ts` and `tests/hooks/skill-advisor-cli-fallback-no-match.vitest.ts`.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The capture script reports attached reach per split beside own-row reach, under a key outside `metrics`. Before any scorer, deriver or handler change, a re-capture leaves `rows`, `metrics`, `commands` and `unreachable` byte-identical to the saved baseline and reports attached reach 0 on both splits. |
| REQ-002 | One exported pure function in `ADV/lib/command-attach.ts` decides attachment. It returns the command only when the compiled route has `action` `route`, `selectionKind` `single`, exactly one target, and that target's `workflowMode` maps to a command in the generated lookup. The handler and the harness both call it, and neither restates the rule. |
| REQ-003 | The deriver generates the `workflowMode` to command lookup from the `mode-registry.json` of `sk-doc`, `sk-design` and `system-deep-loop`, holding 19 entries. `--check` reports `stale` when a registry `command` changes and the lookup was not regenerated. |
| REQ-004 | `advisor_recommend` returns `command` on the owner skill's recommendation when REQ-002 attaches one, the output schema accepts an optional `command` string, and a recommendation with no attached command has no `command` key. |
| REQ-005 | The hook asks for the compiled route of the top passing hub only, and `recommendationFromCli` keeps a string `command`. A hook test with a stubbed CLI result carrying `command` sees the field on the returned recommendation. |
| REQ-006 | The 7 `/speckit` commands and `/prompt:improve` carry hand-authored phrases in `userIntent.ownedSignals`, written as words users type and checked against tune rows only. The deriver projects one active scored row per command in both scorers. |
| REQ-007 | Plain recall rises against the phase 1 baseline on tune and on holdout, reported separately and split into own-row and attached reach, with the ceiling of 44 of 44 per split stated beside each number and the doctor rows reported as their own line. |
| REQ-008 | False offers stay at 0 of 35, including the 10 rows whose `source` is `d3-plain`, and an attached command counts as an offer. |
| REQ-009 | The four pinned numbers do not get worse: full corpus top 1 at least 158 of 195, holdout top 1 at least 50 of 66, ambiguity top 1 at least 20 of 24, and gold-none false fires at most 5. |
| REQ-010 | No typed row in `command-prompts.jsonl` returns `ambiguous: true` with the command's own owner skill in the ambiguous pair. |
| REQ-018 | Doctor routes, standalone doctor commands and `/doctor:mcp` sub-actions carry more `trigger_phrases` in `.skilled/commands/doctor/_routes.yaml`, each of three or more words, written as words users type and checked against `split: tune` rows only, and `bash .skilled/commands/doctor/scripts/route-validate.sh` reports OK. |
| REQ-019 | After regeneration and a rebuild, `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0 and `tests/doctor-routing-slice.vitest.ts` passes, and doctor plain recall at 1 on tune rises above 0 of 17. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | A non-doctor command with metadata is active by construction, attached through its hub or scored through its own row. `scoring-compatibility.json` holds no hand-written activation row for such a command, and the deriver supplies a default `order` and Python slash markers when none is written. Doctor rows keep their entries. |
| REQ-012 | `isReadOnlyRoute` reads `mutating` for non-doctor rows too, so `/speckit:search`, classed `read-only`, carries `readOnly: true` in the generated TypeScript block and every `mutates` command does not. |
| REQ-013 | Rows that resolve to one command collapse to one entry before the top-K cut, in both scorers, so a prompt never spends two of three slots on one command. |
| REQ-014 | `/deep:*` commands are attached only when the prompt carries depth wording, per decision D3, and their phase 2 policy stays `ask`. |
| REQ-015 | Decided by the operator on 2026-11-12: the umbrella ids `command-spec-kit`, `memory:save` and `command-memory-save` are replaced by one row per command, and every gold label that names them is relabelled and listed with its old and new value in `implementation-summary.md`. |
| REQ-016 | The hook's time per prompt is measured over the tune prompts before and after the compiled-route call, and both medians and p95 values are recorded in `implementation-summary.md`. |
| REQ-017 | `derive-command-bridges.cjs --check` prints `fresh`, `npm test` in `ADV` reports 0 failed, and `node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs` reports `failed=0`. |
| REQ-020 | `/doctor:helper` gains no phrase that takes a row from a specific route: across all doctor rows of the capture, the count whose expected command is not `/doctor:helper` and whose top is `command-doctor-helper` stays at or below 7. |
| REQ-021 | Where an owner skill outranks a doctor route on a diagnostic question, the fix is a phrase on the route. No lane, boost or penalty in `ADV/lib/scorer/` changes for a doctor command. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node ADV/scripts/routing-accuracy/capture-command-routing-baseline.mjs` prints own-row plus attached plain reach above 0 of 44 on tune and on holdout, each shown against the ceiling of 44.
- **SC-002**: The same run prints `false_offer` `{"count":0,"total":35}`, and `node ADV/scripts/routing-accuracy/capture-scorer-eval-baseline.mjs` prints values no worse than `[158,50,20,5]` for the four pinned numbers.
- **SC-003**: Scoring `/speckit:plan add a login page` returns `ambiguous: false`, and no typed corpus row is ambiguous with its own owner.
- **SC-004**: `advisor_recommend` on `create a readme for the utils folder` returns `sk-doc` with `command` `/create:readme`, or the row is listed in `implementation-summary.md` with the compiled route it received.
- **SC-005**: `node .skilled/commands/doctor/scripts/doctor-phrase-reach.cjs` exits 0, `tests/doctor-routing-slice.vitest.ts` passes and the capture shows doctor plain recall at 1 above 0 of 17 on tune.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The doctor phrase reach probe and `tests/doctor-routing-slice.vitest.ts` | Without them a doctor phrase that breaks another route goes unseen | Run both after every regeneration that follows a `_routes.yaml` edit |
| Dependency | The compiled route front door `.skilled/bin/compiled-route.cjs` | Without it no hub command attaches | The attach function returns nothing on a missing route, and the harness reports attached reach 0 instead of failing |
| Risk | A pinned number drops when new command rows compete with skills | High | Rerun the four numbers after each workstream and stop before any re-capture when one drops |
| Risk | Phrases overfit the tune rows | Med | Phrases are written as user wording, tune rows are the only rows read, and holdout reach is reported apart from tune |
| Risk | The compiled-route call slows the hook | Med | Ask only for the top passing hub, and measure the hook before and after (REQ-016) |
| Risk | A stale `dist` makes tests and captures lie | High | Run `npm run build` in `ADV` before every measurement, and the capture refuses a build older than its source |
| Risk | Gold relabels hide a real regression | Med | Every relabel is listed with old and new value, and the pinned numbers are reported before and after the relabel as two separate runs |
| Risk | Doctor phrases take rows from owner skills and drop a pinned number | High | Phrases are diagnostic wording from tune rows only, `lead_phrases` only where the manifest rule allows, and the four pinned numbers plus the doctor slice are rerun after each doctor regeneration |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The hook's median and p95 time per prompt, before and after the compiled-route call, are measured over the 44 tune prompts and recorded. No budget is set yet (open question 3).

### Security
- **NFR-S01**: `command` is only ever a string from the generated lookup or the metadata. No prompt text reaches the field, and the attach function never builds a command string.

### Reliability
- **NFR-R01**: A failed, timed-out or missing compiled route leaves the recommendation as it is today, with no `command` key and no error in the hook output.

---

## 8. EDGE CASES

- Empty input: an empty prompt yields no recommendation, so nothing attaches and the hook skips the compiled-route call.
- Maximum input: a prompt longer than `ADVISOR_PROMPT_MAX_CHARS` is sent as its head, and the compiled route is asked for with the same head.
- Failure path: a compiled route with `selectionKind` other than `single`, more than one target or a mode with no command attaches nothing and raises nothing.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 20/25 | Files: about 22, LOC: unknown until built, Systems: 4 (scorer, handler, hook, corpora) |
| Risk | 18/25 | Auth: N, API: Y (a public recommendation field), Breaking: N for the optional field, Y for gold labels under option A |
| Research | 8/20 | Phrases need tune rows read, and the deep-loop depth wording needs the D3 rows |
| Multi-Agent | 11/15 | Workstreams: 7, three shared files and every deriver run in sequence |
| Coordination | 12/15 | Dependencies: phases 001 and 002, the doctor probe and slice, phases 005 and 006 read the result |
| **Total** | **69/100** | **Level 3+** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A pinned number drops when command rows compete | H | M | Rerun the four numbers after each workstream, and stop before a re-capture |
| R-002 | Phrases overfit the tune rows and holdout reach stays at 0 | M | M | Write phrases as user wording, never from a holdout prompt, and report the two splits apart |
| R-003 | The compiled-route call slows the hook | M | M | One call for the top passing hub only, and a recorded before and after time |
| R-004 | A stale `dist` makes a test or a capture report old code | H | M | `npm run build` before every measurement, and the capture's own freshness refusal |
| R-005 | A gold relabel hides a real regression | M | L | List every relabel, and report the numbers before and after the relabel as two runs |
| R-006 | Attaching `/deep:*` on any deep-loop route breaks decision D3 | M | M | A depth-wording check in the attach path for that hub, held by the 10 `d3-plain` rows |
| R-007 | Doctor phrases take rows from owner skills and drop a pinned number | H | M | Tune-only diagnostic wording, no skill penalty, and the pinned numbers and doctor slice rerun after each doctor regeneration |
| R-008 | New `/doctor:helper` phrases take rows from specific routes | M | M | The REQ-020 count stays at or below 7 |

---

## 11. USER STORIES

### US-001: The command from plain words (Priority: P0)

**As an** operator who describes a job instead of typing a command, **I want** the advisor to name the command that owns the job, **so that** the model can pick the command's workflow instead of improvising one.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

### US-002: No new noise (Priority: P0)

**As an** operator asking a plain question, **I want** no command offered when none fits, **so that** a chat answer stays a chat answer.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | Operator | Pending | - |
| Design Review | Operator | Pending | - |
| Implementation Review | Operator | Pending | - |
| Launch Approval | Operator | Pending | - |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance-checkpoints -->
## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- N/A: the phase changes scoring, one optional output field and local corpora. It reads no credential, no user data and no network resource.

### Code Compliance
- [ ] Coding standards followed
- N/A for licence: no dependency is added.
<!-- /ANCHOR:compliance-checkpoints -->

---

<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Operator | Product | High | The end-of-turn status of each session, and the answers to the two open questions |
| Operator | Engineering | High | `implementation-summary.md` of this phase, with the reach numbers and the relabel list |
<!-- /ANCHOR:stakeholder-matrix -->

---

<!-- ANCHOR:change-log -->
## 15. CHANGE LOG

### v1.4 (2026-11-12)
Closed Complete. The operator chose "Close with the same accepted miss (Recommended)" for holdout recall and "Carry three, settle five (Recommended)" for the other unmet criteria. Each settled row in `acceptance-criteria.md` names its ADR in `decision-record.md`.

### v1.3 (2026-11-12)
Final verified state recorded: the full suite passes, the review fixes landed, and the operator decided a top-only route lookup, an ask-first `/create:changelog` and the rename of the retired id in instruction files (plan ADR-013 to ADR-015). Status stays In Progress for the holdout gap.

### v1.2 (2026-11-12)
Built and measured. Status set to In Progress because holdout plain recall stayed at 0 of 44. The doctor phrases were reverted, and the build decisions are recorded in `plan.md` as ADR-007 to ADR-012.

### v1.1 (2026-11-12)
Operator answers: umbrella ids replaced now, doctor plain-chat reach added as workstream 7, build executor set to DeepSeek V4.1 Flash through cli-pi.

### v1.0 (2026-11-12)
**Initial specification**
<!-- /ANCHOR:change-log -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- Questions 1 and 2 were answered by the operator on 2026-11-12: replace the umbrella ids now, and bring doctor plain-chat reach into this phase. Both are recorded in `plan.md` as ADR-005 and ADR-006.
- Question 5 was answered by the operator on 2026-11-12: command-level meaning matching is built as phase 004 of this packet, `../004-command-meaning-matching/`, and the later phases moved to 005, 006 and 007.
- Question 6, doctor plain-chat reach after the revert, was answered on 2026-11-12: phase 004 reaches doctor commands by meaning, and AC-018 to AC-020 are superseded by it (ADR-018 in `decision-record.md`).
- Question 3, the hook latency budget, was closed on 2026-11-12 by the operator's choice of a top-only route lookup (plan ADR-013). One run measured median 235.04 ms and p95 318.96 ms, against 194.35 ms and 281.15 ms before.
- **4. The two hand-kept hub rows.** `create:agent` and `create:manual-testing-playbook` are active TypeScript rows today, and their `scoring-compatibility.json` entries carry `keywords` and `intentSignals`, not only `order`. This plan leaves both rows and their entries unchanged, so the compatibility file keeps scored fields for them. Should a later phase disable them once attach covers their commands?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`

---
