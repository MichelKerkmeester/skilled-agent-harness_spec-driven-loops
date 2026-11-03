---
title: "Implementation Plan: Phase 5: inferred-confirmations"
description: "Open each of proposal ranks 10 to 13 with one saved confirming read or run, record a confirmed-or-refuted verdict per rank, and fix only the confirmed ones, each with a test that fails without the fix."
trigger_phrases:
  - "inferred confirmations plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: inferred-confirmations

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and ESM scripts, TypeScript advisor and continuity runtime |
| **Framework** | sk-create-skill scripts, system-skill-advisor scorer, system-spec-kit retrieval and continuity CLIs |
| **Storage** | Trigger index JSON, spec-doc continuity blocks |
| **Testing** | `node --test` per touched script, advisor runtime tests, `ci-router-vocabulary-reach.cjs` |

### Overview
Four independent tracks, each shaped confirm, verdict, then fix or drop. The confirming run is saved before any code edit, the verdict goes in `decision-record.md`, and a fix lands only with a test that fails when reverted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `decision-record.md` holds four verdicts, each citing its saved run, and every touched script's tests exit 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Confirm, then fix.

### Key Components
- **Rank 10, `leaf-route-replay.cjs`**: reads an `INTENT_SIGNALS` dict, while the fundamentals router declares `INTENT_MODEL` with tuple keywords
- **Rank 11, alias matcher**: picks the sk-code mode from hub-router aliases; T004 locates it
- **Rank 12, `generate-trigger-index.mjs`**: defaults its repo root from the script's own directory
- **Rank 13, `generate-context.ts`**: routes a phase-parent save to a leaf and may score the payload 0 silently

### Data Flow
Each rank: saved run in `scratch/` leads to a verdict in `decision-record.md`, which leads to either a fix with a test or no code change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `leaf-route-replay.cjs` | Replays stage-two routing | update if confirmed | `leaf-route-replay.test.cjs` |
| Root-router validator | Accepts router grammars | update if the reject option is chosen | Its tests |
| Alias matcher (T004) | Matches prompt words to aliases | update if confirmed | Reach on every hub |
| `generate-trigger-index.mjs` callers | Rely on the default root | inventory before change | `rg -n "generate-trigger-index" .skilled .github` |
| `generate-context.ts` | Writes the save | update if confirmed | A zero-score save prints a reason |

Required inventories:
- Same-class producers: `rg -n "extractDictBody" .skilled/skills/sk-doc/sk-create-skill/scripts` for every reader of router dicts.
- Consumers of changed symbols: `rg -n "DEFAULT_REPO_ROOT|findRepoRoot" .skilled` before changing the trigger-index default.
- Matrix axes: rank 12 runs from a linked project and from the Skilled checkout, each with and without `--repo-root .`.
- Algorithm invariant: a refuted rank's files are unchanged.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup saves the four confirming runs and locates the alias matcher. Implementation fixes the confirmed ranks only. Verification reverts each fix to prove its test, reruns the touched suites and, for rank 11, reach on every hub.

**Executors.** Research and verification dispatches go to DeepSeek V4.1 Flash 1017 through opencode-go, with the model literal confirmed from `cli-pi/SKILL.md` and `cli-opencode/references/providers-and-models.md` before the first dispatch. Builds dispatch to `cli-codex --model gpt-6-luna -c model_reasoning_effort="xhigh" -c service_tier="fast"`, never through a gateway.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each confirmed fix | `node --test` on the touched script, advisor runtime tests |
| Integration | Rank 11 across all hubs | `ci-router-vocabulary-reach.cjs --concurrency 2` |
| Manual | Rank 12 from a linked project | A temp project that links the Skilled source |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001 to 003 closed | Internal | Yellow | Rank 11's reach run would measure a moving vocabulary |
| A linked-project fixture | Internal | Green | Rank 12 cannot be confirmed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A shipped fix moves reach on any hub or breaks a caller of the trigger-index default.
- **Procedure**: Revert that rank's commit alone with `git revert`; the four ranks land as separate commits so each reverts on its own.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (four confirming runs) ──► Implementation (confirmed ranks only) ──► Verification (revert-proof, suites, reach)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing for ranks 10, 12, 13; phases 001 to 003 for rank 11 | Implementation |
| Implementation | The four verdicts | Verification |
| Verification | Every confirmed fix | Parent closure |
<!-- /ANCHOR:phase-deps -->

---
