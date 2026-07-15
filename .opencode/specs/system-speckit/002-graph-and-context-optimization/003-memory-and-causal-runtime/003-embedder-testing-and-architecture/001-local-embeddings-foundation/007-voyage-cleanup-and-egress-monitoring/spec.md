---
title: "Feature Specification: Phase 7 — Voyage Cleanup + Egress Monitoring"
description: "Delete the stale Voyage 1024-dim sqlite (~322MB) and the legacy generic-name context-index.sqlite (~141MB) left over from before 014's filename-keyed rebuild. Add a runtime egress-detection guard in the embedding factory that warns if VOYAGE_API_KEY appears in process.env while the active provider is hf-local. Document the 24h tcpdump verification approach for the user to run post-merge."
trigger_phrases:
  - "007 voyage cleanup"
  - "delete voyage sqlite"
  - "voyage egress monitor"
  - "VOYAGE_API_KEY runtime guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring"
    last_updated_at: "2026-05-12T22:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Voyage + legacy sqlite deleted (463MB reclaim)"
    next_safe_action: "Add runtime egress guard in factory"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0140070c2a9e0000000000000000000000000000000000000000000000000001"
      session_id: "014-007-voyage-cleanup-2026-05-12"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "Wait 24h before deletion? → No; deletion is reversible from git history; user verifies 0 egress post-merge"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7 — Voyage Cleanup + Egress Monitoring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress (deletes shipped; egress guard pending) |
| **Created** | 2026-05-12 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 9 |
| **Predecessor** | 005-q4-quantization (independent in practice; 004 baseline is what's actually required) |
| **Successor** | 008-finalize-and-commit |
| **Handoff Criteria** | Voyage + legacy sqlite gone from `.opencode/skills/system-spec-kit/mcp_server/database/`; runtime egress guard active in factory; tcpdump verification command documented |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

**Phase 7** of `014-local-embeddings-setup-a`. The Voyage migration left behind 322MB of stale 1024-dim vectors and the legacy generic-filename context-index.sqlite (141MB) from before filename-keying landed. Both are dead data; deleting them reclaims 463MB and removes the chance of any future "wait, why is there a Voyage DB?" confusion. The egress guard catches the regression where someone re-exports `VOYAGE_API_KEY` in the future and the auto-resolver silently flips back to Voyage.

**Scope Boundary**: Deletes + one runtime warning in `factory.ts`. No new dependencies, no new MCP tools, no model changes.

**Dependencies**: 004 baseline (memory side using filename-keyed hf-local sqlite). 005 + 006 not required — the cleanup is independent of q4 and bge-m3 work.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After 003 purged `VOYAGE_API_KEY` from every shell-propagating source and 004 rebuilt the memory vec store under hf-local, three sqlite files at `.opencode/skills/system-spec-kit/mcp_server/database/` were stale: `context-index__voyage__voyage-4__1024.sqlite` (318MB main + 32K shm + 4MB wal) and the older generic-name `context-index.sqlite` (141MB) from before filename-keying. Disk space aside, the leftover files make "is Voyage still in use?" a slower question to answer.

### Purpose
Reclaim ~463MB. Make the answer to "is Voyage still being called?" obvious from a single `ls`. Add a runtime warning so a regression that re-introduces `VOYAGE_API_KEY` doesn't silently flip the provider.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Delete `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite{,-shm,-wal}` (322MB)
- Delete `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` (141MB legacy)
- Add a runtime egress guard in `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` that logs a warning if `VOYAGE_API_KEY` is set in process.env when the resolved provider is `hf-local`
- Document a 24h `tcpdump` verification command for post-merge user verification
- Rebuild `shared/dist/` if factory.ts changes
- Update 014 parent `spec.md` if it references the voyage sqlite paths

### Out of Scope
- Auto-killing the process on Voyage egress (the guard logs, doesn't enforce — user might intentionally re-enable Voyage as a fallback)
- Network-level firewall rules
- Removing the litellm provider entry from cocoindex (cocoindex has its own embedding-routing layer; out of 014 scope)
- Encrypting at-rest local sqlite files
- The 24h actual tcpdump run (user does this post-merge; not a session task)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index__voyage__voyage-4__1024.sqlite{,-shm,-wal}` | Delete | 322MB stale Voyage 1024-dim vectors |
| `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` | Delete | 141MB pre-filename-keying generic DB |
| `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` | Modify | Add `assertNoVoyageDrift()` runtime check, called from the factory at provider resolution time |
| `.opencode/skills/system-spec-kit/shared/dist/embeddings/factory.{js,d.ts}` | Regenerate | `npx tsc --build` |
| `007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh` | Create | Documented 24h capture command (not executed in session) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Voyage sqlite gone | `ls .opencode/skills/system-spec-kit/mcp_server/database/ \| grep voyage` returns nothing |
| REQ-002 | Legacy context-index.sqlite gone | `ls ... \| grep "^context-index\\.sqlite"` returns nothing |
| REQ-003 | Memory still works post-delete | `memory_health` reports `vectorSearchAvailable: true` and the hf-local DB still has all 2112 rows |
| REQ-004 | Egress runtime guard present | grep `VOYAGE_API_KEY` in `factory.ts` finds the assert/warn site |
| REQ-005 | dist is rebuilt | `factory.js` in dist contains the new guard code |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | tcpdump command documented | `scratch/tcpdump-verify.sh` exists with the command + post-merge instructions |
| REQ-007 | Disk reclaim recorded | implementation-summary captures the byte count (463MB) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: After this packet, the only context-index sqlite in the DB dir is the filename-keyed hf-local one
- **SC-002**: A future regression that re-exports VOYAGE_API_KEY surfaces immediately via a stderr warning at the next MCP child spawn
- **SC-003**: User has a single-command verification (`bash scratch/tcpdump-verify.sh`) to confirm zero egress to api.voyageai.com over a 24h window
- **SC-004**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict` exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Some hidden consumer still expects context-index__voyage__*.sqlite to exist | Low | Grep showed no active references; only migration scripts + logs reference the path historically. Test by exercising `memory_health` after delete — must still report healthy. |
| Risk | Egress guard fires false positives if user intentionally re-enables Voyage as a fallback | Low | The guard logs a warning, doesn't enforce — user can ignore it OR remove the warn by intentionally unsetting `VOYAGE_API_KEY` |
| Risk | Recovery requires re-embedding 2112 rows if user wants to undo the delete | Low | Deletion is reversible at the git-history level only AFTER 008 ships the commit. Before 008, current uncommitted state can be restored by re-running 004's rescan (cache hits make it fast) |
| Dependency | hf-local provider must already be the resolved active provider | Green — 004 + 003 ensured this |
| Dependency | factory.ts is reachable at MCP child startup | Green — already wired through `lib/providers/embeddings.js` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none — answered in spec-doc frontmatter)
<!-- /ANCHOR:questions -->
