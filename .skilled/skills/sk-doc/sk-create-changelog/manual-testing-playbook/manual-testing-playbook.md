---
title: "create-changelog: Manual Testing Playbook"
description: "Operator playbook for the create-changelog workflow across global component entries, packet-local nested entries, version bumps, format selection and release-note preparation."
version: 1.3.0.6
---

# create-changelog: Manual Testing Playbook

This playbook validates the `sk-create-changelog` workflow as an authoring tool. It checks source resolution, global versus nested topology, four-part versioning, canonical format selection and the boundary around release mechanics.

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL` or `SKIP` outcome and reason are recorded into the skill benchmark reports folder. Generated report Markdown is renderer-owned.

## 1. OVERVIEW

The package covers topology, version and format behavior, release boundaries, the Skilled release line and the search metadata every entry carries. Scenarios use the shipped `SKILL.md`, README, template and references as sources. There is no feature catalog for this mode. Each scenario carries the full execution contract in one category file.

The negative checks matter because a changelog can look polished while landing in the wrong place or using the wrong version. A correct run also publishes only on an explicit request for the `skilled` release line.

---

## 2. GLOBAL PRECONDITIONS

1. Run commands from the repository root.
2. Resolve `source_type` before choosing an output path.
3. Discover existing global component folders before selecting one.
4. Treat phase children and existing packet changelog folders as nested topology unless `--nested` makes the choice explicit.
5. Never overwrite an existing changelog file.
6. A `SKIP` verdict is valid only when a named sandbox or runtime blocker prevents the command from running.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- The exact user request and exact operator prompt.
- The source type and source files inspected.
- The output mode and the topology rule that selected it.
- The version inputs, bump choice and collision check when global mode applies.
- The selected template sections and the format decision.
- The exact validation command, output and exit status.
- A `PASS`, `FAIL` or `SKIP` verdict with a reason.

An answer without source evidence does not pass. A global file for a phase child does not pass. A release command that was invented from incomplete source material does not pass.

---

## 4. DETERMINISTIC COMMAND NOTATION

- `bash:` marks a shell command.
- `agent:` marks a read or reasoning step.
- `->` separates sequential steps.
- Paths are repository-relative.
- Commands are read-only unless a scenario names a recovery path.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

For each scenario, confirm that the prompt was used as written, the source topology was inspected, the selected output mode matches the contract and every claim has evidence. A scenario passes only when its output path, version behavior and prose format match the named rule.

The package is releasable when all mapped scenarios pass, global and nested output are not conflated, no existing file is overwritten and no unresolved triage item remains.

---

## 6. ORCHESTRATION AND WAVE PLANNING

Run source and topology scenarios first. Run version and format scenarios after the output mode is known. Run the release boundary and release-line scenarios after those, and the search-metadata scenarios last. Keep global version checks separate from nested checks because nested files do not use global four-part versioning. Record the source, output mode, target path and evidence for each wave.

---

## 7. TOPOLOGY (`CHG-001..CHG-002`)

### CHG-001 | Route a global component changelog

Verify that a component or git-history source routes to an existing global component folder or a hub's link with a unique four-part version.

> **Scenario:** [CHG-001](topology/route-global-component.md)

### CHG-002 | Route a phase child to nested output

Verify that a phase child routes to the packet-local changelog generator and does not receive a global version filename.

> **Scenario:** [CHG-002](topology/route-phase-child-nested.md)

---

## 8. VERSION AND FORMAT (`CHG-003..CHG-005`)

### CHG-003 | Choose the four-part bump

Verify that major, minor, patch and build each map to the documented change type.

> **Scenario:** [CHG-003](version-and-format/choose-four-part-bump.md)

### CHG-004 | Avoid a version collision

Verify that an occupied target version increments the build segment instead of overwriting the file.

> **Scenario:** [CHG-004](version-and-format/avoid-version-collision.md)

### CHG-005 | Select the canonical prose format

Verify compact versus expanded selection and the shared template's category vocabulary.

> **Scenario:** [CHG-005](version-and-format/select-canonical-format.md)

---

## 9. RELEASE AND SOURCE BOUNDARIES (`CHG-006..CHG-007`)

### CHG-006 | Prepare release notes without publishing

Verify that a run without `--release` prepares the changelog body and full-changelog line and runs no tag, push or release command.

> **Scenario:** [CHG-006](release-and-boundaries/prepare-release-notes.md)

### CHG-007 | Pause on an ambiguous component

Verify that an unresolved component match stops before writing a guessed global file.

> **Scenario:** [CHG-007](release-and-boundaries/pause-on-ambiguous-component.md)

---

## 10. RELEASE LINE (`CHG-008..CHG-010`)

### CHG-008 | Route a Skilled release entry to the release line

Verify that naming `skilled` writes a release entry to `.skilled/changelog/skilled/` with a version above every existing entry, generation folders included.

> **Scenario:** [CHG-008](release-line/route-skilled-release-entry.md)

### CHG-009 | Never infer the release line from a changed path

Verify that changed files under a skill resolve to that skill by whole path segment and never to `skilled`.

> **Scenario:** [CHG-009](release-line/never-infer-release-line.md)

### CHG-010 | Skip the release for a component other than skilled

Verify that `--release` on another component keeps the changelog and creates no tag or GitHub release.

> **Scenario:** [CHG-010](release-line/skip-release-for-component.md)

---

## 11. SEARCH METADATA (`CHG-011..CHG-012`)

### CHG-011 | Write search metadata into a global entry

Verify that a global entry opens with the five-key frontmatter block, both identity phrases for its path and a topic phrase from its own words.

> **Scenario:** [CHG-011](search-metadata/write-global-entry-metadata.md)

### CHG-012 | Render the identity phrase into a nested entry

Verify that the nested generator names a packet-local entry by the phrase it derives from the output path and renders no phrase that every packet shares.

> **Scenario:** [CHG-012](search-metadata/render-nested-identity-phrase.md)

---

## 12. AUTOMATED TEST CROSS-REFERENCE

| Check | Coverage | Playbook overlap |
|---|---|---|
| `validate_document.py` | Changelog structure and required prose sections | Direct on CHG-005 |
| `check_authored_name_kebab.py` | Component and phase slug shape | Direct on CHG-001 and CHG-002 |
| `nested-changelog.js` | Packet-local output path and template | Direct on CHG-002 |
| Existing global changelog folders | Version sequencing and collision review | Direct on CHG-001, CHG-004 and CHG-008 |
| `validate_document.py` entry frontmatter check | Entry block, canonical keys, trigger phrases and the version phrase | Direct on CHG-011 |
| `nested-changelog.vitest.ts` | Identity phrase for phase and root renders, and the trim rule | Direct on CHG-012 |

This playbook records changelog authoring behavior and the release step's gates. Branch, commit and pull request work stays with `sk-git`.
