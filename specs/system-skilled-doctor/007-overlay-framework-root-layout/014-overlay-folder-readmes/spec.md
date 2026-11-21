---
title: "Feature Specification: Phase 14: engine support for overlay folder READMEs"
description: "The overlay engine has no notion of a README in an overlay folder, so a project cannot document its overlay folders without risking that the engine ships or flags the file, and nothing reports a folder that has none. This phase defines which READMEs ship, keeps documentation-only ones out of every engine path, adds an advisory docs leg to status --audit, and refuses a layout-link path listed twice."
trigger_phrases:
  - "overlay folder readmes"
  - "phase 14 overlay folder readmes"
  - "status audit docs leg"
  - "documentation only readme overlay"
  - "layout link listed twice"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 14: engine support for overlay folder READMEs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-20 |
| **Branch** | `worktrees/499-overlay-readmes-and-alignment` |
| **Parent Spec** | ../spec.md |
| **Phase** | 14 of 16 |
| **Predecessor** | 012-review-round-2-fixes |
| **Successor** | 015-alignment-command-overlay-targets |
| **Handoff Criteria** | The engine suite passes with the new README and layout-link tests, the guard suite and the doctor overlay contract pass unchanged, and the README contract the ai-speckit session follows matches the engine |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 14** of the overlay framework/root layout packet. It runs in Skilled, on the worktree branch named above, and merges into local main with phases 015 and 016.

**Scope Boundary**: the overlay engine, its tests and its docs. Barter's own READMEs are written by the ai-speckit session in its packet `specs/skilled-barter-overlays/002-spec-tracks-restructure/040-overlay-docs-and-code-alignment/`.

**Dependencies**:
- The README contract in this phase's `scratch/overlay-readme-contract.md`, which the ai-speckit session reads from the shared scratchpad.
- sk-doc's validator, `.skilled/skills/sk-doc/scripts/validate_document.py`.

**Deliverables**:
- The docs leg of `status --audit`, advisory only.
- The documentation-only README guarantee on every engine command.
- The refusal of a layout-link path listed twice.
- Updated overlay docs and workflows.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An overlay folder holds mirrored content beside the project's own bookkeeping, and the operator wants a `README.md` in every folder of it. The engine has no rule for such a file. A README inside a whole-folder entry ships to the vendored tree, while one in a plain folder is never read. Nothing tells an adopter which is which, and nothing reports a folder that has no README.

Phase 012's review also left one open P2: a layout-link path listed twice can half-apply. When the earlier copy points out of the tree, `apply` writes it, and the write-time check then refuses the nested entry with exit 2.

### Purpose
Every overlay folder can carry a README with a defined role. `status --audit` reports the folders that lack one and the READMEs sk-doc rejects, without changing any adopter's result. A duplicate layout-link path is refused before anything is written.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/doctor/scripts/overlay-engine.cjs status --audit --root barter/ai-speckit/skilled | tail -3   # main at bf6806ad4b3
audit=0
checked=136 ok=114 miss=22
RESULT: FAILED
$ grep -c '^DOCS' <that output>
0
$ find barter/ai-speckit/overlays -type d (without repin-runs, relayout-runs, node_modules) | wc -l ; folders with no README.md
207
176
```
The status run already fails for reasons outside this phase: Barter's overlay folder is being edited by the parallel ai-speckit session. The docs leg must leave that result and its exit code unchanged.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Classify each overlay-folder README as shipping or documentation-only, by the rule in the contract: it ships when it is a manifest entry's source, sits inside a `directory` entry's source, or sits inside a `skill-root` entry's source on a path that `replace` names.
- Add an advisory docs leg to `status --audit`. It walks the overlay folder, reports each folder with no README, and validates every README with sk-doc's own validator.
- Keep a documentation-only README out of apply, adopt, capture, repin staging and every report, for an in-tree and a sibling overlay folder.
- Refuse a manifest that lists one layout-link path twice.
- Update the overlay reference, the doctor overlay presentation and the workflows that read `status`.

### Out of Scope
- Writing Barter's READMEs. That is the ai-speckit session's work in its own packet.
- Failing a status run or a commit over a docs finding. The operator chose "nothing blocks a commit", and an existing adopter with no READMEs must keep its result.
- An opt-in manifest field. A non-failing severity meets the requirement with no new field (see `implementation-summary.md`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/overlay-engine.cjs` | Modify | Docs leg, README classification, adopt refusal where needed, duplicate layout-link refusal |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-readmes.test.cjs` | Create | Red-first and regression tests for every item |
| `.skilled/commands/doctor/scripts/tests/overlay-engine-fixtures.cjs` | Modify | Fixture helpers the new tests need |
| `.skilled/skills/system-skilled-doctor/references/overlays.md` | Modify | README roles, the docs leg and the duplicate refusal |
| `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt` | Modify | The DOCS lines and their reading |
| `.skilled/commands/doctor/overlay.md` and `assets/*.yaml` | Modify | Workflows that read `status --audit` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `status --audit` prints one `DOCS     missing-readme <path>` line per walked folder with no README, a `docs=<n>` count, and a `docs` key under `--json`, exactly as the contract's section 5 states |
| REQ-002 | The docs leg never changes `RESULT:`, the `--json` `result` or the exit code, and it runs when the pin is unavailable |
| REQ-003 | A documentation-only README is never written by apply, taken by adopt, written by capture, placed by `repin --stage`, or named by any status, audit, pre-commit, guard, LAYOUT or relayout output apart from the docs leg |
| REQ-004 | A manifest listing one layout-link path twice, after `./` and trailing slashes are removed, is refused before any write, and `apply` on phase 012's case leaves the tree byte-identical |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | Each README is validated by spawning sk-doc's `validate_document.py --json`. A missing python3 or validator prints one `DOCS     skipped:` line, and the missing-readme findings still print |
| REQ-006 | The walk skips `repin-runs/` and `relayout-runs/` at the folder top, dot folders and `node_modules`, and never follows a link |
| REQ-007 | The overlay reference, the presentation contract and the workflows describe the README roles, the DOCS lines and the duplicate refusal |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` exits 0 with more than 294 tests, and every behavior-change test fails against the engine at `bf6806ad4b3`.
- **SC-002**: `status --audit` on Barter's tree prints DOCS lines, and its `RESULT:` line and exit code match the same run on the engine at `bf6806ad4b3`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | sk-doc's validator and python3 | Without them no README can be validated | Report one skipped line and keep the missing-readme findings |
| Risk | A docs finding flips an adopter from PASSED to FAILED | High | Keep the leg out of `isInSync` and `audit.findings`, and test the unchanged exit |
| Risk | A new README inside a directory entry ships to the vendored tree | Med | The contract says so in its own paragraph, so the ai-speckit session adds those knowingly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The docs leg spawns one validator process per README and runs only under `--audit`, so plain `status` gains no cost.

### Security
- **NFR-S01**: The validator is spawned with an argument array and no shell, so a folder name cannot inject a command.

### Reliability
- **NFR-R01**: The walk never follows a link, so a link cycle or a link out of the folder cannot hang or widen it.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: an overlay folder with no subfolders reports only its own README, or one missing-readme line.
- Maximum input: Barter's 207 folders are walked in sorted order, and each README is validated once.
- Failure path: a missing validator prints `DOCS     skipped: <reason>`, and the status exit code is unchanged.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One engine file, one new test file, four doc files |
| Risk | 12/25 | Status output contract and adopt behavior change for every adopter |
| Research | 8/20 | Every engine path that reads the overlay folder had to be checked |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Opt-in field or non-failing severity? Decision: non-failing severity, recorded in `implementation-summary.md`.
<!-- /ANCHOR:questions -->

---
