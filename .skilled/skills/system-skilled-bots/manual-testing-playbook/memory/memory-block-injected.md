---
title: "BOT-049 -- The memory block reaches the prompt and a false flag keeps it out"
description: "This scenario proves that `buildBotPrompt` inserts the shared file's block and then the bot's file's block at the memory position, each inside one `<memory file=\"<path>\">` block, that a bot with `memory: false` receives neither, that any other value is refused `memory-invalid`, and that a bot with no memory files receives a prompt carrying no memory block."
version: 1.0.0.0
---

# BOT-049 -- The memory block reaches the prompt and a false flag keeps it out

This document is the execution contract for `BOT-049`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator appends one shared fact and one bot fact, then runs the bot and reads the prompt the executor received. The prompt carries two memory blocks, the shared one first, each labelled with its file path. A second bot with `memory: false` receives neither block. A third bot with a value that is not a boolean is refused. A fourth bot with no memory files receives a prompt with no memory block at all.

### Why This Matters

A fact the operator recorded and the bot never sees is a fact they will record again, and a block that arrives in the wrong position is a block the bot reads as part of another section. The `memory: false` flag matters because a bot working on a sensitive repository must be able to run without its notes in the prompt, and the refusal of any other value matters because a string that reads as true in one place and false in another is a setting nobody can reason about.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the two blocks and their order, the false flag, the invalid value and the empty case.
- Real user request: `Show me my notes reaching my bot, then show me a bot that is told to ignore them.`
- Prompt: `Show me my notes reaching my bot, then show me a bot that is told to ignore them.`
- Expected execution process: build the world with four bots, append two facts, run the first bot and read its receipt, run the second and read its receipt, run the third, then run the fourth.
- Expected signals: the first prompt carries two `<memory file="...">` blocks with the shared one first, the second carries none, the third exits 4 with `memory-invalid`, and the fourth carries no memory block.
- Desired user-visible outcome: the operator sees their notes in one prompt, absent from another and refused on a third.
- Pass/fail: PASS if both blocks appear in order, the false flag removes them, the invalid value is refused and the empty case carries none. FAIL if a block is missing, the order is reversed, the false flag is ignored or the invalid value runs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me my notes reaching my bot, then show me a bot that is told to ignore them.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub writes the whole prompt it received to `$HOME/stub-receipts/<run id>.json`, which is how the block is read without a model.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

```bash
# 1. Build a throwaway world with four bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
for id in pb-ask pb-nomem pb-bad pb-empty; do
  mkdir -p "$W/checkout/bots/$id"
  printf -- '---\nid: %s\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nReport what you remember.\n' "$id" > "$W/checkout/bots/$id/BOT.md"
done
printf 'memory: false\n' >> "$W/checkout/bots/pb-nomem/BOT.md"
printf 'memory: "yes"\n' >> "$W/checkout/bots/pb-bad/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "four bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
blocks() { "$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));const m=String(r.prompt||"").match(/<memory file="[^"]*">/g)||[];console.log(f+" :: "+m.join(" "))}' "$W/acct/stub-receipts"; }
# 2. Turn 1: append one shared fact and one bot fact.
pbots remember "The release notes ship on Friday."; echo "exit=$?"
pbots remember "Prefer short paragraphs in the notes." --bot pb-ask; echo "exit=$?"
# 3. Turn 2: run the bot that reads both files.
pbots run pb-ask; echo "exit=$?"
blocks
# 4. Turn 3: read the two blocks in the order they appear.
"$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));const i=String(r.prompt||"").indexOf("<memory file=");console.log(f+" :: index "+i)}' "$W/acct/stub-receipts"
# 5. Turn 4: run the bot told to ignore memory.
pbots run pb-nomem; echo "exit=$?"
blocks
# 6. Turn 5: run the bot with a value that is not a boolean.
pbots run pb-bad; echo "exit=$?"
# 7. Turn 6: run the bot with no memory files of its own.
pbots run pb-empty; echo "exit=$?"
blocks
# 8. Turn 7: the empty bot's prompt carries no memory block.
"$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log(f+" :: memory="+String(r.prompt||"").includes("<memory file="))}' "$W/acct/stub-receipts"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots blocks
```

### Turn 1 -- both facts are recorded

- Expected: two append lines with `exit=0`, the first naming the shared file and the second naming `$W/state/*/memory/pb-ask.md`.

### Turn 2 -- the prompt carries two blocks

- Expected: `exit=0` and one `blocks` line naming two `<memory file="...">` tags, the shared path first and the bot path second.

### Turn 3 -- the block sits at the memory position

- Expected: one line per receipt naming the character index where the first `<memory file=` appears, and that index is greater than zero, so the block is inside the prompt rather than at its head.

### Turn 4 -- the false flag keeps both blocks out

- Expected: `exit=0` and a `blocks` line for `pb-nomem` naming no tag.

### Turn 5 -- a non-boolean value is refused

- Expected: `bots: memory-invalid` and `exit=4`, with no receipt written for `pb-bad`.

### Turn 6 -- a bot with no files of its own still reads the shared one

- Expected: `exit=0` and a `blocks` line for `pb-empty` naming one tag, the shared path.

### Turn 7 -- the empty case carries no block

- Expected: `memory=false` for `pb-nomem` and `pb-bad`, and `memory=true` for `pb-ask` and `pb-empty`.

### Expected

- Two blocks on the first prompt, shared first.
- No block on the `memory: false` prompt.
- `bots: memory-invalid` and `exit=4` on the string value.
- One block on the bot with no file of its own.
- A prompt with no block when both files are empty.

### Evidence

Both append lines, the `blocks` output for each run, the three index lines, the refusal line with its exit and the four `memory=` lines.

### Pass / Fail

- **Pass**: both blocks appear in order, the false flag removes them, the invalid value is refused and the empty case carries none.
- **Fail**: a block is missing, the order is reversed, the false flag is ignored, the invalid value runs or the block sits outside the prompt.
- **Skip**: only when `node` or `git` is unavailable, or when the `memory` key is missing from the definition parser, naming the missing key and phase 005 as the blocker.

### Failure Triage

1. No `<memory file=` in the prompt: the block is missing from the prompt builder. Read the memory position in `specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md` section 1.
2. One block rather than two: the bot file is not read. Read the two-file branch.
3. The bot block comes first: the order is reversed. Read the insert order and put the shared file first.
4. `pb-nomem` carries a block: the flag is not read. Read the definition parser and the prompt builder.
5. `pb-bad` runs: the boolean check is missing. Read the parser and add `memory-invalid`.
6. The block sits at index zero: it is prepended rather than inserted at the memory position. Read the insertion and the nine-block order.
7. A block appears for an empty file: the empty check is missing. Read the renderer and omit an empty file.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `memory/memory-block-injected.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/prompt.ts` | Inserts the two blocks at the memory position |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/memory.ts` | Renders one file's block |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Parses the `memory` boolean |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | Writes the prompt it received to a receipt |

The block and its position are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:151]. The boolean and its refusal are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:160]. The prompt bound is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:165].

---

## 5. SOURCE METADATA

- Group: Memory
- Playbook ID: BOT-049
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory/memory-block-injected.md`
