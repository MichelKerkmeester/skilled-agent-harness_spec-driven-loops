---
title: "Implementation Plan: Phase 56: worktree-goal-carry"
description: "Extend the Claude goal resolver to search the linked worktrees its session log names, record the proven worktree as goal_root on the note, and render the receiver's goal slice from that worktree."
trigger_phrases:
  - "worktree goal carry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 56: worktree-goal-carry

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and bash |
| **Framework** | None |
| **Storage** | The hand-over note's frontmatter |
| **Testing** | `node --test`, OpenCode plugin suite, hooks vitest |

### Overview
The Claude goal resolver gains a last search step over the linked worktrees its session log names. A proven match writes `goal_root` beside `goal_packet`. `consume`, `claim` and the wrapper read that root back, accept it only while git lists it, and the wrapper renders the goal slice from it. Real `git worktree add` fixtures prove each step, and each new test fails on the old code.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` prints `pass 1073` and `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fallback search, recorded root.

### Key Components
- **`repositoryWorktrees`**: lists the repository's other checkouts through `git worktree list --porcelain`. Without it nothing names the worktree the packet lives in.
- **`worktreeHeadlinePackets`**: walks only the worktrees the session log names, keyed by worktree and packet. A walk of every worktree costs 14 seconds, and a match without its root loses which copy was proven.
- **`goal_root` note field and `usableGoal`**: carry the proven worktree to `consume`, `claim` and the wrapper, which otherwise re-check the packet against the primary checkout and drop it.

### Data Flow
`prepare` resolves the goal and writes `goal_packet` and `goal_root`. `consume` checks the root against `git worktree list` and reports both. The wrapper passes the root to `renderGoalSlice`, which runs `goal.cjs packet <packet> --workspace <root>` and starts Claude on `/goal <slice>`.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baseline and the failing test. Implementation changes the core, the CLI and the wrapper. Verification reruns the three suites and the real-session probe.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The worktree fixtures create a real repository and `git worktree add` in a temporary directory, so the git listing runs for real. The wrapper tests were run once against the unchanged wrapper to confirm they fail there.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`git`, already required by the repository. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a hand-over carries a goal from the wrong worktree, or `prepare` slows down. Revert the commit. Notes that carry `goal_root` then fall back to the old behavior, because the old code ignores the field.
<!-- /ANCHOR:rollback -->

---
