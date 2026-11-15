---
title: "Packet purpose after a Pi compaction"
description: "This scenario validates packet purpose carry for `plugins-and-hooks-packet-purpose-pi-compaction`. It focuses on the section that leads a Pi compaction message."
trigger_phrases:
  - "packet purpose after a Pi compaction"
  - "Pi compaction purpose section"
  - "session_compact packet purpose"
id: plugins-and-hooks-packet-purpose-pi-compaction
version: 1.0.1.0
---

# Packet purpose after a Pi compaction

---

## 1. OVERVIEW

Pi injects a recovery message after `session_compact`. The message opens with `## Packet Purpose`, so the model reads why the work exists before it reads the summary. The section holds one purpose line and one `Problem:` line when the packet states a problem. A session that started in a `scratch` subfolder still gets the packet's purpose, because the reader walks up to the packet folder.

This scenario validates:

- the injected message opens with `## Packet Purpose`
- the section carries the purpose and problem lines
- a session started in a `scratch` subfolder gets the same section

---

## 2. SCENARIO CONTRACT

- Objective: confirm a Pi compaction message leads with the packet purpose, including from a subfolder.
- Preconditions: repository checked out at project root, Node.js available on `PATH`, the runtime dependencies installed and a Pi session available for a live compaction. Two packets are ready. The first states a purpose and a problem. The second states a purpose and no problem. One session starts at the packet folder and one starts in its `scratch` subfolder.
- Real user request: `Compact a Pi session that is bound to a packet and show me the injected message. Check a packet with a problem, a packet without one and a session started in a scratch subfolder. Report a PASS or FAIL verdict with the first lines of each message.`
- Prompt: `Compact a Pi session that is bound to a packet and show me the injected message. Check a packet with a problem, a packet without one and a session started in a scratch subfolder. Report a PASS or FAIL verdict with the first lines of each message.`
- Expected execution process: build the runtime, run the adapter suite, compact one bound Pi session per prepared case and read the start of each injected message.
- Expected signals: each message starts with `## Packet Purpose`, then `Purpose: <sentence>`. The first case adds `Problem: <sentence>`. The subfolder case carries the same section and the same sentence as the packet folder case.
- Desired user-visible outcome: the model reads the reason the work exists first, from the packet folder or from a subfolder of it.
- Pass/fail: PASS if the suite passes and each message matches the signals above, FAIL if the section is missing, the sentence differs or a subfolder session gets no section.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Compact a Pi session that is bound to a packet and show me the injected message. Check a packet with a problem, a packet without one and a session started in a scratch subfolder. Report a PASS or FAIL verdict with the first lines of each message.`

### Commands

1. Build the runtime, because the Pi adapter reads the compiled purpose helper:

   ```bash
   cd .skilled/skills/system-spec-kit/runtime && npm run build
   ```

   Expected: the build completes with exit 0.

2. Run the adapter suite:

   ```bash
   cd .skilled/skills/system-spec-kit/runtime && npx vitest run tests/compaction-adapters.vitest.ts
   ```

   Expected: every test passes with no failed test. The suite covers the purpose section, the problem line and the walk up from a packet subfolder.

3. Compact a Pi session bound to the packet that states a purpose and a problem.

   Expected: the injected message starts with `## Packet Purpose`, then `Purpose: <sentence>`, then `Problem: <sentence>`. Both sentences match their headings in the packet.

4. Repeat step 3 for the packet with a purpose and no problem.

   Expected: the message starts with `## Packet Purpose` and holds only the `Purpose:` line.

5. Start a Pi session in the `scratch` subfolder of the first packet, bind it to that packet and compact it.

   Expected: the message starts with the same `## Packet Purpose` section and quotes the same sentence as step 3.

### Expected

The injected message leads with the packet purpose. The problem line follows the purpose only when the packet states a problem. A session started in a subfolder gets the same section as a session started at the packet folder.

### Evidence

Capture the build command, the suite command, their full output and their exit status. For each live compaction, capture the first ten lines of the injected message verbatim. Record the session folder and the source sentence for the purpose and the problem.

### Pass / Fail

- **Pass**: the build succeeds, the suite passes and each message matches the documented section and content.
- **Fail**: the build or suite fails, the section is missing, the sentence differs or a subfolder session gets no section.

### Failure Triage

1. Re-run the build and the suite on their own and record the exit status. The first failure names the failing layer.
2. Confirm the Pi adapter reads the compiled helper from the runtime `dist` folder. Rebuild after a source change.
3. Confirm the session names the packet as its active folder and that the subfolder case sits below that packet.
4. Confirm the packet holds the text the case expects under `### Purpose` and `### Problem Statement`.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [packet-purpose-carry.md](../../feature-catalog/context-preservation/packet-purpose-carry.md)
- Purpose reader: `runtime/lib/spec/packet-purpose.ts`
- Pi compaction adapter: `runtime/hooks/pi/session-compact-context.ts`
- Adapter suite: `runtime/tests/compaction-adapters.vitest.ts`

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: packet-purpose-pi-compaction
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/packet-purpose-pi-compaction.md`
