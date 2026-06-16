# Iteration 17: Round I Implementation Sketch — Q6-anchor FIX (ready-to-spec)

## Focus
Round I: exact build sketch for the #1 ship-first pick (Q6-anchor template FIX). Read-only.

## Build sketch (newInfoRatio 0.40) — **READY-TO-SPEC**
- **TOUCH:** `deep-research/assets/deep_research_strategy.md` — wrap 7 existing sections (§3 L39, §6 L56, §7 L62, §8 L68, §9 L74, §10 L88, §11 L94). Single-file template-only edit. Confirmed: `grep ANCHOR:` on the template = 0; `reduce-state.cjs` is the only ANCHOR: referer; first reduce hard-fails on `key-questions` (reduce-state.cjs:709-711).
- **CHANGE:** insert paired `<!-- ANCHOR:<id> -->` / `<!-- /ANCHOR:<id> -->` markers matching the reducer regex (L700), ids in canonical order (L734-745): key-questions→§3, answered-questions→§6, what-worked→§7, what-failed→§8, exhausted-approaches→§9, ruled-out-directions→§10, next-focus→§11. Keep `## 3. KEY QUESTIONS (remaining)` heading intact (parseStrategyQuestions L211 reads it pre-replacement); leave MACHINE-OWNED markers (inert).
- **TEST:** copy template → fixture; minimal JSONL + iteration-001.md; `reduceState()` → assert no "Missing anchor" throw; assert 7 sections present; 2nd reduce byte-identical (idempotent).
- **WHAT-BREAKS:** nothing in-repo (no file carries hand-patched anchors). Runtime-only: already-copied strategy files keep failing until re-copied (out of scope).
- **READINESS:** ready-to-spec (format/ids/order/placement pinned to reducer source; only the test fixture remains).

## Next Focus
Q6-anchor FIX is fully spec'd — the #1 pick ships as a one-file template edit + a fixture test. Feeds Round J migration plan (Wave-0 head).
