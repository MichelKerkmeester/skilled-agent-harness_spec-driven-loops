---
title: "Goal Budget and Handoff"
description: "Measure durable goal text, cut an over-budget parent without losing criteria, and hand off the operator chat slice."
trigger_phrases:
  - "goal durable budget"
  - "over-budget parent goal"
  - "goal chat slice handoff"
  - "objective slice"
importance_tier: important
contextType: reference
version: 1.0.0.0
---
# Goal Budget and Handoff

## 1. OVERVIEW

Use the packet report to check a top-level goal or phase parent. Keep every completion criterion when cutting an over-budget parent. Give the operator the printed `chat_slice`.

---

## 2. MEASURE THE DURABLE SLICE

Run this command from the repository root:

```bash
node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo root>
```

Replace the placeholders with the packet path and repository root. Read `packet_durable_chars` and `packet_budget` in the output. The count covers text after the closing frontmatter fence and before the log anchor. Anchors and comments inside that range count. The manifest sets the limit to 4,000 characters for top-level packets and phase parents. A count of 4,000 is within budget. A larger count reports `packet_budget=over`. ([manifest, lines 24 to 28](../../../system-spec-kit/templates/spec-kit-docs.json))

The packet command prints the count and budget state with the other packet fields. ([packet output, lines 203 to 216](../../../../hooks/goal/bin/goal.cjs)) The shared module measures the durable slice from the frontmatter boundary to the log anchor. ([slice measurement, lines 52 to 63](../../../../hooks/goal/lib/goal-slice.cjs))

Phase children are exempt from the cap, so their packet report has `packet_budget=unknown`. An applicable top-level goal or phase parent can also report `unknown` if the budget manifest is missing or invalid. Treat that result as unverified and resolve the manifest issue before judging the goal. ([budget resolution and state, lines 268 to 285 and 380 to 387](../../../../hooks/goal/lib/goal-slice.cjs))

---

## 3. CUT IN THE PLAYBOOK ORDER

When a parent exceeds 4,000 characters, follow the [set-string playbook, section 4, lines 63 to 71](../../../system-spec-kit/references/workflows/goal-set-string-playbook.md). Rerun the packet command after the cuts.

1. Check the frontmatter first. It is bookkeeping outside the measured slice, so changing it does not lower `packet_durable_chars`.
2. Check the log next. It is outside the durable directive and the measured slice, so changing it does not lower `packet_durable_chars`.
3. Remove parent text that restates a child's goal. The binding makes the child goal authoritative for its phase.
4. Shorten decision prose to the choice a later author must honor. Put the argument in the decision record.
5. Shorten criterion wording only as needed. Keep the same number of criteria and make each one checkable. If the goal repeats these criteria in its objective, update that copy to match the [goal template's criterion instructions, lines 96 to 105](../../../system-spec-kit/templates/addons/goal.md.tmpl).

If the parent still exceeds the limit after those cuts, split the packet into separate goals. Never remove a criterion to fit the budget.

---

## 4. PRINT THE OPERATOR'S CHAT SLICE

The packet report prints both `chat_slice` and `objective_slice`. ([packet output, lines 203 to 216](../../../../hooks/goal/bin/goal.cjs)) The `chat_slice` is the durable text cleaned for chat. It removes HTML comments, dividers and numbered heading prefixes. Give this field to the operator to set or resend. ([chat rendering, lines 66 to 79](../../../../hooks/goal/lib/goal-slice.cjs))

The `objective_slice` is a separate projection assembled for a runtime bind. It starts with a packet pointer and adds standard binding and precedence text when the goal has a binding anchor. It then copies checked completion criteria. It does not contain the authored objective or decision table. ([objective projection, lines 87 to 118](../../../../hooks/goal/lib/goal-slice.cjs))

After a parent goal changes, print the current packet report. This mode prints `chat_slice` and stops. The runtime that owns session state handles any later handoff. The mode does not change session state.

---

## 5. RUNTIME HANDOFF MATRIX

The table records each runtime's role and what the repository evidence can establish. This mode always stops after it prints `chat_slice`.

| Runtime | Surface role | Evidence limit |
|---|---|---|
| Claude Code | Uses the native host goal command. The spec-kit workflow hands the stripped durable slice to the operator. | Repository documentation records operator confirmation. Recheck host behavior in a live Claude Code session. ([goal hooks README, lines 81 to 84](../../../../hooks/goal/README.md) and [goal plugin, lines 159 to 160](../../../../hooks/goal/goal-plugin.md)) |
| Codex | Uses the native host goal command and the same operator handoff as Claude Code. | Repository documentation records operator confirmation. Recheck host behavior in a live Codex session. ([goal hooks README, lines 81 to 84](../../../../hooks/goal/README.md) and [goal plugin, lines 159 to 160](../../../../hooks/goal/goal-plugin.md)) |
| OpenCode | A native plugin owns per-session goal files and provides `/goal-opencode` tools. | The repository documents the plugin and command. A live OpenCode session confirms host loading. ([goal hooks README, lines 75 and 80](../../../../hooks/goal/README.md) and [goal plugin, lines 155 and 166](../../../../hooks/goal/goal-plugin.md)) |
| Pi | A native session-bound extension registers `/goal-pi` and supplies the runtime session identity. | The repository documents extension registration. A live Pi session confirms host loading. ([goal hooks README, lines 75 and 77](../../../../hooks/goal/README.md) and [goal plugin, lines 156 and 168](../../../../hooks/goal/goal-plugin.md)) |
| Cursor | The prompt command reads a packet with `/goal-cursor packet <path>`. `packet-log` is a separate append action. | The read command needs no session identity. The hook's model visibility is recorded evidence, not an end-to-end guarantee. ([goal hooks README, lines 75 and 78](../../../../hooks/goal/README.md) and [Cursor command, lines 10 and 14 to 19](../../../../../.cursor/commands/goal-cursor.md)) |
| Devin | Hooks inject goal context. The repository exposes no Devin prompt-command surface. | The repository documents hook wiring. A live Devin session is needed to confirm host delivery. ([goal hooks README, lines 75 and 79](../../../../hooks/goal/README.md) and [goal plugin, lines 158 and 170](../../../../hooks/goal/goal-plugin.md)) |

---

## 6. FIXED TEMPLATE COST

In the [measured parent example](../../../../../specs/sk-doc/060-create-goal-mode/goal.md), the log records 4,820 durable characters before the cut, estimates that template fixed text takes about 1,900 characters and reports no criterion dropped, in its "Parent over budget on first draft" log row. A read-only run of the [packet command](../../../../hooks/goal/bin/goal.cjs) for that parent returns 3,735 with `packet_budget=ok`.

The fixed-text cost is an authoring constraint, not a system-spec-kit amendment on this evidence. If a future goal still cannot meet the current contract after the cuts above, raise the gap to system-spec-kit as an amendment, as the [measured parent example's D4 decision](../../../../../specs/sk-doc/060-create-goal-mode/goal.md) requires. The measured example met the contract without changing the template.
