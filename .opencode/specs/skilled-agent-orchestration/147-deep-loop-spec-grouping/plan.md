---
title: "Implementation Plan: system-deep-loop Spec Grouping [skilled-agent-orchestration/147-deep-loop-spec-grouping/plan]"
description: "Re-nest 18 standalone system-deep-loop packets under four phase parents via git-mv, scoped self-reference repair, offline metadata regeneration, parent phase-map updates, and a fast-forward landing — regression-neutral and concurrent-session-safe."
trigger_phrases:
  - "deep-loop grouping plan"
  - "system-deep-loop re-nest plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-deep-loop-spec-grouping"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Grouping plan authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Plan: system-deep-loop Spec Grouping

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Re-nest 18 of 29 operator-linked `system-deep-loop` packets as phase-children under four existing phase parents (054/038/052/030), reducing the linked top-level count from 29 to 11. Whole-subtree `git mv` preserves history; a scoped single-scan repair fixes self-references and the `Spec Folder` metadata row; per-folder regeneration refreshes identity; each parent's `children_ids` and phase-documentation map are updated. Reuses the packet-145/146 consolidation playbook, adapted for re-nesting (depth change) rather than same-level renumber. A read-only GPT-5.6-LUNA MAX analysis produced the grouping; the mechanical execution ran via deterministic scripts.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: 18 packets re-nested; linked top-level count 11; children_ids correct (030=12, 038=14, 052=12, 054=18); no temp leftovers.
- **Gate B**: Zero move-created stale-identity references in load-bearing .md/.json in the moved subtrees; every moved leaf's `Spec Folder` row equals its new leaf basename.
- **Gate C**: Migration-invariant validators pass; graph-metadata fresh tree-wide (backfill dry-run `changed=0` on the four parents).
- **Gate D**: Strict-validate error delta across the four parent subtrees ≤ 0 vs baseline.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure filesystem + metadata transform over the spec tree; no runtime code changes.

- **Move map** (18 entries): 054 ← 036,037,058,060,061,062 → `013-018`; 038 ← 039,040,045 → `008-010` and 041,042,043,044 → `011-014`; 052 ← 034,051,053,064 → `009-012`; 030 ← 055 → `012`. Slugs kept verbatim (minus number); child numbers in dependency order (054 parser→scorer, 061 before 062).
- **Rename engine**: whole-subtree `git mv` — `053`/`064` carry their own children; targets are new child numbers under each parent, so no collision.
- **Reference engine**: an old→new map drives a single-scan rewrite of the qualified `system-deep-loop/<old-basename>` token (which also covers nested `053`/`064` child subpaths via prefix) plus a targeted `| **Spec Folder** | <leaf> |` row fix, scoped to the 18 moved subtrees. Unique numeric prefixes make the scan order-safe.
- **Metadata engine**: `generate-description.js` then `backfill-graph-metadata.js --spec-folder <f> --root <worktree>` per moved spec folder (DB-free, run from the main tree against worktree paths since the worktree lacks built deps), **deepest-first**; then a parent backfill recomputes `children_ids`. Ordering is strict: repair fully → regen last (editing a doc after regen re-staleness `GENERATED_METADATA_INTEGRITY`); a parent whose spec.md phase-map is edited is re-backfilled after the edit.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Recon + baseline** — confirm the 4 parents' next child numbers + the 18 sources; capture full-depth per-parent + per-packet strict-validate baseline.
2. **Worktree** — allocate isolated owner-first worktree off origin tip.
3. **Canary** — move one packet (055→030/012), repair, regen; confirm backfill derives the nested `parent_id` and updates parent `children_ids` before batching.
4. **Move** — whole-subtree git-mv the remaining 17.
5. **Reference repair** — qualified-token + `Spec Folder` row, scoped to moved subtrees; residual sweep to zero.
6. **Regenerate** — per-folder backfill + generate-description deepest-first; parent children_ids reconciliation.
7. **Parent maps** — add phase-documentation-map rows in 030/038/052 (054 has no map); re-backfill the edited parents.
8. **Verify** — per-parent strict-validate error-count delta vs baseline; DB-mtime invariance; independent LUNA audit.
9. **Land** — explicit-path stage, conventional commit, rebase onto current origin, present for push approval, fast-forward push.
10. **Reindex** — operator-gated / deferred.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural assertions after the move (linked top-level = 11, children_ids counts, no temp, no stragglers).
- Residual grep sweeps after the rewrite (must reach zero qualified old-paths in the moved subtrees).
- `validate.sh --strict --recursive` per parent (full depth) compared to a captured baseline, measured by ERROR count (not the warnings-inclusive RESULT label) via an aligned pre/post SUM.
- Backfill `--dry-run changed=0` on all four parents (no residual metadata drift).
- Global-DB mtime invariance check (`2026-07-02 08:59:29`).

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-git` worktree allocator (concurrency-safe clone-wide lock).
- `system-spec-kit` generators: `backfill-graph-metadata.js` + `generate-description.js` (run from the main tree against worktree paths).
- GPT-5.6-LUNA MAX (cli-codex, read-only) for the grouping analysis and the final verification pass.
- A quiet primary checkout before any future reindex.

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lives on `skilled/0053-deep-loop-spec-grouping` in a throwaway worktree. Until the fast-forward push, `git worktree remove` + branch delete fully reverts. After push, revert is a single `git revert` of the grouping commit. No DB mutation occurs, so no DB rollback is needed.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

- Canary (3) gates Move (4); Move blocks Reference repair (5) blocks Regenerate (6) blocks Parent maps (7) blocks Verify (8) blocks Land (9).
- Parent-map edits (7) require a re-backfill of the edited parent before Verify.
- Reindex (10) depends on Land (9) AND a clean primary checkout — deferred.

<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Recon + baseline + canary | ~1h |
| Move + reference repair | ~0.5h (18 subtrees) |
| Regenerate + parent maps | ~1h (27-folder regen + 3 phase-maps + re-backfill) |
| Verify + LUNA audit | ~0.5h |
| Land | ~0.25h |

<!-- /ANCHOR:l2-effort -->
---
