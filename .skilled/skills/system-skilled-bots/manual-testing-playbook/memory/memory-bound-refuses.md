---
title: "BOT-050 -- The memory file refuses a sixty-first entry, a long text and an unsafe bot id"
description: "This scenario proves that an append past 60 entries or 3,600 bytes is refused `memory-full` with exit 4 and leaves the file byte for byte unchanged, that a text over 400 characters is refused `memory-entry-too-long` with exit 2 before any file is read, that both files are created owner-only, and that a bot id which is not a safe segment is refused by name."
version: 1.0.1.0
---

# BOT-050 -- The memory file refuses a sixty-first entry, a long text and an unsafe bot id

This document is the execution contract for `BOT-050`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator fills the shared memory file to sixty entries with a short loop, then tries a sixty-first and is refused with the path, the entry count and the byte count. The file's checksum is the same before and after. A text over four hundred characters is refused before any file is read. The operator reads the folder and file modes, then tries a bot id that is not a safe path segment.

### Why This Matters

A memory file with no bound grows until it fills the prompt budget, and a refusal that writes half an entry leaves the file unreadable. The order matters: the length check runs before the file is opened, so a long text costs nothing. The mode matters because the file holds what the operator told the bot in confidence, and a world-readable file is a leak the operator never sees.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the two bounds, the unchanged file, the length refusal, the modes and the unsafe id.
- Real user request: `Fill my notes to the limit, show me the next one is refused, and show me the file is private.`
- Prompt: `Fill my notes to the limit, show me the next one is refused, and show me the file is private.`
- Expected execution process: build the world, append sixty entries in a loop, checksum the file, try a sixty-first, checksum again, try a long text, read the modes, then try an unsafe bot id.
- Expected signals: the sixty-first exits 4 with `memory-full` naming the path and both counts and the forget command that frees a line, the two checksums match, the long text exits 2 with `memory-entry-too-long`, the folder reads `700` and the file `600`, and the unsafe id is refused by name.
- Desired user-visible outcome: the operator sees the limit enforced without damage and the file private.
- Pass/fail: PASS if both bounds are refused with their exits, the file is unchanged, the modes are owner-only and the unsafe id is refused. FAIL if the sixty-first is accepted, the file changes, the long text is written, a mode is wider or the unsafe id becomes a path.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Fill my notes to the limit, show me the next one is refused, and show me the file is private.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **No model.** The remember verb writes a file and reads it back. No executor starts, so the shipped stub is only there to keep the helper uniform.

> **Short loop, no wait.** The sixty entries are sixty appends in one loop with no sleep, so the whole scenario finishes in seconds.

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
MEM="$W/state/local%2Fbots-playbook/memory/shared.md"
# 2. Turn 1: fill the file to sixty entries.
for i in $(seq 1 60); do pbots remember "note $i" >/dev/null 2>&1 || echo "append $i failed"; done
pbots remember --list --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);console.log("entryCount: "+o.entryCount+" byteCount: "+o.byteCount)})'
# 3. Turn 2: try the sixty-first and compare the file before and after.
BEFORE="$(shasum -a 256 "$MEM" | cut -d' ' -f1)" && echo "before: $BEFORE"
pbots remember "note 61"; echo "exit=$?"
AFTER="$(shasum -a 256 "$MEM" | cut -d' ' -f1)" && echo "after: $AFTER"
[ "$BEFORE" = "$AFTER" ] && echo "unchanged" || echo "changed"
# 4. Turn 3: a text over four hundred characters is refused before any read.
LONG="$(printf 'x%.0s' $(seq 1 401))"
pbots remember "$LONG"; echo "exit=$?"
# 5. Turn 4: read the folder and file modes.
stat -f '%Lp %N' "$W/state/local%2Fbots-playbook/memory" "$MEM"
# 6. Turn 5: a bot id that is not a safe segment is refused by name.
pbots remember "note" --bot ../escape; echo "exit=$?"
pbots remember "note" --bot "pb ask"; echo "exit=$?"
# 7. Turn 6: no file was created outside the memory folder.
find "$W/state" -name 'escape*' -o -name 'pb ask*' | sort
# 8. Turn 7: the file still holds sixty entries.
pbots remember --list --json | "$NODE" -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const o=JSON.parse(s);console.log("entryCount: "+o.entryCount)})'
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- sixty entries fit

- Expected: no `append <n> failed` line, then `entryCount: 60` and a `byteCount` under 3,600.

### Turn 2 -- the sixty-first is refused and the file is untouched

- Expected: `bots: memory-full: <path> (60 entries, <n> bytes), free a line with bots remember --forget <entry-id>` and `exit=4`.
- Expected: `unchanged`, because the two checksums match.

### Turn 3 -- a long text is refused before any read

- Expected: `bots: memory-entry-too-long: 401` and `exit=2`.

### Turn 4 -- both modes are owner-only

- Expected: `700` for the memory folder and `600` for the file.

### Turn 5 -- an unsafe bot id is refused by name

- Expected: two refusals, each naming the id, and neither exits 0.

### Turn 6 -- nothing was created outside the folder

- Expected: no path printed.

### Turn 7 -- the file still holds sixty entries

- Expected: `entryCount: 60`.

### Expected

- Sixty entries and a byte count under the bound.
- `bots: memory-full` and `exit=4` on the sixty-first, with matching checksums.
- `bots: memory-entry-too-long: 401` and `exit=2`.
- `700` and `600` on the folder and the file.
- Two refusals for the unsafe ids and no file outside the folder.
- `entryCount: 60` at the end.

### Evidence

The count line after the fill, both checksums with the `unchanged` line, the `memory-full` line with its exit, the `memory-entry-too-long` line with its exit, the two `stat` lines, both unsafe-id refusals and the final count line.

### Pass / Fail

- **Pass**: both bounds are refused with their exits, the file is unchanged, the modes are owner-only and the unsafe id is refused.
- **Fail**: the sixty-first is accepted, the file changes, the long text is written, a mode is wider or the unsafe id becomes a path.
- **Skip**: only when `node` or `git` is unavailable, or when the `remember` verb is missing its bounds, naming the missing bound and phase 005 as the blocker.

### Failure Triage

1. The sixty-first is accepted: the entry bound is missing. Read the append branch and the 60-entry check.
2. The refusal names no counts: the message omits them. Read the message and add the entry and byte counts.
3. The checksums differ: the refusal wrote before it checked. Read the order and move the check before the open.
4. The long text is written: the length check runs after the read. Read the order and move it first.
5. The folder reads `755`: the folder is created with the default mode. Read the `mkdir` call and pass `0o700`.
6. The file reads `644`: the file is created with the default mode. Read the open call and pass `0o600`.
7. `../escape` creates a file: the safe-segment check is missing. Read the id validator and refuse a segment holding a separator or a space.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `memory/memory-bound-refuses.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the remember verb and its exit codes |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/memory.ts` | Owns the two bounds, the modes and the safe-segment check |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Names the memory folder under the identity |

The two bounds and the length refusal are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:148]. The owner-only modes and the safe segment are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/005-memory/spec.md:162].

---

## 5. SOURCE METADATA

- Group: Memory
- Playbook ID: BOT-050
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory/memory-bound-refuses.md`
