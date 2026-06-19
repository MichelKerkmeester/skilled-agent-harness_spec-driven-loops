---
title: "Tasks: Embedding-Staleness Signal (Skill Advisor SA8)"
description: "Task breakdown for the advisor SA8 embedding-staleness sub-phase: baseline capture, signature stamp at projection build, compare-on-load verdict (mirror memory_embedding_reconcile), semantic_shadow lane degrade, the Memory-010 idempotent-async rebuild reuse, verification, and Level-2 documentation closeout. All implementation tasks PENDING (nothing shipped in Wave-0/030; SA8 scheduled Wave-1)."
trigger_phrases:
  - "tasks advisor embedding staleness signal"
  - "SA8 projection signature task breakdown"
  - "advisor projection rebuild idempotent tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/003-embedding-staleness-signal"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored SA8 task breakdown; all impl tasks PENDING"
    next_safe_action: "Author checklist.md"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
      - "../../../030-memory-search-intelligence-impl/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-003-embedding-staleness-signal"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Embedding-Staleness Signal (Skill Advisor SA8)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending (not yet implemented — nothing in this sub-phase shipped in Wave-0/030) |
| `[x]` | Completed (re-plan authoring tasks done in this session) |
| `[P]` | Parallelizable |
| `[B]` | Blocked before completion |

**Task Format**: `T### [P?] Candidate or action (primary seam) [status/evidence]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:milestones -->
## Milestone Reference

| Milestone | Tasks | Target |
|-----------|-------|--------|
| M0 | T001 | Focused scorer/validate baseline (the green count the change is measured against) |
| M1 | T002-T003 | Signature capture at projection build (REQ-001) |
| M2 | T004-T005 | Compare-on-load verdict (REQ-002), mirror `memory_embedding_reconcile` |
| M3 | T006-T007 | `semantic_shadow` lane degrade on stale (REQ-003) |
| M4 | T008-T009 | Idempotent-async rebuild reuse — gated on Memory 010 (REQ-004) |
| M5 | T010-T011 | Verification (detection + degrade + idempotency) |
| M6 | T012-T015 | Docs + validation closeout |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Baseline capture — the green count the staleness signal is measured against. SA8 banked ZERO benchmarks; correctness/detection only, no benefit number.

- [ ] T001 Capture the current `advisor_validate` + focused scorer Vitest green count on the live skill graph BEFORE any change (REQ-001 prep) [Pending — regression baseline per the WHOLE-gate rule; no SA8 benefit number is claimed].
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Signal-first: signature capture (Phase A) → compare-on-load verdict (Phase B) → lane degrade (Phase C); then the gated rebuild reuse (Phase D).

- [ ] T002 SA8 signature capture — derive a canonical `(provider, name, dim)` signature from the active-embedder pointer + `providerModelId` (`skill-graph-db.ts:599-600`) and attach it to the `AdvisorProjection` shape at build (`projection.ts` `loadSqliteProjection`, build site near `:315`) (REQ-001) [Pending — `../research/from-006-sibling-revisit/research.md:80`; reuse `providerModelId`, do NOT invent a new signature format].
- [ ] T003 SA8 back-compat retention — RETAIN the existing `generatedAt` stamp (`projection.ts:315,328,375,413`) as a sibling field; the signature is ADDED, not a replacement, so `advisor_status`/cache-keying consumers that read `generatedAt` are undisturbed (REQ-001) [Pending — risk R-002 back-compat; spec §6].
- [ ] T004 SA8 compare-on-load verdict — in `loadAdvisorProjection` (`projection.ts:388`) compare the stored signature against the active embedder (read the pointer like `embedding-reconcile.ts:139-142` reads `active_embedder_*`) and emit `{stale:boolean, reason?:string}` mirroring `embedding-reconcile.ts:183-189` (`verified:false, reason:"shard model X != active Y"`) (REQ-002) [Pending — `../research/from-006-sibling-revisit/research.md:80`; do NOT re-derive the reconcile shape, mirror it].
- [ ] T005 SA8 fail-closed on missing signature — a missing/null stored signature on an otherwise-populated projection ⇒ STALE (fail-closed, matching `embedding-reconcile.ts` default `requireActiveShard`), so a legacy signature-less projection is flagged for rebuild rather than silently trusted (REQ-002) [Pending — spec §L2 EDGE CASES "Invalid format"].
- [ ] T006 SA8 lane degrade — wire `semantic_shadow` (`lanes/semantic-shadow.ts`) to read the stale verdict; on stale, the lane degrades (elide / down-weight) rather than serving superseded cosine rows as fresh (REQ-003) [Pending — align the degrade SHAPE with sibling 002 `runtime-lane-health-degrade` degrade-to-remaining; do NOT invent a parallel convention].
- [ ] T007 SA8 report-only on unreadable pointer — if the active-embedder pointer is unreadable, report-only (degrade the lane, do NOT crash the load), mirroring `embedding-reconcile.ts:34` `providerFailurePolicy:"report-only"` (REQ-003) [Pending — spec §L2 EDGE CASES "External service failure"].
- [ ] T008 [B] Rebuild reuse — import the Memory `010-consolidation-cursor-clock` durable-cursor + bounded-retry + idempotency-token primitive; route the stale-triggered projection rebuild through it (single in-flight via idempotency token, recoverable mid-rebuild via durable cursor, no double-apply) (REQ-004) [Pending/BLOCKED on Memory 010 landing — synthesis `04-sibling-and-cross-cutting.md:34`; this is the SECOND consumer, do NOT stand up a second engine].
- [ ] T009 [B] Rebuild thrash guard — a stale verdict that is ALREADY rebuilding does not re-trigger; two concurrent stale loads launch a single rebuild (idempotency token + cursor lock) (REQ-004) [Pending/BLOCKED on Memory 010 — spec §L2 EDGE CASES "Concurrent access"; risk R-004 thrash].
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 Detection check — a projection built under embedder A, loaded while embedder B is active, yields `{stale:true}` with a reason string in the `embedding-reconcile.ts` shape; a matching signature yields `{stale:false}`; a null signature yields `{stale:true}` (fail-closed) (SC-001/SC-002; REQ-002).
- [ ] T011 Degrade + idempotency check — the `semantic_shadow` lane degrades under a stale verdict (no superseded cosine rows ranked as fresh) vs unchanged under fresh (REQ-003); and (Phase D, gated) a rebuild interrupted mid-cursor resumes without re-applying completed rows, two concurrent stale loads launch one rebuild (SC-003; REQ-004). Re-run the WHOLE focused gate and report the delta vs the T001 baseline (no benefit number — correctness only).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:closeout -->
## Phase 4: Documentation + closeout

- [x] T012 Author `spec.md` from the system-spec-kit Level-2 template (2-candidate pair, per-candidate PENDING status with research-cited acceptance criteria; seam + mirror cited).
- [x] T013 Author `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` from the system-spec-kit Level-2 templates.
- [x] T014 Re-confirm against `030` section 14 that NO advisor embedding-staleness candidate shipped (grep returns SA8 only at the Wave-1 future-work line `030 spec.md:104`); record both candidates PENDING.
- [x] T015 Run `validate.sh --strict` on this sub-phase and fix structure issues.
<!-- /ANCHOR:closeout -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Both candidates have a final status in `spec.md` section 10 (both PENDING-with-gate; 0 DONE — SA8 is Wave-1 future work in 030, not shipped).
- [x] The Memory-010 idempotent-async primitive is identified as the reuse target for facet #2 (the rebuild), and facet #1 (the signal) is recorded as independently shippable (no shared-infra gate).
- [x] The mirror reference (`memory_embedding_reconcile`, `embedding-reconcile.ts:162-189`) is confirmed by direct read; the SA8 seam (`projection.ts:315`, columns `skill-graph-db.ts:187,348-352,599-600`) is confirmed by direct read.
- [ ] The signal is implemented (signature capture + compare-on-load + lane degrade) and verified; the rebuild reuse is wired once Memory 010's primitive lands (downstream implementation, tracked).
- [x] Strict validation passes for this sub-phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`, especially section 10 candidate status.
- **Plan**: `plan.md`.
- **Checklist**: `checklist.md`.
- **Source research**: `../research/research.md`, `../research/from-006-sibling-revisit/research.md:80` (SA8 origin), `../../research/roadmap.md`, `../../research/synthesis/01-go-candidates.md:36`, `../../research/synthesis/04-sibling-and-cross-cutting.md:15,:34`.
- **Shared-infra dependency**: `../../001-speckit-memory/010-consolidation-cursor-clock/spec.md` (idempotent-async primitive).
- **Mirror reference (read-only)**: `memory_embedding_reconcile` — `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/embedding-reconcile.ts:162-189`.
- **Shipped record (do not modify)**: `../../../030-memory-search-intelligence-impl/spec.md` section 14 (SA8 absent → PENDING) + Wave-1 list `:104`.
<!-- /ANCHOR:cross-refs -->
