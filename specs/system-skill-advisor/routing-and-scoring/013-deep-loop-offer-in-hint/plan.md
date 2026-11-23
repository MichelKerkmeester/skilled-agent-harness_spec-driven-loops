---
title: "Implementation Plan: Carry the deep-loop offer in the advisor hint"
description: "One change to the brief renderer prints the three offer options after a deep-loop command with policy ask. Golden tests prove the head, and four F6 behaviour runs measure whether sessions now ask the offer."
trigger_phrases:
  - "deep loop offer in hint plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Carry the deep-loop offer in the advisor hint

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, ESM) |
| **Framework** | None, the advisor runtime library |
| **Storage** | None |
| **Testing** | vitest |

### Overview
`commandLabel` in `lib/render.ts` gains one branch: when the printed command is `/deep:research` or `/deep:review` and the policy word is `ask`, the parenthesis reads `(ask: A <command>:auto, B <command>:confirm, C no loop)`. The golden brief tests and the injection contract take the new head. Four F6 runs in a behaviour arena measure whether sessions now ask the offer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] The operator approved this plan, including the two open questions in `spec.md`
- [ ] `npm run build` in `.skilled/skills/system-skill-advisor/runtime` exits 0 on the unchanged tree
- [ ] The Measured Behavior command prints `(ask) 0.95/0.12` before any edit

### Definition of Done
- [ ] Every REQ row in `spec.md` has its acceptance check passing, or a deferral the operator approved
- [ ] `npx vitest run` in `.skilled/skills/system-skill-advisor/runtime` reports 0 failed
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Single renderer branch.

### Key Components
- **`commandLabel` in `lib/render.ts`**: builds `owner → command (policy)`. It is the one place every runtime's brief head comes from, so the options appear on all runtimes with one edit. Without the branch a session sees only `(ask)` and has to open the command doc to learn the options.

### Data Flow
The scorer attaches `/deep:review` with policy `ask` to the `system-deep-loop` recommendation. `renderAdvisorBrief` calls `commandLabel`, which reads the command and policy, then appends the options when the command is a deep-loop one and the word is `ask`. A child session gets `parent-named only` from `policyWord` first, so the branch never runs there. The runtime hook places the head in its context channel unchanged.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup builds the advisor and records the current head. Implementation adds the deep-loop branch to `commandLabel` and updates the goldens and the injection contract. Verification runs the advisor suite, the Measured Behavior command and four F6 behaviour runs. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`npx vitest run` in the advisor runtime must report 0 failed, with the deep-loop goldens expecting the new head, a child-session case expecting no options and a companion case at the default cap. The behaviour runs reuse packet 012's arena recipe with `claude-sonnet-5-5` and a budget of $0.75 per run, about $0.80 for four.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

No new package. The behaviour runs need the `claude` CLI and `prepare-behaviour-arena.mjs`, both used by packet 012.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: F6 sessions start option A without asking, or a runtime cuts the head. Revert the implementation commit with `git revert <sha>` and rebuild the advisor `dist`.
<!-- /ANCHOR:rollback -->

---

