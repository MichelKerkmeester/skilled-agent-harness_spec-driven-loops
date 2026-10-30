---
title: "Implementation Plan: Remove the operator's personal account name from tracked files outside specs and rename the orphan-sweep launch agent"
description: "A scripted rewrite turns absolute home paths into repository-relative or ~/ paths, and hand edits cover code, the launch agent and the council database. The routing replay and the repository gates prove nothing else moved."
trigger_phrases:
  - "personal name scrub plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Remove the operator's personal account name from tracked files outside specs and rename the orphan-sweep launch agent

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TypeScript, Python, a launchd plist and SQLite |
| **Framework** | None |
| **Storage** | The tracked council graph SQLite database |
| **Testing** | vitest, `tsc --noEmit` and the repository's routing and doc gates |

### Overview
A Python rewrite replaces the absolute path forms in every tracked text file outside `specs/`, and it checks that each changed JSON file still parses. Code, the launch agent template and the SQLite database get hand edits, because each needs a derived value, a placeholder or a database update. The baseline gates run before and after so any drift shows as a delta.
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
- [x] `leaf-route-replay.cjs | grep ^total` prints `total gold=65 scored=57 tied=3 mean_f1=0.9176 exact=50`, and the route guard prints `All hubs fresh or excused`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: an ordered text rewrite with hand-edited exceptions.

### Key Components
- **The rewrite rules**: map the repository root to a relative path, other home paths to `~/`, the `ls -la` owner column to `user` and the old launch agent label to `com.skilled.orphan-sweep`.
- **The hand-edited exceptions**: the TypeScript migration, the launch agent template and its README, the council graph database and four bare repository-root mentions in playbooks.

### Data Flow
The rewrite reads the file list from `git grep`, applies the rules in order, checks JSON and JSONL parse, then writes each file in place.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Setup records the baseline gates and the 512 affected files. Implementation renames the launch agent, runs the rewrite and makes the hand edits. Verification reruns every gate and the residue scan. Follow the ordered tasks in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The changed TypeScript runs under `vitest run --config ../../vitest.config.ts --project cli tests/memory-quality-phase6-migration.vitest.ts`, which must print `1 passed`. The rewritten database runs under the council graph script vitest, which must print `10 passed`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`python3`, `sqlite3`, `plutil` and the vitest and tsc binaries already installed under `.skilled/skills/system-spec-kit/node_modules/`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a gate reads differently from its baseline after the change. Revert the commit that carries this packet, which also restores the old plist name through the recorded rename.
<!-- /ANCHOR:rollback -->

---

