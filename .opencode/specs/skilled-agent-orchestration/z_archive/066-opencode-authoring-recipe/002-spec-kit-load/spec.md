---
title: "Feature Specification: 078/002 /speckit:complete Authoring-Time sk-code Load"
description: "Add authoring-time sk-code load to /speckit:complete:auto and :confirm YAMLs so the workflow loads sk-code authoring resources BEFORE code writes (currently only loads at review time, post-write). Document the cross-skill load contract in system-spec-kit/SKILL.md and sk-code/SKILL.md."
trigger_phrases: ["078/002", "spec-kit-load", "authoring-time sk-code", "cross-skill load contract"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/066-opencode-authoring-recipe/002-spec-kit-load"
    last_updated_at: "2026-05-05T18:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 2 scaffolded"
    next_safe_action: "Dispatch cli-codex for YAML + SKILL.md updates"
    blockers: []
    key_files:
      - .opencode/commands/speckit/assets/speckit_complete_auto.yaml
      - .opencode/commands/speckit/assets/speckit_complete_confirm.yaml
      - .opencode/skills/system-spec-kit/SKILL.md
      - .opencode/skills/sk-code/SKILL.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-002-final"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 078/002 /speckit:complete Authoring-Time sk-code Load

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (078-opencode-authoring-recipe) |
| **Predecessor** | 078/001 sk-code-authoring (foundation; v3.2.0.0 shipped) |
| **Successor** | 078/003 coco-priority |
| **Handoff Criteria** | Both complete YAMLs reference sk-code authoring-time load; system-spec-kit + sk-code SKILL.md document the cross-skill contract; validate.sh --strict on 078/002 exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
077 finding F-009-001: `/speckit:complete` workflow loads sk-code only at REVIEW TIME (Phase A "Pre-Commit code review", auto YAML lines 311-318), not at AUTHORING TIME (Step 10 development). When the implementation target is under `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/`, or `.opencode/specs/`, the orchestrator writes code WITHOUT having loaded sk-code's authoring checklists or the spec_folder_write recipe (just shipped in 078/001 v3.2.0.0). The pattern means errors that the authoring checklists would have prevented have to be caught (and re-fixed) at review time, slowing iteration. F-009-002 + F-008-004 + F-006-004 are corollaries: sk-code has spec-folder invariants but no first-class SPEC_FOLDER load path; the integration is named in path-safety language only.

### Purpose
Add authoring-time sk-code load to both `/speckit:complete:auto` and `:confirm` YAMLs. Add a paragraph to system-spec-kit/SKILL.md documenting the cross-skill load contract (pull-style: the workflow tells the orchestrator WHEN to consult sk-code). Add a complementary paragraph to sk-code/SKILL.md declaring the contract from its side (push-style: the resources sk-code will surface when called from `/speckit:complete` with an `.opencode/` target). Closes 4 P1 findings: F-009-001, F-009-002, F-008-004, F-006-004.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an activity in `step_10_development.activities` of `speckit_complete_auto.yaml` instructing the orchestrator to load sk-code authoring resources BEFORE writes when the implementation target is under `.opencode/skills/`, `.opencode/agents/`, `.opencode/commands/`, or `.opencode/specs/`
- Mirror the same activity in `speckit_complete_confirm.yaml`
- Add a `cross_skill_authoring_load` block (or similar named anchor) above the existing `sk-code-review` overlay block to make the authoring-time intent explicit
- Update `system-spec-kit/SKILL.md` §16-18 area (cross-skill routing) to add a paragraph documenting the authoring-time vs review-time load split
- Update `sk-code/SKILL.md` to add a one-paragraph "Cross-skill consumption" block declaring the recipes/checklists surfaced when called from `/speckit:complete` with an `.opencode/` target
- Bump sk-code SKILL.md frontmatter version 3.2.0.0 → 3.2.1.0 (patch bump: doc-only declaration of contract)
- Bump description.json version 3.2.0.0 → 3.2.1.0
- Author changelog/v3.2.1.0.md (compact format)

### Out of Scope
- Algorithmic changes to the smart router (Phase 3 territory)
- Adding new sk-code assets (Phase 1 already shipped 5 checklists + 1 recipe)
- CocoIndex canonical-priority work (Phase 3)
- Validator graph-metadata shape work (Phase 4)
- Modifying the existing `Pre-Commit code review` Phase A block (preserve review-time behavior)
- Webflow stack — `.opencode/` targets only

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/commands/speckit/assets/speckit_complete_auto.yaml` | Modify | Add authoring-time sk-code load activity in step_10_development; add cross_skill_authoring_load block near agent_dispatch.review |
| `.opencode/commands/speckit/assets/speckit_complete_confirm.yaml` | Modify | Mirror the same changes |
| `.opencode/skills/system-spec-kit/SKILL.md` | Modify | Add cross-skill authoring-time load contract paragraph in §16-18 area |
| `.opencode/skills/sk-code/SKILL.md` | Modify | Add Cross-Skill Consumption block; bump version 3.2.0.0 → 3.2.1.0 |
| `.opencode/skills/sk-code/description.json` | Modify | Bump version 3.2.0.0 → 3.2.1.0 |
| `.opencode/skills/sk-code/changelog/v3.2.1.0.md` | Create | Patch-release changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | 077 Finding |
|----|-------------|---------------------|-------------|
| REQ-001 | speckit_complete_auto.yaml step_10_development.activities mentions sk-code authoring-time load for `.opencode/` targets | `grep -c "sk-code authoring" auto.yaml` ≥ 1; activity reference includes target detection clause | F-009-001 |
| REQ-002 | speckit_complete_confirm.yaml mirrors REQ-001 | grep matches in confirm.yaml | F-009-001 |
| REQ-003 | Both YAMLs add a `cross_skill_authoring_load` block (or equivalent named structure) | grep `cross_skill_authoring_load\|authoring_time_load` ≥ 1 hit per file | F-009-002 |
| REQ-004 | system-spec-kit/SKILL.md adds an authoring-time vs review-time cross-skill load paragraph | grep `authoring-time\|authoring time` in SKILL.md returns ≥ 1 hit in §16-18 region | F-006-004 |
| REQ-005 | sk-code/SKILL.md adds a Cross-Skill Consumption block declaring resources surfaced for `.opencode/` targets | grep `Cross-Skill Consumption\|cross-skill consumption` ≥ 1 hit in sk-code SKILL.md | F-008-004 |
| REQ-006 | sk-code SKILL.md frontmatter version 3.2.0.0 → 3.2.1.0 | grep `version: 3.2.1.0` SKILL.md | — |
| REQ-007 | sk-code description.json version 3.2.0.0 → 3.2.1.0 | grep `"version": "3.2.1.0"` description.json | — |
| REQ-008 | Changelog v3.2.1.0.md created using compact format | File present at `.opencode/skills/sk-code/changelog/v3.2.1.0.md` | — |
| REQ-009 | Both YAMLs remain parseable as YAML (no syntax break) | `python3 -c "import yaml; yaml.safe_load(open('auto.yaml'))"` exit 0 |  — |
| REQ-010 | validate.sh --strict on 078/002 exits 0 | Validator returns 0/0 | — |
| REQ-011 | One commit on main + pushed | `git push origin main` exit 0 | — |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | The activity addition includes target detection (skill/, agent/, command/, specs/) | grep both `skill\|agent\|command\|specs` AND `sk-code authoring` in same activity context |
| REQ-013 | Existing review-time `Pre-Commit code review` overlay block is preserved unchanged | diff shows the existing line 311-318 block is untouched |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An AI orchestrator reading `/speckit:complete:auto` step 10 sees explicit authoring-time sk-code load instructions and follows them BEFORE the first write to `.opencode/`.
- **SC-002**: A maintainer reading either system-spec-kit/SKILL.md or sk-code/SKILL.md can find the cross-skill authoring-time load contract documented from both sides.

### Given/When/Then Verification Scenarios

**Given** speckit_complete_auto.yaml has the new authoring-time load activity, **When** an orchestrator runs `/speckit:complete:auto` against a spec folder with `.opencode/skills/` writes, **Then** sk-code authoring resources are loaded before the first write.

**Given** the cross_skill_authoring_load block is present, **When** a maintainer reads the YAML, **Then** they see authoring-time and review-time as distinct named blocks (not both labeled "review").

**Given** system-spec-kit SKILL.md has the cross-skill paragraph, **When** an AI agent loads it, **Then** it sees the explicit authoring-time vs review-time distinction.

**Given** sk-code SKILL.md has the Cross-Skill Consumption block, **When** loaded, **Then** it declares which resources surface for `/speckit:complete` with `.opencode/` targets.

**Given** both YAMLs are modified, **When** running `python3 -c "import yaml; yaml.safe_load(...)"`, **Then** parsing succeeds with no syntax errors.

**Given** validate.sh --strict on 078/002, **When** running, **Then** 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Inserting a step in a 1148-line YAML breaks unrelated downstream references | Med | Use cli-codex with explicit insertion-point line numbers; post-dispatch parseability check (`python3 -c "import yaml; ..."`) |
| Risk | Activity instruction is too vague to actually trigger orchestrator behavior change | Med | Activity wording specifies (a) target detection patterns, (b) specific resources to load (skill_authoring.md / agent_authoring.md / etc.), (c) WHEN (before first write) |
| Risk | Doc-only changes don't move the needle — orchestrators still ignore | Low | Phase 3 (CocoIndex canonical-priority) and Phase 4 (validator) reinforce; over time cross-skill load becomes habit |
| Risk | Asymmetric drift between auto and confirm YAMLs | Med | cli-codex prompt explicitly mirrors changes between both files; post-dispatch diff check |
| Dependency | 078/001 sk-code v3.2.0.0 shipped (provides resources to load) | Green | Just shipped |
| Dependency | sk-doc changelog template | Green | Used in 078/001 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Scope is concrete; finding IDs from 077 map directly to REQs.
<!-- /ANCHOR:questions -->

---

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
