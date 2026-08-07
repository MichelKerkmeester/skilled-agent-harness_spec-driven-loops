---
title: "Tasks: cli-devin skill packet"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases: ["cli-devin skill tasks", "cli-devin mode task breakdown"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/003-cli-devin-skill-packet"
    last_updated_at: "2026-07-26T17:30:00Z"
    last_updated_by: "devin-cli"
    recent_action: "All 23 tasks completed; packet built, hub wired, validators 0/0"
    next_safe_action: "Update parent phase map; select next phase"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "decision-record.md", "implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-packet-build", parent_session_id: null }
    completion_pct: 100
    open_questions: []
    answered_questions: ["DEVIN_PROJECT_DIR is the confirmed active-session env-var signal (resolved ADR-002 open question)", "cli-devin is the 5th mode, not 4th, due to 030-cli-cursor-creation landing between authoring and implementation"]
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

All tasks below are complete — this phase is Implemented and validated.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the 0-fail/0-warning baseline: run `parent-skill-check.cjs` and `validate_skill_package.py` against the hub before any edit (`.opencode/skills/cli-external-orchestration/`) — baseline confirmed at 0 fails / 0 warnings against the 4-mode hub.
- [x] T002 Read the packet-level `create-skill` templates fresh: `skill-md-template.md`, `skill-readme-template.md` (`.opencode/skills/sk-doc/create-skill/assets/skill/`) — templates read; `cli-codex` packet used as structural precedent.
- [x] T003 Create the packet directory structure: `cli-devin/{references,assets,manual-testing-playbook,changelog}/` (`.opencode/skills/cli-external-orchestration/cli-devin/`) — 4 subdirectories created.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author `SKILL.md` from the packet template with the `hard_rules` triad, self-invocation guard, and `command -v devin` probe (`cli-devin/SKILL.md`) — 393 LOC; frontmatter `name: cli-devin`, `version: 1.0.0.0`, `allowed-tools: [Bash, Read, Glob, Grep]`; 3 hard_rules ids present.
- [x] T005 Author `README.md` from `skill-readme-template.md`, 9-section AT A GLANCE → RELATED DOCUMENTS shape (`cli-devin/README.md`) — 364 LOC; 9 sections in order.
- [x] T006 [P] Author `references/cli-reference.md` (kebab-case, ≥100 LOC) (`cli-devin/references/cli-reference.md`) — 605 LOC.
- [x] T007 [P] Author `references/integration-patterns.md` (`cli-devin/references/integration-patterns.md`) — 627 LOC.
- [x] T008 [P] Author `references/agent-delegation.md` (`cli-devin/references/agent-delegation.md`) — 414 LOC.
- [x] T009 [P] Author `references/devin-tools.md` (`cli-devin/references/devin-tools.md`) — 449 LOC.
- [x] T010 [P] Author `references/cloud-handoff.md` (`cli-devin/references/cloud-handoff.md`) — 359 LOC.
- [x] T011 [P] Author `assets/prompt-quality-card.md` as a thin delegator with the 3-tier precedence rule stated up front (`cli-devin/assets/prompt-quality-card.md`) — 82 LOC; opens with 3-tier precedence rule.
- [x] T012 [P] Author `assets/prompt-templates.md` (`cli-devin/assets/prompt-templates.md`) — 574 LOC.
- [x] T013 Wire `mode-registry.json`: add the `cli-devin` `modes[]` entry exactly per `spec.md` REQ-004 (`mode-registry.json`) — entry added with all 10 required fields; check 3b reports 5 modes.
- [x] T014 Wire `hub-router.json`: add `routerSignals.cli-devin`, a vocabulary-class pair, and append to `routerPolicy.tieBreak` (`hub-router.json`) — signal + 2 vocabulary classes + tieBreak entry added; 2 alias keywords added to satisfy compiled-routing compiler.
- [x] T015 Update the hub's own `description.json`: extend `keywords`/`trigger_examples`/prose, no `modes`/`backend_kinds` keys (`description.json`) — 6 new keywords + 4 new trigger_examples + prose updated; check 8b PASS.
- [x] T016 Update the hub's own `SKILL.md`: add the `cli-devin` mode-table row + layout-tree row (`SKILL.md`) — mode table row + layout tree row + "five" prose.
- [x] T017 Update the hub's own `graph-metadata.json`: extend `derived.key_files`/`entities`/`trigger_phrases`/`intent_signals` (`graph-metadata.json`) — all 6 derived arrays extended + `causal_summary` + `source_docs` + `last_updated_at`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T018 Regenerate `leaf-manifest.json`: `node .opencode/skills/sk-doc/create-skill/scripts/generate-leaf-manifest.cjs --write .opencode/skills/cli-external-orchestration` — regenerated; check 10b byte-drift PASS.
- [x] T019 Confirm no `executor-delegation.ts` code change is needed: re-verify `loadCliHubExecutors()` reads `mode-registry.json` dynamically at call time (`system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`) — confirmed by `parent-skill-check.cjs` 3b/3e passing with no `executor-delegation.ts` edit.
- [x] T020 Run `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/cli-external-orchestration` — confirm 0 fails / 0 warnings — PASS: 0 fails, 0 warnings; 5 modes; 25 aliases unique.
- [x] T021 Run `python3 .opencode/skills/sk-doc/create-skill/scripts/validate_skill_package.py .opencode/skills/cli-external-orchestration` — confirm 0 fails — PASS: all 3 sub-checks PASS (package_skill, compiled routing readiness, parent-skill-check).
- [x] T022 Confirm alias case-fold uniqueness across all 5 modes' alias arrays (manual diff / `rg`) — PASS: `check 3d-alias` reports 25/25 unique aliases across 5 modes.
- [x] T023 Confirm `hub-router.json`'s `routerPolicy.tieBreak` is an exact 5-element permutation matching all 5 registry `workflowMode` values — PASS: check 5e confirms tieBreak covers every registered mode; 5 elements.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 23 tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
- [x] Both validators report 0 fails against the whole hub
- [x] No `cli-devin/graph-metadata.json` or `cli-devin/description.json` exists anywhere under the new packet
- [x] `checklist.md` fully verified
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
