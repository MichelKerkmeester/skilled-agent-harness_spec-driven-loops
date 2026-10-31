---
title: "Feature Specification: Phase 9: Standalone skills"
description: "Give each standalone skill a short inline router, with the machine block last and the leaf manifest generated."
trigger_phrases:
  - "standalone skills"
  - "skill routing phase 9"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/072-skill-routing-and-clarity/009-standalone-skills"
    last_updated_at: "2026-10-28T15:45:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Phase 009 closed: six standalone skills at the canon shape"
    next_safe_action: "Conductor landing"
    blockers: []
    key_files:
      - "scratch/before.md"
      - "scratch/after.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "skill-routing-and-clarity-phase-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Did the phase need code, or could an edit to a JSON file keep hooks/ to Markdown? Code. The standalone path in generate-leaf-manifest.cjs never read leaf-scopes.json, so the generator gained the hub's scope reader plus a containment check."
      - "Did sk-git keep its router body and still fit the 5,000-word cap? Yes. The review found the body had been replaced by a pointer, it was restored, and three prose subsections now point at their references so the file lands at 4,896 words."
      - "Was sk-vision restructured with the other six? No. Another session is deprecating it, so its ledger entry and its manifest are unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: Standalone skills

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
| **Phase** | 9 of 11 |
| **Predecessor** | 008-cli-and-mcp-hubs |
| **Successor** | 010-prose-clarity-pass |
| **Handoff Criteria** | Every P0 requirement below is met and `validate.sh --strict` passes for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the skill routing and clarity program. Its plan comes from the phase 001 research at `../001-deep-research/research/research.md`.

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
The seven standalone skills keep their whole router inline, and routing fills up to 60 percent of system-spec-kit and system-skill-advisor. The class contract forbids hub files for them, so the hub shape does not apply.

### Purpose
Give each standalone skill a short inline router, with the machine block last and the leaf manifest generated.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git -c core.fsmonitor=false show HEAD:.skilled/skills/sk-doc/sk-create-skill/scripts/routing-shape-known-debt.json \
    | python3 -c "import json,sys;d=json.load(sys.stdin);ks=[k for k in d['debt'] if k in ('cli-orca','mcp-code-mode','sk-git','sk-prompt','system-skill-advisor','system-spec-kit')];print(len(ks),'entries');[print(k, json.dumps(d['debt'][k])) for k in ks]"
6 entries
cli-orca {"lines": 103, "words": 714, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
mcp-code-mode {"lines": 129, "words": 773, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-git {"lines": 135, "words": 639, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
sk-prompt {"lines": 174, "words": 1019, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
system-skill-advisor {"lines": 226, "words": 1987, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
system-spec-kit {"lines": 312, "words": 1712, "machineBlocks": 1, "codes": ["RS-001", "RS-002"]}
```
The ledger's six entries are the debt this phase closes: one per standalone skill, each routing section between 103 and 312 lines and between 639 and 1,987 words against a canon that allows 12 lines and 180 words. `sk-vision` carries a seventh entry and stays on the ledger, because another session is deprecating that skill, so this phase leaves it alone.

One requirement could not be met by editing JSON. The standalone path in `generate-leaf-manifest.cjs` walked every configured leaf root and never read `leaf-scopes.json`, so `system-skill-advisor`'s `hooks/` root handed the router nine `.ts`, `.py` and `.json` files. The generator now reads the same scopes file the hub path reads, and a scope outside a declared leaf root fails closed. `scratch/before.md` holds the full gate set at the baseline: 39 of 39 exit 0, accuracy 155/195, 49/66 and 19/24, and both facts above measured on the files.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply the standalone shape to cli-orca, mcp-code-mode, sk-git, sk-prompt, system-skill-advisor and system-spec-kit.
- Shrink the Python block where it does not choose among leaves.
- Limit system-skill-advisor's `hooks/` leaf root to `*.md` through standalone leaf scopes or an extension filter, then regenerate the manifests and aliases. The standalone path in `generate-leaf-manifest.cjs` does not read `leaf-scopes.json` today, so this requires code.
- Regenerate each skill's `leaf-manifest.json` and `leaf-aliases.json`.

### Out of Scope
- Hub files for standalone skills - the class contract forbids them
- sk-vision - another session is deprecating it, so restructuring it would be wasted work

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/<standalone>/SKILL.md` | Modify | Short router, block last |
| `.skilled/skills/<standalone>/leaf-manifest.json` | Modify | Regenerated |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` | Modify | Support the standalone hooks filter or leaf scopes |
| `.skilled/skills/<standalone>/leaf-aliases.json` | Modify | Regenerated |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `package_skill.py --strict` and `generate-leaf-manifest.cjs --check` pass for each skill. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Each skill's first instruction appears before its machine block. |
| REQ-003 | Limit system-skill-advisor `hooks/` leaves to `*.md` through standalone leaf scopes or an extension filter, and regenerate its manifest and aliases. The standalone generator path does not currently read `leaf-scopes.json`, so code must change. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both checks pass for all seven skills.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 canon | Standalone template | Read `../003-routing-canon-and-tooling/` |
| Risk | system-spec-kit is read by every session | Med | Change it last and run its own test suite |
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
| Risk | 6/25 | Low blast radius |
| Research | 4/20 | Phase 001 settled the design |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking planning. Open research questions that bear on this phase are in `../001-deep-research/research/research.md` §12.
<!-- /ANCHOR:questions -->

---
