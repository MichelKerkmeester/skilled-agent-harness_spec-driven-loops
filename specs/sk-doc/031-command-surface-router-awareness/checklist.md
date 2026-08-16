---
title: "Checklist: Command-Surface Root ROUTER.md Awareness Remediation"
description: "Per-gap acceptance checklist mapping each success criterion to an objective pass/fail check."
trigger_phrases:
  - "router awareness remediation checklist"
importance_tier: "high"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Checklist: Command-Surface Root `ROUTER.md` Awareness Remediation

> Mark `[x]` only with evidence (command output, grep count, or exit code). Each item is an objective pass/fail gate.

<!-- ANCHOR:checklist -->
## Phase 1 — CI fleet-gate hardening — DONE (commit 4dfd1f33e5)

- [x] CHK-001 [P0] `grep -c ROUTER.md .github/workflows/routing-registry-drift.yml` returns 2 (both `paths:` blocks). (SC-1)
- [x] CHK-002 [P0] The workflow YAML parses cleanly; diff is +2 insertions only.
- [x] CHK-003 [P0] `ci-skill-root-metadata.cjs` references `root-router-contract.cjs` and calls `validateRootRouter` in its class-H branch. (SC-2)
- [x] CHK-004 [P0] `ci-skill-root-metadata.cjs` exits 0 over the fleet (`checked=13 passed=13 failed=0`). (SC-2)
- [x] CHK-005 [P0] Negative control: removing a hub `ROUTER.md` → exit 1, `FAIL [H] sk-prompt` with `MISSING_REQUIRED_FILE` + `RRC-001`; restored clean. (SC-2)

## Phase 2 — Doctor fleet-ROUTER sweep

- [ ] CHK-006 [P1] One `/doctor` route enumerates all seven `mode-registry.json` hubs and prints each `router_state`. (SC-3)
- [ ] CHK-007 [P1] The same route flags a broken fixture hub as failing. (SC-3, negative control)

## Phase 3 — Documentation citation cleanup

- [ ] CHK-008 [P2] `sk-code/shared/references/phase-detection.md` no longer links to a non-existent `smart-routing.md`; any repointed target exists on disk. (SC-4)
- [ ] CHK-009 [P2] deep-alignment `sk-code-adapter.md` / `sk-code-known-deviations.md` cite `sk-code/ROUTER.md §…`, not `smart-routing.md §N`. (SC-4)
- [ ] CHK-010 [P3] deep-review playbook files no longer reference a non-existent `ANCHOR:smart-routing`. (SC-4)
- [ ] CHK-011 [P2] `grep -rn "smart-routing.md" .opencode/skills` shows only legitimate legacy-rejection/migration/test/template hits — zero dead links. (SC-4)

## Phase 4 — Cosmetic template rename (optional)

- [ ] CHK-012 [P3] `parent-skill-smart-routing-template.md` no longer exists; `parent-skill-root-router-template.md` does.
- [ ] CHK-013 [P3] `grep -rn "parent-skill-smart-routing-template" .opencode .claude` returns zero hits.
- [ ] CHK-014 [P3] create-skill-parent auto/confirm still resolve the renamed template.

## Cross-cutting

- [ ] CHK-015 [P0] Each phase's diff is scoped — no change to the seven `ROUTER.md` files, frozen replay/scorer, `hub-router.json`, or `mode-registry.json`. (SC-5)
<!-- /ANCHOR:checklist -->
