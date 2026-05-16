---
title: "238 -- Spec Validation Rule Engine"
description: "This scenario validates spec validation rule engine for `238`. It focuses on confirming compliant validation, warning escalation, and recursive phase validation behavior."
---

# 238 -- Spec Validation Rule Engine

## 1. OVERVIEW

This scenario validates spec validation rule engine for `238`. It focuses on confirming compliant validation, warning escalation, and recursive phase validation behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm clean validation, warning behavior, strict escalation, recursive phase validation, and the Phase 017 strict add-ons.
- Real user request: `Please validate Spec Validation Rule Engine against the documented validation surface and tell me whether the expected signals are present: compliant fixture exits cleanly with JSON output; warning fixture returns non-zero; strict mode escalates warning-bearing runs; recursive phase validation emits aggregate phase results; the Phase 017 strict add-ons surface the documented failures.`
- Prompt: `Validate Spec Validation Rule Engine against the documented validation surface and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: compliant fixture exits cleanly with JSON output; warning fixture returns non-zero; strict mode escalates warning-bearing runs; recursive phase validation emits aggregate phase results; the Phase 017 strict add-ons surface the documented failures
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the orchestrator preserves the documented severity and recursion behavior across the baseline runs and enforces the Phase 017 strict add-ons

---

## 3. TEST EXECUTION

### Prompt

```
Validate Spec Validation Rule Engine against the documented validation surface and report cited pass/fail evidence.
```

### Commands

1. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/063-template-compliant-level3 --json`
2. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/054-template-extra-header || true`
3. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/system-spec-kit/scripts/test-fixtures/054-template-extra-header --strict || true`
4. `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/skills/system-spec-kit/scripts/tests/fixtures/phase-validation/valid-phase --recursive --json`
5. `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/continuity-freshness.vitest.ts --config mcp_server/vitest.config.ts`
6. `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/evidence-marker-lint.vitest.ts --config mcp_server/vitest.config.ts`
7. `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run scripts/tests/normalizer-lint.vitest.ts --config mcp_server/vitest.config.ts`

### Expected

Compliant fixture exits 0 with structured output; extra-header fixture surfaces warnings or non-pass status; strict mode does not silently downgrade issues; recursive JSON includes child phase results; the Phase 017 strict add-ons surface their documented warning and failure conditions

### Evidence

Validation transcript for the warning-bearing fixture plus JSON output for the compliant and recursive runs, continuity-freshness output, evidence-marker lint failure, and normalizer-lint output

### Pass / Fail

- **Pass**: the compliant and phased fixtures pass, the warning fixture is surfaced, strict mode remains more restrictive than the default run, and the Phase 017 strict add-ons enforce their documented failure surfaces
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `scripts/spec/validate.sh`, `.speckit.yaml` rule ordering, `scripts/validation/*.ts`, and `scripts/rules/check-*.sh` severity mapping if warnings, strict escalation, or recursive phase reporting are inconsistent

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/24-spec-validation-rule-engine.md](../../feature_catalog/16--tooling-and-scripts/24-spec-validation-rule-engine.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 238
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/238-spec-validation-rule-engine.md`
