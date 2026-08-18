---
title: "Feature Specification: Add DeepSeek V4 Flash via the Cline provider to the cli-opencode roster"
description: "Catalog cline-pass/cline-pass/deepseek-v4-flash in the cli-opencode roster docs, mirroring the packet-047 OpenRouter add, with the correct reasoning-tier behavior (no max tier; top is xhigh)."
trigger_phrases:
  - "cline-pass deepseek v4 flash cli-opencode roster"
  - "add cline provider to opencode roster"
  - "cline-pass xhigh no max tier"
  - "opencode cline provider docs"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/048-cline-provider-roster/001-cline-deepseek-flash-cli-opencode"
    last_updated_at: "2026-08-18T08:49:05Z"
    last_updated_by: "claude"
    recent_action: "Roster entry added across three cli-opencode docs; validate --strict clean"
    next_safe_action: "Close phase; proceed to Phase 2 pi investigation"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-048-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Add DeepSeek V4 Flash via the Cline provider to the cli-opencode roster

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
| **Phase** | 1 of 2 |
| **Predecessor** | None |
| **Successor** | 002-cline-support-pi-investigation |
| **Handoff Criteria** | Roster entry lands and reflects live `opencode models cline-pass` metadata; `validate.sh --strict` exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Cline Provider Roster specification.

**Scope Boundary**: cli-opencode roster documentation only. No cli pi changes (Phase 2). No fan-out executor-registry wiring.

**Dependencies**:
- The Cline provider is already authenticated in opencode as `cline-pass` (`~/.local/share/opencode/auth.json`, type `api`).

**Deliverables**:
- A `### cline-pass` provider section + effort-lever row in `providers-and-models.md`.
- Cline mentions in `SKILL.md` (keywords, model alternates, honor-overrides) and `cli-reference.md` (login menu).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
opencode has the Cline provider authenticated (registered as `cline-pass`, not `cline`), exposing `cline-pass/cline-pass/deepseek-v4-flash`. The cli-opencode roster documented six providers and omitted Cline entirely, so no catalog entry gave the model id, its login flow, or how its reasoning tiers differ from the direct/OpenRouter DeepSeek Flash ids.

### Purpose
Add one accurate Cline roster entry so a dispatcher can select `cline-pass/cline-pass/deepseek-v4-flash` with the correct `--variant` guidance, mirroring how packet 047 added OpenRouter.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `### cline-pass` section in `providers-and-models.md` §2 with the model row.
- New effort-lever row in `providers-and-models.md` §4.
- `SKILL.md` keyword list, "Common alternates", and honor-overrides examples.
- `cli-reference.md` missing-providers login menu entry.

### Out of Scope
- cli pi runtime changes — Phase 2 investigates, then decides.
- Fan-out executor-registry wiring for `cline-pass` — its id matches the `--variant max` auto-pin, which Cline's Flash lacks.
- Cline's non-Flash models (glm-5.2, kimi-*, mimo-*, minimax-m3, qwen3.7-*).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/providers-and-models.md` | Modify | `### cline-pass` provider section + §4 effort row |
| `.opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md` | Modify | Keywords + Common alternates + honor-overrides examples |
| `.opencode/skills/cli-external-orchestration/cli-opencode/references/cli-reference.md` | Modify | Cline login-menu entry |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the Cline provider and its DeepSeek V4 Flash model | `providers-and-models.md` §2 has a `### cline-pass` section listing `cline-pass/cline-pass/deepseek-v4-flash` |
| REQ-002 | State the true reasoning-tier behavior | Docs say `reasoning: true`, tiers `none`→`xhigh`, **no `max` tier**, top thinking `--variant xhigh` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Surface Cline in the operator-facing entry points | `SKILL.md` alternates/keywords and `cli-reference.md` login menu name `cline-pass` and the model id |
| REQ-004 | Record the `cline` vs `cline-pass` naming trap | Docs explicitly note `opencode models cline` errors "Provider not found"; the provider id is `cline-pass` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg "cline-pass/cline-pass/deepseek-v4-flash" providers-and-models.md SKILL.md` returns hits in both roster surfaces.
- **SC-002**: The roster states no `max` tier and directs `--variant xhigh` for top thinking — matching live `opencode models cline-pass --verbose`.
- **SC-003**: `validate.sh --strict` on this phase folder exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fan-out `--variant max` auto-pin matches `cline-pass/.../deepseek-v4-flash` | A fan-out dispatch would force an unsupported `max` tier | Roster explicitly marks Cline Flash direct-dispatch-only, not a fan-out executor; registry wiring is out of scope |
| Dependency | Cline account currency | If Cline auth lapses, dispatch fails | Login menu documents `opencode auth login`; auth is operator-owned |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Live dispatch was not run (list-verified only), consistent with how `opencode-go/glm-5.3` was added in prior roster packets.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Summary**: `implementation-summary.md`
- **Plan**: `plan.md`
- **Tasks**: `tasks.md`
- **Parent Spec**: `../spec.md`
