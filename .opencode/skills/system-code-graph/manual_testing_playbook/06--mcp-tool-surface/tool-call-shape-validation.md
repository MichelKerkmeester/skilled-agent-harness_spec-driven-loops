---
title: "011 tool call shape validation"
description: "Verify dispatcher/schema validation catches malformed code_graph tool calls."
trigger_phrases:
  - "011"
  - "tool call shape validation"
  - "system-code-graph manual testing"
importance_tier: "normal"
---
# 011 tool call shape validation

## 1. OVERVIEW

Verify dispatcher/schema validation catches malformed code_graph tool calls.

---

## 2. SCENARIO CONTRACT

- Objective: Verify dispatcher/schema validation catches malformed code_graph tool calls.
- Real user request: `Send malformed code_graph MCP calls and confirm schema validation reports the missing fields.`
- Operator prompt: `Send malformed code_graph and detect_changes calls. Show field-specific validation errors and one valid routing case, then return PASS/FAIL with payload excerpts.`
- Expected execution process: Call `code_graph_query` with missing `subject`, call `detect_changes` with missing `diff` and call `code_graph_apply` with missing `operation`. (Note: `code_graph_verify` has no required `rating` field in the current schema — verified in packet 029 finding F-011-1 — so it is not a valid missing-field target.)
- Expected signals: Each malformed call returns `status:"error"` or a schema validation error naming missing fields. Valid shape reaches the handler.
- Desired user-visible outcome: A concise verdict explaining whether malformed MCP calls are rejected with useful validation errors.
- Pass/fail: PASS if malformed calls are rejected with field-specific errors and valid shapes route normally. FAIL if malformed calls reach handlers silently, errors lack field detail or valid calls are blocked by schema drift.

---

## 3. TEST EXECUTION

### Commands

1. Call `code_graph_query({"operation":"outline"})` with missing subject.
2. Call `detect_changes({})` with missing diff.
3. Call `code_graph_apply({})` with missing `operation`.

### Expected Output / Verification

Each malformed call returns `status:"error"` or schema validation error naming missing fields. Valid shape reaches the handler.

### Cleanup

None.

### Variant Scenarios

Check `tool-input-schemas.ts` allowlisted keys for extra-property rejection.

---

## 4. SOURCE FILES

| File | Role |
| --- | --- |
| `../manual_testing_playbook.md` | Root playbook index |
| `../../feature_catalog/feature_catalog.md` | Runtime feature catalog |

---

## 5. SOURCE METADATA

- Group: Code Graph Runtime
- Playbook ID: 011
- Canonical root source: `manual_testing_playbook.md`
