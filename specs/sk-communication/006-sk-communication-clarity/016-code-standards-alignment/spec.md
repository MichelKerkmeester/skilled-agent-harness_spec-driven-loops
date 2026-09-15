---
title: "Feature Specification: Phase 16: code standards alignment"
description: "An audit of the code this program added against the OpenCode surface standards and the restraint rule. One documentation gap was real, one suspected dead branch was not, and four candidate cuts were checked and declined."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 16: code standards alignment

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-evidence-rule-seam-links |
| **Successor** | None |
| **Handoff Criteria** | The package gate passes, all six frozen benchmark sides score identically, and every declined cut carries its reason |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This program added code in three places: a causal-direction check in the projection engine, the
reply benchmark's scorer and prompt generator, and two entries with a fixture assertion in the
deep-loop executor allowlists. The operator asked that all of it be checked against the OpenCode
surface standards and against the restraint rule.

An audit is not a licence to rewrite. The value is in what it declines as much as in what it
changes, so every candidate that survived scrutiny is recorded with the reason.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Problem.** Code written across a long program drifts from the standards of the surface it lives
on, and restraint failures are easiest to see after the fact rather than while writing.

**Purpose.** Read every line this program added against the two authorities the operator named, fix
what genuinely misses, and record why the rest stays.

**What the audit found.** One real gap, one wrong hypothesis and four declines. The wrong
hypothesis is the useful part: a branch judged unreachable turned out to carry six of the seven
benchmark cases, and only running the thing proved it.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- A TSDoc block on the one exported function in `semantics.ts` that lacked one.
- A guard in the scorer against a case that keys on retention without naming what it expects.
- A comment recording why the scorer's second input path exists, so the mistake this audit made is not repeated.

**Out of scope**

- The four candidate cuts that were checked and declined, each recorded in the decisions table.
- Code written by other sessions. The audit covered what this program added.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Every exported function added by this program carries TSDoc, matching the file it lives in |
| REQ-002 | No branch is removed on a reachability claim that a run has not confirmed |
| REQ-003 | Each declined cut names the restraint clause that permits it to stay |
| REQ-004 | The package gate passes and every frozen benchmark side scores identically |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `npm run check` passes in the projection package.
- All six frozen benchmark sides rescore to the same weighted means and blocking rows.
- The new guard fails a case set that keys on retention without naming its items, proved by running it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| An audit becomes a rewrite | Four candidates were declined with a clause cited for each, and only two edits shipped |
| A branch is cut on a partial reading | This happened. The cut was made, the scorer failed on all six sides, and the branch was restored with a comment naming why it exists |
| A guard validates what the contract already guarantees | The guard covers external JSON rather than typed input, and it was run against a case set missing the field to confirm it fires |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---


