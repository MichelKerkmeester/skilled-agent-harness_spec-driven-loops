---
title: "BOT-051 -- A bot's apps filter the run's utcp config and reach the child"
description: "This scenario proves that `apps:` parses into `Posture.apps`, that every run writes `<runFolder>/utcp.json` holding the repository config with `manual_call_templates` filtered to the honored names, that the run record carries `posture.apps`, and that the child environment carries `UTCP_CONFIG_FILE` naming that file."
version: 1.0.0.0
---

# BOT-051 -- A bot's apps filter the run's utcp config and reach the child

This document is the execution contract for `BOT-051`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator writes a repository config naming three manual call templates and two bots, one declaring two of the names and one declaring none. Each run writes a filtered config into its own run folder. The record carries the honored names, and the child's environment names the filtered file. The bot that declares none gets an empty list rather than the whole config.

### Why This Matters

A bot that can call every server in the repository can call the one that sends mail, and the operator never said it could. The filter is the seam that keeps a bot to the servers it named. The environment variable matters because a child that reads the repository config rather than the filtered copy has the whole list back, so the filter has to travel with the run.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the parse, the filtered file, the record field and the environment variable.
- Real user request: `Show me my bot only gets the two servers it asked for, and show me the file it actually reads.`
- Prompt: `Show me my bot only gets the two servers it asked for, and show me the file it actually reads.`
- Expected execution process: build the world with a three-template config and two bots, run each, read the filtered config, read the record and read the child's environment from the receipt.
- Expected signals: the first run's filtered config holds two templates, its record carries the two names and its environment names the filtered path, and the second run's filtered config holds none and its record carries an empty list.
- Desired user-visible outcome: the operator sees each bot handed exactly the servers it named.
- Pass/fail: PASS if the filter holds the honored names, the record agrees and the environment names the filtered file. FAIL if the filtered config holds every template, the record disagrees or the environment names the repository config.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me my bot only gets the two servers it asked for, and show me the file it actually reads.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub writes the environment it received to `$HOME/stub-receipts/<run id>.json`, which is how `UTCP_CONFIG_FILE` is read without a model.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with a three-template config and two bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-two" "$W/checkout/bots/pb-none" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf '{"version": "1.0", "manual_call_templates": [{"name": "notes", "call_template_type": "cli"}, {"name": "search", "call_template_type": "http"}, {"name": "mailer", "call_template_type": "http"}]}\n' > "$W/checkout/.utcp_config.json"
printf -- '---\nid: pb-two\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\napps: [notes, search]\n---\nUse the notes and search servers.\n' > "$W/checkout/bots/pb-two/BOT.md"
printf -- '---\nid: pb-none\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: worktree\ndelivery: local-only\n---\nUse no servers.\n' > "$W/checkout/bots/pb-none/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "two bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
apps() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,JSON.stringify(r.posture&&r.posture.apps??null),String(r.evidence.runFolder)].join(" | "))}' "$W"/state/*/records; }
# 2. Turn 1: run the bot that declares two servers.
pbots run pb-two; echo "exit=$?"
apps
# 3. Turn 2: read the filtered config the run wrote.
FOLDER="$(apps | head -1 | sed 's/.* | //')" && echo "folder: $FOLDER"
cat "$FOLDER/utcp.json"
# 4. Turn 3: read the environment the child received.
"$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log(f+" UTCP_CONFIG_FILE="+String(r.env&&r.env.UTCP_CONFIG_FILE))}' "$W/acct/stub-receipts"
# 5. Turn 4: run the bot that declares none.
pbots run pb-none; echo "exit=$?"
apps
# 6. Turn 5: read the second filtered config, which holds no template.
FOLDER2="$(apps | tail -1 | sed 's/.* | //')" && echo "folder: $FOLDER2"
cat "$FOLDER2/utcp.json"
# 7. Turn 6: the worktree copy is the file the child reads.
find "$W" -name '.utcp_config.json' -newer "$W/checkout/.utcp_config.json" | sort
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots apps
```

### Turn 1 -- the record carries the two names

- Expected: `bots: pb-two run <run id> completed` and `exit=0`.
- Expected: one record line whose `posture.apps` reads `["notes","search"]` and whose run folder path is printed.

### Turn 2 -- the filtered config holds two templates

- Expected: a JSON object whose `manual_call_templates` array holds two entries, named `notes` and `search`, and no `mailer`.
- Expected: the object keeps the repository config's top-level keys.

### Turn 3 -- the child is told which file to read

- Expected: one receipt line whose `UTCP_CONFIG_FILE` is the absolute path of the run's `utcp.json`, not the repository config.

### Turn 4 -- a bot that declares none gets an empty list

- Expected: `exit=0` and a record line whose `posture.apps` reads `[]`.

### Turn 5 -- the second filtered config holds no template

- Expected: a JSON object whose `manual_call_templates` array is empty.

### Turn 6 -- the worktree copy exists

- Expected: at least one `.utcp_config.json` path under the world, newer than the repository config, inside the run's worktree.

### Expected

- `["notes","search"]` on the first record and `[]` on the second.
- Two templates in the first filtered config and none in the second.
- `UTCP_CONFIG_FILE` naming the run's own file.
- A worktree copy newer than the repository config.

### Evidence

Both run lines with their exits, both record lines, both filtered configs, the receipt line and the worktree copy path.

### Pass / Fail

- **Pass**: the filter holds the honored names, the record agrees and the environment names the filtered file.
- **Fail**: the filtered config holds every template, the record disagrees, the environment names the repository config or no worktree copy exists.
- **Skip**: only when `node` or `git` is unavailable, or when the `apps` key is missing from the definition parser, naming the missing key and phase 007 as the blocker.

### Failure Triage

1. `posture.apps` reads `null` for a bot that declares two: the parser does not read the key. Read the definition parser.
2. The filtered config holds three templates: the filter is missing. Read the writer and filter on the honored names.
3. The filtered config holds no top-level keys: the copy drops them. Read the writer and spread the repository config first.
4. `UTCP_CONFIG_FILE` names the repository config: the environment key is missing or points at the wrong path. Read the dispatch environment and the one key the runner passes.
5. The child reads the repository config anyway: the worktree copy is missing. Read the worktree branch of the writer.
6. `posture.apps` reads `[]` for a bot that declares two: the record reads the wrong field. Read the record builder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `apps/apps-filter-utcp-config.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Parses `apps` into `Posture.apps` |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/utcp.ts` | Writes the filtered config and the worktree copy |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Passes `UTCP_CONFIG_FILE` to the child |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | Writes the environment it received to a receipt |

The parse is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:161]. The filtered file is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:163]. The record field is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:164]. The environment key is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/007-per-bot-apps/spec.md:165].

---

## 5. SOURCE METADATA

- Group: Apps
- Playbook ID: BOT-051
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `apps/apps-filter-utcp-config.md`
