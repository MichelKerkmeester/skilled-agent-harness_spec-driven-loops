# Deep Research Strategy

## Research Topic

Skill-advisor scorer parent-hub compatibility for `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning` and `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer`.

## Known Context

- Hard read-only charter: proposals only; do not edit advisor/scorer code. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md:3]
- Parent-hub compatibility is the top priority, weighted toward angles 1-5. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/_research-charter.md:7]
- `resource-map.md not present; skipping coverage gate`.
- `deep-loop-workflows` still projects `iterative code audit`, `severity weighted findings`, and `code audit`. [SOURCE: .opencode/skills/deep-loop-workflows/graph-metadata.json:80]
- `fusion.ts` still carries `codeAuditDeepReviewPenalty` for `code audit`. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:593]
- `projection.ts` projects `intent_signals`, `derived.trigger_phrases`, and derived keyword fields from graph metadata. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/projection.ts:213]
- 007 froze a weakest ambiguity slice at 15/25 top-1. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/007-eval-hardening/implementation-summary.md:129]
- 008 froze semantic_shadow at weight 0.05 after a net-negative ablation and three mcp-chrome-devtools abstain false-fires. [SOURCE: .opencode/specs/system-skill-advisor/012-skill-advisor-tuning/008-semantic-shadow-prove-or-freeze/implementation-summary.md:46]

## Key Questions

1. How should half-landed Layer-1b parent-hub vocabulary be cleaned up without regressing top-1 routing?
2. Which vocabulary belongs in metadata versus frozen scorer code?
3. What cross-hub collision report is needed before reindex/rebaseline?
4. How should guards validate the full advisor projection surface, not only trigger phrases?
5. Which ambiguous cross-hub prompts should become measured fixtures?
6. What atomic runbook prevents stale index, native-ABI, or ratchet drift failures?
7. When should live `conflicts_with` edges be authored?
8. How can command bridges be metadata-derived safely?
9. How should query-class, hub-router, and eval-bucket taxonomies cross-map?
10. Can semantic_shadow false-fires be addressed through embedding hygiene before lane-weight changes?

## Answered Questions

- All ten agenda angles have evidence-backed proposals in `iterations/iteration-001.md` through `iterations/iteration-010.md` and synthesis in `research.md`.

## What Worked

- Treating metadata movement and scorer penalties as one coupled migration.
- Using the existing 007 and 008 measurement packets as constraints rather than re-litigating them.
- Reusing existing normalization/projection seams instead of proposing a new scorer architecture.

## What Failed

- A pure metadata-only cleanup is insufficient while hardcoded scorer compensations and ratchet baselines still encode old behavior.
- A pure code-constant cleanup is unsafe while deep-loop metadata still projects single-pass code-audit terms.

## Exhausted Approaches

- Remove `codeAuditDeepReviewPenalty` before metadata cleanup.
- Tune lane weights before adding a parent-hub ambiguity fixture.
- Treat every graph-derived key file or source document as a user-facing alias.
- Author broad `conflicts_with` edges for every overlapping hub.

## Ruled-Out Directions

| Direction | Reason | Evidence |
|---|---|---|
| Remove the code-audit penalty first | Deep-loop metadata still attracts the contested prompt. | `.opencode/skills/deep-loop-workflows/graph-metadata.json:80` |
| Move all vocabulary into graph metadata | Slash/colon syntax and command bridges still need exact code anchors. | `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/lanes/explicit.ts:101` |
| Use live SQLite mutation for experiments | Existing packets use read-only copies or fixture projections. | `.opencode/specs/system-skill-advisor/012-skill-advisor-tuning/003-advisor-rrf-fusion/results/metrics.json:9` |

## Next Focus

Synthesis complete. Recommended next implementation packet: parent-hub compatibility hardening, ordered as metadata cleanup -> cross-hub guard -> projection-surface guard -> ambiguity fixture -> reindex/rebaseline.

## Non-Goals

- No advisor/scorer code edits in this lineage.
- No live database writes.
- No re-litigation of known-falsified WS1 post-cap demotion.

## Stop Conditions

- Stop at exactly 10 iterations per max-iterations policy.
- Treat convergence before iteration 10 as telemetry only.
- Produce read-only findings and proposals under this lineage directory.
