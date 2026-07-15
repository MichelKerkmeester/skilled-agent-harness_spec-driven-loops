---
title: "Feature Specification: agents surface rollup gate (017 phase 014)"
description: "The agents subtree needs one blocking rollup that aggregates the 13 definition audits and proves the whole runtime naming surface has no in-scope snake_case filesystem name outside the program exemption set."
trigger_phrases:
  - "agents surface rollup gate"
  - "agents naming gate"
  - "017 phase 014 agents"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents/014-agents-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored agents gate docs"
    next_safe_action: "Execute agents rollup gate"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Agents Surface Rollup Gate

> Phase adjacency under the 017 agents component parent (grouping order, not a runtime dependency): predecessor 013-review-verify; successor None.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/014-agents/014-agents-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 014 of the 017 agents component migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Thirteen sibling definition audits are useful only if their evidence is complete and their candidate sets are aggregated. This phase is the blocking rollup gate: it checks every sibling checklist, accounts for all 39 expected definition paths across the three runtime agent directories, and verifies that the whole agents naming surface contains no in-scope snake_case filesystem name outside the program exemption set.

The purpose is to close the agents subtree as a verified naming surface without creating new migration work or modifying runtime files.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Aggregate the completed evidence from 001-ai-council-verify through 013-review-verify.
- Account for these 13 definition names in all three runtimes: ai-council, code, context, debug, deep-alignment, deep-improvement, deep-research, deep-review, design, markdown, orchestrate, prompt-improver, and review.
- Verify the expected 39 definition paths: 13 kebab-case .md names in .opencode/agents and .claude/agents, plus 13 kebab-case .toml names in .codex/agents.
- Scan the whole agents directories for an in-scope snake_case filesystem name, while applying the program exemptions. README.txt support files in the two Markdown runtimes are not definition candidates and contain no snake_case separator.
- Keep this phase as a rollup gate only; no rename, content edit, or reference rewrite is introduced.

### Out of Scope
- Any new migration or rename work in the agents directories.
- Reopening a sibling phase's component scope except to report missing or contradictory evidence.
- Python scripts, Python import-package directories, tool-mandated names, generated or lockfile output, vendored trees, frozen history, identifiers, keys, and frontmatter fields.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 014-agents/001-ai-council-verify through 013-review-verify/checklist.md | Inspect | Sibling SOL evidence and candidate-set records |
| .opencode/agents, .claude/agents, .codex/agents | Inspect | Whole agents naming surface; no runtime mutation |
| 014-agents/014-agents-gate/* | Create/Replace | Rollup gate documentation |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sibling phase is represented in the rollup | All 13 sibling checklists are present and their P0 evidence is available for review |
| REQ-002 | The expected definition inventory is complete | The rollup accounts for exactly 39 paths: 13 .md definitions in each of .opencode/agents and .claude/agents, and 13 .toml definitions in .codex/agents |
| REQ-003 | The aggregate candidate set is correct | The union of the 13 sibling candidate sets is exactly ∅ |
| REQ-004 | The whole agents surface is kebab-clean within scope | A recursive name scan finds no in-scope snake_case filesystem name; exemptions are recorded rather than misclassified |
| REQ-005 | The gate adds no migration work | The rollup changes only assigned documentation and evidence; no runtime agent file is renamed or edited |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 13 sibling checklists have path-level evidence and pass their P0 contracts.
- **SC-002**: All 39 expected definition paths are accounted for and the aggregate candidate set is ∅.
- **SC-003**: The recursive agents-surface name scan finds no in-scope snake_case filesystem name outside the exemption set.
- **SC-004**: The subtree closes with no runtime mutation or unassigned rename task.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is a false green caused by a missing sibling, an uncounted runtime format, or a silent disagreement between a leaf and the rollup. Mitigation is a 14-row sibling matrix, a 39-path expected inventory, a union-of-candidate-sets check, and a blocking discrepancy rule. The gate inherits the 017 convention, exemption, and baseline evidence; it does not perform migration.

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the sibling set and the three runtime roots are fixed by the parent phase map.
<!-- /ANCHOR:questions -->
