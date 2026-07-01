# Iteration 004 — Re-verify: Review Registry Disposition Staleness (Round-1 F-004)

**Focus:** Do glm/codex review registries now disposition findings post-remediation?
**Angle:** Read both registries; compare resolvedFindings vs openFindings.

## Findings

**GLM review registry** (`review/lineages/glm/deep-review-findings-registry.json`): 9 findings, **all `"disposition": "active"`**, `findingsSummary: {P0:0, P1:8, P2:1}`. No `resolvedFindings` array at all. Yet 008/007-fan-out-hardening shipped fixes for P1-001 through P1-004. **Verdict: STILL LIVE — zero dispositions.**

**Codex review registry** (`review/lineages/codex/deep-review-findings-registry.json`): **5 findings (F001-F005), all `"status": "active"`**, `resolvedFindings: []`. This is a CHANGE from round 1, which reported "0 findings despite 50 iterations." So a partial backfill/reconstruction happened (likely the codex registry was rebuilt from JSONL), but the findings were still never dispositioned.

**Cross-check:** Codex F005 (comment_hygiene, `deep_review_auto.yaml:395,408`) is the same defect as the live comment-hygiene violation re-verified in iteration 001. It is correctly "active" because the markers are still present — but this proves the registry accurately tracks an UNFIXED issue, while P1-001..004 in glm are MIS-tracked as active despite being fixed.

## Evidence
[SOURCE: review/lineages/glm/deep-review-findings-registry.json:11-103 — 9 findings all "active"]
[SOURCE: review/lineages/codex/deep-review-findings-registry.json:6-161 — 5 findings all "active", resolvedFindings:[]]

## newInfoRatio: 0.75 (new: codex registry rebuilt 0→5 since round 1; still never dispositioned)
