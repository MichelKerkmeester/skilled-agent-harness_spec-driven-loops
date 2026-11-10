---
title: "Feature Specification: Phase 15: lane-rules-as-heal-modes"
description: "Automate the deterministic lane rules (anchor wrap, link repoint, continuity placeholders, level from spec, header add) as heal modes with derivability checks."
trigger_phrases:
  - "lane rules as heal modes"
  - "phase 15 lane rules as heal modes"
  - "automate lane rules"
  - "deterministic repair rules"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 15: lane-rules-as-heal-modes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-08 |
| **Branch** | `worktrees/091-consolidate-small-packets` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-gate-3-menu-parity |
| **Successor** | 016-phrase-cleanup-hardening |
| **Handoff Criteria** | Each automated rule has a derivability check, a second run changes nothing, and tests cover all five rules and their refusal cases |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the Research recommendations specification.

**Scope Boundary**: `heal-spec-docs.cjs`, `upgrade-legacy.mjs`, and their test suites. Lane rules 3 and 7 stay reported (reconstruction and status alignment).

**Dependencies**:
- None. Per parent goal D2, every other phase is independent. Phases SH-05 and SH-06 (healer phrase seeding and evidence-gated provenance) provide context but are not blockers; this phase tests mode derivability independent of prior runs.

**Deliverables**:
- Five new heal modes: anchor-wrap, link-repoint, continuity-placeholders, level-from-spec, header-add.
- Each mode has a "refuse when not derivable" rule and a test that second run changes nothing.
- Both lane rules 3 and 7 (reconstruction and status) stay reported, never automated.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 13's manual repair identified five deterministic rules that apply to many packets: wrapping anchors, repointing links when the target changed, filling continuity placeholders, reading level from the spec when metadata is stale, and adding a missing template header. Each rule was hand-applied to 474 packets. These rules can be automated safely because they either restore known structure or read evidence already in the packet itself. Today they live only in phase 13's lane briefs, so the next corpus-wide repair must hand-apply them again.

### Purpose
Automate these five rules as permanent heal modes, with checks to refuse when the transformation is not derivable.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Five heal modes: anchor-wrap (lane rule 2), link-repoint (lane rule 4), continuity-placeholders (lane rule 6), level-from-spec (lane rule 8), header-add (lane rule 9).
- Each mode has an exact derivability rule: it acts only when the evidence is present and the transformation is deterministic.
- Each mode has a test that proves a second run changes nothing (idempotence gate).
- All five modes are exposed through `heal-spec-docs.cjs` and integrated into `upgrade-legacy.mjs`.

### Out of Scope
- Lane rule 3 (reconstruction): stays reviewed work, because "Not recorded" and reconstruction are authorial choices.
- Lane rule 7 (status alignment): stays reported, because it changes an authored assertion that only the author can fix.
- Any change to what a document says beyond structure.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Modify | Add five new modes with derivability checks, update inventory and discovery |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Modify | Call new modes in repair sequence, record refusals |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/heal-spec-docs.vitest.ts` (or new file) | Create | Test each mode, its refusal cases, and idempotence |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/README.md` | Modify | Document each new mode and its derivability rule |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the five modes (anchor-wrap, link-repoint, continuity-placeholders, level-from-spec, header-add) has a "refuse when not derivable" rule stated in code |
| REQ-002 | Each mode is tested to show that a second run on an already-fixed packet changes nothing (idempotence) |
| REQ-003 | Lane rules 3 (reconstruction) and 7 (status) stay reported, never automated |
| REQ-004 | Per-folder validation after `upgrade-legacy --apply` is the control for safety |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | All five modes are documented in `heal-spec-docs.cjs` README and listed in `upgrade-legacy` order |
| REQ-006 | The existing test suite passes with no new failure |
| REQ-007 | A corpus run with the new modes records no findings that a second run refutes (no contradictions) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the five modes runs in `upgrade-legacy --apply` flow and skips packets where its derivability rule fails.
- **SC-002**: A second run on a packet fixed by a mode reports zero changes for that mode.
- **SC-003**: The test suite proves both the mode and its refusal with realistic fixtures.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Context | SH-05 and SH-06 (healer honesty) provide background | Med | This phase tests derivability independent of prior runs; modes use only packet-local evidence |
| Risk | A derivability rule is too strict and blocks legitimate repairs | Med | Each rule is derived from phase 13 lane practices; tests validate both positive and negative cases |
| Risk | Touching many documents means validation is the control | Med | Per-folder validation after apply is mandatory; no bulk apply without per-folder check |
| Risk | Archived packets have different structure rules | Med | State one archived behavior or defer to SH-03 archive-policy decision (spec.md:175, plan.md:82) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Phase 14 research named all five rules and phase 13 lane briefs show the exact derivability criteria.
- **Lane rule 7. Decided 2026-10-08 by the operator:** "implementation-summary status follows spec.md" stays reported and is never automated. The research left it to the operator whether a summary's status is a derived fact. It is not: a status line asserts the state of the work, and only its author can make that claim.

<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Each mode refuses to act when its derivability rule fails, never silently skips.
- **NFR-R02**: Refusals are recorded in the baseline so a later reviewer knows the transformation was not attempted.

### Idempotence
- **NFR-Idem01**: A second run on a fixed packet makes zero changes for each mode.
- **NFR-Idem02**: The idempotence gate is tested with a fixture and validated in the corpus.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Anchor wrap with no anchors in the packet: refuse.
- Link repoint with no unique target match: refuse.
- Continuity placeholder in an archived packet: check whether it is safe for archived work (likely refuse).
- Level from spec when spec.md is malformed: refuse and record the unreadable error.
- Header add when the exact anchor match fails: refuse.

### Error Scenarios
- Two links match the repoint target: refuse the ambiguous case.
- Packet is archived and the mode touches only structure: proceed if explicitly allowed.
- Continuity field is partially filled: do not overwrite an authored choice.

### State Transitions
- Packet moves from live to archived: rules that touched it in live state should not touch its archived copy unless the archive has the same defect.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | Five related modes, one tool, shared test suite, one README section |
| Risk | 16/25 | Touches many documents; per-folder validation is the control |
| Research | 4/20 | Phase 13 and Phase 14 defined the five rules exactly |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

