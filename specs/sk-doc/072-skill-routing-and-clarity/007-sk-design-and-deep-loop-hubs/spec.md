---
title: "Feature Specification: Phase 7: sk-design and system-deep-loop hubs"
description: "Bring both hubs and their packets to the canon shape."
trigger_phrases:
  - "sk-design and system-deep-loop hubs"
  - "skill routing phase 7"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: sk-design and system-deep-loop hubs

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
| **Branch** | `worktrees/254-skill-routing-and-clarity` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 11 |
| **Predecessor** | 006-sk-doc-hub |
| **Successor** | 008-cli-and-mcp-hubs |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- Phases 003 and 004

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
sk-design and system-deep-loop restate their mode choice in hub `route()` pseudocode, and the no-match outcome carries a different name in each hub. Some of their packets carry machine blocks the hub `ROUTER.md` already covers.

### Purpose
Bring both hubs and their packets to the canon shape.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git -c core.fsmonitor=false show HEAD:.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json \
    | python3 -c "import json,sys;d=json.load(sys.stdin);ks=[k for k in d['debt'] if k in ('sk-design','system-deep-loop') or k.startswith(('sk-design/','system-deep-loop/'))];print(len(ks),'entries');[print(k, json.dumps(d['debt'][k])) for k in ks]"
9 entries
sk-design {"lines": 88, "words": 901, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-design/sk-design-chart {"lines": 44, "words": 297, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-design/sk-design-diagram {"lines": 81, "words": 617, "machineBlocks": 0, "codes": ["RS-001"]}
sk-design/sk-design-fundamentals {"lines": 164, "words": 902, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-design/sk-design-md-generator {"lines": 145, "words": 1183, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
system-deep-loop {"lines": 38, "words": 974, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
system-deep-loop/deep-ai-council {"lines": 168, "words": 911, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
system-deep-loop/deep-research {"lines": 157, "words": 842, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
system-deep-loop/deep-review {"lines": 163, "words": 723, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
```
The ledger's nine entries are the debt this phase closes: both hubs and all seven packets, each routing section between 38 and 168 lines and every one of them over the old limits. The spec's own problem statement had the no-match name as live work, and the baseline found it already done: the two hubs and the seven packets name it `UNKNOWN_FALLBACK` only, so that requirement is recorded as met rather than changed (`scratch/before.md` §4). `scratch/before.md` holds the full gate set: 38 of 38 exit 0, accuracy 155/195, 49/66, 19/24.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the canon packet shape to the sk-design and system-deep-loop packets.
- Replace each hub's `route()` pseudocode with a short pointer to the compiled router and re-mint.
- Use the no-match name phase 003 picked.

### Out of Scope
- Deep-loop runtime behavior

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-design/` | Modify | Hub and packets |
| `.skilled/skills/system-deep-loop/` | Modify | Hub and packets |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `parent-skill-check.cjs`, `package_skill.py --strict` and `compiled-route-guard.cjs` pass for both hubs. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Both hubs use the one no-match name. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both hubs' gates pass.
- **SC-002**: The guard reports both hubs fresh.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phases 003 and 004 | Shape and vocabulary | Read both phase folders |
| Risk | system-deep-loop's SKILL.md is read by running loops | Med | Change it when no loop is running and re-mint at once |
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
| Risk | 10/25 | Medium blast radius |
| Research | 4/20 | Phase 001 settled the design |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking planning. Open research questions that bear on this phase are in `../001-deep-research/research/research.md` §12.
<!-- /ANCHOR:questions -->

---
