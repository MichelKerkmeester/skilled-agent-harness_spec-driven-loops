---
title: "NC-012 A Command the Prompt Does Not Ask For Is Not Offered"
description: "Manual validation that advisor_recommend withholds a hub's slash command when the prompt refuses it, asks about it, rules out a change or asks for a small correction, and still names a typed command's own row with its policy."
version: 1.0.0.0
id: NC-012
category: native_cli_tools
stage: routing
---

# NC-012 A Command the Prompt Does Not Ask For Is Not Offered

Prompt: Manual validation that advisor_recommend withholds a hub's slash command when the prompt refuses it, asks about it, rules out a change or asks for a small correction, and still names a typed command's own row with its policy.

---

## 1. OVERVIEW

A hub route names the command that acts on the mode it picked. That offer is only right when the reader asked for the workflow. A prompt that names the command to refuse it, asks a question about it, rules out a change or asks for a correction inside one existing document is not asking for the workflow, so the offer is withheld.

Three offer gates stand between a route and its command:

1. A command the prompt refuses or asks about is a naming, not a request.
2. A prompt that rules out a change gets no command from either path.
3. A correction inside one document is not a request for a creation workflow.

This scenario checks those gates with five real prompts and adds one prompt whose recommendation row is a command itself. A command row carries its own command and policy, so the reader sees `/doctor:git setup` with `run` even though the leading skill in that result names no command.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the refusal, question, no-edit and small-edit gates withhold a hub command while a plain request still carries `/create:readme` with `start`, and read a command row's own policy.
- Real user request: `When I ask what /create:readme does, why does the advisor keep offering to run it?`
- Prompt: `Run advisor_recommend on six prompts and check which recommendations carry a command and its policy word.`
- Expected execution process: Run the six commands below from the repository root and read the fields named under Expected.
- Expected signals: no command on the refusal, the question, the no-edit request and the typo fix, `/create:readme` with `start` on the plain request, and `/doctor:git setup` with `run` on the git prompt's command row.
- Desired user-visible outcome: The reader is offered a workflow only when they asked for it, and a typed command names the policy that says whether it runs or asks.
- Pass/fail: PASS if all six results match the expected signals. FAIL if any withheld command appears, the plain request loses its command, or the git command row carries a different command or policy.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run advisor_recommend on six prompts and check which recommendations carry a command and its policy word.`

### Commands

1. `bash: mkdir -p /tmp/skill-advisor-playbook`
2. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"do not run /create:readme, just tell me what it covers"}' --format json > /tmp/skill-advisor-playbook/nc-012-refusal.json`
3. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"what does /create:readme do"}' --format json > /tmp/skill-advisor-playbook/nc-012-question.json`
4. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"write a readme for the utils folder"}' --format json > /tmp/skill-advisor-playbook/nc-012-plain.json`
5. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"write a readme for the utils folder, no edits yet"}' --format json > /tmp/skill-advisor-playbook/nc-012-no-edit.json`
6. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"fix the typo on line 12 of the scripts readme"}' --format json > /tmp/skill-advisor-playbook/nc-012-typo.json`
7. `bash: node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Check my git hooks setup"}' --format json > /tmp/skill-advisor-playbook/nc-012-git.json`
8. In each file read `status` and, for each entry in `data.recommendations`, the `skillId`, `score`, `confidence`, `compiledRoute.targets[0].workflowMode`, `command` and `policy`.

### Exact Prompt Table

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| NC-012 | Command the prompt does not ask for is not offered | Confirm the refusal, question, no-edit and small-edit gates withhold a hub command while a plain request still carries its command | `Run advisor_recommend on six prompts and check which recommendations carry a command and its policy word.` | Commands 1 to 8 above | No command on the refusal, the question, the no-edit request and the typo fix. `/create:readme` with `start` on the plain request. `/doctor:git setup` with `run` on the git command row | The six JSON files plus the terminal transcript | PASS if all six results match. FAIL otherwise | See Failure Triage |

### Expected

- Every envelope has `status: "ok"` and the shell exit code is `0`.
- `nc-012-refusal.json`: the first recommendation is `sk-doc` with a single route to `sk-create-readme`. It has no `command` key, because `do not run` is a decline lead before the command.
- `nc-012-question.json`: the first recommendation is `sk-doc` with a single route to `sk-create-readme`. It has no `command` key, because `what does` is an ask lead before the command.
- `nc-012-plain.json`: the first recommendation is `sk-doc` with a single route to `sk-create-readme`. It carries `command: "/create:readme"` and `policy: "start"`.
- `nc-012-no-edit.json`: the first recommendation is `sk-doc` with a single route to `sk-create-readme`. It has no `command` key, because `no edits yet` rules out a change.
- `nc-012-typo.json`: the first recommendation is `sk-doc` with a single route to `sk-create-readme`. It has no `command` key, because `typo` and `line 12` mark a correction inside one document rather than a request for a new one.
- `nc-012-git.json`: `sk-git` ranks first and carries no `command`. The `command-doctor-git-setup` row ranks second and carries `command: "/doctor:git setup"` with `policy: "run"`.

### Evidence

Keep the six JSON files and the terminal transcript. Reduced to one line per checked recommendation, a passing run reads like this:

```text
do not run /create:readme, just tell me what it covers
  status=ok
  sk-doc route=route/single/sk-create-readme command=(absent)
what does /create:readme do
  status=ok
  sk-doc route=route/single/sk-create-readme command=(absent)
write a readme for the utils folder
  status=ok
  sk-doc route=route/single/sk-create-readme command=/create:readme policy=start
write a readme for the utils folder, no edits yet
  status=ok
  sk-doc route=route/single/sk-create-readme command=(absent)
fix the typo on line 12 of the scripts readme
  status=ok
  sk-doc route=route/single/sk-create-readme command=(absent)
Check my git hooks setup
  status=ok
  sk-git command=(absent)
  command-doctor-git-setup command=/doctor:git setup policy=run
```

The scores and confidences can move after an index rebuild. The routes, the commands and the policy words are the checked signals.

### Pass / Fail

- **Pass**: all six results match Expected.
- **Fail**: a refusal, a question, a no-edit request or a typo fix carries a command, the plain request carries no command or a different policy, or the git command row carries a different command or policy.

### Failure Triage

1. A refusal or question still carries a command: compare the prompt with `COMMAND_DECLINE_LEADS` and `COMMAND_ASK_LEADS` in `runtime/lib/command-attach.ts`, then run `runtime/tests/command-attach-guards.vitest.ts`.
2. A no-edit request still carries a command: check `NO_EDIT_REQUEST` and `isNoEditRequest()`, then run the same test file.
3. A typo fix still carries a command: check `SMALL_EDIT_WORDING`, `CORRECTION_VERB` and `SMALL_EDIT_GATED_COMMANDS` beside each other.
4. The plain request carries no command: check the `sk-doc` entry for `sk-create-readme` in `MODE_COMMANDS`, and confirm the runtime build is current.
5. The git command row carries a different command or policy: check the `/doctor:git setup` entry in `TRACKED_COMMANDS`.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | `commandOnlyMentioned`, `NO_EDIT_REQUEST` and `SMALL_EDIT_WORDING`, plus the mode table that maps `sk-create-readme` to `/create:readme` |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | Regression tests for the refusal, question, no-edit and small-edit gates |
| [`advisor-recommend.md`](../../feature-catalog/cli-surface/advisor-recommend.md) | Feature catalog entry for `advisor_recommend` |

---

## 5. SOURCE METADATA

- Group: Native Command Surface
- Playbook ID: NC-012
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: native-cli-tools/command-offer-fit-gates.md
