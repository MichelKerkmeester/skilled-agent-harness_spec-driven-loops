---
title: "NC-011 Hub Recommendation Names Its Slash Command"
description: "Manual validation that advisor_recommend adds the routed mode's slash command to a hub recommendation, holds a deep-loop command back until the prompt asks for the loop itself and does not report a command row and its owner as a tie."
version: 1.0.1.0
id: NC-011
category: native_cli_tools
stage: routing
---

# NC-011 Hub Recommendation Names Its Slash Command

Prompt: Manual validation that advisor_recommend adds the routed mode's slash command to a hub recommendation, holds a deep-loop command back until the prompt asks for the loop itself and does not report a command row and its owner as a tie.

---

## 1. OVERVIEW

A hub skill such as `sk-doc` used to come back as a bare skill id. The reader then had to work out which slash command runs the mode the hub picked. When a hub's compiled route picks exactly one mode, the recommendation now carries a `command` field with that mode's slash command.

This scenario checks three rules with five real prompts:

1. A plain authoring prompt for `sk-doc` returns `command: "/create:readme"`.
2. A `system-deep-loop` command is attached only when the prompt asks for the loop itself: iterations, an iteration count, multiple passes, a deep loop by name behind a use verb, or the typed command. A prompt that names the topic gets the route and no command, and so does a prompt that only asks for depth, such as `in depth` or `thorough`, because depth asks for care inside one pass.
3. A command row and the skill that owns it are one answer, so their near tie does not set `ambiguous`.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the `command` field on a single-mode hub route, the deep-loop loop-request gate and the same-owner tie rule.
- Real user request: `When the advisor picks sk-doc for my README, does it tell me which command to type?`
- Prompt: `Run advisor_recommend on five prompts and check which recommendations carry a slash command and whether any result is marked ambiguous.`
- Expected execution process: Run the five commands below from the repository root and read the fields named under Expected.
- Expected signals: `/create:readme` on `sk-doc`, no `command` key on the topic-only deep-loop prompt, no `command` key on any recommendation for the depth-only prompt `review the parser in depth`, `/deep:review` on the `system-deep-loop` recommendation for `run 5 review iterations on the parser`, and `ambiguous: false` on `/speckit:save`.
- Desired user-visible outcome: The reader learns which command to type for a hub's mode, and is never offered a long deep-loop run they did not ask for.
- Pass/fail: PASS if all five results match the expected signals. FAIL if any command is missing, extra or wrong, or if `/speckit:save` is marked ambiguous.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run advisor_recommend on five prompts and check which recommendations carry a slash command and whether any result is marked ambiguous.`

### Commands

1. `bash: mkdir -p /tmp/skill-advisor-playbook`
2. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"create a readme for the scripts folder"}' --format json > /tmp/skill-advisor-playbook/nc-011-readme.json`
3. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"research loop on incremental indexing approaches"}' --format json > /tmp/skill-advisor-playbook/nc-011-topic.json`
4. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"review the parser in depth"}' --format json > /tmp/skill-advisor-playbook/nc-011-depth.json`
5. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"run 5 review iterations on the parser"}' --format json > /tmp/skill-advisor-playbook/nc-011-loop.json`
6. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"/speckit:save"}' --format json > /tmp/skill-advisor-playbook/nc-011-owner.json`
7. In each file read `status`, `data.ambiguous` and, for each entry in `data.recommendations`, the `skillId`, `score`, `confidence`, `compiledRoute.targets[0].workflowMode` and `command`.

### Exact Prompt Table

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NC-011 | Hub recommendation names its slash command | Confirm the `command` field, the deep-loop loop-request gate and the same-owner tie rule | `Run advisor_recommend on five prompts and check which recommendations carry a slash command and whether any result is marked ambiguous.` | Commands 1 to 7 above | `/create:readme` on `sk-doc`. No `command` on the topic prompt. No `command` on the depth-only prompt. `/deep:review` on `system-deep-loop` for the iterations prompt. `ambiguous: false` on `/speckit:save` | The five JSON files plus the terminal transcript | PASS if all five results match. FAIL otherwise | See Failure Triage |

### Expected

- Every envelope has `status: "ok"` and the shell exit code is `0`.
- `nc-011-readme.json`: the first recommendation is `sk-doc`. Its `compiledRoute` has `action: "route"`, `selectionKind: "single"` and one target with `workflowMode: "sk-create-readme"`. It carries `command: "/create:readme"`.
- `nc-011-topic.json`: the first recommendation is `system-deep-loop` with a single route to the `research` mode. The recommendation has no `command` key, because the prompt names the loop without a use verb such as `start` and asks for no iterations or passes.
- `nc-011-depth.json`: no recommendation carries a `command` key. `sk-code` leads with its single-pass review route, and `system-deep-loop`, if it ranks, carries no `/deep:review`, because `in depth` is depth wording and asks for care inside one pass, not for the loop.
- `nc-011-loop.json`: the `system-deep-loop` recommendation carries `command: "/deep:review"`. Its route is `defer`, because the hub's router reads fixed phrases, and the command comes from `deferredLoopCommand()`: `5 review iterations` asks for the loop and `review` is the one mode cue. `sk-code` may rank first here and `data.ambiguous` may be `true`; the checked signal is the command on `system-deep-loop`.
- `nc-011-owner.json`: `system-spec-kit` and `command-speckit-save` both rank, with scores less than 0.05 apart. `data.ambiguous` is `false`, because `command-speckit-save` belongs to `system-spec-kit`.

### Evidence

Keep the five JSON files and the terminal transcript. Reduced to one line per recommendation, a passing run reads like this:

```text
create a readme for the scripts folder
  status=ok ambiguous=false
  sk-doc score=0.778256 confidence=0.95 route=route/single/sk-create-readme command=/create:readme
research loop on incremental indexing approaches
  status=ok ambiguous=false
  system-deep-loop score=0.681017 confidence=0.9053 route=route/single/research command=(absent)
review the parser in depth
  status=ok ambiguous=false
  sk-code score=0.672057 confidence=0.9002 route=route/single/sk-code-review command=(absent)
  system-deep-loop score=0.317739 confidence=0.82 route=defer command=(absent)
run 5 review iterations on the parser
  status=ok ambiguous=true
  sk-code score=0.677072 confidence=0.9031 route=route/single/sk-code-review command=(absent)
  system-deep-loop score=0.6682 confidence=0.8981 route=defer command=/deep:review
/speckit:save
  status=ok ambiguous=false
  system-spec-kit score=0.736516 confidence=0.9367 command=/speckit:save
  command-speckit-save score=0.7 confidence=0.9161 command=/speckit:save
```

The scores can move after an index rebuild. The commands, the routes and the `ambiguous` value are the checked signals.

### Pass / Fail

- **Pass**: all five results match Expected.
- **Fail**: `sk-doc` has no `command` or a different one, the topic prompt or the depth-only prompt carries a command, the `system-deep-loop` recommendation for the iterations prompt does not carry `/deep:review`, or `/speckit:save` returns `ambiguous: true`.

### Failure Triage

1. `sk-doc` has no `compiledRoute` at all: run `node .skilled/bin/compiled-route-guard.cjs`. A `stale-manifest` line for `sk-doc` means the hub serves legacy routing until its manifest is refreshed, and legacy routing names no command.
2. A route exists but no command: check that the routed mode has a row in `MODE_COMMANDS` in `runtime/lib/command-attach.ts`, and that the runtime build is current.
3. The topic or depth-only prompt carries a deep-loop command: compare the prompt with `LOOP_WORDING`, `LOOP_NAMES` and `LOOP_REQUEST` in `runtime/lib/command-attach.ts`. A depth word such as `thorough` or `in depth` must not be on either list.
4. The iterations prompt carries no `/deep:review`: check that `LOOP_REQUEST` matches the iteration count, that `MODE_CUES` finds exactly one cue, and that `attachCommand()` hands a `defer` or `clarify` route for `system-deep-loop` to `deferredLoopCommand()`.
5. `/speckit:save` is ambiguous: check that the `command-speckit-save` row in `runtime/lib/scorer/projection.ts` has `ownerSkill: 'system-spec-kit'`, then run `runtime/tests/scorer/same-owner-ambiguity.vitest.ts`.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Mode-to-command table, the loop wording lists, the single-mode rule and the deferred-route mode cue |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Adds `command` beside `compiledRoute` and skips a command whose own row already ranks |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Keeps a command row and its owner out of the same tie |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts` | Unit tests for the table and the loop-request gate |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/same-owner-ambiguity.vitest.ts` | Unit tests for the same-owner tie rule |
| [`advisor-recommend.md`](../../feature-catalog/cli-surface/advisor-recommend.md) | Feature catalog entry for `advisor_recommend` |
| [`ambiguity.md`](../../feature-catalog/scorer-fusion/ambiguity.md) | Feature catalog entry for the ambiguity window |

---

## 5. SOURCE METADATA

- Group: Native Command Surface
- Playbook ID: NC-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: native-cli-tools/hub-command-attachment.md
