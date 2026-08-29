---
title: "213 -- Mutation response UX payload exposure"
description: "This scenario validates Mutation response UX payload exposure for `213`. It focuses on Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata."
version: 3.6.0.13
id: ux-hooks-mutation-response-ux-payload-exposure
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 213 -- Mutation response UX payload exposure

## 1. OVERVIEW

This scenario validates Mutation response UX payload exposure for `213`. It focuses on Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata.
- Real user request: `` Please validate Mutation response UX payload exposure against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts and tell me whether the expected signals are present: Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance. ``
- Prompt: `Validate mutation response UX payload exposure and no-op suppression against the save-path regression suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the save-path suite passes and the assertions prove success responses expose the UX payload contract while no-op responses suppress false hook metadata

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm successful save responses expose typed postMutationHooks payloads while no-op saves suppress false UX metadata against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts. Verify save-path regression suite passes, successful save responses include typed postMutationHooks fields, and duplicate/no-op saves omit false postMutationHooks while surfacing cache-left-unchanged guidance. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts`
2. inspect assertions covering successful `memory_save` and `atomicSaveMemory` responses with typed `postMutationHooks` fields
3. inspect assertions covering duplicate-content and unchanged/no-op suppression of false UX payloads

### Expected

Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **FAIL**: The save-path suite passed, but the inspected assertions do not prove typed `postMutationHooks` exposure or duplicate/no-op suppression with cache-left-unchanged guidance.

### Failure Triage

Inspect `handlers/save/response-builder.ts`, `hooks/mutation-feedback.ts`, and response-envelope formatting if payload fields drift

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/mutation-response-ux-payload-exposure.md](../../feature-catalog/ux-hooks/mutation-response-ux-payload-exposure.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 213
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/mutation-response-ux-payload-exposure.md`
- audited_post_018: true
- Feature catalog back-ref: `ux-hooks/mutation-response-ux-payload-exposure.md`
