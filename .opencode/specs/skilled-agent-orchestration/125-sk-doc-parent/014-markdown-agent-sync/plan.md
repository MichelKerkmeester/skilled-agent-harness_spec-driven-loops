---
title: "Implementation Plan: Align markdown agent files with current sk-doc setup"
description: "Dependency-gated reconciliation: wait for 012/013 to land, diff both agent files against the real tree, draft the repoint with GPT-5.5-fast-high, fresh-Sonnet verify against the actual post-change paths."
trigger_phrases:
  - "markdown agent sync plan"
  - "125 sk-doc phase 014 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/125-sk-doc-parent/014-markdown-agent-sync"
    last_updated_at: "2026-07-07T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Author phase-014 plan"
    next_safe_action: "Confirm 012 and 013 have landed before starting the diff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Align markdown agent files with current sk-doc setup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Two markdown agent-definition files (`.opencode/agents/markdown.md`, `.claude/agents/markdown.md`) |
| **Framework** | Runtime Agent Directory Resolution convention (one canonical content, two runtime mirrors) |
| **Storage** | In-place edits to both files, kept content-identical |
| **Testing** | Repo-wide grep for stale packet names/paths; `diff` between the two mirrors |

### Overview
This phase is dependency-gated: it only produces a meaningful diff once `012-quality-control-rename/` and `013-shared-refs-reorg/` have actually landed. The plan is written now so the reconciliation work is scoped and ready to execute the moment those two phases close. GPT-5.5-fast-high drafts the repoint for both files in the same pass (to avoid the mirrors drifting from each other); a fresh Sonnet pass verifies every cited path against the real post-change file tree before landing.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `012-quality-control-rename/` closed (packet renamed, configs updated, 0 broken links)
- [ ] `013-shared-refs-reorg/` closed (`global/` flattened, citations repointed, 0 broken links)

### Definition of Done
- [ ] Both agent files cite only paths/names that exist on the post-011-013 tree
- [ ] The two runtime mirrors are content-identical
- [ ] `validate.sh` passes for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dependency-gated dual-mirror reconciliation: one drafting pass produces the same edit for both runtime mirrors, verified against the real tree rather than against each other alone.

### Key Components
- **Gate check**: confirm 012 and 013 are closed before starting.
- **Diff pass**: grep both agent files for packet names/paths, cross-check each hit against the current `.opencode/skills/sk-doc/` tree.
- **Repoint draft**: GPT-5.5-fast-high drafts the same correction in both files in one pass.
- **Fresh-Sonnet verification**: confirm every cited path in both files resolves on disk, and that the two files remain content-identical.

### Data Flow
1. Confirm 012/013 are closed (their `implementation-summary.md` or equivalent close-out evidence exists).
2. Grep both agent files for `sk-doc` packet names and paths.
3. Cross-check each citation against the real tree; list every stale hit.
4. Draft the repoint for both files together.
5. Fresh Sonnet verifies every path resolves and diffs the two files against each other.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm `012-quality-control-rename/` and `013-shared-refs-reorg/` are closed
- [ ] Grep both agent files for every `sk-doc` packet name/path citation

### Phase 2: Implementation
- [ ] Cross-check each citation against the current sk-doc tree; list stale hits
- [ ] Draft the repoint for both `.opencode/agents/markdown.md` and `.claude/agents/markdown.md` in the same pass
- [ ] Confirm the `/create:*` command-to-template table lists all 10 packets accurately

### Phase 3: Verification
- [ ] Fresh-Sonnet verification: every cited path resolves on disk
- [ ] `diff .opencode/agents/markdown.md .claude/agents/markdown.md` shows no unintended divergence
- [ ] Grep for `doc-quality` and `references/global` in both files, confirm 0 stale hits
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Path resolution | Every sk-doc citation in both agent files | Manual cross-check against the live tree |
| Mirror parity | Both runtime agent files | `diff` |
| Independent verification | Every drafted repoint | Fresh Claude Sonnet agent, no prior context |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `012-quality-control-rename/` | Internal | Blocked (not yet executed) | This phase's diff has nothing to reconcile until the rename lands |
| `013-shared-refs-reorg/` | Internal | Blocked (not yet executed) | Same, for the `global/` flatten |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: an edit to either agent file breaks the markdown agent's actual routing (a cited template path no longer resolves at runtime).
- **Procedure**:
  1. Revert both `.opencode/agents/markdown.md` and `.claude/agents/markdown.md` to their pre-edit committed versions.
  2. Re-verify the specific citation that broke against the live tree before re-attempting.
<!-- /ANCHOR:rollback -->
