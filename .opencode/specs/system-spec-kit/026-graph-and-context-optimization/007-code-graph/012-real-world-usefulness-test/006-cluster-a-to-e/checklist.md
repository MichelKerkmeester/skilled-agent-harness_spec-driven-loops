---
title: "Verification Checklist: Code Graph + Advisor + Hooks Polish"
description: "Checklist for Phase 026/007/012/006 clusters A-E."
trigger_phrases:
  - "026/007/012/006 checklist"
  - "cluster a to e verification"
importance_tier: "critical"
contextType: "verification"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Code Graph + Advisor + Hooks Polish

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md. Evidence: pending.
- [ ] CHK-002 [P0] Technical approach documented in plan.md. Evidence: pending.
- [ ] CHK-003 [P1] Source research and target files read before edits. Evidence: pending.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P0] F-007 diagnostics fields land in blocked-read payloads with regression test. Evidence: pending.
- [ ] CHK-011 [P0] F-018 guarded auto-rescan lands with safe-path regression test. Evidence: pending.
- [ ] CHK-012 [P0] F-019 verify scope preflight lands with mismatch regression test. Evidence: pending.
- [ ] CHK-013 [P0] F-014 advisor rebuild predicate lands with mixed-axis regression test. Evidence: pending.
- [ ] CHK-014 [P0] F-015 startup post-index assertion lands with regression test. Evidence: pending.
- [ ] CHK-015 [P0] F-016 CocoIndex snake_case seed normalizer lands with regression test. Evidence: pending.
- [ ] CHK-016 [P0] Cluster E glob fingerprint behavior lands with regression test. Evidence: pending.
- [ ] CHK-017 [P1] F-012 Copilot docs updated without runtime code changes. Evidence: pending.
- [ ] CHK-018 [P1] F-013 Gemini docs updated without runtime code changes. Evidence: pending.
- [ ] CHK-019 [P1] F-017 CocoIndex docs updated without runtime code changes. Evidence: pending.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] New tests count is at least 8. Evidence: pending.
- [ ] CHK-021 [P1] `npx vitest run code_graph/tests/` passes. Evidence: pending.
- [ ] CHK-022 [P1] Advisor test suite passes. Evidence: pending.
- [ ] CHK-023 [P1] Hooks/general `tests/` suite passes. Evidence: pending.
- [ ] CHK-024 [P0] `npm run build` passes. Evidence: pending.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets. Evidence: pending.
- [ ] CHK-031 [P1] New read-path auto-rescan remains guarded by scope and parse backlog checks. Evidence: pending.
- [ ] CHK-032 [P1] No auth or network behavior changed. Evidence: pending.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec, plan, tasks, checklist, ADR, and implementation summary synchronized. Evidence: pending.
- [ ] CHK-041 [P1] Parent `graph-metadata.json` includes `006-cluster-a-to-e`. Evidence: pending.
- [ ] CHK-042 [P2] Strict validation passes for child and parent. Evidence: pending.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 0/13 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->
