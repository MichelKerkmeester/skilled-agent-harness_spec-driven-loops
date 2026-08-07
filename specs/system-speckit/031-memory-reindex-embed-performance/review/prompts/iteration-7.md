DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

Non-interactive worker, no human on the other end. Write authority is bound to STATE FILES below. Do NOT ask Gate-3. Proceed immediately.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch)

Write a `<pre-plan>` block with 4-5 ordered steps (Input/Output/Acceptance/Verification each) before any tool call.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 7 of 10 | Cumulative: P0=0 P1=1 P2=2 (P1-001 REQ-010 lease-use atomicity; P2-001 plan.md stale phase labels; P2-002 FIX ADDENDUM non-executable verification rows). All 4 dimensions (correctness, security, traceability) have had at least one clean or near-clean pass except REQ-010's carried P1.
This is the LAST first-pass dimension: MAINTAINABILITY (your own iteration-6 plan).

## ITERATION 7 FOCUS — MAINTAINABILITY DIMENSION

1. **Comment hygiene**: grep every new/modified comment across the 7 implementation files (`launcher-ipc-bridge.cjs`, `mk-spec-memory-launcher.cjs`, `launcher-session-proxy.cjs`, `model-server-supervision.cjs`, `mk-skill-advisor-launcher.cjs`, `context-server.ts`, `tools/lifecycle-tools.ts`, `tool-schemas.ts`). Flag ANY comment that embeds an ephemeral artifact label (REQ-/CHK-/task-id, spec-folder path, phase number) — this project has a HARD rule against that (durable WHY only). This is a genuinely adversarial check: the implementer claims to have caught and fixed 3 such violations mid-session; verify none remain and none were reintroduced.
2. **leaseId-fencing maintainability**: is the REQ-010 fencing logic in `mk-spec-memory-launcher.cjs` (the `acquireOwnerLeaseFile`/`refreshOwnerLeaseFile`/`clearOwnerLeaseFile` trio) understandable enough that a future maintainer changing one function without the others could accidentally reintroduce the TOCTOU race? Is the invariant ("always re-validate leaseId immediately before mutating the file") stated clearly enough in-code, or only in the test/docs?
3. **Pattern consistency**: does the REQ-008 `fromScan: true` fix follow the exact same code shape as the REQ-006 fix it's supposed to mirror (same option name, same call convention), or did it introduce a subtly different pattern that could confuse future maintenance?
4. **Test file quality**: are the new test files (6 files, ~15 new tests) reasonably organized, named, and commented, or do any of them have maintainability smells (magic numbers with no explanation, brittle exact-string assertions that will break on unrelated refactors, etc.)?
5. Any other maintainability concern you notice while reading — this is your last dedicated first-pass dimension, so be thorough.

This is iteration 7 of 10 — 3 iterations remain after this one for deeper adversarial follow-up on anything unresolved, re-verification of the P1/P2 findings so far, and a final synthesis pass. Set Next Focus for iteration 8 in strategy.md §12 accordingly (recommend: adversarial re-verification of P1-001 specifically — construct the EXACT interleaving scenario where the lease-use/generation-check gap would matter in practice, and assess whether it should be upgraded, downgraded, or stays P1).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-007.jsonl

## CONSTRAINTS

- LEAF agent. Do NOT dispatch sub-agents. Target 9 tool calls, soft max 12, hard max 13.
- Write ALL findings to files. Review target is READ-ONLY. Do not implement fixes.
- **ALLOWED WRITE PATHS**: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-007.md`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only), `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-007.jsonl`, `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only).
- **BANNED OPERATIONS**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i`, `rmdir`, `find ... -delete`, output-redirect truncate `>` against any path not in the allowed-write list, or any delete/rename/replace outside that list. Reading is unrestricted; writing/renaming/deleting are scoped.
- **SCOPE VIOLATION PROTOCOL**: if a needed mutation falls outside allowed-write paths, STOP and record a `scope_violation` under `## SCOPE VIOLATIONS` instead of executing it.
- Use `echo '<single-line-json>' >> <path>` for the JSONL append, not a patch/edit tool.

## OUTPUT CONTRACT

Produce THREE artifacts:
1. Iteration narrative at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-007.md` (Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension).
2. JSONL record APPENDED to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":7,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-007","status":"complete","focus":"<focus>","dimensions":["maintainability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. Delta file at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-007.jsonl` (iteration record + per-finding/classification/traceability records).

All three artifacts REQUIRED.
