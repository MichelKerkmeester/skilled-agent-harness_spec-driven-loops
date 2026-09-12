# Convergence Report

Session `fanout-deepseek-1789201017494-mped3v` · lineage `deepseek` · executor
`cli-pi model=deepseek-v4.1-flash` · loop type `research`.

## Stop reason

**`maxIterationsReached`** — the run stopped on the configured cap, not on convergence. The packet
strategy bound five rings to five iterations and directed that convergence before the cap be
treated as telemetry only; none was reached, and none was needed.

## Iterations completed

| # | Ring | newInfoRatio | Findings |
|---|---|---|---|
| 1 | Line length | 1.00 | 6 |
| 2 | Unowned surfaces | 0.85 | 8 |
| 3 | The root README goal section | 0.90 | 5 |
| 4 | The naming collision | 0.80 | 5 |
| 5 | Machine checks | 0.90 | 5 |

**Average newInfoRatio: 0.89.** The trend is the shape of a fixed ring plan, not diminishing
returns: ring 1 measured virgin ground (1.0), and rings 2-5 stayed between 0.80 and 0.90 because
each combined re-verification of a known item with one or two genuinely new findings (the
two-parser divergence, the packet-resident test dependency, three undocumented env vars, the
checkable half of the README section).

## Questions answered

5 of 5 ring questions answered.

1. Line length: retire. No prose standard exists; the cited limit is a code-style maximum.
2. Unowned surfaces: keep the consistent duplications, repair the two drifted ones.
3. Root README goal section: cover by contract test; keep out of both retrieval lanes.
4. Naming collision: rename the deep-review scope manifest (13 live files).
5. Machine checks: three checks plus one assertion; four facts explicitly declined.

## Open residual unknowns

- Which four files the packet strategy measured for "365 lines" — UNKNOWN; settling action named.
- Out-of-repo consumers of `goal-file-manifest.txt` — INFERRED absent; operator check would settle.
- No check recommended in this report was committed or executed as a suite; ring 5 prototyped them
  as scans.

## Quality guards

- **Source diversity:** every ring cites multiple files opened in this session; ring 2 and ring 3
  each verify claims across six or more documents.
- **Focus alignment:** one ring per iteration, matching the packet strategy's ring plan exactly.
- **No single weak source:** no finding rests on one document alone; the two premise corrections in
  ring 1 and the new defects in rings 2 and 5 each carry independent measurements.

## Artifacts

`research.md` (canonical synthesis) · `iterations/iteration-001..005.md` (per-ring evidence) ·
`deltas/iter-001..005.jsonl` (29 findings) · `deep-research-state.jsonl` (7 records + completion) ·
`findings-registry.json` · `deep-research-dashboard.md` · `resource-map.md` ·
`deep-research-strategy.md` · `deep-research-config.json`.
