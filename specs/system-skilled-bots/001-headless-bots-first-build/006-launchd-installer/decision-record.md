---
title: "Decision Record: Phase 6: launchd-installer"
description: "Decisions for the launchd installer, one Accepted and five Proposed: the install preflight, moved checkouts, the disabled first install, enabling, next fire time and the drain agent."
trigger_phrases:
  - "launchd installer decision record"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/006-launchd-installer"
    last_updated_at: "2026-11-22T10:48:32Z"
    last_updated_by: "spec-writer"
    recent_action: "Proposed six decisions for the launchd installer"
    next_safe_action: "Run the Setup probe, then settle ADR-003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-006-launchd-installer"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 6: launchd-installer

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The install preflight enforces the scheduling invariant

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 6 implementer, reviewed by the operator |

---

<!-- ANCHOR:adr-001-context -->
### Context

A schedule must never be installed before the thing it fires, its kill switches and its posture check exist (research.md §1 decision 6, §15). Phase order alone does not hold that rule at install time: a later edit could break the runner, or a definition could change between `bots run` and `bots schedule install`.

### Constraints

- The installer is the only code allowed to write a hub-labeled plist or call `launchctl bootstrap`.
- Repository identity must be known before install (phase 1 rule for research.md §16 Q5).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We propose**: Run a preflight at every install and refuse with a named reason when any check fails.

**How it works**: The preflight resolves the runner and the absolute interpreter, reads the state-root disable and pause switches, confirms repository identity, then runs the phase 2 checker and the phase 3 posture check on the definition. A refusal writes nothing to `~/Library/LaunchAgents`.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preflight at every install** | Holds the rule even after later edits; cheap to run | Adds a few checks to each install | 9/10 |
| Trust phase order only | No extra code | A broken runner can still be scheduled; nothing checks it at install time | 3/10 |
| Check once at first install | Fewer checks | A reinstall after a definition edit skips the posture check | 5/10 |

**Why this one**: The rule matters at the moment launchd gains a job, and only a check at that moment enforces it.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A broken bot, or one that fails the posture check, cannot reach launchd.
- Each refusal says which check failed.

**What it costs**:
- Install takes longer by the checker run. Mitigation: the checker is local and makes no network call.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A check passes in the preflight and fails at fire time | M | The runner repeats its own checks at fire time, as phase 3 specifies |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required by the scheduling invariant |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Reuses the phase 2 and phase 3 checks |
| 4 | **Fits Goal?** | PASS | Install is the phase deliverable |
| 5 | **Open Horizons?** | PASS | Any later backend can call the same preflight |

**Checks Summary**: 5/5 PASS, judged on reading only; nothing is built yet.
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `installer.ts` gains the preflight before render

**How to roll back**: Revert the preflight commit and uninstall any job installed after it.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: A moved checkout or a changed `.skilled` is detected and repaired by reinstalling

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-22 |
| **Deciders** | Operator, answering research.md §16 Q6 (Q001 below) |

---

<!-- ANCHOR:adr-002-context -->
### Context

Plists hold absolute paths, so a moved checkout breaks every job it installed (research.md §7). The earlier synthesis proposed a user-level runner shim. No iteration studied one.

In a consumer repository the tree under the plist can change without a move. The operator asked that the overlay system be taken into account:

- `/doctor:symlink link` can make `.skilled` a link to a Skilled checkout. With `--mode whole` `.skilled` itself is the link. With `--mode merge` the engine builds a real `.skilled` folder and links each entry inside it (`.skilled/commands/doctor/symlink.md` §4). A link can be removed or pointed at another checkout.
- `/doctor:overlay repin` moves a vendored `.skilled` to a new upstream commit. The engine copies the paths that `git diff --diff-filter=AMT` reports between the two commits and deletes those `--diff-filter=D` reports (`touchedPaths` in `.skilled/commands/doctor/scripts/overlay-engine.cjs`). It then writes the new commit into the overlay manifest's `pin.commit` (`writePin`). Every path stays where it was, and the runner code under it changes.
- The vendored tree's overlay folder is found through `.skilled-overlays.json` at the tree root, or `skilled-overlays/` by default (`.skilled/commands/doctor/assets/doctor-overlay-repin.yaml`).

Inferred, not run: because both lists come from git diffs between two commits, an untracked, gitignored path such as `.skilled/skills/.state/system-skilled-bots/` appears in neither, so a re-pin is not expected to remove run folders. Phase 1 confirms this by running a staged re-pin.

### Constraints

- No installed component outside the plist and the state root.
- Consumers can pin different Skilled commits.
- No edit to the overlay engine, the `/doctor:overlay` or `/doctor:symlink` docs or their workflow YAML in this phase. That is system-skilled-doctor's to change.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: Detect a changed tree and repair it by running install again. Install no shim. Record what install resolved, so the change can be detected.

**How it works**:
- Install writes `<state root>/<identity>/installs/<bot-id>.json` by temp file and rename. It holds the bot's labels, the plist's runner path, the repository-side runner path `<repo root>/.skilled/bin/bots.cjs`, the real path it resolved to, the tree root, the `.skilled` kind and, for a vendored tree, `pin.commit`.
- The kind is `symlink` when the runner's real path leaves the repository root, which catches whole and merged links alike. It is `vendored` when an overlay manifest is found as above. It is `checkout` otherwise.
- The plist names the real runner path, not the path through the link. A retargeted link then keeps running the tree that passed the preflight, never another tree's code unchecked, until install runs again.
- A read-only check in `installer.ts` compares each record with the tree now. It returns `runner-missing`, `runner-retargeted`, `kind-changed`, `pin-changed` or `record-missing`. Phase 7's `bots status` shows them as `needs-reinstall` rows. Install prints the same result.
- The record lives under the user-level state root, so a re-pin of the tree cannot lose it and a run cannot forge it.
- Post-repin hook point: the re-read step of `doctor-overlay-repin.yaml`, which runs `overlay-engine.cjs status` after any engine write and then names `/doctor:update record-base` as the next command. A system-skilled-doctor follow-up can call the check there and list the schedules that need a reinstall. This phase names the point and edits nothing there unless the operator approves.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Detect and reinstall, with an install record** | No new installed part; sees moves, link changes and re-pins | The job runs stale code or fails until someone reinstalls | 8/10 |
| Detect and reinstall by path comparison only | Smaller | Never fires after a re-pin, because the paths do not change | 5/10 |
| User-level runner shim | A move needs no reinstall | Unstudied; adds a version question across repositories pinned to different commits | 4/10 |
| Edit the overlay engine to reinstall after a re-pin | Repairs at once | Outside this phase's ownership; reinstall without the operator skips the disabled-default intent | 3/10 |

**Why this one**: research.md §7 supports detection and repair. The operator chose it and asked that the overlay system be in view, which the pin field covers.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- No extra component to version.
- A move, a link change and a re-pin are visible in status.

**What it costs**:
- A changed tree misses fires or runs older code until reinstall. Mitigation: phase 7 shows it as a row state, and install output prints it.
- One more file per bot under the state root. Mitigation: uninstall deletes it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator never notices the flagged job | M | Phase 7 shows the reason beside the launchd exit code |
| The kind is misread | M | Decide from the real path, test whole and merged links |
| The doctor follow-up never lands | L | `bots status` still shows the rows |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Moves, link changes and re-pins happen |
| 2 | **Beyond Local Maxima?** | PASS | Four options compared |
| 3 | **Sufficient?** | PASS | Reuses install; one record per bot |
| 4 | **Fits Goal?** | PASS | In phase scope; no doctor file edited |
| 5 | **Open Horizons?** | PASS | A shim or a doctor hook can still be added later |

**Checks Summary**: 5/5 PASS, judged on reading only; nothing is built yet.
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `installer.ts`: kind detection, the install record, the needs-reinstall check and replace on reinstall

**How to roll back**: Delete the install records and remove the check; reinstall stays a manual step.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: How a first install is held disabled

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-11-24 |
| **Deciders** | Phase 6 implementer, after the Setup probe |

---

<!-- ANCHOR:adr-003-context -->
### Context

A first install must fire nothing until the operator enables it (research.md §15 step 7). launchd keeps a disabled label disabled across reboots (research.md §7). `man launchctl` says that once a service is disabled, "it cannot be loaded in the specified domain until it is once again enabled", and research.md §7 reads it the same way. So a label disabled before `bootstrap` is expected not to load. That conflicts with step 6 of the transaction, which prints a loaded job. The exit code, the `print` output and the accepted domain target are not recorded on this host, so the mechanism is open.

A second gap follows. A first install held disabled and a label disabled as a kill switch both appear in `print-disabled`. Without a way to tell them apart, a reinstall of a never-enabled bot would stop with the kill-switch message (REQ-003). Neither research.md nor this record settles how to tell them apart.

### Constraints

- Never use `load -w`.
- Step 6 of the transaction expects `launchctl print` to report state. `man launchctl` says `print` output is not an API, so only its exit status and a human-readable check rely on it.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We propose**: Run `launchctl disable` on the label before `bootstrap`, if the Setup probe shows that bootstrap refuses cleanly with a known exit code, and treat that refusal as the expected result of step 5 on a first install. `man launchctl` predicts this refusal; it does not predict a loaded silent job. Otherwise write the plist and defer `bootstrap` until enable. Either way, `bots enable` must then bootstrap the job (ADR-004). How the installer tells a first-install hold from a kill switch is still to be recorded here before T007 is built.

**How it works**: T003 runs a throwaway plist through disable, bootstrap, print and one calendar minute and records the exit codes, the macOS version and the accepted domain target here. The installer then uses the option the probe supports.

**As built, before the probe (2026-11-23)**: no real `launchctl` call was allowed, so T003 did not run and this record stays Proposed. The installer takes the option that is safe whatever the probe shows:
- A held install runs `launchctl disable gui/<uid>/<label>` before the job file is moved into place, so a login that loads every file in the folder still skips it. It then runs `bootstrap` as step 5 and keeps its exit code as evidence, whatever it is. It runs `print`; if the host loaded the disabled label after all, it boots it out again, so the hold never depends on the unprobed exit code (`.skilled/skills/system-skilled-bots/runtime/lib/installer.ts:861`).
- A first install and a kill switch are told apart by the install record, not by `print-disabled`: the record's `hold` is `first-install` for a fresh install, `definition` for a `BOT.md` that says `enabled: false`, and `operator` after `bots disable`. A reinstall stops with `label-kill-switch` when the label is disabled and the record's hold is `operator` or null (disabled by hand). A label disabled with no record left, as after an uninstall, installs again under a `first-install` hold: install never enables, so the label stays disabled either way.
- The domain target is `gui/<uid>`, one constant in the default seams. The live script prints what each verb returned and settles it.

**Probe result (2026-11-23, macOS 27.0.1, 26A434)**: `gui/501` was accepted by every verb. `disable` exited 0, `bootstrap` on the disabled label exited 5 (Input/output error) and left the job unloaded, `print` exited 113, and no run record appeared across one held 5-minute slot (`scratch/live-install-result.txt:12`, `:15`, `:26`, `:29`). The mechanism as built stands, so this record is Accepted.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Disable, then bootstrap** | Uses the same switch as the scheduler stop layer; `print-disabled` shows it | `man launchctl` says the job will not load, so step 6 has nothing to print; the exit code is unrecorded; it looks like a kill switch | 7/10 |
| Write the plist, bootstrap only on enable | Nothing loaded means nothing fires | Step 6 cannot print a loaded job at install time | 6/10 |
| Bootstrap enabled with the state-root disable switch set | Uses the run-layer switch | launchd still starts the runner, so the job is not silent | 3/10 |

**Why this one**: The first option keeps one scheduler-level switch for both the default and the kill switch, but it waits on the probe.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- One switch to read for scheduler state.

**What it costs**:
- A probe in Setup. Mitigation: it uses a label outside the hub grammar and is removed before close.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Probe result differs across macOS versions | M | Record the macOS version beside the result |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required by the disabled default |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Probe first, no guess |
| 4 | **Fits Goal?** | PASS | On the install path |
| 5 | **Open Horizons?** | PASS | Any backend can keep a disabled default |

**Checks Summary**: 5/5 PASS, judged on reading only; nothing is built yet.
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `installer.ts` disabled-default step

**How to roll back**: Switch to the deferred-bootstrap option.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: What enabling a first install requires (operator-owned)

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Operator |

---

<!-- ANCHOR:adr-004-context -->
### Context

A disabled first install needs a deliberate step to start firing. The step should be hard to take by accident and should not skip checks that passed at install time but may have changed since.

### Constraints

- The settled CLI verbs include `bots enable`; no new verb is added.
- Never `load -w`.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We propose**: `bots enable <id>` reruns the preflight, then runs `launchctl enable` on the bot's labels, bootstraps each label that is not loaded, clears its state-root disable switch, and prints the labels it enabled. `man launchctl` describes `enable` as making a service loadable again, not as loading it, so a job that a disabled bootstrap left unloaded needs its own `bootstrap`. The T003 probe confirms this.

**How it works**: Enable is per bot and names each label. The CLI calls the installer module for the `launchctl` steps, so `bootstrap` stays in one module. No install flag enables a fresh job by default.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **`bots enable <id>` with preflight** | One verb for both switch layers; checks rerun | Two layers change together | 8/10 |
| `bots schedule install --enable` | One command | Makes skipping the disabled default easy | 4/10 |
| Operator runs `launchctl enable` by hand | No code | State-root switch and launchd can disagree | 3/10 |

**Why this one**: Reusing the settled verb keeps the surface small and puts the checks on the path to the first fire.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Enabling is a visible, separate act.

**What it costs**:
- One more command per bot. Mitigation: it prints what it enabled.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Operator expects install alone to start the job | L | Install output says the job is disabled and names the enable command |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required by the disabled default |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Reuses a settled verb |
| 4 | **Fits Goal?** | PASS | On the path to the first fire |
| 5 | **Open Horizons?** | PASS | Works for later backends |

**Checks Summary**: 5/5 PASS, judged on reading only; nothing is built yet.
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `.skilled/bin/bots.cjs` enable and disable reach the launchd label through `installer.ts`

**How to roll back**: Keep enable at the state-root switch only.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The next fire time is reported as UNKNOWN

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 6 implementer; answers research.md §16 Q7 by evidence |

---

<!-- ANCHOR:adr-005-context -->
### Context

No launchd surface reports the next fire time of a calendar job (research.md §7, §16 Q7). A generated plist cannot be checked by asking launchd when it will run.

### Constraints

- No second cron evaluator (research.md §16 Q4).
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We propose**: Report the next fire time as UNKNOWN, and verify the install by reading the plist back against the translator's output and by `launchctl print`.

**How it works**: Install compares the installed calendar dictionaries with the dictionaries the translator produced and reads `launchctl print` for the loaded state and the resolved program.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **UNKNOWN plus read-back** | Honest; uses data the hub already has | No next-fire display | 8/10 |
| Compute next fire with a cron evaluator | Shows a time | A second evaluator can drift from the translator | 3/10 |
| Compute next fire from the translator's dictionaries | Shows a time without a new evaluator | Not designed; DST behavior unproven; launchd sleep merging makes it a guess | 5/10 |

**Why this one**: A displayed time that launchd does not confirm would be a claim the hub cannot check.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- The install proof uses only observed data.

**What it costs**:
- Status cannot say when a job runs next. Mitigation: phase 7 shows the schedule text and last fire.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Read-back passes but launchd interprets a form differently | M | The phase 2 weekday probe covers the one known doubtful form |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Needed for install proof |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Simplest honest answer |
| 4 | **Fits Goal?** | PASS | On the install path |
| 5 | **Open Horizons?** | PASS | A computed time can be added later from the slot lister |

**Checks Summary**: 5/5 PASS, judged on reading only; nothing is built yet.
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `installer.ts` read-back and print step

**How to roll back**: Drop the read-back and keep `launchctl print` only.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: One queue-drain agent per repository identity

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-11-22 |
| **Deciders** | Phase 6 implementer, reviewed by the operator |

---

<!-- ANCHOR:adr-006-context -->
### Context

The queue lives under the state root keyed by repository identity (research.md §9). Phase 5 fixes the layout: `<state root>/<repository identity>/requests/` with `inbox/` as the only watched folder and `tmp/`, `claimed/`, `done/`, `quarantine/` and `seen/` as siblings. `QueueDirectories` keeps a job alive while its folder is non-empty, and a folder that never empties respawns the job every 10 seconds.

### Constraints

- Temp, claimed and quarantine folders stay outside the watched folder.
- The drain agent uses the same transaction, preflight and disabled default as bot schedules.
<!-- /ANCHOR:adr-006-context -->

---

<!-- ANCHOR:adr-006-decision -->
### Decision

**We propose**: Install one drain agent per repository identity, watching only that repository's `requests/inbox/` folder and running `bots drain`.

**How it works**: The label is the drain form phase 2 ADR-004 proposes, `com.skilled.bots.<identity>.drain`. Phase 2 reserves the bot id `drain` and its checker refuses a bot with that id, so a drain label never collides with a bot label. Install refuses when the watched folder contains any of the sibling folders.

**Respawn back-off, as built (2026-11-23)**: phase 5's drain stops a pass on a setup fault (`identity-unknown`, `run-folder-refused`) and puts the request back, so the watched folder stays non-empty and launchd would start the job again for as long as the fault lasts. Two layers bound that. The drain job file sets `ThrottleInterval` to 60 seconds, against launchd's default of 10, so the job starts at most once a minute. The job runs `bots drain --scheduled`, which keeps a back-off file beside the request folders, never inside the watched one: a refused pass opens a 300-second window that doubles per fault up to 3,600 seconds, a start inside the window returns at once without claiming or running anything, and a clean pass removes the file. The tests are `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts:671` (the back-off with an injected clock) and `.skilled/skills/system-skilled-bots/runtime/tests/installer.vitest.ts:993` (the drain job's own program arguments, run under the bare PATH through the CLI). A repository whose identity cannot be resolved has no state folder to keep the window in, so only the throttle bounds it.
<!-- /ANCHOR:adr-006-decision -->

---

<!-- ANCHOR:adr-006-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One per repository** | Matches the queue keying; one repository's respawn loop cannot stall another | One agent per repository | 8/10 |
| One global drain agent | One job | Watches many folders; one bad queue affects all | 4/10 |
| No drain agent; drain on each fire | No extra job | CLI and git-hook requests wait for an unrelated fire | 3/10 |

**Why this one**: The queue is already split by repository, so the agent follows the same split.
<!-- /ANCHOR:adr-006-alternatives -->

---

<!-- ANCHOR:adr-006-consequences -->
### Consequences

**What improves**:
- Queued requests run without a person.

**What it costs**:
- One more launchd job per repository. Mitigation: install and uninstall treat it like any bot schedule.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Respawn loop on a request that never leaves the folder | M | Phase 5 claim before dispatch, quarantine and retry bound; T019 checks the folder empties |
<!-- /ANCHOR:adr-006-consequences -->

---

<!-- ANCHOR:adr-006-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Required for queued requests |
| 2 | **Beyond Local Maxima?** | PASS | Three options compared |
| 3 | **Sufficient?** | PASS | Reuses the install path |
| 4 | **Fits Goal?** | PASS | On the phase scope |
| 5 | **Open Horizons?** | PASS | A later webhook producer writes to the same queue |

**Checks Summary**: 5/5 PASS, judged on reading only; nothing is built yet.
<!-- /ANCHOR:adr-006-five-checks -->

---

<!-- ANCHOR:adr-006-impl -->
### Implementation

**What changes**:
- `plist-render.ts` drain plist
- `installer.ts` drain install

**How to roll back**: Uninstall the drain agent; `bots drain` by hand still works.
<!-- /ANCHOR:adr-006-impl -->
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:operator-decisions -->
## Operator Decisions
<!-- FILL: Leave the table empty: a full-auto save fills it from captured operator answers. Hand-write a row only for an answer the capture missed, with the next free id. GOOD: Q004 decides `Keep the archive for 30 days`, gives the stated reason and names REQ-002. WEAK: Q004 says `Discussed retention` and leaves the other cells empty. -->

| ID | Decided | Why | Supersedes | Carried by |
|----|---------|-----|------------|------------|
| Q001 | Detect a moved checkout and reinstall, and take the overlay system into account | Operator answer to research.md §16 Q6, 2026-11-22 | ADR-002 Proposed status | ADR-002, REQ-012, REQ-015 to REQ-017 |
| Q002 | Raise this phase to Level 3 | Operator answer on levels, 2026-11-22 | Level 2 scaffold | spec.md, plan.md, tasks.md |
| Q003 | A schedule fire while the bot has an open needs-you item is held and recorded as a skipped slot with reason `held-needs-you` | Operator answer D9, 2026-11-22. The operator picked the recommended option. Phase 3 owns the runner check | Firing freely during an open item | REQ-018, AC-018, T028 |
| Q004 | Run `scratch/live-install.sh` once the review fix is verified: one real disabled install, one enable, one fire, the drain job, then uninstall | Operator answer, 2026-11-23. The operator picked the recommended option | AC-002, AC-005, AC-008, AC-009 left Unmet | AC-002, AC-005, AC-008, AC-009 |
| Q005 | After the second review returned REQUESTED_CHANGES (disable stops nothing when the shell's `XDG_STATE_HOME` differs from the job's), fix it and dispatch a third review | Operator answer, 2026-11-23, to the step 7 halt. The operator picked the recommended option | The workflow's halt after a second REQUESTED_CHANGES | REQ-003, R-002, `tests/installer.vitest.ts` disable-from-another-shell tests |
| Q006 | After the third review returned REQUESTED_CHANGES (a reinstall from a shell with another state home skipped the kill-switch guard), fix the class: install refuses with `state-home-changed`, every other verb resolves the root through the installed job, then dispatch a fourth review | Operator answer, 2026-11-23. The operator picked the recommended option | Patching one verb per review round | REQ-003, NFR-S02, R-002 |
| Q007 | After the fourth review returned REQUESTED_CHANGES (an identity read from the shell's `GITHUB_REPOSITORY` diverges from the job's), close the class by construction: one builder makes the env launchd gives the job, install refuses with `job-env-diverges` when `(identity, state root)` differs between the shell env and the job env, every verb uses the job env, then one fifth review. No further per-variable round is offered | Operator answer, 2026-11-23. The operator picked the recommended option | Q006's per-verb fix and patching one variable per round | REQ-003, REQ-004, NFR-S02, R-002 |
| Q008 | After the fifth review returned REQUESTED_CHANGES (installed jobs were looked up by the live identity, so an identity change orphaned a firing job), fix it by looking jobs up by the `--repo` path in each job file, add an `identity-changed` refusal and reinstall reason, make disable stop the old label, fold in the three P2s, and verify by orchestrator rerun with no further review | Operator answer, 2026-11-23. The operator picked the recommended option | A sixth review round | REQ-003, R-002 |
| Q009 | A scheduled run finds its executor through an absolute path resolved on the shell's PATH at install and kept in the install record. | Not stated. | None | spec.md open questions, implementation-summary.md Known Limitations 2 |
| Q010 | Build the executor path pin for scheduled runs next. | Not stated. | None | REQ-019, AC-019, T031 to T034 |
| Q011 | Extend the executor pin to queued runs the drain job starts. | Not stated. | None | REQ-020, AC-020, T035 to T037 |
| Q012 | Run one live model fire under launchd to prove the pinned executor. | Not stated. | None | implementation-summary.md Verification, scratch/live-model-fire.sh |
| Q013 | Run one live queued model fire through the drain job under launchd. | Not stated. | None | implementation-summary.md Verification, scratch/live-drain-fire.sh |
<!-- /ANCHOR:operator-decisions -->

---

<!-- ANCHOR:operator-answers-verbatim -->
## Appendix: Verbatim Operator Answers

Each appendix item uses the same id as its operator decision. The options are included so the record preserves the full offered choice set.

**Q001** (moved checkout): "1 but take notice of our overlay system". Option 1 was detect and reinstall. The other offered options are not recorded in this folder.

**Q002** (levels): "Raise to Level 3".

**Q003** (D9, asked as "While a bot has an open needs-you item, should its schedule keep firing new runs?"): "Hold new runs (Recommended)".

**Q004** (asked as "Can I run it once the current review fix is verified?"): "Yes, run it (Recommended)". The other option was "No, leave rows Unmet".

**Q005** (asked as "Phase 006's second review fails on a new P1 that the first fix exposed... How should I proceed?"): "Fix it, review again (Recommended)". The other options were "Fix it, skip third review" and "Waive and record it".

**Q006** (asked as "Phase 006's third review fails on the same class of bug again... How should I proceed?"): "Class fix + 4th review (Recommended)". The other options were "Fix it, I verify only" and "Waive and record it".

**Q007** (asked as "Phase 006's fourth review fails again, the same class along a new axis... How should I proceed?"): "By-construction fix + 5th review (Recommended)". The other options were "Same fix, I verify only" and "Waive and record it".

**Q008** (asked as "Phase 006's fifth and final review found one P1... How should I proceed?"): "Fix it, I verify only (Recommended)". The other option was "Waive and record it".

### Q009
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01L1cQBuyUTx39BXorB8KEL2:1 -->

Question:
```text
A scheduled bot cannot yet reach its executor. launchd starts jobs with a bare PATH (/usr/bin:/bin:/usr/sbin:/sbin), so `codex` and the other executor CLIs are not found. The live test only passed because its bot never dispatches. How should a scheduled run find its executor?
```

Options:
```text
Pin absolute path (Recommended)
Fixed PATH in job
Leave it open
```

Answer:
```text
Pin absolute path (Recommended)
```

### Q010
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01Ax2XGTaQtPtVnyUXWWJ7zL:0 -->

Question:
```text
Phase 006 is closed and pushed. Scheduled bots still can't reach their executor, because launchd's bare PATH hides `codex` and the other CLIs. You chose to pin each executor's absolute path at install, and that build is the next piece of work. What should I do next?
```

Options:
```text
Build path pinning (Recommended)
Close 003/004/005/007 rows
Both, pinning first
Stop here
```

Answer:
```text
Build path pinning (Recommended)
```

### Q011
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01HzPv5cm8r9eWhHt1rQzA2V:0 -->

Question:
```text
Scheduled bots can now find their executor (pushed as ccccc90822a). Queued runs still can't: the drain job also starts under launchd's bare PATH, and a bot that is only enabled has no install record to take a path from. What should I do next?
```

Options:
```text
Pin for drain too (Recommended)
Close 003/004/005/007
Both, drain first
Stop here
```

Answer:
```text
Pin for drain too (Recommended)
```

### Q012
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01C3Xc8C9nRtxU4b7T37sDrP:1 -->

Question:
```text
Executor pinning is done for both scheduled and queued runs. What should I do next on system-skilled-bots?
```

Options:
```text
Close 003/004/005/007 (Recommended)
Live model fire test
Prepare the merge to main
Stop here
```

Answer:
```text
Live model fire test
```

### Q013
<!-- source: claude:335d5a41-9d36-45cb-8bae-6e6010fef894:toolu_01T8Jm11jznJL9B1zbHxe9L6:1 -->

Question:
```text
The executor pin is proven live for scheduled runs. What should I do next on system-skilled-bots?
```

Options:
```text
Close 003/004/005/007 (Recommended)
Live drain fire test
Prepare the merge to main
Stop here
```

Answer:
```text
Live drain fire test
```

<!-- /ANCHOR:operator-answers-verbatim -->

---
