# Iteration 025 — NEW: Registry-Disposition Gap Recurs Beyond glm/codex? (Systemic Check)

**Focus:** Does the never-synced-registry bug recur for ANY remediation, or only glm/codex?
**Angle:** Review-vs-remediation: for every fixed finding, was the registry updated?

## Findings

The pattern to test: "a remediation phase ships a fix → the originating review registry should disposition that finding as resolved." Round 1 found this failed for glm (9 findings active despite 008/007 fixing P1-001..004). Iteration 021 confirmed it also holds for codex (5 active, resolvedFindings:[]).

**Is it systemic (a missing workflow step) or lineage-specific?** Evidence for SYSTEMIC:
1. BOTH lineages (glm, codex) independently show resolvedFindings:[] / no disposition.
2. The 009 phase-plan itself acknowledges this: child `006-review-registry-and-metadata-backfill` (Tier 1, doesn't exist as folder) is scoped to "Review-finding disposition + graph-metadata key_files backfill." The fact that a DEDICATED child was planned for registry disposition proves there is no existing automated step — if `speckit:complete` or the review workflow dispositioned findings automatically, no dedicated remediation child would be needed.
3. The review YAML has no `step_review_registry_disposition` step (round-1 recommendation was never implemented).

**Conclusion:** this is a missing-workflow-step systemic gap, not lineage-specific corruption. The fix is a new `step_review_registry_disposition` in the review synthesis phase that, for each finding whose `file:` target was modified by a later phase, sets `disposition: resolved` with evidence. Until that step exists, EVERY future remediation will leave its originating registry stale.

**Blast radius:** this means the packet's review registries are structurally unreliable as a "what's still broken" source — they always over-report active findings. Operators relying on registry openFindings count will believe more is broken than actually is.

## Evidence
[SOURCE: glm registry 9 active, codex registry 5 active — both resolvedFindings empty]
[SOURCE: 009/spec.md:120 — 006-review-registry-and-metadata-backfill planned (dedicated disposition child)]

## newInfoRatio: 0.85 (confirmed systemic; root cause = missing workflow step, not data corruption)
