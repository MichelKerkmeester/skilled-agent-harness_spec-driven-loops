---
title: "Implementation Plan: Substrate stress-harness hardening [template:level_3/plan.md]"
description: "Architecture and phasing for the three harness fixes: process-start-time identity, run-id TSV with EPERM fallback, and maintainer-mode suppression."
trigger_phrases:
  - "substrate harness plan"
  - "harness hardening implementation"
  - "processStartedAt"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/038-substrate-harness-hardening"
    last_updated_at: "2026-05-31T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 plan for the three harness fixes"
    next_safe_action: "Implement and verify via npm run stress"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-038"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Substrate stress-harness hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (ESM `.mjs`) + TypeScript vitest |
| **Framework** | Vitest stress config (`vitest.stress.config.ts`) |
| **Storage** | None (reads daemon lease JSON; writes evidence TSV) |
| **Testing** | Vitest (`stress_test/substrate/`), `npm run stress` |

### Overview
Three independent fixes to `run-substrate-stress-harness.mjs`, plus matching vitest coverage, reusing existing in-repo patterns (the `ps`/`/proc` probe shape, the lease reads, the launcher set-if-absent env semantics).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Residual risks validated and cited (packet 037)
- [x] Fix sites and reusable helpers identified at file:line
- [x] ADRs drafted

### Definition of Done
- [x] All three fixes implemented
- [x] New vitest cases pass; existing live-owner SKIP test intact
- [x] `npm run stress` green
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-file harness module + sidecar vitest gate. Additive helpers + augmented functions; no new modules.

### Key Components
- **`processStartedAt(pid)`** — cross-platform process start-time → epoch ms or null.
- **`leaseOwnerMatch(pid, leaseStartMs)`** — liveness + start-time identity.
- **`liveOwnerForService`** — augmented to use `leaseOwnerMatch`.
- **`renderSummaryTsv` / `summarySidecarPath` / `writeSummary`** — run-id + EPERM sidecar.
- **`CODE_INDEX_INDEX_SUPPRESSION`** — flags spread into the code-index child env.

### Data Flow
connect fail → `liveOwnerForService` → `leaseOwnerMatch` (liveness + start-time) → SKIP/FAIL; `writeSummary` → canonical TSV (run-id) or EPERM sidecar; spawn code-index child with suppression flags.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `liveOwnerForService` / `isPidAlive` (producer) | Classifies connect failure to SKIP/FAIL | update (add identity gate) | new identity vitest cases |
| `writeSummary` (producer) | Emits evidence TSV | update (run-id + sidecar) | TSV vitest cases |
| code-index spawn env (policy) | Child daemon env | update (suppression flags) | env vitest case |
| `substrate-runner-harness.vitest.ts` (consumer/test) | Reads TSV scenario/verdict | unchanged | passes with 5-col TSV |
| launchers / `.env.local` | Lease + env source | not a consumer (untouched) | grep: no edits |

Required inventories:
- Same-class producers: `rg -n 'liveOwnerForService|writeSummary|buildDaemonEnv' run-substrate-stress-harness.mjs`.
- Consumers of changed symbols: `rg -n 'summary\.tsv|run_id|SKIP|FAIL' stress_test/substrate`.
- Algorithm invariant: a SKIP requires the lease PID to be alive AND the same process that wrote the lease (start-time match); otherwise FAIL.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm fix sites + reusable helpers; create packet.
- [x] Scaffold the new vitest file.

### Phase 2: Core Implementation
- [x] Maintainer-mode suppression in code-index child env.
- [x] Run-id TSV + EPERM sidecar.
- [x] Process-start-time identity in `liveOwnerForService`.

### Phase 3: Verification
- [x] New vitest cases pass.
- [x] Full `npm run stress` green (24 files / 87 tests).
- [x] Documentation + metadata + strict validate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | identity / TSV render / env suppression | Vitest |
| Integration | live-owner SKIP path (existing) | Vitest subprocess |
| Manual | full suite regression | `npm run stress` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `node:child_process` (`ps`) | Internal | Green | Liveness-only fallback |
| Vitest stress config | Internal | Green | Cannot run gate |
| Launcher set-if-absent env | Internal | Green | Suppression ignored (covered by test) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New tests or stress suite regress.
- **Procedure**: `git checkout` the harness + test files (single-file changes, no external state); re-run `npm run stress`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Core (3 independent fixes) ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 min |
| Core Implementation | Medium | 90 min |
| Verification | Medium | 45 min |
| **Total** | | **~2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline stress suite green
- [x] Scope limited to two substrate files

### Rollback Procedure
1. `git checkout -- run-substrate-stress-harness.mjs substrate-harness-hardening.vitest.ts`
2. Re-run `npm run stress` to confirm baseline restored.

### Data Reversal
- **Has data migrations?** No. Only disposable evidence TSV/sidecar files.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────┐   ┌────────────────────────────┐   ┌──────────┐
│  Setup   │──►│ Core: suppress / TSV /      │──►│  Verify  │
│          │   │ identity (independent)      │   │          │
└──────────┘   └────────────────────────────┘   └──────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Suppress | None | child-env flags | Verify |
| TSV | None | run-id + sidecar | Verify |
| Identity | None | processStartedAt | Verify |
| Verify | All fixes | green gate | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Identity** - 60 min - CRITICAL (largest change)
2. **Verification** - 45 min - CRITICAL

**Total Critical Path**: ~1.75 hours

**Parallel Opportunities**:
- Suppress, TSV, and Identity are independent edits to the same file, authored in one pass.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Code fixes landed | All three edits in harness | Session |
| M2 | Tests green | New cases + full stress 24/87 | Session |
| M3 | Release Ready | Docs synced, metadata, strict validate | Session |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Process-start-time identity

**Status**: Accepted

**Context**: A live PID alone does not prove lease ownership; a recycled PID can mask a crash as SKIP.

**Decision**: Accept an owner only when alive AND its start time matches the lease within 2s; see `decision-record.md`.

**Consequences**:
- Recycled-PID false-SKIP closed.
- Adds a `ps` read on the failure path only (negligible).

**Alternatives Rejected**:
- Heartbeat-only: weak for mk-spec-memory.

---
