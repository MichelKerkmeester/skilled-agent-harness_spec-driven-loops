---
title: "Implementation Summary: Flatten shared/references/global into shared/references"
description: "The 6 cross-cutting reference docs moved up from shared/references/global/ into shared/references/; all citations repointed and the moved docs' own relative-link depth corrected."
trigger_phrases:
  - "shared refs reorg summary"
  - "125 sk-doc phase 013 summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/013-shared-refs-reorg"
    last_updated_at: "2026-07-07T06:49:25.884Z"
    last_updated_by: "claude-opus"
    recent_action: "Moved 6 docs, repointed all citations, fixed relative-link depth"
    next_safe_action: "Parent rollup"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/shared/references/core_standards.md"
      - ".opencode/skills/sk-doc/shared/references/validation.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 013-shared-refs-reorg |
| **Completed** | 2026-07-07 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Flattened `sk-doc/shared/references/global/` by moving its 6 cross-cutting reference docs (`core_standards`, `validation`, `quick_reference`, `hvr_rules`, `evergreen_packet_id_rule`, `frontmatter_versioning`) up one level into `shared/references/`, then repointing every `shared/references/global/` citation to `shared/references/`. Two follow-up passes fixed depth/scope gaps the first sed missed: the moved docs' own outbound relative links (off by one `../` level after moving up), and the relative/bare citation forms (`../references/global/`, `references/global/`) the initial full-path sed did not match.

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| `shared/references/{6 docs}.md` | Renamed | Moved up from `global/` and their own `../` link depth corrected |
| ~60 sk-doc citation files | Modified | `shared/references/global/` -> `shared/references/` |
| 17 sk-doc prose/playbook/template files | Modified | Residual relative/bare `references/global/` repoints (workflows/optimization -> `create-quality-control/references/`) |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered by a deterministic `git mv` plus staged exact-string repoints during a concurrent-quiescent window. The move committed only the clean citation files 0-leak; concurrently-dirty referencers were repointed in the working tree and committed by their owner, converging to the same target. The link checker then surfaced two under-scoped gaps — the moved files' one-level `../` shift and the relative/bare citation forms — which were fixed and re-verified. `parent-skill-check` reports 0 warnings, and 0 broken links target any moved path.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| `git mv` + exact-string repoint | Deterministic move + citation update; no LLM for the mechanical parts |
| Reduce each moved-file link by one `../` | Moving up a level means one fewer up-step to the same target |
| Route `workflows`/`optimization` refs to `create-quality-control/references/` | Those docs were never in `global/`; they live in the quality-control packet |
| Leave historical/data artifacts | Changelog entries and measurement `.jsonl` document past state and must not be rewritten |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Notes |
|-----------|--------|-------|
| Link integrity | Pass | 0 broken links target any moved path; 0 broken under `shared/references/` |
| Residual scan | Pass | 0 `references/global` refs remain in `sk-doc/` |
| Parent-skill-check | Pass | All hard invariants, 0 warnings |
| Move correctness | Pass | 6 docs present at the new location; `global/` removed |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Non-sk-doc stragglers left** - A few `references/global` references outside `sk-doc/` (a historical changelog, a measurement `.jsonl`, a concurrently-dirty guard doc, a cross-skill playbook) were intentionally not rewritten.
2. **Concurrently-dirty citations** - Repointed in the working tree, committed by their owner to preserve 0-leak.

<!-- /ANCHOR:limitations -->
