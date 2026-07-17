---
title: "Feature Specification: sk-code subtree rollup gate (032 phase 008/009)"
description: "Final verification-only gate for the sk-code subtree: confirm phases 001-008 are complete, the full sk-code naming surface is kebab-clean within the 032 exemption boundary, and no new migration work is introduced."
trigger_phrases:
  - "sk-code subtree rollup gate"
  - "sk-code kebab-clean verification"
  - "sk-code naming surface gate"
  - "sk-code phase 009 acceptance"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored skill gate docs"
    next_safe_action: "Run the sk-code sibling matrix and final census"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/"
      - ".opencode/skills/sk-code/"
      - ".opencode/skills/sk-code/changelog/"
      - ".opencode/skills/sk-code/SKILL.md"
      - ".opencode/skills/sk-code/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This gate aggregates phases 001-008 and introduces no new migration map or rename work."
      - "The final census must classify every retained non-kebab name against the 032 exemption and phase evidence."
      - "Any incomplete sibling, stale reference, or unknown in-scope name blocks the sk-code rollup."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-code subtree rollup gate

> Final verification phase under the sk-code component parent: predecessor `008-changelog-verify`; no successor migration phase.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/001-sk-code/009-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-code |
| **Origin** | Final rollup gate for the sk-code component subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Independent child phases can pass while a cross-boundary snake_case filesystem name, stale reference, missing exemption
record, conflicting disposition, or incomplete changelog handoff remains elsewhere in the sk-code surface. A subtree
gate is needed to reconcile phases 001-008 and inspect the complete skill tree as one scope-aware naming surface.

### Purpose

Aggregate the blocking evidence for phases 001-008, run a final scope-aware census and active-reference check over
`.opencode/skills/sk-code/`, and issue a reproducible pass or block result. This gate performs no new rename, reference
rewrite, changelog edit, metadata repair, code change, or migration work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify the blocking checklists, maps, reports, and handoffs for every sibling phase `001` through `008`.
- Confirm phase 008's changelog entry and version verdict are present, coherent, and handed off without unresolved drift.
- Enumerate `.opencode/skills/sk-code/` recursively and identify every retained non-kebab filesystem name.
- Confirm each retained name is an approved Python `.py` or package-directory exemption, tool-mandated/generated/lockfile
  name, frozen/history surface, or phase-owned disposition; unknown in-scope names block the gate.
- Resolve active path references, registries, links, imports, and path-valued metadata against the completed child maps.
- Record the sibling verdict matrix, census output, command exit codes, unresolved findings, and final pass/block handoff.

### Out of Scope

- Any new filesystem rename, reference rewrite, changelog edit, metadata repair, code/script change, benchmark rerun,
  playbook/content migration, or new exemption decision.
- Python `.py` filenames and Python import-package directories, tool-mandated names, generated/lockfile output, frozen
  history, code identifiers, JSON/YAML/TOML keys, and frontmatter fields except as classification evidence.
- Treating the assigned spec-folder documents as part of the sk-code migration surface.

### Files to Inspect

| File Path | Verification |
|-----------|--------------|
| `001-sk-code/001-*` through `008-changelog-verify/` | Read sibling checklists, maps, handoffs, and release evidence. |
| `.opencode/skills/sk-code/` | Run the final scope-aware filesystem census and active-reference resolution. |
| `.opencode/skills/sk-code/changelog/` | Confirm the phase 008 release record and frozen-history boundary. |
| `.opencode/skills/sk-code/SKILL.md`, `README.md`, and metadata | Check public paths, version, and active declarations. |
| `009-skill-gate/checklist.md` | Record the blocking rollup result and final evidence receipt. |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every sibling phase 001-008 is complete | Each phase has a passing blocking checklist, consistent handoff, and no unresolved ownership conflict. |
| REQ-002 | The sk-code filesystem surface is kebab-clean by scope | The final census has no unclassified in-scope snake_case name; every retained non-kebab name has evidence for its exemption or frozen/tool-mandated disposition. |
| REQ-003 | Active references are closed | No active path, link, import, registry, or path-valued metadata reference points to a renamed source, and every mapped target resolves. |
| REQ-004 | Exemptions are not over-applied | Code identifiers, data keys, frontmatter fields, Python/package names, generated/lockfile output, tool-mandated names, and frozen history are not treated as filesystem candidates. |
| REQ-005 | The changelog/version handoff is coherent | Phase 008's release entry covers the 001-007 rename set and its version verdict is greater than BASE `4.1.0.0` and internally consistent. |
| REQ-006 | Rollup evidence is reproducible and non-mutating | The matrix records census inputs, map hashes, commands, exit codes, findings, and no new migration work occurs during the gate. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All sibling P0 checklist contracts for phases 001-008 pass and their maps/handoffs do not conflict.
- **SC-002**: The scope-aware census finds no unknown in-scope snake_case filesystem name or stale active path under sk-code.
- **SC-003**: The final evidence distinguishes completed migration, approved exemptions/frozen surfaces, release status,
  and any blocking finding without absorbing new work.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is declaring the subtree clean from sibling status alone and missing a path introduced or preserved
outside an individual map. The gate depends on phases 001-008, the pinned BASE/frozen map, and the central validation
evidence; it must fail closed on an incomplete sibling, census mismatch, stale reference, conflicting disposition,
unknown name, or unresolved phase 008 release contradiction.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any newly discovered in-scope path routes back to its owning phase; this gate must not absorb new
migration scope or invent an exemption.
<!-- /ANCHOR:questions -->
