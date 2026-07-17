# Iteration 1 (Round K): Q1 Retention/TTL × bi-temporal close + forget-allowlist

## Focus
Round K mapping pass: reconcile 027's tier-aware retention/TTL sweep against 028's edge-presence close (C3-A), the tombstone-sweep-vs-temporal-close split (C3-D), and aionforge-forget's allowlist. Read-only claude2 Opus seat.

## Actions
Read `027/before-vs-after.md` retention section + 028 `roadmap.md` spines (2)/(6); grepped the live memory subsystem and opened `memory-retention-sweep.ts`.

## Findings (newInfoRatio 0.3)
**VERDICT: EXTENDS** — 028 builds complementary forgetting machinery *around* 027's shipped basement, it does not replace it.
- 027's live retention sweep IS the C3-D "off-state forgetting / tombstone-sweep" pillar: it physically deletes unprotected TTL-expired rows but holds a tier basement (`memory-retention-sweep.ts:177` `PROTECTED_RETENTION_TIERS={'constitutional','critical'}`; pinned at `:189-192`) and records `decision:'deny'` to the governance audit instead of deleting (`:542-566`). Always-on, no flag (`before-vs-after.md:523`).
- 028 C3-A (`roadmap.md:50,215`) is edge-presence temporal-close on CAUSAL EDGES (`contradiction-detection.ts:75-77,99-110`) — a different axis than memory-row TTL. Not a supersede.
- C3-D (`roadmap.md:53`) explicitly frames tombstone-sweep (`sweep.ts:68-100`) vs temporal-close (`temporal-edges.ts:64-80`) as *separate* concerns — i.e. it documents an already-shipped split.
- aionforge-forget's spare-only AND-gate + 6-label allowlist + erasure cascade = additive granularity layered onto the existing basement (the one genuinely un-covered piece). LEVERAGE M, EFFORT S.

## Open caveat (most-likely-wrong)
That C3-A is purely a different axis: if edge-presence currentness is intended to eventually become the *row* retirement path (replacing TTL deletion), the relationship tilts toward **supersedes**. Carry to Q3 / adversarial round.

## Next Focus
Q2-Q10 mapping wave. Carry-forward for Q1: aionforge-forget's label-allowlist as additive retention granularity on the live tier basement.
