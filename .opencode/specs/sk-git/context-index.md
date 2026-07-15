# Context Index: sk-git Track Consolidation

> Migration bridge for the consolidation of sk-git-relevant spec folders out of
> `skilled-agent-orchestration` into the `sk-git` track, plus the packets and pre-existing
> debt intentionally left as-found. The track spec surface stays lean; this file carries the
> consolidation narration.

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

<!-- ANCHOR:migration-bridge -->
## Migration Bridge

Every folder below is now a resident of the `sk-git` track. History was preserved via `git mv`
(rename detection, not delete+add). "Reconciled" means generated metadata was regenerated to
match the on-disk location and internal identity references were repointed.

| Original Home | New Home | Landed | Notes |
|---------------|----------|--------|-------|
| `skilled-agent-orchestration/128-gitkraken-mcp-integration` | `sk-git/007-gitkraken-mcp-integration` | `0413d8d1ea` + `8514e026f1` | Phase-parent + 5 phase children; renumbered 128 → 007 |
| `skilled-agent-orchestration/091-commit-standards-and-retroactive-rewrite` | `sk-git/z_archive/091-commit-standards-and-retroactive-rewrite` | `d702aad87d` | Parent + 5 phase children; reconciled |
| `skilled-agent-orchestration/109-skill-readme-standardization/018-sk-git-readme` | `sk-git/z_archive/018-sk-git-readme` | `d702aad87d` | Was a phase child of 109; now standalone (`parent_id` nulled). 109 parent's phase-map + child metadata updated to drop it |

Earlier waves (not this session's `git mv`, recorded here for a complete track picture):

| Original Home | New Home | Landed | Notes |
|---------------|----------|--------|-------|
| `skilled-agent-orchestration/z_archive/{002,006,096,103}-*` | `sk-git/z_archive/{002,006,096,103}-*` | `a2817e2c33` (track reorg) | Pre-existing residents; see Decisions for 002/006/096/103 handling |
<!-- /ANCHOR:migration-bridge -->

---

<!-- ANCHOR:decisions -->
## Decisions

- **`z_archive/002-sk-git-github-mcp-integration` + `z_archive/006-sk-git-superset-worktrees` — left as-found.**
  Both carry pre-existing validation errors that trace to commit `a2817e2c33`
  ("reorganize spec tracks into skill category folders") — an earlier track reorg, not this
  consolidation. 002 has template-manifest conformance errors; **006 is missing its Level-3
  `implementation-summary.md`**. Remediating them would mean editing or fabricating archived
  historical content, so they were not touched (SCOPE LOCK). These are the only sk-git packets
  that do not validate `--strict` Errors 0.

- **`skilled-agent-orchestration/076-testing-playbooks-code-review-and-git` — left in place.**
  Classified MIXED (part sk-code-review, part sk-git) during WS2 triage; not split, not moved.

- **`000-continuous-integration-workflow` — renumber leftover repaired.**
  A concurrent session renamed `001` → `000` on disk but left every internal identity reference
  (continuity `packet_pointer`, the `Spec Folder` row, and all generated metadata) pointing at
  `001`. All references were aligned to the on-disk folder and metadata regenerated. Now Errors 0.

- **`z_archive/096` + `z_archive/103` — stale reference cleanup.**
  Repointed stale `Spec Folder` rows and `packet_pointer` values (leftovers from the earlier
  reorg) to the on-disk folder, then regenerated metadata. Now Errors 0.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:track-root-artifact -->
## Track-Root Validation Artifact

The bare `sk-git` track-root folder reports four structural errors under
`validate.sh --strict` (`FILE_EXISTS`, `FOLDER_NAMING`, and two `CANONICAL_SAVE_*`). This is an
inherent artifact of applying the packet-oriented validator to a track-root directory — the
sibling track roots (`skilled-agent-orchestration`, `system-deep-loop`, `sk-code`) report the
same four. A literal `--recursive Errors 0` is therefore not achievable for any track that
carries graph-visibility JSONs. The `sk-git/{description.json,graph-metadata.json}` were generated
(`description.json` carries `level: track`; `graph-metadata.json` uses the standard field-less
track schema) so the track is discoverable by graph traversal, matching the sibling tracks.
Track health is measured at the **packet** level, where every sk-git packet
except the two archived exceptions above validates Errors 0.
<!-- /ANCHOR:track-root-artifact -->

---

<!-- ANCHOR:memory-reindex -->
## Open Handoff: Memory Reindex

The memory MCP index was **not** refreshed for the moved paths in this session:
`memory_index_scan {specFolder:"sk-git"}` timed out repeatedly against the shared global daemon
(heavy re-embedding under concurrent load; reads also began returning errors). Per the rule to
run reindex/re-embed on a quiet main, it was handed off rather than retried. The source of truth
is committed and pushed; the index is rebuildable. To finish in a quiet window:

- `memory_index_scan {specFolder:"sk-git"}` — index the consolidated paths.
- Prune orphans: the aggregate `.opencode/specs/descriptions.json` still holds old-path entries
  for the moved folders whose folders are gone from disk — `128-gitkraken`,
  `skilled-agent-orchestration/z_archive/091-*`, and `.../109-*/018-sk-git-readme`. Note the
  aggregate recorded 091 under an older pre-relocation `z_archive/091` path, not the
  `git mv` source (`skilled-agent-orchestration/091`) shown in the Migration Bridge above, so
  grep for both forms. A scan covering `skilled-agent-orchestration` (or a full-tree scan)
  reconciles them.
<!-- /ANCHOR:memory-reindex -->

---

<!-- ANCHOR:verification -->
## Verification Evidence

- `validate.sh --recursive --strict` on each moved/repaired packet — Errors 0:
  `000`, `007`, `z_archive/018`, `z_archive/091`, `z_archive/096`, `z_archive/103`, plus live
  `001`–`006`.
- Known non-zero: `z_archive/002` (2 errors), `z_archive/006` (3 errors) — pre-existing, see Decisions.
- Consolidation commit `d702aad87d` pushed to `origin/skilled/v4.0.0.0` (fast-forward); scoped
  staging only — no concurrent-session files included.
<!-- /ANCHOR:verification -->
