---
title: "Verification Checklist: system-code-graph Active-Packet Renumber [skilled-agent-orchestration/146-codegraph-active-renumber/checklist]"
description: "QA verification for the system-code-graph 001-011 to 025-035 renumber: structural integrity, reference correctness, metadata regeneration, and regression-neutral validation."
trigger_phrases:
  - "system-code-graph renumber checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/146-codegraph-active-renumber"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Verification checklist authored"
    next_safe_action: "Fast-forward push to origin/skilled/v4.0.0.0"
    blockers: []
    completion_pct: 90
    status: "Complete"
---
# Verification Checklist: system-code-graph Active-Packet Renumber

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item is checked against real command output or file evidence. Structural claims cite the count or path verified against.


<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] Active packets confirmed `001-011`; archive `z_archive/001-024` confirmed; track clean vs origin
- [x] Renumber map + slug decisions operator-approved (`025-035`; `codegraph`→`code-graph` on 026/027/028/033; `034-code-graph-scatter-from-027`)
- [x] Pre-renumber baseline captured (11-packet SUM = 29; root own = 4, full-depth)
- [x] Isolated worktree created off origin tip `413f463c22b`


<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] Single-phase git-mv (targets `025-035` empty, collision-free) — evidence: contiguity assert, 0 temp folders
- [x] Qualified-before-bare, full-path map, single-scan order-safe rewrites — evidence: 0 residual old current-track paths in `025-035`
- [x] `/`-excluded and word-char left boundary on bare rewrites preserves child slugs and unrelated tokens — evidence: phase-child slugs untouched; 538 legitimate `codegraph` hits are child slugs/tokens, not parent paths
- [x] No edits outside the renumber path set — evidence: change set scoped to `system-code-graph/` + this record packet (0 outside)


<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] system-code-graph active packets are exactly `025-035` after `z_archive/001-024` — evidence: move verify
- [x] Zero residual old current-track paths in load-bearing .md/.json — evidence: residual grep = 0 in `025-035`
- [x] Phase parents' children_ids resolve on disk — evidence: 032 children repointed to `system-code-graph/032-...`; backfill drift clean
- [x] No renumber-created broken self-identity — evidence: 0 surviving refs to old `system-code-graph/00N-...` paths in the renamed dirs; remaining errors are pre-existing debt
- [x] source_fingerprint refreshed — evidence: 118/120 folders regen'd (2 non-spec stubs skipped); no new GENERATED_METADATA_INTEGRITY errors (030/032 improved)
- [x] Strict-validate regression-neutral-or-better vs baseline — evidence: full-depth per-packet recursive SUM 29 → 22 (delta −7); every packet ≤ 0; root 4 → 2


<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Every packet in the map was renumbered (11/11) — no partial renumber
- [x] Reference repair reached zero residual old current-track paths, including bare parent-slug self-references
- [x] Root-level surface authored (spec.md + graph-metadata children_ids + description + context-index) — 4 pre-existing errors reduced to 2 inherent
- [x] Excluded/deferred items (z_archive untouched, child slugs, reindex) recorded, not silently dropped


<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] No destructive op outside renumber paths — evidence: explicit path lists only
- [x] No global-DB write from worktree — evidence: speckit-eval.db mtime unchanged (2026-07-02 08:59:29) across regen
- [x] Concurrent-session files untouched — evidence: isolated worktree; concurrent work is in unrelated tracks (sk-doc/create-benchmark/deep-alignment)


<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] Packet documents the renumber map, decisions, and honest scope boundaries
- [x] Excluded set recorded with rationale (z_archive, child slugs, reindex)
- [x] Pre-existing doc-debt named as out-of-scope (residual 22 packet + 2 inherent root errors)


<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Track-root graph-metadata children_ids updated to `025-035` + z_archive (12 entries)
- [x] Track root gained canonical spec.md + context-index.md (renumber bridge)
- [x] Rename history preserved (`R` status), no old+new duplicate folders


<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Status | Evidence |
|----------|--------|----------|
| Structural integrity | PASS | 11 contiguous `025-035` + z_archive, 0 temp, archive intact |
| Reference correctness | PASS | 0 renumber-created broken self-refs; residual grep = 0 |
| Metadata regeneration | PASS | 118/120 folders regen'd; DB unpolluted; 030/032 integrity improved |
| Regression delta | BETTER | full-depth per-packet SUM 29 → 22 (−7); root 4 → 2; net −9; 0 folders gained |
| Landing | PENDING | commit + rebase + FF push (operator-approval gated) |
| Reindex | DEFERRED | operator directive |


<!-- /ANCHOR:summary -->
---
