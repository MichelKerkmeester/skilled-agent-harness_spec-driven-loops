---
title: "Feature Specification: harden fan-out write containment for shared checkouts"
description: "The fan-out write-containment guard attributes every out-of-lineage tracked change to the running leaf and reverts it to HEAD, so a neighbouring interactive session's 1,858 live edits were destroyed and a complete research lane was marked failed. This packet makes preservation the default, restores to the pre-dispatch baseline where restore is still chosen, separates lane outcome from containment outcome, and moves each lineage into its own worktree so attribution stops being a guess."
trigger_phrases:
  - "fan-out write containment"
  - "containment quarantine preserve"
  - "shared checkout concurrent editor"
  - "per-lineage worktree containment"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: harden fan-out write containment for shared checkouts

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The deep-loop fan-out guard cannot tell a leaf's stray write from a human's edit in the same checkout, and its remedy is `git checkout HEAD -- <path>`, which is irreversible for uncommitted work. On 2026-09-08 that combination reverted 1,858 tracked paths belonging to a concurrent interactive session and failed a research lane whose artefacts were complete. This packet changes the default remedy from destroy to quarantine, makes restore (when chosen) return files to the bytes they held before dispatch rather than to HEAD, stops a containment finding from erasing a finished lane's outcome, and adds the structural fix that makes the whole question moot: run each CLI lineage in its own git worktree.

**Key Decisions**: Preserve-and-quarantine becomes the default and restore becomes opt-in; each lineage gets an ephemeral detached worktree outside the sk-git numbered namespace rather than an allocator-issued one.

**Critical Dependencies**: sk-git's worktree grammar and reaper policy (the runner must not pollute the numbered namespace); the shared `node_modules` and `dist` symlink pattern that makes a bare worktree usable by the runtime.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | In Progress |
| **Created** | 2026-09-08 |
| **Branch** | `skilled/v4.0.0.0` |
| **Origin** | The 2026-09-08 containment incident on the chart visual-upgrade research run: lane `luna` completed five iterations, then reverted 1,858 out-of-scope paths written by a concurrent session and was recorded `failed`. The second lane was stopped by hand before it could repeat the sweep over 932 further live edits. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The fan-out runner snapshots dirty paths outside the lineage directory before dispatch, and after the lane it treats every tracked file that changed outside that directory as the leaf's write. `revertOutOfScopeViolations` restores each such path with `git checkout HEAD -- <path>`, which discards uncommitted work the guard never proved the leaf produced. A path that was already dirty at baseline is not exempt: `detectNewOutOfScopeViolations` compares the current blob hash against the baseline hash and re-flags the file when its content moved, so an in-flight edit that grew during the lane is rolled back past the point it started from. Untracked files are preserved, so the destructive case is exactly the tracked one, which is also the one that matters.

The guard cannot distinguish these two writers, and it says so in its own comments: the module documents that a HEAD restore "discards whatever they had written and not yet committed, and if that author is another session running concurrently, nobody is watching this log to find out." The 2026-09-08 run made that concrete. Lane `luna` finished five iterations with `stopReason: maxIterationsReached`, wrote its research artefacts, and was then recorded as `failed` because the sweep found 1,858 changed paths — none of them lineage output, all of them a neighbouring session's live editing of the same checkout. The recovery patch was written, but the tree had already been rewound and the lane's success had already been overwritten by a failure.

Two independent defects compound: attribution is unsound on a shared checkout, and the remedy for an unsound attribution is irreversible. A third makes the damage invisible to the caller — containment is checked before artefact validation, so a complete lane never reaches the code that would have called it complete.

### Purpose

A fan-out lineage never destroys work it cannot prove it wrote, a completed lane keeps its completed outcome when containment has something to report, and a lineage that runs in its own worktree makes the attribution question disappear rather than answering it more carefully.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A preserve-and-quarantine containment mode that copies an out-of-scope tracked change into the lineage directory and leaves the working tree untouched, and makes that mode the default.
- Baseline snapshots that carry file content, not only paths and hashes, so a restore can target the pre-dispatch bytes instead of HEAD.
- A lane outcome that survives a containment finding when the lane's own artefacts are complete, including the orchestration summary and the max-iterations policy check.
- Sampling of out-of-lineage working-tree churn during a lane, with a warning event and a forced downgrade to preserve mode when a concurrent editor is detected.
- Per-lineage ephemeral git worktrees, with copy-back of the lineage directory and rewriting of every path the prompt hands the executor.
- Migration of the four `/deep:research` and `/deep:review` command YAMLs, which both spawn the runner and inline their own `enforceWriteContainment` calls.
- The containment documentation in the deep-loop hub SKILL.md, both mode packets' loop protocols, and the runtime library README.

### Out of Scope
- Changing what counts as out of scope. The `unattributableDirs` and `unattributablePaths` carve-outs, the symlink-escape rules and the regenerable-state exemption are correct and stay as they are; this packet changes the remedy, not the detection.
- Deleting untracked files. Preservation of not-in-HEAD paths is already the behaviour and this packet does not add a delete path anywhere.
- Sandboxing the executors themselves. `cli-opencode` runs with `--dangerously-skip-permissions` and `cli-codex` with `--sandbox workspace-write` by design; per-lineage worktrees bound the blast radius instead of narrowing those flags.
- The AI-council and model-benchmark orchestrators, which import `buildLineageCommand` but never run the containment guard. They are named as blast radius, not changed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Containment mode, quarantine writer, baseline content capture, baseline-targeted restore |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Mode flag plumbing, churn sampler on the heartbeat, outcome ordering, worktree lifecycle, prompt path rewriting |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Modify | `containment` block on the fan-out control shape and the normalized config |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs` | Modify | Summary counters and status mapping for the new terminal state |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Quarantine, baseline-restore and mode-selection cases |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modify | Outcome-separation, churn-threshold and worktree-lifecycle cases |
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Modify | Runner flag and the inline containment calls |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | Modify | Runner flag and the inline containment calls |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | Modify | Runner flag and the inline containment calls |
| `.opencode/commands/deep/assets/deep-review-confirm.yaml` | Modify | Runner flag and the inline containment calls |
| `.opencode/skills/system-deep-loop/SKILL.md` | Modify | The NEVER bullet that tells operators not to edit a checkout with a live lineage |
| `.opencode/skills/system-deep-loop/deep-research/references/protocol/loop-protocol.md` | Modify | The two containment rules bound to every CLI lineage |
| `.opencode/skills/system-deep-loop/deep-review/references/protocol/loop-protocol.md` | Modify | The same containment rules for the review loop |
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/README.md` | Modify | The one-line role description of the containment module |
| `.opencode/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md` | Modify | The containment paragraph and the orchestrator-owned-paths note |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

Ordered by safety gained per line changed. The first three requirements stop the destruction with a small, local change; the fifth removes the cause; the fourth is a detector that only earns its place once the structural fix is in.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Containment preserves by default. An out-of-scope tracked change is copied into `containment/quarantine/` under the lineage directory as current content plus a patch against HEAD, plus a patch against the pre-dispatch baseline when one exists, is recorded as a violation in the status ledger and the observability stream, and the working tree is left exactly as the lane left it. Restore becomes an explicit opt-in through a runner flag and a fan-out config field, documented as safe only on a single-operator checkout. |
| REQ-002 | When restore is opted into, a path that was already dirty before dispatch is restored to its pre-dispatch baseline bytes, never to HEAD. The baseline snapshot therefore stores content, not only paths and hashes, with a stated storage location and size bound; a path whose content exceeds the bound is recorded as baseline-truncated and is preserved rather than restored. |
| REQ-003 | Lane outcome and containment outcome are separate. A lane whose artefacts are complete — `research.md` or `review-report.md` plus the terminal state event — and which also has containment findings settles as `completed_with_containment_advisory`, not `failed`. The orchestration summary counts that state separately from both success and failure, and the max-iterations policy check accepts it. |
| REQ-005 | Each CLI lineage runs in its own git worktree created from HEAD for the run, so containment inside that worktree is exact and the main checkout is never written by a lane. The mechanics, resolved by the open-question research in `research/open-questions/`, are: **(a) Reclamation requires positive proof of death.** Each worktree carries a lease written at creation and refreshed on the existing progress heartbeat, reusing the loop-lock primitives rather than a new mechanism. A worktree may be removed only when its heartbeat is stale beyond twice its lifetime AND its owner process does not answer a zero-signal probe AND no process holds that directory as its working directory. An unmarked or unparseable worktree is kept past a creation grace window, because a missing lease most often means one being created. The lease carries a terminal state, and a worktree retained after a failed publish is never auto-reclaimed. **(b) Publication is run-keyed and never in place.** The published directory is keyed by run so two runs sharing a lineage label cannot target the same path. Copy-back stages a complete copy in the main checkout, on the same filesystem so the final rename is atomic, writes its manifest last as the completion marker, and holds the claim lease across the whole check-and-rename. An existing published directory is renamed aside, never deleted, so hand edits move with it. Staging residue is swept alongside the worktrees. **(c) Reclamation runs after the ledger read,** never before, so a sweep cannot delete lanes a resume is about to requeue. Each worktree's path is recorded on its lane ledger event so claim and release key off the ledger rather than directory-name parsing. The choice between sk-git's allocator and a detached ephemeral worktree is recorded as a decision with its alternative. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The runner samples out-of-lineage working-tree churn at the existing progress heartbeat. Above the threshold — twelve newly-dirty tracked paths outside the lineage directory within one heartbeat window, or forty cumulative for the lane — it emits `shared_checkout_detected` and forces preserve mode for the remainder of the run, overriding any restore opt-in. Both numbers are configurable; the justification for these defaults is in section 7. |
| REQ-006 | Every caller and document that asserts the old behaviour is migrated: the four command YAMLs (each of which both spawns the runner and inlines its own containment call), the hub SKILL.md, both loop protocols, the runtime library README and the fan-out feature catalog entry. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A lane that writes outside its lineage directory on a default-configured run leaves the working tree byte-identical to how the lane left it, and leaves a quarantine directory that reproduces the change.
- **SC-002**: A completed research lane with containment findings appears in the orchestration summary as completed with advisory, and its research artefacts are not reprocessed as a failure.
- **SC-003**: A fan-out run against an uncommitted packet completes with every lineage in its own worktree and every lineage directory present in the main checkout afterwards.
- **SC-004**: The 2026-09-08 incident is reproducible as a test: a simulated neighbour dirties tracked files during a lane, and no path it touched is modified by the guard.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-git worktree grammar and the numbered allocator at `.opencode/skills/sk-git/scripts/worktree-naming.sh` | The runner could burn hundreds of never-reused counter values, or create worktrees the reaper refuses to clean | Decision record fixes the lane; the ephemeral option stays outside the numbered namespace and cleans itself |
| Dependency | Gitignored `node_modules` and `dist` inside a fresh worktree | A bare worktree makes the spec-kit and deep-loop generators crash or silently no-op, which is sk-git's own documented trap | Share the installed trees into each lineage worktree at creation, but not the launch wrapper's way: a wholesale link re-anchors the workspace self-links and leaves the lane reading the main checkout. Link third-party entries individually, recreate each `@spec-kit/*` self-link relative to the lane, provision the shared package's build output, and invoke generators by their canonical path so their entry-point guard still fires |
| Risk | Quarantine grows unbounded on a long run with a noisy neighbour | Disk exhaustion mid-run, which fails the run for an unrelated reason | Per-file and per-run size bounds with a truncation record, specified under REQ-002 |
| Risk | Preserve-by-default lets a genuinely misbehaving leaf leave stray writes in the tree | A dirty tree after a run that used to be clean | The finding is still recorded as a violation with severity error and the quarantine reproduces it; the run reports it, it is simply no longer acted on destructively |
| Risk | Per-lineage worktrees multiply disk and inode use by the lineage count | A six-lineage run costs six checkouts | Worktrees share the object store by construction; the copy-back plus removal is part of lane teardown |
| Risk | An uncommitted packet is invisible inside a worktree created from HEAD | The lineage cannot read the spec it was pointed at | Seed each worktree with the packet's uncommitted working-tree content before dispatch, specified in the plan |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The churn sampler adds no more than one `git status --porcelain` invocation per progress heartbeat per lane, at the default 60-second cadence.
- **NFR-P02**: Baseline content capture is bounded at 2 MiB per file and 64 MiB per lane; beyond either bound the path is recorded as baseline-truncated rather than stored.

### Churn threshold and why these numbers

The sampler counts tracked paths outside the lineage directory that became dirty since the previous sample, on the existing 60-second progress heartbeat. A lineage's own writes are excluded by construction, since they land inside the directory the sample excludes.

Three quantities set the bar. A lane that is behaving contributes zero to this count. An operator saving files by hand in an editor contributes a handful per minute at most — a save is one path, and a refactor across a package is a burst, not a sustained rate. The incident's neighbour contributed 1,858 paths across roughly 48 minutes, about 39 per minute, then 932 more in the interval before the second lane was stopped.

Twelve newly-dirty out-of-lineage tracked paths in one heartbeat window sits well above what hand editing produces and well below the observed rate of a session doing bulk work in the same tree. Forty cumulative for the lane catches a slower neighbour that never spikes. Both are defaults on the fan-out config, so a checkout with unusual habits can move them without a code change. The event is a warning and its only consequence is to make the guard less destructive, so a false positive costs nothing.

### Security
- **NFR-S01**: Quarantine content is written inside the lineage directory only, and the quarantine writer never follows a symlink out of that directory — the same canonicalization rule the detector already applies.
- **NFR-S02**: No containment path ever deletes a file. Preservation stays the only outcome for a not-in-HEAD path, and restore is a `git checkout` or a baseline write, never a `git clean`.

### Reliability
- **NFR-R01**: The guard keeps its fail-open posture: when git is unavailable, the repo is bare, or the artefact directory is outside the worktree, containment returns empty and never breaks the loop it guards.
- **NFR-R02**: A worktree that cannot be created or removed degrades to the current in-checkout behaviour under preserve mode, with a warning event, rather than failing the run.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a lane with no out-of-scope writes produces no quarantine directory and no containment event, exactly as today.
- Maximum length: a quarantined file over 2 MiB is recorded by path, hash and patch only, with a `content_truncated` marker; a lane over the 64 MiB run bound stops storing content and records the remaining paths by hash.
- A path dirty at baseline whose content is unchanged at lane end is still not a violation; the existing content-identity short-circuit is unchanged.

### Error Scenarios
- Quarantine write fails (disk full, permissions): the finding is still recorded, with the write error carried on the event, and preserve mode means nothing was destroyed in the meantime.
- Worktree creation fails: the lane falls back to the main checkout under forced preserve mode and emits a warning event.
- Copy-back fails after a lane completes in its worktree: the worktree is retained rather than removed, and its path is named on the failure event so the artefacts can be recovered by hand.
- The neighbour session commits mid-lane: the baseline bytes still exist in the quarantine copy even though HEAD has moved, which is why the quarantine keeps content and not only a patch.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Files: 15, LOC: ~900 changed across runtime and tests, Systems: containment guard, fan-out runner, pool summary, config schema, four command YAMLs |
| Risk | 20/25 | Auth: N, API: Y (containment module's exported surface and the fan-out config schema), Breaking: Y (a lane outcome value and a ledger event set that consumers read) |
| Research | 12/20 | Worktree seeding for an uncommitted packet and prompt path rewriting both need investigation before implementation |
| Multi-Agent | 8/15 | Workstreams: 3 (guard and config, runner lifecycle, docs and caller migration) |
| Coordination | 11/15 | Dependencies: sk-git worktree policy, the four command YAMLs, the two mode packets' protocol docs |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A consumer reads the lane status set as closed and breaks on `completed_with_containment_advisory` | H | M | Map the new state through `statusForLedgerEvent` and the pool summary in the same change; add a test that pins the full status vocabulary |
| R-002 | Preserve-by-default is read as "containment was removed" and an operator stops watching the ledger | M | M | The event stays severity error and the run summary carries a findings count; the documentation change says explicitly that detection is unchanged |
| R-003 | Per-lineage worktrees break an executor that resolves paths relative to the original checkout | H | M | Rewrite every path in the prompt pack and the dispatch flags; `cli-pi` has no directory flag and runs in the spawned working directory, so its cwd must be the worktree |
| R-004 | Worktrees accumulate after an interrupted run | M | H | Teardown on lane settle plus a startup sweep of the runner's own ephemeral prefix; sk-git's reaper does not own this lane |
| R-005 | A restore against baseline bytes resurrects content the neighbour deliberately deleted | M | L | Restore stays opt-in and single-operator only; the baseline patch is written to quarantine before any restore so the newer state survives |
| R-006 | The churn threshold is tuned wrong and fires on a normal single-operator run | L | M | Threshold is on out-of-lineage tracked paths only, sampled per heartbeat, at a rate an interactive editor does not reach; the event is a warning and its only action is to make the guard less destructive |

### Blast radius

This runtime is the execution substrate for every `/deep:*` command and for the benchmark runs. Callers found with `rg -n "fanout-run.cjs" .opencode .claude specs --glob '!**/node_modules/**'`, with the documentation-only and changelog hits set aside:

| Caller | Relationship | Affected by this packet |
|--------|--------------|-------------------------|
| `.opencode/commands/deep/assets/deep-research-auto.yaml` | Spawns the runner and inlines eight of its own `enforceWriteContainment` calls | Yes — flag and inline call signature |
| `.opencode/commands/deep/assets/deep-research-confirm.yaml` | Spawns the runner and inlines two containment calls | Yes — flag and inline call signature |
| `.opencode/commands/deep/assets/deep-review-auto.yaml` | Spawns the runner and inlines eight containment calls | Yes — flag and inline call signature |
| `.opencode/commands/deep/assets/deep-review-confirm.yaml` | Spawns the runner and inlines two containment calls | Yes — flag and inline call signature |
| `.opencode/commands/deep/assets/compiled/deep-research.contract.md` | Compiled contract mirroring the research YAML | Yes — regenerate after the YAML change |
| `.opencode/commands/deep/assets/compiled/deep-review.contract.md` | Compiled contract mirroring the review YAML | Yes — regenerate after the YAML change |
| `.opencode/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | Imports `buildLineageCommand` only; never runs the guard | Only if the command builder's signature changes under the worktree phase |
| `.opencode/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Imports `buildLineageCommand` only; never runs the guard | Only if the command builder's signature changes under the worktree phase |
| `.opencode/skills/system-deep-loop/runtime/scripts/codex-dispatch.cjs` | Mirrors the runner's codex flag choices in comments; single-dispatch sibling | No, but its comments describe the runner and should stay true |
| `runtime/tests/unit/fanout-run.vitest.ts`, `tests/unit/write-containment.vitest.ts`, `tests/stress/cli-adapter/fanout.vitest.ts`, `tests/integration/deep-research-postflip-fanout.vitest.ts` | Pin runner and guard behaviour | Yes — extended, not merely updated |
| `.opencode/skills/system-spec-kit/runtime/cli/tests/deep-review-auto-restart-contract.vitest.ts` | Pins the review command's restart contract across the runtime boundary | Yes if the lane status vocabulary changes; the new terminal state must be accepted there |

The two `buildLineageCommand` importers are the reason the worktree phase must keep that function's signature stable, or change all three call sites together.

---

## 11. USER STORIES

### US-001: Run a fan-out while working in the same checkout (Priority: P0)

**As an** operator running a long research fan-out on my main checkout, **I want** the guard to record what a lane wrote outside its directory instead of rewinding my files, **so that** I can keep editing during a multi-hour run without losing uncommitted work.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep a finished lane's result (Priority: P0)

**As an** operator reading a run summary, **I want** a lane that produced its research or review artefacts to be reported as completed even when containment found something, **so that** hours of finished analysis are not discarded over a bookkeeping outcome.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-003: Run lineages without touching the main checkout at all (Priority: P1)

**As an** operator, **I want** each lineage to work in its own worktree, **so that** containment becomes an exact statement about that worktree and my checkout is never a party to the run.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Should the restore opt-in be rejected outright when the churn sampler has already fired, or only suppressed for the rest of the run? The specification takes the second reading; the first would be stricter and is a one-line change.
- Should quarantine content be retained after a clean run, or pruned on the next run of the same packet? The specification retains it, on the grounds that a quarantine nobody reads costs disk while a quarantine that was pruned costs the recovery.
- **ANSWERED, then UNBLOCKED.** The ten-iteration research recorded 2026-09-11 found that the worktree
  phase must not start until two gaps were specified. Both were closed 2026-09-12 by the five-iteration
  follow-up in `research/open-questions/`, and REQ-005 now carries the resolved mechanics: a lease-based
  liveness proof requiring three independent conjuncts before any reclamation, run-keyed publication by
  staged rename, and reclamation ordered after the ledger read. The phase is buildable. Whether worktrees
  become the DEFAULT remains open and should be answered with evidence from a full run on them, which is
  what the original question asked. The two gaps that blocked it were:
  First, the startup sweep of the shared worktree prefix has no liveness gate, so with overlapping
  runs every new run's startup becomes a probabilistic deletion pass over live peers' working
  trees — strictly worse than a wrong HEAD restore, because deleted untracked output has no HEAD
  copy to detect the loss by. Second, containment resolves one repo root per run, so under N
  worktrees the guard would inspect a tree nobody writes to and report clean, recreating the exact
  failure this packet exists to end. A third item is a verification gap rather than a design gap:
  the acceptance criterion "no worktree remains" passes for a destructive sweep, so the plan needs
  a concurrent negative control — run B starts while run A is live, and every one of A's worktrees
  survives. See `research/synthesis.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
- **Decision Records**: See `decision-record.md`
- **Goal**: See `goal.md`

---
