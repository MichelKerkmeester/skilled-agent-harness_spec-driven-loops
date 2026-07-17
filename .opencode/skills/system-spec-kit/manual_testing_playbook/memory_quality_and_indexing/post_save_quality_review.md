---
title: "155 -- Post-save quality review"
description: "This scenario validates the POST-SAVE QUALITY REVIEW hook that runs after every JSON mode memory save, confirming correct field propagation, issue detection, and AI patch compliance."
audited_post_018: true
version: 3.6.0.19
id: memory-quality-and-indexing-post-save-quality-review
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 155 -- Post-save quality review

## 1. OVERVIEW

This scenario validates the POST-SAVE QUALITY REVIEW hook that fires after a JSON mode `generate-context.js` save. It confirms that a fully-populated payload produces a PASSED review with 0 issues, that field-level mismatches (generic titles, path-fragment triggers, mismatched importance_tier, zero decision_count) are surfaced with severity-graded instructions, and that the AI can follow the emitted fix instructions to bring frontmatter into alignment with the payload.

---

## 2. SCENARIO CONTRACT


- Objective: Verify that the post-save quality review correctly identifies field-propagation failures and guides AI remediation.
- Real user request: `Please validate Post-save quality review against sessionSummary and tell me whether the expected signals are present: REVIEW block present in stdout; issue count and severity match the scenario; fix instructions are actionable.`
- Prompt: `Validate post-save quality review issue detection and remediation guidance.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: REVIEW block present in stdout; issue count and severity match the scenario; fix instructions are actionable
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if review output matches expected status for each scenario and AI-applied patches resolve all reported issues

---

## 3. TEST EXECUTION

### Prompt

```
Validate post-save quality review issue detection and remediation guidance.
```

### Commands

1. Compose full JSON payload: `sessionSummary` = descriptive title, `triggerPhrases` = keyword array, `keyDecisions` = 2+ items, `importanceTier` = "important", `contextType` = "implementation"
2. `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Locate `POST-SAVE QUALITY REVIEW` block
5. Assert status = PASSED and issues = 0

### Expected

`POST-SAVE QUALITY REVIEW -- PASSED` with 0 issues

### Evidence

BLOCKED before execution. The required command was not run because it would execute `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`, which is a save pipeline command and may write generated context/spec metadata outside the only allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/post_save_quality_review.md`.

### Pass / Fail

- **BLOCKED**: Required save command conflicts with the task-level allowed-write constraint, so no `POST-SAVE QUALITY REVIEW` stdout block was produced.

### Failure Triage

Check `scripts/core/post-save-review.ts` for false-positive conditions

---

### Prompt

```
Validate generic-title save reports a HIGH title issue.
```

### Commands

1. Compose payload that would yield a generic title
2. `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Locate `POST-SAVE QUALITY REVIEW` block
5. Assert a `[HIGH]` issue is reported for the title field
6. Assert a fix instruction is present

### Expected

[HIGH]` severity issue for title; fix instruction references `sessionSummary

### Evidence

BLOCKED before execution. The required command was not run because it would execute `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`, which is a save pipeline command and may write generated context/spec metadata outside the only allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/post_save_quality_review.md`.

### Pass / Fail

- **BLOCKED**: Required save command conflicts with the task-level allowed-write constraint, so no `[HIGH]` title issue output or fix instruction could be observed.

### Failure Triage

Inspect title-quality check in `scripts/core/post-save-review.ts` and the generic-title detection list

---

### Prompt

```
Validate path-fragment trigger phrases report a HIGH trigger issue.
```

### Commands

1. Compose payload with `triggerPhrases` = ["auth refactor"] but arrange for heuristic override
2. `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Assert a `[HIGH]` issue for `trigger_phrases` containing path fragments

### Expected

`[HIGH]` severity issue for trigger_phrases; fix instruction present

### Evidence

BLOCKED before execution. The required command was not run because it would execute `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`, which is a save pipeline command and may write generated context/spec metadata outside the only allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/post_save_quality_review.md`.

### Pass / Fail

- **BLOCKED**: Required save command conflicts with the task-level allowed-write constraint, so no `[HIGH]` `trigger_phrases` issue output could be observed.

### Failure Triage

Check path-fragment detection regex in `scripts/core/post-save-review.ts`

---

### Prompt

```
Validate mismatched importance tier reports a MEDIUM issue.
```

### Commands

1. Compose payload with `importanceTier` = "important"
2. Force or simulate a pipeline override to "normal"
3. `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
4. Capture stdout
5. Assert a `[MEDIUM]` issue for `importance_tier`

### Expected

`[MEDIUM]` severity issue for importance_tier; expected vs actual values shown

### Evidence

BLOCKED before execution. The required command was not run because it would execute `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`, which is a save pipeline command and may write generated context/spec metadata outside the only allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/post_save_quality_review.md`. The scenario also requires forcing or simulating a pipeline override to `normal`, but no allowed non-writing command path is provided.

### Pass / Fail

- **BLOCKED**: Required save command conflicts with the task-level allowed-write constraint, so no `[MEDIUM]` `importance_tier` mismatch output could be observed.

### Failure Triage

Inspect importance_tier comparison in `scripts/core/post-save-review.ts` and input-normalizer passthrough

---

### Prompt

```
Validate missing key decision propagation reports a MEDIUM decision-count issue.
```

### Commands

1. Compose payload with `keyDecisions` = ["Decision A", "Decision B"]
2. `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`
3. Capture stdout
4. Assert a `[MEDIUM]` issue for `decision_count` = 0 despite non-empty payload

### Expected

`[MEDIUM]` severity issue for decision_count; notes expected count from payload

### Evidence

BLOCKED before execution. The required command was not run because it would execute `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json '<payload>' <spec-folder>`, which is a save pipeline command and may write generated context/spec metadata outside the only allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/post_save_quality_review.md`.

### Pass / Fail

- **BLOCKED**: Required save command conflicts with the task-level allowed-write constraint, so no `[MEDIUM]` `decision_count` issue output could be observed.

### Failure Triage

Check decision counting in `scripts/extractors/collect-session-data.ts` and the metadata-block parser in `scripts/core/post-save-review.ts`

---

### Prompt

```
Validate AI fix instructions resolve HIGH post-save issues.
```

### Commands

1. Perform a save that produces at least one `[HIGH]` issue (e.g., title or trigger_phrases)
2. Read the emitted fix instructions from the REVIEW block
3. Apply the patch to the rendered spec-doc record file frontmatter
4. Re-read the file
5. Assert patched field matches the payload value

### Expected

Frontmatter fields match payload values after patch; no remaining mismatches for patched fields

### Evidence

BLOCKED before execution. Command step 3 requires applying a patch to the rendered spec-doc record file frontmatter, but the task-level allowed-write constraint permits editing only `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/post_save_quality_review.md`. No before/after frontmatter diff was produced.

### Pass / Fail

- **BLOCKED**: Required frontmatter patch conflicts with the task-level allowed-write constraint.

### Failure Triage

Verify fix instruction precision — instructions must name the exact field and target value

---

### Prompt

```
Validate score-penalty advisory logging after post-save review.
```

### Commands

1. Compose payload that produces a generic title (triggers HIGH issue)
2. Run generate-context.js --json
3. Capture stdout
4. Locate "Post-save review: quality_score penalty" log line
5. Assert penalty value is negative (e.g., -0.10)

### Expected

"Post-save review: quality_score penalty" present in stdout with negative value

### Evidence

BLOCKED before execution. The required command was not run because it would execute `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --json`, which is a save pipeline command and may write generated context/spec metadata outside the only allowed write path: `.opencode/skills/system-spec-kit/manual_testing_playbook/memory_quality_and_indexing/post_save_quality_review.md`.

### Pass / Fail

- **BLOCKED**: Required save command conflicts with the task-level allowed-write constraint, so no `Post-save review: quality_score penalty` stdout line could be observed.

### Failure Triage

Check computeReviewScorePenalty in post-save-review.ts and advisory logging in workflow.ts

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [memory_quality_and_indexing/post_save_quality_review.md](../../feature_catalog/memory_quality_and_indexing/post_save_quality_review.md)
- Related entry: [tooling_and_scripts/json_mode_hybrid_enrichment.md](../tooling_and_scripts/json_mode_hybrid_enrichment.md)
- Workflow hook: `scripts/core/post-save-review.ts`
- Save pipeline: `scripts/core/workflow.ts`
- CLI surface: `scripts/memory/generate-context.ts`

---

## 5. SOURCE METADATA

- Group: Memory Quality and Indexing
- Playbook ID: 155
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `memory_quality_and_indexing/post_save_quality_review.md`
