---
title: "Tasks: Pi model registry and routing"
description: "Task breakdown for resolving Pi's registry shape (Branch A/B), authoring the registry contribution, extending the CI gate arrays, and finalizing the fail-closed PI_SUPPORTED_MODELS allowlist in this same phase."
trigger_phrases:
  - "cli-pi model registry tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/009-pi-model-registry-and-routing"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planning-only task breakdown"
    next_safe_action: "Begin Phase 1 (Setup): confirm the phase 001/002/003 predecessor preconditions before any edit"
    blockers: ["T002 must confirm cli-pi's trigger_phrases are reachable in the hub's shared graph-metadata.json before Phase 2 starts, else Phase 3's CHECK 4 verification will fail", "T003 (live pi.dev/models fetch) must resolve Branch A vs Branch B before any registry file is edited"]
    key_files: ["sk-prompt/prompt-models/assets/model-profiles.json", "system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh", "system-deep-loop/runtime/lib/deep-loop/executor-config.ts"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Pi model registry and routing

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

- [ ] T001 Snapshot the current `model-profiles.json`, `check-prompt-quality-card-sync.sh`, and `executor-config.ts` for a pre-edit diff baseline (`sk-prompt/prompt-models/assets/model-profiles.json`, `system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`, `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`).
- [ ] T002 Confirm phase 001 (live pi CLI facts), phase 002 (`buildPiLineageCommand`/`EXECUTOR_KINDS` includes `cli-pi`), and phase 003 (`cli-pi` registered in the hub's shared `graph-metadata.json`, `cli-pi/assets/prompt-quality-card.md` shipped) have all landed; if any has not, halt and escalate rather than proceeding (`cli-external-orchestration/graph-metadata.json`, `system-deep-loop/runtime/lib/deep-loop/executor-config.ts`).
- [ ] T003 Live-fetch `https://pi.dev/models` (plus the Providers / Custom Models / Custom Providers docs pages); resolve Open Question 1 (Branch A: Pi has a native/default model needing a new profile, vs. Branch B: Pi is purely provider-passthrough) with cited evidence, not a guess {deps: T002}.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 **Branch A path**: if T003 resolves Branch A, author `references/models/<pi-model-id>.md` mirroring `composer-2.5.md`'s 8-section shape (Overview/Identity/Recommended Framework/Benchmark Evidence/Tuned Template Snippet/Dispatch Gotchas/See Also); every unexposed numeric/behavioral field is an explicit TBD marker {deps: T003} (`sk-prompt/prompt-models/references/models/<id>.md`).
- [ ] T005 **Branch B path**: if T003 resolves Branch B, add a `cli-pi` executor row to each already-profiled model Pi is live-confirmed to dispatch, leaving every existing executor row untouched; add an explanatory note to `_index.md` rather than a new top-level entry {deps: T003} (`sk-prompt/prompt-models/assets/model-profiles.json`, `sk-prompt/prompt-models/references/models/_index.md`).
- [ ] T006 [P] Add the resolved model row (Branch A) or the bookkeeping-only note (Branch B) to `references/models/_index.md` {deps: T004, T005} (`sk-prompt/prompt-models/references/models/_index.md`).
- [ ] T007 [P] Add `cli-pi` to `check-prompt-quality-card-sync.sh`'s `cli_cards[]` array (current 3-entry array becomes 4; verify against the live file's current line numbers, not the numbers cited in this phase's planning docs) (`system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`).
- [ ] T008 [P] Add `cli-pi` to `check-prompt-quality-card-sync.sh`'s `cli_skills[]` array (`system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`).
- [ ] T009 Add a `"cli-pi": "cli-external-orchestration/graph-metadata.json"` entry to `check-prompt-quality-card-sync.sh`'s `CLI_EXECUTOR_HUB_METADATA` dict; add a `FAMILY` dict entry if the resolved model id's first hyphen-segment isn't already a reachable token {deps: T004, T005} (`system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh`).
- [ ] T010 Finalize `PI_SUPPORTED_MODELS` (hard, curated, non-empty array; live-confirmed ids only, no `"auto"`), `PI_DEFAULT_MODEL` (one specific allowlisted id), and `isPiModelAllowed()` in `executor-config.ts` {deps: T002, T003} (`system-deep-loop/runtime/lib/deep-loop/executor-config.ts`).
- [ ] T011 Add the fail-closed allowlist rejection check to `buildPiLineageCommand`, mirroring `buildCursorLineageCommand`'s pattern (`if (!PI_ALLOWED_MODELS.has(model)) throw inputError(...)`); default an omitted model to `PI_DEFAULT_MODEL` {deps: T010} (`system-deep-loop/runtime/scripts/fanout-run.cjs`).
- [ ] T012 Add the identical fail-closed check to the cli-pi case of `buildSpawnSpec`; same default {deps: T010} (`system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs`).
- [ ] T013 [P] Update `executor-config.vitest.ts`: add allowlist accept/reject tests for `cli-pi`, mirroring the cli-cursor `describe('CURSOR_SUPPORTED_MODELS / isCursorModelAllowed')` block shape {deps: T010} (`system-deep-loop/runtime/tests/unit/executor-config.vitest.ts`).
- [ ] T014 [P] Update `fanout-run.vitest.ts`: add `'accepts every model in the enforced allowlist'` and `'rejects a model outside the enforced allowlist'` tests for `cli-pi` {deps: T011} (`system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts`).
- [ ] T015 [P] Update `remediation.vitest.ts`: add fixtures and an allowlist-rejection test for the cli-pi dispatch case {deps: T012} (`system-deep-loop/deep-improvement/scripts/model-benchmark/tests/remediation.vitest.ts`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Run `bash check-prompt-quality-card-sync.sh`; confirm `GUARD PASS` with all 4 checks passing, including CHECK 4 for `cli-pi`'s rows {deps: T004-T009}.
- [ ] T017 `npm run typecheck` (system-deep-loop/runtime package); confirm 0 errors {deps: T010}.
- [ ] T018 `npx vitest run` on the 3 affected test files; confirm 0 new regressions {deps: T013-T015}.
- [ ] T019 [P] Diff any touched sibling model's pre-existing executor rows against the T001 pre-edit baseline; confirm byte-identical (regression guard) {deps: T005}.
- [ ] T020 [P] Grep every new/modified file for the phantom permission-mode wording bug ("auto, dangerous, or dangerous"); confirm 0 matches {deps: T004-T012}.
- [ ] T021 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`; confirm Errors: 0 {deps: T016-T020}.
- [ ] T022 Finalize `implementation-summary.md` with citable evidence for every REQ in `spec.md`; reconcile completion metadata {deps: T021}.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`.
- [ ] No `[B]` blocked tasks remaining.
- [ ] `check-prompt-quality-card-sync.sh` exits 0; `npx vitest run` 0 new regressions; `validate.sh --strict` Errors: 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Predecessor**: `../008-pi-hook-extension-layer/tasks.md`
- **Successor**: `../010-pi-manual-testing-playbook/tasks.md`
- Structural precedent: `../../030-cli-cursor-creation/005-cursor-model-registry-and-routing/tasks.md` + `../../030-cli-cursor-creation/008-cursor-model-allowlist/tasks.md` (this phase folds both together)
<!-- /ANCHOR:cross-refs -->
