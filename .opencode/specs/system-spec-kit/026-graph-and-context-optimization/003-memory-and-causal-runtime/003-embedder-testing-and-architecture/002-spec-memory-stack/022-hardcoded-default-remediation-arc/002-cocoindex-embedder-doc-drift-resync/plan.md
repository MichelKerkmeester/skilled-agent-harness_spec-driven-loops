---
title: "Plan: 022/002 CocoIndex Embedder Doc-Drift Resync"
description: "Doc-only main-agent edits to 4 files closing the embedder-side P0 doc drift. Reranker side deferred to 002b."
trigger_phrases:
  - "022/002 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync"
    last_updated_at: "2026-05-23T16:15:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan authored post-execution"
    next_safe_action: "n/a — phase shipped"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022c2"
      session_id: "016-002-022-002-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Main-agent direct chosen over cli-devin: 4 doc edits with pre-verified canonicals is below dispatch ROI"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/002 CocoIndex Embedder Doc-Drift Resync

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

CocoIndex docs cite stale embedder defaults (`google/embeddinggemma-300m`, `jinaai/jina-embeddings-v2-base-code`). Current default per `registered_embedders.py:255` is `sbert/nomic-ai/CodeRankEmbed` (since 2026-05-19 018 follow-on). 4 doc surfaces need re-sync.

### Overview

4 file edits applied via main-agent Edit. No new files. Reranker prose corrections split into phase 002b for Qwen3-Reranker-0.6B footprint verification.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- `DEFAULT_EMBEDDER_NAME` verified in `registered_embedders.py` — DONE
- 4 target file/line surfaces enumerated — DONE
- Reranker-side scope split documented — DONE

### Definition of Done

- All 4 R1–R4 verifications pass
- Strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Mechanical string replacement on documentation files. No code path affected. Edit-tool diffs only.

### Key Components

- `config_templates.md` 3 `_NOTE_2` lines (OpenCode/Claude/Codex CLI templates)
- `ENV_REFERENCE.md:560` last-updated date
- `embedder-pluggability.md:342` registered-candidate table row
- `SKILL.md:8` keywords block
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verification

Read `registered_embedders.py:255-256` to confirm canonical `DEFAULT_EMBEDDER_NAME` and `DEFAULT_RERANKER_NAME` before applying edits.

### Phase 2: Core Implementation

4 Edit calls applied to 4 files. `replace_all=true` on the multi-line block in `config_templates.md` caught all 3 `_NOTE_2` instances at lines 75/140/160 because they share the surrounding context.

### Phase 3: Verification

- `rg "google/embeddinggemma-300m" config_templates.md` → 0 hits
- `grep "Last updated" ENV_REFERENCE.md` → date refreshed
- `grep "production CocoIndex default" embedder-pluggability.md` → 0 hits OR matches new historical wording
- `grep "code-rank-embed" SKILL.md` → ≥1 hit
- `bash validate.sh 002-cocoindex-embedder-doc-drift-resync --strict` → exit 0
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Documentation-only. No automated tests. Verification by grep ban-list per R1–R4.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 001 (shipped): registered_embedders.py canonical defaults verified pre-edit
- Packet 020: getCanonicalFallback shipped; CocoIndex default name unchanged in code (only doc-side drift)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git restore` on the 4 changed files. Reverts docs to pre-edit state (stale embedder citations). No behavior or state corruption.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Phase 002 (this) is independent of all other 022 phases. Phase 002b (deferred) depends on Qwen3-Reranker-0.6B model-card lookup outside this session.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Estimate | Actual |
|---|---|---|
| Verification | 5 min | ~10 min (also discovered memory drift on reranker) |
| Edits | 15 min | ~10 min |
| Verify + doc | 10 min | ~5 min |
| Total | 30 min | ~25 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If reranker-side prose in 002b conflicts with an interim ADR change, `git revert` this phase and reapply after 002b lands. Low likelihood — embedder + reranker doc surfaces are disjoint.
<!-- /ANCHOR:enhanced-rollback -->
