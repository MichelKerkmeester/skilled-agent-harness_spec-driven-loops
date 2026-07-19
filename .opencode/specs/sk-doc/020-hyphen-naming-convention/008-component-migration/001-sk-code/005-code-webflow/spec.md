---
title: "Feature Specification: code-webflow filesystem names (020 phase 008/005)"
description: "The code-webflow surface contains snake_case asset files, animation and implementation reference trees, manual-playbook categories, and benchmark labels. These names are embedded in browser/runtime guidance and links, so this phase defines a complete kebab-case rename/reference closure while preserving Webflow, JavaScript, CSS, HTML, and Motion.dev behavior."
trigger_phrases:
  - "code-webflow naming migration"
  - "Webflow packet kebab-case"
  - "Webflow asset path rename"
  - "animation reference path migration"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-webflow phase spec"
    next_safe_action: "Execute the Webflow packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-webflow/SKILL.md"
      - ".opencode/skills/sk-code/code-webflow/assets/"
      - ".opencode/skills/sk-code/code-webflow/references/"
      - ".opencode/skills/sk-code/code-webflow/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Webflow, JavaScript, CSS, HTML, and Motion.dev behavior is out of scope for redesign."
      - "SKILL.md, README.md, Python/package, generated, tool-mandated, and frozen names remain exact."
      - "This child owns only the code-webflow subtree and its path/reference closure."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: code-webflow filesystem names

> Phase adjacency under the sk-code component parent: predecessor 004-code-review; successor 006-manual-testing-playbook.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/005-code-webflow |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Phase 005 of the sk-code component migration under the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The code-webflow packet has snake_case names throughout its animation snippets, integration/pattern/template assets, manual-testing-playbook categories, and deep reference tree. It also contains workflow symlink nodes and benchmark labels. Webflow guidance is heavily cross-linked, so a filename-only sweep can leave broken links, stale load paths, or a missing animation resource while still passing a shallow directory check.

### Purpose

Rename every in-scope code-webflow filesystem name to kebab-case, repair all path and symlink references, and prove that Webflow/browser, JavaScript, CSS, HTML, performance, deployment, and Motion.dev resource discovery remains equivalent.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Asset files under animation/, integrations/, patterns/, and templates/, including animate_on_scroll.js, cdn_bootstrap.js, es_module_bootstrap.js, hover_gesture.js, in_view_reveal.js, layout_transition.js, principled_reveal.js, spring_animation.js, stagger_animation.js, timeline_sequence.js, hls_patterns.js, lenis_patterns.js, interaction_gate_patterns.js, performance_patterns.js, validation_patterns.js, wait_patterns.js, component_template.css, component_template.js, embed_template.html, form_scaffold_template.html, and head_footer_code_template.html.
- Root asset checklists webflow_debugging_checklist.md and webflow_verification_checklist.md.
- The code-webflow/manual_testing_playbook/ root, deployment_forms_video/, implementation_quality/, language_standards/, and performance_animation/ categories and their routing scenario files.
- Reference directories and files under animation, css, debugging, deployment, html, implementation, javascript, performance, shared, and verification, including animation_workflows, async_patterns, focus_management, form_upload_workflows, implementation_workflows, observer_patterns, performance_patterns, security_patterns, swiper_patterns, third_party_integrations, webflow_patterns, debugging_workflows, minification_guide, dev_workflow, and verification_workflows.
- Nested benchmark labels live_mode_b/ and router_mode_a/, workflow symlink consumers, SKILL.md/README.md path values, and all markdown links into this surface.

### Out of Scope

- Webflow/runtime implementation, Motion.dev API semantics, CSS/HTML/JavaScript identifiers, selector/data attributes, JSON/YAML/TOML keys, and frontmatter fields.
- SKILL.md, README.md, package manifests, Python .py files and package directories, generated/lockfile output, tool-mandated names, and frozen changelog/history as physical names.
- Hub/shared source names, code-opencode, code-quality, code-review, hub-level playbook, and root benchmark physical renames owned by sibling children.
- Mechanical rewriting of prose or code identifiers that happen to contain underscores; only filesystem names and path-derived values change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/sk-code/code-webflow/assets/** | Rename and reference update | Rename asset files/directories and update links in asset indexes and references. |
| .opencode/skills/sk-code/code-webflow/manual_testing_playbook/** | Rename and reference update | Rename playbook categories and routing scenario paths. |
| .opencode/skills/sk-code/code-webflow/references/** | Rename and reference update | Rename reference tree directories/files and repair all links. |
| .opencode/skills/sk-code/code-webflow/benchmark/** | Rename and path update | Rename live_mode_b and router_mode_a labels when classified as tracked names. |
| .opencode/skills/sk-code/code-webflow/SKILL.md and README.md | Reference update | Preserve surface routing while replacing old resource paths. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every in-scope Webflow name has a unique kebab-case target | The frozen map covers all asset, playbook, reference, symlink, and benchmark candidates with zero unknown/collision rows. |
| REQ-002 | Webflow resource paths remain complete | SKILL.md, README.md, asset indexes, manual scenarios, reference links, workflow symlinks, and benchmark paths resolve with no active old basename. |
| REQ-003 | Runtime and content semantics remain unchanged | Webflow detection, Motion.dev routing, JavaScript/CSS/HTML reference loading, deployment guidance, and verification flow match BASE. |
| REQ-004 | Exemptions remain intact | Exact names, Python/package, generated/lockfile, identifiers/keys, frontmatter fields, and frozen history remain unchanged. |
| REQ-005 | The child records all cross-component edges | Every link into shared, root playbook, benchmark, or sibling packet is dispositioned for the final subtree gate. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: No in-scope snake_case filesystem name remains under code-webflow.
- **SC-002**: All Webflow asset, reference, playbook, benchmark, and symlink paths resolve.
- **SC-003**: Surface detection and logical resource-load behavior match BASE, including Motion.dev scenarios.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The Webflow packet has the broadest documentation tree in this subtree and includes both code-like assets and prose-heavy references. The main failure mode is a broken deep markdown link or a missing asset that a top-level route test does not load. The mitigation is a complete link/path scan, non-zero scenario/resource checks, symlink verification, and browser/runtime smoke evidence against BASE. The phase depends on the frozen map and prior shared/mode handoffs.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must distinguish source asset filenames from JavaScript/CSS/HTML identifiers and must record any generated benchmark output as generated rather than rewriting its contents.
<!-- /ANCHOR:questions -->
