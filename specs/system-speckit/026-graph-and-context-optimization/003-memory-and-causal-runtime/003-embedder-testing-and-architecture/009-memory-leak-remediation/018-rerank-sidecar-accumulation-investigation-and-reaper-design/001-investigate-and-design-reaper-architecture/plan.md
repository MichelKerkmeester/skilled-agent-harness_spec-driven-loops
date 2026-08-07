---
title: "Plan: Rerank-Sidecar Accumulation Investigation and Reaper Design"
description: "Canonical-anchor plan for mapping rerank_sidecar lifecycle evidence, evaluating the three-layer reaper, and producing ADRs for follow-on implementation."
trigger_phrases:
  - "arc 010 004 001 plan"
  - "rerank sidecar reaper design plan"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/018-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-sidecar-lifecycle-plan"
    next_safe_action: "use ADRs and Files-to-Change list for follow-on packet 010/005"
    blockers: []
    key_files:
      - "plan.md"
      - "research/iter-001.md"
      - "research/research.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0100040010100040010100040010100040010100040010100040010100040010"
      session_id: "010-004-001-rerank-reaper-design"
      parent_session_id: null
    completion_pct: 100
---
# Plan: Rerank-Sidecar Accumulation Investigation and Reaper Design

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript launcher, Python launcher, FastAPI/uvicorn sidecar, JSON ledger |
| **Findings** | 12 lifecycle findings in `research/findings-registry.json` |
| **Evidence** | Current source files and prior arc 010 hardening docs with file:line citations |

This child phase is research-only. It verifies the detached rerank sidecar lifecycle, proves that existing cleanup removes dead ledger rows but does not reap alive ownerless workers, retains a refined three-layer reaper design, and hands a concrete implementation file list to packet `010/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper/`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Child packet `spec.md`, parent `../spec.md`, and arc root `../../spec.md` were read.
- [x] Full JS launcher, Python launcher, FastAPI sidecar, ledger module, and uvicorn start script were read.
- [x] Prior F88/F102/F69/F15/F49 hardening documents were loaded as constraints.
- [x] Canonical sibling anchors from arc `010/003/001` were copied into this packet's plan, tasks, and checklist structure.

### Definition of Done
- [x] `research/iter-001.md` contains a file:line lifecycle map and at least 10 findings.
- [x] `research/research.md` evaluates Layer B, Layer D, and Layer A with marginal coverage.
- [x] `decision-record.md` contains at least 5 Proposed ADRs.
- [x] `implementation-summary.md` contains Completed status, 100 percent completion, follow-on Files-to-Change, and commit handoff.
- [x] Strict spec validation exits 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Invariants Enforced
- Keep `start_new_session=True` / detached sidecar launch. Warm-model reuse remains intentional.
- Add reaping around the current ledger model instead of replacing it.
- Treat PID liveness as identity-verified: `kill(0)` plus `(pid, lstart, comm)` comparison.
- Reap only when all registered owners are dead and no in-flight request exists, or when a managed sidecar exceeds the idle threshold.
- Keep JS and Python launcher semantics in parity.
- Keep ledger writes locked and atomic.

### Affected Surfaces

| Surface | Role | Invariant |
|---------|------|-----------|
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | JS launcher for spec-memory | Reap before reuse/spawn, register current owner identity, keep detached spawn. |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | Python launcher for CocoIndex | Mirror JS owner identity and reap predicate exactly. |
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | Ledger schema and helpers | Versioned owner identity schema, locked updates, identity-verified liveness reasons. |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | FastAPI service | Background owner-liveness task, idle backstop, in-flight request gate, telemetry. |
| Tests in JS/Python sides | Parity guard | Fixture matrix proves both launchers classify owner liveness and reap eligibility identically. |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
Read packet specs, source lifecycle files, prior hardening docs, current client detach line, and canonical sibling anchors.

### Phase 2: Investigation and Design
Map current spawn, ledger, reuse, health, and shutdown behavior. Produce failure-mode inventory, findings registry, and three-layer design evaluation with marginal coverage.

### Phase 3: Verification
Author ADRs, follow-on Files-to-Change handoff, and canonical checklist evidence. Run strict spec validation and repair packet docs until it exits 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Lifecycle evidence | Every behavior claim cites source file:line in `research/iter-001.md` and `research/research.md`. |
| Finding count | `research/findings-registry.json` contains 12 fingerprints. |
| ADR count | `decision-record.md` contains 7 Proposed ADRs. |
| Marginal layer coverage | Section 6 of `research/research.md` marks non-zero marginal coverage for B, D, and A. |
| Packet validity | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` exits 0. |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| F88 structured liveness | Prior design constraint | Available | New reasons extend the existing `{ alive, reason, errorCode }` shape. |
| F102 Python parity | Prior design constraint | Available | Python dataclass/helpers must mirror JS semantics. |
| F69 flock parity | Prior design constraint | Available | Reap/register operations rely on locked ledger updates. |
| F15 atomic write | Prior design constraint | Available | Ledger and owner-token writes remain race-safe. |
| F49 env allowlist | Prior design constraint | Available | Reaper env knobs must pass only through approved launch/start paths. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet edits documentation only. Rollback is deleting the seven authored files and restoring `spec.md` completion metadata. The follow-on implementation packet must have its own rollback plan for source changes; this research packet does not mutate runtime code.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Setup | Packet specs and source reads | Phase 2 investigation |
| Phase 2: Investigation and Design | Current lifecycle evidence | Phase 3 ADR/checklist completion |
| Phase 3: Verification | Authored docs and registry | Follow-on implementation packet 010/005 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Notes |
|-----------|----------|-------|
| Lifecycle mapping | Medium | Requires JS/Python launcher, ledger, sidecar app, start script, and client call path. |
| Design evaluation | Medium | Three layers have overlapping but non-subsumed coverage. |
| Documentation and validation | Medium | Level 3 packet with research synthesis, registry, ADRs, checklist, and summary. |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If strict validation fails, repair only files inside this child packet. Do not edit runtime source, predecessor packets, parent arc docs, or git state from this research packet.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

| Node | Depends On | Feeds |
|------|------------|-------|
| Lifecycle evidence | Source reads and prior docs | Findings registry |
| Findings registry | Lifecycle evidence | Research synthesis and ADRs |
| Research synthesis | Findings registry | Decision record |
| Decision record | Layer evaluation | Follow-on Files-to-Change |
| Strict validation | Authored docs | Packet handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. Confirm current lifecycle with file:line citations.
2. Prove existing GC paths are ledger cleanup only.
3. Evaluate marginal coverage for B, D, and A.
4. Emit ADRs and follow-on Files-to-Change.
5. Run strict packet validation.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Status | Evidence |
|-----------|--------|----------|
| M1 lifecycle map | Complete | `research/iter-001.md` |
| M2 design synthesis | Complete | `research/research.md` |
| M3 ADR set | Complete | `decision-record.md` |
| M4 implementation handoff | Complete | `implementation-summary.md` |
| M5 strict validation | Complete | `implementation-summary.md` verification table |
<!-- /ANCHOR:milestones -->
