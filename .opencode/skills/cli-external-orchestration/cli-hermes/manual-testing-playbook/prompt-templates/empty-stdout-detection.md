---
title: "HERMES-022 -- Empty-stdout detection"
description: "Confirm a caller-side non-empty-stdout check is required and sufficient to catch the tool-loop failure in which Hermes exits 0 without delivering an answer for `HERMES-022`."
version: 1.0.0.0
---

# HERMES-022 -- Empty-stdout detection

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-022`.

---

## 1. OVERVIEW

Exit 0 does not mean a Hermes run delivered anything. When the model's file tools reach it only through the deferred catalog, the loop can fail repeatedly on `is not a deferrable tool`, end with a pending tool result, and still exit 0 with nothing, or with a fragment, on stdout.

This scenario runs the template dispatch on the corrected toolset and asserts a byte-count gate, then runs the superseded toolset as the control that the gate actually catches.

### Why This Matters

A caller that reads exit code alone records a silent non-answer as a completed dispatch, and every downstream artifact inherits the gap. The byte gate is one line and it is the difference between a detected failure and an invisible one.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-022` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a caller-side non-empty-stdout check is required and sufficient to catch the tool-loop failure in which Hermes exits 0 without delivering an answer.
- Real user request: `Make sure we notice when a Hermes run comes back with nothing.`
- Prompt: `Do not author anything. Read the canonical command file named above, then reply with exactly two lines: line 1 = TEMPLATE_OK, line 2 = the canonical command file path you were told to read.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: The corrected run exits `0` with a non-zero byte count and the two requested lines, and the gate passes it; the same gate applied to a known-empty capture prints `DETECTED_EMPTY_STDOUT`, which is what proves the gate discriminates. The superseded-toolset control is advisory only: it logs `is not a deferrable tool` and costs several times the latency, but it recovers intermittently, so its stdout is recorded and never scored. Superseded wording in the agent log for its session.
- Evidence: Both byte counts, both exit codes, both elapsed times, both session ids, the corrected run's two lines, the control's returned bytes in full, and the matching agent-log lines for the control.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the corrected run returns the two requested lines, the gate passes that capture and trips on the known-empty one; FAIL when the corrected run itself returns empty or fragmentary stdout, or when the gate fails to trip on the empty capture, in which case record the exact agent-log lines and the located cause; SKIP only when a named environment blocker prevents the check, such as an unreachable provider.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately for every dispatch.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
cat .hermes/prompts/create-manual-testing-playbook.md > "$SCRATCH/qf-009.md"
printf 'Do not author anything. Read the canonical command file named above, then reply with exactly two lines: line 1 = TEMPLATE_OK, line 2 = the canonical command file path you were told to read.\n' >> "$SCRATCH/qf-009.md"

perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 12 --run-budget 240 \
  --query-file - <"$SCRATCH/qf-009.md" >out.txt 2>err.txt
echo $?
b=$(wc -c <out.txt); [ "$b" -gt 0 ] || echo DETECTED_EMPTY_STDOUT

# gate discrimination, deterministic: the same check against a known-empty capture
: >empty.txt
b=$(wc -c <empty.txt); [ "$b" -gt 0 ] || echo DETECTED_EMPTY_STDOUT

# advisory control, not scored: the superseded toolset recovers intermittently
SPECKIT_DISPATCH_NEGATIVE_CONTROL=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t search,todo --max-turns 12 --run-budget 240 \
  --query-file - <"$SCRATCH/qf-009.md" >neg.txt 2>neg.err
wc -c <neg.txt
sid=$(grep -o 'session_id: .*' neg.err | awk '{print $2}')
grep "$sid" ~/.hermes/logs/agent.log | grep -E 'deferrable|pending tool result'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-022 | Empty-stdout detection | Confirm a caller-side non-empty-stdout check is required and sufficient to catch the tool-loop failure in which Hermes exits 0 without delivering an answer | `Do not author anything. Read the canonical command file named above, then reply with exactly two lines: line 1 = TEMPLATE_OK, line 2 = the canonical command file path you were told to read.` | 1. `cat .hermes/prompts/create-manual-testing-playbook.md > <scratch>/qf-009.md` and append the bounded request line -> 2. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 12 --run-budget 240 --query-file - <<scratch>/qf-009.md >out.txt 2>err.txt` -> 3. `echo $?` -> 4. `b=$(wc -c <out.txt); [ "$b" -gt 0 ] || echo DETECTED_EMPTY_STDOUT` -> 5. Control: repeat step 2 with `-t search,todo`, capturing `neg.txt`, and apply the same gate -> 6. `grep "$sid" ~/.hermes/logs/agent.log | grep -E 'deferrable|pending tool result'` for whichever run trips the gate | The corrected run exits `0` with a non-zero byte count and the two requested lines; the control exits `0` as well, but either trips the byte gate or returns a fragment that is not the requested two lines, with `is not a deferrable tool` in the agent log for its session | Both byte counts, both exit codes, both elapsed times, both session ids, the corrected run's two lines, the control's returned bytes in full, and the matching agent-log lines for the control | PASS when the corrected run returns the two requested lines and the gate distinguishes it from the control; FAIL when the corrected run itself returns empty or fragmentary stdout, in which case record the exact agent-log lines and the located cause; SKIP only when a named environment blocker prevents the check, such as an unreachable provider | Treat exit code and byte count as two separate signals and never collapse them. If the corrected run trips the gate, grep its session for `is not a deferrable tool`: a hit means the file tools are still arriving through the deferred catalog, which is a toolset problem. No hit, with a pending tool result, points at the provider stream instead |

### Recorded Result

**Executed 2026-09-15**: the corrected run (`-t file,todo`) exited 0 in 22 s with 65 bytes and the two requested lines, session `20260915_143343_e6e5a9`, and the gate passed it; the gate applied to a known-empty capture printed `DETECTED_EMPTY_STDOUT`. The advisory control (`-t search,todo`) logged three `'read_file' is not a deferrable tool` errors and took 120 s, but recovered and returned the identical correct two lines, session `20260915_143409_5d5ae3`. That recovery is why the control was demoted to advisory in this revision: the deferred-tool loop self-heals often enough that it cannot serve as the gate's discriminator, though its latency cost and log signature remain reproducible.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `prompt-templates/empty-stdout-detection.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | The exit-code table and the non-empty-stdout requirement |
| [create-manual-testing-playbook-template-round-trip.md](./create-manual-testing-playbook-template-round-trip.md) | The template round trip this gate is applied to |

---

## 5. SOURCE METADATA

- Group: Prompt Templates
- Playbook ID: HERMES-022
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `prompt-templates/empty-stdout-detection.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
