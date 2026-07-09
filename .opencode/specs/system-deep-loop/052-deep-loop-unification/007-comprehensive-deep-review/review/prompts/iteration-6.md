DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (6 of 20)

## STATE

Iteration: 6 of 20
Dimension: correctness — deep-research packet
Prior Findings: read `review/deep-review-findings-registry.json` for the current cumulative count before starting — do not assume 0.
Review Target: .opencode/skills/system-deep-loop/deep-research/ (146 files: SKILL.md, references/, assets/, scripts/, changelog/, README.md)

## READ FIRST

Read `review/deep-review-strategy.md` section 12 (Next Focus) and the LATEST iteration record(s) in `review/deep-review-state.jsonl` before starting — do not re-discover an already-registered finding as new; you may reference/reconfirm it if directly relevant, but only NEW findings belong in this iteration's `findingsNew`.

## THIS ITERATION'S FOCUS (deep-research packet, correctness)

This is the first of 4 iterations on `deep-research`. Read `SKILL.md` first for orientation, then sample across `references/` (especially `protocol/loop_protocol.md`, `state/state_format.md` if present) and any `scripts/` automation.

1. **Loop-protocol correctness**: does the documented state machine (init → loop → synthesis → save) match what any actual script/reducer code does, where scripts exist? Look for a described step that doesn't match its own reference doc's step numbering (this exact bug class was found and fixed in a sibling packet earlier this session — a "Step 5a" reference that should have said "Step 7a" — check for similar off-by-reference bugs here).
2. **State-format correctness**: if `state_format.md` or similar documents a JSON schema for research state, spot-check it against any actual config template file (e.g. `assets/deep_research_config.json` if present) — do the documented fields match the template's actual fields?
3. **Script logic** (if `scripts/` has real automation, not just config): read 1-2 of the most important scripts and check for obvious logic bugs (wrong comparison operator, off-by-one, unhandled edge case in a documented contract).
4. **Cross-reference correctness**: pick 3-5 markdown files under `references/`/`assets/` and confirm any internal links (`[text](./path.md)`) actually resolve to real files.

Budget: this is a large packet (146 files) — sample representatively rather than attempting exhaustive coverage, and say explicitly what you sampled vs. skipped.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-006.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-006.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-006.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-006.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-006.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":6,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-006","status":"complete","focus":"correctness-deep-research","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-006.jsonl` — the iteration record plus one line per finding.
