---
title: "Implementation Plan: Pre-existing test + doc failure remediation"
description: "Plan for reconciling the ~38 pre-existing test/doc failures (advisor, feature-flag docs, deferred suites, dead-code canary, macOS EINVAL) via file-disjoint gpt-5.5 worker lanes + orchestrator review."
trigger_phrases:
  - "pre-existing failure remediation plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/014-pre-existing-failure-remediation"
    last_updated_at: "2026-06-05T08:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored alongside the lane implementations"
    next_safe_action: "Central verify, then commit"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/feature-flag-reference-docs.vitest.ts"
---
# Implementation Plan: Pre-existing test + doc failure remediation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
Reconcile pre-existing failures across three packages via file-disjoint lanes: advisor (fixtures/expectations + one render.ts cap-ordering fix), feature-flag-reference-docs (test filename constants → renumbered docs), spec-kit deferred-suite gating + dead-code canary, and code-index EINVAL errno. gpt-5.5 worker lanes implemented; orchestrator reviewed, corrected a feature-flag-docs duplicate-file hack, and fixed EINVAL directly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
- typecheck clean: advisor, spec-kit mcp_server, code-index.
- advisor full suite green; feature-flag-reference-docs green; deferred suites skip cleanly; dead-code + security-hardening green.
- No assertion weakened to mask a defect; no duplicate doc files.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
Each failure class is owned by one disjoint file set so lanes parallelize without conflict: advisor `mcp_server/**`, spec-kit `mcp_server/tests/**` + `feature_catalog/feature-flag-reference/**`, code-index `mcp_server/tests/lib/**`. The fixes are reconciliations to current shipped reality (renumbered filenames, current output, fixture-availability gates, cross-platform errno) — never assertion-weakening.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase A — advisor reconciliation
Update stale fixtures/expectations across renderer/hook/brief/plugin/parity; fix the render.ts hygiene-directive cap-ordering bug.
### Phase B — feature-flag docs
Point the test's filename constants at the canonical renumbered docs (`273-`/`276-`/`277-`/`278-`/`283-`, playbook `311-`); revert the duplicate-file hack.
### Phase C — deferred-suite gating + dead-code
Gate `handler-memory-index` + `shadow-evaluation-runtime` to skip without DB fixtures (mirror `vector-index-impl`); fix the stale `dead-code-regression` canary.
### Phase D — code-index EINVAL
Accept `EADDRINUSE|EINVAL` in the non-socket bind assertion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run each affected suite to green/clean-skip; run cross-package typecheck. Central verify runs all affected suites together with no concurrent worker (avoids shared-resolution flakes).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `vector-index-impl.vitest.ts`'s existing deferral guard (mirrored by Phase C).
- shared package built (advisor typecheck dependency).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
All changes are test/fixture/doc-locator edits + one 4-line render.ts change; `git checkout` the affected files to restore prior (pre-existing-failing) state.
<!-- /ANCHOR:rollback -->
