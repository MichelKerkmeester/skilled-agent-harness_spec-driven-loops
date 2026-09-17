---
title: "HERMES-011 -- Resume a captured session id"
description: "Confirm `--resume <id>` reattaches a headless dispatch to a prior session with its history intact and reuses the same session id for `HERMES-011`."
version: 1.0.0.0
---

# HERMES-011 -- Resume a captured session id

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-011`.

---

## 1. OVERVIEW

Every sanctioned dispatch emits `session_id:` on stderr. This scenario proves that id is not merely a log label: passing it back through `--resume` restores the earlier turn's context into a fresh headless run.

It depends on HERMES-001 having run first, and uses that scenario's captured id.

### Why This Matters

Session continuity is the difference between a Hermes lineage that can be picked up and one that must be restarted from scratch. Proving it works, and that the id is stable across the resume, is what makes the id worth capturing.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-011` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--resume <id>` reattaches a headless dispatch to a prior session with its history intact and reuses the same session id.
- Real user request: `Pick up that earlier Hermes session and ask it what it just told me.`
- Prompt: `What single word did you reply with in your previous message in this session? Answer with that word only.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout is the word the earlier session answered with; stderr carries a resume banner naming the session id and its message count, and the `session_id:` line equals the resumed id rather than a new one.
- Evidence: The captured id from the first run, the resume banner text, the complete stdout, the exit code, the elapsed seconds, and the confirmation that the emitted session id is unchanged.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the session recalls the earlier answer and the emitted session id equals the resumed id; FAIL when a new session id is emitted, the history is empty, or the session cannot recall the prior turn; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, including the missing captured id when HERMES-001 has not run.

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
SID=$(grep -o 'session_id: .*' err-from-HERMES-001.txt | awk '{print $2}')

perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 120 --resume "$SID" \
  -q "What single word did you reply with in your previous message in this session? Answer with that word only." \
  </dev/null >out.txt 2>err.txt
echo $?
cat out.txt
cat err.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-011 | Resume a captured session id | Confirm `--resume <id>` reattaches a headless dispatch to a prior session with its history intact and reuses the same session id | `What single word did you reply with in your previous message in this session? Answer with that word only.` | 1. Take the `session_id:` value from the HERMES-001 stderr capture -> 2. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 4 --run-budget 120 --resume <captured-id> -q "What single word did you reply with in your previous message in this session? Answer with that word only." </dev/null >out.txt 2>err.txt` -> 3. `echo $?` -> 4. `cat out.txt` -> 5. `cat err.txt` | Exit code `0`; stdout is the word the earlier session answered with; stderr carries a resume banner naming the session id and its message count, and the `session_id:` line equals the resumed id rather than a new one | The captured id from the first run, the resume banner text, the complete stdout, the exit code, the elapsed seconds, and the confirmation that the emitted session id is unchanged | PASS when the session recalls the earlier answer and the emitted session id equals the resumed id; FAIL when a new session id is emitted, the history is empty, or the session cannot recall the prior turn; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, including the missing captured id when HERMES-001 has not run | A new session id means the resume silently fell back to a fresh session; check that the id was passed exactly as captured and that `~/.hermes/sessions` still holds it. A session that resumes but cannot recall usually means `--ignore-rules` stripped something it should not have; re-run without it to isolate |

### Recorded Result

**Executed 2026-09-14, second pass** against HERMES-001's id `20260914_225534_91804d`: exit 0 in 8 s, stdout `ALIVE`, stderr `↻ Resumed session 20260914_225534_91804d (1 user message, 2 total messages)` followed by the same `session_id:`. Verdict PASS. This converts `--resume` from untested to observed.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `session-continuity/resume-captured-session-id.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | `--resume ID` and the `session_id:` stderr contract |
| [sanctioned-headless-smoke.md](../cli-invocation/sanctioned-headless-smoke.md) | The scenario that captures the id this one resumes |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: HERMES-011
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `session-continuity/resume-captured-session-id.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
