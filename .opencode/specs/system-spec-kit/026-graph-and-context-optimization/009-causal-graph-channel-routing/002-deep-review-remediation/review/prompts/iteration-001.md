# CONFIRMATION REVIEW — 012/002 Deep-Review Remediation (Iteration 1 of 3)

You are dispatched as the @deep-review LEAF agent for a CONFIRMATION pass on packet `012/002-deep-review-remediation`. This is NOT a fresh deep review — the 10-iteration packet-level review already ran on 012/001 and produced `001-initial-delivery/review/review-report.md` with 42 findings (0 P0, 3 P1, 39 P2). Packet 012/002 claims to have CLOSED every one of them.

## YOUR JOB

Sample-check the 42 finding closures and look for NEW issues introduced by the 002 remediation. Specifically:

1. **Read `001-initial-delivery/review/review-report.md`** to see the 42 original findings and their file:line claims.
2. **Read `002-deep-review-remediation/implementation-summary.md`** which lists CLAIMED closures with file:line evidence.
3. **Spot-check 8-12 of the 42 claims** by reading the cited code lines. Pick a mix: 2-3 P1s (P1-C-001, P1-002, P1-003 — these are release-blocking), 6-8 P2s across different clusters (reliability, security, docs, tests).
4. **Look for NEW issues that the 002 changes introduced:**
   - Did any of the new code change semantics of `memory_save` / `memory_bulk_delete` in a way the existing tests don't cover?
   - Is the env-flag tightening (ADV-001) actually breaking any default-ON consumer?
   - Does the `try/catch + zero fallback` in `memory-crud-health.ts` silently hide errors that should be surfaced?
   - Is the `safeGetDb` warn-once helper threading state correctly?
   - Does the integration test ACTUALLY exercise the wiring (or just unit-test the helper)?
5. **Verify the spec-doc compliance:** does `002/implementation-summary.md` mark every finding CLOSED with a citable file:line? Any PENDING / ACCEPTED rows hidden in the table?

## OUTPUT

Follow the standard deep-review iteration contract (3 artifacts: iteration markdown + JSONL append + delta file).

- If you confirm closure with no new issues → record verdict PASS for this iteration, ratio reflects no new findings.
- If you find a new P0/P1/P2 → record it. Cluster as `confirmation-finding-NNN` or similar.
- If you confirm closure but spot a minor improvement opportunity → record as P2 advisory.

## REPO ROOT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

## CRITICAL CONSTRAINTS

- You are a LEAF agent — no sub-dispatches.
- Read-only on reviewed code; do NOT modify any source file.
- Cap tool calls at ~12 — don't read every cited line; sample wisely.
- Write findings to files (iteration narrative + JSONL append + delta file), NOT to your reply text.

---

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 3
Dimension: confirmation (combined-pass)
Prior Findings: P0=0 P1=0 P2=0 (fresh registry; closures from 012/001 review at 001-initial-delivery/review/review-report.md)
Dimension Coverage: [] (0/4)
Resource Map Coverage: 002 packet has no resource-map.md (not required at remediation tier)
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING

Review Iteration: 1 of 3
Mode: review
Dimension: confirmation
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation
Review Scope Files: 001-initial-delivery/review/review-report.md (PRIOR REVIEW — 42 findings to verify closed), 002-deep-review-remediation/spec.md, 002-deep-review-remediation/plan.md, 002-deep-review-remediation/checklist.md, 002-deep-review-remediation/decision-record.md, 002-deep-review-remediation/implementation-summary.md (CLAIMED closures), .opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts (lines 47, 180-182, 2583 — cache wiring), .opencode/skills/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts (lines 8, 27-41, 149, 256 — cache wiring), .opencode/skills/system-spec-kit/mcp_server/lib/search/query-router.ts (~20 edits), .opencode/skills/system-spec-kit/mcp_server/lib/search/entity-density.ts, .opencode/skills/system-spec-kit/mcp_server/lib/search/routing-telemetry.ts, .opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-health.ts (lines 629-643 — try/catch), .opencode/skills/system-spec-kit/mcp_server/tests/integration/entity-density-commit-hooks.vitest.ts (NEW), .opencode/skills/system-spec-kit/mcp_server/tests/__helpers__/test-env.ts (NEW)
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES

All paths are relative to the repo root.

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-001.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-001.md` — this iteration's narrative markdown
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl` — append-only JSONL state log
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-001.jsonl` — this iteration's delta JSONL
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-strategy.md` — strategy.md (in-place updates only)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-findings-registry.json` — findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-001.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-001.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-001.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
