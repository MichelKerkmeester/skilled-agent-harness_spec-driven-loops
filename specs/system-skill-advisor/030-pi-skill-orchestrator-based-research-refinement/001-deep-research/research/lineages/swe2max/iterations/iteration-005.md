# Iteration 005 — Citation verification, edge-store check, cross-lineage agreement, gap closure

## Focus

Mechanical verification of every load-bearing citation in the synthesis claim set,
a direct check of the skill-graph edge store for RQ4's open question, the operator
denylist surface missed in iteration 4, and agreement/disagreement analysis against
the completed mimo lineage.

## Actions Taken

- Spot-opened ~40 cited line ranges across both codebases (sed range reads, content
  matched against the claims that cite them).
- Queried `runtime/database/skill-graph.sqlite` schema and edge counts.
- Read `runtime/lib/routing/route-exclusions.ts` (104 lines) — the operator denylist
  missed in the iteration-4 sweep.
- Read `lib/prompt-cache.ts`, `lib/skill-graph/metadata-sanitizer.ts`,
  `lib/metrics.ts:295-310`, `hooks/lib/directive-lifecycle-file-store.ts`,
  `lib/skill-graph/doc-frontmatter.ts:85-140`,
  `lib/cross-skill-edges/detect-inbound-enhances.ts`,
  `lib/scorer/lanes/explicit.ts:310-325`, `lib/scorer/fusion.ts:300-310,745-780`.
- Read the mimo lineage `research.md` (276 lines) for cross-lineage comparison.

## Findings

### F23 — All load-bearing citations verified in range and on-content [CONFIRMED]

Orchestrator: `search.ts:19-38` (score table: +200 name-exact, +80 prefix, +60/+35
substring, token bonuses 45/24/8/4), `:46` (`Math.max(1, Math.min(8, …||5))` clamp),
`:50` (`localeCompare` tie-break); `scope.ts:4-7` (all/profile/group union), `:96-118`
(five-line stub + "N lazy skill candidates are indexed"); `catalog.ts:5-13` (1024-char
ingestion slice), `:95-134` (`<available_skills>` recognizer), `:140-157`
(`replaceNativeSkillCatalog`), `:163-188` (broader refuse-to-delete detector);
`index.ts:281-326` (`before_agent_start` strip + warn-not-delete), `:590` (limit
schema 1..8), `:600-650` (limit default 5, `fallbackRootNames` authorize-on-match,
global path), `:666-696` (auto-fallback on zero active matches + explicit no-match
lines), `:716-746` (`disable-model-invocation` block + authorization gate +
`loadBundle`); `dependencies.ts:8-93` (negation guard, five conservative patterns,
DFS with cycles/missing, `isModelVisibleSkill` filter on auto edges);
`profiles.ts:61-68` (tmp+rename); `config.ts:45,138-139` (160 default, 0..240 clamp).

Advisor: `render.ts:79-85` (80/120/120 caps), `:101` (HYGIENE_DIRECTIVE), `:120-145`
(capText, sanitizeSkillLabel), `:377-395` (status/freshness gates), `:409-440`
(ambiguity two-label path, directives append); `skill-advisor-brief.ts:110-135`
(cap clamp), `:196-206` (absent→skipped, unavailable→degraded), `:250` (≤8
fingerprints), `:344-373` (nonLiveResult), `:407-427` (policy gate), `:486-504`
(subprocess fail → fail_open); `lane-registry.ts:8-29` (weights 0.42/0.28/0.13/
0.12/0.05 + shadow bm25), `:37-50` (env overrides); `subprocess.ts:45-54` (nine
error codes), `:303-321` (SQLITE_BUSY retry); `user-prompt-submit.ts:106-134`
(2500ms budget, 64KB clamp), `:136-145` (root anchor), `:303-345` (dedup), `:357-387`
(additionalContext + fail-open); `prompt-advisor.ts:8-10,60-69,129-152,164-191,
230-285`; `cli-fallback.ts:76-122` (250ms probe, retryable reasons), `:160-197`
(dual-root atomicity); `prompt-policy.ts:83-197`; `explicit.ts:317-321` (name
mention → score 1.0 in explicit lane, NOT a rank-1 pin); `fusion.ts:306,749-776`
(deterministic localeCompare tie-breaks); `doc-frontmatter.ts:89-139` (scalar parser
collects arbitrary keys — `disable-model-invocation` would parse today but is never
surfaced); `detect-inbound-enhances.ts:1-4`; `metrics.ts:295-310` (append-atomic
bounded JSONL); `prompt-cache.ts:10-13` (5-min TTL, 1000 entries).

### F24 — The skill graph's edge store is populated and typed [CONFIRMED]

`skill_edges(source_id, target_id, edge_type, weight, context)` with per-endpoint
indexes; live data: `depends_on` 3, `enhances` 20, `prerequisite_for` 5, `siblings`
32 over 15 `skill_nodes`. The store can physically back a `depends_on` derivation
assist or a bundle-shaped return — the earlier F14 conclusion stands: edges exist
and propagate score, but no code path returns them as a bundle. With only 3
`depends_on` edges on 15 skills, edge derivation is under-populated, which
strengthens the case for borrowing the orchestrator's conservative body-scan
detector (`dependencies.ts:23-38`) as an edge-authoring assist.

### F25 — The denylist is the advisor's only exclusion surface [CONFIRMED]

`route-exclusions.ts` loads a committed `route-exclusions.json` plus a fully
replacing gitignored `route-exclusions.local.json`, fail-safe to an empty set on
any read/parse failure (`route-exclusions.ts:59-99`). This is the orchestrator's
authorization-set concept reduced to its negative half: a static, operator-owned
denylist with no per-context positive scope. The orchestrator's profiles partition
the *catalog* per active context; the advisor's denylist removes skills globally.
No advisor mechanism produces a per-prompt-type candidate partition — the nearest
composition point is a soft family-preference weighting term.

### F26 — Cross-lineage agreement: convergent partition, one rank-level divergence [CONFIRMED]

The completed mimo lineage (10 iterations, `research.md`) independently reached the
same verdict partition: ADOPT bounded pull-recovery beside push (its F3-1/F9-1 ≈ my
F18/F19 analysis), the 5/8+160 output shape for any pull surface (F7-1), the
candidate-count line (F1-2 ≈ my stub finding F1), the explicit no-match line
(F4-3 ≈ my F15 silent-absence finding), `disable-model-invocation` surfacing
(F8-3 — my doc-frontmatter read confirms the parse slot exists at
`doc-frontmatter.ts:128` scalars collection); ADAPT scorer-backed pull (F3-2),
soft scope preference (F4-1 ≈ my F25 composition point), graph-health surfacing
(F5-3 ≈ my F24 edge-gap evidence); REJECT pull-replaces-push (F3-3 ≈ my F17/F15),
bundle-in-brief (F5-1 ≈ my F14), raw ranker import (F6-2 ≈ my F13), auth-set and
atomic-write transplants (F4-2/F8-1/F8-2 ≈ my F19/F22 property-equivalence
conclusion). Divergence: mimo ADOPTs a deadline race around the in-process Pi
advisor call (F9-2, overshoot risk INFERRED); my read confirms the Pi hook awaits
the handler with no race (`prompt-advisor.ts:243-250`) while the 2500ms budget is
only advisory inside it — same mechanism finding, I classify the fix ADOPT under a
budget-enforcement framing rather than mimo's "race" framing. Net: two independent
lineages agree on the mechanism partition; the residual disagreement is rank
ordering, not direction.

## Questions Answered

- RQ4 residual: edge store schema + counts confirmed (`depends_on` 3/15 — sparse).
- RQ3 residual: denylist mapped as the negative-half counterpart to scopes.
- Cross-lineage: agreement/disagreement recorded for synthesis.

## Questions Remaining

- None blocking synthesis. INFERRED items (precision gain from scope prior, overshoot
  risk on the Pi in-process call) carry their confirmation methods in the synthesis.

## Ruled Out

- Re-reading `user-prompt-submit.ts`/`render.ts` end-to-end: the range spot-checks
  covered every line the synthesis cites.
- `advisor-status`/`advisor-rebuild` handler reads: status surface referenced via
  ARCHITECTURE.md contract; internals don't change mechanism verdicts.
- Live `advisor_recommend` invocation: would write runtime state outside the
  lineage write surface; static evidence sufficient.

## Next Focus

Phase synthesis: `research.md` with RQ1-RQ7 answers and the ADOPT/ADAPT/REJECT
verdict table, `findings-registry.json`, `deep-research-dashboard.md`,
`resource-map.md`, terminal synthesis record with `stopReason: "maxIterationsReached"`.
