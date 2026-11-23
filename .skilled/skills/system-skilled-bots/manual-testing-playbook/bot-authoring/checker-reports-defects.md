---
title: "BOT-010 -- Definition checker fails each defect by name, a folder mismatch included"
description: "This scenario validates bot authoring for `BOT-010`. It focuses on the checker failing two field defects and a folder mismatch by name, with `--strict` changing nothing."
version: 1.0.0.0
---

# BOT-010 -- Definition checker fails each defect by name, a folder mismatch included

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `BOT-010`.

---

## 1. OVERVIEW

A throwaway checkout holds three bots. One declares no isolation, one asks for a timeout past the executor's bound, and one sits in a folder that does not match its id. The checker must fail all three by invariant id. A folder that differs from its id is a failure, not a warning, because the runner and the installer refuse that definition. `--strict` must change nothing, because no advisory invariant is left.

### Why This Matters

A failure the operator cannot map to a field is a failure nobody fixes. Each line must name the invariant. A folder mismatch that only warned would pass the checker and then be refused at its first unattended fire.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `BOT-010` and confirm the expected signals without contradictory evidence.

- Objective: Prove the checker fails each defect by id, a folder mismatch included, and that `--strict` changes nothing.
- Real user request: `Check my bots folder and tell me exactly which fields are wrong.`
- Prompt: `Check my bots folder and tell me exactly which fields are wrong.`
- Expected execution process: build the checkout with three bots, run the checker, remove the two field-defect bots, run it again, run it with `--strict`, then remove the world.
- Expected signals: run one exits 1 with `FAIL: folder-id-mismatch`, `FAIL: budget.timeoutSeconds-out-of-bounds` and `FAIL: isolation-undeclared`. Run two exits 1 with `FAIL: folder-id-mismatch`. Run three, under `--strict`, prints the same lines as run two and exits 1.
- Desired user-visible outcome: the operator gets one line per defect, each naming the field to fix.
- Pass/fail: PASS if all three runs show their exit and named lines. FAIL if a defect goes unnamed, any `WARN:` line prints, or the strict run differs from run two.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check my bots folder and tell me exactly which fields are wrong.`

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
mkdir -p "$W/checkout/bots/pb-noiso" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
# 2. Write three bots: no isolation, a timeout past the bound, a folder that differs from the id.
mkdir -p "$W/checkout/bots/pb-long" "$W/checkout/bots/pb-folder"
printf -- '---\nid: pb-noiso\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\n---\nSummarize the notes folder.\n' > "$W/checkout/bots/pb-noiso/BOT.md"
printf -- '---\nid: pb-long\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\nbudget: {timeoutSeconds: 7200}\n---\nSummarize the notes folder.\n' > "$W/checkout/bots/pb-long/BOT.md"
printf -- '---\nid: pb-other\ntrigger: {kind: manual}\nruntime: {kind: cli-codex}\nisolation: shared\n---\nSummarize the notes folder.\n' > "$W/checkout/bots/pb-folder/BOT.md"
CHECK="$REPO_ROOT/.skilled/skills/system-skilled-bots/scripts/bot-check.cjs"
# 3. Check all three.
"$NODE" "$CHECK" "$W/checkout"; echo "exit=$?"
# 4. Remove the two field defects and check again, then check in strict mode.
rm -r "$W/checkout/bots/pb-noiso" "$W/checkout/bots/pb-long"
"$NODE" "$CHECK" "$W/checkout"; echo "exit=$?"
"$NODE" "$CHECK" "$W/checkout" --strict; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Expected

- Run one: `FAIL: folder-id-mismatch: bots/pb-folder/BOT.md: folder pb-folder differs from id pb-other`, `FAIL: budget.timeoutSeconds-out-of-bounds: bots/pb-long/BOT.md: budget.timeoutSeconds-out-of-bounds (Too big: expected number to be <=3600)`, `FAIL: isolation-undeclared: bots/pb-noiso/BOT.md: declare isolation in BOT.md or defaultIsolation in bots/config.json` and `exit=1`.
- Run two: the same `FAIL: folder-id-mismatch` line, no `WARN:` line and `exit=1`.
- Run three: the same lines as run two, still `FAIL: folder-id-mismatch` and `exit=1`.

### Evidence

The full output of the three checker runs with their `exit=` lines.

### Pass / Fail

- **Pass**: every named line and exit above appears.
- **Fail**: a defect has no line of its own, a `WARN:` line prints, run two exits 0 or run three differs from run two.
- **Skip**: only when node is unavailable, naming that missing piece as the blocker.

### Failure Triage

1. A missing `isolation-undeclared` line: read `resolveIsolation` in `runtime/lib/definition.ts` and confirm `$W/checkout/bots/config.json` sets no `defaultIsolation`.
2. A missing bound failure: read `checkExecutorBounds` in `runtime/lib/definition.ts`. The bound comes from the deep-loop executor schema, never from the checker.
3. A `WARN: folder-id-mismatch` line or run two at `exit=0`: the folder check is advisory again. Read the folder check and `ADVISORY_INVARIANTS` in `scripts/bot-check.cjs`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `bot-authoring/checker-reports-defects.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-skilled-bots/scripts/bot-check.cjs` | The definition checker and its invariant lists |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Isolation and executor-bound rules |
| `.skilled/skills/system-skilled-bots/runtime/tests/bot-check.vitest.ts` | Automated checker coverage |

---

## 5. SOURCE METADATA

- Group: Bot Authoring
- Playbook ID: BOT-010
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `bot-authoring/checker-reports-defects.md`
