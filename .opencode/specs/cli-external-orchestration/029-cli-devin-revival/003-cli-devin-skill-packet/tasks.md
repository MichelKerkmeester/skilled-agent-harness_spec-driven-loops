---
title: "Tasks: cli-devin skill packet"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["cli-devin skill tasks", "cli-devin mode task breakdown"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/003-cli-devin-skill-packet"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for the planned cli-devin skill-packet phase"
    next_safe_action: "Author checklist.md and decision-record.md for this phase"
    blockers: ["Phase 002 (deep-loop-executor-support) must land and pass validate.sh --strict before this phase's implementation starts, per the parent packet's Phase Transition Rules"]
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-devin skill packet

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|---|---|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

All tasks below are unchecked — this phase is Planned, not yet implemented.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the 0-fail/0-warning baseline: run `parent-skill-check.cjs` and `validate_skill_package.py` against the hub before any edit (`.opencode/skills/cli-external-orchestration/`)
- [ ] T002 Read the packet-level `create-skill` templates fresh: `skill-md-template.md`, `skill-readme-template.md` (`.opencode/skills/sk-doc/create-skill/assets/skill/`)
- [ ] T003 Create the packet directory structure: `cli-devin/{references,assets,manual-testing-playbook,changelog}/` (`.opencode/skills/cli-external-orchestration/cli-devin/`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `SKILL.md` from the packet template with the `hard_rules` triad, self-invocation guard, and `command -v devin` probe (`cli-devin/SKILL.md`)
- [ ] T005 Author `README.md` from `skill-readme-template.md`, 9-section AT A GLANCE → RELATED DOCUMENTS shape (`cli-devin/README.md`)
- [ ] T006 [P] Author `references/cli-reference.md` (kebab-case, ≥100 LOC) (`cli-devin/references/cli-reference.md`)
- [ ] T007 [P] Author `references/integration-patterns.md` (`cli-devin/references/integration-patterns.md`)
- [ ] T008 [P] Author `references/agent-delegation.md` (`cli-devin/references/agent-delegation.md`)
- [ ] T009 [P] Author `references/devin-tools.md` (`cli-devin/references/devin-tools.md`)
- [ ] T010 [P] Author `references/cloud-handoff.md` (`cli-devin/references/cloud-handoff.md`)
- [ ] T011 [P] Author `assets/prompt-quality-card.md` as a thin delegator with the 3-tier precedence rule stated up front (`cli-devin/assets/prompt-quality-card.md`)
- [ ] T012 [P] Author `assets/prompt-templates.md` (`cli-devin/assets/prompt-templates.md`)
- [ ] T013 Wire `mode-registry.json`: add the `cli-devin` `modes[]` entry exactly per `spec.md` REQ-004 (`mode-registry.json`)
- [ ] T014 Wire `hub-router.json`: add `routerSignals.cli-devin`, a vocabulary-class pair, and append to `routerPolicy.tieBreak` (`hub-router.json`)
- [ ] T015 Update the hub's own `description.json`: extend `keywords`/`trigger_examples`/prose, no `modes`/`backend_kinds` keys (`description.json`)
- [ ] T016 Update the hub's own `SKILL.md`: add the `cli-devin` mode-table row + layout-tree row (`SKILL.md`)
- [ ] T017 Update the hub's own `graph-metadata.json`: extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals` (`graph-metadata.json`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Regenerate `leaf-manifest.json`: `node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/cli-external-orchestration`
- [ ] T019 Confirm no `executor-delegation.ts` code change is needed: re-verify `loadCliHubExecutors()` reads `mode-registry.json` dynamically at call time (`system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`)
- [ ] T020 Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` — confirm 0 fails / 0 warnings
- [ ] T021 Run `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/cli-external-orchestration` — confirm 0 fails
- [ ] T022 Confirm alias case-fold uniqueness across all 4 modes' alias arrays (manual diff / `rg`)
- [ ] T023 Confirm `hub-router.json`'s `routerPolicy.tieBreak` is an exact 4-element permutation matching all 4 registry `workflowMode` values
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 23 tasks marked `[x]` with evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] Both validators report 0 fails against the whole hub
- [ ] No `cli-devin/graph-metadata.json` or `cli-devin/description.json` exists anywhere under the new packet
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- `../002-deep-loop-executor-support/spec.md` (predecessor)
- `../004-devin-hook-adapter-layer/spec.md` (successor)
- `../../027-cli-codex-revival/003-cli-codex-skill-packet/` (structural precedent)
<!-- /ANCHOR:cross-refs -->
