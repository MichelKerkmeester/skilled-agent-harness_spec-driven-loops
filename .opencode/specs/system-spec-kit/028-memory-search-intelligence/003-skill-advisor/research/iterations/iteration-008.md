# Iteration 8: External Mining — aionforge cross-family-guard.md + drift.md → Skill Advisor

## Focus
Round B mining: cross-family-guard + drift for NET-NEW Skill Advisor candidates. **Both docs occupy families the roadmap never touches** — the roadmap is fusion-math (RRF/weighted-sum/lane-tune/elision/query-class); these are **provenance-contamination** + **temporal-drift**. Read-only.

## Findings — NET-NEW candidates (6; newInfoRatio 0.85)
| Candidate | Seam | Lev/Eff | Class | Conf |
|---|---|---|---|---|
| attested-calibration-baseline + drift-sweep (versioned baseline asset; clamp01(cos(base,anchor)−cos(cur,anchor)); NEVER auto-rebaseline = anti drift-laundering) | feedback-calibration.ts:193-227 (live recompute, NO persisted baseline) | H/L | BUILD | CONFIRMED |
| author-provenance self-boost guard (union-with-authoring-model: a producer must not score off its own authored content; closes the two-hop launder) | explicit.ts:320,327; fusion.ts:173,464 (no producer-vs-scored-skill check) | M/M | BUILD | CONFIRMED |
| fail-closed family normalization for sibling dedup (hyphen-boundary prefix + closed vendor-root table; unverifiable→same, fails closed) | fusion.ts:458-470 (cli-claude-code/cli-codex/cli-opencode treated as independent evidence) | M/M | BUILD | CONFIRMED |
| skip-never-fabricate drift accounting (named-skip taxonomy: baselines_needed/stale-model/awaiting-first-behavior/thin — never a forced max or fabricated alarm) | feedback-calibration.ts:127-129,171 (only low_sample/concentration) | M/S | PROMOTE | CONFIRMED |
| cooling-window / rank-sink for fresh feedback (new high-trust fact admitted but rank-sunk a bounded window so the detector looks before it gains influence) | GAP (calibration applies pressure immediately) | M/M | BUILD | INFERRED |
| content-addressed anti-flap dedup for advisor warnings (row id over (block, baseline epoch, score decile) → re-detect no-ops, only decile escalation re-warns) | fusion.ts:349,377 (raw gauge emission, no dedup) | L/S | BUILD | CONFIRMED |

**Already covered:** C1-C5/C5a/QCR — none touch provenance-contamination or temporal-drift; zero overlap with these 6.

## Synthesis note
**author-provenance self-boost guard** + **family normalization** are directly relevant here: this very codebase has sibling skills (cli-claude-code / cli-codex / cli-opencode) the advisor currently treats as independent evidence (`fusion.ts:458-470`), and an `author:` evidence path (`explicit.ts:320`) with no producer-vs-scored check. Real contamination surface.

## Next Focus
Two new orthogonal families opened (provenance-contamination + drift). attested-baseline (H/L) + author-self-boost-guard are the leads; both need durable cross-session state the current tmpdir JSONL lacks (open question). Feeds Round C.
