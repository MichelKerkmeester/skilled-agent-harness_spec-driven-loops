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

- [ ] CHK-003 Both pre-existing Python tests pass after Lane C
- [ ] CHK-004 Lane A per-scenario diff shows only route-gold un-blocking
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-005 No open review finding remains unaddressed or undocumented
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-006 No credentials or unrelated behavior changes in any lane commit
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-007 review-report.md reconciliation updated with lane commits
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-008 Per-lane commits; no cross-lane bleed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

Lane B verified; remaining lanes are pending.
<!-- /ANCHOR:summary -->
