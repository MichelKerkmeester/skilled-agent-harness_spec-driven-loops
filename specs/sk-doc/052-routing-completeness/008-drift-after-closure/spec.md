---
title: "Feature Specification: Phase 8: drift after closure"
description: "Two days after the packet closed, a runtime nesting broke the spec-kit scaffolder, two Gate A signals moved, and an advisor parity pin started tracking a live database. This phase re-measures both gates, repairs what the measurement proves, and records what it cannot."
trigger_phrases:
  - "drift after closure"
  - "scaffold stopped rendering"
  - "gate a rerun"
  - "gate b rerun"
  - "parity pin regime"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 8: drift after closure

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

The packet closed on 2026-09-03 with every phase green. A review on 2026-09-05 re-ran
both routing gates against the live advisor and ran every check the phases had added.
Gate A reproduced at 343 of 388 against 345 recorded, Gate B at 20 of 180 against 21, and
three things had broken underneath: the spec-kit scaffolder rendered no documents at all
after its CLI workspace was nested, one advisor parity pin now moves between two identical
runs, and one signal each in two hubs no longer lands where it was recorded.

**Key Decisions**: the scaffold loader paths are fixed at the wrapper that lost them, not
by widening the fallback; the parity pin is not re-baselined here because its number
depends on which skill-graph database the run sees; the CLI hub gives up a signal that
spec-kit now owns.

**Critical Dependencies**: the advisor daemon holding still, exactly as D2 in the parent
goal requires.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-05 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 8 |
| **Predecessor** | 007-spec-kit-residue |
| **Successor** | None |
| **Handoff Criteria** | Both gates re-measured with committed artifacts, the scaffold renders a full packet again, and every moved number has a fix or an owner |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the routing completeness packet. Phases 1 to 7 measured routing,
fixed what the numbers pointed at, and closed. This phase is the re-measurement two days
later, and the repairs that re-measurement earned.

**Scope Boundary**: the drift the 2026-09-05 review observed, and nothing the review did
not observe. A number that moved is in scope. A number that could move is not.

**Dependencies**:
- The advisor daemon at generation 593 to 597 on 2026-09-05, live, with the scorer unchanged
- The `b4c2484696` nesting of the spec-kit CLI workspace under `runtime/`, which is the
  cause of the scaffold break and the reason phase 007's continuity paths are stale

**Deliverables**:
- Three loader paths repaired in the spec-kit CLI, with the scaffold test green
- Gate A and Gate B re-run artifacts under `research/`, one row per signal and per prompt
- One signal retired from the CLI hub, with the hub re-minted and its gates green
- Two findings recorded with owners rather than fixed: the dead underscore signal and
  the regime-dependent parity pin
- Phase 007's continuity paths repointed, and the parent packet's documents reconciled

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A packet that closes on measured numbers stays true only while its inputs hold still.
Between 2026-09-03 and 2026-09-05 the spec-kit engine was moved under `runtime/` and its
CLI workspace nested one level deeper, and the routing surfaces this packet measured were
never re-measured against the tree that resulted. The review that did re-measure them found
a scaffolder that writes a packet with no spec documents, a test pin that reads a different
number on consecutive runs, and two signals that no longer resolve where the register says
they do.

### Purpose

Every number this packet recorded is either reproduced on 2026-09-05, repaired to reproduce,
or written down as moved with an owner.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Re-run Gate A over the 388-signal corpus and Gate B over the 180-prompt corpus, and commit both artifacts
- Repair the spec-kit scaffold so a Level 3 packet renders its full document set again
- Retire `spec kit runtime` from the CLI hub, re-mint the hub, and replay both routing stages
- Record the `trigger_phrases` signal loss and the parity-pin regime dependence as owned findings
- Repoint phase 007's continuity key files to their post-nesting locations
- Reconcile the parent packet: phase map, goal criteria, roadmap, and the unfilled template sections

### Out of Scope
- Re-baselining the Python and TypeScript parity pin. The number depends on the local skill-graph database regime, and D2 forbids a scoring change while these gates stand
- Diagnosing the advisor's tokenization of `trigger_phrases`. Both scorers return nothing with no rejection reason; that is an advisor investigation with its own owner
- Restoring the provider vocabulary phase 002 retired. Those signals returned nothing before retirement and return nothing after it; nothing moved

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/runtime/cli/templates/inline-gate-renderer.sh` | Modify, landed in `743e626543` | Resolve the tsx loader from the skill root, three levels up, not one |
| `.opencode/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Same root for the graph-metadata backfill loader |
| `.opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh` | Modify | Same root for the TypeScript orchestrator lane |
| `.opencode/skills/cli-external-orchestration/graph-metadata.json` | Modify | Retire `spec kit runtime` from both intent-signal lists |
| `research/gate-a-rerun-2026-09-05.tsv` | Create | 388 signals, recorded bucket beside the re-run bucket |
| `research/gate-b-rerun-2026-09-05.tsv` | Create | 180 prompts, top skill, compiled target, and hit flag |
| `../007-spec-kit-residue/implementation-summary.md` | Modify | Continuity key files repointed under `runtime/cli/` |
| `../007-spec-kit-residue/spec.md` | Modify | Template sections filled from the phase's own record |
| `../spec.md`, `../goal.md`, `../roadmap.md` | Modify | Parent reconciled with what the tree says |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Both gates are re-run against the live daemon and the per-row artifacts are committed under `research/` |
| REQ-002 | A Level 3 scaffold with lazy add-ons renders every document its contract names, and the scaffold test file passes in full |
| REQ-003 | Every row whose bucket differs from the recorded one has a fix in this phase or an owner in `decision-record.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The CLI hub no longer declares `spec kit runtime`, its compiled manifest is fresh, and a live replay lands the phrase on `system-spec-kit` |
| REQ-005 | Phase 007's continuity names files that exist, and the parent packet's status, phase map, and goal criteria agree with the tree |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scaffold-golden-snapshots.vitest.ts` reports 9 of 9 passing from the final tree, where it reported 8 of 9 before the fix
- **SC-002**: Gate A re-run tallies 388 rows with every bucket change named, and Gate B re-run tallies 180 rows with the hit count recorded
- **SC-003**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for all nine folders, and the placeholder checker reports zero patterns on the parent, phase 007, and this phase
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon and its skill-graph database | Every re-run number reads the daemon; a generation bump mid-run mixes two states | Both re-runs completed inside one generation window, and the generation is recorded in the summary |
| Risk | Editing a hub's routing input without re-minting drops it to legacy routing silently | Medium | `compiled-route-guard.cjs` run after the edit and the mint, and the phrase replayed live |
| Risk | A re-run number read as a regression when it is only the daemon regime | Medium | The parity pin is run under both regimes and the pair recorded, not one number |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full Gate B re-run of 180 daemon calls completes within one daemon generation window, so the rows describe one state

### Security
- **NFR-S01**: No change here widens what the scaffolder writes; the loader path fix keeps every write inside the target packet, which the existing `_ensure_dest_within_dir` guard already enforces

### Reliability
- **NFR-R01**: The scaffold fix is proven by the same test that was red before it, run from the final tree

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: a Gate B prompt that returns no recommendation is counted as empty, never as a wrong hub
- Maximum length: the corpus files are fixed at 388 and 180 rows; a re-run that returns a different row count is a runner defect, not a measurement

### Error Scenarios
- External service failure: a daemon call that errors is recorded as an error row and excluded from the tally, and the tally states the error count
- Network timeout: each daemon call carries a 60 second bound, and a timed-out row is an error row

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 9 edited, 2 created; LOC under 50 in code; Systems: spec-kit CLI, advisor hub inputs |
| Risk | 10/25 | Auth: N, API: N, Breaking: a routing input and a scaffold shared by every packet creation |
| Research | 12/20 | Two root causes traced, one left open with evidence |
| Multi-Agent | 0/15 | Single session |
| Coordination | 6/15 | Depends on the parent packet's D2 and on the nesting commit |
| **Total** | **36/100** | **Level 3**, held at the sibling level because the phase records decisions |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Another path in the CLI still spells the loader one level up | M | L | All three spellings found by one grep were fixed; the grep is recorded in the summary |
| R-002 | The retired signal was carrying traffic the CLI hub should keep | L | L | Live replay before and after: `system-spec-kit` won at 0.93 already, and the hub lost nothing it owned |
| R-003 | The parity pin is re-baselined by someone reading only the local number | M | M | ADR-002 records both regime numbers and why neither is a pin |

---

## 11. USER STORIES

### US-001: A packet author scaffolds a Level 3 packet (Priority: P0)

**As a** packet author, **I want** `create.sh --level 3` to write spec, plan, tasks, acceptance criteria, and the requested add-ons, **so that** the packet validates the moment it exists rather than failing on a missing spec.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A reviewer re-reads the routing numbers (Priority: P1)

**As a** reviewer, **I want** the re-run artifacts beside the originals with the recorded bucket in the same row, **so that** a moved number is one column comparison and not a re-derivation.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

One, and it is an advisor question rather than a packet question. `trigger_phrases` is
declared in `sk-doc`'s derived trigger phrases, resolved at 0.488 on 2026-09-04, and returns
nothing from both scorers on 2026-09-05 with no rejection reason, while `importance_tier`
and `contextType` beside it still resolve. Nothing in the hub's metadata changed between the
two dates. The mechanism is not known, and ADR-003 records the evidence and the owner.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`
