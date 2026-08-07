---
title: "Session Handover: Speckit Command Goal Prompt Offer [template:handover.md]"
description: "Handover for phase 009 before command implementation begins, preserving scope, planned files, risks, and next safe actions."
trigger_phrases:
  - "speckit goal prompt handover"
  - "goal prompt offer handover"
  - "phase 009 handover"
importance_tier: "important"
contextType: "implementation"
---
# Session Handover: Speckit Command Goal Prompt Offer

Detailed handover for continuing phase 009 of the `/goal` OpenCode plugin packet. This document was created before command implementation edits so a future session can restart from a clean scope boundary.

<!-- SPECKIT_TEMPLATE_SOURCE: handover | v1.0 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Use this handover when resuming phase 009, reviewing the planned `/speckit:*` goal-prompt integration, or recovering after context compaction before command assets have been fully implemented and validated.

**Status values:** draft | in_progress | review | complete | archived
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:handover-summary -->
## 1. Handover Summary

- **From Session:** opencode goal-plugin phase 009 build session, 2026-07-01
- **To Session:** next OpenCode implementation session for phase 009
- **Phase Completed:** Planning checkpoint and phase scaffold created; implementation not started
- **Handover Time:** 2026-07-01T04:58:00Z
- **Recent action**: Created `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/` and captured this handover before editing `/speckit:*` command assets.
<!-- /ANCHOR:handover-summary -->

---

<!-- ANCHOR:context-transfer -->
## 2. Context Transfer

### 2.1 Key Decisions Made

| Decision | Rationale | Impact |
|---|---|---|
| Use phase 009 under the existing 032 goal-plugin packet | The requested work extends the same `/goal` plugin program and depends on phase 007 prompt generation plus phase 008 system-spec-kit docs. | Parent packet phase map, phase 009 docs, and packet metadata are in scope. |
| Put the user-facing offer in `/speckit:*` presentation contracts first | The command routers explicitly state that startup questions, dashboards, result displays, and next-step prompts live in `assets/*_presentation.txt`. | Presentation TXT files are primary edit targets; command Markdown remains thin. |
| Add machine-readable goal fields to workflow YAML assets | `:auto` and `:confirm` workflows need a stable contract for setup answers and non-blocking goal behavior. | All eight speckit YAML assets are in scope. |
| Keep goal setting optional and explicit | Automatically setting a session goal in `:auto` would mutate plugin state without a clear operator choice. | Default behavior should suggest/offer; only pre-bound or interactive set choices call `mk_goal`. |

### 2.2 Blockers Encountered

**Blockers**: none for implementation; worktree has unrelated dirty files that must stay out of this phase.

| Blocker | Status | Resolution/Workaround |
|---|---|---|
| Dirty worktree contains unrelated agent, deep-loop, package-lock, goal-state, and spec-031 changes | Open | Do not stage, revert, or edit unrelated files. Keep any future commit scoped to phase 009 and `/speckit:*` command goal-offer changes. |
| No dedicated handover file existed for phase 009 before implementation | Resolved | This `handover.md` is the first authored phase artifact. |

### 2.3 Files Modified

**Key files**: phase 009 scaffold files and this handover; command assets not yet modified at this checkpoint.

| File | Change Summary | Status |
|---|---|---|
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/spec.md` | Created by `create.sh`; still contains scaffold content to fill. | in_progress |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/plan.md` | Created by `create.sh`; still contains scaffold content to fill. | in_progress |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/tasks.md` | Created by `create.sh`; still contains scaffold content to replace with real tasks. | in_progress |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/implementation-summary.md` | Created by `create.sh`; should be filled after implementation. | in_progress |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/handover.md` | Created detailed continuation handover before implementation edits. | complete |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/spec.md` | `create.sh` appended phase 009 placeholder row and handoff placeholder. | in_progress |

### 2.4 Traps & Scar Tissue

| Trap / blast site | Activation condition | Load-bearing or defensive? | How to avoid re-paying it |
|---|---|---|---|
| Command routers are thin by design | Editing startup prompts directly in `.opencode/commands/speckit/*.md` instead of presentation assets | Load-bearing | Keep prompt wording, dashboard rows, and reply formats in `assets/*_presentation.txt`; routers only list boundaries and allowed tools. |
| `:auto` must not prompt by default | Adding a new required goal question without pre-bound defaults | Load-bearing | Add `goal_prompt_choice` with default `offer` or `skip` semantics and Tier 2=false unless explicitly ambiguous. |
| Goal mutation must remain optional | Calling `mk_goal` during setup without a user set choice or pre-bound field | Load-bearing | Only call `mk_goal({ action: "set" })` when `goal_prompt_choice=set`; otherwise render suggestion or skip. |
| Goal plugin state is runtime state | Writing `.opencode/skills/.goal-state/*` into docs or commits | Defensive | Use `mk_goal`/`mk_goal_status` only; do not manually read/write goal-state JSON for workflow implementation. |
| Presentation assets are plain text, not markdown docs | Running only command Markdown validation and skipping TXT assets | Defensive | Verify with targeted grep/diff and command-asset review, plus sk-doc on Markdown docs changed in the phase. |
<!-- /ANCHOR:context-transfer -->

---

<!-- ANCHOR:next-session -->
## 3. For Next Session

### 3.1 Recommended Starting Point

- **File:** `.opencode/commands/speckit/assets/speckit_plan_presentation.txt:11`
- **Next safe action**: Fill phase 009 spec/plan/tasks, then update the four presentation contracts with a shared optional goal-prompt setup field and dashboard row.
- **Cold-read order**: 1. `handover.md` -> 2. `spec.md` -> 3. `.opencode/commands/speckit/assets/speckit_plan_presentation.txt` -> 4. `.opencode/commands/speckit/assets/speckit_complete_presentation.txt` -> 5. `.opencode/commands/goal_opencode.md`
- **Context:** The user wants `/speckit:*` initial questions and dashboards to proactively offer writing or setting a goal prompt so the AI always proposes goal help without forcing it.

### 3.2 Priority Tasks Remaining

1. Replace phase 009 scaffold placeholders in `spec.md`, `plan.md`, and `tasks.md` with concrete scope and acceptance criteria.
2. Update `/speckit:plan`, `/speckit:complete`, `/speckit:implement`, and `/speckit:resume` presentation contracts to include optional goal prompt setup and dashboard status.
3. Add workflow YAML fields and router allowed-tool permissions so `mk_goal` and `mk_goal_status` can be used only when the setup choice requires them.
4. Fill `implementation-summary.md`, add packet changelog entry, refresh metadata, and run strict parent validation.

### 3.3 Critical Context to Load

- [x] Indexed save or continuity target: phase 009 uses the canonical packet path `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/`.
- [x] Spec file: `spec.md` sections 1-7 after scaffold replacement.
- [x] Plan file: `plan.md` sections 1-7 after scaffold replacement.
- [x] Command contracts: `.opencode/commands/speckit/*.md` and `.opencode/commands/speckit/assets/*_{presentation,auto,confirm}.*`.
<!-- /ANCHOR:next-session -->

---

<!-- ANCHOR:validation-checklist -->
## 4. Validation Checklist

Before handover, verify:
- [ ] All in-progress work committed or stashed
- [x] Current context captured in `handover.md`
- [x] No command implementation changes left half-applied at this checkpoint
- [ ] Tests passing for final implementation
- [x] This handover document is complete for the pre-implementation checkpoint
<!-- /ANCHOR:validation-checklist -->

---

<!-- ANCHOR:session-notes -->
## 5. Session Notes

The user selected existing packet option A and explicitly asked for a detailed handover first. Respect that ordering: this handover is created before the `/speckit:*` command assets are changed. The planned implementation should be small and presentation-led: update visible setup prompts, auto pre-bound fields, dashboards, YAML field contracts, and allowed tool surfaces. Do not change `mk-goal` runtime behavior unless verification reveals an actual incompatibility with the proposed command workflow.
<!-- /ANCHOR:session-notes -->
