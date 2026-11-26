---
title: "BOT-057 -- Both byte caps refuse before the prompt is built"
description: "This scenario proves the two byte caps on skill bodies, 16,384 bytes for one body and 24,576 bytes for the list, that neither cap truncates, that the list cap names the skill that crossed the line, that a duplicate name and a name outside the grammar are refused at parse time, and that the checker reports the two budget invariants without a run."
version: 1.0.0.0
---

# BOT-057 -- Both byte caps refuse before the prompt is built

This document is the execution contract for `BOT-057`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator builds four bodies at known byte counts, one exactly at each cap and one a single byte over each, and five bots that name them. The bot at the cap runs. The bot one byte over is refused. The list one byte over its cap is refused and the refusal names the skill that crossed. A duplicate name and a name outside the grammar are refused at parse time. The checker reports the two budget invariants on the same checkout without a run.

### Why This Matters

A cap that truncates is worse than no cap, because a truncated body reads as a complete instruction and the bot follows half a procedure. A cap that refuses without naming the skill leaves the operator counting bytes across a list. And a duplicate name is a body loaded twice, which doubles its weight against the list cap while looking like one entry.

---

## 2. SCENARIO CONTRACT

- Objective: Prove both caps, the no-truncation rule, the named crossing skill, the two parse refusals and the two checker invariants.
- Real user request: `Show me the skill size caps refusing, tell me which skill crossed the list cap, and show me a duplicate name refused.`
- Prompt: `Show me the skill size caps refusing, tell me which skill crossed the list cap, and show me a duplicate name refused.`
- Expected execution process: build four bodies at exact byte counts and five bots, run the bot at each cap, run the bot one byte over each cap, run the duplicate and the bad name, then run the checker.
- Expected signals: the body at 16,384 bytes runs, the body at 16,385 bytes exits 4 with `skill-too-large`, the list at 24,577 bytes exits 4 with `skills-over-budget: pb-sum-b`, the duplicate exits 4 with `definition-malformed: skills-duplicate`, the bad name exits 4 with `definition-malformed: skills-name-invalid`, and the checker prints one `FAIL: skills-too-large` line and one `FAIL: skills-over-budget` line.
- Desired user-visible outcome: the operator sees each cap refuse at its exact byte, sees the crossing skill named and sees no truncated body reach a child.
- Pass/fail: PASS if each cap refuses one byte over and accepts at the byte, the list refusal names `pb-sum-b`, both parse reasons surface and the checker reports both invariants. FAIL if a cap truncates, if the list refusal names no skill, if a parse reason is missing or if the checker exits 0.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Show me the skill size caps refusing, tell me which skill crossed the list cap, and show me a duplicate name refused.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The stub writes the prompt it received to `$HOME/stub-receipts/<run id>.json`, which is how the accepted case is told from a refusal.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

```bash
# 1. Build a throwaway world with four bodies at exact byte counts and five bots.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
mkbody() { # mkbody <path> <total-bytes> <name>
  mkdir -p "$(dirname "$1")"
  printf -- '---\nname: %s\ndescription: "padding"\n---\n' "$3" > "$1"
  head -c "$(( $2 - $(wc -c < "$1") ))" /dev/zero | tr '\0' 'a' >> "$1"
  printf '%s %s\n' "$3" "$(wc -c < "$1" | tr -d ' ')"
}
mkbody "$W/skilled/.skilled/skills/pb-exact/SKILL.md" 16384 pb-exact
mkbody "$W/skilled/.skilled/skills/pb-over/SKILL.md" 16385 pb-over
mkbody "$W/skilled/.skilled/skills/pb-sum-a/SKILL.md" 12288 pb-sum-a
mkbody "$W/skilled/.skilled/skills/pb-sum-b/SKILL.md" 12289 pb-sum-b
mkbot() { # mkbot <id> <skills-flow-list>
  mkdir -p "$W/checkout/bots/$1"
  printf -- '---\nid: %s\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nskills: %s\n---\nWrite the release notes.\n' "$1" "$2" > "$W/checkout/bots/$1/BOT.md"
}
mkbot pb-exact '[pb-exact]'
mkbot pb-over '[pb-over]'
mkbot pb-sum '[pb-sum-a, pb-sum-b]'
mkbot pb-dup '[pb-exact, pb-exact]'
mkbot pb-badname '[pb_bad]'
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "five bots"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
# 2. Turn 1: the body at exactly 16,384 bytes is accepted.
pbots run pb-exact; echo "exit=$?"
# 3. Turn 2: one byte more is refused, and no body is truncated.
pbots run pb-over; echo "exit=$?"
pbots run pb-over 2>&1 | grep -c 'skill-too-large'
# 4. Turn 3: the list at exactly 24,576 bytes is accepted.
mkbot pb-sum-exact '[pb-sum-a, pb-sum-a]'
pbots run pb-sum-exact; echo "exit=$?"
# 5. Turn 4: one byte more is refused and names the skill that crossed.
pbots run pb-sum; echo "exit=$?"
pbots run pb-sum 2>&1 | grep -c 'skills-over-budget: pb-sum-b'
# 6. Turn 5: a duplicate name and a name outside the grammar are parse refusals.
pbots run pb-dup; echo "exit=$?"
pbots run pb-badname; echo "exit=$?"
# 7. Turn 6: the checker reports both budget invariants without a run.
pbots check; echo "exit=$?"
pbots check | grep -c '^FAIL: skills-too-large'
pbots check | grep -c '^FAIL: skills-over-budget'
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots mkbody mkbot
```

### Turn 1 -- the body at the cap is accepted

- Expected: four `mkbody` lines reading `pb-exact 16384`, `pb-over 16385`, `pb-sum-a 12288` and `pb-sum-b 12289`, then `bots: pb-exact run <run id> completed` and `exit=0`.

### Turn 2 -- one byte over is refused

- Expected: a line holding `skill-too-large` and `exit=4`, then `1`. No receipt is written for `pb-over`, so no truncated body reached a child.

### Turn 3 -- the list at its cap is accepted

- Expected: `bots: pb-sum-exact run <run id> completed` and `exit=0`. Two bodies of 12,288 bytes sum to exactly 24,576 and pass.

### Turn 4 -- one byte over the list cap is refused and names the skill

- Expected: a line holding `skills-over-budget: pb-sum-b` and `exit=4`, then `1`. `pb-sum-a` loads first at 12,288, so `pb-sum-b` is the skill that crosses the line.

### Turn 5 -- both parse reasons surface

- Expected: `bots: definition-malformed: skills-duplicate` with `exit=4`, then `bots: definition-malformed: skills-name-invalid` with `exit=4`. Neither is a registry cause, so both arrive as the detail of `definition-malformed`.

### Turn 6 -- the checker reports both invariants

- Expected: `exit=1`, one `FAIL: skills-too-large` line and one `FAIL: skills-over-budget` line, so both counts print `1`.

### Expected

- `exit=0` at 16,384 bytes and at 24,576 bytes.
- `skill-too-large` and `exit=4` at 16,385 bytes.
- `skills-over-budget: pb-sum-b` and `exit=4` at 24,577 bytes.
- `definition-malformed: skills-duplicate` and `definition-malformed: skills-name-invalid`, each with `exit=4`.
- One `FAIL: skills-too-large` line and one `FAIL: skills-over-budget` line from the checker.

### Evidence

The four `mkbody` byte counts, the two accepted run lines with their exits, the two refusal lines with their exits and their grep counts, the two parse refusal lines with their exits and the checker output with both counts.

### Pass / Fail

- **Pass**: each cap refuses one byte over and accepts at the byte, the list refusal names `pb-sum-b`, both parse reasons surface and the checker reports both invariants.
- **Fail**: a cap truncates, the list refusal names no skill, a parse reason is missing or the checker exits 0.
- **Skip**: only when `node` or `git` is unavailable, or when the `skills` key is missing from the definition parser, naming the missing key and phase 009 as the blocker.

### Failure Triage

1. `pb-exact` is refused: the cap is compared with `>` against the wrong number, or the body carries a byte the counter does not. Read the cap and confirm it is 16,384 and inclusive.
2. `pb-over` runs: the cap is not enforced. Read the loader and add the check before the body is read into the prompt.
3. The refusal truncates and the run completes: the loader slices the body instead of refusing. Read the loader and remove the slice.
4. `pb-sum-exact` is refused: the list cap is exclusive or the sum counts a separator. Read the sum and confirm it adds body bytes only.
5. The list refusal names no skill: the message drops the detail. Read the refusal and add the name of the body that crossed.
6. The list refusal names `pb-sum-a`: the sum is checked before the addition. Read the loop and check after adding each body.
7. `pb-dup` runs: the duplicate check is missing from the parser. Read the parser and add it, because a duplicate is shape and not a run refusal.
8. `pb-badname` runs: the grammar check is missing. Read the parser and add the name grammar.
9. The checker exits 0: the two invariants are not registered. Read the checker's invariant list and add both.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `skills/skills-over-budget.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Parses `skills` and refuses a duplicate or a bad name |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/skills.ts` | Enforces both byte caps and names the crossing skill |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Refuses `skill-too-large` and `skills-over-budget` before dispatch |
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | Carries the `skills-too-large` and `skills-over-budget` invariants |

The two caps are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:162]. The three checker invariants are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:171]. The two parse reasons are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:172]. The exact-byte edge is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:240]. The failure path is [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/009-skills/spec.md:241]. The exit and layer for each name are `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md` section 3.8.

---

## 5. SOURCE METADATA

- Group: Skills
- Playbook ID: BOT-057
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `skills/skills-over-budget.md`
