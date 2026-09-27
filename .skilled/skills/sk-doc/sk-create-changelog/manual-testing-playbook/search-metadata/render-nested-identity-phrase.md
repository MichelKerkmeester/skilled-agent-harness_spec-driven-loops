---
title: "CHG-012 -- Render the identity phrase into a nested entry"
description: "This scenario validates nested search metadata for CHG-012. The generator names a packet-local entry by an identity phrase built from its output path and renders no phrase that every packet shares."
version: 1.3.0.0
---

# CHG-012 -- Render the identity phrase into a nested entry

This document captures the operator contract for the identity phrase a packet-local changelog carries.

## 1. OVERVIEW

This scenario validates nested search metadata for `CHG-012`. It focuses on the phrase the generator derives from the output path and on the fixed phrases the templates no longer carry.

### Why This Matters

Packet-local changelogs used to share the same three phrases, so a lookup for any of them returned hundreds of entries in path order and the one a reader wanted rarely made the list. A phrase built from the packet and phase names points at one entry.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `CHG-012` and confirm the rendered frontmatter.

- Objective: a nested entry names itself by the identity phrase the generator derives from its output path
- Realistic user request: `Preview the changelog for this phase before writing it.`
- Prompt: `Render the packet-local changelog for a phase child and for its parent root without writing either, and confirm each trigger phrase names the packet, the phase where there is one, and ends with changelog.`
- Expected execution process: section 4 of `SKILL.md` is read for nested mode, the generator renders a phase child and its parent root without `--write`, and the rendered frontmatter is read.
- Expected signals: the phase render carries one phrase built from the packet and phase words and ending in `changelog`, the root render carries the packet words ending in `changelog`, neither render carries `phase changelog`, `nested changelog`, `phase completion`, `root changelog` or `packet changelog`, and `git status` is unchanged.
- Desired user-visible outcome: a packet-local entry that a lookup by packet and phase name finds first.
- Pass/fail: PASS if both renders carry their identity phrase, no shared phrase appears and nothing is written. FAIL if a shared phrase appears, the phrase drops the phase words or a file changes.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Render the packet-local changelog for a phase child and for its parent root without writing either, and confirm each trigger phrase names the packet, the phase where there is one, and ends with changelog.`

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CHG-012 | Render the identity phrase into a nested entry | Render a phase child and its root without writing, and read the phrase each carries | `Render the packet-local changelog for a phase child and for its parent root without writing either, and confirm each trigger phrase names the packet, the phase where there is one, and ends with changelog.` | 1. `agent: Read SKILL.md section 4 and the Search Metadata subsection of the spec-kit nested-changelog reference` -> 2. `bash: node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <phase-child-folder> \| sed -n '1,8p'` -> 3. `bash: node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <parent-root-folder> \| sed -n '1,8p'` -> 4. `bash: git status --porcelain` | Step 2 shows one trigger phrase with the packet and phase words. Step 3 shows one trigger phrase with the packet words. Neither shows a shared phrase. Step 4 matches the status taken before step 2 | Exact prompt, both folder paths, both rendered frontmatter blocks with exit status, and the status before and after | PASS if both renders carry their identity phrase, no shared phrase appears and the status is unchanged. FAIL if a shared phrase appears, the phase words are missing or a file changed | 1. Confirm the dist build is current with the generator source. 2. Read the template's trigger phrase placeholder. 3. Recompute the phrase by hand from the output path rule. |

### Commands

1. `agent: Read SKILL.md section 4 and the Search Metadata subsection of the spec-kit nested-changelog reference`
2. `bash: node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <phase-child-folder> | sed -n '1,8p'`
3. `bash: node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js <parent-root-folder> | sed -n '1,8p'`
4. `bash: git status --porcelain`

### Expected

The phase render's trigger phrases hold one phrase: the packet's words, then the phase's words, then `changelog`. The root render's phrase is the packet's words and `changelog`. Neither render carries a phrase every packet shares, and running without `--write` changes no file.

### Evidence

Capture the prompt, both folder paths, both rendered frontmatter blocks with their exit status, and the git status before and after.

### Pass / Fail

- **Pass**: both renders carry their identity phrase, no shared phrase appears and the git status is unchanged.
- **Fail**: a shared phrase appears, the phase words are missing from the phase render, or a file changed.

### Failure Triage

1. Confirm the dist build is current with the generator source.
2. Read the template's trigger phrase placeholder.
3. Recompute the phrase by hand from the output path rule.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root policy and scenario index |
| No feature-catalog entry | This mode has no catalog package for this scenario |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [`SKILL.md`](../../SKILL.md) | Nested output mode and the nested checks |
| [`nested-changelog.md`](../../../../system-spec-kit/references/workflows/nested-changelog.md) | Identity phrase rule |
| [`nested-changelog.ts`](../../../../system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts) | Generator that derives the phrase |
| [`phase.md`](../../../../system-spec-kit/templates/changelog/phase.md) | Phase template with the phrase placeholder |

---

## 5. SOURCE METADATA

- Group: SEARCH METADATA
- Playbook ID: CHG-012
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `search-metadata/render-nested-identity-phrase.md`
