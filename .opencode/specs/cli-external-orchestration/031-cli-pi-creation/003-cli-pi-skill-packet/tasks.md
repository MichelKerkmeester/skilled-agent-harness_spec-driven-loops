---
title: "Tasks: cli-pi skill packet"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "cli-pi skill tasks"
  - "cli-pi mode task breakdown"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/003-cli-pi-skill-packet"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "pi-cli-authoring"
    recent_action: "Tasks authored (Planned): 23 tasks across Setup/Implementation/Verification, none started."
    next_safe_action: "Do not begin T001 until phase 001 and phase 002 land"
    blockers:
      - "phase 001 (pi-contract-pin) not yet executed"
      - "phase 002 (deep-loop-executor-support) not yet landed"
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-packet-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: cli-pi skill packet

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

All tasks below are pending — this phase is Planned, not started. Implementation is gated on phase 001 (`pi-contract-pin`) live-verifying the Pi CLI and phase 002 (`deep-loop-executor-support`) landing `ExecutorKind` support for `cli-pi`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm the 0-fail/0-warning baseline: run `parent-skill-check.cjs` and `validate_skill_package.py` against the hub before any edit (`.opencode/skills/cli-external-orchestration/`) — baseline re-confirmed live today, 2026-07-27, during this planning pass at 0 fails / 0 warnings / 5 modes / 25 unique aliases; re-run again immediately before implementation-time edits begin.
- [ ] T002 Read the packet-level `create-skill` templates fresh: `skill-md-template.md`, `skill-readme-template.md` (`.opencode/skills/sk-doc/create-skill/assets/skill/`) — `cli-devin`/`cli-cursor` packets are the confirmed structural precedents to mirror.
- [ ] T003 Create the packet directory structure: `cli-pi/{references,assets,manual-testing-playbook,changelog}/` (`.opencode/skills/cli-external-orchestration/cli-pi/`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `SKILL.md` from the packet template with the `hard_rules` triad (`pi-availability-required`/`self-invocation-prohibited`/`deep-loop-runtime-required`), the Section 2 self-invocation guard, and a `command -v pi` probe (`cli-pi/SKILL.md`).
- [ ] T005 Author `README.md` from `skill-readme-template.md`, 9-section AT A GLANCE → RELATED DOCUMENTS shape (`cli-pi/README.md`).
- [ ] T006 [P] Author `references/cli-reference.md` (kebab-case, ≥100 LOC) (`cli-pi/references/cli-reference.md`).
- [ ] T007 [P] Author `references/integration-patterns.md` (`cli-pi/references/integration-patterns.md`).
- [ ] T008 [P] Author `references/agent-delegation.md` — documents the third-party `pi-subagents` bridge concept; the actual translation of `.claude/agents/*.md` is phase 006's job (`cli-pi/references/agent-delegation.md`).
- [ ] T009 [P] Author `references/native-skills-and-extensions.md` — Pi's native `SKILL.md`/prompt-template/extension discovery surfaces (`cli-pi/references/native-skills-and-extensions.md`).
- [ ] T010 [P] Author `references/mcp-and-third-party-packages.md` — `pi-mcp-extension`/`pi-subagents`, documented-only HTTP transport, stdio gap flagged UNCONFIRMED (`cli-pi/references/mcp-and-third-party-packages.md`).
- [ ] T011 [P] Author `assets/prompt-quality-card.md` as a thin delegator with the 3-tier precedence rule stated up front (`cli-pi/assets/prompt-quality-card.md`).
- [ ] T012 [P] Author `assets/prompt-templates.md` (`cli-pi/assets/prompt-templates.md`).
- [ ] T013 Wire `mode-registry.json`: add the `cli-pi` `modes[]` entry exactly per `spec.md` REQ-004 (`mode-registry.json`).
- [ ] T014 Wire `hub-router.json`: add `routerSignals.cli-pi`, a vocabulary-class pair, and append to `routerPolicy.tieBreak` (`hub-router.json`).
- [ ] T015 Update the hub's own `description.json`: extend `keywords`/`trigger_examples`/prose, no `modes`/`backend_kinds` keys (`description.json`).
- [ ] T016 Update the hub's own `SKILL.md`: add the `cli-pi` mode-table row + layout-tree row + "six modes" prose (`SKILL.md`).
- [ ] T017 Update the hub's own `graph-metadata.json`: extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals` (`graph-metadata.json`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T018 Regenerate `leaf-manifest.json`: `node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/cli-external-orchestration`.
- [ ] T019 Confirm no `executor-delegation.ts` code change is needed: re-verify `loadCliHubExecutors()` reads `mode-registry.json` dynamically at call time (`system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`) — do not assume this from the spec alone.
- [ ] T020 Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` — confirm 0 fails / 0 warnings at 6 modes.
- [ ] T021 Run `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/cli-external-orchestration` — confirm 0 fails.
- [ ] T022 Confirm alias case-fold uniqueness across all 6 modes' alias arrays (manual diff / `rg`) — confirm no bare `"pi"` token exists anywhere in the new alias array (spec.md REQ-006).
- [ ] T023 Confirm `hub-router.json`'s `routerPolicy.tieBreak` is an exact 6-element permutation matching all 6 registry `workflowMode` values.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All 23 tasks marked `[x]` with evidence
- [ ] No `[B]` blocked tasks remaining
- [ ] Both validators report 0 fails against the whole hub at 6 modes
- [ ] No `cli-pi/graph-metadata.json` or `cli-pi/description.json` exists anywhere under the new packet
- [ ] `checklist.md` fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- `../002-deep-loop-executor-support/spec.md` (predecessor)
- `../004-pi-skill-discovery-bridge/spec.md` (successor)
- `../../029-cli-devin-revival/003-cli-devin-skill-packet/` (structural precedent)
- `../../030-cli-cursor-creation/003-cli-cursor-skill-packet/` (structural precedent)
<!-- /ANCHOR:cross-refs -->
