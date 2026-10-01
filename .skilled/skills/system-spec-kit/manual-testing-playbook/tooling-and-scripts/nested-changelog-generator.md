---
title: "458 -- Nested changelog generator"
description: "This scenario validates the nested changelog generator for `458`. It focuses on the identity phrase a phase entry carries, the lookup that finds it and frontmatter that parses for a quoted title."
version: 2.1.0.0
---

# 458 -- Nested changelog generator

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `458`.

---

## 1. OVERVIEW

This scenario validates the nested changelog generator for `458`. It focuses on the identity phrase a phase entry carries, the lookup that finds it and frontmatter that parses for a quoted title.

### Why This Matters

The identity phrase is the only trigger phrase a packet changelog carries, so it is how Gate 1 and `/speckit:search` find the entry. Frontmatter that fails to parse would stop the trigger index from publishing at all.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `458` and confirm the expected signals without contradictory evidence.

- Objective: confirm that a phase entry's phrase names its packet and phase, that a lookup for it ranks the entry first and that a quoted title renders valid frontmatter
- Real user request: `Is the changelog for phase 12 of the create-goal packet findable, and would a title with quotes in it break the file?`
- Prompt: `Check the nested changelog for phase 012 of specs/sk-doc/060-create-goal-mode: derive it without writing, confirm its identity phrase matches the committed entry and ranks it first in a lookup, then run the generator tests.`
- Expected execution process: the generator derives the phase payload with `--json`, the committed entry's frontmatter is read, the phrase is looked up in the trigger index and the vitest suite runs.
- Expected signals: the payload's mode is `phase` and its phrase is `create goal mode goal send and dedupe changelog`. The committed entry declares that phrase, and the lookup returns the entry first with an exact match. The suite passes, including the case that renders a quoted title.
- Desired user-visible outcome: a verdict that the entry is findable by its packet and phase, with the evidence.
- Pass/fail: PASS if the phrase matches in the payload and the entry, the lookup ranks the entry first and the suite passes. FAIL if the phrase differs, the lookup misses the entry or a test fails.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Check the nested changelog for phase 012 of specs/sk-doc/060-create-goal-mode: derive it without writing, confirm its identity phrase matches the committed entry and ranks it first in a lookup, then run the generator tests.`

### Commands

1. `node .skilled/skills/system-spec-kit/runtime/cli/dist/spec-folder/nested-changelog.js specs/sk-doc/060-create-goal-mode/012-goal-send-and-dedupe --json`
2. `sed -n 1,8p specs/sk-doc/060-create-goal-mode/changelog/changelog-060-012-goal-send-and-dedupe.md`
3. `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs --json -- "create goal mode goal send and dedupe changelog"`
4. `cd .skilled/skills/system-spec-kit/runtime/cli && npx vitest run --config ../../vitest.config.ts --project cli tests/nested-changelog.vitest.ts`

### Expected

Step 1 prints `"mode": "phase"`, the output path `specs/sk-doc/060-create-goal-mode/changelog/changelog-060-012-goal-send-and-dedupe.md` and the identity phrase `create goal mode goal send and dedupe changelog`, and writes nothing. Step 2 shows that phrase as the entry's only trigger phrase. Step 3 returns the entry first with `matchClass` `exact` and score 1. Step 4 passes every case, including `renders frontmatter that parses and pastes every value literally`.

### Evidence

Capture the payload's mode, output path and phrase, the entry's frontmatter, the first lookup result and the suite's summary line with its exit status.

### Pass / Fail

- **Pass**: the phrase matches in the payload and the entry, the lookup ranks the entry first and the suite passes.
- **Fail**: the phrases differ, a test fails or the lookup misses the entry or ranks another document first.

### Failure Triage

1. Rebuild `runtime/cli` if step 1 prints an older payload shape, because the command runs the built generator.
2. Compare the entry's path with the payload's output path when the phrases differ.
3. Rebuild the trigger index from committed content when the lookup misses a committed entry.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page and scenario summary |
| `../../feature-catalog/tooling-and-scripts/nested-changelog-generator.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.skilled/skills/system-spec-kit/runtime/cli/spec-folder/nested-changelog.ts` | Derives the payload and the phrase, then renders the entry |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/nested-changelog.vitest.ts` | Paths, phrases, the trim rule and escaped rendering |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | The lookup Gate 1 runs |

Provenance: runtime/cli/tests/nested-changelog.vitest.ts

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 458
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `tooling-and-scripts/nested-changelog-generator.md`
