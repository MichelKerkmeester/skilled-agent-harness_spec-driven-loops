# Final Program Corpus Capture — 2026-07-29

All measurements against the hash-pinned corpus (labeled `9f30cc5e…` 195 rows, holdout `88a7f759…` 72 rows, ambiguity `07cd2c76…` 24 rows), after every program phase (001–011) landed and after the live daemon reindex (`advisor_rebuild`: generation 12558→12559, freshness stale→live, 49 edges indexed).

## Deltas vs the program's pinned baselines

| Metric (regime) | Pinned baseline | Final | Delta |
|---|---|---|---|
| Python advisor top-1, sqlite-warm (**post-reindex**, includes all migrated edges/signals) | 0.5692 · wrong 44 · TT 108 · FT 3 · FF 1 | 0.5692 · 44 · 108 · 3 · 1 | **zero** |
| Python advisor top-1, no-sqlite fallback (= CI regime) | 0.5333 · TT 101 · FT 3 · FF 1 | 0.5333 · 101 · 3 · 1 | **zero** |
| TS scorer top-3 full corpus (source-transform, pinned force-local regime) | 176/195 = 0.9026 | 176/195 | **zero** |
| TS scorer top-3 holdout | 53/72 = 0.7361 | 53/72 | **zero** |

Top-3 (REQ-002) is reported by the TS-source rows above and by the CI `golden-prompt-gate` suite (top-1/top-3 per labeled case, 10/10). The known pinned-vs-live holdout-top-3 note (55/72 recorded in one early artifact vs 53/72 measured all session) predates this program's changes — verified independent of every phase by revert-isolation earlier in the program.

## Daemon reindex proof (REQ-003)

- `node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted` → `rebuilt: true, reason: "stale", freshnessBefore: "stale", freshnessAfter: "live", generationBefore: 12558, generationAfter: 12559, indexedEdges: 49`.
- Post-rebuild `skill_edges` contains the drift-closure row the edge migration shipped: `cli-external-orchestration → system-spec-kit (depends_on, 0.7)`.
- Post-rebuild warm-regime corpus identical to the pin — the daemon serves the migrated data with zero routing delta.
- Reload step: `advisor_rebuild --trusted` via the daemon CLI is the documented reload; no additional mechanism needed.

## Outstanding environmental blocker (not this program's)

The advisor `npm run build` (dist) and `validate.sh --strict` remain broken repo-wide by a concurrent session's in-flight pi-hook relocation (undeclared Pi-runtime dependency compiled by both tsconfigs). Consequence: the dist-based capture tools measure stale lanes; all TS measurements above therefore ran through the source transform (vitest), which is what CI's golden gate runs too. The dist rebuild + `validate --recursive --strict` re-run belong to whoever lands the pi-hook fix.
