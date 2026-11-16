---
title: "Implementation Plan: Phase 12: fix-barter-022-handover-items-for-doctor-scripts"
description: "Three small changes to two doctor scripts: a host hook form in the git setup check, an adopt that takes an excluded path with an overlay source, and a regenerate step named in a problem line. Proved by the doctor script test folder."
trigger_phrases:
  - "fix barter 022 handover items for doctor scripts plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: fix-barter-022-handover-items-for-doctor-scripts

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS |
| **Framework** | None |
| **Storage** | Local git config and the overlay manifest |
| **Testing** | `node --test` |

### Overview
`checkHooks` reads one more local config key and passes an installed hook it lists. `adoptUnderLock` accepts an excluded path when its overlay source exists. The re-pin names the regenerate step when a step changed a file an overlay owns. Each change starts with a failing test in the doctor script test folder.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The operator answered the two open questions in `spec.md` on 2026-11-16
- [ ] The operator has said to start the build

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests` prints `fail 0` and a pass count above 1175
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Extend in place.

### Key Components
- **`checkHooks` in `git-setup-check.cjs`**: reads `skilled.hostHook` beside `skilled.omitHook`. Reusing `skilled.omitHook` fails, because that key means a hook is left out, and line 423 reads it only for a hook that is absent.
- **`adoptUnderLock` in `overlay-engine.cjs`**: accepts a path `isVendoredKey` rejects only for being under `repin.exclude`, when the overlay folder holds its source. `isVendoredKey` itself stays as it is, because the write checks and the re-pin copy rely on an excluded path not being vendored.
- **The live re-pin's classification after its regenerate steps**: carries the step that wrote a file into the problem line. Where that is done is decided by T003's failing test.

### Data Flow
The git setup check reads the local config, walks the installed hooks and builds one row. `apply --adopt` resolves the path, finds its overlay source, writes the manifest entry and applies. A live re-pin copies, applies, runs the regenerate steps and then classifies each destination, which is where a rewritten owned file is named.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup captures the test baseline and finds where `skilled.omitHook` is documented. Implementation changes `git-setup-check.cjs` and `overlay-engine.cjs`, one failing test before each change. Verification runs the whole doctor script test folder and the sk-code setup check.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node --test .skilled/commands/doctor/scripts/tests` must print `fail 0`. Each change is paired with a test that the nearest refusal still holds: an unlisted host hook, an excluded path with no overlay source and a real `upstream-moved` file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None new.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the hooks row passes for a hook that is not listed, or an adopt writes an entry for a path with no overlay source. Revert the one commit. Nothing is stored that an older script cannot read, since an unknown local config key is ignored.
<!-- /ANCHOR:rollback -->

---

