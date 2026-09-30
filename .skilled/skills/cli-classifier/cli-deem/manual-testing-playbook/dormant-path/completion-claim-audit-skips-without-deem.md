---
id: "DEE-010"
title: "DEE-010 -- The completion-claim census stays dormant without Deem"
description: "This scenario validates that the completion-claim scorer prints its census, adds one skip line when the Deem arm cannot reach the server, and exits 0, for `DEE-010`."
version: 0.1.0.0
---

# DEE-010 -- The completion-claim census stays dormant without Deem

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DEE-010`.

---

## 1. OVERVIEW

The completion-claim scorer owns its own switch. Behind `--deem` it runs one `cli-deem health` check first. A failed check prints a skip line and leaves the census exactly as it would have been without the switch.

### Why This Matters

This is the caller contract the packet documents: a feature that can use Deem stays dormant on any non-zero health exit and keeps its previous behavior. The scenario proves the dormancy end to end, with the client's exit class becoming one named skip line rather than a change to the run.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DEE-010` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the scorer reaches the Deem gate, prints `deem arm skipped: not reachable`, exits 0 and changes nothing else in its output.
- Real user request: `Run the completion-claim census with the Deem arm while Deem is down.`
- Prompt: `Run the completion-claim census with the Deem arm while Deem is down.`
- Expected execution process: run the scorer with `--deem` and `--out` against the fixture census while `CLI_DEEM_URL` points at port 9, capture stdout and stderr, then compare the output with a run of the same command without `--deem`. Capture the out folder's contents.
- Expected signals: the exit status is `0`, the census lines match a run without `--deem`, the last stdout line is `deem arm skipped: not reachable`, and the out folder receives `report.json`.
- Evidence: both command runs, the diff between them, the exit statuses and the out folder listing.
- Desired user-visible outcome: the operator reads `deem arm skipped: not reachable` as the only added line and exit 0.
- Pass/fail: PASS when the exit status is 0 and the diff against the run without `--deem` is exactly the one skip line. FAIL when the scorer prints a health line, stops the run, or adds any other line. SKIP only when the fixture census is missing, naming that blocker.

---

## 3. TEST EXECUTION

### Exact Command Sequence

```bash
TMP="$(mktemp -d)"
CLI_DEEM_URL=http://127.0.0.1:9 node .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs \
  --rows .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl \
  --deem --out "$TMP"
echo "exit=$?"
```

Run the same command without `--deem` to obtain the comparison baseline, then diff the two outputs. The `--deem` switch requires `--out`, so the run record lands in `$TMP/report.json`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DEE-010 | The completion-claim census stays dormant without Deem | Confirm the scorer reaches the Deem gate, prints `deem arm skipped: not reachable`, exits 0 and changes nothing else in its output | `Run the completion-claim census with the Deem arm while Deem is down.` | 1. `bash: TMP="$(mktemp -d)"` -> 2. `bash: CLI_DEEM_URL=http://127.0.0.1:9 node .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs --rows .skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl --deem --out "$TMP"` -> 3. `bash: rerun without --deem and diff the two outputs` | exit `0`, census lines unchanged, last stdout line `deem arm skipped: not reachable`, `report.json` in the out folder | Both runs, the diff, both exit statuses and the out folder listing | PASS when the exit status is 0 and the diff against the run without `--deem` is exactly the one skip line. FAIL when the scorer prints a health line, stops the run, or adds any other line. SKIP only when the fixture census is missing, naming that blocker | 1. A `deem: health ...` line means a real server answered, so confirm `CLI_DEEM_URL` points at port 9. 2. Any diff line other than the skip line means the dormant path changed the census, so inspect `deemGate`. 3. Exit 2 means `--out` was omitted, because the `--deem` switch requires a run folder |

### Recorded Result

Observed while authoring: exit 0, and stdout ended with `stop: fewer than 30 labeled rows` followed by `deem arm skipped: not reachable`. The rest of stdout was unchanged from a run without `--deem`, with `diff` reporting exactly the one added skip line. The out folder received `report.json`. Verdict PASS.

### Failure Triage

1. A `deem: health ...` line means a real server answered. Confirm `CLI_DEEM_URL` points at port 9 for this run.
2. Any diff line other than the skip line means the dormant path changed the census. Inspect `deemGate` in `score-completion-claims.mjs`.
3. Exit 2 means `--out` was omitted. The `--deem` switch requires a run folder so every call is recorded.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| [SKILL.md](../../SKILL.md) | The caller contract: stay dormant on any non-zero health exit |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [score-completion-claims.mjs](../../../../system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs) | `deemCommand`, `readDeemHealth` and `deemGate` |
| [census-happy.jsonl](../../../../system-spec-kit/runtime/tests/completion-claim-audit-fixtures/census-happy.jsonl) | The fixture census the scenario runs against |

---

## 5. SOURCE METADATA

- Group: Dormant Path
- Playbook ID: DEE-010
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `dormant-path/completion-claim-audit-skips-without-deem.md`
- Prompt equality requirement: the SCENARIO CONTRACT prompt equals the 9-column table Exact Prompt cell and the root summary prompt.
