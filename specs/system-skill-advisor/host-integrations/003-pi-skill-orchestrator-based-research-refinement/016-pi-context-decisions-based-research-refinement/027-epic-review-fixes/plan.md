---
title: "Implementation Plan: Fix the findings of the fresh epic review"
description: "Delete the dead advisor settings, the dead eval script and the unused scoring inputs, forward two location keys through the launcher, drop the retired Python boosts, and add one test that runs the doctor's lane cleanup commands. The advisor, ratchet, Python, doctor and residue gates prove it."
trigger_phrases:
  - "epic review fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Fix the findings of the fresh epic review

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, CommonJS, Python 3 |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest, `node --test`, the Python advisor suite |

### Overview
Most of the change is deletion in the advisor scorer and its docs. Two keys join the launcher's child env allowlist, and the doctor contract suite gains one case that runs the cleanup tool. The gate set in section 5 proves default routing did not move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. Evidence: `spec.md` sections 2 and 3, from `evidence/review-report.md`.
- [x] Success criteria measurable. Evidence: `spec.md` section 5.
- [x] Dependencies identified. Evidence: section 6.

### Definition of Done
- [x] All acceptance criteria met. Evidence: `acceptance-criteria.md`.
- [x] The advisor suite passes with 4 skipped and the ratchets pass. Evidence: `implementation-summary.md` Verification.
- [x] Docs updated (spec/plan/tasks).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dead code removal

### Key Components
- **Advisor scorer** (`fusion.ts`, `scoring-constants.ts`, `lanes/bm25.ts`): loses three paths nothing reaches under the daemon.
- **Launcher allowlist** (`system-skill-advisor-launcher.cjs`): gains the two location keys the daemon reads.
- **Doctor contract suite** (`doctor-update-contract.test.cjs`): gains a case that runs the cleanup commands.

### Data Flow
An operator's setting passes the launcher allowlist into the daemon's env, and the scorer reads it there. A setting the allowlist drops never reaches the scorer, which is why finding 2 is fixed in the launcher, not in the scorer.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `scoring-constants.ts` | Holds the calibration constants and the dead override | update | `git grep resolvedCalibration` prints nothing |
| `fusion.ts` | Scores the prompt | update | Advisor suite and scorer-eval ratchet |
| `lanes/bm25.ts` | Shadow BM25 lane | update | Advisor suite |
| Launcher allowlist | Filters the daemon env | update | New launcher-bootstrap case |
| `skill_advisor.py` | Degraded-mode scorer | update | Python suite, corpus and divergence ratchets |
| `ENV-REFERENCE.md`, `.env.example` | Operator docs for settings | update | `git grep CALIBRATION_OVERRIDE` prints nothing outside history |
| `route-exclusions.ts`, `feedback-calibration.ts` | Read the two forwarded keys | not a consumer of the change | Unchanged; they already read the keys |
| `bench/scorer-calibration.bench.ts` | Reads the calibration constants | not a consumer | It reads no removed name |

Required inventories, run before the edits:
- Same-class producers: `git grep -n -E 'semanticSearchCodeGraph|CALIBRATION_OVERRIDE|resolvedCalibration|QUERY_CLASS_ROUTING|BM25_QUERY_LENGTH|hasExplicitWorkflowSignal|score-outcome-rerank'` outside `specs/` and changelogs.
- Matrix axes: setting state (unset, set) by process (caller, daemon) for the two forwarded keys.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the baseline, Implementation makes the edits per finding, and Verification reruns the whole gate set.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Launcher allowlist, scorer, rerank and projection tests | Vitest |
| Integration | The cleanup commands run on a fixture checkout | `node --test` |
| Regression | Scorer-eval, divergence, holdout and corpus ratchets, Python suite | Vitest, Python |

Gate set: advisor typecheck, clean build and suite, the four ratchets, the Python suite, speckit typecheck, doctor `run-all.sh`, command bridges check, trigger index check, link check, advisor leaf manifest, residue repo mode, the residue gate test and the residue tool's own suite.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sweep-lane-residue.mjs` flags `--db-dir` and `--socket-dir` | Internal | Green | The contract case could not keep the run inside a temp folder |
| A built advisor `dist/` in the worktree | Internal | Green | The advisor suite reads the build |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing regression traced to the removed code, or an operator who relied on a removed setting.
- **Procedure**: Revert the merge commit on main. The removed settings never reached the daemon, so no stored state depends on them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The worktree and a scanned skill graph | Implementation |
| Implementation | The baseline numbers | Verification |
| Verification | Every edit | Merge |
<!-- /ANCHOR:phase-deps -->

---
