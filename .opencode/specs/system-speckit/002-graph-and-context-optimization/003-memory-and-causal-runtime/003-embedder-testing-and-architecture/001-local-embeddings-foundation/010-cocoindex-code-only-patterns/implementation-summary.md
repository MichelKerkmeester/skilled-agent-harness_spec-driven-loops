---
title: "Implementation Summary: 014/010 cocoindex-code-only-patterns"
description: "Removed .md/.mdx/.txt/.rst from cocoindex's include patterns (project + source defaults). Triggered clean rebuild. Cocoindex is now a pure code-search index; documentation retrieval routes to spec-kit-memory."
trigger_phrases:
  - "014/010 code-only done"
  - "cocoindex markdown removed"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/010-cocoindex-code-only-patterns"
    last_updated_at: "2026-05-13T06:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Patterns removed; rebuild in flight"
    next_safe_action: "Verify rebuild completes with zero doc rows"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140100c2a9e0000000000000000000000000000000000000000000000000004"
      session_id: "014-010-code-only-2026-05-13"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-cocoindex-code-only-patterns |
| **Completed** | 2026-05-13 (settings shipped); rebuild in flight |
| **Level** | 1 |
| **Status** | In Progress (50%) — settings.yml + source defaults updated, daemon restarted, clean rebuild started; verification pending rebuild completion |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Cocoindex is now a pure code-search index. Removed `.md`, `.mdx`, `.txt`, `.rst` from both the project-level `.cocoindex_code/settings.yml` and the source-default `DEFAULT_INCLUDED_PATTERNS` in `cocoindex_code/settings.py`. The pre-change index had 142,237 chunks (45% markdown, dominated by the 4-runtime skill mirror duplicating the same SKILL.md content under `.opencode/`, `.gemini/`, `.claude/`, `.codex/`). After this packet, cocoindex retains only code/script extensions; documentation retrieval routes through spec-kit-memory which has its own purpose-built vec store.

### What's now indexed by cocoindex

Code languages only: `.py`, `.pyi`, `.js`, `.jsx`, `.ts`, `.tsx`, `.mjs`, `.cjs`, `.rs`, `.go`, `.java`, `.c`, `.h`, `.cpp`, `.hpp`, `.cc`, `.cxx`, `.hxx`, `.hh`, `.cs`, `.sql`, `.sh`, `.bash`, `.zsh`, `.php`, `.lua`. Plus whatever extra extensions a user opts into via `COCOINDEX_CODE_EXTRA_EXTENSIONS`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.cocoindex_code/settings.yml` | Modified | Removed 4 doc-format glob lines from `include_patterns` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modified | Removed same 4 entries from `DEFAULT_INCLUDED_PATTERNS` + added 8-line comment block referencing 014/010 |
| `.cocoindex_code/target_sqlite.db` | Deleted + recreated | Force clean rebuild; daemon recreates schema on first index call |
| `010/*.md` + `description.json` + `graph-metadata.json` | Created | Packet docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Native main-agent execution. Three steps: edit two files, kill the daemon, trigger `ccc index` to spawn fresh + start the rebuild. The daemon reads `.cocoindex_code/settings.yml` at project-load time, so killing it was necessary for the new patterns to take effect.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Edit BOTH project settings.yml AND source DEFAULT_INCLUDED_PATTERNS | Project-level beats defaults at runtime, but new projects + reset scenarios pick up defaults. Two-touch keeps both surfaces aligned. |
| Don't add `**/.{gemini,claude,codex}/skills/**` to exclude_patterns | Orthogonal cleanup. With markdown removed entirely, the 4-runtime skill-mirror duplication problem evaporates for cocoindex (skills are mostly markdown). Code in skill scripts (`.opencode/skills/*/scripts/*.py` etc) IS still indexed and that's intended. |
| Don't remove `.html`, `.css`, `.json` | They appeared in the pre-change index at low counts (34/11/6) but aren't in include_patterns. Source unclear; investigation deferred. |
| Cocoindex is for CODE; spec-kit-memory is for DOCS | Two tools, two clean responsibilities. Both already index docs/code respectively in their own optimal way. The blurring was an unforced quality issue. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Command | Result |
|-------|---------|--------|
| `.cocoindex_code/settings.yml` has 0 doc patterns | `grep -E "\\.(md|mdx|txt|rst)" .cocoindex_code/settings.yml` | PASS — empty |
| Source defaults have 0 doc patterns | `grep -E "\\*\\.(md|mdx|txt|rst)" cocoindex_code/settings.py` | PASS — empty |
| Daemon restarted | `pkill -9 ccc` then verify new pid via `ps` | PASS — new pid 2045 (was 82759) |
| Clean rebuild started | `ls .cocoindex_code/target_sqlite.db` | PASS — new file at fresh start time |
| Zero rows for doc formats | `SELECT COUNT(*) FROM code_chunks_vec WHERE language IN ('markdown','mdx','text','rst')` | PASS — 0 rows (verified at the 1335-chunk partial-rebuild point) |
| Code languages preserved | `SELECT DISTINCT language FROM code_chunks_vec` | PASS — typescript, bash, javascript, python so far; Go / Rust / others still being swept |
| Index size reduction | pre vs post chunk count | TRENDING — pre-change was 142,237 chunks (45% markdown). Partial rebuild at 1335 chunks of pure code; final size depends on full code language sweep but already much smaller |
| LMDB store size | `du -sh .cocoindex_code/cocoindex.db/` | PRE: 4.0GB carryover from prior runs (caused MDB_MAP_FULL on first restart); POST: deleted + recreated empty for clean slate |
| Strict validate | `bash validate.sh <this-packet> --strict` | PASS — exit 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Rebuild takes 30-60 min wall time.** It's not ship-blocking — daemon runs in background, main agent continues other work. Verification rows can be filled in once the rebuild settles.
2. **Source default change affects other projects' new installs.** Each project's `.cocoindex_code/settings.yml` overrides defaults at startup, so existing projects are unaffected. Only NEW project init will pick up the code-only defaults.
3. **The change doesn't dedup the 4-runtime skill mirror itself.** It just stops indexing the markdown content of the mirror. If the user later adds back markdown indexing via a project-level override, the duplication problem returns. Long-term fix would be to add `**/.{gemini,claude,codex}/skills/**` to default exclude_patterns (separate packet).
3a. **First restart after the pattern change failed with `MDB_MAP_FULL`.** The cocoindex internal LMDB store at `.cocoindex_code/cocoindex.db/mdb/data.mdb` had grown to 4.0GB across prior indexing runs (multiple Voyage→EmbeddingGemma cycles + the 142k-row index). LMDB's mapsize is set at open-time and the existing store hit the limit on the new write. Workaround applied: `rm -rf .cocoindex_code/cocoindex.db` before the second restart. Permanent fix would be to bump the LMDB mapsize default in cocoindex's Rust core (orthogonal to this packet).
4. **html/css/json source unclear.** Pre-change index had small counts (34/11/6) for these. Not in include_patterns. Possible sources: a default extra-extension fallback, or the daemon's chunker has its own inclusion list. Out of 010 scope.
5. **Cocoindex still uses EmbeddingGemma-300m (768-dim).** No model change in 010. q4-equivalent for the cocoindex side is a separate consideration if RAM becomes a problem.
<!-- /ANCHOR:limitations -->
