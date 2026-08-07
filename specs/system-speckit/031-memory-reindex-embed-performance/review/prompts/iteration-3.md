DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

This is a non-interactive review-iteration worker with NO human on the other end. Your write authority is ALREADY bound: you write ONLY the externalized state files listed under STATE FILES. Do NOT ask the Gate-3 question. Proceed directly and immediately.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch — read before any tool call)

Before doing any review work, write a `<pre-plan>` block with 4-5 ordered steps (dense): Input, Output, Acceptance criterion, Verification command per step. Then execute the plan.

# Deep-Review Iteration Prompt Pack

## STATE

Iteration: 3 of 10 | Cumulative findings: P0=0 P1=1 P2=0 | Iter 1 ratio=1.0, Iter 2 ratio=0.0
Focus (set by iteration 2): REQ-008 async-ingest `fromScan` fix verification, plus an exhaustive same-class-producer sweep.

Review Target: system-speckit/031-memory-reindex-embed-performance
Read prior iteration narratives first: `iteration-001.md` (P1-001 REQ-010 finding) and `iteration-002.md` (REQ-007 clean, 0 new findings) under `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/`. Do NOT re-review REQ-007 or REQ-010 this iteration unless this iteration's work incidentally surfaces new evidence.

## ITERATION 3 FOCUS — REQ-008 Async-Ingest + Same-Class Producer Sweep

1. Read `.opencode/skills/system-spec-kit/mcp-server/context-server.ts`'s `processFile` callback (the `memory_ingest_start` async worker, roughly the `initIngestJobQueue` block) and confirm `fromScan: true` is passed on BOTH the `governance` branch and the `provenance` branch.
2. Run `rg -n "fromScan" .opencode/skills/system-spec-kit/mcp-server --type ts` (excluding `dist/`) yourself and independently confirm: is `processFile` really the LAST caller of `indexSingleFile`/`indexMemoryFile` that was missing `fromScan: true`, or does this sweep turn up a caller the implementer's own claim (in implementation-summary.md) missed? Do not trust the implementer's inventory — reproduce it.
3. Read `.opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts`'s T47c and T47c-2 tests. Are these purely source-pattern regex assertions (checking the compiled/source text, not actual runtime behavior)? If so, is that an acceptable evidence standard for THIS class of fix (mirroring the existing T47d pattern for the earlier REQ-006 fix), or is it a real test-coverage gap that should be flagged as a finding?
4. Check `.opencode/skills/system-spec-kit/mcp-server/lib/ops/job-queue.ts`'s crash-recovery reset path (queued jobs replayed after restart) — does the replay path go through the SAME `processFile` callback (and thus inherit the fix), or does it have its own separate re-entry point that could bypass `fromScan: true`?

Record findings, then set Next Focus for iteration 4 (recommend: REQ-009's background-scan default at the MCP tool dispatch boundary in `tools/lifecycle-tools.ts` and `tool-schemas.ts` — verify the claimed internal-caller exemptions (CLI reindex in `cli.ts`, boot-time drift repair in `context-server.ts`) actually bypass the new default correctly by reading those call sites directly, not just trusting the implementer's claim).

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
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-003.md`
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-003.jsonl`
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, STOP that action and emit a finding instead under a `## SCOPE VIOLATIONS` heading, then continue.
- Use `echo '<single-line-json>' >> <path>` via a shell/bash tool for the JSONL append, not a patch/edit tool.

## Do's

- Verify every citation by reading the actual file — do not restate the implementer's claims as fact.
- Emit the `<pre-plan>` block before any code/file reading.
- Reproduce the implementer's own sweep commands (e.g. grep) rather than trusting the reported result.

## Don'ts

- Do not invent CLI flags, functions, or files that are not in the codebase.
- Do not touch files outside the explicit allowed-write-paths list.
- Do not omit any of the three required output artifacts.

## OUTPUT CONTRACT

Produce THREE artifacts:
1. Iteration narrative markdown at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-003.md` (headings: Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension).
2. Canonical JSONL iteration record APPENDED (via `echo >>`) to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`, `"type":"iteration"` EXACTLY:
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. Per-iteration delta file at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-003.jsonl` (one `{"type":"iteration",...}` record plus per-finding/classification/traceability records, one JSON line each).

All three artifacts are REQUIRED.

## Context

- CWD: repo root (worktree, isolated from the main checkout)
- Active surface: TypeScript (mcp-server)
- Acceptance criteria: three required artifacts produced; every P0/P1 has file:line evidence + claim-adjudication; no out-of-scope writes
