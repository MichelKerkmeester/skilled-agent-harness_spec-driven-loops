# Convergence Report — deepseek-flash Lineage

- Stop policy: `max-iterations`
- Iterations completed: 4/4
- Convergence threshold: 0.05
- New-info ratios: 0.8 → 0.75 → 0.8 → 0.85
- Rolling average (last 3): 0.80 (signal CONTINUE)
- MAD noise floor: 0.037, latest 0.85 (signal CONTINUE)
- Question entropy: 6/6 = 1.00 (signal STOP)
- Composite stop score: 0.00 (< 0.60 threshold; no STOP)
- Convergence telemetry: 0.80 rolling average
- Early synthesis: no — threshold treated as telemetry only per stop policy; the loop ran all 4 iterations and broadened review angles instead of synthesizing early
- Stop reason: `maxIterationsReached`
- Findings: 20 (5 per iteration)
- Open research questions: 0 tracked; 2 uncovered questions carried to the parent (Pi `usage.cacheWrite` reporting reliability; real-world multi-process stats-file sharing)
- Divergence: none (no pivot events; breadth via focus rotation)

The lineage corroborated the parent Tier 1 set with exact line evidence, added eight new mechanisms, and issued two corrections (one severity overstatement, one stale-counter refutation that was itself wrong). Final synthesis in `research.md`.
