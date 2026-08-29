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

### Prompt

Prompt: `Use the prompt-improver subagent to improve this request: "Fix auth." Return the improved request and the constraints you added. Do not edit files.`

### Commands

1. `cursor-agent -p "Use the prompt-improver subagent to improve this request: \"Fix auth.\" Return the improved request and the constraints you added. Do not edit files." --model composer-2.5 --auto-review --sandbox enabled --output-format text </dev/null > /tmp/cli-cursor-cu023.txt 2>&1; echo "exit=$?" >> /tmp/cli-cursor-cu023.txt`
2. Inspect output for subagent delegation and prompt-improver-derived structure.
3. `git status --porcelain`

### Expected

The dispatch delegates to the mirrored `prompt-improver` agent, the answer reflects its instructions (an improved prompt plus the constraints added), and `git status --porcelain` prints nothing.

### Evidence

Captured output in `/tmp/cli-cursor-cu023.txt`, the step 3 clean-tree result, and `cursor-agent about` output-text auth evidence.

### Pass / Fail

- **Pass**: delegation and derived output are evidenced, and the tree stays clean.
- **Fail**: silent fallback to inline-only completion without delegation, or a repository mutation is observed.
- **Skip**: only on a named Cursor authentication or availability blocker for the dispatch itself.

### Failure Triage

1. **No delegation observed**: output looks generic rather than prompt-improver-shaped; re-run with `--output-format text` retained and inspect for an explicit subagent trace before concluding fallback.
2. **Auth/availability blocker**: the dispatch fails to authenticate or start; capture the `cursor-agent about` output and record the SKIP with that exact blocker.
3. **Unexpected mutation**: `git status --porcelain` is non-empty; identify the changed path and treat the scenario as FAIL regardless of dispatch output.

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
