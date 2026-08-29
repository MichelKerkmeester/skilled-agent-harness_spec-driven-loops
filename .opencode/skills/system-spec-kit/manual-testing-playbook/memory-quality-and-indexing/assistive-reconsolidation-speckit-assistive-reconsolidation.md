---
title: "165 -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)"
description: "This scenario validates assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) for `165`. It focuses on enabling the flag, saving a near-duplicate, and verifying advisory-note/recommend behavior."
audited_post_018: true
version: 3.6.0.18
id: memory-quality-and-indexing-assistive-reconsolidation-speckit-assistive-reconsolidation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 165 -- Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION)

## 1. OVERVIEW

This scenario validates assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) for `165`. It focuses on enabling the flag, saving a near-duplicate, verifying shadow-archive and recommendation behavior, and confirming companion predecessor-change detection.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the high-similarity compatibility note and borderline recommendation behavior plus companion predecessor validation.
- Real user request: `` Please validate Assistive reconsolidation (SPECKIT_ASSISTIVE_RECONSOLIDATION) against SPECKIT_ASSISTIVE_RECONSOLIDATION=true and tell me whether the expected signals are present: similarity >= 0.96 returns the internal 'auto_merge' classifier and emits a high-similarity compatibility note without archiving the older row; 0.88 <= similarity < 0.96 returns 'review' with AssistiveRecommendation logged; similarity < 0.88 returns 'keep_separate'; review tier produces classification (supersede/complement/keep_separate) without destructive action; companion merge guard aborts stale merge attempts with `predecessor_changed` or `predecessor_gone`. ``
- Prompt: `Validate assistive reconsolidation merge and recommendation behavior.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: similarity >= 0.96 returns the internal 'auto_merge' classifier and emits a high-similarity compatibility note without archiving the older row; 0.88 <= similarity < 0.96 returns 'review' with AssistiveRecommendation logged; similarity < 0.88 returns 'keep_separate'; review tier produces classification (supersede/complement/keep_separate) without destructive action; companion merge guard aborts stale merge attempts with `predecessor_changed` or `predecessor_gone`
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the high-similarity compatibility note triggers at >= 0.96, recommendation logs for review tier, no destructive action occurs for assistive tiers, and predecessor-change detection blocks stale companion merges; FAIL if tier classification is wrong, assistive tiers mutate state, or stale predecessor changes still commit a merge

---

## 3. TEST EXECUTION

### Prompt

```
Validate assistive reconsolidation merge and recommendation behavior.
```

### Commands

1. `SPECKIT_ASSISTIVE_RECONSOLIDATION=true`
2. Save memory A, then save near-duplicate B (sim >= 0.96)
3. Verify the high-similarity compatibility note
4. Save memory C (0.88 <= sim < 0.96 vs A)
5. Verify AssistiveRecommendation logged
6. `npx vitest run tests/assistive-reconsolidation.vitest.ts`

### Expected

High-similarity compatibility note at >= 0.96; review with recommendation at >= 0.88; keep_separate below 0.88; no destructive action for assistive tiers

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file the run reads or writes.

### Pass / Fail

- **Pass**: The high-similarity compatibility note triggers at >= 0.96, recommendation logs for review tier, no destructive action occurs for assistive tiers, and predecessor-change detection blocks stale companion merges.
- **Fail**: Tier classification is wrong, assistive tiers mutate state, or stale predecessor changes still commit a merge.

### Failure Triage

Verify isAssistiveReconsolidationEnabled() → Check ASSISTIVE_COMPATIBILITY_NOTE_THRESHOLD (0.96) → Check ASSISTIVE_REVIEW_THRESHOLD (0.88) → Inspect classifyBorderlinePair() logic → Verify recommendation persistence

---

### Prompt

```
Validate companion reconsolidation aborts when predecessor changes.
```

### Commands

1. Enable `SPECKIT_ASSISTIVE_RECONSOLIDATION=true`
2. seed a merge-eligible predecessor used by the companion reconsolidation module
3. begin async merge preparation
4. mutate, archive, or delete the predecessor before transaction re-read
5. verify `predecessor_changed` or `predecessor_gone` is surfaced and no stale merged row is inserted
6. `npx vitest run .opencode/skills/system-spec-kit/mcp-server/tests/reconsolidation.vitest.ts -t \"Aborts merge when predecessor changes during embedding generation\"`

### Expected

Companion merge path aborts with `predecessor_changed` or `predecessor_gone`; no stale merged row is inserted; assistive layer remains recommendation/shadow-only rather than performing a destructive content merge

### Evidence

Exact command from the playbook, run from workspace root, failed to discover the `.vitest.ts` test file:

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true npx vitest run .opencode/skills/system-spec-kit/mcp-server/tests/reconsolidation.vitest.ts -t "Aborts merge when predecessor changes during embedding generation"

 RUN  v4.1.9 .

No test files found, exiting with code 1

filter: .opencode/skills/system-spec-kit/mcp-server/tests/reconsolidation.vitest.ts
include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**
```

Equivalent targeted package-root command verified the expected predecessor-change behavior:

```text
$ SPECKIT_ASSISTIVE_RECONSOLIDATION=true npx vitest run mcp-server/tests/reconsolidation.vitest.ts -t "Aborts merge when predecessor changes during embedding generation"

 RUN  v4.1.6 .opencode/skills/system-spec-kit

(node:56601) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)

 Test Files  1 passed (1)
      Tests  1 passed | 53 skipped (54)
   Start at  12:25:06
   Duration  638ms (transform 414ms, setup 0ms, import 560ms, tests 7ms, environment 0ms)
```

DB assertion covered by the passing targeted test at `mcp-server/tests/reconsolidation.vitest.ts`:

```text
expect(result.action).toBe('complement');
expect(result.status).toBe('predecessor_changed');
expect(result.newMemoryId).toBe(0);

expect(rows).toEqual([
  { id: 105, is_archived: 0, content_text: 'Concurrent writer content' },
]);
```

### Pass / Fail

- **Pass**: every signal named in the Expected block above is present in the captured output.
- **Fail**: any signal named in the Expected block is absent, or a command in the sequence errors unexpectedly.

### Failure Triage

Verify predecessor snapshot comparison (`content_hash`, `updated_at`) → Check shared reconsolidation guardrails → Confirm assistive bridge still limits itself to shadow-archive/recommend behavior

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [memory-quality-and-indexing/assistive-reconsolidation.md](../../feature-catalog/memory-quality-and-indexing/assistive-reconsolidation.md)
- Feature flag reference: [feature-flag-reference/1-search-pipeline-features-speckit.md](../../manual-testing-playbook/feature-flag-reference/search-pipeline-features-speckit.md)
- Source file: `mcp-server/handlers/save/reconsolidation-bridge.ts`

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 165
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `memory-quality-and-indexing/assistive-reconsolidation-speckit-assistive-reconsolidation.md`
