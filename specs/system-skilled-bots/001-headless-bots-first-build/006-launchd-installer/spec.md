---
title: "Feature Specification: Phase 6: launchd-installer"
description: "Bots can run by hand after phase 3, but nothing installs a schedule. This phase adds the transactional launchd installer, the scheduler stop layer, fire-time slot accounting, the queue-drain agent and an install record that tells status when a moved checkout, a retargeted link or a re-pin needs a reinstall."
trigger_phrases:
  - "launchd installer"
  - "phase 6 launchd installer"
  - "bots schedule install"
  - "queue drain agent"
  - "bots install record"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 6: launchd-installer

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY
<!-- FILL: Write three sentences: the problem, the change and the proof. GOOD: Nothing deletes old archives, so `logs/archive` grows without limit. The `--keep <n>` option keeps only the newest n. With 10 archives, `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: This document describes the feature. -->

After phase 5 a bot runs only when a person types a command, and no code turns a `cron` trigger into a launchd agent. This phase adds a guarded install transaction that installs each schedule disabled, a per-repository queue-drain agent, fire-time slot accounting and an install record. The record lets status flag a schedule whose runner moved, whose `.skilled` link was retargeted or whose vendored tree was re-pinned. The proof is a stubbed transaction suite, a simulated sleep gap and one real fire of a harmless bot under launchd's bare `PATH`.

**Key Decisions**: install preflight at every install (ADR-001); a moved checkout or a changed `.skilled` is detected and repaired by reinstalling, with the overlay system in view (ADR-002, Accepted); a first install is held disabled (ADR-003); the next fire time is UNKNOWN (ADR-005); one drain agent per repository identity (ADR-006).

**Critical Dependencies**: phases 2, 3 and 5 complete, and phase 1's state root and identity rule.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-22 |
| **Branch** | `scaffold/006-launchd-installer` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 8 |
| **Predecessor** | 005-request-pipeline |
| **Successor** | 007-status-index |
| **Handoff Criteria** | Every row in `acceptance-criteria.md` is Met, including one real fire of a harmless bot under launchd's bare `PATH`, before phase 7 reads `launchctl print` and the install records |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Build system-skilled-bots: file-defined headless agent bots run on a schedule or event specification.

**Scope Boundary**: This phase owns every write of a hub-labeled plist and every `launchctl bootstrap` call in the packet. It installs and removes launchd agents, adds the scheduler stop layer, records what a fire stood for, adds the queue-drain agent and writes the install record. It adds no new run behavior beyond slot accounting. It edits nothing under `.skilled/commands/doctor/`.

**Dependencies**:
- `002-schedule-predicates-and-checker`: the cron translator, the label grammar, the slot lister and the definition checker. The recorded weekday probe result (research.md §16 Q1) must exist before any weekday schedule is installed.
- `003-manual-runner`: `bots run <id>`, posture validation and the run and invocation stop layers. Entry condition: phase 3 is complete.
- `005-request-pipeline`: the queue folder layout, atomic claim, quarantine and the hand-run `bots drain`. Entry condition: phase 5 is complete.
- The Predecessor row is folder order. Build dependencies are: phases 2, 3 and 5, matching the parent phase map. Phase 4 is not a dependency.
- Consumers: phase 7 reads the install records to show `needs-reinstall` rows. Phase 8's staged re-pin regression checks that a re-pin is reported. The system-skilled-doctor overlay flow is a named follow-up, not a dependency.

**Deliverables**:
- `bots schedule install <id>` and `bots schedule uninstall <id>`, run as the six-step transaction of research.md §7.
- An install preflight that refuses to schedule when the runner, the switches or the definition are not ready.
- First installs that are disabled until the operator enables them.
- Slot accounting at fire time in the runner: `scheduled_at`, lateness class and a bounded skipped-slot summary, with no backfill.
- One queue-drain agent per repository, watching phase 5's `requests/inbox/` folder with `QueueDirectories`.
- An install record per bot and a read-only check that names each schedule that needs a reinstall.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
After phase 5 a bot runs only when someone types `bots run` or `bots drain`. No path turns a `cron` trigger into a launchd agent, and the request queue has no job that drains it. A naive install is also unsafe: launchd runs jobs with a bare `PATH`, a disabled label stays disabled across reboots, `load -w` overrides the kill switch, and a bot id alone collides across repositories (research.md §7, §13).

A plist holds absolute paths, so it goes stale when the tree under it changes. In a consumer repository that change need not be a move. `.skilled` can be a link that `/doctor:symlink` creates or removes, or a vendored copy that `/doctor:overlay repin` moves to a new upstream commit. A re-pin keeps every path in place and replaces the runner code under it.

### Purpose
An operator can install a bot's schedule as a disabled launchd agent, enable it on purpose, see it fire and stop it at the scheduler. Every fire records the slot it stood for. Status can tell the operator when a schedule needs a reinstall.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ env -i PATH=/usr/bin:/bin:/usr/sbin:/sbin /bin/sh -c 'command -v node; echo "exit=$?"'
exit=1
$ ls ~/Library/LaunchAgents | grep -c 'com.skilled.bots'
0
$ ls -A .skilled/skills/system-skilled-bots; echo "exit=$?"
exit=0
```
Run on 2026-11-22 from the repository root. Under launchd's bare `PATH`, `node` does not resolve. No hub-labeled agent is installed. The skill folder exists and is empty, so no installer code exists yet.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add `bots schedule install <id>`: render the plist to a temp path, `plutil -lint`, `launchctl bootout` the old service, move the file into place, `launchctl bootstrap`, then `launchctl print` (research.md §7). Every path, including the interpreter, is absolute and resolved at install time.
- Add the install preflight. It refuses when the runner cannot be resolved, the state-root switches cannot be read, repository identity is unknown, or the definition fails the phase 2 checker or the phase 3 posture check.
- Add the scheduler stop layer: `launchctl disable` and `enabled: false` in `BOT.md`. A first install is disabled. A label found in `print-disabled` is never re-enabled silently and never with `load -w` (research.md §7, §13, §15 step 7).
- Add `bots schedule uninstall <id>`: `bootout`, delete the plist, sweep `~/Library/LaunchAgents` for hub bot labels with no definition, keeping the drain label, check `print-disabled`, and leave run history alone.
- Add fire-time slot accounting to the runner and a per-repository queue-drain agent whose `QueueDirectories` names phase 5's `<state root>/<repository identity>/requests/inbox/` (research.md §7, §9).
- Write an install record per bot at `<state root>/<identity>/installs/<bot-id>.json` and add a read-only check that compares it with the tree as it is now.

### Out of Scope
- A Hermes cron backend and Orca delegation - research.md §15 puts both after launchd; step 10 is outside this packet.
- A user-level runner shim for moved checkouts - research.md §7 and §16 Q6 favor detect and reinstall; no iteration studied a shim.
- The status view and the SQLite index - phase 7 owns them and reads what this phase installs and records.
- Edits to `.skilled/scripts/launchagents/README.md` - its runbook still uses `load` and `unload`, but it documents a different agent; change it only if the operator asks.
- Edits to `.skilled/commands/doctor/scripts/overlay-engine.cjs`, the `/doctor:overlay` and `/doctor:symlink` command docs or their workflow YAML. A post-repin report is a follow-up owned by system-skilled-doctor unless the operator approves it here.
- Any mode routing or command registration - phase 8 owns the wiring, and no mode is reported routed before it.

### Files to Change

All paths below are new. Phase 1 settles the language and build of `runtime/` (research.md §15 recommendation 6), so the `.ts` extension is provisional.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/plist-render.ts` | Create | Render one plist per bot schedule, and one drain plist per repository, from translator dictionaries and install-time absolute paths |
| `.skilled/skills/system-skilled-bots/runtime/lib/installer.ts` | Create | Preflight, the six-step install transaction, uninstall, the orphan sweep, the `print-disabled` check, the install record and the needs-reinstall check |
| `.skilled/skills/system-skilled-bots/runtime/lib/slot-accounting.ts` | Create | Fired-slot snapshot, lateness class, grace window and skipped-slot summary |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modify (created in phase 3) | Call slot accounting before dispatch when the trigger is a schedule fire |
| `.skilled/bin/bots.cjs` | Modify (created in phase 3) | Add the `schedule install` and `schedule uninstall` verbs; make `enable` and `disable` reach the launchd label by calling the installer module, never `launchctl` directly |
| `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts` | Create | Transaction, preflight, disabled-label, label-collision and needs-reinstall tests against a stubbed `launchctl` and stubbed trees |
| `.skilled/skills/system-skilled-bots/runtime/tests/slot-accounting.vitest.ts` | Create | Simulated sleep gap, lateness classes, bounded summary, no backfill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `bots schedule install <id>` runs render, `plutil -lint`, `bootout`, move, `bootstrap` and `print` in that order. A lint failure exits non-zero and leaves the old plist file and the loaded job unchanged. |
| REQ-002 | A first install of a label leaves it disabled. Nothing fires until the operator enables it on purpose. |
| REQ-003 | The installer checks `launchctl print-disabled` before bootstrap. A label disabled as a kill switch stops install with a message, or is enabled only on an explicit request. No code path calls `launchctl load` in any form, because `load -w` overrides the Disabled key and `load -F` ignores it (`man launchctl`, `load` flags). The guard reads the previous install record under the state root the installed jobs use: an install from a shell whose resolved state root differs from the one an installed job of the same identity carries (one sets `XDG_STATE_HOME` and the other does not, or they differ) refuses with `state-home-changed`, names both roots and the `XDG_STATE_HOME` to run from, and writes nothing. It never adopts the job's root silently. The same guard compares outputs, not inputs: it resolves the identity and the state root once under the installing shell and once under the environment launchd will give the job (NFR-S02), and when the two pairs differ it refuses with `job-env-diverges`, names both pairs and the fix (declare `identity` and/or `stateRoot` in `bots/config.json`), and writes nothing. A checkout's installed jobs are found by the `--repo` written into each hub job file, compared by real path, never by the label built from the identity resolved now, because that identity can change under an installed job (an origin renamed, an identity declared later). When such a job's label names another identity, install refuses with `identity-changed`, names the old label and says to run `bots schedule uninstall` for it first. When such a job was written for another state root (its log path, or a drain job's watched folder, is not the one resolved now, as after a config `stateRoot` is added), install refuses with `state-home-changed`. With no job installed yet, install also refuses with `state-home-changed` when a default state root other than the one resolved now (the account home's or the shell home's) holds switches of this identity, so a pause set before the first install is not stranded; a root named only by an earlier shell's `XDG_STATE_HOME` cannot be found and is not searched. `bots disable` and `bots schedule uninstall` act on every job of the checkout for that bot, under any identity. |
| REQ-004 | The preflight refuses to install, with a named reason and no write to `~/Library/LaunchAgents`, when the runner cannot be resolved, the state-root switches cannot be read, repository identity is unknown, the job's own environment would resolve another identity or state root than the installing shell (`job-env-diverges`, for example a shell that sets `GITHUB_REPOSITORY` over an origin remote naming another repository), or the definition fails the phase 2 checker or the phase 3 posture check. |
| REQ-005 | Every path in a generated plist is absolute, including the interpreter, which is resolved at install time. A fired job starts the runner under `PATH=/usr/bin:/bin:/usr/sbin:/sbin`. |
| REQ-006 | Bot labels follow the phase 2 grammar of repository identity, bot id and schedule index. The drain agent uses the phase 2 drain form `com.skilled.bots.<identity>.drain`. Two repositories with the same bot id produce two different labels. |
| REQ-007 | A schedule fire writes the fired slot as a snapshot before dispatch, then records `scheduled_at`, `dispatched_at`, `lateness_seconds`, a lateness class (on time, late, catch-up) and a skipped-slot summary of count, first and last instant. Missed slots are never backfilled. |
| REQ-015 | Every install writes one install record per bot to `<state root>/<identity>/installs/<bot-id>.json`, by temp file and rename. It holds the bot's labels, the runner path written into the plist, the repository-side runner path `<repo root>/.skilled/bin/bots.cjs`, the real path that path resolved to, the tree root, the `.skilled` kind (`checkout`, `symlink` or `vendored`), the overlay manifest's `pin.commit` when the kind is `vendored`, and the install time. Uninstall deletes the record. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `bots schedule uninstall <id>` boots out the job, deletes its plist, sweeps `~/Library/LaunchAgents` for hub bot labels with no definition and checks `print-disabled`. The sweep never removes a drain label, which has no definition by design. It deletes nothing under `.skilled/skills/.state/system-skilled-bots/` in the resolved Skilled tree, where run folders live at `<identity>/runs/<run id>/`. With a symlinked `.skilled` that folder is shared by several repositories, so uninstall leaves every identity's runs alone. |
| REQ-009 | One queue-drain agent per repository identity watches that repository's `<state root>/<repository identity>/requests/inbox/` folder, defined by phase 5, with `QueueDirectories` and runs `bots drain`. It installs through the same transaction, preflight and disabled default. |
| REQ-010 | The grace window is half the schedule period, clamped between 120 and 7,200 seconds. The skipped-slot list comes from the phase 2 slot lister, never from a second cron evaluator. |
| REQ-011 | Install verification reads the installed plist back and compares its calendar dictionaries with the translator's output, then reads `launchctl print`. The next fire time is reported as UNKNOWN (research.md §16 Q7). |
| REQ-012 | A moved checkout, a retargeted or removed `.skilled` link, or a re-pinned vendored tree is detected through the REQ-016 check, and running install again repairs it by rewriting the plist and the install record. No user-level shim is installed (research.md §16 Q6, ADR-002). |
| REQ-013 | Only the installer module calls `launchctl bootstrap`, `launchctl enable` or `launchctl disable`, or writes a file into `~/Library/LaunchAgents`. The CLI and the runner reach launchd only through it. |
| REQ-014 | When a label is already installed from another clone of the same identity (phase 1 ADR-006), install refuses with reason `label-held-by-clone` and prints that clone's checkout path. A clone counts as other when its path differs, still exists and is listed in `registered-roots`. A plist whose old checkout no longer exists is a moved checkout and follows REQ-012. |
| REQ-016 | The installer exposes a read-only check that reads every install record for an identity and returns, per bot, `ok` or `needs-reinstall` with one or more reasons: `runner-missing` when the recorded plist runner path no longer exists, `runner-retargeted` when the repository-side runner path now resolves to a different real path or tree root, `kind-changed` when the `.skilled` kind differs, and `pin-changed` when a vendored tree's `pin.commit` differs from the recorded one. A hub label in `~/Library/LaunchAgents` with no install record returns `record-missing`. Checked for a checkout, a job whose `--repo` is that checkout returns `identity-changed` when its label names another identity than the one resolved now, and `state-root-changed` when its log path or watched folder sits under another state root. The check writes nothing and calls no `launchctl` verb that changes state. Phase 7 shows its result as `needs-reinstall` rows in `bots status`. |
| REQ-017 | This phase changes no file under `.skilled/commands/doctor/`. It names the post-repin hook point in ADR-002: the re-read step of `.skilled/commands/doctor/assets/doctor-overlay-repin.yaml`, which runs `overlay-engine.cjs status` after any engine write. The follow-up that calls the REQ-016 check there is recorded for system-skilled-doctor in `implementation-summary.md`. |
| REQ-018 | When a schedule fires while its bot has an open needs-you item, the runner refuses it with the cause `awaiting-decision-hold`. Slot accounting then records that fired slot as skipped with the reason `held-needs-you`, beside the skipped-slot summary, and nothing is dispatched or backfilled. The schedule keeps firing, and the first fire after the item is answered or expires runs normally (operator decision D9). A held fire is counted once, as this skipped slot. Its run request is the record join and never lands in phase 5's watched folder, so phase 5 does not also quarantine it. |
| REQ-019 | A scheduled run finds its executor without the shell's `PATH`. At install, the installer resolves the bot's executor binary with `command -v` under a plain `/bin/sh` in the installing shell's environment and keeps the kind and the absolute path in the install record, or null when it does not resolve, which never refuses the install. When the installed schedule fires, the run gets a `PATH` that starts with the pinned executor's folder and the recorded interpreter's folder, only while the definition still names the pinned kind. The job file still carries no `PATH` (NFR-S02). The read-only check returns `executor-missing` when a pinned path no longer exists. Decided by the operator on 2026-11-24 (decision-record.md, Operator Decisions). |
| REQ-020 | A queued run that the drain job starts finds its executor without the shell's `PATH`. When the drain job is installed, the install record keeps the absolute path of every executor kind whose binary a plain `/bin/sh` resolves in the installing shell. A scheduled drain pass runs with the folders of those paths and the interpreter's folder first on its PATH, so a bot that is only enabled, with no install record of its own, still finds its executor. The job file carries no `PATH`. The check returns `executor-missing` when any pinned path is gone. Decided by the operator on 2026-11-24. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: A harmless cron bot installs disabled, fires once after `bots enable <id>`, and its run record carries `scheduled_at` and a lateness class. `launchctl print` shows the absolute interpreter path.
- **SC-002**: `rg -n --glob '!tests/**' 'launchctl|bootstrap|LaunchAgents' .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs` prints lines from `installer.ts` only, and ``rg -n "['\"\`]load['\"\`]|launchctl load" .skilled/skills/system-skilled-bots/runtime/lib .skilled/bin/bots.cjs`` prints nothing (the pattern matches `load` in single, double or backtick quotes).
- **SC-003**: A lint failure, a failing preflight and a kill-switch label each leave `~/Library/LaunchAgents` byte-identical to its state before the command.
- **SC-004**: In stubbed trees, a removed runner, a retargeted `.skilled` link and a changed vendored `pin.commit` each make the check return `needs-reinstall` with the matching reason, and a reinstall returns `ok`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 3 and 5 complete; phase 2 translator, label grammar, slot lister and weekday probe result | Without them the installer would schedule a job with no runner, no kill switch or an unchecked calendar | Treat them as entry conditions. The preflight checks the runner and switches at every install, not only once |
| Dependency | `launchctl` and `plutil` on macOS | Tests that call the real tools write to the operator's `~/Library/LaunchAgents` | Unit tests use a stubbed `launchctl`. One real fire uses a harmless bot and is removed at close |
| Dependency | Phase 7 reads the install records and shows `needs-reinstall` rows | Without it the check exists but no operator sees it | The record path and the check's result shape are handed to phase 7 here. Install output also prints the check result |
| Risk | `man launchctl` says a disabled service "cannot be loaded in the specified domain until it is once again enabled". So a label disabled before `bootstrap` is not loaded, and step 6 `print` cannot show a loaded job on a first install | High: the disabled default and the six-step transaction conflict as written | A Setup probe records the real exit codes and output on this host, then ADR-003 picks the mechanism |
| Risk | A first install held disabled and a label disabled as a kill switch look the same in `print-disabled` | High: a reinstall of a never-enabled bot would stop with the kill-switch message | ADR-003 records how the installer tells the two apart before T007 is built. Open question below |
| Risk | `man launchctl` says `print` output "is NOT API in any sense at all" | Med: a check that parses it breaks on an OS update | Use `print` for its exit status and as a human-readable confirmation only. Base the read-back check on the installed plist. Phase 7 parses the same output |
| Risk | A drain agent whose queue folder never empties respawns every 10 seconds (research.md §9) | Med | Rely on phase 5's claim before dispatch, quarantine outside the watched folder and retry bound. Test an empty folder after one drain |
| Risk | A moved checkout, a retargeted link or a re-pin leaves plists that point at the wrong tree or at changed code | Med | The install record and the REQ-016 check flag it; reinstall repairs it (ADR-002) |
| Risk | Two clones of one repository share an identity, so they share labels | Med | Phase 1 owns the identity rule. This phase tests that its labels follow whatever rule phase 1 records |
<!-- /ANCHOR:risks -->

---

## 7. NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->

### Performance
- **NFR-P01**: Slot accounting reads only the last run record and the translator's dictionaries. After a week of sleep on a five-minute schedule it stores one summary, not about 2,000 entries (research.md §7).
- **NFR-P02**: Install, uninstall and the needs-reinstall check make no network call.

### Security
- **NFR-S01**: The installer writes only to `~/Library/LaunchAgents` and the state root, including the install records. It writes nothing inside a checkout or a vendored tree. Run folders inside the tree are the runner's, and the installer never writes or deletes them.
- **NFR-S02**: A generated plist carries no secret and no environment value beyond what launchd needs to start the runner. The one value it carries is `XDG_STATE_HOME`, always when `bots/config.json` names no `stateRoot` and never otherwise, set to the state home the install resolved, so a fired job resolves the same state root the install record and the drain job's watched inbox sit under. The job's environment is exactly the built one: launchd's bare `PATH`, the account's home from the user database (never a shell's `HOME`) and the job file's `EnvironmentVariables`, nothing from the installing shell. One builder in `installer.ts` produces it. The install renders the job file from it and refuses with `job-env-diverges` when the identity or state root it resolves differs from the shell's. Every verb (`run`, `enable`, `disable`, `pause`, `resume`, `inbox`, `enqueue`, `drain`, `answer`, `schedule uninstall` with its sweep, and the needs-reinstall check) resolves identity and the state root under that built environment, with the state home read from the installed job file. A later install from a shell that resolves another root refuses with `state-home-changed`. A run started by a verb still executes under the caller's environment. The runner applies phase 3's environment allowlist.

### Reliability
- **NFR-R01**: Every derived file, including the rendered plist and the install record, is written to a temp file and renamed.
- **NFR-R02**: A failed step leaves the previous job loaded or reports exactly which step failed and what state it left.

---

## 8. EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a bot with only a `manual` trigger has nothing to schedule. Install exits non-zero with a named reason and writes no plist and no install record.
- Maximum input: a cron that expands past the phase 2 dictionary cap is refused by the translator, and install writes nothing.
- Failure path: a lint failure, a preflight refusal or a kill-switch label exits non-zero with the failing step named, and the old job stays loaded and unchanged.
- First fire with no prior run: the skipped-slot summary is empty and the lateness class comes from the fired slot alone.
- Fire during a hold: the bot has an open needs-you item, so the fired slot is recorded as skipped with reason `held-needs-you` and nothing runs (operator decision D9).
- Moved checkout: the job fails at fire time with a launchd-level exit code. The check returns `runner-missing`, status in phase 7 shows it, and install again repairs it.
- Merged link: `/doctor:symlink link --mode merge` builds a real `.skilled` folder and links the entries inside it. The kind is decided from whether the runner's real path leaves the repository root, not from `.skilled` itself, so a merged link reads as `symlink`.
- Re-pin: the runner path still resolves after `/doctor:overlay repin`, so only `pin-changed` flags it.
- Missing install record: a hub label in `~/Library/LaunchAgents` with no install record is reported as `needs-reinstall` with reason `record-missing`, never treated as `ok`.
- A scheduled fire whose run ends `awaiting-decision` records its slot fields like any fire. It is not a failure and does not count toward the three-failures stop.

---

## 9. COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 17/25 | Three new modules, two modified files from phase 3, two test files; writes outside the repository to `~/Library/LaunchAgents` and the state root |
| Risk | 21/25 | First phase that makes agents run unattended; kill-switch and disabled-label semantics are easy to get wrong; stale plists after a re-pin run changed code |
| Research | 12/20 | research.md §7 covers the transaction; `man launchctl` documents that a disabled label does not load, but the exit codes and domain target still need a probe |
| Multi-Agent | 4/15 | One workstream; the real fire needs the operator watching |
| Coordination | 11/15 | Depends on phases 1, 2, 3 and 5; phases 7 and 8 and the system-skilled-doctor follow-up consume the install record |
| **Total** | **65/100** | **Level 3** |

---

## 10. RISK MATRIX
<!-- FILL: List each risk with impact, likelihood and one mitigation. GOOD: R1: a missing `--keep` value deletes every archive. Impact H, likelihood L. Mitigation: a test pins exit 2 before any delete. WEAK: Some risks exist. -->

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A first install fires before the operator enables it | H | M | ADR-003 probe before T007; T015 watches one scheduled minute with the label disabled |
| R-002 | A reinstall re-enables a label that was disabled as a kill switch | H | M | REQ-003 stops install on a `print-disabled` hit unless the explicit flag is passed; no `load` call anywhere |
| R-003 | A re-pin replaces the runner code under an installed plist, so the job runs code that never passed the preflight | M | M | The install record keeps `pin.commit`; the check returns `pin-changed` until install reruns the preflight |
| R-004 | A `.skilled` link is retargeted to another checkout, so the job runs another tree's code | M | L | The plist names the real runner path that passed the preflight (ADR-002), and the check returns `runner-retargeted` |
| R-005 | The `.skilled` kind is misread, for example a merged link read as a checkout | M | M | Decide the kind from the runner's real path against the repository root; a stubbed merged-link tree is a test case |
| R-006 | The system-skilled-doctor follow-up never lands, so a re-pin prints no schedule warning | L | M | `bots status` still shows `needs-reinstall` rows through phase 7; the follow-up is recorded with its hook point |
| R-007 | A drain agent respawns every 10 seconds on a folder that never empties | M | L | Phase 5 claim, quarantine and retry bound; T019 checks the folder empties |
| R-008 | `launchctl print` output changes on an OS update | M | L | Use only its exit status; read the plist back for the calendar check |

---

## 11. USER STORIES
<!-- FILL: Write one story per user. Name the actor, the want and the benefit. GOOD: As a backup host, I want `--keep 3` to leave 3 archives, so that `logs/archive` stays under its quota. WEAK: Users want the feature. -->

### US-001: Install a schedule that waits for me (Priority: P0)

**As an** operator, **I want** `bots schedule install <id>` to install the bot disabled and `bots enable <id>` to start it, **so that** no bot fires until I chose it.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story): AC-001, AC-002, AC-005, AC-007.

---

### US-002: Stop a bot at the scheduler (Priority: P0)

**As an** operator, **I want** a disabled label to stay disabled through reinstalls and reboots, **so that** the kill switch holds.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story): AC-003, AC-013.

---

### US-003: Learn when a schedule needs a reinstall (Priority: P1)

**As an** operator of a consumer repository with a linked or vendored `.skilled`, **I want** to be told when a move, a link change or a re-pin left a schedule stale, **so that** no job runs from a tree I did not install it from.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story): AC-011, AC-015, AC-016, AC-017.

---

### US-004: See what a late fire stood for (Priority: P1)

**As an** operator whose laptop slept, **I want** each fire to record its slot, lateness and the slots it skipped, **so that** I can tell a catch-up run from an on-time one.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story): AC-006, AC-012.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- What exit code and output does `launchctl bootstrap` give for a label that `print-disabled` lists, and which domain target (`gui/<uid>` or `user/<uid>`) do `disable`, `print-disabled` and `bootstrap` accept on this host? `man launchctl` says a disabled service cannot be loaded and that `enable` and `disable` take the system, user and user-login domains; it does not name `gui/`. Answered by the Setup probe on 2026-11-23: `bootstrap` on a disabled label exits 5 and leaves it unloaded, and `gui/<uid>` is accepted (decision-record.md ADR-003).
- How does the installer tell a first install held disabled from a label disabled as a kill switch, since both appear in `print-disabled`? Not answered by research.md. ADR-003 must record the answer before T007 is built.
- What does enabling a first install require from the operator? Proposed in decision-record.md ADR-004; operator-owned.
- Should the system-skilled-doctor re-pin flow call the needs-reinstall check after a clean re-pin? The hook point is named in ADR-002. The edit is not planned here; operator decision.
- Should a schedule keep firing while the same bot has an open needs-you item? Not designed here; phase 3 owns the item.
- Level: settled. The operator raised this phase to Level 3 on 2026-11-22 (decision-record.md, Operator Decisions).
- How first-install hold and kill switch are told apart: answered as built on 2026-11-23 by the install record's `hold` field (decision-record.md ADR-003, as built). The Setup probe ran live on 2026-11-23 and confirmed it (decision-record.md ADR-003, Accepted).
- A needs-you hold on a schedule fire: answered by operator decision D9 and built (REQ-018, AC-018).
- How does a scheduled run find its executor under launchd's bare `PATH`? The runner starts with an absolute interpreter, but it resolves `codex` and the other executor CLIs on `PATH`, and NFR-S02 keeps every environment value but the state home out of the job file. A real scheduled dispatch fails until this is built; the live script uses a bot whose precheck skips dispatch. Decided 2026-11-24 by the operator: install resolves the executor on the shell's PATH and keeps its absolute path in the install record (decision-record.md, Operator Decisions). Built 2026-11-24 (REQ-019, AC-019). Queued runs the drain job starts were added the same day (REQ-020, AC-020).
- The drain job relaunches about once a minute while a retried request waits, so phase 5's retry bound of three is reached in two or three minutes when a long run holds the lease. Should the bound or the throttle change? Open, for the operator.
- Open follow-up, not fixed here: uninstall and its orphan sweep ignore the clone rule. `holdingClone` in `installer.ts` is used only by install, so `bots schedule uninstall` run from a second clone of the same identity boots out and deletes a label the first clone installed. Should uninstall refuse with `label-held-by-clone` too? Open, for the orchestrator.
- Open follow-up, not fixed here: the needs-reinstall check never looks at the recorded Node interpreter path. A job whose `interpreter` was removed or upgraded away still reads `ok`, and its next fire fails before the runner starts. Should the check add an `interpreter-missing` reason? Open, for the orchestrator.
- With `XDG_STATE_HOME` unset, a fired job resolved `$HOME/.local/state` from launchd's `HOME`, so an install from a shell with another `HOME` diverged. Answered and built on 2026-11-23: the job always carries the resolved state home when the config names none (NFR-S02), and the agents folder comes from the account's home too.
- Entry conditions T001 and T002: answered on 2026-11-24. Phase 2 closed once its weekday probe ran, and the translator now emits a lone `Weekday` or `Day` key. The phase was built before that, on the orchestrator's brief.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
<!-- FILL: Leave the three links in place. Add `decision-record.md` when the packet has one. GOOD: Plan: See `plan.md`. WEAK: See the other docs. -->

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Record**: See `decision-record.md`
- **Closure Gate**: See `acceptance-criteria.md`

---
