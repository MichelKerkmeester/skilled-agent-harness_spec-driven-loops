---
title: "BOT-037 -- An until check sets completed only when it exits zero"
description: "This scenario proves that a completed run runs `until_check`, that a non-zero check records `met: false` and leaves the bot enabled, that a zero check records `untilMetAt` and sets the `completed` switch, that a later run is refused `routine-completed`, and that the three malformed until blocks are refused by name."
version: 1.0.1.0
---

# BOT-037 -- An until check sets completed only when it exits zero

This document is the execution contract for `BOT-037`. It names the verbs, the records and the requirement it proves, and it gives one bash block an operator runs from a plain terminal.

---

## 1. OVERVIEW

The operator writes a bot whose routine names an outcome and a shell check for it. A short loop runs the bot three times, creating the file the check looks for before the second run. The first run records `met: false` and leaves the bot enabled. The second records `met: true`, stamps `untilMetAt` and sets the `completed` switch. The third is refused `routine-completed`. Three more bots each break one until rule and are refused by name.

### Why This Matters

An outcome that never completes is a routine that runs forever, and an outcome that completes on a failed check is a routine that stops before its work is done. The three malformed blocks matter because prose in `until` is the operator's sentence, and a sentence that reaches a shell is a command nobody wrote on purpose.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the until check decides the completed switch, the refusal that follows it and the three malformed until blocks.
- Real user request: `My bot should stop once its summary exists. Run it until that happens, then show me it refuses to run again.`
- Prompt: `My bot should stop once its summary exists. Run it until that happens, then show me it refuses to run again.`
- Expected execution process: build the world with a bot carrying an until and a check, run a short loop that creates the file before the second run, read the records and the routine row, run once more, then add the three malformed bots and run each.
- Expected signals: the first record carries `until.met` false, the second carries true with `untilMetAt` stamped, the routine row reads `completed`, the next run exits 4 with `routine-completed`, and the three malformed bots exit 4 with their own names.
- Desired user-visible outcome: the operator sees the bot stop exactly when its outcome is met and sees each malformed block rejected with a name.
- Pass/fail: PASS if the check decides the switch, the completed refusal follows and all three malformed blocks are refused. FAIL if the switch is set on a failed check, the refusal is missing or a malformed block runs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `My bot should stop once its summary exists. Run it until that happens, then show me it refuses to run again.`

> **Recursion guard.** The command line of `bots run` and `bots drain` must never contain an executor word: `claude`, `codex`, `opencode` or `vibe`. The runner's recursion guard reads the command lines of every ancestor process and refuses with exit 3 on a match. Keep those words out of bot ids, temp paths and arguments, and start the commands from a plain terminal, not from inside an AI runtime session.

> **Executor stand-in.** `pbots` puts the shipped test executor first on PATH, so `runtime: {kind: cli-codex}` resolves to a stub that never calls a model. The loop is three runs with no wait, so the whole scenario finishes in seconds.

### Commands

Run from the repository root in a POSIX shell. One block, seven turns.

```bash
# 1. Build a throwaway world with one bot carrying an until and a check.
REPO_ROOT="$(git rev-parse --show-toplevel)"
NODE="$(command -v node)"
BOTS_CLI="$REPO_ROOT/.skilled/bin/bots.cjs"
STUB_DIR="$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor"
W="$(cd "$(mktemp -d)" && pwd -P)" && echo "world: $W"
mkdir -p "$W/checkout/bots/pb-until" "$W/acct" "$W/state" "$W/skilled/.skilled/skills/.state"
git -C "$W/checkout" init -q && git -C "$W/skilled" init -q
printf '.skilled/skills/.state/*/*\n' > "$W/skilled/.gitignore"
printf '{"identity": "local/bots-playbook", "stateRoot": "%s"}\n' "$W/state" > "$W/checkout/bots/config.json"
printf -- '---\nid: pb-until\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Write the summary.\n  starts:\n    - kind: manual\n  does: act\n  until: The summary file exists.\n  until_check: test -s notes/summary.md\n---\nWrite the summary.\n' > "$W/checkout/bots/pb-until/BOT.md"
# 2. Commit the world and define two helpers.
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook add -A
git -C "$W/checkout" -c user.email=playbook@example.invalid -c user.name=playbook commit -q --no-verify -m "until bot"
pbots() { HOME="$W/acct" PATH="$STUB_DIR:$(dirname "$NODE"):/usr/bin:/bin" "$NODE" "$BOTS_CLI" "$@" --repo "$W/checkout" --skilled-tree "$W/skilled"; }
records() { "$NODE" -e 'const fs=require("fs"),p=require("path");for(const d of process.argv.slice(1))for(const f of fs.readdirSync(d)){const r=JSON.parse(fs.readFileSync(p.join(d,f),"utf8"));console.log([r.identity.runId,r.identity.botId,r.exit.reason,JSON.stringify(r.until??null)].join(" | "))}' "$W"/state/*/records; }
# 3. Turn 1: run a short loop, creating the file the check looks for before the second run.
for i in 1 2 3; do
  [ "$i" = 2 ] && printf 'summary\n' > "$W/checkout/notes/summary.md"
  pbots run pb-until; echo "run $i exit=$?"
done
records
# 4. Turn 2: read the routine row and its switch.
pbots routines --json; echo "exit=$?"
# 5. Turn 3: run once more, which the completed switch refuses.
pbots run pb-until; echo "exit=$?"
# 6. Turn 4: an until with no check never completes.
mkdir -p "$W/checkout/bots/pb-prose"
printf -- '---\nid: pb-prose\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Prose only.\n  starts:\n    - kind: manual\n  does: act\n  until: The operator is happy.\n---\nProse only.\n' > "$W/checkout/bots/pb-prose/BOT.md"
pbots run pb-prose; echo "exit=$?"
pbots routines --json | grep -o '"botId":"pb-prose"[^}]*'
# 7. Turn 5: a check with no until is refused.
mkdir -p "$W/checkout/bots/pb-check"
printf -- '---\nid: pb-check\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Check only.\n  starts:\n    - kind: manual\n  does: act\n  until_check: test -s notes/summary.md\n---\nCheck only.\n' > "$W/checkout/bots/pb-check/BOT.md"
pbots run pb-check; echo "exit=$?"
# 8. Turn 6: an until holding a shell metacharacter is refused.
mkdir -p "$W/checkout/bots/pb-meta"
printf -- '---\nid: pb-meta\nruntime: {kind: cli-codex}\nisolation: shared\ndelivery: local-only\nroutine:\n  what: Metacharacter.\n  starts:\n    - kind: manual\n  does: act\n  until: The summary exists; then stop.\n  until_check: test -s notes/summary.md\n---\nMetacharacter.\n' > "$W/checkout/bots/pb-meta/BOT.md"
pbots run pb-meta; echo "exit=$?"
# 9. Turn 7: the completed bot is still the only one that stopped.
pbots routines --json; echo "exit=$?"
# Last. Remove the throwaway world.
rm -rf "$W" && unset -f pbots records
```

### Turn 1 -- the check decides the switch

- Expected: three run lines, the first two completing with `exit=0` and the third refused.
- Expected: the first record's `until` object reads `{"met":false}`, the second reads `{"met":true}` and the third record is the refusal, which carries `until` reading `null`.

### Turn 2 -- the routine row reads completed

- Expected: the row's `switch` reads `completed` and its `untilMetAt` carries an ISO 8601 UTC instant.
- Expected: `exit=0`.

### Turn 3 -- a completed routine refuses to run

- Expected: `bots: routine-completed` and `exit=4`.

### Turn 4 -- prose with no check never completes

- Expected: `exit=0` on the run, and the routine row for `pb-prose` carries `until` with its sentence, `untilMetAt` reading `null` and `switch` reading `enabled`.

### Turn 5 -- a check with no until is refused

- Expected: `bots: routine-until-check-without-outcome` and `exit=4`.

### Turn 6 -- a metacharacter in the until is refused

- Expected: `bots: routine-until-shell-metacharacters` and `exit=4`.

### Turn 7 -- only the completed bot stopped

- Expected: `pb-until` reads `completed`, `pb-prose` reads `enabled`, and neither refused bot appears.

### Expected

- `{"met":false}` then `{"met":true}` on the first two records.
- `switch` reading `completed` with `untilMetAt` stamped.
- `bots: routine-completed` and `exit=4` on the fourth run.
- `bots: routine-until-check-without-outcome` and `exit=4` on turn 5.
- `bots: routine-until-shell-metacharacters` and `exit=4` on turn 6.
- `pb-prose` still `enabled` with a null `untilMetAt`.

### Evidence

The three loop lines with their exits, the three record lines, both routine JSON outputs, the completed refusal with its exit and both malformed refusals with their exits. The `untilMetAt` instant must fall after the second run and before the third.

### Pass / Fail

- **Pass**: the check decides the switch, the completed refusal follows and all three malformed blocks are refused by name.
- **Fail**: the switch is set on a failed check, the refusal is missing, a malformed block runs or a prose-only routine completes.
- **Skip**: only when `node` or `git` is unavailable, or when the `until_check` key is missing from the routine parser, naming the missing key and phase 002 as the blocker.

### Failure Triage

1. The first record carries no `until` object: the check did not run. Read the completed-run branch in `runner.ts` and confirm it calls the precheck helper.
2. The first record reads `{"met":true}`: the check's exit status is inverted. Read the outcome mapping.
3. The switch reads `enabled` after a zero check: the switch write is missing. Read the three writes in `specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/design/state-machines.md` section 2.
4. The fourth run exits 0: the completed check is missing beside the disabled check. Read the refusal order in `specs/system-skilled-bots/003-openbot-parity-build/contracts/refusals.md`.
5. `pb-prose` completes: an until with no check must never set the switch. Read the guard.
6. `pb-meta` runs: the metacharacter scan is missing. Read the until validator.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `routines/until-outcome-completes.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/bin/bots.cjs` | Owns the run and routines verbs |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Runs the check after a completed run |
| `$REPO_ROOT/.skilled/skills/system-skilled-bots/runtime/lib/routine.ts` | Owns the switch, `untilMetAt` and the three refusals |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/stub-executor` | The stand-in executor, so no model is called |

The check and the record shape are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:168]. The three until rules are [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/spec.md:180].

---

## 5. SOURCE METADATA

- Group: Routines
- Playbook ID: BOT-037
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `routines/until-outcome-completes.md`
