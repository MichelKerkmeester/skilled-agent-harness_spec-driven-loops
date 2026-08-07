---
title: "Feature Specification: Save-Handler README Doc-Sync (Default-On Async Enrichment)"
description: "The handlers/save/README.md predates packet 017's shipped behavior: it still describes post-insert enrichment as 'optional' and synchronous. Sync it to the live code, where enrichment is default-on and runs async/deferred by default (forced sync via SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true)."
trigger_phrases:
  - "save handler readme stale"
  - "post-insert enrichment default-on docs"
  - "async deferred enrichment readme"
  - "enrichment doc sync"
  - "SPECKIT_POST_INSERT_ENRICHMENT_SYNC"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/022-readme-doc-sync"
    last_updated_at: "2026-06-04T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Synced handlers/save/README.md to default-on async enrichment behavior shipped in packet 017"
    next_safe_action: "Run validate.sh --strict; commit when requested"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "readme-doc-sync-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Enrichment default verified in code: isPostInsertEnrichmentEnabled() reads SPECKIT_POST_INSERT_ENRICHMENT_ENABLED via isFeatureEnabled (default TRUE)."
      - "Async default verified: isPostInsertEnrichmentAsync() = !isOptInEnabled('SPECKIT_POST_INSERT_ENRICHMENT_SYNC') (default async; SYNC=true forces synchronous)."
      - "Reconsolidation stays opt-in (SPECKIT_RECONSOLIDATION_ENABLED); README already correct — left untouched."
---
# Feature Specification: Save-Handler README Doc-Sync (Default-On Async Enrichment)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`handlers/save/README.md` predates packet 017's shipped behavior. It still describes
post-insert enrichment (`runPostInsertEnrichment()`) as "optional" and as a step that runs
inline during the save. In the live code, enrichment is default-on and runs async/deferred by
default: the save returns immediately with `enrichmentStatus: deferred` (reason
`async-background`), and a bounded background scheduler runs the steps after commit. A reader
of the README would form the wrong mental model of when graph/entity data becomes available.

### Purpose
Make the README match the live code: enrichment is default-on and async/deferred by default,
with `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` as the forced-synchronous escape hatch.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `handlers/save/README.md` §7 ENTRYPOINTS: reword the `runPostInsertEnrichment()` line to convey default-on + async/deferred-by-default + the SYNC override.
- `handlers/save/README.md` §6 main-flow box: change "create record and post-insert enrichment" to reflect that enrichment is scheduled async (deferred) by default.
- `handlers/save/README.md` §5 KEY FILES `post-insert.ts` row: append a clause noting default-on + async/deferred via a background scheduler unless SYNC forces synchronous.

### Out of Scope
- Any code change - this is a docs-only sync; the live behavior already shipped in packet 017.
- Reconsolidation wording - the README already correctly calls it "optional"; reconsolidation stays opt-in (`SPECKIT_RECONSOLIDATION_ENABLED`).
- The pre-existing unlisted file `enrichment-state.ts` - that documentation gap is intentionally out of scope.
- Any other README in the mcp_server tree, `ENV_REFERENCE.md`, or skill docs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/save/README.md` | Modify | Sync §5/§6/§7 wording to default-on async/deferred enrichment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | §7 entrypoint line for `runPostInsertEnrichment()` describes default-on + async/deferred default + `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` forced-sync | README §7 row no longer says "optional"; conveys deferred return + background scheduler + SYNC override |
| REQ-002 | Env var names in the README exactly match the code | `SPECKIT_POST_INSERT_ENRICHMENT_SYNC` verified against `lib/search/search-flags.ts`; no invented flag names |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | §6 main-flow box reflects async/deferred scheduling | Box reads "create record; post-insert enrichment scheduled async (deferred) by default" |
| REQ-004 | §5 KEY FILES `post-insert.ts` row appends the default-on async clause (only if it reads naturally) | Row notes default-on + async/deferred via background scheduler unless `SPECKIT_POST_INSERT_ENRICHMENT_SYNC=true` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: README §5/§6/§7 describe enrichment as default-on and async/deferred-by-default with the SYNC override, matching live code.
- **SC-002**: No reconsolidation wording changed; no code touched; `validate.sh --strict` reports Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inventing an env-flag name not present in code | README misleads readers | Verified `SPECKIT_POST_INSERT_ENRICHMENT_SYNC` against `search-flags.ts` before writing |
| Risk | Scope creep into reconsolidation / other READMEs | Unintended doc churn | Scope locked to `handlers/save/README.md` §5/§6/§7 |
| Dependency | Packet 017 (default-on async enrichment) already shipped | — | Behavior live-verified in this packet via code read |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Defaults re-confirmed in live code before editing.
<!-- /ANCHOR:questions -->
