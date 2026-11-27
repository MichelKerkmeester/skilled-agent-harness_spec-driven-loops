---
title: "Design: the fixtures every scenario builds"
description: "The throwaway world skeleton, the stub executor directives, the three shell helpers, the BOT.md fixtures per scenario group, and the literal verdict, results and failure fixtures a builder copies."
trigger_phrases:
  - "throwaway world fixture"
  - "stub executor directives"
  - "verdict csv fixture"
  - "bot definition fixture"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# Fixtures

Every scenario builds the same world and uses the same three helpers. This file holds the literal text a builder copies, so no scenario invents its own skeleton. The record shapes are in `scenario-contract.md`, and the refusal names are in `refusal-catalogue.md`.

---

## 1. THE WORLD SKELETON

One `mktemp -d` folder holds a checkout, an account, a state root and a skilled tree. The block's first step builds it, its second step commits it and defines the helpers, and its last step removes it.

```bash
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-<id>" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-<id>\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\n<the body>\n' > "$W/checkout/bots/pb-<id>/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "bot world"
```

| Node | Mode | Why it is there |
|------|------|-----------------|
| `$W/checkout` | 0700 | the repository the bot is bound to, with its own git history |
| `$W/checkout/bots/config.json` | umask | the identity and the state root, so no scenario reads the operator's |
| `$W/acct` | 0700 | `HOME`, so the stub receipts land inside the world |
| `$W/state` | 0700 | the state root, so no scenario touches a real bot's records |
| `$W/skilled` | 0700 | the skilled tree, with the gitignored `.state` folder the run root lives under |

The identity is `local/bots-playbook` in every scenario, and every bot id starts with `pb-`. A scenario that needs a second bot adds a second folder under `$W/checkout/bots/` and never a second world.

---

## 2. THE THREE HELPERS

```bash
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,String(r.exit.class),JSON.stringify(r.delivery),String(r.evidence.worktreePath),JSON.stringify(r.evidence.worktree??null)].join(" | "))}' "$W"/state/*/records; }
prompt() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log(r.prompt)}' "$W/acct/stub-receipts"; }
```

| Helper | Prints | Used by |
|--------|--------|---------|
| `pbots <verb> ...` | the verb's own output, with `HOME`, `PATH`, `--repo` and `--skilled-tree` bound to the world | every scenario |
| `records` | one line per run record: run id, bot id, exit reason, exit class, delivery, worktree path, worktree evidence | the scenarios that read a record |
| `prompt` | the exact prompt the child received, from the stub receipt | the scenarios that prove a prompt block |

A scenario that needs a fourth helper defines it in the same step and unsets it in the last step.

---

## 3. THE STUB EXECUTOR

The shipped stub stands in for every runtime, so no scenario calls a model. It acts on `STUB:` lines in the prompt and leaves one receipt per run under `$HOME/stub-receipts/<run id>.json`.

| Directive | Effect | Scenario |
|-----------|--------|----------|
| `STUB:decide=<question>` | prints `[NEEDS-DECISION] <question>` | BOT-028, BOT-029, BOT-030, BOT-033, BOT-034, BOT-042, BOT-044 |
| `STUB:option=<choice>` | prints one `[OPTION] <choice>` line per directive | BOT-028, BOT-030, BOT-033, BOT-044 |
| `STUB:exit=<code>` | exits with that code, so the run fails | BOT-039 |
| `STUB:sleep=<seconds>` | sleeps before printing, so a timeout can be proved | not used here |
| `STUB:park-edit=<file>` | edits the working folder and asks, then requires the edit on resume | not used here |

A scenario that needs a line the stub cannot print writes its own executor into `$W/bin` and puts that folder first on `PATH`. Two scenarios do: BOT-031 prints a `[REMEMBER]` line, and BOT-055 prints a stored value. Both scripts are three lines and both are written by the scenario itself, so neither imposes a fixture on another phase.

---

## 4. THE BOT DEFINITION FIXTURES

| Fixture | Body | Scenario |
|---------|------|----------|
| A plain bot | `Prepare the release notes.` | BOT-026, BOT-027, BOT-040, BOT-041, BOT-042, BOT-046, BOT-047 |
| A bot that asks | `Prepare the release notes.` then `STUB:decide=Ship the release notes now?` and two `STUB:option=` lines | BOT-028, BOT-029, BOT-030, BOT-033, BOT-034, BOT-044 |
| A bot that fails | `Prepare the release notes.` then `STUB:exit=1` | BOT-039 |
| A bot with a routine | a `routine` block with `what`, `starts`, `does`, `until` and `until_check` | BOT-035, BOT-036, BOT-037, BOT-038 |
| A bot with a memory file | a plain bot plus a `memory/pb-<id>.md` file | BOT-049, BOT-050 |
| A bot with apps | a plain bot plus `apps: [<server>]` | BOT-051, BOT-052 |
| A bot with a secret | a plain bot plus `secrets: [demo]` | BOT-053, BOT-054, BOT-055 |
| A bot with skills | a plain bot plus `skills: [<name>]` | BOT-056, BOT-057 |
| A bot with a channel | a plain bot plus a `channels/config.json` entry | BOT-058 |

The routine block's literal form is phase 002's, and the `apps`, `secrets` and `skills` keys are phases 007, 008 and 009's. A scenario copies the form from the phase spec it cites and never from this table, because this table names the fixture and the phase owns the grammar.

---

## 5. THE VERDICT CSV

The operator writes one file per execution pass, then merges them. The header is the recorder's.

```csv
scenario_id,runtime,verdict,reason,evidence
BOT-026,,PASS,one human and one bot message appended and one run dispatched,specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-026.txt
BOT-027,,SKIP,the chat verb is absent from the CLI verb table so the block cannot route a message,specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-027.txt
```

A `PASS` may leave the reason empty. A `FAIL` and a `SKIP` may not.

---

## 6. THE RECORDED `results.csv`

The recorder writes this file. The shape below is what it produces, and no hand edit is allowed.

```csv
# recorded by record-playbook-run.cjs from specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/results.csv
scenario_id,runtime,verdict,reason,evidence
BOT-026,,SKIP,the chat verb is absent from the CLI verb table so the block cannot append a message,specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-026.txt
```

The verdict is the third column. A reader that counts rows reads the first column, and a reader that counts verdicts reads the third.

---

## 7. THE FAILURE FILE

```markdown
# Filed product failures

One row per `FAIL` that is a product failure rather than a scenario defect. Five fields, all required.

| Scenario | Phase | Requirement | Observed line | Evidence |
|----------|-------|-------------|---------------|----------|
| BOT-050 | 005-memory | REQ-003 | `bots: memory-full: <path> (59 entries, 3590 bytes), free a line with bots remember --forget <entry-id>` with `exit=4` at the 60th append | specs/system-skilled-bots/003-openbot-parity-build/012-manual-testing-scenarios/scratch/transcripts/BOT-050.txt |
```

A file with no row says so in one sentence, so a reader knows the run produced no product failure rather than that the file was forgotten.

---

## 8. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| One world skeleton for all 33 scenarios | A second skeleton is a second place to fix a path. The differences between scenarios are the bot definition and the commands, never the world |
| The identity is `local/bots-playbook` and every bot id starts with `pb-` | The existing corpus already uses both, so a reader who knows one scenario knows all of them, and no scenario can collide with a real bot |
| Two scenarios write their own executor | The shipped stub prints a decision marker and an exit code, and it prints neither a `[REMEMBER]` line nor a stored value. A scenario that needs one writes three lines rather than asking another phase to widen a shared fixture |
| The verdict CSV is merged from four passes | One pass over 33 scenarios is one long sitting. Four passes let the operator stop between groups, and the merge is a concatenation of rows with one header |
| The failure file states its own emptiness | A missing file and a file with no row read the same to a later reader, and only one of them means the run produced no product failure |
