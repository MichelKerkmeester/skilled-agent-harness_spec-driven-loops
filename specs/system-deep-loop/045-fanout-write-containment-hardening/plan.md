---
title: "Implementation Plan: harden fan-out write containment for shared checkouts"
description: "Adds a preserve-and-quarantine containment mode with content-bearing baselines, separates lane outcome from containment outcome, then moves each CLI lineage into its own ephemeral git worktree so out-of-scope attribution stops being a guess."
trigger_phrases:
  - "containment implementation plan"
  - "quarantine mode approach"
  - "lineage worktree architecture"
  - "containment testing strategy"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: harden fan-out write containment for shared checkouts

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (the guard, the config schema) and CommonJS Node (the runner and the pool), executed through the tsx bootstrap |
| **Framework** | None. Node standard library plus `spawnSync`/`spawn` against the `git` binary and Zod for the fan-out config schema |
| **Storage** | The lineage directory on disk: the status ledger, the observability stream, and the new quarantine and baseline trees |
| **Testing** | Vitest, against real temporary git repositories rather than mocks — the existing containment suite already builds a repo per case and this plan keeps that |

### Overview

Three changes, in increasing order of cost and decreasing order of urgency. First, the containment guard gains a mode: `preserve` copies an out-of-scope change into the lineage's quarantine and leaves the tree alone, `restore` keeps today's rollback but aims at the pre-dispatch bytes instead of HEAD, and `preserve` becomes the default. Second, the runner stops letting a containment finding overwrite a lane's own outcome, which means moving the containment check to after artefact validation and adding a terminal state that carries both facts. Third, each lineage gets an ephemeral worktree created from HEAD and seeded with the packet's uncommitted content, which makes the containment boundary exact and removes the shared checkout from the picture entirely.

The first two changes are the ones that would have prevented the 2026-09-08 incident. The third is what makes the guard correct rather than merely non-destructive.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The containment module, the runner's containment block and the existing Vitest suite have all been read end to end.
- [ ] The worktree lane decision is recorded and accepted in `decision-record.md`.
- [ ] The churn threshold has a stated number and the reasoning that produced it.

### Definition of Done
- [ ] Every criterion in `acceptance-criteria.md` is `Met`, or `Waived` against a decision record that exists.
- [ ] The deep-loop runtime Vitest suite passes, including the new containment and runner cases.
- [ ] The four command YAMLs, both loop protocols, the hub SKILL.md, the library README and the fan-out feature catalog entry all describe the shipped behaviour.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A guarded pipeline with a policy seam. Detection stays exactly where it is and keeps its current rules; what changes is the remedy applied to a detection, which becomes a mode selected by configuration and overridable at runtime by the churn detector.

### Key Components

- **Containment mode**: a `'preserve' | 'restore'` value threaded from the fan-out config and the runner flag into `enforceWriteContainment`. Default `preserve`. The mode chooses the remedy; it never changes what counts as a violation.
- **Quarantine writer**: writes `containment/quarantine/<iteration>-<timestamp>/` inside the lineage directory, holding `manifest.json` (one entry per path with its status code, kind, blob hash and whether content was truncated), `content/<repo-relative path>` (the bytes as the lane left them), `head.patch` (the diff against HEAD) and, when a baseline exists for the path, `baseline.patch`. The existing `containment-reverted/` tree is kept and written only when restore mode actually reverts, so an operator following the current documentation still finds what it names.
- **Content-bearing baseline**: `snapshotOutOfScopeDirtyPaths` already returns `{ path, hash }`. It gains an optional content capture writing `containment/baseline/<repo-relative path>` under the lineage directory, bounded at 2 MiB per file and 64 MiB per lane. A path over either bound keeps its hash entry and is marked baseline-truncated, which forces preserve for that path regardless of mode.
- **Outcome separator**: the runner's containment block moves below artefact validation and the max-iterations policy check. When artefacts are complete and containment has findings, the lane settles as `completed_with_containment_advisory` instead of throwing. When artefacts are incomplete, containment findings ride along on the existing failure rather than replacing its reason.
- **Churn sampler**: a callback on the existing progress heartbeat that runs `git status --porcelain` scoped outside the lineage directory and counts newly-dirty tracked paths since the previous sample. Above twelve in one window or forty cumulative for the lane it appends `shared_checkout_detected` and latches preserve mode for the run. Both numbers live on the fan-out config; the reasoning behind the defaults is in `spec.md` section 7.
- **Lineage worktree**: `git worktree add --detach <base>/<prefix>-<runId>-<label> HEAD` per lineage, seeded with the packet's uncommitted content, with the shared `node_modules` and `dist` symlinked in, removed on lane teardown.

### Data Flow

Pre-dispatch, the runner resolves the containment repo root, snapshots out-of-scope dirty paths and (new) their content into the lineage baseline tree. During the lane the heartbeat samples churn and may latch preserve. At lane end the runner reads the lane's artefacts and state log first, then runs the guard; the guard detects violations exactly as before, writes quarantine for each, applies the mode's remedy, appends its event, and returns. The runner combines the artefact verdict and the containment verdict into one settle call, and the pool's summary counts the three outcomes separately.

Under the worktree phase this flow is unchanged in shape; only the repo root, the lineage directory and every path in the prompt move into the worktree, and a copy-back step runs between the guard and the settle.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/deep-loop/write-containment.ts` | Owns detection, revert and the violation event | Update: mode parameter, quarantine writer, baseline content, baseline-targeted restore | `tests/unit/write-containment.vitest.ts` new cases over a real temp repo |
| `scripts/fanout-run.cjs` containment block | Calls the guard, throws on any violation | Update: runs after artefact validation, settles a complete lane as advisory | `tests/unit/fanout-run.vitest.ts` outcome-ordering cases |
| `scripts/fanout-pool.cjs` summary and status mapping | Counts fulfilled and rejected, maps ledger events to statuses | Update: third counter and status mapping for the new terminal state | Pool summary assertion pinning the full status vocabulary |
| `lib/deep-loop/executor-config.ts` fan-out control shape | Parses and normalizes fan-out config | Update: `containment` block with mode and threshold, defaulting to preserve | Schema test asserting the default and rejecting an unknown mode |
| Four `/deep:*` command YAMLs | Spawn the runner and inline their own `enforceWriteContainment` calls | Update: pass the mode flag and align the inline calls | Grep for `enforceWriteContainment` across the four files; each call site carries a mode |
| Hub SKILL.md, both loop protocols, library README, fan-out feature catalog | State that editing a checkout with a live lineage loses work | Update: describe preserve-by-default and the worktree lane | Grep for the containment wording across the five documents |
| `deep-ai-council/scripts/orchestrate-session.cjs`, `deep-improvement/scripts/model-benchmark/dispatch-model.cjs` | Import `buildLineageCommand` only; never run the guard | Not a consumer of containment; unchanged, but they break if the command builder's signature changes | Both imports read and confirmed to take the builder alone |

Required inventories:
- Same-class producers: `rg -n "restored_from_head|preserved_untracked|containment_violation|containment_advisory" .opencode/skills/system-deep-loop --glob '!**/node_modules/**'`.
- Consumers of changed symbols: `rg -n "enforceWriteContainment|snapshotOutOfScopeDirtyPaths|revertOutOfScopeViolations|buildLineageCommand" .opencode specs --glob '*.ts' --glob '*.cjs' --glob '*.yaml' --glob '*.md' --glob '!**/node_modules/**'`.
- Matrix axes: mode (preserve, restore) x path state (in HEAD dirty at baseline, in HEAD clean at baseline, not in HEAD) x artefacts (complete, incomplete) x churn (below threshold, above). Twenty-four rows; the eight that combine restore with a baseline-dirty in-HEAD path are the ones the incident lived in.
- Algorithm invariant: no containment remedy may reduce the information on disk. Preserve adds a copy and changes nothing; restore adds a copy and then moves a file to bytes that copy holds. Adversarial cases: a symlink under the lineage directory pointing at the quarantine target, a path whose baseline was truncated, a path deleted by the neighbour mid-lane, and a lane whose quarantine write fails.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Sequencing rationale, since it is not obvious from the task list: the first three requirements ship together as one change because they are the incident fix and they share a test fixture. The worktree work ships second, on its own, because it changes where every lineage runs and wants a clean bisect point. Churn detection ships last and is optional, because once lineages run in their own worktrees a concurrent editor in the main checkout is no longer a hazard — the detector then guards only the fallback path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Guard behaviour per mode, quarantine layout, baseline capture and bounds, baseline-targeted restore | Vitest against a per-case temporary git repository, as the existing suite already does |
| Unit | Runner outcome ordering, the new terminal state, summary counters, churn threshold arithmetic | Vitest against the runner's exported helpers |
| Integration | A full fan-out against a temp repo with a simulated concurrent editor dirtying tracked files mid-lane | Vitest, extending the existing fan-out integration coverage |
| Manual | One real research fan-out on the main checkout with a second session editing, confirming the tree is untouched and the lane completes | The deep-loop manual testing playbook |
<!-- /ANCHOR:testing -->

---

## AI Execution Protocol

This packet edits a runtime every `/deep:*` command runs through, on a checkout that may have a second session in it. The execution discipline is therefore explicit rather than assumed.

### Pre-Task Checklist
- Read `runtime/lib/deep-loop/write-containment.ts` and the runner's containment block before touching either; the module's comments already document the failure this packet fixes.
- Confirm the two open decisions in `decision-record.md` are accepted before Phase 4 starts.
- Confirm no fan-out is live in this checkout before running the test suite, since the suite builds temporary git repositories and the guard reads the real one.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Phase scope | Only the files listed for the current phase are edited; the scope table in `spec.md` is the frozen list |
| Phase order | Quarantine and baseline precede outcome separation, which precedes migration, which precedes worktrees; churn detection is last and optional |
| Detection is frozen | No change to what counts as a violation. A change that alters detection is an amendment, not an implementation detail |
| Destructive paths | No new code path may delete a file. Preserve, copy and restore are the only three outcomes |
| Verification | The runtime Vitest suite is rerun in full after each phase, and its output and exit status are read, not assumed |

### Status Reporting Format
- Each phase reports the tasks closed, the Vitest suite result with its exit status, and the acceptance criteria it moved from unmet to met.
- Each manual run reports whether the working tree was byte-identical afterwards and what the run summary recorded for every lane.

### Blocked Task Protocol
- A failing check blocks forward progress. Diagnose and repair, then rerun the whole suite rather than the failing case alone.
- If a phase turns out to need a file outside the frozen scope table, stop and raise the amendment with the file, the reason and the one-line change; do not widen the scope in place.
- If the worktree lane decision is not confirmed, Phase 4 does not start. Phases 1 through 3 stand alone and ship without it.

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-git worktree policy and its numbered allocator | Internal | Green | The worktree phase cannot pick a lane; the first change still ships |
| Shared `node_modules` and `dist` symlink pattern from the launch wrapper | Internal | Green | A lineage worktree cannot run the runtime generators, which is sk-git's documented bare-worktree trap |
| The four `/deep:*` command YAMLs | Internal | Green | The runner default still holds, but the inline containment calls in the YAMLs keep the old remedy |
| `git` binary with worktree support | External | Green | The worktree phase degrades to the current in-checkout behaviour under forced preserve |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A fan-out run leaves the working tree dirty in a way that blocks the operator, a lane settles in the new state and a consumer cannot read it, or lineage worktrees fail to clean up.
- **Procedure**: Set the containment mode back to `restore` in the fan-out config to recover the previous remedy without reverting code. If the outcome separation itself is the problem, revert the runner commit alone — the guard change is independent and safe to keep. If worktrees are the problem, set the worktree option off; the runner falls back to the main checkout under forced preserve.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Quarantine + baseline) ──► Phase 2 (Outcome separation) ──► Phase 3 (Migration + docs)
                                                                            │
                                                                            ▼
                                                                   Phase 4 (Worktrees)
                                                                            │
                                                                            ▼
                                                                   Phase 5 (Churn detection)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Quarantine + baseline | None | Outcome separation, Migration |
| Outcome separation | Quarantine + baseline | Migration |
| Migration + docs | Quarantine + baseline, Outcome separation | Worktrees |
| Worktrees | Migration + docs | Churn detection |
| Churn detection | Worktrees | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Quarantine + baseline | Medium | 4-6 hours |
| Outcome separation | Medium | 3-4 hours |
| Migration + docs | Low | 2-3 hours |
| Worktrees | High | 8-12 hours |
| Churn detection | Low | 2-3 hours |
| **Total** | | **19-28 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] The containment mode default is confirmed as `preserve` in both the schema and the runner flag parser.
- [ ] The mode is settable per run, so a rollback needs no code change.
- [ ] The status vocabulary test pins every value a consumer may see.

### Rollback Procedure
1. Set the fan-out config containment mode to `restore` on the affected run, which restores the previous remedy immediately.
2. Revert the runner commit if outcome separation is the fault; the guard commit stands alone and does not depend on it.
3. Disable the worktree option if lineage worktrees are the fault; the runner returns to the main checkout under forced preserve.
4. Re-run the deep-loop runtime Vitest suite from the reverted state and confirm the previous behaviour is back.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Quarantine and baseline trees are additive files inside a lineage directory. Deleting them is the whole reversal, and nothing reads them on a subsequent run.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│  Guard: mode +       │────►│  Runner: outcome     │────►│  Callers + docs      │
│  quarantine + base   │     │  separation          │     │  migration           │
└──────────────────────┘     └──────────┬───────────┘     └──────────┬───────────┘
                                        │                            │
                                        ▼                            ▼
                             ┌──────────────────────┐     ┌──────────────────────┐
                             │  Config schema:      │     │  Lineage worktrees   │
                             │  containment block   │     │  (structural fix)    │
                             └──────────────────────┘     └──────────┬───────────┘
                                                                     │
                                                                     ▼
                                                          ┌──────────────────────┐
                                                          │  Churn detection     │
                                                          │  (optional)          │
                                                          └──────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Containment guard | None | Mode-aware remedy, quarantine tree, content baseline | Runner, config schema |
| Config schema | Containment guard | Parsed containment block with a preserve default | Runner, callers |
| Fan-out runner | Containment guard, config schema | Separated lane and containment outcomes | Pool summary, callers |
| Pool summary | Fan-out runner | Third outcome counter and status mapping | Callers |
| Callers and docs | Runner, pool summary | Migrated YAMLs and protocol documents | Worktrees |
| Lineage worktrees | Callers and docs | Exact per-lineage containment boundary | Churn detection |
| Churn detection | Lineage worktrees | Shared-checkout warning and forced preserve | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Containment guard: mode, quarantine and content baseline** - 4-6 hours - CRITICAL
2. **Fan-out runner: outcome separation and the new terminal state** - 3-4 hours - CRITICAL
3. **Caller and documentation migration** - 2-3 hours - CRITICAL
4. **Lineage worktrees** - 8-12 hours - CRITICAL

**Total Critical Path**: 17-25 hours

**Parallel Opportunities**:
- The config schema block and the quarantine writer can be built simultaneously; only the runner needs both.
- Documentation edits to the two loop protocols and the feature catalog can proceed alongside the runner work, since the intended behaviour is already fixed by the specification.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Incident cannot recur | A simulated concurrent editor's tracked files are byte-identical after a lane that trips containment | End of Phase 2 |
| M2 | Finished work survives a finding | A complete lane with containment findings appears in the orchestration summary as completed with advisory | End of Phase 2 |
| M3 | Attribution is exact | A full fan-out runs with every lineage in its own worktree, and the main checkout shows no lane-authored change | End of Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

The decisions this packet freezes are recorded in `decision-record.md`. Two of them govern this plan: the containment default becomes preserve with restore as an opt-in, and lineage worktrees use a detached ephemeral lane outside sk-git's numbered namespace. The alternatives weighed for each are recorded there rather than duplicated here.

---
