# Stage 3 — Live cross-ref classification (2026-05-26)

Baseline: 90 distinct external files reference 026 phase IDs.

## Live machine-read links into 026 (must update)
- `.opencode/specs/descriptions.json` — global spec registry. Handled by Stage 5
  regeneration (generate-description.js fan-out) + stale-entry prune for vanished paths.

## Historical / frozen — PRESERVE verbatim (no edit)
- benchmark fixtures (`mcp_server/benchmarks/**/rerank-ab-fixture.json`) — frozen probe data
- `116-deep-skill-evolution/**` rename-plan.json, findings-registry.json — other packet's history
- all `.md` prose (43), `.jsonl` (17), `.txt`/`.stderr` (15), `.ts` examples (3), `.tsv` (1)
  — past-tense provenance per rename_pattern.md

## Conclusion
No separate bulk-sed stage needed. The one live external link (descriptions.json) and
ALL internal 026 metadata are rebuilt by Stage 5 regeneration (run on main).
Stage 3 folds into Stage 5. Historical refs (89/90 files) preserved by inaction.
