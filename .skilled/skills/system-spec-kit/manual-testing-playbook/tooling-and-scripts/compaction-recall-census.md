---
title: "460 -- Compaction recall census"
description: "This scenario validates the compaction recall census for `460`. It focuses on a run over the synthetic fixtures that prints one stop line and no fixture text, and on the suite that proves zero model calls."
version: 2.3.0.0
---

# 460 -- Compaction recall census

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `460`.

---

## 1. OVERVIEW

This scenario validates the compaction recall census for `460`. It focuses on a run over the synthetic fixtures that prints one stop line and no fixture text, and on the suite that proves zero model calls.

### Why This Matters

The census reads the operator's own sessions, so it has to stay read-only, call no model and keep transcript text out of its report. A run over the synthetic fixtures shows the report shape without opening a real transcript, and the suite checks that a stub `jev` binary first on the path is never called.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `460` and confirm the expected signals without contradictory evidence.

- Objective: confirm that a census run over the synthetic fixtures prints the method, scope and totals lines, one row per boundary and exactly one stop line, names the two broken fixtures, changes no tracked file and writes a report with no canary string, and that the suite passes
- Real user request: `What do our compactions actually keep, and can I find out without calling a model?`
- Prompt: `Run the compaction recall census on the test fixtures, confirm it printed one stop line and no fixture text, then run its test suite.`
- Expected execution process: the working-tree status is captured, the census runs over the fixture folder with its report in a temporary folder, the status is captured again and compared, the report is searched for the canary string and the vitest suite runs.
- Expected signals: stdout starts with the `method:` line, then `scope: 6 main-session files, 0 subagent files, 4 boundaries (4 main, 0 subagent)`, four lines starting `row `, one line starting `totals:` and a last line starting `stop:`. stderr names `unknown-type.jsonl:3` and `malformed-line.jsonl:2`, and the exit status is 1 because those two fixtures stop. The two status captures match, and the canary count in the report is 0. The suite reports 12 passed.
- Desired user-visible outcome: the stop line, the per-row counts and a statement that nothing was called or changed, with the evidence.
- Pass/fail: PASS if every signal holds. FAIL if a line is missing, a second stop line prints, a tracked file changed, the report holds the canary string or a test fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the compaction recall census on the test fixtures, confirm it printed one stop line and no fixture text, then run its test suite.`

### Commands

1. `git status --porcelain > /tmp/crc-before.txt`
2. `node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs --transcripts .skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures --out /tmp/crc-460/report.json`
3. `git status --porcelain | diff /tmp/crc-before.txt -`
4. `grep -c CANARY- /tmp/crc-460/report.json`
5. `cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/compaction-recall.vitest.ts`

### Expected

Step 2 exits 1, prints the stdout lines the scenario contract names and writes the two parse errors to stderr. Step 3 prints nothing. Step 4 prints 0. Step 5 reports 12 passed and exits 0.

### Evidence

Capture step 2's stdout, stderr and exit status, step 3's empty diff, step 4's count and the suite's summary line with its exit status.

### Pass / Fail

- **Pass**: every named line is present, one stop line prints, step 3 prints nothing, step 4 prints 0 and the suite passes.
- **Fail**: a named line is missing, a second stop line prints, step 3 shows a change, step 4 prints more than 0 or a test fails.

### Failure Triage

1. A `stop: census void (free text in report)` line with no report file means a string outside the allowed classes reached the report. Run the suite's canary case and read which row field changed.
2. When step 3 shows a change, name the path, because the census writes nothing but its report.
3. When only the replay case fails, rebuild the runtime with `npm run build` under `.skilled/skills/system-spec-kit/runtime`, because `--replay` imports the built brief builder.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/compaction-recall-census.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs` | Picks the sessions, scores every boundary and prints the report and the stop line |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall.vitest.ts` | Twelve cases over the fixtures, with a stub `jev` binary first on the path |
| `.skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures/clean.jsonl` | One of the six synthetic transcripts the run reads |

Provenance: runtime/tests/compaction-recall.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 460
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/compaction-recall-census.md`
