---
title: "Packet purpose on resume"
description: "This scenario validates packet purpose carry for `plugins-and-hooks-packet-purpose-resume`. It focuses on the purpose row in the resume brief."
trigger_phrases:
  - "packet purpose on resume"
  - "resume purpose row"
  - "parent purpose row"
id: plugins-and-hooks-packet-purpose-resume
version: 1.0.2.0
---

# Packet purpose on resume

---

## 1. OVERVIEW

The resume brief repeats why the packet exists before it reports progress. Its second row names the purpose the packet states, the purpose it inherits from its phase parent or the Objective in its `goal.md`. A packet with no purpose text gets no row, never a placeholder.

This scenario validates:

- a packet with `### Purpose` yields `Purpose:` in the second row
- a phase child with a placeholder yields `Parent purpose (<repo-relative parent folder>):`
- a packet with no purpose text and no parent purpose yields no row

---

## 2. SCENARIO CONTRACT

- Objective: confirm the resume brief carries one purpose sentence and names its source.
- Preconditions: repository checked out at project root and `/speckit:resume` available on the runtime under test. Three packets are ready. The first has its own `### Purpose`. The second is a phase child whose own purpose is a placeholder and whose phase parent states a purpose. The third has no purpose text and no parent purpose.
- Real user request: `Resume the last session and show the packet purpose row. Check a packet with its own purpose, a phase child with a placeholder and a packet with no purpose. Report a PASS or FAIL verdict with the exact row for each case.`
- Prompt: `Resume the last session and show the packet purpose row. Check a packet with its own purpose, a phase child with a placeholder and a packet with no purpose. Report a PASS or FAIL verdict with the exact row for each case.`
- Expected execution process: run the resume command once per prepared packet, read the second row of each brief and compare it with the source text in the packet.
- Expected signals: the first packet shows `Purpose: <sentence>`. The second shows `Parent purpose (<repo-relative parent folder>): <sentence>`. The third shows no purpose row. No brief prints `UNKNOWN` or a bracketed placeholder.
- Desired user-visible outcome: the operator can tell why the work exists and which document supplied the sentence.
- Pass/fail: PASS if the three cases show the documented row shapes, FAIL if a row is missing, a label is wrong or a placeholder is printed.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Resume the last session and show the packet purpose row. Check a packet with its own purpose, a phase child with a placeholder and a packet with no purpose. Report a PASS or FAIL verdict with the exact row for each case.`

### Commands

1. Confirm the resume workflow carries the purpose rule:

   ```bash
   rg -n 'purpose_row:' .skilled/commands/speckit/assets/speckit-resume.yaml
   ```

   Expected: the asset carries one `purpose_row` rule. It names `Purpose:`, `Parent purpose (<repo-relative parent folder>):` and `Goal objective:`.

2. Read the purpose source for the packet that states its own purpose:

   ```bash
   rg -n -A2 '^### Purpose$' <packet-with-purpose>/spec.md
   ```

   Expected: the heading exists. The paragraph under it holds the sentence the brief must quote.

3. Run `/speckit:resume <packet-with-purpose>` and read the brief.

   Expected: the second row is `Purpose: <sentence>`. The sentence matches the first sentence under `### Purpose`.

4. Read the purpose source for the phase child with the placeholder:

   ```bash
   rg -n -A2 '^### Purpose$' <child-with-placeholder>/spec.md
   ```

   Expected: the paragraph is a placeholder. The phase parent beside the child states a real purpose in its own `spec.md`.

5. Run `/speckit:resume <child-with-placeholder>` and read the brief.

   Expected: the second row is `Parent purpose (<repo-relative parent folder>): <sentence>`. The folder names the phase parent from the repository root.

6. Run `/speckit:resume <packet-without-purpose>` and read the brief.

   Expected: no purpose row appears. The rest of the brief reports the packet and the next step as before.

### Expected

The brief carries one purpose sentence in the second row when any source states one. The label names the source. A packet with no purpose text and no parent purpose gets no row.

### Evidence

Capture the exact command, the full brief and the exit status for each of the three cases. Quote the second row verbatim. Name the source document and the sentence that the row copies. Record the folder shown by a `Parent purpose` row.

### Pass / Fail

- **Pass**: the three cases show the documented row shapes and the quoted sentence matches its source.
- **Fail**: a row is missing, a label is wrong, a placeholder is printed or the quoted sentence differs from its source.

### Failure Triage

1. Re-run the failing resume on its own and record the exit status. The first case that differs names the failing source rule.
2. Confirm the packet really holds the text the case expects. Read the paragraph under `### Purpose`.
3. Confirm the phase child sits under a phase parent with a `spec.md` and an authored purpose.
4. Confirm the workflow asset still carries `purpose_row`, because a missing key drops the row on every runtime.

---

## 4. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [packet-purpose-carry.md](../../feature-catalog/context-preservation/packet-purpose-carry.md)
- Purpose reader: `runtime/lib/spec/packet-purpose.ts`
- Resume workflow: `.skilled/commands/speckit/assets/speckit-resume.yaml`
- Workflow contract test: `runtime/cli/tests/test-phase-command-workflows.js`

Provenance: .skilled/skills/system-spec-kit/runtime/tests/packet-purpose.vitest.ts

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: packet-purpose-resume
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `plugins-and-hooks/packet-purpose-resume.md`
