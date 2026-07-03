---
description: Manage the passive session goal.
argument-hint: "set <objective> [--budget N] | show | history | doctor | health | clear | complete | pause [reason] | resume"
allowed-tools: mk_goal, mk_goal_status
---

# /goal

Thin root router for the session goal plugin.

---

## 1. PURPOSE

Manage the passive session goal through the `mk-goal` plugin. `/goal` is a state-free router: it resolves the requested action from `$ARGUMENTS` and dispatches to the `mk_goal` / `mk_goal_status` plugin tools, which own all goal state and session resolution.

---

## 2. ARGUMENT ROUTING

Resolve routing inputs from the command arguments `$ARGUMENTS`:

- `QUERY` = the full `$ARGUMENTS` string, trimmed.
- `ARGS_PRESENT` = true when `QUERY` is non-empty.
- `FIRST` = the first whitespace-delimited token of `QUERY`, lowercased.
- `REST` = `QUERY` with the leading `FIRST` token removed, trimmed.

Bind routing to these resolved `ARGS_PRESENT`, `QUERY`, `FIRST`, and `REST` values.

---

## 3. CONTRACT

**Inputs:** `$ARGUMENTS` — `set <objective> [--budget N] | show | history | doctor | health | clear | complete | pause [reason] | resume`
**Outputs:** `STATUS=<OK|FAIL> ACTION=<set|clear|complete|pause|resume|history|doctor|health|show>`

This command is state-free. It never reads or writes `.opencode/skills/.goal-state` directly.

- Empty arguments or `show` route to `mk_goal_status`.
- `set <objective> --budget N` routes to `mk_goal` with `action: "set"`, `objective` with the budget suffix removed, and `tokenBudget: N`.
- `set <objective>` routes to `mk_goal` with `action: "set"` and `objective: REST`.
- Bare text routes to `mk_goal` with `action: "set"` and `objective: QUERY`.
- `history`, `doctor`, and `health` route to read-only `mk_goal` actions. `history` returns `archive_count` and `archive_N_*` fields. `doctor`/`health` return `active_state_file_count`, `archive_file_count`, log byte sizes, `last_sweep_at`, and `orphan_candidate_count`.
- `clear`, `complete`, `resume`, and `pause [reason]` route to `mk_goal`.
- Any other non-empty `QUERY` is treated as bare goal text and routes to `mk_goal` with `action: "set"` and `objective: QUERY`.

Status output reports continuation budget fields affected by `MK_GOAL_MAX_AUTO_TURNS` and `MK_GOAL_MAX_WALL_MS`: `remaining_auto_turns`, `remaining_wall_ms`, and `provider_retry_after_ms`.

Successful `set` responses include `mutation=created`, `mutation=refreshed`, or `mutation=replaced` immediately after the status line. `created` means no prior goal existed, `refreshed` means the active goal objective was unchanged, and `replaced` means a different objective or terminal prior goal produced a fresh goal record.

When `MK_GOAL_PLUGIN_DISABLED=1`, plugin tools fail closed. The command must print the tool result verbatim, including `STATUS=FAIL ACTION=<action> ERROR="..."` and `code=PLUGIN_DISABLED`.

---

## 4. INSTRUCTIONS

Your FIRST and ONLY action is the single tool call selected below. Do NOT read files, glob, grep, or explore the repository — the `mk_goal` / `mk_goal_status` tools own all goal state and session resolution. Make the call immediately, then print its result verbatim.

### Step 1: Dispatch the resolved action

1. If `ARGS_PRESENT=false`, call `mk_goal_status({})` and print its result exactly.
2. If `FIRST` is `show`, call `mk_goal_status({})` and print its result exactly.
3. If `FIRST` is `set`, parse an optional trailing `--budget N` from `REST`:
   - If present, `N` must be a positive base-10 integer (`1` or greater). If `N` is missing, non-numeric, zero, or negative, print `STATUS=FAIL ACTION=set ERROR="Token budget must be a positive integer"` and `code=INVALID_TOKEN_BUDGET` without calling a tool.
   - Remove the trailing `--budget N` from the objective. If the remaining objective is empty, print `STATUS=FAIL ACTION=set ERROR="Objective is required"` and `code=INVALID_OBJECTIVE` without calling a tool.
   - Call `mk_goal({ action: "set", objective: <objective>, tokenBudget: N })` when budget is present, otherwise call `mk_goal({ action: "set", objective: REST })`.
4. If `FIRST` is `history`, call `mk_goal({ action: "history" })`.
5. If `FIRST` is `doctor`, call `mk_goal({ action: "doctor" })`.
6. If `FIRST` is `health`, call `mk_goal({ action: "health" })`.
7. If `FIRST` is `clear`, call `mk_goal({ action: "clear" })`.
8. If `FIRST` is `complete`, call `mk_goal({ action: "complete" })`.
9. If `FIRST` is `pause`, call `mk_goal({ action: "pause", reason: REST })`.
10. If `FIRST` is `resume`, call `mk_goal({ action: "resume" })`.
11. For any other non-empty `QUERY`, call `mk_goal({ action: "set", objective: QUERY })`.

### Step 2: Return status

Every mutation tool response already includes the state after the mutation. Print the tool result unchanged so callers receive a terse envelope:

```text
STATUS=OK ACTION=<set|clear|complete|pause|resume|history|doctor|health|show>
mutation=<created|refreshed|replaced>
...
```

On router-level failure, print:

```text
STATUS=FAIL ACTION=<set|clear|complete|pause|resume|history|doctor|health|show> ERROR="<message>"
code=<ERROR_CODE>
```

---

## 5. HARD RULES

- Do not infer a session id in this command; plugin tool context owns it.
- Do not edit the goal state file from command markdown.
- Do not run shell commands derived from the objective.
- Reads go through `mk_goal_status`; mutations go through `mk_goal`.
