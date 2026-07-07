---
title: "Feature Specification: Phase 5 — foldin review"
description: "Fold the standalone sk-code-review skill identity into the sk-code code-review mode while preserving the review doctrine verbatim and retaining the legacy alias for routing continuity."
trigger_phrases:
  - "sk-code foldin review"
  - "sk-code-review fold-in"
  - "code-review mode identity"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/017-sk-code-parent/005-foldin-review"
    last_updated_at: "2026-07-04T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Documented the completed review fold-in phase"
    next_safe_action: "phase 006 build-remaining-modes"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5 — foldin review

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
| **Status** | Accepted / Complete |
| **Created** | 2026-07-04 |
| **Branch** | Worktree for `124-sk-code-parent` review fold-in work |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 9 |
| **Predecessor** | ../004-onboard-implement/spec.md |
| **Successor** | ../006-build-remaining-modes/spec.md (planned) |
| **Handoff Criteria** | `sk-code-review` is folded into `code-review`, standalone advisor identity is de-registered, doctrine remains unchanged, and the legacy alias is retained for routing continuity |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-code parent-skill conversion. It is the **review fold-in step** after phase 004 relocated the flat sk-code content into shared and mode packets.

Phase 005 folded the standalone `sk-code-review` skill into the `sk-code` hub as the `code-review` mode. The cohesive move placed the standalone review package under `sk-code/code-review/`, including `SKILL.md`, `README.md`, four reference files, six checklist assets, two scripts, five changelog files, and eight manual-testing-playbook sections.

The standalone `sk-code-review/graph-metadata.json` was deleted so the standalone advisor identity is de-registered and the folder is retired. The one-identity invariant holds: exactly one `graph-metadata.json` remains under `sk-code`, at the hub.

The review doctrine is preserved verbatim. Only packet identity, frontmatter, self-references, and sibling cross-references were adapted so the review baseline now presents as the `code-review` mode of the `sk-code` family.

The legacy alias `sk-code-review` remains in the review registry aliases, hub router review vocabulary, and hub trigger phrases until the planned 009 cutover.

One pre-existing broken playbook link was left untouched per scope lock: `manual_testing_playbook.md` points to `cli-opencode-and-cli-opencode-handback.md`, while the target filename is `cli-opencode-and-cli-claude-code-handback.md`.

**Scope Boundary**: identity adaptation and alias preservation only. Do not rewrite review doctrine, severity model, checklists, output contract, PR-state gates, historical changelogs, or the pre-existing playbook typo.

**Dependencies**:
- Predecessor relocation phase: `../004-onboard-implement/spec.md`.
- Next contract phase: `006-build-remaining-modes`.
- Alias cutover phase: `009`.

**Deliverables**:
- `code-review` mode identity in `SKILL.md` and `README.md`.
- Legacy alias retained in the three hub routing surfaces.
- Phase 005 documentation and metadata.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
After the review package moved under the `sk-code` parent hub, the runtime docs still carried standalone `sk-code-review` identity. That identity needed to become the nested `code-review` mode while preserving the folded v1.5 review doctrine unchanged.

### Purpose
Finalize the fold-in by adapting identity and routing metadata only, keeping review behavior stable and preserving `sk-code-review` as a back-compat alias during the transition.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Adapt `sk-code/code-review/SKILL.md` frontmatter, keywords, title, self-identity references, and sibling cross-references.
- Adapt `sk-code/code-review/README.md` identity, usage language, paths, and sibling navigation.
- Add `sk-code-review` as a legacy alias in the mode registry, hub router, and hub trigger phrases.
- Document the completed phase 005 fold-in.

### Out of Scope
- Rewriting review doctrine, severity taxonomy, evidence rules, checklists, output contract, or PR-state gates.
- Touching `sk-code/code-review/changelog/**` historical records.
- Deleting, moving, or restoring files.
- Fixing the pre-existing manual-testing-playbook filename typo.
- Cleaning graph-metadata edges that still mention `sk-code-review`; that cleanup belongs to a later phase.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-code/code-review/SKILL.md` | Update | Mode identity, frontmatter, keywords, self-references, sibling cross-references |
| `.opencode/skills/sk-code/code-review/README.md` | Update | Human-facing mode identity, current paths, sibling navigation |
| `.opencode/skills/sk-code/mode-registry.json` | Update | Add legacy `sk-code-review` alias to the review mode |
| `.opencode/skills/sk-code/hub-router.json` | Update | Add legacy `sk-code-review` keyword to review aliases |
| `.opencode/skills/sk-code/graph-metadata.json` | Update | Append legacy `sk-code-review` trigger phrase only |
| `.opencode/specs/sk-code/017-sk-code-parent/005-foldin-review/` | Create | Phase 005 documentation and metadata |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve review doctrine | Review logic, severity model, checklists, output contract, and PR-state gates remain unchanged except identity/cross-reference text |
| REQ-002 | Adapt mode identity | `SKILL.md` and `README.md` present the package as `code-review` mode of the `sk-code` family |
| REQ-003 | De-register standalone identity | Standalone `sk-code-review/graph-metadata.json` is deleted and the folder is retired |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Preserve legacy alias | `sk-code-review` appears in mode registry aliases, hub router review aliases, and hub trigger phrases |
| REQ-005 | Keep review mode non-mutating | `allowed-tools` excludes `Edit`, and the doctrine does not require applying edits |
| REQ-006 | Respect scope lock | Historical changelogs and the pre-existing playbook typo remain untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `code-review/SKILL.md` carries `name: code-review`, version `1.0.0.0`, `allowed-tools: [Read, Bash, Grep, Glob, Write]`, and `metadata.author/family`.
- **SC-002**: `code-review/README.md` names the mode identity and points runtime paths to `.opencode/skills/sk-code/code-review/`.
- **SC-003**: The legacy `sk-code-review` alias appears in all three requested hub routing surfaces.
- **SC-004**: Phase 005 docs record the cohesive fold-in facts, de-registration, doctrine preservation, retained alias, and untouched playbook typo.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:research-questions -->
## 6. RESEARCH QUESTIONS (Track R) & CONTEXT TARGETS (Track C)

### Track R — deep-research
- The fold-in target and doctrine-preservation constraint were already defined by the phase boundary.
- This phase did not reopen review doctrine, routing architecture, or cutover timing.

### Track C — deep-context
- Confirm the folded review package is cohesive under `sk-code/code-review/`.
- Confirm the hub retains exactly one `graph-metadata.json` advisor identity.
- Confirm the legacy alias remains in registry, router, and trigger phrases until cutover.
<!-- /ANCHOR:research-questions -->

---

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Review doctrine drift during identity edit | Review behavior changes silently | Limit edits to frontmatter, self-identity, paths, and sibling cross-references |
| Risk | Alias omitted from one routing surface | Back-compat routing regresses | Add `sk-code-review` to registry aliases, router review aliases, and hub trigger phrases |
| Risk | `Edit` remains allowed | Review mode appears mutating despite findings-first doctrine | Drop `Edit` from `allowed-tools` and report no doctrine conflict |
| Risk | Pre-existing playbook typo is fixed in this phase | Scope lock violation | Record the typo and leave it untouched |
| Dependency | Phase 006 build-remaining-modes | Remaining mode contracts still need build-out | Continue with phase 006 after fold-in |
| Dependency | Phase 009 cutover | Legacy alias stays until planned cutover | Preserve alias for now |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None for this completed fold-in phase. Graph edge cleanup and alias cutover are known later-phase boundaries, not open questions.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
