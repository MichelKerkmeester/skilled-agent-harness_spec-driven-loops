---
title: "Implementation Plan: Phase 7: children-list-duplicates"
description: "Teach compareTrackChildren to report a packet named twice in children_ids, then let the sweep count it as drift and the writer remove it. Empty the stale list in Skilled's specs root, and prove the change with two new track-root tests and a sweep over the Barter host."
trigger_phrases:
  - "children list duplicates plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: children-list-duplicates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM (`.mjs`) and JSON |
| **Framework** | None |
| **Storage** | None: `graph-metadata.json` files in the specs tree |
| **Testing** | Vitest, project `cli`, in `.skilled/skills/system-spec-kit/runtime/cli/tests/` |

### Overview
The track reader's `compareTrackChildren` gains a sorted `duplicates` list and fails `matches` when a name repeats. The sweep and the writer read that list, so the sweep exits 1 and the writer rewrites the list with each packet once. Two new tests and a sweep over the Barter host prove it.
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
- [x] `npx vitest run tests/track-roots.vitest.ts --config ../../vitest.config.ts --project cli` from `.skilled/skills/system-spec-kit/runtime/cli` prints 28 passed of 28
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
One shared comparison. The track reader decides, and the sweep and the writer report what it decided.

### Key Components
- **`compareTrackChildren` in `track-roots.mjs`**: compares declared and on-disk packets and now reports the names declared more than once.
- **`sweep-track-roots.mjs` and `refresh-track-roots.mjs`**: the sweep prints and counts the duplicates, and the writer removes them under `--apply`.

### Data Flow
The sweep and the writer read each track root's `graph-metadata.json` and list its packet folders on disk. `compareTrackChildren` turns both into `declared`, `actual`, `duplicates` and `matches`. The sweep prints drift and sets its exit status from `matches`. The writer prints the planned change and, under `--apply`, writes `children_ids` back with each packet once.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `scripts/rotate-logs.sh`: owns the deletion. Action: update. WEAK: Various files. -->

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/cli/lib/track-roots.mjs` `compareTrackChildren` | Producer: compares declared and on-disk packets as sets | update | The three new tests in `track-roots.vitest.ts` |
| `runtime/cli/spec/sweep-track-roots.mjs` | Consumer: prints drift and sets the exit status, and the pre-push gate runs it | update | The sweep test exits 1 and prints `declared more than once` |
| `runtime/cli/spec/refresh-track-roots.mjs` | Consumer: rewrites `children_ids` | update | The writer test removes the repeat and the sweep then passes |
| `feature-catalog/tooling-and-scripts/track-root-children-lists.md` | Docs: describes what the sweep checks | update | `rg -n 'more than once'` on the file prints one line |
| `specs/graph-metadata.json` | Data: Skilled's specs root list, a track root only inside a host mirror | update | Its `children_ids` is an empty list |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup records the 25-test baseline. Implementation adds the duplicate check to the reader, the sweep and the writer. Verification runs the 28 tests and sweeps the Barter host.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

From `.skilled/skills/system-spec-kit/runtime/cli`, `npx vitest run tests/track-roots.vitest.ts --config ../../vitest.config.ts --project cli` must print 28 passed of 28.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `compareTrackChildren`, the sweep and the writer over a fixture track | Vitest, project `cli` |
| Integration | The sweep and the writer over the Barter host's `barter/ai-speckit/specs` at the working tree | `node` running the two scripts |
| Manual | `skilled-barter-overlays` reports `declared=4 actual=4` in the sweep output | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node and Vitest, already in the repository | Internal | Green | None: no new package |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: the sweep flags a list that names each packet once, or the writer drops a packet that exists on disk.
- **Procedure**: revert the phase commit with `git revert <sha>`. It touches only the files in `spec.md` section 3. The Barter writes live in Barter's own repository, so the operator reverts them there.
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | The 25-test baseline from Setup | Verification |
| Verification | The changed reader, sweep and writer | Closing this phase |
<!-- /ANCHOR:phase-deps -->

---
