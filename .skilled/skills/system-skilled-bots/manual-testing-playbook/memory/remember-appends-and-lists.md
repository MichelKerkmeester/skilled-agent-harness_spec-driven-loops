---
title: "BOT-048 -- Remember appends one line, lists it and forgets it by index"
description: "This scenario proves that `bots remember` appends one five-field line to the shared file and prints its 1-based index, that `--bot` appends to that bot's file, that `--list` prints every entry with its counts and `--json` prints the seven-key object, that `--forget` removes one entry and shifts the later indices down, and that an index naming no entry is refused `memory-entry-unknown` with exit 2."
version: 1.0.0.0
---

# BOT-048 -- Remember appends one line, lists it and forgets it by index

This document is the execution contract for `BOT-048`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator appends two facts, one to the shared file and one to a bot's own file. The list verb prints both with their index, type, date, actor, source and text, then the file path with its counts. The JSON form prints one object with seven keys. The operator forgets the first entry, the second shifts down to index one, and an index past the end is refused.

### Why This Matters

A memory file the operator cannot read back is a file they cannot correct, and an index that does not shift after a removal sends the next forget to the wrong line. The five-field form matters because a pipe in the text must not need an escape, so the reader splits on the first four delimiters and the text keeps whatever it holds.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the append, the two files, the list, the JSON object, the forget and the unknown index.
- Real user request: `Remember two things for me, show me the list, then forget the first one and show me the list again.`
- Prompt: `Remember two things for me, show me the list, then forget the first one and show me the list again.`
- Expected execution process: build the world, append a shared fact, append a bot fact, list both, read the JSON, forget index one, try an index past the end, then list again.
- Expected signals: each append prints its 1-based index, the list prints both entries and the file path with counts, the JSON object carries seven keys, the forget prints the removed entry, the unknown index exits 2 and the second list holds one entry at index one.
- Desired user-visible outcome: the operator sees both facts, removes one and sees the other renumbered.
- Pass/fail: PASS if both appends land in their own files, the list and JSON agree, the forget shifts the index and the unknown index exits 2. FAIL if an append lands in the wrong file, a field is missing, the index does not shift or the unknown index exits 0.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Remember two things for me, show me the list, then forget the first one and show me the list again.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **No model.** The remember verb writes a file and reads it back. No executor starts, so the shipped stub is only there to keep the helper uniform.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

```bash
# 1. Build a throwaway world with one bot.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-ask" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-ask\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\n---\nAsk a question.\n' > "$W/checkout/bots/pb-ask/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "one bot"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 2. Turn 1: append a shared fact.
pbots remember "The release notes ship on Friday."; echo "exit=$?"
# 3. Turn 2: append a bot fact with its own type.
pbots remember "Prefer short paragraphs in the notes." --bot pb-ask --type feedback; echo "exit=$?"
# 4. Turn 3: list both files.
pbots remember --list; echo "exit=$?"
pbots remember --list --bot pb-ask; echo "exit=$?"
# 5. Turn 4: read the JSON object and its keys.
pbots remember --list --json; echo "exit=$?"
pbots remember --list --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);console.log("keys: "+Object.keys(o).join(","));console.log("entryCount: "+o.entryCount+" byteCount: "+o.byteCount+" skippedLines: "+o.skippedLines)})'
# 6. Turn 5: forget the first shared entry.
pbots remember --forget 1; echo "exit=$?"
pbots remember --list; echo "exit=$?"
# 7. Turn 6: forget an index that names no entry.
pbots remember --forget 9; echo "exit=$?"
# 8. Turn 7: read the raw file, which holds one line.
cat "$W/state/local%2Fbots-playbook/memory/shared.md"
wc -l < "$W/state/local%2Fbots-playbook/memory/shared.md"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- the shared append prints its index

- Expected: a line naming the entry's 1-based index `1` and the file path, then `exit=0`.

### Turn 2 -- the bot append lands in its own file

- Expected: a line naming index `1` and the path `$W/state/*/memory/pb-ask.md`, then `exit=0`.

### Turn 3 -- the list prints every field

- Expected: the shared list prints one entry with its index, type `general`, today's UTC date, the actor, the source `bots remember` and the text, then the file path with its entry and byte counts against the bounds.
- Expected: the bot list prints one entry with type `feedback` and the same shape.

### Turn 4 -- the JSON object carries seven keys

- Expected: `keys:` prints `version,botId,path,entries,entryCount,byteCount,skippedLines`.
- Expected: `entryCount` reads `1`, `byteCount` matches the file's size and `skippedLines` reads `0`.

### Turn 5 -- the forget shifts the index

- Expected: a line naming the removed entry, then `exit=0`.
- Expected: the second list holds no entry, because the shared file held one.

### Turn 6 -- an unknown index is refused

- Expected: `bots: memory-entry-unknown: 9` and `exit=2`.

### Turn 7 -- the raw file is one line

- Expected: `wc -l` prints `0`, because the file is now empty and holds no line.

### Expected

- Index `1` on both appends, each in its own file.
- Six fields on every listed entry plus the path and its counts.
- Seven keys on the JSON object.
- `bots: memory-entry-unknown: 9` and `exit=2`.
- An empty shared file after the forget.

### Evidence

Both append lines with their exits, both list outputs, the JSON object with its key line, the forget line, the unknown-index refusal with its exit and the raw file with its line count.

### Pass / Fail

- **Pass**: both appends land in their own files, the list and JSON agree, the forget shifts the index and the unknown index exits 2.
- **Fail**: an append lands in the wrong file, a field is missing, the JSON is a bare array, the index does not shift or the unknown index exits 0.
- **Skip**: only when `node` or `git` is unavailable, or when the `remember` verb is missing from the CLI's verb table, naming the missing verb and phase 005 as the blocker.

### Failure Triage

1. `bots: unknown verb: remember`: phase 005 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The append prints no index: the writer does not count the entries. Read the append branch.
3. `--bot` writes to the shared file: the path resolver ignores the flag. Read the path builder and the safe-segment check.
4. The JSON is a bare array: the writer prints the entries rather than the object. Read the `--json` branch and the seven keys.
5. The forget leaves the later indices alone: the rewrite does not renumber. Read the rewrite and confirm it writes the surviving entries in order.
6. `--forget 9` exits 0: the index check is missing. Read the bounds check.
7. A pipe in the text breaks the line: the reader splits on every delimiter. Read the split and confirm it takes the first four.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `memory/remember-appends-and-lists.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the remember verb and its four flags |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/memory.ts` | Owns the five-field form, the list and the forget |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Names the memory folder under the identity |

The shared append is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:146]. The bot append is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:147]. The list and its JSON object are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:149]. The forget is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:150].

---

## 5. SOURCE METADATA

- Group: Memory
- Playbook ID: BOT-048
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory/remember-appends-and-lists.md`
