---
title: "BOT-011 -- A bot left on the native runtime is refused before dispatch"
description: "This scenario validates bot authoring for `BOT-011`. It focuses on the template's default native runtime passing the checker and then being refused by the runner with exit 4."
version: 1.0.0.0
---

# BOT-011 -- A bot left on the native runtime is refused before dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-011`.

---

## 1. OVERVIEW

The template defaults to `runtime: {kind: native}`. The checker accepts that kind, but the runner's posture check refuses it, because a native child would inherit the full environment. This scenario shows both halves, so an author learns to pick a headless executor kind before the first run.

### Why This Matters

An author who trusts a clean check and then runs the bot gets a refusal. The refusal must be exit 4 with a named cause and a record, never a dispatch and never a crash.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-011` and confirm the expected signals without contradictory evidence.

- Objective: Prove a native-runtime bot passes the checker and is refused by `bots run` before any executor starts.
- Real user request: `I left the runtime on the template default. Run the bot and tell me what happens.`
- Prompt: `I left the runtime on the template default. Run the bot and tell me what happens.`
- Expected execution process: build the world with a native bot, run the checker, run the bot, read its record and confirm no executor ran, then remove the world.
- Expected signals: the checker exits 0 with `PASS: executor-bounds: bots/pb-native/BOT.md: runtime native within the executor's bounds`. The run exits 4 and prints `bots: pb-native refused before dispatch (posture-refused): executor-kind-native: a native child inherits the full environment`.
- Desired user-visible outcome: the operator learns the runtime kind must change before the bot can run.
- Pass/fail: PASS if the run exits 4 with that cause, one record exists and the stub never ran. FAIL if the run dispatches, exits anything but 4 or leaves no record.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I left the runtime on the template default. Run the bot and tell me what happens.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-native" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-native\ntrigger: {kind: manual}\nruntime: {kind: native}\nisolation: shared\ndelivery: local-only\n---\nSummarize the notes folder.\n' > "$W/checkout/bots/pb-native/BOT.md"
# 2. Commit the world (the run binds its result to HEAD) and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Check, run, then read what the run left.
"$NODE" "$REPO_ROOT/.skilled/skills/system-skilled-bots/scripts/bot-check.cjs" "$W/checkout"; echo "exit=$?"
pbots run pb-native; echo "exit=$?"
records
ls "$W/acct/stub-receipts" 2>&1
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Checker: `PASS: executor-bounds: bots/pb-native/BOT.md: runtime native within the executor's bounds` and `exit=0`.
- Run: `bots: pb-native refused before dispatch (posture-refused): executor-kind-native: a native child inherits the full environment` on stderr and `exit=4`.
- `records` prints one line for `pb-native`.
- `ls` of `stub-receipts` reports no such file or directory, because no executor started.

### Evidence

The checker output, the run line with `exit=4`, the `records` line and the `ls` result.

### Pass / Fail

- **Pass**: exit 4 with the `posture-refused` cause, one record and no stub receipt.
- **Fail**: the run dispatches, exits other than 4, prints no cause or leaves no record.
- **Skip**: only when node or git is unavailable, or the repository path itself contains an executor word, naming that blocker.

### Failure Triage

1. Exit 3 means the recursion guard fired. Read the warning above and check the shell's ancestry and the temp path.
2. A dispatch means the posture check let `native` through. Read `validatePosture` in `runtime/lib/posture.ts`.
3. No record means the refusal skipped `refusalRecord` in `runtime/lib/runner.ts`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `bot-authoring/native-runtime-refused.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/posture.ts` | Refuses the native kind before dispatch |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Writes the refusal record |
| `.skilled/bin/bots.cjs` | Maps a refusal to exit 4 |
| `.skilled/skills/system-skilled-bots/runtime/tests/posture.vitest.ts` | Automated posture coverage |

---

## 5. SOURCE METADATA

- Group: Bot Authoring
- Playbook ID: BOT-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `bot-authoring/native-runtime-refused.md`
