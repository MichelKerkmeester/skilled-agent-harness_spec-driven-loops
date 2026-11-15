---
title: "Implementation Plan: Phase 7: open-findings-follow-up"
description: "Fix six open findings in order of certainty: the stdin crash, the spec-kit build, the coverage sentence and the OpenCode verification first, then the two advisor routes, which are held to the existing corpus floors."
trigger_phrases:
  - "open findings follow up plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: open-findings-follow-up

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, TypeScript, Python 3, JSON, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest, node --test, the advisor corpus scorer |

### Overview
Four findings have a known cause and a small fix: the deep-loop bootstrap reads stdin eagerly, the top-level spec-kit build skips the runtime attestation, a contract sentence is stale and the OpenCode skill names an older release. The two advisor findings are scorer behavior, so they come last and are measured against the phase 006 gate values. A change that cannot hold those floors is not shipped.
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
- [ ] `npx vitest run tests/integration/bootstrap-stdin.vitest.ts` in the deep-loop runtime passes, and the advisor gates end at or above their phase 006 Final values
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Six independent fixes

### Key Components
- **Deep-loop TSX bootstrap**: re-executes a script under the TSX loader, and should pass stdin through instead of reading it
- **Advisor scorer and skill metadata**: rank skills for a prompt from five lanes

### Data Flow
A bootstrapped script spawns itself under TSX. Today the parent reads all of stdin first and passes it as `input`. After the fix the child inherits the stdin descriptor and reads it only when it needs it, which only `upsert.cjs -` does.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup records the six measured behaviors in `spec.md`. Implementation fixes the bootstrap, the build script, the contract sentence and the OpenCode docs, then tries the two advisor routes. Verification reruns the deep-loop, spec-kit and advisor gates against the phase 006 Final values. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

A new vitest runs `convergence.cjs` with a socketpair and with a pipe that is never closed on stdin. It must fail on the old bootstrap and pass on the new one. The two advisor prompts are pinned in `routing-golden-prompts.vitest.ts` and must fail before the scorer change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

No new package. OpenCode 2.3.0 is the installed binary under test.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a deep-loop script stops reading `upsert -` input, or an advisor gate drops below its phase 006 value. Revert the commit that carries the change with `git revert <sha>`, rebuild the advisor and restart its server.
<!-- /ANCHOR:rollback -->

---

