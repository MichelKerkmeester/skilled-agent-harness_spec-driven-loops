---
title: "Feature Specification: Canon self-enforcement (parent-hub hardening)"
description: "Make parent-hub canon enforcement class-based instead of fire-based: widen the CI gate to all four hubs, add a cross-language vocabulary-agreement battery, and defuse the next latent SQL-CHECK wedge — plus a DO-NOW hardening batch and a gate-adjacent tranche deferred behind the operator-owned advisor scorer lane."
trigger_phrases:
  - "canon self-enforcement plan"
  - "014 sk-doc phase 024"
  - "parent hub advisor hardening"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/024-canon-self-enforcement"
    last_updated_at: "2026-07-08T15:52:50Z"
    last_updated_by: "claude-opus"
    recent_action: "DO-NOW batch shipped+verified; packet closed (4/4 hubs, validate 0/0)"
    next_safe_action: "Gate-adjacent tranche awaits operator-opened scorer lane + 193-row re-baseline"
    blockers: []
    key_files:
      - ".github/workflows/routing-registry-drift.yml"
      - ".opencode/commands/doctor/scripts/parent-skill-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Canon self-enforcement (parent-hub hardening)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The parent-hub program (022 review, 023 remediation) restored a 4/4 canon-clean fleet and closed 18 findings. A Fable-5 pass then caught a P1 — the `sk-hub` family reached only 3 of 7 enum sites because a stale SQLite CHECK wedged the scan — which was fixed (`177b63c8dc`), plus P2s (`8497bf4b38`). All of that is shipped baseline.

This packet addresses the deeper pattern those incidents exposed: **canon enforcement is anchored to the last fire, not the failure class.** Truth is declared once (`mode-registry.json`) but hand-transcribed into roughly twelve consumer dialects (TS unions, SQL CHECKs, Python sets, JSON-schema enums, CJS arrays, a markdown template), and every automated guard watches deep-loop ONLY. The transport incident and the `sk-hub` incident were the same class of bug — a dialect drifted and nothing caught it.

**Key decisions**: lead with the foundational trio (widen the CI gate + a cross-language vocabulary battery + defuse the next latent CHECK) because together they would have prevented BOTH incidents (ADR-001); partition the work into DO-NOW vs a GATE-ADJACENT tranche that must sequence behind the operator-owned advisor scorer lane and its 193-row parity re-baseline (ADR-002); route three operator escalations — `/doc:quality` fix-vs-ratchet (ADR-003), the zombie/ghost graph nodes (ADR-004), and the four-hub family question (ADR-005).

**Critical dependencies**: the four hub `mode-registry.json` files, `parent-skill-check.cjs`, the advisor skill-graph (TS + Python), and — for the gated tranche only — the operator opening the scorer lane.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft (plan; DO-NOW ready, gate-adjacent tranche deferred) |
| **Created** | 2026-07-07 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Packet** | `sk-doc/015-sk-doc-parent` |
| **Depends On** | `022-parent-skill-logic-review/`, `023-parent-hub-remediation/` |
| **Predecessor** | `023-parent-hub-remediation/` |
| **Successor** | none (spawns per-work-unit execution) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Canon is declared once in each hub's `mode-registry.json` and then hand-copied into ~12 consumer dialects that must agree but are only kept in sync by discipline. Two verified proofs that this fails: (1) the `sk-hub` family was added to the TS union but a stale SQLite `CHECK(family IN …)` rejected it and aborted the whole scan; (2) the CI drift gate (`.github/workflows/routing-registry-drift.yml`) path-filters only `deep-loop-workflows/mode-registry.json` (`:11`,`:18`) and `system-skill-advisor/mcp_server/**` — so a change to any of the OTHER three hub registries (sk-code, sk-design, sk-doc) triggers no gate at all. The checker's default target is deep-loop (`parent-skill-check.cjs:90`), and its rule-4a drift-guard existence check resolves repo-relative paths against `process.cwd()` (`:599`,`:608`,`:194`), so it false-FAILs from a non-root CWD. The next latent twin is already visible: the `edge_type` column still carries `CHECK(edge_type IN …)` (`skill-graph-db.ts:209`), the exact shape of the family CHECK that just wedged.

### Purpose
Convert canon enforcement from fire-based to class-based: one CI gate that watches ALL hub registries via a glob (so a fifth hub auto-enrolls), one cross-language battery that proves every dialect agrees, and a defused `edge_type` CHECK using the same self-heal migration that fixed `family`. Around that foundational trio, land a DO-NOW hardening batch (command-binding gate, doctor freshness panel, checker fixture harness, discovery parity, description.json guard, a small cluster). A separate GATE-ADJACENT tranche (the `derived.entities` code fix, the vocab-sync prefix bug, and the dead-id + corpus re-baseline) is planned but deferred behind the operator opening the advisor scorer lane, each with a gate-free PREP step so the post-gate batch is mechanical.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A sequenced, phased plan for nine DO-NOW work units (WU1–WU7, WU9, WU12) leading with the foundational trio WU1+WU2+WU3.
- Three GATE-ADJACENT work units (WU8, WU10, WU11), each with a gate-free PREP step and an explicit gate: the operator-owned advisor scorer lane going quiet plus its 193-row parity re-baseline.
- Per-work-unit verification gates (a new vitest green; `parent-skill-check.cjs` stays 4/4; `validate.sh --strict`).
- The three operator escalations captured as decision forks with recommended defaults.

### Out of Scope
- Executing any code (this phase authors the plan only; each WU executes once ready or once its gate opens).
- Editing any hub / checker / advisor / scorer source in this packet.
- The operator-gated canonical reindex (the doctor panel only REPORTS the stale graph; it never self-heals).
- Re-pointing the migrated 999 parent's stale `125` frontmatter on the pre-022 phases (operator's separate migration).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `024-canon-self-enforcement/plan.md` | Add | The twelve-work-unit program, five phases, gates |
| `024-canon-self-enforcement/{spec,tasks,checklist,decision-record,implementation-summary}.md` | Add | Level-3 packet docs |
| `024-canon-self-enforcement/{description,graph-metadata}.json` | Add | Generated metadata |
| `015-sk-doc-parent/graph-metadata.json` | Modify | Enroll 024 (and the missing 022/023) as children; set last_active |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every council opportunity (1–12) maps to a work unit with a fix approach and real file:line anchors | plan.md §3 lists WU1–WU12; no orphan opportunity |
| REQ-002 | The DO-NOW work is sequenced, leading with the foundational trio | Phase 2 = WU1+WU2+WU3; Phase 3 = the DO-NOW batch; ordering + dependencies named |
| REQ-003 | The gate constraint is explicit | GATE-ADJACENT units (WU8/WU10/WU11) name the advisor-scorer-lane + 193-row re-baseline gate; each has a gate-free PREP |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Each work unit carries a verification gate | plan.md §5 gives each WU a new-vitest-green + checker-4/4 + validate gate |
| REQ-005 | The three operator escalations are surfaced with recommended defaults | decision-record ADR-003/004/005 cover `/doc:quality`, zombie nodes, sk-hub family |
| REQ-006 | This plan folder passes strict validation | `validate.sh --strict` exits 0 for `024-canon-self-enforcement/` |
| REQ-007 | The foundational trio is justified against BOTH prior incidents | decision-record ADR-001 names how WU1+WU2+WU3 would have caught the transport AND `sk-hub` drifts |
| REQ-008 | The two deliberate read-only scorer subsets are flagged, not asserted-equal | WU2 subset-checks `skill_advisor.py:242` + `graph-causal.ts:28-34`; neither is edited |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: plan.md decomposes all twelve council opportunities into work units with fix approach, real anchors, and a gate.
- **SC-002**: The foundational trio (WU1+WU2+WU3) leads Phase 2 and is justified as the pair that would have prevented both incidents.
- **SC-003**: DO-NOW / GATE-ADJACENT / OPERATOR-DECISION are cleanly partitioned; the gate is named in the decision-record.
- **SC-004**: `validate.sh --strict` passes (exit 0) for this folder; the parent enrolls 024.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A gate-adjacent unit is executed early and perturbs the scorer re-baseline | Corrupt 193-row parity | Hard gate: WU8-fix/WU10/WU11 wait for the operator to open the lane; PREP only until then |
| Risk | Widening the CI glob enrolls a not-yet-canon hub and reds CI | Blocked merges | `PARENT_HUB_CHECK_STRICT=0` opt-out per hub during scaffold; enroll only the four canon-clean hubs first |
| Risk | The vocab battery over-asserts and flags the two deliberate read-only subsets | False failures | WU2 explicitly flag-don't-edit `skill_advisor.py:242` + `graph-causal.ts:28-34` |
| Dependency | Operator-owned advisor scorer lane | Blocks WU8-fix/WU10/WU11 | Coordinate; PREP artifacts make the post-gate batch mechanical |
| Dependency | Operator decisions on three forks | Blocks WU-scoped edits | Each fork carries a recommended default |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The cross-language vocab battery (WU2) must be dependency-light and run in the existing CI vitest step (no native/ML deps), mirroring the current drift-guard gate.
- **NFR-P02**: The doctor freshness panel (WU5) is read-only and must not open the SQLite DB for writes.

### Security
- **NFR-S01**: No work unit weakens the surface-packet read-only tool contract; the command-binding gate (WU4) only reads the command tree.
- **NFR-S02**: The checker CWD fix (WU1) must resolve paths against a computed repo root, never an attacker-influenced env var.

### Reliability
- **NFR-R01**: The `edge_type` CHECK defusal (WU3) must be idempotent and self-healing on an already-migrated DB, exactly like the `family` migration (`skill-graph-db.ts:372-422`).
- **NFR-R02**: Every DO-NOW unit keeps `parent-skill-check.cjs` at 4/4 (0 warnings) across all four hubs.

## 8. EDGE CASES

### Data Boundaries
- **Fifth hub added**: the CI glob `skills/*/mode-registry.json` and the vocab-battery glob must auto-enroll it without a code edit (the whole point).
- **A hub with no lexical modes**: rule 4a must stay INFO ("no drift-guard required"), not FAIL, after the CWD fix.

### Error Scenarios
- **Non-root CWD**: `parent-skill-check.cjs` must resolve `.opencode/...` against the repo root, not `process.cwd()` (today it false-FAILs 4a and can't find the target dir).
- **Dead command id in a registry**: WU4's gate must FAIL on `/doc:quality` (no `.opencode/commands/doc/`) unless the id is explicitly allowlisted (quarantining the WU5/WU11 dead ids).

## 9. COMPLEXITY ASSESSMENT

High cross-cutting surface, low per-edit risk. The trio touches CI config, one new vitest, and one idempotent migration — each individually small but spanning ~12 dialects. Complexity comes from BREADTH (many mirrors) and from the gate coordination, not from algorithmic depth. The gate-adjacent tranche is the only genuinely risky work (it shifts advisor scoring), which is exactly why it is partitioned out and deferred.

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Early gate-adjacent edit corrupts the 193-row re-baseline | H | L | Hard gate + PREP-only until the operator opens the lane |
| R-002 | CI glob reds on a scaffolding hub | M | M | Per-hub `PARENT_HUB_CHECK_STRICT=0` opt-out |
| R-003 | Vocab battery false-positives on the two gated read-only subsets | M | M | Flag-don't-edit `skill_advisor.py:242` + `graph-causal.ts:28-34` |
| R-004 | Concurrent branch churn collides with edits | M | H | 0-leak scoped commits per WU |

## 11. USER STORIES

### US-001: Canon guardian (Priority: P0)
**As a** maintainer of the parent-hub fleet, **I want** every hub registry watched by one CI gate and one vocabulary battery, **so that** a dialect drift is caught mechanically instead of by the next reviewer.

**Acceptance Criteria**:
1. Given a change to any of the four hub `mode-registry.json` files, when CI runs, then the routing-registry drift gate executes (today only deep-loop triggers it).
2. Given a family/edge-type/routingClass/packetKind added to one dialect and not another, when the vocab battery runs, then it fails naming the out-of-sync mirror.

### US-002: Release engineer (Priority: P1)
**As a** release engineer, **I want** the checker to run correctly from any CWD and to be covered by golden+mutant fixtures, **so that** I can trust its 4/4 result and its rules do not silently rot.

**Acceptance Criteria**:
1. Given the checker is invoked from a non-root CWD, when it evaluates rule 4a, then it resolves paths against the repo root and does not false-FAIL.
2. Given a mutated fixture hub, when the fixture harness runs, then the checker flags the injected defect.

## 12. OPEN QUESTIONS

- Three operator forks (see plan.md §6 and decision-record ADR-003/004/005) shape WU4/WU5/WU9/WU12 and the gated tranche; the DO-NOW trio can proceed on defaults.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Source review**: See `../022-parent-skill-logic-review/review-report.md`
- **Baseline remediation**: See `../023-parent-hub-remediation/`
