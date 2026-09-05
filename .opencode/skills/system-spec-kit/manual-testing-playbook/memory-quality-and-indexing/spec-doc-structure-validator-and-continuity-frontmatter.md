---
title: "201 -- Spec-doc structure validator and continuity frontmatter"
description: "This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block."
audited_post_018: true
version: 3.6.0.13
id: memory-quality-and-indexing-spec-doc-structure-validator-and-continuity-frontmatter
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 201 -- Spec-doc structure validator and continuity frontmatter

## 1. OVERVIEW

This scenario validates the phase 018 spec-doc structure validator for `201`. It focuses on the five fail-closed rules and the thin `_memory.continuity` block.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the five-rule validator bridge and continuity block enforcement.
- Real user request: `` Please validate Spec-doc structure validator and continuity frontmatter against _memory.continuity and tell me whether the expected signals are present: five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly. ``
- Prompt: `Validate spec-doc structure validator and continuity frontmatter enforcement.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the five rules run in order and malformed continuity/frontmatter state fails closed; FAIL if a rule is skipped or invalid continuity state is accepted

---

## 3. TEST EXECUTION

### Prompt

```
Validate spec-doc structure validator and continuity frontmatter enforcement.
```

### Commands

1. Create or pick a spec doc with a deliberately malformed `_memory.continuity` block
2. Run `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh --strict <target-spec>`
3. Confirm the five rules appear in the expected order
4. Repair the continuity block and rerun
5. Confirm the document passes cleanly

### Expected

Five named rules execute in order; malformed `_memory.continuity` fails closed; valid docs pass cleanly

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: The five rules run in order and malformed continuity/frontmatter state fails closed.
- **Fail**: A rule is skipped or invalid continuity state is accepted.

### Failure Triage

Inspect `runtime/lib/validation/spec-doc-structure.ts` rule dispatch, validate.sh aliases, and the continuity block renderer

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/spec-doc-structure-validator.md](../../feature-catalog/memory-quality-and-indexing/spec-doc-structure-validator.md)
- Source files: `runtime/lib/validation/spec-doc-structure.ts`, `runtime/cli/spec/validate.sh`

---

## 5. SOURCE METADATA

- Group: Memory quality and indexing
- Playbook ID: 201
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/spec-doc-structure-validator-and-continuity-frontmatter.md`
