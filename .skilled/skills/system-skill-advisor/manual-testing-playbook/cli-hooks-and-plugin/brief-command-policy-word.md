---
title: "CL-009 The Brief's Command Policy Word in a Parent and a Child Session"
description: "Manual validation that the Claude prompt hook keeps a command's policy word in a parent session and replaces it with the parent-named-only marker in a dispatched child session, for a head command and for a companion command."
version: 1.0.1.0
id: CL-009
category: cli_hooks_and_plugin
stage: routing
---

# CL-009 The Brief's Command Policy Word in a Parent and a Child Session

Prompt: Manual validation that the Claude prompt hook keeps a command's policy word in a parent session and replaces it with the parent-named-only marker in a dispatched child session, for a head command and for a companion command.

---

## 1. OVERVIEW

The brief prints a command with the policy that governs it: `run`, `start` or `ask`. A dispatched child cannot ask its operator whether to start an interactive run or one that writes, so the same label swaps only the policy word for `parent-named only` there. The command and its owner stay visible, because the child still has to report what the parent named.

That swap works in two positions on the brief. The head can carry the command, as `system-skilled-doctor → /doctor:update (ask)`. A companion line can carry it, as `Also: /doctor:git setup (run)`. A read-only `run` command is the exception, because a child may run it, so its word stays `run` in both sessions.

This scenario checks three prompts across a parent session and a child session and pins the policy word alone. Scores and the freshness word move with the index and the cache, so they are read, never asserted.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the head label and the companion label keep their command and owner while the policy word becomes `parent-named only` in a child session, and confirm a read-only `run` companion keeps `run` there.
- Real user request: `Why does the brief tell my subagent that a command is parent-named only when it tells me to run it?`
- Prompt: `Run the Claude prompt hook on three prompts in a parent session and in a child session and compare the policy word each command carries.`
- Expected execution process: Run the six hook calls below from the repository root, each in its own temporary folder, and read the first two lines of `hookSpecificOutput.additionalContext`.
- Expected signals: `Also: /doctor:git setup (run)` in both sessions, `/doctor:update (ask)` in the parent and `/doctor:update (parent-named only)` in the child, and `Also: /doctor:speckit (run)` in the parent and `Also: /doctor:speckit (parent-named only)` in the child.
- Desired user-visible outcome: The reader sees the policy that governs a command in their own session, and a dispatched child sees the same command marked as one only its parent may name.
- Pass/fail: PASS if all six runs match the expected policy words. FAIL if a word differs, if a command or its owner changes, or if a child run drops the command instead of marking it.
- Advisor runtime build is current.
- The Claude hook script exists at `runtime/dist/hooks/claude/user-prompt-submit.js`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Run the Claude prompt hook on three prompts in a parent session and in a child session and compare the policy word each command carries.`

### Commands

1. Create the output folder.

```bash
mkdir -p /tmp/skill-advisor-playbook
```

2. Run `Check my git hooks setup` in a parent session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-009.XXXXXX")
printf '%s' '{"prompt":"Check my git hooks setup","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-009-git-parent"}' \
  | env AI_SESSION_CHILD=0 TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      2>/dev/null \
  | jq -r '.hookSpecificOutput.additionalContext' | head -2 \
  > /tmp/skill-advisor-playbook/cl-009-git-parent.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-009-git-parent.txt
```

3. Run the same prompt in a child session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-009.XXXXXX")
printf '%s' '{"prompt":"Check my git hooks setup","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-009-git-child"}' \
  | env AI_SESSION_CHILD=1 TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      2>/dev/null \
  | jq -r '.hookSpecificOutput.additionalContext' | head -2 \
  > /tmp/skill-advisor-playbook/cl-009-git-child.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-009-git-child.txt
```

4. Run `update skilled to the latest version` in a parent session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-009.XXXXXX")
printf '%s' '{"prompt":"update skilled to the latest version","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-009-update-parent"}' \
  | env AI_SESSION_CHILD=0 TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      2>/dev/null \
  | jq -r '.hookSpecificOutput.additionalContext' | head -2 \
  > /tmp/skill-advisor-playbook/cl-009-update-parent.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-009-update-parent.txt
```

5. Run the same prompt in a child session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-009.XXXXXX")
printf '%s' '{"prompt":"update skilled to the latest version","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-009-update-child"}' \
  | env AI_SESSION_CHILD=1 TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      2>/dev/null \
  | jq -r '.hookSpecificOutput.additionalContext' | head -2 \
  > /tmp/skill-advisor-playbook/cl-009-update-child.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-009-update-child.txt
```

6. Run `spec search is broken even for indexed terms` in a parent session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-009.XXXXXX")
printf '%s' '{"prompt":"spec search is broken even for indexed terms","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-009-speckit-parent"}' \
  | env AI_SESSION_CHILD=0 TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      2>/dev/null \
  | jq -r '.hookSpecificOutput.additionalContext' | head -2 \
  > /tmp/skill-advisor-playbook/cl-009-speckit-parent.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-009-speckit-parent.txt
```

7. Run the same prompt in a child session.

```bash
d=${TMPDIR:-/tmp}; T=$(mktemp -d "${d%/}/cl-009.XXXXXX")
printf '%s' '{"prompt":"spec search is broken even for indexed terms","cwd":"'"$PWD"'","hook_event_name":"UserPromptSubmit","session_id":"cl-009-speckit-child"}' \
  | env AI_SESSION_CHILD=1 TMPDIR=$T SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR=$T/state \
      node .skilled/skills/system-skill-advisor/runtime/dist/hooks/claude/user-prompt-submit.js \
      2>/dev/null \
  | jq -r '.hookSpecificOutput.additionalContext' | head -2 \
  > /tmp/skill-advisor-playbook/cl-009-speckit-child.txt
rm -rf "$T"
cat /tmp/skill-advisor-playbook/cl-009-speckit-child.txt
```

### Exact Prompt Table

| Feature ID | Feature Name | Scenario Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CL-009 | Brief command policy word in a parent and a child session | Confirm the policy word stays in a parent session and becomes parent-named only in a child session for a head command and for a companion command | `Run the Claude prompt hook on three prompts in a parent session and in a child session and compare the policy word each command carries.` | Commands 1 to 7 above | `Also: /doctor:git setup (run)` in both sessions, `/doctor:update (ask)` in the parent and `/doctor:update (parent-named only)` in the child, `Also: /doctor:speckit (run)` in the parent and `Also: /doctor:speckit (parent-named only)` in the child | The six two-line files plus the terminal transcript | PASS if all six runs match. FAIL otherwise | See Failure Triage |

### Expected

- `Check my git hooks setup` prints `Also: /doctor:git setup (run)` in the parent session and in the child session, because a read-only `run` command stays runnable in a child.
- `update skilled to the latest version` prints `system-skilled-doctor → /doctor:update (ask)` in the parent session and `system-skilled-doctor → /doctor:update (parent-named only)` in the child session.
- `spec search is broken even for indexed terms` prints `Also: /doctor:speckit (run)` in the parent session and `Also: /doctor:speckit (parent-named only)` in the child session.
- Scores, confidences and the freshness word are read but not asserted, because they move with the index and the cache.

### Evidence

Keep the six two-line files and the terminal transcript. A passing run reads like this:

```text
Check my git hooks setup
  parent: Also: /doctor:git setup (run)
  child:  Also: /doctor:git setup (run)
update skilled to the latest version
  parent: Advisor: ... use system-skilled-doctor → /doctor:update (ask) ... pass.
  child:  Advisor: ... use system-skilled-doctor → /doctor:update (parent-named only) ... pass.
spec search is broken even for indexed terms
  parent: Also: /doctor:speckit (run)
  child:  Also: /doctor:speckit (parent-named only)
```

### Pass / Fail

- **Pass**: all six policy words match Expected.
- **Fail**: a policy word differs, a command or its owner changes, or a child run drops the command instead of marking it.

### Failure Triage

1. A child run keeps `ask`, `start` or a mutating `run` word: check `policyWord()` and `parentNamedOnly()` in `runtime/lib/render.ts`, then run `runtime/tests/render-child-session.vitest.ts`.
2. A companion line drops its marker: check `companionCommandLabel()` and the companion selection in `renderAdvisorBrief()`, then run `runtime/tests/doctor-brief-render.vitest.ts`.
3. The child run matches the parent for the head command: confirm `AI_SESSION_CHILD=1` sits in the environment of the `node` process, not of the shell that builds the payload.
4. The hook prints `{}` or a stale build warning: rebuild the advisor runtime with `npm --prefix .skilled/skills/system-skill-advisor/runtime run build` and rerun the run.
5. A command or its owner changes between the two sessions: rebuild the advisor runtime and rerun, because both sessions read the same generated row.

---

## 4. SOURCE FILES

| File | Role |
|---|---|
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | `policyWord` and `companionCommandLabel`, the two functions that choose the policy word and the child marker |
| `.skilled/skills/system-skill-advisor/runtime/tests/doctor-brief-render.vitest.ts` | Regression tests for the head command and the companion line, including the child marker |
| `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts` | Regression tests for every policy and class pair in a child session and in a parent session |

---

## 5. SOURCE METADATA

- Group: CLI Hooks And Plugin
- Playbook ID: CL-009
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: cli-hooks-and-plugin/brief-command-policy-word.md
