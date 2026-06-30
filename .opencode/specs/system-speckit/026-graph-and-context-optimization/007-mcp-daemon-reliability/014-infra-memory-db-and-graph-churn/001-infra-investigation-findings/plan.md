---
title: "Implementation Plan: Infra investigations — memory-DB + graph-churn"
description: "How to apply the two infra fixes safely: graph-metadata idempotency + scope (code) and the operator-gated FTS5 shadow rebuild (DB repair)."
trigger_phrases:
  - "infra fix plan memory db graph churn"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-infra-investigation-findings"
    last_updated_at: "2026-05-30T12:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Captured apply plan for both infra fixes"
    next_safe_action: "Apply graph-churn fix when tooling healthy"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003202"
      session_id: "001-infra-investigation-findings-plan"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Infra investigations — memory-DB + graph-churn

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (graph-metadata-parser, backfill, generate-context); SQLite (FTS5) for the DB repair |
| **Framework** | system-spec-kit mcp_server + scripts |
| **Storage** | `graph-metadata.json` per packet; `context-index.sqlite` (1 GB, WAL) |
| **Testing** | scoped vs global backfill dry-run + diff; DB-copy probe for the repair; build + targeted vitest |

### Overview
Two independent fixes. Graph-churn is a code change (idempotent timestamp + scoped refresh + archive exclusion). Memory-DB is a live-data repair run through `/doctor memory` / the FTS runbook, verified on a DB copy first.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Both root causes verified against source / DB state
- [ ] Editing tooling (Read/shell) confirmed reliable before touching graph-metadata-parser.ts
- [ ] DB copied to /tmp and probed before any live repair

### Definition of Done
- [ ] Graph-churn fix applied + build + targeted test; saves no longer churn archived trees
- [ ] Memory DB repaired; memory writes succeed; no `.unclean-shutdown` left
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Idempotent write + scoped invocation for the metadata refresh; derived-index rebuild for the FTS5 shadow.

### Key Components
- **graph-metadata-parser.ts** `refreshGraphMetadataForSpecFolder` / `deriveGraphMetadata`: where `last_save_at` is written; add a derived-equality (ignoring timestamp) skip.
- **backfill walker + generate-context save path**: scope to the touched folder; exclude `z_archive`/`z_future`.
- **FTS5 shadow** (`memory_fts_data`): rebuild via `INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`.

### Data Flow
Save → (today) global walk rewrites all `last_save_at`; (fixed) refresh only the saved folder, skip when unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Operator-sensitive: metadata-writing code + a 1 GB live DB.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| graph-metadata-parser.ts | Writes `last_save_at` unconditionally | Skip write when derived-equal (ignoring timestamp) | Re-save a packet twice → second produces no diff |
| backfill walker / save path | Walks whole specs tree incl. archives | Scope to touched folder; exclude archives | Save one packet → only its `graph-metadata.json` changes |
| context-index.sqlite (FTS5 shadow) | Corrupt after unclean shutdown | Rebuild shadow (operator-gated) | `integrity-check` ok; memory_save succeeds |

Required inventories:
- Confirm `refreshGraphMetadataForSpecFolder` callers and which pass a `specFolder` scope vs the default root.
- DB-copy probe to choose FTS-rebuild (primary) vs id-dedupe (secondary) before any live change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Root-cause both issues; capture fixes (this packet)
- [ ] Confirm tooling healthy; preserve `/tmp/graph-metadata-parser.AGENT-PROPOSED.ts` as a reference only

### Phase 2: Core Implementation (graph-churn, when tooling healthy)
- [ ] Add the idempotent `last_save_at` skip in `graph-metadata-parser.ts`
- [ ] Scope the save-time refresh to the touched folder + exclude archives; keep global backfill as opt-in flag
- [ ] Build + targeted vitest + a dry-run diff (scoped vs global)

### Phase 3: Memory-DB repair (operator-gated)
- [ ] Copy `context-index.sqlite` to /tmp; probe (FTS rebuild vs id-dedupe)
- [ ] Run `/doctor memory` or the runbook rebuild; integrity-check; confirm memory_save works
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Idempotency | re-save a packet twice | git diff (expect none on 2nd) |
| Scope | save one packet | git status (expect 1 graph-metadata.json) |
| DB repair | on a /tmp copy first | sqlite3 integrity-check / rebuild |
| Build | mcp-server | tsc |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Reliable Read/shell tooling | Environment | Was degraded this session | Cannot safely edit operator-sensitive code |
| `/doctor memory` / FTS runbook | Operator path | Available | Memory repair path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Graph-churn**: `git revert` the code commit; pure logic change, no data migration.
- **Memory-DB**: the repair works on a copy first; the live DB has a `.corrupt-*.bak` snapshot, and FTS rebuild only touches the derived index, not source rows.
<!-- /ANCHOR:rollback -->
