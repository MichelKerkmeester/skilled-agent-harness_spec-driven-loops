---
title: "Implementation Plan: Phase 17: dsh-rc3-repin"
description: "Move the dsh pin from 0.2.2-rc.1 to 0.2.2-rc.3 at its 15 sites, then repeat the re-pin runbook probes on rc.3 and restate a route as verified only where its probe completes."
trigger_phrases:
  - "dsh rc3 repin plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 17: dsh-rc3-repin

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (Node ESM and CommonJS), TypeScript tests, Markdown, JSON |
| **Framework** | dsh 0.2.2-rc.3 headless, the system-deep-loop fan-out runner |
| **Storage** | None |
| **Testing** | `node --test`, vitest, live dsh probes |

### Overview
The pin text changes at 15 files: the dispatch guard and its tests, the fan-out runner and its stubs, and the skill docs. The runbook probes T004 to T008 then run on rc.3. A route is restated as verified on rc.3 only where its probe exits 0 with a final `completed` event.
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
- [x] `node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` prints `pass 47` and `fail 0`, and the fan-out and combo-matrix vitest files print 185 passed
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Single pin constant. The release string lives as a literal at each site, with no shared source.

### Key Components
- **`dispatch-rule-checks.mjs`**: refuses a dsh dispatch that names any version but the pin.
- **`fanout-run.cjs`**: refuses a lineage when `dsh --version` is not the pin.

### Data Flow
A dispatch command reaches the guard, which reads `DSH_PINNED_VERSION`. A fan-out lineage runs `dsh --version` and compares it with `DSH_VERSION` before it spawns dsh.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the PATH dsh, its version and the registry integrity in `scratch/measured-before.txt`. Implementation moves the pin at the 15 sites listed in `tasks.md`. Verification runs the guard and fan-out tests, then the runbook probes T004 to T008 on rc.3.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node --test .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` must print `fail 0`, with rc.1 in the refused list. The live probes must each exit 0 with a final `completed` event.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

dsh 0.2.2-rc.3 on PATH at `~/.local/bin/dsh`, and the `LLMGATEWAY_API_KEY` and `OPENCODE_API_KEY` keys for the live probes. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a dispatch on rc.3 fails where rc.1 worked. Revert this phase's commit, which restores the rc.1 pin at every site, and reinstall rc.1 at `~/.local/bin`.
<!-- /ANCHOR:rollback -->

---

