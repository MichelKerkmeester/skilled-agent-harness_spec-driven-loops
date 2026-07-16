DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Review Iteration Prompt Pack (7 of 20)

## STATE

Iteration: 7 of 20
Dimension: security — deep-research packet
Prior Findings: read `review/deep-review-findings-registry.json` for the current cumulative count before starting — do not assume 0.
Review Target: .opencode/skills/system-deep-loop/deep-research/

## READ FIRST

Read `review/deep-review-strategy.md` section 12 (Next Focus) and the LATEST iteration record(s) in `review/deep-review-state.jsonl` before starting — do not re-discover an already-registered finding as new; you may reference/reconfirm it if directly relevant, but only NEW findings belong in this iteration's `findingsNew`.

## THIS ITERATION'S FOCUS (deep-research packet, security)

`deep-research` is notable for having WebFetch/WebSearch tool access (per the hub's own docs: "research has WebFetch") — this is the packet with the broadest external-facing tool surface among the 4, so security scrutiny matters more here than for the others.

1. **WebFetch/WebSearch usage guardrails**: does `SKILL.md` or its references document any guardrail around what URLs/domains are fetched, or is external fetch unconstrained? Is there a risk of fetching and blindly trusting untrusted external content into the research loop's state?
2. **Any script that shells out or executes external input**: read `scripts/` for anything that constructs a shell command, file path, or URL from research-loop-controlled data (e.g. a search query, a fetched page's content) — could untrusted external content influence a file write path or command?
3. **Secrets/credentials**: scan `assets/`/`references/` for anything resembling an API key, token, or credential that shouldn't be committed.
4. **allowed-tools scope**: does `SKILL.md`'s `allowed-tools` frontmatter match what the packet's actual described workflow needs, or is anything over-broad?

## SHARED DOCTRINE

Load `.opencode/skills/sk-code/code-review/references/review_core.md` before final severity calls.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.

## STATE FILES

- Config: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-config.json
- State Log: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deep-review-strategy.md
- Write iteration narrative to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/iterations/iteration-007.md
- Write per-iteration delta file to: .opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/review/deltas/iter-007.jsonl

## CONSTRAINTS

- LEAF agent, no sub-dispatch. Target 9 tool calls, hard max 13.
- Review target is READ-ONLY. Do not modify reviewed files. Report findings only, do not implement fixes.
- **ALLOWED WRITE PATHS**: `review/iterations/iteration-007.md`, `review/deep-review-state.jsonl` (append-only), `review/deltas/iter-007.jsonl`, `review/deep-review-strategy.md` (in-place), `review/deep-review-findings-registry.json` (in-place). All under `.opencode/specs/system-deep-loop/052-deep-loop-unification/007-comprehensive-deep-review/`.
- **BANNED**: rm, rm -rf, git rm, mv, sed -i, rmdir, find -delete, any write outside the allowed-write list.
- **SCOPE VIOLATION PROTOCOL**: if out of scope, STOP and emit a `## SCOPE VIOLATIONS` finding instead.
- Do not re-count an already-registered finding in this iteration's own findingsSummary.

## OUTPUT CONTRACT

Three required artifacts:
1. `review/iterations/iteration-007.md` — Dimension, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension.
2. Append to `review/deep-review-state.jsonl`, single-line JSON, `"type":"iteration"` exactly:
```json
{"type":"iteration","iteration":7,"mode":"review","target_agent":"deep-review","agent_definition_loaded":true,"resolved_route":"Resolved route: mode=review target_agent=deep-review","run":"run-007","status":"complete","focus":"security-deep-research","dimensions":["security"],"filesReviewed":["path:line"],"findingsCount":<n>,"findingsSummary":{"P0":<n>,"P1":<n>,"P2":<n>},"findingsNew":[],"traceabilityChecks":{},"newFindingsRatio":<0..1>,"sessionId":"2026-07-08T18:59:04.000Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```
3. `review/deltas/iter-007.jsonl` — the iteration record plus one line per finding.
