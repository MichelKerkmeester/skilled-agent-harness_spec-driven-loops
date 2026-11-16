---
title: "Implementation Plan: Phase 12: opencode-model-carry"
description: "Read the sender's model from the OpenCode 2 store at prepare time and start the receiver on it through OPENCODE_CONFIG_CONTENT, merged over the operator's own config text."
trigger_phrases:
  - "opencode model carry plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 12: opencode-model-carry

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash wrapper and CommonJS hooks |
| **Framework** | The session-handover hooks and `skilled-loop` |
| **Storage** | OpenCode's SQLite session store, read only |
| **Testing** | `node --test` wrapper stubs and live hops through `scratch/harness/live-hop.sh` |

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
- [ ] Three live OpenCode 2 hops with `SENDER_MODEL=llmgateway/deepseek-v4.1-flash` score `modelCarry.kept: true` and 5/5
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: one more reader on the existing settings channel, and one launch environment value

### Key Components
- **`resolveSessionSettings` in `relaunch-core.cjs`**: already reads Claude, Codex and Cursor settings into the relaunch record; it gains an OpenCode branch
- **`carry_opencode_model` in `skilled-loop`**: turns the accepted model into `OPENCODE_CONFIG_CONTENT` for an OpenCode 2 hop

### Data Flow
The OpenCode plugin runs prepare, which reads the sender's latest assistant model from the store into the relaunch record. The wrapper accepts that model as `SKILLED_LOOP_MODEL`, and on an OpenCode 2 hop merges it into the operator's saved config text as the top-level, build and plan model.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup probes real TUI launches for a route that sets the model. Implementation adds the store reader and the wrapper carry. Verification runs the suites, negative controls and live hops. The ordered tasks are in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node --test .skilled/hooks/session-handover/tests/*.test.cjs` and live hops with `SENDER_MODEL=llmgateway/deepseek-v4.1-flash bash scratch/harness/live-hop.sh opencode <label>`, scored by `node scratch/harness/score.cjs <run>`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

OpenCode 2 honouring `OPENCODE_CONFIG_CONTENT`, and `node:sqlite`. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a receiver fails to start or starts on a wrong model. Revert the merge commit; the launch falls back to the configured model.
<!-- /ANCHOR:rollback -->

---

