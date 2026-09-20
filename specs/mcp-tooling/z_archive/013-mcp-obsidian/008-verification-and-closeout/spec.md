---
title: "Feature Specification: Phase 8 — End-to-end verification and closeout of the mcp-obsidian mode"
description: "Verify the mcp-obsidian mode end-to-end — recursive strict validate, parent-skill-check, route-validate, advisor-recall, live CLI + MCP smoke (or documented-unproven) — then reconcile completion metadata across all packet docs and close out."
trigger_phrases:
  - "obsidian verification closeout"
  - "mcp-obsidian smoke test"
  - "mcp-obsidian phase 8"
  - "obsidian mode closeout"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/013-mcp-obsidian/008-verification-and-closeout"
    last_updated_at: "2026-08-02T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Phase 8 verification + closeout spec (gates + smoke + reconciliation)"
    next_safe_action: "Run validate.sh --recursive --strict on the whole packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/008-verification-and-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 8 — End-to-end verification and closeout of the mcp-obsidian mode

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
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-08-02 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-hub-registration-and-advisor |
| **Successor** | None |
| **Handoff Criteria** | `validate.sh --recursive --strict` on the whole packet exits 0; `parent-skill-check` exits 0; `route-validate` passes; advisor-recall returns `mcp-tooling` for obsidian prompts; live CLI + MCP smoke passes (or is recorded documented-unproven with a reason); completion metadata reconciled across all packet docs; `implementation-summary.md` written; `../changelog/` refreshed. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the `mcp-obsidian` mode build — the final phase. Phase 7 registered the mode across the hub and advisor; this phase proves the mode is usable exactly like `mcp-click-up` and closes the packet with reconciled completion metadata.

**Scope Boundary**: Verification + closeout only. Runs the gates, an advisor-recall test, and a live CLI + MCP smoke; reconciles completion metadata; writes `implementation-summary.md`; refreshes the changelog. It produces verification/closeout artifacts and packet docs — NO new runtime code and no further hub edits.

**Dependencies**:
- All prior phases (001–007) complete: the package exists, docs are authored, and the mode is registered + advisor-rebuilt.
- `validate.sh --recursive --strict`, `parent-skill-check.cjs`, `route-validate.sh`, `advisor_status`/`advisor_validate`, Code Mode `call_tool_chain` (MCP smoke), Bash (CLI smoke).
- Optional: `/deep:skill-benchmark` for a mode benchmark.
- A live Obsidian vault + Local REST API token for the live smoke — if unavailable, the smoke is recorded documented-unproven (the posture `mcp-click-up` took).

**Deliverables**:
- Verification evidence (validate/parent-skill-check/route-validate/advisor-recall/smoke results), reconciled packet docs, `implementation-summary.md`, refreshed `../changelog/`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After Phase 7 the mode is registered but unproven end-to-end: nothing has confirmed the whole packet validates under `--recursive --strict`, that the advisor actually recalls `mcp-tooling` for obsidian prompts, that the CLI and MCP paths execute against a real vault, or that the packet's completion metadata is internally consistent. Shipping without these gates risks a mode that looks registered but does not work — or packet docs that claim conflicting completion states.

### Purpose
Verify the mode end-to-end (validate, parent-skill-check, route-validate, advisor-recall, live CLI + MCP smoke), reconcile completion metadata across every packet doc, and close out so `mcp-obsidian` is usable exactly like `mcp-click-up`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `validate.sh --recursive --strict` on the whole packet (exit 0).
- `parent-skill-check.cjs .opencode/skills/mcp-tooling` (exit 0) + `route-validate.sh`.
- Advisor-recall test: obsidian prompts return `mcp-tooling`.
- Live smoke of BOTH surfaces: a real CLI vault op and an MCP `call_tool_chain` round-trip — or recorded documented-unproven if no vault / Local REST API token is available in-env.
- Optional `/deep:skill-benchmark` on the mode.
- Reconcile completion metadata across `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `implementation-summary.md` so they do not conflict; write `implementation-summary.md`; refresh `../changelog/`.

### Out of Scope
- New runtime or tool code - [everything ships in Phases 002–006].
- Further hub/advisor edits - [Phase 7 owns registration].
- Fixing feature bugs beyond what the smoke reveals - [route regressions back through the owning phase].

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../008-verification-and-closeout/implementation-summary.md` | Create/Modify | Verification evidence + final state |
| `.../008-verification-and-closeout/checklist.md` | Modify | Mark items with evidence (if present) |
| `.opencode/specs/mcp-tooling/013-mcp-obsidian/**/{spec,plan,tasks,checklist,implementation-summary}.md` | Modify | Reconcile completion metadata so states do not conflict |
| `.opencode/specs/mcp-tooling/013-mcp-obsidian/changelog/*` | Modify | Refresh closeout changelog entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `validate.sh --recursive --strict` on the whole packet exits 0 | Exit code 0; any `CONTINUITY_FRESHNESS` staleness resolved for non-grandfathered phases |
| REQ-002 | `parent-skill-check` exits 0 AND the advisor-recall test passes | `parent-skill-check.cjs` exit 0; obsidian prompts return `mcp-tooling`; `route-validate.sh` passes |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Live CLI + MCP smoke passes, or is recorded documented-unproven with a reason | A real CLI vault op + an MCP `call_tool_chain` round-trip succeed; OR both are marked documented-unproven citing the missing vault / Local REST API token |
| REQ-004 | Optional `/deep:skill-benchmark` on the mode + completion-metadata reconciliation | Benchmark run or explicitly deferred; `spec`/`plan`/`tasks`/`checklist`/`implementation-summary` states are mutually consistent |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All P0 gates green — `validate.sh --recursive --strict` exit 0, `parent-skill-check` exit 0, `route-validate` pass, advisor-recall pass.
- **SC-002**: The mode is usable exactly like `mcp-click-up` — live CLI + MCP smoke passes, or is explicitly deferred documented-unproven with a reason.
- **SC-003**: Completion metadata is reconciled across all packet docs; `implementation-summary.md` written and `../changelog/` refreshed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Live Obsidian vault + Local REST API token | No live smoke without them | If absent, record documented-unproven with the reason (mirrors `mcp-click-up`) |
| Risk | Strict-validation freshness (`CONTINUITY_FRESHNESS`) | Stale continuity blocks completion under `--strict` | Refresh continuity/fingerprints before the final recursive strict run |
| Risk | Completion-metadata drift across docs | Packet claims conflicting states | Reconcile `spec`/`plan`/`tasks`/`checklist`/`implementation-summary` in one pass before closeout |
| Risk | Advisor-recall regresses after rebuild | Mode not discoverable | Re-verify recall here; route failures back to Phase 7 rather than patching in place |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Is an Obsidian vault + Local REST API token available in-env for the live smoke, or is documented-unproven the outcome?
- Should `/deep:skill-benchmark` run now, or be deferred to a follow-up?
- Are there `CONTINUITY_FRESHNESS` grandfathering exceptions for any phase in this packet?
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
