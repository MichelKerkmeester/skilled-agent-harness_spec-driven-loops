---
title: "Feature Specification: Phase 1: deep-loop-fanout-reliability [template:level_1/spec.md]"
description: "Fan-out CLI lineages mis-reported failed and timed-out runs as successes, ran serially despite a concurrency cap, ignored per-lineage iteration caps, and emitted an out-of-enum service_tier. This phase fixes the fan-out worker, prompt, and codex dispatch so failures fail, lineages run concurrently, and emitted values stay valid."
trigger_phrases:
  - "fanout reliability"
  - "deep loop fanout"
  - "lineage failure exit code"
  - "fanout concurrency"
  - "service_tier enum"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/038-deep-loop-runtime/010-deep-loop-fanout-reliability"
    last_updated_at: "2026-06-04T23:10:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Implemented A1-A7 fan-out reliability fixes and regression tests"
    next_safe_action: "None remaining, phase complete"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts"
      - ".opencode/skills/system-code-graph/mcp_server/core/config.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-013-001-deep-loop-fanout-reliability"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Do review lineages write iteration artifacts into lineageDir? Yes — so A5 keeps workspace-write and documents the gap instead of forcing read-only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: deep-loop-fanout-reliability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-retrieval-scope-hardening |
| **Handoff Criteria** | Fan-out failures drive non-zero exit, lineages run concurrently, emitted values stay in-enum, tests + typecheck green |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the comprehensive audit remediation specification.

**Scope Boundary**: The deep-loop fan-out runtime (`deep-loop-runtime/**`) plus comment-only hygiene fixes in `system-code-graph/mcp_server/**`. `context-server.ts` is owned by another cluster and is NOT touched.

**Dependencies**:
- The fan-out pool primitive (`settleItem` / `buildPoolSummary`) is shared with the council dispatcher and contract-tested; its semantics stay frozen. All behavior fixes live in the worker.

**Deliverables**:
- Failure-aware fan-out worker (non-zero exit / timeout now counts as a failure).
- Non-blocking async spawn so lineages run concurrently up to the cap.
- Per-lineage iteration cap threaded into the loop prompt.
- Codex dispatch that omits `service_tier` when unset (no out-of-enum literal).
- Documented sandbox-default rationale for review lineages.
- Accurate SKILL.md script inventory.
- Comment-hygiene cleanup of perishable phase/ADR/packet labels.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The deep-loop fan-out runner reported failed and timed-out CLI lineages as successes (the worker returned a result object instead of throwing, so the pool counted every completed worker as fulfilled and the process exited 0). It also serialized lineages because the worker used a blocking `spawnSync`, defeating the concurrency cap; ignored the per-lineage `iterations` cap (it only sized the timeout); and emitted `service_tier=default`, a value outside the validated tier enum.

### Purpose
Make fan-out failures actually fail, run lineages concurrently up to the cap, honor per-lineage iteration caps, and keep every emitted CLI value inside its validated enum, without changing the shared pool contract.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Worker-level failure detection and async spawn in `fanout-run.cjs`.
- Iteration-cap threading and codex `service_tier` omission in `fanout-run.cjs`.
- Documentation note for the review sandbox default in `fanout-run.cjs`.
- SKILL.md script-inventory correction.
- Comment-hygiene edits in `fanout-pool.cjs`, `code-graph-tools.ts`, and `core/config.ts`.
- Regression tests in `fanout-run.vitest.ts`.

### Out of Scope
- `fanout-pool.cjs` `settleItem` / `buildPoolSummary` semantics - shared with the council dispatcher and contract-tested; only comment edits allowed.
- `context-server.ts` - owned by a different remediation cluster.
- Codex CLI logic for model / reasoningEffort / sandbox - untouched.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs | Modify | A1 throw-on-failure, A2 async spawn, A3 iteration cap, A4 service_tier omission, A5 sandbox note |
| .opencode/skills/deep-loop-runtime/scripts/fanout-pool.cjs | Modify | A7 comment hygiene (two packet labels) |
| .opencode/skills/deep-loop-runtime/SKILL.md | Modify | A6 script count + fan-out entry points |
| .opencode/skills/deep-loop-runtime/tests/unit/fanout-run.vitest.ts | Modify | A1/A2/A3/A4 regression tests |
| .opencode/skills/system-code-graph/mcp_server/tools/code-graph-tools.ts | Modify | A7 comment hygiene (SLOT placeholders) |
| .opencode/skills/system-code-graph/mcp_server/core/config.ts | Modify | A7 comment hygiene (ADR ids) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A1: A non-zero CLI exit or a timeout in a fan-out lineage MUST be counted as a failure | **Given** a lineage whose CLI exits non-zero or times out, **When** the fan-out run completes, **Then** the worker throws after the salvage sweep, the summary records `failed >= 1`, and the process exits 2 (some failed) or 3 (all failed) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A2: Lineages MUST run concurrently up to the configured cap, not serially | **Given** two ~1s lineages with concurrency 2, **When** the run executes, **Then** wall-clock time is roughly 1s (parallel) and stdin input / timeout-SIGTERM semantics are preserved |
| REQ-003 | A3: A positive per-lineage `iterations` MUST cap the subprocess loop, not only the timeout | **Given** a lineage with `iterations` set, **When** the loop prompt is built, **Then** it includes `config.maxIterations` and a "whichever comes first" stop clause; **Given** `iterations` is null, **Then** the prompt omits the cap |
| REQ-004 | A4: The codex dispatch MUST NOT emit a `service_tier` value outside the validated enum | **Given** `serviceTier` is unset, **When** codex args are built, **Then** no `service_tier` pair is emitted; **Given** `serviceTier='standard'`, **Then** `service_tier=standard` is emitted |
| REQ-005 | A5: Review lineages MUST keep write capability for their own iteration artifacts | **Given** a review lineage with no explicit sandboxMode, **When** sandbox is resolved, **Then** workspace-write is retained and the rationale is documented (review writes iteration artifacts into lineageDir, so read-only would break them) |
| REQ-006 | A6: SKILL.md MUST report the real `scripts/` inventory | **Given** the shipped `scripts/` directory, **When** SKILL.md is read, **Then** it states 8 `.cjs` files and names the fan-out entry points |
| REQ-007 | A7: Shipped code comments MUST NOT carry perishable phase / ADR / packet labels | **Given** the cited comments, **When** grep runs for `PHASE-0\|ADR-0\|packet-1\|027/00`, **Then** there are zero hits and the durable WHY is preserved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A failed or timed-out lineage yields a non-zero process exit and `summary.failed >= 1`.
- **SC-002**: Two ~1s lineages with concurrency 2 finish in roughly 1s; `npx tsc --noEmit` for code-graph is clean; all three vitest suites pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared `settleItem` / `buildPoolSummary` (council dispatcher) | Changing pool semantics would break the council contract | Confine all fixes to the worker; leave pool primitive untouched |
| Risk | Async spawn must preserve stdin input + SIGTERM-on-timeout | A1 timeout detection breaks if signal is lost | `runLineageProcess` sets `signal='SIGTERM'` on timeout and writes stdin via the child pipe |
| Risk | Review read-only default would block legitimate iteration writes | Review lineages could not write their own artifacts | Keep workspace-write for review; document the boundary is prompt-enforced |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The A5 sandbox question (do review lineages write into lineageDir?) was resolved: yes, so workspace-write stays and the gap is documented.
- None outstanding for A7 placeholder slots: neutralized to durable "reserved slot" comments rather than deleted, preserving the anchors.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
