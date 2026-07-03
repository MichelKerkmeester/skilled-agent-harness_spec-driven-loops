---
title: "225 -- Runtime remediation, revalidation, and auto-repair workflows"
description: "This scenario validates Runtime remediation, revalidation, and auto-repair workflows for `225`. It focuses on Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals."
audited_post_018: true
phase_018_change: "Post-018 audit kept the scenario aligned to the live remediation surface, including save-time guards, confirmation-gated repair, and rollback-aware revalidation."
version: 3.6.0.15
---

# 225 -- Runtime remediation, revalidation, and auto-repair workflows

## 1. OVERVIEW

This scenario validates Runtime remediation, revalidation, and auto-repair workflows for `225`. It focuses on Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals.

---

## 2. SCENARIO CONTRACT


- Objective: Confirm the live remediation surface blocks unsafe writes, exposes bounded repair paths, and preserves rollback-aware revalidation signals.
- Real user request: `Please validate Runtime remediation, revalidation, and auto-repair workflows against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts and tell me whether the expected signals are present: Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence.`
- Prompt: `Validate runtime remediation, revalidation, and auto-repair against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if the targeted suites pass and the evidence confirms the remediation surface enforces save-time guards, bounded operator repair, and rollback-aware revalidation behavior end to end

---

## 3. TEST EXECUTION

### Prompt

```
Validate runtime remediation, revalidation, and auto-repair against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts.
```

### Commands

1. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/memory-save-ux-regressions.vitest.ts tests/memory-crud-extended.vitest.ts tests/mcp-input-validation.vitest.ts`
2. `cd .opencode/skills/system-spec-kit && npm run build && node -e "import('./mcp_server/dist/handlers/v-rule-bridge.js').then((m)=>{ const available=m.isVRuleBridgeAvailable(); console.log(available ? 'v-rule-bridge:available' : 'v-rule-bridge:missing'); process.exit(available ? 0 : 1); }).catch((error)=>{ console.error(error); process.exit(1); })"`
3. inspect assertions covering `memory_save` preflight, V-rule disposition handling, quality-loop rejection or repair, and downstream save-quality-gate outcomes
4. inspect assertions covering `memory_health` confirmation-required auto-repair and bounded repair metadata
5. inspect assertions covering `memory_validate` and checkpoint pathways that preserve revalidation or rollback signals

### Expected

Targeted save, health, and checkpoint suites pass; save-time flows show preflight, validation, and quality-loop enforcement; the V-rule bridge load path resolves successfully; health repair remains confirmation-gated and bounded; and checkpoint or validation paths expose rollback-aware remediation and revalidation signals without contradicting evidence

### Evidence

Command 1 observed output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

(node:60758) ExperimentalWarning: SQLite is an experimental feature and might change at any time
(Use `node --trace-warnings ...` to show where the warning was created)
{"timestamp":"2026-07-02T23:49:35.012Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T23:49:35.042Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}
{"timestamp":"2026-07-02T23:49:35.051Z","level":"info","message":"contamination_audit","stage":"post-render","patternsChecked":["frontmatter:trigger_phrases","frontmatter:key_topics","body:foreign-spec-dominance","body:foreign-spec-scatter","title:template instructional heading","title:placeholder bracket title","title:generic stub title","title:spec-id-only title"],"matchesFound":[],"actionsTaken":["failed_rules:none"],"passedThrough":["current_spec:999-memory-save-ux-fixtures","trigger_phrases:2","key_topics:0","captured_file_count:unknown","filesystem_file_count:unknown"]}

 Test Files  3 passed (3)
      Tests  92 passed | 23 skipped (115)
   Start at  01:49:33
   Duration  2.01s (transform 952ms, setup 17ms, import 271ms, tests 1.55s, environment 0ms)
```

Command 2 observed output:

```text
> system-spec-kit@1.7.2 build
> tsc --build

v-rule-bridge:available
```

Assertion inspection observed:

```text
mcp_server/tests/memory-save-ux-regressions.vitest.ts:417 describe('Memory save UX regressions', () => {
mcp_server/tests/memory-save-ux-regressions.vitest.ts:429 expect(parsed.data).toMatchObject({ status: 'planned', plannerMode: 'plan-only', routeTarget: expect.objectContaining({ routeCategory: 'narrative_progress', targetDocPath: path.join(FIXTURE_ROOT, 'implementation-summary.md'), targetAnchorId: 'what-built', mergeMode: 'append-as-paragraph' }) })
mcp_server/tests/memory-save-ux-regressions.vitest.ts:444 expect(parsed.data.followUpActions).toEqual(expect.arrayContaining([ expect.objectContaining({ action: 'apply', title: 'Apply canonical save', description: expect.stringContaining('explicit full-auto mode'), args: expect.objectContaining({ plannerMode: 'full-auto', routeAs: 'narrative_progress', targetAnchorId: 'what-built' }) }) ]))
mcp_server/tests/memory-save-ux-regressions.vitest.ts:511 expect(parsed.data.status).toBe('blocked')
mcp_server/tests/memory-save-ux-regressions.vitest.ts:526 expect(parsed.hints).toEqual(expect.arrayContaining([ 'Resolve planner blockers before requesting full-auto apply mode' ]))
mcp_server/tests/handler-memory-index.vitest.ts:218 validateMemoryQualityContent: vi.fn(() => ({ valid: true, failedRules: [] }))
mcp_server/tests/handler-memory-index.vitest.ts:219 determineValidationDisposition: vi.fn(() => 'allow')
mcp_server/tests/handler-memory-index.vitest.ts:225 evaluateMemorySufficiency: vi.fn(() => ({ pass: true, rejectionCode: 'INSUFFICIENT_CONTEXT_ABORT', reasons: [], evidenceCounts: { primary: 2, support: 2, total: 4, semanticChars: 420, uniqueWords: 72, anchors: 2, triggerPhrases: 2 }, score: 0.97 }))
mcp_server/tests/handler-memory-index.vitest.ts:267 runQualityLoop: vi.fn(() => ({ score: { total: 0.92, issues: [] }, fixes: [], passed: true, rejected: false, fixedTriggerPhrases: undefined }))
mcp_server/tests/handler-memory-index.vitest.ts:281 runQualityGate: vi.fn(() => ({ pass: true, warnOnly: false, reasons: [], layers: {} }))
mcp_server/tests/memory-crud-extended.vitest.ts:1455 expect(parsed?.data?.repair).toEqual(expect.objectContaining({ requested: true, attempted: true, repaired: true, partialSuccess: false }))
mcp_server/tests/memory-crud-extended.vitest.ts:1461 expect(parsed?.data?.repair?.actions).toContain('fts_rebuild')
mcp_server/tests/memory-crud-extended.vitest.ts:1462 expect(parsed?.data?.repair?.actions).toContain('trigger_cache_refresh')
mcp_server/tests/memory-crud-extended.vitest.ts:1514 expect(parsed?.summary).toContain('Confirmation required')
mcp_server/tests/memory-crud-extended.vitest.ts:1515 expect(parsed?.data).toMatchObject({ autoRepairRequested: true, needsConfirmation: true })
mcp_server/tests/memory-crud-extended.vitest.ts:1519 expect(parsed?.data?.actions).toEqual(expect.arrayContaining([ 'fts_rebuild', 'trigger_cache_refresh', 'orphan_edges_cleanup', 'orphan_vector_cleanup', 'orphan_chunks_cleanup' ]))
mcp_server/tests/memory-crud-extended.vitest.ts:1527 expect(execMock).not.toHaveBeenCalled()
mcp_server/tests/memory-crud-extended.vitest.ts:1528 expect(refreshSpy).not.toHaveBeenCalled()
mcp_server/tests/memory-crud-extended.vitest.ts:1600 expect(parsed?.data?.repair?.warnings).toEqual(expect.arrayContaining([expect.stringContaining('Post-repair mismatch persists')]))
mcp_server/tests/memory-crud-extended.vitest.ts:1662 expect(parsed?.data?.repair?.errors).toEqual(expect.arrayContaining([expect.stringContaining('Consistency check failed before repair')]))
mcp_server/tests/memory-crud-extended.vitest.ts:1808 expect(parsed?.data?.repair?.actions).toEqual(expect.arrayContaining(['orphan_files_cleaned:2']))
mcp_server/tests/memory-crud-extended.vitest.ts:650 it('EXT-BD2: Bulk delete creates checkpoint', async (ctx) => {
mcp_server/tests/memory-crud-extended.vitest.ts:667 expect(parsed?.data?.checkpoint).toBeDefined()
mcp_server/tests/mcp-input-validation.vitest.ts:270 describe('memory_validate feedback contract', () => {
mcp_server/tests/mcp-input-validation.vitest.ts:274 expect(source).toContain('recordAdaptiveSignal')
mcp_server/tests/mcp-input-validation.vitest.ts:275 expect(source).toMatch(/catch\s*\(_error: unknown\)\s*\{\s*\/\/ Adaptive signals are best-effort only\s*\}/s)
mcp_server/tests/mcp-input-validation.vitest.ts:276 expect(source).toContain('learnedFeedback')
mcp_server/tests/mcp-input-validation.vitest.ts:277 expect(source).toContain('groundTruthSelectionId')
mcp_server/tests/handler-checkpoints.vitest.ts:176 expect(parsed.hints).toContain('Restore with: checkpoint_restore({ name: "coverage-checkpoint" })')
mcp_server/tests/handler-checkpoints.vitest.ts:178 'Delete with: checkpoint_delete({ name: "coverage-checkpoint", confirmName: "coverage-checkpoint" })'
```

### Pass / Fail

- **PASS**: the targeted suites passed, the compiled validator path resolved as `v-rule-bridge:available`, and inspected assertions confirm save-time guard coverage, confirmation-gated bounded repair, repair metadata, checkpoint restore/delete hints, and validation feedback signals without contradictory evidence.

### Failure Triage

Inspect `mcp_server/handlers/memory-save.ts`, `mcp_server/lib/validation/preflight.ts`, `mcp_server/handlers/v-rule-bridge.ts`, `mcp_server/handlers/quality-loop.ts`, `mcp_server/lib/validation/save-quality-gate.ts`, `mcp_server/handlers/checkpoints.ts`, and `mcp_server/handlers/memory-crud-health.ts` if any remediation-stage signal is missing or contradictory

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [20--remediation-revalidation/category-stub.md](../../feature_catalog/20--remediation-revalidation/category-stub.md)

---

## 5. SOURCE METADATA

- Group: Remediation and Revalidation
- Playbook ID: 225
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `20--remediation-revalidation/remediation-runtime-surface.md`
