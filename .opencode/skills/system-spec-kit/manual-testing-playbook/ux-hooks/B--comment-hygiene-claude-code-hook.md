---
title: "119-B -- Comment Hygiene — Claude Code PostToolUse Hook"
description: "This scenario validates the Claude Code PostToolUse write-time hook for `119-B`. It focuses on confirming the hook fires on Write and Edit tool calls, prints a warning when violations are found, remains fail-safe (exits 0 and never blocks), and stays silent on clean files."
version: 3.6.0.5
id: ux-hooks-b-comment-hygiene-claude-code-hook
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 119-B -- Comment Hygiene — Claude Code PostToolUse Hook

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `119-B`.

---

## 1. OVERVIEW

This scenario validates the Claude Code PostToolUse write-time hook for `119-B`. It focuses on confirming the hook fires on Write and Edit tool calls, injects a `COMMENT HYGIENE WARNING` into the tool result, exits 0 (non-blocking), and stays silent on clean files.

### Why This Matters

Claude Code is the only runtime with write-time comment hygiene enforcement. The PostToolUse hook gives the AI real-time feedback the moment it writes a forbidden comment — before it moves on. If the hook is mis-wired, missing, or blocking (non-zero exit), the AI never self-corrects and violations accumulate silently until the pre-commit gate catches them. Run `119-A` first.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `119-B` and confirm the expected signals without contradictory evidence.

- Objective: Confirm the PostToolUse hook fires on Write/Edit, injects a warning for forbidden comments, exits 0 (fail-safe), and produces no warning for allowed-class comments.
- Real user request: `Add a comment to violation.ts then to allowed.ts. Tell me what hook warnings you see after each write.`
- Prompt: `Write a comment to /tmp/hygiene-sandbox/violation.ts then to /tmp/hygiene-sandbox/allowed.ts. Report any hook warnings you observe after each write.`
- Expected execution process: Shell simulation confirms hook output matches expected format; live Claude Code session confirms the warning appears in the tool result and the session continues normally after both writes.
- Expected signals: Warning block containing `COMMENT HYGIENE WARNING` after the violation write; no warning output after the allowed write; both hook invocations exit 0.
- Desired user-visible outcome: Claude reports seeing the hook warning after the first write and no warning after the second write. Session is not blocked by either write.
- Pass/fail: PASS if warning appears for violation.ts, no warning for allowed.ts, and both exits are 0; FAIL if warning is missing, a false warning fires, or any exit is non-zero.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request: ask Claude Code to write comments to both fixture files and observe hook output.
2. Confirm hook is wired before the live test using the prerequisite check.
3. Run the shell simulation to confirm hook output without a full session.
4. Execute the live Claude Code session and record the tool-result hook output.
5. Return a concise verdict citing the hook warning presence/absence and exit codes.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| 119-B | Claude Code PostToolUse hook | Verify hook fires on Write/Edit, warns on violation, silent on clean, exits 0 | `Write a comment to /tmp/hygiene-sandbox/violation.ts then to /tmp/hygiene-sandbox/allowed.ts. Report any hook warnings you observe after each write.` | 1. `python3 -c "import json; d=json.load(open('.claude/settings.json')); print('PostToolUse' in d['hooks'])"` -> 2. `echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/hygiene-sandbox/violation.ts","content":"// REQ-011: lease cleanup\nconst x=1;"},"cwd":"'"$(pwd)"'"}' \| python3 .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh; echo "EXIT:$?"` -> 3. `echo '{"tool_name":"Write","tool_input":{"file_path":"/tmp/hygiene-sandbox/allowed.ts","content":"// SEC: input sanitize (CWE-79)\nconst y=2;"},"cwd":"'"$(pwd)"'"}' \| python3 .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh; echo "EXIT:$?"` -> 4. Live Claude Code session: prompt above -> observe tool result | Step 1: `True`; Step 2: `COMMENT HYGIENE WARNING` block + EXIT:0; Step 3: (empty) + EXIT:0; Step 4: warning visible in tool result, session continues | Step 1 stdout: `True`<br>Step 2 stdout: `EXIT:0`<br>Step 3 stdout: `EXIT:0`<br>Step 4 not run: current task allows writes only to `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/B--comment-hygiene-claude-code-hook.md`; the live prompt would write `/tmp/hygiene-sandbox/violation.ts` and `/tmp/hygiene-sandbox/allowed.ts`. | FAIL — Step 2 did not print `COMMENT HYGIENE WARNING`; both shell invocations exited 0, and Step 3 stayed silent as expected. | If `False` at step 1: add PostToolUse entry to `.claude/settings.json`; if hook exits non-zero: run `python3 .opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh < /dev/null` to expose the exception; if warning missing in live session but simulation works: confirm `.claude/settings.json` is the project file in CWD |

### Optional Supplemental Checks

**Fail-safe on missing script**: temporarily rename `claude-posttooluse.sh`, trigger a Write, confirm the hook exits 0 with a stderr warning rather than blocking.

**Edit tool parity**: repeat step 2–3 using `tool_name: "Edit"` instead of `"Write"` — the hook must fire for both matchers.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../../../specs/skilled-agent-orchestration/z_archive/119-comment-ref-hygiene/002-active-enforcement-layer/spec.md` | REQ-004 defines PostToolUse hook acceptance criteria |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` | Primary implementation anchor — the PostToolUse hook script |
| `.claude/settings.json` | Hook wiring config — PostToolUse `Write\|Edit` entry |
| `.opencode/specs/skilled-agent-orchestration/z_archive/119-comment-ref-hygiene/002-active-enforcement-layer/checklist.md` | CHK-030/031/032/033 — regression checklist for this scenario |

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 119-B
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/B--comment-hygiene-claude-code-hook.md`
- audited_post_018: true
