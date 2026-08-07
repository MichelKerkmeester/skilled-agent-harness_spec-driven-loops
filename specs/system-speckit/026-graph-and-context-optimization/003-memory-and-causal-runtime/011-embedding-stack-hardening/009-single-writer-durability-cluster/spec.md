---
title: "Feature Specification: Single-writer / durability cluster (coordinated)"
description: "Coordinated remediation of the deep-review single-writer + durability findings (DR-005/006/012/016/011/020 + DR-001-P1-002 + DR-002-P1-001; OR-R-01 already remediated). Design + deterministic two-launcher concurrency test are complete; implementation is gated on adjacent launcher WIP quiescing and per-finding HEAD re-validation, per the handover's no-piecemeal mandate."
trigger_phrases:
  - "single writer durability cluster"
  - "respawn lock idle eviction reap root concurrency test"
  - "coordinated launcher WAL durability remediation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/011-embedding-stack-hardening/009-single-writer-durability-cluster"
    last_updated_at: "2026-05-29T23:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Captured coordinated design + concurrency-test harnesses"
    next_safe_action: "Re-validate findings; implement per family after the WIP gate"
    blockers:
      - "Precondition gate: Family-3 (DR-016 / OR-R-01) waits on the adjacent code-graph launcher WIP quiescing"
    key_files:
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/bin/hf-model-server.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/vector-index-store.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/reindex.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003191"
      session_id: "031-009-spec"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "OR-R-01: owner-lease election is ALREADY O_EXCL at HEAD (writeOwnerLeaseExclusive openSync 'wx'); residual is cross-launcher coordination tracked in 026/004/013 — re-validate only."
      - "DR-012 mechanism is root-EXCLUSION in reapProcessTreeGroups (pid !== childPid filter), not a missing reap call."
---
# Feature Specification: Single-writer / durability cluster (coordinated)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Implemented + tested (2026-05-30); all 5 families landed |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | Deep-review remediation — single-writer/durability cluster (C3) |
| **Predecessor** | 008-deep-review-correctness-edges |
| **Successor** | None |
| **Handoff Criteria** | All findings re-validated at HEAD; implemented per-family as one coordinated change set; Harness A + B go RED-before / GREEN-after; builds + `node --check` pass; landed after the launcher-WIP precondition gate. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep review found a cluster of single-writer / durability defects across the embedding-stack launcher + supervision + WAL surfaces. The handover mandates they land as ONE coordinated packet with a deterministic two-process concurrency test — not piecemeal — because they share resources (respawn lock, root-liveness authority, leases, shutdown marker) and piecemeal fixes re-collide. This is the highest-blast-radius surface in the repo (the program exists because of a DB-corruption incident here), so each finding must be re-validated at HEAD before editing.

### Purpose
Capture the complete coordinated design + the deterministic concurrency-test design + the apply ordering (including the precondition gate), so the cluster can be implemented as a single careful, well-tested effort rather than rushed.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (to implement as one coordinated change set)
Grouped by shared-resource family (collision surfaces):
- **Family 1 — respawn lock** (`model-server-supervision.cjs`): DR-005 (respawn-lock TTL can expire while the live listener owns it → bound staleness to listener liveness in `isRespawnLockStale`), DR-006 (spawn failure strands the lazy listener → re-arm on `launch()==false` in `handleModelServerDemand`).
- **Family 2 — root-liveness / reaping** (`model-server-supervision.cjs`): DR-012 (idle eviction reaps descendants but EXCLUDES the root via `reapProcessTreeGroups` `pid !== childPid` filter → route through `reapBeforeRespawn` root authority).
- **Family 3 — leases / second-writer** (`daemon-detect.ts` + `workflow.ts`; `owner-lease.ts`): DR-016 (Step-11.5 ignores a live recorded `childPid` in a stale launcher lease), OR-R-01 (**already O_EXCL-remediated** — re-validate only). **GATED on adjacent code-graph launcher WIP.**
- **Family 4 — durability** (`vector-index-store.ts`, `reindex.ts`, `hf-model-server.cjs`): DR-011 (clean-shutdown marker deleted before detach/close can fail → delete only after confirmed close), DR-020 (failed same-dim reindex partially overwrites the live shard → staging-shard atomic-swap), DR-001-P2-001 (direct startup unlinks a live socket → apply the perimeter guard), and the folded-in correctness edges DR-001-P1-002 (reindex cancel re-read) + DR-002-P1-001 (tcp loopback/auth).

### Out of Scope
- Anything outside these findings; the comment guard/sweep (007) and isolated correctness edges (008) are separate, landed packets.

### Files to Change
See the per-family map in `plan.md` §AFFECTED SURFACES. Touch points: `.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/hf-model-server.cjs`, `mcp_server/lib/search/vector-index-store.ts`, `mcp_server/lib/embedders/reindex.ts`, `scripts/core/workflow.ts` + `scripts/core/daemon-detect.ts`, and (gated) `.opencode/bin/mk-code-index-launcher.cjs` / `system-code-graph/.../owner-lease.ts`.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete before implementation)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Per-finding HEAD re-validation | Each finding confirmed still-open at HEAD and located by symbol (line numbers stale) |
| REQ-002 | Precondition gate honored | Family-3 (DR-016/OR-R-01) not started until the adjacent code-graph launcher WIP has quiesced + landed |
| REQ-003 | One coordinated change set | Families implemented together routing through a single root-liveness authority; no piecemeal landing |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Deterministic concurrency test | Harness A (single-owner / no-orphan) + Harness B (durability) go RED-before / GREEN-after, using injected `nowMs`/`liveness`/`spawnFn`/`signal` — no real sleeps |
| REQ-005 | Verification | Builds + `node --check` on touched `.cjs` + the new harnesses pass; strict-validate the packet |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All cluster findings land together with Harness A + B green; a second launcher cannot become a concurrent owner and no orphaned root process survives idle eviction.
- **SC-002**: Durability — the clean-shutdown marker survives a failed close, and a failed same-dim reindex cannot partially overwrite the live shard.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Highest-blast-radius surface (corruption-incident origin) | A subtle concurrency bug can corrupt the DB | One coordinated change set + deterministic Harness A/B + per-finding re-validation; not rushed |
| Risk | Adjacent-session ownership of the code-graph launcher | Cross-session collision | Precondition gate; OR-R-01 already remediated so Family-3 is mostly re-validation |
| Risk | First-pass review line numbers stale / one finding already-remediated | Wasted or wrong edits | Re-validate by symbol; OR-R-01 + DR-012 mechanism already corrected in this design |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Timing of the precondition gate: confirm the code-graph launcher WIP (commits 6bd1d7045e / 8943837b2f) is settled before Family-3.

<!-- /ANCHOR:questions -->
