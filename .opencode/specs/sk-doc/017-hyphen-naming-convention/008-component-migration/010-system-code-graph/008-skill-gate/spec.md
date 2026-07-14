---
title: "Feature Specification: system-code-graph subtree rollup gate (017 phase 008)"
description: "The system-code-graph child phases each prove a bounded path closure, but only a final rollup can prove that phases 001–007 are complete and that no in-scope snake_case filesystem name remains across the whole skill surface. This mutation-free gate aggregates sibling evidence and applies the 017 exemption boundary without performing new migration work."
trigger_phrases:
  - "system-code-graph subtree rollup gate"
  - "system-code-graph skill gate"
  - "017 system-code-graph phase 008"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored subtree gate docs"
    next_safe_action: "Aggregate sibling evidence and run the whole-surface naming scan"
    blockers: []
    key_files:
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/001-mcp-server-dir-and-manifest-closure/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/002-scripts/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/003-references/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/004-runtime/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/005-feature-catalog/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/006-manual-testing-playbook/checklist.md"
      - ".opencode/specs/sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/007-changelog-verify/checklist.md"
      - ".opencode/skills/system-code-graph/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: system-code-graph Subtree Rollup Gate

> Final phase under the 010-system-code-graph parent: predecessor `007-changelog-verify`; successor None. This is a verification-only rollup and performs no new rename or reference migration.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/008-component-migration/010-system-code-graph/008-skill-gate |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Final rollup gate for the system-code-graph component naming migration |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The six path-migration phases and the changelog-verification phase each own a bounded contract, but separate green
results do not prove that the entire system-code-graph surface is clean. A leftover snake_case directory or file can
remain outside those individual maps, and an underscore in a Python package, tool-mandated name, generated/lockfile
surface, test-magic path, or frozen history must not be misclassified as migration debt.

This phase aggregates the evidence from phases 001–007, scans the complete system-code-graph naming surface with the
017 exemption boundary, checks active path/reference closure, and blocks handoff until every sibling contract and the
whole-surface naming result are green. It performs no new rename, reference repair, changelog edit, or code change.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The seven sibling phase contracts, maps, counts, reports, and blocking checklist evidence from phases 001–007.
- Every filesystem name under `.opencode/skills/system-code-graph/`, including the MCP package boundary, scripts,
  references, runtime paths, feature catalog, manual-testing-playbook, tests, assets, and release surface.
- Active Markdown links, path-valued metadata, catalog/playbook pointers, launcher or configuration path references,
  and stale old-name checks needed to prove the completed surface is internally resolvable.
- Classification of every remaining underscore through the program boundary: Python `.py` files, Python import-package
  directories, tool-mandated names, generated/lockfile output, test-magic names, and frozen changelog history.

### Out of Scope
- Any new filesystem rename, reference rewrite, changelog edit, code change, or repair of an individual sibling phase.
- Renaming code identifiers, MCP tool IDs, JSON/YAML/TOML keys, frontmatter fields, Python files/package directories,
  tool-mandated names, generated/lockfile output, test-magic names, or frozen history.
- Other 017 component-migration subtrees and the central whole-repo gate.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| 001-*/checklist.md through 007-*/checklist.md | Read | Aggregate sibling P0/P1 status and evidence |
| .opencode/skills/system-code-graph/ | Read | Run the complete exemption-aware naming and active-reference scan |
| 008-skill-gate/checklist.md | Read/Record | Record rollup evidence; the gate performs no migration mutation |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Aggregate sibling completion | Phases 001–007 have passing P0 checks, evidence-pinned reports, and no unresolved blocker. |
| REQ-002 | Prove whole-surface naming cleanliness | The exemption-aware scan finds zero in-scope snake_case filesystem names anywhere under `.opencode/skills/system-code-graph/`. |
| REQ-003 | Reconcile remaining underscores | Every remaining underscore in a filesystem path is classified as an approved Python/package, tool-mandated, generated/lockfile, test-magic, frozen, or other documented exemption; identifiers and data keys are not treated as paths. |
| REQ-004 | Prove active reference closure | Active Markdown links, path-valued metadata, catalog/playbook indexes, launcher/configuration paths, and sibling handoff references resolve; frozen-history references are excluded by policy. |
| REQ-005 | Keep the gate mutation-free | Phase 008 performs no new rename or repair and leaves the tracked system-code-graph surface unchanged after verification. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven sibling phase contracts are complete and evidence-pinned.
- **SC-002**: The complete system-code-graph filesystem surface is kebab-clean outside the approved exemption set.
- **SC-003**: Active path references resolve and the rollup gate introduces no migration mutation.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The main risk is allowing the rollup gate to become an unreviewed cleanup phase. The checklist therefore fails on any
remaining in-scope name or unresolved path and routes the finding to its owning sibling instead of authorizing an
opportunistic fix. A second risk is treating every underscore as debt; the final scan must distinguish filesystem names
from identifiers and apply the 017 Python, tool, generated, test-magic, and frozen-history boundaries exactly.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. Any failure is an evidence or scope finding for the owning sibling phase, not new work for the rollup gate.
<!-- /ANCHOR:questions -->
