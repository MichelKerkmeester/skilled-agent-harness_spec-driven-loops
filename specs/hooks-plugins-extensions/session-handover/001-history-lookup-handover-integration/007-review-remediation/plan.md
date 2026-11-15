---
title: "Implementation Plan: Phase 7: review-remediation"
description: "Fix the claim-path code the deep review flagged, each fix behind a test that fails first, then correct the receiver guidance, packet docs, catalog and playbook to match."
trigger_phrases:
  - "review remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: review-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM hooks, TypeScript runtime compiled to `runtime/dist` |
| **Framework** | None |
| **Storage** | Hook state JSON files under the temp folder, runtime transcript stores |
| **Testing** | `node --test` for the handover hooks, Vitest for the history runtime |

### Overview
Four code files change: the lookup command's store root and refusal union in `cli.ts`, the checkout guard and transcript folder check in `relaunch-core.cjs`, the removed prepare-time mint in `session-handover.cjs` and the entry's refusal in `history-lookup.mjs`. Each fix lands behind a test that fails on the old code. The docs the review named are then corrected to the new behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` reports `fail 0`, and the history and compaction vitests report every test passed
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed claim guard.

### Key Components
- **`handoverLookupSection`**: places the receiver and the note's folder, compares their checkouts, and only then mints.
- **`mintHandoverLocator`**: refuses a transcript whose first recorded working folder belongs to another checkout.
- **`storeRootFor` in `cli.ts`**: resolves the Claude store from `CLAUDE_CONFIG_DIR` before `~/.claude`, matching the mint.

### Data Flow
`claim` reads the note, places both folders, mints a locator from the sender's transcript into the sender's hook state, and prints the section. The printed command reads that hook state, finds the transcript under the same store root and answers the operation.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup captures the post-merge baseline: 999 handover tests and 149 history and compaction vitests, all passing. Implementation fixes the four code files, each behind a failing test, then corrects the receiver guidance, packet docs, catalog and playbook. Verification reruns both suites, the sk-code quality gate and `validate.sh --strict --recursive` on the parent. `tasks.md` holds the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Each new code test runs first on the unfixed code and must fail there. The claim-then-redeem test runs the real entry and compiled core against a transcript written only under `CLAUDE_CONFIG_DIR`, and asserts the fixture text, so one test covers both the store root and the redeem path.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`npm run build` in `.skilled/skills/system-spec-kit/runtime` after each `cli.ts` change. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a claim that should print the lookup section prints none. Revert the phase's commit and rebuild the runtime.
<!-- /ANCHOR:rollback -->

---
