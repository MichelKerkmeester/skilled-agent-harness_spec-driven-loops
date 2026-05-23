---
title: "Feature Specification: mcp-figma transfer (tri-repo): withdraw mcp-figma developer skill from Code_Environment/Public, reframe as a Figma MCP Agent in AI_Systems/Barter (mirroring ClickUp), dual-publish a sanitized duplicate to AI_Systems/Public, and register it in the Public README"
description: "Phase parent for mcp-figma transfer (tri-repo): withdraw mcp-figma developer skill from Code_Environment/Public, reframe as a Figma MCP Agent in AI_Systems/Barter (mirroring ClickUp), dual-publish a sanitized duplicate to AI_Systems/Public, and register it in the Public README"
trigger_phrases:
  - "067-mcp-figma-transfer"
  - "phase parent"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "scaffold/067-mcp-figma-transfer"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: mcp-figma transfer (tri-repo): withdraw mcp-figma developer skill from Code_Environment/Public, reframe as a Figma MCP Agent in AI_Systems/Barter (mirroring ClickUp), dual-publish a sanitized duplicate to AI_Systems/Public, and register it in the Public README

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | scaffold/067-mcp-figma-transfer |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Validator + template + generator changes ship so parent validates under tolerant policy |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
This phased decomposition tracks mcp-figma transfer (tri-repo): withdraw mcp-figma developer skill from Code_Environment/Public, reframe as a Figma MCP Agent in AI_Systems/Barter (mirroring ClickUp), dual-publish a sanitized duplicate to AI_Systems/Public, and register it in the Public README across independently executable child phase folders.

### Purpose
Keep parent documentation lean while child phases own detailed plans, tasks, checklists, and continuity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root purpose and child phase manifest for mcp-figma transfer (tri-repo): withdraw mcp-figma developer skill from Code_Environment/Public, reframe as a Figma MCP Agent in AI_Systems/Barter (mirroring ClickUp), dual-publish a sanitized duplicate to AI_Systems/Public, and register it in the Public README
- Per-phase implementation details in child folders

### Out of Scope
- Detailed per-phase implementation plans at the parent level

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| [Per-child files] | Modify/Create | Child phases | Detailed file scope lives in each child phase |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-barter-figma-agent/ | Author Figma MCP Agent at `AI_Systems/Barter/MCP Agents/Figma/` mirroring ClickUp structure | ✅ Complete (commits 690b498 + 66e1e87 on Barter main; opus hook B 9/9 PASS) |
| 2 | 002-public-figma-agent/ | Sanitized duplicate at `AI_Systems/Public/Figma/` + Public/README.md §8 anchor patch (D9 superseded by user commit `766206b` to internal-only scope) | ✅ Complete (commits c4f6c56 + e96a3ee + 766206b on Public main; opus hooks C+D 12/12 PASS) |
| 3 | 003-mcp-figma-skill-removal/ | Delete mcp-figma skill + patch 14 cross-ref files + advisor SQLite re-index in Code_Environment/Public | ✅ Complete (commits 9f7b3c6d4 + a4cb4e0a1 + 7307e056d on Public main; opus hooks E+F+G PASS with 295/296 tests and 1 known advisor-graph-health failure from sk-code `kind: "reference-category"` drift, out of scope per 069) |
| 4 | 004-deep-review-remediation/ | Remediate 3 P0 + 13 P1 + 5 P2 findings from 7-iteration deep review (review/review-report.md) — child --strict validators, P0 checklist evidence, deep-review-state.jsonl backfill, install guide env var prefix, ledger sync, D9 supersession formalization, ADR-005 body rewrite, Hook F status, broken symlink + dead links, Public install_guide cwd, Barter+Public AGENTS.md byte-equivalence | ✅ Complete (cli-codex 3-job parallel remediation; all 4 children + parent --strict PASS; bdb739d97 + 7307e056d + 66e1e87 + 766206b commit ledger now reflected in all phase summaries) |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-barter-figma-agent | 002-public-figma-agent | Commit 1 (`Figma MCP`) on Barter main; opus hook B passes; all P0 checklist items green | `git -C "<barter>" log -1 --oneline` shows `Figma MCP`; checklist.md has all P0 `[x]` |
| 002-public-figma-agent | 003-mcp-figma-skill-removal | Commits 2+3 on AI_Systems/Public main; opus hooks C+D pass; Public README §8 TOC math correct | `git -C "<public>" log --oneline -2` shows both commits; TOC count=8 matches badge=8 |
| 003-mcp-figma-skill-removal | (final synthesis) | Commits 4+5+6 on Code_Environment/Public main; advisor tests green; G1 grep clean; G7 spec validates --strict | `bash validate.sh ... --strict` exits 0; `grep -rn "mcp-figma" Public/` returns 0 outside allowed paths |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

(All 10 decisions D1–D10 resolved at parent level; recorded in 001-barter-figma-agent/decision-record.md and cross-referenced in child decision-records.)

Phase order: 001 → 002 → 003 (author-first, delete-last per approved master plan at `/Users/michelkerkmeester/.claude/plans/think-really-hard-tender-karp.md`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
