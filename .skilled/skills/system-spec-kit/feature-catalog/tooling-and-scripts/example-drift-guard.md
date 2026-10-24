---
title: "Example drift guard"
description: "Compares every hand-written example with its template and fails when an anchor or a description drifts."
trigger_phrases:
  - "example drift guard"
  - "check-example-drift"
  - "example anchor drift"
  - "example description check"
version: 1.0.0.0
---

# Example drift guard

## 1. OVERVIEW

The example drift guard is a read-only script that compares the hand-written example packets with the templates they came from. A model copies an example, so a drifted example teaches the model a structure the validator no longer expects.

The guard reports one line per problem and exits 1 on any drift. It exits 0 and prints `EXAMPLE_DRIFT_OK` when every example agrees with its template.

---

## 2. HOW IT WORKS

### Anchor Comparison

The guard calls `runtime/cli/utils/template-structure.js compare <level> <doc> <example> anchors`. It fails on every `missing_anchor` line and every `extra_anchor` line. The compare step reads the level contract, so the guard inherits the required and optional anchor lists instead of hard-coding a copy.

### Description Check

The guard reads the first `description:` line of each example. It fails when the line holds the end of an HTML comment, starts lowercase, or lacks a closing period. Those three defects were the leaked line phase 2 repaired, and the check keeps them from coming back.

### Invocation

The script takes one optional directory. With no argument it reads `templates/examples`. With an argument it reads that directory, which lets a test run it against a scratch copy. A vitest wrapper runs it in the suite.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/check-example-drift.sh` | Script | Compares every example with its template and checks the description |
| `.skilled/skills/system-spec-kit/runtime/cli/utils/template-structure.js` | Shared | Compares anchors for one level and document |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/example-drift.vitest.ts` | Vitest | Runs the guard in the suite |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/example-drift-guard-catches-leak.md` | Manual playbook | Scenario 479, the clean run and the injected leak |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/example-drift-guard.md`

Related references:
- [template-section-fill-guidance.md](template-section-fill-guidance.md) - the guidance that decides the section shape an example must keep
- [template-compliance-contract-enforcement.md](template-compliance-contract-enforcement.md) - the anchor contract the compare step reads
