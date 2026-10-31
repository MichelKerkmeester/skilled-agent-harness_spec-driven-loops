---
title: "Versioned placeholder gate"
description: "Gates unfilled value tokens by the template stamp, warning while a v2.3 packet is Draft and failing it at any other status."
trigger_phrases:
  - "versioned placeholder gate"
  - "placeholder token warning"
  - "Draft placeholder rule"
  - "v2.3 template stamp"
version: 1.0.0.0
---

# Versioned placeholder gate

## 1. OVERVIEW

The versioned placeholder gate decides the severity of an unfilled authoring token from the template stamp a document carries. A document stamped v2.3 or later warns while the packet status is Draft and fails at any other status. A document with an older stamp, or with no stamp, keeps the error it always had.

The gate exists so a planning commit can land with tokens still in place, while a finished packet cannot. It also keeps every existing packet on its old verdict, because a new rule that failed them would break an external repository on update.

---

## 2. HOW IT WORKS

### Stamp Detection

The rule reads the first 70 lines of each document for a `SPECKIT_TEMPLATE_SOURCE` line. A version of v2.3 or later opens the gate. A version of v2.2 or earlier, or no line at all, leaves the document on the old rule.

### Draft Lifecycle

When the gate is open, the rule reads the first Status row of the packet's `spec.md`. The exact word Draft, ignoring case, bold marks, backticks, quotes and trailing punctuation, makes an unfilled token a warning. Every other value, and a missing Status row, makes it an error. An open question marker is an error in both cases.

A warning does not fail `--strict`. The run passes when no other rule reports an error.

### Scope

The orchestrator reads every authored document that is present. The shell mirror reads `spec.md`, `plan.md`, `tasks.md` and `decision-record.md`, and it adds `acceptance-criteria.md`, `implementation-summary.md` and `goal.md` only when they carry the stamp. Both implementations answer with the same verdict, and one test file compares them.

### Edge Cases

A fenced code block is skipped, so a token shown in an example does not fail a document. A token inside an inline code span is skipped for the same reason. A status such as `Draft (phase 3)` is not the word Draft, so it counts as any other value.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts` | Handler | Reads the stamp and the status and returns the rule entry |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` | Script | Shell mirror used by the isolated rule harness |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/placeholder-token-gate.vitest.ts` | Vitest | Drives both implementations across the stamp and status matrix |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-warning-while-draft.md` | Manual playbook | Scenario 476, the Draft warning |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-token-error-after-draft.md` | Manual playbook | Scenario 477, the error after Draft |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/template-authoring/placeholder-gate-legacy-stamp-unchanged.md` | Manual playbook | Scenario 478, the older stamp |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/versioned-placeholder-gate.md`

Related references:
- [spec-validation-rule-engine.md](spec-validation-rule-engine.md) - the orchestrator that runs the rule
- [template-section-fill-guidance.md](template-section-fill-guidance.md) - the instruction that tells a writer what to put in a token
