---
title: "Design: the ten routine fixtures"
description: "The clean routine checkout and the nine single-defect copies, each with its literal BOT.md content, the one invariant it trips, the checker line it must print and the rule that keeps each copy one file and two lines from clean."
trigger_phrases:
  - "routine fixtures"
  - "routine-clean fixture"
  - "routine defect fixtures"
importance_tier: "important"
contextType: "implementation"
version: 1.0.0.0
---

# The ten routine fixtures

Ten folders under `.skilled/skills/system-skilled-bots/scripts/fixtures/`: `routine-clean` and nine single-defect copies. Each defect copy differs from `routine-clean` by one changed file and at most two changed lines, which is the rule `bot-check.vitest.ts` already enforces over this folder. [SOURCE: .skilled/skills/system-skilled-bots/scripts/fixtures/README.md:17]

The invariant each copy trips is `design/refusals.md` section 1. The checker's exit codes are 0 when every invariant passes, 1 on any `FAIL:` line and 2 when it stopped before auditing. [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:118] [SOURCE: .skilled/skills/system-skilled-bots/scripts/bot-check.cjs:168]

---

## 1. `routine-clean`

Three bots. Two carry a `routine` block and one carries a `trigger`, so the `routines` verb prints two rows and the checker passes.

`routine-clean/bots/config.json`:

```json
{
  "identity": "local/tool"
}
```

`routine-clean/bots/digest/BOT.md`:

```text
---
id: digest
routine:
  what: the morning digest
  starts:
    - {kind: cron, expression: "15 */6 * * *"}
  does: tell
  until: the digest is sent
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
---
Summarize the commits merged since the last run into a short digest.
```

`routine-clean/bots/nightly-report/BOT.md`:

```text
---
id: nightly-report
routine:
  what: the nightly report
  starts:
    - {kind: cron, expression: "0 2 * * *"}
  does: act
  until: the report is filed
  until_check: test -f reports/nightly.md
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: local-only
---
Write the nightly report to reports/nightly.md.
```

`routine-clean/bots/plain/BOT.md`:

```text
---
id: plain
trigger: {kind: manual}
runtime: {kind: cli-codex}
budget: {maxIterations: 4, timeoutSeconds: 600}
isolation: shared
delivery: local-only
---
Print the current date.
```

**Why these three.** `digest` is the `does: tell` case with an `until` and no `until_check`, so it never completes. `nightly-report` is the `does: act` case with both an `until` and an `until_check`, so a completed run measures it. `plain` proves a bot with no block is not a row and still passes the checker. The two routine bots are the two rows `bots routines` prints, and their ids are the ones the screen contract's sample uses. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/003-terminal-screen/002-architecture-and-contracts/design/payloads/routines.json:1]

---

## 2. THE NINE DEFECT COPIES

Each row names the file it changes, the change, and the one line the checker must print.

| Fixture | File changed | The change | The checker line |
|---------|--------------|------------|------------------|
| `routine-trigger-conflict` | `digest/BOT.md` | add `trigger: {kind: manual}` after the `id` line | `FAIL: definition.routine-trigger-conflict: ...` |
| `routine-tell-with-targets` | `digest/BOT.md` | add `delivery: {targets: [], onFailure: null}` after the `does` line | `FAIL: definition.routine-tell-with-targets: ...` |
| `routine-starts-empty` | `digest/BOT.md` | replace the two `starts` lines with `  starts: []` | `FAIL: definition.routine-starts-empty: ...` |
| `routine-starts-multiple-cron` | `digest/BOT.md` | add `    - {kind: cron, expression: "0 9 * * *"}` after the existing entry | `FAIL: definition.routine-starts-multiple-cron: ...` |
| `routine-starts-cron-not-first` | `digest/BOT.md` | change the entry to `    - {kind: manual}` and add `    - {kind: cron, expression: "0 9 * * *"}` | `FAIL: definition.routine-starts-cron-not-first: ...` |
| `routine-starts-multiple` | `digest/BOT.md` | add `    - {kind: queue, name: inbox}` after the existing entry | `FAIL: definition.routine-starts-multiple: ...` |
| `routine-until-check-without-outcome` | `digest/BOT.md` | change `  until: the digest is sent` to `  until_check: test -f reports/digest.md` | `FAIL: definition.routine-until-check-without-outcome: ...` |
| `routine-until-shell-metacharacters` | `digest/BOT.md` | change `  until: the digest is sent` to `  until: the digest is sent; then stop` | `FAIL: definition.routine-until-shell-metacharacters: ...` |
| `routine-floor` | `digest/BOT.md` | change the expression to `"*/5 * * * *"` | `FAIL: routine-floor-15-minutes: ...` |

**The precedence between the three `starts` names.** A `starts` list with more than one entry is checked in this order, and the first that applies is the one reported: `routine-starts-multiple-cron` when two or more entries are cron, else `routine-starts-cron-not-first` when exactly one entry is cron and it is not at index 0, else `routine-starts-multiple`. Without a fixed order, `routine-starts-multiple-cron` and `routine-starts-cron-not-first` would both fire on the same fixture and the test could not assert one name. The rule is restated in `design/refusals.md` section 2, which `spec.md` cites for it.

**The floor fixture is named `routine-floor`.** The other eight carry the invariant id because the id is the whole rule. The floor's id names the bound, and the folder names the rule, which is the shape `cron-untranslatable` and `timeout-over-bound` already use.

---

## 3. WHAT EACH FIXTURE PROVES

| Fixture | The rule it proves | The requirement |
|---------|--------------------|-----------------|
| `routine-clean` | A routine block parses, passes every invariant and lists | REQ-001, REQ-007 |
| `routine-trigger-conflict` | One source of truth decides when a bot runs | REQ-002 |
| `routine-tell-with-targets` | `does: tell` and `delivery` cannot both name the policy | REQ-003 |
| `routine-starts-empty` | A routine with no start is refused rather than ignored | REQ-008 |
| `routine-starts-multiple-cron` | A second cron entry is refused by name | REQ-009 |
| `routine-starts-cron-not-first` | A cron entry past index 0 is refused by name | REQ-009 |
| `routine-starts-multiple` | Any other second entry is refused by name | REQ-009 |
| `routine-until-check-without-outcome` | A check with no outcome is refused | REQ-011 |
| `routine-until-shell-metacharacters` | Prose is never executed by accident | REQ-011 |
| `routine-floor` | A standing instruction under fifteen minutes is refused | REQ-005 |

---

## 4. THE FIXTURES README

`.skilled/skills/system-skilled-bots/scripts/fixtures/README.md` gains ten rows, one per folder, in the shape its existing table uses. Its section 1 sentence that the folder set equals `clean` plus one folder per hard invariant becomes `clean` plus `routine-clean` plus one folder per hard invariant, because `routine-clean` is a second clean checkout rather than a defect. [SOURCE: .skilled/skills/system-skilled-bots/scripts/fixtures/README.md:17]

The reason `routine-clean` is a second clean folder rather than an addition to `clean` is that the routine fixtures need three bots and a `routine` block, and adding them to `clean` would change what every existing defect fixture is a copy of.

---

## 5. THE COMMANDS

Run from the repository root, with no tty.

```bash
for d in .skilled/skills/system-skilled-bots/scripts/fixtures/routine-*; do node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs "$d" >/dev/null 2>&1; rc=$?; echo "${d##*/} $rc"; done
```

The ten lines it must print, one per folder, are `routine-clean 0` and `1` for each of the nine defect folders.

```bash
node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-clean
```

Exits 0 and prints one `PASS:` line per invariant, including `PASS: routine-floor-15-minutes: ...` for the clean checkout's two cron starts.

```bash
node .skilled/skills/system-skilled-bots/scripts/bot-check.cjs .skilled/skills/system-skilled-bots/scripts/fixtures/routine-floor
```

Exits 1 and prints `FAIL: routine-floor-15-minutes: ...`.

---

## 6. DECISIONS TAKEN

| Decision | Why |
|----------|-----|
| `routine-clean` is a second clean checkout, not an addition to `clean` | Adding three bots to `clean` would change what every existing defect fixture is a copy of, and the folder-set rule would then need a second exception |
| The clean checkout holds three bots | Two routine bots prove the list prints two rows and the third proves a bot with no block is not a row. One bot could not prove both |
| `digest` carries `until` and no `until_check` | It is the case REQ-011 names: the routine parses and never completes. A clean checkout that only held the complete case would leave that branch untested |
| The three `starts` names have a fixed precedence | Two of them can fire on one fixture, and a test that asserts one name needs one name to be reported |
| The floor fixture is `routine-floor` | The folder names the rule and the invariant id names the bound, which is the shape the existing fixtures use |

---

## 7. CHECK THIS FILE

Each command prints the number on the line after it.

```bash
rg -c '^\| `routine-[a-z-]+` \| `digest/BOT\.md`' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/fixtures.md
# prints 9
rg -c '^`routine-clean/bots/' specs/system-skilled-bots/003-openbot-parity-build/002-routine-layer/design/fixtures.md
# prints 4
```
