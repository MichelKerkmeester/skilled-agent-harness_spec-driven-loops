---
title: "CO-020 -- Fork session (--fork) and the --share prohibition"
description: "This scenario validates the `--fork` surface for `CO-020`. It focuses on confirming `--fork` (with `--continue` or `--session`) branches an existing session, and that SKILL.md NEVER rule 2 forbids `--share` because it is not a `run` flag."
version: 1.4.12.0
---

# CO-020 -- Fork session (--fork) and the --share prohibition

**Version note.** These commands target OpenCode 2 (2.3.2). Check that `opencode models --standalone` lists the `llmgateway/` prefix of the model you pass to `-m` first; `llmgateway/deepseek-v4.1-flash-1017` is the default, while `opencode-go/` stays selectable and needs its own login (`opencode auth login opencode-go`). `--share` is not a `run` flag, so no dispatch passes it.

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CO-020`.

---

## 1. OVERVIEW

This scenario validates the fork and share-prohibition check for `CO-020`. It focuses on confirming `--fork` (used with `--continue` or `--session`) branches an existing session into a new id (per `references/cli-reference.md` §4) AND that SKILL.md NEVER rule 2 forbids `--share` because it is not a `run` flag and publishes nothing.

### Why This Matters

`--fork` enables exploration paths from a known-good session checkpoint without losing the original. This is essential for ablation experiments and "what if" investigations. `--share` publishes nothing: it is not a `run` flag, so the scenario checks that the skill forbids it. If `--fork` silently overwrites the original session, the fork safety story collapses. This test validates the fork contract and the share prohibition.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CO-020` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--fork` (with `--continue` or `--session <id>`) creates a new session id distinct from the parent and confirm SKILL.md NEVER rule 2 forbids `--share` because it is not a `run` flag.
- Real user request: `Run an opencode run, then fork it with --fork --continue and verify the forked dispatch has a NEW session id (not the parent's). Also confirm the cli-opencode skill rules forbid --share and say it publishes nothing.`
- RCAF Prompt: `As an external-AI conductor verifying both --fork and --share contracts, (1) dispatch a first turn and capture its session id, (2) dispatch a second turn with --fork --continue and capture the new session id, (3) verify the new session id is distinct from the first turn's id, AND (4) grep the cli-opencode SKILL.md NEVER rules to confirm --share is forbidden because it is not a run flag. Return a concise pass/fail verdict naming both session ids and quoting the --share prohibition.`
- Expected execution process: External-AI orchestrator dispatches a first turn, captures the `sessionID`, dispatches a second turn with `--fork --continue`, captures the new `sessionID`, validates it is distinct and greps the SKILL.md NEVER section for the `--share` prohibition.
- Expected signals: Both dispatches exit 0. Turn 1 `sessionID` and turn 2 `sessionID` are distinct. SKILL.md NEVER rule 2 forbids `--share` and states it publishes nothing.
- Desired user-visible outcome: Verdict naming both session ids (truncated), confirming distinct and quoting the `--share` prohibition.
- Pass/fail: PASS if both exit 0 AND the `sessionID` values are distinct AND the `--share` prohibition is found in the SKILL.md NEVER section. FAIL if the `sessionID` values match (fork did not branch) or the prohibition is missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. In ONE shell invocation: dispatch turn 1, capture `SID1`, dispatch turn 2 with `--fork --continue`, capture `SID2`, and compare them. A later, separate shell would see both variables empty since numbered playbook steps do not share shell state.
3. Grep SKILL.md NEVER rules for the `--share` prohibition.
4. Return a verdict naming both ids and quoting the `--share` prohibition.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CO-020 | Fork session and `--share` prohibition | Confirm `--fork --continue` creates a new session id distinct from parent, and that SKILL.md NEVER rule 2 forbids `--share` because it is not a `run` flag | `As an external-AI conductor verifying both --fork and --share contracts, (1) dispatch a first turn and capture its session id, (2) dispatch a second turn with --fork --continue and capture the new session id, (3) verify the new session id is distinct from the first turn's id, AND (4) grep the cli-opencode SKILL.md NEVER rules to confirm --share is forbidden because it is not a run flag. Return a concise pass/fail verdict naming both session ids and quoting the --share prohibition.` | 1. `bash: opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json "Briefly say hello and acknowledge this is turn 1 of a fork test." > /tmp/co-020-turn1.jsonl 2>&1 </dev/null; echo "TURN1: $?"; SID1=$(jq -r 'select(.type == "step_start") \| .sessionID' /tmp/co-020-turn1.jsonl \| head -1); echo "SID1=$SID1"; opencode run --standalone -m llmgateway/deepseek-v4.1-flash-1017#max --format json --fork --continue "Briefly acknowledge this is the forked turn." > /tmp/co-020-turn2.jsonl 2>&1 </dev/null; echo "TURN2: $?"; SID2=$(jq -r 'select(.type == "step_start") \| .sessionID' /tmp/co-020-turn2.jsonl \| head -1); echo "SID2=$SID2"; [ "$SID1" != "$SID2" ] && [ -n "$SID1" ] && [ -n "$SID2" ] && echo "FORK_OK: distinct session ids" \|\| echo "FORK_FAIL: ids identical or empty"` -> 2. `bash: grep -nE -- '--share' .skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md \| head -5` | Step 1 (single shell): TURN1 exit 0. SID1 captured non-empty. TURN2 exit 0. SID2 captured non-empty. Prints `FORK_OK: distinct session ids`. Step 2: NEVER rule 2 states `--share` is not a `run` flag and publishes nothing | `/tmp/co-020-turn1.jsonl`, `/tmp/co-020-turn2.jsonl`, captured SID1 + SID2 in terminal, grep matches | PASS if both exit 0 AND SID1 != SID2 AND SKILL.md NEVER rule 2 forbids `--share`. FAIL if ids match (fork failed), either is empty, or the prohibition is missing | 1. If `--fork` is rejected with "requires --continue or --session", spell the parent flag explicitly. 2. If SID1 and SID2 match, the fork silently degraded to a continue, so file a bug. 3. If SID1 or SID2 print empty, the launch and capture steps were accidentally split across separate tool-call shells. Re-run as one shell block. 4. If NEVER rule 2 no longer forbids `--share`, the share prohibition has regressed. File a P0 documentation bug. 5. NEVER pass `--share` in this test: it is not a `run` flag and publishes nothing |

### Optional Supplemental Checks

For independent-session verification, run `opencode session export "$SID1"` and `opencode session export "$SID2"` (same shell as the capture, or re-export by pasting the printed ids) and confirm both succeed and return their respective ids. This proves the fork actually created a second, independently addressable session, not just a renamed parent.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../references/cli-reference.md` (§4 `--fork` row + §8 STATE LOCATION AND SHARE URLS) | Fork and share-prohibition contract documentation (`--share` publishes nothing) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | NEVER rule 2 (`--share` is not a `run` flag, so no dispatch passes it) and §3 default invocation |
| `../../references/cli-reference.md` | §8 share URL note (`--share` publishes nothing) |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CO-020
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `session-continuity/fork-and-share.md`
