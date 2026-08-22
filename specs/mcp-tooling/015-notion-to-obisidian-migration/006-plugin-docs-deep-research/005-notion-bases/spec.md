---
title: "Phase 006/005-notion-bases: Deep research to optimize the Notion Bases mcp-obsidian reference docs"
description: "One deep-research run (4 iterations, GLM-5.2 via cli-devin, early convergence allowed) investigating what to add, update, or create in references/plugins/notion-bases/* so an AI can operate the Notion Bases plugin more reliably at the file layer, with emphasis on the _database.md schema and per-column YAML key spelling (currently VERIFY)."
trigger_phrases:
  - "006 notion-bases deep research"
  - "Notion Bases reference optimization research"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/005-notion-bases"
    last_updated_at: "2026-08-22T09:30:00Z"
    last_updated_by: "claude"
    recent_action: "scaffolded as bound spec_folder for the Notion Bases deep-research run"
    next_safe_action: "run /deep:research:auto bound to this folder"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-006-005-notion-bases"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Phase 006/005-notion-bases: Notion Bases reference-docs deep research

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Researching |
| **Packet** | `mcp-tooling/015-notion-to-obisidian-migration/006-plugin-docs-deep-research/005-notion-bases` |
| **Execution** | Autonomous deep research, native executor, maximum 4 iterations |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The mcp-obsidian Notion Bases file-layer reference tree may omit exact plugin syntax and behavior needed for reliable AI-authored files. The `_database.md` per-column YAML key spelling is currently flagged for verification.

### Purpose

Investigate what to add, update, or create in `references/plugins/notion-bases/*` so an AI can operate the plugin more reliably. Research the real repository, documentation, and installed v1.12.0 plugin behavior without editing shipped documentation.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Verify `_database.md` per-column YAML key spelling against v1.12.0 evidence.
- Investigate embed and view edge cases at the file layer.
- Investigate rollup and lookup configuration gotchas.
- Recommend concrete additions or updates to the Notion Bases reference tree.

### Out of Scope

- Editing or implementing shipped files under `references/plugins/notion-bases/`.
- Changing the mcp-obsidian plugin or its installed files.
- Producing implementation code instead of cited research findings.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Workflow-owned update | Pre-init context and generated findings fence only |
| `research/*` | Workflow-owned create/update | Iteration evidence, state, synthesis, and resource map |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Verify the exact per-column YAML key spelling | Evidence from the real plugin or installed v1.12.0 resolves the VERIFY flag or preserves the contradiction |
| REQ-002 | Document embed and view edge cases | Findings identify file-layer syntax, limitations, and failure-prone combinations with citations |
| REQ-003 | Document rollup and lookup gotchas | Findings identify relation/property prerequisites and value-shape pitfalls with citations |
| REQ-004 | Recommend reference-doc changes | Synthesis names concrete additions, updates, or new documents without editing shipped docs |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The research packet contains cited iteration artifacts and canonical `research/research.md`.
- **SC-002**: All four research questions are answered or explicitly carried forward with evidence gaps.
- **SC-003**: The route-proof fields are present on every canonical iteration record.
- **SC-004**: The final packet passes targeted strict spec validation and releases its workflow lock.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Upstream repository or docs may change | Version-specific claims could drift | Prefer v1.12.0 source, installed artifacts, and dated URLs |
| Dependency | Compiled plugin may be minified | Exact key spelling may be difficult to locate | Triangulate source, docs, tests, and runtime artifacts |
| Risk | Similar terms may refer to different layers | AI guidance could encode the wrong schema | Separate database, view, embed, rollup, and lookup evidence |
| Risk | Memory retrieval unavailable | Prior context may be incomplete | Record the gap and use direct local and web evidence |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-001**: Every finding must carry a source or explicit inference marker.
- **NFR-002**: Research artifacts must remain inside this bound packet.
- **NFR-003**: Shipped mcp-obsidian documentation must remain unchanged.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Contradictory source claims must be preserved and resolved only when evidence supports resolution.
- Missing optional plugin files or unavailable memory must be recorded as evidence gaps, not treated as confirmation.
- Embed and view behavior may differ between standalone, embedded, and relation-backed contexts.
- Rollup and lookup values may depend on relation cardinality and property type.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- What is the exact `_database.md` per-column YAML key spelling in Notion Bases v1.12.0?
- What embed and view edge cases exist at the file layer?
- What rollup/lookup configuration gotchas should the reference docs cover?
- What new or updated reference docs are needed?
- Optimize the mcp-obsidian Notion Bases file-layer reference docs for AI operation by researching the real plugin, its docs, and installed v1.12.0 behavior.

<!-- /ANCHOR:questions -->
---

## 10. RESEARCH CONTEXT

Deep-research is active for this topic; `research/research.md` is the canonical source for synthesized findings. The workflow is researching the real plugin and local file-layer references; shipped documentation remains read-only during this run.
