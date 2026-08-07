# CONFIRMATION REVIEW — Iteration 2 (Adversarial-Deep)

You are dispatched as the @deep-review LEAF agent. Iteration 1 surfaced only one P2 (P2-CONF-001: integration test does not exercise the memory_save commit-hook wiring end-to-end). The fast pass confirmed 41/42 closures cleanly.

## YOUR JOB — adversarial deep pass

Iter 1 was a sample-check. Iter 2 looks for issues sample-checking might have missed.

**Specifically attack:**

1. **memory_save cache wiring (lines 47, 180-182, 2583)** — read the entire post-commit branch around line 2583. Can the call site be reached when the commit FAILED but the response is still success? Is there a code path where invalidateEntityDensityCache fires WITHOUT a real DB mutation? Conversely: is there a commit success path that BYPASSES line 2583?

2. **memory_bulk_delete cache wiring (lines 149, 256)** — same questions. Two call sites: are they BOTH actually reachable? Does one of them dominate the other?

3. **safeGetDb warn-once (query-router.ts:92, 257)** — is the warn-once flag scoped at module level? If so, can two distinct DB-failure causes share the same warn and silently mask the second one? Is the flag ever reset on module re-import?

4. **Env-flag tightening (ADV-001)** — read the new isGraphChannelPreservationEnabled implementation and the new tests. Are there edge cases the new tests miss? E.g., whitespace (` 0 ` with surrounding spaces)? Numeric 00, 01? Multi-byte chars?

5. **Try/catch + zero fallback (memory-crud-health.ts:629-643)** — does the catch swallow distinguishable errors (network, type, permission) into a single zero-rate response, hiding diagnostic info that operators need? Should the fallback include the original error class in hints?

6. **routingReasons clamp (query-router.ts:89, 298, 348, 417)** — at 120 chars, does the clamp risk truncating a JSON-escaped reason mid-sequence (e.g., mid-Unicode-escape)? Does the existing test cover edge-case reason strings near the boundary?

7. **withFeatureFlag wire-up (query-router.vitest.ts)** — does the helper correctly restore env on async test exceptions? Or only on synchronous returns?

8. **Test fixtures (tests/__helpers__/test-env.ts)** — does the helper handle process.env mutation across worker boundaries? Or only within a single worker?

## OUTPUT

Standard 3 artifacts. If you find new P0/P1/P2, record. If everything passes adversarial scrutiny, return ratio ~ 0.0 with a confirmation note.

## REPO ROOT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 2 of 3
Dimension: adversarial-deep
Prior Findings: P0=0 P1=0 P2=1 (P2-CONF-001 only)
Dimension Coverage: [correctness,security,traceability,maintainability] (4/4 covered in iter 1)
Resource Map: 002 has no resource-map.md (not required)
Last 2 ratios: N/A -> 0.024
Stuck count: 0
Provisional Verdict: PASS hasAdvisories=true (1 P2)

Review Iteration: 2 of 3
Mode: review
Dimension: adversarial-deep
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation
Review Scope Files: 002-deep-review-remediation/{spec.md,plan.md,checklist.md,decision-record.md,implementation-summary.md}; memory-save.ts:47,180-182,2583; memory-bulk-delete.ts:8,27-41,149,256; query-router.ts (all 7 edit sites); entity-density.ts; routing-telemetry.ts; memory-crud-health.ts:629-643; tests/integration/entity-density-commit-hooks.vitest.ts; tests/__helpers__/test-env.ts
Prior Findings: P0=0 P1=0 P2=1

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
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-002.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-002.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-002.md` — this iteration's narrative markdown
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl` — append-only JSONL state log
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-002.jsonl` — this iteration's delta JSONL
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-strategy.md` — strategy.md (in-place updates only)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-findings-registry.json` — findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-002.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-002.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-002.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
