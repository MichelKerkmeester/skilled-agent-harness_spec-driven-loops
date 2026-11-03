---
title: "CX-030 -- session resume memory after restart"
description: "This scenario validates session memory after restart for `CX-030`. It focuses on returning a fact supplied before the Codex session resumes."
stage: routing
id: CX-030
version: 1.0.0.0
---

# CX-030 -- session resume memory after restart

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CX-030`.

---

## 1. OVERVIEW

This scenario validates Codex session memory after restart for `CX-030`. It focuses on confirming that a fact supplied before a runner restart remains available in the resumed session.

### Why This Matters

The existing CX-017 scenario checks resume and fork command behavior. This companion checks that a resumed Codex session can use a fact from before the restart without storing that fact in the scratch project.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CX-030` and confirm the expected signals without contradictory evidence.

- Objective: Verify a fact supplied to Codex before a session restart is recalled afterward and written exactly to a scratch-project file.
- Real user request: `Remember this exact marker for my next message: COPPER-ORCHID-731. Do not write it to the project or any other file. Reply briefly to confirm.`
- Prompt: `Remember this exact marker for my next message: COPPER-ORCHID-731. Do not write it to the project or any other file. Reply briefly to confirm.`
- Expected execution process: Run the conversation script with Codex in an isolated scratch project. The runner sends the marker, restarts the same session and asks Codex to write the recalled marker to `resume-answer.txt`.
- Expected signals: The marker is absent from scratch-project files after the first turn, appears in the resumed session output after restart, and is written as the sole line in `resume-answer.txt` after the recall prompt.
- Desired user-visible outcome: Codex resumes with the earlier fact and returns it correctly without relying on a scratch-project copy.
- Pass/fail: PASS if every turn check succeeds and `resume-answer.txt` contains exactly `COPPER-ORCHID-731`; FAIL if the marker is present in a project file before restart, is absent from the resumed output, or the answer file is missing or differs.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Remember this exact marker for my next message: COPPER-ORCHID-731. Do not write it to the project or any other file. Reply briefly to confirm.`

### Conversation Script

```json conversation
{
  "runtimes": ["codex"],
  "turns": [
    {
      "id": "plant-marker",
      "send": "Remember this exact marker for my next message: COPPER-ORCHID-731. Do not write it to the project or any other file. Reply briefly to confirm.",
      "check": "grep -R -F -q 'COPPER-ORCHID-731' .; status=$?; test \"$status\" -eq 1"
    },
    {
      "id": "restart-session",
      "action": "restart",
      "check": "grep -F -q 'COPPER-ORCHID-731' \"$CONVERSATION_TURN_DIR/screen.txt\""
    },
    {
      "id": "recall-marker",
      "send": "What exact marker did I ask you to remember before this session restarted? Return only that marker, on one line, in resume-answer.txt at the project root. Do not inspect project files to find it.",
      "check": "grep -F -x -q 'COPPER-ORCHID-731' resume-answer.txt"
    }
  ]
}
```

The first `send` matches the scenario contract prompt exactly. Each check is read-only and runs against the scratch project or captured Codex output.

### Commands

1. `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-codex/manual-testing-playbook/session-continuity/session-resume-fork-conversation.md --runtime codex --scratch /tmp/cli-codex-cx030-scratch --out /tmp/cli-codex-cx030-evidence`

The scratch directory is outside the repository. The runner records the turn screens, check results, checkpoints and runtime result under the evidence directory.

### Expected

- The first turn leaves no file in the scratch project containing the marker.
- Restart resumes the same Codex session and the captured screen contains the earlier marker.
- The recall turn creates `resume-answer.txt` with exactly `COPPER-ORCHID-731` on one line.
- The runtime result records PASS for every turn and no repository change.

### Evidence

Keep `result.json`, `checkpoints.tsv`, each turn's `screen.txt` and `check.txt`, and the scratch project's `resume-answer.txt` with the manual run record.

### Pass / Fail

- **Pass**: All three checks exit 0, the resumed screen contains the marker, `resume-answer.txt` contains exactly the marker, and the runtime result reports no repository change.
- **Fail**: Any check fails, the post-restart answer is missing or differs from the marker, or the runtime result reports a repository change.

### Failure Triage

1. Compare each turn's `screen.txt` and `check.txt` to identify whether the marker was planted, the session resumed, or recall failed.
2. Confirm the run used a fresh scratch project and resumed the same Codex session.
3. If Codex could not start because it was unauthenticated, out of quota or unavailable, record `SKIP` with that blocker; otherwise record `FAIL` with the failing turn evidence.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `../manual-testing-playbook.md` | Root directory page and scenario summary |
| `session-resume-fork.md` | Existing CX-017 command-level resume and fork scenario |
| `../../references/cli-reference.md` (§11) | Documents Codex session resume behavior |
| `../../references/codex-tools.md` (§2) | Documents Codex session-management capabilities |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/cli-reference.md` | Session subcommands and scripted session resume |
| `../../references/codex-tools.md` | Session management behavior |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: CX-030
- Canonical root source: `../manual-testing-playbook.md`
- Feature file path: `session-continuity/session-resume-fork-conversation.md`
