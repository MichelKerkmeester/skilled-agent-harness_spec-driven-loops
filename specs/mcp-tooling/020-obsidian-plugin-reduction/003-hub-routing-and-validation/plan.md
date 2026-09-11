---
title: "Implementation Plan: Phase 3: hub-routing-and-validation"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: hub-routing-and-validation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->

## 1. SUMMARY

Reconcile three files in the parent hub, then run four gates and record what they printed.

The hub edits are small and mechanical. The care goes into the gates, because each of the four has
a documented way of reporting green on something other than what was changed: a per-hub check run
without its hub argument, a validator silenced by a stale build, a phase parent whose output tail
describes its last child, and a registry entry mistaken for a working route.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->

## 2. QUALITY GATES

| Gate | Command | Passing condition |
|------|---------|-------------------|
| Leaf paths resolve | `test -f` over every mcp-obsidian leaf in `leaf-manifest.json` | all exit 0 |
| Hub vocabulary clean | `grep` the removed terms in `hub-router.json` and `mode-registry.json` | no hits |
| Per-hub check | `node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/mcp-tooling` | subject line names mcp-tooling, and the verdict passes |
| Spec validation | `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/runtime/cli/spec/validate.sh" <folder> --strict` per folder | an explicit `RESULT: PASSED` for each of the four folders |
| Route replay | `node .opencode/bin/compiled-route.cjs --hub mcp-tooling --prompt "<request>"` | an Iconic request routes; a Dataview request no longer claims this mode |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->

## 3. ARCHITECTURE

Routing is two-stage, and the two stages live in different files:

| Stage | File | Picks |
|-------|------|-------|
| One | the hub's `graph-metadata.json` | which hub the advisor scores |
| Two | `hub-router.json` plus `mode-registry.json` | which mode inside the hub, and its leaves |

`mcp-obsidian` is resolved by hub membership, so its vocabulary reaches the advisor through the
hub. Stage one needs no edit here: the only affected term it carries is `iconic`, which is
retained. Everything changing is stage two.

`leaf-manifest.json` is a third surface, neither stage: it is the inventory that says which files
the mode owns, and it is what goes stale when files are deleted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->

## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Owner | Contract that must not break |
|---------|-------|------------------------------|
| `leaf-manifest.json` | the hub | Every remaining leaf resolves; other modes' leaves untouched |
| `mode-registry.json` | the hub | `workflowMode`, `packetKind` and folder identity unchanged; only alias phrases change |
| `hub-router.json` | the hub | Signal keys stay aligned with registry modes; only removed-plugin vocabulary goes |
| `graph-metadata.json` | the hub | Not edited; verified to carry only `iconic` among affected terms |

Still speaking the old contract, and checked rather than assumed: the compiled-routing activation
artifact under `.opencode/bin/lib/compiled-routing/` holds a fence file and a manifest, with no
baked vocabulary, so it does not need regeneration.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->

## 4. IMPLEMENTATION PHASES

1. **Prune `leaf-manifest.json`**: remove every mcp-obsidian leaf under a deleted directory,
   keeping Iconic, Health.md, theme and non-plugin leaves.
2. **Prune `mode-registry.json`**: remove alias phrases naming removed plugins.
3. **Prune `hub-router.json`**: remove the removed plugins' vocabulary terms and router signals.
4. **Assert the retained vocabulary** is still present in both files.
5. **Run the four gates**, each from the final state, and paste their output into
   `implementation-summary.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->

## 5. TESTING STRATEGY

Four gates, each with a known way of lying, and the counter for each:

- **Per-hub check.** Pass the hub path explicitly. Run without it, the script reports on whichever
  hub it defaults to, in green, in detail, about something else. Read the subject line first.
- **Spec validation.** Require the literal `RESULT: PASSED`. A stale compiled orchestrator refuses
  to run, prints a staleness message, exits 3 and emits no rule output at all, which a sweep
  looking only for `RESULT: FAILED` reads as clean. Invoke through `realpath`, because on a
  symlinked `.opencode` the scripts can no-op at exit 0.
- **Phase-parent validation.** Take the first `RESULT:` line for the folder asked about. A parent
  recurses into its children, so the tail of the output describes the last child.
- **Route replay.** A registry entry is not a route. Replay a real request through both stages
  rather than trusting either validator.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->

## 6. DEPENDENCIES

| Dependency | Type | Why |
|------------|------|-----|
| Phases 1 and 2 | blocking | Gates over a half-reconciled tree report on a state nobody ships |
| `parent-skill-check.cjs` | tooling | The per-hub gate |
| `validate.sh` plus a current compiled runtime | tooling | The spec gate, and the thing that silently no-ops when stale |
| `compiled-route.cjs` | tooling | The replay |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->

## 7. ROLLBACK PLAN

To undo this phase: `git restore -- .opencode/skills/mcp-tooling/leaf-manifest.json .opencode/skills/mcp-tooling/mode-registry.json .opencode/skills/mcp-tooling/hub-router.json`

All three are tracked, so the restore is complete. Nothing in this phase is published, pushed or
installed, so there is no external state to reverse.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->

## L2: PHASE DEPENDENCIES

| Phase | Depends on | Blocks | Parallelizable |
|-------|-----------|--------|----------------|
| 001 plugin-doc-removal | nothing | 002, 003 | no |
| 002 skill-surface-reconciliation | 001 | 003 | no |
| 003 hub-routing-and-validation | 001, 002 | nothing | no |

This phase depends on both predecessors, not only its immediate one: the leaf manifest is
validated against the file set phase 1 produced, and the gates cover the documents phase 2 wrote.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->

## L2: EFFORT ESTIMATION

| Work item | Size | Note |
|-----------|------|------|
| Three hub file edits | S | Mechanical removal of known entries |
| Four gates plus recording | M | The recording is the deliverable, not the running |
| **Total** | **M** | Weighted toward verification rather than change |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->

## L2: ENHANCED ROLLBACK

| Trigger | Detection | Action |
|---------|-----------|--------|
| A retained term was removed | Assertion for Iconic, Health.md or theme vocabulary fails | `git restore` the file and redo the prune from the named term list |
| The per-hub gate fails | Non-passing verdict with mcp-tooling in the subject line | Read which surface it names and fix that surface, not the gate |
| `validate.sh` exits 3 with a staleness message | No rule output at all | Rebuild: `cd "$(realpath .opencode)/skills/system-spec-kit/runtime" && npm run build`, then re-run |
| A replay reaches the wrong mode | Route output names another mode | The two stages disagree; fix both, and do not report the mode as routed |
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->

## L3: DEPENDENCY GRAPH

```
001 deletions ------------------+
                                 v
002 mode documents ---------> 003 hub routing
                                 |
                                 v
                          four gates, from the final state
                                 |
                                 v
                       implementation-summary.md evidence
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->

## L3: CRITICAL PATH

The gates are the critical path, not the edits. Three hub files change in minutes; the value of
this phase is whether the evidence behind the closing claim is real. Each gate's failure mode is
silence rather than an error, so the path runs through reading output, not through running commands.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->

## L3: MILESTONES

| Milestone | Definition of done |
|-----------|--------------------|
| M1 hub pruned | Three files edited, retained vocabulary asserted present |
| M2 leaf paths resolve | Every mcp-obsidian leaf checked individually |
| M3 gates run | All four executed from the final state, output read |
| M4 evidence recorded | Output pasted into `implementation-summary.md`, not summarized |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD


**ADR-005: Do not edit the hub's `graph-metadata.json`.**

*Context.* Stage-one advisor vocabulary lives there, and twelve plugins are being removed.

*Decision.* Leave it unchanged.

*Consequence.* Inspection showed it carries only `iconic` and `iconic rulebook` among the affected
terms, both retained. Editing it would be a change with no reason, on the file that decides
whether the hub is reachable at all.

**ADR-006: Do not regenerate the compiled routing bundle.**

*Context.* Compiled routing is default-on for hubs, so a vocabulary change could require a rebuild.

*Decision.* No rebuild.

*Consequence.* The activation directory holds a fence file and a manifest, and no vocabulary, so
the router is read at request time. A rebuild would be ceremony. If a replay shows otherwise, that
is a finding to report rather than a rebuild to run quietly.


---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [ ] `spec.md` §3 read; the scope is the frozen list, not one re-derived at run time
- [ ] The negative control captured, so a passing check afterwards carries information
- [ ] The rollback sentence in §7 is real and runnable before the first mutation

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Work the tasks in order. Later tasks assume earlier ones landed. |
| TASK-SCOPE | Touch only the paths named in `spec.md` §3. Anything else is recorded, not fixed. |
| TASK-EVIDENCE | A task is done when a command's output was read, never when it was launched. |
| TASK-HALT | Stop on any mismatch between a named path and what is on disk. Report it. |

### Status Reporting Format

Report per task: the task id, the command run, what it printed, and the resulting state. Not
"done". A count, a path listing, or an exit status that was actually read.

### Blocked Task Protocol

When a task cannot proceed: stop at that task, leave the tree in its current state, and report
the task id, the exact command, its output, and what would unblock it. Do not skip ahead to a
later task, and do not substitute a different approach for a named one without saying so.
