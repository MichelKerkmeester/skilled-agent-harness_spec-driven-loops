DEEP-REVIEW

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 6 of 10
Dimension: security (re-pass; iter-002 surfaced 1 P1 + 3 P2; focus on integration paths and remaining angles)
Prior Findings: P0=0 P1=3 P2=9
Dimension Coverage: correctness(2x), security(1x), traceability(1x), maintainability(1x) (4/4 covered, correctness re-passed)
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: CONDITIONAL hasAdvisories=true
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 1

Prior findings (consolidated):
- P1 (3 total): tests/search-flags.vitest.ts:75 drift; API key trim-only validation; iter-005 added 1 P1
- P2 (9 total): docstring/duplication issues on isCrossEncoderEnabled/isRerankerExpected; env-var-only integrity; missing security docs; traceability/maintainability suggestions

FOCUS for this security re-pass (iter-002 covered the surface — re-pass covers:
- Sidecar boundary: /rerank HTTP endpoint security (CORS, auth, rate-limit); whether localhost binding is enforced
- Confidence-scoring.ts side-effects: any timing-attack risk in the conditional penalty branch?
- Test file (scoring-opt-in.vitest.ts) — does it have any unsafe mocking patterns?
- Sidecar config files (allowlist, revision pins) — any env-var injection risk?
- Cross-encoder.ts as an unreviewed surface — security review of the HTTP provider plumbing

Review Iteration: 6 of 10
Mode: review
Dimension: security (re-pass: HTTP boundary + provider plumbing)
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc
Review Scope Files: lib/search/cross-encoder.ts + lib/search/pipeline/stage3-rerank.ts (unreviewed siblings) + lib/search/search-flags.ts + lib/search/confidence-scoring.ts + tests/scoring-opt-in.vitest.ts + system-rerank-sidecar/scripts/rerank_sidecar.py
Prior Findings: P0=0 P1=3 P2=9

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

- Config: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-config.json
- State Log: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-state.jsonl
- Findings Registry: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-findings-registry.json
- Strategy: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-strategy.md
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/iterations/iteration-006.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deltas/iter-006.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/iterations/iteration-006.md` — this iteration's narrative markdown
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-state.jsonl` — append-only JSONL state log
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deltas/iter-006.jsonl` — this iteration's delta JSONL
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-strategy.md` — strategy.md (in-place updates only)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-findings-registry.json` — findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/iterations/iteration-006.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/iterations/iteration-006.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/review/deltas/iter-006.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
