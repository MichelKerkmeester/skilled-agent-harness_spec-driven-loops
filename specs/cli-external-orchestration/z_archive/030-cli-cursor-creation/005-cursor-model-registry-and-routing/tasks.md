---
title: "Tasks: Cursor model registry and routing"
description: "Task breakdown for the Cursor model registry and routing phase."
trigger_phrases: ["cli-cursor model registry tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/030-cli-cursor-creation/005-cursor-model-registry-and-routing"
    last_updated_at: "2026-07-24T04:16:30Z"
    last_updated_by: "claude-code"
    recent_action: "All 9 tasks complete; sync gate GUARD PASS"
    next_safe_action: "Update checklist.md and spec.md, write implementation-summary.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-cursor-creation-authoring", parent_session_id: null }
    completion_pct: 90
    open_questions: []
    answered_questions: ["Composer-only vs. hosted-frontier executor rows: Composer-only."]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Cursor model registry and routing

<!-- ANCHOR:notation -->
## Task Notation
`T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read `references/models/glm-5.2.md` (benchmark-heavy) then `references/models/deepseek-v4-pro.md` (187 lines, 8-section unbenchmarked-model shape) as the structural template — deepseek-v4-pro chosen over glm-5.2 since Composer, like DeepSeek, has zero prior dispatch data.
- [x] T002 Resolved: **Composer-only**. `model-profiles.json`'s own description scopes it as "Shared small-model profile registry for cli-opencode dispatch"; `_index.md` already stated "Frontier models (Opus, Sonnet, gpt-5.5) are out of scope" before this phase. None of Cursor's hosted frontier ids (`gpt-5.6-sol-*`, `claude-opus-4-8-*`, `cursor-grok-4.5-*`, confirmed live via `cursor-agent --list-models` 2026-07-24) were already present in the registry, and creating new entries for them would expand scope beyond a per-provider prompt-craft registry. Only Composer — the one genuinely new, Cursor-exclusive model — gets a profile; `_index.md` line 41 updated to state this explicitly.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T003 Authored `references/models/composer-2.5.md` (renamed from the originally-planned `composer.md` — `check-prompt-quality-card-sync.sh` CHECK 3 requires the profile filename to exactly match the registry `id`, i.e. `composer-2.5.md`). Auth-gated fields (context window, pricing) carry explicit TBD/unconfirmed markers, not fabricated numbers.
- [x] T004 [P] Added Composer row to `references/models/_index.md` (`references/models/_index.md:31`).
- [x] T005 [P] Added `composer-2.5` entry to `assets/model-profiles.json` (executor `cli-cursor`, provider `cursor`, quota_pool `cursor-subscription`); bumped registry `version` 1.5 → 1.6 and updated the top-level `description`.
- [x] T006 Added `cli-cursor` to all 3 coverage points in `check-prompt-quality-card-sync.sh`: the `cli_cards` array (line 61-65), the `cli_skills` array (line 91), and the `CLI_EXECUTOR_HUB_METADATA` Python dict (line 152-156).
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T007 Ran `check-prompt-quality-card-sync.sh` — `GUARD PASS — tables not inlined, Tier-3 pointer-only, registry complete, all models discoverable` (all 4 checks PASS, including the new `cli-cursor` rows).
- [x] T008 `grep -n -i "TBD\|unconfirmed" composer-2.5.md` confirms context window, avg iteration wall-clock, and context budget all carry explicit TBD/unconfirmed markers — no fabricated number.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] T009 `validate.sh 005-cursor-model-registry-and-routing --strict` passes 0/0; SC-001..SC-003 met; `implementation-summary.md` written.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- Depends on phase 003's `cli-cursor/assets/prompt-quality-card.md` existing for the sync gate.
- Structural precedent: `../../029-cli-devin-revival/005-devin-model-registry-and-quota/`.
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md`
