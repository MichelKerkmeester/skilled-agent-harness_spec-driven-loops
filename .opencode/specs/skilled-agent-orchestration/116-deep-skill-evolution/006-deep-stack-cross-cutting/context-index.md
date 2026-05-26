---
title: "Context Index: deep-stack cross-cutting"
description: "Migration bridge for the cross-cutting cluster, which was assembled on 2026-05-26 by folding three former one-theme clusters into one phase parent."
trigger_phrases:
  - "deep-stack cross-cutting fold"
  - "006 differentiation commands doc-evolution"
  - "deep skills differentiation new home"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/006-deep-stack-cross-cutting"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored cross-cutting fold bridge"
    next_safe_action: "use as navigation bridge during resume"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:3211c0b0ac1cd53b2ab64429b0fe497a431237bec9e51332135581a8db204599"
      session_id: "116-006-context-index"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Context Index: deep-stack cross-cutting

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

## WHEN TO USE THIS FILE

This cluster was created on 2026-05-26 by folding three former clusters (`006-deep-skills-differentiation`, `007-deep-commands-relocation`, `008-deep-skill-doc-evolution`) into one cross-cutting phase parent. Use this file to resolve an old path to its new leaf.

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `006-deep-skills-differentiation/001-unique-value-differentiation/` | `001-unique-value-differentiation/` | active | Sole leaf of the former differentiation cluster. |
| `007-deep-commands-relocation/` (cluster-rank leaf) | `002-commands-relocation/` | active | Was a 0-child heavy-doc cluster; promoted to a leaf. Level 3 docs preserved. |
| `008-deep-skill-doc-evolution/001-spec-and-resource-map/` | `003-doc-evolution-spec-and-resource-map/` | active | Renumbered into contiguous order. |
| `008-deep-skill-doc-evolution/009-deep-research-gap-backstop/` | `004-doc-evolution-research-gap-backstop/` | active | Renumbered 009→004 (closed the gap). |
| `008-deep-skill-doc-evolution/010-post-impl-deep-review/` | `005-doc-evolution-post-impl-deep-review/` | active | Renumbered 010→005. |

Old packet IDs are preserved in each leaf's `description.json` (`memoryNameHistory`) and `graph-metadata.json` (`manual.supersedes`). The parent `graph-metadata.json` records the three former clusters in `manual.supersedes`.
<!-- /ANCHOR:migration-bridge -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Keep rows scoped to phase-folder movement or identity changes.
- Leave detailed rationale in each leaf's own `decision-record.md` / `implementation-summary.md`.
- Remove this file when the bridge no longer helps navigation.
<!-- /ANCHOR:author-instructions -->
