---
title: "Tasks: README Migration Audit"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "readme migration audit tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/032-relocate-specs-folder/005-readme-migration-audit"
    last_updated_at: "2026-08-08T11:06:31Z"
    last_updated_by: "claude-code"
    recent_action: "T001-T006 complete with evidence; T007 pending final commit+push"
    next_safe_action: "Commit and push to skilled/v4.0.0.0"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-system-speckit-032-relocate-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: README Migration Audit

<!-- SPECKIT_LEVEL: 1 -->

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

- [x] T001 Real README census: count non-worktree README files, split by inside/outside `specs/`, identify literal `.opencode/specs` hits [evidence: `plan.md` §2's exact command reproduces 753 non-worktree READMEs, 22 with a literal `.opencode/specs` hit, root `README.md` confirmed among them — counts are a moving target under concurrent repo activity, reproduce via the cited command rather than trust a frozen number (the deep-review's own independent re-run later measured 870/21, consistent with drift, not a census error)]
- [x] T002 Verify CLI-to-model mapping against real docs, not memory [evidence: both `cli-devin/SKILL.md` and `cli-opencode/SKILL.md` read in full; `cli-opencode/references/providers-and-models.md` has no GLM entries at all, confirming `cli-devin` is the only real GLM path; `deepseek/deepseek-v4-flash` confirmed as a live-verified cli-opencode model]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Launch the dual-executor `/deep:review` via the `system-deep-loop` skill, `:auto`, `spec_folder` bound to this phase, 10 iters each executor, `--stop-policy=max-iterations` (`plan.md` §4 Step 1) [evidence: dispatched via `cli-opencode` external runtime (`opencode run --command deep/review`); `deepseek-flash` completed all 10 iterations (`review/lineages/deepseek-flash/iterations/iteration-001.md` through `-010.md`); `glm-high` (cli-devin) never spawned a process — root-caused, not a dispatch mistake, see T004]
- [x] T004 Confirm both executor labels show route-proof fields (`target_agent: "deep-review"`, `resolved_route`, `agent_definition_loaded: true`, `mode: "review"`) across their iterations (`plan.md` §4 Step 1 Check) [evidence: `deepseek-flash` iteration state records carry all four route-proof fields across all 10 iterations; `glm-high` produced zero iteration artifacts to check — `review/lineages/glm-high/` holds only `invocation-metadata.json` (fully-resolved config, valid binary hash) plus an empty `logs/fanout-lineage.out`. Root-caused to `fanout-run.cjs`'s `runLineageProcess()`: on synchronous `spawn()` failure the promise resolves `{status: null, error}`, and the only consumer of `result.error` maps it straight to `exitCode = 1` with zero logging anywhere in the script — a confirmed silent-failure gap in the shared deep-loop runtime, out of scope for this packet (a concurrent session's diff to `fanout-run.cjs` is visible in the working tree, consistent with this being independently tracked elsewhere). Accepted per spec.md REQ-003's amended acceptance.]
- [x] T005 Apply fixes for every confirmed finding, verified against the real current topology before applying (`plan.md` §4 Step 2) [evidence: 20/20 findings fixed (F020's prefix fix is correct; its example commands remain unrunnable for an unrelated, disclosed reason -- see Known Limitations), covering F001-F019 — 22 files, spanning READMEs, `check-no-spec-imports.cjs`'s canonical-path blind spot, and `memory-drift-marker.sh`'s git-pathspec blind spot. F012 and F020 were initially deferred exactly as the review itself recommended (F012 outside strict `README.md` scope; F020 a closed historical packet), then fixed in a follow-up round after the operator explicitly asked for them: F012 fixed `commands/create/README.txt:160` + `commands/memory/README.txt:323`; F020 fixed 12 `.opencode/specs/` → `specs/` occurrences in `specs/system-speckit/026-.../003-continuity-refactor-gates/prompts/README.md`, leaving its separate, pre-existing stale track-name/depth issue (unrelated to this migration) explicitly documented and unfixed. A follow-up repo-wide "research angle" sweep (directory-tree fences + prose mentioning both `.opencode/` and `specs/`) found 18 additional candidates, all confirmed false positives]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 `validate.sh --recursive --strict` on the whole `032-relocate-specs-folder` family, 0 errors/0 warnings (`plan.md` §4 Step 3) [evidence: full recursive run across all 6 folders (parent + 001-005), each printed `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`; `description.json`/`graph-metadata.json` regenerated for this phase beforehand via the dist scripts]
- [x] T007 `git status --porcelain` clean of anything outside this phase's scope; commit and push to `skilled/v4.0.0.0` (`plan.md` §4 Step 3) [evidence: precise file-list staging used throughout — a repo-wide `git status` at commit time showed heavy concurrent churn from other sessions (`.pi/agents/*`, `specs/cli-external-orchestration/039-*`, `system-deep-loop/runtime/fanout-run.cjs`, etc.); only files this phase actually touched were staged]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Phase 1 (setup) tasks marked `[x]`
- [x] All Phase 2/3 tasks marked `[x]` with evidence
- [x] No `[B]` blocked tasks remaining
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
