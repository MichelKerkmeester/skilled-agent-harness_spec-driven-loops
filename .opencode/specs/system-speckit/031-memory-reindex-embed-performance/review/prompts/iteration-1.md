DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## GATE 3 PRE-RESOLVED — AUTONOMOUS NON-INTERACTIVE DISPATCH (do not halt)

This is a non-interactive review-iteration worker with NO human on the other end. Your write authority is ALREADY bound: you write ONLY the externalized state files listed under STATE FILES (the iteration file, its JSONL delta, and the strategy file) — never source, never docs elsewhere. The repository documentation gate ("Gate 3") is ALREADY SATISFIED for this run by that bound state directory. Do NOT ask the Gate-3 question, do NOT stop to request a documentation choice — no answer will ever arrive. Proceed directly and immediately with the review iteration defined below.

## PRE-PLAN REQUIREMENT (MiniMax-M3 dispatch — read before any tool call)

Before doing any review work, write a `<pre-plan>` block with 4-5 ordered steps (dense). Each step MUST include: Input (what this step receives), Output (what this step produces), Acceptance criterion (the exact condition that proves the step is done), and Verification command (the shell/grep/read command that checks it). Then execute the plan.

# Deep-Review Iteration Prompt Pack

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 10
Dimension: correctness (inventory pass first)
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: none (0/4)
Traceability: core=pending overlay=notApplicable(2)/pending(1)
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 10
Mode: review
Dimension: correctness (inventory pass first)
Review Target: system-speckit/031-memory-reindex-embed-performance
Review Scope Files:
- .opencode/skills/system-spec-kit/mcp-server/handlers/memory-save.ts
- .opencode/skills/system-spec-kit/mcp-server/context-server.ts
- .opencode/skills/system-spec-kit/mcp-server/tests/handler-memory-index.vitest.ts
- .opencode/skills/system-spec-kit/mcp-server/tests/context-server.vitest.ts
- .opencode/bin/lib/launcher-ipc-bridge.cjs
- .opencode/bin/mk-spec-memory-launcher.cjs
- .opencode/bin/lib/launcher-session-proxy.cjs
- .opencode/bin/lib/model-server-supervision.cjs
- .opencode/bin/mk-skill-advisor-launcher.cjs
- .opencode/skills/system-spec-kit/mcp-server/tools/lifecycle-tools.ts
- .opencode/skills/system-spec-kit/mcp-server/tool-schemas.ts
- .opencode/skills/system-spec-kit/mcp-server/tests/launcher-session-proxy.vitest.ts
- .opencode/skills/system-spec-kit/mcp-server/tests/launcher-ipc-bridge-probe.vitest.ts
- .opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts
- .opencode/skills/system-spec-kit/mcp-server/tests/lifecycle-tools-scan-default.vitest.ts
- .opencode/skills/system-spec-kit/mcp-server/tests/embedders/launcher-model-server-cross-launcher.vitest.ts

Canonical spec docs for context (read-only, do not modify): spec.md (REQ-001..011), plan.md (Phase 1-5 architecture, FIX ADDENDUM: AFFECTED SURFACES table), tasks.md (T001-T047 with evidence), checklist.md (CHK-001..079 with evidence), implementation-summary.md (What Was Built / Key Decisions / Verification / Known Limitations).

Prior Findings: P0=0 P1=0 P2=0

## PIVOT LINEAGE

none yet

Swept or saturated review directions that MUST NOT be re-entered:
none yet

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review-core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS`, PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## ITERATION 1 FOCUS

This is the first iteration. Do the inventory pass PLUS begin correctness review on the highest-risk file:
1. Build an artifact map across all 16 scope files above: file type, LOC, and which REQ item(s) it belongs to (REQ-006, or one of REQ-007/008/009/010/011).
2. Read `.opencode/bin/mk-spec-memory-launcher.cjs` in full (or at minimum the `buildOwnerLease`, `acquireOwnerLeaseFile`, `refreshOwnerLeaseFile`, `clearOwnerLeaseFile`, `readParentPid`, `classifyOwnerLease` functions plus the `respawnAfterDeadSocket` fallback around line 940-950) and independently verify the REQ-010 leaseId-fencing claim: does the immediately-before-unlink re-validation actually close the described TOCTOU race, or is there a flaw? Treat this as a hypothesis, not a fact.
3. Also read `.opencode/skills/system-spec-kit/mcp-server/tests/launcher-spec-memory-lifecycle.vitest.ts`'s new interleaving test and verify it would actually fail without the fix (i.e., is it a real regression test or does it vacuously pass?).
4. Record findings for anything wrong, and set Next Focus for iteration 2 (recommend continuing correctness review into REQ-007's probe-collapse files: `launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs`, and the `bridgeStdioThroughSessionProxy` passthrough in `mk-spec-memory-launcher.cjs`).

## STATE FILES

All paths are relative to the repo root.

- Config: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-config.json
- State Log: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-001.md
- Write per-iteration delta file to: .opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-001.md`
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl` (append-only)
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-001.jsonl`
  - `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-strategy.md` (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- Use `echo '<single-line-json>' >> <path>` via a shell/bash tool for the JSONL append, not a patch/edit tool that matches existing content — the state log is append-only and may be read concurrently.

## Do's

- Stay strictly within the allowed-writes scope (list affected files explicitly).
- Use only documented, real CLI flags, functions, and file paths — verify every citation by reading the actual file.
- Satisfy every acceptance criterion in your pre-plan exactly as stated.
- Emit the `<pre-plan>` block before any code/file reading.
- Treat the implementer's own claims (in Known Context / implementation-summary.md) as hypotheses to verify, not facts to restate.

## Don'ts

- Do not invent CLI flags, functions, or files that are not in the codebase.
- Do not touch files outside the explicit allowed-write-paths list.
- Do not replace findings with prose disclaimers or "you could also..." alternatives.
- Do not omit the `## Verification` section or any of the three required output artifacts.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The orchestrator emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/iterations/iteration-001.md`. Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY. Required schema:

```json
{"type":"iteration","iteration":1,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-001","status":"complete","focus":"<dimension-or-focus>","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"findingDetails":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"20260723-160812-031-hardening-review","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append via `echo '<single-line-json>' >> <path>`. Do NOT pretty-print. It MUST land in the state log file, not just stdout.

3. **Per-iteration delta file** at `.opencode/specs/system-speckit/031-memory-reindex-embed-performance/review/deltas/iter-001.jsonl`. One `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

All three artifacts are REQUIRED.

## Examples

Output shape: a `<pre-plan>` block (dense, 4-5 steps), then the artifact map, then findings organized by severity with file:line evidence, then the three required output artifacts, then a `## Verification` section listing the exact grep/read commands used to confirm each finding.

## Context

- CWD: repo root (worktree, isolated from the main checkout)
- Active surface: Node.js/TypeScript (mcp-server) + Node.js CJS (launcher scripts)
- Files in scope: the 16 files listed above under Review Scope Files (read-only)
- Acceptance criteria: three required artifacts produced; every P0/P1 finding has file:line evidence and a claim-adjudication block; no out-of-scope writes attempted
