---
title: "HERMES-002 -- Query-file verbatim round trip"
description: "Confirm `--query-file -` delivers the prompt byte-for-byte, with no shell expansion of quotes, `$(...)`, backticks, or `$HOME` for `HERMES-002`."
version: 1.0.0.0
---

# HERMES-002 -- Query-file verbatim round trip

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-002`.

---

## 1. OVERVIEW

A dispatched prompt regularly carries shell metacharacters: quoted code, command substitutions inside example snippets, and paths. `-q` puts the prompt in argv where a careless caller's quoting can expand them; `--query-file -` reads stdin verbatim.

This scenario feeds a prompt containing every dangerous metacharacter class and requires the model to echo the line back unchanged, so an expansion anywhere in the path shows up as a changed character rather than as a subtle semantic drift.

### Why This Matters

A silently expanded `$(...)` in a dispatched prompt is both a correctness bug and an injection surface. The verbatim guarantee is what makes `--query-file -` the fan-out builder's transport.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-002` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `--query-file -` delivers the prompt byte-for-byte, with no shell expansion of quotes, `$(...)`, backticks, or `$HOME`.
- Real user request: `Send Hermes a prompt that contains shell snippets and make sure nothing in it gets expanded on the way.`
- Prompt: `Repeat the following line back exactly once, character for character, with no commentary, no quoting, and no code fence: LITERAL "double" 'single' $(echo PWNED) `echo PWNED` $HOME \n end`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; stdout reproduces the payload line unchanged, including both quote pairs, the unexpanded `$(echo PWNED)`, the unexpanded backtick form, the literal `$HOME`, and the literal `\n`; `grep -o PWNED | wc -l` counts the two occurrences, since `grep -c` counts matching lines that were in the prompt and no third.
- Evidence: The probe file's exact bytes, the complete stdout, the exit code, and the grep count proving no substitution ran.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the echoed line matches the probe payload character for character and no substitution output appears; FAIL when any metacharacter is expanded, `$HOME` is replaced by a path, or the line is reformatted into a code fence; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential.

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
# 1. the probe prompt, written from outside Hermes
cat > "$SCRATCH/qf-probe.md" <<'PROMPT'
Repeat the following line back exactly once, character for character, with no commentary, no quoting, and no code fence:
LITERAL "double" 'single' $(echo PWNED) `echo PWNED` $HOME \n end
PROMPT

# 2. the dispatch
# SPECKIT_HERMES_READ_ONLY makes the plugin refuse the write tools. This scenario only reads
# its prompt back, and without the marker a past run left a stray file at the repo root,
# which global precondition 13 forbids.
SPECKIT_HERMES_READ_ONLY=1 perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 120 \
  --query-file - <"$SCRATCH/qf-probe.md" >out.txt 2>err.txt
echo $?
cat out.txt
grep -c PWNED out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-002 | Query-file verbatim round trip | Confirm `--query-file -` delivers the prompt byte-for-byte, with no shell expansion of quotes, `$(...)`, backticks, or `$HOME` | `Repeat the following line back exactly once, character for character, with no commentary, no quoting, and no code fence: LITERAL "double" 'single' $(echo PWNED) `echo PWNED` $HOME \n end` | 1. Write the two-line probe prompt to `<scratch>/qf-probe.md`, the second line being the literal metacharacter payload -> 2. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --ignore-rules --source tool --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 4 --run-budget 120 --query-file - <<scratch>/qf-probe.md >out.txt 2>err.txt` -> 3. `echo $?` -> 4. `cat out.txt` -> 5. `grep -c PWNED out.txt` | Exit code `0`; stdout reproduces the payload line unchanged, including both quote pairs, the unexpanded `$(echo PWNED)`, the unexpanded backtick form, the literal `$HOME`, and the literal `\n`; `grep -o PWNED | wc -l` counts the two occurrences, since `grep -c` counts matching lines that were in the prompt and no third | The probe file's exact bytes, the complete stdout, the exit code, and the grep count proving no substitution ran | PASS when the echoed line matches the probe payload character for character and no substitution output appears; FAIL when any metacharacter is expanded, `$HOME` is replaced by a path, or the line is reformatted into a code fence; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential | A substituted value means the prompt travelled through a shell. Confirm the dispatch used `--query-file -` and not `-q`, and that no wrapper re-quoted the file's contents. A reformatted line is a model-instruction problem, not a transport one; tighten the prompt before calling it a FAIL |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,todo`): exit 0 in 23 s, stdout `LITERAL "double" 'single' $(echo PWNED) \`echo PWNED\` $HOME \n end`, and the only line containing `PWNED` is the echoed payload itself. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/query-file-verbatim-round-trip.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | `--query-file` semantics and the `-` stdin form |
| [SKILL.md](../../SKILL.md) | Why the fan-out builder passes the prompt on stdin rather than in argv |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: HERMES-002
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/query-file-verbatim-round-trip.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
