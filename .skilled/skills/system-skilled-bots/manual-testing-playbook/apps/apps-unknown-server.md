---
title: "BOT-052 -- An unknown app name is refused by name and the checker fails on it"
description: "This scenario proves that a declared name which is not a `manual_call_templates[].name` is refused `apps-unknown-server` with every unknown name in the detail, that the checker reports it as a hard invariant with one `FAIL:` line and exit 1, that a non-list or an empty-string entry is refused `apps-invalid`, and that a run with no worktree declaring apps is refused `apps-unenforceable`."
version: 1.0.0.0
---

# BOT-052 -- An unknown app name is refused by name and the checker fails on it

This document is the execution contract for `BOT-052`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator writes a bot that names two servers the repository config does not hold and runs it. The refusal names both. The operator runs the checker, which reports the same problem as a hard invariant with one `FAIL:` line and exit 1. Two more bots carry a malformed `apps` value and are refused `apps-invalid`. A bot that declares apps while running shared is refused `apps-unenforceable`.

### Why This Matters

A name the config does not hold is a typo the operator will not find by reading their own file, because the file looks right to them. Naming every unknown name in one refusal saves a round trip per typo. The checker matters because the refusal only fires when the bot runs, and a bot on a weekly cron would carry the typo for a week.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the unknown-name refusal, the checker invariant, the two malformed values and the shared-run refusal.
- Real user request: `I typed the server names wrong. Show me every name you cannot find, and show me the checker catches it before the bot runs.`
- Prompt: `I typed the server names wrong. Show me every name you cannot find, and show me the checker catches it before the bot runs.`
- Expected execution process: build the world with a two-template config and four bots, run the bot with two unknown names, run the checker, run the two malformed bots, then run the shared bot that declares apps.
- Expected signals: the first run exits 4 with both unknown names in the detail, the checker prints one `FAIL:` line naming `apps-unknown-server` and exits 1, both malformed bots exit 4 with `apps-invalid`, and the shared bot exits 4 with `apps-unenforceable`.
- Desired user-visible outcome: the operator sees every typo at once and sees the checker catch it without a run.
- Pass/fail: PASS if both names appear in the refusal, the checker exits 1 with one `FAIL:` line, both malformed values are refused and the shared run is refused. FAIL if one name is reported, the checker exits 0, a malformed value runs or the shared run dispatches.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I typed the server names wrong. Show me every name you cannot find, and show me the checker catches it before the bot runs.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. Every bot here is refused before dispatch, so no executor starts at all.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with a two-template config and four bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf '{"version": "1.0", "manual_call_templates": [{"name": "notes", "call_template_type": "cli"}, {"name": "search", "call_template_type": "http"}]}\n' > "$W/checkout/.utcp_config.json"
printf -- '---\nid: pb-typo\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\napps: [notes, notse, serach]\n---\nUse the servers.\n' > "$W/checkout/bots/pb-typo/BOT.md"
printf -- '---\nid: pb-scalar\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\napps: notes\n---\nUse the servers.\n' > "$W/checkout/bots/pb-scalar/BOT.md"
printf -- '---\nid: pb-blank\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\napps: [notes, ""]\n---\nUse the servers.\n' > "$W/checkout/bots/pb-blank/BOT.md"
printf -- '---\nid: pb-shared\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\napps: [notes]\n---\nUse the servers.\n' > "$W/checkout/bots/pb-shared/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "four bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 2. Turn 1: run the bot with two unknown names.
pbots run pb-typo; echo "exit=$?"
# 3. Turn 2: run the checker, which reports the same problem without a run.
pbots check; echo "exit=$?"
pbots check | grep -c '^FAIL:'
# 4. Turn 3: run the bot whose apps is a scalar.
pbots run pb-scalar; echo "exit=$?"
# 5. Turn 4: run the bot whose apps holds an empty string.
pbots run pb-blank; echo "exit=$?"
# 6. Turn 5: run the shared bot that declares apps.
pbots run pb-shared; echo "exit=$?"
# 7. Turn 6: no run record was written for any of the four.
ls "$W"/state/*/records 2>&1
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- both unknown names are reported

- Expected: `bots: apps-unknown-server` and `exit=4`, with the detail naming both `notse` and `serach`.

### Turn 2 -- the checker fails on the same problem

- Expected: `exit=1` and one `FAIL:` line naming `apps-unknown-server`.
- Expected: `grep -c '^FAIL:'` prints `1`.

### Turn 3 -- a scalar is refused

- Expected: `bots: apps-invalid` and `exit=4`.

### Turn 4 -- an empty string entry is refused

- Expected: `bots: apps-invalid` and `exit=4`.

### Turn 5 -- a shared run declaring apps is refused

- Expected: `bots: apps-unenforceable` and `exit=4`.

### Turn 6 -- nothing was dispatched

- Expected: `ls` reporting no such file, because every bot was refused before dispatch.

### Expected

- Both unknown names in one refusal with exit 4.
- One `FAIL:` line and exit 1 from the checker.
- `apps-invalid` on the scalar and on the empty string.
- `apps-unenforceable` on the shared run.
- No run record for any of the four.

### Evidence

The unknown-name refusal with its exit, the checker output with its exit and its `FAIL:` count, both `apps-invalid` refusals, the `apps-unenforceable` refusal and the empty records listing.

### Pass / Fail

- **Pass**: both names appear in the refusal, the checker exits 1 with one `FAIL:` line, both malformed values are refused and the shared run is refused.
- **Fail**: one name is reported, the checker exits 0, a malformed value runs, the shared run dispatches or a record is written.
- **Skip**: only when `node` or `git` is unavailable, or when the `check` verb is missing from the CLI's verb table, naming the missing verb and phase 007 as the blocker.

### Failure Triage

1. The refusal names one unknown name: the detail stops at the first. Read the check and collect every unknown name.
2. The refusal exits 0: the check is a warning. Read the refusal and make it exit 4.
3. The checker exits 0: the invariant is not registered. Read the checker's invariant list and add `apps-unknown-server`.
4. The checker prints two `FAIL:` lines: the invariant reports once per bot. Read the report and print one line per invariant.
5. `apps: notes` runs: the list check is missing. Read the parser and refuse a non-list.
6. `apps: [notes, ""]` runs: the empty-string check is missing. Read the parser and refuse an empty entry.
7. The shared run dispatches: the enforceability check is missing. Read the isolation branch and refuse `apps-unenforceable`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `apps/apps-unknown-server.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the run and check verbs |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Parses `apps` and refuses `apps-invalid` |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/utcp.ts` | Resolves the names against the repository config |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/checker.ts` | Reports `apps-unknown-server` as a hard invariant |

The unknown-name refusal is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:162]. The checker invariant is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:166]. The two dispatch refusals are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:172].

---

## 5. SOURCE METADATA

- Group: Apps
- Playbook ID: BOT-052
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `apps/apps-unknown-server.md`
