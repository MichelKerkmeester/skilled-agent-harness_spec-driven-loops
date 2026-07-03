---
title: "214 -- Atomic-save parity and partial-indexing hints"
description: "This scenario validates Atomic-save parity and partial-indexing hints for `214`. It focuses on Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots."
version: 3.6.0.13
---

# 214 -- Atomic-save parity and partial-indexing hints

## 1. OVERVIEW

This scenario validates Atomic-save parity and partial-indexing hints for `214`. It focuses on Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots.
- Real user request: `Please validate Atomic-save parity and partial-indexing hints against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts and tell me whether the expected signals are present: Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation.`
- Prompt: `Validate atomic-save parity, partial-indexing hints, no-op suppression, and callback snapshot isolation.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the assertions confirm atomic-save parity, partial-indexing guidance, no-op suppression, and callback snapshot protection

---

## 3. TEST EXECUTION

### Prompt

```
As a runtime-hook validation operator, confirm atomic-save responses match the primary save envelope, preserve partial-indexing guidance, and protect callback snapshots against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts. Verify save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation. Return a concise pass/fail verdict with the main reason and cited evidence.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts`
2. inspect assertions covering successful atomic-save `postMutationHooks` contract parity
3. inspect assertions covering partial-indexing hints and duplicate or unchanged hook suppression
4. inspect assertions covering `structuredClone` snapshot isolation for after-tool callbacks

### Expected

Save-path and context-server suites pass, atomic-save success responses match the standard save UX contract, pending async embedding keeps partial-indexing guidance, duplicate or unchanged statuses suppress false hook metadata, and callback assertions prove snapshot isolation

### Evidence

Command run from `.opencode/skills/system-spec-kit/mcp_server`:

```text
npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/context-server.vitest.ts

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

{"timestamp":"2026-07-02T22:45:15.858Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T22:45:15.876Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T22:45:15.885Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

 Test Files  2 passed (2)
      Tests  394 passed (394)
   Start at  00:45:14
   Duration  1.39s (transform 680ms, setup 15ms, import 562ms, tests 691ms, environment 0ms)
```

Observed save-path assertions in `tests/memory-save-ux-regressions.vitest.ts` are planner-output focused:

```text
417: describe('Memory save UX regressions', () => {
418:   it('returns readable, action-oriented planner output for narrative progress saves', async () => {
429:     expect(parsed.data).toMatchObject({
430:       status: 'planned',
431:       plannerMode: 'plan-only',
432:       routeTarget: expect.objectContaining({
456:     expect(parsed.hints).toEqual(expect.arrayContaining([
457:       expect.stringContaining('Planner prepared 1 proposed edit'),
458:       expect.stringContaining('Available follow-up actions: apply'),
462:   it('keeps metadata-only planner guidance readable and continuity-focused', async () => {
471:     expect(parsed.data).toMatchObject({
472:       status: 'planned',
473:       plannerMode: 'plan-only',
484:     expect(parsed.data.followUpActions).toEqual(expect.arrayContaining([
500:   it('reports blocked planner responses with readable blocker and next-step language', async () => {
511:     expect(parsed.data.status).toBe('blocked');
526:     expect(parsed.hints).toEqual(expect.arrayContaining([
527:       'Resolve planner blockers before requesting full-auto apply mode',
```

Observed callback snapshot assertions in `tests/context-server.vitest.ts`:

```text
1285:     it('T000b: callbacks are triggered after dispatchTool and non-blocking', () => {
1286:       expect(sourceCode).toMatch(/const\s+result\s*=\s*await\s+runWithCallerContext\([\s\S]*?dispatchTool\(name,\s*validatedArgs,\s*callerContext\)/)
1287:       expect(sourceCode).toMatch(/runAfterToolCallbacks\(name,\s*callId,\s*structuredClone\(result\)\)/)
1288:       expect(sourceCode).toMatch(/queueMicrotask\(\(\)\s*=>\s*\{/)
1289:       expect(sourceCode).not.toMatch(/await\s+runAfterToolCallbacks\(/)
1298:     it('T000d: callback runs after dispatchTool resolves', async () => {
1334:         runAfterToolCallbacks('memory_search', 'call-1', structuredClone(result))
1352:       expect(callbackSpy).toHaveBeenCalledTimes(1)
1353:       // structuredClone snapshot: callback receives a deep clone before post-dispatch mutations
1355:       expect(callArgs[0]).toBe('memory_search')
1356:       expect(callArgs[1]).toBe('call-1')
1357:       expect(callArgs[2]).toEqual({ content: [{ type: 'text', text: '{}' }] })
1358:       expect(callArgs[2]).not.toBe(toolResult) // structuredClone produces a new reference
1359:       expect(events).toEqual(['dispatch:start', 'dispatch:end', 'callback'])
1362:     it('T000d: rejected callback does not block other callbacks', async () => {
1397:       expect(callbackOrder).toEqual(['first', 'second'])
1399:         errorSpy.mock.calls.some((call) => String(call[0]).includes('afterTool callback failed'))
1400:       ).toBe(true)
1403:     it('T000d: response stays non-blocking while callback is pending', async () => {
1446:       expect(responseRace).toBe('resolved')
1448:       expect(callbackStarted).toBe(true)
1449:       expect(callbackFinished).toBe(false)
1455:       expect(callbackFinished).toBe(true)
```

Missing expected assertion coverage in the targeted save-path suite: no observed assertions in `tests/memory-save-ux-regressions.vitest.ts` for successful atomic-save `postMutationHooks` contract parity, pending async embedding partial-indexing guidance, or duplicate/unchanged suppression of false hook metadata.

### Pass / Fail

- **FAIL**: targeted suites pass, and callback snapshot protection assertions are present, but the observed targeted save-path assertions do not confirm successful atomic-save `postMutationHooks` contract parity, partial-indexing guidance, or duplicate/unchanged hook suppression.

### Failure Triage

Inspect `handlers/memory-save.ts`, `handlers/save/response-builder.ts`, `handlers/save/post-insert.ts`, and `context-server.ts` if parity or snapshot behavior regresses

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [18--ux-hooks/atomic-save-parity-and-partial-indexing-hints.md](../../feature_catalog/18--ux-hooks/atomic-save-parity-and-partial-indexing-hints.md)

---

## 5. SOURCE METADATA

- Group: UX Hooks
- Playbook ID: 214
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `18--ux-hooks/atomic-save-parity-and-partial-indexing-hints.md`
- audited_post_018: true
- Feature catalog back-ref: `18--ux-hooks/atomic-save-parity-and-partial-indexing-hints.md`
