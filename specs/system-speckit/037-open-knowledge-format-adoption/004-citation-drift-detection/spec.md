---
title: "Feature Specification: Phase 4: citation-drift-detection"
description: "Extend the existing citation scanner to spec and research docs and split broken citations into moved, gone and past-end."
trigger_phrases:
  - "citation drift detection"
  - "extend the existing citation scanner to spec"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: citation-drift-detection

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `worktrees/086-okf-adoption-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 7 |
| **Predecessor** | 003-context-type-unification |
| **Successor** | 005-source-resolver |
| **Handoff Criteria** | A census covers both doc families, moved is separated from gone. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: Reporting only. No validator rule, no new citation form and no edit to any citing doc.

**Dependencies**:
- Phase 002 decisions D3 and D4 and the larger labeled sample.

**Deliverables**:
- A corpus option on `cite-drift-scan.mjs` that reads spec and research docs.
- A redirect table for known moves, so a moved file is not reported as wrong content.
- A published census with the commit it ran on.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`cite-drift-scan.mjs` reads tracked skill docs only. A rough scan of research and iteration docs found about 19,500 `[SOURCE:]` tags with a repo path and line, about 12,000 pointing at missing files, mostly from folder moves such as `.opencode/` to `.skilled/`, and 63 past the end of an existing file. Silent drift, where a line still exists but no longer shows the claim, has only been measured on 20 skill-doc citations, where 8 contradicted and 3 partly supported.

### Purpose
An honest census of citation breakage across both doc families that tells a moved file from a wrong claim.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A corpus option so the scanner reads spec packets and research artifacts.
- A redirect table for known relocations, checked against the git rename record.
- Keep the default run at zero model calls, no credential and no file written.
- Run the labeled-sample arm on the enlarged sample from phase 002.
- Publish counts per doc family with the commit hash.
- Report a basename-only match as its own class instead of a success.
- Add a read-only citation-drift summary to `/doctor:speckit` that runs the scanner's default zero-model mode and names the moved-to path for each moved citation.

### Out of Scope
- A validator rule - phase 005 and 006 decide that.
- Editing any doc that holds a broken citation - reporting only.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Modify | Corpus option and the moved class |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl` | Modify | Enlarged labels, or a sibling file |
| `.skilled/skills/sk-doc/shared/scripts/README.md` | Modify | Document the new option |
| `.skilled/skills/sk-doc/shared/scripts/` tests | Create | Scanner fixtures |
| `.skilled/commands/doctor/assets/doctor-speckit-retrieval.yaml`, `.skilled/commands/doctor/speckit.md` | Modify | Read-only citation-drift summary |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The default run stays zero-model, reads no credential and writes no file. |
| REQ-002 | A moved file and a deleted file are reported as different classes, reproducibly. |
| REQ-003 | The census states the commit it ran on. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The corpus option covers spec packets and research artifacts. |
| REQ-005 | Each published number is split by doc family. |
| REQ-006 | A threshold proposal for phase 006 is written before the final census is read. Superseded: phase 006 was removed (decision-record.md ADR-001). |
| REQ-007 | `/doctor:speckit` shows the drift summary per doc family, makes no model call and writes only its own report. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The census reproduces from its recorded command.
- **SC-002**: Broken citations are split into moved, gone and past-end.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Scan time over three minutes | Slow feedback | Cache the file line counts and record the run time |
| Risk | The redirect table misclassifies a file | Med | Check each entry against the git rename record and sample by hand |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: A full census finishes in a time the phase records, with caching.
- **NFR-P02**: The default run makes no model call.

### Security
- **NFR-S01**: No credential is read in the default run.
- **NFR-S02**: The default run writes no file.

### Reliability
- **NFR-R01**: A run that fails prints the reason and writes nothing.
- **NFR-R02**: The same commit gives the same counts.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A citation inside a code fence: skipped, as the scanner does today.
- A path with no extension match: counted as ambiguous.
- A line range: use its end line for the past-end test.

### Error Scenarios
- A repo with a missing doc root: refuse before scanning.
- The model backend is unreachable in the labeled arm: skip that arm and say so.
- A concurrent commit changes a file: the census records its starting commit.

### State Transitions
- A partial scan: rerun, it keeps no state.
- A killed run: nothing is left behind to clean.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One script and its tests |
| Risk | 5/25 | Read-only |
| Research | 10/20 | Moves versus wrong claims |
| **Total** | **23/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does a spec-kit validator call a script that lives in `sk-doc`, or is the resolver copied?
- How is a file that moved twice recorded?
<!-- /ANCHOR:questions -->

---


