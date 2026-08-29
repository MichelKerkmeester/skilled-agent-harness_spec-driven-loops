---
title: "CU-022 -- Cursor agent roster enumeration"
description: "Verify Cursor can enumerate and dispatch all 13 mirrored repository agents discovered through file convention."
version: 1.0.0.0
---

# CU-022 -- Cursor agent roster enumeration

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `CU-022`.

## 1. OVERVIEW

Enumerate `.cursor/agents/*.md` and ask a real `cursor-agent -p` dispatch to report the same 13 mirrored profiles.

### Why This Matters

Cursor agent discovery is convention-based, not a flag shown in `--help`. A complete roster check prevents a partial mirror from being mistaken for parity.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm all 13 repository agents are visible to Cursor.
- Real user request: `List every repository agent Cursor can dispatch and report the count.`
- Prompt: `Enumerate every repository agent profile available to this Cursor session. Report the exact names and count. Do not edit files.`
- Expected execution process: Count and list the local `.cursor/agents/*.md` files, then dispatch `cursor-agent -p` with the explicit model and approval/sandbox flags; compare the output.
- Expected signals: `ai-council`, `code`, `context`, `debug`, `deep-improvement`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, and `review` all appear exactly once.
- Desired user-visible outcome: A 13-agent roster with no duplicates or silent omissions.
- Pass/fail: PASS when filesystem and live dispatch agree; FAIL on any missing/duplicate name; SKIP only with a named Cursor availability/auth blocker.

---

## 3. TEST EXECUTION

### Prompt

Prompt: `Enumerate every repository agent profile available to this Cursor session. Report the exact names and count. Do not edit files.`

### Commands

1. `find .cursor/agents -maxdepth 1 -type l -name '*.md' -print | sed 's#^.cursor/agents/##; s#\.md$##' | sort`
2. `cursor-agent -p "Enumerate every repository agent profile available to this Cursor session. Report the exact names and count. Do not edit files." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu022.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu022.txt`

### Expected

Step 1 lists exactly the 13 names in the description. Step 2's dispatch enumerates the same 13 names with no duplicate and no omission.

### Evidence

Compare step 2's output text with the 13-name filesystem roster from step 1, and record Cursor auth evidence from `cursor-agent about`.

### Pass / Fail

- **Pass**: filesystem and live dispatch report the same 13 names with no duplicate or omission.
- **Fail**: any name is missing or duplicated in either source, or the two sources disagree.
- **Skip**: only with a named Cursor availability or authentication blocker on the step 2 dispatch; the filesystem enumeration in step 1 is hermetic and does not SKIP.

### Failure Triage

1. **Filesystem roster gap**: step 1 is missing a name or shows a duplicate; inspect `.cursor/agents/` directly for a broken or forked mirror entry.
2. **Auth/availability blocker**: step 2 fails to authenticate or dispatch; capture the `cursor-agent about` output and record the SKIP with that exact blocker.
3. **Roster mismatch**: step 2's live enumeration disagrees with step 1's filesystem list; treat the filesystem roster as ground truth and re-run step 2.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory, evidence, and Cursor flags |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Cursor agent discovery contract |
| `../../../../.cursor/agents/` | Cursor-facing roster mirrors |
| `../../../../.claude/agents/` | Canonical agent bodies |

---

## 5. SOURCE METADATA

- Group: Agents, Skills and Rules
- Playbook ID: CU-022
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agents-skills-rules/agent-roster-enumeration.md`
