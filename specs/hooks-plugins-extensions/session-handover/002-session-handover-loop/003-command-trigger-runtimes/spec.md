---
title: "Feature Specification: Phase 3: command-trigger-runtimes"
description: "Codex, Cursor, Devin and Hermes enter the session-relaunch loop through /speckit:handoff, with automatic arm adapters only where a spike captures a firing event."
trigger_phrases:
  - "command trigger runtimes"
  - "phase 3 command trigger runtimes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: command-trigger-runtimes

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

This phase puts the four runtimes that carry no usage signal into the session-relaunch loop: Codex, Cursor, Devin and Hermes. Each enters through the `/speckit:handoff` command by default and gains an automatic arm-plus-kill adapter only when its spike captures a firing event. A worker never probes its own runtime.

**Key Decisions**: `/speckit:handoff` is the baseline trigger for all four runtimes, adapters build only on an `AUTO` verdict backed by a captured event, spike probe assignments keep workers off their own runtime

**Critical Dependencies**: Phase 001 and 002 deliverables: `relaunch-core.cjs`, `killer.cjs`, `skilled-loop`, and the `/speckit:handoff` command with its mirrors

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-16 |
| **Branch** | `worktrees/142-session-relaunch-loop` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 4 |
| **Predecessor** | 002-pi-opencode-adapters |
| **Successor** | 004-integration-review-and-docs-closure |
| **Handoff Criteria** | Every seed passes, gate PG (plan section 11) passes, and the phase docs have landed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Session relaunch loop: auto-handoff near the context limit with a fresh session in the same terminal specification.

**Scope Boundary**: Codex, Cursor, Devin and Hermes only. The core loop machinery (`relaunch-core.cjs`, `context-usage.cjs`, `killer.cjs`, the claude arm and the `/speckit:handoff` command source) is built in phases 001 and 002 and is not reopened here.

**Dependencies**:
- Phase 001 artifacts on disk: the `session-relaunch` concern core, `lib/killer.cjs`, `.skilled/bin/skilled-loop`, and `.skilled/commands/speckit/handoff.md` with its mirrors.
- Executor CLIs for the spike and build lanes: `codex` (Luna) and `devin` (SWE), both confirmed logged in at G0.3.
- The hook registry at `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` and the two sync CLIs.

**Deliverables**:
- A spike verdict matrix with one row per runtime: seed syntax, firing event, mirror form, quoted evidence and a verdict.
- Stub-runtime wrapper tests per runtime and adapter tests where the verdict is `AUTO`.
- `skilled-loop` case arms for the verified runtimes.
- Arm-plus-kill adapters and registry rows where the verdict is `AUTO`.
- `/speckit:handoff` mirrors in each runtime's verified form.
- README runtime matrix, catalog entry update, playbook scenarios per runtime and coverage matrix rows.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Codex, Cursor, Devin and Hermes expose no usage signal at all, so the context-threshold nudge and the Stop-event arming built for Claude, Pi and OpenCode cannot fire for them. Cursor's event list has no `stop` event and Devin has no command-file system. Without this phase, four of the seven named runtimes can never enter the relaunch loop.

### Purpose

Give each of the four runtimes a verified path into the same loop: `/speckit:handoff` as the manual trigger everywhere, plus an automatic arm-plus-kill adapter only where a spike captures a firing event.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A spike per runtime: the interactive seed syntax, whether a Stop or sessionEnd event fires (with a captured event), and the command-mirror form. Codex, Cursor and Hermes are probed by SWE; Devin is probed by Luna.
- Tests first: stub-runtime wrapper tests per runtime, and adapter tests only where the verdict is `AUTO`.
- `skilled-loop` case arms for the runtimes whose seed syntax the spike verified.
- Arm-plus-kill adapters and `hook-registry.json` rows only where the verdict is `AUTO` and the event is confirmed to fire, followed by a `sync-hook-registrations.cjs` run.
- `/speckit:handoff` mirrors in the form each runtime's spike found, then `sync-runtime-mirrors.cjs --check`.
- Docs: README runtime matrix, catalog entry update, playbook scenarios per runtime and coverage matrix rows.
- Gate PG from the final state.

### Out of Scope
- Automatic triggers for runtimes whose verdict is `COMMAND-ONLY` or `BLOCKED` - H13 ships them on the command trigger only.
- Edits to `relaunch-core.cjs`, `context-usage.cjs`, `killer.cjs`, the claude arm or the Pi/OpenCode adapters - those belong to phases 001 and 002. The one exception is a fix for a defect this phase's own review confirms, named in `../scratch/run-ledger.md`.
- Resume flags in the wrapper - out for the whole run.
- `autoCompactEnabled` or `autoCompactWindow` changes - compaction stays the untouched fallback.
- Live-run proof for these runtimes - the final live runs are phase 004 lane 4.5.
- Runtimes beyond the four named - the plan names seven runtimes total and phases 001 and 002 own the other three.
- A worker probing its own runtime - the spike assignments in lane 3.1 forbid it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/bin/skilled-loop` | Modify | One case arm per verified runtime |
| `.skilled/hooks/session-relaunch/<runtime>/` | Create | Arm-plus-kill adapter, only where the verdict is `AUTO` |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | Registry rows for `AUTO` runtimes |
| Generated settings rows | Modify | Output of `sync-hook-registrations.cjs` for the new rows |
| `/speckit:handoff` runtime mirrors | Create | Mirror files in each spike-verified form |
| `.skilled/hooks/session-relaunch/**/*.test.*` | Create | Stub-runtime wrapper tests and `AUTO`-only adapter tests |
| `.skilled/hooks/session-relaunch/README.md` | Modify | Runtime matrix rows |
| `.skilled/hooks/README.md` | Modify | Coverage matrix rows |
| `system-spec-kit/feature-catalog/context-preservation/` entry plus index | Modify | Catalog entry update |
| `system-spec-kit/manual-testing-playbook/plugins-and-hooks/` docs plus index | Modify | One scenario doc per runtime |
| `003-command-trigger-runtimes/scratch/` | Create | Spike captures and evidence |
| `.hermes/plugins/repo-guards/` (`__init__.py`, `plugin.yaml`, tests) | Modify | Hermes bridge for the `AUTO` adapter: usage record, nudge, per-message arm, finalize and reset cleanup |
| `.skilled/hooks/session-relaunch/bin/session-relaunch.cjs` | Modify | Review-confirmed fix: `prepare` accepts every wrapper runtime |
| `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs`, `lib/killer.cjs` | Modify | Review-confirmed fix: one manual claim command per runtime, shared by the CLI and the killer |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A spike verdict matrix exists with one row per runtime (Codex, Cursor, Devin, Hermes). Each row names the interactive seed syntax, whether a Stop or sessionEnd event fires with a captured event, the command-mirror form, quoted evidence, and a verdict of `AUTO`, `COMMAND-ONLY` or `BLOCKED`. |
| REQ-002 | `skilled-loop` carries one case arm per runtime whose seed syntax the spike verified. Each arm exports `SKILLED_LOOP_ID`, cds to the recorded cwd and seeds `[session-relaunch] claim and continue handoff <path>` with no resume flag. A stub-runtime wrapper test per runtime proves the seed, the cwd change and the absent resume flag. |
| REQ-003 | Arm-plus-kill adapters and `hook-registry.json` rows exist only for runtimes with verdict `AUTO` and a captured firing event. No adapter exists for a runtime without one. Cursor `stop` is not wired. |
| REQ-004 | `/speckit:handoff` reaches each runtime in the mirror form its spike verified, and `sync-hook-registrations.cjs --check` plus `sync-runtime-mirrors.cjs --check` exit 0 with only this phase's rows added. Devin's form comes from its spike because Devin has no command-file system. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The phase doc set exists and passes its validators: the README runtime matrix (runtime, trigger, seed syntax, mirror form, evidence), the catalog entry update, playbook scenarios per runtime with a recorded result, and coverage matrix rows. |
| REQ-006 | Every runtime with verdict `COMMAND-ONLY` or `BLOCKED` ships on the command trigger only, the reason is recorded, and H13 applies at closure. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The verdict matrix holds four rows, each with quoted evidence and a verdict of `AUTO`, `COMMAND-ONLY` or `BLOCKED` (maps to AC-001).
- **SC-002**: `node --test <explicit test files>` ends with `# fail 0` on the phase's stub-runtime tests (maps to AC-002).
- **SC-003**: `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` are at baseline or better with only this phase's rows added (maps to AC-004).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 deliverables (core, killer, wrapper, `/speckit:handoff`) | This phase has nothing to build on | Phase order in the run: 001 and 002 land first |
| Dependency | `codex` and `devin` CLIs | Spike and build lanes cannot dispatch | Confirmed logged in at G0.3; H6 on auth failure |
| Risk | A verdict lands `COMMAND-ONLY` or `BLOCKED` | That runtime ships manual-only | H13: record the reason and report PARTIAL at closure |
| Risk | A worker probes its own runtime | Spike evidence is contaminated | Probe assignment in lane 3.1: SWE probes Codex, Luna probes Devin, SWE probes Cursor and Hermes |
| Risk | A sync run changes more than this phase's rows | Generated output is wrong | H8: do not accept it, report the extra hunks |
| Risk | An adapter signals a non-descendant pid | Process outside the wrapper is killed | H9 halts the lane; the killer ancestry guard stays |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Adapters stay async and advisory like the existing Stop hooks, and the killer gives up and un-arms after 30 s.

### Security
- **NFR-S01**: The killer never signals a pid that is not a descendant of the wrapper; the parent-pid walk is guarded by `SKILLED_LOOP_ID`.

### Reliability
- **NFR-R01**: `SYSTEM_SESSION_RELAUNCH_DISABLED` disables the whole concern, and every relaunch and decline appends to `relaunch.log`.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a runtime whose spike cannot verify a seed syntax is `BLOCKED` and ships on the command trigger only.
- Maximum length: `shouldRelaunch` refuses a file 10 minutes or older or at 10 hops or more, and the wrapper logs the decline.

### Error Scenarios
- Event captured in a payload but never observed firing: no adapter for that runtime.
- Devin has no command-file system: the trigger form comes from the Devin spike rather than from mirror conventions.
- A sync run produces hunks beyond this phase's rows: H8, the output is rejected and reported.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 14/25 | Files: wrapper arms, up to 4 adapter dirs, mirrors, tests, docs; LOC: small arms and adapters |
| Risk | 12/25 | Auth: N, API: N, Breaking: N; process signalling reuses the guarded killer from 001 |
| Research | 14/20 | Four runtime spikes with captured-event evidence |
| Multi-Agent | 11/15 | Workstreams: 3 actors across 7 lanes |
| Coordination | 10/15 | Dependencies: verdict gates decide which build lanes exist |
| **Total** | **61/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Most or all verdicts land `COMMAND-ONLY` or `BLOCKED` | M | M | Command trigger is the designed baseline; H13 records it and closure reports PARTIAL |
| R-002 | An adapter signals a pid outside the wrapper's descendants | H | L | Killer ancestry guard plus H9 halt; tests assert descendants-only |
| R-003 | A sync run changes more than this phase's rows | M | L | H8: reject the output and report the extra hunks |
| R-004 | A worker probes its own runtime | M | L | Fixed probe assignment in lane 3.1 |

---

## 11. USER STORIES

### US-001: Command entry on Codex (Priority: P0)

**As an** operator running Codex under `skilled-loop`, **I want** `/speckit:handoff` to hand my session to a fresh one in the same terminal, **so that** the loop works even with no usage signal.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Same trigger on Cursor, Devin and Hermes (Priority: P1)

**As an** operator on Cursor, Devin or Hermes, **I want** the same `/speckit:handoff` entry point, **so that** the trigger is identical on every runtime.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Automatic hop where a spike proves an event (Priority: P1)

**As an** operator on a runtime whose verdict is `AUTO`, **I want** the session to arm and hop without a manual command, **so that** the loop matches the Claude behavior.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Each runtime's verdict (`AUTO`, `COMMAND-ONLY` or `BLOCKED`) is open until lane 3.1 lands.
- Devin's trigger form is open until the Devin spike reports it.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

