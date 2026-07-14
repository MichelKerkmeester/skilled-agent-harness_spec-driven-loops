---
title: "Implementation Plan: doctor command namespace naming (017 phase 008/013/004)"
description: "Plan for renaming maintained doctor asset files, repairing route and presentation path values, and proving the exact route-manifest and Python exemptions remain intact."
trigger_phrases:
  - "doctor namespace naming plan"
  - "doctor asset rename plan"
  - "doctor routes path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/004-doctor-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored doctor namespace plan"
    next_safe_action: "Execute the doctor asset and route closure"
    blockers: []
    key_files:
      - ".opencode/commands/doctor/_routes.yaml"
      - ".opencode/commands/doctor/assets/"
      - ".opencode/commands/doctor/scripts/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Doctor command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/doctor/` maintained assets and route consumers |
| **Change class** | Maintained asset rename plus route/path repair |
| **Execution** | Isolated worktree using the pinned BASE and frozen semantic map |
| **Verification** | Route manifest scan, reference checker, helper parity, and exemption review |

### Overview

Apply the 16 asset rows as a semantic rename closure, then update only path-valued `yaml` and presentation references. Keep `_routes.yaml` as the exact route-manifest filename and leave the Python helper untouched while proving doctor route and workflow outcomes remain equivalent.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The map lists all 16 maintained doctor assets and separately records `_routes.yaml` and `audit_descriptions.py` exclusions.
- [ ] BASE route entries, command docs, asset pointers, helper invocations, and external consumers are inventoried.
- [ ] Route IDs, YAML keys, Python exemption, and exact-name contract are explicit.

### Definition of Done

- [ ] All 16 maintained assets use mapped kebab-case targets and route/path consumers resolve.
- [ ] `_routes.yaml` and `audit_descriptions.py` remain unchanged in name and contract.
- [ ] Doctor route and presentation outcomes match BASE evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Asset map**: classify each `doctor_*` asset as a maintained file with an explicit target.
- **Route layer**: update path-valued route entries and presentation references; preserve route IDs and YAML keys.
- **Exemption layer**: retain `_routes.yaml`, `audit_descriptions.py`, already-compliant scripts, and all tool/Python names.
- **Evidence layer**: resolve every route, compare helper and workflow outcomes with BASE, and review the scope-bound diff.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the 16-row doctor map, route manifest baseline, and exemption decision record.
- [ ] Capture references to all doctor asset basenames across `_routes.yaml`, commands, assets, tests, and documentation.
- [ ] Confirm the Python helper, exact route manifest, and already-compliant scripts are not rename candidates.

### Phase 2: Core Implementation

- [ ] Rename the causal-graph, code-graph, deep-loop, embeddings, fable-mode, MCP, memory, parent-skill, skill, speckit, and update assets to kebab-case.
- [ ] Update path-valued route, command, presentation, test, and external references in the same dependency-closed batch.
- [ ] Keep route IDs, YAML keys, Python code, and tool-facing filenames unchanged.

### Phase 3: Verification

- [ ] Compare the final asset manifest and exact/Python exemptions with the frozen map.
- [ ] Parse and resolve `_routes.yaml` targets, run command-reference checks, and exercise doctor route/workflow paths.
- [ ] Compare helper results, presentation loading, modes, and route outcomes with BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports 16 maintained rows, exact/Python exclusions, and zero unknowns. |
| Route integrity | Every path-valued `_routes.yaml` target and doctor asset pointer resolves; route IDs and keys are unchanged. |
| Behavior parity | Doctor route selection, workflow loading, presentation selection, and helper checks match BASE. |
| Exemption safety | Compare `_routes.yaml`, `audit_descriptions.py`, shell helpers, command IDs, generated/tool-mandated, and frozen names. |
| Scope safety | Review a path-scoped diff limited to doctor and its proven consumers. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 017 phase 005 rename/reference tooling | Internal | Required before execution | Route/path edits could alter keys or miss dynamic consumers. |
| 017 phase 006 frozen map | Internal | Required before execution | Maintained and exempt ownership is not fixed. |
| 000 baseline route/helper evidence | Internal | Required before verification | Doctor parity cannot be proven. |
| Doctor route manifest contract | Internal | Required before execution | Exact filename and route-ID boundary could be violated. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any route parse failure, missing target, helper drift, exact/Python exemption violation, collision, or out-of-scope change.
- **Procedure**: Stop the batch, revert only the doctor asset/reference commit, restore the route manifest baseline, and rerun route and map checks before retrying.
<!-- /ANCHOR:rollback -->
