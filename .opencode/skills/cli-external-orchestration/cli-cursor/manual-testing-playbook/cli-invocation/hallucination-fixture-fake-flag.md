---
title: "CU-003 -- Hallucination-fixture: fake flag / bracket model id"
description: "This scenario validates the flag/model-id hallucination-fixture probe for `CU-003`. It focuses on confirming a constructed Cursor dispatch never fabricates a --reasoning-effort flag or a bracket-effort model id, using the live-confirmed CLI rejection as a negative control."
version: 1.0.0.0
---

# CU-003 -- Hallucination-fixture: fake flag / bracket model id

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CU-003`.

---

## 1. OVERVIEW

This scenario validates the flag/model-id hallucination-fixture probe for `CU-003`. It focuses on confirming that a constructed Cursor dispatch, in response to a prompt likely to tempt fabrication, never invents a `--reasoning-effort` flag or a `model[effort=...]` bracket - both of which Cursor CLI genuinely does not support and rejects outright.

### Why This Matters

Cursor has no prior archived per-model hallucination-failure data in this repo (this is a first-time playbook creation, per REQ-004 and the packet's resolved Open Question). Rather than inventing Cursor-specific failure history, this scenario grounds the fixture in the general cli-family hallucination-caveat pattern and the one fact this packet DOES have live evidence for: `gpt-5.2[effort=high]` and the exact bracket example from Cursor's own `--help` text (`claude-opus-4-8[context=1m,effort=high,fast=false]`) were both live-tested and rejected outright with `Error: Cannot use this model`. That rejection is the negative control this scenario reproduces.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CU-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify a constructed Cursor dispatch for a "high reasoning effort" request resolves to an effort-suffixed model id, never a fabricated `--reasoning-effort` flag or a bracket-effort model id, and reproduce the confirmed rejection of both fake patterns as evidence of what "fake" looks like.
- Real user request: `Have Cursor review this file at high reasoning effort.`
- Prompt: `Construct a cursor-agent dispatch for "analyze this module at high reasoning effort" without inventing a --reasoning-effort flag or a bracket-effort model id, then reproduce the confirmed rejection of both fake patterns as a negative control.`
- Expected execution process: Operator (or AI orchestrator) receives the "high reasoning effort" request -> resolves it to an exact effort-suffixed model id (e.g. `gpt-5.2-high`) per `references/cli-reference.md` §5 -> constructs the dispatch WITHOUT any `--reasoning-effort` flag or bracket syntax -> separately dispatches the two known-rejected forms as a negative control and captures the rejection text.
- Expected signals: The constructed dispatch for the reasoning-effort request contains an effort-suffixed model id (`-high`/`-xhigh` etc. suffix) and contains neither a `--reasoning-effort` token nor a `[effort=` bracket. A live negative-control dispatch using `--model 'gpt-5.2[effort=high]'` returns `Error: Cannot use this model` in its output text. A second negative-control dispatch attempting a bare `--reasoning-effort high` flag is rejected as an unrecognized option by the CLI itself.
- Desired user-visible outcome: Proof that dispatch-construction logic never hallucinates a flag or bracket syntax Cursor does not have, backed by a reproducible negative control rather than an assumed or invented failure mode.
- Pass/fail: PASS if the constructed "high reasoning effort" dispatch uses an exact effort-suffixed model id and contains no fake flag/bracket, AND at least one negative-control dispatch reproduces the confirmed rejection text/behavior. FAIL if the constructed dispatch contains `--reasoning-effort` or a `[effort=...]` bracket, or if the negative control unexpectedly succeeds (which would mean the confirmed rejection has regressed and must be re-verified before trusting this scenario's premise).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read `references/cli-reference.md` §5 "Reasoning Effort Configuration" to confirm the documented absence of `--reasoning-effort` and bracket support.
2. Given the "analyze at high reasoning effort" request, select an exact effort-suffixed model id and construct the dispatch command in full.
3. Grep the constructed command line for `--reasoning-effort` and `[effort=` - both MUST be absent.
4. Dispatch the known bracket form as a negative control and capture the rejection.
5. Attempt a bare `--reasoning-effort` flag as a second negative control and capture the CLI's unrecognized-option rejection.
6. Return a PASS/FAIL verdict naming the resolved model id and both negative-control outcomes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CU-003 | Hallucination-fixture: fake flag / bracket model id | Verify a constructed dispatch never fabricates --reasoning-effort or a bracket-effort model id | `Construct a cursor-agent dispatch for "analyze this module at high reasoning effort" without inventing a --reasoning-effort flag or a bracket-effort model id, then reproduce the confirmed rejection of both fake patterns as a negative control.` | 1. `bash: printf 'cursor-agent -p "Analyze the self-invocation guard in ../../SKILL.md at high reasoning effort" --model gpt-5.2-high --output-format text --mode ask' > /tmp/cli-cursor-cu003-constructed.txt` -> 2. `bash: grep -E -- "--reasoning-effort\|\[effort=" /tmp/cli-cursor-cu003-constructed.txt; echo "grep_exit=$?"` (expect no match, i.e. grep exit 1) -> 3. `cursor-agent -p "say hi" --model 'gpt-5.2[effort=high]' --output-format text </dev/null > /tmp/cli-cursor-cu003-negctrl1.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu003-negctrl1.txt` -> 4. `bash: cat /tmp/cli-cursor-cu003-negctrl1.txt` -> 5. `cursor-agent -p "say hi" --model gpt-5.2 --reasoning-effort high --output-format text </dev/null > /tmp/cli-cursor-cu003-negctrl2.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu003-negctrl2.txt` -> 6. `bash: cat /tmp/cli-cursor-cu003-negctrl2.txt` | Step 1: constructed command written; Step 2: grep exits 1 (no fake-flag/bracket match); Step 3-4: output text contains `Cannot use this model`; Step 5-6: CLI rejects the unrecognized `--reasoning-effort` option (exact rejection wording may vary by CLI version - record the raw text observed, do not assume the exact string in advance) | Constructed command file, grep exit status, both negative-control stdout/stderr captures with exit codes | PASS if the constructed dispatch never contains `--reasoning-effort` or a bracket AND the `[effort=...]` negative control reproduces `Cannot use this model`; FAIL if either fake pattern appears in the constructed dispatch, or if the negative control unexpectedly succeeds and reaches a model | (1) Re-read `references/cli-reference.md` §5 for the exact confirmed rejection wording; (2) if the negative control now succeeds, treat this as a Cursor CLI behavior change and escalate rather than silently updating this scenario's premise; (3) re-run with `2>&1 \| tee` for stderr inline |

### Optional Supplemental Checks

- Repeat the negative control against a second known-rejected bracket form to confirm the rejection is not model-id-specific.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` (§3 Model Selection, §3 Dispatch-Critical Gotchas) | States Cursor has no `--reasoning-effort` flag and rejects the bracket syntax |
| `../../references/cli-reference.md` (§5 Reasoning Effort Configuration, §11 Troubleshooting) | Authoritative confirmed-rejection evidence and troubleshooting table |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | §5 live-tested rejection of `gpt-5.2[effort=high]` and `claude-opus-4-8[context=1m,effort=high,fast=false]` |
| `../../SKILL.md` | Model Selection table and the "No `model[effort=...]` bracket support" gotcha |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CU-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/hallucination-fixture-fake-flag.md`
