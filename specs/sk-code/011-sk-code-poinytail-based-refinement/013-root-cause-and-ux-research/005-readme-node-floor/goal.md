---
title: "Goal: Phase 5: readme-node-floor"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/005-readme-node-floor"
    last_updated_at: "2026-10-10T19:40:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-005-readme-node-floor"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 5: readme-node-floor

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the root README's Node prerequisite match the floor its own install steps require, so an adopter on Node 20.11 to 20.18 is told before installing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Only the root README changes; package engines are not raised without a dependency that needs it. |
| D2 | The advisor runtime's missing engines field is handed to its owning track instead of edited here. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `sed -n 160p README.md`, run from the repository root, prints `- Node.js 20.19+ (22.12+ for the spec-kit runtime CLI)`.
- [x] `grep -c '20\.11' README.md`, run from the repository root, prints 0.
- [x] `grep -c '"node": ">=20.11.0"' .skilled/skills/system-spec-kit/package.json`, run from the repository root, prints 1.
- [x] `python3 -I .skilled/skills/sk-doc/shared/scripts/validate_document.py README.md 2>&1 | head -1`, run from the repository root, prints `✅ VALID: README.md`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/005-readme-node-floor --strict`, run from the repository root, prints RESULT: PASSED.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Floor recheck | Done | spec-kit lockfile: strictest non-optional floor `^18.18.0 || ^20.9.0 || >=21.1.0`; advisor runtime lockfile: rolldown and vite `^20.19.0 || >=22.12.0` (dev, installed by default) |
| Line replaced | Done | cli-pi build; diff is one line |
| README validator | Done | VALID, total issues 0 |

### Deviations and findings

| Item | Note |
|------|------|
| Scope narrowed from the research | The research proposed raising `system-spec-kit/package.json` engines. Its lockfile needs only 20.9, so that change would have turned away supported users. Only the README line changed |
| Handoff | The advisor runtime `package.json` declares no `engines`, so npm never warns at its own install. That file is the skill-authoring track's |
| No version bump | The root README belongs to no skill |
<!-- /ANCHOR:log -->
