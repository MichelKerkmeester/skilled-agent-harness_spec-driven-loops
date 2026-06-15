---
title: "Feature Specification: Phase 1: model-registration"
description: "Register Kimi K2.7 Code as a first-class small model in cli-opencode and sk-prompt-small-model, and retire the older kimi-k2.6 entry."
trigger_phrases:
  - "kimi-k2.7-code"
  - "kimi-for-coding"
  - "model registration"
  - "small model rotation"
  - "kimi-for-coding/k2p7"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-kimi-k2-7-code-support/001-model-registration"
    last_updated_at: "2026-06-15T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Registered kimi-k2.7-code, retired kimi-k2.6, card-sync green"
    next_safe_action: "Begin 002-framework-bakeoff prompt-framework bakeoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
      - ".opencode/skills/cli-opencode/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/001-model-registration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
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
| **Created** | 2026-06-15 |
| **Branch** | `system-speckit/027-xce-research-based-refinement` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-framework-bakeoff |
| **Handoff Criteria** | Model registered, smoke dispatch returns, card-sync guard exit 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the kimi-k2-7-code-support specification.

**Scope Boundary**: Documentation-and-config registration only, all under `.opencode/skills/`. No bakeoff (phase 2) and no winner promotion (phase 3).

**Dependencies**:
- The `kimi-for-coding` provider is registered and authenticated in opencode.
- The canonical "Adopting a New Provider" checklist in `sk-prompt-small-model/references/pattern-index.md` (§4).

**Deliverables**:
- `kimi-k2.7-code` registered across model profiles, references, SKILL.md, aliases, and routing graph metadata.
- `kimi-k2.6` retired (status historical, bare `kimi` alias repointed, profile + index row kept for card-sync compliance).
- Card-sync guard, JSON parse, and advisor routing all verified green.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Kimi K2.7 Code (live slug `kimi-for-coding/k2p7`) is available on the dedicated "Kimi For Coding" coding-plan provider but is not registered anywhere in the small-model surfaces, so it cannot be dispatched or routed by name. The older `kimi-k2.6` entry still points at the shared `opencode-go` gateway and no longer reflects how the operator runs Kimi.

### Purpose
Register `kimi-k2.7-code` as a first-class small model across cli-opencode and sk-prompt-small-model and retire `kimi-k2.6`, so the new model is dispatchable, alias-resolvable, and advisor-routable while the card-sync guard stays green.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `kimi-k2.7-code` model profile entry, references profile, alias set, and routing graph metadata
- Retire `kimi-k2.6` (status historical, repoint bare `kimi` alias, keep profile + index row for card-sync)
- Smoke-test the live dispatch and verify the card-sync guard, JSON parses, and advisor routing

### Out of Scope
- The prompt-framework bakeoff - owned by phase 2 (`002-framework-bakeoff`)
- Folding a measured winning framework into the profile - owned by phase 3 (`003-promote-results`)
- Provider registration or authentication - the `kimi-for-coding` provider is already set up

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-prompt-small-model/assets/model-profiles.json` | Modify | Add `kimi-k2.7-code` entry; retire `kimi-k2.6`; update registry description rotation line |
| `.opencode/skills/sk-prompt-small-model/references/models/kimi-k2.7-code.md` | Create | New 7-section prompt-craft profile (RCAF default-unverified) |
| `.opencode/skills/sk-prompt-small-model/references/models/kimi-k2.6.md` | Modify | Add HISTORICAL banner (superseded by kimi-k2.7-code) |
| `.opencode/skills/sk-prompt-small-model/references/models/_index.md` | Modify | Move kimi-k2.7-code to ACTIVE, kimi-k2.6 to Historical |
| `.opencode/skills/sk-prompt-small-model/SKILL.md` | Modify | Frontmatter, keywords, triggers, MODEL_ALIASES, §3 Dispatch Matrix row |
| `.opencode/skills/sk-prompt-small-model/graph-metadata.json` | Modify | trigger_phrases, intent_signals, enhances-context |
| `.opencode/skills/cli-opencode/graph-metadata.json` | Modify | trigger_phrases, key_topics for the new model/provider |
| `.opencode/skills/cli-opencode/SKILL.md` | Modify | Auth-login list line and Model Selection paragraph |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `kimi-k2.7-code` registered as a first-class small model | Profile entry, references profile, SKILL.md dispatch row, and aliases all present; advisor surfaces the model on a routing probe |
| REQ-002 | Live dispatch works on the new slug | `opencode run --model kimi-for-coding/k2p7 ... "Reply with exactly one word: pong"` returns "pong", exit 0 |
| REQ-003 | Card-sync guard stays green | `check-prompt-quality-card-sync.sh .` exits 0 (all four CHECKs pass) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `kimi-k2.6` retired without breaking card-sync | k2.6 executors + recommended_frameworks status set to historical, profile + index row kept; bare `kimi` alias repoints to kimi-k2.7-code |
| REQ-005 | Routing graph metadata reflects the new model | trigger_phrases / key_topics in both graph-metadata.json files mention kimi-k2.7-code and kimi-for-coding; advisor re-index succeeds |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `kimi-k2.7-code` is dispatchable by slug and routable by name with the card-sync guard green.
- **SC-002**: `kimi-k2.6` is retired in place (historical) without breaking card-sync completeness.

### Acceptance Scenarios

- **Given** the `kimi-for-coding` provider is authed, **When** a smoke dispatch runs `opencode run --model kimi-for-coding/k2p7` with a one-word prompt, **Then** it returns "pong" at exit 0 with cost 0 on the subscription path.
- **Given** the eight registration edits are saved, **When** `check-prompt-quality-card-sync.sh .` runs, **Then** all four CHECKs pass and the guard exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `kimi-for-coding` provider auth | Cannot smoke-test or dispatch | Verify provider is authed before edits; confirmed via `opencode models kimi-for-coding` |
| Risk | Retiring k2.6 too hard (deleting profile/index row) | Card-sync CHECK 3 fails on missing rows | Low - keep k2.6 profile + index row, only flip status to historical (minimax-2.7 precedent) |
| Risk | `--variant high` effect unverified | Recommending a variant without evidence | Low - record variant as accepted-unverified; defer the effect call to phase 2 bakeoff |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The framework-quality and variant-effect questions are deferred to phase 2 by design, not open within this phase.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
