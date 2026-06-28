---
title: "Feature Specification: Phase 1: model-registration"
description: "Register GLM-5.2 as a first-class small model in cli-opencode and sk-prompt-models, discovering the live Z.AI Coding Plan provider id and GLM-5.2 slug first."
trigger_phrases:
  - "glm-5.2"
  - "z.ai coding plan"
  - "glm coding plan"
  - "model registration"
  - "small model rotation"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/157-glm-5-2-support/001-model-registration"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "GLM-5.2 registered across 10 surfaces; smoke pong + card-sync green"
    next_safe_action: "Begin 002-framework-bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model_profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session/001-model-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Live provider id = zai-coding-plan; slug = zai-coding-plan/glm-5.2 (confirmed via opencode)"
      - "Billing subscription; context/output 1M/128K per Z.AI docs; --variant accepted-unverified"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: model-registration

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
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 (core) |
| **Predecessor** | None |
| **Successor** | 002-framework-bakeoff |
| **Handoff Criteria** | Live slug discovered + registered, smoke dispatch returns, card-sync guard exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the glm-5-2-support specification. It mirrors `149-kimi-k2-7-code-support/001-model-registration` step-for-step, substituting GLM-5.2 / the Z.AI Coding Plan for Kimi / `kimi-for-coding`.

**Scope Boundary**: Documentation-and-config registration only, all under `.opencode/skills/`. No bakeoff (phase 2) and no winner promotion (phase 3). Unlike 149, there is no prior GLM entry to retire — this is a clean add.

**Dependencies**:
- The Z.AI GLM Coding Plan provider is subscribed and (to be confirmed) authenticated in opencode — the auth list shows "Z.AI Coding Plan (api)".
- The canonical "Adopting a New Provider" checklist in `sk-prompt-models/references/pattern_index.md` (§4, 9 steps).

**Deliverables**:
- Live provider id + GLM-5.2 slug + capability facts (context, output, billing) discovered and recorded.
- `glm-5.2` registered across `model_profiles.json`, `references/models/glm-5.2.md`, `_index.md`, SKILL.md (aliases + §3 matrix), and routing graph metadata in both skills.
- cli-opencode integrated: auth pre-flight grep + login templates + model-selection + provider table updated.
- Card-sync guard, JSON parse, advisor routing, and a live smoke dispatch all verified green.

**Changelog**:
- When this phase closes, add the matching file to ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
GLM-5.2 (served through the Z.AI GLM Coding Plan, surfaced in opencode as "Z.AI Coding Plan (api)") is available to the operator but is not registered anywhere in the small-model surfaces, so it cannot be dispatched or routed by name. The live provider id and model slug are not yet known to the skill docs and must be discovered before anything can reference them.

### Purpose
Discover the live Z.AI provider id + GLM-5.2 slug, then register `glm-5.2` as a first-class small model across cli-opencode and sk-prompt-models so it is dispatchable, alias-resolvable, and advisor-routable while the card-sync guard stays green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Discover and record the live provider id, GLM-5.2 slug, context window, max output, and billing model (`opencode providers list` + `opencode models <provider>`)
- Add the `glm-5.2` model profile entry, references profile, alias set, `_index.md` row, §3 dispatch-matrix row, and routing graph metadata
- Integrate cli-opencode: auth pre-flight grep line, login-template list, model-selection paragraph, and provider table
- Author the initial prompt-craft profile with a default framework recorded at `default-unverified` status (pending the phase-2 bakeoff), folding in any Z.AI/Zhipu prompting guidance as guidance (not as an empirical claim)
- Smoke-test the live dispatch and verify the card-sync guard, JSON parses, and advisor routing

### Out of Scope
- The prompt-framework bakeoff — owned by phase 2 (`002-framework-bakeoff`)
- Folding a measured winning framework into the profile — owned by phase 3 (`003-promote-results`)
- Provider registration or authentication — the Z.AI Coding Plan is already subscribed; this phase confirms it is authed, it does not set it up

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-models/assets/model_profiles.json` | Modify | Add the `glm-5.2` entry (capability block, executor → provider → pool, `recommended_frameworks` default-unverified); update the registry description rotation line |
| `.opencode/skills/sk-prompt-models/references/models/glm-5.2.md` | Create | New per-model prompt-craft profile (default framework unverified, bakeoff pending) |
| `.opencode/skills/sk-prompt-models/references/models/_index.md` | Modify | Add `glm-5.2` to the ACTIVE table |
| `.opencode/skills/sk-prompt-models/SKILL.md` | Modify | Frontmatter description, Keywords, activation + keyword triggers, MODEL_ALIASES, §3 Dispatch Matrix row |
| `.opencode/skills/sk-prompt-models/references/pattern_index.md` | Modify | §3 ownership-boundary line (cli-opencode owns ... + GLM-5.2 via the Z.AI Coding Plan) |
| `.opencode/skills/sk-prompt-models/graph-metadata.json` | Modify | trigger_phrases + intent_signals for glm-5.2 / the Z.AI provider |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Keywords header, Provider Auth Pre-Flight grep, routing/decision rows, Model Selection paragraph, login-template list |
| `.opencode/skills/cli-opencode/references/cli_reference.md` | Modify | Provider table, model-selection examples, auth pre-flight grep, variant table |
| `.opencode/skills/cli-opencode/assets/prompt_quality_card.md` | Modify | Model-selection table row linking to the new profile |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | trigger_phrases + key_topics for glm-5.2 / the Z.AI provider |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Live provider id + GLM-5.2 slug + capability facts discovered and recorded | `opencode providers list` shows the Z.AI provider; `opencode models <provider>` returns the GLM-5.2 slug, context window, and max output; all captured into the registry entry |
| REQ-002 | `glm-5.2` registered as a first-class small model | Registry entry, references profile, SKILL.md dispatch row, and aliases all present; advisor surfaces the model on a routing probe |
| REQ-003 | Live dispatch works on the discovered slug | `opencode run --model <provider>/glm-5.2 ... "Reply with exactly one word: pong"` returns "pong", exit 0 |
| REQ-004 | Card-sync guard stays green | `check-prompt-quality-card-sync.sh .` exits 0 (all CHECKs pass) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | cli-opencode auth + selection surfaces include the Z.AI provider | Auth pre-flight grep, login-template list, model-selection paragraph, and provider table all name the Z.AI provider + GLM-5.2 slug |
| REQ-006 | Routing graph metadata reflects the new model | trigger_phrases / key_topics in both graph-metadata.json files mention glm-5.2 and the Z.AI provider; advisor re-index succeeds |
| REQ-007 | Prompt-craft profile authored with an honest default | `glm-5.2.md` records a default framework at `default-unverified` status, citing the registry; any Z.AI prompting guidance is labelled guidance, not benchmark evidence |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `glm-5.2` is dispatchable by slug and routable by name with the card-sync guard green.
- **SC-002**: The live provider id, slug, and capability facts are recorded in the registry (no fabricated values).
- **SC-003**: cli-opencode's auth/selection surfaces let a fresh session discover and dispatch GLM-5.2 without guesswork.

### Acceptance Scenarios

- **Given** the Z.AI Coding Plan provider is authed, **When** a smoke dispatch runs `opencode run --model <provider>/glm-5.2` with a one-word prompt, **Then** it returns "pong" at exit 0 with the billing model recorded.
- **Given** the registration edits are saved, **When** `check-prompt-quality-card-sync.sh .` runs, **Then** all CHECKs pass and the guard exits 0.
- **Given** a prompt naming GLM-5.2 / the Z.AI plan, **When** the advisor routing probe runs, **Then** it surfaces `sk-prompt-models` + `cli-opencode`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Z.AI Coding Plan provider auth | Cannot smoke-test or dispatch | Confirm the provider is authed via `opencode providers list` / `opencode models <provider>` before edits |
| Risk | Provider id / slug guessed instead of discovered | Registry records a dead slug; dispatch fails | HARD rule: discover the live id with opencode commands first; never fabricate (149 slug-drift-guard precedent) |
| Risk | GLM-5.2 not the live id (e.g. provider exposes glm-4.6 or a dated id) | Wrong slug registered | Capture the exact id from `opencode models <provider>`; record the display name + id verbatim |
| Risk | `--variant` / reasoning-effort flag effect unverified | Recommending a flag without evidence | Record as accepted-unverified; defer the effect call to phase 2 |
| Risk | Z.AI endpoint region / base-url assumptions | Mis-documented auth surface | Do not invent a base URL; mirror only what `opencode providers` reports (cli_reference precedent for minimax/xiaomi) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Live provider id for the Z.AI GLM Coding Plan — resolve via `opencode providers list`.
- Live GLM-5.2 slug, context window, max output, billing (subscription vs pay-per-token) — resolve via `opencode models <provider>`.
- Best default framework to record pre-bakeoff — start from Z.AI/Zhipu prompting guidance + the convention default; the empirical winner is phase 2's job.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
