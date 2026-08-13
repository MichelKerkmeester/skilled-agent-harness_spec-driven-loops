---
title: "CU-023 -- Mirrored-agent subagent dispatch"
description: "Verify a real Cursor subagent dispatch through one mirrored repository agent and confirm the result is derived from its body."
version: 1.0.0.0
---

# CU-023 -- Mirrored-agent subagent dispatch

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `CU-023`.

## 1. OVERVIEW

Use the mirrored `prompt-improver` profile for a small read-only prompt rewrite. The scenario is a real Cursor dispatch, not a static symlink check.

### Why This Matters

Roster presence can hide a broken loader. A real subagent result demonstrates that Cursor resolves the mirrored profile and uses its instructions.

---

## 2. SCENARIO CONTRACT

- Objective: Dispatch through `prompt-improver` and receive profile-shaped output.
- Real user request: `Have the prompt-improver agent strengthen the request "Fix auth" without editing files.`
- Prompt: `Use the prompt-improver subagent to improve this request: "Fix auth." Return the improved request and the constraints you added. Do not edit files.`
- Expected execution process: Run `cursor-agent -p` with `--model composer-2.5`, `--auto-review`, and `--sandbox enabled`; inspect stdout for an improved, constraint-rich prompt and no file changes.
- Expected signals: Cursor delegates to the mirrored agent, the answer reflects prompt-improver instructions, and the repository remains unchanged.
- Desired user-visible outcome: A successful real mirrored-agent dispatch.
- Pass/fail: PASS when delegation and derived output are evidenced; FAIL on silent fallback, inline-only completion, or mutation; SKIP on Cursor auth/availability blockers.

---

## 3. TEST EXECUTION

1. `cursor-agent -p "Use the prompt-improver subagent to improve this request: \"Fix auth.\" Return the improved request and the constraints you added. Do not edit files." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu023.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu023.txt`
2. Inspect output for subagent delegation and prompt-improver-derived structure.
3. `git status --porcelain` and record `cursor-agent about` output-text auth evidence.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| CU-023 | `cursor-agent -p ... prompt-improver ...` | Real mirrored-agent result, clean tree | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root dispatch policy |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../SKILL.md` | Agent discovery and delegation rules |
| `../../../../.cursor/agents/prompt-improver.md` | Mirrored profile under test |
| `../../../../.claude/agents/prompt-improver.md` | Canonical profile body |

---

## 5. SOURCE METADATA

- Group: Agents, Skills and Rules
- Playbook ID: CU-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `agents-skills-rules/mirrored-agent-dispatch.md`
