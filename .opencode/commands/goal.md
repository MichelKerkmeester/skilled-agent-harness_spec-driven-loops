---
description: Manage the passive session goal.
argument-hint: "set <objective> | show | clear | complete | pause [reason]"
allowed-tools: mk_goal, mk_goal_status
---

# /goal

Thin root router for the session goal plugin.

## 0. ARGUMENT RESOLUTION

Resolve routing inputs from the command arguments `$ARGUMENTS`:

- `QUERY` = the full `$ARGUMENTS` string, trimmed.
- `ARGS_PRESENT` = true when `QUERY` is non-empty.
- `FIRST` = the first whitespace-delimited token of `QUERY`, lowercased.
- `REST` = `QUERY` with the leading `FIRST` token removed, trimmed.

Bind routing to these resolved `ARGS_PRESENT`, `QUERY`, `FIRST`, and `REST` values.

## 1. ROUTER CONTRACT

This command is state-free. It never reads or writes `.opencode/skills/.goal-state` directly.

- Empty arguments or `show` route to `mk_goal_status`.
- `set <objective>` routes to `mk_goal` with `action: "set"` and `objective: REST`.
- Bare text routes to `mk_goal` with `action: "set"` and `objective: QUERY`.
- `clear`, `complete`, and `pause [reason]` route to `mk_goal`.
- Unsupported verbs emit `STATUS=FAIL ERROR="unknown action: <verb>"`.

## 2. EXECUTION ORDER

Your FIRST and ONLY action is the single tool call selected below. Do NOT read files, glob, grep, or explore the repository — the `mk_goal` / `mk_goal_status` tools own all goal state and session resolution. Make the call immediately, then print its result verbatim.

1. If `ARGS_PRESENT=false`, call `mk_goal_status({})` and print its result exactly.
2. If `FIRST` is `show`, call `mk_goal_status({})` and print its result exactly.
3. If `FIRST` is `set`, require non-empty `REST`, then call `mk_goal({ action: "set", objective: REST })`.
4. If `FIRST` is `clear`, call `mk_goal({ action: "clear" })`.
5. If `FIRST` is `complete`, call `mk_goal({ action: "complete" })`.
6. If `FIRST` is `pause`, call `mk_goal({ action: "pause", reason: REST })`.
7. For any other non-empty `QUERY`, call `mk_goal({ action: "set", objective: QUERY })`.

Every mutation tool response already includes the state after the mutation. Print the tool result unchanged so callers receive a terse envelope:

```text
STATUS=OK ACTION=<set|clear|complete|pause|show>
...
```

On router-level failure, print:

```text
STATUS=FAIL ERROR="<message>"
```

## 3. HARD RULES

- Do not infer a session id in this command; plugin tool context owns it.
- Do not edit the goal state file from command markdown.
- Do not run shell commands derived from the objective.
- Reads go through `mk_goal_status`; mutations go through `mk_goal`.
