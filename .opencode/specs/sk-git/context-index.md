# Context Index: sk-git Track Consolidation + Renumber

> Migration bridge for the `sk-git` track: the consolidation of sk-git-relevant spec folders out
> of `skilled-agent-orchestration`, followed by a contiguous renumber into one clean sequence —
> the archive holds `001–006`, the live packets continue `007–014`. The track spec surface stays
> lean; this file carries the consolidation + renumber narration.

<!-- SPECKIT_TEMPLATE_SOURCE: context-index | v1.0 -->

---

<!-- ANCHOR:layout -->
## Current Layout

One continuous sequence across the track. Live packets sit at the root; superseded packets sit
under `z_archive/`, which now carries its own `description.json` / `graph-metadata.json`.

| # | Live packet (root) | | # | Archived packet (`z_archive/`) |
|---|--------------------|-|---|--------------------------------|
| 007 | continuous-integration-workflow | | 001 | sk-git-github-mcp-integration |
| 008 | research-and-requirements | | 002 | sk-git-superset-worktrees |
| 009 | skill-scoped-worktree-naming | | 003 | sk-git-readme |
| 010 | review-remediation-and-alignment | | 004 | commit-standards-and-retroactive-rewrite |
| 011 | feature-catalog-and-manual-playbook | | 005 | sk-git-reorg-hardening |
| 012 | readme-enrichment-and-hyphen-naming | | 006 | sk-git-worktree-convention-and-advisor-routing |
| 013 | git-review-remediation | | | |
| 014 | gitkraken-mcp-integration | | | |
<!-- /ANCHOR:layout -->

---

<!-- ANCHOR:renumber -->
## Renumber Mapping

Applied via `git mv` (history preserved), with metadata regenerated and all `sk-git/`-qualified
and self-referential path references repointed. External / historical provenance references
(e.g. `skilled-agent-orchestration/…`, `../137-parallel-session-git-autosync/…`) were left intact.

| Old | New | | Old | New |
|-----|-----|-|-----|-----|
| `z_archive/002-sk-git-github-mcp-integration` | `z_archive/001-…` | | `000-continuous-integration-workflow` | `007-…` |
| `z_archive/006-sk-git-superset-worktrees` | `z_archive/002-…` | | `001-research-and-requirements` | `008-…` |
| `z_archive/018-sk-git-readme` | `z_archive/003-…` | | `002-skill-scoped-worktree-naming` | `009-…` |
| `z_archive/091-commit-standards-and-retroactive-rewrite` | `z_archive/004-…` | | `003-review-remediation-and-alignment` | `010-…` |
| `z_archive/096-sk-git-reorg-hardening` | `z_archive/005-…` | | `004-feature-catalog-and-manual-playbook` | `011-…` |
| `z_archive/103-sk-git-worktree-convention-and-advisor-routing` | `z_archive/006-…` | | `005-readme-enrichment-and-hyphen-naming` | `012-…` |
| | | | `006-git-review-remediation` | `013-…` |
| | | | `007-gitkraken-mcp-integration` | `014-…` |
<!-- /ANCHOR:renumber -->

---

<!-- ANCHOR:provenance -->
## Consolidation Provenance

Where the packets originally came from before landing in `sk-git` (numbers below are the current,
post-renumber positions):

| Current | Original Home | Landed |
|---------|---------------|--------|
| `014-gitkraken-mcp-integration` | `skilled-agent-orchestration/128-gitkraken-mcp-integration` | `0413d8d1ea` + `8514e026f1` |
| `z_archive/004-commit-standards-and-retroactive-rewrite` | `skilled-agent-orchestration/091-commit-standards-and-retroactive-rewrite` | `d702aad87d` |
| `z_archive/003-sk-git-readme` | `skilled-agent-orchestration/109-skill-readme-standardization/018-sk-git-readme` | `d702aad87d` |
| `z_archive/{001,002,005,006}-*` | `skilled-agent-orchestration/z_archive/{002,006,096,103}-*` | `a2817e2c33` (earlier track reorg) |
<!-- /ANCHOR:provenance -->

---

<!-- ANCHOR:decisions -->
## Decisions

- **`z_archive/001-sk-git-github-mcp-integration` + `z_archive/002-sk-git-superset-worktrees` — left as-found.**
  Both carry pre-existing validation errors that trace to commit `a2817e2c33` (an earlier track
  reorg, not this work). 001 has template/anchor conformance errors; **002 is missing its Level-3
  `implementation-summary.md`**. Remediating them would mean editing or fabricating archived
  historical content, so they were not touched (SCOPE LOCK). These are the only sk-git *packets*
  that do not validate `--strict` Errors 0 (001 → 2 errors, 002 → 3 errors).

- **`skilled-agent-orchestration/076-testing-playbooks-code-review-and-git` — left in place.**
  Classified MIXED (part sk-code-review, part sk-git); not split, not moved.

- **`007-continuous-integration-workflow` — earlier renumber leftover repaired.**
  Before this renumber, a concurrent session had renamed the folder `001` → `000` on disk but
  left every internal identity reference at `001`; those were aligned and metadata regenerated
  prior to the track-wide renumber that then moved it to `007`.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:track-root-artifact -->
## Track-Root Validation Artifact

The bare `sk-git` track-root folder and the `z_archive/` node each report four structural errors
under `validate.sh --strict` (`FILE_EXISTS`, `FOLDER_NAMING`, two `CANONICAL_SAVE_*`). This is an
inherent artifact of applying the packet-oriented validator to a track/grouping directory that
carries graph-visibility JSONs but no canonical `spec.md` — the sibling track roots
(`skilled-agent-orchestration`, `system-deep-loop`, `sk-code`) report the same four. A literal
`--recursive Errors 0` is therefore not achievable at those directory levels. The `sk-git/` and
`sk-git/z_archive/` JSONs (each `description.json` carries `level: track`) exist so both are
discoverable by graph traversal. Track health is measured at the **packet** level, where every
sk-git packet except the two archived exceptions above validates Errors 0.
<!-- /ANCHOR:track-root-artifact -->

---

<!-- ANCHOR:memory-reindex -->
## Open Handoff: Memory Reindex

The memory MCP index was not refreshed for the renumbered paths in this session (the shared global
daemon times out under concurrent load). The source of truth is committed; the index is
rebuildable. To finish in a quiet window:

- `memory_index_scan {specFolder:"sk-git"}` — index the renumbered paths.
- Prune orphans: `.opencode/specs/descriptions.json` holds stale entries for every prior path form
  (the pre-consolidation `skilled-agent-orchestration/…` locations and the pre-renumber
  `sk-git/000…007` + `sk-git/z_archive/{002,006,018,091,096,103}` locations). A scan covering both
  `sk-git` and `skilled-agent-orchestration` (or a full-tree scan) reconciles them.
<!-- /ANCHOR:memory-reindex -->

---

<!-- ANCHOR:verification -->
## Verification Evidence

- `validate.sh --recursive --strict`: every live packet `007–014` and archived packet
  `z_archive/003–006` — Errors 0. Renumber introduced no new errors.
- Known pre-existing (see Decisions): `z_archive/001` (2 errors), `z_archive/002` (3 errors).
- Accepted track artifact: `sk-git` root and `z_archive/` node — 4 structural errors each.
- History preserved: all 14 folder moves are `git mv` renames; external/historical provenance
  references left intact.
<!-- /ANCHOR:verification -->
