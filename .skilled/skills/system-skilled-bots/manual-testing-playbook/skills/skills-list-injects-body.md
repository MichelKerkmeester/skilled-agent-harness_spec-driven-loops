---
title: "BOT-056 -- A named skill's body reaches the prompt inside its own block"
description: "This scenario proves that `skills:` parses into a list of names, that the runner loads each named skill's body from the skilled tree and inserts it at the skills position inside one `<skill_content name=\"<name>\">` block per skill, that the block sits after the memory block and before the standing body, and that a name which does not resolve refuses the run before dispatch."
version: 1.0.1.0
---

# BOT-056 -- A named skill's body reaches the prompt inside its own block

This document is the execution contract for `BOT-056`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator writes a skill into the skilled tree and a bot that names it, then runs the bot and reads the prompt the executor received. The body is there inside one labelled block, after the memory block and before the standing body. A second bot names a skill that does not exist and is refused before dispatch. The checker reports the same problem without a run.

### Why This Matters

A skill the bot never receives is a name in a file that does nothing, and a body inserted at the wrong position is read as part of another section. The label matters because the body is repository content the operator did not write for this run, so the bot has to be able to tell it from its own instructions. The refusal matters because a bot that runs without the skill it named produces work the operator will not recognise.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the parse, the labelled block, its position and the unresolved-name refusal.
- Real user request: `Give my bot the notes skill, show me the body arrived in its own block, and show me a missing skill is refused.`
- Prompt: `Give my bot the notes skill, show me the body arrived in its own block, and show me a missing skill is refused.`
- Expected execution process: build the world with a skill and two bots, append a memory fact, run the bot that names the skill, read its receipt, run the bot naming a missing skill, then run the checker.
- Expected signals: the prompt carries one `<skill_content name="pb-notes">` block holding the body, the block sits after the memory block and before the standing body, the missing name exits 4 with `skills-unknown`, and the checker prints one `FAIL:` line naming it.
- Desired user-visible outcome: the operator sees the skill body in its own block and a missing skill refused before anything runs.
- Pass/fail: PASS if the block holds the body at the right position and the missing name is refused by both the run and the checker. FAIL if the body is absent, the block is unlabelled, the position is wrong or the missing name dispatches.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Give my bot the notes skill, show me the body arrived in its own block, and show me a missing skill is refused.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub writes the whole prompt it received to `$HOME/stub-receipts/<run id>.json`, which is how the block is read without a model.

### Commands

Run from the repository root in a POSIX shell. One block, six turns.

```bash
# 1. Build a throwaway world with a skill and two bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-skill" "$W/checkout/bots/pb-missing" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state" "$W/skilled/.skilled/skills/pb-notes"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nname: pb-notes\ndescription: "How to write the release notes."\n---\n\n# pb-notes\n\nWrite one paragraph per change and name the file it touched.\n' > "$W/skilled/.skilled/skills/pb-notes/SKILL.md"
printf -- '---\nid: pb-skill\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nskills: [pb-notes]\n---\nWrite the release notes.\n' > "$W/checkout/bots/pb-skill/BOT.md"
printf -- '---\nid: pb-missing\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nskills: [pb-absent]\n---\nWrite the release notes.\n' > "$W/checkout/bots/pb-missing/BOT.md"
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "two bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 2. Turn 1: append a memory fact so the two blocks can be ordered.
pbots remember "The release notes ship on Friday."; echo "exit=$?"
# 3. Turn 2: run the bot that names the skill.
pbots run pb-skill; echo "exit=$?"
# 4. Turn 3: read the block and the body it holds.
"$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));const s=String(r.prompt||"");const m=s.match(/<skill_content name="[^"]+">[\s\S]*?<\/skill_content>/);console.log(f+" :: "+(m?["tag "+m[0].startsWith("<skill_content name=\"pb-notes\">"),"label "+m[0].includes("a procedure from the repository that you may follow"),"folder "+m[0].includes("/.skilled/skills/pb-notes"),"heading "+m[0].includes("# pb-notes"),"instruction "+m[0].includes("Write one paragraph per change")].join(" "):"no block"))}' "$W/acct/stub-receipts"
# 5. Turn 4: read the order of the three positions.
"$NODE" -e 'const fs=require("fs"),p=require("path");const d=process.argv[1];for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));const s=String(r.prompt||"");console.log(f+" memory="+s.indexOf("<memory file=")+" skill="+s.indexOf("<skill_content")+" body="+s.indexOf("Write the release notes."))}' "$W/acct/stub-receipts"
# 6. Turn 5: a name that does not resolve is refused before dispatch.
pbots run pb-missing; echo "exit=$?"
# 7. Turn 6: the checker reports the same problem.
pbots check; echo "exit=$?"
pbots check | grep -c 'skills-unknown'
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- the memory fact is recorded

- Expected: an append line naming the shared file and `exit=0`.

### Turn 2 -- the run completes

- Expected: `bots: pb-skill run <run id> completed` and `exit=0`.

### Turn 3 -- the block holds the body

- Expected: one receipt line reading `tag true label true folder true heading true instruction true`. The block opens with its tag, then the label line that calls the skill a procedure the run may follow, then the line naming the skill's folder, then the body with its heading and its instruction.

### Turn 4 -- the three positions are in order

- Expected: one line whose `memory` index is smaller than its `skill` index, which is smaller than its `body` index.

### Turn 5 -- a missing skill is refused before dispatch

- Expected: `bots: skills-unknown` and `exit=4`, with no receipt written for `pb-missing`.

### Turn 6 -- the checker agrees

- Expected: `exit=1` and `grep -c 'skills-unknown'` printing `1`.

### Expected

- `exit=0` on the append and on the run.
- One labelled block holding the body.
- `memory` before `skill` before `body`.
- `bots: skills-unknown` and `exit=4` on the missing name.
- One checker line naming `skills-unknown`.

### Evidence

The append line, the run line with its exit, the block line, the three-index line, the missing-name refusal with its exit and the checker output with its count.

### Pass / Fail

- **Pass**: the block holds the body at the right position and the missing name is refused by both the run and the checker.
- **Fail**: the body is absent, the block is unlabelled, the position is wrong or the missing name dispatches.
- **Skip**: only when `node` or `git` is unavailable, or when the `skills` key is missing from the definition parser, naming the missing key and phase 009 as the blocker.

### Failure Triage

1. No `<skill_content` in the prompt: the block is missing from the prompt builder. Read the skills position in `specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md` section 1.
2. The block is unlabelled or a value reads `false`: the wrapper drops the name, the label line or the folder line. Read the wrapper in `specs/system-skilled-bots/003-openbot-parity-build/contracts/prompt-sections.md` and add what is missing.
3. The body is absent from the block: the loader reads the wrong path. Read the loader and confirm it reads `<skilledTree>/.skilled/skills/<name>/SKILL.md`.
4. The skill index is smaller than the memory index: the insert order is reversed. Read the builder and insert memory first.
5. The skill index is larger than the body index: the block lands after the standing body. Read the position and move it before.
6. `pb-missing` dispatches: the resolution runs after dispatch. Read the order and move it before.
7. The checker exits 0: the invariant is not registered. Read the checker's invariant list and add `skills-unknown`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `skills/skills-list-injects-body.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Parses `skills` into a list of names |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/skills.ts` | Loads each body and wraps it |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/prompt.ts` | Inserts the blocks at the skills position |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | Writes the prompt it received to a receipt |

The `skills` key is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:160]. The loader and the wrapper are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:161]. The untrusted-block rule is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:176].

---

## 5. SOURCE METADATA

- Group: Skills
- Playbook ID: BOT-056
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `skills/skills-list-injects-body.md`
