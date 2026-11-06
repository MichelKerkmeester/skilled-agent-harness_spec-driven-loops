---
title: "Feature Specification: Phase 2: overlay-engine"
description: "A project that vendors Skilled keeps its local changes only through Barter's private replay and sync scripts, which read two different states and leave a lock nothing enforces. This phase adds one overlay engine behind /doctor:overlay status and apply, with one state source, a guarded retained output, ordered json-entry operations, an exact-path secret guard, a configurable overlay folder and its own lock."
trigger_phrases:
  - "overlay engine"
  - "phase 2 overlay engine"
  - "doctor overlay status apply"
  - "overlay engine one state source"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 2: overlay-engine

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Barter keeps its divergences from upstream Skilled with two private scripts whose apply and check read different state, so a changed pinned overlay blocks the apply and every re-pin needs a hand-written restore script. This phase adds `overlay-engine.cjs`, one engine behind `/doctor:overlay status` and `apply`, with six fixes each proven by a test that fails before its fix. Barter's own tests, ported to the engine, pass unchanged in meaning.

**Key Decisions**: one engine rather than two scripts; the overlay folder comes from one setting file read by one function.

**Critical Dependencies**: the frozen copy of Barter's `replay.cjs` and `sync.cjs`, recorded by SHA-256 in `plan.md`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-06 |
| **Branch** | `worktrees/320-system-skilled-doctor` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-skill-and-tag-move |
| **Successor** | 003-repin |
| **Handoff Criteria** | The engine passes the ported tests and one failing-first test per requirement below, and `/doctor:overlay status` and `apply` route to it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Build system-skilled-doctor and the doctor overlay command specification.

**Scope Boundary**: the engine, its tests, the `/doctor:overlay` router with its `status` and `apply` targets, their routes, the skill's overlay reference and the listing surfaces that name every doctor command.

**Dependencies**:
- Phase 001's skill, which owns the new command.
- `../research/research.md`, which maps Barter's engine and its failure modes.

**Deliverables**:
- `.skilled/commands/doctor/scripts/overlay-engine.cjs` and its tests.
- `/doctor:overlay` with `status` and `apply`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Barter's `replay.cjs` plans its apply and check without the accepted hashes that `sync.cjs` passes, so a pinned overlay whose source changed blocks while the destination still holds the last applied copy. A path listed in both an overlay's `replace` and `retained` sets is skipped as an output, so `status` reads clean while the live copy is stale and the guard lets an edit through. The build lock is taken only by scratch wrappers, the secret-file guard was hand-patched with an extension list, a json-entry set fails when one operation depends on an item another adds, and the hook core finds the folder by the hard-coded name `barter-overlays`.

### Purpose
Any project that vendors Skilled can record its overlays in a folder it names, apply and check them through one engine that reads one state, and get a refusal rather than a half-applied tree when something conflicts.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Read-only commands against Barter's tree on 2026-11-06, quoted from `../research/design-spec.md` §2:

```text
$ grep -rn "build-lock" barter-overlays/*.cjs .skilled/hooks/overlay-sync .opencode/plugins/barter-overlay-sync.js .hermes/plugins/barter-overlay-sync | wc -l
0
$ grep -n "retainedPaths.has(rel)) continue" barter-overlays/replay.cjs
847:    if (wanted.kind !== 'file' || retainedPaths.has(rel)) continue;
$ grep -n "planOverlay(entry, root)" barter-overlays/replay.cjs
1190:  const plans = manifest.overlays.map((entry) => planOverlay(entry, root));
1242:  const plans = manifest.overlays.map((entry) => planOverlay(entry, root));
$ grep -n "acceptedSha256: state.files" barter-overlays/sync.cjs
241:  const plans = manifest.overlays.map((entry) => replay.planOverlay(entry, root, { acceptedSha256: state.files }));
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Merge Barter's two scripts into `overlay-engine.cjs`, with all six scopes, layout links and the regenerate and verify steps.
- Port Barter's sync and replay tests to drive the engine.
- Fix the six defects in §4, each with a test that fails on the straight port first.
- Add `/doctor:overlay` with `status` and `apply`, their routes, presentation and workflows.
- Add `references/overlays.md` to the skill and `/doctor:overlay` to every surface that lists the doctor commands.

### Out of Scope
- The `repin` target - phase 003.
- The guard hook adapters - phase 004.
- Barter's own cutover - a later Barter packet after a re-pin brings the engine in.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Create | The engine |
| `.skilled/commands/doctor/scripts/tests/overlay-engine*.test.cjs` | Create | Ported tests and one test per requirement |
| `.skilled/commands/doctor/overlay.md` | Create | The command router |
| `.skilled/commands/doctor/assets/doctor-overlay-{presentation.txt,status.yaml,apply.yaml}` | Create | Visible wording and the two workflows |
| `.skilled/commands/doctor/_routes.yaml` | Modify | The overlay routes, and the router count from 16 to 17 |
| `.skilled/skills/system-skilled-doctor/{SKILL.md,README.md,ROUTER.md,references/overlays.md}` | Modify, Create | The owned overlay command and its reference |
| The doctor listing surfaces | Modify | `/doctor:overlay` joins each list of doctor commands |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids follow the design packet's numbering.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-003 | Apply and check read the same accepted-hash state |
| REQ-004 | A retained path that the overlay also writes is a sync output and is guarded |
| REQ-005 | The engine owns its lock, and refuses while it is held |
| REQ-009 | The overlay folder is read from one setting by one function |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | The operations of one json-entry set apply in order |
| REQ-012 | The protected-name guard passes only paths a manifest entry names exactly |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine*.test.cjs` passes every ported test and each requirement's test, and each requirement test is recorded failing before its fix.
- **SC-002**: on a copy of Barter's tree with `.skilled-overlays.json` naming `barter-overlays`, the engine's `status` matches Barter's own scripts except where a fix above intends a difference.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The frozen Barter scripts | A Barter fix made after the freeze is lost | The SHA-256 of each frozen file is recorded in `plan.md` |
| Risk | The port changes behavior Barter depends on | High: 116 overlays run through it | Barter's own tests run against the engine, and a parity run on a copy of its tree |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `status` on a copy of Barter's tree finishes in the same order of time as Barter's own `sync.cjs --status`.

### Security
- **NFR-S01**: The engine never reads or writes a `.env` file or a protected token file that a manifest entry does not name exactly.

### Reliability
- **NFR-R01**: `apply` writes nothing at all while any destination is `both-changed` or `upstream-moved`.

---

## 8. EDGE CASES

- Empty input: a tree with no setting file and no `skilled-overlays/` folder reports that no manifest exists and exits non-zero without writing.
- Maximum input: Barter's manifest of 116 overlays across all six scopes.
- Failure path: a held lock makes `apply` exit non-zero, naming the lock's owner line and its file.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: about 12, LOC: about 2,000, Systems: the engine and the doctor command family |
| Risk | 15/25 | Auth: N, API: N, Breaking: Barter's re-pin path |
| Research | 6/20 | Done in the design packet |
| Multi-Agent | 5/15 | Workstreams: engine port, command files |
| Coordination | 6/15 | Dependencies: the frozen port source |
| **Total** | **50/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A ported test is weakened to pass | H | L | Assertions keep their meaning, and the review reads each ported test against its source |
| R-002 | A requirement test passes on the straight port, so it proves nothing | M | M | The red-then-green log records each test's failing output before its fix |

---

## 11. USER STORIES

### US-001: Apply a changed overlay without a restore script (Priority: P0)

**As a** maintainer of a vendored Skilled copy, **I want** a changed overlay to apply over the copy it applied last time, **so that** a re-pin needs no hand-written restore script.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Name my own overlay folder (Priority: P1)

**As a** project that is not Barter, **I want** to keep my overlays in a folder I name, **so that** the engine works without a folder called `barter-overlays`.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The operator decided the setting file, the token guard and the dropped auto-apply in the design packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decisions**: See `decision-record.md`

---
