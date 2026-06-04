---
title: "Implementation Plan: Save-Handler README Doc-Sync"
description: "Docs-only sync of handlers/save/README.md to packet 017's shipped default-on async enrichment behavior. Re-confirm flag defaults in code, then apply three surgical wording edits to §5/§6/§7."
trigger_phrases:
  - "readme doc sync plan"
  - "post-insert enrichment readme"
  - "async enrichment docs plan"
  - "save handler readme update"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/022-readme-doc-sync"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Wrote plan for docs-only README sync"
    next_safe_action: "Apply edits; validate strict"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-doc-sync-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Save-Handler README Doc-Sync

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs (mcp_server handler folder README) |
| **Framework** | system-spec-kit MCP server / handlers/save |
| **Storage** | None (docs-only) |
| **Testing** | `validate.sh --strict` + manual diff review against live code |

### Overview
A docs-only sync. The `handlers/save/README.md` predates packet 017, which shipped post-insert
enrichment as default-on and async/deferred-by-default. This plan re-confirms the flag defaults
directly in code, then applies three surgical wording edits to §5/§6/§7 so the README matches
the live behavior. No code changes; reconsolidation wording is left untouched.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Flag defaults verified in live code before any edit

### Definition of Done
- [x] §5/§6/§7 reworded to default-on async/deferred behavior
- [x] Env var names match code (`SPECKIT_POST_INSERT_ENRICHMENT_SYNC`)
- [x] `validate.sh --strict` Errors 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation sync (no runtime architecture change).

### Key Components
- **`handlers/save/README.md`**: the folder guide being synced.
- **`lib/search/search-flags.ts`**: source of truth for the enrichment flag helpers/defaults.
- **`handlers/memory-save.ts` + `handlers/save/post-insert.ts`**: where the async/deferred scheduling + deferred-result builder live (read-only references for verification).

### Data Flow
Live code (`search-flags.ts` defaults + `memory-save.ts` async branch) → re-confirmed by grep/read → README wording updated to match.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Verify defaults in code
- [x] Grep `isPostInsertEnrichmentEnabled` / `isPostInsertEnrichmentAsync` / `isReconsolidationEnabled` / `scheduleBackgroundEnrichment` / `buildDeferredEnrichmentResult`
- [x] Confirm enrichment default-on (`SPECKIT_POST_INSERT_ENRICHMENT_ENABLED` via `isFeatureEnabled`, default TRUE)
- [x] Confirm async default (`!isOptInEnabled('SPECKIT_POST_INSERT_ENRICHMENT_SYNC')`; SYNC=true forces sync)
- [x] Confirm reconsolidation stays opt-in (`SPECKIT_RECONSOLIDATION_ENABLED`)

### Phase 2: Apply README edits
- [x] §7 ENTRYPOINTS: reword `runPostInsertEnrichment()` line
- [x] §6 main-flow box: "create record; post-insert enrichment scheduled async (deferred) by default"
- [x] §5 KEY FILES `post-insert.ts` row: append default-on async clause

### Phase 3: Verification
- [x] `validate.sh --strict` on the packet
- [x] Confirm no reconsolidation wording changed; no code touched
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Doc validation | Packet structure + README structure | `validate.sh --strict` |
| Manual | README wording vs live code defaults | grep + Read diff review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Packet 017 shipped behavior | Internal | Green | None - already live; this is a follow-up doc sync |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README wording found inaccurate vs code.
- **Procedure**: `git checkout -- handlers/save/README.md` (docs-only; no code or migration to revert).
<!-- /ANCHOR:rollback -->
