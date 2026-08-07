---
title: "Verification Checklist: Phase 018 - design-mcp-open-design Transport Integration"
description: "Verification Date: 2026-07-07 - all checklist items verified with evidence"
trigger_phrases:
  - "verification"
  - "checklist"
  - "phase 018 checklist"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/009-sk-design-claude-parity/018-mcp-open-design-transport-integration"
    last_updated_at: "2026-07-07T10:05:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Filled in evidence for all checklist items"
    next_safe_action: "Write implementation-summary.md, run validate.sh --strict, commit and push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-open-design-transport-018"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 018 - design-mcp-open-design Transport Integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|--------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Moved skill's actual nature (transport, not design mode) confirmed by reading its full SKILL.md (verified)
- [x] CHK-002 [P0] Repo-wide reference inventory completed via Explore agent, classified live vs. historical (verified)
- [x] CHK-003 [P1] sk-code's existing two-axis precedent (`extensions.surface-axis`) read and used as the model (verified)
- [x] CHK-004 [P0] Integration shape confirmed with operator before any edit (AskUserQuestion, 3 options) (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 4 edited/created JSON registries parse as valid JSON via `python3 -c "import json; json.load(...)"` (verified)
- [x] CHK-011 [P1] New `transport` axis mirrors sk-code's `extensions.surface-axis` shape (description + member array) for consistency across the two parent hubs (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Systematic link scanner (not manual grep) used for both discovery and final verification, catching markdown-link syntax across the whole moved packet, 0 broken on the final pass (verified)
- [x] CHK-021 [P0] Repo-wide re-scan across `sk-design` + `mcp-figma` (excluding node_modules/changelog/benchmark) confirms 0 broken links after all hub-level and external edits (verified)
- [x] CHK-022 [P0] Router-mode skill-benchmark: verdict PASS, aggregate 100/100, D5 connectivity 100/100, matching the pre-integration baseline exactly (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-P0-001 [P0] All 14 depth-shift broken links inside `design-mcp-open-design/` fixed, plus 2 pre-existing missing `design-interface/` segments surfaced by the same scan; systematic re-scan shows 0 remaining (verified)
- [x] CHK-P0-002 [P0] Packet identity fully renamed (`SKILL.md` name/H1/keywords, `README.md` title/H1, scripts, feature_catalog, manual_testing_playbook) - confirmed via grep sweep showing 0 stale `mcp-open-design` text outside historical changelog (verified)
- [x] CHK-P0-003 [P0] `design-mcp-open-design/graph-metadata.json` deleted, dissolving its independent advisor identity; `test -f` returns false (verified)
- [x] CHK-P0-004 [P0] `mode-registry.json` carries the new `transport` packetKind axis, discriminator doc, extensions block, and a complete `design-mcp-open-design` mode entry with correct toolSurface (verified)
- [x] CHK-P0-005 [P0] `hub-router.json` carries the new routerSignals entry, vocabularyClasses aliases, and tieBreak append (verified)
- [x] CHK-P1-006 [P1] sk-design's own SKILL.md/README.md mode-count and transport-listing prose updated consistently (5+5 mentions fixed) (verified)
- [x] CHK-P1-007 [P1] Now-internal graph edges removed (not retargeted) from both sk-design's and mcp-figma's graph-metadata.json, since the relationship is now structural via mode-registry.json (verified)
- [x] CHK-P1-008 [P1] External cross-references fixed: mcp-figma (5 mentions across 3 files), cli-opencode (1 rule + version bump), AGENTS.md (2 rows) (verified)
- [x] CHK-P1-009 [P1] Changelog symlinks corrected: stale `.opencode/changelog/mcp-open-design` removed, `.opencode/changelog/sk-design/design-mcp-open-design` added and resolves to real changelog files via `ls` (verified)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] New `design-mcp-open-design` mode's toolSurface correctly excludes Write/Edit (matches its actual capability: reads local content, drives an external daemon via Bash, never writes this repo's files) (verified)
- [x] CHK-031 [P1] `mutatesWorkspace: false` correctly reflects that Bash calls target an external app/daemon, not this repo's workspace, distinguishing it from `md-generator`'s genuine repo-mutating `mutatesWorkspace: true` (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with actual delivered scope (verified)
- [x] CHK-041 [P2] `design-mcp-open-design`'s own mandatory-pairing runtime contract (must load sk-design's judgment) preserved verbatim, not touched by this identity/path-only integration (verified)
- [x] CHK-042 [P2] `system-skill-advisor`'s compiled `skill-graph.json` staleness explicitly flagged as a required follow-up rather than silently left unaddressed (documented in Known Limitations) (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` scoped to the touched skills shows exactly the intended file set (the moved packet, sk-design's registries/docs, mcp-figma, cli-opencode, AGENTS.md, 2 changelog symlink entries) (verified)
- [x] CHK-051 [P1] No unrelated concurrent-session file swept into scope, confirmed via scoped `git add` + `git status` re-check before commit (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 8 | 8/8 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-07
<!-- /ANCHOR:summary -->
