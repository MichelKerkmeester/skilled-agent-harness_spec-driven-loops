---
title: "Context Index: deep-* release cleanup flatten"
description: "Migration bridge for 000-release-cleanup: the 2026-05-26 flatten of 5 per-skill buckets (and the phase5-backlog wrapper) into 15 standalone skill-prefixed specs."
trigger_phrases:
  - "000-release-cleanup flatten"
  - "deep skills release cleanup old path"
  - "deep-loop-runtime bucket new path"
  - "phase5-backlog new path"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup"
    last_updated_at: "2026-05-26T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "authored flatten bridge for 000 release cleanup"
    next_safe_action: "use as navigation bridge during resume"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:f3b05c81ca542015a4b3483fa2e587f29a041aaec439a6f588285f04a8fd6770"
      session_id: "116-000-context-index"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Context Index: deep-* release cleanup flatten

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

## WHEN TO USE THIS FILE

On 2026-05-26 `000-release-cleanup` was flattened: the 5 per-skill buckets (each a Level-3 spec that also held child sub-phases) were dissolved as containers, and every real spec — the 5 skill release-cleanup specs and their child sub-phases — was promoted to a standalone, skill-prefixed leaf directly under `000`. The thin `phase5-backlog` wrapper was removed (its 2 sub-phases promoted). Use this file to resolve an old path to its new home; full content of each spec is preserved intact.

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge

Paths are relative to `000-release-cleanup/`.

| Original Phase | New Home | Status | Notes |
|----------------|----------|--------|-------|
| `001-deep-loop-runtime/` | `001-deep-loop-runtime-release-cleanup/` | active | Skill bucket → standalone leaf; all docs/research preserved. |
| `001-deep-loop-runtime/001-doc-remediation/` | `002-deep-loop-runtime-doc-remediation/` | active | Promoted. |
| `001-deep-loop-runtime/002-evergreen-citation-sweep/` | `003-deep-loop-runtime-evergreen-citation-sweep/` | active | Promoted (cross-skill sweep, kept under deep-loop-runtime origin). |
| `001-deep-loop-runtime/003-reference-asset-alignment/` | `004-deep-loop-runtime-reference-asset-alignment/` | active | Promoted. |
| `002-deep-research/` | `005-deep-research-release-cleanup/` | active | Skill bucket → standalone leaf. |
| `002-deep-research/001-reference-split/` | `006-deep-research-reference-split/` | active | Promoted. |
| `003-deep-review/` | `007-deep-review-release-cleanup/` | active | Skill bucket → standalone leaf. |
| `003-deep-review/001-gate-model-reconciliation/` | `008-deep-review-gate-model-reconciliation/` | active | Promoted. |
| `003-deep-review/002-phase5-backlog/001-doc-cluster-remediation/` | `009-deep-review-phase5-doc-cluster-remediation/` | active | Promoted; `phase5-` token preserves the backlog grouping. |
| `003-deep-review/002-phase5-backlog/002-reducer-cluster-remediation/` | `010-deep-review-phase5-reducer-cluster-remediation/` | active | Promoted. |
| `003-deep-review/002-phase5-backlog/` | (removed) | replaced | Thin wrapper (trio only); dissolved after its 2 sub-phases promoted. |
| `004-deep-ai-council/` | `011-deep-ai-council-release-cleanup/` | active | Skill bucket → standalone leaf. |
| `004-deep-ai-council/001-deep-mode-docs-and-tests/` | `012-deep-ai-council-deep-mode-docs-and-tests/` | active | Promoted. |
| `005-deep-agent-improvement/` | `013-deep-agent-improvement-release-cleanup/` | active | Skill bucket → standalone leaf. |
| `005-deep-agent-improvement/001-benchmark-threshold-and-profile-path/` | `014-deep-agent-improvement-benchmark-threshold-and-profile-path/` | active | Promoted. |
| `005-deep-agent-improvement/002-deep-research-followon-findings/` | `015-deep-agent-improvement-deep-research-followon-findings/` | active | Promoted. |

Old packet IDs are preserved in each new folder's `description.json` (`memoryNameHistory`) and `graph-metadata.json` (`manual.supersedes`).
<!-- /ANCHOR:migration-bridge -->

---

<!-- ANCHOR:author-instructions -->
## Author Instructions

- Keep rows scoped to phase-folder movement or identity changes.
- Leave detailed rationale in each spec's own `decision-record.md` / `implementation-summary.md`.
- Remove this file when the bridge no longer helps navigation.
<!-- /ANCHOR:author-instructions -->
