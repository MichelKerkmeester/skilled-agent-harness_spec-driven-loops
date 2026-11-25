# Iteration 13: Consolidation — duplicate check, fix order, and the parent-level edits (synthesis pass)

**Iteration**: 13 of 13
**Focus**: Consolidate the twelve prior iterations into a ranked, deduplicated finding set; identify the parent-level edits that settle more than one finding; and reconcile the delta finding count with the reducer's registry.

## Focus

The final iteration does no new external research. It reads the packet's own artifacts — the forty delta finding rows, the reducer registry and the two frontier answers — and produces the consolidated view the synthesis will use: duplicates merged, severity ranked, fix order named, and the count reconciled.

## Actions Taken

1. Counted the `type:"finding"` rows across all twelve delta files (40) and the reducer registry's `keyFindings` (45).
2. Grouped the registry's findings by iteration and identified the five extras.
3. Grouped all forty findings by the phase their sources name and by severity.
4. Identified the findings that share one root cause and one parent edit.
5. Read the two frontier answers and the strategy's resolved-question list.

## Findings

1. **P0 — One parent decision closes both P0 findings and one P1 duplicate: drop phase 001's `SCHEMA_VERSION` bump and carry `actor` as a JSON row field.** The plan contradiction (iteration 1, P1), the `[P0]` task gate (iteration 3, P0) and the impossible handoffs (iteration 10, P0) are the same root cause seen at three layers [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:141] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:32]. Removing the bump makes 004's `'2'` assertions true, keeps both handoffs valid and leaves the `actor` column available as a JSON field, which is how 004 carries its own `RunSummary` additions. **Exact edit**: remove the bump from `001-activity-and-actor/plan.md:60,76` and `001-activity-and-actor/tasks.md:54`, and add one sentence that `actor` rides the index's JSON row the way `RunSummary` does; no other file changes.
2. **P2 — The reducer registry lists 45 findings where the delta set holds 40, because five "Verified —" observations are numbered inside three iterations' `## Findings` sections.** Iterations 6, 7 and 12 number their verified observations alongside their findings [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/iterations/iteration-006.md:21] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/iterations/iteration-007.md:23] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/iterations/iteration-012.md:20], and the reducer indexes every numbered line, so the registry counts 45 while the delta rows — the canonical finding set — count 40. The iteration files are write-once and were not edited; the synthesis records the canonical count and the reason for the difference. **Exact edit for future runs**: keep verified observations in `## Ruled Out` or a separate `## Verified` section, never as numbered Findings lines.
3. **P1 — The fix order by concentration is 011 first, then 001, then the parent-level rows.** Phase 011 is named in 15 finding sources (5 unique findings: the operators roster scope, the roster write path, the five-transport overbuild, the non-approver dispatch rule, the four command-less `[P0]` rows), phase 001 in 15 (the `SCHEMA_VERSION` root cause, the actor field name and group, the activity/inbox JSON keys), and phases 005 and 006 next. Fixing 011's five and 001's schema decision clears 2 P0 and 4 P1 before any other phase is touched. **Exact edit**: sequence the remediation as 001 schema decision → 011 roster and checklist → 005 `--as` and proposal item → 006 scope and rungs → the parent-level metadata rows.

## Ruled Out

- **Treating iteration 1's `SCHEMA_VERSION` finding as a separate item from iteration 3's and 10's.** All three cite the same constant and the same two phases; they are one root cause with three consequences and are merged in Finding 1.
- **Treating the 45-versus-40 difference as lost findings.** Every delta row is present in the registry under a slug id; the five extras are the verified observations, not missing findings.
- **Treating the frontier answers as complete coverage of the topic.** The two frontier nodes covered shared records and failure modes; the four topic angles were covered by iterations 3-12 after the frontier drained, and the synthesis names what remains unexamined.

## Dead Ends

- A per-phase count from the `sources` arrays overcounts phases that a finding cites as evidence but does not accuse (for example, 008 citing 010). The ranking in Finding 3 uses the accused phase, read by hand, not the raw citation count.

## Edge Cases

- **Ambiguous input**: "consolidation" was read as dedupe, rank and fix order, not as writing the final `research.md` — synthesis is a separate phase.
- **Contradictory evidence**: none.
- **Missing dependencies**: none.
- **Partial success**: the registry's derived findings were counted and explained but not rewritten; the reducer owns that file.

## Sources Consulted

- All twelve `deltas/iter-*.jsonl` finding rows (40)
- `findings-registry.json` (45 key findings, 2 resolved questions, 50 ruled-out directions)
- `deep-research-state.jsonl` (13 records: 1 run-open, 12 iterations)
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/plan.md:60, :76
- specs/system-skilled-bots/003-openbot-parity-build/001-activity-and-actor/tasks.md:54
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/tasks.md:141
- specs/system-skilled-bots/003-openbot-parity-build/004-computer-exposure/spec.md:32
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/iterations/iteration-006.md:21, iteration-007.md:23, iteration-012.md:20
- specs/system-skilled-bots/003-openbot-parity-build/research/lineages/devin-2/steer.md (absent; no lead rulings to apply)

## Assessment

- New information ratio: 0.6
- Questions addressed: consolidation and fix order
- Questions answered: the forty findings reduce to one P0 root cause with three consequences, five 011-specific items and a set of single-phase edits; the registry's 45 is explained by five verified observations, not by missing or duplicated findings.

## Reflection

- **What worked and why**: Grouping by root cause rather than by iteration collapsed three P0/P1 items into one edit and made the remediation order obvious. Severity is a property of the consequence, not of the pass that found it.
- **What did not work and why**: The raw source-citation count overweights phases cited as evidence; the accused phase has to be read from the finding text.
- **What I would do differently**: Keep verified observations out of the numbered Findings list from the first iteration, so the registry count and the delta count agree without reconciliation.

## Recommended Next Focus

Synthesis: compile `research/research.md` with the forty findings grouped by phase and ranked, the cross-phase conflict list, the fix order from Finding 3 and the open questions the review did not close.
