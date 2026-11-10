---
title: "Implementation Plan: Phase 27: alignment-preexisting-gaps"
description: "Fix the three pre-existing alignment gaps in three parallel Opus medium lanes (README checkers, advisor routing, the alignment aggregator), then run the conductor gates: sk-doc script tests, advisor gates, Hermes sync, strict validation and a fresh Opus medium review."
trigger_phrases:
  - "alignment preexisting gaps plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 27: alignment-preexisting-gaps

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 checkers, JSON and Markdown routing metadata, Node.js CommonJS aggregator, YAML workflows |
| **Framework** | None |
| **Storage** | None |
| **Testing** | pytest through `run-script-tests.sh`, vitest in system-skill-advisor, a rerun of the aggregator on copied run folders |

### Overview
Three Opus medium lanes run in parallel because they own disjoint files: Lane R the two README checkers and their tests, Lane A the sk-doc routing vocabulary and the advisor corpus, Lane T the gitignored alignment aggregator and its workflows. The conductor then runs the sk-doc script tests, the advisor gates, the CLI suite only if spec-kit code changed, the Hermes sync, strict validation and a fresh Opus medium review. The proof is the before and after checker counts, the eight advisor probes ranked as required, and an aggregator rerun whose counts change as the overrides say.

> **Amendment (2026-10-27):** Lane A's metadata fix moved only 2 of the 4 changelog probes. On the operator's "fix not fixed items" and "fix all", the conductor approved one narrow scorer rule: a changelog-from-packet exception in `primaryIntentBonus` (`fusion.ts`) with two constants in `scoring-constants.ts`, +0.12 for sk-doc and -0.12 for system-spec-kit. The operator's "fix all, perfect it" also brought in the README lines the stricter reference checker exposed as real broken references or shorthand. The scope amendment in `spec.md` §3 records both. The original plan text is kept.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The items R1, R2, A1, T1 and T2 and their lanes are recorded in `scratch/items.md`
- [x] The baselines are captured: the two checkers on the seven READMEs, and the advisor scores for the eight probes

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints no FAIL line and exits 0
- [ ] `validate.sh --strict` on this phase prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at the producer: the checker, the routing metadata and the aggregator change, never their inputs.

### Key Components
- **Lane R, README checkers**: `check_readme_references.py` and `check_derived_readme_counts.py` in `.skilled/skills/sk-doc/sk-create-readme/scripts/`, with tests in `.skilled/skills/sk-doc/scripts/tests/`.
- **Lane A, advisor routing**: sk-doc and sk-create-changelog routing vocabulary and `graph-metadata.json`, compiled through the normal generators, and the advisor corpus or golden prompts.
- **Lane T, alignment tool**: the alignment command's aggregator (gitignored, operator-local), with its two workflow YAMLs and its presentation contract beside it. These are gitignored, and the conductor syncs the main checkout copy afterwards.

### Data Flow
A README reference that starts with `/` and names a command resolves against `.skilled/commands/<group>/<name>.md`. A prompt about a packet changelog scores sk-doc first and reaches the sk-create-changelog compiled route, which refuses it and offers a global entry. The critic writes `overrides` into `critic.json`, and the aggregator reads them, moves or drops the named findings and recounts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check_readme_references.py` | Resolves README references as paths | update | before and after counts on the seven READMEs and the new tests |
| `check_derived_readme_counts.py` | Flags numeric count claims | update | before and after counts and the new tests |
| `sk-doc-script-tests.yml` and `run-script-tests.sh` | Run the sk-doc script tests in CI | unchanged | `run-script-tests.sh` picks up the new `test_*.py` |
| sk-doc routing vocabulary and `graph-metadata.json` | Feed the advisor and compiled routes | update | the eight probes and the advisor gates |
| The advisor scorer | Ranks skills | unchanged. **Amended 2026-10-27:** update, the changelog-from-packet rule in `primaryIntentBonus` and two constants only | The full advisor suite and the golden, prompt-policy and holdout suites |
| Five of the seven READMEs | Describe their surfaces | unchanged. **Amended 2026-10-27:** update, only lines the stricter checker exposed as real broken references or shorthand | `check_readme_references.py` on the seven READMEs prints 0 unresolved |
| `aggregate-findings.cjs` and the critic step | Build the alignment report | update | the aggregator rerun on copied run folders |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup records the baselines, Implementation runs the three lanes in parallel, and Verification runs the conductor gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each fixed false-positive class, one real broken path, one wrong count | pytest through `run-script-tests.sh` |
| Integration | The eight advisor probes and the advisor gates in `scratch/items.md` | vitest in system-skill-advisor, `skill-graph-freshness.cjs --strict`, `compiled-route-guard.cjs`, `compiled-route-admission.cjs --all`, `generate-router-intent-signals.cjs --check`, `skill_graph_compiler.py --validate-only` |
| Manual | The aggregator rerun on copies of both run folders and on a lane file with numeric ids | `node aggregate-findings.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The two alignment run folders in the alignment run output (gitignored), runs 20261027T154036Z and 20261027T171418Z | Internal | Green | T2 has no fixture to rerun the aggregator on |
| The advisor generators and compiled-route gates | Internal | Green | A1 cannot be compiled or proven |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a real broken path or wrong count passes a checker, a true spec-kit prompt moves off system-spec-kit, or an advisor gate fails.
- **Procedure**: revert the phase commit for Lanes R and A. For Lane T, restore the aggregator and workflow files from the main checkout copy, which stays unchanged until the conductor syncs it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation (3 lanes in parallel) ──► Verification (conductor)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | The recorded baselines | Verification |
| Verification | All three lanes | Close |
<!-- /ANCHOR:phase-deps -->
