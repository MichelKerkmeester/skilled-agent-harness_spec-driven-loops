---
title: "Feature Specification: cli hub doc version reconciliation"
description: "[What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: cli hub doc version reconciliation

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | [P0/P1/P2] |
| **Status** | Complete |
| **Created** | 2026-09-09 |
| **Branch** | `scaffold/054-cli-hub-doc-version-reconciliation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The `cli-external-orchestration` hub carries 363 versioned docs. 350 of them declared an `X.Y`
version era that did not match their own skill: playbook rows and references sat at `1.0.0.0` or
`1.1.0.x` while their owning `SKILL.md` had moved to `1.4.5.0`, `1.5.0.0` or `1.9.0.0`. A reader
checking which era a doc belonged to was told the wrong answer.

This is distinct from build-segment drift. The `X.Y` pair is human-curated and moves only on
changelog cadence, so a wrong era stays wrong until someone fixes it. The `W` build segment is a
per-file commit count that goes stale on every edit; the versioning contract calls that expected
and explicitly tells readers not to chase it.

### Purpose

Every doc in the hub declares the era of the skill it belongs to.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 363 versioned docs under `.opencode/skills/cli-external-orchestration/`, reconciled by
  `frontmatter-version.mjs apply`.

### Out of Scope

- **Every other skill.** The contract permits reconciling *a* skill and forbids a fleet sweep.
- **The `W` build segment as a target.** It is recomputed by the same run, and the commit that
  writes it makes it stale again. That is accepted, not fixed.
- **Promoting `verify` to a gate.** `gate` stays the enforced check.
- **Any doc content.** Only the `version:` field changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/cli-external-orchestration/**` | Modify | 355 `version:` fields, by generator |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every doc's `X.Y` matches its owning skill's anchor |
| REQ-002 | The enforced `gate` check stays green |
| REQ-003 | No document content changes; only `version:` fields |
| REQ-004 | The concurrent session's files are untouched |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The run is a single pass; no `--amend` second pass on a shared pushed branch |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `verify` reports zero `X.Y` era mismatches for the hub.
- **SC-002**: `gate` reports 363/363 ok.
- **SC-003**: The commit diff contains only `version:` lines.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A 355-file sweep buries a real change | Medium | Diff asserted to be `version:` lines only, 710 of 710 |
| Risk | Sweeping a concurrent session's work into the commit | High | Commit is path-scoped to the hub; that hub had zero dirty files |
| Risk | `--amend` second pass rewrites a pushed commit | High | Second pass deliberately skipped; residual `W` drift accepted |
| Risk | Treating this as licence for a fleet sweep | Medium | Scope names one skill; the contract's prohibition is quoted in the decisions |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Whether to reconcile at all was decided by the operator after an independent review.
<!-- /ANCHOR:questions -->

---


