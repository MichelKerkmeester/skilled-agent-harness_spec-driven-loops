---
title: "Feature Specification: Phase 10 — Cocoindex Code-Only Patterns"
description: "Remove .md, .mdx, .txt, .rst from cocoindex's include patterns (both project-level settings.yml and the source DEFAULT_INCLUDED_PATTERNS in cocoindex_code/settings.py). Cocoindex is for CODE search; documentation is indexed by spec-kit-memory. Pre-change index had 142,237 chunks of which 63,504 (45%) were markdown — most of that was the same SKILL.md indexed 4 times across the .opencode/.gemini/.claude/.codex skill mirrors."
trigger_phrases:
  - "010 cocoindex code-only"
  - "remove markdown from cocoindex"
  - "DEFAULT_INCLUDED_PATTERNS cleanup"
  - "cocoindex skill mirror dedup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/014-local-embeddings-setup-a/010-cocoindex-code-only-patterns"
    last_updated_at: "2026-05-13T06:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Doc-format extensions removed; rebuild in flight"
    next_safe_action: "Wait for clean reindex; verify zero doc-format chunks"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140100c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-010-code-only-2026-05-13"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Should html/css/json also be excluded? → Out of scope for 010; they appeared at low counts (34/11/6) in the prior index from an unknown source (not in include_patterns). 010 is a focused doc-format removal."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10 — Cocoindex Code-Only Patterns

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress (settings shipped; clean rebuild in flight) |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 004-vec-store-rebuild + 009-cocoindex-ipc-fix |
| **Successor** | (none — terminal in 014) |
| **Handoff Criteria** | New target_sqlite.db has zero rows where language ∈ {markdown, text, mdx, rst}; total chunk count substantially smaller than the 142,237 pre-change baseline |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 10** of `014-local-embeddings-setup-a`. Late-discovery follow-on: the post-009 rebuild ran end-to-end, but inspection showed cocoindex's index dominated by skill-doc markdown — 63,504 of 142,237 chunks (45%) were markdown, and most of that came from the same SKILL.md content being indexed 4 times across the runtime mirror dirs (`.opencode/skills/`, `.gemini/skills/`, `.claude/skills/`, `.codex/skills/`).

**Scope Boundary**: pattern files only. No new code. No new MCP tools. No model swaps.

**Dependencies**: 009 cocoindex IPC patch shipped; live home daemon working under Setup A.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Cocoindex's `DEFAULT_INCLUDED_PATTERNS` (and the project-level `.cocoindex_code/settings.yml` mirroring it) include `.md`, `.mdx`, `.txt`, `.rst`. The result on this codebase: 45% of the index is non-code content. Worse, the 4-runtime skill mirror (Public has filesystem-level copies of every skill under `.opencode/skills/`, `.gemini/skills/`, `.claude/skills/`, `.codex/skills/`) means every SKILL.md / reference / playbook gets indexed 4 times. Cocoindex code search returns near-duplicate documentation hits where actual code matches should win.

Documentation is already covered by a different system: spec-kit-memory indexes `.opencode/specs/**` and constitutional files under EmbeddingGemma-300m-ONNX (768-dim). Two embedding stores covering the same content with different chunk granularity, two different prompt prefixes, and a 4× duplication factor on the cocoindex side is a quality and DX problem.

### Purpose
Make cocoindex strictly a code-search index. Remove document-format extensions from both the source defaults and the project settings. Trust spec-kit-memory for documentation retrieval.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `**/*.md`, `**/*.mdx`, `**/*.txt`, `**/*.rst` from `.cocoindex_code/settings.yml` `include_patterns`
- Remove the same four entries from `cocoindex_code/settings.py` `DEFAULT_INCLUDED_PATTERNS` (with a comment referencing this packet)
- Delete `.cocoindex_code/target_sqlite.db` to force a clean rebuild
- Restart cocoindex daemon
- Trigger `ccc index` to rebuild
- Verify zero rows for markdown / mdx / text / rst languages

### Out of Scope
- Removing `.html`, `.css`, `.json` from indexing (not in include_patterns; appeared in prior index from an unknown path — investigation deferred)
- Adding `**/.{gemini,claude,codex}/skills/**` to exclude_patterns (orthogonal cleanup)
- Adding `.gemini/changelog/`, `.claude/changelog/`, `.codex/changelog/` to exclude_patterns (orthogonal cleanup; with markdown excluded these no longer matter for cocoindex anyway since changelogs are .md)
- Backporting the change to other projects' `.cocoindex_code/settings.yml` (each project owns its own patterns; the source default change covers new projects)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.cocoindex_code/settings.yml` | Modify | Remove 4 lines from `include_patterns` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` | Modify | Remove 4 lines from `DEFAULT_INCLUDED_PATTERNS` + add explanatory comment |
| `.cocoindex_code/target_sqlite.db` | Delete | Force clean rebuild under new patterns |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Settings.yml has no doc patterns | `grep -E "\.(md|mdx|txt|rst)" .cocoindex_code/settings.yml` returns empty |
| REQ-002 | Source defaults have no doc patterns | `grep -E "\\*\\.(md|mdx|txt|rst)" .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py` returns empty |
| REQ-003 | Clean rebuild has zero doc-format rows | `SELECT COUNT(*) FROM code_chunks_vec WHERE language IN ('markdown','mdx','text','rst')` returns 0 |
| REQ-004 | Code-language coverage preserved | Languages present include at least python, typescript, javascript, bash (subset of pre-change set) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Index size reduction recorded | implementation-summary captures pre-change vs post-change row counts |
| REQ-006 | Strict validate exits 0 | `bash validate.sh <this-packet> --strict` returns 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Cocoindex search results no longer return SKILL.md or other doc chunks
- **SC-002**: Doc-search consumers route to spec-kit-memory; code-search consumers route to cocoindex (clean separation)
- **SC-003**: Index volume drops substantially (expected ~50% smaller, since markdown was 45% of pre-change)
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A consumer relies on cocoindex returning markdown hits (e.g. SKILL.md lookup) | Low | spec-kit-memory covers spec docs; constitutional/skill markdown is queryable via memory_search. Other markdown (READMEs, AGENTS.md mirrors) is plain-text searchable via grep. |
| Risk | Index rebuild takes another 30-60 min wall time | Low | Rebuild runs in background; main agent continues other work |
| Risk | The source-default change affects other projects on this machine | Med | Each project's `.cocoindex_code/settings.yml` overrides defaults at startup. Only new projects pick up the new defaults. |
| Dependency | 009 daemon patches | Green — already shipped |
| Dependency | Daemon restartable | Green — `pkill -9 ccc` + `ccc index` re-spawns |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none — the html/css/json question is intentionally deferred; see scope §Out of Scope)
<!-- /ANCHOR:questions -->
