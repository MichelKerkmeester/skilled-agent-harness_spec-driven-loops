---
title: "Feature Specification: Phase 2: tooling-fixes"
description: "The intent-signal generator only ever adds router phrases, so a renamed phrase stays in the advisor until someone restores the file by hand, and router reach defaults to a concurrency that returned probe errors from a busy advisor. This phase makes the generator report and prune orphan phrases and gives reach a safer default."
trigger_phrases:
  - "tooling fixes"
  - "phase 2 tooling fixes"
  - "intent signal orphan pruning"
  - "router reach default concurrency"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: tooling-fixes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/314-frontend-upstream-proposals` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 5 |
| **Predecessor** | 001-frontend-surface-mode |
| **Successor** | 003-design-handoffs |
| **Handoff Criteria** | Both scripts' test suites exit 0 and `--check` names orphan phrases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Frontend upstream proposals from Barter's frontend practice program specification. It covers proposal ranks 4 and 9: small tooling fixes with no routing effect.

**Scope Boundary**: `generate-router-intent-signals.cjs`, `ci-router-vocabulary-reach.cjs` and their tests under `.skilled/skills/sk-doc/sk-create-skill/scripts/`. No router or registry content changes.

**Dependencies**:
- Phase 001 closed, so any phrase it renamed is visible to the orphan check.

**Deliverables**:
- `--check` reports orphan phrases, `--write` removes them, and a keep marker protects a hand-added signal.
- Router reach no longer reports a busy advisor's refusals as unreachable phrases by default.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`plan()` computes only the phrases missing from `intent_signals`, and `write()` appends them, so a phrase a router no longer declares stays in the advisor vocabulary. Every Barter phrase rename needed a pin restore of the live `graph-metadata.json` before regenerating. Separately, router reach defaults to concurrency 8, which returned 11 to 13 `probe-error` rows from a busy advisor in Barter phase 026, while concurrency 2 passed.

### Purpose
A renamed router phrase leaves the advisor vocabulary on the next `--write`, and a default reach run reports real reach failures rather than advisor load.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n 64p .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs
  const missing = declaredPhrases(hub).filter((p) => !have.has(p.toLowerCase()));

$ sed -n 71p .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs
  p.meta.intent_signals = [...p.existing, ...p.missing];

$ node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check | tail -5
OK    sk-design                    declared=120 signals=219 missing=  0
OK    sk-doc                       declared=243 signals=259 missing=  0
OK    system-deep-loop             declared= 29 signals= 34 missing=  0

checked=7 hub(s), missing=0
RESULT: PASSED

$ grep -n "DEFAULT_CONCURRENCY = " .skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs
35:const DEFAULT_CONCURRENCY = 8;
```
`signals` exceeds `declared` on every hub shown, but the check cannot say which extra signals are hand-added and which are orphans of a rename.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add an orphan computation to `plan()`: a signal in `intent_signals` that the hub's routers no longer declare and that carries no keep marker.
- Make `--check` print and count orphans and fail on them, and make `--write` remove them while keeping the authored order of what stays.
- Define the keep marker for a hand-added signal and document it in the script header.
- Change router reach so a default run does not report advisor load as unreachable: lower `DEFAULT_CONCURRENCY` to 2, or retry `probe-error` rows once at concurrency 1 before reporting them, chosen from a measured run.
- Cover both changes in `tests/` with a happy path and one edge case each.

### Out of Scope
- Pruning the live hubs' existing extra signals in this phase - each hub's first `--write` after this lands is its owner's change, reviewed per hub.
- Any change to the advisor scorer or allowlists - phrases are the only lever, per Barter ADR-007.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs` | Modify | Orphan computation, report, prune, keep marker |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/ci-router-vocabulary-reach.cjs` | Modify | Default concurrency or a concurrency-1 retry |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/tests/` | Create/Modify | Tests for both behaviors |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | On a fixture hub whose `intent_signals` holds one phrase no router declares, `--check` prints that phrase as an orphan, counts it and exits 1. |
| REQ-002 | On the same fixture, `--write` removes the orphan and keeps every other signal in its original order. |
| REQ-003 | A signal carrying the keep marker is never reported or removed. |
| REQ-004 | A default reach run (no `--concurrency`) uses the safer behavior, and a test pins it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The choice between a default of 2 and a concurrency-1 retry is recorded with the measured run that decided it. |
| REQ-006 | `--check` against the live tree is run once after the change and its orphan list saved to `scratch/orphans.txt` for the hub owners. |
| REQ-007 | The `node --test` suites under `scripts/tests/` exit 0 from the final state. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The fixture test for REQ-001 to REQ-003 passes and fails when the orphan logic is reverted.
- **SC-002**: A default reach run on sk-code reports `probe-error=  0` where concurrency 8 previously reported rows from load.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor daemon for reach timing runs | Med | Measure at a quiet time and record the load conditions |
| Risk | `--write` removes a signal someone added by hand | High | The keep marker, plus REQ-006's report before any live `--write` |
| Risk | A lower default makes a fleet run slow | Low | The script header already measures about six seconds a prompt; record the new wall time |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A full fleet reach run's wall time is recorded before and after; the change may slow it but must not drop any probe.
- **NFR-P02**: `--check` stays offline: it reads files only and calls no advisor.

### Security
- **NFR-S01**: N/A - the scripts read and write repository JSON only and handle no credential.
- **NFR-S02**: `--write` writes only the hub's own `graph-metadata.json`.

### Reliability
- **NFR-R01**: A rerun of `--write` on an already-pruned hub changes nothing.
- **NFR-R02**: A test fails if the orphan logic is removed.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a hub with an empty `intent_signals` reports no orphans and exits 0.
- Maximum input: a phrase differing only in case from a declared phrase is not an orphan, matching the existing lower-case comparison.
- Failure path: an unreadable `graph-metadata.json` exits non-zero with the path named, as today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Two scripts and their tests |
| Risk | 9/25 | A prune can delete hand-added signals |
| Research | 4/20 | One measured reach comparison |
| **Total** | **19/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What form does the keep marker take, given `intent_signals` is a JSON array of strings? Options: a sibling `intent_signals_keep` array, or a prefix. Decide at T002 and record it in the script header.
- Default of 2, or a concurrency-1 retry? REQ-005 decides it from a measured run.
<!-- /ANCHOR:questions -->

---
