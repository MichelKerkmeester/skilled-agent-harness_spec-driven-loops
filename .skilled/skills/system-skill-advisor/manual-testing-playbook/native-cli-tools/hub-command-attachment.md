---
title: "NC-011 Hub Recommendation Names Its Slash Command"
description: "Manual validation that advisor_recommend adds the routed mode's slash command to a hub recommendation, holds a deep-loop command back until the prompt asks for depth and does not report a command row and its owner as a tie."
version: 1.0.0.0
id: NC-011
category: native_cli_tools
stage: routing
---

# NC-011 Hub Recommendation Names Its Slash Command

Prompt: Manual validation that advisor_recommend adds the routed mode's slash command to a hub recommendation, holds a deep-loop command back until the prompt asks for depth and does not report a command row and its owner as a tie.

---

## 1. OVERVIEW

A hub skill such as `sk-doc` used to come back as a bare skill id. The reader then had to work out which slash command runs the mode the hub picked. When a hub's compiled route picks exactly one mode, the recommendation now carries a `command` field with that mode's slash command.

This scenario checks three rules with four real prompts:

1. A plain authoring prompt for `sk-doc` returns `command: "/create:readme"`.
2. A `system-deep-loop` command is attached only when the prompt asks for depth. A prompt that names the topic gets the same route and no command.
3. A command row and the skill that owns it are one answer, so their near tie does not set `ambiguous`.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the `command` field on a single-mode hub route, the deep-loop effort gate and the same-owner tie rule.
- Real user request: `When the advisor picks sk-doc for my README, does it tell me which command to type?`
- Prompt: `Run advisor_recommend on four prompts and check which recommendations carry a slash command and whether any result is marked ambiguous.`
- Expected execution process: Run the four commands below from the repository root and read the fields named under Expected.
- Expected signals: `/create:readme` on `sk-doc`, no `command` key on the topic-only deep-loop prompt, `/deep:research` on the same prompt with `in depth` added, and `ambiguous: false` on `/speckit:save`.
- Desired user-visible outcome: The reader learns which command to type for a hub's mode, and is never offered a long deep-loop run they did not ask for.
- Pass/fail: PASS if all four results match the expected signals. FAIL if any command is missing, extra or wrong, or if `/speckit:save` is marked ambiguous.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run advisor_recommend on four prompts and check which recommendations carry a slash command and whether any result is marked ambiguous.`

### Commands

1. `bash: mkdir -p /tmp/skill-advisor-playbook`
2. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"create a readme for the scripts folder"}' --format json > /tmp/skill-advisor-playbook/nc-011-readme.json`
3. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"research loop on incremental indexing approaches"}' --format json > /tmp/skill-advisor-playbook/nc-011-topic.json`
4. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"research loop on incremental indexing approaches in depth"}' --format json > /tmp/skill-advisor-playbook/nc-011-depth.json`
5. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"/speckit:save"}' --format json > /tmp/skill-advisor-playbook/nc-011-owner.json`
6. In each file read `status`, `data.ambiguous` and, for each entry in `data.recommendations`, the `skillId`, `score`, `confidence`, `compiledRoute.targets[0].workflowMode` and `command`.

### Exact Prompt Table

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NC-011 | Hub recommendation names its slash command | Confirm the `command` field, the deep-loop effort gate and the same-owner tie rule | `Run advisor_recommend on four prompts and check which recommendations carry a slash command and whether any result is marked ambiguous.` | Commands 1 to 6 above | `/create:readme` on `sk-doc`. No `command` on the topic prompt. `/deep:research` on the depth prompt. `ambiguous: false` on `/speckit:save` | The four JSON files plus the terminal transcript | PASS if all four results match. FAIL otherwise | See Failure Triage |

### Expected

- Every envelope has `status: "ok"` and the shell exit code is `0`.
- `nc-011-readme.json`: the first recommendation is `sk-doc`. Its `compiledRoute` has `action: "route"`, `selectionKind: "single"` and one target with `workflowMode: "sk-create-readme"`. It carries `command: "/create:readme"`.
- `nc-011-topic.json`: the first recommendation is `system-deep-loop` with a single route to the `research` mode. The recommendation has no `command` key, because the prompt names the topic and asks for no depth.
- `nc-011-depth.json`: the same skill and the same `research` route, now with `command: "/deep:research"`. The words `in depth` are on the effort list, so they unlock the command.
- `nc-011-owner.json`: `system-spec-kit` and `command-speckit-save` both rank, with scores less than 0.05 apart. `data.ambiguous` is `false`, because `command-speckit-save` belongs to `system-spec-kit`.

### Evidence

Keep the four JSON files and the terminal transcript. Reduced to one line per recommendation, a passing run reads like this:

```text
create a readme for the scripts folder
  status=ok ambiguous=false
  sk-doc score=0.78436 confidence=0.9416 route=route/single/sk-create-readme command=/create:readme
research loop on incremental indexing approaches
  status=ok ambiguous=false
  system-deep-loop score=0.675806 confidence=0.8832 route=route/single/research command=(absent)
research loop on incremental indexing approaches in depth
  status=ok ambiguous=false
  system-deep-loop score=0.65573 confidence=0.8725 route=route/single/research command=/deep:research
/speckit:save
  status=ok ambiguous=false
  system-spec-kit score=0.738163 confidence=0.9168 command=(absent)
  command-speckit-save score=0.7 confidence=0.8962 command=(absent)
```

The scores can move after an index rebuild. The commands, the routes and the `ambiguous` value are the checked signals.

### Pass / Fail

- **Pass**: all four results match Expected.
- **Fail**: `sk-doc` has no `command` or a different one, the topic prompt carries a command, the depth prompt does not carry `/deep:research`, or `/speckit:save` returns `ambiguous: true`.

### Failure Triage

1. `sk-doc` has no `compiledRoute` at all: run `node .skilled/bin/compiled-route-guard.cjs`. A `stale-manifest` line for `sk-doc` means the hub serves legacy routing until its manifest is refreshed, and legacy routing names no command.
2. A route exists but no command: check that the routed mode has a row in `MODE_COMMANDS` in `runtime/lib/command-attach.ts`, and that the runtime build is current.
3. The topic prompt carries a deep-loop command: compare the prompt with `DEPTH_WORDING` in `runtime/lib/command-attach.ts`.
4. `/speckit:save` is ambiguous: check that the `command-speckit-save` row in `runtime/lib/scorer/projection.ts` has `ownerSkill: 'system-spec-kit'`, then run `runtime/tests/scorer/same-owner-ambiguity.vitest.ts`.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | Mode-to-command table, the effort word list and the single-mode rule |
| `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` | Adds `command` beside `compiledRoute` and skips a command whose own row already ranks |
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts` | Keeps a command row and its owner out of the same tie |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach.vitest.ts` | Unit tests for the table and the effort gate |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/same-owner-ambiguity.vitest.ts` | Unit tests for the same-owner tie rule |
| [`advisor-recommend.md`](../../feature-catalog/cli-surface/advisor-recommend.md) | Feature catalog entry for `advisor_recommend` |
| [`ambiguity.md`](../../feature-catalog/scorer-fusion/ambiguity.md) | Feature catalog entry for the ambiguity window |

---

## 5. SOURCE METADATA

- Group: Native Command Surface
- Playbook ID: NC-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: native-cli-tools/hub-command-attachment.md
