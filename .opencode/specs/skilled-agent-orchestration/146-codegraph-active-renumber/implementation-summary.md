---
title: "Implementation Summary: system-code-graph Active-Packet Renumber [skilled-agent-orchestration/146-codegraph-active-renumber/implementation-summary]"
description: "Outcome of renumbering the eleven active system-code-graph packets 001-011 to 025-035: single-phase move, scoped reference repair, offline regeneration, track-root authoring, and a regression-neutral (net -9 errors) validation."
trigger_phrases:
  - "system-code-graph renumber summary"
  - "code-graph active renumber result"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-codegraph-active-renumber"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Renumber executed, regenerated, and validated regression-neutral (net -9)"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Summary: system-code-graph Active-Packet Renumber

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Complete |
| **Completed** | 2026-07-15 |
| **Branch** | `skilled/0052-codegraph-active-renumber` |


<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The `system-code-graph` active packets were renumbered into a single continuous sequence after the archive:

- **Eleven active packets renumbered `001-011` → `025-035`** so they follow `z_archive/001-024` (one `001-035` track). Four slugs normalized `codegraph`→`code-graph` (`026`, `027`, `028`, `033`); `010-code-graph-scatter-027` clarified to `034-code-graph-scatter-from-027` (a source-tree label distinguishing the 027-refinement-tree scatter from `032-code-graph-scatter`, the 026-optimization-tree scatter).
- **Single-phase `git mv`** preserved rename history without transient collisions — safe because target numbers `025-035` did not exist. 2,033 renames (1,255 pure `R` + 778 `RM`), 0 delete+add.
- **Reference repair** scoped to the renamed trees: an old→new full-path map (11 entries) drove qualified (`system-code-graph/<old>`) rewrites before bare parent-slug rewrites, single-scan and order-safe (unique numeric prefixes, longest-first). 778 files changed (5,045 qualified + 109 bare hits); residual old current-track paths in `025-035`: **0**.
- **Metadata regenerated** for 118/120 affected folders (`generate-description.js` + `backfill-graph-metadata.js`, run from the main tree against worktree paths, children-first), with the global DB mtime unchanged. The 2 skips are folders carrying a `graph-metadata.json` but no `spec.md` (a deep-research `iterations` dir and a metadata-only stub) — correctly not spec folders.
- **Track-root surface authored**: `system-code-graph/graph-metadata.json` children_ids list all 11 active packets (`025-035`) plus `z_archive` (12 entries); a canonical root `spec.md`, regenerated `description.json`, and `context-index.md` (the renumber bridge with the old→new table) created; `source_fingerprint` recomputed via the validator's own `computeSourceFingerprintForFolder`; `manual.related_to` set to a schema-valid object pointing at this record packet.


<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. **Recon + baseline** — confirmed 11 active packets + `z_archive/001-024`, captured a full-depth per-packet strict-validate baseline (11-packet error SUM = 29; root own-errors = 4).
2. **Isolated worktree** — allocated `skilled/0052-codegraph-active-renumber` off origin tip `413f463c22b` via the sk-git allocator.
3. **Move** — single-phase git-mv'd `001-011` → `025-035` (2,033 renames).
4. **Scoped reference repair** — qualified-before-bare, full-path map, single-scan rewrites (778 files changed).
5. **Offline regeneration** — per-folder `backfill-graph-metadata` + `generate-description` from the main tree, track-root spec + JSON authoring, root fingerprint recompute, children_ids reconciliation (DB-free).
6. **Verification** — full-depth per-packet recursive strict-validate vs the captured baseline via an aligned old→new SUM (29 → 22), root re-validate (4 → 2), a residual grep sweep (0), and a DB-mtime invariance check.


<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

- **Single-phase git-mv** (over two-phase): the active packets move into an empty `025-035` band, so no target number collides with a live packet during the shuffle; the tmp step was unnecessary.
- **`-027` kept as a meaningful label, not stripped**: `010-code-graph-scatter-027` is the 027-refinement-tree scatter parent, paralleling `008-code-graph-scatter` (the 026-optimization-tree scatter). Dropping `-027` would erase that distinction and collide slug-wise with `032`; renamed to `034-code-graph-scatter-from-027` (operator).
- **Only the four parent slugs normalized**: child slugs containing `codegraph` were left unchanged — out of scope for a parent renumber.
- **Root authored to the track-root pattern**: the pre-existing root was "live" generated metadata with no `spec.md` and empty `source_docs`, failing the enforced canonical-save root checks (4 errors). Authoring a real root `spec.md` + recomputed `source_fingerprint` + populated `source_docs` + object-shaped `related_to` cleared 3 of the 4 (only inherent `FOLDER_NAMING` remains, plus an inherent `FRONTMATTER_MEMORY_BLOCK` for the single-segment pointer → 2 inherent).
- **Error count, not the RESULT label, is the regression metric**: the validator labels any warning-bearing folder "RESULT: FAILED"; measuring errors via an aligned old→new SUM avoided a false regression signal and corrected an earlier `tail -1` undercount.


<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

- **Structural**: `system-code-graph` active = 11 contiguous folders `025-035` plus `z_archive/001-024`, no gaps/dups/temp; archive untouched.
- **Reference (renumber-created)**: residual grep for the OLD paths (`system-code-graph/00N-<oldslug>`) in the renamed dirs = **0** — the renumber created zero broken current-track identity, and the prefix-collision class is ruled out by unique numeric prefixes + longest-first alternation + a word-char/`/`-excluded bare boundary.
- **Reference (pre-existing / out of scope)**: 538 residual `codegraph` occurrences remain — all child slugs, trigger phrases, or generated tokens outside the four normalized parent slugs; intentionally untouched.
- **Migration-invariant validators**: children_ids resolve on disk (e.g. `032` → 16 children under `system-code-graph/032-...`); disk-path consistency and folder-naming hold on the renamed folders.
- **Regression baseline**: pre-renumber full-depth per-packet baseline = 29 errors over the 11 active packets (root own = 4). Post-renumber per-packet recursive SUM over the aligned new folders = **22** (025:2, 026-029:0, 030:0, 031:1, 032:13, 033:0, 034:5, 035:1); packet delta **−7**, every packet ≤ 0; the root fell 4 → 2. **0 packets gained errors; net −9.** The improvements are regen clearing stale `GENERATED_METADATA_INTEGRITY`. Every remaining error is a pre-existing template/scaffold/integrity debt type a rename/repair/regen cannot create.


<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:nfr-verify -->
## NFR Verification

- **Performance**: all 120 folder regen passes completed unattended.
- **Security**: no destructive op outside the renumber path set; no global-DB write from the worktree (mtime-verified `2026-07-02 08:59:29`).
- **Reliability**: all 2,033 moves preserve git rename history; the token map is deterministic and single-scan order-safe (unique numeric prefixes).


<!-- /ANCHOR:nfr-verify -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Pre-existing doc-quality debt** in the renamed packets (the residual 22 packet errors: template placeholders, generated-metadata integrity, spec-doc integrity) remains — deliberately untouched (SCOPE LOCK). None is renumber-created (per-packet counts held flat or improved).
- **Two inherent track-root errors** (`FOLDER_NAMING` skill-named root + `FRONTMATTER_MEMORY_BLOCK` single-segment pointer) remain — structural to a track root, matching the system-speckit root.
- **Phase-child slugs containing `codegraph`** are unchanged — only the four parent slugs were in scope.
- **Cross-tree references** to the old `system-code-graph/00N-...` paths (in other tracks/skills) are left as-is per the scoped-repair rule; memory search may resolve stale old paths until a future reindex.
- **Memory/vector reindex** deferred per operator.


<!-- /ANCHOR:limitations -->
---

<!-- ANCHOR:deviations -->
## Deviations from Plan

- **`-027` reframed mid-execution**: the goal prompt called `010-code-graph-scatter-027` a "foreign-number anti-pattern" to strip; reading the packet showed `-027` is a meaningful source-tree label (paralleling `008`'s 026-tree scatter). Surfaced to the operator, who chose the clarified `034-code-graph-scatter-from-027` rather than a strip.
- **Scale larger than the prompt assumed**: the 11 "packets" are nested phase-parent trees totalling ~2,033 files (031 alone = 1,376), not flat folders — surfaced to the operator before mutation; approach unchanged (isolated worktree, per-folder regen).
- **Regen run from the main tree**: the bare worktree lacks `dist/` + `node_modules`, so `backfill-graph-metadata.js` + `generate-description.js` were invoked from the main checkout against worktree paths (the established large-reorg pattern), verified DB-free by the unchanged global-DB mtime.
- **Root regen was hand-authored, not backfilled**: `backfill` refuses the track root (a non-`NNN-` folder with no `spec.md`); the root got a hand-authored `spec.md` + a `patch` script recomputing the real `source_fingerprint`.


<!-- /ANCHOR:deviations -->
---
