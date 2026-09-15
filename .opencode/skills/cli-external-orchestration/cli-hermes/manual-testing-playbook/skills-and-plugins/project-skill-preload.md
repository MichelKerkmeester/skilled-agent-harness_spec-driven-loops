---
title: "HERMES-016 -- Project skill preload"
description: "Confirm `-s cli-hermes` preloads the generated project skill copy into a session, and that the content is attributable to the preload rather than to a search for `HERMES-016`."
version: 1.0.0.0
---

# HERMES-016 -- Project skill preload

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-016`.

---

## 1. OVERVIEW

Project skills load from `.hermes/skills/<name>/SKILL.md` after an operator trust grant, one generated markdown-only copy per canonical skill (`sync-skills-hermes.cjs`). No read-only command reports whether the load succeeded, so the only proof is a live session quoting the skill.

This scenario runs the preload and pairs it with a negative control that removes both the preload and any tool that could find the file, so a correct answer in the first run cannot be explained by a search in the second.

### Why This Matters

Without the negative control a preload check proves only that the model could find the text somehow. The control is what makes `-s` the demonstrated source.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-016` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `-s cli-hermes` preloads the generated project skill copy into a session, and that the content is attributable to the preload rather than to a search.
- Real user request: `Load our cli-hermes skill into a Hermes session and have it tell me the rules it just read.`
- Prompt: `Using only the cli-hermes skill that was preloaded into this session, quote its Core principle sentence verbatim and then name the two model ids on its closed roster. If no such skill is loaded, reply exactly SKILL_NOT_LOADED.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0` for both runs; the preloaded run quotes the skill's core-principle sentence and names both roster ids; the negative control answers exactly `SKILL_NOT_LOADED`.
- Evidence: The generated copy's first lines (`head -3 .hermes/skills/cli-hermes/SKILL.md`), both complete stdout captures, both exit codes, both elapsed times, both session ids, and an explicit note that `--ignore-rules` was omitted from the preloaded run under the hard rule's `-s` exception.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the preloaded run quotes the skill and the negative control reports it is not loaded; FAIL when the preloaded run answers `SKILL_NOT_LOADED`, or when the negative control also produces the content, which would mean the preload was not the source; SKIP only when the trust grant is missing, naming that missing operator step as the blocker.

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
ls -la .hermes/skills/

# note: --ignore-rules is omitted here under the hard rule's documented exception: the flag
# suppresses preloaded-skill injection along with the rules files, which would defeat -s
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --source tool -s cli-hermes \
  --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t file,todo --max-turns 4 --run-budget 150 \
  -q "Using only the cli-hermes skill that was preloaded into this session, quote its Core principle sentence verbatim and then name the two model ids on its closed roster. If no such skill is loaded, reply exactly SKILL_NOT_LOADED." \
  </dev/null >out.txt 2>err.txt
echo $?
cat out.txt

# negative control: no preload, and no tool that could locate the file
perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --source tool \
  --provider llmgateway --model glm-5.3-flash --reasoning none \
  -t todo --max-turns 3 --run-budget 90 \
  -q "Using only a cli-hermes skill preloaded into this session, quote its Core principle sentence verbatim. If no such skill is loaded, reply exactly SKILL_NOT_LOADED." \
  </dev/null >neg.txt 2>neg.err
cat neg.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-016 | Project skill preload | Confirm `-s cli-hermes` preloads the generated project skill copy into a session, and that the content is attributable to the preload rather than to a search | `Using only the cli-hermes skill that was preloaded into this session, quote its Core principle sentence verbatim and then name the two model ids on its closed roster. If no such skill is loaded, reply exactly SKILL_NOT_LOADED.` | 1. `ls -la .hermes/skills/` to confirm the per-skill directory symlink exists -> 2. `perl -e 'alarm 300; exec @ARGV' -- hermes chat -Q --oneshot --source tool -s cli-hermes --provider llmgateway --model glm-5.3-flash --reasoning none -t file,todo --max-turns 4 --run-budget 150 -q "Using only the cli-hermes skill that was preloaded into this session, quote its Core principle sentence verbatim and then name the two model ids on its closed roster. If no such skill is loaded, reply exactly SKILL_NOT_LOADED." </dev/null >out.txt 2>err.txt` -> 3. `echo $?` -> 4. `cat out.txt` -> 5. Negative control: repeat step 2 without `-s cli-hermes` and with `-t todo`, capturing `neg.txt` | Exit code `0` for both runs; the preloaded run quotes the skill's core-principle sentence and names both roster ids; the negative control answers exactly `SKILL_NOT_LOADED` | The symlink listing, both complete stdout captures, both exit codes, both elapsed times, both session ids, and an explicit note that `--ignore-rules` was omitted from the preloaded run under the hard rule's `-s` exception | PASS when the preloaded run quotes the skill and the negative control reports it is not loaded; FAIL when the preloaded run answers `SKILL_NOT_LOADED`, or when the negative control also produces the content, which would mean the preload was not the source; SKIP only when the trust grant is missing, naming that missing operator step as the blocker | A `SKILL_NOT_LOADED` answer from the preloaded run has two usual causes: the operator trust grant has not been recorded for this root, or `--ignore-rules` was passed, which strips preloaded-skill injection and is why the hard rule carves out a `-s` dispatch. A negative control that also answers correctly means the model found the file by other means; narrow the control's toolset further before trusting the pair |

### Recorded Result

**Executed 2026-09-14, second pass** (`-t file,todo`): preloaded run exit 0 in 19 s (session `20260914_225430_443601`), quoting `use Hermes for what its surface offers, delegate execution to the shared deep-loop runtime, validate the returned output, and keep the calling AI as conductor.` and naming `deepseek-v4.1-flash` and `glm-5.3-flash`. Negative control exit 0 in 27 s with exactly `SKILL_NOT_LOADED`. The omission of `--ignore-rules` is now the hard rule's own documented exception rather than a deviation. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/project-skill-preload.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hermes-tools.md](../../references/hermes-tools.md) | Repo-local skills, the trust grant, and the one-directory-per-skill linking rule |
| [SYNC.md](../../../../../../.hermes/SYNC.md) | The `skills/<name>/` surface and why the whole tree is never linked |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-016
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/project-skill-preload.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
