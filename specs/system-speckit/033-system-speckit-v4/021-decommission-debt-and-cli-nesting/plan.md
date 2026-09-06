---
title: "Implementation Plan: Decommission debt fixes and runtime alignment"
description: "Fix the six recorded debt items at source with tests, move the trigger index under runtime, then align both packages with the OpenCode standards through five fresh agents on disjoint folder sets, verifying behavior is unchanged before and after."
trigger_phrases:
  - "decommission debt plan"
  - "two lanes alignment"
  - "freshness walker fixtures ignored"
  - "fan-out runner lineage stderr"
  - "runtime data trigger index"
  - "code readmes one per folder"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Decommission debt fixes and runtime alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js CommonJS and ESM scripts, Bash rule scripts |
| **Framework** | None; spec-kit runtime and scripts packages |
| **Storage** | The committed trigger index under `runtime/data/` |
| **Testing** | Vitest, node --test, the sk-doc document validator, the package gates |

### Overview
Two lanes. My lane fixes the recorded debt with surgical edits and tests, moves the index and deletes the retired runbook, then commits so the tree is stable. Five Sonnet agents then align disjoint folder sets of `runtime/` and `scripts/` with the code standards and refresh or write code READMEs, each reporting before-and-after evidence; I review the reports, run the gates and commit.
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
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two-package skill: `runtime/` engine consumed as a library, `scripts/` CLI workspace over it, `shared/` beneath both.

### Key Components
- **Freshness walker**: hashes package sources; now ignores generator fixtures and symlinks.
- **Fan-out runner**: dispatches review lineages; now keeps their stderr.
- **Code READMEs**: one per code folder, current-state, validator-clean.

### Data Flow
The generator writes `runtime/data/trigger-index.json`; the lookup reads it; the freshness walker no longer sees the generator's fixture rewrites as source churn.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `collectSourceFiles` in `dist-freshness.cjs` | source hashing for every watched package | update | walker tests; `check-all` fresh after two index runs |
| `runLineageProcess` in `fanout-run.cjs` | lineage dispatch result | update | stderr retention test; `logs/fanout-lineage.err` written |
| Trigger-index readers (lookup, parity, cold-lookup, doctor asset, agent mirrors, docs) | resolve the index path | update | grep for the old path returns nothing outside specs |
| Advisor mirrors of `deep-review` | must match the source agent | update | `check-agent-mirror-sync.cjs` OK |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
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
| Unit | walker, lineage stderr, shim override | Vitest |
| Integration | retrieval suites, package gates, validate strict | Vitest, shell |
| Manual | agent reports reviewed against their commands | Read the output, not the claim |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `sk-code-opencode`, `sk-create-readme` | Internal | Green | Standards and template the agents load |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a touched suite or gate regresses after an alignment commit.
- **Procedure**: revert the alignment commit for that folder set; the debt fixes are separate commits and stand alone.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | packet and inventory |
| Core Implementation | Med | debt fixes one session; alignment by five agents in parallel |
| Verification | Med | gates before and after |
| **Total** | | **one session plus the agent fan-out** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop any running agent.
2. `git revert` the offending commit; each lane is its own commit.
3. Rerun typecheck, the touched suites and validate strict.
4. Record the reversal in this packet.

### Data Reversal
- **Has data migrations?** No; the index moved as a file and regenerates from the tree.
- **Reversal procedure**: `git mv` it back and revert the path edits.
<!-- /ANCHOR:enhanced-rollback -->

---

