---
title: "Goal Budget and Handoff"
description: "Measure durable goal text, cut an over-budget parent without losing criteria, and state what a parent goal sent in chat contains."
trigger_phrases:
  - "goal durable budget"
  - "over-budget parent goal"
  - "goal chat slice handoff"
  - "objective slice"
importance_tier: important
contextType: implementation
version: 1.1.0.0
---
# Goal Budget and Handoff

## 1. OVERVIEW

Use the packet report to check a top-level goal or phase parent. Keep every completion criterion when cutting an over-budget parent. Section 2 is the one rule for which goals carry the cap, section 3 the one full cut order and section 4 the one full rule for what a parent goal sent in chat contains. Other documents point here rather than restating them.

---

## 2. MEASURE THE DURABLE SLICE

Run this command from the repository root:

```bash
node .skilled/hooks/goal/bin/goal.cjs packet <packet> --workspace <repo root>
```

Replace the placeholders with the packet path and repository root. Read `packet_durable_chars` and `packet_budget` in the output. The count covers text after the closing frontmatter fence and before the log anchor. Anchors and comments inside that range count. The manifest sets the limit to 4,000 characters for top-level packets and phase parents. A count of 4,000 is within budget. A larger count reports `packet_budget=over`. ([manifest, lines 24 to 28](../../../system-spec-kit/templates/spec-kit-docs.json))

The packet command prints the count and budget state with the other packet fields. ([packet output, lines 205 to 218](../../../../hooks/goal/bin/goal.cjs)) The shared module measures the durable slice from the frontmatter boundary to the log anchor. ([slice measurement, lines 57 to 68](../../../../hooks/goal/lib/goal-slice.cjs))

The cap applies to a top-level packet and to any folder that is itself a phase parent, meaning it has phase children or its `spec.md` declares the phase level, even when that folder sits inside another packet. Only a phase child that is not itself a phase parent is exempt, and its packet report reads `packet_budget=unknown`. `goal.cjs packet`, `check-goal.cjs` and `validate.sh` draw this same line. An applicable goal can also report `unknown` if the budget manifest is missing or invalid. Treat that result as unverified and resolve the manifest issue before judging the goal. ([budget resolution, lines 288 to 307](../../../../hooks/goal/lib/goal-slice.cjs) and [applicability and state, lines 400 to 415](../../../../hooks/goal/lib/goal-slice.cjs))

---

## 3. CUT IN THIS ORDER

When a parent exceeds 4,000 characters, cut in this order and rerun the packet command after the cuts.

1. Check the frontmatter first. It is bookkeeping outside the measured slice, so changing it does not lower `packet_durable_chars`.
2. Check the log next. It is outside the durable directive and the measured slice, so changing it does not lower `packet_durable_chars`.
3. Remove author instructions an older template left above the log: a blockquote under the title, an `Operator copy` section and a criteria introduction. First move any packet-specific sentence written under those headings into the objective or a decision.
4. Remove parent text that restates a child's goal. The binding makes the child goal authoritative for its phase.
5. Shorten decision prose to the choice a later author must honor. Put the argument in the decision record.
6. Shorten criterion wording only as needed. Keep the same number of criteria and make each one checkable, following [authoring standards, section 4](authoring-standards.md). If the goal repeats these criteria in its objective, update that copy to match.

If the parent still exceeds the limit after those cuts, split the packet into separate goals. Never remove a criterion to fit the budget.

---

## 4. WHAT A PARENT GOAL SENT IN CHAT CONTAINS

Send a parent goal in chat only as the `chat_slice` that `goal.cjs packet` prints, and only when the same report shows `packet_budget=ok`. Never paste the file, a summary of it or any other text. ([packet output, lines 205 to 218](../../../../hooks/goal/bin/goal.cjs))

A parent goal sent in chat never contains:

- Frontmatter
- HTML comments, which include every anchor marker and template marker
- `---` dividers
- Heading section numbers
- Author instructions, meaning template text that tells a writer how to fill, cut or resend the file

The chat slice removes the first four. ([chat rendering, lines 78 to 85](../../../../hooks/goal/lib/goal-slice.cjs)) The current templates carry no author instructions above the log, so a goal filled from them sends none. What stays is the title, the objective, the decision table, the binding table with its Read, Precedence and Stop rules, and the completion criteria.

The 4,000-character limit is measured on the durable slice, with comments and anchors counted. `validate.sh`, `check-goal.cjs` and `goal.cjs packet` all measure that text. The chat slice only removes text from the durable slice, so a parent at `packet_budget=ok` never sends more than 4,000 characters. When the report shows `over`, cut the file in the section 3 order and measure again. Never truncate the chat slice to fit. When a top-level goal or phase parent shows `unknown`, fix the manifest first.

A goal filled from an older template can still carry a blockquote under its title, an `Operator copy` section or a criteria introduction. `AGENTS.md` overrides any resend wording in them. Remove them the next time the parent is amended or cut, as section 3 step 3 says.

The `objective_slice` is a different projection, assembled for a runtime bind, and it is never pasted in chat. It starts with a packet pointer and adds standard binding and precedence text when the goal has a binding anchor. It then copies checked completion criteria. It does not contain the authored objective or decision table. ([objective projection, lines 112 to 124](../../../../hooks/goal/lib/goal-slice.cjs))

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
| Devin | Hooks inject goal context. The repository exposes no Devin prompt-command surface. | The repository documents hook wiring. A live Devin session is needed to confirm host delivery. ([goal hooks README, lines 75 and 79](../../../../hooks/goal/README.md) and [goal plugin, lines 158 and 162 to 168](../../../../hooks/goal/goal-plugin.md)) |

---

## 6. FIXED TEMPLATE COST

Measured on the unfilled blocks, the fixed text costs 1,624 durable characters for a phase parent, 1,004 for a top-level goal and 956 for a phase child. Most of that is placeholders and, for a parent, the binding rules. A live packet records its own count in its log, not here.

The fixed-text cost is an authoring constraint. If a goal still cannot meet the contract after the section 3 cuts, raise the gap to system-spec-kit as an amendment.
