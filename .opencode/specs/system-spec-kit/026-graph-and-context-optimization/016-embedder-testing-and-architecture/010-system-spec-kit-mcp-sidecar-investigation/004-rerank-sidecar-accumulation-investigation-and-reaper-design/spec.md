---
title: "Feature Specification: Rerank-Sidecar Accumulation Investigation + Reaper Design"
description: "Investigate WHY rerank_sidecar uvicorn workers accumulate (25 stale processes consuming ~16 GB on this machine), design a three-layer reaper architecture (self-check + pre-flight reap + idle backstop) that guarantees every worker is killed when inactive or terminal closed."
trigger_phrases:
  - "rerank sidecar accumulation"
  - "rerank sidecar reaper"
  - "sidecar idle timeout"
  - "owner liveness gc"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/004-rerank-sidecar-accumulation-investigation-and-reaper-design"
    last_updated_at: "2026-05-23T09:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold phase parent lean trio for rerank-sidecar reaper investigation"
    next_safe_action: "Dispatch cli-codex gpt-5.5 xhigh fast on child 001 investigation"
    blockers: []
    key_files:
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py"
      - ".opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Three-layer reaper (B+D+A) — confirm via investigation or pick alternative?"
      - "Heartbeat interval default — 30/45/60s tradeoffs."
      - "Idle backstop threshold — 15/30/60 min default for last-request timeout."
      - "Identity-verified PID check — pid+create-timestamp+comm vs simpler heuristic."
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Rerank-Sidecar Accumulation Investigation + Reaper Design

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (010 arc) |
| **Predecessor** | `../001-deep-research-drift-and-simplification/` (identified the gap), `../003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode/` (hardened launcher F15+F49) |
| **Successor** | TBD: follow-on `010/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper/` (implementation packet) |
| **Handoff Criteria** | Investigation child produces ≥ 5 ADRs + Files-to-Change list ready for implementation packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The rerank-sidecar lifecycle leaks workers. Empirical evidence: on 2026-05-23 a single machine accumulated 25 stale `rerank_sidecar` uvicorn workers consuming ~16 GB RAM. Memory `project_ccc_search_orphan_root_cause` already named the architectural cause — `start_new_session=True` in `client.py:325` is an INTENTIONAL daemon detach for warm-model reuse, but no reaper exists to clean up sidecars whose owner-set has gone empty (terminal closed, ccc dispatch died, machine slept, etc.). Phase 014 (per the memory) shipped lease/cleanup; the orphan reaper is the remaining gap. Today the only cleanup is operator-driven SIGKILL — fragile and reactive.

### Purpose
Investigate the exact current lifecycle (file:line citations), confirm or refute the "no reaper exists" claim, evaluate a proposed three-layer architecture (sidecar self-check + launcher pre-flight reap + idle backstop), and emit ADRs + Files-to-Change list to drive a follow-on implementation packet. End state: every rerank-sidecar worker is killed automatically when (a) all its registered owners die or (b) it goes idle past a threshold.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Detailed planning, task breakdowns, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Code-evidenced map of the current rerank-sidecar spawn → register → serve → (no-)exit lifecycle.
- Empirical verification that no reaper path exists today (or surface any partial reaper found).
- Three-layer GC architecture proposal: (B) owner-liveness self-check inside `rerank_sidecar.py`, (D) pre-flight reap inside both launcher twins, (A) idle-timeout backstop.
- Identity-verified PID-liveness check design (pid + create-timestamp + comm) — protect against PID reuse.
- Tunable defaults: heartbeat interval, idle threshold, reap-on-launch policy.
- Ledger schema extension to record `(pid, create_timestamp, comm)` per owner.
- Parity-test contract: JS + Python twins must agree on identity-check semantics.
- Telemetry: reaper writes a forensic JSONL of every kill (which sidecar PID, why, evidence).
- Files-to-Change list ready for the follow-on implementation packet.

### Out of Scope
- Actual implementation of the reaper. Implementation lives in a follow-on packet (`010/005-fix-rerank-sidecar-accumulation-with-three-layer-reaper/`).
- Changes to the warm-model-reuse intent (`start_new_session=True` stays).
- launchd-based supervisor (rejected because of platform lock-in + per-config sidecar model mismatch).
- atexit / shell-signal cleanup (rejected because of multi-owner ledger model violation).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `<this-folder>/001-investigate-and-design-reaper-architecture/` | Create | Investigation child with research/ outputs + ADRs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 001 | `001-investigate-and-design-reaper-architecture/` | cli-codex GPT-5.5 xhigh fast investigation: map lifecycle, verify no reaper today, evaluate B+D+A design, emit ≥ 5 ADRs + Files-to-Change list | Planned |

### Phase Transition Rules

- Child 001 MUST pass `validate.sh --strict` before any follow-on implementation packet is scaffolded.
- ADRs in child 001's `decision-record.md` are binding inputs to the follow-on packet.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | follow-on impl packet | ≥ 5 ADRs + concrete Files-to-Change list + parity-test contract | Strict validate exit 0 on 001; ADRs ratified |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Confirm `start_new_session=True` is at `client.py:325` (memory claim — verify exact line in current codebase).
- Does the existing ledger have any reaper hook today that we missed?
- Should the heartbeat interval be uniform 45s or adaptive (faster during high churn, slower during steady state)?
- Identity-verified PID check: include `lstart` (long start time) or just `start` short form? Mac `ps` output formatting.
- Idle backstop threshold: 30 min vs 60 min — what's the empirical p95 gap between ccc search calls within an active session?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Investigation child**: `001-investigate-and-design-reaper-architecture/`
- **Parent Arc**: `../spec.md`
- **Memory note**: `project_ccc_search_orphan_root_cause` — pre-identified the gap.
- **Predecessor hardening**: `../003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode/` (F15 atomic write + F49 env allowlist).
- **F88 / F102 / F69 precedents**: structured liveness + Python parity + flock parity from arc 010/002.
