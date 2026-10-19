---
title: "Implementation Plan: Phase 10: config-row-projection-refusal"
description: "Send every CLI lineage state record through the append gateway by fixing the brief that told lineages to write the state log directly, with a failing-first test and rebuilt compiled contracts."
trigger_phrases:
  - "config row projection refusal plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 10: config-row-projection-refusal

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS runner, YAML workflow assets, vitest |
| **Framework** | None; the deep-loop runtime and its append gateway |
| **Storage** | Per-lineage ledger frames and the projected `deep-*-state.jsonl` |
| **Testing** | vitest from `system-deep-loop/runtime` |

### Overview
Prove the cause from the codex session log and a reproduction, then change the one instruction that contradicted the gateway rule. The test reads the built brief for research and review, for two CLI kinds, and checks that it names the gateway, covers the opening row and forbids direct writes.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
The ledger is the authority and the state log is its projection. Only the append gateway writes the log, and its attribution guard refuses a projection that would drop keys from a config row it did not write.

### Key Components
- **`buildLoopPrompt` in `fanout-run.cjs`**: the in-process brief a CLI lineage reads first.
- **`step_create_state_log`** in the auto workflows: opens the run through the gateway.
- **`assertNoAttributionCollapse`** in `shadow-projection-store.ts`: the guard that refused Luna's appends.

### Data Flow
The runner builds the brief and starts the lineage. The lineage opens the run with `run_initialized` through the gateway, then hands each iteration record to it. The gateway appends to the ledger and refreshes the state log from it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `buildLoopPrompt` in-process directive | Tells a CLI lineage how to run each iteration | update: gateway for every state record | new prompt test |
| Research and review CLI output contracts | `findingsCount` and timestamp lines | update: name the record handed to the gateway | new prompt test |
| Pre-dispatch notes in both auto workflows | Rule for an in-process lineage | update: name the gateway | YAML parse; compiled-contract freshness test |
| Compiled research and review contracts | Digest of the workflows | regenerate | `render-command-contract` suite |

Required inventories:
- Same-class producers: `rg -n "state record" .skilled/skills/system-deep-loop/runtime/scripts .skilled/commands/deep/assets` lists no remaining direct-write instruction.
- Consumers of the changed text: the CLI lineages that read the brief, and the renderer that checks the compiled digests.
- Matrix axes: loop type (research, review) by CLI kind (cli-codex, cli-opencode).
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
| Unit | The built brief for research and review lineages | vitest |
| Regression | The 41 deep-loop suites that read the runner, the workflows or the compiled contracts | vitest |
| Red proof | The HEAD runner swapped in, then restored | `git show`, `cmp` |
| Reproduction | Luna's config, state log and iteration event through the gateway | `append-mode-event.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The codex session log for the failed lineage | Internal | Green | The cause would rest on inference |
| `compile-command-contracts.cjs` | Internal | Green | The fix-mode renderer would refuse the edited workflows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a CLI lineage regresses after merge.
- **Procedure**: revert the phase commit and rebuild the two compiled contracts. No stored data changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Root cause ──► Red test ──► Brief fix ──► Workflow notes + contracts ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Root cause | The failed run's records | Red test |
| Red test | Root cause | Fix |
| Fix and notes | Red test | Verify |
| Verify | All above | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | The root cause and reproduction |
| Core Implementation | Low | A few lines of brief and notes |
| Verification | Low | One suite run and a red swap |
| **Total** | | **A couple of hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): no data changes
- [x] Feature flag configured: not applicable to prompt text
- [x] Monitoring alerts set: the fan-out already records `projection_refusal`

### Rollback Procedure
1. Revert the phase commit.
2. Rerun `compile-command-contracts.cjs --write` for `deep/research` and `deep/review`.
3. Rerun the related deep-loop suites.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
