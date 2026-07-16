---
title: "Feature Specification: Fix Rerank-Sidecar Accumulation With Three-Layer Reaper"
description: "Phase parent for implementing the three-layer reaper (Layer B sidecar self-check + Layer D launcher pre-flight reap + Layer A idle backstop) per 010/004/001's 7 ADRs. Closes the rerank-sidecar accumulation memory leak."
trigger_phrases:
  - "fix rerank sidecar reaper"
  - "implement three-layer reaper"
  - "rerank sidecar gc implementation"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper"
    last_updated_at: "2026-05-23T10:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold phase parent + child 001 for three-layer reaper implementation"
    next_safe_action: "Dispatch cli-codex gpt-5.5 high fast on child 001 ledger v2 + identity-verified PID"
    blockers: []
    key_files:
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/decision-record.md"
      - ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Fix Rerank-Sidecar Accumulation With Three-Layer Reaper

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Shipped then removed |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (010 arc) |
| **Predecessor** | `../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/` (7 ADRs + Files-to-Change) |
| **Handoff Criteria** | All 4 phase children pass independently; integration smoke proves zero accumulation across a 4-hour idle window |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Rerank-sidecar uvicorn workers accumulate without bound: 25 stale processes consuming ~16 GB RAM observed on 2026-05-23. Investigation packet 010/004/001 confirmed the architectural cause (intentional warm-model detach with no reaper) and produced a binding three-layer design + 7 ADRs + Files-to-Change contract for 11 files. This packet implements that design.

### Purpose
Implement the three-layer reaper (B sidecar self-check + D launcher pre-flight reap + A idle backstop) so every rerank-sidecar worker is killed automatically when (a) all its registered owners die OR (b) it goes idle past threshold. Honor the predecessor packet's ADRs verbatim. Maintain JS + Python twin parity.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Detailed planning, task breakdowns, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ledger v2 schema extension recording `(pid, create_timestamp, comm)` per owner (sidecar_ledger.py).
- Identity-verified PID liveness check (`kill(0)` + `ps -p PID -o lstart= -o comm=`) on both twins.
- Layer B: owner-liveness self-check + in-flight request gate inside rerank_sidecar.py.
- Layer D: pre-flight reap in both launcher twins (ensure-rerank-sidecar.cjs + ensure_rerank_sidecar.py).
- Layer A: idle-timeout backstop (30 min default) + manual-debug opt-out.
- Telemetry forensic log `sidecar-reaper.jsonl` for every reap.
- Cross-runtime fixture matrix (JSON file consumed by both JS + Python tests) for parity.
- Env-knob plumbing through start.sh allowlist.
- SKILL.md + README.md updates.

### Out of Scope
- Changing `start_new_session=True` / `detached: true` (KEEP — warm-model reuse intent).
- Migrating to launchd or atexit alternatives (rejected by predecessor packet).
- Touching deep-loop-runtime, sidecar-client.ts, sidecar-worker.ts, execution-router.ts (arc 010/003 owns those).
- Adding new ADRs — the 7 ADRs in 010/004/001 are binding; only refine if implementation discovers an ADR is wrong.

### Files to Change (per 010/004/001 Files-to-Change contract)

| File Path | Phase | Change Type |
|-----------|-------|-------------|
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | 001 | Modify (v2 schema + identity helpers) |
| `.opencode/skills/system-rerank-sidecar/tests/test_sidecar_ledger.py` | 001 | Add (v2 + identity tests) |
| `.opencode/skills/system-rerank-sidecar/tests/fixtures/reaper-ledger-cases.json` | 001 | Add (shared fixtures) |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | 002 | Modify (Layer B + Layer A) |
| `.opencode/skills/system-rerank-sidecar/tests/test_rerank_sidecar.py` | 002 | Modify (reaper + idle + in-flight tests) |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | 003 | Modify (Layer D + owner identity register) |
| `.opencode/bin/lib/ensure-rerank-sidecar.vitest.ts` | 003 | Modify (parity fixtures consumption) |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | 003 | Modify (Layer D Python mirror) |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | 004 | Modify (env allowlist for reaper knobs) |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | 004 | Modify (reaper docs) |
| `.opencode/skills/system-rerank-sidecar/README.md` | 004 | Modify (operator behavior docs) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-implement-ledger-v2-schema-and-identity-verified-pid/` | sidecar_ledger.py v2 schema (pid+create_timestamp+comm) + identity-verified liveness helpers + cross-runtime fixture matrix + Python unit tests | Completed |
| 002 | `002-implement-layer-b-sidecar-self-check-and-in-flight-gate/` | rerank_sidecar.py background reaper task + in-flight request gate + Layer A idle backstop + telemetry JSONL + Python tests | Completed |
| 003 | `003-implement-layer-d-launcher-pre-flight-reap-and-parity-fixtures/` | ensure-rerank-sidecar.cjs + .py pre-flight reap + owner identity register + JS/Python parity tests consuming shared fixtures | Completed |
| 004 | `004-implement-env-knobs-and-skill-docs/` | start.sh env allowlist + SKILL.md + README.md + integration smoke test | Completed |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` independently before next starts.
- 001 ledger v2 must be backward-compatible with v1 ledger rows (legacy migration).
- 002 must NOT depend on 003 (sidecar self-check is independent of launcher reap).
- 003 must read identity-check helpers from 001's ledger module — no helper duplication.
- 004 ships docs + integration smoke ONLY after layers B/D/A all work in isolation.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | ledger v2 schema + identity helpers + fixtures green | pytest test_sidecar_ledger.py exit 0; strict validate |
| 002 | 003 | sidecar self-check + idle backstop + telemetry green | pytest test_rerank_sidecar.py exit 0; strict validate |
| 003 | 004 | launcher pre-flight reap (both twins) parity-tested | vitest + pytest parity green; strict validate |
| 004 | done | docs + integration smoke (zero accumulation over 4h idle); arc 010 re-validate | parent validate; smoke run |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the integration smoke test (phase 004) run as a CI job or operator-triggered runbook step?
- Telemetry JSONL location — `~/Library/Logs/spec-kit/sidecar-reaper.jsonl` (macOS standard) or packet-local? Default: macOS Logs dir.
- Env knob naming convention: `RERANK_SIDECAR_REAPER_*` confirmed per ADR-006 — verify implementation consistency.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md.
- **Predecessor (binding contract)**: `../004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture/{decision-record.md,implementation-summary.md,research/research.md}`.
- **Parent arc**: `../spec.md`.
- **Memory note**: `project_ccc_search_orphan_root_cause` — this packet closes that explicit gap.
