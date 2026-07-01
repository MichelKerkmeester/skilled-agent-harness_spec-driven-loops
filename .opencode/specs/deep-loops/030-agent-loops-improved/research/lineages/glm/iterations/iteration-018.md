# Iteration 018 — NEW: Duplicate-Naming Symptom Reconciliation Across All Lineages

**Focus:** Map the duplicate-naming collision across EVERY lineage in the packet (not just codex).
**Angle:** Artifact-type-by-artifact-type: iteration file naming consistency.

## Findings

The salvage-naming bug (iteration 012 root cause) has hit **every CLI-executed lineage** in this packet to varying degrees:

| Lineage | Padded files | Non-padded dupes | Collision severity |
|---------|-------------|------------------|--------------------|
| review/codex | 50 (001-050) | 9 (1-9 single-digit) | Moderate — only single-digit dupes |
| review/glm | 11 (001-011) | 0 | None — no salvage ran (clean exit) |
| research_archive/.../glm (round 1) | 18 (001-018) | 18 (1-18) | Severe — EVERY iteration has a dupe |
| research_archive/.../gpt (round 1) | 11 (001-011) | 0 | None |

**Pattern:** the collision severity correlates with salvage activity. Round-1's glm research lineage had salvage run on EVERY iteration (18 dupes) — suggesting its executor repeatedly failed to write files and salvage recovered/replaced each one. The codex review had salvage only on iterations 1-9 (then stabilized). Clean-exit lineages (review/glm, gpt) have zero dupes.

**Implication for reducer/merge correctness:** any tool that globs `iteration-*.md` and counts or reads files will DOUBLE-COUNT or read empty placeholders for collided lineages. This is the likely root cause of round-1's "codex registry: 0 findings" — the reducer matched the 9 empty `iteration-N.md` placeholders for early iterations and may have short-circuited. (Codex registry now has 5 findings because it was later rebuilt.)

**Cleanup scope:** deleting the non-padded placeholders is safe (they contain only `<!-- fanout_salvage_failed -->` or are byte-identical to padded versions). 009/003-runtime-hygiene-fixes covers this but is Not Started.

## Evidence
[SOURCE: review/lineages/codex/iterations/ — ls shows 50 padded + 9 non-padded]
[SOURCE: research/research_archive/.../lineages/glm/iterations/ — 18 padded + 18 non-padded]

## newInfoRatio: 0.75 (reconciled severity across 4 lineages; correlated with salvage activity)
