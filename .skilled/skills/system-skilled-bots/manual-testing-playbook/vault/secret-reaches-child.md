---
title: "BOT-054 -- A named secret reaches the child environment and the record names it"
description: "This scenario proves that `secrets:` names one store entry, that the runner resolves the name before dispatch, that the value reaches the child environment only under `SKILLED_BOT_SECRET_<NAME>`, that `posture.secretsUsed` records the names and never the values, that a name the store does not hold is refused `secret-unknown` with exit 4, and that a name outside the grammar is refused `secret-name-invalid` at parse time."
version: 1.0.1.0
---

# BOT-054 -- A named secret reaches the child environment and the record names it

This document is the execution contract for `BOT-054`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator stores a value, writes a bot that names it, runs the bot and reads the environment the child received. The value is there under the prefixed key and nowhere else. The record names the secret and never its value. A bot naming a secret the store does not hold is refused before dispatch, and a bot naming something outside the grammar is refused when its definition is read.

### Why This Matters

A child started without the value it was promised fails in a way that looks like the service's fault, so the refusal has to arrive before dispatch rather than inside the run. The record matters because an audit that holds the value is a second copy of the secret, and the prefix matters because a child that reads the whole environment must not find the value under a name it did not ask for.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the resolution, the prefixed environment key, the record field and the two refusals.
- Real user request: `Give my bot its token, show me it arrived, and show me the record names the token without holding it.`
- Prompt: `Give my bot its token, show me it arrived, and show me the record names the token without holding it.`
- Expected execution process: build the world with three bots, store a value, run the bot that names it, read the receipt's environment and the record, run the bot naming an absent secret, then run the bot with a malformed name.
- Expected signals: the first run exits 0, the receipt carries `SKILLED_BOT_SECRET_PB_TOKEN` with the value, the record's `posture.secretsUsed` reads `["PB_TOKEN"]`, the absent name exits 4 with `secret-unknown` and the malformed name is refused `secret-name-invalid`.
- Desired user-visible outcome: the operator sees the value arrive, the record name it and two refusals that started no child.
- Pass/fail: PASS if the value arrives under the prefixed key, the record names it without the value, and both refusals fire. FAIL if the value is absent, the record holds the value, an absent name dispatches or a malformed name parses.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Give my bot its token, show me it arrived, and show me the record names the token without holding it.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub writes the environment it received to `$HOME/stub-receipts/<run id>.json`, which is how the prefixed key is read without a model.

> **File store.** The scenario passes `--store file` so the value lands in a 0600 file under the throwaway state root rather than in the operator's keychain.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with three bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-token\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nsecrets: [PB_TOKEN]\n---\nUse the token.\n' > "$W/checkout/bots/pb-token/BOT.md"
printf -- '---\nid: pb-absent\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nsecrets: [PB_ABSENT]\n---\nUse the token.\n' > "$W/checkout/bots/pb-absent/BOT.md"
printf -- '---\nid: pb-badname\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nsecrets: ["PB TOKEN"]\n---\nUse the token.\n' > "$W/checkout/bots/pb-badname/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "three bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
secrets() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,JSON.stringify(r.posture&&r.posture.secretsUsed??null)].join(" | "))}' "$W"/state/*/records; }
# 2. Turn 1: store the value.
printf 'tok-9f2c41ab\n' | pbots secret set PB_TOKEN --store file; echo "exit=$?"
# 3. Turn 2: run the bot that names it.
pbots run pb-token; echo "exit=$?"
# 4. Turn 3: read the environment the child received.
"$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));const k=Object.keys(r.env||{}).filter(x=>x.startsWith("SKILLED_BOT_SECRET_"));console.log(f+" :: "+k.map(x=>x+"="+r.env[x]).join(" "))}' "$W/acct/stub-receipts"
# 5. Turn 4: read the record, which names the secret and holds no value.
secrets
grep -c 'tok-9f2c41ab' "$W"/state/*/records/*.json
# 6. Turn 5: a name the store does not hold is refused before dispatch.
pbots run pb-absent; echo "exit=$?"
# 7. Turn 6: a name outside the grammar is refused at parse time.
pbots run pb-badname; echo "exit=$?"
pbots check | grep -c 'secret-name-invalid'
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots secrets
```

### Turn 1 -- the value is stored

- Expected: a line naming `PB_TOKEN` and its backend, then `exit=0`.

### Turn 2 -- the run completes

- Expected: `bots: pb-token run <run id> completed` and `exit=0`.

### Turn 3 -- the value arrives under the prefixed key

- Expected: one receipt line naming `SKILLED_BOT_SECRET_PB_TOKEN=tok-9f2c41ab` and no other `SKILLED_BOT_SECRET_` key.

### Turn 4 -- the record names the secret and holds no value

- Expected: one record line whose `posture.secretsUsed` reads `["PB_TOKEN"]`.
- Expected: `grep -c 'tok-9f2c41ab'` over the records prints `0`.

### Turn 5 -- an absent name is refused before dispatch

- Expected: `bots: pb-absent refused before dispatch (secret-unknown): PB_ABSENT is not stored, run bots secret set PB_ABSENT` and `exit=4`, with no receipt written for `pb-absent`.

### Turn 6 -- a malformed name is refused at parse time

- Expected: `bots: secret-name-invalid` and `exit=4` on the run, and `grep -c 'secret-name-invalid'` over the checker printing `1`.

### Expected

- `exit=0` on the store and on the run.
- One prefixed key in the child environment and no other.
- `["PB_TOKEN"]` on the record and no value anywhere in the records.
- `secret-unknown` with the detail `PB_ABSENT is not stored, run bots secret set PB_ABSENT` and `exit=4` on the absent name.
- `bots: secret-name-invalid` and one checker line on the malformed name.

### Evidence

The store line, the run line with its exit, the receipt environment line, the record line, the value count, both refusal lines with their exits and the checker count.

### Pass / Fail

- **Pass**: the value arrives under the prefixed key, the record names it without the value, and both refusals fire.
- **Fail**: the value is absent, a second prefixed key appears, the record holds the value, an absent name dispatches or a malformed name parses.
- **Skip**: only when `node` or `git` is unavailable, or when the `secrets` key is missing from the definition parser, naming the missing key and phase 008 as the blocker.

### Failure Triage

1. No `SKILLED_BOT_SECRET_` key: the runner does not pass the name. Read the dispatch environment and the one key it passes.
2. The key is present with an empty value: the store read failed silently. Read the resolution and confirm it refuses rather than passing an empty string.
3. A second prefixed key appears: the runner passes the whole store. Read the dispatch environment and pass one key per resolved name.
4. `posture.secretsUsed` reads `null`: the record does not fill it. Read the record builder and default to `[]`.
5. The record holds the value: the builder writes the value rather than the name. Read the field and write the name.
6. `pb-absent` dispatches: the resolution runs after dispatch. Read the order and move it before.
7. `PB TOKEN` parses: the name grammar is missing. Read the parser and refuse `secret-name-invalid`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `vault/secret-reaches-child.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` | Owns the store and the name grammar |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Resolves the name and passes the prefixed key |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Writes `posture.secretsUsed` |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | Writes the environment it received to a receipt |

The `secrets:` key is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:150]. The resolution and its refusal are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:151]. The prefixed key is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:152]. The record field is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:153].

---

## 5. SOURCE METADATA

- Group: Vault
- Playbook ID: BOT-054
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `vault/secret-reaches-child.md`
