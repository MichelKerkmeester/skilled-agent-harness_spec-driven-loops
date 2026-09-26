---
title: "sk-create-goal"
description: "Authors packet goal.md files from existing specifications and redirects session-goal requests to their owners."
trigger_phrases:
  - "create packet goal"
  - "goal.md authoring"
  - "phase parent goal"
  - "goal chat slice"
importance_tier: normal
contextType: general
version: 1.1.0.0
---

# sk-create-goal

> Write the goal.md a spec packet is missing, from that packet's own documents, and leave session goal state alone.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Authoring or revising a packet `goal.md` through six operations: top-level, phase-parent, child, retrofit, phase-add and amend |
| **Invoke with** | `/create:goal <packet path> [operation] [:auto|:confirm]`, or a plain request to author a packet goal |
| **Works on** | An existing spec packet with its own `spec.md` and its own acceptance criteria where the level requires them |
| **Produces** | One goal filled from the template for its kind and the packet's sources, plus the parent chat slice for the operator |
| **Never touches** | Session objective state. A request to set, bind or resend a goal goes to the goal hooks |

---

## 2. OVERVIEW

### What The Mode Does

`sk-create-goal` turns a packet's own specifications into its `goal.md`. Every goal starts from one of three templates, for a top-level packet, a phase parent or a phase child, and is filled with one objective sentence, the frozen decisions later work must honor and three to seven completion criteria. Each criterion resolves to an exit code, a count or a named artifact. Each template is a checked copy of the system-spec-kit goal template, and a test fails when the two drift apart.

A phase parent also gets a binding table with exactly one row per direct phase-child folder. The table lives only in the phase-parent goal. Each row points at that child's `goal.md`, and the child goal is then authoritative for its own phase.

### The File And Session Boundary

The mode authors files. It never sets, binds, injects or resends a session objective, and it never tracks whether an operator has done so. After a parent goal changes, the mode prints the file-derived `chat_slice` from `goal.cjs` and stops. The operator holds that slice as the objective. The goal hooks, or the host's native goal command, own everything past the print.

### Where The Content Comes From

Goal content is derived from the packet's own documents, never from a remembered summary. A nested child goal uses only that child's own specification and acceptance criteria. A phase parent's objective and criteria come from the parent-level sources, and its binding table is compared with the phase folders on disk by name, not by count.

---

## 3. WHEN TO USE

### Use This Mode When

- A top-level packet or phase parent needs a goal, or a revised one.
- A nested phase child needs its own goal.
- An existing packet has no `goal.md` at all and needs one added.
- A new phase appears in the phase map and on disk and needs one binding row plus its child goal.
- A parent goal runs over the 4,000-character durable budget and must be cut without losing a criterion.
- You want a parent goal's chat slice printed for the operator.

### When Not To Use

- The target packet does not exist. Create it with system-spec-kit first.
- The packet's phase structure is not settled. Plan the phases with system-spec-kit first.
- The request is to set, bind, inject or resend a session objective. That is goal-hook work, or the host's native goal command. This mode redirects it and writes nothing.
- The request changes runtime goal behavior or system-spec-kit template tooling. Those owners stay outside this mode.

---

## 4. THE SIX OPERATIONS

| Operation | Use it when |
|---|---|
| `top-level` | The target is a top-level packet and its goal is being authored or revised |
| `phase-parent` | The target has direct phase-child folders and its parent goal, binding table included, is being authored or revised |
| `child` | A nested phase child needs a goal written from its own sources |
| `retrofit` | An existing packet of any shape has no `goal.md` yet |
| `phase-add` | A phase was added and needs exactly one parent binding row and its child goal |
| `amend` | An existing goal must change, including a parent amendment driven by a child change |

An operation that alters a parent decision or criterion amends the parent first, then updates the child. A child goal never overrides a parent decision.

---

## 5. HOW IT WORKS

1. **Read the sources.** The packet's own `spec.md` and `acceptance-criteria.md`. For a phase parent, the Phase Documentation Map and every direct phase-child directory. For a nested child, only that child's own documents.
2. **Route.** File content or session state? What role does the packet play? Does `goal.md` exist? Does a child change force a parent amendment? A session-state request is redirected and nothing is written.
3. **Start from the template.** Copy the block from [`goal-top-level-template.md`](./assets/goal-top-level-template.md), [`goal-phase-parent-template.md`](./assets/goal-phase-parent-template.md) or [`goal-phase-child-template.md`](./assets/goal-phase-child-template.md) into `goal.md`. A child that `create.sh --with-goal` scaffolded already has the structure, so fill that file.
4. **Fill.** Load the authoring standards and the goal exemplars, then write the objective, the decision table and the criteria. Leave no template placeholder behind.
5. **Bind.** For a phase parent, compare the map's folder names with the direct child folders and the binding rows. All three sets must agree before anything is written.
6. **Measure.** `goal.cjs packet` reports `packet_durable_chars` and `packet_budget`. A top-level goal or phase parent stays at or under 4,000 characters. Phase children are exempt from the cap.
7. **Check.** Run the goal checker and resolve every finding.
8. **Hand off.** Print the `chat_slice` for the operator to set or resend, then stop.

### Cutting An Over-Budget Parent

Cut in the playbook order. The frontmatter comes first because it sits outside the measured slice. The log comes next because it is outside the durable directive. Then remove parent text that restates a child, then shorten decision prose, then shorten criterion wording only when still over. Never drop a criterion to fit the budget. If the parent still runs long, ask whether the packet scope should be split.

---

## 6. THE CHECKER

[`check-goal.cjs`](./scripts/check-goal.cjs) is a read-only conformance check. Run it from the repository root:

```bash
node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs <packet>
```

Four checks run on every packet it is given:

| Check | What it proves |
|---|---|
| `missing-binding-row` | Every direct phase-child folder has a target row in the phase-parent binding table |
| `placeholder` | No template text remains in the objective, the decision table or the criteria |
| `criteria-count` | The goal carries three to seven completion criteria |
| `parent-budget` | A top-level or phase-parent durable slice is at or under 4,000 characters |

A clean run prints `[check-goal] RESULT: PASSED (4/4 checks)` and exits 0. A finding names the check, the packet and the detail. Phase children skip the budget check, because the cap does not apply to them.

---

## 7. THE COMMAND

`/create:goal` is the entry point, routed through [`goal.md`](../../../commands/create/goal.md):

```text
/create:goal <packet path> [top-level|phase-parent|child|retrofit|phase-add|amend] [:auto|:confirm]
```

The packet path is required and never inferred from conversation history or open files. The operation token is optional. When it is missing, the workflow resolves the operation from the packet's own files and records it. `:auto` runs the workflow without checkpoints. `:confirm` checkpoints after the operation is chosen, before any goal file is written and before handoff. A request to set, bind or resend a session objective reaches no workflow at all: the router redirects it to the goal hooks and writes nothing.

---

## 8. MANUAL TESTING PLAYBOOK

[`manual-testing-playbook/`](./manual-testing-playbook/manual-testing-playbook.md) holds eight deterministic operator scenarios in one category, goal authoring. Each scenario builds a disposable scratch packet, drives the mode against it and removes the scratch root when it ends, so a run leaves the repository untouched.

| Scenario file | Behavior under test |
|---|---|
| `top-level-goal.md` | A top-level packet gets its goal |
| `phase-parent-and-nested-child-goals.md` | A phase parent and its nested child goals |
| `add-goal-to-packet-without-goal.md` | The retrofit operation on a packet with no goal |
| `cut-over-budget-parent.md` | An over-budget parent is cut without losing a criterion |
| `refuse-leftover-placeholder.md` | The checker fails a goal that keeps template text |
| `detect-unbound-phase.md` | The checker fails a parent missing a binding row |
| `resend-parent-after-child-change.md` | A child change that amends the parent prints the updated slice |
| `route-session-goal-away.md` | A session-goal request writes no goal file |

The boundary cases carry the weight. In `route-session-goal-away.md` a run that writes nothing is the passing outcome. In `refuse-leftover-placeholder.md` and `detect-unbound-phase.md` the passing outcome is a failed goal check with the named finding, because the check catching the defect is the behavior under test. Every scenario run records a verdict, a reason and an evidence path under the sk-doc benchmark report tree.

---

## 9. VERIFICATION

| Check | How to run it | What a pass looks like |
|---|---|---|
| Goal conformance | `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs <packet>` | `RESULT: PASSED (4/4 checks)`, exit 0 |
| Budget and slices | `node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace "$PWD"` | `packet_budget=ok` and the `chat_slice` printed |
| Checker and template tests | `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` | `pass 15`, `fail 0`, including template parity with `goal.md.tmpl` |
| Playbook package | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook` | `PASS ... scenarios=8 ... violations=0` |

---

## 10. RELATED RESOURCES

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | The workflow contract, the rules and the ownership boundaries |
| [`references/parent-and-nested-goals.md`](./references/parent-and-nested-goals.md) | The top-level, phase-parent, child, retrofit, phase-add and amend workflows |
| [`references/authoring-standards.md`](./references/authoring-standards.md) | Reader checks for objectives, decisions, criteria, logs and voice |
| [`references/budget-and-handoff.md`](./references/budget-and-handoff.md) | Durable budget measurement, ordered cuts and the runtime handoff matrix |
| [`assets/goal-top-level-template.md`](./assets/goal-top-level-template.md) | The blank for a packet with no phases |
| [`assets/goal-phase-parent-template.md`](./assets/goal-phase-parent-template.md) | The blank for a phase parent, with its binding table |
| [`assets/goal-phase-child-template.md`](./assets/goal-phase-child-template.md) | The blank for a phase child |
| [`assets/goal-exemplars.md`](./assets/goal-exemplars.md) | Cited goal excerpts with rubric outcomes |
| [`scripts/README.md`](./scripts/README.md) | The checker, its tests and fixtures |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | The eight operator scenarios and the run-record contract |
| [`goal.md.tmpl`](../../system-spec-kit/templates/addons/goal.md.tmpl) | The system-spec-kit source the three templates copy |
| [`goal.cjs`](../../../hooks/goal/bin/goal.cjs) | The session-free printer for a packet's goal slices |
| [Goal hooks README](../../../hooks/goal/README.md) | The runtime goal ownership and session-state boundary |
| [`/create:goal`](../../../commands/create/goal.md) | The command router with the auto and confirm workflows |
| [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) | Release notes for this mode |
