---
title: "Implementation Plan: Phase 4 — hub reconcile + adjacent fixes + validate"
description: "Point hub-level docs at the per-mode catalogs, fix the three approved adjacent defects (version skew + phantom scripts/ dir), and run the full conformance battery to close the packet."
trigger_phrases:
  - "hub reconcile provider pointers plan"
  - "version skew reconcile plan"
  - "stale scripts reference removal plan"
  - "cli conformance gates approach"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/033-per-mode-provider-model-reference/004-hub-reconcile-and-validate"
    last_updated_at: "2026-07-29T09:18:46Z"
    last_updated_by: "implementer"
    recent_action: "Reconciled hub docs, fixed adjacent defects, ran conformance battery"
    next_safe_action: "Optional /memory:save to stamp continuity fingerprints and close the packet"
    blockers: []
    key_files:
      - "SKILL.md"
      - "README.md"
      - "hub-router.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "plan-033-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4 — hub reconcile + adjacent fixes + validate

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown hub docs + JSON hub metadata |
| **Framework** | cli-external-orchestration parent hub (class-H) |
| **Storage** | `SKILL.md`, `README.md`, `hub-router.json`, `changelog/` |
| **Testing** | `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs`, `generate-leaf-manifest.cjs --check`, `validate.sh --strict`, `advisor_validate` |

### Overview
Close the packet: add hub-level pointers to the new per-mode catalogs, fix the three operator-approved adjacent defects surfaced during exploration (version skew and a phantom `scripts/` directory), and prove the whole hub still conforms by running every relevant gate. No new content authoring; edits are surgical and confined to the approved scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hub-level reconcile + targeted defect repair + full conformance gate — no structural change to the hub, only pointer bullets, two version-field bumps, and removal of a phantom directory reference.

### Key Components
- **Hub docs (`SKILL.md` §5, `README.md`)**: gain a pointer to the per-mode `providers-and-models.md` catalogs.
- **Version reconcile**: `hub-router.json` + `README.md` frontmatter aligned 1.1.0.0 → 1.2.0.0 (matching SKILL.md / mode-registry.json / description.json).
- **Phantom `scripts/` removal**: `cli-opencode/scripts/` mentions dropped from the SKILL.md layout tree and README §2 (directory does not exist on disk).

### Data Flow
Reader lands on the hub → SKILL.md/README pointer → the per-mode catalog. Conformance battery reads the reconciled hub root and validates class-H cleanliness + spec conformance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Fixes three approved adjacent defects (version skew + phantom directory reference), so the affected-surface inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `SKILL.md` | Hub layout + §5 references | add catalog pointer; remove phantom `scripts/` | `parent-skill-check.cjs`; `scripts/` absent on disk |
| `README.md` | Hub overview + §2 prose | add pointer; version → 1.2.0.0; remove phantom `scripts/` | version grep; `ci-skill-root-metadata.cjs` |
| `hub-router.json` | Hub metadata (version field only) | version → 1.2.0.0 (no model-token change) | `git diff` shows only the version field |
| `changelog/*` | Change record | add entries for changed docs | present for phases 002/003/004 |
| Advisor-routing JSON model tokens | Functional routing signal | unchanged | `advisor_validate` clean; routing smoke 6/6 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phases 1-3 complete
- [x] Grep all hub root files for the lagging version (1.1.0.0) and the phantom `cli-opencode/scripts/` reference

### Phase 2: Core Implementation
- [x] Add a catalog pointer bullet to parent `SKILL.md` §5 and `README.md`
- [x] Align `hub-router.json` + `README.md` frontmatter version 1.1.0.0 → 1.2.0.0 (version field only, no model-token change)
- [x] Remove the phantom `cli-opencode/scripts/` reference from the SKILL.md layout tree and README §2 prose
- [x] Add `changelog/` entries for the changed docs

### Phase 3: Verification
- [x] `ci-skill-root-metadata.cjs` — PASS (11/11, hub clean class-H)
- [x] `parent-skill-check.cjs` — PASS (all hard invariants, 0 warnings); `generate-leaf-manifest.cjs --check` — fresh
- [x] `validate.sh` per child + recursive `--strict` — Errors: 0; `advisor_validate` clean; routing smoke 6/6 at 0.95
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Conformance | Hub root metadata + router invariants | `ci-skill-root-metadata.cjs`, `parent-skill-check.cjs` |
| Freshness | Leaf manifest | `generate-leaf-manifest.cjs --check` |
| Spec | Per-child + recursive Level-1 conformance | `validate.sh --strict` |
| Routing | Advisor health + provider-named prompt routing | `advisor_validate`, advisor recommend |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1-3 complete | Internal | Green | Nothing to reconcile or validate |
| Conformance scripts (`sk-doc/create-skill/scripts`, `commands/doctor/scripts`) | Internal | Green | Cannot prove conformance |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any conformance gate fails, or the version bump misses a co-versioned file / touches a model token.
- **Procedure**: `git checkout` `SKILL.md`, `README.md`, `hub-router.json`, and `changelog/` to the pre-phase state; re-run `ci-skill-root-metadata.cjs` and `parent-skill-check.cjs` to confirm the hub is restored to a clean baseline before retrying.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
