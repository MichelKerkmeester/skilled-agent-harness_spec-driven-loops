---
title: "Measured behavior block"
description: "Warns when a spec.md stamped v2.4 or later leaves its measured-behavior block without command output or a reasoned N/A, and never fails a strict run."
trigger_phrases:
  - "measured behavior block"
  - "MEASURED_BEHAVIOR"
  - "measured-behavior anchor"
  - "verbatim command output in spec"
version: 1.0.0.0
---

# Measured behavior block

## 1. OVERVIEW

The measured behavior block is the part of `spec.md` where an author pastes the command that shows the current behavior and its verbatim output. The `MEASURED_BEHAVIOR` rule warns when that block is missing or holds nothing a reader could check.

The block exists so a number the spec states about current behavior is quoted from a run instead of recalled. The rule is a warning, so a planning commit can land with the block still open, and strict validation still reports `passed: true`.

---

## 2. HOW IT WORKS

### Applicability

The rule reads the first `SPECKIT_TEMPLATE_SOURCE` line in the first 70 lines of `spec.md`. It applies only when that line names `spec-core` at v2.4 or later, and it compares major and minor as numbers, so v2.10 and v3.0 apply. An older stamp, another template source or no stamp at all passes as not applicable, because those documents were written before the block existed. A packet with no `spec.md` is not applicable either.

### The Block State

The rule looks inside the `measured-behavior` anchor and sorts the block into one of three states.

| State | What the block holds | Verdict |
|-------|----------------------|---------|
| Filled | A fenced line that is not blank and not an unfilled value token, or an `N/A:` line with a reason after the colon | Pass |
| Empty | An anchor whose fence is empty, holds only an unfilled value token, or carries a bare `N/A:` | Warn |
| Absent | No `measured-behavior` anchor in `spec.md` | Warn |

A fence opens with backticks or tildes at any indent and closes on the same character. An `N/A:` line counts only outside a fence.

### Severity

The rule never reports a failure. An absent or empty block is a `warn` entry whose remediation says to run the command and paste the command with its output into the fence, or to write an `N/A:` line that gives the reason. The strict JSON run keeps `passed: true` unless another rule reports an error.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-measured-behavior.sh` | Script | Reads the stamp and the anchor and returns the rule entry |
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Registry | Declares the rule at warn severity |
| `.skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` | Template | Carries the anchor, the heading and the fill line |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/measured-behavior-rule.vitest.ts` | Vitest | Drives the absent, empty, filled and not-applicable states |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/measured-behavior-warns-unfilled.md` | Manual playbook | Scenario 485, the warning on a fresh scaffold |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/measured-behavior-block.md`

Related references:
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the engine that runs the rule
- [versioned-placeholder-gate.md](versioned-placeholder-gate.md) - the sibling rule that reads the same template stamp
