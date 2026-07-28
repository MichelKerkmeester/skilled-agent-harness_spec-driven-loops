---
title: "Checklist: Post-review remediation"
description: "Fix every remaining deep-review finding: route-gold refresh, phase-parent status rollup, pre-existing repairs, additive advisor vocabulary."
trigger_phrases:
  - "post review remediation"
  - "route gold refresh"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
---

# Checklist: Post-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Check items only with evidence: a command run, a gate number, or a commit hash.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 Lane definitions match the merged review report findings - evidence: ../review/review-report.md sections 3
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-002 Lane B rollup covered by unit test; spec-kit graph suite green - evidence: `mcp-server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts scripts/tests/graph-metadata-refresh.vitest.ts --config mcp-server/vitest.config.ts` (10 passed, 1 skipped)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-003 Family-registry parity passes 6/6; skill-contract test passes — evidence: commit 9bbd2c1acb
- [x] CHK-004 Lane A per-scenario diff shows ZERO changes (91 -> 91 both hubs); the blocked verdicts are pre-existing router misses, not stale gold — evidence: commit 265adfbf23
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-005 Every finding resolved, kept-by-decision, or reclassified pre-existing — evidence: ../review/review-report.md reconciliation
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-006 Four lane commits reviewed; additive/hygiene only — evidence: 9bbd2c1acb a1426210ef e095152fac 265adfbf23
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-007 Reconciliation updated — evidence: ../review/review-report.md section 6
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-008 Lane C fixture edits reverted and re-done in Lane A; each lane a single commit — evidence: git log
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Lane B verified; remaining lanes are pending.
<!-- /ANCHOR:summary -->
