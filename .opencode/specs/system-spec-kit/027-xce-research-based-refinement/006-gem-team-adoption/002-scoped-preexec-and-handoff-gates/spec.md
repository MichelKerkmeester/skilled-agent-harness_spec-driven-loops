---
title: "002 — Scoped Pre-Execution & Handoff Gates"
description: "Add three narrow, predicate-guarded gates that harden the highest-risk agent transitions (debug→implement handoff, API/schema/integration edits, medium/high work) without adding universal ceremony."
trigger_phrases:
  - "027 phase 006/002"
  - "scoped preexec gates"
  - "debug handoff schema"
  - "boundary contract-first"
  - "pre-mortem field"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/002-scoped-preexec-and-handoff-gates"
    last_updated_at: "2026-06-10T05:18:20Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Landed scoped agent gates"
    next_safe_action: "Report out-of-scope skill/scaffold items"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-002-scoped-preexec-gates-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "007 critic + 009 synthesis: ship as 3 scoped advisory gates, never universal ceremony"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 002 — Scoped Pre-Execution & Handoff Gates

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

Phase 002 is proposal P2 from the phase-007 Gem-team adoption study (`research/007-gem-team-adoption-matrix/sub-packet-proposals.md`), confirmed FEASIBLE and FULLY ADDITIVE by the phase-009 integration synthesis (`research/009-gem-team-integration-impact/research.md`). It adds three NARROW, optional gates that each fire ONLY in their specific high-risk condition — no universal ceremony, no new agents, no governance/validator change.

The three gates harden seams the spec-kit currently handles in prose only:
- A typed debug→implement handoff schema (`root_cause` / `target_files` / `fix_recommendations` / `confidence`) so a diagnosis crossing agents is machine-checkable before a fix is attempted.
- A boundary contract-first check in `sk-code` that, for API/schema/integration changes ONLY, forces identifying a contract / boundary test / executable acceptance check before production edits.
- A pre-mortem field (risk level + top 2-3 failure modes + assumptions) in the `@orchestrate` task format, required for medium/high complexity work ONLY.

Each gate is guarded by a predicate defined in `@orchestrate`; when the predicate is false the gate SKIPS entirely. The debug-handoff schema is framed honestly as a DOWNSCALE of an existing Gem orchestrator mechanism (Gem already machine-checks `debugger_diagnosis`), not a novel invention — P2 deliberately adopts a narrower, advisory version.

Source context:
- Proposal: `research/007-gem-team-adoption-matrix/sub-packet-proposals.md` § Proposal P2.
- Integration matrix + rollout: `research/009-gem-team-integration-impact/research.md` §2, §4 (Wave 2), iteration 002 detail.

> **Cross-phase coordination — shared `sk-code/SKILL.md` edit surface (read before implementing Gate B).** Gate B (boundary contract-first) edits `sk-code/SKILL.md`. The future sibling 027 child `009-peck-verification-discipline` (from `research/006-peck-source-deep-mining`) ALSO edits `sk-code/SKILL.md`, adding T5 *escalation* gates. These are **distinct rules on different predicates** — this packet: boundary contract-first on `change_class ∈ {api,schema,integration}`; peck: root-cause / escalation predicates — so **coordinate the edit window, do not merge**. Whoever lands first records the line ranges it edits; the second references them. (This supersedes the "possible P2 ↔ peck-009 merge" flag in `research/007-gem-team-adoption-matrix/sub-packet-proposals.md` — it is a coordinate-edit-window, not a merge.)

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented with scope exceptions |
| **Parent Packet** | `027-xce-research-based-refinement/006-gem-team-adoption` |
| **Source** | `research/007-gem-team-adoption-matrix/sub-packet-proposals.md` § P2; `research/009-gem-team-integration-impact/research.md` §2, §4 |
| **Depends on** | `001-typed-agent-io-adapter` (reuses its typed envelope for the `confidence`/`failure_type` fields) |
| **Rollout wave** | Wave 2 — highest-risk transition (after 001's substrate lands) |
| **LOC budget** | ~150-220 (docs/contract + checklist + scaffold flags) |
| **Branch** | `main` |
| **Created** | 2026-06-06 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The spec-kit's highest-risk agent transitions are governed by prose, not machine-checkable discipline. When a `@debug` diagnosis crosses to a `@code` implementer, the handoff is free-form: `@code` can attempt a "surgical" fix off an under-specified diagnosis with no required `root_cause`/`target_files`/`fix_recommendations`/`confidence`, so a low-confidence or incomplete diagnosis silently becomes a guessed fix. Separately, API / schema / integration changes — where a missing contract is most expensive — have no point at which a contract, boundary test, or executable acceptance check must be identified before production edits. And medium/high complexity work is dispatched with no structured forecast of how it could fail.

Phase-007's adversarial round and completeness critic converged these three seams into one scoped packet, and phase-009 confirmed every field can be additive and optional with zero governance or validator change. The risk to avoid is the opposite failure: making any of these gates universal would impose ceremony on low/typo/docs work and violate the proposal's intent ("the spec-kit needs polish, not new subsystems").

### Purpose

Add three predicate-guarded gates so the highest-risk transitions carry a small machine-checkable discipline, while low-risk work stays completely untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Each gate is guarded by a predicate that `@orchestrate` evaluates at dispatch time; when the predicate is false, the gate SKIPS.

1. **Gate A — Typed debug-handoff schema** (predicate: `diagnosis_crosses_agents`, i.e. a `@debug` diagnosis is being handed to a `@code` implementer)
   - `@debug` emits a typed handoff carrying `root_cause`, `target_files`, `fix_recommendations`, and `confidence` (reusing 001's envelope `confidence`/`failure_type` fields).
   - `@orchestrate` preserves the typed handoff when it dispatches `@code`.
   - `@code` receiver-validates the handoff BEFORE a diagnosis-based surgical fix. Missing required fields ⇒ `@code` returns BLOCKED / LOW_CONFIDENCE rather than a guessed fix.
   - `@debug`'s existing 5-phase root-cause method stays UNTOUCHED — only typed fields are added.

2. **Gate B — Boundary contract-first check** (predicate: `change_class ∈ {api, schema, integration}`)
   - `sk-code` requires a contract / boundary test / executable acceptance check be identified before production edits, for API/schema/integration changes ONLY.
   - This is NOT universal TDD; ordinary edits do not trigger it.

3. **Gate C — Pre-mortem field** (predicate: `complexity ∈ {medium, high}`)
   - The `@orchestrate` task format gains a short pre-mortem field: risk level + top 2-3 failure modes + assumptions, reusing existing Risk/fallback framing.
   - Required for medium/high work ONLY; low-complexity work omits it.

4. **Honest framing + backward compatibility**
   - Gate A is documented as a DOWNSCALE of Gem's existing orchestrator `debugger_diagnosis` machine-check, not a novel invention.
   - Legacy `debug-delegation.md` files outside the new debug→implement crossing WARN, not fail.

### Out of Scope

- Universal TDD — Gate B is scoped to API/schema/integration only.
- Universal pre-mortem — Gate C is scoped to medium/high only.
- Making `@debug` auto-dispatch — it stays user-opt-in (the scaffold/workflow never auto-routes to `@debug`).
- Replacing or re-deriving `@debug`'s 5-phase method — only typed fields are appended.
- A full Gem-style failure taxonomy — `failure_type` is reused from 001, not expanded here.
- Adding raw `spec_drift`/advisory fields to the continuity schema — that is P3 / `003`, not this packet.
- Enforcing any gate inside `validate.sh` / `check-completion.sh` / `spec-doc-structure` — gates stay advisory.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/debug.md` | Modify | Add typed handoff fields (`root_cause`/`target_files`/`fix_recommendations`/`confidence`) for cross-agent debug→implement; keep the 5-phase method untouched |
| `.opencode/agents/orchestrate.md` | Modify | Define the 3 predicates; preserve the typed handoff in the `@code` dispatch; add the pre-mortem field to the task format |
| `.opencode/agents/code.md` | Modify | Receiver-validate the handoff before a diagnosis-based fix; missing fields ⇒ BLOCKED/LOW_CONFIDENCE, not a guessed fix |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Add the boundary contract-first gate under API/schema/integration intent only |
| `.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl` | Modify | Add the typed fields inside existing sections (PROBLEM SUMMARY / CONTEXT FOR SPECIALIST / RECOMMENDED NEXT STEPS) |
| `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh` | Modify | Add CLI flags + JSON extraction for the typed fields; refresh the stale schema-line comment near the file tail (`SCHEMA SOURCE ... lines 60-89`) |
<!-- /ANCHOR:scope -->

Approved implementation note: the Wave 2 execution scope approved only the agent mirrors, the shared contract, and this phase folder. The direct `sk-code`, debug-delegation template, and scaffold-script edits above were read and flagged, not modified, because they were outside that approved write scope.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each gate fires ONLY when its `@orchestrate` predicate is true and SKIPS otherwise. | `diagnosis_crosses_agents`, `change_class ∈ {api,schema,integration}`, and `complexity ∈ {medium,high}` are the sole triggers; a low/typo/docs task triggers none of the three. |
| REQ-002 | `@debug` emits a typed debug→implement handoff. | `debug.md` documents `root_cause`/`target_files`/`fix_recommendations`/`confidence` as the handoff payload for cross-agent diagnosis, reusing 001's envelope fields. |
| REQ-003 | `@orchestrate` preserves the typed handoff into the `@code` dispatch. | `orchestrate.md` shows the handoff being carried (not dropped) when dispatching `@code` for a diagnosis-based fix. |
| REQ-004 | `@code` receiver-validates the handoff before a diagnosis-based fix. | `code.md` states that missing required handoff fields ⇒ BLOCKED / LOW_CONFIDENCE return, never a guessed surgical fix. |
| REQ-005 | `sk-code` boundary contract-first triggers for API/schema/integration only. | `sk-code/SKILL.md` requires a contract / boundary test / executable acceptance check before production edits for `change_class ∈ {api,schema,integration}`, and explicitly does not trigger on ordinary edits. |
| REQ-006 | The `@orchestrate` task format carries a pre-mortem for medium/high work only. | `orchestrate.md` task format includes risk level + top 2-3 failure modes + assumptions, gated on `complexity ∈ {medium,high}`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Gate A is framed honestly as a downscale of an existing pattern. | `debug.md` / contract docs describe the handoff schema as a narrower, advisory adaptation of Gem's orchestrator `debugger_diagnosis` check, not a novel invention. |
| REQ-008 | Legacy `debug-delegation.md` files outside the new crossing WARN, not fail. | Docs and scaffold behavior require manual verification with a warning for legacy/missing-schema reports; no hard failure is introduced. |
| REQ-009 | The debug-delegation template and scaffold carry the typed fields consistently. | `debug-delegation.md.tmpl` adds the fields inside existing sections; `scaffold-debug-delegation.sh` exposes matching CLI flags + JSON extraction and its stale schema-line comment is corrected. |
| REQ-010 | No governance, validator, or auto-dispatch behavior changes. | No edits to `validate.sh` / `check-completion.sh` / `spec-doc-structure`; `@debug` remains user-opt-in; gates stay advisory. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A low/typo/docs task is untouched by all three gates (no handoff schema, no contract-first, no pre-mortem demanded).
- **SC-002**: Boundary contract-first does NOT trigger on ordinary (non-API/schema/integration) edits.
- **SC-003**: A medium/high task carries a pre-mortem (risk + top 2-3 failure modes + assumptions) in its `@orchestrate` task format.
- **SC-004**: A cross-agent debug→implement handoff carries the typed `root_cause`/`target_files`/`fix_recommendations`/`confidence` schema, and `@code` blocks (not guesses) when fields are missing.
- **SC-005**: Gate A is presented as a downscale of Gem's existing `debugger_diagnosis` check, not a novel invention.
- **SC-006**: Legacy `debug-delegation.md` reports outside the new crossing warn rather than fail.
- **SC-007**: Strict spec validation passes for this packet and no governance/validator file is modified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Ceremony creep if any gate becomes universal. | High | Hard predicate scoping in `@orchestrate`: handoff-only, API/schema/integration-only, med/high-only. Low/typo/docs work triggers none. |
| Risk | Legacy `debug-delegation.md` files block work by failing schema validation. | Medium | Warn-only for legacy/missing-schema reports; require manual verification, never hard-fail. |
| Risk | A filled-in handoff schema creates false confidence. | Medium | Schema is a checklist, not a correctness guarantee; the receiver/reviewer still verifies. |
| Risk | New typed seam duplicates `@debug`'s 5-phase method or `@review` gates. | Medium | Add only the typed seam; do not re-derive the 5-phase method or review gates. |
| Risk | `scaffold-debug-delegation.sh` stale schema-line comment (`SCHEMA SOURCE ... lines 60-89`) drifts further. | Low | Refresh the comment as part of the same edit that adds the typed-field flags. |
| Dependency | `001-typed-agent-io-adapter` typed envelope. | Hard | This packet reuses 001's `confidence`/`failure_type` fields; 001 must land first (Wave 1 before Wave 2). |
| Dependency | `@debug` 5-phase method, `@code` verification discipline. | Internal/Available | Existing contracts the typed seam attaches to; unchanged. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Correctness

- Predicate evaluation must be deterministic: each gate's trigger condition is a single explicit `@orchestrate` predicate, not a heuristic.
- `@code` must evaluate handoff completeness BEFORE attempting any diagnosis-based mutation.
- Boundary contract-first must classify `change_class` before requiring a contract, so non-matching classes pass straight through.

### Maintainability

- The three predicates live in one place (`@orchestrate`) so their scope cannot drift silently across agents.
- Typed handoff fields are documented identically in `debug.md`, the debug-delegation template, and the scaffold so the three surfaces cannot diverge.

### Compatibility / Observability

- Every field is additive and optional; absence of a gate's fields is a valid (degraded) state, not an error.
- Legacy/missing-schema handoffs are observable as warnings, distinguishable from a hard block.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

| Case | Expected Behavior |
|------|-------------------|
| Low/typo/docs task | No gate fires; no handoff schema, contract-first, or pre-mortem required. |
| Ordinary (non-API/schema/integration) edit | Boundary contract-first does not trigger. |
| API/schema/integration change | Boundary contract-first requires a contract / boundary test / acceptance check before edits. |
| Medium or high complexity task | Pre-mortem field (risk + top 2-3 failure modes + assumptions) is required. |
| Low complexity task | Pre-mortem field is omitted. |
| `@debug` diagnosis handed to `@code` | Typed handoff schema required; `@code` validates presence before fixing. |
| Handoff with a missing required field | `@code` returns BLOCKED / LOW_CONFIDENCE, not a guessed fix. |
| Legacy `debug-delegation.md` without typed fields, outside the new crossing | Warn and require manual verification; do not fail. |
| Same-session non-crossing debug work (no agent handoff) | Gate A does not fire; `@debug` operates as today. |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | Six surfaces (3 agents, 1 skill, 1 template, 1 script), all additive docs/contract + scaffold flags. |
| Risk | 14/25 | Touches the debug→implement handoff seam and a code-edit gate; ceremony-creep and legacy-block risks need explicit scoping. |
| Research | 6/20 | 007 P2 + 009 synthesis already specify the gates, predicates, and rollout. |
| **Total** | **32/70** | **Level 2** — predicate scoping and the receiver-validate behavior need verification, but no new subsystem. |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `target_files` in the debug handoff: a strict `@code` edit allowlist, or a recommendation the orchestrator translates? (009 iter 002 — default: recommendation; orchestrator/operator decides.)
- Legacy `debug-delegation.md` missing the P2 schema: warn-only (current decision), or offer a one-time scaffold upgrade? (009 §8 — default warn-only.)
- Depends on `001` landing its typed envelope first; if `001` slips, can Gate A ship with a local `confidence` field as a temporary fallback? (Default: hold for 001 per Wave 1→2 ordering.)
<!-- /ANCHOR:questions -->
