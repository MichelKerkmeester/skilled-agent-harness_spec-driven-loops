---
title: "Tasks: Devin model registry and quota restoration"
description: "Task breakdown for the model-registry and CI-gate restoration: swe-1.6 entry, 3 sibling executor rows, swe-1.6.md card, and the CI script's cli_cards/cli_skills/CLI_EXECUTOR_HUB_METADATA restorations."
trigger_phrases: ["devin model registry tasks"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/005-devin-model-registry-and-quota"
    last_updated_at: "2026-07-23T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the task breakdown for this Planned phase; no tasks executed yet."
    next_safe_action: "Begin Phase 1 (Setup): confirm the phase 003 predecessor precondition before any edit."
    blockers: ["T002 must confirm cli-devin's trigger_phrases are reachable in the hub's shared graph-metadata.json before Phase 2 starts, else Phase 3's CHECK 4 verification will fail."]
    key_files: ["sk-prompt/prompt-models/assets/model-profiles.json", "sk-prompt/prompt-models/references/models/swe-1.6.md", "system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Devin model registry and quota restoration

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Snapshot the current `model-profiles.json` and `check-prompt-quality-card-sync.sh` for a pre-edit diff baseline (`sk-prompt/prompt-models/assets/model-profiles.json`, `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`).
- [ ] T002 Confirm phase 003 has registered `cli-devin` in the hub's shared `graph-metadata.json` with `deepseek`/`kimi`/`glm` family tokens reachable in its `trigger_phrases`; if not yet landed, halt and escalate rather than proceeding (`cli-external-orchestration/graph-metadata.json`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Add the `swe-1.6` model entry to `model-profiles.json`: `executors: [{"executor": "cli-devin", "provider": "cognition", "quota_pool": "cognition-free", "status": "active"}]`, `primary_quota_pool: "cognition-free"`, `fallback_target: null`, `free_tier: true`, no `recommended_frameworks` key (mirrors `haiku`'s shape) {deps: T002} (`sk-prompt/prompt-models/assets/model-profiles.json`).
- [ ] T004 [P] Add one new `cli-devin` executor row to `deepseek-v4-pro`'s `executors[]`, leaving its existing `cli-opencode` row untouched {deps: T002} (`sk-prompt/prompt-models/assets/model-profiles.json`).
- [ ] T005 [P] Add one new `cli-devin` executor row to `kimi-k2.7-code`'s `executors[]` (current slug - do not use the archived `kimi-k2.6`), leaving its existing `cli-opencode` row untouched {deps: T002} (`sk-prompt/prompt-models/assets/model-profiles.json`).
- [ ] T006 [P] Add one new `cli-devin` executor row to `glm-5.2`'s `executors[]` (current slug - do not use the archived `glm-5.1`), leaving its existing `cli-opencode` row untouched {deps: T002} (`sk-prompt/prompt-models/assets/model-profiles.json`).
- [ ] T007 Recreate `references/models/swe-1.6.md` as a full model card (Overview, Identity, Reliability Notes with the re-verification caveat, Dispatch Notes, See Also) matching the sibling cards' frontmatter and section conventions; document the sequential-thinking 2-layer pattern (one-time `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` at user scope, plus a `system_instructions` mandate in the agent config - never a top-level `mcp_servers` recipe field) {deps: T003} (`sk-prompt/prompt-models/references/models/swe-1.6.md`).
- [ ] T008 [P] Restore the `cli-devin` entry in `check-prompt-quality-card-sync.sh`'s `cli_cards[]` array (current 2-entry array becomes 3; verify the exact current line against the live file, not the stale archived line 63) (`system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`).
- [ ] T009 [P] Restore the `cli-devin` entry in `check-prompt-quality-card-sync.sh`'s `cli_skills[]` array (verify the exact current line against the live file, not the stale archived line 93) (`system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`).
- [ ] T010 Add a `"cli-devin": "cli-external-orchestration/graph-metadata.json"` entry to `check-prompt-quality-card-sync.sh`'s `CLI_EXECUTOR_HUB_METADATA` dict, so CHECK 4 resolves `cli-devin` through the shared hub identity rather than a nonexistent per-skill file {deps: T004, T005, T006} (`system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T011 Run `bash check-prompt-quality-card-sync.sh`; confirm `GUARD PASS` with all 4 checks passing, including CHECK 4 for the 3 sibling models' new `cli-devin` rows {deps: T003-T010}.
- [ ] T012 [P] Diff the 3 sibling models' `cli-opencode` executor rows against the T001 pre-edit baseline; confirm byte-identical (regression guard) {deps: T004, T005, T006}.
- [ ] T013 [P] Grep `swe-1.6.md` (and any other touched prose) for the phantom permission-mode wording bug ("auto, dangerous, or dangerous"); confirm 0 matches {deps: T007}.
- [ ] T014 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`; confirm Errors: 0 {deps: T011-T013}.
- [ ] T015 Finalize `implementation-summary.md` with citable evidence for every REQ in `spec.md`; reconcile completion metadata {deps: T014}.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] `check-prompt-quality-card-sync.sh` exits 0; `validate.sh --strict` Errors: 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Predecessor**: `../004-devin-hook-adapter-layer/tasks.md`
- **Successor**: `../006-devin-manual-testing-playbook/tasks.md`
<!-- /ANCHOR:cross-refs -->
