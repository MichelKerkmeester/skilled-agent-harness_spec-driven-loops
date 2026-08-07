DEEP-REVIEW
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; state_source=externalized_files; do_not_switch_mode=true

## Context

LEAF deep-review iteration agent, iteration 4 of 10, DIAGNOSTIC-ONLY (stop_policy=max-iterations -- do not converge early, do not recommend stopping). Read before writing:
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/deep-review-strategy.md` in FULL (Known Context D4 section, iterations 1-3 results)
  - `.opencode/skills/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` in full (functions `runBackfill`, `collectReviewFlags`)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` functions `deriveGraphMetadata`, `refreshGraphMetadataForSpecFolder`
  - `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/graph-metadata.json` and `description.json` (current content)
  - Sibling `.opencode/specs/deep-loops/032-goal-opencode-plugin/010-security-and-correctness-fixes/graph-metadata.json` (valid comparison)

D1-D3 already established: the malformed graph-metadata.json is an isolated legacy-format instance (D1); ownership is unverifiable-from-this-machine (D2); the phase's own handover.md is a coherent, buildable plan even though spec/plan/tasks/impl-summary are blank scaffolds (D3). Your dimension is **D4: blast radius of a metadata repair**. Seeded context: a prior `--dry-run` invocation of `backfill-graph-metadata.js --spec-folder <phase-009-folder> --dry-run` returned `{created:0, refreshed:1, existing:1, failed:[]}` with a confirmed-empty `git diff` afterward (dry-run never writes).

## Objective

1. Determine PRECISELY what a LIVE (non-dry-run) `refreshGraphMetadataForSpecFolder()` call would WRITE to `graph-metadata.json` for this phase, WITHOUT actually running it against the real file (you may write to a scratch/tmp copy of the folder if that is the only way to observe live-write behavior safely -- but if you do, it MUST be a copy outside the 009 phase folder, e.g. under `/tmp` or this review's own `review/` directory, and you MUST clean it up before finishing; NEVER run the live command with `--spec-folder` pointed at the real phase-009 path). Compare the derived output against: (a) what the current placeholder `description.json` says, (b) what the malformed `graph-metadata.json` currently claims (`Status: planned`, importance_tier: important), (c) the valid sibling `010/graph-metadata.json` shape.
2. Does a graph-metadata.json repair touch, read, or require modifying ANY of `spec.md`/`plan.md`/`tasks.md`/`implementation-summary.md`/`handover.md`? Trace the actual code path (does `deriveGraphMetadata` read those files for trigger_phrases/summary derivation -- if so, does it WRITE to them, or only READ them to populate the JSON?).
3. Is `description.json` (already valid JSON, placeholder content) at any risk from a graph-metadata-only repair? Confirm they are independent files/code paths.
4. Final verdict: is a metadata repair a PURE metadata-layer fix (safe, independent of who owns phase 009's substantive work), or does it carry ANY risk to phase 009's real authored content (handover.md) or to the ownership question from D2? State explicit recommendation: should an operator be free to run the live backfill regardless of the D2 ownership ambiguity, or should that decision wait?

## Style

Evidence-cited, CONFIRMED vs INFERRED explicit. Cite exact function names / line ranges for the derive-vs-write distinction.

## Tone

Terse, adversarial toward the seeded dry-run claim -- verify the actual derive/write code path yourself, do not just trust the dry-run summary counters.

## Audience

A senior engineer deciding whether a metadata repair is safe to greenlight independent of the D2 ownership question.

## Response

Produce THREE required artifacts:
1. `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/review/iterations/iteration-4.md` (Dimension D4, Files Reviewed, Findings by Severity, Traceability Checks, Verdict, Next Dimension -- note all 4 custom dimensions now have first-pass coverage; recommend a broadening/adversarial angle for iteration 5, e.g. re-challenge D1-D3 verdicts or dig into whether ANY sibling phase across the WHOLE repo (not just packet 032) shows a similar handover-only-no-scaffold pattern, to test generality).
2. Append one `"type":"iteration"` line (iteration:4, focus:"D4-repair-blast-radius", sessionId "rv-phase009-audit-20260701-184748", generation 1, lineageMode "new") to `review/deep-review-state.jsonl`.
3. `review/deltas/iter-004.jsonl`.

Update `review/deep-review-strategy.md` (D4 checkbox, RUNNING FINDINGS, NEXT FOCUS, FILES UNDER REVIEW) and `review/deep-review-findings-registry.json` in place. ALLOWED WRITE PATHS: only those 4 under `review/`, PLUS a scratch scaffold copy under `/tmp` or `review/scratch-d4/` IF you need one for objective 1 (you MUST delete it before finishing and confirm deletion in the narrative). BANNED: any write/rename/delete under the 009 phase folder outside `review/` (the real graph-metadata.json, description.json, and all canonical docs are READ-ONLY), and never run a live (non-dry-run) backfill/refresh command with `--spec-folder` pointed at the real phase-009 path. Record any near-violation as `scope_violation` in the narrative.

Target ~9-12 tool calls, 15-20 min. Every new P0/P1 needs claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, downgradeTrigger.
