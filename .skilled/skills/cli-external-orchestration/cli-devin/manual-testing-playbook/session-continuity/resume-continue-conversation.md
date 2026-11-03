---
title: "DV-023 -- Continue a Devin conversation after restart"
description: "This scenario validates Devin session continuity for DV-023. It checks that a fact set before restart is available after Devin continues the session."
version: 1.0.0.0
---

# DV-023 -- Continue a Devin conversation after restart

This document captures the conversation contract, execution flow, source anchors and metadata for DV-023.

---

## 1. OVERVIEW

This scenario validates Devin session continuity for DV-023. It focuses on recalling a fact from before the runner restarts the session.

### Why This Matters

When you continue a Devin session, the next request can depend on an earlier detail. This scenario checks that Devin keeps that context after the runner starts the same session again.

---

## 2. SCENARIO CONTRACT

Run the prompt and command sequence for DV-023. Check the captured Devin screens and history files after each turn.

- Objective: Confirm Devin recalls a phrase planted before the runner restarts the session.
- Real user request: Ask Devin to remember a phrase in a project file, then recall it after the session resumes.
- Prompt: Please remember the phrase in fact.txt for my next question, and print the phrase back to me now.
- Expected execution process: Create a phrase fixture in the scratch project, ask Devin to remember it and print it back, restart the subject through the runner's Devin continue flow, then ask for the phrase without repeating it.
- Expected signals: The first answer prints the phrase back after its echoed send, the restarted Devin screen shows its prompt line, and the final answer contains the phrase after its echoed send.
- Evidence requirements: The scratch fact.txt fixture, three turn screens, three turn history files and check outputs in the runtime evidence folder.
- Desired user-visible outcome: Devin returns the same phrase after the runner continues the session.
- Pass/fail: PASS if all three checks pass and the final answer contains the exact phrase after its echoed send. FAIL if the restart does not reach Devin's prompt line or Devin omits or changes the phrase.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: Please remember the phrase in fact.txt for my next question, and print the phrase back to me now.

### Conversation Script

```json conversation
{
  "runtimes": [
    "devin"
  ],
  "setup": [
    "if ! ( printf '%s\\n' 'silver fern 731' > fact.txt ) 2>/dev/null || [ ! -s fact.txt ]; then printf '%s\\n' 'SKIP: phrase fixture is unavailable'; exit 77; fi",
    "auth_status=\"$(devin auth status 2>&1 || true)\"; if ! printf '%s\\n' \"$auth_status\" | grep -Fqi 'Logged in'; then printf '%s\\n' 'SKIP: Devin authentication or network is unavailable'; exit 77; fi"
  ],
  "turns": [
    {
      "id": "plant-fact",
      "send": "Please remember the phrase in fact.txt for my next question, and print the phrase back to me now.",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}[Ff]older|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "after=$(awk 'index($0, \"Please remember the phrase\") { after=1; seen=1; next } after { print } END { if (!seen) exit 2 }' \"$CONVERSATION_TURN_DIR/history.txt\") || { printf '%s\\n' 'the echoed plant send is missing from history.txt'; exit 1; }; printf '%s\\n' \"$after\" | grep -Fq 'silver fern 731' || { printf '%s\\n' 'the reply never printed the phrase after the echoed send'; exit 1; }; printf '%s\\n' 'the reply printed the planted phrase after the echoed send'"
    },
    {
      "id": "restart-session",
      "action": "restart",
      "check": "prompt_line=\"$(grep -E '^❭ Ask Devin to build features' \"$CONVERSATION_TURN_DIR/screen.txt\" | tail -n 1)\"; [ -n \"$prompt_line\" ] || { printf '%s\\n' 'the restarted screen shows no Devin idle prompt line'; exit 1; }; printf '%s\\n' \"$prompt_line\""
    },
    {
      "id": "recall-fact",
      "send": "What phrase did I ask you to remember?",
      "questions": [
        {
          "match": "[Ss]pec[- ]folder|[Dd]ocumentation.{0,30}[Ff]older|[Ff]older.{0,30}([Ss]pec|[Dd]ocumentation)",
          "answer": {
            "reply": "D"
          },
          "optional": true
        }
      ],
      "check": "after=$(awk 'index($0, \"What phrase did I ask you to remember\") { after=1; seen=1; next } after { print } END { if (!seen) exit 2 }' \"$CONVERSATION_TURN_DIR/history.txt\") || { printf '%s\\n' 'the echoed recall send is missing from history.txt'; exit 1; }; printf '%s\\n' \"$after\" | grep -Fq 'silver fern 731' || { printf '%s\\n' 'the reply never recalled the phrase after the echoed send'; exit 1; }; printf '%s\\n' 'the reply recalled the planted phrase after the echoed send'"
    }
  ]
}
```

- The first send matches the contract prompt. It asks for the phrase to be printed back, because Devin shows a file read without the file's content, so only text the model itself prints can prove the plant.
- Setup creates fact.txt in the scratch project and skips the run when the fixture or Devin authentication is unavailable.
- The plant and recall checks drop everything up to and including that turn's echoed send in `history.txt` before they search, so neither the send nor the earlier plant turn can satisfy the recall, and a long reply that scrolls off the 50-row `screen.txt` still counts.
- The restart check matches Devin's idle prompt line, which begins `❭ ` and carries its placeholder text instead of ending after the marker, so a bare `❭` line cannot pass it and the check cannot be satisfied by the echoed send.
- Each send turn carries an optional spec-folder question entry, because the scratch project inherits the instructions that ask it in plain chat before any file write.

### Commands

1. node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue-conversation.md --runtime devin --scratch <scratch-dir-outside-repository> --out <evidence-dir>

Keep the scratch directory outside the repository.

### Expected

Devin reads fact.txt and prints the phrase back. After restart it reaches its idle prompt, then recalls silver fern 731 without seeing the phrase in the follow-up prompt.

### Evidence

The plant-fact, restart-session and recall-fact turn folders contain each captured screen, each full-scrollback history file and check result.

### Pass / Fail

- Pass: Every check passes and the final answer contains silver fern 731 after its echoed send.
- Fail: The restart does not reach Devin's prompt line, or either answer omits or changes the phrase.
- Skip: Devin is unavailable, cannot authenticate or reach its service, or fact.txt is unavailable. Record the blocker.

### Failure Triage

If the first check fails, read its history.txt after the echoed send: the check ignores the send, so a miss means the reply never printed the phrase from fact.txt. If the restart check fails, confirm the runner restarted Devin in the same scratch project and that the restarted pane reached its prompt line. If the final check fails, read its history.txt and confirm the runner used Devin's --continue flow.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| DV-023 | Continue Devin conversation after restart | Confirm a fact read from the first turn survives the runner's session restart | Please remember the phrase in fact.txt for my next question, and print the phrase back to me now. | node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs --scenario .skilled/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/session-continuity/resume-continue-conversation.md --runtime devin --scratch <scratch-dir-outside-repository> --out <evidence-dir> | Phrase printed back after the first send, idle prompt line after restart, then the phrase after the final send | Scratch fixture, three turn screens, three turn history files and check outputs | PASS if all checks pass and the phrase returns exactly; FAIL if restart or recall fails | Check the first reply's history.txt, the restart screen and the final reply's history.txt in that order |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root index and session continuity summary |
| [resume-continue.md](resume-continue.md) | Existing command-level continuation and resume scenario |
| [cli-reference.md](../../references/cli-reference.md) | Devin continuation flags |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [SKILL.md](../../SKILL.md) | Devin session dispatch and continuation guidance |
| [cli-reference.md](../../references/cli-reference.md) | Devin continue behavior |

---

## 5. SOURCE METADATA

- Group: Session Continuity
- Playbook ID: DV-023
- Canonical root source: manual-testing-playbook.md
- Feature file path: session-continuity/resume-continue-conversation.md
