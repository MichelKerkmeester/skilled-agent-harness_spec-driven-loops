---
title: "Feature Specification: Phase 4: Single vocabulary source per hub"
description: "Give each hub one authored vocabulary and make every other copy generated or checked against it."
trigger_phrases:
  - "single vocabulary source per hub"
  - "skill routing phase 4"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: Single vocabulary source per hub

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-28 |
| **Branch** | `worktrees/257-single-vocabulary-source` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 11 |
| **Predecessor** | 003-routing-canon-and-tooling |
| **Successor** | 005-sk-code-hub |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- Phase 003 canon

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each hub writes its mode vocabulary in several places that nothing generates from one another: `hub-router.json` classes, `mode-registry.json` aliases, `ROUTER.md` `INTENT_SIGNALS` and packet `Keyword triggers:` lines. sk-doc names the `Keyword triggers:` lines as the source of truth, but no code reads them.

### Purpose
Give each hub one authored vocabulary and make every other copy generated or checked against it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs   # at 87e43b5dc0, before any edit
DRIFT cli-classifier               alias=0 stage-two=13 triggers=0
DRIFT cli-external-orchestration   alias=0 stage-two=36 triggers=0
DRIFT mcp-tooling                  alias=0 stage-two=62 triggers=0
DRIFT sk-code                      alias=0 stage-two=90 triggers=10
DRIFT sk-design                    alias=0 stage-two=44 triggers=15
DRIFT sk-doc                       alias=0 stage-two=73 triggers=19
DRIFT system-deep-loop             alias=0 stage-two=13 triggers=0
checked=7 hub(s), drift=375
RESULT: FAILED

$ node .skilled/bin/compiled-route.cjs --hub sk-doc --prompt "make a docx diff of these"
{"hubId":"sk-doc","action":"defer","selectionKind":null,"targets":[],...}
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Make `hub-router.json` the authored mode vocabulary, and generate or check the registry aliases and `ROUTER.md` keywords against it.
- Decide sk-doc's `Keyword triggers:` authority: generate the lines from the JSON, or generate the JSON from the lines, and remove the claim that does not hold.
- Add a check that `graph-metadata.json` covers every advertised `ROUTER.md` phrase.
- Re-mint every compiled route the change touches.

### Out of Scope
- Prose rewrites - phase 010
- Per-hub structure changes - phases 005 to 008

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/*/hub-router.json` | Modify | Authored vocabulary |
| `.skilled/skills/*/mode-registry.json` | Modify | Generated or checked aliases |
| `.skilled/skills/*/ROUTER.md` | Modify | Generated or checked keywords |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For every hub, one file is named the authored vocabulary and a check fails when a copy disagrees with it. |
| REQ-002 | `compiled-route-guard.cjs --json` reports every hub fresh after the change. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | The router-reach doctor workflow reports no new WRONG-HUB or OUTRANKED phrase against the phase 002 baseline. |
| REQ-004 | The drift phase 002 counted is closed: the 62 mcp-tooling and 36 cli-external-orchestration stage-one terms with no stage-two intent, and the 17 sk-doc `Keyword triggers:` terms no mode routes. Each term is carried into the other copy or removed from the hub. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The new check fails on a deliberately broken copy and passes on the real files.
- **SC-002**: The compiled-route guard reports 7 of 7 hubs fresh.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 canon | The shape of the generated sections comes from it | Read `../003-routing-canon-and-tooling/` |
| Risk | Alias churn changes live routing | High | Compare router-reach output with the baseline and re-mint before commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: documentation and tooling changes with no service to measure.

### Security
- **NFR-S01**: No change names an operator-local surface in a tracked file.

### Reliability
- **NFR-R01**: Every gate this phase touches passes at least as well as in the phase 002 baseline.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a skill with no routing section is left as it is and recorded.
- Maximum input: the largest file in scope is changed last, after the shape is proven on smaller ones.
- Failure path: a gate that gets worse blocks the next file until it is fixed or the change is reverted.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | See Files to Change |
| Risk | 14/25 | High blast radius |
| Research | 4/20 | Phase 001 settled the design |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking planning. Open research questions that bear on this phase are in `../001-deep-research/research/research.md` §12.
<!-- /ANCHOR:questions -->

---
