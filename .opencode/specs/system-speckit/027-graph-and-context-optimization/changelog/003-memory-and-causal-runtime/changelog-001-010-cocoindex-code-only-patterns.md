---
title: "Local Embeddings Foundation Phase 010: Cocoindex Code-Only Patterns"
description: "Removed .md, .mdx, .txt, .rst from cocoindex include patterns in both project settings.yml and the source DEFAULT_INCLUDED_PATTERNS. Cocoindex is now a pure code-search index. Pre-change index had 142,237 chunks of which 45% were markdown. Post-change rebuild confirmed zero doc-format rows."
trigger_phrases:
  - "cocoindex code-only patterns"
  - "remove markdown from cocoindex"
  - "DEFAULT_INCLUDED_PATTERNS doc cleanup"
  - "cocoindex skill mirror dedup 010"
  - "014/010 code-only done"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/010-cocoindex-code-only-patterns` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Cocoindex's include patterns previously listed `.md`, `.mdx`, `.txt` and `.rst` alongside code extensions. On this codebase that meant 45% of the 142,237-chunk index (63,504 chunks) was markdown. The bulk of that markdown came from the 4-runtime skill mirror: the same SKILL.md content indexed four times under `.opencode/`, `.gemini/`, `.claude/` and `.codex/skills/`. Code-search queries returned near-duplicate documentation hits where actual code matches should have won.

Both the project-level `.cocoindex_code/settings.yml` and the source `DEFAULT_INCLUDED_PATTERNS` in `cocoindex_code/settings.py` were updated to remove the four doc-format globs. The daemon was killed, the stale `target_sqlite.db` was deleted and `ccc index` spawned a fresh rebuild. At the 2618-row partial checkpoint the index contained only code languages: typescript, javascript, bash and python. Doc-format queries against `code_chunks_vec` returned zero rows. Documentation retrieval routes to spec-kit-memory, which has its own purpose-built vec store and was already covering that surface.

### Added

- Explanatory 8-line comment block in `cocoindex_code/settings.py` `DEFAULT_INCLUDED_PATTERNS` referencing this packet and the rationale for the code-only boundary

### Changed

- `.cocoindex_code/settings.yml` `include_patterns`: removed `**/*.md`, `**/*.mdx`, `**/*.txt`, `**/*.rst`
- `cocoindex_code/settings.py` `DEFAULT_INCLUDED_PATTERNS`: removed the same four doc-format entries
- Cocoindex daemon restarted under new patterns. Previous pid 82759 replaced by pid 2045 after `pkill -9 ccc` then `ccc index`

### Fixed

- Code-search result quality: documentation chunks no longer appear in cocoindex results. The 4-runtime skill-mirror markdown duplication problem is eliminated for cocoindex without any exclude-pattern changes.
- LMDB map-full on daemon restart: `.cocoindex_code/cocoindex.db` had grown to 4.0GB across prior indexing cycles and hit the mapsize limit on the first pattern-change restart. Fix: deleted the LMDB store before respawning, giving the daemon a clean 4GB budget from a fresh open.

### Verification

| Check | Command | Result |
|-------|---------|--------|
| `settings.yml` has zero doc patterns | `grep -E "\.(md\|mdx\|txt\|rst)" .cocoindex_code/settings.yml` | PASS. Empty output. |
| Source defaults have zero doc patterns | `grep -E "\*\.(md\|mdx\|txt\|rst)" cocoindex_code/settings.py` | PASS. Empty output. |
| Daemon restarted with new patterns | `pkill -9 ccc` then verify new pid via `ps` | PASS. New pid 2045 (was 82759). |
| Clean rebuild started from fresh DB | `ls .cocoindex_code/target_sqlite.db` | PASS. New file at fresh start time. |
| Zero rows for doc formats at partial checkpoint | `SELECT COUNT(*) FROM code_chunks_vec WHERE language IN ('markdown','mdx','text','rst')` | PASS. 0 rows at 1335-chunk checkpoint. |
| Code languages preserved at 2618-chunk checkpoint | `SELECT DISTINCT language FROM code_chunks_vec` | PASS. typescript, javascript, bash, python present. Go and Rust pending full sweep. |
| Strict validate | `bash validate.sh <this-packet> --strict` | PASS. Exit 0. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.cocoindex_code/settings.yml` | Modified | Removed `**/*.md`, `**/*.mdx`, `**/*.txt`, `**/*.rst` from `include_patterns` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modified | Removed same four doc-format entries from `DEFAULT_INCLUDED_PATTERNS`. Added 8-line explanatory comment block. |
| `.cocoindex_code/target_sqlite.db` | Deleted and recreated | Stale index removed to force clean rebuild under new patterns. Daemon recreates schema on first `ccc index` call. |
| `.cocoindex_code/cocoindex.db` | Deleted and recreated | 4.0GB LMDB store deleted to resolve MDB_MAP_FULL on restart. |

### Follow-Ups

- Verify final rebuild row count once the full code sweep completes and record pre-vs-post chunk totals in the implementation-summary verification table.
- Confirm Go and Rust are present in `SELECT DISTINCT language FROM code_chunks_vec` after the full rebuild settles.
- Add `**/.{gemini,claude,codex}/skills/**` to default `exclude_patterns` to eliminate the 4-runtime skill-mirror duplication for any future indexing surface that does include markdown (separate packet).
- Investigate why html, css and json appeared at low counts (34, 11, 6) in the pre-change index despite not being listed in `include_patterns`.
