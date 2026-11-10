---
title: "Implementation Plan: Phase 4: doctor-symlink-gaps"
description: "Record and test the ignore decision for the doctor engine's host-relative alias branch, and name in the doctor docs and the 044 limitations that a whole-linked .skilled reads the checkout's specs folder."
trigger_phrases:
  - "doctor symlink gaps plan"
  - "host-relative alias decision plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: doctor-symlink-gaps

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS (`symlink-engine.cjs`), plain text and Markdown docs |
| **Framework** | None; the doctor command's engine and its `node --test` files |
| **Storage** | None; the engine plans link actions and ignore lines |
| **Testing** | `node --test` on `symlink-engine.test.cjs` and `doctor-symlink-contract.test.cjs` |

### Overview
The engine gets a comment and one test, or one `push`, at the host-relative branch, depending on D-004a. Two doctor doc rows and one 044 limitation gain a sentence about the whole-link `specs/` limit. No other engine behavior changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `scratch/baseline.txt` holds the pass and fail count of both doctor test files, taken before the first edit.
- [ ] The operator has answered D-004a and D-004b.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict` prints `RESULT: PASSED`.

### Definition of Done
- [ ] Every requirement in `spec.md` section 4 is met with evidence.
- [ ] The section 5 command prints zero failures and the baseline totals plus the new case.
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single branch decision plus doc notes. The component is `planMergeTree` in `symlink-engine.cjs`.

### Key Components
- **The host-relative branch** (`symlink-engine.cjs:814-822`): pushes a `link` action for a host sibling that exists, and returns without an ignore entry.
- **`ignoreCandidates`** (`:826`, `:834`, `:954-960`): collects the machine-local links that the engine writes into the host's ignore list.
- **The doctor docs**: the `linked-whole` row of `doctor-symlink-presentation.txt` and the `--mode` row of `symlink.md`.

### Data Flow
Plan, then per child of a merged folder: a host-relative alias, a new link or an existing link, then actions and the sorted ignore list that the plan reports and the apply writes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline and the operator's answers. Implementation adds the engine test, then the comment (or the push), then the doc rows and the 044 limitation. Verification reruns both doctor test files. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run from the repository root:

```bash
node --test .skilled/commands/doctor/scripts/tests/symlink-engine.test.cjs .skilled/commands/doctor/scripts/tests/doctor-symlink-contract.test.cjs
```

The new case sits next to `setup keeps the specs alias pointed at a host specs folder` (`symlink-engine.test.cjs:480`), which already builds a host with a `specs/` folder, so it needs no new fixture. It reads the plan's ignore entries for `.skilled/specs`. Under Option B it passes on the unchanged engine, by design; under Option A it fails first.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

No new package. The operator's answers to D-004a and D-004b. Nothing from phases 001 to 003.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a doctor test fails after the change, or a host reports a changed ignore list. Revert the one commit with `git revert <sha>`; the engine change and the doc rows land as separate commits.
<!-- /ANCHOR:rollback -->

---
