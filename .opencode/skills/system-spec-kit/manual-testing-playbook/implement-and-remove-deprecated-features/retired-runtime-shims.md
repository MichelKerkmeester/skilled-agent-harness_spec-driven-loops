---
title: "228 -- Retired runtime shims and inert compatibility flags"
description: "This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior."
audited_post_018: true
phase_018_change: "Validated against phase-018 canonical continuity refactor; keeps the compatibility-only checks for lazy warmup, shadow scoring, novelty, and adaptive fusion."
version: 3.6.0.13
id: implement-and-remove-deprecated-features-retired-runtime-shims
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 228 -- Retired runtime shims and inert compatibility flags

## 1. OVERVIEW

This scenario validates Retired runtime shims and inert compatibility flags for `228`. It focuses on Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior.
- Real user request: `Please validate Retired runtime shims and inert compatibility flags against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts and tell me whether the expected signals are present: Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through SPECKIT_ADAPTIVE_FUSION without consulting retired RSF compatibility flags.`
- Prompt: `Validate retired runtime shims and inert compatibility flags against the targeted runtime and scoring checks.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through SPECKIT_ADAPTIVE_FUSION without consulting retired RSF compatibility flags
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms the deprecated flag surface is compatibility-only and no longer steers production behavior

---

## 3. TEST EXECUTION

### Prompt

```
As a canonical-continuity validation operator, confirm deprecated runtime flags remain visible for compatibility while no longer steering live behavior against cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts. Verify targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through SPECKIT_ADAPTIVE_FUSION without consulting retired RSF compatibility flags. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/context-server.vitest.ts tests/learned-feedback.vitest.ts tests/memory-save-ux-regressions.vitest.ts`
2. inspect source-backed assertions or snapshots showing eager warmup stays disabled and deprecated warmup flags only surface as compatibility warnings
3. inspect source-backed assertions or snapshots showing shadow scoring runtime helpers return inert values and retired novelty boost symbols are absent from current source
4. inspect source-backed assertions or snapshots showing hybrid search selects adaptive versus fixed fusion through `SPECKIT_ADAPTIVE_FUSION` without consulting retired RSF compatibility flags

### Expected

Targeted runtime and scoring suites pass; eager warmup remains hard-disabled despite compatibility flags; shadow scoring runtime entry points stay inert; retired novelty boost symbols are absent from current source; and hybrid search selects adaptive versus fixed fusion through `SPECKIT_ADAPTIVE_FUSION` without consulting retired RSF compatibility flags

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: The targeted suites passed, warmup and shadow-scoring compatibility helpers are inert, retired novelty symbols are absent from current source, and adaptive fusion is selected through `SPECKIT_ADAPTIVE_FUSION` without retired RSF compatibility gating.

### Failure Triage

Inspect `shared/embeddings.ts`, `mcp-server/context-server.ts`, `mcp-server/lib/eval/shadow-scoring.ts`, `mcp-server/lib/scoring/composite-scoring.ts`, and `mcp-server/lib/search/hybrid-search.ts` if any deprecated flag appears to change live execution

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [implement-and-remove-deprecated-features/category-stub.md](../../feature-catalog/implement-and-remove-deprecated-features/category-stub.md)

---

## 5. SOURCE METADATA

- Group: Implement and Remove Deprecated Features
- Playbook ID: 228
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `implement-and-remove-deprecated-features/retired-runtime-shims.md`
