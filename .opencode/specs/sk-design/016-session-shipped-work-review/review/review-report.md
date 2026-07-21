# Consolidated Deep-Review Report — Session-Shipped Work (3 commits on skilled/v4.0.0.0)

> **Verdict: CONDITIONAL** (both lineages independently converged on CONDITIONAL)
> **Active P0: 0** · **Confirmed P1: 2** · **Minor/P2: 1 verified (+9 advisories)** · **Refuted: 1**
> **Executors:** DeepSeek-v4-pro (4 iters, converged) + MiniMax-M3 (5 iters, converged), flat pool, concurrency 2
> **Cost:** $1.30 total (DeepSeek $0.0996 / MiniMax $1.1973) · **Runtime:** ~15 min · **Failures:** 0/2
> **Date:** 2026-07-21 · Read-only review; no remediation applied.

## Scope reviewed

- `bf0986cecd` — 015 Phase-0 styles-DB foundation (`styles/_db/` code, oracle, telemetry, manifest)
- `9a42aedae4` — command-namespace dedup (delete `commands/design/`, checker + registry rewrite)
- `dc7fdfb0a7` — sk-doc/020 hyphen-naming (180 spec-doc files, 0 code)

## Headline

**No P0s: no correctness failures, no security vulnerabilities, no fabricated code/data/tests.** The
core 015-P0 database logic (manifest atomicity, oracle byte-parity, telemetry residency) and the
180-file sk-doc/020 doc sweep drew no material findings — consistent with 015-P0 having been
adversarially reviewed earlier this session. The real issues are **documentation-integrity and
completion-honesty gaps left by the command-dedup commit**, not code defects.

## Confirmed findings (verified against the code, most-severe first)

### P1-A — 012/006 packet metadata claims "planned / not-implemented" for SHIPPED work
- **Source:** MiniMax (DeepSeek missed it). **Status: CONFIRMED.**
- The `006-retire-design-alias-namespace` packet shipped in `9a42aedae4`, but its metadata still says it is unbuilt:
  - `spec.md` — `recent_action: "…(AUTHOR-SPEC stage)"`, `completion_pct: 0`, placeholder all-zeros fingerprint.
  - `implementation-summary.md:42/52` — `Status | Planned (AUTHOR-SPEC stage — not yet implemented)`, "Nothing in the runtime has changed yet".
  - `graph-metadata.json:42` — `"status": "planned"`.
- **Impact:** completion-honesty gap — the packet documents its own shipped change as pending. This is exactly what the COMPLETION VERIFICATION metadata-reconciliation rule exists to catch.

### P1-B — 3 sk-design docs still assert the retired `/design:*` aliases exist
- **Source:** DeepSeek (F002, found 2) + MiniMax (claimed 4). **Status: CONFIRMED; count corrected to 3.**
- `feature-catalog/creation-command-surface/interface-creation-commands.md` (:3, :20, :30, :43 — "additive `/design:*` compatibility aliases", "remain thin compatibility aliases", "`commands/design/*.md` | Compatibility routers | Preserves the five `/design:*` aliases").
- `feature-catalog/feature-catalog.md:201` — "The corresponding `/design:*` commands remain thin compatibility aliases."
- `styles/manual-testing-playbook.md:3, :29` — describes `/design:*` aliases + test CMD-03 "Backward compatibility preserved | `commands/design/*.md`".
- `README.md` + `SKILL.md` are CORRECT (say "retired") — the dedup commit fixed those two but missed the three above.
- **Impact:** docs assert a command surface that no longer exists; a reader/tester would be misled.

## Minor (verified real, severity corrected down)

### P2-C — generation-manifest.mjs: afterRename fires before the directory fsync
- **Source:** DeepSeek (F001, rated P1). **Status: real but narrow → P2.**
- `writeManifestPointer` (`generation-manifest.mjs`) calls `afterRename?.()` at :260 **before** the containing-dir `sync()` at :263. The "published" hook therefore signals before the flip is crash-durable, and if the hook throws, the dir-fsync is skipped. Needs a throwing/observing hook to matter; rename itself stays atomic.

## Refuted / overstated

### F004 — generation-manifest.mjs pid-based temp filename "collision-prone"
- **Source:** DeepSeek (rated P1). **Status: REFUTED.**
- Temp name is `.tmp-${pid}-${Date.now()}` (ms-scoped) and opened with `open(..., 'wx')` (exclusive create). A collision needs same-pid + same-ms, and even then `wx` fails safe (errors, never clobbers). DeepSeek did not credit the `wx` guard.

## Advisories (P2)

9 P2 advisories total (DeepSeek 4 + MiniMax 5) recorded in the per-lineage reports under
`review/lineages/{deepseek-v4-pro-high,minimax-m3-high}/review-report.md` — follow-up polish, not blocking.

## Meta-caveats (reported honestly)

- **Executor timestamp integrity:** both lineages emitted synthetic per-iteration timestamps in their
  state logs (DeepSeek 6 anomalies, MiniMax 14), flagged by the framework's timestamp window and
  skipped. This affects only state-log *timeline* metadata; every finding cites a real file:line and
  stands independently.
- **Reviewer accuracy:** single-reviewer hit rates were imperfect — DeepSeek inflated one severity and
  overstated one finding; MiniMax miscounted the stale-doc set (4 vs actual 3). The two-lineage +
  human-verification pass corrected both, which is the point of the fan-out.

## Recommended remediation (separate, Gate-3'd task — not applied here)

1. Reconcile `012/006` metadata to its shipped reality (status `complete`, real completion, drop the
   "planned/not-implemented" narration, refresh fingerprint via the metadata generators).
2. Update the 3 stale docs to state the `/design:*` namespace is retired (mirror README/SKILL wording).
3. Optional: reorder `writeManifestPointer` so the dir-fsync precedes `afterRename` (P2-C), or document that afterRename runs pre-durability.
