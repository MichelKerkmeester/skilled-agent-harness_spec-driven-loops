---
title: "DV-011 -- Mirrored roster agent dispatch"
description: "Verify a real run_subagent dispatch through one of the repo's mirrored agent profiles."
version: 1.0.0.0
---

# DV-011 -- Mirrored roster agent dispatch

This document captures the realistic user-testing contract, execution flow, source anchors, and validation criteria for `DV-011`.

## 1. OVERVIEW

Dispatch the mirrored `prompt-improver` profile through Devin's custom agent path. The `.devin/agents/<name>/AGENT.md` file is the dispatch surface; its canonical body is the symlink target under `.claude/agents/`.

### Why This Matters

Devin does not auto-discover the repository's `.claude/agents/` directory on its own in the installed version. The mirrored Devin path is what makes the roster usable.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a mirrored roster agent is dispatchable and its body influences the result.
- Real user request: `Use the prompt-improver agent to improve a weak one-line request without editing files.`
- Prompt: `Use the prompt-improver subagent to improve this request: "Fix auth." Return the improved request and name the constraints you added. Do not edit files.`
- Expected execution process: Run the command with `normal` permission; inspect the result and verify the profile path is a symlink resolving into `.claude/agents/`.
- Expected signals: A real `run_subagent` result is returned and reflects the prompt-improver agent body; no file mutation.
- Desired user-visible outcome: A working mirrored custom-agent dispatch rather than a built-in fallback.
- Pass/fail: PASS when the mirrored profile is used and returns derived content; FAIL when Devin falls back silently or cannot load the profile; SKIP on auth/availability blockers.

---

## 3. TEST EXECUTION

1. `test -L .devin/agents/prompt-improver/AGENT.md && readlink .devin/agents/prompt-improver/AGENT.md`
2. `devin -p "Use the prompt-improver subagent to improve this request: \"Fix auth.\" Return the improved request and name the constraints you added. Do not edit files." --model adaptive --permission-mode normal </dev/null > /tmp/cli-devin-dv011.txt 2>&1; echo "exit=$?" >> /tmp/cli-devin-dv011.txt`
3. Inspect the response for profile-derived behavior and confirm `git status --porcelain` is unchanged.

| Feature ID | Exact command | Expected signal | Verdict |
|---|---|---|---|
| DV-011 | `devin -p ... prompt-improver ...` | Mirrored agent result and symlink target | PASS/FAIL/SKIP |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Mirrored-roster scope |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/agent-delegation.md` | Custom profile format and dispatch |
| `../../SKILL.md` | Installed-version correction about `.claude/agents/` discovery |
| `../../../../.devin/agents/prompt-improver/AGENT.md` | Mirrored profile under test |

---

## 5. SOURCE METADATA

- Group: Subagents
- Playbook ID: DV-011
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `subagents/mirrored-roster-agent.md`
