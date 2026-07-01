# Iteration 013 — NEW: fanout-pool.cjs Silent-Return Patterns

**Focus:** Latent silent-failure bugs in fanout-pool.cjs beyond the 2 confirmed.
**Angle:** Audit `return null` / `return []` / `catch` patterns that could swallow errors.

## Findings

`fanout-pool.cjs` (29KB, the pool/stall-watchdog layer) has several defensive-return patterns:
- Line 104: `return null;` (in a guard path)
- Lines 192, 199, 257: `return [];` (empty-array returns on early-exit guards)
- Line 335: `} catch (error) {` (error swallowed)
- Line 683: `.catch((error) => {` (promise rejection caught)

These are defensive-programming guards, but each is a **potential silent-failure site**: if a precondition check or parse step fails, the pool returns an empty/null result rather than propagating the error. The risk class: a lineage that produces no work because a guard returned `[]` silently, with no logged warning, making the failure look like "zero findings" rather than "broken pool step."

**Stall watchdog:** the 017-fanout-stall-watchdog rec (003.../017-fanout-stall-watchdog, an opt-in stall watchdog abort/requeue) was implemented in 002/017 per the changelog. This is a partial mitigation — the watchdog can detect stalls but the silent `return []` guards predate and bypass it.

**Assessment:** Not confirmed bugs (would need runtime reproduction), but they are the same class of silent-swallow defect as the merge silent-drop that WAS confirmed. Recommend adding structured warnings (like the merge `schema_mismatch` pattern) to each defensive return so silent empty results become visible. This generalizes the 009/001 fix philosophy to the pool layer.

## Evidence
[SOURCE: fanout-pool.cjs:104,192,199,257,335,683 — silent return/catch sites]
[SOURCE: changelog/002-deep-loop-runtime/changelog-002-017-fanout-stall-watchdog.md — watchdog rec shipped]

## newInfoRatio: 0.8 (new latent-defect class identified; same root pattern as confirmed merge bug)
