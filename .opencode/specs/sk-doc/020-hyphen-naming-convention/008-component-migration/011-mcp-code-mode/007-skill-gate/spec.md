---
title: "Feature Specification: mcp-code-mode subtree skill gate (032 component 011 phase 007)"
description: "The mcp-code-mode subtree needs one blocking rollup gate after its five closure phases and changelog verification. This phase aggregates sibling evidence and proves that no in-scope snake_case filesystem name or stale active path remains outside the Python, tool-mandated, generated, lockfile, and frozen-history exemptions."
trigger_phrases:
  - "mcp-code-mode subtree skill gate"
  - "mcp-code-mode phase 007"
  - "mcp-code-mode kebab-clean rollup"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/007-skill-gate"
    last_updated_at: "2026-07-14T16:30:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate docs"
    next_safe_action: "Aggregate sibling checklists and path evidence"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: mcp-code-mode subtree skill gate

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/011-mcp-code-mode/007-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 007 of the 032 mcp-code-mode component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The component's child phases each prove a local closure, but local green results do not prove that their combined surface has no stale old path, missed directory, or exemption leak. The final gate must inspect the whole mcp-code-mode tree and require every sibling contract, including the verify-only changelog phase, to be complete.

This phase performs no new migration work. It aggregates sibling evidence, reruns the exemption-aware filesystem and reference census across the skill, and accepts the component only when the whole naming surface is clean and all prescribed checks pass.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Completion evidence from phases 001 through 006.
- A recursive filesystem census of .opencode/skills/mcp-code-mode with the 032 exemption set.
- Whole-surface stale-path, active-link, syntax, and required skill-gate evidence.
- Final classification of Python names, tool-mandated names, generated/lockfile content, frozen changelog history, and non-filesystem identifiers.

### Out of Scope
- New renames, reference rewrites, code changes, changelog edits, or repairs to failed sibling phases.
- Other skills, other component parents, and any content-key or identifier migration.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sibling phase is complete | Phases 001 through 006 have all P0 checks passed and their evidence is linked in the rollup report |
| REQ-002 | The whole filesystem surface is exemption-clean | No in-scope snake_case directory or filename remains under mcp-code-mode; every remaining underscore name has a recorded exemption |
| REQ-003 | The whole active reference surface is clean | No stale pre-rename package, reference, asset, script, runtime, or manual-playbook path remains outside frozen/sanctioned dispositions |
| REQ-004 | Executable and navigation checks remain green | Required Node, shell, Markdown-link, package-path, and manual-playbook checks pass with baseline parity evidence |
| REQ-005 | The changelog/version evidence is part of the gate | The phase-006 verify report passes and its entry matches the complete component rename set |
| REQ-006 | The gate is read-only | The rollup report proves no new tracked mutation was introduced while verifying the subtree |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven child phases have accepted evidence and the complete mcp-code-mode tree is kebab-clean within scope.
- **SC-002**: Whole-surface path, link, executable, and changelog/version checks pass without new migration work.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The rollup can fail through evidence drift even when a child report passed: a later sibling change may reintroduce an old
path or alter a supposedly frozen file. The gate depends on the pinned BASE, all child checklists, the final rename maps,
and the program exemption policy; it returns failures to the responsible child rather than repairing them.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the gate accepts only evidence from the exact candidate tree it inspects.
<!-- /ANCHOR:questions -->
