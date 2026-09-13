---
title: "Decision Record: fan-out write containment hardening"
description: "The four decisions this packet freezes: preserve-by-default containment, baseline-targeted restore, a detached ephemeral worktree lane outside sk-git's numbered namespace, and worktree isolation on by default with a per-attempt isolation tally."
trigger_phrases:
  - "containment decision record"
  - "preserve by default decision"
  - "lineage worktree lane decision"
  - "baseline restore decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/045-fanout-write-containment-hardening"
    last_updated_at: "2026-09-13T12:00:00Z"
    last_updated_by: "operator-session"
    recent_action: "Appended ADR-004: worktree isolation is on by default, with a per-attempt isolation tally"
    next_safe_action: "None; signed off 2026-09-13; watch degraded counts on real-executor runs"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "goal.md"
      - "acceptance-criteria.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-045-fanout-write-containment-hardening"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the operator accepts an unnumbered runner-owned worktree lane — accepted; the lane is runner-owned and unnumbered (ADR-003), and ADR-004 turned its default on"
---
# Decision Record: fan-out write containment hardening

<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Preserve and quarantine by default; restore becomes opt-in

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-08 |
| **Deciders** | Packet author, pending operator confirmation |

---

<!-- ANCHOR:adr-001-context -->
### Context

The guard cannot tell a leaf's stray write from a human's edit in the same checkout, and it knows it cannot: its own module comments say a HEAD restore "discards whatever they had written and not yet committed, and if that author is another session running concurrently, nobody is watching this log to find out." On 2026-09-08 that cost 1,858 tracked paths belonging to a live interactive session, and the operator stopped the second lane by hand before it repeated the sweep over 932 more.

An unsound attribution paired with an irreversible remedy is the whole failure. Making attribution sounder is the harder half; making the remedy reversible is a small change that removes the damage immediately.

### Constraints

- The guard must keep detecting exactly what it detects today. Weakening detection to reduce damage would trade one silent failure for another.
- The remedy must not delete anything, which is already true for not-in-HEAD paths and must become true for tracked ones.
- Some checkouts really are single-operator, and there the rollback is genuinely useful; removing it outright would be a regression for those runs.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Preserve and quarantine becomes the default containment remedy, and rolling the working tree back becomes an explicit opt-in.

**How it works**: The guard gains a mode threaded from the fan-out config and a runner flag, defaulting to preserve. Under preserve it copies each out-of-scope change into a quarantine directory inside the lineage — the content, a patch against HEAD, and a patch against the pre-dispatch baseline where one exists — records the finding on the ledger and the observability stream, and returns without touching the tree. Under restore it does the same copy first, then rolls back. Detection is untouched in both modes.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Preserve by default, restore opt-in** | Removes the destructive outcome without weakening detection; a one-flag rollback to the old behaviour; the finding is still reported at severity error | A misbehaving leaf can leave stray writes in the tree that used to be cleaned | 9/10 |
| Keep restore, improve attribution only | No behaviour change for existing runs | The residual misattribution is still irreversible, and no attribution heuristic can be perfect on a shared checkout | 4/10 |
| Restore only paths whose mtime falls inside the dispatch window | Cheap, catches the obvious cases | A neighbour editing during the same window is exactly the incident; mtime does not identify a writer | 3/10 |
| Prompt the operator before reverting | Nothing is lost without consent | Fan-out runs are non-interactive by design and often overnight; a prompt nobody answers is a hang | 2/10 |

**Why this one**: It removes the failure mode outright at the cost of a dirty tree that the run already reports, and it leaves the old behaviour one config field away for the checkouts where it was correct.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- No fan-out run can destroy uncommitted work it did not prove it wrote.
- The quarantine is a better artefact than the current recovery patch: it holds the content as well as the diff, so it survives HEAD moving mid-run.

**What it costs**:
- A run that trips containment now leaves the tree dirty rather than clean. Mitigation: the finding stays at severity error, the run summary carries a findings count, and the documentation says explicitly that detection is unchanged.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Preserve is read as "containment was removed" | M | The event severity and the summary counter both stay; the documentation change leads with what still happens |
| Quarantine grows unbounded with a noisy neighbour | M | Per-file and per-lane size bounds with an explicit truncation record |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | An incident on 2026-09-08 destroyed 1,858 paths of live work and failed a completed lane |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed above, including the do-nothing-but-tune option |
| 3 | **Sufficient?** | PASS | A mode parameter plus a copy step; detection and scope rules are untouched |
| 4 | **Fits Goal?** | PASS | It is the first of the packet's stated requirements and the shortest path to safety |
| 5 | **Open Horizons?** | PASS | It does not foreclose the worktree fix; it is the safe default underneath it |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `runtime/lib/deep-loop/write-containment.ts` gains a mode parameter, a quarantine writer and a baseline content capture.
- `runtime/lib/deep-loop/executor-config.ts` gains a containment block on the fan-out control shape with a preserve default.
- `runtime/scripts/fanout-run.cjs` threads the mode from config and flag into both containment call sites.

**How to roll back**: Set the containment mode to restore in the fan-out config for the affected run. No code change is needed, and the quarantine tree keeps being written under both modes.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Restore targets the pre-dispatch baseline bytes, not HEAD

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-08 |
| **Deciders** | Packet author, pending operator confirmation |

---

### Context

The baseline snapshot records a path and a blob hash for every out-of-scope dirty file. Detection uses that hash to skip a file whose content did not move during the lane. But when the content did move, the remedy rolls the file back to HEAD, which is not where the file was when the lane started — it is where the file was at the last commit. An operator with an hour of uncommitted work on that file loses the hour, not the lane's contribution to it.

### Constraints

- Only the pre-dispatch bytes make the restore proportional. HEAD is the wrong target and always was.
- Storing content costs disk on a run with a large dirty tree, so it needs a bound.
- A path whose baseline could not be stored must not silently fall back to the HEAD rollback, because that is the destructive case this decision exists to remove.

---

### Decision

**We chose**: Under restore, a path that was already dirty before dispatch is restored to its pre-dispatch bytes; a path that was clean at baseline still restores from HEAD, because for that path HEAD and the baseline are the same thing.

**How it works**: The baseline snapshot writes file content alongside its existing path and hash entries, into a baseline tree inside the lineage directory, bounded at 2 MiB per file and 64 MiB per lane. A path over either bound keeps its hash entry, is marked baseline-truncated, and is preserved rather than restored regardless of mode.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Store baseline content, bounded** | Restore becomes proportional; the bound is explicit and its overflow is safe | Disk cost proportional to the dirty tree at dispatch | 9/10 |
| Stash the tree before dispatch and pop after | Uses a git primitive; no bespoke storage | A stash is repo-global and would fight every concurrent session in the same checkout, which is the population this packet protects | 2/10 |
| Write a baseline commit on a scratch ref | Content-addressed and cheap | Still a repo-global mutation, and it inflates the object store on every lane | 4/10 |
| Keep restoring to HEAD but skip baseline-dirty paths entirely | Trivial | Leaves the lane's own out-of-scope write in place whenever it landed on a file that was already dirty | 5/10 |

**Why this one**: It is the only option that both restores the right bytes and stays confined to the lineage directory, which is where every other artefact of a lane already lives.

---

### Consequences

**What improves**:
- A restore returns a file to where the operator left it, which is what an operator expects the word to mean.
- The stored baseline doubles as recovery evidence when HEAD moves mid-run.

**What it costs**:
- Disk proportional to the out-of-scope dirty tree at dispatch. Mitigation: the two bounds, and truncation degrades to preserve rather than to the old behaviour.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A restore resurrects content the neighbour deliberately deleted | M | Restore is opt-in and single-operator only; the quarantine copy of the newer state is written before any restore |
| The bounds are set too low and most paths truncate | L | Truncation is recorded per path and visible on the event, so the wrong bound is observable rather than silent |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The existing hash-only baseline is what makes a proportional restore impossible today |
| 2 | **Beyond Local Maxima?** | PASS | Four storage strategies weighed, including two git-native ones |
| 3 | **Sufficient?** | PASS | Content capture plus two numeric bounds; no new dependency and no repo-global mutation |
| 4 | **Fits Goal?** | PASS | It is the second stated requirement and the remaining half of the destructive-remedy fix |
| 5 | **Open Horizons?** | PASS | Under per-lineage worktrees the baseline tree becomes cheap, since the worktree starts clean |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `runtime/lib/deep-loop/write-containment.ts`: the snapshot writes content into a baseline tree and the revert reads from it.
- `runtime/tests/unit/write-containment.vitest.ts`: cases for the three-content restore and for the truncation path.

**How to roll back**: Restore is already opt-in. Turning it off returns every path to preserve, which needs no baseline content at all.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Lineage worktrees use a detached ephemeral lane, not sk-git's numbered allocator

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-09-08 |
| **Deciders** | Packet author, operator confirmation required before Phase 4 |

---

### Context

The structural fix is to run each lineage in its own worktree, so containment inside it is exact and the main checkout is never written by a lane. The repository's git safety rule says worktree creation goes through sk-git's allocator, and sk-git states the grammar: `worktrees/{NNN}-{slug}` branches with a per-namespace counter that is locked, seeded from a high-water mark, and never reused.

That allocator is built for human task workspaces that live for days and are reaped after a merge. A fan-out creates one worktree per lineage per run — six lineages across a research program is dozens of worktrees a week, each existing for a few hours. Burning irreversible counter values on them makes the numbered namespace unreadable, and sk-git's reaper deliberately does not auto-clean anything outside the launch-wrapper lane, so the runner's worktrees would pile up as report-only entries.

There is already a precedent for a non-allocator lane in the same repository: `.opencode/bin/worktree-session.sh` places each launch-wrapper session in an unnumbered `work/{runtime}/{slug}` branch with a `.worktrees/{runtime}-{slug}` directory, and sk-git documents that lane as distinct from the numbered one.

### Constraints

- The ask-first worktree rule governs in-session decisions by an AI. A runner creating its own execution sandbox is closer to the launch wrapper: it is machinery the operator opted into by starting the run, not a workspace choice being made on their behalf.
- A bare worktree lacks the gitignored `node_modules` and `dist`, which sk-git flags as a trap that makes the runtime generators crash or silently no-op.
- The worktree must be removable without operator action, since a fan-out is non-interactive.

---

### Decision

**We chose**: The runner creates a detached ephemeral worktree per lineage, outside sk-git's numbered namespace, and removes it at lane teardown.

**How it works**: One `git worktree add --detach` from HEAD per lineage, into a directory named by the runner's own prefix plus the run id and the lineage label, under the worktree base sk-git already resolves. The shared `node_modules` and `dist` are symlinked in, mirroring the launch wrapper. The target packet's uncommitted content is seeded in before dispatch so a lineage can read a spec that is not yet committed. Detached means no branch is created, so no name is allocated and nothing enters either counter. The runner sweeps its own prefix at startup so an interrupted run cleans up on the next one.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Detached ephemeral worktree, runner-owned** | No branch and no counter consumed; self-cleaning; precedent in the launch-wrapper lane | Sits outside the sk-git allocator, which the repository rule names as the path for worktree creation | 8/10 |
| Allocate through sk-git's numbered allocator | Follows the documented path exactly | Consumes never-reused counter values at fan-out rate; the reaper does not auto-clean the lane, so worktrees accumulate as report-only entries | 4/10 |
| One shared worktree for the whole run | A single setup cost; still isolates from the main checkout | Sibling lineages write concurrently into one tree, which is the misattribution problem moved one level down rather than solved | 3/10 |
| No worktree; rely on preserve mode alone | Zero new machinery | Attribution stays a guess, and the lane's own out-of-scope writes are never actually contained | 5/10 |

**Why this one**: It gets exact containment without consuming a namespace built for a different lifetime, and it follows an isolation pattern this repository already runs in production.

---

### Consequences

**What improves**:
- Containment inside a lineage worktree is exact: everything outside the lineage directory there really is that lineage's write.
- The main checkout stops being a party to the run, which makes the concurrent-editor problem disappear rather than being detected.

**What it costs**:
- One checkout per lineage of disk and inodes. Mitigation: worktrees share the object store, and teardown is part of lane settle.
- A departure from the letter of the allocator rule. Mitigation: this decision is the record of that departure, and it needs operator confirmation before Phase 4 begins.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An executor resolves a path relative to the original checkout and writes outside the worktree | H | Rewrite every path in the prompt pack and the dispatch flags; the kind with no directory flag runs with the worktree as its working directory |
| Worktrees accumulate after an interrupted run | M | Startup sweep of the runner's own prefix, plus teardown on settle |
| Copy-back fails and artefacts are stranded | M | On copy-back failure the worktree is retained and its path is named on the failure event |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Preserve mode stops the damage but leaves attribution a guess; only isolation makes containment a true statement |
| 2 | **Beyond Local Maxima?** | PASS | Four lanes weighed, including the documented allocator path and the do-nothing option |
| 3 | **Sufficient?** | PASS | Detached worktrees, symlinked dependencies, seeded packet content, copy-back and sweep; no new dependency |
| 4 | **Fits Goal?** | PASS | It is the packet's fifth requirement and the reason the fourth is optional |
| 5 | **Open Horizons?** | PASS | Worktree-per-lineage is also the substrate a future conflict-safe wave assignment would need |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `runtime/scripts/fanout-run.cjs`: worktree create, seed, path rewrite, copy-back, remove and startup sweep.
- The prompt-pack rendering that embeds the lineage directory as the executor's write surface, and the per-kind directory flags.

**How to roll back**: Turn the worktree option off for the run. The runner falls back to the main checkout under forced preserve mode, which is the Phase 1 behaviour and is safe on a shared checkout.
<!-- /ANCHOR:adr-003 -->

---

---

## Sharing installed dependencies into a lineage worktree

**Decision.** Share the installed trees by splitting the link, rather than installing per lane or
linking each tree wholesale.

**Context.** Provisioning by install costs a full dependency install per lane, which unlimited
concurrency cannot absorb. Linking wholesale is what the launch wrapper does, and sk-git's rule
forbade it without saying precisely what it protects. Five research iterations plus four
reproductions established that the rule was guarding two different defects and naming neither.

**What was reproduced.** A workspace package's self-link is relative, so carried into another
checkout inside a wholesale link it re-anchors through the link's physical location and resolves
into the source checkout. A lane then reads the main checkout's code however much it edits its
own, and exits 0. Separately, a compiled entry point reached through a link compares the path it
was invoked with against the location it derives from its own file; the two disagree, the guard
reads false, and the script exits 0 having done nothing. `--preserve-symlinks` repairs neither,
and for the first it is actively worse: it reports the lane's spelling for the main checkout's
bytes.

**Consequences.**
- Dependency roots carrying no checkout-internal links are still linked wholesale, so the
  install stays shared and provisioning stays cheap.
- Roots that carry them become real directories in the lane, third-party entries linked
  individually, each self-link rewritten relative to the lane's own copy. Relative is required,
  not preferred: relocating a worktree rewrites git's registration and not link text.
- The shared package's build output joins the provisioned set, because most of its export map
  resolves onto it and a lane-local self-link would otherwise fail at import.
- The classification is computed per provision by detecting escaping links, not held as a list,
  because a list misclassifies the next workspace package added and the failure is silent.
- The metadata generators are invoked by their canonical path, which makes their guard agree
  with itself. The checkout to act on travels in the arguments, so this cannot redirect a write.

**Applied to both provisioners.** The launch wrapper carried the same defect and now performs
the same split, so a wrapper session resolves first-party code from its own worktree. Its cost is
on the session launch path: roughly 0.8 s to create 334 links where it previously created two, a
figure measured rather than estimated, and reduced from 1.5 s by removing a subprocess per entry.
Its own harness gained a case asserting the bytes a child process loads; three of its assertions
fail against the previous implementation.

**Still open.** The entry-point guard is repaired only where this runtime invokes it. Fourteen
sites in the spec-kit build still compare an invocation path against a resolved one, so any other
caller reaching them through a link gets the same silent no-op. Fixing the guard at source belongs
to that skill.

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Worktree isolation is on by default, with a per-attempt isolation tally

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-13 |
| **Deciders** | Operator (the default flip, decided in session); packet author (the tally) |

---

### Context

Per-lineage worktrees shipped behind a flag that defaulted off, and ADR-003's own reasoning said why the default had to wait: the mechanism was verified at the lifecycle level with a stub executor, and the one input that decides whether isolation is real — an executor resolving a path relative to the original checkout — was not part of that verification. The consequence of leaving it off is the incident class this packet exists for: every default-configured run dispatches into the shared checkout, where a stray write lands in a neighbour's tree as a modification and attribution stays a guess. Preserve bounds that damage; it does not remove it.

### Constraints

- The flip changes where every dispatch runs in every checkout that runs a fan-out, including other live sessions. Measured cost: 1.6 GB of checked-out files per lane, and six lanes at concurrency 3 cost 149.7 s with worktrees against 16.5 s without.
- The degrade path must stay: a lane whose tree cannot be made has to keep running, so isolation failing must not become the run failing.
- A per-run off switch has to exist, because a run may be started specifically to reproduce shared-checkout behaviour.
- Stub-level evidence does not become real-executor evidence by being promoted to a default; the observation window moves after the flip rather than closing.
- This runtime's own test suite is the first consumer: fixtures that assert shared-checkout semantics must say so explicitly.

### Decision

**We chose**: `worktrees` defaults to true. The resolution order stays flag, then fan-out config, then schema default, so `--worktrees false` opts a single run out and `containment.worktrees: false` opts a caller out. A lane whose tree cannot be created degrades to the shared checkout under forced preserve, keeps running, and is counted: the orchestration summary gains `isolation: { enabled, isolated, degraded }`, counted per dispatch attempt at the point that attempt's tree is decided, and written on every orchestration-summary path and on stdout.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Default on, with the per-attempt tally** | Isolation applies to every run without anyone remembering a flag; the tally keeps the degrade path honest, so a run that could not isolate is distinguishable from one that did; rollback is one flag or one line | Every run pays the provisioning cost, and the default's blast radius includes other live sessions | 9/10 |
| Stay opt-in until a full run is observed on a real executor | The observation the old comment asked for happens before the default moves | The observation may never arrive, and every default-config run stays exposed to the incident class in the meantime; the cost numbers are already measured | 6/10 |
| Default on with no tally | Smallest change | A run whose trees all failed to create reads exactly like a run that isolated every lane; the silent-failure shape ADR-003 named returns one level up | 5/10 |
| Remove preserve mode once isolation is the default | Preserve's dirty-tree outcome disappears | The degrade path still lands in the shared checkout, and preserve is what that path uses to avoid acting on a guess | 3/10 |

**Why this one**: Isolation is the structural fix, and the packet's own ADR says only isolation makes containment a true statement. The tally keeps a stub-verified default honest: it reports whether a run could isolate instead of hiding a fallback, and it names — rather than closes — the mispathed-executor input a stub cannot exercise (see Risks).

---

### Consequences

**What improves**:
- Every fan-out run isolates its lanes by default, so a lane's declared write surface is its own tree and the containment check inside it is exact.
- A degraded attempt is visible in the run summary instead of being indistinguishable from an isolated one.

**What it costs**:
- Provisioning is on the hot path of every run: 1.6 GB per lane and roughly 133 s of the measured six-lane total, on a checkout shared with other sessions.
- Fixtures that assert shared-checkout semantics must state that dependency; three in this runtime now pin `--worktrees false`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An executor resolves a path relative to the original checkout and writes outside the worktree | H | Unchanged from ADR-003 (prompt-pack rewrite plus dispatch flags). The tally reports provisioning per attempt, not confinement: while a lane is isolated, containment watches its tree, and a flag-lever kind (`cli-opencode`, `native`) keeps its process cwd in the checkout, so a bare checkout write by such a lane is not observed. Watching the checkout for flag-lever kinds is the instrument this risk still needs; it is not part of this change |
| Provisioning cost lands on every run, including small ones | M | One flag and one config field opt out; the startup sweep means an interrupted run is cleaned by the next one |
| Degradation becomes the quiet failure mode, seen but tolerated | M | `degraded` is a per-run count in the summary file and stdout; `enabled: true` with `degraded > 0` is the signal to look at |

---

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator decided the flip; the alternative is every default run continuing to dispatch into the shared checkout, which is the incident this packet exists for |
| 2 | **Beyond Local Maxima?** | PASS | Four options weighed, including staying opt-in and flipping without the tally |
| 3 | **Sufficient?** | PASS | One schema default, one per-attempt counter, one summary field, tests for the on, off and degraded paths, and comments corrected where they asserted the old default |
| 4 | **Fits Goal?** | PASS | It closes the packet's last open question and makes REQ-005's isolation the default rather than the exception |
| 5 | **Open Horizons?** | PASS | The tally is the provisioning record a per-kind isolation audit builds on; observing a mispathed executor still needs the checkout watched while isolated (see Risks) |

**Checks Summary**: 5/5 PASS

---

### Implementation

**What changes**:
- `runtime/lib/deep-loop/executor-config.ts`: `worktrees` defaults to true; the rationale comment states why.
- `runtime/scripts/fanout-run.cjs`: per-attempt `isolated`/`degraded` counters at the single site where a lane's tree is decided; `isolation` written on every summary path; a module-load failure degrades every attempt and is recorded instead of aborting the run; resolution-order comments corrected.
- `runtime/tests/unit/fanout-run.vitest.ts`: a no-flag spawn proves the default end to end; the explicit-off case and the degraded case assert the tally; three shared-checkout fixtures pin `--worktrees false`.
- `runtime/tests/unit/executor-config.vitest.ts`: the schema default and the config opt-out.

**How to roll back**: `--worktrees false` for one run, `containment.worktrees: false` for a caller, or revert the one-line schema default; the runner then returns to shared-checkout behaviour with every other comment still true.
<!-- /ANCHOR:adr-004 -->
