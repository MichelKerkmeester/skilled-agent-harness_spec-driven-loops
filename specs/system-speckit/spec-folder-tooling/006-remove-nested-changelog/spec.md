---
title: "Feature Specification: Remove the unused nested spec changelog generator, templates and docs"
description: "The nested spec changelog generator was deprecated and no command calls it, yet its code, test, templates and docs still ship. This packet removes them and keeps the packet changelogs already written."
trigger_phrases:
  - "remove nested changelog"
  - "remove the unused nested spec changelog generator templates"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Remove the unused nested spec changelog generator, templates and docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/401-changelog-voice-rewrite` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
An earlier packet stopped spec folders from getting changelogs. It kept `nested-changelog.js` with a deprecation notice so the existing files could still be rendered. No command calls it now. The generator, its test, its templates and about a dozen docs still ship, and routers still load its workflow reference. A reader or a model can still find it and follow a workflow the project no longer uses.

### Purpose
The deprecated generator and everything that only serves it are gone. The packet changelogs already written stay as history.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/system-speckit/spec-folder-tooling/005-subtrack-proposal-and-archive-reach 2>&1 >/dev/null | head -2
nested-changelog.js is deprecated: spec folders no longer get changelogs. Write release notes with /create:changelog, which writes to .skilled/changelog/.
exit=0

$ rg -l 'nested-changelog' .skilled/commands | wc -l
       0

$ find specs -path '*/z_archive' -prune -o -name 'changelog-*.md' -path '*/changelog/*' -print | wc -l
    1410
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Delete `runtime/cli/spec-folder/nested-changelog.ts`, its built `dist` output, its exports in `spec-folder/index.ts` and its test `tests/nested-changelog.vitest.ts`.
- Delete `templates/changelog/` (`README.md`, `root.md`, `phase.md`) and `references/workflows/nested-changelog.md`.
- Delete the system-spec-kit feature-catalog entry and playbook scenario 458 for the generator, with their rows in `feature-catalog.md` and `manual-testing-playbook.md`. Delete sk-create-changelog playbook scenario CHG-012 with its index block and cross-reference rows. That mode has no feature catalog.
- Remove the generator's rows from `ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json`, `core/spec-root-registry.ts` and the residue allowlist, and from the docs that describe it.
- Reword the deprecated packet-local section of the sk-create-changelog docs to say the generator is removed. The refusal of a nested changelog request stays.

### Out of Scope
- The packet changelogs already written under `specs/` - the operator kept them as history, and this packet keeps that decision.
- The sk-create-changelog refusal route for `nested changelog` requests - it generates nothing and still points a reader to a global entry.
- Released changelogs that mention the generator - they record what shipped then.
- `validate_document.py` support for existing `changelog-*.md` files - the kept files still validate through it.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Delete | The generator |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/index.ts` | Modify | Drop the generator's re-exports |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts` | Delete | The generator's test |
| `.skilled/skills/system-spec-kit/runtime/cli/core/spec-root-registry.ts` | Modify | Drop the generator's consumer row |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/residue-allowlist.json` | Modify | Drop the test file's allowlist row |
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/README.md` | Modify | Drop the generator from the file list and usage |
| `.skilled/skills/system-spec-kit/templates/changelog/` | Delete | The three template files |
| `.skilled/skills/system-spec-kit/references/workflows/nested-changelog.md` | Delete | The workflow reference |
| `.skilled/skills/system-spec-kit/references/workflows/quick-reference.md`, `references/templates/template-guide.md`, `references/validation/validation-rules.md` | Modify | Drop or reword generator text |
| `.skilled/skills/system-spec-kit/ROUTER.md`, `leaf-manifest.json`, `leaf-aliases.json`, `README.md` | Modify | Drop the leaf and the template pointer |
| `.skilled/skills/system-spec-kit/feature-catalog/` and `manual-testing-playbook/` generator entries and index rows | Delete and Modify | Retire the feature entry and scenario 458 |
| `.skilled/skills/sk-doc/sk-create-changelog/` SKILL, README, ROUTER, template section 7, references and the `render-nested-identity-phrase.md` scenario | Modify and Delete | Say the generator is removed and drop its scenario |
| `.skilled/skills/system-spec-kit/templates/README.md`, `templates/CONTRACT.md` | Modify | Drop the `changelog/` folder from the tree and the contract |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json`, `baseline-readme-verdicts.json` | Modify | Drop the `templates/changelog` directory and README entries, regenerated with the manifest's `--write` path |
| Local `runtime/cli/dist/spec-folder/nested-changelog.*` | Delete | Gitignored build output. A rebuild alone leaves it, and the source-dist alignment check reports an orphan |
| Each changed skill's `changelog/` and version files | Create and Modify | One release entry per changed skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `rg -l -i 'nested-changelog' .skilled --glob '!**/changelog/v*' --glob '!**/fixtures/**' --glob '!**/trigger-index.json' --glob '!**/benchmark/reports/**'` lists no file except the refusal text in sk-create-changelog. |
| REQ-002 | The system-spec-kit CLI builds with `npm run build` in `runtime/cli`, and its vitest project passes with the same counts as before minus the deleted test file. |
| REQ-003 | `find specs -path '*/z_archive' -prune -o -name 'changelog-*.md' -path '*/changelog/*' -print \| wc -l` still prints 1410. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The routing checks pass after the leaf is removed: `/doctor:skill-advisor` router reach and the system-spec-kit leaf-manifest guard report no missing leaf. |
| REQ-005 | A request for a nested changelog still gets the sk-create-changelog refusal and the offer of a global entry. |
| REQ-006 | Each changed skill carries a release entry that passes `check_changelog_shape.py` and `hvr_scan.py` with 0 hard blockers. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: The REQ-001 search lists only the refusal text, and `ls .skilled/skills/system-spec-kit/templates/changelog` fails.
- **SC-002**: The CLI build and test suite pass, and 1410 packet changelogs remain.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The trigger index and retrieval fixtures name the deleted files | A stale index points at missing files | Rebuild with `generate-trigger-index.mjs` and run the trigger-index tests |
| Risk | An unfound consumer imports a removed export | Med | Build the CLI and run the full vitest project before claiming done |
| Risk | Removing the leaf breaks a router guard or a mirror check | Low | Run `/doctor:skill-advisor` and `/doctor:runtime-mirrors` checks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: The vitest project passes with no new failure against a baseline taken before the deletion.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: N/A, the change deletes code and adds no input.
- Maximum input: the 1410 kept packet changelogs still pass `validate_document.py`, which keeps its `changelog-*.md` rule.
- Failure path: running the removed `nested-changelog.js` fails with Node's module-not-found error, and no command calls it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | About 28 files across two skills, roughly 1,800 lines removed |
| Risk | 8/25 | Removes exports from `spec-folder/index.ts` |
| Research | 4/20 | The earlier deprecation packet mapped the callers |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Does the sk-create-changelog refusal of a nested changelog request stay? Decision: yes, it generates nothing and guides a reader to a global entry. The operator asked to remove the generator logic.
<!-- /ANCHOR:questions -->

---
