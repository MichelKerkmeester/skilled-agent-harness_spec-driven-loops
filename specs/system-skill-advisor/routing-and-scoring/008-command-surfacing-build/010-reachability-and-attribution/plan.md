---
title: "Implementation Plan: Phase 10: reachability-and-attribution"
description: "Add one importable offer module that replays the brief, reads brief delivery and backfills a run log, teach the runner and the scorer to use it, add two read-only doctor checks and the Codex and DSH install steps, and change the cold start only after measuring it."
trigger_phrases:
  - "reachability and attribution plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: reachability-and-attribution

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules for the harness, CommonJS for the doctor scripts, one DSH plugin module |
| **Framework** | The system-skill-advisor runtime (`ADV` is `.skilled/skills/system-skill-advisor/runtime`), the doctor command scripts and the DSH repo-guards bundle |
| **Storage** | None. Run logs stay JSON Lines files, and the backfill writes a new one |
| **Testing** | Vitest in `ADV`, `node --test` for the doctor scripts and the DSH bundle, and the doctor contract tests |

### Overview
A new module `command-offer.mjs` replays the Claude prompt hook inside a checkout and reads the command and policy from the brief head, decides brief delivery from a stored session and backfills a run log. The runner calls it after each turn and gains a `--backfill` mode. The scorer reads the new fields and reports an attributable rate. Two read-only check scripts and two install-guide edits make Codex and DSH reachable, and the cold-start change waits on a measurement.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The research claims are read in code and each verdict is in `spec.md`.
- [x] Every design question has an autonomous answer under the goal's D1, recorded in `spec.md` section 10.
- [x] The coordinator confirms phase 007's before arm is finished. No code task starts before it. The arm was committed in `f8a7f6fc10` before wave 1.
- [x] The before numbers, the socket key and the cold-start measurement are recorded (T001 to T003).

### Definition of Done
- [x] Every row in `acceptance-criteria.md` is `Met`, except AC-008, which is `Superseded` by ADR-001.
- [x] The floors hold, the before arm is backfilled and the attributed summary prints an offered count per runtime.
- [x] `spec.md`, `plan.md`, `tasks.md` and `implementation-summary.md` agree.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Record facts where they happen, count them in one place. The runner writes what it observed, the offer module owns how an offer and a delivery are read and the scorer only counts.

### Key Components
- **Offer module** (`ADV/scripts/routing-accuracy/command-offer.mjs`): `parseOffer` reads the first slash command and its policy from a brief head. `replayOffer` runs the Claude prompt hook in a checkout and parses its head. `briefDelivered` reads Claude's raw transcript or Pi's session records and answers `"unknown"` for the rest. `backfillRunLog` applies the three to every line of an existing log. Without the module the runner, which runs its CLI on import, would hold logic no test can reach.
- **Runner** (`run-command-behaviour.mjs`): appends the three fields after a turn's restore, and its `--backfill` mode hands the runner's own prompt lookup to `backfillRunLog`, so the holdout guard is the one the runner already uses.
- **Scorer** (`score-command-transcripts.mjs`): resolves an argued route to its document, keeps capped runs apart, counts offered and started-of-offered rows, flags an incomplete arm and counts rows, starts and writes per policy.
- **Codex approval check** (`.skilled/commands/doctor/scripts/codex-hook-approval-check.cjs`): reads the checkout's `.codex/hooks.json` to find the advisor's entry and the Codex config to find its `trusted_hash` table. `/doctor:runtime-mirrors` runs it.
- **Hook-wiring check** (`.skilled/commands/doctor/scripts/hook-wiring-check.cjs`): reads the four native hook files of a target repository for the prompt hook entry. `/doctor:symlink check` runs it.
- **Cold-start pair**, only on a measured fail-open: a `background` session-start entry in `hook-registry.json` that calls `advisor_status --no-warm-only`, and a 750 ms cascade probe default in the launcher.

### Data Flow
A turn ends, the runner restores the worktree, replays the hook in the same checkout and reads the stored session, then appends one line. The backfill does the same for each line of a finished log, in the checkout its locator names, and writes a new log. The scorer joins each line to its corpus label and counts.

### Run Line After This Phase

```json
{"runtime":"claude","rowId":"cmd-create-agent-plain-tune-01","arm":"post","locator":{},"exit":0,"changedPaths":[],"restored":true,"offeredCommand":"/create:agent","offeredPolicy":"start","briefDelivered":true}
```

A backfilled line adds `"offerBackfilled":true`, and a failed replay adds an `offerError` code with null offer fields.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Run line | Locator, exit and changed paths | Add three fields | T019, T029 |
| `commandParts` and `documentTails` | Name lookup for a document read | Split an argued route | T005 |
| Summary tally and its text line | Start rate over all start rows | Capped apart, offered counts, incomplete arm, per policy | T011, T017, T020, T022 |
| Install guide | Six runtimes, no Codex approval | Codex step, seven runtimes | T009, T012 |
| DSH bundle flag | On only when `true` | On unless `false` | T006, T013 |
| `/doctor:runtime-mirrors` | Reads `~/.codex/hooks.json` | Also runs the approval check | T014 |
| `/doctor:symlink check` | Link state only | Also runs the hook-wiring check | T015 |
| Session-start hooks | Generated from the registry | One background warm-up, only on a fail-open | T024 |
| `AGENTS.md` and `.skilled/commands/create/` | Phase 006 and decision Q025 | Unchanged | T028 |

Matrix axes for the scorer: capped or not, offered or not, offer field present or absent, policy `run`, `start` or `ask`, arm complete or not. Every axis has one test row.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the before numbers and the old-meaning summary, confirms how the daemon socket is keyed and measures a cold first prompt in a sandboxed socket directory. Implementation runs the waves in `tasks.md`: the offer module, the scorer changes, the runner fields and backfill mode, the two checks with their routes, the install guide and the DSH default, then the cold-start pair only when the measurement showed a fail-open. Verification reruns every gate and the boundary checks, then the coordinator backfills the before arm, runs the Codex and DSH smokes and the summary is written.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `parseOffer`, `replayOffer`, `briefDelivered`, `backfillRunLog`, each scorer change, both check scripts, the DSH flag | Vitest in `ADV`, `node --test` |
| Integration | The doctor contract tests, the hook sync check, the floors and a backfill of a two-line fixture through the runner | `node --test`, the capture script, `jq` |
| Manual | The cold-start measurement, the backfill of the before arm, the Codex and DSH smokes | `scratch/cold-start.mjs`, the runner, coordinator arenas |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 007's before arm | Ordering | Open: still growing at 143 lines | The scorer tasks wait, wave 0 may run |
| The six before-arm arenas at `2920b1abef` | External | Green: all six present on 2026-11-12 | T029 cannot replay the before offers |
| Phase 005's policy in the head | Internal | Open: not built | `offeredPolicy` stays null, nothing else blocks |
| Operator approval of Codex hooks in an arena | Operator | Open | T031 and T032 wait |
| The socket key (T002) | Internal | Open: UNKNOWN until read | T016 takes its fallback |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a floor moves, a doctor contract test fails or the hook sync check fails after the cold-start pair.
- **Procedure**: revert this phase's commits. When T024 landed, run `node .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/sync-hook-registrations.cjs` after the revert and confirm `--check` exits 0. The backfilled log in `scratch/` can stay, because the before arm itself was never edited.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 007's runner and scorer | Implementation |
| Implementation | The before numbers and the coordinator's confirmation that the before arm is finished | Verification |
| Verification | All implementation tasks | Phase 007's after arm |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:decisions -->
## DECISIONS ALREADY MADE

The phase follows the research ranking in `../009-ux-performance-cross-cli-research/research/research.md` section 9 and section 16. The autonomous answers for this phase, each the recommended option under the goal's D1, are in `spec.md` section 10. Two research claims were refuted in code and change the plan: DSH is on in every bundled composition, so its default change does not reach the arm, and `--warm-only` suppresses a cold spawn, so the warm-up passes `--no-warm-only`.
<!-- /ANCHOR:decisions -->
