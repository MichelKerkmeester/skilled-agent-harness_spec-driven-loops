# Convergence Report

- **Stop reason:** `converged` — no further pass over the frozen evidence would add a row. The iteration cap of 10 was also completed.
- **Total iterations:** 10 of 10.
- **Questions answered:** 6 of 6 key questions (KQ1-KQ6); 11 residual UNKNOWNs registered, each with the probe or evidence that would settle it.
- **Full ratio trend:** `1.00 → 0.90 → 0.80 → 0.85 → 0.75 → 0.70 → 0.65 → 0.60 → 0.15 → 0.05`
- **Last two ratios:** `0.15 → 0.05` (one net new row: a file added after the seed was generated; then none).
- **Convergence threshold:** 0.05 (newInfoRatio with negative-knowledge emphasis). The final pass measured exactly at the threshold with no new rows.
- **Early convergence:** not used. The maps were completed first; convergence was declared after the completeness audit.

## Row coverage

- Map A: 435 of 435 seed links, live-reconciled per root.
- Map B: 231 of 231 seed runtime files; 23 home-level paths enumerated (counts only).
- Map C: 4,027 of 4,027 seed files plus 1 post-seed file = 4,028.
- Cross-map total: 4,694 rows; 4,259 tracked files and 435 links; zero unmapped.

## Stop-signal evidence

- Iteration 9: live symlink census equals the seed per root; tracked-file diff is exactly one added file; all synthesis-critical citations resolve.
- Iteration 10: every one of the seed's 31 areas maps to exactly one iteration; no new rows.
- No stuck events, no timeouts, no skipped iterations.
