---
title: "Feature Specification: deterministic enforcement for the context-loading contract"
description: "Level-1 follow-up acting on the 035 benchmark: adds a deterministic proof-of-application gate (proof_check.py) so the contract is enforced for the orchestrator's own path, adds APCA-W3 Lc to the contrast checker, and wires both calculators into the contract's HARD GATES and the proof-of-application card. Also records the environment fix that unblocked semantic memory indexing (better-sqlite3 rebuild + reindex of packets 029/030/035/036)."
trigger_phrases:
  - "context contract enforcement"
  - "proof check gate"
  - "apca contrast checker"
  - "design contract deterministic gate"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/037-design-context-enforcement"
    last_updated_at: "2026-06-28T07:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added proof_check.py gate + APCA to contrast_check.py + wiring; fixed memory indexing"
    next_safe_action: "Optional: wire the contract into per-mode router auto-load (remaining F-004 architectural piece)"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
      - "../035-design-context-benchmark/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "build-154-037-design-context-enforcement"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The benchmark's weakest link (weak-model contrast arithmetic) is closed by a calculator; the orchestrator-path gap is closed by a deterministic proof gate the delivery step runs"
      - "Per-mode executable router auto-load of the contract remains the only deferred F-004 piece (architectural, optional per research §17)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: deterministic enforcement for the context-loading contract

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The 035 review found the contract is advisory for the orchestrator's own path (F-004) and the benchmark found a weak model can run the contrast inventory but mis-judge a ratio. This follow-up closes both with calculators: a deterministic proof-of-application gate (`shared/scripts/proof_check.py`) the delivery/CI step runs, and APCA-W3 Lc added to `design-foundations/scripts/contrast_check.py`. Both are wired into the contract's HARD GATES and the proof card. It also records the environment fix that unblocked semantic memory indexing for the whole arc.

**Key Decisions**: enforce via standalone calculators (not per-mode router edits — that architectural piece stays deferred per research §17); both gates exit non-zero on failure so any build step can gate on them.

**Critical Dependencies**: the 035 review/benchmark findings; the live contract + cards + worksheet.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../036-design-context-hardening/spec.md |
| **Type** | Enforcement follow-up (acts on 035 review/benchmark) |
| **Handoff Criteria** | `proof_check.py` gates the proof card (PASS contract runs, FAIL baseline); `contrast_check.py` reports APCA Lc; both wired into the contract + card; memory indexing restored for 029/030/035/036 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The contract works when handed to a delegate (035 benchmark) but is not enforced for the orchestrator's own path, and a weak model's contrast arithmetic can mislabel a fail as a pass. Prose alone does not fix either. Separately, semantic memory indexing was blocked by a better-sqlite3 ABI mismatch, so the arc was not searchable.

### Purpose
Give the two failure-prone gates a deterministic calculator, wire them into the contract, and restore memory indexing.

> **Phase note:** acts on the 035 review/benchmark; no new design direction.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `shared/scripts/proof_check.py` — deterministic proof-of-application gate (4 fields + READY verdict; exits non-zero).
- APCA-W3 Lc in `design-foundations/scripts/contrast_check.py`.
- Wiring both into `context_loading_contract.md` §5 HARD GATES and `proof_of_application_card.md`.
- Environment fix: `better-sqlite3` rebuild + reindex of the arc packets (recorded, not a code deliverable).

### Out of Scope
- Per-mode executable router auto-load of the contract (remaining F-004 architectural piece, deferred per research §17).
- Any new design capability.

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-design/shared/scripts/proof_check.py` | Created | Deterministic proof gate |
| `sk-design/design-foundations/scripts/contrast_check.py` | Edited | Add APCA-W3 Lc |
| `sk-design/shared/context_loading_contract.md` | Edited | Deterministic-enforcement note |
| `sk-design/shared/assets/proof_of_application_card.md` | Edited | Gate footer |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Wrapper |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The proof gate is deterministic + correct | `proof_check.py` PASSES the contract benchmark runs and FAILS the baseline runs |
| REQ-002 | The contrast checker reports APCA | `contrast_check.py` outputs APCA Lc with WCAG ratio; both scripts compile |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both gates are wired | The contract §5 and the proof card reference the two scripts |
| REQ-004 | Memory indexing restored | The arc packets (029/030/035/036) are present in `memory_index` (BM25/FTS searchable) |
| REQ-005 | No regressions | Edited docs pass sk-doc; scripts compile |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `proof_check.py` exits 0 on minimax-B/kimi-B and non-zero on kimi-A; `contrast_check.py` reports APCA Lc (e.g. `#787878`/white Lc 70.6, `#0a1a2f`/white Lc 104.2).
- **SC-002**: both calculators are referenced from the contract + card; the 029/030/035/036 packets are indexed (18 rows in `memory_index`).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | APCA implemented subtly wrong | Misleading Lc | Implemented per APCA-W3 0.1.9; reported alongside WCAG (the contract's target), not replacing it |
| Risk | Proof gate false-positive on unchecked labels | Wrong verdict | Checkbox-aware verdict regex; smoke-tested against all four benchmark runs |
| Risk | better-sqlite3 rebuild breaks other tooling | Index/daemon failure | Rebuilt against the active node (v22.23.1 / MODULE_VERSION 127); daemon initialized cleanly afterward |
| Dependency | 035 review/benchmark | No basis for the work | Present + cited |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

Enforcement is now executable for the delivery path. The one remaining F-004 piece — wiring the contract into the per-mode smart-router RESOURCE_MAPs so the router auto-loads it on design/build intents — stays deferred: it is architectural, edits the router blocks, and research §17 left it open. The standalone calculators cover the enforcement need without that risk.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Findings source**: `../035-design-context-benchmark/review/review-report.md`, `../035-design-context-benchmark/benchmark-matrix.md`
- **Gates**: `.opencode/skills/sk-design/shared/scripts/proof_check.py`, `.opencode/skills/sk-design/design-foundations/scripts/contrast_check.py`
