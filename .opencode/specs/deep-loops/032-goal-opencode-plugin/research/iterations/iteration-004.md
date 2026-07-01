# Iteration 004 — Per-phase `plan.md`/`tasks.md` task-level drift (phases 001, 002, 004–008)

**Segment:** 1 | **Iteration:** 4 of 15 | **Mode:** research | **newInfoRatio:** 0.72

---

## Focus

Execute the carried focus since iteration 2: read every in-scope phase's `tasks.md` (and `plan.md` for phase 001) to find **task-level** drift — completion-claim mismatches, cross-reference errors, and verification gaps — beyond the spec-level map produced in iteration 1. Phase 003 was handled in iteration 2 (the command-namespace findings F-005/F-006); this iteration covers 001, 002, 004, 005, 006, 007, 008.

---

## Actions Taken

1. **Read `plan.md` + `tasks.md` for phase 001 (state-store)** — fully `[x]`, 100%, state helpers (`ensureGoalStateDir`, `goalPathForSession`, `readGoal`, `writeGoalAtomic`, `mutateGoal`, `setGoal`, `clearGoal`) + two test files. No task-level drift.
2. **Read `tasks.md` for phases 002, 004, 005, 006, 007, 008** (6 parallel reads). All claim 100% / all `[x]`, but three carry hidden caveats (see Findings F-010, F-012, O-003).
3. **Globbed `.opencode/commands/*`** to settle the `goal.md` vs `opencode_goal.md` cross-reference: confirmed ONLY `opencode_goal.md` exists; `goal.md` does **not**.
4. **Globbed phase-008 deliverables** (`references/hooks/goal_plugin.md`, `feature_catalog/18--ux-hooks/*`, `manual_testing_playbook/18--ux-hooks/*`): all three goal files **exist** — resolves the carried F-008 doc-deliverable verification sub-question.

(14 tool calls used; over the 12 soft target because the two verification globs were essential to resolve the highest-value drift signals and confirm phase-008 deliverables.)

---

## Findings

### F-009 — P1: Cross-phase command-filename drift (later phases reference a non-existent `goal.md`)

**Classification:** doc drift / latent functional hazard (confirmed).

Phases 007 (`007-sk-prompt-goal-enhancement`) and 008 (`008-system-spec-kit-integration`) — both authored 2026-06-30 by agent **`opencode-gpt`** — reference `.opencode/commands/goal.md` in their `tasks.md` T002 ("Read … `.opencode/commands/goal.md`"). A glob of `.opencode/commands/*` confirms the file **does not exist**: the shipped command file is `opencode_goal.md` (alongside `README.txt`, `prompt.md`, `agent_router.md`).

This is direct corroboration of F-005/F-007/F-008 (iterations 2–3): the intended `/goal` namespace was never realized on disk, and the later phase docs are **internally inconsistent** about the filename. The later agent assumed the rename had already landed. Any operator or follow-up implementer following phase 007/008 docs literally would open a path that does not exist. This widens the filename fix from "rename one file + amend phase-003 docs" to "also correct the cross-references in phase 007 and 008."

### F-010 — P2: Phase 006 completion overclaim — live `session.idle` continuation never verified

**Classification:** completion-claim drift / verification gap (confirmed).

Phase 006 (`006-active-continuation`) `tasks.md` frontmatter stamps `completion_pct: 100` and all 16 tasks `[x]`, but:
- `open_questions: ["Live one-shot session.idle observability"]` (non-empty).
- Completion criteria item: *"Verification passed **except for the documented live serve/TUI idle-smoke gap**."*
- `next_safe_action`: *"Run a live `MK_GOAL_AUTONOMY=smoke` session.idle smoke in `opencode serve`."*

The single most behaviorally critical path of phase 006 — the **idle-triggered auto-continuation** (`session.idle` → verifier → `maybeContinueGoal` → `promptAsync`) — has only **unit-test** coverage (mocked handlers); it was never exercised against a real opencode runtime. The phase claims done while the feature's end-to-end contract is unverified. Under the COMPLETION VERIFICATION RULE this is a P2 (not P0/P1) because the code path exists and unit tests pass, but the overclaim should be reconciled: either run the live smoke and clear the open question, or downgrade the completion metadata to reflect the residual verification debt.

### F-012 — P2: Zeroed `session_dedup.fingerprint` across ALL eight in-scope phases

**Classification:** metadata-quality / continuity-integrity drift (confirmed, packet-wide).

Every phase's `tasks.md` (and 001's `plan.md`) `_memory.continuity.session_dedup.fingerprint` is the hardcoded placeholder `sha256:0000…0000` (64 zeros). A genuine content fingerprint would never be all-zeros. This indicates the fingerprints were stamped by template/generation scaffolding, never recomputed from real content. Consequence: under `SPECKIT_COMPLETION_FRESHNESS`, the `CONTINUITY_FRESHNESS` check (fingerprint must match recomputed content) would **fail for every phase**, so any "completion" claim on this packet is technically unverifiable through the freshness gate. This is a packet-wide metadata debt, not per-phase logic drift.

### O-003 — Observation: multi-agent authorship boundary coincides with the filename-drift introduction

Phases 001–006 were authored by **`codex`** (2026-06-28/29); phases 007–008 by **`opencode-gpt`** (2026-06-30). The handoff boundary at phase 007 is exactly where the `goal.md` cross-reference (F-009) appears — the second agent assumed the intended rename had landed. No shared ground-truth file check bridged the handoff. Not a bug per se, but it explains the F-009 drift mechanism and is a process finding worth recording.

### O-004 — Observation: phase 008 deliverables confirmed present (resolves carried F-008 sub-question)

Glob confirms existence of `.opencode/skills/system-spec-kit/references/hooks/goal_plugin.md`, `feature_catalog/18--ux-hooks/goal-opencode-plugin.md`, and `manual_testing_playbook/18--ux-hooks/goal-opencode-plugin.md`. The only residual naming wrinkle: the references/hooks file uses underscore (`goal_plugin.md`) while the catalog/playbook entries use hyphens (`goal-opencode-plugin.md`) — cosmetic, both resolve. `ENV_REFERENCE.md` `MK_GOAL_*` entries were **not** re-globbed this iteration (still carried).

---

## Questions Answered

- **Per-phase task-level drift for 001, 002, 004, 005, 006, 007, 008 — ANSWERED.** All phases mark all tasks `[x]` / 100%. Genuine drifts found: F-009 (007/008 cross-ref `goal.md`), F-010 (006 live-verification gap + overclaim), F-012 (packet-wide zeroed fingerprint). Phases 001, 002, 004, 005 are clean at the task level.
- **Phase 008 doc deliverables exist? — ANSWERED (YES).** goal_plugin.md + catalog + playbook all present.

---

## Confirmed vs Inferred

- **CONFIRMED:** Only `opencode_goal.md` exists in `.opencode/commands/`; `goal.md` absent (direct glob).
- **CONFIRMED:** Phase 006 carries an open question + a documented live-verification gap while claiming 100% (direct read of its `tasks.md`).
- **CONFIRMED:** All 8 phases stamp the all-zero `session_dedup.fingerprint` (direct read of each `tasks.md`).
- **CONFIRMED:** Phase 008 deliverable files exist (direct glob).
- **INFERRED:** The zeroed fingerprints indicate scaffolding-stamped, never-recomputed hashes (strong inference from the all-zeros signature; would be confirmed by running `generate-context.js` and observing a non-zero fingerprint).

---

## Questions Remaining

- [ ] (Carried) **F-004:** read `mk-goal.js` lines 1244+ — phase 002 injection (`renderGoalInjection`/`appendGoalBrief`/transform), phase 003 tool registration, phase 004/006 `event()` wiring.
- [ ] (Carried) Examine `mk-goal-*.test.cjs` suite — does it exercise the command *namespace*, and does it cover the unverified code tail?
- [ ] (Carried) Cross-check the 9 resolved design forks against shipped behavior (fork #8 "command style = root /goal" is now directly implicated by F-005/F-007/F-008/F-009).
- [ ] (Carried) Confirm the exact opencode command-resolution rule for `.opencode/commands/*.md` → invocation string (`opencode_goal.md` → `/opencode_goal`?). Refines F-008.
- [ ] (Carried) **F-003:** trace `status:` writes — is `usage_limited` ever set in production paths, or dead?
- [ ] **NEW:** Verify `ENV_REFERENCE.md` `MK_GOAL_*` env entries exist and are consistent with the code's env reads (e.g. `MK_GOAL_AUTONOMY`, `MK_GOAL_*` budget knobs). O-004 left this open.
- [ ] **NEW:** Run the phase-006 live `MK_GOAL_AUTONOMY=smoke` idle smoke (or formally downgrade the 006 completion metadata) to close F-010.

---

## Next Focus

Two large unexamined surfaces remain (both high novelty, both carried since iteration 1) and both would push past the iteration-10 anti-convergence floor:

1. **`mk-goal.js` tail (lines 1244+, F-004)** — verify the phase 002/003/004/006 wiring that the task lists claim is done but no reviewer has read. This is the highest-confidence "claims vs reality" gap left.
2. **`mk-goal-*.test.cjs` suite** — determine whether any test guards the command **namespace** (it almost certainly does not, explaining how F-005/F-009 shipped), and whether the suite covers the unverified tail.

Recommend iteration 5 reads `mk-goal.js` lines 1244–end (F-004) to cover the injection/transform/event-wiring code, since that is the single largest unverified shipped surface and ties directly to the phase 002/004/006 task claims just confirmed.
