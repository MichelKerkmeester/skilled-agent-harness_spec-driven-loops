---
title: "Feature Specification: code-review filesystem names (020 phase 008/004)"
description: "The code-review mode stores review assets, manual-review scenarios, benchmark labels, and reference documents under snake_case names. Those names are embedded in review routing, checklist links, and scenario indexes, so this phase defines a complete kebab-case rename/reference closure without changing review severity or security behavior."
trigger_phrases:
  - "code-review naming migration"
  - "review mode kebab-case"
  - "review playbook path rename"
  - "sk-code review packet migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-review phase spec"
    next_safe_action: "Execute the review packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-review/SKILL.md"
      - ".opencode/skills/sk-code/code-review/assets/"
      - ".opencode/skills/sk-code/code-review/manual_testing_playbook/"
      - ".opencode/skills/sk-code/code-review/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Review findings, severity tiers, security rules, and review identifiers are unchanged."
      - "SKILL.md, README.md, Python/package, generated, tool-mandated, and frozen names remain exact."
      - "This child owns only the code-review subtree and its path/reference closure."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: code-review filesystem names

> Phase adjacency under the sk-code component parent: predecessor 003-code-quality; successor 005-code-webflow.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/004-code-review |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Phase 004 of the sk-code component migration under the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The code-review packet contains snake_case checklist files, review-flow and security scenario directories, a manual_testing_playbook root, benchmark labels, and review reference documents. The review SKILL.md and every scenario use these paths as navigation and verification contracts; a partial rename could make security or evidence scenarios unreachable while leaving the mode apparently healthy.

### Purpose

Rename all in-scope code-review filesystem names to kebab-case and repair the review packet's links and resource paths while preserving findings-first behavior, severity/evidence discipline, security minimums, and exact-name exemptions.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Review assets: code_quality_checklist.md, fix_completeness_checklist.md, removal_plan.md, security_checklist.md, solid_checklist.md, and test_quality_checklist.md.
- The code-review/manual_testing_playbook/ root and its baseline_review_flow, cross_cli_orchestration, efficiency_and_restraint, intra_routing_recall, re_review_and_stale_context, scope_and_precedence, security_and_correctness_minimums, severity_and_evidence_discipline, and structural_impact_preflight categories, including their scenario files.
- Nested benchmark labels live_mode_b/ and router_mode_a/, review references pr_state_dedup.md, quick_reference.md, review_core.md, and review_ux_single_pass.md.
- Code-review SKILL.md, README.md, scenario indexes, relative links, shared/surface resource references, and any path-valued registries that point into this packet.

### Out of Scope

- Findings logic, severity labels, security/correctness rules, review identifiers, code identifiers, JSON/YAML/TOML keys, and frontmatter fields.
- SKILL.md, README.md, package manifests, Python .py files and package directories, generated/lockfile output, tool-mandated names, and frozen changelog/history as physical names.
- Hub/shared, code-opencode, code-quality, code-webflow, hub-level playbook, and root benchmark physical renames owned by sibling children.
- Rewriting review content merely because it mentions an underscore; only filesystem names and path-derived values change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/code-review/assets/** | Rename and reference update | Rename review checklist files and repair packet links. |
| .opencode/skills/sk-code/code-review/manual_testing_playbook/** | Rename and reference update | Rename review-flow/category/scenario paths and the root index path. |
| .opencode/skills/sk-code/code-review/references/** | Rename and reference update | Rename review reference files and update their links. |
| .opencode/skills/sk-code/code-review/benchmark/** | Rename and path update | Rename live_mode_b and router_mode_a labels when classified as tracked names. |
| .opencode/skills/sk-code/code-review/SKILL.md and README.md | Reference update | Preserve review contracts while replacing old path literals. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope review name has a unique kebab-case target | The frozen map covers assets, all listed scenario categories/files, references, and benchmark labels with no unknown or collision row. |
| REQ-002 | Review navigation and resource loading remain complete | SKILL.md, README.md, indexes, scenario links, shared/surface references, and benchmark paths resolve with no active old basename. |
| REQ-003 | Review behavior remains equivalent | Findings-first output, severity/evidence checks, security minimums, and review-state handling match BASE evidence. |
| REQ-004 | Exemption boundary remains intact | Exact names, Python/package, generated/lockfile, identifiers/keys, frontmatter fields, and frozen history remain unchanged. |
| REQ-005 | Cross-component edges are handed off | The child records every reference into shared, surface, or root-playbook paths for the final subtree gate. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under code-review.
- **SC-002**: Every review asset, scenario, reference, benchmark, and cross-surface link resolves.
- **SC-003**: Review findings, security checks, and scenario discovery match BASE.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The review packet is path-dense and contains security and correctness scenarios whose absence can look like a green review if discovery is not checked. The mitigation is an explicit scenario inventory, non-zero discovery counts, link resolution, and behavior parity against BASE. The phase depends on the frozen map and the shared/OpenCode/quality handoffs but does not authorize changes to their content.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must distinguish review scenario names from code-review identifiers and preserve the latter even when an identifier contains an underscore.
<!-- /ANCHOR:questions -->
