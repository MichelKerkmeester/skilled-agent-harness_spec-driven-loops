---
title: "Feature Specification: Phase 11: skdoc-doc-conformance"
description: "sk-doc conformance audit and remediation of all 83 deep-alignment markdown docs (4 P0, 13 P1, 11 P2 findings fixed), the snake_case category-folder convention applied to this packet's slice (12 folders, 223 path references), and a build-state honesty reconcile correcting 12 docs that still described the shipped command/agent/workflows as not yet built."
trigger_phrases:
  - "sk-doc conformance audit"
  - "deep-alignment doc conformance"
  - "snake_case category folder convention"
  - "build-state honesty reconcile"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-deep-alignment-mode/011-skdoc-doc-conformance"
    last_updated_at: "2026-07-13T07:07:57Z"
    last_updated_by: "claude"
    recent_action: "Fixed sk-doc gaps, renamed folders to snake_case, reconciled build-state claims"
    next_safe_action: "Review the three flagged items with operator"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/README.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/feature_catalog/"
      - ".opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-skdoc-doc-conformance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Category-subfolder renames apply only to feature_catalog/ and manual_testing_playbook/ subfolders, not to skill/mode-packet/spec folders or per-feature file slugs, per the operator's stated exception."
      - "behavior_benchmark's shared missing-overview false positive is explicitly out of scope, owned by a separate repo-wide task."
status: "complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: skdoc-doc-conformance

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-11 |
| **Branch** | `deep-alignment/011-skdoc-doc-conformance` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 — cross-cutting documentation-conformance maintenance pass over the packet's own shipped docs, not a sequential build phase in the original 000-010 DAG (see Phase Context) |
| **Predecessor** | 010-adapter-sk-design-live-render (folder-order predecessor only, not a strict DAG dependency) |
| **Successor** | 012-behavior-benchmark-capture (folder-order successor only, not a strict DAG dependency) |
| **Handoff Criteria** | Met: the final validator sweep and link check both ran clean against the packet's own shipped docs (71/83 valid, the 12 exceptions a known out-of-scope shared-infra false positive; 224/224 links resolve), and every stale build-state claim the audit found is corrected — see Verification in `implementation-summary.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the `deep-alignment` deep-loop mode specification (`.opencode/specs/system-deep-loop/032-deep-alignment-mode/`).

**Scope Boundary**: by the time phases 000-010 landed, `deep-alignment` shipped 83 markdown docs under `.opencode/skills/system-deep-loop/deep-alignment/` (`SKILL.md`, `README.md`, a 22-file `feature_catalog/`, a 31-file `manual_testing_playbook/`, 4 `references/` contract docs, and `changelog/`), none of which had been checked against the sk-doc creation standards the mode's own phase 005 adapter exists to enforce on other skills. This phase closes that gap, using the same validators (`validate_document.py`, `extract_structure.py`) the mode wraps. Phase numbers are folder IDs, not a strict execution order, a convention the parent's own phase 010 already established when it joined as a DAG peer rather than a sequential successor; this phase continues that pattern for a genuinely later-emerging workstream: self-referential doc QA, plus two smaller cross-cutting fixes that surfaced during the same pass.

**Dependencies**:
- The sk-doc creation standards, `validate_document.py`, and `extract_structure.py` (the same authority phase 005's reference adapter wraps for other skills) are the deterministic ground truth this pass checks every doc against.
- The operator's snake_case category-folder-convention directive scoped this packet's category subfolders (excluding skill/mode-packet/spec folders and per-feature file slugs, per the stated exception).
- `mode-registry.json`'s `"alignment"` entry (landed in phases 003/008/009) is the ground truth the build-state honesty reconcile verified doc claims against.

**Deliverables**:
- Every deep-alignment-LOCAL sk-doc conformance gap fixed across `SKILL.md`, `README.md`, `feature_catalog/`, `manual_testing_playbook/`, and `references/`.
- 12 category subfolders renamed kebab-case to snake_case and 223 path references rewritten across 54 files.
- 12 docs corrected from stale "not yet built" framing to the real, disk-verified BUILT and REGISTERED state.
- A final validator sweep and link check across all 83 docs, recorded honestly, including known out-of-scope false positives.

**Changelog**:
- When this phase closes, refresh the matching file in `../changelog/` using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A parallel sk-doc conformance audit of `deep-alignment`'s own 83 shipped docs returned MAJOR_GAPS: 4 P0, 13 P1, and 11 P2 findings against the 25 clean files. Separately, the packet's `feature_catalog/` and `manual_testing_playbook/` category subfolders used kebab-case names that didn't match the operator's snake_case convention, and 12 docs still described `/deep:alignment`, its YAML workflows, and `@deep-alignment` as "not yet built" or "does not exist yet" even after phases 008-009 had already shipped and registered them.

### Purpose
Fix every deep-alignment-LOCAL sk-doc conformance gap the audit found, rename this packet's category subfolders to snake_case and rewrite every reference to them, and reconcile every doc's build-state language with the real, verified-on-disk state, so the mode's own documentation meets the bar it holds other skills to.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remediate sk-doc conformance gaps across `SKILL.md`, `README.md`, `feature_catalog/` (root index + 21 leaves), `manual_testing_playbook/` (31 files), and `references/` (4 contract docs) — every deep-alignment-LOCAL gap the audit found.
- Rename kebab-case category subfolders under `feature_catalog/` (4) and `manual_testing_playbook/` (8) to snake_case via `git mv`, and rewrite every path reference to them.
- Reconcile 12 docs' stale "not yet built" build-state framing against the real, disk-verified BUILT and REGISTERED state of `/deep:alignment`, its two YAML workflows, and `@deep-alignment`.
- Run a final validator sweep and link check across all 83 docs and record the result honestly, including known out-of-scope false positives.

### Out of Scope
- The `behavior_benchmark` family's "missing overview" false positive (12 files) — a shared-infra validator-registration gap governed by `shared/behavior-benchmark/framework.md`, reproduces on all 4 sibling benchmark packages repo-wide, deferred to the repo-wide convention/canon task.
- The broader repo-wide kebab-to-snake_case category-folder migration and the sk-doc canon template updates that accompany it — a separate task; this phase executed only the deep-alignment slice.
- `feature_catalog/adapter_contract/adapter-sk-doc.md`'s pre-existing minor path-citation nit (it cites the `sk-doc/scripts/` symlink path rather than the real `shared/scripts/` path) — left out of scope, flagged in Risks below.
- Any code or behavior change to the mode itself. This phase is documentation-only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Modify | Added SMART ROUTING, ESCALATE IF, SUCCESS CRITERIA; trimmed frontmatter description; fixed REFERENCES |
| `.opencode/skills/system-deep-loop/deep-alignment/README.md` | Modify | Added Feature Catalog and Manual Testing Playbook subsections to VERIFICATION |
| `.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/` (root index + 21 leaves, 22 files) | Modify | Current Reality rename, frontmatter fields, taxonomy normalization, SOURCE METADATA, trigger_phrases fixes |
| `.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/` (31 files) | Modify | Blank-line fix under TEST EXECUTION, 17 feature-catalog cross-reference additions |
| `.opencode/skills/system-deep-loop/deep-alignment/references/` (4 contract docs) | Modify | OVERVIEW heading rename, a hyperlink fix, DAB-011 citation correction |
| `.opencode/skills/system-deep-loop/deep-alignment/feature_catalog/*/` (4 category folders) | Rename (git mv) | kebab-case to snake_case |
| `.opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/*/` (8 category folders) | Rename (git mv) | kebab-case to snake_case |
| 54 files across the packet | Modify | 223 path references rewritten to the renamed snake_case folders |
| 12 docs across the packet | Modify | Stale "not yet built" build-state framing corrected to BUILT and REGISTERED |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every deep-alignment-LOCAL sk-doc conformance gap the audit found (4 P0, 13 P1, 11 P2 across 83 docs) is remediated. | A final `validate_document.py`/`extract_structure.py` sweep over all 83 md returns 71 valid; the only 12 invalid are the documented `behavior_benchmark` false positive, explicitly out of scope. |
| REQ-002 | `SKILL.md`'s `missing_required_section: smart_routing` validator failure is fixed. | `SKILL.md`'s validator result flips from false to true after adding `## 2. SMART ROUTING` (Resource Loading Levels plus Smart Router Pseudocode). |
| REQ-003 | Every path reference broken or left stale by the snake_case category-folder rename is rewritten. | 0 residual kebab-case path forms and 0 broken links across the 54 files referencing the renamed folders. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Every doc carrying stale "not yet built" framing for now-BUILT-and-REGISTERED artifacts is corrected. | 12 docs corrected; 0 residual stale build-state claims except the two explicitly flagged permanent design facts (`remediate-hook.cjs`'s no-op stub, the intentionally absent live-render known-deviations file). |
| REQ-005 | The final link check across all 83 docs passes clean. | 224 relative links checked, 0 broken. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Validator sweep across all 83 docs returns 71 valid, with the 12 exceptions a documented, out-of-scope `behavior_benchmark` false positive rather than an unexplained gap.
- **SC-002**: Relative link check across the packet's docs returns 224 checked links and 0 broken.
- **SC-003**: 0 residual stale build-state claims outside the two flagged permanent design facts.
- **SC-004**: 0 residual kebab-case category-folder path forms after the rename, with all 223 rewritten references verified resolving.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `behavior_benchmark`'s shared validator-registration gap is owned outside this phase | 12 of 83 files can never show "valid" until the repo-wide task fixes validator registration | Documented explicitly as a known false positive rather than silently ignored or fabricated as fixed |
| Dependency | A separate repo-wide kebab-to-snake_case migration task still touches the sk-doc canon templates | If that task's final convention differs from what this phase applied, `deep-alignment`'s folders may need a second pass | This phase's rename strictly followed the operator's already-given directive and left skill/mode-packet/spec folders and per-feature file slugs untouched, per the stated exception |
| Risk | The `v1.0.0.0` changelog now reads as a cumulative establishment record rather than a point-in-time entry | May not match the repo's usual version-entry convention | Flagged for operator confirmation, not silently resolved, see Open Questions |
| Risk | `adapter_contract/adapter-sk-doc.md` cites a stale `sk-doc/scripts/` symlink path | Could mislead a future reader about the real `shared/scripts/` location | Left as an explicit out-of-scope flag rather than silently fixed outside this phase's audited scope |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Version treatment: should the `v1.0.0.0` changelog's now-cumulative-establishment-record framing stand, or should this split into a dedicated later changelog entry? Operator decision needed, see `implementation-summary.md` "Flags / operator decisions".
- `behavior_benchmark`'s shared "missing overview" false positive (12 files): deferred to the repo-wide convention/canon task, not this phase's to fix.
- `adapter_contract/adapter-sk-doc.md`'s stale `sk-doc/scripts/` symlink citation: pre-existing minor accuracy nit, left out of scope.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
