---
title: "214 -- Atomic-save parity and partial-indexing hints"
description: "This scenario validates Atomic-save parity and partial-indexing hints for `214`. It focuses on Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots."
version: 3.6.0.13
id: ux-hooks-atomic-save-parity-and-partial-indexing-hints
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 214 -- Atomic-save parity and partial-indexing hints

## 1. OVERVIEW

This scenario validates Atomic-save parity and partial-indexing hints for `214`. It focuses on Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots.
- Real user request: `Please validate Atomic-save parity and partial-indexing hints against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts and tell me whether the expected signals are present: Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation.`
- Prompt: `Validate atomic-save parity, partial-indexing hints, no-op suppression, and callback snapshot isolation.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the assertions confirm atomic-save parity, partial-indexing guidance, no-op suppression, and callback snapshot protection

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts. Verify save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts`
2. inspect assertions covering successful atomic-save `postMutationHooks` contract parity
3. inspect assertions covering partial-indexing hints and duplicate or unchanged hook suppression
4. inspect assertions covering `structuredClone` snapshot isolation for after-tool callbacks

### Expected

Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **FAIL**: targeted suites pass, and callback snapshot protection assertions are present, but the observed targeted save-path assertions do not confirm successful atomic-save `postMutationHooks` contract parity, partial-indexing guidance, or duplicate/unchanged hook suppression.

### Failure Triage

Inspect `handlers/memory-save.ts`, `handlers/save/response-builder.ts`, `handlers/save/post-insert.ts`, and `context-server.ts` if parity or snapshot behavior regresses

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/atomic-save-parity-and-partial-indexing-hints.md](../../feature-catalog/ux-hooks/atomic-save-parity-and-partial-indexing-hints.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 214
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/atomic-save-parity-and-partial-indexing-hints.md`
- audited_post_018: true
- Feature catalog back-ref: `ux-hooks/atomic-save-parity-and-partial-indexing-hints.md`
