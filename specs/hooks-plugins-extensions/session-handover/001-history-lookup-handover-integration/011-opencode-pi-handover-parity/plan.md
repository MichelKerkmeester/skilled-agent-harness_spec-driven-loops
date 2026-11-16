---
title: "Implementation Plan: Phase 11: opencode-pi-handover-parity"
description: "Tell the sender and the receiver that the History Lookup exists, close two redaction gaps, mark cut previews, and prove the hop on Pi and OpenCode with a harness that scores the receiver's own transcript."
trigger_phrases:
  - "opencode pi handover parity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: opencode-pi-handover-parity

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS and TypeScript hooks, Bash harness |
| **Framework** | The session-handover hooks and the history lookup engine |
| **Storage** | None |
| **Testing** | Vitest, `node --test` and live hops through `scratch/harness/live-hop.sh` |

### Overview
[2-3 sentences: what this implements and the technical approach]
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All requirements in `spec.md` met
- [ ] Three consecutive Pi and three OpenCode live hops score 5/5 with the side word stated by the receiver and the planted secret shown only as `[REDACTED:url-password]`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: text changes in shared instruction builders, plus a small change in the lookup engine

### Key Components
- **`lib/nudge.cjs` and `bin/session-handover.cjs`**: the prepare text the sender reads, the seed steps and the claim output the receiver reads, shared by every runtime
- **`history/lib/core.ts` and `history/lib/navigator.ts`**: redaction before projection and the browse preview

### Data Flow
The sender reads the prepare text and writes the note. The receiver reads the seed steps, runs the claim, reads the note and the lookup offer, then runs the lookup, whose engine redacts each entry before any reply.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the suite baselines and fixes the harness scorer. Implementation changes the prepare, seed and claim text, the redaction key rule and the preview. Verification reruns the four suites and the live hops. The ordered tasks are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Unit: `npm --prefix .skilled/hooks/session-handover/history test` and the hand-over `node --test` suite. Live: `PI_ROUTE=deepseek bash scratch/harness/live-hop.sh pi <label>` and `bash scratch/harness/live-hop.sh opencode <label>`, each scored by `node scratch/harness/score.cjs <run>`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`tmux`, `pi` with the LLM Gateway DeepSeek route, and `opencode` 2. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a receiver or sender misreads the new text, or a suite fails after merge. Revert the merge commit on main.
<!-- /ANCHOR:rollback -->

---

