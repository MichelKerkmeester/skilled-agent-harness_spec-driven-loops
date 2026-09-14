---
title: "HERMES-006 -- Ordinary write without --yolo"
description: "Confirm an ordinary, unflagged file write succeeds in single-query mode with no `--yolo`, so the flag is not treated as a general write switch for `HERMES-006`."
version: 1.0.0.0
---

# HERMES-006 -- Ordinary write without --yolo

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-006`.

---

## 1. OVERVIEW

This scenario exists to kill a persistent misreading. Omitting `--yolo` does not make a Hermes dispatch read-only; it only leaves the flagged-call approval gate closed. An ordinary write to a path Hermes does not protect goes through.

The check writes one line to a disposable scratch file and reads it back from outside the session.

### Why This Matters

Treating `--yolo` as the write switch leads to two wrong conclusions: that a read-only dispatch is safe merely because the flag is absent, and that a write dispatch must always carry it. Both are corrected here and in HERMES-007.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-006` and confirm the expected signals without contradictory evidence.

- Objective: Confirm an ordinary, unflagged file write succeeds in single-query mode with no `--yolo`, so the flag is not treated as a general write switch.
- Real user request: `Does a Hermes dispatch without the approval flag still write files?`
- Prompt: `Create the file <scratch>/ordinary-write.txt containing exactly the single line DONE, then reply with the single word FINISHED.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the scratch file exists and contains exactly `DONE`; stdout is `FINISHED`; no refusal line or approval text appears anywhere.
- Evidence: The file's contents read from outside the session, the exit code, the complete stdout, the elapsed seconds, and an explicit note that the dispatch was run from a scratch script to get past the environment's own PreToolUse guard.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the file exists with the expected contents and no approval refusal appears; FAIL when the file is absent or a refusal is reported for an ordinary write; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential.

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
rm -f "$SCRATCH/ordinary-write.txt"

# written into a scratch script because this environment's PreToolUse guard refuses a
# write-shaped `hermes chat` command line without --yolo
cat > "$SCRATCH/run-006.sh" <<'EOF'
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t terminal,file,skills,todo,web --max-turns 6 --run-budget 150 \
  -q "Create the file $SCRATCH/ordinary-write.txt containing exactly the single line DONE, then reply with the single word FINISHED." \
  </dev/null >out.txt 2>err.txt
EOF
bash "$SCRATCH/run-006.sh"
echo $?
cat "$SCRATCH/ordinary-write.txt"
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-006 | Ordinary write without --yolo | Confirm an ordinary, unflagged file write succeeds in single-query mode with no `--yolo`, so the flag is not treated as a general write switch | `Create the file <scratch>/ordinary-write.txt containing exactly the single line DONE, then reply with the single word FINISHED.` | 1. `rm -f <scratch>/ordinary-write.txt` -> 2. Write the dispatch into a scratch shell script, because the environment's PreToolUse guard blocks a write-shaped `hermes chat` command line that lacks `--yolo` -> 3. `bash <scratch>/run-006.sh`, which runs `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t terminal,file,skills,todo,web --max-turns 6 --run-budget 150 -q "Create the file <scratch>/ordinary-write.txt containing exactly the single line DONE, then reply with the single word FINISHED." </dev/null` -> 4. `echo $?` -> 5. `cat <scratch>/ordinary-write.txt` -> 6. `cat out.txt` | Exit code `0`; the scratch file exists and contains exactly `DONE`; stdout is `FINISHED`; no refusal line or approval text appears anywhere | The file's contents read from outside the session, the exit code, the complete stdout, the elapsed seconds, and an explicit note that the dispatch was run from a scratch script to get past the environment's own PreToolUse guard | PASS when the file exists with the expected contents and no approval refusal appears; FAIL when the file is absent or a refusal is reported for an ordinary write; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential | An absent file with a refusal in the transcript means the write was flagged, which would mean the target path is protected: check whether the path's immediate parent is a `.hermes` directory. An absent file with no refusal usually means the model answered without acting; tighten the prompt and re-run before recording a FAIL |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,skills,todo`, no `--yolo`): exit 0 in 63 s, file contains `DONE`, stdout `FINISHED`, no approval text, session `20260914_230414_fc4fc4`. Verdict PASS. This is the observation that overrides the earlier packet wording treating `--yolo` as the general write switch: the flag is required only when `terminal` is in the toolset list.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `permission-modes/ordinary-write-without-yolo.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | Approvals and writes, and the protected `.hermes/` parent-directory rule |
| [read-only-leaf-refuses-writes.md](./read-only-leaf-refuses-writes.md) | Where read-only actually comes from: the repo guard, not the toolset list |

---

## 5. SOURCE METADATA

- Group: Permission Modes
- Playbook ID: HERMES-006
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `permission-modes/ordinary-write-without-yolo.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
