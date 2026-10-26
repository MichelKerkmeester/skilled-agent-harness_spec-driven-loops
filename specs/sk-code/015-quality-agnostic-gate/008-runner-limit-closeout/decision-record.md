---
title: "Decision Record: Runner limit closeout"
description: "The five choices this phase rests on: proving the checker a hook names, an opt-in read-only freshness mode, one bounded workspace listing measured by five runs, the guard boundary with its ignored-path measurement and the repository condition on the spec-folder checklist row."
trigger_phrases:
  - "runner limit closeout decision record"
  - "quality runner ADR"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/008-runner-limit-closeout"
    last_updated_at: "2026-10-26T08:10:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Wrote the five decisions this phase rests on"
    next_safe_action: "Run the strict validator, then execute tasks.md from T001"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs"
      - ".skilled/skills/sk-code/sk-code-quality/scripts/lib/run-check.cjs"
      - ".skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-runner-limit-closeout"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Runner limit closeout

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

This record holds the decisions this phase rests on. The requirements they serve are in [spec.md](spec.md), the steps are in [plan.md](plan.md), and the proof that closes them is in [acceptance-criteria.md](acceptance-criteria.md). Each status line reads `Accepted, pending operator confirmation at program end`, the line the operator's standing autonomous-build instruction gives every decision in this program. ADR-001 to ADR-003 close three of the items the built-in runner phase left in its limitation list. ADR-004 settles the guard boundary with the measurement the plan already took, and ADR-005 settles how far the spec-folder checklist row reaches. Every line number in this record was read at HEAD `f69e5cd2e8`, before the config phase lands on this branch.

---

<!-- ANCHOR:adr-001 -->
## ADR-001: The layer probe proves the checker a hook names

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-001-context -->
### Context

`probePreCommit` reads the hook text, matches one hygiene reference, checks the hook file's own execute bit, applies the trust gate and returns `present` (`quality-gate.cjs:1217-1241`). It never resolves the checker path the hook text names. The current fixture already shows the gap. `unit: layers` writes a hook naming `$ROOT/check-comment-hygiene.sh`, no such file exists in that fixture repository, and the probe reads `present` (`quality-gate.test.cjs:420-458`).

The state carries more than a report. A `present` layer makes a finding on an untouched line block the run, because `applyLayerRule` reads that layer as whole-file coverage (`quality-gate.cjs:1288-1300`). A layer that reads `present` for a checker that cannot run therefore lends whole-file authority to a checker that never runs.

### Constraints

- A hook that names no checker stays `absent`, and a hook its trust gate skips stays `untrusted`. Both are settled states from the built-in runner phase.
- The probe may not start a process or evaluate the hook as shell text, because the hook belongs to the target repository and a probe is a read.
- This repository's own hook names the checker through `${SOURCE_ROOT}` at `.skilled/scripts/git-hooks/pre-commit:126`, and `SOURCE_ROOT` is `.skilled`, or `.opencode` when the framework tree lives there (`:22-23`).
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: after the trust gate, resolve every token in the hook text that ends in `check-comment-hygiene.sh` against four roots, and report `present` only when one candidate is a regular file with the execute bit. Otherwise report `broken`, the state the contract defines as installed but not runnable, with a repair line naming the path the probe could not resolve.

**How it works**: the resolution drops a leading `$NAME` or `${NAME}` because the probe does not know the variable's value, then joins the remainder to the repository root, the `.skilled` source root, the `.opencode` source root and the repository that owns the hook through `git rev-parse --git-common-dir`. One candidate that is a regular file with the execute bit is enough to report `present`. `runner-contract.md` section 2 gains the definition and this cause.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Resolve against four roots (chosen)** | Proves a runnable checker for this repository and for a foreign one, starts no process | A hook that builds the path some other way reads `broken` | 8/10 |
| Keep the hook-file check alone | Smallest change, and the current cases stay green | The false `present` stays, so the whole-file rule keeps its false authority | 3/10 |
| Resolve only the `SOURCE_ROOT` variable | Exact for this repository's hook | Writes one variable name into the runner as the only accepted spelling | 5/10 |
| Evaluate the hook text as shell | Resolves any spelling | Runs text the target repository wrote inside a probe | 1/10 |

**Why this one**: it proves the property the layer claims without executing anything the target repository wrote.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- A `present` pre-commit layer now means the checker exists and can run, so the whole-file rule rests on a checker that will actually scan.
- A hook naming a deleted checker reads `broken`, and the repair line names the path that is missing.

**What it costs**:
- One resolution rule to keep aligned with the hooks this framework ships. Mitigation: `unit: layers` covers a present checker, a missing checker and a checker without the execute bit, and this repository's own hook stays at `present`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A hook names the checker in a spelling the resolution misses | M | Four roots cover the shipped shapes, and every token ending in the checker name is a candidate |
| A wrapper script sits between the hook and the checker | L | The wrapper is a regular file with the execute bit, so `present` is the honest state for it |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The fixture proves a `present` layer for a checker that does not exist |
| 2 | **Beyond Local Maxima?** | PASS | Four options were compared, two of them measured against the current test |
| 3 | **Sufficient?** | PASS | Three probe cases plus this repository's own hook cover both directions |
| 4 | **Fits Goal?** | PASS | A layer state that cannot be proven must not read as installed |
| 5 | **Open Horizons?** | PASS | The same resolution serves a foreign repository, which is the point of the gate |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `quality-gate.cjs` gains the resolution inside `probePreCommit`, after the trust gate.
- `runner-contract.md` section 2 defines `broken` and the resolution rule.
- `quality-gate.test.cjs` gains the three probe cases.

**How to roll back**: return `present` where the resolution block starts, then run `unit: layers` and confirm the three new cases fail.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The dist freshness check gets an opt-in read-only mode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-002-context -->
### Context

`checkPackageFreshness` writes a cache record with `origin: 'checker'` when a package reads fresh (`dist-freshness.cjs:806`), at the path `cachePathFor` derives beside the dist entry, `.dist-freshness-<package>-<hash>.json` (`:295-299`). The writer is a small atomic temp-and-rename (`:325-347`). The runner promises that a run writes nothing, and the guard lists neither ignored paths nor the hub's own tree, so this write lands unseen. The built-in runner phase declined to declare a generated path for that reason and left the list empty.

A matching stored record short-circuits the check to `fresh` before any source hashing (`:760-773`), so the record is also the reason a second run is cheap. That is why the write cannot simply be removed from the library.

### Constraints

- Four session-start hook configs call `check-dist-staleness.sh`, and `--all` calls it across every package. All of them rely on the writable default.
- The freshness library belongs to `system-spec-kit`, not to this hub, so a behavior change there reaches every caller.
- A declared generated path still has to reach the adapter, because the point of the change is a real dist check rather than a tested stand-in.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: give the freshness library an opt-in read-only mode, leave its default writable, and have the runner ask for the read-only path. In read-only mode the cache record is not written and the returned verdict is unchanged.

**How it works**: `checkPackageFreshness` and `checkAllFreshness` take a `readOnly` option, and the library CLI takes `--no-write`, so a shell caller asks for the same mode. `check-dist-staleness.sh` passes `--no-write` on its per-file `check-file` call when `SPECKIT_DIST_READ_ONLY=1` is set, and `runDistAdapter` sets that variable beside `SPECKIT_DIST_AUTO_REBUILD=0`. A read-only run reads a stored record when one exists and computes the same verdict when it does not.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Opt-in read-only mode, writable default (chosen)** | The no-write promise holds where the gate runs, every existing caller keeps its behavior | The library carries one more option and one more flag | 9/10 |
| Make the library never write | Closes the gap at the source for every caller | Removes the short-circuit the session-start hooks rely on, and charges every run a full source hash | 3/10 |
| Delete the record after the run | The tree looks clean afterwards | Still a write, and the deletion races a concurrent caller | 2/10 |
| Skip the dist adapter inside the runner | No write, no change to another skill | The generated path stays unchecked, which is the item this phase exists to close | 3/10 |

**Why this one**: it puts the no-write guarantee where the promise is made and leaves the library's default to the callers that depend on it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- A run over a declared generated path really invokes the dist checker and writes nothing beside the dist entry.
- Four session-start callers and `--all` keep the writable behavior their self-heal needs.

**What it costs**:
- A read-only check pays the source hash a stored record would have saved, on each run. Mitigation: the option is set only on the runner's per-file call, and the record the session-start hooks write is still read first when it matches.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A later caller forgets the mode | M | The mode is a named option, a named flag and a named switch, the contract states it, and the fixture snapshot fails when a run creates or rewrites a file beside a dist entry |
| The library's default changes by accident | H | `unit: dist read-only` shows a record absent after a read-only check and present after a writable one, in the same temporary workspace |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The cache write sits between a declared generated path and the no-write promise |
| 2 | **Beyond Local Maxima?** | PASS | Four options were compared, each against the callers the library already has |
| 3 | **Sufficient?** | PASS | One option, one flag, one switch, and a case that proves both modes |
| 4 | **Fits Goal?** | PASS | The goal requires that a run writes nothing, and the adapter is the only write path left |
| 5 | **Open Horizons?** | PASS | Another caller that needs the mode passes the same option, and no default moves |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- `dist-freshness.cjs` gains the option on both entry points, the `--no-write` flag and the exports that carry them.
- `check-dist-staleness.sh` passes the switch on the per-file call.
- `quality-gate.cjs` sets the environment beside the auto-rebuild switch, and `quality-defaults.json` declares the generated rows.

**How to roll back**: drop the option and the flag, and remove the switch from the shell caller and the adapter, then run `unit: dist read-only`.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: One bounded workspace listing, measured by five runs of one command

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-003-context -->
### Context

A worktree run reads the workspace three times. `collectScope` lists the untracked files once (`quality-gate.cjs:686`), and each of the two guard snapshots lists them again (`run-check.cjs:162`, reached through `withGuard` at `:190-195`). The two-second budget covers fifty changed files, and the plan records the scope at HEAD `f69e5cd2e8` printing 2.01 to 2.28 seconds over five runs, so every run was over budget before any change.

The probe also says where the time sits. The whole-tree untracked listing cost 0.71 to 1.02 seconds over three runs, and the same listing bounded to `.skilled/skills/sk-code/` cost 0.02 seconds. `tasks.md` T004 records a heavier baseline of 2.89 to 5.29 seconds with the machine under load, so the after numbers have to be read against a baseline taken with the same command on the same machine.

### Constraints

- No optimization may weaken a check, the read-only invariant or the guard.
- The set of paths a snapshot hashes for a given scope must not shrink, because that set is what detects a write.
- A timing figure is recorded, never asserted, so no test fails on a slow machine.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: read the workspace listing once per run, bound it to the folders the scope reaches, share it between the scope and both snapshots, take no untracked listing at all for a `--files` scope, and prove the result with five runs of one recorded command.

**How it works**: `collectScope` takes the listing and hands it to `withGuard` through the earlier-snapshot argument the guard already accepts, and `takeSnapshot` hashes the entries it is given instead of listing again. The measurement is `/usr/bin/time -p` around a `--files` run over fifty paths from `git ls-files '*.cjs'`, five times, with `git rev-parse --short HEAD` and the machine recorded beside the five lines. A bounded pool of `node --check` and `bash -n` spawns is considered only after the listing change is measured, because it touches every check while the repeated walks sit behind one seam.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One bounded listing, shared (chosen)** | Removes two whole-tree walks and keeps every path the guard hashed | The listing has to be threaded through two modules | 9/10 |
| Keep three listings | No change to the guard | Every run stays over the recorded budget | 2/10 |
| Cache the listing in the process for the run | Same saving with less plumbing | A cached list goes stale, so a file created between the two snapshots is invisible | 3/10 |
| Spawn a bounded pool first | Also saves time | Touches every check and leaves the repeated walks in place | 5/10 |

**Why this one**: it removes the repeated walks without shrinking what the guard hashes.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- A fifty-file run meets two seconds on this machine, and the measurement phase can gate on the same command.
- A `--files` run pays no tree walk at all, so its git cost is bounded by the scope it was given.

**What it costs**:
- The scope and the guard now share one seam, so a change to the listing shape reaches both. Mitigation: `unit: guard snapshot source` asserts one listing per snapshot and no listing for `--files`, and `unit: scope listing` asserts the bounded pathspec.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The bounded listing misses a path the full listing caught | M | A stand-in check creates an untracked file inside the scope, and the run must still end with exit 3 and name it |
| The after numbers are read under load | L | Baseline and after numbers come from the same command on the same machine, with HEAD beside both |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Every recorded run of the scope was over the two-second budget |
| 2 | **Beyond Local Maxima?** | PASS | Four options were compared against the recorded timings |
| 3 | **Sufficient?** | PASS | Five runs of one command, plus cases that assert one listing and none for `--files` |
| 4 | **Fits Goal?** | PASS | The budget is the number the measurement phase gates on |
| 5 | **Open Horizons?** | PASS | A spawn pool stays available if the listing change falls short |
<!-- /ANCHOR:adr-003-five-checks -->

**Checks Summary**: 5/5 PASS

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `collectScope` in `quality-gate.cjs` produces the listing and bounds it.
- `takeSnapshot` in `lib/run-check.cjs` consumes it.
- `runner-contract.md` states the listing count, and the test file gains `unit: scope listing` and `unit: guard snapshot source`.

**How to roll back**: restore the per-snapshot listing, then run `unit: guard snapshot source` and the five-run command.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: The guard watches the target repository and the scope, with a bounded ignored watch

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-004-context -->
### Context

The guard hashes the tracked diff, every untracked file and the commit HEAD names (`run-check.cjs:153-173`). It lists no ignored path, so a write to an ignored file is invisible to it. The dist adapter's cache record is exactly such a write, as ADR-002 records. The same limit means a write in the hub this runner lives in is invisible too, because the guard hashes the target repository only. Nothing in the contract states either boundary, so a reader cannot tell what the guard would catch.

The plan recorded the ignored listing at both bounds before this record was written. The decision rule below takes the bounded number and the whole-tree number and settles whether the watch is affordable.

### Constraints

- The budget this phase meets is two seconds for fifty files, so a watch that costs a large share of it defeats the phase.
- The watch may hash only folders the scope already reads, because a path outside the scope is outside what the run was asked to check.
- Whatever the outcome, `runner-contract.md` states what the guard sees and what it does not.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: add a bounded watch of ignored paths inside the scope, refuse the whole-tree watch, and state both halves of the boundary in the contract. The decision rule is fixed and the two numbers decide it. The watch is added when its measured cost stays under 50 milliseconds on this machine and it hashes only folders the scope already reads.

The measurement: the whole tree listed 91555 ignored entries in 0.91 to 1.43 seconds over six runs.

The same listing bounded to the dist folder of the spec-kit runtime listed 447 entries in 0.02 seconds.

So the bounded watch sits under the budget and the whole-tree watch costs at least eighteen times that budget, on folders no check in the scope reads. Task T023 repeats both measurements on the landed tree, and a bounded number over 50 milliseconds puts the target-repository boundary back without touching the rule.

**How it works**: `takeSnapshot` takes the ignored listing bounded to the same folders as its untracked listing, so both come from one pass per scope. The contract then states what the guard sees, which is the tracked diff, the untracked files inside the scope and the ignored paths inside the scope. It states what stays outside, which is a write outside the scope, a write in another repository and a write to the hub itself.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Bounded ignored watch inside the scope (chosen)** | Catches an ignored write where a check runs, at the measured bounded cost | One more listing per scope | 8/10 |
| Whole-tree ignored watch | Catches every ignored write in the repository | Costs 0.91 to 1.43 seconds, which is most of the budget the phase just met | 2/10 |
| Keep the tracked and untracked watch and state the boundary only | No cost | The cache record beside a dist entry stays invisible, so a promise rests on a watch that cannot see it | 4/10 |
| Watch the hub as well as the target repository | Covers the tree the adapter itself writes in | The hub is not the repository under test, and its size is outside the measured scope | 3/10 |

**Why this one**: it closes the gap the dist adapter opened at the bound the measurement proves affordable, and it states where the guard still stops.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- An ignored write inside the scope now ends the run rather than passing unseen.
- A reader of the contract can tell exactly which writes the guard catches and which it leaves.

**What it costs**:
- Every scope pays one more listing, measured at 0.02 seconds at the folder bound. Mitigation: the listing shares the folders the untracked listing already walks.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The bounded watch misses an ignored write outside the scope | M | The contract names that write as outside the watch, so no run claims to have seen it |
| The bounded cost grows on a bigger tree | L | The decision rule re-reads the measurement on the landed tree, and a number over 50 milliseconds restores the boundary |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | An ignored write beside a dist entry is invisible to the guard today |
| 2 | **Beyond Local Maxima?** | PASS | Four options were compared, two of them with a measured cost |
| 3 | **Sufficient?** | PASS | One bounded listing at the scope bound, and the boundary stated for the rest |
| 4 | **Fits Goal?** | PASS | A promise to write nothing needs a guard that can see the writes it can cause |
| 5 | **Open Horizons?** | PASS | If the bound grows, the rule removes the watch and no caller changes |
<!-- /ANCHOR:adr-004-five-checks -->

**Checks Summary**: 5/5 PASS

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `lib/run-check.cjs` takes the bounded ignored listing.
- `references/runner-contract.md` states the boundary in section 8.
- `quality-gate.test.cjs` gains the boundary cases, including a write outside the scope.

**How to roll back**: drop the ignored listing from `takeSnapshot` and state the tracked-and-untracked boundary instead, then run `unit: argv spawn and guard`.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: The spec-folder checklist row is scoped by repository, not by surface label

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted, pending operator confirmation at program end |
| **Date** | 2026-10-26 |
| **Deciders** | Operator, under the standing autonomous-build instruction |

---

<!-- ANCHOR:adr-005-context -->
### Context

`assets/quality-defaults.json` declares a base-layer row for `hub:system-spec-kit/references/workflows/spec-folder-authoring-checklist.md` with `paths: ["specs/**"]` and no further condition. So a foreign repository that keeps a `specs/` folder lists a framework-specific checklist whose standard the runner cannot verify, which hands an UNKNOWN surface an authority nobody checked.

A condition on the file's surface label does not fix it. Measured on this repository, a run over `specs/sk-code/015-quality-agnostic-gate/spec.md` resolves the surface to `unknown` and still lists that checklist among its two. So a label condition would remove the checklist from this repository's own spec files along with a foreign repository's, which is worse than the leak.

### Constraints

- The three `.js` and `.css` checklist rows carry no surface house style, so they keep matching by path alone.
- The runner already resolves both roots it needs, the repository root from git and the hub root from the runner file's real path, so the condition adds no new resolution rule.
- A foreign repository keeps every checklist it can act on. Only the framework-specific row is scoped.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: scope the spec-folder row by repository. A base-layer row may carry `hubRepo: true`, and `resolveChecklists` matches that row only when the file's repository root is the repository that owns the declaring hub.

**How it works**: the match compares the repository root of the file under check with the repository that owns the hub that declared the row. The spec-folder row gains the flag and the three style rows do not. Fixture F21 reads a foreign repository holding `specs/demo/spec.md` and `specs/demo/notes.js`, where neither file resolves to a surface, and lists no spec-folder checklist while the style checklists stay. Fixture F22 reads this repository's own spec files and lists the spec-folder checklist, so the scope is not drawn too tight.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Condition on the repository that owns the hub (chosen)** | Keeps this repository's spec docs on the checklist and drops a foreign repository's | The declaration gains one optional flag | 9/10 |
| Condition on the SKILLED surface label | Names the surface the checklist was written for | This repository's spec files resolve to `unknown`, so the checklist would vanish from them too and the second fixture case would fail | 3/10 |
| Leave the row unconditional | Smallest change | A framework-specific standard keeps reaching a surface the runner cannot check | 2/10 |
| Condition on a `specs/` path prefix | Simple to read | The foreign repository's `specs/` folder is exactly the leak, so nothing changes | 1/10 |

**Why this one**: the harm is a foreign repository, so the condition is the repository boundary the runner already knows.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- A foreign repository lists no framework-specific checklist, while this repository keeps it on its own spec files.
- The base layer gains one condition that another row can reuse without a code change.

**What it costs**:
- A reader of the defaults file has to know a base row can carry a condition. Mitigation: `runner-contract.md` states it beside the `paths`, `extensions` and `contentMarkers` selectors, and the mode's target map names it.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future base row needs the condition and nobody adds it | L | The contract names the flag where a row is written |
| A repository that vendors this framework loses the checklist | L | The condition compares repository roots, so a vendored hub owns its own row and lists it |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | A foreign `specs/` file lists the checklist today |
| 2 | **Beyond Local Maxima?** | PASS | Four options were compared, and the label option was measured against this repository |
| 3 | **Sufficient?** | PASS | Two fixtures, one in a foreign repository and one here |
| 4 | **Fits Goal?** | PASS | A standard handed to an UNKNOWN surface claims an authority the runner cannot check |
| 5 | **Open Horizons?** | PASS | Another base row takes the same flag with no code change |
<!-- /ANCHOR:adr-005-five-checks -->

**Checks Summary**: 5/5 PASS

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- `assets/quality-defaults.json` gains the flag on the spec-folder row.
- `quality-gate.cjs` matches the condition in `resolveChecklists`.
- `references/runner-contract.md` and `SKILL.md` name the condition, and `quality-gate.test.cjs` gains F21 and F22.

**How to roll back**: remove the flag from the row and the match from `resolveChecklists`, then run `unit: target map`.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->

---
