---
title: "Feature Specification: commands subtree rollup gate (032 phase 008/013/010)"
description: "Aggregate the ten commands-surface child phases and accept the subtree only when every in-scope filesystem name is kebab-clean or covered by the program exemption set, with references closed."
trigger_phrases:
  - "commands subtree rollup gate"
  - "commands naming gate"
  - "command surface kebab verification"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored commands rollup docs"
    next_safe_action: "Aggregate sibling command evidence"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - "008-component-migration/013-commands/001-create-namespace/checklist.md"
      - "008-component-migration/013-commands/009-command-assets/checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase adds no migration work; it is a blocking rollup verifier."
      - "The program exemption set is authoritative for Python files, package directories, tool-mandated names, generated output, fixtures, and frozen history."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: commands subtree rollup gate

> Phase adjacency under the commands component parent: predecessor `009-command-assets`; successor `None`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/032-hyphen-naming-convention/008-component-migration/013-commands/010-commands-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 010 of the commands-surface migration under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The commands surface is split across seven namespace migrations, a loose-root classification, a residual asset/reference closure, and this gate. Individual green phases do not prove whole-tree closure: a path may still point to an old basename, two phases may claim one file, or an underscore may remain outside the exemption set. This phase supplies the final subtree acceptance contract.

### Purpose

Aggregate the ten commands-surface child phases and issue a blocking rollup verdict only when every command filesystem name, active path, exemption, ownership row, and relevant behavior receipt is closed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Consume evidence from `001-create-namespace` through `009-command-assets`, including child checklists, disposition maps, exemption ledgers, path/reference results, and behavior receipts.
- Verify the complete `.opencode/commands/**` naming and reference surface.
- Reject missing child evidence, duplicate ownership, unclassified filesystem names, broken active references, and behavior regressions.
- Preserve the distinction between filesystem names, public command IDs, semantic keys, generated output, fixtures, and tool-mandated paths.

### Out of Scope

- Renaming files, rewriting content, regenerating artifacts, changing command IDs, or repairing a failed sibling phase.
- Creating a missing child receipt or performing migration work from the rollup phase.
- Treating Python files/package directories, tool-mandated names, generated output, fixtures, semantic keys, or frozen history as generic rename targets.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Accept only complete child evidence | All ten child phases have present, accepted checklists with no unresolved P0/P1 failure and pinned evidence. |
| REQ-002 | Maintain one authoritative command-surface map | Every `.opencode/commands/**` file and directory has exactly one ownership/disposition row; duplicate or missing rows block the gate. |
| REQ-003 | Enforce the kebab-case boundary | Every remaining snake_case filesystem name is gone or covered by the explicit Python, package, tool-mandated, generated, fixture, or frozen-history exemption ledger. |
| REQ-004 | Prove active reference closure | Every active path, link, template pointer, manifest input, and command reference resolves to the final target, with no active old path remaining. |
| REQ-005 | Verify command behavior and collisions | Command discovery, relevant reference checks and self-tests, generated/tool-boundary checks, and exact/casefold/NFC collision checks pass. |
| REQ-006 | Report blockers without performing migration | The final report distinguishes confirmed results from unresolved blockers and never claims migration completion from documentation alone. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All ten child phases have accepted checklists.
- **SC-002**: The full command tree is kebab-clean except for documented Python, package, tool-mandated, generated, fixture, or frozen-history exemptions.
- **SC-003**: No active old path or duplicate owner remains.
- **SC-004**: The gate report contains the complete manifest, exemption ledger, reference results, behavior receipts, and scoped diff evidence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk or Dependency | Impact | Mitigation |
|--------------------|--------|------------|
| A green child hides a cross-phase stale pointer | The subtree could appear complete while active references remain broken. | Run the whole-tree path/reference scan at the gate. |
| Exemptions become an escape hatch | In-scope snake_case names could survive without policy support. | Require a named policy reason and evidence for every remaining underscore. |
| The gate performs new migration work | Rollup evidence and ownership would become unreliable. | Treat any missing row or failed child as a blocker and return it to the owning phase. |
| Generated or tool-owned names are falsely flagged | Valid contracts could be changed during acceptance. | Consume each child's boundary evidence and compare against the program exemption ledger. |
| Child phases and commands inventory | The gate cannot establish closure without all ten maps and the full tree. | Require child checklists 001–009 and a complete `.opencode/commands/**` inventory before testing. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No design question is open. The gate is blocked by any unresolved sibling evidence, unclassified filesystem name, duplicate owner, broken active reference, collision, or behavior regression.
<!-- /ANCHOR:questions -->
