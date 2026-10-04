---
title: "DOC-367 -- Doctor skill-advisor target menu"
description: "Manual scenario validating that /doctor:skill-advisor with no target shows the presentation contract menu and waits, and never infers a target from history, open files, earlier runs or repository state."
version: 1.0.0.0
id: doctor-commands-doctor-skill-advisor-target-menu
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# DOC-367 -- Doctor skill-advisor target menu

## 1. OVERVIEW

This scenario validates the mandatory input gate of `/doctor:skill-advisor`. The command is a thin router, and when the first positional token is absent or whitespace-only the target is missing. The gate is explicit that the router must not infer the target from conversation history, open files, earlier runs or repository state. It shows the presentation contract's target-resolution prompt, stops and waits.

The same session then exercises the defined resolutions: the cancel answer, the help answer, the invalid-answer escalation, the binding of a numeric answer, and the two failure texts for an unknown target and a cross-target flag. `list`, `?` and `--list` render the route manifest instead of binding a target.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a missing target shows the menu and waits without guessing, and that every defined answer maps to its documented outcome.
- Playbook ID: DOC-367.
- Real user request: `/doctor:skill-advisor`
- Prompt: `/doctor:skill-advisor`
- Preconditions: A session in which `/doctor:skill-advisor rebuild` ran earlier, so a tempting history is available and must not be used. The advisor presentation asset is present.
- Expected execution process: Invoke the command with no arguments, then answer X, then an invalid answer twice, then H, then a numeric target, and finally invoke the two failure cases and the manifest display.
- Expected signals: The startup menu prints with options 1 to 6 plus H and X, and the run stops without loading a workflow asset. The accepted answers map as documented: 1 to `tune`, 2 to `rebuild`, 3 to `skill-graph-freshness`, 4 to `router-reach`, 5 to `skill-budget`, 6 to `parent-skill`, H to the help block followed by the same question, and X, empty or `cancel` to `STATUS=CANCEL`. Any other response re-emits the menu once, and a second invalid response returns `STATUS=FAIL ERROR=unknown_selection`. The help block lists each symptom with its target number. An unknown target prints the unknown-target text with its valid target list and `STATUS=FAIL ERROR="unknown_target"`. A cross-target flag prints the cross-target failure with `STATUS=FAIL ERROR="cross_target_flag_injection"`. `list`, `?` and `--list` render the route manifest table with the six targets, their workflow assets, the mutation class and a one-line purpose.
- Desired user-visible outcome: The menu appears and waits, and nothing is dispatched until the operator picks a target.
- Pass/fail: PASS if the missing target prompts and waits, no workflow loads before a target is bound, and every answer maps to its documented outcome.
- Classification: Manual scenario. Valid verdicts are `PASS`, `FAIL`, or `SKIP`. Record `SKIP` only when a named environment prerequisite, credential, or command binary is unavailable. A scenario that cannot be run for any other reason is a `FAIL`.

---

## 3. TEST EXECUTION

### Prompt

```
/doctor:skill-advisor
```

### Commands

1. In the session where the rebuild target ran earlier, invoke `/doctor:skill-advisor` with no arguments. Confirm the startup menu prints and the run waits without loading any workflow asset.
2. Answer `X`. Confirm `STATUS=CANCEL`.
3. Invoke the command again and answer `zz`. Confirm the menu is re-emitted once. Answer `zz` again and confirm `STATUS=FAIL ERROR=unknown_selection`.
4. Invoke the command again and answer `H`. Confirm the help block prints and the same question is asked again.
5. Answer `3`. Confirm the setup dashboard shows `Target: skill-graph-freshness`, `Mutation class: read-only`, `Execution mode: INTERACTIVE` and the matching workflow asset, then let the diagnostic finish.
6. Invoke `/doctor:skill-advisor reindex`. Confirm the unknown-target text, its valid target list and `STATUS=FAIL ERROR="unknown_target"`.
7. Invoke `/doctor:skill-advisor skill-budget --dry-run`. Confirm the cross-target failure text and `STATUS=FAIL ERROR="cross_target_flag_injection"`.
8. Invoke `/doctor:skill-advisor list`, then `?` and `--list`. Confirm each renders the route manifest table with the six targets.

### Expected

The input gate parses the first positional token before any flag. A missing target shows the presentation contract's target-resolution prompt and waits for an explicit reply, and the reply is the only accepted source for the target. The unknown-target and cross-target flag failures stop before any workflow asset loads. The manifest display renders the route table instead of binding a target.

### Evidence

- The startup menu and the help block.
- The `STATUS=CANCEL`, `STATUS=FAIL ERROR=unknown_selection`, `STATUS=FAIL ERROR="unknown_target"` and `STATUS=FAIL ERROR="cross_target_flag_injection"` lines.
- The setup dashboard from step 5.
- The route manifest table from step 8.

### Pass / Fail

- **Pass**: The missing target prompts and waits, no workflow loads before a target is bound, and every answer maps to its documented outcome.
- **Fail**: The router infers a target from history, open files, earlier runs or repository state, loads a workflow before a target is bound, or an answer produces a different outcome than the presentation contract defines.

### Failure Triage

If a target is inferred, inspect the mandatory input gate in `skill-advisor.md`. If the menu wording differs, inspect the startup presentation in `doctor-skill-advisor-presentation.txt`. If a failure text differs, inspect the unknown-target and cross-target flag failure blocks in the same asset. If the manifest table disagrees with the routes, run `bash .skilled/commands/doctor/scripts/route-validate.sh`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Command entrypoint: [.skilled/commands/doctor/skill-advisor.md](../../../../commands/doctor/skill-advisor.md)
- Presentation contract: [.skilled/commands/doctor/assets/doctor-skill-advisor-presentation.txt](../../../../commands/doctor/assets/doctor-skill-advisor-presentation.txt)
- Route manifest: [.skilled/commands/doctor/_routes.yaml](../../../../commands/doctor/_routes.yaml)

Provenance: manual only - /doctor:skill-advisor

---

## 5. SOURCE METADATA

- Group: Doctor commands
- Playbook ID: DOC-367
- Feature name: Doctor skill-advisor target menu
- Command mode: `/doctor:skill-advisor`
- Mutation boundary: read-only. The router resolves a target and displays the menu or the manifest. It loads a workflow asset only after a target is bound.
- Feature file path: `doctor-commands/doctor-skill-advisor-target-menu.md`
