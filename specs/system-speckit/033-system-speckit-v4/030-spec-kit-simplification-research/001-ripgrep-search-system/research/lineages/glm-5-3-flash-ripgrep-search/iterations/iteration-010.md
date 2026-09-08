# Iteration 10: Final consolidation — fixtures provenance, boundary-fixture readers, ledger close

## Focus

Last unexplored surfaces: the small fixtures (`semantic-probes.json`, `prompt-set.json`, `recipe-execution.json`, `daemon-off-proof.json`) — who reads them and what contract they carry; then the final ledger close with the open-question audit.

## Findings

| # | path:line | Claimed vs actual | Severity | Recommendation |
|---|-----------|-------------------|----------|----------------|
| F10.1 | `fixtures/semantic-probes.json` (header fields) | Claimed (name): semantic-lane test input. Actual: self-describing — `"contract": "boundary evidence only; never a lexical pass criterion"`, `hitDefinitions` distinguishes `returnedHit` (any candidate incl. 0-score partials) from `scoringHit` (score > 0), pinned to `manifestHash c0806077…` (the 017-packet worktree snapshot — same hash as latency-report.json F5.4). It is **acceptance-time boundary evidence** from the memory-decommission parity work, not vector-lane residue. | P2 (positive; naming is mildly misleading) | Document in fixtures README or rename header note; verify manifestHash pin is refreshed when the index is regenerated (currently it pins a third-generation snapshot). |
| F10.2 | fixture reader census | Claimed: fixtures are "for tests and frozen baselines" (README §1). Actual: `semantic-probes.json`, `prompt-set.json`, `recipe-execution.json`, `daemon-off-proof.json` have **no runtime reader**; the only test referencing any is `trigger-index.vitest.ts:404` which asserts `manifest.promptSetHash === null` (the manifest's own comment at `generate-trigger-index.mjs:216-218` says the parity harness "pins its own frozen prompt set here" — reserved, never landed). The big trio (manifest/diagnostics/variants) is written by the generator itself. So 4 of the committed fixtures are acceptance fossils; prompt-set.json is the frozen set for a hash slot that is still `null` at schema v2. | P1 (utilization: a reserved-but-unwired contract slot and its 12 KB frozen input sit committed; borderline P2 by impact — kept P1 because it is exactly the charter's "evidence of consultation vs dead surface" category applied to fixtures) | Recommend: either land the parity arm (assign promptSetHash) or mark the four acceptance fossils as archived acceptance evidence with a README row; do not delete in this packet (non-goal). |
| F10.3 | `generate-trigger-index.mjs:216-218` + test `:404-410` | Claimed: promptSetHash left null so manifest hash stays stable. Actual: consistent both sides — generator emits null, test asserts null. The seam is honest; the *plan* (a future parity consumer) is the dead surface, not the code. | P2 (positive code, dormant plan) | Same action as F10.2. |
| F10.4 | final ledger assembly (all 10 iterations) | Consolidated ledger: **P1 ×9 rows** (F1.1+F4.9+F8.5 freshness-ownership chain; F2.6 single-token scoring gap; F3.1+F5.1 concept-lane contract repair; F3.2 recipe drift; F4.1 no mechanical Gate 1 executor; F4.3 doctor staleness probe; F6.5 orphaned latency harness; F7.4 retrofit displacement; F10.2 acceptance-fossil fixtures), **P2 ×25+** positive-verified and cosmetic rows. Charter q-* closure: q-gen ✓ (deterministic, fail-closed; freshness process gap), q-lookup ✓ (one scoring gap, otherwise contract-true), q-search ✓ (recipe drift + concept lane), q-callers ✓ (census complete, hooks absent), q-contradiction ✓ (concept lane + availability note + latency claim), q-footprint ✓ (5 lines; repo-rules ruled out), q-consulted ✓ (agents/doctor/tests/search all consume; fixtures partially fossilized), q-removal ✓ (6-item shortlist). | — (ledger) | Carry to synthesis. |
| F10.5 | open questions (explicit carry) | (1) Does any org process expect `promptSetHash` to be landed (schema v3 candidate)? (2) Is retrofit-convention's migration formally accepted-complete anywhere (would license the relocation)? (3) Should `IGNORED_PATHS`-style per-doc exemption exist for latency/parity fixtures that embed corpus hashes? (4) Who is the named owner for whole-corpus regeneration — CI cron, doctor runbook, or release checklist? These need operator/process answers, not more code reading. | — (carry) | Record in synthesis for the parent packet. |

Ruled out: "semantic-probes.json is vector-lane residue requiring deletion" (it is boundary evidence with an explicit contract header); "the fixtures trio lacks any consumer" (manifest/diagnostics are consumed by doctor/parity tests per F4.8 and generation flow).

## Sources Consulted

- `fixtures/semantic-probes.json`, `prompt-set.json` (headers parsed); grep census of fixture readers across `runtime/cli/tests/` and `retrieval/*.mjs`
- `trigger-index.vitest.ts:404-410` (promptSetHash assertion), `generate-trigger-index.mjs:216-218`
- Full iteration set 1–10 (ledger assembly)

## Assessment

- newInfoRatio: 0.4 — fixture-provenance findings are new but small; the pass is deliberately consolidation-shaped per the charter's final-iteration mandate.
- Novelty justification: the promptSetHash dormant-slot finding and the acceptance-fossil classification of four fixtures are first recorded here.

## Reflection

- Worked: the charter's angle list ended at (8); this pass closed the remaining unnamed surface (small fixtures) before synthesis, so no ground truth file went unread.
- Failed: nothing.
- Ruled out: see above.

## Recommended Next Focus

None — loop complete at the 10-iteration cap; synthesis follows.
