---
title: "Implementation Plan: Phase 10: mixed-track-sweep-guard"
description: "Move the two packets left flat after Phase 008 into the operator-selected sub-tracks. Add a shared track-layout helper and make the top-level sweep fail mixed layouts. Verify the moves, the working-tree and --rev guard, tests and documentation."
trigger_phrases:
  - "mixed track sweep guard plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 10: mixed-track-sweep-guard

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM and JSON |
| **Framework** | None |
| **Storage** | Track metadata in `graph-metadata.json` |
| **Testing** | Vitest, track-root and archive-track suites |

### Overview
Move both packets into their chosen sub-tracks and align live path references and description metadata. Add `trackLayout(children)` to the shared track-roots helper, then use it in the top-level sweep to report and fail mixed layouts. Verify the clean repository sweep, mixed-layout behavior in working-tree and `--rev` modes, the 89-test result and the documentation checks.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `track-roots.vitest.ts` and `archive-track.vitest.ts` report 89 passed and 0 failed
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Shared layout classification

### Key Components
- **`trackLayout(children)` in `runtime/cli/lib/track-roots.mjs`**: Splits children into numbered packets and sub-tracks and returns `mixed` when both are present.
- **`sweep-track-roots.mjs`**: Checks top-level tracks, prints the flat packet names and exits 1 for a mixed layout.

### Data Flow
The top-level sweep reads each track's children and passes them to `trackLayout(children)`. The helper separates numbered packets from sub-tracks. When both are present, the sweep prints `    flat packets beside sub-tracks: <names>`, reports the total at the end and exits 1. Working-tree and `--rev` runs use the same check. The sweep does not inspect a sub-track, and a track with no sub-tracks remains valid.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup records the operator-selected destinations and sweep-only boundary. Implementation moves both packets and adds the shared classifier, sweep guard, fixture coverage and docs. Verification checks the repository sweep, both mixed-layout modes, 89 passing tests and the supplied documentation results. Follow the ordered work and evidence in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

| Check | Recorded result |
|-------|-----------------|
| Repository sweep after the moves | `all track roots match their declared children` |
| `track-roots.vitest.ts` and `archive-track.vitest.ts` | 89 passed, 0 failed. The track-roots test count increased from 28 to 29 |
| Mixed-track sweep coverage | Working-tree and `--rev` cases exit 1, print both messages and produce identical output |
| Strict validation of the two moved tracks | sk-code: 24 passed, 0 failed. hooks-plugins-extensions: 37 passed, 0 failed |
| Markdown links and changelog shape | 0 broken links. `check_changelog_shape.py` printed PASS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Use |
|------------|-----|
| Node ESM runtime | Runs the CLI helper and sweep |
| Vitest | Runs the track-roots and archive-track test files |
| Track metadata JSON | Provides declared child names for the sweep |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

N/A: the supplied facts do not include a commit hash for the guard change, so a specific revert command cannot be named without guessing. The packet move commit is `06ac059b69`.
<!-- /ANCHOR:rollback -->

---

