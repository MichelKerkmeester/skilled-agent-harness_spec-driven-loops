---
title: "Implementation Plan: MCP-tooling Spec Consolidation [skilled-agent-orchestration/140-mcp-spec-consolidation/plan]"
description: "git-mv move-in, category-qualified + scoped bare reference repair, offline metadata regeneration, and fast-forward landing for the mcp-tooling consolidation."
trigger_phrases:
  - "mcp consolidation plan"
  - "mcp-tooling migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/140-mcp-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration plan authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Plan: MCP-tooling Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Move 8 committed MCP-tooling packets from `skilled-agent-orchestration/` into a new `mcp-tooling` track, chronological by original number → `001`–`008`. Execute the mechanical move + reference repair deterministically, regenerate metadata offline against worktree paths, and land via fast-forward push from an isolated worktree. An independent GPT-5.6-LUNA read-only audit verifies the result. Reuses the completed CLI-consolidation playbook.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: 8 folders contiguous 001–008; no temp leftovers; movers gone from SAO.
- **Gate B**: Zero residual stale-identity (z_archive / old-SAO / bare-old-number) paths in the mcp tree.
- **Gate C**: Migration-invariant validators pass for all packets.
- **Gate D**: Strict-validate error delta vs baseline ≤ 0.


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure filesystem + metadata transform over the spec tree; no runtime code changes.

- **Renumber map**: chronological sort of the 8 movers by original packet number → 001–008, slugs preserved. Fresh category (no interleave).
- **Rename engine**: single-phase `git mv` (collision-free — all target numbers are new).
- **Reference engine**: category-qualified tokens (both z_archive-origin and top-level SAO forms) scoped to the mcp tree, plus a mcp-tree-scoped bare-token pass for stale bare self-references (safe: mover slugs unique, twins deleted).
- **Metadata engine**: `generate-description.js` + `backfill-graph-metadata.js --spec-folder` per folder (DB-free; verified no global-DB mutation).


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Recon + map** — enumerate, classify (065 excluded), confirm all movers committed, build map.
2. **Worktree** — allocate isolated owner-first worktree off origin tip.
3. **Move** — single-phase git-mv the 8 packets into mcp-tooling/001-008.
4. **Reference repair** — category-qualified + scoped bare rewrites; residual sweep to zero.
5. **Regenerate** — description + graph-metadata per folder; author mcp-tooling root JSONs; prune SAO root.
6. **Verify** — strict-validate baseline delta + independent LUNA audit.
7. **Land** — explicit-path stage, conventional commit, fast-forward push.
8. **Reindex** — operator-gated / skipped.


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural assertions in the move script (contiguity, no temp, movers removed).
- Residual grep sweeps after each rewrite pass (must reach zero).
- Per-packet `validate.sh --strict --recursive` compared to a captured pre-migration baseline, measured by error count (not the warnings-inclusive RESULT label).
- Independent GPT-5.6-LUNA (max, read-only) audit of 8 invariants with file:line evidence.


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

All work lives on `skilled/0044-mcp-tooling-consolidation`. Until the fast-forward push, `git worktree remove` + branch delete fully reverts. After push, revert is a single `git revert` of the migration commit. No DB mutation occurs, so no DB rollback is needed.


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
| Recon + map | ~0.5h |
| Move + reference repair | ~0.5h |
| Regenerate + verify | ~0.5h (regen + baseline delta + LUNA) |
| Land | ~0.25h |


<!-- /ANCHOR:l2-effort -->
---
