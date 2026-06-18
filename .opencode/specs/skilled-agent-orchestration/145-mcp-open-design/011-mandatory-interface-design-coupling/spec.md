---
title: "Feature Specification: Phase 11: mandatory-interface-design-coupling [template:level_1/spec.md]"
description: "Upgrade mcp-open-design so the sk-interface-design coupling becomes an absolute hard precondition for all design work, not a conditional best-effort. Any generation/RUN and any READ that feeds a design decision MUST load sk-interface-design and run its ground -> token-system -> critique first; pure transport (wiring, bare inventory) stays exempt. Strengthens SKILL.md, README, version, and changelog."
trigger_phrases:
  - "open design mandatory interface design"
  - "mcp-open-design sk-interface-design hard coupling"
  - "open design ui design requires sk-interface-design"
  - "phase 011 spec"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/145-mcp-open-design/011-mandatory-interface-design-coupling"
    last_updated_at: "2026-06-16T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase; design of the hard-block coupling mapped across SKILL.md touch-points"
    next_safe_action: "Edit SKILL.md (banner, router gate, rules), README, changelog; bump version; validate"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/SKILL.md"
      - ".opencode/skills/mcp-open-design/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-011-mandatory-interface-design-coupling"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "How broad is the mandate? All design work (any RUN + any READ feeding a design decision) is a hard block; pure transport (od mcp install, bare list_projects) is exempt."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 11: mandatory-interface-design-coupling

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
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-06-16 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 |
| **Predecessor** | 010-design-playbook-live-run-and-refinement |
| **Successor** | None |
| **Handoff Criteria** | SKILL.md makes the sk-interface-design coupling a hard precondition for all design work (banner + router gate + RULES + success criteria); README + changelog + version reflect it; `validate.sh --strict` exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the mcp-open-design specification.

**Scope Boundary**: Edit the `mcp-open-design` skill only (SKILL.md, README.md, changelog, version). The coupling is made an absolute hard precondition for design work. No change to `sk-interface-design` (the asymmetry is intentional: interface design does not require Open Design, but Open Design design-work requires interface design). No change to the `od` CLI contract, the tool surface, or the gating taxonomy.

**Decision (scope of the mandate)**: Confirmed with the user — the hard block binds ALL design work: any generation/RUN, and any READ that feeds a design decision (grounding, reusing tokens/components). Pure transport — wiring the MCP server (`od mcp install`), bare inventory listing that feeds no design decision — stays exempt because it makes no design decision.

**Dependencies**:
- `sk-interface-design` (the mandated judgment partner) and its `claude_design_parity.md` shared loop.

**Deliverables**:
- `SKILL.md` upgraded: a top MANDATORY banner, a phase-detection hard gate, mandatory resource-loading rows, a router precondition that blocks a design step without the design skill, a Run-direction pre-step, a hardened ALWAYS rule plus a new NEVER rule, and a success-criteria gate.
- `README.md` reflecting the mandate.
- A new changelog entry and a frontmatter version bump.

**Changelog**:
- When this phase closes, add `changelog/v1.3.0.0.md` to the skill.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`mcp-open-design` already references `sk-interface-design`, but the coupling is **conditional and best-effort**: §4 ALWAYS #5 reads "apply sk-interface-design WHEN an Open Design read or run feeds a design decision," there is no NEVER counterpart, and nothing in the smart router BLOCKS a generation run that skipped the design judgment. The result is that an agent can fire `start_run` and produce UI from Open Design without ever invoking the design skill, which is exactly the failure the user wants foreclosed.

### Purpose
Make the coupling absolute: when Open Design is used for any design work, the agent MUST also use `sk-interface-design` — it can never produce or shape an interface from Open Design without it. Open Design is the transport; the design judgment is non-negotiable and lives in `sk-interface-design`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Convert the conditional coupling in `SKILL.md` into a hard precondition across all relevant sections (banner, routing, rules, success criteria, integration).
- Reflect the mandate in `README.md`.
- Add `changelog/v1.3.0.0.md` and bump the SKILL.md frontmatter `version` to `1.3.0.0`.

### Out of Scope
- Any change to `sk-interface-design` (the reverse direction stays optional by design).
- The `od` CLI contract, tool surface, gating taxonomy, or daemon model.
- Feature-catalog and manual-testing-playbook rewrites (the SKILL.md + README are the authoritative runtime surfaces; deeper doc propagation can follow if needed).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/SKILL.md` | Modify | Mandatory banner, phase-detection hard gate, mandatory resource rows, router precondition, Run pre-step, hardened ALWAYS + new NEVER, success-criteria gate, integration wording, version bump |
| `.opencode/skills/mcp-open-design/README.md` | Modify | Mandate banner + strengthen the grounding/related-skills/FAQ wording |
| `.opencode/skills/mcp-open-design/changelog/v1.3.0.0.md` | Create | Changelog for the mandatory-coupling upgrade |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The coupling is a hard precondition in RULES | §4 ALWAYS #5 states sk-interface-design runs BEFORE/THROUGHOUT any design step as a hard precondition, and a NEVER rule forbids producing/shaping UI from Open Design without it |
| REQ-002 | The mandate is unmissable at the top of the skill | A MANDATORY callout appears before §1 stating any design work MUST use sk-interface-design |
| REQ-003 | The router/flow enforces it | §2 phase detection has a hard gate before RUN/design-feeding READ; the router pseudocode blocks a design step without sk-interface-design; §3 Run direction requires it before `start_run` and form answers |
| REQ-004 | Pure transport stays exempt | The banner, gate, and rules explicitly exempt WIRE and bare inventory that feeds no design decision |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Success criteria gate it | §6 requires sk-interface-design evidence for any design step; a run is not complete without it |
| REQ-006 | README + version + changelog | README reflects the mandate; frontmatter `version` is `1.3.0.0`; `changelog/v1.3.0.0.md` exists |
| REQ-007 | Strict validate passes | `validate.sh --strict` exits 0 on this phase; parent 150 phase map + `children_ids` reconciled |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader of `SKILL.md` cannot miss that any Open Design design work requires `sk-interface-design` first — it is stated as a hard precondition in the banner, the routing gate, ALWAYS, NEVER, and success criteria.
- **SC-002**: The router/flow language BLOCKS a generation run composed without `sk-interface-design`; pure transport is explicitly exempt.
- **SC-003**: README, frontmatter `version` (1.3.0.0), and `changelog/v1.3.0.0.md` all reflect the upgrade.
- **SC-004**: `validate.sh --strict` exits 0 on this phase folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Over-broad mandate harms usability | Forcing the design skill before wiring/inventory would be absurd | Scope the hard block to design work only; explicitly exempt WIRE and bare inventory |
| Risk | Wording stays soft and the block is ignorable | The original conditional failure recurs | Use explicit hard-precondition language plus a NEVER rule plus a router precondition that raises/blocks |
| Risk | Drift between SKILL.md and README | Mixed signals about whether it is mandatory | Update both in the same phase; the changelog records the single intent |
| Dependency | `sk-interface-design` | The mandated partner | Reference its principles and the shared parity loop; no edit to it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The one scope fork (how literally to read "ALWAYS") was resolved with the user: all design work is a hard block; pure transport is exempt.
<!-- /ANCHOR:questions -->
