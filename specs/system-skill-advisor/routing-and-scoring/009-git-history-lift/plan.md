---
title: "Implementation Plan: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor"
description: "Add one guarded sk-git branch to readOnlyRouteAllowed in the advisor scorer, move the test that forbids it and prove the lift with scorer tests, the suite, the divergence ratchet and live probes."
trigger_phrases:
  - "git history lift plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Framework** | None, the advisor scorer is plain modules |
| **Storage** | None |
| **Testing** | Vitest |

### Overview
Change one function, `readOnlyRouteAllowed` in `fusion.ts`, by adding one branch for sk-git as its last check. Change one test file, `route-gates.vitest.ts`. Prove it with the scorer tests, the full suite, the divergence ratchet and four live `advisor_recommend` probes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `rg -c "list the git branches" .skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` prints 1, so the test to move is where the spec says
- [x] `npx vitest run tests/scorer/route-gates.vitest.ts` exits 0 before any edit
- [x] The runtime's dependencies are installed in the checkout the work runs in

### Definition of Done
- [x] All acceptance criteria met
- [x] `npm test` in `.skilled/skills/system-skill-advisor/runtime` exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single guarded branch.

### Key Components
- **`readOnlyRouteAllowed` in `fusion.ts`**: decides whether a skill may leave the read-only floor. It gains the block below, placed last, after the `gate-3-classifier.ts` check.
- **`route-gates.vitest.ts`**: the scorer test that pins which prompts are lifted. No new file is added, because this file already owns these assertions.

```ts
  // Reading history is a git task even though its verb reads as a read-only
  // explainer. A lift applies to any prompt, so only a read-only question is
  // lifted, and only when it names git, a commit-history object or a branch ref.
  if (skillId === 'sk-git' && isReadOnlyExplainer(promptLower)
    && /\b(git|commit (?:history|log)|(?:recent|latest) commits?|last (?:\w+ )?commits?|branch(?:es)? (?:main|master|develop))\b/.test(promptLower)) {
    return true;
  }
```

The pattern was run outside the scorer on nine prompts. It matched the three in REQ-001 plus `list the recent commits on this branch`, `list the git branches` and `show the last commit`, and it rejected the decision-tree and lunch-menu prompts in REQ-002. It has not run inside the scorer.

### Data Flow
The scorer calls `readOnlyRouteAllowed(promptLower, skill)` for each candidate skill. A true result reaches `confidenceFor`, which returns the larger of the skill's base confidence and 0.82. A skill with no score and no lane hit is skipped before that step, so the lift never creates a candidate.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup confirms the test to move and a passing baseline. Implementation adds the block to `fusion.ts` and edits `route-gates.vitest.ts`. Verification runs the scorer tests, the suite, the ratchet and the live probes.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npx vitest run tests/scorer/route-gates.vitest.ts` exits 0 with the lifted and floored cases in it. `npm test` exits 0. After `npm run build`, `advisor_recommend` on `show me what changed in the last three commits` prints sk-git, and on `explain how the decision tree branches are pruned` prints no recommendation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node, Vitest and the TypeScript compiler the runtime already uses. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a corpus row or a live prompt outside git history starts returning sk-git. Revert the one commit that adds the block and the test edits, then run `npm run build` in the runtime folder so the CLI serves the old behaviour again.
<!-- /ANCHOR:rollback -->

---
