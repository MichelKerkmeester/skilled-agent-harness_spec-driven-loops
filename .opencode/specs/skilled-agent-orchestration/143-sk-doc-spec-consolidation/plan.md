---
title: "Implementation Plan: sk-doc Spec Consolidation [skilled-agent-orchestration/143-sk-doc-spec-consolidation/plan]"
description: "Two-phase git-mv interleave, qualified-before-bare reference repair, offline metadata regeneration, root-JSON authoring, and fast-forward landing for the sk-doc documentation-authoring consolidation."
trigger_phrases:
  - "sk-doc consolidation plan"
  - "sk-doc migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-doc-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration plan authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Plan: sk-doc Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fold the 15 documentation-authoring packets from `skilled-agent-orchestration/` into `sk-doc` at their chronological positions, interleave-renumber the whole track `001`–`019` (keeping `999-create-diff-mode` separate), repair references, author the track-root spec + JSON + migration bridge, prune the movers from the SAO root, and land via fast-forward push from an isolated worktree. Reuses the completed CLI + mcp-tooling + sk-prompt + skill-advisor consolidation playbook, with two-phase git-mv because the target track already holds packets whose numbers collide during the shuffle.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: 19 folders contiguous 001–019 plus the separate 999; no temp leftovers; the 15 movers gone from SAO.
- **Gate B**: Zero residual stale-identity (old-number / old-path) references in load-bearing .md/.json.
- **Gate C**: Migration-invariant validators pass; 0 source_fingerprint mismatches tree-wide; self-identity detector = 0 corrupted refs.
- **Gate D**: Strict-validate error delta vs baseline ≤ 0.


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure filesystem + metadata transform over the spec tree; no runtime code changes.

- **Renumber map**: SAO movers → 001–014 + 016; existing sk-doc 014→015, 016→017, 015→018, 017→019; `999` unchanged. Slugs preserved from source.
- **Rename engine**: two-phase `git mv` (old → `__mig_tmp_NNN-slug` → final) — mandatory because the whole track shifts and target numbers collide with live packets during the shuffle.
- **Reference engine**: category-qualified tokens (`skilled-agent-orchestration/`, `sk-doc/`, and `z_archive/` origins) applied before slug-qualified bare-number rewrites, scoped to the migrated tree; order-safe (no rewrite output equals another's input); the bare-rewrite left boundary excludes `/` so dead-category `03--commands-and-skills/…` paths stay intact.
- **Metadata engine**: `backfill-graph-metadata.js --spec-folder` per phase-parent folder (DB-free); the track root (which backfill refuses as a non-`NNN-` folder) gets a hand-authored spec.md plus a `source_fingerprint` recomputed via the validator's own `computeSourceFingerprintForFolder`.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Recon + map** — enumerate, classify (15 clear movers; 017-cmd-create-prompt/032/077/069/072 and 112 excluded), confirm movers committed, build interleave map, capture baseline.
2. **Worktree** — allocate isolated owner-first worktree off origin tip.
3. **Move** — two-phase git-mv the whole track into sk-doc/001-019.
4. **Reference repair** — qualified-before-bare, slug-qualified rewrites; residual sweep + self-identity detector to zero.
5. **Regenerate** — backfill per folder; author track-root spec.md + graph-metadata + description + context-index; recompute root fingerprint.
6. **Verify** — strict-validate baseline delta (full-depth, per-packet recursive) + self-identity detector + independent LUNA audit.
7. **Land** — explicit-path stage, conventional commit, rebase onto current origin, prune 15 movers from origin's current SAO root, present for push approval, fast-forward push.
8. **Reindex** — operator-gated / skipped.


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural assertions after the move (contiguity 001–019, no temp, movers removed from SAO).
- Residual grep sweeps after each rewrite pass (must reach zero in load-bearing .md/.json).
- A deterministic self-identity-vs-disk detector across ALL folders (including grandchildren) — the prefix-collision defense.
- `validate.sh --strict --recursive` per packet (full depth) compared to a captured pre-migration baseline, measured by error count (not the warnings-inclusive RESULT label).
- source_fingerprint integrity re-derive across the tree (0 mismatches).
- Independent GPT-5.6-LUNA (max, read-only) audit of the migration invariants with file:line evidence.


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-git` worktree allocator (concurrency-safe clone-wide lock).
- `system-spec-kit` generators: `backfill-graph-metadata.js`; the validator's `computeSourceFingerprintForFolder` for the track-root recompute.
- `cli-codex` dispatch contract for the LUNA audit.
- A quiet primary checkout before any future reindex.


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lives on `skilled/0049-sk-doc-spec-consolidation`. Until the fast-forward push, `git worktree remove` + branch delete fully reverts. After push, revert is a single `git revert` of the migration commit. No DB mutation occurs, so no DB rollback is needed.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

- Move (3) blocks Reference repair (4) blocks Regenerate (5) blocks Verify (6) blocks Land (7).
- The SAO-root mover-prune is applied inside Land (7) against origin's current SAO root, not the stale worktree copy.
- Reindex (8) depends on Land (7) AND a clean primary checkout — gated/skipped.


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Recon + map + baseline | ~0.5h |
| Move + reference repair | ~0.75h (full-track interleave) |
| Regenerate + verify | ~0.5h (regen + baseline delta + LUNA) |
| Land | ~0.25h |


<!-- /ANCHOR:l2-effort -->
---
