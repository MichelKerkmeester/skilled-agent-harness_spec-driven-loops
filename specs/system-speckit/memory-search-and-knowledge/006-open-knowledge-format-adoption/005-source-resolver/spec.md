---
title: "Feature Specification: Phase 5: source-resolver"
description: "Resolve the existing `[SOURCE:]` tags in research and review docs with an opt-in check for new packets, with no new frontmatter field unless decision D2 asks for one."
trigger_phrases:
  - "source resolver"
  - "resolve the existing source tags in research"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: source-resolver

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
| **Phase** | 5 of 7 |
| **Predecessor** | 004-citation-drift-detection |
| **Successor** | 007-docs-and-closeout |
| **Handoff Criteria** | A warn-only rule resolves tags in new research and review docs and leaves every existing packet green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the R1 R5 R9 adoption across spec-kit and sk-doc specification.

**Scope Boundary**: Research and review artifacts of packets created after a recorded cutoff. Authored spec docs are untouched.

**Dependencies**:
- Phase 004 resolver and its redirect table.
- Phase 002 decisions D2 and D4.

**Deliverables**:
- A warn-only validator rule and its registry entry.
- Rule documentation in `validation-rules.md`.
- Fixture packets with good, stale and invented tags.
- A short note in the deep-research references describing the check.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
About 1,919 files use `[SOURCE:]` tags and 1,186 delta files hold structured `evidence` lists, yet nothing resolves the tags. In phase 001 the child wrote invented timestamps, and a script found five citations that did not resolve. A resolver proves only that a path and line exist, not that the line supports the claim.

### Purpose
Catch missing and stale sources mechanically in new research and review docs, using the habit the repo already has.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A warn-only rule that resolves `[SOURCE:]` tags in `research.md` and iteration files of packets newer than the cutoff.
- Follow the closure-cutoff precedent in `validation-rules.md` for the cutoff.
- State in the output that a pass means the path and line exist, nothing more.
- If D2 chose generated sources, emit a `sources` list from the delta evidence arrays as an optional second increment.
- Keep any new data out of `description.json` and `graph-metadata.json`.
- Keep the citation format the commands teach: `[SOURCE: file.md:lines]` in `/speckit:plan` (`speckit-plan.yaml:621`) and `/speckit:complete` (`speckit-complete.yaml:545`). The rule runs inside the `validate.sh --strict` calls those commands and `/speckit:implement` already make.
- Document the check where `/deep:research` and `/deep:review` writers read their rules, and let `/doctor:deep-loop` report a lineage with unresolved tags.
- Each warning names the tag, the class (gone, moved or past end) and, for a moved file, its new path.

### Out of Scope
- Hand-typed `sources` frontmatter - rejected unless D2 reverses it.
- Retrofitting existing packets - the history is mostly moved files.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json` | Modify | New rule entry |
| `.skilled/skills/system-spec-kit/references/validation/validation-rules.md` | Modify | Rule documentation |
| `.skilled/skills/system-spec-kit/runtime/cli/rules/` new rule file | Create | The resolver rule |
| `.skilled/skills/system-deep-loop/deep-research/references/` | Modify | Note on the check |
| Rule fixtures and tests | Create | Good, stale and invented tags |
| `.skilled/commands/speckit/assets/speckit-plan.yaml`, `speckit-complete.yaml` | Modify | One line naming the check next to the citation format |
| `.skilled/commands/deep/assets/deep-research-auto.yaml`, `deep-research-confirm.yaml`, deep-review assets | Modify | Tell the writer the check exists |
| `.skilled/commands/doctor/assets/doctor-deep-loop.yaml` | Modify | Report unresolved tags per lineage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The rule is warn severity and runs only on packets newer than the recorded cutoff. |
| REQ-002 | A packet with no `[SOURCE:]` tags stays green. |
| REQ-003 | The output says it checks existence and not support. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The rule reuses the phase 004 resolver instead of a second copy. |
| REQ-005 | Generated metadata files are unchanged by the rule. |
| REQ-006 | A fixture with an invented line number produces a warning. |
| REQ-007 | A fresh `/deep:research` fixture lineage with one invented tag produces exactly one warning, naming the tag and its class. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The rule warns on a fixture with a stale tag and stays silent on a clean one.
- **SC-002**: No existing packet changes result.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 resolver | Rule cannot ship | Copy the logic once and record the duplication |
| Risk | Warnings on tags to moved files annoy authors | Med | Report moved as a separate, lower class |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The rule adds no noticeable time to `validate.sh` on one packet.
- **NFR-P02**: The rule reads files only.

### Security
- **NFR-S01**: The rule reads only files inside the repo.
- **NFR-S02**: The rule writes nothing.

### Reliability
- **NFR-R01**: A malformed tag is reported, never a crash.
- **NFR-R02**: A missing optional file is skipped.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A tag with no line number: resolve the file only.
- A tag with a URL: skip, a different check owns it.
- A tag inside a fence: skipped.

### Error Scenarios
- The resolver module is missing: skip the rule and warn once.
- A very large research file: stream it.
- A concurrent edit: read once.

### State Transitions
- A packet without a recorded cutoff: treat as old.
- A rule run during an edit: warn only.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | One rule, registry entry and fixtures |
| Risk | 6/25 | Warn-only and additive |
| Research | 6/20 | Resolver exists in phase 004 |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Where is the cutoff recorded?
- Does D2 add a generated `sources` list, and if so who owns the field?
<!-- /ANCHOR:questions -->

---


