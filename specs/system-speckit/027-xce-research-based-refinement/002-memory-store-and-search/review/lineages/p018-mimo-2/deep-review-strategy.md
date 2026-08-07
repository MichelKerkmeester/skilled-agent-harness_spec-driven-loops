# Deep Review Strategy

<!-- ANCHOR:topic -->
## Topic

Review of reindex-scan responsiveness and cancellation implementation. A background `memory_index_scan` starved the daemon's single-thread event loop for over an hour; the fix adds tail-loop yields, `processBatches` early-abort, and an in-memory cancel flag.
<!-- /ANCHOR:topic -->

<!-- ANCHOR:review-dimensions -->
## Review Dimensions

- [ ] D1: Correctness — Logic errors, off-by-one, wrong return types, broken invariants
- [ ] D2: Security — Injection, auth bypass, secrets exposure, unsafe deserialization
- [ ] D3: Traceability — Spec/code alignment, checklist evidence, cross-reference integrity
- [ ] D4: Maintainability — Patterns, clarity, documentation quality, ease of safe follow-on changes
<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## Completed Dimensions

(none yet)
<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## Running Findings

- P0: 0
- P1: 0
- P2: 0
<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:what-worked -->
## What Worked

- Reading the three implementation files and spec docs in parallel provided full context efficiently.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## What Failed

(none yet)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## Exhausted Approaches

(none yet)
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## Ruled Out Directions

(none yet)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## Next Focus

- Dimension: D1 Correctness
- Files: `handlers/memory-index.ts`, `utils/batch-processor.ts`, `lib/ops/job-store.ts`
- Rationale: Correctness is highest priority; verify yield placement, cancel flag semantics, and early-abort behavior.
<!-- /ANCHOR:next-focus -->

<!-- ANCHOR:known-context -->
## Known Context

- The spec is Level 1 (176 lines LOC).
- The implementation touches 3 source files and 1 test mock.
- The launcher lease-heartbeat re-election is explicitly out of scope (documented follow-on).
- 68 tests across 5 suites verify the touched surface.
- `resource-map.md` is not present at init; skipping coverage gate.
<!-- /ANCHOR:known-context -->

<!-- ANCHOR:cross-reference-status -->
## Cross-Reference Status

### Core Protocols
| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| spec_code | pending | hard | Verify normative claims resolve to shipped behavior |
| checklist_evidence | pending | hard | No checklist.md present (Level 1) |

### Overlay Protocols
(none configured for spec-folder target without overlays)
<!-- /ANCHOR:cross-reference-status -->

<!-- ANCHOR:files-under-review -->
## Files Under Review

| File | Status | Notes |
|------|--------|-------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts` | pending | Tail-loop yields + cancel checks + early-abort wiring |
| `.opencode/skills/system-spec-kit/mcp_server/utils/batch-processor.ts` | pending | `shouldAbort` early-abort hook |
| `.opencode/skills/system-spec-kit/mcp_server/lib/ops/job-store.ts` | pending | In-process cancel Set + `isCancelRequestedFast` |
| `.opencode/specs/.../018-reindex-scan-responsiveness-and-cancellation/spec.md` | pending | Spec requirements |
| `.opencode/specs/.../018-reindex-scan-responsiveness-and-cancellation/plan.md` | pending | Implementation plan |
| `.opencode/specs/.../018-reindex-scan-responsiveness-and-cancellation/tasks.md` | pending | Task breakdown |
| `.opencode/specs/.../018-reindex-scan-responsiveness-and-cancellation/implementation-summary.md` | pending | Completion claims |
<!-- /ANCHOR:files-under-review -->

<!-- ANCHOR:review-boundaries -->
## Review Boundaries

- Max iterations: 1
- Convergence threshold: 0.10
- Severity threshold: P2
- Scope: Event-loop starvation fix only; launcher lease-heartbeat out of scope
<!-- /ANCHOR:review-boundaries -->
