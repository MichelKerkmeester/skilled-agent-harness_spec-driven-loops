---
title: "Implementation Plan: CLI Spec Consolidation [skilled-agent-orchestration/139-cli-spec-consolidation/plan]"
description: "Two-phase git-mv renumber, category-qualified reference repair, offline metadata regeneration, and fast-forward landing for the cli-external-orchestration consolidation."
trigger_phrases:
  - "cli consolidation plan"
  - "renumber plan"
  - "cli-external-orchestration migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/139-cli-spec-consolidation"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration plan authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Plan: CLI Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Consolidate 23 existing + 5 committed movers = 28 CLI-skill packets into a single contiguous `cli-external-orchestration` track, chronological by original number. Execute the mechanical rename + reference repair deterministically (provably correct over 28 folders), regenerate metadata offline against worktree paths, and land via fast-forward push from an isolated worktree. An independent GPT-5.6-LUNA read-only audit verifies the result.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: All 28 folders contiguous 001–028; no temp leftovers; movers gone from SAO.
- **Gate B**: Zero residual stale-identity paths in the CEO tree.
- **Gate C**: Migration-invariant validators pass for all packets (child-drift, disk-path-consistency, shapes, folder-naming).
- **Gate D**: Strict-validate delta vs baseline introduces no new error categories.


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The migration is a pure filesystem + metadata transform over the spec tree; no runtime code changes.

- **Renumber map**: chronological merge-sort of both source lists by original packet number → 001–028, slugs preserved.
- **Rename engine**: two-phase `git mv` (old → `__mig_tmp_<new>` → `<new>`) to avoid transient number collisions.
- **Reference engine**: longest-first token replacement. Category-qualified tokens applied worktree-wide (precise); CEO-tree-scoped identity tokens repair each packet's stale `z_archive` origin (twins are deleted → dangling → safe to rewrite in-tree only).
- **Metadata engine**: `generate-description.js` + `backfill-graph-metadata.js --spec-folder` per folder (both DB-free for the JSON write; verified no global-DB mutation).


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Recon + map** — enumerate, classify, resolve mover availability, build chronological map.
2. **Worktree** — allocate isolated owner-first worktree off origin tip.
3. **Rename** — two-phase git-mv all 28 folders.
4. **Reference repair** — category-qualified + CEO-tree-scoped rewrites; residual sweep to zero.
5. **Regenerate** — description + graph-metadata per folder; author CEO root JSONs; prune SAO root.
6. **Verify** — strict-validate + baseline delta + independent LUNA audit.
7. **Land** — explicit-path stage, conventional commit, fast-forward push.
8. **Reindex** — deferred to MAIN post-merge (gated on daemon/clean sync).


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural assertions in the rename script (contiguity, no temp, movers removed).
- Residual grep sweeps after each rewrite pass (must reach zero).
- `validate.sh --strict --recursive` on the CEO track, compared against a captured pre-migration baseline.
- Independent GPT-5.6-LUNA (max, read-only) audit of 8 invariants with file:line evidence.


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-git` worktree allocator (concurrency-safe clone-wide lock).
- `system-spec-kit` generators: `generate-description.js`, `backfill-graph-metadata.js`.
- `cli-codex` dispatch contract for the LUNA audit.
- A quiet primary checkout (or committed concurrent work) before the final reindex.


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lives on the isolated branch `skilled/0043-cli-spec-consolidation`. Until the fast-forward push, `git worktree remove` + branch delete fully reverts. After push, revert is a single `git revert` of the migration commit (renames + metadata are one commit). No DB mutation occurs pre-reindex, so no DB rollback is needed.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

- Rename (3) blocks Reference repair (4) blocks Regenerate (5) blocks Verify (6) blocks Land (7).
- Reindex (8) depends on Land (7) reaching origin AND a clean primary checkout.


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Recon + map | ~1h (classification + evidence checks) |
| Rename + reference repair | ~1h (deterministic scripts + residual sweeps) |
| Regenerate + verify | ~1h (175 folder passes + baseline delta + LUNA) |
| Land + reindex | ~0.5h (+ deferred reindex on clean sync) |


<!-- /ANCHOR:l2-effort -->
---
