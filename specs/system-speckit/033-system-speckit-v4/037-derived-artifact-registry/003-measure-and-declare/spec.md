---
title: "Feature Specification: Phase 3: measure the residue and declare the unhealable"
description: "The weekly freshness job already runs the repair tool read-only. This phase extends that job with machine-readable counts and a declared list of every document the healer refuses, each with a reason."
trigger_phrases:
  - "residue baseline"
  - "declared unhealable"
  - "weekly freshness report"
  - "refusal census"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 3: measure the residue and declare the unhealable

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

A weekly job already exists. `.github/workflows/strict-pass-freshness-report.yml` runs on the cron `23 4 * * 1` and its derived-repair step already runs `repair-derived.cjs --roots specs` read-only. What it does not produce is a machine-readable residue count, and nothing declares the documents the healer refuses, so every reader re-derives the same conclusion from human text.

This phase extends that job rather than building a second sweep. Both tools gain `--format json`, the job publishes the repairable and refused counts and a declared list at `runtime/cli/lib/unhealable-documents.json` names every unhealable document with its reason. The job stays read-only and reports rather than blocks.

**Key Decisions**: Extend the existing workflow, never add a sweep. Record a measured baseline instead of asserting a clean tree, because a fresh checkout already carries repairable packets. Check the declared list in both directions, so an undeclared refusal and a stale declaration are both visible.

**Critical Dependencies**: The JSON modes have to land before any count can be asserted, because both tools print human text today.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-11 |
| **Branch** | `scaffold/003-measure-and-declare` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 3 |
| **Predecessor** | 002-transactional-remint |
| **Successor** | None |
| **Handoff Criteria** | The weekly job publishes a measured residue count, and every document the healer refuses is declared with a reason or reported as undeclared. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the One registry for every derived artifact, so no artifact owns a private staleness check specification.

**Scope Boundary**: One existing workflow, two existing tools and one new declared list. No new sweep tool and no auto-repair of the residue.

**Dependencies**:
- `.github/workflows/strict-pass-freshness-report.yml`, the weekly job that already runs the repair read-only
- `runtime/cli/spec/repair-derived.cjs` and `runtime/cli/spec/heal-spec-docs.cjs`, the two sources of the counts
- `runtime/cli/lib/validator-registry.json`, the precedent for a declared machine-readable list in that directory

**Sequencing**: This phase's baseline can be captured before 002 lands. The remint change in 002 is measured against this baseline, so the measurement comes first even though the folders are numbered the other way.

**Deliverables**:
- `--format json` on both tools
- `runtime/cli/lib/unhealable-documents.json`, one entry per refused document with its reason
- The workflow extension that consumes both reports and flags undeclared and stale declarations
- A recorded baseline for the repairable residue

**Changelog**:
- This packet keeps no changelog folder. Phase closure is recorded by the parent phase map status.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The weekly job already answers whether the corpus drifted, but it answers in prose. Its derived-repair step prints `inspected=... repairable=... failed=...` and the healer prints `refused=...` with a top-ten table, so neither count can be recorded as an artifact and compared week to week. No one can tell whether the residue is shrinking, and the documents the healer deliberately leaves alone are re-discovered by whoever reads the log next.

A clean tree cannot be the target. A fresh checkout already reports repairable packets under `specs/sk-git` and `specs/hooks`, so any criterion that expects zero on a clean tree is unachievable by construction. What is missing is a measured baseline and a machine-readable delta against it.

### Purpose

The residue has a number, the number is comparable between runs and every document that cannot be auto-repaired is declared with its reason rather than left in a log.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `--format json` on `repair-derived.cjs`, matching its text counts and exit codes
- `--format json` on `heal-spec-docs.cjs`, naming every refused document with its reason
- A declared list at `runtime/cli/lib/unhealable-documents.json`
- An extension to the existing weekly job that publishes the counts and flags an undeclared refusal and a stale declaration
- A recorded residue baseline measured from a run, not asserted

### Out of Scope
- **A second sweep.** The weekly job exists and is extended. A new sweep tool would be a second thing to keep in step.
- **Auto-repairing the residue.** The documents the healer refuses need a person, and this phase declares them rather than fixing them.
- **A clean-tree exit-zero target.** The measured baseline replaces it, because the tree already carries repairable packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `runtime/cli/spec/repair-derived.cjs` | Modify | `--format json` for the corpus walk, same counts and exit codes as text mode |
| `runtime/cli/spec/heal-spec-docs.cjs` | Modify | `--format json` for the refusal census |
| `runtime/cli/lib/unhealable-documents.json` | Create | The declared list, one entry per document with its reason |
| `.github/workflows/strict-pass-freshness-report.yml` | Modify | Consume both reports, publish the counts, flag undeclared and stale declarations, stay read-only |
| `runtime/cli/tests/repair-derived.vitest.ts` | Modify | JSON and text parity cases |
| `runtime/cli/tests/heal-spec-docs.vitest.ts` | Create | Refusal census shape and declaration agreement cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `repair-derived.cjs --format json` prints one parseable report with the same inspected, repairable and failed counts as text mode and the same exit code |
| REQ-002 | `heal-spec-docs.cjs --format json` names every refused document with its reason, and its refusal count matches text mode |
| REQ-003 | The existing weekly job consumes both reports and publishes the residue counts in its artifact and its summary |
| REQ-004 | The declared list names every unhealable document with a reason |
| REQ-005 | The weekly report flags a refusal that is not declared and a declared entry that is no longer refused |
| REQ-006 | The weekly job stays read-only: no `--apply`, and no write to the packet tree |
| REQ-007 | The residue baseline is recorded from a measured run and reproduces on a second run over the same tree |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-900 | The phase exit criterion is verified from the final state |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

**SC-001**: Over one fixture tree, `--format json` and text mode report the same inspected, repairable and failed counts and the same exit code
Red when: the counts disagree or the JSON does not parse, which a second implementation of the reporting path would produce.

**SC-002**: `heal-spec-docs.cjs --format json` lists every refusal with its document path and reason, and the count equals the text mode `refused=` value
Red when: a refusal appears in one mode and not the other, or a JSON entry lacks a reason.

**SC-003**: The weekly job's derived-repair step publishes a repairable count from a run over the current tree, where the count equals the recorded baseline
Red when: the count is absent from the artifact, or the step discards the report on a non-zero exit, which is what a bare `|| true` does today.

**SC-004**: Every document the healer refuses on the current tree is either declared with a reason or reported as undeclared
Red when: a refusal appears in neither the declared list nor the undeclared report.

**SC-005**: A declared entry the healer no longer refuses is reported as stale
Red when: a healed document stays in the declared list without a report.

**SC-006**: The job is read-only, so a run in a scratch worktree leaves `git status --porcelain` byte-identical and the workflow passes no `--apply`
Red when: any tracked file changes or a write flag appears in the step.

**SC-007**: Two runs over one unchanged tree report the same counts
Red when: the counts differ, which ordering or parallelism in the reporting path would produce.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Building a second sweep next to the existing weekly job | High | The scope says extend. A new sweep file appearing in the diff fails review |
| Risk | The JSON mode drifts from the text mode | Med | SC-001 compares both modes on the same fixture in the suite |
| Risk | The declared list goes stale as documents are healed | Med | SC-005 reports a declared entry that is no longer refused |
| Risk | The weekly step keeps swallowing a failure | Med | The step must capture the report before it decides, and its parse check already fails loudly on unreadable output |
| Risk | The added JSON shape breaks other consumers of the tools | Med | The flag is additive, and text mode stays the default |
| Dependency | The weekly job and its cron `23 4 * * 1` | High | The measurement runs there, so the extension keeps its artifact name and step shape |
| Dependency | `runtime/cli/lib/` as the declared-list home | Low | `validator-registry.json` is the existing precedent in that directory |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Emitting JSON adds no second walk, so a run costs what the text run costs plus serialization

### Security
- **NFR-S01**: The weekly job runs with `contents: read`, passes no write flag and writes only its own artifact directory

### Reliability
- **NFR-R01**: The report is deterministic: every list is sorted so two runs over one tree produce identical bytes

---

## 8. EDGE CASES

### Data Boundaries
- Nothing refused: an empty declared list is valid, and the report says zero rather than omitting the section
- One document refused for two reasons: it is one entry carrying both reasons, and the count counts the document once
- A refused document under `z_archive` or `scratch`: those trees are out of scope for the census, matching the discovery rules both tools already use

### Error Scenarios
- A truncated or unparseable report: the job fails loudly rather than publishing an empty artifact that reads as clean, which is the check the existing step already carries
- The healer cannot run: the job reports the failure and publishes no refusal count rather than reporting zero
- The declared list is missing: the job reports every refusal as undeclared rather than passing

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Files: 4 modified, 2 created, LOC: small, Systems: 1 workflow and 2 tools |
| Risk | 8/25 | Auth: N, API: N, Breaking: N, report-only |
| Research | 8/20 | The two tools' current output shapes and the workflow's step contract |
| Multi-Agent | 4/15 | Workstreams: 1 |
| Coordination | 10/15 | Dependencies: the weekly schedule and the declared list |
| **Total** | **40/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A second sweep appears beside the existing one | H | L | Scope states extend, and the diff is reviewed against the file table |
| R-002 | JSON and text counts diverge | M | M | Parity assertion over one fixture |
| R-003 | The declaration goes stale after a heal | M | M | Stale-declaration report in the opposite direction |
| R-004 | The job publishes an empty report and reads as clean | H | L | The existing parse check fails the step on unreadable output |

---

## 11. USER STORIES

### US-001: Read the residue as a number (Priority: P0)

**As a** repository maintainer, **I want** the weekly job to publish the repairable and refused counts as machine-readable output, **so that** I can compare one week against the next instead of reading prose.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Know what cannot be automatically repaired (Priority: P1)

**As a** maintainer, **I want** one declared list of the documents the healer refuses, each with a reason, **so that** I do not re-discover the same conclusions from a log.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Whether the stored fingerprint should survive at all is deferred to the parent, and this phase's baseline is the measurement that question was waiting on.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See the ADR section in `plan.md`, this packet carries no `decision-record.md`

---

