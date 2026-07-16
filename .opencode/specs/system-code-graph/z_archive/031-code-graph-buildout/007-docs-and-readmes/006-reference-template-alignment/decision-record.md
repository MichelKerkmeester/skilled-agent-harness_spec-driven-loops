---
title: "Decision Record: System Code Graph Reference Template Alignment"
description: "Architecture decisions for canonical system-code-graph reference folders, compatibility stubs, and smart-router alignment."
trigger_phrases:
  - "system-code-graph decision record"
  - "reference taxonomy decision"
  - "code graph router decision"
importance_tier: "important"
contextType: "documentation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/006-reference-template-alignment"
    last_updated_at: "2026-05-24T08:04:41Z"
    last_updated_by: "codex"
    recent_action: "Recorded reference taxonomy and router decisions"
    next_safe_action: "Keep new canonical references under foldered snake_case paths"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/SKILL.md"
      - ".opencode/skills/system-code-graph/references/"
    session_dedup:
      fingerprint: "sha256:7187d88935bea71dd106cf30c709e053c8e71d2ab890ecd40ba832bba44de65f"
      session_id: "system-code-graph-reference-template-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: System Code Graph Reference Template Alignment

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Foldered Canonical References With Root Compatibility Stubs

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Codex implementing explicit user request |

---

<!-- ANCHOR:adr-001-context -->
### Context

The existing code-graph references were root-level kebab-case files. sk-doc reference guidance requires snake_case canonical filenames, and the user asked to apply the same folder-plus-stub pattern used for adjacent skill cleanups.

### Constraints

- Preserve old direct links.
- Avoid duplicating long-form content in compatibility files.
- Keep runtime behavior, schemas, scripts, commands, and MCP tool IDs unchanged.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Move canonical references into focused snake_case subfolders and leave old root paths as short compatibility stubs.

**How it works**: Canonical files now live under `runtime/`, `readiness/`, `config/`, and `integrations/`. Root kebab-case files contain only frontmatter, H1, a short intro, `## 1. OVERVIEW`, and a link to the canonical file.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Foldered canonical refs plus stubs | Aligns with sk-doc naming and preserves old links | Adds small stub maintenance surface | 9/10 |
| Rename in place without stubs | Simple tree after cleanup | Breaks existing links | 4/10 |
| Keep root files and only rewrite content | Lowest movement | Fails snake_case canonical path policy | 3/10 |

**Why this one**: It satisfies template alignment without breaking existing navigation, and it lets the smart router target full canonical docs instead of thin compatibility files.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Canonical reference paths now communicate domain ownership.
- Existing old links continue to resolve.
- Future router maps can avoid root compatibility surfaces.

**What it costs**:
- The reference tree has both stubs and canonical files. Mitigation: stubs contain only canonical pointers and are not listed as preferred router targets.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future edit updates a stub instead of the canonical doc | Medium | Router maps and README tables point at canonical docs. |
| A root stub grows into duplicate content | Medium | Stub shape is documented and validated as pointer-only. |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User reported reference-template drift and requested the same cleanup pattern. |
| 2 | **Beyond Local Maxima?** | PASS | Compared root-only rewrite, rename-only, and foldered stubs. |
| 3 | **Sufficient?** | PASS | Solves naming, template, and link preservation without runtime edits. |
| 4 | **Fits Goal?** | PASS | Directly targets sk-doc alignment and router navigation. |
| 5 | **Open Horizons?** | PASS | Canonical folder taxonomy supports future resource discovery. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- Move canonical references into `references/runtime/`, `references/readiness/`, `references/config/`, and `references/integrations/`.
- Add pointer stubs at every old root kebab-case path.
- Update active documentation links to canonical paths.

**How to roll back**: Restore old root reference content, remove canonical subfolder copies and stubs, and revert active doc/router links. No executable rollback is required.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Keep Smart Router Canonical-Only

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-24 |
| **Deciders** | Codex implementing explicit user request |

---

### Context

Compatibility stubs preserve old paths but are intentionally too thin for agent knowledge loading. The router needed to meet sk-doc smart-router standards and avoid stale static inventories.

### Decision

**We chose**: Route through dynamic markdown discovery and canonical `RESOURCE_MAP` paths only.

**How it works**: `SKILL.md` now documents recursive discovery over `references/`, `feature_catalog/`, `manual_testing_playbook/`, and `assets/`; `_guard_in_skill()` sandboxes paths; `load_if_available()` checks inventory and suppresses duplicates; weighted signals load canonical resources by domain.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| Canonical-only router | Loads useful docs and avoids stubs | Requires resource-map refresh now | 9/10 |
| Allow router to target stubs | Simple compatibility | Agents waste a load on pointer-only docs | 3/10 |
| Keep static old map | No immediate rewrite | Recreates the drift the task is fixing | 2/10 |

### Consequences

The router now mirrors sk-doc standards and remains extensible as new markdown resources are added. Future stubs can preserve compatibility without becoming preferred knowledge sources.
<!-- /ANCHOR:adr-002 -->
