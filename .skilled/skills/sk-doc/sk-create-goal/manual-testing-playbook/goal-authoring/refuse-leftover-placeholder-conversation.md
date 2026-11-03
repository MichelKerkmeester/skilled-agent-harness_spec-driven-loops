---
title: "SCG-010 -- Resolve a leftover placeholder after a decision"
description: "This scenario validates the answer-dependent placeholder recovery for `SCG-010` on Claude Code and OpenCode. It focuses on replacing an unresolved goal decision on a follow-up turn and passing the goal checks."
stage: routing
version: 1.0.0.0
---

# SCG-010 -- Resolve a leftover placeholder after a decision

This document captures the realistic conversation contract, current behavior, execution flow, source anchors and metadata for `SCG-010`.

---

## 1. OVERVIEW

This scenario validates the answer-dependent recovery for `SCG-010`. It focuses on replacing an unresolved goal decision on a follow-up turn and passing the goal checks.

Pi was tried on 2026-11-03 and dropped: it stops at the unresolved decision with a three-way choice dialog this script does not answer.

### Why This Matters

The refusal in SCG-005 is correct while the counter rule is undecided. Once the operator supplies the decision, the goal should move from a placeholder finding to a clean pass. Separate turns make the dependency visible: the final result must follow the operator's answer.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SCG-010` and confirm the expected signals without contradictory evidence.

- Objective: prove that a goal with an unresolved decision fails first, then passes after the operator supplies the decision on a later turn
- Real user request: `Write the demo packet goal, then wait for me to decide how the counter updates.`
- Prompt: `Author the goal for the scratch demo packet at specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet, so leave that decision as the template placeholder.`
- Expected execution process: Setup copies `.claude/` for Claude Code, `opencode.json` and `.opencode/` for OpenCode, and `.skilled/` into each scratch project. Turn 1 authors the unresolved D1 placeholder and reports the expected finding without printing the slice. Turn 2 supplies the append-only rule, amends that goal and prints the slice only after the checker passes.
- Expected signals: Turn 1 retains the literal D1 placeholder and reports the named decision-placeholder finding. Claude Code searches history.txt after its echoed send. OpenCode searches the assistant reply in the final screen.txt frame after the last Goal file: anchor and excludes the side panel. Turn 2 records the supplied append-only rule, reports RESULT: PASSED (5/5 checks) and includes both slice headings in that runtime's reply evidence. OpenCode requires standalone rendered heading lines, accepts optional Markdown heading markers and does not depend on the echoed send.
- Desired user-visible outcome: after the operator supplies the missing decision, the author receives a passing goal check and its chat slice to set or resend.
- Pass/fail: PASS if turn 1 detects and retains the seeded placeholder without printing a slice, and turn 2 records the supplied decision, passes all five goal checks and includes both slice headings in the runtime-specific reply evidence. FAIL if either goal state or checker result is wrong, a slice prints while the placeholder remains, or either heading is absent after the final check passes.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Author the goal for the scratch demo packet at specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet, so leave that decision as the template placeholder.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SCG-010 | Resolve a leftover placeholder after a decision | Fail on the unresolved decision, then pass after the operator supplies it | `Author the goal for the scratch demo packet at specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet, so leave that decision as the template placeholder.` | 1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder-conversation.md --runtime claude-code,opencode --scratch <scratch-dir-outside-repository> --out <evidence-dir>` | Turn 1 retains the placeholder and reports its finding with no slice in the runtime reply. Turn 2 records append-only, passes 5/5 checks and prints both slice headings. | Per-runtime result.json and setup.log; both turns' screen.txt, history.txt and check.txt; captured question evidence when present; final goal.md and printed slice. | PASS when both turns meet their state, checker and reply expectations. FAIL when turn 1 misses or mishandles the placeholder, turn 2 misses the supplied decision or 5/5 pass, or a reply heading is absent. | Compare turn 1's finding with the seeded D1 placeholder. On turn 2 compare D1 with the supplied rule and inspect all five checker results. Claude Code uses history.txt after the send. OpenCode checks only the final reply in screen.txt, excluding the side panel. |

### Conversation Script

```json conversation
{
  "runtimes": [
    "claude-code",
    "opencode"
  ],
  "setup": [
    "case \"$CONVERSATION_RUNTIME\" in claude-code) if ! claude auth status >/dev/null 2>&1; then printf '%s\\n' 'Claude Code authentication is unavailable'; exit 77; fi ;; opencode) if ! command -v opencode >/dev/null 2>&1; then printf '%s\\n' 'OpenCode CLI is unavailable'; exit 77; fi; if [ ! -f \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\" ] || ! grep -Fq '\"llmgateway\"' \"${XDG_DATA_HOME:-$HOME/.local/share}/opencode/auth.json\"; then printf '%s\\n' 'OpenCode llmgateway login is unavailable'; exit 77; fi; if ! command -v curl >/dev/null 2>&1 || ! curl -sS -o /dev/null -I --max-time 10 https://api.llmgateway.io/ >/dev/null 2>&1; then printf '%s\\n' 'LLM Gateway network access is unavailable'; exit 77; fi ;; pi) if ! command -v pi >/dev/null 2>&1; then printf '%s\\n' 'Pi CLI is unavailable'; exit 77; fi; if [ ! -s \"${PI_CODING_AGENT_DIR:-$HOME/.pi/agent}/auth.json\" ] && ! env | grep -q '_API_KEY=.'; then printf '%s\\n' 'Pi login unavailable: no auth.json or provider API key'; exit 77; fi ;; *) printf '%s\\n' 'Unsupported conversation runtime'; exit 77 ;; esac",
    "git init",
    "case \"$CONVERSATION_RUNTIME\" in claude-code) if [ ! -d \"$CONVERSATION_REPO_ROOT/.claude\" ]; then printf '%s\\n' 'Claude Code project config is missing'; exit 77; fi; rm -rf .claude && cp -R \"$CONVERSATION_REPO_ROOT/.claude\" .claude ;; opencode) if [ ! -f \"$CONVERSATION_REPO_ROOT/opencode.json\" ] || [ ! -d \"$CONVERSATION_REPO_ROOT/.opencode\" ]; then printf '%s\\n' 'OpenCode project config is missing'; exit 77; fi; rm -rf opencode.json .opencode && cp \"$CONVERSATION_REPO_ROOT/opencode.json\" ./opencode.json && cp -R \"$CONVERSATION_REPO_ROOT/.opencode\" .opencode ;; pi) if [ ! -d \"$CONVERSATION_REPO_ROOT/.pi\" ]; then printf '%s\\n' 'Pi project config is missing'; exit 77; fi; rm -rf .pi && cp -R \"$CONVERSATION_REPO_ROOT/.pi\" .pi ;; esac",
    "cp -R \"$CONVERSATION_REPO_ROOT/.skilled\" .skilled",
    "rm -rf .skilled/skills/.state",
    "mkdir -p specs/demo-packet",
    "cat > specs/demo-packet/spec.md <<'EOF'\n# Demo packet specification\n\n## Problem and purpose\n\nTwo concurrent runs update counter.txt, and the file sometimes loses or duplicates a run result. This packet defines a reliable counter update.\nEOF",
    "cat > specs/demo-packet/acceptance-criteria.md <<'EOF'\n# Acceptance criteria\n\n- [ ] counter.txt records one result for each completed run\n- [ ] concurrent runs preserve every completed result\n- [ ] the saved results make the count of completed runs checkable\nEOF"
  ],
  "turns": [
    {
      "id": "unresolved-decision",
      "send": "Author the goal for the scratch demo packet at specs/demo-packet with /create:goal top-level :auto. I have not decided the counter update rule yet, so leave that decision as the template placeholder.",
      "questions": [
        {
          "match": "[Ss]pec(?:ification)?[- ](?:folder|directory|location|packet)|[Dd]ocumentation (?:folder|scope|path|home)|[Gg]ate 3|[Ww]here should this change live",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec(?:ification)?[- ](?:folder|directory|location|packet)|[Dd]ocumentation (?:folder|scope|path|home)|[Gg]ate 3|[Ww]here should this change live",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "goal_check_output=\"$(node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root \"$PWD\" 2>&1)\"; goal_check_status=$?; printf '%s\\n' \"$goal_check_output\"; test \"$goal_check_status\" -eq 1 || { printf '%s\\n' \"the goal check exited $goal_check_status instead of 1\"; exit 1; }; printf '%s\\n' \"$goal_check_output\" | grep -Fq 'decision table contains unfilled template text' || { printf '%s\\n' 'the decision-placeholder finding is missing'; exit 1; }; grep -Fq '[A frozen choice from spec.md or decision-record.md, stated so a reader can tell whether work honors it]' specs/demo-packet/goal.md || { printf '%s\\n' 'the goal no longer holds the seeded decision placeholder'; exit 1; }; case \"$CONVERSATION_RUNTIME\" in claude-code|pi) reply=$(awk 'index($0, \"Author the goal for the scratch demo packet\") { after=1; seen=1; next } after { print } END { if (!seen) exit 2 }' \"$CONVERSATION_TURN_DIR/history.txt\") || { printf '%s\\n' 'the echoed goal-authoring send is missing from history.txt'; exit 1; } ;; opencode) reply=$(tail -n 40 \"$CONVERSATION_TURN_DIR/screen.txt\") ;; *) printf '%s\\n' 'unsupported conversation runtime'; exit 1 ;; esac; if [ \"$CONVERSATION_RUNTIME\" = opencode ]; then if printf '%s\\n' \"$reply\" | grep -Eiq '^[[:space:]]*(#+[[:space:]]*)?(DURABLE DIRECTIVE|COMPLETION CRITERIA)[[:space:]]*$'; then printf '%s\\n' 'the chat slice printed while the placeholder finding stood'; exit 1; fi; elif printf '%s\\n' \"$reply\" | grep -Eiq 'DURABLE DIRECTIVE|COMPLETION CRITERIA'; then printf '%s\\n' 'the chat slice printed while the placeholder finding stood'; exit 1; fi; printf '%s\\n' 'placeholder finding reported, placeholder kept, no chat slice printed'"
    },
    {
      "id": "decision-supplied",
      "send": "The counter update is append-only. A run never rewrites existing lines. Please update the goal for specs/demo-packet to include that rule.",
      "questions": [
        {
          "match": "[Ss]pec(?:ification)?[- ](?:folder|directory|location|packet)|[Dd]ocumentation (?:folder|scope|path|home)|[Gg]ate 3|[Ww]here should this change live",
          "answer": {
            "select": [
              "Skip"
            ]
          },
          "optional": true
        },
        {
          "match": "[Ss]pec(?:ification)?[- ](?:folder|directory|location|packet)|[Dd]ocumentation (?:folder|scope|path|home)|[Gg]ate 3|[Ww]here should this change live",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "goal_check_output=\"$(node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs specs/demo-packet --root \"$PWD\" 2>&1)\"; goal_check_status=$?; printf '%s\\n' \"$goal_check_output\"; test \"$goal_check_status\" -eq 0 || { printf '%s\\n' \"the goal check exited $goal_check_status instead of 0\"; exit 1; }; printf '%s\\n' \"$goal_check_output\" | grep -Fq 'RESULT: PASSED (5/5 checks)' || { printf '%s\\n' 'the goal check did not report RESULT: PASSED (5/5 checks)'; exit 1; }; grep -Eiq 'append[- ]only' specs/demo-packet/goal.md || { printf '%s\\n' 'the goal records no append-only decision'; exit 1; }; case \"$CONVERSATION_RUNTIME\" in claude-code|pi) reply=$(awk 'index($0, \"The counter update is append-only\") { after=1; seen=1; next } after { print } END { if (!seen) exit 2 }' \"$CONVERSATION_TURN_DIR/history.txt\") || { printf '%s\\n' 'the echoed decision send is missing from history.txt'; exit 1; } ;; opencode) reply=$(tail -n 40 \"$CONVERSATION_TURN_DIR/screen.txt\") ;; *) printf '%s\\n' 'unsupported conversation runtime'; exit 1 ;; esac; if [ \"$CONVERSATION_RUNTIME\" = opencode ]; then printf '%s\\n' \"$reply\" | grep -Eiq '^[[:space:]]*(#+[[:space:]]*)?DURABLE DIRECTIVE[[:space:]]*$' || { printf '%s\\n' 'no chat slice heading appeared in the reply evidence'; exit 1; }; else printf '%s\\n' \"$reply\" | grep -Eiq 'DURABLE DIRECTIVE' || { printf '%s\\n' 'no chat slice heading appeared in the reply evidence'; exit 1; }; fi; if [ \"$CONVERSATION_RUNTIME\" = opencode ]; then printf '%s\\n' \"$reply\" | grep -Eiq '^[[:space:]]*(#+[[:space:]]*)?COMPLETION CRITERIA[[:space:]]*$' || { printf '%s\\n' 'the printed slice stops before the completion criteria'; exit 1; }; else printf '%s\\n' \"$reply\" | grep -Eiq 'COMPLETION CRITERIA' || { printf '%s\\n' 'the printed slice stops before the completion criteria'; exit 1; }; fi; printf '%s\\n' 'goal check passed, decision recorded, whole chat slice printed'"
    }
  ]
}
```

- The first `send` matches the contract prompt exactly. The second send supplies the decision in the same session.
- Setup selects the authentication and project configuration for CONVERSATION_RUNTIME: Claude Code gets `.claude`, while OpenCode gets `opencode.json` and `.opencode`. It copies `.skilled`, removes copied runtime state and writes the neutral fixtures only inside the scratch project.
- Every check reads the scratch goal.md and checker output. Claude Code reads history.txt after the echoed send. OpenCode reads the final screen.txt frame, starts at the last Goal file: anchor and keeps the left 150-column conversation area so context-sidebar headings cannot affect the assertion. No OpenCode check anchors on the echoed send.
- The slice markers are the un-numbered DURABLE DIRECTIVE and COMPLETION CRITERIA headings. The goal file keeps its numbered heading. OpenCode matches each marker as a standalone line in the final assistant reply area, not as a phrase in prose or in the context side panel.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/sk-doc/sk-create-goal/manual-testing-playbook/goal-authoring/refuse-leftover-placeholder-conversation.md --runtime claude-code,opencode --scratch <scratch-dir-outside-repository> --out <evidence-dir>`

The scratch directory must be outside the repository.

### Expected

Turn 1 leaves the goal at the template placeholder. The checker reports the placeholder finding, so the check passes only when that failure is present, the placeholder survives and the reply evidence carries no slice heading. Claude Code inspects history.txt after the current send. OpenCode inspects standalone heading lines in the assistant reply area of the final screen.txt frame and excludes the side panel. Turn 2 amends that same goal with the supplied append-only decision. The checker reports five passing checks and the reply evidence carries both headings. OpenCode accepts rendered heading words with optional Markdown markers and does not rely on the echoed send.

### Evidence

Capture each runtime's result.json and setup.log, both prompts and replies, each turn's screen.txt, history.txt and complete check.txt with exit code, any captured question evidence, the final goal.md decision row and the printed chat slice. Claude Code checks inspect the current reply in history.txt after the echoed send. OpenCode checks inspect only the final assistant reply area in screen.txt.

### Pass / Fail

- **Pass**: turn 1 confirms the named placeholder failure, retains the placeholder and prints no slice in that runtime's reply evidence. Turn 2 confirms the supplied append-only decision, RESULT: PASSED (5/5 checks) and both slice headings in that runtime's reply evidence.
- **Fail**: turn 1 has no placeholder finding, changes the seeded placeholder or prints a slice; turn 2 records no supplied decision, fails any goal check or omits either heading after the final check passes.
- **SKIP**: setup prints a one-line blocker and exits 77 when Claude Code or OpenCode authentication or project configuration is unavailable. The same outcome applies when OpenCode lacks required network access or a sandbox blocker prevents the scratch-project run.

### Failure Triage

1. Compare the first `FINDING` line with the D1 row in the scratch goal.
2. If the second check fails, compare the final D1 row with the decision sent on turn 2 and inspect all five check results.
3. If the second reply evidence has no slice heading, confirm the passing checker result preceded the handoff. Claude Code reads history.txt after the current send. OpenCode reads the assistant reply area in the final screen.txt frame after the last Goal file: anchor, excluding the side panel and without relying on Markdown markers or the echoed send.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page, scenario summary and index |
| No feature-catalog entry | This packet ships no `feature-catalog/`, so no catalog cross-reference exists for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`../../scripts/check-goal.cjs`](../../scripts/check-goal.cjs) | Read-only goal checks, including the placeholder finding |
| [`../../assets/goal-top-level-template.md`](../../assets/goal-top-level-template.md) | Top-level goal template that supplies the D1 placeholder |
| [`../../SKILL.md`](../../SKILL.md) | Goal authoring, check and chat-slice handoff order |
| [`../../references/parent-and-nested-goals.md`](../../references/parent-and-nested-goals.md) | Workflow for amending an existing top-level goal |

---

## 5. SOURCE METADATA

- Group: GOAL AUTHORING
- Playbook ID: SCG-010
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `goal-authoring/refuse-leftover-placeholder-conversation.md`
