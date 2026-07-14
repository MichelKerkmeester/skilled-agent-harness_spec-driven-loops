---
title: "Implementation Plan: command-recipe choreography relocation + validator repair"
description: "Phase 1 (Lane C dead-branch cleanup) runs first and solo; Phases 2 and 3 (validator repair+strengthen; fixture+test hygiene) then run as a GPT-5.6 SOL max fast swarm on disjoint file surfaces, verified centrally and by a Sonnet pass."
trigger_phrases:
  - "choreography relocation plan"
  - "validator repair swarm plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/016-benchmark-authoring-centralization/006-command-recipe-choreography-relocation"
    last_updated_at: "2026-07-14T21:15:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the plan"
    next_safe_action: "Run Phase 1"
    blockers: []
    key_files: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: command-recipe choreography relocation + validator repair

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node/CJS scorer + ESM (.mjs) validator + vitest |
| **Framework** | deep-improvement Lane C skill-benchmark; sk-design command-surface validator |
| **Storage** | Filesystem skills; no DB change |
| **Testing** | vitest (skill-benchmark), the validator's own run, validate.sh |

### Overview
Act on the SOL ultra advisory (option C). Phase 1 removes the dead Lane C branch (crisp, safe, first). Phases 2 and 3 then execute as a GPT-5.6 SOL max fast swarm across disjoint surfaces — the validator (`.mjs`) and the fixtures+vitest — verified centrally, then by a fresh Sonnet reviewer.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] SOL advisory grounded + corrected against real files (validator is INVALID/10; fixture stale; test self-masks)
- [x] Disjoint swarm surfaces identified (scorer / validator / fixtures+vitest)
- [x] Spec folder + option C operator-directed

### Definition of Done
- [ ] skill-benchmark suite green incl. new negative tests; validator `invalid=0`
- [ ] No regression; frozen artifacts byte-identical
- [ ] validate.sh --strict Errors 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Sequenced cleanup then disjoint-surface swarm, central + adversarial verification.

### Key Components
- **Lane C scorer** (`score-skill-benchmark.cjs`): recipe↔metadata equality stays; wrapper-prose branch removed.
- **sk-design validator** (`design-command-surface-check.mjs`): the correct owner of design-command choreography enforcement.
- **Recipe fixtures + vitest**: committed gold made authoritative; test de-masked.

### Data Flow
The scorer keeps checking recipe/metadata agreement (fixture honesty). The sk-design validator becomes the authority that the runtime YAML assets implement the metadata choreography. The two layers stop overlapping.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `score-skill-benchmark.cjs` | Lane C recipe scorer w/ dead branch | update | suite green; dead branch gone |
| `design-command-surface-check.mjs` | Broken (INVALID/10) design validator | repair + strengthen | `invalid=0`; strengthened check + negative tests |
| `sk_design/*.private.json` | Stale recipe gold | refresh | matches live metadata |
| `skill-benchmark.vitest.ts` | Self-masking recipe test | de-mask | loads committed gold; negatives added |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Wave 1 (solo SOL max): remove the dead Lane C wrapper-prose branch + unused plumbing; keep recipe↔metadata equality; verify suite green

### Phase 2: Implementation
- [ ] Wave 2 Agent A (SOL max): repair the validator null-command synthesis to `invalid=0`, then strengthen the asset-level choreography check + negative tests
- [ ] Wave 2 Agent B (SOL max, parallel): refresh the stale recipe fixture; de-mask the vitest recipe test to load committed gold; add negative tests

### Phase 3: Verification
- [ ] Central re-verify (suite, validator run, node --check) + fresh Sonnet review
- [ ] validate.sh --strict Errors 0; commit + integrate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | recipe scoring, de-masked gold, validator mutations | vitest, validator negative tests |
| Contract | validator reaches VALID | `node design-command-surface-check.mjs` |
| Regression | full skill-benchmark suite | vitest |
| Spec | packet integrity | validate.sh --strict |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| vitest (deep-improvement) | Internal | Green | Scorer/test changes unverifiable |
| sk-design validator runnable | Internal | Broken (this packet repairs it) | Strengthen step blocked until repaired |
| SOL ultra advisory (option C) | External | Grounded | Direction |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate regresses, the validator repair changes an unrelated contract, or the strengthened check false-positives.
- **Procedure**: Work lands as scoped commits per phase; `git revert` restores. Phase 1 is pure dead-code removal; the validator repair is a root-cause fix re-provable via the validator's own `invalid=0` output.
<!-- /ANCHOR:rollback -->
