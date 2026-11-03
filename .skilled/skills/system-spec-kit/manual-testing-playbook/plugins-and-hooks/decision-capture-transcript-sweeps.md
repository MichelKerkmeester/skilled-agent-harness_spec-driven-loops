---
title: "decision-capture-transcript-sweeps -- Decision capture transcript sweeps"
description: "This scenario validates the decision-capture transcript sweeps for `decision-capture-transcript-sweeps`. It focuses on recovering answered questions from Claude, OpenCode and Devin sessions into the queue exactly once."
trigger_phrases:
  - "decision capture sweep"
  - "devin transcript sweep"
  - "opencode session sweep"
version: 1.0.1.0
---

# decision-capture-transcript-sweeps -- Decision capture transcript sweeps

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `decision-capture-transcript-sweeps`.

---

## 1. OVERVIEW

This scenario validates the decision-capture transcript sweeps for `decision-capture-transcript-sweeps`. It focuses on recovering answered questions from Claude, OpenCode and Devin sessions into the queue exactly once.

The save step runs one sweep per runtime before it writes decisions. `sweep-transcript.mjs` reads a Claude JSONL transcript and also lists plain chat questions. `sweep-opencode.mjs` reads OpenCode's SQLite store read-only, and `sweep-devin.mjs` reads a Devin transcript. Each appends what it finds to the same queue, and a key already queued is never written twice.

### Why This Matters

The live hooks on Claude, OpenCode and Devin only see answers while they are registered and loaded, so an answer given while a hook was off or failing reaches the queue only through a sweep. The sweeps are what make a save complete, so a sweep that misses an answer, keeps a Gate 3 question or writes a duplicate puts the wrong thing in the decision record.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `decision-capture-transcript-sweeps` and confirm the expected signals without contradictory evidence.

- Objective: Prove the three sweeps recover answered product questions from redacted real samples, drop process questions and rejected calls, and append nothing on a second run.
- Real user request: `Before I save, can you make sure the sweeps pick up the questions I answered in Devin and OpenCode, and don't double up if I run them twice?`
- Prompt: `Run the decision-capture sweeps on their sample sessions and tell me whether each answered question is queued once and the Gate 3 question is left out.`
- Expected execution process: Run the commands in section 3 from the repository root. The CLI step runs from a scratch folder, so its queue lands there and not in the repository.
- Expected signals: the three sweep suites report `fail 0`; the first Devin CLI run prints `"recovered": 2` and the second prints `"recovered": 0`; the scratch queue holds 2 lines, one answered `Marketplace in settings` and one answered `all 4, use subagents`; no queued line mentions `Spec folder`.
- Desired user-visible outcome: A PASS or FAIL verdict with the recovered counts and the two queued answers.
- Pass/fail: PASS if every expected signal is observed, FAIL if a count differs, a Gate 3 question is queued, or a queue appears inside the repository.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the decision-capture sweeps on their sample sessions and tell me whether each answered question is queued once and the Gate 3 question is left out.`

### Commands

1. `node --test .skilled/hooks/decision-capture/bin/sweep-transcript.test.mjs .skilled/hooks/decision-capture/bin/sweep-opencode.test.mjs .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs`
2. Run the Devin sweep twice from a scratch folder:

```bash
R="$PWD"; P="$(mktemp -d)"
(cd "$P" && node "$R/.skilled/hooks/decision-capture/bin/sweep-devin.mjs" --transcript "$R/.skilled/hooks/decision-capture/bin/fixtures/devin-transcript.json" | grep '"recovered"')
(cd "$P" && node "$R/.skilled/hooks/decision-capture/bin/sweep-devin.mjs" --transcript "$R/.skilled/hooks/decision-capture/bin/fixtures/devin-transcript.json" | grep '"recovered"')
wc -l "$P"/.skilled/skills/.state/decision-capture/*.jsonl
grep -o '"answer":"[^"]*"' "$P"/.skilled/skills/.state/decision-capture/*.jsonl
grep -c 'Spec folder' "$P"/.skilled/skills/.state/decision-capture/*.jsonl
```

Leave `$P` in place: it is a `mktemp -d` folder under the system temp directory.

### Expected

Step 1 ends with `fail 0`. In step 2 the first run prints `"recovered": 2`, the second `"recovered": 0`, the queue has 2 lines, the answers are `Marketplace in settings` and `all 4, use subagents`, and the `Spec folder` count is 0.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: Every expected signal in the Scenario Contract is observed in the captured output.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

1. A count of 1 instead of 2: check `isProcessQuestion` in `capture-core.mjs`; a work-menu option that starts with "Commit" must not mark a question as process unless the question is about shipping.
2. A second run that recovers more than 0: check the key check under the lock in `appendRecords`.
3. A failing OpenCode test: check the table checks in `loadOpenCodeParts`, since a store may hold only one of `part` and `session_message`.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario summary |

Feature catalog: [ux-hooks/operator-decision-capture.md](../../feature-catalog/ux-hooks/operator-decision-capture.md)

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/hooks/decision-capture/bin/sweep-transcript.mjs` | Claude transcript sweep and chat candidates |
| `.skilled/hooks/decision-capture/bin/sweep-opencode.mjs` | OpenCode SQLite reader |
| `.skilled/hooks/decision-capture/bin/sweep-devin.mjs` | Devin transcript reader |
| `.skilled/hooks/decision-capture/bin/fixtures/` | Redacted real Devin and OpenCode samples |
| `.skilled/hooks/decision-capture/bin/sweep-devin.test.mjs` | Regression suite |

Provenance: .skilled/hooks/decision-capture/bin/sweep-devin.test.mjs

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: decision-capture-transcript-sweeps
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/decision-capture-transcript-sweeps.md`
