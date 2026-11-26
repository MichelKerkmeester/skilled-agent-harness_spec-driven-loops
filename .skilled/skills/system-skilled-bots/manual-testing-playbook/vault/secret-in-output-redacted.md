---
title: "BOT-055 -- A secret printed by the child is redacted and the run is not delivered"
description: "This scenario proves that every stored value joins the known-secret map, that a child which prints its value has the line redacted in `stdout.log`, that the run record carries `secret-in-output` and the run is not delivered, and that a body holding the value is refused `body-secret` before dispatch."
version: 1.0.0.0
---

# BOT-055 -- A secret printed by the child is redacted and the run is not delivered

This document is the execution contract for `BOT-055`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator stores a value and points a bot at an executor that prints it. The run finishes, the log line is redacted in place, the record carries `secret-in-output` and the delivery is withheld. The operator then writes a bot whose body holds the same value and the run is refused before dispatch. The conversation and the delivery hold no copy of the value.

### Why This Matters

A child that prints its environment is the most common way a secret leaves a machine, and it happens by accident. The scan after the run is the last place the value can be caught before it reaches a delivery target. The body refusal matters because a value pasted into a `BOT.md` is committed to the repository, where it stays after the store is emptied.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the known-secret map, the redaction, the record cause, the withheld delivery and the body refusal.
- Real user request: `My bot printed its token by accident. Show me the log is cleaned, the run is held, and a token in the bot file is refused.`
- Prompt: `My bot printed its token by accident. Show me the log is cleaned, the run is held, and a token in the bot file is refused.`
- Expected execution process: build the world with a printing bot and a bot whose body holds the value, store the value, run the printing bot, read its log and record, then run the second bot.
- Expected signals: the log line reads the redaction marker rather than the value, the record carries `secret-in-output`, the delivery is withheld, and the second run exits 4 with `body-secret`.
- Desired user-visible outcome: the operator sees the value gone from the log, the run held and the pasted value refused.
- Pass/fail: PASS if the log holds no value, the record carries the cause, the delivery is withheld and the body is refused. FAIL if the value survives in the log, the record carries no cause, the run is delivered or the body runs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot printed its token by accident. Show me the log is cleaned, the run is held, and a token in the bot file is refused.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** This scenario writes its own three-line executor at `$W/bin/codex`, ahead of the shipped stub on PATH, because the shipped stub never prints a secret. The stand-in reads the prompt from stdin, discards it and prints the value it was handed, so no model is called.

> **File store.** The scenario passes `--store file` so the value lands in a 0600 file under the throwaway state root rather than in the operator's keychain.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with a printing bot and a bot whose body holds the value.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-print" "$W/checkout/bots/pb-paste" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state" "$W/bin"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-print\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nsecrets: [PB_TOKEN]\n---\nPrint the token.\n' > "$W/checkout/bots/pb-print/BOT.md"
printf -- '---\nid: pb-paste\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nThe token is tok-9f2c41ab, use it.\n' > "$W/checkout/bots/pb-paste/BOT.md"
printf '#!/bin/sh\ncat > /dev/null\nprintf "token: %s\\n" "$SKILLED_BOT_SECRET_PB_TOKEN"\n' > "$W/bin/codex"
chmod +x "$W/bin/codex"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "two bots"
pbots() { HOME="$W/acct" PATH="$W/bin:$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
causes() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,JSON.stringify(r.causes??null),JSON.stringify(r.delivery)].join(" | "))}' "$W"/state/*/records; }
# 2. Turn 1: store the value the child will print.
printf 'tok-9f2c41ab\n' | pbots secret set PB_TOKEN --store file; echo "exit=$?"
# 3. Turn 2: run the bot whose child prints it.
pbots run pb-print; echo "exit=$?"
# 4. Turn 3: read the log, which must hold the marker rather than the value.
FOLDER="$(causes | head -1 | sed 's/.* | //')"
find "$W/state" -name 'stdout.log' | sort
grep -rn 'tok-9f2c41ab' "$W/state" | grep -v '/secrets/' | head -5
grep -rn 'redacted' "$W/state" | head -5
# 5. Turn 4: read the record's cause and its delivery.
causes
# 6. Turn 5: a body holding the value is refused before dispatch.
pbots run pb-paste; echo "exit=$?"
# 7. Turn 6: no delivery file holds the value.
find "$W" -name '*.md' -newer "$W/checkout/bots/pb-print/BOT.md" -exec grep -l 'tok-9f2c41ab' {} + 2>/dev/null | sort
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots causes
```

### Turn 1 -- the value is stored

- Expected: a line naming `PB_TOKEN` and its backend, then `exit=0`.

### Turn 2 -- the run finishes with the value printed

- Expected: a run line and an exit, and the child's output written to `stdout.log` under the run folder.

### Turn 3 -- the log holds the marker rather than the value

- Expected: at least one `stdout.log` path printed.
- Expected: the value search over the state root prints no line outside the `secrets` folder.
- Expected: the marker search prints the redacted line.

### Turn 4 -- the record carries the cause and withholds delivery

- Expected: one record line whose `causes` array holds `secret-in-output` and whose `delivery` reads a withheld state rather than a delivered one.

### Turn 5 -- a pasted value is refused before dispatch

- Expected: `bots: body-secret` and `exit=4`, with no receipt written for `pb-paste`.

### Turn 6 -- no delivery file holds the value

- Expected: no path printed.

### Expected

- `exit=0` on the store.
- A `stdout.log` holding the redaction marker and no value.
- `secret-in-output` on the record with the delivery withheld.
- `bots: body-secret` and `exit=4` on the pasted body.
- No delivery file holding the value.

### Evidence

The store line, the run line with its exit, the log path, both searches with their output, the record line, the body refusal with its exit and the delivery search.

### Pass / Fail

- **Pass**: the log holds no value, the record carries the cause, the delivery is withheld and the body is refused.
- **Fail**: the value survives in the log, the record carries no cause, the run is delivered or the body runs.
- **Skip**: only when `node` or `git` is unavailable, or when the `secret` verb is missing from the CLI's verb table, naming the missing verb and phase 008 as the blocker.

### Failure Triage

1. The log holds the value: the post-run scan is missing. Read the scan and confirm it runs after the child exits.
2. The scan runs but the line is unchanged: the known-secret map is empty. Read the map and confirm every stored value joins it.
3. The record carries no cause: the scan records nothing. Read the record write and add `secret-in-output`.
4. The run is delivered: the delivery runs before the scan. Read the order and move the scan first.
5. The pasted body runs: the literal check is missing from the definition read. Read the check and refuse `body-secret`.
6. The scan records two causes: the answer scan and the log scan both fire. Read both and keep one cause name.
7. A truncated log from a killed child is skipped: the scan reads whole lines only. Read the scan and confirm it reads the file as written.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `vault/secret-in-output-redacted.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` | Owns the known-secret map |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Scans `stdout.log` after the child exits |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Records `secret-in-output` |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Refuses a body holding a known value |

The known-secret map is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:159]. The one-pass matcher is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:163]. The post-run scan and its cause are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:164].

---

## 5. SOURCE METADATA

- Group: Vault
- Playbook ID: BOT-055
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `vault/secret-in-output-redacted.md`
