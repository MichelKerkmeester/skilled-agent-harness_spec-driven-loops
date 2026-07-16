DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (3 of 20)

## STATE

Iteration: 3 of 20
Dimension: security — hub tier
Prior Findings: read `review/deep-review-findings-registry.json` for the current cumulative count before starting — do not assume 0.
Review Target: .opencode/skills/system-deep-loop (hub tier: SKILL.md, mode-registry.json, hub-router.json, description.json, graph-metadata.json)

## READ FIRST

Read `review/deep-review-strategy.md` section 12 (Next Focus) and the LATEST iteration record(s) in `review/deep-review-state.jsonl` before starting — do not re-discover an already-registered finding as new; you may reference/reconfirm it if directly relevant, but only NEW findings belong in this iteration's `findingsNew`.

## THIS ITERATION'S FOCUS (hub tier, security)

The hub tier is mostly declarative JSON + routing prose, so the security surface is narrow but real. Check:
1. Does `SKILL.md`'s described routing logic ever construct a file path from unsanitized/unguarded input before loading it? (It should always guard via `_guard_in_skill`-style containment before any `load()`.) Read the routing rule text and hunt for any path where a classified mode string could escape the skill root or load an arbitrary file.
2. Does `hub-router.json` or `mode-registry.json` embed anything that looks like a credential, token, internal URL, or other secret? (Should be none — pure routing config — but confirm rather than assume.)
3. Do any of the hub's `allowed-tools` in `SKILL.md` frontmatter exceed what's actually needed by the routing logic described (over-broad tool grant is a real, if minor, security/blast-radius concern)?
4. Cross-check the `toolSurface` declarations in `mode-registry.json` for each mode against what `hub-router.json`/`SKILL.md` describe that mode doing — any mode granted a mutating tool (Write/Edit) it has no stated need for?

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-003.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-003.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-003.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-003.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-003.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":3,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-003","status":"complete","focus":"security-hub","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-003.jsonl` — the iteration record plus one line per finding.
