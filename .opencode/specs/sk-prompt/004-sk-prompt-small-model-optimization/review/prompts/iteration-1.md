DEEP-REVIEW

# Deep-Review Iteration Prompt Pack — iter 1 of 20

## STATE

state_summary: First review iteration. The 114 packet has 6 implementation phases (002-006) shipped by codex gpt-5.5 high fast + sk-doc template alignment by main agent. Strict-validate green across all 7 children. Your job: surface drift, bugs, security issues, and quality problems that codex's self-review missed.

Review Iteration: 1 of 20
Mode: review
Dimension: **correctness** (1/4 — first of correctness/security/traceability/maintainability)
Review Target: sk-prompt/004-sk-prompt-small-model-optimization
Prior Findings: P0=0 P1=0 P2=0

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls (if it exists; if not, apply the standard P0=blocker, P1=required, P2=advisory rubric).

## REVIEW DIMENSIONS (4 total; iter 1 focuses on correctness)

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code (spec.md §3 Files to Change must match shipped files), checklist_evidence (checklist.md items must have evidence)
- **Overlay**: skill_agent (skill metadata matches docs), agent_cross_runtime (n/a for this packet)

## QUALITY GATES

evidence (every P0/P1 needs file:line citation), scope (findings must be within 114 packet scope), coverage (the 4 dimensions must be hit across iters; this iter handles correctness)

## VERDICTS

`FAIL | CONDITIONAL | PASS` — final verdict in synthesis, not per-iter.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs (file:line), counterevidenceSought (what would invalidate the finding), alternativeExplanation (could this be a non-issue?), finalSeverity, confidence (high/medium/low), and downgradeTrigger (what evidence would lower severity).

## STATE FILES

All paths relative to repo root.

- Config: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-config.json`
- State Log: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-state.jsonl`
- Findings Registry: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-findings-registry.json`
- Strategy: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deep-review-strategy.md`
- Write iteration narrative to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/iterations/iteration-001.md`
- Write per-iteration delta file to: `.opencode/specs/sk-prompt/004-sk-prompt-small-model-optimization/review/deltas/iter-001.jsonl`

## CONSTRAINTS

- LEAF agent (SWE-1.6 deep-review iter worker). No sub-agent dispatch. Soft max 12, hard max 13 tool calls.
- Review target is READ-ONLY. Do not modify reviewed files. Read-only across the entire 114 packet + cross-cutting files in .opencode/skills/{sk-small-model,cli-devin,cli-opencode,sk-prompt}/ + system-spec-kit/mcp_server/lib/deep-loop/ + AGENTS.md + CLAUDE.md + README.md.
- ALLOWED WRITE PATHS (ONLY):
  - `review/iterations/iteration-001.md` — this iter's narrative
  - `review/deep-review-state.jsonl` — append-only JSONL
  - `review/deltas/iter-001.jsonl` — this iter's delta
  - `review/deep-review-strategy.md` — strategy.md (in-place updates only)
  - `review/deep-review-findings-registry.json` — registry (in-place updates only)
- SCOPE VIOLATION PROTOCOL: if planning would require modifying any path outside the allowed-write list, STOP and emit as a `scope_violation` entry in the iter narrative under `## SCOPE VIOLATIONS`.

## ITERATION 1 FOCUS — CORRECTNESS

Read each phase's spec.md §3 Files to Change vs the actual filesystem state + implementation-summary's "Built" section. Look for:

1. **Files in spec.md §3 that DON'T exist on disk** (missing implementation)
2. **Files modified but NOT in spec.md §3** (scope creep)
3. **TS code in `system-spec-kit/mcp_server/lib/deep-loop/`** — read permissions-gate.ts, bayesian-scorer.ts, fallback-router.ts, post-dispatch-validate.ts; check:
   - Do they import real symbols from real files?
   - Are exported types referenced by their consumers (if any)?
   - Do default-deny code paths actually deny on every branch?
   - Does fallback-router actually check quota_pool before suggesting a target (rejecting same-pool)?
4. **Cross-references in `sk-small-model/references/pattern-index.md`** — every path listed in the table must exist on disk. Use Glob/Read to verify.
5. **agent-config recipe edits** — read `cli-devin/assets/agent-config-{deep-research-iter,deep-review-iter,synthesis}.json`. Confirm `verification_enabled: false`, `bayesian_scoring_enabled: false`, `fallback_chain: []` defaults are present. Confirm no schema-breaking changes (unknown fields rejected by Devin's strict parser per `feedback_codex_sandbox_blocks_network` notes).

Prior phase priorities (focus first):
- Phase 003 permissions-matrix (P0-criticality)
- Phase 004 cli-devin quality (largest scope, most new files)
- Phase 005 shared-intelligence (TS code + recipe edits)

Expected output: 3-7 findings at mixed severities. If you find 0 findings, that's also a valid signal (codex's work is clean on correctness dim) — emit a `clean_dimension` classification entry.

## OUTPUT CONTRACT (all 3 required)

1. **iteration-001.md** — Structure: `## Dimension`, `## Files Reviewed`, `## Findings by Severity (P0/P1/P2)`, `## Traceability Checks`, `## Verdict (per-iter)`, `## Next Dimension`. Each finding has claim + evidence + counterevidence-sought + alternative-explanation + final-severity + confidence + downgrade-trigger.

2. **state.jsonl APPEND** — single line, `"type":"iteration"`:
```json
{"type":"iteration","iteration":1,"mode":"review","run":"114-review-iter-1","status":"complete","focus":"correctness","dimensions":["correctness"],"filesReviewed":["..."],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{"spec_code":"partial","checklist_evidence":"deferred"},"newFindingsRatio":<0..1>,"sessionId":"114-deep-review-2026-05-18","generation":1,"lineageMode":"new","timestamp":"<ISO>","durationMs":<n>,"graphEvents":[]}
```
Append via reading the existing JSONL file then Writing it back with the new line, OR if your tooling supports it via the existing append semantics in the recipe. newInfoRatio for iter 1 should be high (0.5-0.9) since fresh ground.

3. **deltas/iter-001.jsonl** — multi-line: iter record + one record per finding (severity tagged) + optional classification records.

## EXECUTION

1. Pre-plan (5 sequential_thinking thoughts mandatory):
   a. Inventory the spec.md §3 file lists for each of the 6 phases.
   b. Glob the actual filesystem to compare against spec lists.
   c. Read the TS code files for correctness review (imports, type signatures, default-deny paths).
   d. Read pattern-index.md and verify each row's path exists.
   e. Compose findings + JSONL records.
2. Execute reads + writes.
3. Append JSONL + write delta. Stop.
