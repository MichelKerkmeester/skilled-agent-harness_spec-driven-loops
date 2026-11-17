---
title: "Implementation Plan: Forward the Claude config dir on single-executor research cli-claude-code dispatch"
description: "Let research accept an optional --claude-config-dir in dispatch-iteration.cjs, bind it as CLAUDE_CONFIG_DIR in runClaude, and forward config.executor.configDir from the research YAML. Proven by new research cases in the cli-claude-code and cli-matrix suites."
trigger_phrases:
  - "research claude config dir plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Forward the Claude config dir on single-executor research cli-claude-code dispatch

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script, workflow YAML, TypeScript |
| **Framework** | system-deep-loop runtime |
| **Storage** | None |
| **Testing** | Vitest |

### Overview
The change widens the `cli-claude-code` config-dir path in `dispatch-iteration.cjs` from review-only to review plus optional research. The research YAML then forwards `config.executor.configDir` with the render hint review already uses. New research cases in `cli-claude-code.vitest.ts` and `cli-matrix.vitest.ts` prove the forward, the override of an inherited env value and the unchanged default.
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
- [ ] All acceptance criteria met
- [ ] `npx vitest run` over the three suites named in `spec.md` SC-001 exits 0, and the new research config-dir case fails against the pre-change script
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Other: widen one executor branch.

### Key Components
- **`dispatch-iteration.cjs` `validateFlags` and `runClaude`**: accept the optional flag on research and bind the validated dir; without this the flag raises a UsageError.
- **`deep-research.yaml` `if_cli_claude_code`**: renders the configured dir into the command; without this the configured dir never reaches the script.

### Data Flow
`config.executor.configDir` in the research config renders into `--claude-config-dir` in the YAML command. `validateFlags` accepts it, `runClaude` validates the path and sets `CLAUDE_CONFIG_DIR` in the guarded child env, and the audit row records the dir.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup reads the review config-dir path in `dispatch-iteration.cjs` and records the baseline suite results. Implementation widens `validateFlags` and `runClaude` and forwards the dir from `deep-research.yaml`. Verification runs the three suites with the new research cases. Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Run `npx vitest run runtime/tests/stress/cli-adapter/cli-claude-code.vitest.ts runtime/tests/unit/cli-matrix.vitest.ts runtime/tests/unit/combo-matrix.vitest.ts` from `.skilled/skills/system-deep-loop/`. It must exit 0. New cases: research with a configured dir, research with an inherited `CLAUDE_CONFIG_DIR` overridden, research with `--claude-config-dir ""`, research with a missing dir, and `cli-codex` research still rejecting the flag.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None. No new package, and no other slice must land first (research §20).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a default research run without a configured dir fails or changes account routing. Revert the one commit that touches `dispatch-iteration.cjs` and `deep-research.yaml`.
<!-- /ANCHOR:rollback -->

---
