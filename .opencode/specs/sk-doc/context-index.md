# sk-doc track — context index

Migration bridge for the sk-doc spec-consolidation (2026-07-15). The `sk-doc` track was
consolidated into a single contiguous chronological sequence `001-019` (plus the deliberately
separate `999-create-diff-mode` preview marker). 15 documentation-authoring packets were folded
in from `skilled-agent-orchestration/`, and the 4 pre-existing sk-doc packets were
interleave-renumbered by creation date.

Full migration record: `skilled-agent-orchestration/143-sk-doc-spec-consolidation`.

## Current numbering (new → source, chronological by creation date)

| New | Slug | Source (pre-migration) | Created |
|-----|------|------------------------|---------|
| 001 | cmd-create-emoji-enforcement | SAO/012-cmd-create-emoji-enforcement | 2026-02-17 |
| 002 | cmd-create-codex-compatibility | SAO/013-cmd-create-codex-compatibility | 2026-02-17 |
| 003 | cmd-create-changelog | SAO/015-cmd-create-changelog | 2026-03-01 |
| 004 | cmd-create-skill-merger | SAO/019-cmd-create-skill-merger | 2026-03-03 |
| 005 | cmd-create-readme-install-merger | SAO/020-cmd-create-readme-install-merger | 2026-03-03 |
| 006 | cmd-create-feature-catalog | SAO/023-cmd-create-feature-catalog | 2026-03-19 |
| 007 | cmd-create-manual-testing-playbook | SAO/024-cmd-create-manual-testing-playbook | 2026-03-19 |
| 008 | skill-command-readme-rewrite | SAO/027-skill-command-readme-rewrite | 2026-03-26 |
| 009 | cmd-create-changelog-and-releases | SAO/029-cmd-create-changelog-and-releases | 2026-03-29 |
| 010 | command-description-trim | SAO/075-command-description-trim | 2026-05-06 |
| 011 | skill-anchor-toc-removal | SAO/095-skill-anchor-toc-removal | 2026-05-26 |
| 012 | feature-catalog-template-improvements | SAO/100-feature-catalog-template-improvements | 2026-05-31 |
| 013 | catalog-playbook-snippet-denumbering | SAO/108-catalog-playbook-snippet-denumbering | 2026-06-06 |
| 014 | skill-readme-standardization | SAO/109-skill-readme-standardization | 2026-06-07 |
| 015 | sk-doc-parent | sk-doc/014-sk-doc-parent | 2026-07-06 |
| 016 | hub-doc-conformance-fixes | SAO/130-hub-doc-conformance-fixes | 2026-07-11 |
| 017 | benchmark-authoring-centralization | sk-doc/016-benchmark-authoring-centralization | 2026-07-12 |
| 018 | sk-doc-router-alignment | sk-doc/015-sk-doc-router-alignment | 2026-07-13 |
| 019 | hyphen-naming-convention | sk-doc/017-hyphen-naming-convention | 2026-07-13 |
| 999 | create-diff-mode | sk-doc/999-create-diff-mode (unchanged) | 2026-07-14 |

Slugs preserved from source to minimize reference-repair surface. Cross-tree references and frozen
session logs (`*.out`/`*.codexlog`) to old paths are intentionally left stale per the scoped-repair
rule; a future memory/vector reindex resolves them.
