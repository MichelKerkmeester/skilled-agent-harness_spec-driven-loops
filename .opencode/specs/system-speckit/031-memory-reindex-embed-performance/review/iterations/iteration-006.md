# Deep Review Iteration 006

## Dimension
TRACEABILITY

## Files Reviewed
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/spec.md:101-115`
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/checklist.md:171-195`
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/plan.md:222-240`
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/{spec,plan,tasks,checklist,implementation-summary}.md:10-35`
- `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts:2975`
- `.opencode/skills/system-spec-kit/mcp-server/context-server.ts:1729,2444-2454,2488`
- `.opencode/bin/lib/launcher-ipc-bridge.cjs:489`
- `.opencode/bin/lib/launcher-session-proxy.cjs:400,847-848`
- `.opencode/bin/mk-spec-memory-launcher.cjs:454-568`
- `.opencode/bin/lib/model-server-supervision.cjs:42-43,488`
- `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts:71`
- `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts:478-548`
- `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts:2568-2586`
- `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts:40-73`
- `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts:114-161`
- `.opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts:171-203`
- `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/research/research.md:61-71,73-95`

## Findings by Severity

### P1-001 [P1] Existing finding reaffirmed: lease fencing evidence does not cover mutation-atomic refresh/clear
- File: `.opencode/bin/mk-spec-memory-launcher.cjs:562-578`
- Evidence: `refreshOwnerLeaseFile()` validates `ownerLeaseId` before `writeOwnerLeaseFile()` and only re-reads afterward; the write is not atomically bound to the validated lease. The existing lifecycle test at `launcher-spec-memory-lifecycle.vitest.ts:114-161` covers stale-reclaim unlink fencing, not heartbeat replacement or cleanup.
- Finding class: algorithmic
- Scope proof: the implementation has separate refresh and clear mutation paths, while the cited test exercises only `acquireOwnerLeaseFile()` reclaim behavior.
- Status: repeated/reaffirmed from iteration 1; not a new finding.

### P2-001 [P2] Continuity frontmatter uses contradictory phase labels
- File: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/plan.md:15-17`
- Evidence: `plan.md` says “Completed Phase 5 hardening” and “measure timings (Phase 4),” while `spec.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` consistently describe the same completed hardening as Phase 7 and the next action as measurement. All five share `last_updated_at: 2026-07-23T13:10:17Z`, so this is a same-update terminology inconsistency rather than stale timestamp drift.
- Finding class: matrix/evidence
- Scope proof: direct comparison of all five `_memory.continuity` blocks; the mismatch is isolated to `plan.md`'s `recent_action` and `next_safe_action` labels.
- Recommendation: align `plan.md`'s phase labels with the canonical Phase 7 hardening / Phase 4 measurement ordering used by the other packet docs.

### P2-002 [P2] FIX ADDENDUM verification column is not uniformly re-runnable
- File: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/plan.md:225-234`
- Evidence: most rows cite concrete `rg` commands, but the `launcher-session-proxy.cjs` row says “Manual daemon restart timing” without a command or test, and the test-suite row says “npx vitest run against each touched suite” without naming the suites or exact invocation. These do not meet the table's otherwise executable evidence standard.
- Finding class: matrix/evidence
- Scope proof: all eight surface rows were checked; rows 227, 229-233 contain concrete commands, while rows 228 and 234 are the non-deterministic/vague exceptions.
- Recommendation: replace the manual/vague entries with exact commands or named test paths, and explicitly document any live-daemon verification as operator-blocked if it cannot be safely rerun in this worktree.

## Traceability Checks

### spec_code
PASS with existing P1-001 reaffirmed. REQ-006 through REQ-009 and REQ-011 accurately describe the observed implementation and boundary choices. REQ-010 accurately describes the leaseId intent and stale-reclaim fence, but its “heartbeat replacement” completeness remains overstated by the existing P1-001. The implementation also matches the documented REQ-011 scope correction: the canonical fallback is used by the shared supervision module and the skill-advisor launcher wrapper.

### checklist_evidence
Spot checks passed:
- CHK-070: the cited probe-collapse tests at `launcher-session-proxy.vitest.ts:478-548` cover alive skip, absent-result probing, and non-alive rejection; targeted run passed.
- CHK-072: `context-server.vitest.ts:2575-2581` asserts `fromScan: true` on both branches; targeted run passed.
- CHK-073: `lifecycle-tools-scan-default.vitest.ts:45-71` covers omitted, explicit false, explicit true, and argument preservation; targeted run passed.
- CHK-074: the cited lease test passed and supports stale-reclaim fencing, but not the full heartbeat/cleanup claim; this is the existing P1-001 boundary.
- CHK-076: `launcher-model-server-cross-launcher.vitest.ts:183-203` asserts the canonical path, Darwin length, and skill-advisor convergence; targeted run passed.
CHK-079 is correctly left unchecked as a deferred P2, while its evidence claim is supported by the spec/plan deferral text.

### _memory.continuity
Timestamp, actor, packet pointer, blockers, and broad next-action intent are consistent. `plan.md` is inconsistent only in phase naming (`Phase 5` / `Phase 4` versus canonical `Phase 7` / measurement), recorded as P2-001.

### feature_catalog_code
No product feature-catalog entry covers this internal daemon/startup hardening packet. The repository feature-catalog search found only unrelated workflow/tooling catalogs; absence is correctly out of scope for this internal daemon fix. Deep-review feature-catalog files are review protocol metadata, not product feature entries.

### FIX ADDENDUM affected-surfaces
Rows with exact `rg` commands are re-runnable. The session-proxy manual-timing row and aggregate “against each touched suite” row are insufficiently specific, recorded as P2-002. The cited code/test commands themselves were re-run successfully:
- `npx vitest run tests/launcher-session-proxy.vitest.ts tests/context-server.vitest.ts -t 'initialReadyResult|T47c|T47d'`: 6 passed, 414 skipped.
- `npx vitest run tests/lifecycle-tools-scan-default.vitest.ts tests/launcher-spec-memory-lifecycle.vitest.ts tests/embedders/launcher-model-server-cross-launcher.vitest.ts`: 27 passed.

## Verdict
TRACEABILITY: PASS WITH TWO NON-BLOCKING DOCUMENTATION FINDINGS. No new P0/P1 was discovered. Existing P1-001 remains open because the checklist/spec claim exceeds the test and mutation-atomicity evidence for refresh/clear. The implementation/spec alignment for REQ-006 through REQ-011 is otherwise supported.

## Next Dimension
MAINTAINABILITY (iteration 7): inspect code clarity and comment hygiene across all new comments in the five CJS and two TypeScript implementation files; assess whether the leaseId-fencing paths in `mk-spec-memory-launcher.cjs` are understandable and safe for a future maintainer to modify without reintroducing the race.
