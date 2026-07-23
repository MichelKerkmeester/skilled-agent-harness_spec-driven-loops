---
title: "Feature Specification: sk-doc Compiled Router Rollout"
description: "Compile the authored sk-doc documentation hub into the frozen router contract, exercise its exact ordered bundle and negative outcomes through the shared projector and real scorer, and retain legacy authority behind a fenced rollback path."
trigger_phrases:
  - "sk-doc compiled router rollout"
  - "sk-doc ordered documentation bundle"
  - "sk-doc real route gold canary"
importance_tier: "critical"
contextType: "implementation"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/006-parent-hub-rollout/007-sk-doc"
    last_updated_at: "2026-07-19T00:00:00.000Z"
    last_updated_by: "codex"
    recent_action: "Completed compiled router rollout"
    next_safe_action: "Retain shadow-only candidate"
    blockers: []
    key_files: ["harness/validate-canary.cjs", "compiled/policy.json"]
    session_dedup:
      fingerprint: "sha256:a7b3e45919280e1abb89ae44bf5e4af3d000ba7c97f2236b34b0bf9951293585"
      session_id: "sk-doc-rollout-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: sk-doc Compiled Router Rollout

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | In Progress — implementation REAL-GREEN; no-commit freshness unresolved |
| **Created** | 2026-07-19 |
| **Branch** | existing worktree branch |
<!-- /ANCHOR:metadata -->

---
<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

`sk-doc` declares a multi-mode router in `hub-router.json` and `mode-registry.json`, but the
parent-hub rollout needs a compiled, typed, deterministic view. The rollout must preserve every
declared destination, weight, tie-break, outcome, default, resource, and bundle rule without
inventing policy. It compiles immutable bytes into `CompiledPolicyV1`, evaluates typed decisions,
projects them through the shared projector, and proves them against the existing read-only scorer.
<!-- /ANCHOR:problem -->

---
<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Twelve public documentation modes compiled as actor destinations.
- Eleven unique packet resources; shared packets do not collapse public destination identity.
- Authored outcomes `single`, `orderedBundle`, and `defer`, with null default and delta 1.
- The exact skill plus quality-control bundle ordered as `[create-quality-control, create-skill]`.
- Typed route-gold, advisor projection, policy card, fenced activation evidence, and rollback.

### Out of Scope

- Edits to live skills, router configuration, registries, shared libraries, or scorer files.
- Network, package install, live serving activation, git commit, or git push.
- New modes, signals, fallback destinations, bundle combinations, or learned overlays.
<!-- /ANCHOR:scope -->

---
<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance |
|----|----------|-------------|------------|
| REQ-001 | P0 | Compile only authored bytes through the shared compiler. | Source hashes bind the hub and 11 packet files; recompile is byte-identical. |
| REQ-002 | P0 | Preserve destination algebra. | Twelve injective actor destinations, 11 packet resources, no invented mode. |
| REQ-003 | P0 | Honor selection policy exactly. | Dominance routes one mode; the exact pair bundles; other ambiguity clarifies once. |
| REQ-004 | P0 | Honor negative/default behavior. | Forbidden rejects; null default defers; non-routes are target-free and authority-withheld. |
| REQ-005 | P0 | Reuse shared projector and scorer. | Eighteen rows pass the frozen read-only scorer with no writeback. |
| REQ-006 | P0 | Preserve activation and authority fences. | COMMIT requires VERIFY; candidate is shadow-only; rollback restores exact prior bytes. |
| REQ-007 | P1 | Provide document and advisor parity. | Card replay matches; advisor drift or absence cannot rewrite a decision. |
| REQ-008 | P0 | Protect frozen inputs. | Authored and scorer hashes match before and after validation. |
<!-- /ANCHOR:requirements -->

---
<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Artifact builds are deterministic across consecutive runs.
- Canary exits zero with `status: REAL-GREEN`.
- Every `.cjs` passes `node --check`; strict packet structure is clean apart from the mandated
  uncommitted-path freshness check.
- Task writes remain within this child folder.
<!-- /ANCHOR:success-criteria -->

---
<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Control |
|------|------|---------|
| Dependency | Frozen compiler and projector | Import directly; never duplicate. |
| Risk | Shared packet collapses public modes | Retain workflow mode in compound identity. |
| Risk | Ambiguity becomes an invented bundle | Match a bundle only when its `whenAll` set is exact. |
| Risk | Bundle order drifts | Sort through authored `tieBreak`. |
| Risk | Passing requires scorer mutation | Hard-stop; scorer edit blocks activation. |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- Canonical artifacts are deterministic for identical source bytes.
- Only Node built-ins and committed shared modules are used.
- Negative decisions never carry targets or destination authority.
- Candidate stays `legacy` serving-authoritative and `shadowOnly: true`.
<!-- /ANCHOR:nfr -->

---
<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- `create-skill` and `create-skill-parent` share a packet but remain distinct routes.
- The exact declared pair bundles; an additional matched mode prevents the rule firing.
- Exact commands win before vocabulary scoring, with command-boundary protection.
- Zero signal defers and forbidden prompt text or constraint rejects.
<!-- /ANCHOR:edge-cases -->

---
<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | One hub, 12 modes, generated and activation artifacts |
| Risk | 17/25 | Frozen scorer compatibility and authority closure |
| Research | 11/20 | Router, 11 packets, three sibling archetypes |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---
<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The authored router determines the rollout behavior.
<!-- /ANCHOR:questions -->
