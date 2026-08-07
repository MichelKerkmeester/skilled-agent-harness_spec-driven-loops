# Research Synthesis: Skill-Advisor Parent-Hub Compatibility

## Verdict

Parent-hub compatibility should be fixed metadata-first, not scorer-first. The highest-confidence issue is that `deep-loop-workflows` still projects single-pass code-audit vocabulary while `sk-code` already owns code-review/audit routing; the scorer compensates with a hardcoded `code audit` bonus/penalty. Correct the parent-hub metadata, add guards that prevent recurrence, reindex and recapture baselines atomically, then remove scorer workarounds only after the ambiguity and ratchet gates pass.

## Priority Proposals

### 1. Correct Layer-1b Parent-Hub Vocabulary First

Proposal: move or narrow `code audit`, `iterative code audit`, and `severity weighted findings` out of the broad `deep-loop-workflows` advisor projection. Single-pass `code audit` belongs to `sk-code` code-review vocabulary; deep-loop should retain only review-loop vocabulary that carries loop/iteration/convergence semantics.

Evidence:
- `deep-loop-workflows` still projects `iterative code audit`, `severity weighted findings`, and `code audit` [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:70].
- `sk-code` already projects `code review`, `security review`, `quality gate`, `findings`, and `audit packet docs` [SOURCE: .opencode/skills/sk-code/graph-metadata.json:127].
- Scorer fusion compensates with `codeAuditCodeReviewBonus` and `codeAuditDeepReviewPenalty` on `code audit` prompts [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:593].

Migration contract:
- Metadata change first.
- Reindex skill graph and rebuild advisor projection.
- Run the 193-row scorer gate and the ambiguity slice.
- Only then evaluate whether `codeAuditDeepReviewPenalty` is redundant.

### 2. Split Vocabulary Authority Explicitly

Proposal: define three vocabulary classes.

- Metadata-owned: parent-hub mode aliases, user-facing mode names, and mode-specific nouns.
- Code-owned: slash-command bridges, syntax-specific anchors, and post-fusion disambiguators whose semantics depend on prompt shape.
- Guard-owned: cross-hub collisions and projection coverage failures.

Evidence:
- The explicit lane has hardcoded token/phrase boosts [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:18] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:101].
- The same lane also consumes projected `intentSignals` and keywords [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:321].
- The explicit lane clamps scores, so duplicated authority can saturate [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:340].

### 3. Add A Cross-Hub Vocabulary Collision Report

Proposal: extend the existing single-hub vocab guard with a workspace-level report:

`normalizedPhrase -> owningHub -> ownerMode -> intentClass -> sources -> projectedFields`

The report should flag only incompatible ownership collisions, not shared infrastructure terms. Examples of compatible shared terms: `workflowmode`, `backendkind`, `mode-registry`. Examples of incompatible shared terms: `code audit` owned by both `sk-code` single-pass review and `deep-loop-workflows` review-loop without loop qualifiers.

Evidence:
- Current guard is local to one `skillRoot` [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:263].
- It already collects registry aliases, hub keywords, trigger phrases, and intent signal owners [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:387].
- It detects same-hub alias collisions, but not cross-hub phrase ownership [SOURCE: .opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs:363].

### 4. Validate Advisor Projection Surface, Not Only Raw Metadata

Proposal: add a projection-surface guard that loads or constructs `SkillProjection` and validates every registry alias appears in at least one scorer-consumed field: `intentSignals`, `derivedTriggers`, `derivedKeywords`, `keywords`, or a documented exemption.

Evidence:
- Projection maps graph `intent_signals` to `intentSignals` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:231].
- Projection maps `derived.trigger_phrases` to `derivedTriggers` and `derived.key_topics`/entities/files/docs to `derivedKeywords` [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:213].
- Filesystem fallback must be covered too [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:639].

### 5. Expand The Ambiguity Slice With Cross-Hub Prompts

Proposal: after metadata correction, build a labeled cross-hub ambiguity set covering:

- `code audit` vs `deep review loop`.
- `design audit` vs `code audit`.
- `deep-loop-runtime` vs `deep-loop-workflows`.
- `sk-code review` vs read-only explanation prompts.

Feed only measured survivors into 007's frozen ambiguity slice recapture.

Evidence:
- Existing ambiguity gate freezes low-margin rows and holds live top-1 [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/scorer/ambiguity-slice.vitest.ts:5].
- Baseline ambiguity accuracy is 15/25 = 0.60 [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:30].
- Query-class routing is too coarse to distinguish all parent-hub modes by itself [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:121].

## Secondary Proposals

### 6. Atomic Reindex And Rebaseline Runbook

Recommended order:

1. Apply metadata and guard changes in a write-authorized branch.
2. Run skill graph scan/reindex.
3. Rebuild advisor artifacts.
4. Capture scorer baseline with projection source recorded.
5. Re-run ambiguity, holdout, bucket, parity, and ratchet gates.
6. If changed behavior is intended and non-regressive, recapture the ratchet baseline with fixture hashes.
7. Only then delete redundant scorer workarounds.

Evidence:
- Prior packet says pre-Layer-1b numbers are not comparable [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/001-scorer-saturation-root-fix/implementation-summary.md:104].
- Baseline stores corpus, holdout, and ambiguity hashes [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:3].
- Projection fallback now distinguishes SQLite failure from clean filesystem first-run [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:695].

### 7. Author `conflicts_with` Edges Conservatively

Criteria:

- The prompt family is measured as a recurring near-tie.
- The losing target is semantically opposed, not merely adjacent.
- The edge improves a labeled ambiguity/conflict slice without aggregate regressions.
- The edge has a documented owner and removal condition.

Evidence:
- `conflicts_with` has negative graph-causal mass [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:28].
- Negative edges do not expand [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts:118].
- RRF needs the conflict-rerank seam once conflict edges exist [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md:67].

### 8. Derive Command Bridges From Metadata

Proposal: replace literal bridge growth with a derived bridge table, using command metadata/registries as authority and preserving fixed bridge IDs for compatibility.

Evidence:
- Projection currently hardcodes command bridges [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:58].
- SQLite and filesystem projection both append the same bridges [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:620] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:692].
- Executor delegation already derives aliases from metadata and model profiles [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/executor-delegation.ts:17].

### 9. Add A Taxonomy Crosswalk Guard

Proposal: create a small explicit crosswalk between query classes, hub-router vocabulary classes, and eval buckets. Validate that each labeled eval bucket has expected owner classes, but do not fully derive one taxonomy from another.

Evidence:
- Query classes are coarse lane-multiplier categories [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:141].
- Hub-router classes are mode ownership vocabulary [SOURCE: .opencode/skills/sk-code/hub-router.json:38].
- Eval buckets are measurement slices [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json:36].

### 10. Prefer Semantic-Shadow Hygiene Over Weight Work

Proposal: keep `semantic_shadow` at the frozen weight and inspect mcp-* descriptions/embedding text for near-neighbor attractors. The target is reducing gold-`none` false fires without touching lane weights.

Evidence:
- 008 froze the lane at 0.05 after a net-negative full-corpus ablation [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46].
- Harmful flips were abstain false-fires to `mcp-chrome-devtools` [SOURCE: .opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:79].

## Recommended Implementation Order

1. Metadata correction for `deep-loop-workflows` vs `sk-code` code-audit ownership.
2. Cross-hub collision report and projection-surface guard.
3. Cross-hub ambiguity prompt set.
4. Skill graph reindex and advisor rebuild.
5. Ratchet and ambiguity recapture.
6. Evaluate deletion of `codeAuditDeepReviewPenalty` only after the corrected metadata routes cleanly.
7. Command bridge derivation.
8. Conservative `conflicts_with` authoring if measured prompts justify it.
9. Taxonomy crosswalk guard.
10. mcp-* semantic hygiene follow-up.

## Residual Risks

- Metadata correction may improve parent-hub behavior but move existing 193-row baseline counts; this is expected but must be recaptured explicitly.
- Cross-hub collision reports can become noisy unless shared infrastructure vocabulary is classified.
- Removing scorer workarounds too early can regress ambiguous prompts.
- `conflicts_with` edges are powerful negative evidence; bad authoring can suppress legitimate bundles.

## References

- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/_research-charter.md`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/derived.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/graph-causal.ts`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.ts`
- `.opencode/skills/sk-code/graph-metadata.json`
- `.opencode/skills/deep-loop-workflows/graph-metadata.json`
- `.opencode/skills/sk-design/graph-metadata.json`
- `.opencode/skills/deep-loop-runtime/graph-metadata.json`
- `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs`
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/routing-accuracy/scorer-eval-baseline.json`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/003-advisor-rrf-fusion/benchmark-results.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/007-eval-hardening/implementation-summary.md`
- `.opencode/specs/system-skill-advisor/016-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md`
