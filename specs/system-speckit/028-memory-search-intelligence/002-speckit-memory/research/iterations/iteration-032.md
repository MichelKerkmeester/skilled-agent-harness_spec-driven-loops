# Iteration 32: Round H Rust Reference — aionforge-forget → spare-only + edge-allowlist + erasure cascade

## Focus
Round H: mine `aionforge-forget` for the forget-eligibility + unreferenced-allowlist + erasure-cascade reference — Memory M-spare-only / M-edge-allowlist / M-erasure-cascade. Read-only.

## Reference patterns (newInfoRatio 0.85)
| Technique | aionforge impl | Transferable |
|---|---|---|
| Spare-only AND-conjunction | decay.rs:183-191; policy.rs:77-79 | flat AND over independent axes; (1) every axis only SPARES (any high value keeps it); (2) **non-finite guards spare garbage** (`decayed.is_finite()` BEFORE the comparison — `-inf<floor` would wrongly doom a corrupt scalar); (3) pin DOUBLE-enforced; (4) both-floors-at-ceiling REFUSED at config-validate. At-floor: importance `>=` stays, trust `<` stays. The internal reducer (only tier/pin today) should add finite-guards + the full AND + trust + unreferenced + age-floor |
| Unreferenced-via-live-edge ALLOWLIST | forgetter.rs:41-48,214-216 | "unreferenced" = negation of an explicit 6-label allowlist (DERIVED_FROM/SUPPORTS/DEPENDS_ON/RELATES_TO/HAS_FAILURE/MENTIONS), NOT zero-incoming-edges. AUDIT/provenance/scope edges DELIBERATELY excluded ("an allowlist matching everything forgets nothing"). Layered spare short-circuits (expired/pin/promotion-lineage/attested) run FIRST with typed SpareReason labels |
| Erasure cascade (read-first, refuse-whole) | purge_read.rs:110-285; eraser.rs:178-256 | read-only closure walk FULLY before any write; **multi-parent survival** (derivative doomed ONLY if `all_sources_doomed`; one surviving source spares it, reported); fixed-point sweep (a sibling source joining flips pending→doomed; monotone→terminates); cap→`TooLarge`→refuse WHOLE; namespace-authority all-or-nothing (one refused namespace refuses the whole erasure), checked after walk, before write |

## Key port note
The spare-only reference directly fixes the incomplete internal reducer (Round C found it spares only tier/pin): add finite-guards + the full AND-conjunction + trust/unreferenced/age axes. The edge-allowlist insight — protect only genuine-dependency labels, exclude ambient bookkeeping — is the key design rule (a too-broad allowlist silently disables forgetting).

## Next Focus
M-spare-only/M-edge-allowlist reference-backed (the AND-conjunction + 6-label allowlist port directly); erasure-cascade reference-backed (read-first/multi-parent-survival/refuse-whole) but still its own GDPR packet. Feeds Round J.
