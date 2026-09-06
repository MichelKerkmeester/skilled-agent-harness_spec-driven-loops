---
title: "Feature Specification: path-containment-seam"
description: "The CLI checked write boundaries three different ways: lexically in the changelog generator, realpath-only in the description generator, and canonically in the shared utilities. One helper now owns the check so every boundary rejects the same escapes."
trigger_phrases:
  - "path containment seam"
  - "write boundary helper"
  - "assertPathInsideRoot"
  - "symlinked parent escape"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: path-containment-seam

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 22 of 24 |
| **Predecessor** | `../021-decommission-debt-and-cli-nesting/spec.md` |
| **Successor** | `../023-trigger-index-root-and-drift-fixes/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The nesting review found the CLI's write-boundary check implemented three times with three different strengths. The changelog generator compared paths lexically until a review pass showed a symlinked parent could carry a write outside the root; the description generator resolved both sides through `realpathSync` and exited on a broken link; the shared utilities canonicalized the existing prefix and fell back when the target did not exist yet. Three copies mean one fix never reaches the other two.

**Purpose:** one exported helper owns the check, and every CLI write boundary calls it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `runtime/cli/utils/path-utils.ts`: export `canonicalizeExistingPrefix`, `isPathInsideRoot` and `assertPathInsideRoot`.
- `runtime/cli/spec-folder/nested-changelog.ts` and `generate-description.ts` call the helper instead of their own checks.
- A unit test for the helper covering a not-yet-existing target inside the root, a lexical escape, an absolute outside path, an escaping symlinked parent and a symlinked parent that stays inside.

### Out of Scope
- The deep-loop council guard: it lives in another package with its own audit trail.
- Read-side path allowlisting in `sanitizePath` and the shared `validateFilePath`; they answer a different question and keep their contracts.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Priority |
|----|-------------|----------|
| REQ-001 | Every CLI write boundary calls the shared helper; no local containment logic remains in the two generators | P1 |
| REQ-002 | The helper canonicalizes the existing prefix of both root and target so a symlinked parent cannot escape, and accepts a target that does not exist yet | P1 |
| REQ-003 | Existing consumer behavior is preserved: the changelog override still throws with a named error, the description generator still exits 1 | P1 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The helper's unit test and both consumers' tests pass; the CLI typechecks and its dist is fresh.
- `rg` shows the two generators import the helper and carry no `startsWith('..')` or `realpathSync` containment of their own.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A consumer relied on the older, weaker check accepting a path the helper rejects | Both consumers' suites and the identity-safety spawn test rerun green |
<!-- /ANCHOR:risks -->
