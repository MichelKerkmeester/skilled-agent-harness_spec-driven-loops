---
title: "Research Specification: Can cli pi reach the Cline provider like opencode does?"
description: "Investigation phase (complete): determine whether cli pi can register/authenticate the Cline provider (cline-pass) and surface its models in /login and the model picker, to reach opencode parity — read-only until a verdict."
trigger_phrases:
  - "cline support cli pi investigation"
  - "pi login cline provider parity"
  - "add cline-pass to pi models"
  - "pi provider registration cline"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/049-cline-provider-roster/002-cline-support-pi-investigation"
    last_updated_at: "2026-08-18T13:09:28Z"
    last_updated_by: "claude"
    recent_action: "Investigation complete; successor 003 built the pi config"
    next_safe_action: "None; verdict consumed by phase 003"
    blockers: []
    key_files:
      - ".pi/models.json"
      - ".pi/settings.json"
      - ".opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-049-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Research Specification: Can cli pi reach the Cline provider like opencode does?

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 3 |
| **Predecessor** | 001-cline-deepseek-flash-cli-opencode |
| **Successor** | 003-cline-pi-config-build (the pi config build the config-only-feasible verdict unblocked) |
| **Handoff Criteria** | An evidence-backed feasibility verdict is recorded; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Cline Provider Roster specification. It is an **investigation**, not an implementation. No `.pi` runtime file is changed until the investigation lands a "feasible" verdict and a follow-on phase is approved.

**Execution mode**: hands-on local spike (inspect pi config, run pi commands, sandbox-probe a `cline-pass` block) — NOT a `/deep:research` loop. Operator decision 2026-08-18. The answer lives in the local pi runtime, so a bounded spike resolves it faster than a multi-iteration research fan-out. Unlike its predecessor packet 045 (a `/deep:research` bridge feasibility study), this question is locally answerable.

**Scope Boundary**: Determine feasibility only. Any actual pi provider wiring is deferred to a later phase gated on this verdict.

**Dependencies**:
- Phase 1's confirmed facts about the Cline provider (`cline-pass`, base `https://api.cline.bot/api/v1`, OpenAI-compatible, model `cline-pass/cline-pass/deepseek-v4-flash`).

**Deliverables**:
- A recorded verdict (feasible via config / feasible via extension / not feasible) with the evidence behind it.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
cli pi's `/login` does not list Cline, so the operator cannot authenticate the Cline provider from pi and cannot select `cline-pass/cline-pass/deepseek-v4-flash` in pi's model picker — even though opencode already dispatches it. It is unknown whether pi resolves providers from the same models.dev registry as opencode (making Cline a config-only add) or from a pi-specific built-in list (which would need a pi extension or upstream change).

### Purpose
Establish, with first-hand evidence from the live pi surfaces, whether pi can be brought to Cline parity, and if so by the cheapest permissible mechanism.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- How cli pi resolves and lists providers/models: `.pi/models.json` `providers`, `.pi/settings.json` `enabledModels`/`defaultProvider`, and what backs the `/login` provider list.
- Whether pi shares opencode's models.dev provider registry (where `cline-pass` is defined) or maintains its own.
- Candidate mechanisms to surface Cline in pi: config-only (`models.json` provider block + `enabledModels`), a pi extension/plugin, or reusing opencode's auth.
- The auth path: whether pi can reuse the existing opencode Cline credential or needs its own login.

### Out of Scope
- Actually shipping the pi Cline wiring — deferred to a gated follow-on phase.
- Any change to the Phase 1 cli-opencode roster.
- Cline's non-Flash models.

### Files to Change
Investigation writes only within this phase folder (findings in `implementation-summary.md` / `scratch/`). No `.pi` runtime file changes during the investigation.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `implementation-summary.md` | Modify | Record the feasibility verdict and evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Map how pi resolves providers and populates `/login` | Documented against live `.pi` config + pi CLI behavior, not assumption |
| REQ-002 | Produce a feasibility verdict | One of: config-only feasible / extension-required / not feasible, each with evidence |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Name the cheapest permissible mechanism if feasible | Concrete file/edit or extension named, with the auth path resolved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The verdict is grounded in the real pi provider-resolution behavior (config inspected, `/login` list observed), not speculation.
- **SC-002**: If feasible, the recommended mechanism is specific enough to hand to an implementation phase.
- **SC-003**: No `.pi` runtime file is modified during the investigation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | pi provider registry source | Determines whether this is config-only or needs an extension | The investigation answers this before any implementation phase opens |
| Risk | Reusing opencode's Cline auth in pi | Could break or violate Cline's terms | Verdict records the auth path and its permissibility before anything is wired |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does pi's `/login` enumerate a fixed built-in provider list, or the same models.dev registry opencode uses?
- Can pi register an arbitrary OpenAI-compatible provider (base URL + key) via `.pi/models.json` without a code change?
- Can pi reuse the operator's existing opencode Cline credential, or does it need its own login?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md` (verdict recorded here when the investigation runs)
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Parent Spec**: `../spec.md`
