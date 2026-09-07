---
title: "Implementation Plan: Template contract alignment"
description: "Census the synthesis against the manifest, the scaffolder and the rules, then change the contract and the two drifted tools first and rewrite the documents to match, with smoke scaffolds proving the new flag."
trigger_phrases:
  - "template alignment plan"
  - "contract single authority"
  - "goal flag smoke test"
  - "version parity test"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Template contract alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON manifest, Bash scaffolder and rules, TypeScript validator, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest for the goldens, resolver and parity suites; smoke scaffolds through `create.sh --path` into a temporary directory |

### Overview
The lane's fifteen P1 and twenty P2 rows were re-read against the manifest, `create.sh` and the rules. The contract changed first, so the validator could drop its hardcoded pair; the scaffolder gained its flag and lost its grep; the two drifted tools were repaired; then every document was rewritten to the acting system in one literal-replacement script. Smoke scaffolds proved the flag and surfaced one template defect before commit.
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
Contract-first alignment: the manifest's `levels` rows are the one authority, and code and prose are brought to them.

### Key Components
- **`templates/spec-kit-docs.json`**: the level contract, now listing every lazy add-on the validator may see
- **`create.sh`**: reads the contract for the closure document and scaffolds `goal.md` on request
- **`template-version-parity.vitest.ts`**: the new guard over manifest versions, the flat lazy list and the checker path

### Data Flow
Manifest → level-contract resolver → scaffolder and validator. Template marker → manifest version → parity test. Coverage result → floor → advisory, or failing under the enforce switch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lazyAddonDocs` at every level | The add-on list | update | resolver suite with updated pins; parity suite asserts the four numbered lists equal |
| `spec-doc-structure.ts` inclusion set | Structure check scope | update | structure suite; strict validation of this packet and the parent |
| `create.sh` closure decision | Scaffold set | update | goldens; smoke scaffold at Level 2 carries the closure document |
| `create.sh --with-goal` | New scaffold flag | create | smoke scaffolds at Level 1 and Level 3 carry a `goal.md` that passes the memory-block rule |
| Documents naming the retired checklist, the bridge template or the old ladder | Prose | update | residue search; sk-doc validator |

Required inventories:
- Same-class producers: `grep` for `lazyAddonDocs`, `context-index`, `checklist.md`, `templates/manifest` and `Hard block` across the skill and the root README.
- Consumers of changed symbols: the resolver test was the only consumer pinning the lazy list; the goldens exercise `create.sh`.
- Matrix axes: level (1, 2, 3, 3+, phase, review, research) by document class (core, lifecycle, optional, lazy); every cell read from the manifest.
- Algorithm invariant: a document is in the validator's scope only when the contract for that level names it, or when it is present and the contract lists it as optional or lazy.
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
| Unit | Goldens, resolver, parity, workflow invariance; the runtime structure and resume suites; the drift guard | vitest |
| Integration | Runtime and CLI builds; `npm run check`; dist freshness; three smoke scaffolds validated strictly; the repaired checker over the repository | npm, bash |
| Manual | Residue search; sk-doc validator on seven documents | grep, python |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Censused ledger from 004 | Internal | Green | Nothing to align without it |
| A rebuilt runtime dist | Internal | Green | The validator change would not reach `validate.sh` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a packet that validated before fails on document inclusion, or the new flag scaffolds a document the validator rejects
- **Procedure**: `git revert` the single commit and rebuild the runtime and CLI
<!-- /ANCHOR:rollback -->

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
| Setup | Med | 1 hour of census |
| Core Implementation | Med | 1.5 hours |
| Verification | Med | 30 minutes |
| **Total** | | **About 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - not needed; history holds the removed template
- [x] Feature flag configured - none; the new flag is opt-in by construction
- [x] Monitoring alerts set - the parity suite is the alert

### Rollback Procedure
1. `git revert` the alignment commit
2. Rebuild the runtime and the CLI
3. Rerun the goldens and the resolver suite
4. No stakeholders to notify; the surfaces are internal

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
