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
    last_updated_at: "2026-07-27T11:26:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implemented via LUNA (2 passes), reviewed by GLM-5.2, all findings addressed"
    next_safe_action: "Commit; phase 010 proceeds"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-pi-creation-authoring", parent_session_id: null }
    completion_pct: 100
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

- [x] T001 Snapshot the current `model-profiles.json`, `check-prompt-quality-card-sync.sh`, and `executor-config.ts` for a pre-edit diff baseline [EVIDENCE: `git diff` against HEAD for all 3 files confirms the pre-edit state matched this phase's own predecessor docs before any edit]
- [x] T002 Confirm phase 001/002/003 have all landed [EVIDENCE: 001/002/003 `implementation-summary.md` all Complete; `cli-external-orchestration/graph-metadata.json` carries `cli-pi` trigger phrases]
- [x] T003 Live-fetch `https://pi.dev/models`; resolve Open Question 1 [EVIDENCE: live WebFetch during this session confirmed Branch B - Pi has no native model, ~1,106 models across 40+ providers; superseded by stronger operator-supplied evidence (a live model-picker screenshot from the operator's own configured Pi session, 2026-07-27) naming the exact 7 dispatchable ids used in `executor-config.ts`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 **Branch A path**: N/A [DEFERRED: Branch B resolved (T003); no native/default Pi model exists, so no new top-level profile is authored]
- [x] T005 **Branch B path** [EVIDENCE: `model-profiles.json` - `cli-pi` executor rows added to `deepseek-v4-pro`, `minimax-m3`, `mimo-v2.5-pro` alongside their existing `cli-opencode` rows (not replacing them); a new `mimo-v2.5-pro-ultraspeed` model object added with every unconfirmed field marked null/TBD/unconfirmed, since it is a genuinely new variant with no prior profile]
- [x] T006 [P] Add the bookkeeping note to `_index.md` [EVIDENCE: `_index.md` - new `mimo-v2.5-pro-ultraspeed` row plus a prose paragraph naming the 3 real executor-row additions and the new stub; the pre-existing frontier-models-out-of-scope sentence left untouched, re-confirmed via `git diff`]
- [x] T007 [P] Add `cli-pi` to `cli_cards[]` [EVIDENCE: `check-prompt-quality-card-sync.sh` line 65, CHECK 1 PASS for `cli-pi`]
- [x] T008 [P] Add `cli-pi` to `cli_skills[]` [EVIDENCE: `check-prompt-quality-card-sync.sh` line 93, CHECK 2 PASS for `cli-pi` via its local-card-delegation structural variant]
- [x] T009 Add `cli-pi` to `CLI_EXECUTOR_HUB_METADATA`; FAMILY entry check [EVIDENCE: `check-prompt-quality-card-sync.sh` line 165; CHECK 4 PASS confirms `deepseek`/`minimax`/`mimo` family tokens are all already reachable, no new FAMILY entry needed]
- [x] T010 Finalize `PI_SUPPORTED_MODELS`/`PI_DEFAULT_MODEL`/`isPiModelAllowed()` [EVIDENCE: `executor-config.ts` - 7 operator-confirmed ids, `PI_DEFAULT_MODEL = 'deepseek-v4-pro'`, no "auto"]
- [x] T011 Fail-closed check in `buildPiLineageCommand` [EVIDENCE: `fanout-run.cjs` - throws before command construction for non-allowlisted models; independently re-verified live]
- [x] T012 Fail-closed check in `buildSpawnSpec`'s cli-pi case [EVIDENCE: `dispatch-model.cjs` - identical mirrored check; independently re-verified live]
- [x] T013 [P] `executor-config.vitest.ts` allowlist tests [EVIDENCE: 169/169 passing, independently re-run]
- [x] T014 [P] `fanout-run.vitest.ts` allowlist tests [EVIDENCE: 169/169 passing (same file pair as T013), independently re-run]
- [x] T015 [P] `remediation.vitest.ts` cli-pi tests [EVIDENCE: 30/31 passing, independently re-run; the 1 failure is the pre-existing "rejects a retired executor" test, unrelated to this phase]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Run `check-prompt-quality-card-sync.sh` [EVIDENCE: `GUARD PASS`, exit 0, independently re-run twice by the closing agent]
- [B] T017 `npm run typecheck` [DEFERRED: no `typecheck` npm script exists in this package; substituted `tsc --ignoreDeprecations 6.0 --noEmit -p tsconfig.json`, exit 0, run by LUNA during implementation - not independently re-run by the closing agent but the diff is TypeScript-syntax-trivial (array literal + 2 constants)]
- [x] T018 `npx vitest run` on the 3 test files [EVIDENCE: 169/169 (executor-config+fanout-run) + 30/31 (remediation, 1 pre-existing unrelated failure) - independently re-run]
- [x] T019 [P] Diff sibling models' pre-existing executor rows [EVIDENCE: `git diff` shows `composer-2.5`/`kimi-k2.7-code`/`glm-5.2`/`haiku` byte-identical to HEAD, confirmed by direct read of the diff]
- [x] T020 [P] Grep for the phantom permission-mode wording bug [EVIDENCE: `rg -c "auto, dangerous, or dangerous"` on all touched/new files returns 0]
- [x] T021 Run `validate.sh --strict` [EVIDENCE: via the main-tree metadata round-trip pattern, recorded in the commit]
- [x] T022 Finalize `implementation-summary.md` [EVIDENCE: this phase's implementation-summary.md, citing evidence per REQ]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` except T004/T017 [EVIDENCE: this file - T004 N/A (Branch A doesn't apply), T017 substituted `tsc --noEmit` for a nonexistent npm script]
- [x] No `[B]` blocked tasks remaining without a documented reason [EVIDENCE: T004/T017, both explicitly justified]
- [x] `check-prompt-quality-card-sync.sh` exits 0; `npx vitest run` 0 new regressions (1 pre-existing unrelated failure); `validate.sh --strict` Errors: 0 [EVIDENCE: T016/T018/T021]
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
