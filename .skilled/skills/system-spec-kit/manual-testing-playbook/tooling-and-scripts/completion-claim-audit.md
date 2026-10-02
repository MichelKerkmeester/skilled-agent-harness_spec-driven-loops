---
title: "462 -- Completion claim audit"
description: "This scenario validates the completion claim audit for `462`. It focuses on a default run over the synthetic rows with a stub first on the path that starts no backend and prints no row text, and the suite that proves zero model calls."
version: 2.5.0.0
---

# 462 -- Completion claim audit

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `462`.

---

## 1. OVERVIEW

This scenario validates the completion claim audit for `462`. It focuses on a default run over the synthetic rows with a stub first on the path that starts no backend and prints no row text, and the suite that proves zero model calls.

### Why This Matters

The audit scores the completion-claim detector on turn text and calls no model on its default run, so the census shape has to be provable without any credential. A run over the synthetic rows shows the census and the label gate without opening a real session, and a stub `jev` binary first on the path shows that no backend starts.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `462` and confirm the expected signals without contradictory evidence.

- Objective: confirm that a default run over the synthetic rows prints the census lines and a last line `stop: fewer than 30 labeled rows`, starts no stub and exits 0, that the two working-tree status captures match, and that the suite reports 14 passed
- Real user request: `Where does the completion-claim detector fire, and can I find out without calling a model?`
- Prompt: `Run the completion claim audit on the synthetic rows with a stub first on the path, confirm nothing was called or changed, then run its test suite.`
- Expected execution process: the working-tree status is captured, a stub `jev` executable that logs every call is placed first on `PATH`, the audit runs over `tests/completion-claim-audit-fixtures/census-happy.jsonl` with no arm switch, the stub logs are read, the status is captured again and compared and the vitest suite runs.
- Expected signals: step 3 prints `rows: 12 fires: 10`, `words: completed=1 resolved=1 fixed=1 finished=1 shipped=1 released=1 deployed=1 implemented=1 occurred=1 happened=1`, `labels: none`, `labeled: 0 (yes 0, no 0)`, `regex accuracy: n/a (no labels)`, `regex false fires: 0 (by word: none)`, `regex missed claims: 0 (by word: none)`, `margin: 0.10`, one line starting `keep rule:`, one line starting `power:` and a last line `stop: fewer than 30 labeled rows`, with no fixture row text on stdout and exit 0. Step 4 prints nothing. Step 5 prints nothing. Step 6 reports 14 passed and exits 0.
- Desired user-visible outcome: the census counts, the stop line and a statement that nothing was called or changed, with the evidence.
- Pass/fail: PASS if every signal holds. FAIL if a line is missing, step 4 prints a log line, step 5 shows a change or a test fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the completion claim audit on the synthetic rows with a stub first on the path, confirm nothing was called or changed, then run its test suite.`

### Commands

1. `git status --porcelain > /tmp/cca-462-before.txt`
2. `mkdir -p /tmp/cca-462-stub && printf '#!/bin/sh\nname=${0##*/}\necho $name $* >> /tmp/cca-462-stub/$name.log\nexit 2\n' | tee /tmp/cca-462-stub/jev > /dev/null && chmod +x /tmp/cca-462-stub/jev`
3. `cd .skilled/skills/system-spec-kit/runtime && PATH=/tmp/cca-462-stub:$PATH node scripts/completion-claim-audit/score-completion-claims.mjs --rows tests/completion-claim-audit-fixtures/census-happy.jsonl`
4. `find /tmp/cca-462-stub -name '*.log' -print`
5. `git status --porcelain | diff /tmp/cca-462-before.txt -`
6. `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/completion-claim-audit.vitest.ts`

### Expected

Step 3 prints the census lines the scenario contract names and exits 0. Step 4 prints nothing. Step 5 prints nothing. Step 6 reports 14 passed and exits 0.

### Evidence

Capture step 3's stdout and exit status, step 4's empty output, step 5's empty diff and the suite's summary line with its exit status.

### Pass / Fail

- **Pass**: every named line is present, step 4 prints nothing, step 5 prints nothing and the suite passes.
- **Fail**: a named line is missing, step 4 prints a log line, step 5 shows a change or a test fails.

### Failure Triage

1. When step 3 exits 2, the run refused its command line: a `--out` inside the repository prints `refused: report directory inside the repository`, so name a folder under `/tmp`.
2. When step 5 shows a change, name the path, because every run writes only under `/tmp`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/completion-claim-audit.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Prints the census lines, the label-gate stop line and the arm lines, and writes the report |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Fourteen cases over the fixtures, with a stub `jev` binary first on the path |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl` | The twelve synthetic rows the census run reads |

Provenance: runtime/tests/completion-claim-audit.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 462
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/completion-claim-audit.md`
