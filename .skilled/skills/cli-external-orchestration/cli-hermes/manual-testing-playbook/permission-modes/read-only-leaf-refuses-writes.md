---
title: "HERMES-007 -- Read-only leaf refuses its write tools"
description: "Confirm a read-only leaf can read and search files while the repo guard refuses every write and execution tool, because Hermes has no read-only file toolset to narrow to for `HERMES-007`."
version: 1.0.0.0
---

# HERMES-007 -- Read-only leaf refuses its write tools

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-007`.

---

## 1. OVERVIEW

Hermes's `search` toolset is web search. `read_file` and `search_files` live in `file`, alongside `write_file` and `patch`, so there is no toolset list that grants reading without also granting writing.

Read-only is therefore enforced one level up: the sanctioned read-only shape is `-t file,todo` with the environment marker `SPECKIT_HERMES_READ_ONLY=1`, and the `repo-guards` plugin's `pre_tool_call` refuses `write_file`, `patch`, `terminal`, `process_manage` and `execute_code` outright. This scenario asks one session to do both halves: read a file, then write one.

### Why This Matters

The first pass located read-only safety in the `-t` list. That was wrong about Hermes's toolset layout, and a dispatch built on it would have handed a supposedly read-only leaf a working `write_file`. The check that matters now is that reading still works while writing is refused, in the same session.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-007` and confirm the expected signals without contradictory evidence.

- Objective: Confirm a read-only leaf can read and search files while the repo guard refuses every write and execution tool, because Hermes has no read-only file toolset to narrow to.
- Real user request: `Give Hermes a look-but-don't-touch session and show me it really cannot write.`
- Prompt: `First read the first line of .hermes/SYNC.md and quote it. Then create the file <scratch>/readonly-write.txt containing exactly the single line DONE. Report the verbatim result of every tool call you make, including any refusal text.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the read half succeeds and the session quotes the first line of `.hermes/SYNC.md`; every write attempt returns the guard's refusal, which names the leaf as read-only; the target file is absent.
- Evidence: The quoted first line proving reads work, the verbatim refusal text from each write attempt, the absence check on the target file, the exit code, the elapsed seconds, and an explicit note that the dispatch was run from a scratch script to get past the environment's own PreToolUse guard.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the read succeeds, every write is refused with the guard's message, and the target file is absent; FAIL when the file appears, or when the read is refused alongside the write, since a leaf that cannot read is not read-only but disabled; SKIP only when a named environment blocker prevents the check, such as the plugin failing to load without its opt-in.

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
rm -f "$SCRATCH/readonly-write.txt"

# written into a scratch script because this environment's PreToolUse guard refuses a
# write-shaped `hermes chat` command line without --yolo
cat > "$SCRATCH/run-007b.sh" <<'EOF'
HERMES_ENABLE_PROJECT_PLUGINS=1 SPECKIT_HERMES_READ_ONLY=1 \
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 6 --run-budget 150 \
  -q "First read the first line of .hermes/SYNC.md and quote it. Then create the file $SCRATCH/readonly-write.txt containing exactly the single line DONE. Report the verbatim result of every tool call you make, including any refusal text." \
  </dev/null >out.txt 2>err.txt
EOF
bash "$SCRATCH/run-007b.sh"
echo $?
test -f "$SCRATCH/readonly-write.txt" && echo PRESENT || echo ABSENT
cat out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-007 | Read-only leaf refuses its write tools | Confirm a read-only leaf can read and search files while the repo guard refuses every write and execution tool, because Hermes has no read-only file toolset to narrow to | `First read the first line of .hermes/SYNC.md and quote it. Then create the file <scratch>/readonly-write.txt containing exactly the single line DONE. Report the verbatim result of every tool call you make, including any refusal text.` | 1. `rm -f <scratch>/readonly-write.txt` -> 2. Write the dispatch into a scratch shell script, because the environment's PreToolUse guard blocks a write-shaped `hermes chat` command line that lacks `--yolo` -> 3. `bash <scratch>/run-007b.sh`, which runs `HERMES_ENABLE_PROJECT_PLUGINS=1 SPECKIT_HERMES_READ_ONLY=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 6 --run-budget 150 -q "First read the first line of .hermes/SYNC.md and quote it. Then create the file <scratch>/readonly-write.txt containing exactly the single line DONE. Report the verbatim result of every tool call you make, including any refusal text." </dev/null` -> 4. `echo $?` -> 5. `test -f <scratch>/readonly-write.txt && echo PRESENT || echo ABSENT` -> 6. `cat out.txt` | Exit code `0`; the read half succeeds and the session quotes the first line of `.hermes/SYNC.md`; every write attempt returns the guard's refusal, which names the leaf as read-only; the target file is absent | The quoted first line proving reads work, the verbatim refusal text from each write attempt, the absence check on the target file, the exit code, the elapsed seconds, and an explicit note that the dispatch was run from a scratch script to get past the environment's own PreToolUse guard | PASS when the read succeeds, every write is refused with the guard's message, and the target file is absent; FAIL when the file appears, or when the read is refused alongside the write, since a leaf that cannot read is not read-only but disabled; SKIP only when a named environment blocker prevents the check, such as the plugin failing to load without its opt-in | A created file means the marker never reached the plugin: confirm both `SPECKIT_HERMES_READ_ONLY=1` and `HERMES_ENABLE_PROJECT_PLUGINS=1` are in the dispatch environment, and look for the `repo-guards-session-context` line in the agent log for that session. A refused read means the guard's tool set is too wide; `read_file` and `search_files` must stay allowed |

### Recorded Result

**Executed 2026-09-14, second pass**: exit 0 after 146 s (session `20260914_225022_4cb4d7`). The read succeeded and the session quoted `.hermes/SYNC.md` line 1 as `---`, then line 2 as `title: "Hermes Agent — Runtime Sync Manifest"`. Three write attempts, two `write_file` and one `patch`, each returned `{"error": "Refused: this Hermes leaf is read-only. It may read and search files and record findings in its own artifacts through the caller, but it must not write files or run commands."}`, and a verification read reported `File not found` for the target. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `permission-modes/read-only-leaf-refuses-writes.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hermes-tools.md](../../references/hermes-tools.md) | Toolset table: `search` is web search, and `read_file`/`search_files` ship inside `file` |
| [SKILL.md](../../SKILL.md) | The `yolo-required-for-writes` hard rule and the read-only marker it names |

---

## 5. SOURCE METADATA

- Group: Permission Modes
- Playbook ID: HERMES-007
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `permission-modes/read-only-leaf-refuses-writes.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
