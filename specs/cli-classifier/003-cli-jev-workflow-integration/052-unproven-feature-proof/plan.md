---
title: "Implementation Plan: Phase 52: unproven-feature-proof"
description: "Shared keep-rule gates go into the scorer kit once, then each of the three scorers adopts them. The folder suggestion scorer gains a masked-state arm that runs live, and the clarify census runs over local transcripts. Section 8 holds the proof plan for each feature."
trigger_phrases:
  - "unproven feature proof plan"
  - "jev proof test plan"
  - "masked-state decision rule"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 52: unproven-feature-proof

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ESM, CommonJS and TypeScript |
| **Framework** | None |
| **Storage** | JSONL rows and run folders under `~/.skilled/.labels/` |
| **Testing** | `node --test` and vitest |

### Overview
The gates every scorer needs go into `scorer-report.mjs` once: the exact kill tail, the strongest-policy bar, the per-class floor and the power line. Each scorer then calls them in one verdict order. The folder suggestion scorer also gains a masked-state arm, and two recorded runs follow: that arm live against Jev, and the clarify census over local transcripts with no model call.
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
- [x] Tests passing, each new gate proven by a failing-first mutation
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared library with three consumers.

### Key Components
- **`scorer-report.mjs`**: synchronous gates and report lines, no call, no file write.
- **Three scorers**: each keeps its own verdict function and calls the shared gates in the fixed order.
- **Masked-state arm**: rewrites each row's state by a fixed rule, then runs the same arm as the primary with the same options, labels, order and scorer.

### Data Flow
Rows load, the baseline and simple policies are counted, the model arm records its calls, and the column counts flow into the verdict. Report lines print counts only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scorer-report.mjs` | Shared report pieces for all three scorers | Add gates and lines | `scorer-report.test.mjs` |
| Three `decideVerdict` functions | Each scorer's keep rule | Add the gates in one order | Each scorer's test file |
| Each scorer's `KEEP_RULE_LINE` | Printed rule, pinned by tests | Rewrite to the shared order | Test asserts the exact text |
| `jev-features.mjs` | The live feature registry | Unchanged, guarded by a test | `jev-features.test.mjs` |

Required inventories:
- Same-class producers: `rg -n 'function decideVerdict' .skilled/skills` lists the three verdict functions this phase aligns.
- Consumers of changed symbols: `rg -n 'KEEP_RULE_LINE|decideVerdict' .skilled/skills` lists the scorers and their tests.
- Matrix axes: verdict gate (8) by scorer (3). Each new gate gets a failing case and a passing case in each scorer.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Kit gates, power values checked against an independent scipy computation | `node --test` |
| Unit | Each scorer's verdict order and its new report lines | `node --test`, vitest |
| Integration | Stub-Jev runs of each scorer, including the masked-only arm | `node --test`, vitest |
| Mutation | Remove each new gate in a copy and confirm a test fails | Manual |
| Live | Masked-state arm against Jev, clarify census over transcripts | Recorded runs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Jev CLI and stored credential | External | Green, `jev auth status` exits 0 | The masked-state run waits |
| `~/.skilled/.labels/022-rows.jsonl` | Internal | Present, 40 labeled rows | The masked-state run has no corpus |
| Local session transcripts | Internal | Present under `~/.claude/projects/` | The census has nothing to count |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A changed scorer fails its suite or prints a verdict that contradicts its counts.
- **Procedure**: Revert the commit for that scorer. The kit additions are additive, so the other scorers keep working.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:proof-plan -->
## 8. PROOF PLAN PER FEATURE

All three features share one standard. A feature earns a live path only after a powered, pre-registered run on a real population keeps under the aligned rule, its controls hold, its consumer passes fail-open tests, and a shadow stage and a canary stage both pass. The bars are relative. The model must beat the strongest simple policy and must not fall below the baseline in any class. No absolute accuracy number is set.

### Shared rule, fixed before any new run

The verdict order is coverage, kill, margin, sign test, strongest policy, class floor, flips, keep. Every model verdict prints a power line: `power <arm>: pairs= win_rate= power= pairs_for_80= mde_win_rate=`. The power line informs the run size and decides nothing.

### Spec-track narrowing

- **Corpus**: real Gate 1 requests, gathered over time from consenting sessions, kept apart from any request used to tune the index.
- **Labels**: the operator names the gold track without seeing any pick.
- **Power**: at the 0.588 decided-pair win rate the repeat observed, the power helper needs 205 decided pairs for 80% power. The research's estimate of about 431 rows assumes the repeat's share of decided pairs per row.
- **Controls**: the paraphrase probes, the lookup and ripgrep baselines, always-none and majority as simple policies, and the per-track floor.
- **Decision**: a keep earns a shadow stage. A kill, or a powered run whose interval upper bound stays under the margin, retires the feature.
- **Consumer tests**: with the switch off, auth missing, a timeout or a malformed answer, the Gate 1 output equals the output without Jev.

### Routing clarify default

- **Now**: the census counts real clarify events in local transcripts, with no model call. It gives the real clarify rate.
- **Corpus**: real clarify events logged in shadow, with the mode the user went on to pick as the label.
- **Power**: at a 0.65 win rate the power helper needs 69 discordant pairs. The census rate turns that into a collection time.
- **Controls**: first-alternative, second-alternative and always-none as simple policies, and the floor across hub by mode-or-none classes, so abstention wins cannot carry the result alone.
- **Decision**: if the census projects a collection time the operator will not wait for, the feature retires. Otherwise a routing owner must approve an additive alternatives field before any shadow stage.
- **Consumer tests**: the route decision with Jev off, failing or malformed equals the route decision without Jev.

### Alignment folder suggestion

- **Now**: the masked-state arm runs live on the same 40 frozen rows. The mask removes the lead sentence naming the spec title, every sentence copied from an option's description, and every folder name and slug. Options, labels, order and scorer stay fixed.
- **Decision, fixed before the run**: a kill or any stop retires this question shape on this fixture. A keep earns only the design of a real-save corpus, never a live path.
- **Corpus after a keep**: real saves from transcripts, labeled with the folder the save finally landed in. Candidate recall is measured first, because a label outside the candidate set cannot be won.
- **Controls**: label swap, distractor state and masked state, with target and top as simple policies and the save-path class floor.
- **Consumer tests**: the save path with Jev off, failing or malformed keeps its current folder choice.

### Staged rollout for any feature that clears its gate

1. Shadow: the pick is logged and never used.
2. Canary: an opt-in switch serves the pick to the operator only.
3. Live: the feature joins `jev-features.mjs` with its own switch, and the registry guard test is updated in the same commit.
<!-- /ANCHOR:proof-plan -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Kit gates ──► Three scorers (parallel) ──► Live runs ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Kit gates | None | Scorers |
| Scorers | Kit gates | Live runs |
| Live runs | Masked-state arm | Verify |
| Verify | All | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Kit gates | Low | 1 hour |
| Scorers and masked arm | Med | 3 hours |
| Live runs and verification | Med | 2 hours |
| **Total** | | **6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes: runs write outside the repository
- [x] No feature flag: nothing is served
- [x] No monitoring needed: measurement code only

### Rollback Procedure
1. Revert the scorer commit that misbehaves.
2. Rerun that scorer's suite to confirm the old count.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
