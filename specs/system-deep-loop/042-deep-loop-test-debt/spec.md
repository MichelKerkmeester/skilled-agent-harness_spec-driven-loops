---
title: "Feature Specification: deep-loop-test-debt"
description: "Fix the pre-existing red tests and typecheck errors that the spec-kit nesting triage attributed to system-deep-loop: council persist-artifacts containment and fixture vantage, the reducer's fail-closed strategy anchors, the deep-review restart contract wording, and the runtime typecheck errors."
trigger_phrases:
  - "deep loop test debt"
  - "council persist artifacts"
  - "review reducer fail closed"
  - "deep review restart contract"
  - "deep loop typecheck errors"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deep-loop-test-debt

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The spec-kit CLI test suite carries tests whose subject is owned by `system-deep-loop`, and several of them were red before the CLI workspace was nested under `runtime/`. The nesting review confirmed they are pre-existing and out of that packet's scope, so they need their own home. Left red, they hide real regressions in the suite that every spec-kit change runs.

**Purpose:** make the deep-loop-owned tests green by fixing the producer, not the assertion, and clear the deep-loop runtime typecheck errors so the runtime's own gate reports honestly.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `multi-ai-council-persist-artifacts` (two tests): the payload containment check and the fixture seat vantage.
- `review-reducer-fail-closed`: a missing machine-owned strategy anchor must throw a descriptive error.
- `deep-review-auto-restart-contract`: restart must be exposed as a first-class auto setup input in the review command contract.
- The deep-loop runtime's own red vitest files and its `tsc --noEmit` errors.
- Any fixture under the deep-loop runtime that these tests depend on.

### Out of Scope

- Spec-kit-owned red tests (backfill prune gate, migrate-generated-json, repair-derived, nested changelog, spec-root registry). Those belong to the decommission debt packet.
- `fanout-run.cjs`, `executor-audit.ts`, `executor-config.ts`: another session is editing them.
- Any change to the deep-loop mode contracts beyond what a failing test names.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Each named test passes because the producer was fixed; an assertion changes only when the documented contract, not the code, is the authority | P1 |
| REQ-002 | The deep-loop runtime typecheck exits 0 | P1 |
| REQ-003 | No file outside the deep-loop runtime and its tests changes, except the spec-kit CLI test files named above when the fix is in the fixture they carry | P1 |
| REQ-004 | Every fix is verified by rerunning the exact failing test and the whole affected suite | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The four named spec-kit CLI tests pass under the skill-root vitest projects config.
- The deep-loop runtime vitest suite and `tsc --noEmit` both exit 0.
- The implementation summary lists each test, its root cause, and the fix commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A red test encodes a contract decision, not a bug | Report it with both readings instead of picking one; the operator decides |
| Concurrent edits to the executor files by another session | Those files are out of scope; the lane must not touch them |
<!-- /ANCHOR:risks -->
