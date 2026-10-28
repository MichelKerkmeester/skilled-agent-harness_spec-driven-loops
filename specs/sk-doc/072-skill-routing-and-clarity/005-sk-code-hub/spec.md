---
title: "Feature Specification: Phase 5: sk-code hub and mode packets"
description: "Bring sk-code and its four packets to the canon shape so a reader reaches the instructions first."
trigger_phrases:
  - "sk-code hub and mode packets"
  - "skill routing phase 5"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: sk-code hub and mode packets

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
| **Phase** | 5 of 11 |
| **Predecessor** | 004-single-vocabulary-source |
| **Successor** | 006-sk-doc-hub |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

**Scope Boundary**: the files listed under Files to Change. Anything else is a later phase or out of scope.

**Dependencies**:
- Phase 003 canon and phase 004 vocabulary

**Deliverables**:
- The changes in scope, and the gate output that proves them.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Routing prose fills 37 to 54 percent of the sk-code mode `SKILL.md` files, and three of its documents each claim a different routing authority. The review packet carries about 280 lines of resolver pseudocode before its first check.

### Purpose
Bring sk-code and its four packets to the canon shape so a reader reaches the instructions first.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git -c core.fsmonitor=false show 782195b82b^:.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json \
    | python3 -c "import json,sys;d=json.load(sys.stdin);[print(k, json.dumps(d['debt'][k])) for k in d['debt'] if k.startswith('sk-code')]"
sk-code {"lines": 67, "words": 787, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-code/sk-code-quality {"lines": 102, "words": 1760, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-code/sk-code-review {"lines": 312, "words": 2104, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-code/sk-code-skilled {"lines": 118, "words": 327, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}

$ git -c core.fsmonitor=false show 782195b82b^:.skilled/skills/sk-code/sk-code-review/SKILL.md \
    | python3 -c "import sys;print(len(sys.stdin.read().split()))"
5676

$ git -c core.fsmonitor=false show 782195b82b^:.skilled/skills/sk-code/sk-code-review/SKILL.md | grep -n '^## 3. HOW IT WORKS'
415:## 3. HOW IT WORKS
```
The ledger's four entries are the debt this phase closes: each section is over both the 12-line and 180-word limits and carries a machine block inside SMART ROUTING. Review's 5,676 words sit over the 5,000-word ceiling, and its first instruction starts at line 415. `scratch/baseline.md` holds the full gate set and the three routing-authority claims.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restructure the packets in ascending blast order: quality, ci, skilled, then review.
- Replace the hub `route()` pseudocode with a short statement that points at `compiled-route.cjs`, and re-mint.
- Move review's override algorithm out of the routing section into `review-core.md` or a script.
- Keep the review Extension Floors lines byte-identical, or update `check-rule-copies.js` in the same change.

### Out of Scope
- Prose-only edits outside routing - phase 010

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/SKILL.md` | Modify | Short routing statement |
| `.skilled/skills/sk-code/sk-code-*/SKILL.md` | Modify | Canon packet shape |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `verify-router-sync.cjs`, `package_skill.py --strict`, `check-rule-copies.js` and `compiled-route-guard.cjs` pass after each packet. |
| REQ-002 | Each packet's first instruction appears before its machine-router appendix. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | One document names the routing authority, and the other two point at it. |
| REQ-004 | Generate `ROUTER.md` section 2 from section 9, or replace section 2's keyword table with prose pointing to section 9, and remove the stale `testing` boost. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All four sk-code gates pass after the last packet.
- **SC-002**: `rg -n 'authoritative routing source'` finds no conflicting claim in sk-code.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 canon and phase 004 vocabulary | The target shape and vocabulary come from them | Read both phase folders |
| Risk | Review is the largest packet and has pinned lines | Med | Do review last and run `check-rule-copies.js` after every edit |
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
