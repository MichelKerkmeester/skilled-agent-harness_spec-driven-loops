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

## Phase 2 — Doctor fleet-ROUTER sweep — RESOLVED BY PHASE 1

- [x] CHK-006 [P1] `/doctor parent-skill` runs `ci-skill-root-metadata.cjs` fleet-wide (`_routes.yaml:150`, no `--skill`), which is now ROUTER-aware → all seven hubs audited in one invocation. (SC-3)
- [x] CHK-007 [P1] The fleet gate's negative control (Phase 1) proves a broken hub `ROUTER.md` → exit 1; the doctor route invokes that exact command. (SC-3)

## Phase 3 — Documentation citation cleanup — DONE (commit e07b5f2ae1)

- [x] CHK-008 [P2] `phase-detection.md` links repointed to `../../ROUTER.md`; target exists. (SC-4)
- [x] CHK-009 [P2] deep-alignment adapter docs cite `sk-code/ROUTER.md`, not `smart-routing.md`. (SC-4)
- [x] CHK-010 [P3] deep-review playbook files no longer reference `ANCHOR:smart-routing`. (SC-4)
- [x] CHK-011 [P2] `grep -c smart-routing.md` = 0 across the three fixed files. (SC-4)

## Phase 4 — Template rename (routing-leaf migration) — DONE (commit b10fed2e4d)

- [x] CHK-012 [P3] Template renamed to `parent-skill-root-router-template.md`; `leaf-manifest.json` regenerated + `ROUTER.md` leaf path updated.
- [x] CHK-013 [P3] `grep -rn parent-skill-smart-routing-template` over live surfaces = 0 (frozen benchmark/historical docs excluded by design).
- [x] CHK-014 [P3] leaf-manifest byte-drift `--check` exit 0; leaf/derived freshness 13/13; fleet gate exit 0; sk-doc compiled routing compiled-serving/fresh; agent-mirror-sync OK.

## Cross-cutting

- [ ] CHK-015 [P0] Each phase's diff is scoped — no change to the seven `ROUTER.md` files, frozen replay/scorer, `hub-router.json`, or `mode-registry.json`. (SC-5)
<!-- /ANCHOR:checklist -->
