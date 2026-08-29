---
title: "179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY)"
description: "This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results."
version: 3.6.0.14
id: ux-hooks-empty-result-recovery-speckit-empty-result-recovery-v1
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 179 -- Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY)

## 1. OVERVIEW

This scenario validates empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY) for `179`. It focuses on the default-on graduated rollout and verifying structured recovery payloads for empty/weak search results.

---

## 2. SCENARIO CONTRACT


- Objective: Verify structured recovery payloads for empty/weak search results.
- Real user request: `Please validate Empty result recovery (SPECKIT_EMPTY_RESULT_RECOVERY) against SPECKIT_EMPTY_RESULT_RECOVERY and tell me whether the expected signals are present: 3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; alternative queries generated; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3.`
- Prompt: `Validate empty result recovery payloads for empty and weak memory_search results.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: 3 statuses: no_results, low_confidence, partial; root cause reasons: spec_filter_too_narrow, low_signal_query, knowledge_gap; suggested actions: retry_broader, switch_mode, save_memory, ask_user; alternative queries generated; DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4; PARTIAL_RESULT_MIN=3
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if all 3 recovery statuses generate structured payloads with root cause, actions, and alternative queries; FAIL if any status missing, payloads lack required fields, or recovery not triggered at correct thresholds

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, verify structured recovery payloads for empty/weak search results against SPECKIT_EMPTY_RESULT_RECOVERY. Verify recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. Confirm `SPECKIT_EMPTY_RESULT_RECOVERY` is unset or `true`
2. `memory_search({ query: "completely nonexistent topic xyzzy" })` — triggers no_results
3. Search for vague/low-signal query — triggers low_confidence
4. Search with narrow specFolder filter — triggers partial
5. Inspect recovery payload for each: status, reason, actions, alternative queries

### Expected

Recovery payload contains status (no_results/low_confidence/partial); root cause reason (spec_filter_too_narrow/low_signal_query/knowledge_gap); suggested actions (retry_broader/switch_mode/save_memory/ask_user); alternative query suggestions; thresholds: LOW_CONFIDENCE=0.4, PARTIAL_MIN=3

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in section 3.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **FAIL**: Expected outcome did not hold. Observed output did not produce all 3 statuses: `no_results` was missing for `completely nonexistent topic xyzzy`; the nonexistent narrow `specFolder` run produced no recovery payload; the only observed `partial` payload used `reason: "knowledge_gap"` and `recommendedAction: "broaden_or_ask"` rather than the expected `spec_filter_too_narrow` and suggested action-list contract. Threshold constants matched source (`DEFAULT_LOW_CONFIDENCE_THRESHOLD = 0.4`, `PARTIAL_RESULT_MIN = 3`).

### Failure Triage

Verify recovery-payload.ts module loaded → Confirm flag is not forced off → Check DEFAULT_LOW_CONFIDENCE_THRESHOLD=0.4 → Verify PARTIAL_RESULT_MIN=3 → Inspect reason inference logic → Check alternative query generation

---

## 4. SOURCE FILES
- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- Feature catalog: [ux-hooks/empty-result-recovery.md](../../feature-catalog/ux-hooks/empty-result-recovery.md)
- Feature flag reference: [feature-flag-reference/1-search-pipeline-features-speckit.md](../../feature-catalog/feature-flag-reference/1-search-pipeline-features-speckit.md)
- Source file: `mcp-server/lib/search/recovery-payload.ts`

---

## 5. SOURCE METADATA

- Group: UX hooks
- Playbook ID: 179
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `ux-hooks/empty-result-recovery-speckit-empty-result-recovery-v1.md`
- audited_post_018: true
