---
title: "Implementation Plan: Phase 7 — Voyage Cleanup + Egress Monitoring"
description: "Delete stale Voyage + legacy sqlite (463MB reclaim), add a one-shot runtime egress guard in factory.ts that warns if VOYAGE_API_KEY is set while the resolved provider is hf-local, and document a 24h tcpdump capture command for post-merge user verification."
trigger_phrases:
  - "007 plan voyage cleanup"
  - "factory.ts egress guard"
  - "voyage sqlite deletion plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/007-voyage-cleanup-and-egress-monitoring"
    last_updated_at: "2026-05-12T22:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Deletes shipped; egress guard added to factory.ts"
    next_safe_action: "Strict-validate 007"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0140070c2a9e0000000000000000000000000000000000000000000000000002"
      session_id: "014-007-voyage-cleanup-2026-05-12"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7 — Voyage Cleanup + Egress Monitoring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (`shared/embeddings/factory.ts`); bash for the tcpdump capture script |
| **Framework** | Embedding factory's `getProviderInfoForResolution` is the natural single resolution point that runs once per startup |
| **Storage** | No DB changes beyond the 4 sqlite file deletes |
| **Testing** | Manual: trigger MCP child spawn, verify the warn fires only when `VOYAGE_API_KEY` AND provider=hf-local both hold |

### Overview
Two-touchpoint change. (1) Delete the 4 stale sqlite files. (2) Add `warnIfVoyageDriftDetected()` to factory.ts and call it from `getProviderInfoForResolution`. The guard is fail-soft — it logs, doesn't throw — because the user may intentionally keep VOYAGE_API_KEY for other tooling. The tcpdump script in scratch/ is documentation-only; user runs it post-merge.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 003 Voyage shell-source purge complete
- [x] 004 hf-local sqlite is the active memory store (2112 rows)

### Definition of Done
- [x] Voyage + legacy sqlite deleted
- [x] Egress guard in factory.ts and rebuilt dist
- [x] tcpdump script in scratch/
- [ ] Strict validate exits 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Idempotent runtime warn. One module-level `voyageDriftWarned` flag ensures the message logs at most once per process lifetime.

### Key Components
- **`warnIfVoyageDriftDetected(effectiveProvider: string)`** — module-local helper, short-circuits if already warned or provider isn't hf-local, otherwise checks `process.env.VOYAGE_API_KEY` and emits one warn
- **Call site:** `getProviderInfoForResolution()` after metadata resolution. This runs on every provider-resolution call but is internally guarded against repeats
- **tcpdump script (`scratch/tcpdump-verify.sh`):** 24h capture, summary print at end, PASS/FAIL on packet count

### Data Flow
MCP child boots → factory resolves provider → `getProviderInfoForResolution` runs → `warnIfVoyageDriftDetected('hf-local')` fires → if VOYAGE_API_KEY present, console.warn surfaces in launcher stderr. Same drift detection also applies to long-lived processes that resolve the provider lazily.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `shared/embeddings/factory.ts` | Provider resolution + factory metadata | Modify — add `warnIfVoyageDriftDetected()` helper + call from `getProviderInfoForResolution` | TypeScript compilation clean; dist contains the helper |
| `shared/dist/embeddings/factory.{js,d.ts}` | Compiled output | Regenerate via `npx tsc --build` | grep finds `warnIfVoyageDriftDetected` in dist |
| `mcp_server/database/context-index__voyage__voyage-4__1024.sqlite{,-shm,-wal}` | Stale Voyage vectors | Delete | `ls` returns nothing matching `voyage` glob |
| `mcp_server/database/context-index.sqlite` | Legacy pre-filename-keying DB | Delete | `ls` returns nothing matching the exact name |
| `007/scratch/tcpdump-verify.sh` | 24h egress capture | Create, chmod +x | File exists, executable bit set |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm no active references to the voyage sqlite (`lsof` returns nothing; grep shows only historical references in migration scripts + logs)
- [x] Confirm hf-local sqlite is the active store

### Phase 2: Core Implementation
- [x] Delete `context-index__voyage__voyage-4__1024.sqlite{,-shm,-wal}` (~322MB)
- [x] Delete `context-index.sqlite` (~141MB legacy)
- [x] Add `voyageDriftWarned` module flag + `warnIfVoyageDriftDetected()` helper in factory.ts
- [x] Wire the helper call into `getProviderInfoForResolution()`
- [x] Type check + build dist
- [x] Verify dist exports the helper

### Phase 3: Verification
- [x] `memory_health()` still reports healthy (no regression from deletes)
- [x] tcpdump script in scratch/, executable
- [ ] Strict validate exits 0
- [ ] User runs tcpdump-verify.sh post-merge and confirms 0 packets over 24h (not a session task)
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | warnIfVoyageDriftDetected() under (VOYAGE_API_KEY set, provider hf-local) → warns once | Standalone Node REPL |
| Integration | MCP child spawns with VOYAGE_API_KEY in env → first provider resolution emits warn | Manual spawn + tail launcher stderr |
| Manual | tcpdump capture for 24h on user's host | bash script in scratch/ |
| Regression | memory_health post-delete | MCP tool |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 003 Voyage shell purge | Internal | Green | Without it, the egress guard would fire on every spawn (loud-but-correct) |
| 004 hf-local sqlite active | Internal | Green | Without it, deleting the Voyage sqlite could break in-flight searches |
| tcpdump + sudo on user's macOS | External | Green | User has it; documented in script |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A consumer is discovered that genuinely needs the deleted Voyage sqlite
- **Procedure**: Revert the delete commit (post-008). The vectors themselves are reproducible via re-embedding (Voyage API key needed; will cost a few dollars in compute). The legacy `context-index.sqlite` is NOT recoverable since it predates filename-keying — but no current code expects it. The egress guard is a single `git revert` if it produces noise.
<!-- /ANCHOR:rollback -->
