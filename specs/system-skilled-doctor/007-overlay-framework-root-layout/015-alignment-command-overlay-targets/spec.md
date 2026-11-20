---
title: "Feature Specification: Phase 15: alignment-command overlay targets"
description: "Neither alignment command can reach a vendored project's overlay folder, so its READMEs and the overlay engine docs drift with nothing to audit or fix them. This phase adds an overlay-layout topic to /local-doc-alignment and an overlays target to /local-skilled-alignment, both resolving the folder through .skilled-overlays.json."
trigger_phrases:
  - "alignment command overlay targets"
  - "phase 15 alignment command overlay targets"
  - "overlay layout doc alignment topic"
  - "local skilled alignment overlays target"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: alignment-command overlay targets

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/499-overlay-readmes-and-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-overlay-folder-readmes |
| **Successor** | 016-upstream-code-alignment |
| **Handoff Criteria** | Both commands resolve an overlay folder from `.skilled-overlays.json` with tests, and `route-validate.sh` stays OK |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the overlay framework/root layout packet. It runs in Skilled on the same worktree branch as phase 014 and merges with it.

**Scope Boundary**: the two alignment commands, their assets and their tests. The overlay engine is phase 014's.

**Dependencies**:
- The README contract in `../014-overlay-folder-readmes/scratch/overlay-readme-contract.md`, which says which READMEs an overlay folder carries.

**Deliverables**:
- An `overlay-layout` topic for `/local-doc-alignment`.
- An `overlays` target for `/local-skilled-alignment`.
- Tests for both, and the command docs that list topics and targets.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The operator wants every overlay folder to carry a README and both alignment commands able to audit and fix one. Neither command knows where a vendored project keeps its overlay folder, so the READMEs and the engine docs that describe them have no alignment pass at all.

### Purpose
Either command, run in a vendored project, finds the overlay folder through `.skilled-overlays.json` and audits it, and a project without that file gets a clean answer instead of an error.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ cd /tmp/ovl-gates/private-backup   # copy of the private command assets, taken before this phase
$ rg -n 'overlay' local-doc-alignment/topics.json local-skilled-alignment/surface-map.yaml
local-doc-alignment/topics.json:177:        ".skilled/commands/doctor/assets/doctor-overlay-apply.yaml",
local-doc-alignment/topics.json:178:        ".skilled/commands/doctor/assets/doctor-overlay-repin.yaml",
$ ls local-doc-alignment/tests
ls: local-doc-alignment/tests: No such file or directory
$ git check-ignore -v .skilled/commands/assets/local-doc-alignment/topics.json   # in the Skilled checkout
.gitignore:247:/.skilled/commands/assets/local-*	.skilled/commands/assets/local-doc-alignment/topics.json
```
The only overlay names are two workflow files listed as code roots of the `advisor-vector-refresh` topic. No topic or surface covers an overlay folder, and `/local-doc-alignment` has no test suite. Both commands are private: `.gitignore` lines 246 and 247 ignore `.skilled/commands/local-*` and `.skilled/commands/assets/local-*`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one `overlay-layout` topic to `/local-doc-alignment` that covers an overlay folder's READMEs and the overlay engine docs.
- Add an `overlays` target to `/local-skilled-alignment` that resolves the overlay folder through `.skilled-overlays.json`.
- Test both, and update the command docs that list topics and targets.

### Out of Scope
- A second, separate topic for the overlay layout. No earlier phase planned one: this packet has no phase 013, so there is no plan to amend, and one topic serves both purposes.
- Committing the change. Both commands are gitignored private files, so the change lands in the private copy in the Skilled checkout. The worktree's asset folders are links to it, and a copy taken before the change is kept at `/tmp/ovl-gates/private-backup/`. The tests and the exact change are recorded in `implementation-summary.md`.
- Mirroring the target into Barter's vendored copy of `local-skilled-alignment`. That copy belongs to the ai-speckit session, and the exact change it needs is listed in `implementation-summary.md`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/assets/local-doc-alignment/topics.json` | Modify | The `overlay-layout` topic |
| `.skilled/commands/assets/local-doc-alignment/doc-alignment.cjs` | Modify if needed | Resolve the overlay folder named by `.skilled-overlays.json` |
| `.skilled/commands/assets/local-doc-alignment/tests/doc-alignment-overlay-topic.test.cjs` | Create | Topic tests with and without the config |
| `.skilled/commands/assets/local-skilled-alignment/resolve-scope.cjs`, `surface-map.yaml` | Modify | The `overlays` target |
| `.skilled/commands/assets/local-skilled-alignment/tests/resolve-scope.test.cjs` | Modify | Cases for the `overlays` target |
| `.skilled/commands/local-doc-alignment.md`, `local-skilled-alignment.md` and their assets | Modify | List the new topic and target |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `/local-doc-alignment`'s `overlay-layout` topic lists the overlay folder's READMEs when `.skilled-overlays.json` names one, and only the engine docs when it does not | The new ldoc test file passes with both fixtures |
| REQ-002 | `/local-skilled-alignment`'s `overlays` target resolves the folder from `.skilled-overlays.json` and refuses a path outside the project | The new `resolve-scope.test.cjs` cases pass and `route-validate.sh` prints `OK` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Both command docs and their assets name the new topic and target | `rg -n 'overlay-layout\|overlays' .skilled/commands/local-*-alignment.md` prints a line for each |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/assets/local-skilled-alignment/tests/*.test.cjs` exits 0 with more than 68 tests, and the new ldoc test file exits 0.
- **SC-002**: `bash .skilled/commands/doctor/scripts/route-validate.sh` prints `OK` and exits 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `.skilled-overlays.json` at the vendored tree root | Without it neither command can find the folder | The topic falls back to the engine docs, and the target gives the script's usual empty or refusal answer |
| Risk | A config path that climbs out of the project widens the scope | High | The target refuses it, and a test covers the refusal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. One topic or two? Decision: one `overlay-layout` topic, because no earlier phase planned another.
<!-- /ANCHOR:questions -->

---
