---
title: "Implementation Summary: AGENTS And Runtime Routing Cleanup"
description: "Execution summary for the AGENTS And Runtime Routing Cleanup release-cleanup phase."
trigger_phrases:
  - "008-agents-md implementation summary"
  - "028 release cleanup 008-agents-md"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/001-release-cleanup/008-agents-md"
    last_updated_at: "2026-07-06T19:16:25.645Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed cleanup, fixed mk-spec-memory tool count 37 to 39"
    next_safe_action: "Phase complete, proceed to phase 009"
    blockers: []
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-summary-008-agents-md"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Scope is root AGENTS.md plus runtime AGENTS and CLAUDE mirrors."
      - "One stale claim fixed: mk-spec-memory tool count 37 to 39."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-agents-md |
| **Completed** | 2026-06-19 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The AGENTS and runtime-routing cleanup ran against the three discovered surfaces. Discovery found root `AGENTS.md` (with `CLAUDE.md` a symlink to it), the Codex mirror `.codex/AGENTS.md` and the Claude routing mirror `.claude/CLAUDE.md`. One stale factual claim was found and fixed.

### Cleanup Result

Root `AGENTS.md` line 332 claimed the `mk-spec-memory` MCP server exposes 37 tools. The live count is 39, confirmed three ways: the `spec-memory.cjs list-tools` CLI, the `tool-schemas.ts` registry source and the canonical `system-spec-kit/SKILL.md` and `README.md`. The line was corrected to 39. The `CLAUDE.md` symlink reflects the fix automatically. Every other referenced path in the root file resolves, and the server count (5), advisor count (9) and code-index count (8) are current. The two mirror files carry no stale paths, counts or routes, so they were left unchanged.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `AGENTS.md` | Modified | Fixed stale mk-spec-memory tool count 37 to 39 |
| spec.md | Updated | Status set to COMPLETE, candidate table marked DONE |
| plan.md | Updated | Quality-gate and phase checkboxes marked done |
| tasks.md | Updated | All tasks marked complete |
| checklist.md | Updated | All verification items marked complete |
| implementation-summary.md | Updated | Records executed cleanup result |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Discovery enumerated every `AGENTS.md` and `CLAUDE.md` under the repo, then filtered to the three maintained surfaces. Worktree copies, external vendored docs and archived trees were excluded. Each surface was read in full and every load-bearing path, count and route was checked against the live tree before any edit. The single stale claim was fixed with a surgical one-line edit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix only the verified stale count | The 37-to-39 gap is the one provable factual error across all three surfaces |
| Leave the established em-dash style intact | Wholesale restyle of a governance doc plus its mirrors is high-blast and breaks SCOPE LOCK |
| Leave both mirror files unchanged | The Codex voice doc and Claude routing doc carry no stale paths, counts or routes |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Stale-reference scan | No actionable hit across the three surfaces |
| Path resolution | Every referenced path in root AGENTS.md resolves |
| Tool counts | mk-spec-memory 39, advisor 9, code-index 8 confirmed against live CLIs |
| Edited-prose voice | Edited line has no em dash, semicolon or Oxford comma |
| Strict validation | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-speckit/028-memory-search-intelligence/000-release-cleanup/008-agents-md --strict` exits 0 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Em-dash house style retained.** The root file and its mirrors use em dashes as deliberate structure. Bringing them fully into HVR voice is a separate, high-blast restyle that was kept out of scope to protect the symlink and both mirrors.
<!-- /ANCHOR:limitations -->
