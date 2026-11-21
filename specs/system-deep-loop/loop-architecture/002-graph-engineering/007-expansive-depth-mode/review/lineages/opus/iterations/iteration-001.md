# Iteration 001 - Frontier node F-1-001: correctness

## Dispatcher
- Lineage: opus (fan-out), session fanout-opus-1795201537192-sq1ivw, generation 1
- Frontier node: F-1-001 (depth 1), dimension correctness
- Sources read before work: lineage steer.md (absent), deep-review-config.json, frontier block for F-1-001

## Files Reviewed
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:27-45, 162-360 (passEvidence, readTimedToolEvents, readLineageCommits)
- .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:95-145, 295-330
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts:282-298
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:832-895, 4398, 4924, 5110-5190
- .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:93-96
- .skilled/skills/system-deep-loop/runtime/scripts/synthesis-closeout.cjs:290-306
- .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pass-evidence.vitest.ts:55-70
- .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-lineage-config.vitest.ts:1-56

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Claude pass timing rests on a `timestamp` key no captured stream-json log shows** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:207 -- `readTimedToolEvents` times a claude pass only from a top-level `timestamp` on `assistant`/`user` stream-json events (lines 207-209). When that key is absent the function returns null for the whole log and every claude pass reads `toolCalls:null`, `unexamined:null`, so `flaggedPasses` stays null for every claude lineage. The only claude evidence for the key is the unit fixture, which adds it by hand (fanout-pass-evidence.vitest.ts:69). Every claude lineage log in the repository predates the stream-json switch and is plain text, so nothing on disk confirms the real CLI emits it.
   Finding class: cross-consumer
   Scope proof: readTimedToolEvents is the only timing source for passEvidence and readLineagePassSummary (fanout-salvage.cjs:186-215, 260-275)
   Affected surface hints: fanout-salvage.cjs readTimedToolEvents claude branch; fanout-pass-evidence.vitest.ts fixture; fanout-run.cjs progress row at :2400
   Case: a claude-opus lineage runs with --output-format stream-json and its assistant events carry no top-level timestamp, so its progress row shows flagged passes unknown on every pass. This rests on inference. One captured real stream-json log would confirm or clear it.

2. **The runner writes the lineage block only after the lineage exits, so a resumed research lineage scopes its events under a second lineage id** -- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4924 -- `writeLineageValues` runs after the lineage process ends (comment at :4923), so every event the lineage wrote during its run took `lineageId` from the model's config, which the template leaves with `parentSessionId:null` (workflow-steps.cjs:95, synthesis-closeout.cjs:302 fall back to the session id). A later attempt of the same label reuses that config's session id because it is not complete (fanout-run.cjs:839-853), and from then on `parentSessionId` is the root session. Events from the second attempt carry `lineageId=<root session>` and events from the first carry `lineageId=<lineage session>`, all in one ledger. Review configs are unaffected, because review scope uses sessionId only (synthesis-closeout.cjs:300).
   Finding class: cross-consumer
   Scope proof: lineageId is derived from parentSessionId in workflow-steps.cjs:95 and synthesis-closeout.cjs:302-305; the config is rewritten only at fanout-run.cjs:4924
   Affected surface hints: fanout-run.cjs writeLineageValues timing; workflow-steps.cjs extend-research scope; synthesis-closeout.cjs runScope
   Case: a research lineage times out on attempt 1 with a non-complete config, the runner rewrites parentSessionId to the root session, and attempt 2's run_extended or closeout event is scoped to a different lineageId than attempt 1's events. Whether the gateway or the merge treats that as a break was not confirmed (inference).

## Traceability Checks
- None run this iteration; spec_code and checklist_evidence are queued for the traceability pass.

## Integration Evidence
- fanout-run.cjs:5129 checkLineageCompletion and :5168 checkLineageTimestampWindow both read the projected state rows, where review iteration rows carry the gateway time as `timestamp` and the model's stamp as `claimedTimestamp` (deep-review-state-contract.ts:290-295). The window check judges `claimedTimestamp` when present (lineage-timestamp-window.ts:101-103), and the completion check does too (:313). The F-1-001 timestamp question is answered: yes, for both checks.
- readLineageCommits reads the review frame's `data.record`, which holds the model's own stamp, so skew compares the model claim with the gateway commit (fanout-salvage.cjs:335-348).

## Edge Cases
- A model that leaves `timestamp` off its iteration record gets no `claimedTimestamp`, so the window check judges the gateway clock and always passes. This is by design: only a stamp the model wrote is a claim. Recorded, not raised.
- The stale-terminal check uses the terminal row's gateway `timestamp` (lineage-timestamp-window.ts:301), which is correct, because a terminal event is the workflow's row rather than a model claim.

## Confirmed-Clean Surfaces
- batched_commit rule: a single shell call that commits two records starts before the first commit, so the second window counts zero calls and is flagged (fanout-salvage.cjs:241-252). Correct.
- PASS_COMMIT_STEM_PATTERN matches the review stem `deep_review.iteration_recorded` (fanout-salvage.cjs:35, deep-review-state-contract.ts:282).

## Ruled Out
- Skew always being zero for review frames: ruled out, because the frame keeps the model's record stamp (deep-review-state-contract.ts:290-295 projects; the frame itself holds `record.timestamp`).
- Generation mismatch from the runner rewrite: no consumer in fanout-merge.cjs reads config generation (grep returned no hits), so it is not raised.

## Next Focus
- Dimension: security
- Focus area: F-1-001, the same three files (log parsing of untrusted lineage stdout, config rewrite path)
- Reason: the frontier node's next uncovered dimension
- Rotation status: F-1-001 correctness done
- Required evidence: file:line for any input that the runner trusts from lineage output

Review verdict: PASS
