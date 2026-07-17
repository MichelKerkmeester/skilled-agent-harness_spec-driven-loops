---
title: "Implementation Plan: 009 OpenLTM Continuity Resilience"
description: "Implement bounded, markdown-native session resilience over the existing resume ladder and PreCompact hook without adding a memory store or retrieval/index mutations."
trigger_phrases:
  - "027 phase 009"
  - "openltm continuity resilience"
  - "bounded startup restore panel"
  - "precompact authored continuity snapshot"
  - "goal decision progress gotcha taxonomy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/007-openltm-continuity-resilience"
    last_updated_at: "2026-06-10T14:35:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Implemented continuity resilience surfaces"
    next_safe_action: "Monitor opt-in snapshot rollout"
    blockers: []
    key_files:
      - "mcp_server/lib/resume/resume-ladder.ts"
      - "mcp_server/lib/continuity/authored-continuity-snapshot.ts"
      - "mcp_server/tests/openltm-continuity-resilience.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-10-openltm-continuity-resilience"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 009 OpenLTM Continuity Resilience

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js ESM |
| **Framework** | Spec Kit MCP server and Claude hook scripts |
| **Storage** | Existing markdown ladder only; no DB or index writes |
| **Testing** | Vitest, TypeScript no-emit, spec validation |

### Overview
This phase adds low-tech continuity resilience over the existing `session_bootstrap`, `session_resume`, PreCompact hook, and markdown-native resume ladder. The implementation keeps authored docs as the source of truth: the restore panel is read-only, the PreCompact snapshot is opt-in and markdown-only, and no retrieval ranking, memory row, schema, or index path changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable across restore counts, snapshot writes, cache-loss recovery, facets, and disabled behavior.
- [x] Dependencies identified: existing resume ladder, bootstrap handler, PreCompact hook, and continuity frontmatter parser.

### Definition of Done
- [x] All acceptance criteria met by targeted vitest coverage.
- [x] Tests passing for the new suite and touched continuity/bootstrap/precompact suites.
- [x] Docs updated with implementation and verification evidence.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive read/refresh surfaces over the existing markdown continuity ladder.

### Key Components
- **Resume ladder restore panel**: `mcp_server/lib/resume/resume-ladder.ts` now builds a bounded restore panel with restored and omitted counts.
- **Bootstrap exposure**: `mcp_server/handlers/session-bootstrap.ts` surfaces the restore panel in the startup payload contract.
- **Facet formatter**: `mcp_server/lib/continuity/thin-continuity-record.ts` renders goal, decision, progress, and gotcha facets from existing continuity fields.
- **Authored snapshot helper**: `mcp_server/lib/continuity/authored-continuity-snapshot.ts` refreshes `handover.md` and `_memory.continuity` only when explicitly enabled.
- **PreCompact integration**: `mcp_server/hooks/claude/compact-inject.ts` calls the authored snapshot helper before normal hook-cache work.

### Data Flow
1. `session_resume` reads the existing ladder with `buildResumeLadder`.
2. `buildResumeLadder` returns the existing recovery payload plus a bounded restore panel and facet summary.
3. `session_bootstrap` adds the restore panel to the startup payload when the resume surface provides it.
4. PreCompact detects the active spec folder from transcript context and, only when enabled, refreshes packet-local markdown docs.
5. Disabled snapshot mode returns counters proving zero memory records and zero index mutations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read phase spec, parent spec, plan, and tasks.
- [x] Identified bootstrap, PreCompact, resume ladder, and continuity parser paths.
- [x] Loaded OpenCode TypeScript and MCP authoring guidance.

### Phase 2: Core Implementation
- [x] Added bounded restored/not-restored panel generation to the resume ladder.
- [x] Added startup restore panel exposure to the bootstrap payload.
- [x] Added goal/decision/progress/gotcha continuity facet rendering.
- [x] Added opt-in authored markdown snapshot refresh for PreCompact.
- [x] Kept memory DB, index, ranking, ENV reference, package files, and schema version unchanged.

### Phase 3: Verification
- [x] Added `openltm-continuity-resilience.vitest.ts` covering all phase surfaces.
- [x] Ran targeted new suite: 6 tests passed.
- [x] Ran touched-surface suites: 29 tests passed.
- [x] Ran TypeScript no-emit from system-spec-kit package root.
- [x] Ran strict spec validation after doc reconciliation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Facet formatter, restore panel bounds, authored snapshot helper | Vitest |
| Integration | `session_bootstrap` restore panel payload and PreCompact snapshot helper behavior | Vitest with mocks/temp files |
| Static | TypeScript compile check for system-spec-kit | `npx tsc --noEmit -p tsconfig.json` |
| Spec | Level 1 spec contract validation | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing resume ladder | Internal | Green | Restore panel cannot be sourced |
| Existing PreCompact hook | Internal | Green | Snapshot cannot be refreshed before compaction |
| Existing thin continuity parser | Internal | Green | Facet rendering and `_memory.continuity` refresh cannot share the ladder shape |
| Explicit opt-in flag | Runtime config | Green | Snapshot writes stay disabled by default |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Restore panel or snapshot behavior causes startup payload or hook regressions.
- **Procedure**: Revert the touched continuity/bootstrap/hook files and the new vitest suite. No DB migration, schema version, memory row, index, ranking, package, or ENV reference rollback is needed.
<!-- /ANCHOR:rollback -->
