---
title: "Implementation Plan: Phase 10 — Cocoindex Code-Only Patterns"
description: "Two-line YAML edit + four-line Python edit + DB delete + daemon restart + verify."
trigger_phrases:
  - "010 plan code-only patterns"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/010-cocoindex-code-only-patterns"
    last_updated_at: "2026-05-13T06:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan filled; rebuild in flight"
    next_safe_action: "Wait for rebuild to complete"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140100c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-010-code-only-2026-05-13"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10 — Cocoindex Code-Only Patterns

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML (project settings) + Python (source defaults); cocoindex Rust core consumes both |
| **Framework** | cocoindex_code project + user settings; pathspec.GitIgnoreSpec semantics for include/exclude |
| **Storage** | sqlite-vec target_sqlite.db deleted + recreated under new patterns |
| **Testing** | Direct sqlite-vec language COUNT queries against the rebuilt index |

### Overview
Two-touch edit (`.cocoindex_code/settings.yml` + `cocoindex_code/settings.py`) + delete + restart + reindex + verify. The daemon reads settings.yml at project-load time; killing it forces a fresh load.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 009 daemon patches landed
- [x] Live home daemon working

### Definition of Done
- [x] settings.yml edited
- [x] DEFAULT_INCLUDED_PATTERNS edited
- [x] target_sqlite.db deleted + daemon restarted
- [ ] Rebuild completes
- [ ] Zero rows for markdown / mdx / text / rst
- [ ] Strict validate exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Settings edit + force-rebuild. No new abstraction.

### Key Components
- `.cocoindex_code/settings.yml` — project-level patterns (overrides defaults)
- `cocoindex_code/settings.py:DEFAULT_INCLUDED_PATTERNS` — source defaults (used by new projects)
- `target_sqlite.db` — vec store; recreated on first `ccc index` after delete

### Data Flow
Settings → daemon project-load → file walker filters by include/exclude → chunker → embedder → sqlite-vec.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.cocoindex_code/settings.yml` `include_patterns` | Project-level extension allowlist | Modify — remove 4 doc-format entries | grep returns 0 doc-format matches |
| `cocoindex_code/settings.py:DEFAULT_INCLUDED_PATTERNS` | Source-of-truth fallback for new projects | Modify — remove same 4 entries + comment | grep returns 0 doc-format `**/*.{md,mdx,txt,rst}` strings |
| `.cocoindex_code/target_sqlite.db` | Live vec store | Delete + recreate | `SELECT COUNT(*) FROM code_chunks_vec WHERE language IN ('markdown','mdx','text','rst')` returns 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm daemon is patched (post-009)
- [x] Confirm settings.yml has 4 doc-format entries to remove

### Phase 2: Core Implementation
- [x] Remove 4 lines from `.cocoindex_code/settings.yml`
- [x] Remove 4 lines from `cocoindex_code/settings.py` `DEFAULT_INCLUDED_PATTERNS`
- [x] Add explanatory comment in source referencing 014/010
- [x] Kill daemon (any stale instance) + delete target_sqlite.db
- [x] Trigger `ccc index` to spawn fresh daemon under clean settings

### Phase 3: Verification
- [ ] Wait for rebuild to complete (~30-60 min on this codebase)
- [ ] Verify language COUNT: zero markdown/mdx/text/rst
- [ ] Verify code languages still indexed (python, typescript, javascript, bash, etc)
- [ ] Capture pre-vs-post chunk count for implementation-summary
- [ ] Strict validate exits 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Direct sqlite-vec COUNT GROUP BY language | Python script |
| Regression | A known-token code search returns relevant results | `cocoindex_code.search` via MCP |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 009 daemon patches | Internal | Green | Without them, daemon search would be broken |
| pathspec.GitIgnoreSpec semantics | External | Green | Used by cocoindex internally; pattern syntax is glob |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer hard-depends on cocoindex returning markdown hits
- **Procedure**: Add the 4 entries back to `.cocoindex_code/settings.yml` (project-level beats source default). Restart daemon. Old behavior restored. Source-default change persists for other projects.
<!-- /ANCHOR:rollback -->
