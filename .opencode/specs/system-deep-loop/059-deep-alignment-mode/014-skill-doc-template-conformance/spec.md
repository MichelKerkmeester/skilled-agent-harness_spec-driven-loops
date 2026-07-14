---
title: "Feature Specification: deep-alignment skill-doc conformance to sk-doc create-skill templates"
description: "Conform the deep-alignment skill's SKILL.md router, README, references, adapter docs, feature_catalog, and behavior_benchmark to the sk-doc create-skill (and create-feature-catalog / create-benchmark) templates: required sections, frontmatter, versions, and human voice, preserving all technical content."
trigger_phrases:
  - "deep-alignment doc conformance"
  - "deep-alignment create-skill template"
  - "deep-alignment SKILL.md smart routing"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/014-skill-doc-template-conformance"
    last_updated_at: "2026-07-13T13:00:00Z"
    last_updated_by: "claude"
    recent_action: "Six groups conformed + verified; adapters HVR-clean; checkers green"
    next_safe_action: "Operator review of stale-availability flag, then commit before merge"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/README.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/adapters"
      - ".opencode/skills/system-deep-loop/deep-alignment/feature_catalog"
      - ".opencode/skills/system-deep-loop/deep-alignment/behavior_benchmark"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "059-014-skill-doc-template-conformance"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions:
      - "Home: new 059 phase child 014 (Gate 3 option D), separate from shipped 011"
      - "Executor: fresh sonnet-5 xhigh markdown agents, one per file group"
---
# Feature Specification: deep-alignment skill-doc conformance to sk-doc create-skill templates

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Branch** | `skilled/v4.0.0.0` (isolated worktree `wt/0035-deep-alignment-doc-conformance`) |
| **Parent Spec** | ../spec.md |
| **Predecessor** | 013-review-remediation (folder-order predecessor only) |
| **Successor** | 015-headless-model-matrix-hardening (folder-order successor only) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-alignment skill shipped with its build phases but its authored docs drifted from the sk-doc `create-skill` templates. The `SKILL.md` router is missing the required `## 2. SMART ROUTING` section (`package_skill.py --check` → FAIL) and its H2 sections are mis-numbered. The `README.md`, the `references/` core docs, the nine `references/adapters/` docs, the `feature_catalog/`, and the `behavior_benchmark/` subtrees pass the frontmatter/name floor but do not fully match their template structure and voice.

### Purpose
Bring every listed doc to template conformance — required sections and ordering, the 5-field doc frontmatter plus a 4-part version, snake_case names, and human voice — while preserving 100% of the technical substance (contracts, schema fields, adapter behavior, scenario definitions). The `SKILL.md` router passes `package_skill.py --check`; every reference/catalog/benchmark doc passes `validate_document.py`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `SKILL.md` router → `create-skill` `skill_md_template.md` + `skill_smart_router.md` (add SMART ROUTING §2, renumber).
- `README.md` → `create-skill` `skill_readme_template.md`.
- `references/{discover_contract,lane_config_schema,scoping_protocol,state_machine_wiring}.md` → `skill_reference_template.md`.
- `references/adapters/*.md` (9 files) → `skill_reference_template.md`.
- `feature_catalog/**` → `create-feature-catalog` templates.
- `behavior_benchmark/**` → `create-benchmark` behavior_benchmark templates.

### Out of Scope
- `manual_testing_playbook/`, `assets/`, `changelog/`, and `scripts/` (not flagged by the operator).
- Any change to skill BEHAVIOR or the runtime `.cjs` — this is a documentation pass only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `deep-alignment/SKILL.md` | Modify | Add SMART ROUTING §2, renumber sections, template conformance |
| `deep-alignment/README.md` | Modify | README template conformance |
| `deep-alignment/references/*.md` (4 core) | Modify | Reference template conformance |
| `deep-alignment/references/adapters/*.md` (9) | Modify | Reference template conformance |
| `deep-alignment/feature_catalog/**` | Modify | Feature-catalog template conformance |
| `deep-alignment/behavior_benchmark/**` | Modify | Behavior-benchmark template conformance |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | SKILL.md router conforms | `## 2. SMART ROUTING` present; sections numbered per template; `package_skill.py --check` → PASS |
| REQ-002 | README conforms | Matches `skill_readme_template.md`; `validate_document.py` clean |
| REQ-003 | Core references conform | 4 files match `skill_reference_template.md`; frontmatter + 4-part version; `validate_document.py` clean |
| REQ-004 | Adapter docs conform | 9 files match the reference template; consistent per-kind shape; `validate_document.py` clean |
| REQ-005 | feature_catalog conforms | Root + per-feature files match create-feature-catalog templates |
| REQ-006 | behavior_benchmark conforms | Root + baseline + scenario files match create-benchmark templates |
| REQ-007 | Content preserved | No technical substance dropped; contracts/schema/scenarios intact |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `package_skill.py --check` on the deep-alignment skill exits PASS.
- **SC-002**: `validate_document.py` passes on every touched reference/catalog/benchmark doc.
- **SC-003**: A diff review confirms no technical content was lost — only structure, frontmatter, and voice changed.
- **SC-004**: `validate.sh --strict` on this 014 packet exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Agents rewrite/drop technical substance | Contract/scenario detail lost | Brief mandates preserve-content; orchestrator diff-reviews before commit |
| Risk | Parallel agents touch overlapping files | Merge conflict | File groups are disjoint (SKILL / README / refs / adapters / catalog / benchmark) |
| Dependency | Python validators | Ground-truth conformance | `package_skill.py` + `validate_document.py` run against worktree paths |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: Conformant docs mean future edits pass the same checkers, keeping the skill canon-clean.

### Correctness
- **NFR-C01**: Zero technical regressions — the docs describe the same behavior after the pass.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Docs already conformant: left byte-stable except a version bump.
- Files with a valid version: bump only the build segment (W+1).

### Error Scenarios
- `validate_document.py` structural failure: agent iterates until clean or reports the residual.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | ~30 doc files across 6 groups |
| Risk | 12/25 | Doc-only; main risk is content preservation |
| Research | 13/20 | Template + exemplar study per group |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. Scope is the operator's explicit file list; `manual_testing_playbook/` was deliberately excluded.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
