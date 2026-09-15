---
title: "HERMES-017 -- Skills list omits project skills"
description: "Confirm `hermes skills list` shows only built-in and user-level skills, so its output can never be used as evidence that a project skill loaded for `HERMES-017`."
version: 1.0.0.0
---

# HERMES-017 -- Skills list omits project skills

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-017`.

---

## 1. OVERVIEW

`hermes skills list` is the obvious place to look for a project skill, and it is the wrong one. The listing covers built-in and user-installed skills; a linked project skill under `.hermes/skills/` does not appear there whether or not it loads.

This scenario records that absence deliberately, so a future operator does not read an empty result as a broken link.

### Why This Matters

The failure this prevents is a false negative: a working preload reported as broken because the listing does not mention it, followed by a pointless re-link. HERMES-016 is the only load proof; this scenario says so in the place people look first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-017` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `hermes skills list` shows only built-in and user-level skills, so its output can never be used as evidence that a project skill loaded.
- Real user request: `Is our cli-hermes skill showing up in Hermes?`
- Prompt: `List the skills Hermes reports as installed and state whether the project skill cli-hermes appears among them.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: Exit code `0`; the listing renders a table whose Source column holds only `builtin` and user-level values; `grep -c 'cli-hermes'` returns `0` even though the symlink exists.
- Evidence: The generated copy's first lines proving the project skill is present on disk, the line count of the listing, the grep count, the exit code, and the head of the table showing the Source column.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the generated copy exists and the listing does not mention it; FAIL when the command errors, or when the listing does show the project skill, which would mean this documented boundary has changed and the packet's guidance needs updating; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, including a missing `hermes` binary.

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

perl -e 'alarm 120; exec @ARGV' -- hermes skills list </dev/null >out.txt 2>err.txt
echo $?
wc -l out.txt
grep -c 'cli-hermes' out.txt
head -25 out.txt
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-017 | Skills list omits project skills | Confirm `hermes skills list` shows only built-in and user-level skills, so its output can never be used as evidence that a project skill loaded | `List the skills Hermes reports as installed and state whether the project skill cli-hermes appears among them.` | 1. `ls -la .hermes/skills/` -> 2. `perl -e 'alarm 120; exec @ARGV' -- hermes skills list </dev/null >out.txt 2>err.txt` -> 3. `echo $?` -> 4. `wc -l out.txt` -> 5. `grep -c 'cli-hermes' out.txt` -> 6. `head -25 out.txt` | Exit code `0`; the listing renders a table whose Source column holds only `builtin` and user-level values; `grep -c 'cli-hermes'` returns `0` even though the symlink exists | The symlink listing proving the project skill is present on disk, the line count of the listing, the grep count, the exit code, and the head of the table showing the Source column | PASS when the generated copy exists and the listing does not mention it; FAIL when the command errors, or when the listing does show the project skill, which would mean this documented boundary has changed and the packet's guidance needs updating; SKIP only when a named environment blocker prevents the check, such as an unreachable provider or a missing credential, including a missing `hermes` binary | A project skill appearing in the listing is not a defect but a contract change: capture the Hermes version and escalate so the packet's guidance and HERMES-016's reasoning can be revised. An error exit usually means a malformed user-level skills directory, unrelated to this repo |

### Recorded Result

**Executed 2026-09-14**: exit 0 in 1 s, 64 lines of table, `grep -c 'cli-hermes'` returned `0`, every visible Source value `builtin`, while `.hermes/skills/cli-hermes` exists as a directory symlink. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `skills-and-plugins/skills-list-omits-project-skills.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [hermes-tools.md](../../references/hermes-tools.md) | The statement that `hermes skills list` shows no project rows |
| [project-skill-preload.md](./project-skill-preload.md) | The only scenario that does prove a project skill loaded |

---

## 5. SOURCE METADATA

- Group: Skills And Plugins
- Playbook ID: HERMES-017
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `skills-and-plugins/skills-list-omits-project-skills.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
