---
title: "Implementation Plan: Phase 6: launchd-installer"
description: "Add a transactional launchd installer and uninstaller for bot schedules and a per-repository queue-drain agent, guarded by a mechanical preflight and a disabled-by-default first install. Add fire-time slot accounting to the phase 3 runner."
trigger_phrases:
  - "launchd installer plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: launchd-installer

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | The language phase 1 settles for `runtime/` (TypeScript libraries plus `.cjs` entry scripts, per research.md §15 recommendation 6); macOS `launchctl` and `plutil` |
| **Framework** | None. launchd is the scheduler |
| **Storage** | Plists in `~/Library/LaunchAgents`; run records and switches under the phase 1 state root |
| **Testing** | The test runner phase 1 picks, with a stubbed `launchctl`; one real fire on the operator's machine |

### Overview
This phase adds three modules under `.skilled/skills/system-skilled-bots/runtime/lib/`: a plist renderer, an installer and slot accounting. It extends the phase 3 CLI with `schedule install` and `schedule uninstall` and hooks slot accounting into the runner. It is proven by stubbed transaction tests, a simulated sleep gap and one real fire of a harmless bot under launchd's bare `PATH`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [ ] Phases 3 and 5 report every acceptance row Met, and phase 2 has the weekday probe result recorded

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The phase test command passes `installer.vitest.ts` and `slot-accounting.vitest.ts` with zero failures, and the real-fire run record is quoted in `implementation-summary.md`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Guarded install transaction. Every trigger only asks the runner to run; launchd never runs an agent directly.

### Key Components
- **Preflight** (`installer.ts`): enforces the scheduling invariant at install time. Without it, a schedule could be installed for a bot whose runner, switches or posture are not ready (research.md §1 decision 6).
- **Plist renderer** (`plist-render.ts`): turns translator dictionaries, the label and install-time absolute paths into plist text. Without it the plist would rely on `PATH` and `~`, which launchd does not provide (research.md §7).
- **Installer transaction** (`installer.ts`): the six steps, the `print-disabled` check, uninstall and the orphan sweep. It is the only module that calls `launchctl` or writes into `~/Library/LaunchAgents`; the CLI and the runner call it. Without it a lint failure or a disabled label leaves a half-installed or silently dead job.
- **Slot accounting** (`slot-accounting.ts`): records what one fire stood for after a sleep. Without it, a fire after a week of sleep is indistinguishable from an on-time run (research.md §7).
- **Install record and check** (`installer.ts`): writes `<state root>/<identity>/installs/<bot-id>.json` at every install and compares it with the tree as it is now, returning `runner-missing`, `runner-retargeted`, `kind-changed`, `pin-changed` or `record-missing`. Without it, a re-pin that replaces the runner code under the same path, or a retargeted `.skilled` link, is invisible until a job misbehaves (ADR-002).
- **Drain agent plist**: a `QueueDirectories` job per repository on phase 5's `requests/inbox/` folder that runs `bots drain`. Without it, queued requests wait for a person.

### Data Flow
`bots schedule install <id>` reads `BOT.md`, runs the checker and posture check, translates the cron through phase 2, renders the plist and installs it disabled. When the operator enables it and launchd fires, the plist runs the absolute interpreter on the runner with the bot id and schedule index. The runner snapshots the fired slot, lists skipped slots with the phase 2 slot lister, writes one run request and proceeds in the phase 3 order. Install then writes the install record. The read-only check reads it back for phase 7's status and for any later re-pin report. The drain agent wakes when a request lands in `<state root>/<repository identity>/requests/inbox/` and runs `bots drain`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

N/A: this phase builds new behavior and fixes no reported finding. The shared surfaces it calls into are listed in section 6.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup confirms phases 2, 3 and 5 are complete and runs a throwaway probe for how `bootstrap` treats a disabled label. Implementation adds the preflight, the plist renderer, the install transaction, uninstall, slot accounting and the drain agent. Verification runs the stubbed suite, a simulated sleep gap and one real fire of a harmless bot, then removes it.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Plist rendering, preflight refusals, transaction order, lint-failure rollback, `print-disabled` handling, label uniqueness, lateness classes, grace clamp, bounded skipped-slot summary | Phase 1 test runner with a stubbed `launchctl` that records calls |
| Integration | One harmless cron bot installed into `~/Library/LaunchAgents`, enabled, fired once, disabled and uninstalled; one drain agent emptied by one request | Real `launchctl` and `plutil`, run by the operator or with the operator watching |
| Manual | `launchctl print gui/<uid>/<label>` shows the absolute interpreter; `~/Library/LaunchAgents` holds no hub label after uninstall | Terminal |

Each test reads output and exit status. A stub never stands in for the real-fire row.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-schedule-predicates-and-checker` (translator, label grammar, slot lister, checker, weekday probe result) | Internal | Yellow: planned | No calendar dictionaries, labels or skipped-slot list; weekday schedules cannot be installed |
| `003-manual-runner` (`bots run`, posture check, switches) | Internal | Yellow: planned | Preflight has nothing to resolve; install must refuse |
| `005-request-pipeline` (queue layout, claim, quarantine, `bots drain`) | Internal | Yellow: planned | No drain agent |
| `001-contracts-and-state-root` (record fields, state root, identity rule) | Internal | Yellow: planned | No place for slot fields or switches; unknown identity blocks install |
| `007-status-index` (consumer) | Internal | Yellow: planned | The install records exist but no `needs-reinstall` row is shown; install output still prints the check result |
| system-skilled-doctor re-pin flow (`.skilled/commands/doctor/assets/doctor-overlay-repin.yaml`) | Internal, follow-up | Not planned here | A re-pin prints no schedule warning; `bots status` still shows it |
| `launchctl` and `plutil` | External (macOS) | Green: `/bin/launchctl` and `/usr/bin/plutil` present on this host | No install path |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: an installed hub job fires when it should be disabled, fires with the wrong slot, or respawns without draining.
- **Procedure**: with the domain target the T003 probe records (`gui/$(id -u)` shown here, not confirmed by `man launchctl`), run `launchctl disable gui/$(id -u)/<label>` for the job at once, then `launchctl bootout gui/$(id -u)/<label>` and delete its plist from `~/Library/LaunchAgents`. Delete its install record at `<state root>/<identity>/installs/<bot-id>.json`. Revert the phase's commits. Run folders under `.skilled/skills/.state/system-skilled-bots/<identity>/runs/` in the resolved Skilled tree are left in place.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 2, 3 and 5 complete | Implementation; the disabled-label probe decides the ADR-003 mechanism |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close and phase 7, which reads `launchctl print` for installed jobs |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
<!-- FILL: Draw the component order and fill the matrix with produces and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: `scripts/rotate-logs.sh`, then its test, then close. WEAK: Components depend on each other. -->

```
┌───────────┐     ┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│ Preflight │────►│ Plist render │────►│ Install          │────►│ Real fire    │
│ (T004)    │     │ (T005, T012) │     │ transaction      │     │ (T015-T020)  │
└───────────┘     └──────────────┘     │ (T006-T009)      │     └──────────────┘
                                       └────────┬─────────┘
                                                │
                                       ┌────────▼─────────┐
                                       │ Install record + │
                                       │ check (T023-T025)│
                                       └──────────────────┘
┌──────────────────────┐
│ Slot accounting      │──── independent of the installer, joins at T016
│ (T010, T011)         │
└──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Preflight (`installer.ts`) | Phases 2, 3 and 5 | A named refusal or a go | Plist render, install transaction |
| Plist renderer (`plist-render.ts`) | Preflight, phase 2 translator and labels | Linted plist text for bots and the drain agent | Install transaction |
| Install transaction (`installer.ts`) | Renderer, ADR-003 probe result | Installed, disabled jobs | Install record, real fire |
| Install record and check (`installer.ts`) | Install transaction | `installs/<bot-id>.json` and `ok` or `needs-reinstall` per bot | Phase 7 status rows, the system-skilled-doctor follow-up |
| Slot accounting (`slot-accounting.ts`) | Phase 2 slot lister, phase 3 runner | Slot fields on each fire's run record | Real fire |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
<!-- FILL: Name the longest chain and its total. List what can run in parallel. Write `N/A` with one reason, or delete the whole section. GOOD: Implementation to verification, 40 minutes. Docs run in parallel. WEAK: The critical path is the main path. -->

1. **T003 disabled-label probe, then ADR-003 settled** - one sitting with the operator - CRITICAL
2. **T004 to T009 preflight, renderer and transaction** - the bulk of the build - CRITICAL
3. **T015 and T016 real install and one real fire** - at least one scheduled minute while disabled and one after enable - CRITICAL

**Total Critical Path**: UNKNOWN in hours. No estimate exists, so the path is named by tasks only.

**Parallel Opportunities**:
- T010 and T011 slot accounting can run alongside T004 to T009.
- T023 to T025 install record and check can run once T006 exists, alongside T012 and T013.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES
<!-- FILL: Name three milestones with a command-checkable success criterion. Write `N/A` with one reason, or delete the whole section. GOOD: M1: `--keep` parses. `rg -n 'keep' scripts/rotate-logs.sh` prints the branch. WEAK: Milestones are tracked. -->

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Entry conditions and probe | T001 and T002 pass and ADR-003 records the probe's exit codes | End of Setup |
| M2 | Stubbed build green | `installer.vitest.ts` and `slot-accounting.vitest.ts` report zero failures (T014, T018, T025) | End of Implementation |
| M3 | Real fire and clean uninstall | T016 run record quoted in `implementation-summary.md`; `ls ~/Library/LaunchAgents \| grep -c 'com.skilled.bots.'` prints 0 after T020 | Phase close |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD
<!-- FILL: Write one ADR per decision. Name the context, the choice, the consequence and the rejected option. GOOD: ADR-001: an option, because the script already parses options. WEAK: We made a decision. -->

The full records live in `decision-record.md`. This list only points at them, so the two cannot drift.

- **ADR-001** (Proposed): the install preflight enforces the scheduling invariant at every install.
- **ADR-002** (Accepted, operator 2026-11-22): a moved checkout or a changed `.skilled` is detected and repaired by reinstalling. The install record keeps the runner path, its real path, the `.skilled` kind and a vendored pin. The post-repin hook point is named and left to system-skilled-doctor.
- **ADR-003** (Proposed): how a first install is held disabled, settled after the T003 probe.
- **ADR-004** (Proposed, operator-owned): what `bots enable <id>` must do.
- **ADR-005** (Proposed): the next fire time is reported as UNKNOWN.
- **ADR-006** (Proposed): one queue-drain agent per repository identity.

---
