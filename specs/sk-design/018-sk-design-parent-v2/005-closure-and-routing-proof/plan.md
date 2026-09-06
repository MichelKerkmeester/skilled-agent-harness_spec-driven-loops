---
title: "Implementation Plan: closure and routing proof"
description: "Measure the fleet from the closing state rather than trusting per-phase evidence, repair what the measurements prove wrong inside this packet's blast radius, and reconcile every document that still describes the old shape."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: closure and routing proof

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Four phases each closed against evidence they gathered themselves, at the moment they ran. Nothing
had compared the closing state against `scratch/routing-baseline.txt`, the sixteen-phrase measurement
taken before any file moved and the only record of the prior fleet.

Two properties of this toolchain make per-phase evidence unreliable. The advisor daemon serves its
previous generation until explicitly rebuilt, and the rebuild is never chained. And the skill-graph
builder drops a dangling edge silently, so `skill_graph_validate` reads the repaired artefact and
reports clean while the source metadata is broken.

### Overview

Rebuild, replay, re-run every gate reading output rather than exit codes, repair what that proves
wrong where the repair belongs to this packet, and reconcile the documents that now lie.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The problem statement and frozen scope are in `spec.md`
- [x] Success criteria are observable commands, not adjectives
- [x] Phases 002, 003, 004 and 001 are complete and their commits are on the branch

### Definition of Done
- [x] Every acceptance criterion in `acceptance-criteria.md` is `Met`, `Waived` or `Superseded`
- [x] Every gate re-run from the closing state with its output read
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Measurement, then repair, then re-measurement. No claim in this phase rests on evidence taken
before its own repair.

### Key Components

- **The advisor daemon**: rebuilt explicitly; its generation number is the proof it happened.
- **`scratch/routing-after-005.txt`**: the closing replay, in the baseline's own format so the two
  diff line by line.
- **`scratch/routing-regressions.md`**: the running record of what each step measured.
- **Three `graph-metadata.json` files**: where the dangling edges lived.
- **Two canon documents plus `016`'s spec**: where the old fleet shape was still described.

### Data Flow

A phrase is scored against a hub's `graph-metadata.json` `intent_signals`, the hub resolves a mode,
and the mode answers. The rebuild is what makes a metadata change visible to that path; without it,
every measurement describes the previous generation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | What the measurement found |
|---------|---------------------------|
| `sk-design/graph-metadata.json` | A dangling sibling edge to the dead standalone name, and a self-loop |
| `mcp-tooling/graph-metadata.json` | A sibling edge to the dead standalone name |
| `sk-communication/graph-metadata.json` | The same, plus a weight outside the recommended band on the row being rewritten |
| `sk-design` and `sk-doc` derived blocks | Stale: dead `key_files` and `source_docs` references left by the moves |
| `skill-root-metadata-contract.md` | The fleet class table listed `sk-design` as standalone and `sk-design-md-generator` as a root |
| `parent-skills-nested-packets.md` | The extension matrix said the hub "was decommissioned and is no longer an example of this shape" |
| `016`'s spec | Recorded no supersession from its own side |
| `sk-doc`'s hub playbook | Four fixtures assert `sk-doc` owns FLOWCHART; out of scope, named for its owner |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Step | What | Gate |
|------|------|------|
| 1 | Rebuild the daemon and read the generation back | The number moved |
| 2 | Replay the sixteen phrases | Diffed against the baseline, line by line |
| 3 | Re-run every gate and read the output | Not the exit code; one gate exits 0 at `verdict=FAIL` |
| 4 | Repair the dangling edges and stale derived blocks | `rejectedEdges: 0`; 13 fresh, 0 stale |
| 5 | Re-measure after the repair | Two scores moved up; recorded |
| 6 | Reconcile the canon documents and `016` | Each checked against the live audit output |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | How |
|-------|-----|
| Daemon actually rebuilt | `generationBefore` and `generationAfter` differ in the rebuild's own output |
| Routing | Sixteen-phrase replay diffed against `scratch/routing-baseline.txt` |
| Graph sources | The rebuild's `rejectedEdges` count, which the graph validator cannot see |
| Derived blocks | `ci-skill-derived-freshness`, exit code read |
| Fleet classes | `ci-skill-root-metadata`, whose output is also the source of truth for the canon table |
| Packet | `validate.sh --strict`, first `RESULT:` line per folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Depends on | Nature |
|-----------|--------|
| Phases 002, 003, 004 and 001 | All complete; this phase measures their combined result |
| `scratch/routing-baseline.txt` | The only record of the prior fleet, unrepeatable |
| An explicit daemon rebuild | Every routing number in this phase is quoted with its generation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each repair is independently revertible and none moves a file. Reverting the three
`graph-metadata.json` edits restores the four dangling edges, which the builder would resume dropping
silently. Reverting the derived-block regeneration restores two stale reference lists. Reverting the
canon edits restores three documents to a state that contradicts the audit.

There is no state to unwind: this phase writes documents and metadata, and rebuilds a cache that
rebuilds itself on demand.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| This phase | Depends on | Blocks |
|-----------|-----------|--------|
| `005-closure-and-routing-proof` | `002`, `003`, `004`, `001` | Nothing; it closes the packet |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Item | Size |
|------|------|
| Metadata files repaired | 5 |
| Canon documents reconciled | 3 |
| Gates run | 8 |
| Phrases replayed | 16 |
| Files moved | 0 |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Daemon rebuilt explicitly; generation observed to move before any number was quoted
- [x] Every gate's output read, not its exit code
- [x] Every repair re-measured after the fact, not assumed

### Rollback Procedure
1. Revert the metadata and document edits
2. Rebuild the advisor daemon and observe the generation move
3. Expect `rejectedEdges` to return to 4 and two phrase scores to drop

### Data Reversal

None. This phase writes documents and metadata only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
002 + 003 + 004 + 001 all complete
        |
        v
rebuild daemon (632 -> 633) -- generation observed
        |
        v
replay 16 phrases  ---->  read every gate's OUTPUT
        |                          |
        |                          v
        |                  rejectedEdges: 4  <-- graph validator says clean
        |                  derived freshness: 2 stale
        |                  playbook topology: verdict=FAIL, exit 0
        v                          |
        +--------------------------+
                    |
                    v
        repair edges + derived blocks -> rebuild (637 -> 638)
                    |
                    v
        re-measure: rejectedEdges 0, two scores up
                    |
                    v
        reconcile canon tables + 016 supersession
```

### Dependency Matrix

| Step | Needs | Produces |
|------|-------|----------|
| Rebuild | A complete tree | A generation that moved |
| Replay | The rebuild | `routing-after-005.txt` |
| Gates | The rebuild | The three findings |
| Repair | The findings | `rejectedEdges: 0`, 13 fresh |
| Re-measure | The repair | Two scores up, recorded |
| Reconcile | The audit output | Canon tables that match the fleet |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

The rebuild is first and everything depends on it: a replay against a stale generation measures the
previous fleet. The second constraint is reading output rather than exit codes — the playbook
topology gate exits 0 while printing `verdict=FAIL`, and without `--strict` it would have been read
as a pass.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Evidence |
|-----------|----------|
| Daemon rebuilt | generation 632 to 633, then 637 to 638 after the repair |
| Routing proven | Zero phrases reaching nobody, against four at the baseline |
| Graph sources clean | `rejectedEdges` 4 to 0; indexed edges 50 to 52 |
| Derived blocks fresh | 13 fresh, 0 stale, exit 0 |
| Canon reconciled | Fleet table matches the audit; the matrix and `016` corrected |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Read the build's warning stream, not only the validator's verdict

**Status**: Accepted

**Context**: `skill_graph_validate` reported `isValid: true, errorCount: 0` throughout the packet,
while the skill-graph build was rejecting four dangling edges on every run. The validator reads the
built graph; the builder had already dropped the bad edges.

**Decision**: Treat the rebuild's own `rejectedEdges` count and warning list as a gate in its own
right, and require it to be zero.

**Consequences**:
- Phase 003's criterion "no dangling edges" is corrected: true of the graph, false of the sources.
- Two phrase scores rose once the edges were repaired, so the defect was not inert.

**Alternatives Rejected**:
- Trust `skill_graph_validate`: it structurally cannot see this class of defect.

### ADR-002: Use `--strict` wherever a gate offers it

**Status**: Accepted

**Context**: `validate-playbook-topology` prints `verdict=FAIL` and exits 0 unless `--strict` is
passed.

**Decision**: Invoke every gate in its strictest form and read its output regardless.

**Consequences**:
- One gate that had been reading as a pass is now correctly reported as failing.
- The failure it reports is outside this packet's scope and is named rather than fixed.

**Alternatives Rejected**:
- Take the default invocation: it silently converts a failure into a pass.

### ADR-003: Name the blocked FLOWCHART fixtures rather than move or delete them

**Status**: Accepted

**Context**: Four fixtures in `sk-doc`'s hub playbook assert `sk-doc` owns FLOWCHART, which phase 004
made false. Three are pure FLOWCHART and would validate under `sk-design`, which has no hub playbook
root. The fourth pairs a `sk-doc` mode with a `sk-design` mode and can validate under neither, since
the gate is per-hub by design.

**Decision**: Change nothing. Record the failure, its cause, its exact invocation and the options,
and hand it to the owner of the benchmark corpus.

**Consequences**:
- `validate-playbook-topology --strict` stays red on `sk-doc`, and this packet does not claim
  otherwise.
- The corpus keeps its correspondence with the benchmark reports of 2026-07-21 that reference these
  scenario ids.

**Alternatives Rejected**:
- Delete the four fixtures: destroys tracked coverage and orphans report lineage.
- Move three and delete one: still deletes, and splits a corpus across two hubs mid-benchmark.
- Rewrite the cross-hub fixture to a pair that validates: fabricates a scenario under an id whose
  meaning is already recorded in published reports.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
