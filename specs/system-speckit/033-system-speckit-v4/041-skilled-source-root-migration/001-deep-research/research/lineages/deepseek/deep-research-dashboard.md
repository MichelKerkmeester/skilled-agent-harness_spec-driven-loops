---
title: "Deep Research Dashboard — Skilled Source-Root Migration (deepseek lineage)"
trigger_phrases: []
---
# Deep Research Dashboard — deepseek lineage

## Iteration Table

| Run | Status | Focus | Findings | newInfoRatio |
|-----|--------|-------|----------|--------------|
| 1 | complete | Symlink topology (q1) | 8 | 1.0 |
| 2 | complete | Runtime contracts + residual .opencode (q2, q3 partial) | 9 | 0.85 |
| 3 | complete | Derived and generated state (q4) | 9 | 0.9 |
| 4 | complete | Repository gates + external references (q5, q6) | 8 | 0.9 |
| 5 | complete | Migration mechanics + documentation surface (q7, q8) | 9 | 0.9 |

## Question Status

| Question | Status |
|----------|--------|
| q1-symlink-topology | resolved (iteration 1) |
| q2-runtime-contracts | resolved (iteration 2) |
| q3-opencode-residual | partial — symlink-satisfies analysis delivered; plugin-glob-through-symlink UNKNOWN |
| q4-derived-state | resolved (iteration 3) |
| q5-repo-gates | resolved (iteration 4) |
| q6-external-refs | resolved (iteration 4) |
| q7-migration-mechanics | resolved (iteration 5) |
| q8-doc-surface | resolved (iteration 5) |

## Convergence Trend

stopPolicy: max-iterations (5). Ratios 1.0 → 0.85 → 0.9 → 0.9 → 0.9. Convergence is telemetry-only; the cap was reached before any convergence claim.

## Dead Ends

- No generator or checker manages the `.claude/skills` / `.pi/skills` whole-dir links; they are hand-made (iteration 1).
- No repo-visible "relocate the runtime directory" config key exists for any of the seven runtimes (iteration 2).
- Skill-root `graph-metadata.json` has no generator — the metadata contract settles it as authored (iteration 3).
- `~/.opencode/` is not a live reference (directory absent; stale zshrc entry) (iteration 4).

## Blocked Stops

None — no STOP candidate was blocked; the loop ended at the iteration cap.

## Graph Convergence

No graph events recorded (iteration-level `graphEvents` not used by this lineage).

## Next Focus

None — cap reached. Synthesis written to `research.md` with stopReason `maxIterationsReached`.
