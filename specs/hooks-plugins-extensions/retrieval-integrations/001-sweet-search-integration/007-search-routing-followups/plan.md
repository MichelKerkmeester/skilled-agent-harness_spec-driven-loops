---
title: "Implementation Plan: Phase 7: search-routing-followups"
description: "Point the search command's default lane at the ripgrep wrapper and add search phrases to the system-spec-kit advisor signals."
trigger_phrases:
  - "search routing followups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: search-routing-followups

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown command documents and one JSON metadata file |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest (advisor suite), the alignment battery |

### Overview
Change the default command in the free-text lane of `search.md` to the wrapper, and reword the two documents that said the command ran the raw recipe. Add four phrases to the `system-spec-kit` `intent_signals`, rebuild the advisor and rerun the two probes. Prove both with the wrapper output, the advisor suite and the battery.
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
- [x] `run-battery.cjs` over this change prints `fail=0`, and the advisor suite exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Command document over a CLI

### Key Components
- **`search.md`**: tells the agent which command to run for each lane.
- **`graph-metadata.json`**: carries the phrases the advisor matches prompts against.

### Data Flow
The query goes to `rg-wrapper.mjs structured`, which composes the Section 2.1 recipe, ranks the matches, keeps one row per file and returns a `schemaVersion: 2` record the presentation asset renders.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup counts the archives. Implementation adds `--keep`. Verification counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

The advisor suite (`npx vitest run` in `system-skill-advisor/runtime`) guards the routing corpus against the new signals. The wrapper itself is unchanged and keeps its phase 6 tests.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`rg` and `node`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Revert the one commit, then run `skill_graph_scan --trusted` and `advisor_rebuild --trusted --force true` so the daemon drops the four signals.
<!-- /ANCHOR:rollback -->

---

