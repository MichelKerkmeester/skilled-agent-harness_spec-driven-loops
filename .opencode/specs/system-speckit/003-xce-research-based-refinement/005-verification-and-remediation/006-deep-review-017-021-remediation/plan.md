---
title: "Implementation Plan: Deep-Review 017-021 Remediation [027/002/005/006]"
description: "Sequencing and architecture for closing the confirmed 017-021 deep-review findings: severity-lock the P1, reconcile doc drift, fix cancellation/instrumentation P2s. Authoring step only; no fixes applied here."
trigger_phrases:
  - "017-021 remediation plan"
  - "deep review remediation plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/005-verification-and-remediation/006-deep-review-017-021-remediation"
    last_updated_at: "2026-06-17T00:00:00Z"
    last_updated_by: "deep-review-remediation-author"
    recent_action: "Authored remediation plan workstreams from 017-021 deep-review syntheses"
    next_safe_action: "verify c006 renderer then begin per-file remediation"
    blockers: []
    completion_pct: 0
---
# Implementation Plan: Deep-Review 017-021 Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (mk-spec-memory MCP server), Markdown command templates, vitest |
| **Surface** | `.opencode/skills/system-spec-kit/mcp_server/lib/search/`, `.../handlers/`, `.../lib/ops/`, `.../lib/storage/`, `.../lib/providers/`, `.opencode/commands/memory/`, `.../mcp_server/tests/` |
| **Storage** | n/a (no schema change); the maintenance marker is an on-disk JSON file |
| **Testing** | vitest (per-suite baseline→delta); `validate.sh --strict` for doc/metadata |

### Overview
The 50-pass review of phases 017-021 verdicted four PASS + one CONDITIONAL with one confirmed P1 and a P2 backlog. This plan carries every confirmed finding into traceable workstreams without applying any fix. The load-bearing sequencing decision is the **severity-lock**: the P1 (c006 unquoted `$ARGUMENTS`) is resolved only after a renderer-behavior verification establishes whether it is a live sink (raw substitution → quote-harden) or a documented non-issue (shell-quoted → P2 doc-note). Everything else is independent P2 work grouped per phase, with the 017 systemic doc drift as the highest-volume item.
<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] All five syntheses read; every confirmed finding extracted
- [x] Rejected/refuted/already-resolved items enumerated and excluded
- [x] Each finding mapped to a target file + concrete change
- [x] The P1 has a verification-first gating task (severity-lock)

### Definition of Done (for the LATER implementation step — not this authoring step)
- [ ] The P1 closed at its verified severity with evidence
- [ ] Every confirmed finding fixed-or-downgraded-with-reason
- [ ] Code fixes test-gated (baseline→delta); doc/metadata validate.sh --strict clean
- [ ] No rejected finding implemented

### Definition of Done (this authoring step)
- [x] spec.md / plan.md / tasks.md / checklist.md / decision-record.md / implementation-summary.md authored
- [x] description.json + graph-metadata.json generated
- [ ] `validate.sh <this-packet> --strict` exits 0
<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Remediation packet — a per-finding task ledger over the reviewed subsystems, grouped into workstreams that each map to one synthesis and one verification gate.

### Touched Subsystems (later step)
- **Command contract** (`commands/memory/search.md`): the `/memory:search` §0 argument-resolution header (the P1).
- **Search/output intelligence** (`lib/search/confidence-scoring.ts`, `confidence-calibration.ts`, `recovery-payload.ts`, `hybrid-search.ts`): 017 maintainability cluster.
- **Reindex + cancellation** (`lib/ops/job-store.ts`, `handlers/memory-index.ts`): 018 Set-leak + count accuracy.
- **Maintenance grace** (`lib/storage/maintenance-marker.ts`, `lib/providers/retry-manager.ts`): 019/020 doc + test hygiene.
- **Cooperative heavy phases** (`handlers/memory-index.ts` empty-files branch, `lib/search/trigger-embedding-backfill.ts`): 021 instrumentation symmetry.
- **Spec-folder docs** (017-021 phase children): scaffold→shipped reconciliation.

### Severity-lock control flow
```
T001 verify renderer $ARGUMENTS handling
        │
        ├── raw  ──► T002 quote-harden §0 + metachar tests  (stays P1 until closed)
        │
        └── quoted ─► T002 record P2 doc-note + evidence    (no code edit)
```

### Data Flow (the reviewed cancellation/marker path, for fix grounding)
```
memory_index_scan ─► processBatches(shouldAbort) ─► per-file isCancelled
        │                                                  │
        ▼                                                  ▼
  job-store: requestCancel → cancelledJobIds(Set)    setJobState(terminal)  ← T012 clears Set
        │                                                  │
        ▼                                                  ▼
  maintenance-marker (labels[], 180s TTL, 20s refresh) ◄── timedPhase onPhase  ← T027 wraps empty-files branch
```
<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: P1 severity-lock + fix (M1)
- [ ] Verify renderer `$ARGUMENTS` handling (T001) — gates everything below it in this workstream
- [ ] Resolve the §0 exposure at verified severity (T002)

### Phase 2: 017 cross-cutting doc drift (M2)
- [ ] Reconcile all 7 children's spec/plan/tasks/graph-metadata to shipped reality (T003)

### Phase 3: 017 code/maintainability P2s (M3)
- [ ] c004 cluster (weight-sum assertion, equal-mean merge, PAV drift-guard, cache invalidation) (T004-T007)
- [ ] c003 recovery-payload hygiene (T008-T009); c002 quality-array guard (T010); c001/c005 cosmetic (T011)

### Phase 4: 018 cancellation accuracy + coverage (M4)
- [ ] cancelledJobIds clear-on-terminal (T012); cancelled-count distinct (T013); unit coverage (T014-T015); optional nits (T016)

### Phase 5: 019 doc reconciliation + hardening (M5)
- [ ] paths/schema/TTL/limitation/module/fixtures (T017-T022); optional marker hardening (T023)

### Phase 6: 020 test hygiene + doc (M6)
- [ ] reset on-disk marker rm (T024); "schema unchanged" wording (T025); optional residuals (T026)

### Phase 7: 021 instrumentation (M7)
- [ ] empty-files timedPhase (T027); doc claim (T028); near-dup count (T029); cancel under-report (T030); optional backlog (T031)

### Phase 8: verification + close-out (M8)
- [ ] baseline→delta per code fix (T032); validate.sh per doc reconcile (T033); confirm no refuted fix (T034); checklist + metadata (T035)
<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Gate |
|-----------|-------|-------|------|
| Unit (new) | `processBatches` shouldAbort; `isCancelRequestedFast` Set lifecycle; marker reset/dup-label; foreground-no-marker | vitest | new assertions pass |
| Unit (regression) | each touched suite (search, job-store, memory-index, maintenance-marker, trigger-embedding-backfill) | vitest | baseline→delta, no new failures |
| Manual / probe | the c006 renderer behavior — query with `*`, `$(…)`, `;`, `\|` resolves verbatim | live `/memory:search` probe | verbatim resolution + arg-echo match |
| Doc/metadata | every reconciled spec folder | `validate.sh --strict` | exit 0 |

**Baseline discipline**: capture the failing-test set BEFORE any change; re-run the WHOLE suite after each step; report `baseline N → now M`. Never claim "no regressions" against an uncaptured baseline.
<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 017-021 synthesis docs | Internal | Green | Source of truth; no task is actionable without them |
| Renderer-behavior evidence | Internal | Pending | Blocks T002 severity decision (the P1) |
| vitest harness (mcp_server) | Internal | Green | Code fixes cannot be test-gated |
| `validate.sh --strict` | Internal | Green | Doc reconciliations cannot be gated |
| Live mk-spec-memory daemon | Internal | Green (optional) | Only needed for the c006 live probe |
<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a carried fix regresses cancellation/instrumentation behavior, or a doc reconciliation is mis-scoped (clobbers a real impl-summary).
- **Procedure**: this authoring packet writes only its own docs — rollback = `git checkout` the packet folder. For the LATER implementation step, each fix is an independent, small, test-gated commit; revert the offending commit. Doc reconciliations are reversible via git; the on-disk maintenance marker is ephemeral (TTL-bounded) and needs no rollback.
<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
M1 (P1 lock+fix) ─ independent
M2 (017 doc drift) ─ independent ─┐
M3 (017 code P2s) ─ independent ──┤
M4 (018) ─ independent ───────────┼──► M8 (verification + close-out)
M5 (019 doc) ─ independent ───────┤
M6 (020) ─ independent ───────────┤
M7 (021) ─ independent ───────────┘
```

| Workstream | Depends On | Blocks |
|------------|------------|--------|
| M1 T001 | None | M1 T002 (severity decision) |
| M1 T002 | T001 | — |
| M2-M7 | None (parallelizable) | M8 |
| M8 | M1-M7 | None |

Within M1, T001 strictly precedes T002 (the severity-lock). All other workstreams are mutually independent and parallelizable; M8 (verification) gates on the rest.
<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Workstream | Complexity | Estimated Effort (later step) |
|------------|------------|-------------------------------|
| M1 P1 lock+fix | Medium | 1-2h (verify + harden-or-note) |
| M2 017 doc drift (7 children) | Medium | 2-3h (per-child reconcile) |
| M3 017 code P2s | Low-Medium | 2-3h |
| M4 018 cancellation + tests | Low-Medium | 2h |
| M5 019 doc reconciliation | Low | 1-2h |
| M6 020 test hygiene + doc | Low | 1h |
| M7 021 instrumentation | Medium | 2h |
| M8 verification | Low | 1-2h (gates) |
| **Total** | | **~12-17h (later step)** |

Effort is for the LATER implementation step. This authoring step is the packet only.
<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-change checklist (later step)
- [ ] Baseline test results captured per touched suite
- [ ] Each reviewed phase doc's current state noted before reconciliation
- [ ] T001 evidence recorded before any c006 edit

### Rollback procedure
1. **Authoring step**: `git checkout` the `006-…` packet folder.
2. **Code fix regresses**: revert that fix's commit (each is independent + small).
3. **Doc reconcile mis-scoped**: `git checkout` the affected phase doc; re-reconcile.
4. **Marker**: no rollback needed (on-disk marker is TTL-bounded, self-healing).

### Data reversal
- **Has data migrations?** No. No schema change; the maintenance marker is an ephemeral file.
<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│ M1 T001 (renderer     │
│ verification)         │
└──────────┬───────────┘
           │ (severity decision)
           ▼
┌──────────────────────┐     ┌────────────────────────────────────────┐
│ M1 T002 (P1 close)    │     │ M2 M3 M4 M5 M6 M7 (independent, parallel) │
└──────────┬───────────┘     └───────────────────┬────────────────────┘
           │                                      │
           └───────────────┬──────────────────────┘
                           ▼
                ┌──────────────────────┐
                │ M8 verification +     │
                │ close-out             │
                └──────────────────────┘
```

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| M1 T001 | Synthesis 017 | renderer evidence | M1 T002 |
| M1 T002 | T001 | P1 closed / doc-note | M8 |
| M2-M7 | Their syntheses | fixes + reconciled docs | M8 |
| M8 | M1-M7 | baseline→delta + validate.sh evidence | — |
<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **M1 T001** renderer verification — gates the P1 — CRITICAL
2. **M1 T002** P1 close at verified severity — CRITICAL
3. **M8** verification + close-out — CRITICAL

**Parallel opportunities**: M2-M7 are fully independent and can run concurrently with each other and with M1 (only M1 T002 waits on T001). The critical path is T001 → T002 → M8; everything else folds into M8.
<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria |
|-----------|-------------|------------------|
| M1 | P1 resolved | Renderer verified; §0 hardened (raw) or doc-noted (quoted) |
| M2 | 017 doc drift reconciled | 7 children's docs match shipped reality |
| M3-M7 | Per-phase P2s closed | Each finding fixed or accepted-with-reason |
| M8 | Close-out | baseline→delta clean; validate.sh --strict exit 0; checklist evidence |
<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:l3-adr-summary -->
## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Severity-lock the P1 behind a renderer-behavior verification | Avoid dead work (quoting a renderer that already quotes) and avoid leaving a live sink |
| ADR-002 | Honor synthesis verdicts/downgrades; do not re-escalate | The syntheses verified each claim against code; re-litigating wastes effort and contradicts evidence |
| ADR-003 | Split into per-phase + cross-cutting workstreams, one finding → one task | Maximizes traceability; lets each workstream carry its own verification gate |
| ADR-004 | Reconcile scaffold docs TO the impl-summary; never overwrite impl-summary content | The impl-summary is the truth source; bulk regen could clobber real shipped detail |
<!-- /ANCHOR:l3-adr-summary -->
