---
title: "BOT-009 -- New bot from the template passes the definition checker"
description: "This scenario validates bot authoring for `BOT-009`. It focuses on the shipped template failing the checker as written and passing once its id and isolation are filled in."
version: 1.0.0.0
---

# BOT-009 -- New bot from the template passes the definition checker

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-009`.

---

## 1. OVERVIEW

An operator copies the shipped `BOT.md` template into a throwaway checkout and runs the definition checker twice. The template as written must fail, because its id is a placeholder. Once the id and isolation are filled in, the same checker must pass.

### Why This Matters

The checker is the only gate between a new file and its first unattended fire. If the template passed as written, a bot with a placeholder id could reach the installer.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-009` and confirm the expected signals without contradictory evidence.

- Objective: Prove the template fails the checker as written and passes once its required fields are filled in.
- Real user request: `Start a new bot from the template and tell me whether the checker accepts it.`
- Prompt: `Start a new bot from the template and tell me whether the checker accepts it.`
- Expected execution process: build the throwaway checkout, copy the template, run the checker, fill in the id and isolation, run the checker again, then remove the world.
- Expected signals: the first check exits 1 with `FAIL: definition.id-invalid`. The second exits 0 with `PASS: definition: bots/pb-digest/BOT.md parses as pb-digest` and `PASS: isolation: bots/pb-digest/BOT.md: shared`.
- Desired user-visible outcome: the operator sees which field blocked the template and that the filled-in bot is clean.
- Pass/fail: PASS if both exits and both named lines appear. FAIL if the unedited template passes, or the edited one fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Start a new bot from the template and tell me whether the checker accepts it.`

The checker only reads, so this scenario runs no bot, calls no executor and installs nothing.

### Commands

Run from the repository root in a POSIX shell.

```bash
# 1. Build a throwaway world: a checkout, a home, a state root and a run tree, all under one temp folder.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-digest" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
# 2. Copy the template as written and check it.
cp "$REPO_ROOT/.skilled/skills/system-skilled-bots/assets/bot-template.md" "$W/checkout/bots/pb-digest/BOT.md"
"$NODE" "$REPO_ROOT/.skilled/skills/system-skilled-bots/scripts/bot-check.cjs" "$W/checkout"; echo "exit=$?"
# 3. Fill in the id and pick shared isolation, then check again.
sed -i.bak -e 's/<your-bot-id>/pb-digest/' -e 's/^isolation: worktree$/isolation: shared/' "$W/checkout/bots/pb-digest/BOT.md" && rm "$W/checkout/bots/pb-digest/BOT.md.bak"
"$NODE" "$REPO_ROOT/.skilled/skills/system-skilled-bots/scripts/bot-check.cjs" "$W/checkout"; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- First check: `PASS: config`, `PASS: identity: local/bots-playbook (from config)`, a line starting `FAIL: definition.id-invalid` and `exit=1`.
- Second check: `PASS: definition: bots/pb-digest/BOT.md parses as pb-digest`, `PASS: executor-bounds`, `PASS: isolation: bots/pb-digest/BOT.md: shared`, no `FAIL:` line and `exit=0`.

### Evidence

The full output of both checker runs with their `exit=` lines, and the two lines of `BOT.md` that the edit changed.

### Pass / Fail

- **Pass**: the unedited template exits 1 on `definition.id-invalid` and the edited file exits 0 with no `FAIL:` line.
- **Fail**: the unedited template exits 0, or the edited file prints any `FAIL:` line.
- **Skip**: only when node is unavailable, naming that missing piece as the blocker.

### Failure Triage

1. A pass on the unedited template means the parser accepts the placeholder id. Read the id rule in `runtime/lib/definition.ts`.
2. A failure on the edited file names its invariant. Read the message and the field it points at in `assets/bot-template.md`.
3. An `identity-missing` failure means `$W/checkout/bots/config.json` did not land. Check the `printf` step's output.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `bot-authoring/author-and-check-bot.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/assets/bot-template.md` | The shipped template under test |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | The definition checker |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | The parser the checker imports |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | The author mode's field and checker reference |
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Automated checker coverage |

---

## 5. SOURCE METADATA

- Group: Bot Authoring
- Playbook ID: BOT-009
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `bot-authoring/author-and-check-bot.md`
