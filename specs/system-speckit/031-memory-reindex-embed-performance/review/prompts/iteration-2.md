DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

This is a non-interactive review-iteration worker with NO human on the other end. Your write authority is ALREADY bound: you write ONLY the externalized state files listed under STATE FILES. Do NOT ask the Gate-3 question, do NOT stop to request a documentation choice. Proceed directly and immediately.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch — read before any tool call)

Before doing any review work, write a `<pre-plan>` block with 4-5 ordered steps (dense). Each step MUST include Input, Output, Acceptance criterion, and Verification command. Then execute the plan.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 2 of 10 | Prior findings: P0=0 P1=1 P2=0 | Last ratio: 1.0
Focus (set by iteration 1's Next Focus): REQ-007 probe collapse.

Review Target: system-speckit/031-memory-reindex-embed-performance
Read (do not re-derive from scratch) the prior iteration's narrative first: `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-001.md` and its P1 finding (`P1-001`: refresh/clear generation checks are not mutation-atomic in the REQ-010 leaseId fencing). Do NOT re-investigate REQ-010 this iteration — it is covered; treat it as closed unless this iteration's work incidentally surfaces new evidence about it.

## ITERATION 2 FOCUS — REQ-007 Probe Collapse

Read and adversarially review:
- `.opencode/bin/lib/launcher-ipc-bridge.cjs` (`maybeBridgeLeaseHolder()`'s `initialReadyResult` forwarding)
- `.opencode/bin/mk-spec-memory-launcher.cjs` (`bridgeStdioThroughSessionProxy` passthrough, roughly line 318-332; and the bounded `ps` timeout in `readParentPid()`, roughly line 460-497)
- `.opencode/bin/lib/launcher-session-proxy.cjs` (`createSessionProxy`/`start()` honoring `initialReadyResult`)

Verify independently:
1. Does `start()` actually skip `waitForDaemonReady()` ONLY when `initialReadyResult.status === 'alive'`, or could a malformed/partial `initialReadyResult` object cause it to skip the probe incorrectly (e.g. missing `.status` field, or a falsy-but-truthy status string)?
2. Does the reattach/cold-start path (the OTHER `createSessionProxy` call site inside `mk-spec-memory-launcher.cjs`, around line 1876-1882) genuinely still run its own independent probe — read that call site directly, don't just trust the implementer's claim.
3. Is the bounded `ps` timeout (`SPECKIT_PS_PROBE_TIMEOUT_MS`, default 2000ms) actually wired into the `spawnSync` call, and does the `result.error` check correctly handle the timeout-kill case (Node sets `.error` with code `ETIMEDOUT` when `spawnSync`'s `timeout` fires)?
4. Cross-check against the existing tests `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts` and `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts` — do the NEW tests in these files actually assert the behavior claimed, or could they be satisfied by a broken implementation (i.e., are they tautological/weak assertions)?

Record findings, then set Next Focus for iteration 3 (recommend: REQ-008 async-ingest fromScan fix in `context-server.ts`'s `processFile` callback, cross-checked against `context-server.vitest.ts` T47c/T47c-2, plus a look at whether `memory-ingest.ts`'s job-queue crash-replay path has any OTHER call site the implementer might have missed).

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-002.md`
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-002.jsonl`
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading, then continue the review.
- Use `echo '<single-line-json>' >> <path>` via a shell/bash tool for the JSONL append, not a patch/edit tool.

## Do's

- Stay strictly within the allowed-writes scope.
- Verify every citation by reading the actual file — do not restate the implementer's claims as fact.
- Emit the `<pre-plan>` block before any code/file reading.

## Don'ts

- Do not invent CLI flags, functions, or files that are not in the codebase.
- Do not touch files outside the explicit allowed-write-paths list.
- Do not omit any of the three required output artifacts.

## OUTPUT CONTRACT

Produce THREE artifacts:
1. Iteration narrative markdown at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-002.md` (headings: Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension).
2. Canonical JSONL iteration record APPENDED (via `echo >>`) to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`, `"type":"iteration"` EXACTLY:
```json
{"type":"iteration","iteration":2,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-002","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. Per-iteration delta file at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-002.jsonl` (one `{"type":"iteration",...}` record plus per-finding/classification/traceability records, one JSON line each).

All three artifacts are REQUIRED.

## Context

- CWD: repo root (worktree, isolated from the main checkout)
- Active surface: Node.js CJS (launcher scripts)
- Acceptance criteria: three required artifacts produced; every P0/P1 has file:line evidence + claim-adjudication; no out-of-scope writes
