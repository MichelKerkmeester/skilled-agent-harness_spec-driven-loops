DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (10 of 20)

## STATE

Iteration: 10 of 20
Dimension: correctness — deep-review packet
Prior Findings: read `review/deep-review-findings-registry.json` for the current cumulative count before starting — do not assume 0.
Review Target: .opencode/skills/system-deep-loop/deep-review/ (147 files: SKILL.md, references/, assets/, scripts/, changelog/, README.md)

## READ FIRST

Read `review/deep-review-strategy.md` section 12 (Next Focus) and the LATEST iteration record(s) in `review/deep-review-state.jsonl` before starting — do not re-discover an already-registered finding as new; you may reference/reconfirm it if directly relevant, but only NEW findings belong in this iteration's `findingsNew`.

## THIS ITERATION'S FOCUS (deep-review packet, correctness)

This is the first of 4 iterations on `deep-review` — the packet that ACTUALLY RAN the review loop you are executing right now (this comprehensive review is itself a live instance of deep-review's own machinery). This gives you an unusually direct way to cross-check: does what you are experiencing right now (state files, prompt pack shape, convergence behavior) match what this packet's own documentation claims?

1. **Self-consistency check**: read `references/protocol/loop_protocol.md` and `references/state/state_format.md` (or equivalents) and compare against the ACTUAL structure of `deep-review-state.jsonl`/`deep-review-config.json`/`deep-review-strategy.md` in THIS review's own `review/` folder (a sibling path: `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/`). Does reality match the documented schema? Any documented field that's actually absent, or an actual field that's undocumented?
2. **Convergence math correctness**: read `references/convergence/convergence.md` — do the documented formulas (rolling average, MAD noise floor, weighted composite) match what you'd expect from the actual convergence signals you've seen reported in this review's own `graph_convergence` events so far?
3. **Reducer correctness**: read `scripts/reduce-state.cjs` (or its logic description) — any obvious bug in how it aggregates findings/dimension coverage?
4. **Prompt-pack template correctness**: read `assets/prompt_pack_iteration.md.tmpl` — does it match what you're actually seeing rendered in prompts you've received this session (adjusting for the hand-driven orchestration this specific review uses)?

Budget: sample representatively across 147 files; say explicitly what you sampled vs. skipped.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-010.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-010.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-010.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-010.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-010.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":10,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-010","status":"complete","focus":"correctness-deep-review","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-010.jsonl` — the iteration record plus one line per finding.
