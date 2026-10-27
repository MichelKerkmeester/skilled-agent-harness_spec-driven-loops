---
title: "Feature Specification: Phase 25: deprecate-nested-changelogs"
description: "Every spec folder that closes through /speckit:implement or /speckit:complete gets a packet changelog that repeats implementation-summary.md, and create.sh tells every phase to keep one. Release notes belong only in .skilled/changelog/ and the skills' own changelog/ folders, so this phase stops writing packet changelogs."
trigger_phrases:
  - "deprecate nested changelogs"
  - "phase 25 deprecate nested changelogs"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 25: deprecate-nested-changelogs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 25 |
| **Predecessor** | 024-typed-command-ambiguity |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of packet 054. It removes one more document a model has to write and keep current.

**Scope Boundary**: the workflows, the scaffold and the docs that create or describe changelogs inside spec folders. Component changelogs under `.skilled/changelog/` and each skill's own `changelog/` folder, hub member links included, do not change.

**Dependencies**:
- The nested generator `runtime/cli/spec-folder/nested-changelog.ts` and its callers in the speckit and create-changelog workflows.

**Deliverables**:
- No workflow or scaffold writes a packet changelog, `/create:changelog` writes component entries only, and the docs say so.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`/speckit:implement` and `/speckit:complete` run `nested-changelog.js --write` when a packet closes, and `create.sh` writes a "refresh the matching file in ../changelog/" line into every phase child. The result is a second summary of `implementation-summary.md` in 64 spec folders, which a model has to write and keep in step, while the release notes a reader uses live in `.skilled/changelog/`.

### Purpose
Changelogs live only in `.skilled/changelog/` and in the skills' own `changelog/` folders, and nothing creates a new one inside a spec folder.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ find specs -path "*/changelog/changelog-*.md" -not -path "*/z_archive/*" | wc -l
      64
$ rg -c "nested-changelog.js" .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml
.skilled/commands/speckit/assets/speckit-implement.yaml:1
.skilled/commands/speckit/assets/speckit-complete.yaml:2
$ rg -n "refresh the matching file in" .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh
1977:- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the packet-changelog step from `/speckit:implement` and `/speckit:complete` and their presentation text.
- Remove the changelog line from the phase context `create.sh` writes.
- Make `/create:changelog` write global component entries only: a spec-folder source resolves to a component, and `--nested` is refused with a notice.
- Keep `nested-changelog.js` working for the existing files, and make it print a deprecation notice.
- Mark nested mode deprecated across sk-create-changelog, the sk-doc hub metadata and the system-spec-kit docs.

### Out of Scope
- Deleting the 64 existing packet changelogs - the operator chose to keep them as history.
- Deleting the generator, its templates or the validator's nested checks - existing files must still validate.
- Component changelogs and hub member links under `.skilled/changelog/` - they are the release record that stays.
- Test fixtures, generated indexes and benchmark reports that quote the old text - they record past runs.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-{implement,complete}.yaml` and their `-presentation.txt` | Modify | Drop the packet-changelog step and artifact lines |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` | Modify | Drop the phase-context changelog line |
| `.skilled/commands/create/changelog.md`, `assets/create-changelog-{auto,confirm}.yaml`, `create-changelog-presentation.txt` | Modify | Global mode only; refuse `--nested` |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` and its vitest | Modify | Print a deprecation notice on stderr |
| `.skilled/skills/sk-doc/sk-create-changelog/**`, `sk-doc/{SKILL.md,hub-router.json,mode-registry.json,command-metadata.json}` | Modify | Global-only contract, nested mode marked deprecated |
| system-spec-kit `SKILL.md`, `README.md`, `references/**`, `templates/**/README.md`, `CONTRACT.md`, feature catalog, playbook | Modify | Say packet changelogs are deprecated |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg -n "nested-changelog" .skilled/commands/speckit/assets/` prints nothing, so neither closing workflow writes a packet changelog. |
| REQ-002 | A phase child scaffolded by `create.sh --phase` has no `**Changelog**:` line in its `spec.md`. |
| REQ-003 | The `/create:changelog` workflows resolve a spec-folder source to a global component entry, and a `--nested` request stops with a notice that names `.skilled/changelog/`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | `nested-changelog.js` still renders and writes, and prints a deprecation notice on stderr that a test pins. |
| REQ-005 | No live doc in sk-doc or system-spec-kit tells a reader to write a packet changelog. Each place that describes the generator calls it deprecated. |
| REQ-006 | The 64 existing packet changelogs are untouched and still validate. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The two speckit workflows and the phase scaffold contain no packet-changelog step or line.
- **SC-002**: The system-spec-kit CLI suite and the sk-doc changelog checks show no new failure.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Scaffold golden snapshots | A phase snapshot may hold the removed line | Regenerate the snapshot and read the diff |
| Risk | A doc still teaches nested mode | Med | Close with an `rg` sweep over sk-doc and system-spec-kit, with fixtures and reports excluded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: the change removes steps and adds one stderr line, with no measurable cost.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a packet with no `changelog/` folder closes without one, as every packet now does.
- Maximum input: a phase parent with 25 children closes without writing any of the 25 files.
- Failure path: `/create:changelog --nested` stops before writing and names the global path to use.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | About 35 files across two commands, one script, one generator and docs |
| Risk | 6/25 | Removes a step; existing files and the generator stay |
| Research | 2/20 | Callers listed by `rg` |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. On 2026-10-27 the operator chose to stop generating packet changelogs, keep the generator with a notice and keep the existing files.
<!-- /ANCHOR:questions -->
