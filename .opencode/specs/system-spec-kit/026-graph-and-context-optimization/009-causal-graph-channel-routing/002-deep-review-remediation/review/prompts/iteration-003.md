# CONFIRMATION REVIEW — Iteration 3 (Final Sweep)

You are dispatched as the @deep-review LEAF agent for the LAST pass of the 012/002 confirmation review.

Iter 1 (sample-check): 1 P2 found, 41/42 original findings confirmed CLOSED.
Iter 2 (adversarial-deep): 3 P2 found, 6 attacks ruled out.
Total so far: 4 P2 advisories. 0 P0, 0 P1.
Rolling-avg ratio: 0.049 (below 0.08 stop threshold). All 4 dimensions covered.

## YOUR JOB

This is a final sweep + verdict-assembly pass.

1. **Read** the 4 P2 findings (P2-CONF-001, P2-ADV-001, P2-ADV-002, P2-ADV-003) from `deep-review-findings-registry.json`.
2. **Dedup scan:** are any two of these the same root cause? (e.g., P2-ADV-001 + P2-ADV-002 both involve error-classification masking)
3. **Severity escalation scan:** any P2 that should be elevated to P1 given the cumulative picture?
4. **Final verdict:** PASS / CONDITIONAL / FAIL with rationale tied to the actual finding mix.
5. **One last attack:** look for any issue ALL prior iters missed. The 002 packet introduced commits to 6 source files + 3 new test files. Are there any cross-file consistency issues? (E.g., did the env-flag tightening introduce a behavior the cache wiring assumes is still permissive?)
6. **Synthesis prep:** write the iteration narrative as a CONFIRMATION VERDICT REPORT including: which of the 42 original findings you sampled and confirmed CLOSED, the 4 new P2 advisories, and your final verdict for the 002 packet.

## OUTPUT

Standard 3 artifacts. The iteration markdown should be more thorough this pass (it's the synthesis input).

## REPO ROOT
/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public

---

# Deep-Review Iteration Prompt Pack

This prompt pack renders the per-iteration context for the `@deep-review` LEAF agent (native executor) or a CLI executor (e.g. `codex exec`). Tokens use curly-brace syntax and are substituted by `renderPromptPack` before dispatch.

## STATE

STATE SUMMARY (auto-generated):
Iteration: 3 of 3 — final sweep
Prior Findings: P0=0 P1=0 P2=4 (P2-CONF-001, P2-ADV-001, P2-ADV-002, P2-ADV-003)
Dimension Coverage: [correctness,security,traceability,maintainability] (4/4)
Last 2 ratios: 0.024 -> 0.073 (rolling-avg 0.049, below 0.08 threshold)
6 attacks RULED OUT in iter 2 (commit failure, dual-site dominance, Unicode clamp, async withFeatureFlag, cross-worker env, whitespace flag parsing)
Convergence: ACHIEVED
Provisional Verdict: PASS hasAdvisories=true (4 P2)

Review Iteration: 3 of 3
Mode: review
Dimension: final-sweep
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation
Review Scope Files: all 002 packet files + 7 source files touched + 4 test files (focus: dedup, severity escalation, final-verdict assembly)
Prior Findings: P0=0 P1=0 P2=4

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
- Write iteration narrative to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-003.md
- Write per-iteration delta file to: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-003.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 9 tool calls. Soft max 12, hard max 13.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- **ALLOWED WRITE PATHS (the ONLY paths you may create, modify, or append to)**:
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-003.md` — this iteration's narrative markdown
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl` — append-only JSONL state log
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-003.jsonl` — this iteration's delta JSONL
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-strategy.md` — strategy.md (in-place updates only)
  - `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-findings-registry.json` — findings registry (in-place updates only)
- **BANNED OPERATIONS (NEVER execute against any path)**: `rm`, `rm -rf`, `git rm`, `mv`, `sed -i` (including `sed -i ''`), `rmdir`, `find ... -delete`, shell output-redirect truncate `>` against any file not in the allowed-write list, and any tool call whose effect is to delete, rename, or replace a file outside the allowed-write list. Reading is unrestricted; **writing, renaming, and deleting are scoped**.
- **SCOPE VIOLATION PROTOCOL**: if your plan would require modifying any path NOT in the allowed-write list, you MUST STOP that action and emit a finding instead. Record the would-be mutation as a `scope_violation` entry in the iteration narrative (under a `## SCOPE VIOLATIONS` heading) and continue the review. NEVER execute the out-of-scope mutation. The review packet (`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-003.md` directory and parents) is the only zone for your writes; the reviewed target spec/code is off-limits.
- Append JSONL record with dimensions, filesReviewed, findingsSummary, findingsNew, traceabilityChecks, newFindingsRatio, and optional graphEvents.
- When emitting the iteration JSONL record, include an optional `graphEvents` array of `{type, id, label, relation?, source?, target?}` objects representing coverage graph nodes and edges discovered this iteration. Omit the field when no graph events are produced.

## OUTPUT CONTRACT

You MUST produce THREE artifacts per iteration. The YAML-owned post_dispatch_validate step emits a `schema_mismatch` conflict event if any is missing or malformed.

1. **Iteration narrative markdown** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/iterations/iteration-003.md` (path pre-substituted for the current iteration number). Structure: headings for Dimension, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension.

2. **Canonical JSONL iteration record** APPENDED to `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl`. The record MUST use `"type":"iteration"` EXACTLY — NOT `"iteration_delta"` or any other variant. The reducer counts records where `type === "iteration"` only; other types are silently ignored. Required schema:

```json
{"type":"iteration","iteration":<n>,"mode":"review","run":"<run-id>","status":"complete","focus":"<dimension-or-focus>","dimensions":["..."],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"<session-id>","generation":<n>,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[/* optional */]}
```

Append via single-line JSON with newline terminator — e.g. `echo '<single-line-json>' >> /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deep-review-state.jsonl`. Do NOT pretty-print. Do NOT print to stdout only; it MUST land in the state log file.

3. **Per-iteration delta file** at `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/009-causal-graph-channel-routing/002-deep-review-remediation/review/deltas/iter-003.jsonl` (path pre-substituted — e.g. `deltas/iter-001.jsonl`). This file holds the structured delta stream for this iteration: one `{"type":"iteration",...}` record (same as the state-log append) plus per-event structured records (one per graphEvent, finding, classification, traceability-check, ruled_out direction). Each record on its own JSON line.

Example delta file contents (one review iteration):
```json
{"type":"iteration","iteration":3,"mode":"review","run":"run-001","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["path/to/file.ts:42"],"findingsCount":7,"findingsSummary":{"P0":0,"P1":2,"P2":5},"findingsNew":[],"newFindingsRatio":0.41,"sessionId":"session-001","generation":1,"lineageMode":"new","timestamp":"2026-04-30T00:00:00Z","durationMs":120000,"graphEvents":[]}
{"type":"finding","id":"R3-P1-001","severity":"P1","cluster":"...","file":"path:line","title":"...","iteration":3}
{"type":"classification","detail":"...","iteration":3}
{"type":"ruled_out","direction":"...","reason":"...","iteration":3}
```

All three artifacts are REQUIRED. The post_dispatch_validate step fails the iteration if any artifact is missing, malformed, or if the state-log append uses the wrong record type (`iteration_delta` etc.).
