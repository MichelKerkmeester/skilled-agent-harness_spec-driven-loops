DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (2 of 20)

## STATE

Iteration: 2 of 20
Dimension: correctness — hub tier
Prior Findings: P0=0 P1=0 P2=0 (iteration 1 inventory found nothing; confirmed tree shape: hub=6 files, deep-research=146, deep-review=147, deep-improvement=458, deep-ai-council=129)
Review Target: .opencode/skills/system-deep-loop (hub tier this iteration: SKILL.md, mode-registry.json, hub-router.json, description.json, graph-metadata.json, README.md)

## READ FIRST

Read `review/deep-review-strategy.md` (especially section 12 Next Focus and section 13 Known Context) and the iteration-1 record in `review/deep-review-state.jsonl`. A prior packet this session already confirmed hub structural conformance (parent-skill-check.cjs, 34/34, 0 warnings) — do not re-check pure structure; focus on CORRECTNESS of what the hub actually claims and does.

## THIS ITERATION'S FOCUS (hub tier, correctness)

Read `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json`, `README.md` at `.opencode/skills/system-deep-loop/`. Look for genuine correctness bugs:

1. **Routing logic correctness**: does `SKILL.md`'s described routing rule actually match what `mode-registry.json` + `hub-router.json` contain? E.g., does every `workflowMode` mentioned in `SKILL.md` prose actually exist as a registered mode? Does the described three-tier discriminator (workflowMode/runtimeLoopType/backendKind) match the actual field values in `mode-registry.json` for every mode entry (especially the 4 improvement lanes claimed to share one packet with `runtimeLoopType: null`)?
2. **`hub-router.json` internal consistency**: do `routerSignals` keys really cover every registered `workflowMode`? Does `routerPolicy.tieBreak` really order every mode? Do all referenced vocabulary classes exist? (Re-verify with fresh eyes — don't just trust the earlier canon-checker's PASS; look for a LOGICAL bug the structural checker wouldn't catch, e.g. a signal that's syntactically present but semantically wrong/contradictory.)
3. **`description.json` accuracy**: does its description/trigger_phrases genuinely match what the hub does, or is anything stale/misleading (e.g. referencing a mode that no longer exists, or omitting one that does)?
4. **`README.md` accuracy**: does it describe the CURRENT state (post phase-006's asset renames, post the two-axis architecture), or does it contain any stale claim?
5. **Cross-file number/count consistency**: if any file states a count (e.g. "N modes", "N packets"), does it match reality?

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-002.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-002.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-002.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-002.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-002.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":2,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-002","status":"complete","focus":"correctness-hub","dimensions":["correctness"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-002.jsonl` — the iteration record plus one line per finding.
