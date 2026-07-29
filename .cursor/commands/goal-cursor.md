---
description: Manage the passive session goal for Cursor via the runtime-neutral goal manage CLI.
argument-hint: "set <objective> [--budget N] | show | history | doctor | health | clear | complete | pause [reason] | resume"
allowed-tools: Bash
---

# /goal-cursor

Cursor-native trigger for the cross-runtime passive session goal. Cursor has no OpenCode plugin tool surface, so this command drives the runtime-neutral manage CLI at `.opencode/hooks/goal/bin/goal.cjs`, which owns all goal state and mirrors the OpenCode `/goal-opencode` contract exactly — same actions, same `STATUS=/ACTION=` envelope, same `--budget` parsing and error codes.

Cursor's goal hook injects the active goal at `sessionStart` on its own; this command is how you set, inspect, and manage that goal.

---

## 1. CONTRACT

**Inputs:** `$ARGUMENTS` — `set <objective> [--budget N] | show | history | doctor | health | clear | complete | pause [reason] | resume`
**Outputs:** `STATUS=<OK|FAIL> ACTION=<set|clear|complete|pause|resume|history|doctor|health|show>` printed verbatim from the manage CLI.

Empty `$ARGUMENTS` shows the current goal. When `MK_GOAL_PLUGIN_DISABLED=1`, the CLI fails closed with `STATUS=FAIL ... code=PLUGIN_DISABLED`.

---

## 2. INSTRUCTIONS

Your FIRST and ONLY action is to run the manage CLI once with the user's arguments, then print its stdout verbatim. Do NOT read files, glob, grep, or explore the repository — `bin/goal.cjs` owns all goal state and session resolution.

Run exactly:

```bash
MK_GOAL_RUNTIME_LABEL=Cursor node .opencode/hooks/goal/bin/goal.cjs $ARGUMENTS
```

Then print the command's output exactly as returned.

---

## 3. HARD RULES

- Do not edit `.opencode/skills/.goal-state` directly; every mutation goes through the manage CLI.
- Do not run shell commands derived from the goal objective.
- Print the CLI envelope unchanged.
