---
title: "Implementation Plan: Phase 6: verification-and-closeout"
description: "One reproducible gate sweep run from the settled tree rather than trusting the per-phase results, covering the five hubs, the metadata CI, the connectivity gate, both playbook packages, link integrity, the alias table, the agent mirrors, the corpus frontmatter gate and the 683-test benchmark suite. Then the closeout edits, and a named list of what was found and deliberately not fixed."
trigger_phrases:
  - "final state gate sweep"
  - "canary re-pin discipline"
  - "packet closeout edits"
  - "version derivation reconcile deferred"
  - "playbook allowlist enrolment"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 6: verification-and-closeout

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node and Python gate scripts across `.opencode/`, plus the packet's own markdown |
| **Framework** | The sk-doc parent-hub gate set, the compiled-routing publish chain, the playbook fail-closed tier, and the vitest benchmark suite |
| **Storage** | None written on purpose. Two artifacts were checked for residue afterwards: `runtime/database/council-graph.sqlite` and `specs/descriptions.json` |
| **Testing** | One reproducible sweep from the final tree, plus the 683-test benchmark suite compared against its pre-packet baseline |

### Overview
Every earlier phase proved its own step against a tree that a later phase then changed, so none of them
proves the result. This phase runs the whole gate set once, from the tree as it finally stands, and takes
that run as the packet's verdict. It then makes the closeout edits the earlier phases left owed, and names
what it found and did not fix rather than absorbing it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — spec.md §2 states it plainly: a gate that passed in phase 003 was measuring a tree phase 004 then changed, so only the last measurement is trustworthy
- [x] Success criteria measurable — SC-001 is a set of exit statuses and serving states, SC-002 is a test count against a baseline, SC-003 is a validator verdict; all three print readable output
- [x] Dependencies identified — the five hubs and their gates, the canary harness and its pinned digests, both playbook packages, the benchmark suite, and the packet's own documents

### Definition of Done
- [x] All acceptance criteria met — AC-001 through AC-006 in acceptance-criteria.md are all `Met`
- [x] Tests passing (if applicable) — `Test Files 54 passed (54)`, `Tests 683 passed (683)`, unchanged from the pre-packet baseline
- [x] Docs updated (spec/plan/tasks) — plan.md, tasks.md, acceptance-criteria.md and implementation-summary.md all trace to spec.md's REQ-001/002/003 and SC-001/002/003
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not a software architecture. The governing structure is a single-pass verification sweep: every gate that
any phase of this packet could have disturbed is run once, in one session, against one tree, and the run is
the evidence. A gate rerun after any further edit belongs to a new sweep, not to this one.

### Key Components
- **The hub gate set** — five hubs in `compiled-serving`, five parent-hub canaries at exit 0, five `parent-skill-check` invariant gates, and the move simulation that proves every hub resolves without reading under `.opencode/specs`.
- **The re-pin discipline** — the canary harness pins a sha256 per authored hub source, so an edited source turns a canary red until the pin is refreshed. A re-pin that is not preceded by a real red run is indistinguishable from disabling the check.
- **The live-topology counts** — four counts the same harness carries, which its own code comment says a mode registration refreshes. The invariant they encode is the gap between modes and packets, not the numbers themselves.
- **The two playbook packages** — the frontmatter one from phase 005 and the human-voice one from phase 007, both checked here from the final tree by their own validator and by the benchmark loader.
- **The closeout edits** — the allowlist enrolments, the mode `README.md`, the mode changelog, and two duplicated placeholder rows in the parent phase map.

### Data Flow
Each gate reads the settled tree and reports an exit status plus a countable result. Nothing in this phase
feeds another gate's input, which is the point: the gates are independent readings of the same final state,
so a pass in one cannot mask a failure in another. Only the compiled-routing chain is ordered, because
serving status is downstream of the manifest it publishes.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

A verification phase still writes: the closeout edits are real changes and are inventoried here alongside
the surfaces the sweep only reads.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| The five parent hubs | Compiled routing consumers | Read only | All five `compiled-serving`; `move-simulation OK: all 5 hubs resolve; 0 reads under .opencode/specs`; five canaries exit 0 |
| `parent-skill-check.cjs` on each hub | The hard-invariant gate | Read only | Five runs, each `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0 |
| Skill-root metadata CI | The fleet identity-file audit | Read only | `checked=14 passed=14 failed=0 fixed=0` |
| `package_skill.py --check --strict` on the new mode | The packaging gate | Read only | `Result: PASS` |
| `d5-connectivity.cjs` | Leaf and router connectivity | Read only | `sk-create-frontmatter` score=100 `gateFailed=false` `stageTwoRouted=3` issues=0; `sk-create-with-human-voice` score=100 `gateFailed=false` `stageTwoRouted=5` issues=0; the hub itself 0 issues |
| Both playbook packages | The two packages this packet added | Read only | Both `PASS ... violations=0 warnings=0`, and both visible to the loader at 11 and 9 scenarios with zero warnings |
| The canary harness fixture | Pinned digests and live-topology counts | Updated: one re-pin plus four refreshed counts | The re-pin followed a red run naming `packets/sk-create-frontmatter/SKILL.md`; counts moved 14 to 15 and 13 to 14, and the gap they encode is unchanged at 1 |
| `playbook-failclosed-allowlist.txt` | The enforced-package roster | Updated: both playbook roots enrolled | Playbook routing-gold topology `verdict=PASS valid=32 blocked=0 unenrolled=0 total=32` |
| `sk-create-frontmatter/README.md` | The mode's own navigation | Updated: a playbook row in the related-documents table and two playbook gates in the verification table | Link integrity across the hub reports zero frontmatter-related failures |
| `sk-create-frontmatter/changelog/v1.0.0.0.md` | The mode's release history | Rewritten: the first-version entry now describes the mode as it ships | The original entry described an empty scaffold and said the packet was not registered, both untrue two phases later |
| The parent `spec.md` phase map | The packet's own phase table | Updated: two duplicated placeholder rows removed | Both were template residue from when phase 7 was appended |
| The benchmark suite | The standing regression signal | Read only | `Test Files 54 passed (54)`, `Tests 683 passed (683)`, unchanged from baseline |
| `runtime/database/council-graph.sqlite`, `specs/descriptions.json` | Artifacts a sweep can dirty | Checked for residue | Both clean after the run |

Required inventories:
- Same-class producers: every gate that any phase of this packet could have disturbed. The sweep enumerates them rather than sampling, which is why it includes the alias table, the agent mirrors and the corpus frontmatter gate alongside the obvious hub checks.
- Consumers of the changed surface: the canary harness consumes the pinned sources and the topology counts; the fleet sweep consumes the allowlist; readers consume the README and the changelog; the packet validator consumes the phase map.
- Matrix axes: five hubs crossed with four hub-level gates (serving state, canary, `parent-skill-check`, move simulation), plus two playbook packages crossed with two readers (validator, loader).
- Algorithm invariant: a gate's verdict is only about the tree it read. Any edit after a gate ran invalidates that gate's result, which is why the closeout edits were made before the sweep rather than after it.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Settle the tree

Make every closeout edit the earlier phases left owed, so the sweep measures a tree that nothing further
will change: the allowlist enrolments, the mode README, the mode changelog, and the two duplicated
placeholder rows in the parent phase map.

### Phase 2: Re-pin only what legitimately drifted

Refresh the canary digest for the source this packet edited, after a run that proved the pin still fires,
and refresh the four live-topology counts the harness's own code comment says a registration moves. Confirm
the invariant those counts encode is unchanged.

### Phase 3: Run the sweep and record what is not being fixed

Run every gate once from the settled tree, read each exit status and count, confirm no test residue, and
name the three things found during the sweep that belong to another packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Hub integrity | All five hubs: serving state, canary, hard invariants, move simulation | `compiled-route-*` status, the per-hub canaries, `parent-skill-check.cjs` |
| Fleet metadata | Every skill root's identity files | The skill-root metadata CI audit |
| Packaging | The new mode's file shape | `package_skill.py --check --strict` |
| Connectivity | Both new modes and the hub | `d5-connectivity.cjs` |
| Playbook packages | Both packages, by both of their readers | `validate-playbook-package.cjs` and the benchmark scenario loader |
| Link integrity | The whole hub, compared against the pre-packet baseline | `resolve_skill_markdown_links.py` |
| Corpus frontmatter | Every file the versioning gate covers | The corpus frontmatter version gate |
| Regression | The full benchmark suite against its pre-packet baseline | vitest, 54 files and 683 tests |
| Residue | Artifacts a sweep can dirty | Direct check of `runtime/database/council-graph.sqlite` and `specs/descriptions.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 002 through 005 and 007 | Internal, upstream | Green — all closed, and their outputs are what this sweep measures | Nothing to verify |
| The five parent hubs | Internal | Green — all `compiled-serving`, all canaries exit 0 | No hub-level verdict |
| The canary harness | Internal | Green — one re-pin after a red run, four refreshed counts | The stale digest would keep a canary red and mask a real regression |
| Both playbook packages | Internal | Green — both `PASS`, both visible to the loader | Two of the packet's deliverables would be unverified |
| The benchmark suite | Internal | Green — 683 tests passing, unchanged from baseline | No regression signal for the packet as a whole |
| `frontmatter-version.mjs` | Internal | Yellow — a reconcile is owed after the commit, deliberately not run now | Nothing blocked; the standard's own rule is skip-on-differ, so leaving the values alone is the correct state |
| The sibling `sk-create-repo-rule` playbook | Internal, adjacent | Red for its own reasons — invisible to the benchmark loader, and out of this packet's scope | Nothing blocked here; recorded so it is not rediscovered as a symptom of this packet |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate in the sweep goes red and the cause is one of this phase's own closeout edits rather than an upstream phase.
- **Procedure**: The closeout edits are individually reversible and independent of each other. Remove the two allowlist lines, revert the README rows, restore the previous changelog entry, and restore the two phase-map rows. Then rerun the sweep. The canary re-pin reverses by restoring the previous digest, which returns the canary to red and re-exposes the drift it was recording. Nothing in this phase touches routing, so no compiled-routing revert is involved.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Not applicable. No hour-level effort estimate was recorded for this phase; progress is tracked by per-task
completion in `tasks.md` (T001-T018), not against a time budget.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) — Not applicable: no data store is written. Git history is the recovery point for the four closeout edits
- [x] Feature flag configured — Not applicable: no runtime flag governs a verification sweep. The nearest toggle is the allowlist line, and it is set deliberately
- [x] Monitoring alerts set — the sweep is itself the standing monitoring, and enrolling both playbook packages is what brings them inside it

### Rollback Procedure
1. Identify which closeout edit caused the red gate: the allowlist lines, the README rows, the changelog rewrite, or the phase-map row removals.
2. Revert that edit alone. The four are independent, so reverting one does not require reverting the others.
3. Rerun the affected gate and confirm it returns to its previous state.
4. If the canary re-pin is the cause, restore the previous digest and expect the canary to go red again, since the pin was recording a real edit.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. No schema, database or generated artifact is migrated. The two artifacts a sweep can dirty were checked and are clean.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │Implementation│    │ Verification │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1 (Setup) | Phases 002 through 005 and 007 | A settled tree: allowlist enrolments, README rows, the rewritten changelog, and the corrected phase map | Phase 2 |
| Phase 2 (Implementation) | Phase 1 | One re-pin after a red run, and four refreshed live-topology counts whose encoded gap is unchanged | Phase 3 |
| Phase 3 (Verification) | Phase 2 | The whole-sweep result, the residue check, and the named list of what is not being fixed | Packet closure |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 (Settle the tree)** - Duration: not tracked - CRITICAL
2. **Phase 2 (Re-pin only what legitimately drifted)** - Duration: not tracked - CRITICAL
3. **Phase 3 (Run the sweep and record what is not being fixed)** - Duration: not tracked - CRITICAL

**Total Critical Path**: Not applicable. No duration estimates were recorded for this phase.

**Parallel Opportunities**:
- None taken, and deliberately so. The whole value of this phase is that one sweep measured one tree, and running a gate before the tree had settled would produce a result that says nothing about the final state.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Tree settled | Both playbook roots enrolled, the mode README and changelog corrected, and the two duplicated phase-map rows removed | Complete |
| M2 | Drift re-pinned honestly | One re-pin, preceded by a red run naming the edited source, plus four refreshed topology counts whose encoded gap is unchanged at 1 | Complete |
| M3 | Sweep green | Five hubs `compiled-serving`, five canaries exit 0, five `parent-skill-check` gates at exit 0, metadata CI `checked=14 passed=14 failed=0`, both playbook packages `PASS`, `Tests 683 passed (683)` | Complete |
| M4 | Closeout honest | Three out-of-scope findings named rather than absorbed, and no test residue left behind | Complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Rewrite the mode changelog as one first-version entry rather than fabricating a history

**Status**: Accepted

**Context**: `sk-create-frontmatter/changelog/v1.0.0.0.md` was written in phase 002, when the packet was an
empty scaffold. It said so: it described a packet holding no content and stated that the mode was not
registered. Both claims stopped being true two phases later, so by the time of closeout the mode's only
release document described a mode that no longer exists.

**Decision**: Rewrite the single first-version entry so it describes the mode as it ships, and record the
scaffold-then-fill ordering as a note inside that entry.

**Consequences**:
- The changelog now matches the mode a reader will find on disk, which is the only thing a first-version entry is for.
- The scaffold-then-fill ordering is preserved as information rather than as a stale claim, so the packet's actual sequence is still legible.
- A reader looking for a per-phase release trail will not find one here, because there was never a release between phases.

**Alternatives Rejected**:
- Add a second entry describing the fill: rejected because nothing was released between phases, so a two-entry history would assert two versions that never existed.
- Leave the original entry alone: rejected because it makes two false statements about the shipped mode, and a changelog that misdescribes the current version is worse than none.

---

### ADR-002: Leave the two moved documents on their inherited versions until after the commit

**Status**: Accepted

**Context**: The two documents phase 003 moved still carry `1.8.0.19` and `1.8.0.0`, inherited from the old
shared-tier anchor. `frontmatter-version.mjs compute` derives `1.0.0.0` for both under their new packet.
The computed value is an artifact of the uncommitted move: the new path has zero commits, so the real edit
count reads zero, and `--follow` picks the history back up once the rename is committed.

**Decision**: Change nothing now. The versioning standard's own rule is skip-on-differ, never silently
overwrite, so the correct action while the two values disagree is to leave both alone. After the commit,
`frontmatter-version.mjs apply --skill sk-doc --update` reconciles both to their new anchor.

**Consequences**:
- The reconcile is owed and is named as owed, in implementation-summary.md and in this record, rather than being applied on a number that is currently wrong.
- No gate is blocked by the deferral. The corpus frontmatter gate checks presence and format, not derivation, so it reports `ok=309` with the values as they stand.
- Someone reading the two documents before the reconcile sees a version inherited from the old anchor, which is accurate about where the content came from.

**Alternatives Rejected**:
- Apply the computed `1.0.0.0` now: rejected because it would write a value derived from a path with no history, overwriting a real one on the strength of an artifact of the uncommitted move.
- Hand-edit both to a chosen version: rejected because the whole point of a derived version is that nobody chooses it.

---


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
