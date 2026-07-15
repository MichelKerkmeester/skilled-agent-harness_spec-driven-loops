---
title: "Implementation Plan: sk-prompt Spec Consolidation [skilled-agent-orchestration/141-sk-prompt-spec-consolidation/plan]"
description: "Two-phase git-mv interleave, slug-qualified reference repair, offline metadata regeneration, root-JSON authoring, and fast-forward landing for the sk-prompt consolidation."
trigger_phrases:
  - "sk-prompt consolidation plan"
  - "sk-prompt migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/141-sk-prompt-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration plan authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Plan: sk-prompt Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Interleave the 3 stranded sk-prompt-owned packets from `skilled-agent-orchestration/` with the 3 already in `sk-prompt`, renumber the whole track chronologically by original number → `001`–`006`, repair references, author the missing track-root JSONs, and land via fast-forward push from an isolated worktree. Reuses the completed CLI + mcp-tooling consolidation playbook, with two-phase git-mv because the target track already holds packets.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: 6 folders contiguous 001–006; no temp leftovers; movers gone from SAO.
- **Gate B**: Zero residual stale-identity (old-number / old-path) references in the sk-prompt tree.
- **Gate C**: Migration-invariant validators pass for all packets.
- **Gate D**: Strict-validate error delta vs baseline ≤ 0.


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure filesystem + metadata transform over the spec tree; no runtime code changes.

- **Renumber map**: chronological sort of the 6 packets (existing 003/068/105 + movers 071/121/124) by original number → 001–006, slugs preserved.
- **Rename engine**: two-phase `git mv` (old → `__mig_tmp_NNN-slug` → final) — mandatory because `sk-prompt` already holds packets whose numbers collide with targets during the shuffle.
- **Reference engine**: category-qualified tokens (both `skilled-agent-orchestration/` and `sk-prompt/` origins) applied before slug-qualified bare-number rewrites, scoped to the sk-prompt tree.
- **Metadata engine**: `generate-description.js` + `backfill-graph-metadata.js --spec-folder` per folder (DB-free; verified no global-DB mutation); hand-authored track-root JSONs.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Recon + map** — enumerate, classify (017/032/077 excluded), confirm movers committed, build interleave map, capture baseline.
2. **Worktree** — allocate isolated owner-first worktree off origin tip.
3. **Move** — two-phase git-mv the 6 packets into sk-prompt/001-006.
4. **Reference repair** — qualified + slug-qualified bare rewrites; residual sweep to zero.
5. **Regenerate** — description + graph-metadata per folder; author sk-prompt root JSONs; prune SAO root.
6. **Verify** — strict-validate baseline delta + independent LUNA audit.
7. **Land** — explicit-path stage, conventional commit, fast-forward push.
8. **Reindex** — operator-gated / skipped.


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural assertions after the move (contiguity, no temp, movers removed).
- Residual grep sweeps after each rewrite pass (must reach zero).
- Per-packet `validate.sh --strict --recursive` compared to a captured pre-migration baseline, measured by error count (not the warnings-inclusive RESULT label).
- Independent GPT-5.6-LUNA (max, read-only) audit of the migration invariants with file:line evidence.


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-git` worktree allocator (concurrency-safe clone-wide lock).
- `system-spec-kit` generators: `generate-description.js`, `backfill-graph-metadata.js`.
- `cli-codex` dispatch contract for the LUNA audit.
- A quiet primary checkout before any future reindex.


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lives on `skilled/0046-sk-prompt-consolidation`. Until the fast-forward push, `git worktree remove` + branch delete fully reverts. After push, revert is a single `git revert` of the migration commit. No DB mutation occurs, so no DB rollback is needed.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

- Move (3) blocks Reference repair (4) blocks Regenerate (5) blocks Verify (6) blocks Land (7).
- Reindex (8) depends on Land (7) AND a clean primary checkout — gated/skipped.


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Recon + map + baseline | ~0.5h |
| Move + reference repair | ~0.5h |
| Regenerate + verify | ~0.5h (regen + baseline delta + LUNA) |
| Land | ~0.25h |


<!-- /ANCHOR:l2-effort -->
---
