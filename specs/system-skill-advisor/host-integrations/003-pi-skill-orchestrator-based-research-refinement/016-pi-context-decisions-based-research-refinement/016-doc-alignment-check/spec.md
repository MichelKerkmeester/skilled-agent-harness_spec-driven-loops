---
title: "Feature Specification: Phase 16: doc-alignment-check"
description: "Run /local-doc-alignment over the live docs that describe the merged advisor change, under a new advisor-pasted-reply topic, and keep its findings report in this phase. Report only: fixing what it finds is a later operator decision."
trigger_phrases:
  - "doc alignment check"
  - "phase 16 doc alignment check"
  - "advisor pasted reply topic"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 16: doc-alignment-check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 16 of 16 |
| **Predecessor** | 015-skilled-alignment-check |
| **Successor** | None |
| **Handoff Criteria** | `evidence/report.md` exists and `tasks.md` has no open task |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 16** of the pi-context-decisions packet. The operator asked for it on 2026-11-19: "Also run /local-skilled-alignment and /local-doc-alignment make that phases".

**Scope Boundary**: One new topic entry in `topics.json` and one `/local-doc-alignment` run on it, report only. No other repository file outside this folder changes.

**Dependencies**:
- The 13 source files phase 002 to 013 changed, which the topic names as its code roots.
- The lane executor the operator picks at the lane checkpoint.

**Deliverables**:
- The `advisor-pasted-reply` topic in `.skilled/commands/assets/local-doc-alignment/topics.json`.
- The run's `report.md`, `findings.json`, `fix-plan.md` and `scope-summary.json`, copied into `evidence/`.
- A triage of the findings in `implementation-summary.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/local-doc-alignment` checks docs only for a topic listed in `topics.json`, and no listed topic covers the skill advisor. The merged change adds the pasted-reply strip, the hook crash fallback and route receipts, yet almost no live doc names them, so stale or missing descriptions go unnoticed.

### Purpose
One doc alignment report names every live doc that misdescribes the merged advisor behavior, so the operator can decide what to fix.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-doc-alignment/doc-alignment.cjs scope --topic advisor-pasted-reply --out "$OUT"
topic advisor-pasted-reply: 15 docs in 4 lanes, 1 checks, code roots 13
STATUS=OK doc-alignment: action=scope topic=advisor-pasted-reply docs=15 lanes=4 checks=1
```
Before the topic entry, the same command stops with `unknown topic`, because `topics.json` listed only `session-handover`, `changelog-spec-folder-line` and `expansive-depth`. A term count over tracked docs outside `specs/` found 0 docs naming `route receipt` or `pasted reply`, 10 naming `skill-advisor-cli-fallback` and 2 naming `outage fallback`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `advisor-pasted-reply` topic: narrow search terms, the 13 changed source files as code roots and the parent criterion 2 vitest suite as its check.
- Run `/local-doc-alignment advisor-pasted-reply` in confirm mode, with the scope and lane checkpoints answered by the operator.
- Copy the run's report files into `evidence/` and triage each finding in `implementation-summary.md`.

### Out of Scope
- Fixing any finding - the operator decides which findings become work.
- `--fix literal` - the operator did not ask for fixes.
- Broad terms such as `pasted` or `receipt` - they match 45 and 75 docs, most about other features.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modify | Add the `advisor-pasted-reply` topic |
| `016-doc-alignment-check/evidence/*` | Create | Copies of the run's report files |
| `016-doc-alignment-check/*.md` | Modify | This phase's own docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The topic loads | `doc-alignment.cjs scope --topic advisor-pasted-reply` prints `STATUS=OK` and `python3 -m json.tool topics.json` exits 0 |
| REQ-002 | The run reaches its report step | `evidence/report.md`, `evidence/findings.json` and `evidence/fix-plan.md` exist |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every finding has a triage | Each finding id in `evidence/findings.json` appears in the triage table of `implementation-summary.md` |
| REQ-004 | No other repository file changes | The run gets no `--fix` flag, and `git status --short -- .skilled` prints nothing, because `.gitignore` keeps `topics.json` and the rest of `.skilled/commands/assets/local-*` out of git |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls evidence` prints `findings.json`, `fix-plan.md`, `report.md` and `scope-summary.json`.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The lane executor's provider | A failed lane leaves its docs unreviewed | The report names each failed lane and the triage says which docs no lane covered |
| Risk | The topic finds docs by term, so a doc that should describe the change but names none of the terms stays out of scope | Med | The critic hunts what the lanes missed, and the triage records any such doc it names |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None that block. The lane preset is asked at the lane checkpoint.
<!-- /ANCHOR:questions -->

---
