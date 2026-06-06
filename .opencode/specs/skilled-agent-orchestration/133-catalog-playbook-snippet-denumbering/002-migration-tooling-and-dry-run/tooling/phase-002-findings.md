# Phase 002 — Tool Validation Findings

## Tool status: VALIDATED
- `denumber-snippets.cjs` (DeepSeek-authored, 323 lines) + one orchestrator fix (root-doc lookup bug: it searched `<parent>/<tree>.md` instead of `<tree>/<tree>.md`).
- **23/23 test-harness assertions pass** (dry-run safety, rename correctness, all 4 ref classes, Feature-ID preservation, `#anchor`/`./` handling, substring slugs, idempotency, collision-abort exit 2).
- **Real-tree dry-run** on `system-code-graph`: feature_catalog 14 renames / 0 collisions / 15 ref-files (root + snippets); manual_testing_playbook 22 renames / 0 collisions / 1 ref-file (root). Nothing written to disk (git clean).

## Scope boundary discovered: cross-tree references
Catalog snippets can link to their playbook counterpart (and vice versa), e.g.
`[../../manual_testing_playbook/01--cat/001-foo.md](...)`. The per-tree tool's rename
map only covers the tree being migrated, so a cross-tree (or cross-skill, or spec-folder)
numbered link is NOT rewritten during that tree's migration. This is BY DESIGN:

- **Phases 003-005** (per-tree `--apply`): rename files + rewrite in-tree refs + the tree
  root doc. Each run emits `rename-manifest.json`; the orchestrator ACCUMULATES these into a
  global old→new map.
- **Phase 006** (global sweep): using the accumulated global rename map, do ONE repo-wide
  reference rewrite over all referrers (active skills + `.opencode/specs/**` per D2),
  catching cross-tree, cross-skill, changelog, reference, and spec-folder links.

Within the dedicated worktree, cross-tree links are briefly stale between the per-tree
migration and the phase-006 sweep; the worktree merges to main only after 006 makes
everything consistent. A small phase-006 sweep tool (reference-rewrite only, no renames,
driven by the global map) will be authored when 006 is reached.

## deep-ai-council note
`deep-ai-council/feature_catalog/FEATURE_CATALOG.md` is UPPERCASE (frozen anomaly). The
tool's `findRootDoc` looks for lowercase `feature_catalog.md` and will not find it, so that
skill's root-doc links must be passed via `--referrers` in phase 004 (or handled by the
phase-006 sweep). The uppercase filename itself stays out of scope (D4).
