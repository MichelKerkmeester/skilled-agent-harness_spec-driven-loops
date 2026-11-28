# Baseline corpus

The state of the playbook and the CLI before this phase added a file. Every number here was measured on 2026-11-26, before the first scenario of this phase was written.

## 1. The playbook before the addition

The package validator printed one line.

```text
PASS package=system-skilled-bots tier=FAIL_CLOSED scenarios=25 categories=7 operator=19 routing_gold_excluded=6 violations=0 warnings=0
```

The 25 scenarios sat in seven category folders: `hub-routing`, `bot-authoring`, `manual-run`, `worktree-and-delivery`, `request-queue`, `schedule-lifecycle` and `status-and-inbox`. The root index held fifteen sections, with the automated test cross-reference at 14 and the feature catalog index at 15.

## 2. The CLI verb table

`node .skilled/bin/bots.cjs --help` listed twelve distinct verbs.

```text
answer disable drain enable enqueue inbox pause resume run schedule status
```

The phase 011 spec records eleven at the time it was written, so the table has moved by one since then. The count is not load-bearing for this phase, and the list above is the measured one.

## 3. The verbs this phase's scenarios need

Nine verbs the corpus drives do not exist. Each probe prints `bots: unknown verb: <verb>` and exits 2.

```text
apps activity routines ui remember secret skill chat channel
```

`baseline-verbs.txt` holds the whole probe with its exit codes. The nine verbs belong to phases 001, 002, 003, 005, 007, 008, 009, 010 and 011, so no scenario in this phase can reach the behavior it asserts until those phases land.

## 4. The two fields that are absent without a verb

BOT-046 and BOT-047 drive verbs that already exist, so their blocker is a field rather than a verb.

- `rg -n 'working place|workingPlace|Working place' .skilled/skills/system-skilled-bots/runtime/lib/prompt.ts` exits 2 with `No such file or directory`, because phase 004 creates that module.
- `rg -n 'branch|worktree' .skilled/skills/system-skilled-bots/runtime/lib/status.ts` exits 1 with no output, so the status row carries neither field.

## 5. What the baseline means for the verdicts

A scenario that cannot reach its behavior records `SKIP` with its blocker. It does not record `FAIL`, because a `FAIL` is a claim about behavior the run observed, and this run observed a missing verb rather than a wrong answer. The 33 verdicts are therefore all `SKIP`, `failures.md` holds no failure row, and the run's own page says so.
