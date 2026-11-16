---
title: "Implementation Plan: Phase 10: fix-barter-repin-handover-items-for-overlay-engine"
description: "Four narrow changes to the overlay engine's re-pin and classification code, each behind a test that fails first, plus three documentation edits. Every engine change is placed at the function the handover's refusal line comes from."
trigger_phrases:
  - "fix barter repin handover items for overlay engine plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: fix-barter-repin-handover-items-for-overlay-engine

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript on Node.js, CommonJS |
| **Framework** | None |
| **Storage** | The overlay manifest and `sync-state.json` in the project's overlay folder |
| **Testing** | `node --test` on `.skilled/commands/doctor/scripts/tests/` |

### Overview
Change one script, `overlay-engine.cjs`, in five places, and three documents. Each engine change starts with a fixture test that reproduces the line Barter saw. Each change is one brief to DeepSeek v4.1 flash at max thinking through the Mistral Vibe CLI, with literal old and new text, and the orchestrating session checks the diff and reruns the tests before the next brief. The proof is the engine's own test folder passing with the new tests, each of which failed before its fix.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: the `vocabularyMirrors` question in `spec.md` section 7 is decided

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/commands/doctor/scripts/tests/` prints `fail 0`, with a pass count higher than the baseline captured in T001 by the number of new tests: 1170 before, 1175 after, five new tests
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place function changes. No new file, module or command.

### Key Components
- **`unownedDrift`** (`overlay-engine.cjs`, near line 3364): refuses an unowned path that differs from the old pin. It checks each new file through a live link before it considers that the link itself is on the delete list. Without a change here, the 18 `holds its own copy` lines and the one `missing from the tree` line from Barter's first two stages stay. `treeShapeProblems` already accepts a path below a link that is deleted first, so the copy step needs no change.
- **`planDirectoryOverlay`** (near line 1288): a `directory` overlay deletes any file its copy lacks, but only the `skill-root` planner marked such a delete as the overlay's own. Setting the same `replacedSubtree` mark lets the existing rule in `classifyDestination` read a file that holds upstream's bytes as `overlay-edited`. That covers the 11 `live-edited` lines.
- **`classifyDestination`** (near line 2101): a `file` entry carries `pinnedSha256`, the upstream bytes its overlay was written against. A `directory` or `skill-root` entry has no such record, so a rebased overlay still read `upstream-moved`. The change adds `isRebasedOntoPin`: when the entry's `rebasedOnto` names the pinned commit and the destination holds upstream's bytes at that commit, the state is `overlay-edited`. Extending the existing checks without a record fails, because nothing in the manifest or `sync-state.json` says which upstream the owner read for `repo-frontend`'s 18 paths. A hash per file was the handover's form and was not taken: one value per entry is one edit per re-pin.
- **The stage result** (in `repinUnderLock`): a stage printed `STAGED` whether or not it was clean. It already exited 1 when blocked. The change prints `BLOCKED` for a stage that is not clean.
- **`set` in `planOperation`** (near line 841): `nodeAtPath` threw `missing key` when the old pin's file lacked the key, and `insertObjectKeys` would refuse after the copy because the copied value differs. The change lets `set` add a missing last key after the object's last member. A missing parent still throws.
- **No change for item 4**: `managedPathTest` already exempts every path a regenerate step lists under `outputs`.

### Data Flow
`repin` lists the touched paths, runs `unownedDrift` and `treeShapeProblems`, copies the new commit's files, sets the pin, then runs `apply`, which classifies every overlay destination and refuses to write while any reads `live-edited`, `both-changed` or `upstream-moved`. Items 1 and 4 stop before the copy. Item 3 stops at `status` before the re-pin starts. Item 2 stops after the copy, which is why the live run failed with the pin already moved.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the test baseline and reproduces each item in a fixture. Implementation changes `overlay-engine.cjs` one item at a time and then the three documents. Verification reruns the whole test folder and writes the handover to Barter.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/commands/doctor/scripts/tests/` is the gate. Each engine item adds a test for the measured case and for the nearest case that must still refuse: a new upstream file that a project's own link already reaches, a hand-added file inside a directory overlay, a folder overlay with no `rebasedOnto` or with another commit in it, and a `set` whose parent object is missing.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`node` and `git`, which the engine tests already use. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a re-pin overwrites or deletes a file a person edited, or an existing engine test fails. Revert the commit for that item. The four engine changes land as separate commits so one can be reverted without the others.
<!-- /ANCHOR:rollback -->

---
