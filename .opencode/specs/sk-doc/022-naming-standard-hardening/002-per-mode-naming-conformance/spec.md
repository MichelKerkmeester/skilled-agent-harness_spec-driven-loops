---
title: "Feature Specification: Per-Mode Naming Conformance"
description: "Only two of about ten sk-doc modes verify kebab filenames in code; the rest state it in prose with no checker, the validation mode points authors at the stale standard doc, and one guide contradicts the on-disk kebab reality. This phase gives each generating mode a kebab conformance check and reconciles the mode docs to the canon."
trigger_phrases:
  - "per-mode naming conformance"
  - "kebab conformance check"
  - "mode naming enforcement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/002-per-mode-naming-conformance"
    last_updated_at: "2026-07-20T12:28:09Z"
    last_updated_by: "codex"
    recent_action: "Implemented shared kebab checker and wired generating mode workflows"
    next_safe_action: "Operator can run central metadata generation and packet validation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Per-Mode Naming Conformance

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-07-20 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `sk-doc/022-naming-standard-hardening` |
| **Phase** | 2 of 2 |
| **Predecessor** | `../001-fix-shared-standard-and-wire-guards/spec.md` |
| **Successor** | None |
| **Handoff Criteria** | Each generating mode has a kebab conformance check; create-quality-control cites the canon |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Naming Standard Hardening packet — the per-mode half. With the shared standard reconciled and the guards wired (Phase 1), this phase gives each mode a conformance check for the artifacts it generates and aligns the remaining mode docs to the canon.

**Scope Boundary**: Per-mode naming enforcement and mode-doc reconciliation under `sk-doc/`. No shared-doc or guard-wiring work (that is Phase 1), no on-disk renames.

**Dependencies**:
- Phase 1: the shared standard and gate must be reconciled first, so per-mode checks reference a consistent canon.
- The legacy underscore content roots still on disk (see Risks) constrain how the catalog/playbook guard is wired.

**Deliverables**:
- A kebab conformance check reachable by every generating mode.
- create-quality-control re-anchored to the canon.
- create-benchmark doc drift reconciled.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Only two of about ten sk-doc modes verify kebab filenames in code: create-skill (`package_skill.py check_generated_paths`, blocking only under `--strict`/packaging and invoked manually) and create-diff (its engine). create-agent, create-readme, create-command, create-changelog, create-flowchart, and create-benchmark state kebab in prose with no checker, relying entirely on model compliance. create-feature-catalog and create-manual-testing-playbook have a real shared checker (`check_no_hyphenated_catalog_content.py`) that nothing runs. Meanwhile create-quality-control — the validation and scoring mode — routes authors to the stale `core-standards.md` as the structural-standards source (`create-quality-control/README.md:44`, `SKILL.md:459`) and scores no filename-case signal, and `create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md:67` claims a directory "uses an underscore" though on disk it is kebab.

### Purpose
Give every generating mode a kebab conformance check for its own artifacts, and align the mode docs — especially the validation mode — to the kebab canon so conformance is checked, not just described.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Provide a kebab conformance check reachable by the prose-only modes (create-agent, create-readme, create-command, create-changelog, create-flowchart, create-benchmark): either one shared authored-name checker every mode invokes, or a per-mode check. (Design decision resolved in plan.md.)
- Wire the existing `check_no_hyphenated_catalog_content.py` into the create-feature-catalog and create-manual-testing-playbook workflows, sequenced around the shipped underscore roots (see Risks).
- Re-anchor create-quality-control's structural-standards pointer from `core-standards.md` to `filesystem-naming-convention.md`; add a filename-case conformance signal to its validation output.
- Reconcile `create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md:67` to the on-disk kebab reality; cite `filesystem-naming-convention.md` §6 for the legitimate snake_case family-key exemption.
- Fix the cosmetic counter-example in `create-skill/assets/skill/skill-asset-template.md:691` (underscore "wrong" example rendered with hyphens).

### Out of Scope
- The shared standard doc and guard wiring — Phase 1.
- New guard/checker logic beyond wiring and a thin shared conformance check.
- Renaming the legacy underscore content roots on disk — a separate content workstream.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| A shared authored-name kebab checker (or per-mode checks) | Create | Reachable conformance check for generating modes |
| create-feature-catalog + create-manual-testing-playbook workflow docs | Modify | Wire `check_no_hyphenated_catalog_content.py` |
| `create-quality-control/{README.md,SKILL.md}` | Modify | Re-anchor to the canon; add filename-case signal |
| `create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md` | Modify | Fix the underscore claim; cite canon §6 |
| `create-skill/assets/skill/skill-asset-template.md` | Modify | Fix the cosmetic counter-example |

### Implemented Files

| File Path | Result |
|-----------|--------|
| `shared/scripts/check_authored_name_kebab.py` | Added one shared authored basename/slug checker with canon exemptions delegated to `check_no_new_snake_case.py` |
| `scripts/tests/test_authored_name_kebab.py` | Added focused kebab, underscore, and exemption coverage |
| `create-{agent,readme,command,changelog,flowchart,benchmark}/SKILL.md` | Added a reachable shared-checker workflow step |
| `create-{feature-catalog,manual-testing-playbook}/SKILL.md` | Wired the catalog/playbook guard to an isolated new-content staging root |
| `create-quality-control/{README.md,SKILL.md}` | Re-anchored structural naming and added a non-scored filename-case signal |
| `create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md` | Corrected the on-disk kebab directory claim and cited canon §6 |
| `create-skill/assets/skill/skill-asset-template.md` | Corrected the underscore counter-example |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every generating mode can reach a kebab conformance check for its artifacts. | Each prose-only mode either invokes the shared checker or ships a per-mode check; a deliberate snake_case generated name is flagged. |
| REQ-002 | create-quality-control cites the canon, not the stale doc. | `README.md`/`SKILL.md` point structural-naming authority at `filesystem-naming-convention.md`; a filename-case signal appears in its validation output. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The catalog/playbook checker is wired, sequenced around shipped underscore roots. | The checker runs for new catalog/playbook content without red-flagging pre-existing underscore roots. |
| REQ-004 | create-benchmark doc drift reconciled. | `model-benchmark-fixture-guide.md:67` matches the on-disk kebab dir; the family-key exemption cites canon §6. |
| REQ-005 | Cosmetic counter-example fixed. | `skill-asset-template.md:691` shows an actual underscore in the "wrong" example. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A generated snake_case artifact name is flagged by a check for every generating mode, not only create-skill and create-diff.
- **SC-002**: No sk-doc mode doc points authors at a snake_case filename rule; create-quality-control cites `filesystem-naming-convention.md`.
- **SC-003**: `validate.sh --strict` on this phase reports Errors: 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `naming_root_resolver.py` hard-errors (`UnsupportedRootError`/`RootCoexistenceError`) on underscore roots, but legacy underscore content roots still ship on disk (e.g. `system-spec-kit/feature_catalog/`) | High — wiring the catalog guard could hard-error on shipped trees | Scope the catalog/playbook guard to new content only, or exclude the known shipped roots, until their separate content migration lands; this packet does not rename them |
| Dependency | Phase 1 (shared standard + gate) | Med | Execute Phase 1 first so per-mode checks reference a consistent canon |
| Risk | A shared checker vs per-mode checks changes many mode workflows | Med | Resolve the design in plan.md; prefer one shared authored-name checker to minimize per-mode surface |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Resolved**: One shared authored-name checker is invoked by every prose-only generating mode.
- **Resolved**: create-quality-control reports filename case as a non-scored signal; DQI components are unchanged.
<!-- /ANCHOR:questions -->
