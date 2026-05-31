---
title: "211 -- Schema and type contract synchronization"
description: "This scenario validates Schema and type contract synchronization for `211`. It focuses on Confirm `checkpoint_delete.confirmName` and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries."
---

# 211 -- Schema and type contract synchronization

## 1. OVERVIEW

This scenario validates Schema and type contract synchronization for `211`. It focuses on Confirm `checkpoint_delete.confirmName` and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm `checkpoint_delete.confirmName` and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries.
- Real user request: `` Please validate Schema and type contract synchronization against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/memory-save-ux-regressions.vitest.ts and tell me whether the expected signals are present: Checkpoint-delete tests reject missing or mismatched `confirmName`, tool-schema validation accepts matching payloads, and mutation-hook/save-path suites confirm the shared result contract remains synchronized. ``
- Prompt: `Validate schema and type contract synchronization for checkpoint confirmName and mutation-hook result contracts.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Checkpoint-delete tests reject missing or mismatched `confirmName`, tool-schema validation accepts matching payloads, and mutation-hook/save-path suites confirm the shared result contract remains synchronized
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the contract suites pass and the assertions confirm `confirmName` is required everywhere while mutation-hook result fields stay aligned across runtime and response boundaries

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm checkpoint_delete.confirmName and mutation-hook result contracts stay aligned across schema, handler, and tool boundaries against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/memory-save-ux-regressions.vitest.ts. Verify checkpoint-delete tests reject missing or mismatched confirmName, tool-schema validation accepts matching payloads, and mutation-hook/save-path suites confirm the shared result contract remains synchronized. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/handler-checkpoints.vitest.ts tests/tool-input-schema.vitest.ts tests/hooks-mutation-wiring.vitest.ts tests/memory-save-ux-regressions.vitest.ts`
2. inspect assertions covering missing, mismatched, and matching `confirmName` payloads
3. inspect assertions covering shared mutation-hook result fields in hook wiring and save responses

### Expected

Checkpoint-delete tests reject missing or mismatched `confirmName`, tool-schema validation accepts matching payloads, and mutation-hook/save-path suites confirm the shared result contract remains synchronized

### Evidence

Test transcript + key assertion output for schema validation and shared result-contract coverage

### Pass / Fail

- **Pass**: the contract suites pass and the assertions confirm `confirmName` is required everywhere while mutation-hook result fields stay aligned across runtime and response boundaries
- **Fail**: Any contradicting evidence appears or the pass condition is not met.

### Failure Triage

Inspect `handlers/checkpoints.ts`, `schemas/tool-input-schemas.ts`, `tool-schemas.ts`, `tools/types.ts`, and hook result type definitions if any contract diverges

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/256-schema-and-type-contract-synchronization.md](../../feature_catalog/18--ux-hooks/256-schema-and-type-contract-synchronization.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 211
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/297-schema-and-type-contract-synchronization.md`
- audited_post_018: true
- Feature catalog back-ref: `18--ux-hooks/256-schema-and-type-contract-synchronization.md`
