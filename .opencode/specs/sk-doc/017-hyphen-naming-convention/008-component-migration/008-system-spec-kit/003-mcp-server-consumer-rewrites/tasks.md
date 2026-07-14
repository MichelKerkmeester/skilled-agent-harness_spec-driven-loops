---
title: "Tasks: MCP-server consumer rewrites (017 subtree 008 phase 003)"
description: "Renaming the MCP package and its inner directories changes path-valued references across the skill, sibling skills, scripts, manifests, hooks, and documentation. This phase rewrites every consumer and import/config path without renaming exempt Python targets or changing the @spec-kit/mcp-server package identity."
trigger_phrases:
  - "mcp-server consumer rewrites"
  - "mcp_server import references"
  - "system-spec-kit path consumers"
  - "kebab-case phase 003"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/008-system-spec-kit/003-mcp-server-consumer-rewrites"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Planned MCP consumer-rewrite tasks"
    next_safe_action: "Execute the repository-wide MCP consumer sweep after the tree is stable"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Tasks: MCP-server consumer rewrites

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Load approved MCP maps and define active, generated, and frozen search roots.
- [ ] T002 Capture the pre-rewrite consumer inventory with line numbers and match classes.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Classify static and dynamic consumers by path semantics.
- [ ] T004 Rewrite active path values, imports, links, globs, registries, and shell sources.
- [ ] T005 Resolve the rewritten graph and record exemptions and historical references.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 Verify: The scan is nonzero and complete — evidence: consumer inventory.
- [ ] T007 Verify: Active path consumers resolve — evidence: resolver reports across code, config, shell, registry, and docs.
- [ ] T008 Verify: Dynamic sites are dispositioned — evidence: dynamic-site ledger with zero unknowns.
- [ ] T009 Verify: Exemptions and frozen content are unchanged — evidence: diff audit.
- [ ] T010 Verify: Phase 004 handoff is explicit — evidence: remaining script candidate references.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green in the central validation worktree
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

