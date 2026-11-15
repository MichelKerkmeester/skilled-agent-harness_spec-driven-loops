---
title: "Packet purpose carry"
description: "Carries one sentence of why a packet exists across every hop: the resume brief, the relaunch note, the context recovered after a compaction and the continuity save."
trigger_phrases:
  - "packet purpose carry"
  - "packet purpose across handovers"
  - "compaction packet purpose"
  - "purpose line on resume"
version: 1.0.4.0
---

# Packet purpose carry

This catalog entry maps the purpose line every hop repeats to the reader that supplies it, the surfaces that print it and the tests that hold it in place.

## 1. OVERVIEW

Every hop carries one sentence of why the packet exists. The hops are the resume brief, the relaunch note, the context recovered after a compaction and the continuity save. The sentence stays short, one sentence, so a tight budget cannot drop the reason the work exists.

The sentence comes from the packet itself when the packet states one. A packet with none borrows the nearest phase parent's purpose, then the Objective from its `goal.md`. A hop that finds no text leaves the line out and recovers as before.

---

## 2. HOW IT WORKS

### Where The Sentence Comes From

One reader supplies the sentence for every hop. It looks for a `### Purpose` heading first. Without that heading it reads a paragraph labelled `Purpose:` inside a `## PROBLEM & PURPOSE`, `## PURPOSE` or `## ROOT PURPOSE` section. Failing that it reads the opening paragraph of a `## PURPOSE` or `## ROOT PURPOSE` section. The opening paragraph of a combined problem and purpose section states the problem, so it never counts as the purpose.

When the packet states no purpose, the reader takes the nearest phase parent's purpose. When no parent states one, it takes the Objective from the packet's `goal.md`. Two layout sentences never count. One describes the child phases below. The other asks for lean parent documentation. The bare token `UNKNOWN` and a template placeholder never count either.

### Line Shapes

The reader prints one of three labels. `Purpose:` names the packet's own sentence. `Parent purpose (<repo-relative parent folder>):` names a sentence inherited from a phase parent and the folder it came from. `Goal objective:` names the Objective from `goal.md`. A compaction adds a `Problem:` line under the purpose when the packet states one.

### Hops

The resume brief puts the sentence in its second row. The relaunch note opens its `## Goal` with the sentence. Both follow the rule in their command text.

The compaction hooks on Claude, Codex, Pi and DSH print the section through the reader. The section leads the output, so the reason the work exists survives the budget cut.

Each save stores the sentence as `packet_purpose` in the continuity block. Devin and OpenCode print none.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `runtime/lib/spec/packet-purpose.ts` | Shared | Reads the purpose and problem, walks to the nearest phase parent and falls back to the goal Objective. |
| `runtime/hooks/claude/session-prime.ts` | Handler | Leads a Claude or Codex compaction recovery with the `## Packet Purpose` section. |
| `runtime/hooks/pi/session-compact-context.ts` | Handler | Adds the same section to the Pi compaction message, including from a subfolder. |
| `runtime/cli/core/workflow.ts` | Handler | Writes `packet_purpose` into the continuity block on save. |
| `.skilled/hooks/session-handover/lib/nudge.cjs` | Shared | Tells the relaunch note to open `## Goal` with the purpose line. |
| `.skilled/commands/speckit/handoff.md` | Script | Defines the note rules, including the purpose line and the parent and goal fallbacks. |
| `.skilled/commands/speckit/assets/speckit-resume.yaml` | Script | Carries the purpose row for the resume brief in both modes. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `runtime/tests/packet-purpose.vitest.ts` | Vitest | Resolution from the packet, the nearest parent and the goal Objective, the three line shapes and the excluded text. |
| `runtime/tests/hook-session-start.vitest.ts` | Vitest | The Claude compact recovery leads with the section and omits it when no packet purpose exists. |
| `runtime/tests/compaction-adapters.vitest.ts` | Vitest | The Pi adapter carries the section, walks up from a subfolder and keeps the recovery when the purpose is absent. |
| `.skilled/hooks/session-handover/tests/nudge.test.cjs` | Node test | The relaunch note opens its Goal with the purpose line and keeps the parent and goal fallbacks. |
| `runtime/cli/tests/test-phase-command-workflows.js` | Node test | The resume and handoff workflow assets keep the shared purpose row and line shapes. |

---

## 4. SOURCE METADATA

- Group: Context Preservation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `context-preservation/packet-purpose-carry.md`

Related references:
- [Session handover loop](session-handover-loop.md) - the handoff note that opens with the purpose line.
- [Compaction history lookup](compaction-history-lookup.md) - the lookup a claimed handoff offers for the sender's earlier turns.
- [Packet purpose on resume](../../manual-testing-playbook/plugins-and-hooks/packet-purpose-resume.md) - the operator scenario for the resume brief.
- [Packet purpose on relaunch](../../manual-testing-playbook/plugins-and-hooks/packet-purpose-relaunch.md) - the operator scenario for the relaunch note.
- [Packet purpose after a Claude compaction](../../manual-testing-playbook/plugins-and-hooks/packet-purpose-claude-compaction.md) - the operator scenario for the Claude recovery.
- [Packet purpose after a Pi compaction](../../manual-testing-playbook/plugins-and-hooks/packet-purpose-pi-compaction.md) - the operator scenario for the Pi recovery.
- [Packet purpose on save](../../manual-testing-playbook/plugins-and-hooks/packet-purpose-save.md) - the operator scenario for the continuity save.
