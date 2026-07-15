---
title: "Implementation Plan: system-speckit Spec Consolidation [skilled-agent-orchestration/145-speckit-spec-consolidation/plan]"
description: "Two-phase git-mv interleave, qualified-before-bare reference repair, offline metadata regeneration, root-JSON authoring, and fast-forward landing for the system-speckit spec-kit-subsystem consolidation."
trigger_phrases:
  - "system-speckit consolidation plan"
  - "system-speckit migration"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-speckit-spec-consolidation"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Migration plan authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Plan: system-speckit Spec Consolidation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Fold the 10 spec-kit-subsystem packets from `skilled-agent-orchestration/` into `system-speckit` at their chronological positions, interleave-renumber the whole track `001`–`016`, repair references, author the track-root spec + JSON + migration bridge, prune the movers from the SAO root, and land via fast-forward push from an isolated worktree. Reuses the completed CLI + mcp-tooling + sk-prompt + skill-advisor + sk-doc consolidation playbook, with two-phase git-mv because the target track already holds packets whose numbers collide during the shuffle.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: 16 folders contiguous 001–016 plus z_archive; no temp leftovers; the 10 movers gone from SAO.
- **Gate B**: Zero migration-created stale-identity (old-number / old-path) references in load-bearing .md/.json.
- **Gate C**: Migration-invariant validators pass; 0 source_fingerprint mismatches tree-wide.
- **Gate D**: Strict-validate error delta vs baseline ≤ 0.


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure filesystem + metadata transform over the spec tree; no runtime code changes.

- **Renumber map**: SAO movers → 001, 006, 009–016; existing system-speckit 026→002, 027→003, 028→004, 030→005, 029→007, 031→008. Slugs preserved from source.
- **Rename engine**: two-phase `git mv` (old → `__mig_tmp_NNN-slug` → final) — mandatory because the whole track shifts and target numbers collide with live packets during the shuffle.
- **Reference engine**: category-qualified tokens (`skilled-agent-orchestration/` and `system-speckit/` origins) applied before slug-qualified bare-number rewrites, scoped to the migrated tree; a single-scan alternation makes it order-safe (no rewrite output equals another's input); the bare-rewrite left boundary excludes `/` so dead-category `03--commands-and-skills/…` and hyphenated `system-spec-kit/…` paths stay intact.
- **Metadata engine**: `backfill-graph-metadata.js` per phase-parent folder (DB-free, run from the main tree against worktree paths since the worktree lacks built deps); the track root (which backfill refuses as a non-`NNN-` folder) gets a hand-authored spec.md plus a `source_fingerprint` recomputed via the validator's own `computeSourceFingerprintForFolder`.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Recon + map** — enumerate, classify (10 clear movers; 030-cmd-spec-kit-codex-skill-routing operator-kept in SAO; code-graph side confirmed empty by content), confirm movers committed, build interleave map, capture baseline.
2. **Worktree** — allocate isolated owner-first worktree off origin tip.
3. **Move** — two-phase git-mv the whole track into system-speckit/001-016.
4. **Reference repair** — qualified-before-bare, slug-qualified rewrites; residual sweep to zero.
5. **Regenerate** — backfill per folder; author track-root spec.md + graph-metadata + description + context-index; recompute root fingerprint.
6. **Verify** — strict-validate baseline delta (full-depth, per-packet recursive) + self-identity count-parity + independent LUNA audit.
7. **Land** — explicit-path stage, conventional commit, rebase onto current origin, prune movers from origin's current SAO root, present for push approval, fast-forward push.
8. **Reindex** — operator-gated / skipped.


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural assertions after the move (contiguity 001–016, no temp, movers removed from SAO).
- Residual grep sweeps after each rewrite pass (must reach zero for current-track paths in load-bearing .md/.json).
- A deterministic origin-vs-worktree occurrence-count comparison to separate pre-existing self-identity debt from migration-created refs.
- `validate.sh --strict --recursive` per packet (full depth) compared to a captured pre-migration baseline, measured by error count (not the warnings-inclusive RESULT label).
- source_fingerprint integrity re-derive across the tree (0 mismatches).
- Independent GPT-5.6-LUNA (max, read-only) audit of the migration invariants with file:line evidence.


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-git` worktree allocator (concurrency-safe clone-wide lock).
- `system-spec-kit` generators: `backfill-graph-metadata.js` + `generate-description.js`; the validator's `computeSourceFingerprintForFolder` for the track-root recompute (run from the main tree).
- `cli-codex` dispatch contract for the LUNA audit.
- A quiet primary checkout before any future reindex.


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lives on `skilled/0051-speckit-spec-consolidation`. Until the fast-forward push, `git worktree remove` + branch delete fully reverts. After push, revert is a single `git revert` of the migration commit. No DB mutation occurs, so no DB rollback is needed.


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
| Regenerate + verify | ~0.75h (regen + baseline delta + LUNA; large trees) |
| Land | ~0.25h |


<!-- /ANCHOR:l2-effort -->
---
