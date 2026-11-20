---
title: "Implementation Plan: Phase 2: engine-framework-root-source-layout"
description: "Change adoptSource to the framework/ and root/ rule as the default for every consumer, cap the status LAYOUT lines at 20 plus one overflow line, refuse sources under root/skilled/, and let adopt find an excluded path's copy at the old path. The tests that state the old rule are swept, and old-layout fixtures prove old sources still apply."
trigger_phrases:
  - "engine framework root source layout plan"
  - "adoptSource default rule change plan"
  - "layout notice cap relayout migration plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: engine-framework-root-source-layout

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, one file: `.skilled/commands/doctor/scripts/overlay-engine.cjs` |
| **Framework** | None. Node built-ins only |
| **Storage** | No new field. `overlay-manifest.json` keeps its shape; only the paths adopt and relayout write follow the new rule |
| **Testing** | `node --test` over `.skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` |

### Overview
The phase runs in Skilled. `adoptSource` gets the new rule, so adopt, the strict-write hints, LAYOUT notes and `apply --relayout` all follow it with no caller change. Status caps its LAYOUT lines, adopt refuses `root/skilled/` landings and finds an excluded path's old-path copy, and `assertSafeToPlan` blocks a `root/skilled/` source. The swept tests and new cases prove the new rule, and old-layout fixtures prove old sources still apply.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Phase 001 is committed, and `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 on that commit
- [ ] `rg -n 'adoptSource\(' .skilled/commands/doctor/scripts/overlay-engine.cjs` lists the definition at `:5399` and the six callers at `:3371`, `:5465`, `:5469`, `:5544`, `:5556`, `:5563`
- [ ] `rg -n 'skilled-overlays/skilled/|\.\./overlays/skilled/' .skilled/commands/doctor/scripts/tests/` lists the old-rule expectations to sweep

### Definition of Done
- [ ] Every requirement in `spec.md` §4 has its acceptance check passing
- [ ] `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with the new cases included
- [ ] `spec.md`, `plan.md` and `tasks.md` name the same callers and lines
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One rule, no switch. A single naming function holds the rule, every caller goes through it, and reads stay verbatim.

### Key Components
- **`adoptSource(key)` (`:5399-5401`)**: `.skilled/X` becomes `framework/X`, exactly `.skilled` becomes `framework`, and any other `X` becomes `root/` plus `X` with its leading dots dropped. The six callers keep their one-argument calls.
- **Old-rule helper**: a small function beside `adoptSource` that returns `key.replace(/^\.+/, '')`, used only by the excluded-path fallback in adopt.
- **Status LAYOUT output (`:3606-3608`)**: prints the first 20 `offLayout` moves, then `LAYOUT   … N more; run ${ENGINE_COMMAND} apply --relayout` when more remain, the same shape as `reportNotCopied` (`:4676-4681`). The JSON report at `:3587` keeps the full list.
- **`assertSafeToPlan` (`:2759-2775`)**: an entry whose `source`, `fragment` or `base` is `root/skilled` or under `root/skilled/` goes into the `refused` map as a blocked overlay for its id, the way a bad removal path is reported today.
- **Adopt (`:5538-5575`)**: a destination starting `skilled/` is refused, since its source would land under `root/skilled/`. For an excluded path, `hasOverlayCopy` checks the new-rule path, then the old-rule path, and the source at `:5563` takes whichever exists, new-rule first. The refusal at `:5556` names the new-rule path.
- **Relayout (`:6215-6267`)**: a move whose target lands under `root/skilled/` is refused with the entry named, beside the existing taken-target refusal.

Left as they are: `planFileOverlay` (`:1817`) and `planDirectoryOverlay` (`:1855`) read sources verbatim, `isInSync` (`:3569-3570`) ignores `offLayout`, and LAYOUT stays out of `BLOCKING_STATES` (`:85`).

### Data Flow
Each caller hands `adoptSource` the destination key. `layoutMoves` compares each entry's current source with the result and returns the moves. Status prints at most 20 of them plus an overflow line, `--json` prints them all, and `apply --relayout` performs them and rewrites the manifest. Apply never consults the rule.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup records the engine suite's pass count on the phase 001 commit and lists every `adoptSource` call and old-rule test expectation. Implementation adds the failing new cases, changes `adoptSource`, caps the LAYOUT lines, adds the `root/skilled/` refusals and the excluded-path fallback, then sweeps the tests that state the old rule. Verification reruns the whole engine suite, which must exit 0, and checks that no doc or Barter file changed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The gate is `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs`, which must exit 0. A default change costs a test sweep, and the tasks list each part of it.

- **Swept in `overlay-engine-follow-up.test.cjs`**: the LAYOUT and relayout section (`:899-1170`), its comment at `:903`, the constants `PLACE_LAYOUT` (`:907`), `DIR_LAYOUT` (`:975`), `JSON_LAYOUT` (`:977`), `MARKED_LAYOUT` and `MARKED_BASE_LAYOUT` (`:979-980`), `BUNDLE_RELINKED_TARGET` (`:1210`), and the literal paths at `:1361-1366`, `:1398`, `:1403` and `:1438`. The audit fixture source at `:1481` stays on the old layout. The assertion source line at `:957` stays unedited, and only the value of `PLACE_LAYOUT` changes.
- **Swept in `overlay-engine-strict-writes.test.cjs`**: the hint and adopt paths at `:173`, `:189`, `:194`, `:279`, `:285`, `:288`, `:298`, `:310`, `:328`, `:337`, `:342`, `:356`, `:364`, `:372`, the taken-source and overlap refusals at `:392-418`, and the excluded-path refusal at `:573` and `:575`. The lines at `:180` and `:200` name an entry's own `source` and stay as they are.
- **Not swept**: `overlay-engine-{sync,repin,fixes,replay}.test.cjs` hold no LAYOUT, `offLayout`, `--adopt` or dot-dropped source line, so they need no change.
- **Swept elsewhere**: any phase 001 sibling-folder case that asserts an adopt, hint or layout path under `../overlays/skilled/`.
- **New cases**: the 20-line cap with its overflow line on an old-layout fixture, an old-layout fixture that applies and passes status, the excluded-path fallback with an old-path copy and with both copies, and the `root/skilled/` refusals in adopt, status and relayout.

The excluded-path test at `:547-562` keeps its copy at the old path, so it becomes the old-path fallback proof: `:554` and `:557` stay unedited, and its status still exits 0. Fixture manifest sources in `overlay-engine-fixtures.cjs:139-172` stay as written.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None new. Node.js with the built-in `node --test` runner, as the suite uses today. Phase 001's commit comes first for order only.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: An old-layout tree fails apply or status after the phase commit, or adopt and the LAYOUT notes disagree on a source path.
- **Procedure**: `git revert <phase-002 commit>`. Why this breaks no consumer in either direction is `spec.md` §2, Migration for Existing Consumers.
<!-- /ANCHOR:rollback -->

---
