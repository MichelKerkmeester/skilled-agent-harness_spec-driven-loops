---
title: "Packet purpose on relaunch"
description: "This scenario validates packet purpose carry for `plugins-and-hooks-packet-purpose-relaunch`. It focuses on the purpose line that opens the handoff note Goal."
trigger_phrases:
  - "packet purpose on relaunch"
  - "handoff note purpose line"
  - "relaunch note Goal"
id: plugins-and-hooks-packet-purpose-relaunch
version: 1.0.0.0
---

# Packet purpose on relaunch

---

## 1. OVERVIEW

A relaunch hands the work to a fresh session through a handoff note. The note records the packet, the next step and the progress. Its `## Goal` opens with one purpose sentence. The line names the packet's own purpose, the nearest phase parent's purpose or the `goal.md` Objective. The note never opens with a placeholder.

This scenario validates:

- the handoff note's `## Goal` opens with the purpose line
- the relaunch contract test passes without a model

---

## 2. SCENARIO CONTRACT

- Objective: confirm the relaunch note opens with the packet purpose and the relaunch contract holds.
- Preconditions: repository checked out at project root, Node.js available on `PATH` and a bound packet with a purpose. `/speckit:handoff` is available on the runtime under test. The wrapper can write a note.
- Real user request: `Hand this session to a fresh one and show me the Goal in the handoff note. Check a packet with its own purpose and a packet that inherits one. Report a PASS or FAIL verdict with the opening line of each Goal.`
- Prompt: `Hand this session to a fresh one and show me the Goal in the handoff note. Check a packet with its own purpose and a packet that inherits one. Report a PASS or FAIL verdict with the opening line of each Goal.`
- Expected execution process: run the relaunch contract test, run the handoff command for a bound packet, open the note and compare the first line under `## Goal` with the packet's purpose source.
- Expected signals: the test suite passes with no failed test. The first line under `## Goal` is `Purpose: <sentence>`, `Parent purpose (<repo-relative parent folder>): <sentence>` or `Goal objective: <sentence>`. The sentence matches its source and is cut to at most 300 characters.
- Desired user-visible outcome: the fresh session knows why the work exists before it reads the next step.
- Pass/fail: PASS if the contract test passes and the Goal opens with the correct purpose line, FAIL if the test fails, the line is missing, the line is a placeholder or the sentence differs from its source.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Hand this session to a fresh one and show me the Goal in the handoff note. Check a packet with its own purpose and a packet that inherits one. Report a PASS or FAIL verdict with the opening line of each Goal.`

### Commands

1. Run the relaunch contract test:

   ```bash
   node --test .skilled/hooks/session-relaunch/tests/nudge.test.cjs
   ```

   Expected: every test passes with no failed test. The suite checks the purpose line shape and the note contract.

2. Confirm the handoff command states the same rule:

   ```bash
   rg -n 'purpose line|Parent purpose|Goal objective' .skilled/commands/speckit/handoff.md
   ```

   Expected: the command names the purpose paragraph under `### Purpose`, the labelled paragraph in a purpose section, the phase parent fallback and the `goal.md` fallback.

3. Run `/speckit:handoff` for a bound packet and open the handoff note.

   ```bash
   rg -n -A3 '^## Goal$' <handoff-note>
   ```

   Expected: the first line after `## Goal` is `Purpose: <sentence>`. The sentence is the first sentence of the packet's purpose, copied word for word and cut to at most 300 characters.

4. Repeat step 3 for a phase child whose own purpose is a placeholder and whose phase parent states a purpose.

   Expected: the first line after `## Goal` is `Parent purpose (<repo-relative parent folder>): <sentence>`. The folder names the phase parent from the repository root.

5. Repeat step 3 for a packet with no purpose text and a `goal.md` Objective.

   Expected: the first line after `## Goal` is `Goal objective: <sentence>`. The sentence matches the Objective line.

### Expected

The handoff note opens its Goal with one purpose line. The label names the source. The sentence matches the source text. The contract test passes without a model.

### Evidence

Capture the test command, its full output and its exit status. For each note, capture the path, the first lines under `## Goal` and the source sentence the line copies. Record the label that names the source.

### Pass / Fail

- **Pass**: the contract test passes and each Goal opens with the documented line shape and the correct sentence.
- **Fail**: the test fails, the Goal opens with another line, the line is a placeholder or the sentence differs from its source.

### Failure Triage

1. Re-run the contract test on its own and record the exit status. The first failed test names the failing rule.
2. Confirm the handoff note exists and carries a `## Goal` heading. Read the three lines under it.
3. Compare the purpose line with the source sentence. Confirm the packet heading, the label or the phase parent that supplied the text.
4. Confirm `.skilled/commands/speckit/handoff.md` still carries the purpose rule, because the note follows that text.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [packet-purpose-carry.md](../../feature-catalog/context-preservation/packet-purpose-carry.md)
- Relaunch note helper: `.skilled/hooks/session-relaunch/lib/nudge.cjs`
- Handoff command: `.skilled/commands/speckit/handoff.md`
- Purpose reader: `runtime/lib/spec/packet-purpose.ts`
- Relaunch contract test: `.skilled/hooks/session-relaunch/tests/nudge.test.cjs`

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: packet-purpose-relaunch
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/packet-purpose-relaunch.md`
