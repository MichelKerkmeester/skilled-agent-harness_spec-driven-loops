---
title: "Feature Specification: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index"
description: "[YOUR_VALUE_HERE: What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]"
trigger_phrases:
  - "named subtracks and host repos"
  - "named sub track support in spec kit plus"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Named sub-track support in spec-kit, plus project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | [YOUR_VALUE_HERE: P0/P1/P2] |
| **Status** | Draft |
| **Created** | 2026-11-07 |
| **Branch** | `scaffold/044-named-subtracks-and-host-repos` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
[YOUR_VALUE_HERE: What is broken, missing, or inefficient? 2-3 sentences describing the specific pain point.]

### Purpose
[YOUR_VALUE_HERE: One-sentence outcome statement. What does success look like?]
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
[YOUR_VALUE_HERE: command and its verbatim output]
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- [YOUR_VALUE_HERE: Deliverable 1]
- [YOUR_VALUE_HERE: Deliverable 2]
- [YOUR_VALUE_HERE: Deliverable 3]

### Out of Scope
- [YOUR_VALUE_HERE: Excluded item 1] - [YOUR_VALUE_HERE: why]
- [YOUR_VALUE_HERE: Excluded item 2] - [YOUR_VALUE_HERE: why]

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| [YOUR_VALUE_HERE: path/to/file.js] | [YOUR_VALUE_HERE: Modify/Create/Delete] | [YOUR_VALUE_HERE: Brief description] |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | [YOUR_VALUE_HERE: Requirement description] | [YOUR_VALUE_HERE: How to verify it's done] |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | [YOUR_VALUE_HERE: Requirement description] | [YOUR_VALUE_HERE: How to verify it's done] |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: [YOUR_VALUE_HERE: Primary measurable outcome]
- **SC-002**: [YOUR_VALUE_HERE: Secondary measurable outcome]
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | [YOUR_VALUE_HERE: System/API] | [YOUR_VALUE_HERE: What if blocked] | [YOUR_VALUE_HERE: Fallback plan] |
| Risk | [YOUR_VALUE_HERE: Risk description] | [YOUR_VALUE_HERE: High/Med/Low] | [YOUR_VALUE_HERE: Mitigation strategy] |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- [YOUR_VALUE_HERE: Question 1 requiring clarification]
- [YOUR_VALUE_HERE: Question 2 requiring clarification]
- How should spec-kit support named sub-tracks (specs/<track>/<sub-track>/<NNN>-<slug>/), and how should it handle project-owned doctor entries, the vendored .skilled/specs link and a host-repository trigger index?
- Research Context: deep-research is active for this topic; research/research.md remains canonical.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Abridged from `research/research.md` (3 iterations, 5/5 questions answered):
- Track tooling assumes one level below `specs/` in track roots, refresh, the pre-push sweep, `create.sh` refresh, the validation exemption, recursive validation, archive and parent derivation; recursive discovery and the trigger-index corpus already handle any depth.
- A sub-track should be a declared container: a direct child of a track with no `spec.md`, its own `description.json` and `graph-metadata.json` at a sub-track level, registered in the track's `children_ids`; undeclared folders are reported.
- Open: the graph-metadata container discriminator, the symlinked sub-track policy, and whether any host vendors Skilled without an adjacent `specs/`.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


