---
title: "Implementation Plan: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases"
description: "Let a surface hint add its surface inside the sk-code router's evaluation, and score a surface so its phrase count cannot drop a workflow mode. One router file, the engine call, the case file and two READMEs, proved by the hint tests and the hub's case file."
trigger_phrases:
  - "host surface hint and score window plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Let a session surface hint join a scored sk-code route and keep a second matched mode when one surface scores several phrases

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS |
| **Framework** | None |
| **Storage** | The hub's compiled routing closure and `hub-router.json` |
| **Testing** | `node --test` and the hub's case file |

### Overview
The hint moves from a reorder after validation into the router's evaluation, where it can add one declared surface and still be validated. The surface score changes so that a surface is evidence beside a workflow mode, never a replacement for one. The hub's case file is run before and after, and every changed route is listed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified
- [x] The operator answered open questions 1 and 2 in `spec.md` on 2026-11-16
- [x] The operator has said to start the build
- [x] T002 has said whether legacy parity is still a gate

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` prints `fail 0`, and `compiled-route-guard.cjs` passes for `sk-code`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Score, select, join.

### Key Components
- **`evaluateCanary` in `canary-router.cjs`**: after the near-tie selection, adds the hinted specific surface when the selected set lacks it. `applySurfaceHint` cannot do this in place, because it runs after validation and a join changes a single route into a bundle, which has to be validated.
- **`scoreModes` in `canary-router.cjs`**: the surface score. Changing only `ambiguityDelta` or one weight in `hub-router.json` fails, because the vendoring project measured that a fourth frontend phrase drops the review mode again at its own widened values.
- **`resolve` in the runtime engine**: passes the hint into the evaluation.

### Data Flow
The caller passes the prompt and the hint. The router scores every mode, keeps the near-tied set, adds the hinted surface, orders workflow modes before surfaces and returns one validated route. `applySurfaceHint` still leads a tie between two matched surfaces.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup captures every case's current route and finds the parity gate. Implementation changes the score and the join in `canary-router.cjs` and passes the hint through the engine. Verification reruns the case file, the hint tests and the compiled route guard.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

`node --test .skilled/bin/tests/compiled-route-surface-hint.test.cjs` must print `fail 0`. Each case in `canary-cases.v1.json` is routed before and after, and the two lists are compared with `diff`. `scratch/probe-routes.cjs` is rerun as the check the measured behavior came from.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

None new. The build follows `.skilled/repo-rules/skill-hub-routing.md`, since it changes what a hub routes, and republishes the hub's compiled closure with `compiled-route-sync.cjs`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: a case in `canary-cases.v1.json` changes its route without a listed reason, or `compiled-route-guard.cjs` fails. Revert the one commit and republish the closure with `compiled-route-sync.cjs`.
<!-- /ANCHOR:rollback -->

---

