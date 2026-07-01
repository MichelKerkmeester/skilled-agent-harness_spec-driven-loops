# Iteration 021 — NEW: Codex Registry Rebuilt 0→5 Since Round 1 (Partial Backfill)

**Focus:** What changed in the codex registry between round 1 (0 findings) and now (5 findings)?
**Angle:** Review-vs-remediation: did a registry-sync step run?

## Findings

**Round 1 reported codex registry = 0 findings.** Current codex registry = **5 findings (F001-F005), all P1, all active.** So a reconstruction happened. The registry now has a well-formed structure: `openFindings` array, `resolvedFindings: []`, `findingsBySeverity: {P0:0,P1:5,P2:0}`, `persistentSameSeverity` tracking, `dimensionCoverage`.

**The 5 findings are codex's OWN review discoveries**, not glm's: F001 (spec_drift — 008 parent scaffold), F002 (lineage_integrity — session id discarded), F003 (agent_contract_conflict — CLI prompt names LEAF agent), F004 (verification_regression — fanout test suite fails), F005 (comment_hygiene — YAML markers). These overlap glm's findings thematically but use codex's own IDs.

**The registry-sync gap is STILL LIVE in a different form:** the registry was reconstructed (good — findings are no longer lost), but `resolvedFindings: []` remains empty. F001 (008 scaffold) is still active and unfixed (iter 008). F005 (comment-hygiene) is still active and unfixed (iter 001). These are CORRECTLY active. But the broader point stands: there is NO automated step that dispositions a review finding as `resolved` when its remediation phase ships. The reconstruction fixed the DATA-LOSS; it did not fix the DISPOSITION gap.

**Cross-check:** does any remediation phase update the registry? 008/007-fan-out-hardening shipped fixes for glm P1-001..004, but glm registry still shows them "active" (iter 004). So the never-disposition bug recurs identically in glm. Confirmed systemic, not codex-specific.

## Evidence
[SOURCE: review/lineages/codex/deep-review-findings-registry.json:6-192 — 5 findings, resolvedFindings:[]]
[SOURCE: review/lineages/glm/deep-review-findings-registry.json:11-103 — 9 findings all "active"]

## newInfoRatio: 0.8 (registry rebuilt since round 1; disposition gap confirmed systemic across both lineages)
