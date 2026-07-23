DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

Non-interactive worker, no human on the other end. Write authority is bound to STATE FILES below. Do NOT ask Gate-3. Proceed immediately.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch)

Write a `<pre-plan>` block with 4-5 ordered steps (Input/Output/Acceptance/Verification each) before any tool call.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 9 of 10 | Cumulative: P0=0 P1=1 (reaffirmed at iter 8) P2=3. All 4 dimensions covered; P1-001 adversarially re-verified. Your own iteration-8 plan for this iteration: final adversarial sweep on the implementer's claimed test/build evidence.

## ITERATION 9 FOCUS — INDEPENDENT VERIFICATION SWEEP

1. **Independently re-run the actual test suites** that cover the 16 scope files — do NOT trust the implementer's reported "521 passed, 0 new failures" number; run it yourself and report what you actually observe. Command (run from this worktree's repo root, inside `.opencode/skills/system-spec-kit/mcp-server/`):
```
cd .opencode/skills/system-spec-kit/mcp-server && npx vitest run tests/launcher-ipc-bridge.vitest.ts tests/launcher-ipc-bridge-probe.vitest.ts tests/launcher-session-proxy.vitest.ts tests/launcher-lease.vitest.ts tests/launcher-recycle-lease.vitest.ts tests/launcher-spec-memory-lifecycle.vitest.ts tests/launcher-daemon-reelection.vitest.ts tests/embedders/launcher-model-server.vitest.ts tests/embedders/launcher-model-server-cross-launcher.vitest.ts tests/handler-memory-index.vitest.ts tests/context-server.vitest.ts tests/context-server-error-envelope.vitest.ts tests/lifecycle-tools-scan-default.vitest.ts tests/handler-memory-index-async-scan.vitest.ts tests/handler-memory-index-scan-jobs.vitest.ts tests/handler-memory-index-cooldown.vitest.ts tests/memory-index-scoped-scan-gating.vitest.ts 2>&1 | tail -30
```
This is a READ-ONLY test run (it does not modify any reviewed file) and is explicitly permitted despite the general "no writes outside allowed paths" rule, since running tests produces no persistent file changes to the reviewed target — only report the output, do not treat test execution itself as a scope violation.
2. Report the exact pass/fail/skip counts you observe. If they differ from the implementer's claim, that is itself a finding (severity depends on the nature of the difference — a flake reproducing the same way twice is different from a genuine new failure).
3. **Confirm the build**: run `cd .opencode/skills/system-spec-kit/mcp-server && npm run build 2>&1 | tail -20` and confirm it exits cleanly (this also does not mutate any reviewed source file, only regenerates `dist/`, which is a build artifact, not part of the review's read-only scope).
4. **Scope-violation retrospective**: review iterations 1-8's own dispatch-receipts and iteration narratives (`.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/dispatch-receipts/`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-00{1..8}.md`) — did any prior iteration record a `## SCOPE VIOLATIONS` section, or is there any evidence any prior iteration wrote outside its allowed paths? Confirm the review session itself has stayed clean.

Record findings, then set Next Focus for iteration 10 in strategy.md §12 (recommend: FINAL SYNTHESIS — compile the complete cumulative finding list across all 9 iterations, the final dimension-coverage map, and a release-readiness verdict: PASS / CONDITIONAL / FAIL, noting that PASS may include hasAdvisories=true given the 3 open P2s and the reaffirmed P1).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

## STATE FILES

- Config: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-009.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-009.jsonl

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Target 9 tool calls, soft max 12, hard max 13.
- Write ALL findings to files. Review target is READ-ONLY for source edits (running tests/build is explicitly permitted per Focus item 1/3 above — it produces no persistent source mutation).
- **ALLOWED WRITE PATHS**: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-009.md`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only), `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-009.jsonl`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only). Running `npx vitest` and `npm run build` is allowed (it writes only to `dist/` and `node_modules/.vite-cache` style build artifacts, not to any reviewed SOURCE file's content).
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, output-redirect truncate `>` against any path not in the allowed-write list, or any delete/rename/replace outside that list.
- **SCOPE VIOLATION PROTOCOL**: if a needed mutation falls outside allowed-write paths (other than the explicitly-permitted test/build run), STOP and record a `scope_violation` under `## SCOPE VIOLATIONS` instead of executing it.
- Use `echo '<single-line-json>' >> <path>` for the JSONL append, not a patch/edit tool.

## OUTPUT CONTRACT

Produce THREE artifacts:
1. Iteration narrative at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-009.md` (Dimension, actual test output summary, build confirmation, scope-violation retrospective, Verdict, Next Dimension).
2. JSONL record APPENDED to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":9,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-009","status":"complete","focus":"<focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. Delta file at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-009.jsonl` (iteration record + test-output-summary + build-confirmation records).

All three artifacts REQUIRED.
