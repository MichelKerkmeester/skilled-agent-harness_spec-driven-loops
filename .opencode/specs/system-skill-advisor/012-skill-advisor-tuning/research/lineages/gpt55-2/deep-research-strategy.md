# Deep Research Strategy: Skill-Advisor Parent-Hub Compatibility

## Research Topic

Skill-advisor scorer parent-hub compatibility for `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning` and the documented scorer code under `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer`.

## Known Context

- Charter boundary: hard read-only; never edit advisor/scorer code, write only lineage artifacts [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md:3].
- Parent-hub priority: weight angles 1-5 first [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md:7].
- `resource-map.md` was not present at init for this lineage; coverage gate skipped.
- `deep-loop-workflows` graph metadata still projects `iterative code audit`, `severity weighted findings`, and `code audit` through derived triggers [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:70].
- `sk-code` graph metadata owns code review/audit/review-mode vocabulary on the code-review side [SOURCE: .opencode/skills/sk-code/graph-metadata.json:127].
- The scorer still carries a post-fusion `code audit` bonus/penalty seam [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:593].
- The projection reads SQLite skill nodes plus six hardcoded command bridges, and filesystem fallback appends the same bridges [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:620].
- Existing eval hardening baseline: ambiguity slice 15/25, tau 0.03, weakest measured accuracy 0.60 [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:30].
- Semantic-shadow freeze evidence: full 149/193 vs disabled 150/193, with false-fires to `mcp-chrome-devtools` [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46] [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79].

## Key Questions

1. Which code-audit/deep-review vocabulary belongs to `sk-code` vs `deep-loop-workflows`?
2. Which vocabulary belongs in graph metadata vs hardcoded scorer boosts?
3. How should cross-hub collisions be detected without flagging legitimate shared infrastructure terms?
4. How should projection coverage include `intent_signals` and `derived.key_topics`, not only `derived.trigger_phrases`?
5. Which ambiguous prompt set should guard hub-vs-mode routing quality?
6. What atomic reindex/rebaseline order avoids native-ABI and ratchet false failures?
7. When are `conflicts_with` edges justified?
8. How should command bridges be derived from metadata instead of projection literals?
9. How should query-class, hub-router, and eval-bucket taxonomies stay aligned?
10. What semantic-shadow hygiene is cheaper than lane-weight work?

## Answered Questions

- `code audit`, `iterative code audit`, and `severity weighted findings` should not stay projected from the parent deep-loop hub as generic deep-loop vocabulary. They should be either `sk-code` code-review vocabulary or explicit deep-review loop vocabulary only when the prompt indicates iteration/convergence.
- `TOKEN_BOOSTS` and `PHRASE_BOOSTS` should keep global syntax, slash-command, and cross-skill disambiguation behavior; parent-hub mode aliases should be metadata-owned and reindex-refreshable.
- The existing parent-hub vocab guard is a good single-hub primitive but lacks a workspace-level cross-hub owner map.
- Projection coverage must evaluate the `SkillProjection` fields the scorer consumes: `intentSignals`, `derivedTriggers`, and `derivedKeywords`.
- Ambiguous prompts should be measured as labeled cases, then recaptured into 007's ratcheted ambiguity slice only after metadata correction.

## What Worked

- Reading `graph-metadata.json`, `hub-router.json`, and `mode-registry.json` together exposed ownership drift that direct scorer reads alone would hide.
- The prior 007/008 packets provided measured guardrails, preventing speculative lane-weight recommendations.
- The existing `buildExecutorAliasTable` pattern is a strong precedent for deriving routing aliases from metadata with cache/filter boundaries.

## What Failed

- Searching only scorer code over-emphasizes hardcoded fixes and under-emphasizes metadata as the real authority.
- Treating every shared normalized phrase as a collision is too noisy; shared infrastructure terms require an intent-class allowlist.
- Re-litigating semantic-shadow weight is counterproductive because 008 already measured and froze it.

## Exhausted Approaches

- Delete `codeAuditDeepReviewPenalty` first: rejected until metadata is corrected and baseline recaptured.
- Move all explicit phrase boosts into metadata: rejected because command and post-fusion discriminators still need code-owned behavior.
- Broaden `conflicts_with` to all siblings: rejected because sibling overlap is not negative routing evidence.
- Use aggregate 193-row top-1 as the only gate: rejected because 007 proves contested prompts need their own slice.

## Ruled-Out Directions

- Production scorer edits in this lineage.
- Graph metadata edits in this lineage.
- Semantic-shadow weight changes without a new measured PROVE branch.
- Direct re-baseline before parent-hub metadata correction.

## Next Focus

Ready for implementation planning in a separate write-authorized lineage: parent-hub metadata correction, cross-hub collision/projection guard additions, then atomic reindex and ratchet recapture.

## Non-Goals

- No edits to `.opencode/skills/system-skill-advisor/mcp_server`.
- No edits to skill graph metadata or parent hubs.
- No command execution that mutates advisor DBs, embeddings, scorer baselines, or skill graph artifacts.

## Stop Conditions

- Stop after exactly 10 iterations per `config.stopPolicy=max-iterations`.
- Treat convergence before iteration 10 as telemetry only.
- Synthesize read-only proposals with source citations.
