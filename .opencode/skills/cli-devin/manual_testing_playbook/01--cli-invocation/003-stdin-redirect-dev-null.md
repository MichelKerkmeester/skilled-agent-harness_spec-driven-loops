---
title: "DV-003 -- stdin redirect </dev/null"
description: "This scenario validates the family-wide convention that non-interactive / background `devin` dispatches require `</dev/null` to close stdin. Omitting it inside a while-read loop causes silent stdin theft."
---

# DV-003 -- stdin redirect </dev/null

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `DV-003`.

---

## 1. OVERVIEW

This scenario demonstrates the family-wide stdin-redirect convention for `DV-003`. Non-interactive / background `devin` dispatches must append `</dev/null` so the backgrounded process does not inherit the parent shell's stdin. Without it, a `while read` loop driving multiple dispatches will silently consume upcoming lines (the same failure mode documented for cli-codex and cli-opencode).

### Why This Matters

The stdin-redirect convention is one of the most subtle and load-bearing rules in the cli-* family. cli-codex / cli-opencode SKILL.md sections call it out explicitly because the failure is silent: the loop exits early with no error, and operators chase phantom dispatches. cli-devin inherits the convention; this scenario proves the failure mode reproduces and that the documented fix works.

---

## 2. SCENARIO CONTRACT

- Objective: Demonstrate that omitting `</dev/null` in a `while read` loop with backgrounded `devin` dispatches causes silent stdin theft, and that the documented `</dev/null` fix prevents the failure.
- Real user request: `Show me what happens when I background a devin dispatch inside a while-read loop without the </dev/null redirect, then show me the fix.`
- Prompt: `Dispatch devin in the background twice — once with </dev/null and once without — inside a while-read loop reading 3 prompts, and confirm the with-redirect run consumes all 3 prompts while the without-redirect run aborts early.`
- Expected execution process: Operator writes a 3-line prompt list to `/tmp/dv-003-prompts.txt` -> runs a `while read` loop that backgrounds `devin` WITHOUT `</dev/null` -> observes early loop exit -> reruns the loop WITH `</dev/null` -> observes all 3 iterations.
- Expected signals: Without-redirect run processes 1-2 iterations then exits (silent stdin theft). With-redirect run processes all 3 iterations. Both dispatched command lines visible in evidence.
- Desired user-visible outcome: A demonstrated failure mode that confirms the family convention and the documented fix.
- Pass/fail: PASS if without-redirect run dispatches fewer than 3 invocations AND with-redirect run dispatches exactly 3 invocations. FAIL if both runs dispatch the same number (failure mode not reproducible — investigate Devin's stdin handling).

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Write a 3-line prompt list to `/tmp/dv-003-prompts.txt`.
2. Run the without-redirect loop; count iterations.
3. Run the with-redirect loop; count iterations.
4. Compare counts; confirm the documented failure mode reproduces.
5. Return a PASS/FAIL verdict naming both iteration counts.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-003 | stdin redirect `</dev/null` | Demonstrate that backgrounded `devin` dispatches inside a while-read loop need `</dev/null` to avoid silent stdin theft | `Dispatch devin in the background twice — once with </dev/null and once without — inside a while-read loop reading 3 prompts, and confirm the with-redirect run consumes all 3 prompts while the without-redirect run aborts early.` | 1. `bash: printf 'Say hi in one word.\nSay bye in one word.\nSay ok in one word.\n' > /tmp/dv-003-prompts.txt` -> 2. `bash: count=0; while read line; do count=$((count+1)); devin "$line" --model swe-1.6 --permission-mode auto > /tmp/dv-003-no-redirect-$count.log 2>&1 & done < /tmp/dv-003-prompts.txt; wait; echo "Without redirect: $count iterations"` -> 3. `bash: count=0; while read line; do count=$((count+1)); devin "$line" --model swe-1.6 --permission-mode auto > /tmp/dv-003-with-redirect-$count.log 2>&1 </dev/null & done < /tmp/dv-003-prompts.txt; wait; echo "With redirect: $count iterations"` | Step 2: count is 1 or 2 (early exit); Step 3: count is 3 (all iterations dispatched) | Both terminal transcripts with iteration counts, individual `/tmp/dv-003-*.log` files | PASS if without-redirect count < 3 AND with-redirect count == 3; FAIL if both counts are 3 (failure not reproducible — investigate) | (1) Confirm Devin's stdin behavior with `devin --help`; (2) if failure not reproducible, raise as a family-doc accuracy issue — Devin may handle stdin differently from Codex/OpenCode |

### Optional Supplemental Checks

- Inspect the captured log files for evidence that without-redirect runs lost prompt content.
- Try the same pattern with a larger prompt list (10 lines) to confirm the failure scales.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../references/cli_reference.md` (§4 stdin handling) | Documents the `</dev/null` convention |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | §3 Stdin handling block + RULES ALWAYS #5 |
| `../../references/cli_reference.md` | Family-wide stdin-redirect convention reference |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: DV-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--cli-invocation/003-stdin-redirect-dev-null.md`
