---
title: "BOT-053 -- Secret set reads stdin, list prints no value and forget is idempotent"
description: "This scenario proves that `bots secret set` reads the value from stdin and never from an argument, that `bots secret list` prints names and metadata only, that an empty value and a known placeholder are refused with exit 2, that a closed stdin is refused `secret-no-input`, and that `bots secret forget` is idempotent."
version: 1.0.0.0
---

# BOT-053 -- Secret set reads stdin, list prints no value and forget is idempotent

This document is the execution contract for `BOT-053`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator stores a value by piping one line into the verb, lists the store and sees the name with its metadata and no value, tries to pass the value as an argument and is refused, tries an empty value and a placeholder and is refused twice, then forgets the name twice and is accepted both times. A closed stdin is refused with its own name.

### Why This Matters

A value passed as an argument lands in the shell history and in every process listing on the machine, which is the one place a secret must never be. A list that prints the value turns the store into a file the operator cannot share a screen with. The idempotent forget matters because a script that removes a name it already removed must not fail, and the closed-stdin refusal matters because a prompt with no input would otherwise store an empty value.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the stdin read, the value-free list, the two value refusals, the closed-stdin refusal and the idempotent forget.
- Real user request: `Store a token for me, show me the list without showing the token, then remove it twice.`
- Prompt: `Store a token for me, show me the list without showing the token, then remove it twice.`
- Expected execution process: build the world, store a value from a pipe, list the store, try the value as an argument, try an empty value, try a placeholder, forget twice, then try a closed stdin.
- Expected signals: the store exits 0, the list names the entry and prints no value, the argument form exits 2, the empty value exits 2 with `secret-empty`, the placeholder exits 2 with `secret-placeholder`, both forgets exit 0 and the closed stdin exits 2 with `secret-no-input`.
- Desired user-visible outcome: the operator sees the name stored, listed without its value and removed twice without an error.
- Pass/fail: PASS if the value never appears in any output, both value refusals exit 2, both forgets exit 0 and the closed stdin is refused. FAIL if a value prints, the argument form is accepted, a forget fails or the closed stdin stores an empty value.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Store a token for me, show me the list without showing the token, then remove it twice.`

> **No tty.** Every command here runs from a pipe, which is the path the verb reads one line from without a prompt. That is the path the tests use, so the scenario needs no terminal.

> **File store.** The scenario passes `--store file` so the value lands in a 0600 file under the throwaway state root rather than in the operator's keychain. Nothing outside the world is touched.

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
# 2. Turn 1: store a value from a pipe.
printf 'tok-9f2c41ab\n' | pbots secret set PB_TOKEN --store file; echo "exit=$?"
# 3. Turn 2: list the store and prove no value prints.
pbots secret list; echo "exit=$?"
pbots secret list | grep -c 'tok-9f2c41ab'
# 4. Turn 3: the value as an argument is an unknown option.
pbots secret set PB_TOKEN --value tok-9f2c41ab --store file; echo "exit=$?"
# 5. Turn 4: an empty value is refused.
printf '\n' | pbots secret set PB_EMPTY --store file; echo "exit=$?"
# 6. Turn 5: a known placeholder is refused.
printf 'changeme\n' | pbots secret set PB_PLACEHOLDER --store file; echo "exit=$?"
# 7. Turn 6: forget twice, which is idempotent.
pbots secret forget PB_TOKEN --store file; echo "exit=$?"
pbots secret forget PB_TOKEN --store file; echo "exit=$?"
pbots secret list; echo "exit=$?"
# 8. Turn 7: a closed stdin is refused.
pbots secret set PB_CLOSED --store file < /dev/null; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots
```

### Turn 1 -- the value is stored from the pipe

- Expected: a line naming `PB_TOKEN` and its backend, then `exit=0`.

### Turn 2 -- the list prints no value

- Expected: one line naming `PB_TOKEN` with its metadata, and `grep -c 'tok-9f2c41ab'` printing `0`.

### Turn 3 -- the argument form is refused

- Expected: `bots: unknown option: --value` and `exit=2`.

### Turn 4 -- an empty value is refused

- Expected: `bots: secret-empty` and `exit=2`.

### Turn 5 -- a placeholder is refused

- Expected: `bots: secret-placeholder` and `exit=2`.

### Turn 6 -- both forgets succeed

- Expected: `exit=0` on both, then a list holding no entry and `exit=0`.

### Turn 7 -- a closed stdin is refused

- Expected: `bots: secret-no-input` and `exit=2`.

### Expected

- `exit=0` on the store and on both forgets.
- No value in any output, proven by a count of `0`.
- `bots: unknown option: --value` and `exit=2`.
- `bots: secret-empty` and `bots: secret-placeholder`, each with exit 2.
- `bots: secret-no-input` and `exit=2`.

### Evidence

The store line with its exit, the list output with its value count, the unknown-option refusal, both value refusals with their exits, both forget lines, the empty list and the closed-stdin refusal.

### Pass / Fail

- **Pass**: the value never appears in any output, both value refusals exit 2, both forgets exit 0 and the closed stdin is refused.
- **Fail**: a value prints, the argument form is accepted, a forget fails or the closed stdin stores an empty value.
- **Skip**: only when `node` or `git` is unavailable, or when the `secret` verb is missing from the CLI's verb table, naming the missing verb and phase 008 as the blocker.

### Failure Triage

1. `bots: unknown verb: secret`: phase 008 has not landed. Read the verb table in `.skilled/bin/bots.cjs`.
2. The list prints the value: the row renders the value rather than the metadata. Read the list branch.
3. `--value` is accepted: the option table holds it. Read the option table and remove it.
4. An empty value is stored: the empty check is missing. Read the reader and add `secret-empty`.
5. `changeme` is stored: the placeholder list is missing. Read the check and add `secret-placeholder`.
6. The second forget exits 4: the verb is not idempotent. Read the forget branch and return 0 for a name the store does not hold.
7. A closed stdin stores an empty value: the reader treats end of input as an empty line. Read the reader and refuse `secret-no-input`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `vault/secret-set-and-list.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the secret verb and its four subcommands |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/secrets.ts` | Owns the reader, the two backends and the index |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Names the secrets folder under the identity |

The stdin reader is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:146]. The value-free list is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:148]. The idempotent forget is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:149]. The two value refusals are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/008-vault/spec.md:160].

---

## 5. SOURCE METADATA

- Group: Vault
- Playbook ID: BOT-053
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `vault/secret-set-and-list.md`
