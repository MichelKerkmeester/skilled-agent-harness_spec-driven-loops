---
title: "Packet purpose on save"
description: "This scenario validates packet purpose carry for `plugins-and-hooks-packet-purpose-save`. It focuses on the purpose field that a continuity save writes."
trigger_phrases:
  - "packet purpose on save"
  - "packet_purpose continuity field"
  - "save purpose field"
id: plugins-and-hooks-packet-purpose-save
version: 1.0.1.0
---

# Packet purpose on save

---

## 1. OVERVIEW

A continuity save stores why the packet exists beside its summary. The continuity block carries `packet_purpose: <sentence>` when the packet states a purpose or inherits one. A packet with no purpose text and no `goal.md` Objective gets no field. The field lets a later session read the reason without reopening the packet.

This scenario validates:

- a save writes `packet_purpose:` into the continuity block
- the field holds the same sentence the purpose reader resolves
- a packet with no purpose gets no field

---

## 2. SCENARIO CONTRACT

- Objective: confirm a continuity save stores the packet purpose and leaves the field out when no purpose exists.
- Preconditions: repository checked out at project root, the runtime built and `/speckit:save` available on the runtime under test. Two packets are ready: one with a purpose and one with no purpose text and no `goal.md` Objective.
- Real user request: `Save the bound packet and show me its continuity block. Check a packet with a purpose and a packet with no purpose. Report a PASS or FAIL verdict with the packet_purpose line from each save.`
- Prompt: `Save the bound packet and show me its continuity block. Check a packet with a purpose and a packet with no purpose. Report a PASS or FAIL verdict with the packet_purpose line from each save.`
- Expected execution process: run a full-auto save for each prepared packet, read the continuity block in `implementation-summary.md` and compare the field with the sentence the purpose reader resolves.
- Expected signals: the first save writes one `packet_purpose:` line whose value matches the purpose sentence. The second save writes no field. No save writes `UNKNOWN` or a bracketed placeholder.
- Desired user-visible outcome: the operator can read why the packet exists from the continuity block alone.
- Pass/fail: PASS if the first save writes the correct field and the second writes none, FAIL if the field is missing, the value differs or a placeholder is stored.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Save the bound packet and show me its continuity block. Check a packet with a purpose and a packet with no purpose. Report a PASS or FAIL verdict with the packet_purpose line from each save.`

### Commands

1. Run a full-auto save for the packet with a purpose:

   ```bash
   /speckit:save --full-auto <packet-with-purpose>
   ```

   Expected: the save completes and writes its continuity block in the packet's `implementation-summary.md`.

2. Read the purpose field:

   ```bash
   rg -n 'packet_purpose:' <packet-with-purpose>/implementation-summary.md
   ```

   Expected: one line, `packet_purpose: <sentence>`. The sentence matches the first sentence under `### Purpose`, the labelled paragraph in a purpose section, the phase parent's purpose or the `goal.md` Objective.

3. Read the surrounding continuity block:

   ```bash
   rg -n -B2 -A2 'packet_purpose:' <packet-with-purpose>/implementation-summary.md
   ```

   Expected: the field sits inside the continuity block beside the summary fields. Its value is one sentence.

4. Run a full-auto save for the packet with no purpose text and no `goal.md` Objective:

   ```bash
   /speckit:save --full-auto <packet-without-purpose>
   ```

   Expected: the save completes and writes its continuity block.

5. Read the purpose field for the second packet:

   ```bash
   rg -n 'packet_purpose:' <packet-without-purpose>/implementation-summary.md
   ```

   Expected: no line appears. The rest of the continuity block is unchanged.

### Expected

A save writes one `packet_purpose:` line when a purpose exists. The value matches the sentence the reader resolves. A packet with no purpose gets no field. The save still completes.

### Evidence

Capture each save command, its full output and its exit status. Quote the `packet_purpose:` line and the continuity block around it. Record the source sentence and the label that names its source. For the second packet, record the absence of the field.

### Pass / Fail

- **Pass**: the first save writes the correct field and the second writes none.
- **Fail**: the field is missing, the value differs from the resolved purpose or a placeholder is stored.

### Failure Triage

1. Re-run the failing save on its own and record the exit status. Confirm the save reached full-auto mode, because a plan-only save writes no continuity field.
2. Confirm the packet holds the purpose text the case expects. Read the paragraph under `### Purpose` or the `goal.md` Objective.
3. Confirm the runtime build is current, because the save calls the compiled continuity writer.
4. Confirm the continuity block is the one the save reports. Read the field from that block.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [packet-purpose-carry.md](../../feature-catalog/context-preservation/packet-purpose-carry.md)
- Purpose reader: `runtime/lib/spec/packet-purpose.ts`
- Continuity save workflow: `runtime/cli/core/workflow.ts`
- Workflow contract test: `runtime/cli/tests/test-phase-command-workflows.js`

Provenance: .skilled/skills/system-spec-kit/runtime/cli/tests/save-continuity-write.vitest.ts

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: packet-purpose-save
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/packet-purpose-save.md`
