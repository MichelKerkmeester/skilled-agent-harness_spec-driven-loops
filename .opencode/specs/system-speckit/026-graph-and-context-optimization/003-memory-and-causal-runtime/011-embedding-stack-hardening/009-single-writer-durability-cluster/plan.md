---
title: "Implementation Plan: Single-writer / durability cluster (coordinated)"
description: "Coordinated per-family implementation plan + deterministic two-launcher concurrency test (Harness A/B) + apply ordering with a precondition gate, for the deep-review single-writer/durability cluster."
trigger_phrases:
  - "single writer durability cluster plan"
  - "harness A harness B concurrency test design"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/009-single-writer-durability-cluster"
    last_updated_at: "2026-05-29T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Captured coordinated design + concurrency-test harnesses + apply ordering"
    next_safe_action: "Re-validate findings at HEAD, then implement per family"
    blockers: ["Family-3 precondition gate on adjacent launcher WIP"]
    key_files: [".opencode/bin/lib/model-server-supervision.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003192"
      session_id: "031-009-plan"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Single-writer / durability cluster (coordinated)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS launcher + supervision (`.opencode/bin`), TypeScript mcp_server, vitest |
| **Framework** | system-spec-kit embedding-stack launcher + WAL/shard durability |
| **Storage** | UDS socket + respawn lockfile; better-sqlite3 main DB + vector shard; clean-shutdown marker |
| **Testing** | Harness A/B extending real vitest suites; `node --check`; `npm run build` |

### Overview
Implement the cluster as ONE coordinated change set grouped by shared-resource family, routing root-liveness through a single authority (`reapBeforeRespawn` + `readModelServerPid`/`liveness`). Land behind a deterministic two-launcher concurrency test (no real sleeps; inject `nowMs`/`liveness`/`spawnFn`/`signal`). Source of truth: `031/review/review-report.md` + the C3 design (this packet).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Every finding re-validated still-open at HEAD, located by symbol
- [ ] Precondition gate cleared for Family-3 (adjacent launcher WIP quiesced)
- [ ] Root-liveness authority confirmed (`reapBeforeRespawn`, lines ~772-790)

### Definition of Done
- [ ] All families implemented together; Harness A + B RED-before / GREEN-after
- [ ] Builds + `node --check` pass; strict-validate the packet
- [ ] No piecemeal landing; one coordinated commit (or tightly-sequenced set)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single root-liveness authority + O_EXCL leases; durability via "confirm-then-mark" + staging-shard atomic swap.

### Key Components
- **Respawn lock** (`hf-embed-respawn.lock`, O_EXCL): staleness must be bounded by listener liveness, not wall-clock alone.
- **reapProcessTreeGroups / reapBeforeRespawn**: the root pid must not be excluded from reaping on idle eviction.
- **Clean-shutdown marker** (`vector-index-store.ts` close path): present == dirty; delete only after a confirmed-successful close.
- **Reindex shard swap** (`reindex.ts`): write to a staging shard, atomic-swap on success.

### Data Flow
Launcher demand → respawn lock (O_EXCL) → spawn/own → idle-evict reaps the WHOLE tree incl. root → clean close TRUNCATEs WAL then removes marker. Reindex writes a staging shard and swaps the active-embedder pointer only on success.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Four shared-resource families (collision surfaces):

| Family | File | Findings | Action |
|--------|------|----------|--------|
| 1 Respawn lock | `bin/lib/model-server-supervision.cjs` | DR-005, DR-006 | Bound `isRespawnLockStale` to listener liveness; re-arm listener on `launch()==false` |
| 2 Root reaping | `bin/lib/model-server-supervision.cjs` | DR-012 | Stop excluding the root pid in `reapProcessTreeGroups`; idle-evict routes through `reapBeforeRespawn` |
| 3 Leases | `scripts/core/{workflow,daemon-detect}.ts`; `owner-lease.ts` | DR-016, OR-R-01 | Honor a live recorded `childPid` in a stale lease; OR-R-01 O_EXCL already done — re-validate. **GATED** |
| 4 Durability | `vector-index-store.ts`, `reindex.ts`, `hf-model-server.cjs` | DR-011, DR-020, DR-001-P2-001, +DR-001-P1-002, +DR-002-P1-001 | Confirm-then-delete marker; staging-shard atomic swap; perimeter guard on direct startup; reindex cancel re-read; tcp loopback/auth |

Required inventories:
- Re-read each site by symbol; review line numbers are stale.
- Confirm the single root-liveness authority before editing any family.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Precondition gate: confirm adjacent code-graph launcher WIP quiesced (Family-3)
- [ ] Re-validate every finding at HEAD by symbol; confirm OR-R-01 still coherent (O_EXCL present)

### Phase 2: Core Implementation
- [ ] Family 1 (DR-005 + DR-006) together in the acquire/spawn/error path
- [ ] Family 2 (DR-012) root reaping via the shared authority
- [ ] Family 4 (DR-011, DR-020, DR-001-P2-001, DR-001-P1-002, DR-002-P1-001) durability + folded edges
- [ ] Family 3 (DR-016; OR-R-01 re-validate) — only after the gate

### Phase 3: Verification
- [ ] Harness A (single-owner / no-orphan) RED-before / GREEN-after
- [ ] Harness B (durability) RED-before / GREEN-after
- [ ] Builds + `node --check` + strict-validate; coordinated commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Harness A | DR-005/006/012/016/001-P2-001/OR-R-01 — single-owner + no-orphan | extend `tests/embedders/launcher-model-server-*.vitest.ts` + `system-code-graph .../launcher-lease.vitest.ts`; inject `nowMs`/`liveness`/`spawnFn`/`signal` |
| Harness B | DR-011/DR-020 — durability | extend vector-index-store + reindex suites; assert marker survives failed close; staging-swap atomicity |
| Build/syntax | touched `.cjs` + workspaces | `node --check`, `npm run build` |

Determinism: no real sleeps — advance injected `nowMs` past `RESPAWN_LOCK_STALE_MS=60000`; scripted pid→state `liveness`; fake `spawnFn` (alive / no-pid); assert `signal` targets.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Adjacent code-graph launcher WIP | External session | Gating | Family-3 cannot start until quiesced |
| `031/review/review-report.md` | Internal | Green | Authoritative finding source |
| `createModelServerControl` deps injection (`nowMs`/`liveness`/`spawnFn`/`signal`) | Internal | Green | Enables deterministic Harness A |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Harness A/B regression, or any launcher instability post-land.
- **Procedure**: `git revert` the coordinated commit as a unit (the whole point of one-packet landing is one-revert). Re-validate against HEAD before re-attempting. No DB migrations; the marker/shard changes are forward-compatible.
<!-- /ANCHOR:rollback -->
