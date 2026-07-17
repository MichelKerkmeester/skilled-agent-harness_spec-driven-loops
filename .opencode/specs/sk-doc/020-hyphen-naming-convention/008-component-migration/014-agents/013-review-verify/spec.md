---
title: "Feature Specification: verify review agent naming (032 phase 013)"
description: "The agents surface needs an explicit candidate audit for review across the three runtime agent directories. This verify-only phase records the actual definition paths and proves whether any in-scope snake_case filesystem name requires a rename."
trigger_phrases:
  - "review agent naming"
  - "agents phase 013"
  - "review filename verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents/013-review-verify"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored review phase docs"
    next_safe_action: "Execute verify-only inventory"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Review Agent Naming Verification

> Phase adjacency under the 032 agents component parent (grouping order, not a runtime dependency): predecessor 012-prompt-improver-verify; successor 014-agents-gate.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/014-agents/013-review-verify |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 013 of the 032 agents component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The agents surface must be checked before any migration batch treats this definition as a rename candidate. The current inventory contains exactly three runtime definitions for review: .opencode/agents/review.md, .claude/agents/review.md, and .codex/agents/review.toml. Each basename is already kebab-case, so this phase must record an explicit zero-candidate result rather than silently disappearing from the migration evidence.

The purpose is to produce a reproducible, read-only candidate-set record for review, grounded in the filesystem naming policy and suitable for the agents rollup gate.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory the three review definition paths across the OpenCode, Claude, and Codex runtime agent directories.
- Classify filesystem basenames only; the canonical in-scope form is kebab-case, with Python scripts, Python import-package directories, and tool-mandated names exempt.
- Record the rename-candidate set as exactly empty (∅) when the pinned inventory confirms all three names remain compliant.
- Preserve the verify-only boundary: no runtime rename, content edit, or reference rewrite is part of this phase.

### Out of Scope
- Executing a rename or changing any agent definition content, frontmatter, TOML key, or code identifier.
- Inspecting or changing another agent component; the sibling phases own those inventories.
- Treating Python .py files, Python package directories, vendored or generated trees, lockfiles, tool-mandated names, or frozen history as rename candidates.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/agents/review.md | Inspect | Definition filename is already kebab-case; no rename expected |
| .claude/agents/review.md | Inspect | Definition filename is already kebab-case; no rename expected |
| .codex/agents/review.toml | Inspect | Codex definition filename is already kebab-case; no rename expected |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The three runtime definitions are inventoried exactly | The phase evidence lists the three paths above and identifies their extensions and runtime directories |
| REQ-002 | The rename-candidate set is explicit and correct | The candidate set is exactly ∅ because every observed basename is already kebab-case |
| REQ-003 | The program exemption boundary is not widened | Classification examines filesystem names only and leaves identifiers, frontmatter fields, TOML keys, Python names, and tool-mandated names untouched |
| REQ-004 | The phase remains verify-only | The report contains no rename operation or reference rewrite, and no runtime agent file is modified |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All three review definition paths are recorded against the pinned baseline.
- **SC-002**: The verified rename-candidate set is exactly ∅.
- **SC-003**: The phase supplies path-level evidence to 014-agents-gate without changing runtime files.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The principal risk is a false zero caused by missing one runtime directory or by inspecting content instead of the filename. Mitigation is an exact three-path inventory, a path-level evidence record, and a blocking check that fails on a missing or unexpected definition. The phase inherits the 032 program policy and baseline dependencies; it does not introduce a runtime dependency.

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the candidate set is determined by the three listed paths when the phase is executed against the pinned baseline.
<!-- /ANCHOR:questions -->
