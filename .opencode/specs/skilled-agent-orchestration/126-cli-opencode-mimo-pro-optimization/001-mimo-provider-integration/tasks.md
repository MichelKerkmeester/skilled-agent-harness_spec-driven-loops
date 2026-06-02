---
title: "Tasks: Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro integration [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mimo provider integration tasks"
  - "xiaomi-token-plan-ams task list"
  - "tasks"
  - "name"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/126-cli-opencode-mimo-pro-optimization/001-mimo-provider-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-001 shipped; strict validate PASSED"
    next_safe_action: "Proceed to 002 (already implemented) / 003 research"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro integration

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm live provider/model ids from the install (`opencode models xiaomi-token-plan-ams` → `xiaomi-token-plan-ams/mimo-v2.5-pro`; live one-shot probe returned cleanly with no `--agent`) — live slug used verbatim everywhere; probe confirmed responsive on opencode 1.15.13
- [x] T002 Re-read the existing `minimax-m3` / `minimax-2.7` registry entries (token-plan pattern to mirror) (`sk-prompt/assets/model-profiles.json`) — `mimo-v2.5-pro` entry mirrors the token-plan executor shape
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Registry: add `mimo-v2.5-pro` (provider `xiaomi-token-plan-ams`, quota_pool `xiaomi-token-plan`, slug `xiaomi-token-plan-ams/mimo-v2.5-pro`, `context_length: null`, status active); optionally add the free `opencode/mimo-v2.5-free` path; update the active-rotation description line; bump `version` (`sk-prompt/assets/model-profiles.json`) — entry added; `version` 1.3→1.4; free path documented in docs as a cheap path; jq-valid
- [x] T004 [P] cli_reference.md §4 pre-flight (detect `xiaomi-token-plan-ams`) + setup (`opencode auth login` → "Xiaomi Token Plan (Europe)") + `--agent` omission caveat (`cli-opencode/references/cli_reference.md`) — §4 XIAOMI_OK + MiMo routing table + login shape (no invented URL)
- [x] T005 [P] cli_reference.md §5 model rows (`xiaomi-token-plan-ams/mimo-v2.5-pro` + free `opencode/mimo-v2.5-free`) + `--variant` matrix (omitted/unverified, pending 126/003) (`cli-opencode/references/cli_reference.md`) — §5 provider row + free `opencode/mimo-v2.5-free` row + `--variant` unverified row
- [x] T006 SKILL.md auth options + pre-flight tree + login mention + model selection + `--agent` omission note + keyword header (`cli-opencode/SKILL.md`) — Keywords, Authentication options, §3 XIAOMI_OK, routing row, Model Selection, ALWAYS-rule 3 examples (version 1.3.4.0→1.3.5.0)
- [x] T007 [P] cli-opencode assets: prompt_templates.md MiMo dispatch contract (framework TBD — benchmarked in 126/004) + prompt_quality_card.md per-model placeholder (`cli-opencode/assets/`) — Template 15 added + per-model override; both flagged framework-pending 126/004
- [x] T008 [P] cli-opencode graph-metadata.json trigger phrases + key topics (MiMo / Xiaomi Token Plan) (`cli-opencode/graph-metadata.json`) — 7 trigger phrases + 3 key topics; jq-valid
- [x] T009 cli-opencode changelog: create new `vX.Y.Z.0.md` version file documenting the MiMo addition (`cli-opencode/changelog/`) — `v1.3.5.0.md` created
- [x] T010 sk-prompt-small-model: SKILL.md activation + dispatch matrix row + description.json + pattern-index.md provider/dispatch row + README.md provider mention + graph-metadata.json trigger phrases (`sk-prompt-small-model/`) — all 5 files updated; 5 trigger phrases; all JSON jq-valid
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 `jq` validate all touched JSON (model-profiles + both graph-metadata + description.json) — all PASS; `version` 1.4; `mimo-v2.5-pro` present
- [x] T012 `rg` confirm MiMo selectable rows present across cli-opencode + sk-prompt + sentinel; `context_length` null, `--variant`/framework marked pending; default `opencode-go/deepseek-v4-pro` unchanged — confirmed; slug `xiaomi-token-plan-ams/mimo-v2.5-pro` verbatim, placeholders honest, default unchanged
- [x] T013 `validate.sh --strict` on this folder passes (Errors 0, Warnings 0) — PASS (recorded this session)
- [ ] T014 advisor re-index so new triggers route (`advisor_rebuild` / `skill_advisor.py --force-refresh`) — DEFERRED: trigger phrases are committed to both graph-metadata.json files; re-index is an environment refresh, not a doc artifact, and was not run in this doc-closeout session
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]` (T001–T013); T014 advisor re-index deferred as a non-doc environment refresh, not blocked
- [x] No `[B]` blocked tasks remaining
- [x] `model-profiles.json` valid JSON and strict validation passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines) — Level 2 task tracking
-->
