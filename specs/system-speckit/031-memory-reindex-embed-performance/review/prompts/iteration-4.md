DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

Non-interactive worker, no human on the other end. Write authority is bound to STATE FILES below. Do NOT ask Gate-3. Proceed immediately.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch)

Write a `<pre-plan>` block with 4-5 ordered steps (Input/Output/Acceptance/Verification each) before any tool call.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 4 of 10 | Cumulative: P0=0 P1=1 P2=0 | Ratios: 1.0, 0.0, 0.0
Read `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` §12 NEXT FOCUS for your own iteration-3-authored plan for this iteration; follow it. Also read `iteration-003.md` for prior context. Do not re-review REQ-006, 007, 008, or 010 unless new evidence incidentally surfaces.

## ITERATION 4 FOCUS — REQ-009 Background-Scan Default (as you yourself specified in strategy.md §12)

Verify the MCP tool dispatch boundary fix in `.opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts` and the schema description update in `.opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts`. Specifically:
1. Confirm the default-injection logic: does an omitted `background` truly default to `true`, while explicit `true`/`false` pass through unchanged?
2. Independently locate and read the TWO claimed internal-caller exemptions yourself (do not trust the implementer's file-path claims blindly): the CLI reindex command's direct call to `handleMemoryIndexScan` (search `cli.ts` or similar), and the boot-time drift-repair scan's direct call (search `context-server.ts` for `consumeMemoryDriftDirtyMarker`/`runScopedScan` or similar). Confirm both bypass `lifecycle-tools.ts`'s dispatch layer entirely (i.e., they call `handleMemoryIndexScan` directly, not through the MCP tool dispatch), so the new default cannot affect them.
3. Run or read `.opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts` — are its mocks/assertions non-vacuous (would they actually fail if the default injection were removed)?
4. Confirm `.opencode/skills/system-spec-kit/mcp-server/dist/tools/lifecycle-tools.js` contains the compiled fix (grep for the background-default logic in dist).

Record findings, then set Next Focus for iteration 5 in strategy.md §12 (recommend: shift to the SECURITY dimension across all 16 files — particularly REQ-011's model-socket path handling for injection/traversal risk, and REQ-010's leaseId as a potential predictable-token concern, plus a general secrets/hardcoded-credential sweep).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-004.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-004.jsonl

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Target 9 tool calls, soft max 12, hard max 13.
- Write ALL findings to files. Review target is READ-ONLY. Do not implement fixes.
- **ALLOWED WRITE PATHS**: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-004.md`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only), `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-004.jsonl`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only).
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, output-redirect truncate `>` against any path not in the allowed-write list, or any delete/rename/replace outside that list. Reading is unrestricted; writing/renaming/deleting are scoped.
- **SCOPE VIOLATION PROTOCOL**: if a needed mutation falls outside allowed-write paths, STOP and record a `scope_violation` under a `## SCOPE VIOLATIONS` heading instead of executing it.
- Use `echo '<single-line-json>' >> <path>` for the JSONL append, not a patch/edit tool.

## OUTPUT CONTRACT

Produce THREE artifacts:
1. Iteration narrative at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-004.md` (Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension).
2. JSONL record APPENDED to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":4,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-004","status":"complete","focus":"<focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. Delta file at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-004.jsonl` (iteration record + per-finding/classification/traceability records).

All three artifacts REQUIRED.
