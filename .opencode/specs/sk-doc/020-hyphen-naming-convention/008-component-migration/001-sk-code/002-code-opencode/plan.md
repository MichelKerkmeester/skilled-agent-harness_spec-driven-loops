---
title: "Implementation Plan: code-opencode filesystem names (020 phase 008/002)"
description: "Plan for renaming code-opencode assets, playbook resources, references, and benchmark labels through a semantic map, then repairing OpenCode resource paths and validating language-specific discovery."
trigger_phrases:
  - "code-opencode naming implementation plan"
  - "OpenCode packet rename plan"
  - "OpenCode resource path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/002-code-opencode"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored code-opencode phase plan"
    next_safe_action: "Execute the OpenCode packet rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/code-opencode/SKILL.md"
      - ".opencode/skills/sk-code/code-opencode/references/"
      - ".opencode/skills/sk-code/code-opencode/manual_testing_playbook/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: code-opencode filesystem names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/sk-code/code-opencode |
| **Change class** | Component filesystem rename plus reference repair |
| **Execution** | Frozen semantic map in the isolated BASE worktree |
| **Verification** | Path/reference scan, language routing checks, Python exemption scan, benchmark path check |

### Overview

Process the packet by ownership boundary: assets and playbook resources, language/reference trees, nested benchmark labels, then the packet's path consumers. Keep Python scripts and package directories in the explicit exemption ledger and carry shared workflow links as reference edges rather than duplicating their source.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map contains all underscore-bearing code-opencode paths and explicit exemption rows.
- [ ] The shared phase handoff identifies workflow symlink targets consumed by this packet.
- [ ] Baseline OpenCode resource-load and benchmark-path evidence is available.

### Definition of Done

- [ ] The component has only kebab-case in-scope filesystem names.
- [ ] Every packet path consumer resolves and the OpenCode route loads the same logical resources.
- [ ] Python/package/tool-name exemptions are evidenced and no sibling component was renamed.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Resource groups**: process assets, manual scenarios, language/reference trees, and benchmark storage labels as separate map groups.
- **Reference closure**: search markdown, JSON/config path values, shell references, and symlink targets before accepting a batch.
- **Exemption ledger**: keep .py files and Python import directories as first-class non-rename rows; do not infer exemptions from filename text alone.
- **Behavior boundary**: preserve the OpenCode router's surface/language classification and the contents of all identifiers and data keys.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the 001 shared handoff, frozen map, baseline path manifest, and OpenCode resource inventory.
- [ ] Partition the component into assets, manual playbook, references, symlinks, and benchmark storage.
- [ ] Record .py files and Python package directories as exempt before any rename operation.

### Phase 2: Core Implementation

- [ ] Rename asset/checklist directories and files, including rust_checklist and its nested checklist names.
- [ ] Rename the manual_testing_playbook root, authoring_verification, config_hooks, language_standards, and their path-bearing files.
- [ ] Rename config, javascript, python, rust, shared, shell, and typescript reference names and nested resource files.
- [ ] Rename live_mode_b and router_mode_a storage labels and update SKILL.md, README.md, links, indexes, and symlink targets.

### Phase 3: Verification

- [ ] Resolve every markdown/config/reference path from the component and its cross-surface consumers.
- [ ] Verify OpenCode sub-language discovery for TypeScript, Python, shell, Rust, JavaScript, and config resources.
- [ ] Verify Python .py/package and tool-mandated names remained exact.
- [ ] Compare benchmark and scenario resource paths with BASE and record the handoff.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Frozen-map and filesystem scans show every underscore path classified once. |
| Reference repair | Search old basenames across markdown, JSON, shell, and link targets; resolve all remaining active references. |
| Resource discovery | Run the existing OpenCode surface and language-subdetection checks for TypeScript, Python, shell, Rust, JavaScript, and config. |
| Exemption safety | Compare the .py/package/tool-mandated name manifest against BASE. |
| Benchmark parity | Verify the nested router/live storage paths and scenario/index discovery against the baseline. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 hub/shared closure | Internal | Required | Shared workflow links and common references may be stale. |
| 020 frozen rename map | Internal | Required | The component cannot distinguish rename from Python/package exemption. |
| 000 baseline evidence | Internal | Required | Resource-load and discovery parity cannot be measured. |
| 005 rename/reference tooling | Internal | Required | A manual path sweep could miss dynamic or symlink references. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any missing resource, import/package breakage, stale path, collision, or exemption violation.
- **Procedure**: Revert the path-scoped OpenCode closure, restore the pre-change manifest, and rerun the map/reference preflight before retrying.
<!-- /ANCHOR:rollback -->
