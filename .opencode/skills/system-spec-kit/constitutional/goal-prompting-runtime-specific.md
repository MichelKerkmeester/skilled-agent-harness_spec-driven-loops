---
title: "GOAL PROMPTING — Runtime-Specific: Claude Code Native vs OpenCode mk-goal Plugin"
importanceTier: constitutional
contextType: decision
last_confirmed: "2026-07-01"
last_confirmed_source: "deep-review-finding-DR-002/007/008"
triggerPhrases:
  - /goal
  - /opencode_goal
  - /goal_opencode
  - goal prompt
  - session goal
  - set goal
  - mk_goal
  - mk-goal
  - active goal
  - goal plugin
---

# Goal Prompting — Runtime-Specific

## Rule

When operating as **Claude Code** and the user says "/goal" or asks to set/manage a
session goal, use Claude Code's own **native** `/goal` goal-prompting feature. Do NOT
route through the OpenCode `mk-goal` plugin command (currently named `/goal_opencode`,
confirmed as the operator's final choice on 2026-07-01 — it had round-tripped through
`/goal` in between; verify the live filename if this note predates a future change).

## Why

The command name `/goal` originally collided: the OpenCode plugin's router lived at
`.opencode/commands/goal.md`, which shadowed the name across both runtimes and made it
impossible to reach Claude Code's own native `/goal` in this repo — invoking "goal" from
Claude Code always resolved to the OpenCode markdown and instructed a call to `mk_goal()`,
a tool that does not exist in Claude Code (confirmed dead end 2026-07-01, `ToolSearch`
found no matching tool; no `plugin_bridges/*.mjs` exists for `mk-goal`, unlike
`mk-spec-memory`/`mk-skill-advisor`/`mk-code-graph`). **First fix (2026-07-01)**: renamed
to `.opencode/commands/opencode_goal.md`. **Second rename (same day, same session)**:
a separate in-flight OpenCode session (working on packet 032 phase 009, the
`/speckit:*` goal-prompt-offer integration) renamed it again to
`.opencode/commands/goal_opencode.md` — content unchanged, filename only, confirmed via
a concurrent deep-review pass (finding DR-002/DR-007/DR-008: "the command surface has
fractured into multiple names across code, phase docs, graph metadata, and overlay
catalogs/playbooks"). **Third rename**: an audit-driven remediation phase (032 phase 011)
renamed it back to `.opencode/commands/goal.md`, reasoning from a `strings` search of the
opencode binary confirming no built-in `/goal` command exists. The concurrent phase-009
session renamed it back to `.opencode/commands/goal_opencode.md` again shortly after. The
operator confirmed on 2026-07-01 that `goal_opencode.md` is the correct, final name —
this file and its referencing surfaces were swept to match. Do not hardcode past names,
but this is no longer expected to move again absent a new operator decision.

## How to apply

1. In a Claude Code session, use Claude Code's built-in native `/goal` directly.
2. In an OpenCode session (or when explicitly targeting the OpenCode plugin from any
   runtime), **check `.opencode/commands/*goal*.md` for the current live filename**
   before invoking it — it routes to `.opencode/plugins/mk-goal.js` via
   `mk_goal`/`mk_goal_status`, and only functions inside an actual OpenCode session.
3. Never expect a bare `/goal` invocation to reach the OpenCode plugin, and never assume
   the OpenCode-side command name from a prior memory/session without re-verifying the
   live file — it has changed twice already and phase 009's own work may rename or
   consolidate it again. Per DR-002/007/008, the docs, graph metadata, and playbooks may
   also lag the actual filename; treat all of them as unverified until cross-checked
   against the live file.

## Failure mode signal

If Claude Code attempts to call `mk_goal()`/`mk_goal_status()` and no such tool exists
in the toolset, STOP — this confirms the OpenCode plugin command was invoked from the
wrong runtime. Switch to the native `/goal` mechanism instead of retrying the plugin path.
