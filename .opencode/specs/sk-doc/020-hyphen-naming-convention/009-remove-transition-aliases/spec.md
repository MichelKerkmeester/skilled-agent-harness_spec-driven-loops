---
title: "Feature Specification: remove transition aliases (020 phase 009)"
description: "The migration has completed and the bounded coexistence window from phase 002 is closed, but runtime consumers still carry compatibility paths for the old underscore catalog and playbook roots and indexes. This phase removes those aliases and makes unsupported legacy names fail explicitly without falling through to a generic document classification."
trigger_phrases:
  - "remove transition aliases"
  - "hyphen naming phase 009"
  - "remove snake case back compatibility"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/009-remove-transition-aliases"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Authored the phase contract for removing post-migration root and index aliases"
    next_safe_action: "Execute after phase 002 coexistence-window closure and the completed physical-root migration"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration/spec.md"
      - ".opencode/skills/sk-doc/shared/scripts/validate_document.py"
      - ".opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/load-playbook-scenarios.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The canonical live roots and indexes are hyphenated; the underscore forms are transitional aliases only."
      - "This phase removes alias resolution after the phase 002 coexistence window has closed."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: Remove transition aliases
> Phase adjacency — predecessor `008-component-migration`.

> Phase adjacency under the 020 parent: prerequisite `002-root-name-consumer-migration` with its coexistence window closed and the physical catalog/playbook migration complete; successor `010-whole-repo-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/009-remove-transition-aliases |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 009 of the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The phase 002 consumer migration deliberately keeps a bounded read tolerance for the old underscore catalog/playbook roots and index names. Once the physical migration and coexistence window are complete, leaving those branches live would preserve an obsolete filesystem contract and could allow new snake_case content to re-enter through compatibility code.

This phase removes the transition aliases from every reviewed consumer, keeps the hyphenated names as the only live contract, and makes any unsupported old or mismatched name fail loudly rather than silently classifying as `readme`, an empty benchmark corpus, or another unrelated document type.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove underscore-root and underscore-index compatibility branches from every consumer listed by the phase 002 consumer manifest.
- Make `feature-catalog` and `manual-testing-playbook`, including their canonical index names, the only accepted live names.
- Replace alias-positive fixtures with canonical-name fixtures and retain negative fixtures that prove old, mismatched, and near-match names are rejected.
- Preserve the phase 002 resolver's explicit conflict behavior and the program's exemption boundary while deleting only the transition behavior.

### Out of Scope
- Renaming physical directories, files, or script names; that migration must already be complete before this phase starts.
- Changing code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python filenames or package directories, generated/lockfile output, tool-mandated names, or frozen history.
- The whole-repo end-state gate, final integration, or parent closeout; those are handled by phases 010 and 011.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/shared/scripts/validate_document.py` | Modify | Remove legacy root/index classification paths while retaining canonical typed classification. |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/{load-playbook-scenarios.cjs,playbook-generator.cjs}` | Modify | Remove legacy discovery and emission aliases from the benchmark loader and generator. |
| `.opencode/skills/sk-code/code-quality/scripts/lib/post-edit-router.cjs` | Modify | Remove legacy root routing and generic fallback behavior. |
| `.opencode/skills/sk-doc/create-skill/scripts/{package_skill.py,init_skill.py}` | Modify | Stop accepting or emitting transition root names. |
| `.opencode/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py` and related tests | Modify | Make the guard and fixtures enforce the canonical hyphenated roots. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every phase 002 consumer drops transition alias resolution | The reviewed consumer manifest has a disposition for every row; no active consumer uses an underscore root/index as a live lookup or emission target. |
| REQ-002 | Hyphenated roots and indexes remain fully supported | Canonical `feature-catalog` and `manual-testing-playbook` fixtures classify, load, route, package, and generate with the same typed behavior established in phase 002. |
| REQ-003 | Unsupported legacy names fail closed | An old underscore root, old underscore index, mismatched root/index pair, and near-match produce an explicit error or non-zero result; none becomes `readme`, an empty scenario set, or an unrelated category. |
| REQ-004 | Physical-root conflict behavior remains explicit | A fixture containing both canonical and legacy physical roots is rejected before discovery or classification, with the conflict visible in the result. |
| REQ-005 | Alias removal does not widen the exemption boundary | Python files and package directories, generated/lockfile output, tool-mandated names, and frozen surfaces remain governed by the policy in `001-convention-policy-and-scope`. |
| REQ-006 | Compatibility tests describe the post-window contract | Positive tests cover canonical names; negative tests cover every removed alias and assert the fail-closed result rather than merely asserting a missing file. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The live consumer graph recognizes only the hyphenated catalog/playbook roots and indexes.
- **SC-002**: Every unsupported legacy or conflicting name fails explicitly with no silent downgrade or guessed path.
- **SC-003**: The phase 010 verifier can identify the removed aliases as historical/test evidence only, not executable compatibility behavior.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The hard dependency is evidence that phase 002's bounded coexistence window is closed and that the physical roots have already been migrated. Removing aliases early would strand still-unmigrated consumers; removing only some branches would leave inconsistent behavior across skills. The main mitigation is a manifest-driven consumer sweep followed by canonical, legacy, conflict, and near-match fixtures for every consumer family.

The phase inherits the 020 policy risks around classifier downgrade, exemption leakage, and scope drift. It does not authorize a broad repository rename or edits to frozen history.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must attach the phase 002 window-closure evidence and the reviewed consumer-manifest disposition before alias-removal edits begin.
<!-- /ANCHOR:questions -->
