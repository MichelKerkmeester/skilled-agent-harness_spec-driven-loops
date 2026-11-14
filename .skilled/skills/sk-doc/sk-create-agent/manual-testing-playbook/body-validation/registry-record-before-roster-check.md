---
title: "AGV-003 -- Registry record before the roster check"
description: "This scenario validates that a new agent under .skilled/agents fails the roster check without a registry record and passes it with one."
version: 1.0.0.0
---

# AGV-003 -- Registry record before the roster check

This document captures the registry step of the creation workflow and the roster check that enforces it.

---

## 1. OVERVIEW

This scenario validates `AGV-003`. It focuses on the registry record a new agent under `.skilled/agents/` needs, the command that rewrites the generated rosters and the error the roster check prints without the record.

### Why This Matters

An agent file can pass document validation and still fail the roster check and CI. The check compares the files under `.skilled/agents/` with `agent-registry.json`, so the record has to exist before it runs.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `AGV-003`.

- Objective: show the roster check failing for an agent file with no record, then passing once the record is added and the rosters are rewritten.
- Realistic user request: `I added a new agent file under .skilled/agents and the roster check fails. What is missing, and show me the check passing.`
- Prompt: `I added a new agent file under .skilled/agents and the roster check fails. What is missing, and show me the check passing.`
- Expected execution process: read steps 13 and 14 of the creation workflow, add a throwaway agent file, run the check, add the record, rewrite the rosters, run the check again and remove the throwaway.
- Expected signals: the first check prints `agent file without a registry record: zz-probe` and exits 1. The second check prints `agent-roster: OK` and exits 0. The final status prints no line.
- Desired user-visible outcome: the operator learns that the registry record is the missing piece and sees the check pass with it.
- Pass/fail: PASS if both check results are captured and the throwaway leaves no residue. FAIL if the record is skipped, the failing check is not shown or a throwaway file or record remains.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `I added a new agent file under .skilled/agents and the roster check fails. What is missing, and show me the check passing.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| AGV-003 | Registry record before the roster check | Run the roster check without a record and with one | `I added a new agent file under .skilled/agents and the roster check fails. What is missing, and show me the check passing.` | 1. `agent: Read steps 13 and 14 of the ordered creation workflow in SKILL.md` -> 2. `bash: cp .skilled/agents/context.md .skilled/agents/zz-probe.md` -> 3. `bash: node .skilled/bin/sync-agent-roster.cjs --check` -> 4. `agent: Add a zz-probe record to .skilled/agents/agent-registry.json, copied from the context record` -> 5. `bash: node .skilled/bin/sync-agent-roster.cjs` -> 6. `bash: node .skilled/bin/sync-agent-roster.cjs --check` -> 7. `agent: Remove .skilled/agents/zz-probe.md and the zz-probe record` -> 8. `bash: node .skilled/bin/sync-agent-roster.cjs` -> 9. `bash: git status --short .skilled/agents .claude/agents .codex/agents .pi/agents` | Step 3: `agent file without a registry record: zz-probe` and exit 1. Step 6: `agent-roster: OK` and exit 0. Step 9: no line | The prompt, the steps read, both check transcripts with exit statuses and the final status | PASS if step 3 fails with the quoted error, step 6 passes and step 9 prints no line. FAIL if the record is not added, a check is not run or residue remains | 1. Confirm the throwaway file sits under `.skilled/agents/`. 2. Compare the record's fields with an existing record. 3. Rerun the roster write before the check |

### Commands

1. `agent: Read steps 13 and 14 of the ordered creation workflow in SKILL.md`
2. `bash: cp .skilled/agents/context.md .skilled/agents/zz-probe.md`
3. `bash: node .skilled/bin/sync-agent-roster.cjs --check`
4. `agent: Add a zz-probe record to .skilled/agents/agent-registry.json, copied from the context record`
5. `bash: node .skilled/bin/sync-agent-roster.cjs`
6. `bash: node .skilled/bin/sync-agent-roster.cjs --check`
7. `agent: Remove .skilled/agents/zz-probe.md and the zz-probe record`
8. `bash: node .skilled/bin/sync-agent-roster.cjs`
9. `bash: git status --short .skilled/agents .claude/agents .codex/agents .pi/agents`

### Expected

Step 1 reads the workflow rather than relying on memory. Step 3 shows the error an author sees without a record. Steps 4 and 5 follow step 13 of the workflow. Step 6 shows the check passing. Steps 7 to 9 remove the throwaway and prove nothing is left.

### Evidence

Capture the prompt, the two workflow steps, both check outputs with exit statuses and the final status output.

### Pass / Fail

- **Pass**: the first check fails with the quoted error, the second prints `agent-roster: OK` and the final status prints no line.
- **Fail**: the record is never added, either check is absent or the throwaway file or record remains in the tree.

### Failure Triage

1. Check that the record's `name` equals the file stem.
2. Run `node .skilled/bin/sync-agent-roster.cjs` again when the check reports a stale roster.
3. Search the runtime agent directories for `zz-probe` when the final status prints a line.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`../manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory and scenario summary |
| No feature-catalog entry | This package has no feature catalog |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Steps 13 and 14 of the ordered creation workflow |
| [`../../../../../agents/agent-registry.json`](../../../../../agents/agent-registry.json) | The registry the roster check reads |
| [`../../../../../bin/sync-agent-roster.cjs`](../../../../../bin/sync-agent-roster.cjs) | Roster write and roster check |

---

## 5. SOURCE METADATA

- Group: BODY VALIDATION
- Playbook ID: AGV-003
- Canonical root source: [`../manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `body-validation/registry-record-before-roster-check.md`
