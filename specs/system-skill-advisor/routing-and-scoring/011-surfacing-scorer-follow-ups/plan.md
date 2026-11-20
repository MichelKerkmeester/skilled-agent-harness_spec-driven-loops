---
title: "Implementation Plan: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check"
description: "Adds phrase tolerance, a hyphen rule and a ticket-status rule to the explicit lane, and loads command bridges from the generated JSON at runtime. The compiled bridge block stays as fallback, and the two decided questions change no code."
trigger_phrases:
  - "surfacing scorer follow ups plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix eight skill and command surfacing gaps in the advisor scorer, its CLI JSON and its index freshness check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, in the advisor runtime under `.skilled/skills/system-skill-advisor/runtime/` |
| **Framework** | None. The scorer is an in-process library. |
| **Storage** | None. The loader reads one generated JSON file at runtime. |
| **Testing** | Vitest, and the TypeScript build check `tsc --noEmit -p tsconfig.build.json` |

### Overview
The change edits the explicit lane of the advisor scorer and adds one loader module. The loader reads the generated bridge JSON at runtime, and the compiled block stays as fallback. Each code change has tests, and the advisor suite and the typecheck show the build passes.
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
- [x] The advisor vitest suite passes with no failed test, and `npm run build` exits 0. The recorded run printed 2407 passed, 0 failed and 8 skipped across 188 files.
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: lane-based in-process scorer

### Key Components
- **Explicit lane (`lib/scorer/lanes/explicit.ts`)**: Matches prompt phrases to command and skill rows, and applies the review token boost. The phrase, hyphen and ticket-status changes live here.
- **Command bridge loader (`lib/scorer/command-bridge-loader.ts`, new)**: Renders the generated bridge JSON the way the deriver renders the compiled block. Without it, a keyword added to the JSON does not reach the scorer until a rebuild.
- **Projection (`lib/scorer/projection.ts`)**: Sets the command bridge constant from the loader result, with the compiled block as fallback.

### Data Flow
A prompt reaches the explicit lane, which scores command and skill rows. Command rows come from the command bridge constant. The loader fills that constant from the generated JSON when the file reads cleanly. Fusion then combines the lane scores, and the ambiguity step decides whether close candidates form a tie.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/scorer/lanes/explicit.ts` | Scores phrase and token matches for command and skill rows | update | Tests in `tests/scorer/command-phrase-tolerance.vitest.ts`, `tests/name-mention-scoring.vitest.ts` and `tests/scorer/review-status-wording.vitest.ts` |
| `lib/scorer/projection.ts` | Sets the command bridge constant that the scorer reads | update | `tests/scorer/command-bridge-loader.vitest.ts` |
| `lib/scorer/command-bridge-loader.ts` | Reads the generated bridge JSON at runtime | update (new file) | Three tests in `tests/scorer/command-bridge-loader.vitest.ts` |
| `lib/scorer/fusion.ts` | Applies the command adjustment and the low-information rule | not changed, kept by operator decision | Work record and the operator decision in `spec.md` section 10 |
| `lib/scorer/ambiguity.ts` | Builds the wide ambiguity set | not changed, kept by operator decision | `tests/scorer/advisor-quality-049-003.vitest.ts` pins the kept behavior |
| `lib/freshness.ts` | Probes `SKILL.md` for the source signature | not changed | Verdict recorded as inferred in `scratch/work-record.md` |
| CLI `advisor_recommend` | Returns recommendations to the CLI and to hooks | not changed | Per-lane attribution check recorded in `scratch/work-record.md` |

Required inventories: the work record has no producer or consumer searches, no matrix axes and no algorithm invariant for the phrase and path changes. These inventories are open. They are needed before the FIX COMPLETENESS checks in `tasks.md` can be ticked.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the clean advisor baseline in `scratch/advisor-baseline.txt`.
Implementation adds the four fixes to the explicit lane, the projection and the new loader, each with its tests.
Verification runs the advisor suite and the typecheck, re-runs the corpus check read-only, and records the two operator decisions.

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Command: the advisor vitest suite, then `npm run build`. The suite must print no failed test, and the build must exit 0.

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Explicit lane phrase tolerance, the hyphen rule and the review boost, and the bridge loader | Vitest |
| Integration | Advisor suite, and `advisor_recommend` on the named prompts | Vitest, advisor CLI |
| Manual | Named prompts on the built CLI, and per-lane attribution | Terminal (CLI) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vitest and the TypeScript build | Internal | Green | Tests and the typecheck cannot run |
| Operator decisions on the wide-cluster floor and command ranking | Internal | Green | None now. Both were decided on 2026-11-17, and both keep current behavior. |
| Generated bridge JSON | Internal | Yellow | Bridge edits reach the scorer only after the deriver writes the file, and a running daemon needs a restart |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A test in the advisor suite fails after the change, or the build fails.
- **Procedure**: Revert the edit in the file that failed. The changes are not committed, so the revert is per file. Then run `npm run build` and the advisor suite again.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Packet close-out |
<!-- /ANCHOR:phase-deps -->

---
