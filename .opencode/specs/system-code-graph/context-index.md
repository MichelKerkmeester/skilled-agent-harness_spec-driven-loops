# system-code-graph — Context Index (Renumber Record)

This file is the migration bridge for the `system-code-graph` active-packet renumber. It records
why the active root-level packets were renumbered and the exact old→new mapping, so anyone following
an old path or old number can find the current location.

## Why

`z_archive/` owns the archived history numbered `001-024`. The active (root-level) packets ALSO
started at `001` (`001-011`), so the track had two sequences both beginning at `001`. The active
packets were renumbered `025-035` to continue directly after the archive, giving one continuous
`001-035` sequence. The archive was not touched.

Two slug corrections rode along with the renumber:
- `codegraph` → `code-graph` normalized on the four packets whose slug used the unhyphenated form
  (now `026`, `027`, `028`, `033`).
- `010-code-graph-scatter-027` → `034-code-graph-scatter-from-027`: the `-027` is a meaningful
  source-tree label (the 027 refinement tree), paralleling `032-code-graph-scatter` (the 026
  optimization tree). Renamed to `-from-027` so it reads as a source label, not a packet number.

## Old → New Map

| Old (active) | New | Note |
|--------------|-----|------|
| `001-code-graph-core` | `025-code-graph-core` | number only |
| `002-codegraph-seeded-ppr` | `026-code-graph-seeded-ppr` | slug normalized |
| `003-codegraph-edge-lifecycle` | `027-code-graph-edge-lifecycle` | slug normalized |
| `004-codegraph-defaults-bitemporal` | `028-code-graph-defaults-bitemporal` | slug normalized |
| `005-code-graph-doc-audit` | `029-code-graph-doc-audit` | number only |
| `006-fix-code-graph-docs` | `030-fix-code-graph-docs` | number only |
| `007-code-graph-buildout` | `031-code-graph-buildout` | number only |
| `008-code-graph-scatter` | `032-code-graph-scatter` | number only (026-tree scatter) |
| `009-advisor-codegraph-shared-features` | `033-advisor-code-graph-shared-features` | slug normalized |
| `010-code-graph-scatter-027` | `034-code-graph-scatter-from-027` | slug clarified (027-tree scatter) |
| `011-rust-backend-rewrite-research` | `035-rust-backend-rewrite-research` | number only |

Phase children inside each packet keep their own local numbering and slugs (including any
`codegraph` in a child slug, which was out of scope for this renumber).

## Scope + Repair Notes

- All 2,033 tracked files moved with `git mv` (rename history preserved, no delete+add).
- Internal references among the renumbered packets (qualified `system-code-graph/<old>` paths and
  bare parent slugs, including nested `children_ids` and phase links) were rewritten to the new
  numbers/slugs.
- Cross-track references from OTHER tracks or skills to the old paths are intentionally left stale
  pending a future memory/graph reindex.
- The archived `z_archive/001-024` packets were not renumbered or moved.

## Record Packet

The work is documented in `skilled-agent-orchestration/146-codegraph-active-renumber`.
