---
title: "213 -- Mutation response UX payload exposure"
description: "This scenario validates Mutation response UX payload exposure for `213`. It focuses on Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata."
version: 3.6.0.13
---

# 213 -- Mutation response UX payload exposure

## 1. OVERVIEW

This scenario validates Mutation response UX payload exposure for `213`. It focuses on Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm successful save responses expose typed `postMutationHooks` payloads while no-op saves suppress false UX metadata.
- Real user request: `` Please validate Mutation response UX payload exposure against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts and tell me whether the expected signals are present: Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance. ``
- Prompt: `Validate mutation response UX payload exposure and no-op suppression against the save-path regression suite.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the save-path suite passes and the assertions prove success responses expose the UX payload contract while no-op responses suppress false hook metadata

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm successful save responses expose typed postMutationHooks payloads while no-op saves suppress false UX metadata against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts. Verify save-path regression suite passes, successful save responses include typed postMutationHooks fields, and duplicate/no-op saves omit false postMutationHooks while surfacing cache-left-unchanged guidance. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts`
2. inspect assertions covering successful `memory_save` and `atomicSaveMemory` responses with typed `postMutationHooks` fields
3. inspect assertions covering duplicate-content and unchanged/no-op suppression of false UX payloads

### Expected

Save-path regression suite passes, successful save responses include typed `postMutationHooks` fields, and duplicate/no-op saves omit false `postMutationHooks` while surfacing cache-left-unchanged guidance

### Evidence

Command run:

```bash
cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts
```

Observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

{"timestamp":"2026-07-02T23:03:04.227Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T23:03:04.247Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T23:03:04.257Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

 Test Files  1 passed (1)
      Tests  3 passed (3)
   Start at  01:03:03
   Duration  1.02s (transform 638ms, setup 16ms, import 861ms, tests 73ms, environment 0ms)
```

Assertion inspection output:

```text
Found 28 matches
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit/mcp_server/tests/memory-save-ux-regressions.vitest.ts:
  Line 45: description: "Durable regression fixture for memory_save UX contract coverage."
  Line 66: Continue validating the \`memory_save\` UX contract with a fixture that is rich enough to satisfy the durable-memory gate while still exercising duplicate no-op, deferred embedding, and post-mutation feedback behavior.
  Line 74: - \`decision-record.md\` — UX contract and duplicate detection strategy
  Line 83: | \`mcp_server/handlers/memory-save.ts\` | Coordinates duplicate detection, sufficiency evaluation, template validation, and post-mutation feedback for \`memory_save\`. |
  Line 84: | \`mcp_server/handlers/save/response-builder.ts\` | Shapes successful save payloads, duplicate no-op hints, and deferred embedding response details. |
  Line 92: This regression fixture exists to prove that successful saves and duplicate no-op saves still report the correct UX payloads after the shared insufficiency gate and rendered-memory template contract were added to the save pipeline.
  Line 100: - Validated duplicate no-op response shape
  Line 108: - Decided to keep duplicate no-op saves visible in the UX contract so callers can distinguish unchanged content from validation failures.
  Line 114: - Verified duplicate no-op saves omit post-mutation hooks and leave caches unchanged.
  Line 142: description: "Continuity-focused regression fixture for memory_save UX contract coverage."
  Line 317:     body: 'Existing implementation-summary content should remain unchanged during planner-only UX tests.',
  Line 418:   it('returns readable, action-oriented planner output for narrative progress saves', async () => {
  Line 419:     const plannerResult = await handler.atomicSaveMemory({
  Line 429:     expect(parsed.data).toMatchObject({
  Line 439:     expect(parsed.data.proposedEdits[0]).toEqual(expect.objectContaining({
  Line 444:     expect(parsed.data.followUpActions).toEqual(expect.arrayContaining([
  Line 456:     expect(parsed.hints).toEqual(expect.arrayContaining([
  Line 462:   it('keeps metadata-only planner guidance readable and continuity-focused', async () => {
  Line 463:     const plannerResult = await handler.atomicSaveMemory({
  Line 471:     expect(parsed.data).toMatchObject({
  Line 480:     expect(parsed.data.proposedEdits[0]).toEqual(expect.objectContaining({
  Line 484:     expect(parsed.data.followUpActions).toEqual(expect.arrayContaining([
  Line 500:   it('reports blocked planner responses with readable blocker and next-step language', async () => {
  Line 501:     const plannerResult = await handler.atomicSaveMemory({
  Line 511:     expect(parsed.data.status).toBe('blocked');
  Line 512:     expect(parsed.data.blockers).toEqual([
  Line 519:     expect(parsed.data.followUpActions).toEqual([
  Line 526:     expect(parsed.hints).toEqual(expect.arrayContaining([
```

Relevant inspected assertion names present in `tests/memory-save-ux-regressions.vitest.ts`:

```text
Line 418: it('returns readable, action-oriented planner output for narrative progress saves', async () => {
Line 462: it('keeps metadata-only planner guidance readable and continuity-focused', async () => {
Line 500: it('reports blocked planner responses with readable blocker and next-step language', async () => {
```

The executed suite passed, but the observed assertions did not include typed `postMutationHooks` fields, successful `memory_save` response payload assertions, duplicate/no-op `postMutationHooks` omission assertions, or cache-left-unchanged guidance assertions.

### Pass / Fail

- **FAIL**: The save-path suite passed, but the inspected assertions do not prove typed `postMutationHooks` exposure or duplicate/no-op suppression with cache-left-unchanged guidance.

### Failure Triage

Inspect `handlers/save/response-builder.ts`, `hooks/mutation-feedback.ts`, and response-envelope formatting if payload fields drift

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [ux-hooks/mutation-response-ux-payload-exposure.md](../../feature_catalog/ux-hooks/mutation-response-ux-payload-exposure.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 213
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `ux-hooks/mutation-response-ux-payload-exposure.md`
- audited_post_018: true
- Feature catalog back-ref: `ux-hooks/mutation-response-ux-payload-exposure.md`
