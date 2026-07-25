---
title: "Feature Specification: Post-019 Feature-Catalog Accuracy Remediation"
description: "Correct ten confirmed feature-catalog claims that disagree with current registries, hooks, command metadata, validation anchors, or the live filesystem. Preserve the catalogs as current-state inventories backed only by durable source evidence."
trigger_phrases:
  - "post-019 feature catalog remediation"
  - "feature catalog accuracy findings"
  - "catalog reality drift"
importance_tier: "important"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/016-documentation-quality-program/012-fix-post-019-alignment-p1-findings-for-feature-catalog-accuracy"
    last_updated_at: "2026-07-25T13:29:20Z"
    last_updated_by: "opencode"
    recent_action: "Corrected all ten catalog findings and passed strict packet validation."
    next_safe_action: "None; the catalog remediation is complete."
    blockers: []
    key_files: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Post-019 Feature-Catalog Accuracy Remediation

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-25 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 12 of 12 |
| **Predecessor** | `011-review-remediation` |
| **Successor** | None |
| **Handoff Criteria** | Ten findings corrected, source paths verified, catalog validation green |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The sealed post-019 alignment run confirmed ten P1 documentation defects across three feature-catalog families. The defects include stale packet counts, obsolete phase narration, a hook status contradicted by the live registry, a broken workflow path pattern, command metadata drift, an inaccurate validation anchor, and two catalogs that claim nonexistent implementations and tests.

This phase restores each catalog to a current-state inventory supported by live, durable source anchors.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Correct the three `cli-external-orchestration` catalog defects while removing mutable phase-history evidence.
- Correct the `sk-code` shared workflow-doctrine path.
- Reconcile the `sk-design` catalog defects with live command, playbook, and filesystem evidence.
- Synchronize four descriptive `command-metadata.json` argument hints to the already-live command frontmatter.
- Run current feature-catalog and document validators against every changed file.

### Out of Scope

- Creating the absent styles retrieval engines or indexed database backend.
- Changing hook behavior, live command arguments, routing policy, or application code.
- Rewriting unrelated catalog prose.

### Files to Change

| File Group | Change |
|------------|--------|
| `cli-external-orchestration/feature-catalog/**` | Correct four-packet and live hook claims; remove phase/spec evidence |
| `sk-code/feature-catalog/two-axis-registry-driven-routing/**` | Correct durable workflow paths |
| `sk-design/feature-catalog/**` | Align command, validation, and styles-library claims to live evidence |
| `sk-design/command-metadata.json` | Align four descriptive argument hints to live command frontmatter |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Priority | Requirement | Acceptance Criteria |
|----|----------|-------------|---------------------|
| REQ-001 | P0 | Every current-state claim must resolve to a live source or validation anchor. | All referenced paths exist and relevant validators pass. |
| REQ-002 | P0 | Catalogs must not use mutable phase narration or numbered spec outputs as runtime authority. | Changed catalogs contain no phase-history authority or numbered-spec source rows. |
| REQ-003 | P0 | The CLI executor catalog must describe all four registered workflows. | Root and leaf agree with `mode-registry.json`. |
| REQ-004 | P0 | Cursor MCP hook status must match `.cursor/hooks.json`. | Catalog records the guard as wired and uses durable hook/playbook evidence. |
| REQ-005 | P1 | `sk-code` workflow doctrine paths must use the live hyphenated filenames. | All three workflow files resolve. |
| REQ-006 | P1 | Design command metadata and manager-shell claims must match live commands and playbooks. | Command surface check passes; validation row points to a real boundary playbook. |
| REQ-007 | P1 | Absent styles backends must not be described as shipped. | Both leaves state the current absence without nonexistent source/test tables. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ten confirmed findings have a one-to-one correction and evidence row.
- **SC-002**: Feature-catalog validation and strict packet validation exit 0.
- **SC-003**: No runtime behavior, live command grammar, or routing decision changes.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sealed alignment report | Finding scope could drift | Keep the ten report entries as the closed inventory. |
| Risk | Correcting docs by changing runtime behavior | Scope expansion | Treat registries, hooks, commands, and filesystem as authority; edit catalogs only. |
| Risk | Deleting unshipped feature leaves hides roadmap intent | Loss of discoverability | Retain leaves as explicit unavailable/current-gap records rather than fabricating implementation. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The live source-of-truth files resolve every finding.
<!-- /ANCHOR:questions -->
