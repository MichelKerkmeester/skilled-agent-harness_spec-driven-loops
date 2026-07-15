# system-speckit track — context index

Migration bridge for the system-speckit spec-consolidation (2026-07-15). The `system-speckit`
track was consolidated into a single contiguous chronological sequence `001-016` (plus the
pre-existing `z_archive/`). 10 spec-kit-subsystem packets were folded in from
`skilled-agent-orchestration/`, and the 6 pre-existing system-speckit packets were
interleave-renumbered by creation date.

Full migration record: `skilled-agent-orchestration/145-speckit-spec-consolidation`.

## Current numbering (new → source, chronological by creation date)

| New | Slug | Source (pre-migration) | Created |
|-----|------|------------------------|---------|
| 001 | cmd-memory-output | SAO/014-cmd-memory-output | 2026-05-16 |
| 002 | graph-and-context-optimization | system-speckit/026-graph-and-context-optimization | 2026-06-30 |
| 003 | xce-research-based-refinement | system-speckit/027-xce-research-based-refinement | 2026-06-30 |
| 004 | memory-search-intelligence | system-speckit/028-memory-search-intelligence | 2026-06-30 |
| 005 | rust-backend-rewrite-research | system-speckit/030-rust-backend-rewrite-research | 2026-07-11 |
| 006 | spec-gate-enforce-readiness | SAO/133-spec-gate-enforce-readiness | 2026-07-11 |
| 007 | phased-spec-preference | system-speckit/029-phased-spec-preference | 2026-07-11 |
| 008 | vitest-invariance-maintenance | system-speckit/031-vitest-invariance-maintenance | 2026-07-11 |
| 009 | cmd-merge-spec-kit-phase | SAO/028-cmd-merge-spec-kit-phase | 2026-07-14 |
| 010 | cmd-spec-kit-ux-upgrade | SAO/045-cmd-spec-kit-ux-upgrade | 2026-07-14 |
| 011 | spec-kit-ux-adoptions | SAO/046-spec-kit-ux-adoptions | 2026-07-14 |
| 012 | spec-kit-coco-sk-code-research | SAO/065-spec-kit-coco-sk-code-research | 2026-07-14 |
| 013 | spec-kit-auto-mode-noninteractive-contract | SAO/083-spec-kit-auto-mode-noninteractive-contract | 2026-07-14 |
| 014 | subphase-recatalog-and-archive | SAO/088-subphase-recatalog-and-archive | 2026-07-14 |
| 015 | base-files-renumbering-name-cleanup | SAO/090-base-files-renumbering-name-cleanup | 2026-07-14 |
| 016 | cmd-speckit-family-rename | SAO/094-cmd-speckit-family-rename | 2026-07-14 |

The `030-cmd-spec-kit-codex-skill-routing` packet was evaluated and deliberately **left in
`skilled-agent-orchestration/`** (operator decision — it does not clearly belong to this track and
is pending separate triage). No packet was routed to `system-code-graph`: no
skilled-agent-orchestration packet is code-graph-engine work.

Slugs preserved from source to minimize reference-repair surface. Within-track references were
repaired to the new numbering; cross-tree references and frozen session logs to old paths are
intentionally left stale per the scoped-repair rule, pending a future memory/vector reindex.
Pre-existing self-identity references to ancient paths (`z_archive/`, `03--commands-and-skills/`)
carried in by the moved packets are pre-existing debt, not migration-created.
