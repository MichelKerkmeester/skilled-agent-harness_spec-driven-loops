---
title: "Implementation Plan: system-code-graph Active-Packet Renumber [skilled-agent-orchestration/146-codegraph-active-renumber/plan]"
description: "Single-phase git-mv renumber, qualified-before-bare reference repair, offline metadata regeneration, track-root authoring, and fast-forward landing for the system-code-graph active-packet renumber 001-011 to 025-035."
trigger_phrases:
  - "system-code-graph renumber plan"
  - "code-graph active renumber"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-codegraph-active-renumber"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Renumber plan authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Plan: system-code-graph Active-Packet Renumber

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Renumber the eleven active `system-code-graph` packets `001-011` → `025-035` so they continue after the archived `z_archive/001-024` as one contiguous sequence, normalize four `codegraph`→`code-graph` slugs, clarify the 027-tree scatter slug, repair references, regenerate metadata, author the track root, and land via fast-forward push from an isolated worktree. Reuses the completed system-speckit consolidation playbook (packet 145), with single-phase git-mv because the target numbers `025-035` were empty.


<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- **Gate A**: 11 active folders contiguous `025-035` after `z_archive/001-024`; no temp leftovers; archive untouched.
- **Gate B**: Zero renumber-created stale-identity (old-number / old-path) references in load-bearing .md/.json.
- **Gate C**: Migration-invariant validators pass; source_fingerprint refreshed tree-wide (no new integrity errors).
- **Gate D**: Strict-validate error delta vs baseline ≤ 0.


<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure filesystem + metadata transform over the spec tree; no runtime code changes.

- **Renumber map**: `001→025, 002→026, 003→027, 004→028, 005→029, 006→030, 007→031, 008→032, 009→033, 010→034, 011→035`; four slugs normalized `codegraph`→`code-graph` (026/027/028/033); `010-code-graph-scatter-027`→`034-code-graph-scatter-from-027`.
- **Rename engine**: single-phase `git mv` — safe because target numbers `025-035` do not exist (root held only `001-011` + `z_archive/`), so no transient collision arises.
- **Reference engine**: an old→new full-path map (11 entries) drives a single-scan rewrite; category-qualified (`system-code-graph/<old>`) rewrites applied before bare parent-slug rewrites; alternatives sorted longest-first with unique numeric prefixes so the scan is order-safe; the bare-rewrite left boundary excludes `/` and word chars; scoped to the renamed trees only.
- **Metadata engine**: `generate-description.js` then `backfill-graph-metadata.js --spec-folder <f> --root <worktree>` per folder (DB-free, run from the main tree against worktree paths since the worktree lacks built deps), children-first. The track root (which backfill refuses as a non-`NNN-` folder) gets a hand-authored `spec.md` plus a `source_fingerprint` recomputed via the validator's own `computeSourceFingerprintForFolder`.


<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Recon + baseline** — confirm 11 active packets + `z_archive/001-024`; capture full-depth per-packet strict-validate baseline.
2. **Worktree** — allocate isolated owner-first worktree off origin tip.
3. **Move** — single-phase git-mv `001-011` → `025-035` (2,033 files).
4. **Reference repair** — qualified-before-bare, full-path map; residual sweep to zero.
5. **Regenerate** — per-folder backfill + generate-description; author track-root spec.md + graph-metadata + description + context-index; recompute root fingerprint.
6. **Verify** — per-packet strict-validate error-count delta vs baseline; DB-mtime invariance.
7. **Land** — explicit-path stage, conventional commit, rebase onto current origin, present for push approval, fast-forward push.
8. **Reindex** — operator-gated / deferred.


<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Structural assertions after the move (contiguity `025-035`, no temp, archive intact).
- Residual grep sweeps after the rewrite (must reach zero for old current-track paths in the renamed dirs).
- `validate.sh --strict --recursive` per packet (full depth) compared to a captured baseline, measured by ERROR count (not the warnings-inclusive RESULT label) via an aligned old→new SUM.
- source_fingerprint refresh across the tree (no new GENERATED_METADATA_INTEGRITY errors).
- Global-DB mtime invariance check (`2026-07-02 08:59:29`).


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `sk-git` worktree allocator (concurrency-safe clone-wide lock).
- `system-spec-kit` generators: `backfill-graph-metadata.js` + `generate-description.js`; the validator's `computeSourceFingerprintForFolder` for the track-root recompute (run from the main tree).
- A quiet primary checkout before any future reindex.


<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

All work lives on `skilled/0052-codegraph-active-renumber` in a throwaway worktree. Until the fast-forward push, `git worktree remove` + branch delete fully reverts. After push, revert is a single `git revert` of the renumber commit. No DB mutation occurs, so no DB rollback is needed.


<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

- Move (3) blocks Reference repair (4) blocks Regenerate (5) blocks Verify (6) blocks Land (7).
- Root authoring inside Regenerate (5) depends on the renamed folders existing on disk.
- Reindex (8) depends on Land (7) AND a clean primary checkout — deferred.


<!-- /ANCHOR:l2-phase-deps -->
---

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| Recon + baseline | ~0.5h |
| Move + reference repair | ~0.5h (single-phase, 2,033 files) |
| Regenerate + verify | ~1h (120-folder regen + baseline delta; large 031 tree) |
| Land | ~0.25h |


<!-- /ANCHOR:l2-effort -->
---
