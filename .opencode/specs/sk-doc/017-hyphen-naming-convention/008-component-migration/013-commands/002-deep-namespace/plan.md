---
title: "Implementation Plan: deep command namespace naming (017 phase 008/013/002)"
description: "Plan for renaming maintained deep command assets and legacy bodies, repairing their references, and refreshing generated contract metadata without renaming generated output files."
trigger_phrases:
  - "deep namespace naming plan"
  - "deep asset rename plan"
  - "compiled contract path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep namespace plan"
    next_safe_action: "Execute the maintained deep asset closure"
    blockers: []
    key_files:
      - ".opencode/commands/deep/assets/"
      - ".opencode/commands/deep/assets/legacy/"
      - ".opencode/commands/deep/assets/compiled/"
      - ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Deep command namespace naming

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/commands/deep/` maintained assets, legacy bodies, and generated-contract consumers |
| **Change class** | Maintained asset rename plus generated metadata refresh |
| **Execution** | Isolated worktree using the pinned BASE and frozen semantic map |
| **Verification** | Reference checker, compiler validation, route parity, and generated-output exemption review |

### Overview

Apply the 25 maintained source-to-target rows as one dependency-closed closure. Update path-valued references, then use the deep-loop compiler's supported regeneration path so compiled contracts keep their exact generated filenames while recording the new source paths and digests.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The frozen map separates 21 maintained workflow/presentation assets, four legacy bodies, and four generated contracts.
- [ ] The compiler command and BASE contract manifest are available.
- [ ] All deep command IDs, workflow keys, generated-output rules, and external consumers are inventoried.

### Definition of Done

- [ ] All maintained deep sources use kebab-case targets and all active references resolve.
- [ ] Generated contracts retain their filenames and carry current maintained source paths/digests.
- [ ] Deep route and fallback behavior matches BASE evidence.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Maintained source layer**: rename auto, confirm, presentation, and legacy body files through the semantic map.
- **Generated output layer**: preserve `assets/compiled/deep_*.contract.md` filenames; regenerate rather than hand-edit generated sections.
- **Reference layer**: update command docs, README trees, asset-local pointers, compiler inputs, tests, and external path values.
- **Contract boundary**: keep command IDs, YAML keys, manifest fields, and generated contract schema unchanged.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the 28-row maintained map, the generated-output disposition, BASE contract manifest, and deep-loop compiler instructions.
- [ ] Capture old asset/body references and source-digest paths across commands, compiled headers, tests, and documentation.
- [ ] Confirm top-level deep command files and compiled filenames are excluded from physical rename.

### Phase 2: Core Implementation

- [ ] Rename the eight families of deep auto/confirm/presentation assets and the four legacy bodies to kebab-case.
- [ ] Update active path literals and links in command, README, legacy, and compiler-facing files.
- [ ] Regenerate or validate compiled contracts through the supported compiler path and record their updated source-digest evidence.

### Phase 3: Verification

- [ ] Compare maintained source targets and generated exemptions with the frozen map.
- [ ] Resolve every auto, confirm, presentation, legacy, and compiled source path; run the command-reference and compiler checks.
- [ ] Exercise deep route selection and confirm command IDs, schema keys, generated filenames, and modes match BASE.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Candidate coverage | Map scan reports 25 maintained rows, four generated exemptions, and zero unknowns. |
| Reference integrity | Command-reference scan finds no active old maintained path or missing maintained target. |
| Generated contract integrity | Compiler validation passes; compiled filenames remain exact and source digests point at the new maintained paths. |
| Route parity | Deep command mode, fallback, injection, and contract-loading outcomes match BASE scenarios. |
| Exemption safety | Inspect generated output, command IDs, schema keys, Python/package names, and frozen history for prohibited changes. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 017 phase 005 rename/reference tooling | Internal | Required before execution | Manual asset edits could rename generated output or miss dynamic consumers. |
| 017 phase 006 frozen map | Internal | Required before execution | Maintained/generated ownership and target names are not proven. |
| Deep-loop contract compiler | Internal | Required before verification | Generated source paths and digests cannot be refreshed authoritatively. |
| 000 baseline contract and route evidence | Internal | Required before verification | Generated and behavior parity cannot be compared. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any generated filename rename, stale digest, missing path, route drift, collision, or exemption violation.
- **Procedure**: Stop the batch, revert the path-scoped maintained-source/reference commit, restore the prior generated contract state through the compiler, and rerun the baseline comparison.
<!-- /ANCHOR:rollback -->
