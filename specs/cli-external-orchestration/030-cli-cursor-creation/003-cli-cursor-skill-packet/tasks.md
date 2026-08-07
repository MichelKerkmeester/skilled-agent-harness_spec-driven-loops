---
title: "Tasks: cli-cursor skill packet"
description: "Task breakdown for building cli-cursor as the 4th hub mode and wiring the hub registries."
trigger_phrases: ["cli-cursor skill packet tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/003-cli-cursor-skill-packet"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "Authored tasks.md for the planned cli-cursor skill-packet phase"
    next_safe_action: "Author checklist.md and decision-record.md"
    blockers: ["Phase 002 must land before implementation starts"]
    key_files: ["spec.md", "plan.md", "checklist.md", "decision-record.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: cli-cursor skill packet

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Capture the baseline `parent-skill-check.cjs` + `validate_skill_package.py` run (0 fails) before any edit
- [x] T002 Read the `create-skill` packet-level templates (`skill-md-template.md`, `skill-readme-template.md`) fresh — read `cli-codex/SKILL.md`+`README.md` as the direct conformant instance
- [x] T003 Create `cli-external-orchestration/cli-cursor/` with `references/`, `assets/`, `changelog/`, `manual-testing-playbook/` subdirectories
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Author `SKILL.md` (frontmatter `name: cli-cursor`, `version: "1.0.0.0"`, `allowed-tools`, hard_rules triad, §2 self-invocation guard, `command -v cursor-agent` probe)
- [x] T005 Author `README.md` (9-section AT A GLANCE → RELATED DOCUMENTS)
- [x] T006 [P] Author `references/cli-reference.md`, `integration-patterns.md`, `agent-delegation.md`, `cursor-tools.md`, `hook-contract.md`, `shared-editor-config.md` (kebab-case, ≥100 LOC each) — all 6 confirmed ≥100 LOC (92→119 after expanding shared-editor-config.md)
- [x] T007 [P] Author `assets/prompt-quality-card.md` (thin delegator) and `assets/prompt-templates.md`
- [x] T008 Wire `mode-registry.json` (`cli-cursor` `modes[]` entry; verify aliases don't collide case-folded with siblings) — check 3d-alias confirms 20/20 unique
- [x] T009 Wire `hub-router.json` (`routerSignals.cli-cursor` weight 4, vocab-class pair, append `tieBreak`)
- [x] T010 [P] Update hub `description.json` (keywords/trigger_examples/prose only), hub `SKILL.md` (mode-table + layout-tree rows), hub `graph-metadata.json` (derived arrays)
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T011 Regenerate `leaf-manifest.json` via `generate-leaf-manifest.cjs --write .opencode/skills/cli-external-orchestration`
- [x] T012 Confirm no `cli-cursor/graph-metadata.json` or `cli-cursor/description.json` exists anywhere under the packet — checks 2a/2b PASS
- [x] T013 Run `parent-skill-check.cjs` and `validate_skill_package.py`; both 0 fails — required fixing 2 real latent bugs the 4th mode exposed in the compiled-routing shadow-child harness (missing `cli-cursor/SKILL.md` source path; stale live-activation policy-hash pin), documented in `implementation-summary.md`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T014 `validate.sh 003-cli-cursor-skill-packet --strict` passes 0/0; SC-001..SC-004 met; write `implementation-summary.md`
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Depends on `../002-deep-loop-executor-support/`; blocks `../004-cursor-hook-adapter-layer/`.
- Structural precedent: `../../027-cli-codex-revival/003-cli-codex-skill-packet/`, `../../029-cli-devin-revival/003-cli-devin-skill-packet/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`, `decision-record.md`
