DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (8 of 20)

## STATE

Iteration: 8 of 20
Dimension: traceability — deep-research packet
Prior Findings: read `review/deep-review-findings-registry.json` for the current cumulative count before starting — do not assume 0.
Review Target: .opencode/skills/system-deep-loop/deep-research/

## READ FIRST

Read `review/deep-review-strategy.md` section 12 (Next Focus) and the LATEST iteration record(s) in `review/deep-review-state.jsonl` before starting — do not re-discover an already-registered finding as new; you may reference/reconfirm it if directly relevant, but only NEW findings belong in this iteration's `findingsNew`.

## THIS ITERATION'S FOCUS (deep-research packet, traceability)

1. **sk-doc template alignment**: run `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/system-deep-loop/deep-research --check` yourself (fresh, not from memory) and confirm it still passes with 0 errors, matching the templates in `.opencode/skills/sk-doc/create-skill/assets/skill/skill_md_template.md`. Report the exact output.
2. **README.md accuracy**: does it match the actual SKILL.md content and file layout?
3. **changelog/ currency**: does the latest changelog entry genuinely reflect the packet's current state (post any recent renames/trims this session)?
4. **Command/agent cross-reference**: does `.opencode/commands/deep/research.md` (or equivalent) correctly reference this packet's actual current file layout (no stale paths)?
5. **Internal cross-reference integrity**: pick a sample of `[text](./path)`-style links across `references/` and `assets/` and confirm they resolve.

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-008.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-008.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-008.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-008.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-008.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":8,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-008","status":"complete","focus":"traceability-deep-research","dimensions":["traceability"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-008.jsonl` — the iteration record plus one line per finding.
