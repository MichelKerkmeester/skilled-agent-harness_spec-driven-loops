---
title: "Feature Specification: sk-create-diagram adherence audit and artifact completion"
description: "Audit SKILL.md, references, assets, and code against sk-create-skill and sk-code-opencode standards, fix deviations, then author the manual-testing-playbook and feature-catalog packages sk-create-diagram shipped without."
trigger_phrases:
  - "sk-create-diagram adherence audit"
  - "diagram playbook and catalog"
  - "sk-create-skill template verification"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/007-adherence-audit-and-artifact-completion"
    last_updated_at: "2026-08-12T18:40:07.000Z"
    last_updated_by: "claude"
    recent_action: "Ran all 3 dispatches, fixed the gap dispatch 3 left, verified every gate"
    next_safe_action: "Write implementation-summary.md, regenerate metadata, run recursive strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The 39 assets/*.html files are canonical rendered diagram outputs (the skill's deliverable shape), not authored markdown assets — skill-asset-template.md's markdown OVERVIEW/frontmatter structure does not apply to them; naming/cross-reference conventions still do (decision-record.md)."
      - "manual-testing-playbook/ and feature-catalog/ ship as packet-local subdirectories mirroring sk-create-diff's precedent, not as entries in sk-doc's shared master indexes."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram adherence audit and artifact completion

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In progress |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 7 of 8 |
| **Predecessor** | `../006-validation-and-quality-gate/spec.md` |
| **Successor** | `../008-resource-reorganization-and-code-alignment/spec.md` |
| **Handoff Criteria** | Every audit finding is fixed or explicitly deferred; both new packages pass their validators; `validate.sh --recursive --strict` is clean for the parent and all 7 children |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Audit-and-fix-in-place on already-shipped packet content, plus two new packet-local subdirectories (`manual-testing-playbook/`, `feature-catalog/`). No new diagram types, no scope reopening on phases 001-006 decisions.

**Dependencies**: Phase 006 closed the packet as structurally valid; this phase adds the two artifact classes phase 001's `decision-record.md` deferred (playbook) or never addressed (catalog), plus a literal-template adherence pass phase 006's gates did not run.

**Deliverables**: Audit findings with fixes applied, `manual-testing-playbook/` package, `feature-catalog/` package, updated `implementation-summary.md` and `checklist.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 006 ran `validate_skill_package.py`, `ci-skill-root-metadata.cjs`, and `validate.sh --recursive --strict` — all structural/metadata gates — but never diffed the authored `SKILL.md`, 37 references, and 39 assets against `sk-create-skill`'s literal templates section-by-section, and never checked the 2 Python extraction scripts or the config/YAML surfaces against `sk-code-opencode`'s language standards. Separately, phase 001's `decision-record.md` deferred `manual-testing-playbook/` with the justification "sk-create-flowchart ships without either," but sibling `sk-create-diff` ships both — leaving `sk-create-diagram` without the operator-facing validation scenarios and current-state feature inventory that comparable modes carry.

### Purpose

Close both gaps: run a literal template/code-standards adherence audit and fix every deviation found, then author `manual-testing-playbook/` and `feature-catalog/` packages per `sk-create-manual-testing-playbook` and `sk-create-feature-catalog`'s contracts, mirroring `sk-create-diff`'s shipped precedent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Audit `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md` against `sk-create-skill/assets/skill/skill-md-template.md` (frontmatter, numbered ALL-CAPS H2 sections, RULES subsections, no ToC, Smart Router pseudocode shape).
- Audit all 37 files under `.opencode/skills/sk-doc/sk-create-diagram/references/` against `skill-reference-template.md` (5-field frontmatter, 1-2 sentence intro with no duplicated OVERVIEW content, numbered H2 sections).
- Document the asset-template applicability decision for the 39 `.html` files under `assets/` (decision-record.md; no forced markdown restructuring of deliverable HTML).
- Audit `scripts/drawio_extract.py` and `scripts/mermaid_extract.py` against `sk-code-opencode`'s Python style-guide, quality-standards, and `python-checklist.md`.
- Audit `mode-registry.json`/`hub-router.json`/`command-metadata.json` entries, `.opencode/commands/create/diagram.md`, and the 2 command YAML assets against `sk-code-opencode`'s config standards and `command-authoring.md`/`skill-authoring.md` checklists.
- Fix every deviation found, in place, within these same files.
- Author `.opencode/skills/sk-doc/sk-create-diagram/manual-testing-playbook/` (root file + category folders + per-feature files) per `sk-create-manual-testing-playbook`'s package contract.
- Author `.opencode/skills/sk-doc/sk-create-diagram/feature-catalog/` (root file + category folders + per-feature files) per `sk-create-feature-catalog`'s package contract.
- Run `validate_document.py`, the playbook/catalog package validators, and packet-wide `validate.sh --recursive --strict`; fix findings; sweep for residue.

### Out of Scope

- Changes to `sk-create-skill`, `sk-code-opencode`, `sk-create-manual-testing-playbook`, or `sk-create-feature-catalog` themselves — they are the standards being audited against, not audit targets.
- Reopening phases 001-006 scope decisions (icon-set inclusion, agent-mediated onboarding, v1 diagram-type count).
- Adding entries to `sk-doc`'s shared master `manual-testing-playbook/`/`feature-catalog/` indexes — those aggregate across the hub and are not this phase's concern (see decision-record.md).

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `sk-create-diagram/SKILL.md` | Modify (if findings) | Template-adherence fixes |
| `sk-create-diagram/references/*.md` (37 files) | Modify (if findings) | Frontmatter/structure fixes |
| `sk-create-diagram/scripts/*.py` (2 files) | Modify (if findings) | Code-standards fixes |
| `sk-create-diagram/manual-testing-playbook/` | Create | New package |
| `sk-create-diagram/feature-catalog/` | Create | New package |
| `decision-record.md` | Create | Taxonomy and applicability decisions |
| `implementation-summary.md`, `checklist.md` | Create | Phase 7 closeout |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` structurally matches `skill-md-template.md`'s required-section contract. | Numbered ALL-CAPS H2 sections present in order, RULES has ALWAYS/NEVER/ESCALATE IF, no table of contents; deviations fixed or none found. |
| REQ-002 | All 37 references carry the exact 5-field frontmatter block and a 1-2 sentence intro with no duplicated OVERVIEW content. | Spot-checked sample plus scripted frontmatter-field presence check; deviations fixed. |
| REQ-005 | `manual-testing-playbook/` exists with root file + category folders + per-feature files matching the 5-section per-feature contract and `PASS`/`FAIL`/`SKIP` vocabulary. | `validate-playbook-package.cjs` run against the package. |
| REQ-006 | `feature-catalog/` exists with root file + category folders + per-feature files matching the 4-section per-feature contract with source/validation anchor tables. | `validate_document.py` run against root and each leaf. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Asset-template applicability to the 39 HTML assets is explicitly decided and documented, not silently skipped. | `decision-record.md` entry with rationale. |
| REQ-004 | Both Python scripts conform to `sk-code-opencode`'s Python conventions (docstrings, type hints, import order, naming). | `python-checklist.md` items checked; deviations fixed. |
| REQ-007 | Every touched/new file passes its validator and packet-wide `validate.sh --recursive --strict` is clean for parent + all 7 children. | Command output recorded in `implementation-summary.md`. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Template and code-standards audits are complete with documented findings and in-place fixes, or an explicit "no deviation found" record per checked surface.
- **SC-002**: `manual-testing-playbook/` and `feature-catalog/` packages exist, pass their respective validators, and cross-reference each other per the shared boundary contract.
- **SC-003**: `validate.sh --recursive --strict` passes 0 errors for packet 028's parent and all 7 children.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deepseek v4 Flash may give partial coverage across 37+ audited files in one dispatch. | Medium | Explicit file-list prompts per dispatch; independent orchestrator spot-check of a sample plus scripted checks before accepting. |
| Risk | Shared `system-spec-kit/mcp-server` `node_modules` gets re-broken by each `opencode run` dispatch (observed in phases 002-006). | Low | Reuse `fix-node-modules.sh` before each metadata step; fall back to the standalone `compute-metadata.mjs` fingerprint script. |
| Dependency | Phase 006's clean `validate.sh --recursive --strict` baseline | High | Re-run the same command after this phase's changes and diff against the phase 006 baseline. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None remaining — both resolved in `decision-record.md` (asset-template applicability; playbook/catalog placement as packet-local subdirectories, not shared-index entries).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Plan: `plan.md`
- Tasks: `tasks.md`
- Checklist: `checklist.md`
- Decision record: `decision-record.md`
- Packet root: `../spec.md`
- Standards audited against: `.opencode/skills/sk-doc/sk-create-skill/assets/skill/{skill-md-template.md,skill-reference-template.md,skill-asset-template.md}`, `.opencode/skills/sk-code/sk-code-opencode/SKILL.md`, `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/SKILL.md`, `.opencode/skills/sk-doc/sk-create-feature-catalog/SKILL.md`
- Precedent: `.opencode/skills/sk-doc/sk-create-diff/{manual-testing-playbook,feature-catalog}/`
