---
title: "Packet purpose after a Claude compaction"
description: "This scenario validates packet purpose carry for `plugins-and-hooks-packet-purpose-claude-compaction`. It focuses on the section that leads a Claude compaction recovery."
trigger_phrases:
  - "packet purpose after a Claude compaction"
  - "Claude compaction purpose section"
  - "SessionStart compact packet purpose"
id: plugins-and-hooks-packet-purpose-claude-compaction
version: 1.0.1.0
---

# Packet purpose after a Claude compaction

---

## 1. OVERVIEW

A Claude compaction replaces the conversation with a recovery payload. On `SessionStart(source=compact)` the recovered context opens with `## Packet Purpose`, so the model reads why the work exists before it reads the summary. The section holds one purpose line and one `Problem:` line when the packet states a problem. A packet with no purpose text and no `goal.md` Objective gets no section.

This scenario validates:

- the recovered context opens with `## Packet Purpose`
- a `Problem:` line follows the purpose when the packet states a problem
- a packet with no purpose gets no section. The rest of the recovery stays intact

---

## 2. SCENARIO CONTRACT

- Objective: confirm a Claude compaction recovery leads with the packet purpose and keeps the problem beside it.
- Preconditions: repository checked out at project root, the runtime dependencies installed so `npx vitest` resolves under the runtime folder and a Claude session available for a live compaction. Three packets are ready. The first states a purpose and a problem. The second states a purpose and no problem. The third has no purpose text and no `goal.md` Objective.
- Real user request: `Compact a Claude session that is bound to a packet and show me the start of the recovered context. Check a packet with a problem, a packet without one and a packet with no purpose. Report a PASS or FAIL verdict with the first lines of each recovery.`
- Prompt: `Compact a Claude session that is bound to a packet and show me the start of the recovered context. Check a packet with a problem, a packet without one and a packet with no purpose. Report a PASS or FAIL verdict with the first lines of each recovery.`
- Expected execution process: run the session-start suite, compact one bound Claude session per prepared packet and read the start of each recovered context.
- Expected signals: the first recovery starts with `## Packet Purpose`, then `Purpose: <sentence>`, then `Problem: <sentence>`. The second starts with the same section and has no `Problem:` line. The third has no `## Packet Purpose` section and keeps the rest of the recovery.
- Desired user-visible outcome: the model reads the reason the work exists first. It still reads the problem when the packet states one.
- Pass/fail: PASS if the three recoveries match the signals above, FAIL if the section is missing when a purpose exists, the order is wrong or a missing purpose breaks the recovery.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Compact a Claude session that is bound to a packet and show me the start of the recovered context. Check a packet with a problem, a packet without one and a packet with no purpose. Report a PASS or FAIL verdict with the first lines of each recovery.`

### Commands

1. Run the session-start suite:

   ```bash
   cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/hook-session-start.vitest.ts
   ```

   Expected: every test passes with no failed test. The suite covers the section order, the problem line and the case with no packet purpose.

2. Compact a Claude session bound to the packet that states a purpose and a problem:

   ```bash
   rg -n -A2 '^### Purpose$|^### Problem Statement$' <packet-with-purpose-and-problem>/spec.md
   ```

   Expected: both headings exist. Each holds the sentence the recovery must quote.

3. Inspect the start of the recovered context for the first packet.

   Expected: `## Packet Purpose` is the first section. The next line is `Purpose: <sentence>`. The next line is `Problem: <sentence>`. Both sentences match their headings.

4. Repeat steps 2 and 3 for the packet with a purpose and no problem.

   Expected: `## Packet Purpose` leads the recovery and holds only the `Purpose:` line.

5. Repeat steps 2 and 3 for the packet with no purpose text and no `goal.md` Objective.

   Expected: no `## Packet Purpose` section appears. The recovered context still carries its summary and its recovery pointer.

### Expected

The section leads each recovery when a purpose exists. The problem line follows the purpose only when the packet states a problem. A missing purpose drops the section and leaves the recovery intact.

### Evidence

Capture the test command, its full output and its exit status. For each live compaction, capture the first ten lines of the recovered context verbatim. Record the source sentence for the purpose and the problem. Record the section count when no purpose exists.

### Pass / Fail

- **Pass**: the suite passes and each live recovery matches the documented section order and content.
- **Fail**: the suite fails, the section is missing when a purpose exists, the order is wrong or a missing purpose breaks the recovery.

### Failure Triage

1. Re-run the suite on its own and record the exit status. The first failed test names the failing rule.
2. Confirm the compaction completed without error and that the session named the packet as its last active folder.
3. Confirm the packet holds the text the case expects under `### Purpose` and `### Problem Statement`.
4. Confirm the runtime build is current, because a stale build can drop the section without failing the compaction.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [packet-purpose-carry.md](../../feature-catalog/context-preservation/packet-purpose-carry.md)
- Purpose reader: `runtime/lib/spec/packet-purpose.ts`
- Claude SessionStart hook: `runtime/hooks/claude/session-prime.ts`
- Session-start suite: `runtime/tests/hook-session-start.vitest.ts`

Provenance: .skilled/skills/system-spec-kit/runtime/tests/hook-session-start.vitest.ts

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: packet-purpose-claude-compaction
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/packet-purpose-claude-compaction.md`
