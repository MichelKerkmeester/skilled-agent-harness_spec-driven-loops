---
title: "Implementation Plan: Deprecate the deep-skill-benchmark lane"
description: "Remove the skill-benchmark workflow mode from every reachable surface: five runtime command trees, the hub registry and router pair, the advisor command-bridge projection, the lane's script and asset trees, and three runtime ledger libraries, while leaving other packets' report evidence and the two surviving improvement lanes intact."
trigger_phrases:
  - "implementation plan"
  - "skill-benchmark removal plan"
  - "deep-loop mode removal"
  - "command-bridge regeneration"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deprecate the deep-skill-benchmark lane

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and TypeScript, Python 3 for the advisor scorer |
| **Framework** | system-deep-loop parent-hub skill architecture |
| **Storage** | JSON registries and manifests on disk; no database |
| **Testing** | Vitest for the runtime suite, `parent-skill-check.cjs` for hub invariants, `validate.sh` for the packet |

### Overview
The lane is reached through a command surface, not through advisor scoring, because its registry entry carries `advisorRouting.routingClass: "command-bridge"`. Removal therefore runs command surfaces first, then the hub registry and router pair, then every generated artifact that projects them, and only then the shared files that would otherwise hold a broken import. Generated artifacts are regenerated from their own generators rather than hand-edited, because two of them are byte-drift checked.
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
Parent-hub skill with a declarative mode registry and a two-stage router.

### Key Components
- **`mode-registry.json`**: the single source of truth for the workflow mode set; removing the entry is what makes the mode unregistered.
- **`hub-router.json`**: stage-two routing; carries the mode's signal, its vocabulary class and its tie-break position.
- **`leaf-manifest.json`**: generated projection of every mode's leaf resources, byte-drift checked against a fresh regeneration.
- **Advisor command-bridge projection**: three files derived by `derive-command-bridges.cjs` from each skill's `command-metadata.json`.
- **`loop-host.cjs`**: the shared improvement-host entry point that dispatched the lane alongside the two survivors.
- **`append-mode-event.cjs`**: maps a mode name to its ledger schema module; the only live code that imported a deleted library.

### Data Flow
A request reaches the mode only through its `/deep:skill-benchmark` command surface, which loads the hub `SKILL.md`, then the `deep-improvement` packet contract, then the command's own workflow YAML, which dispatches `loop-host.cjs --mode=skill-benchmark`. Cutting the command surface and the registry entry severs both ends of that path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Command front doors (5 runtimes) | the only entry path to the lane | delete | `git ls-files` finds no lane command in any runtime tree |
| `mode-registry.json` / `hub-router.json` | registers and routes the mode | update | `parent-skill-check.cjs` reports 5 modes on checks 5b, 6b, 10d |
| `leaf-manifest.json` | generated leaf projection | regenerate | check 10b byte-drift passes against a fresh regeneration |
| Advisor bridge (py, json, ts) | projects the command to the advisor | regenerate | `derive-command-bridges.cjs` reports the three files changed; `py_compile` passes |
| `loop-host.cjs` | shared dispatcher for three lanes | update | `planInvocation` still returns the model-benchmark two-step plan |
| `append-mode-event.cjs` | mode to ledger-schema adapter | update | no import of a deleted module remains anywhere under `lib/`, `scripts/`, `tests/` |
| Other skills' `benchmark/reports/**` | historical run evidence | not a consumer | file count unchanged before and after |
| Shared improvement type unions | carry the mode name as a string literal | unchanged, recorded as residue | no import edge into the deleted libraries |

Required inventories:
- Same-class producers: `git grep -In "skill-benchmark"`, then bucketed per file rather than per line.
- Consumers of changed symbols: `grep -rn "skill-benchmark-ledger-schema\|skill-benchmark-reducers\|skill-benchmark-sealed-artifacts" lib/ scripts/ tests/`.
- Matrix axes: runtime tree (5), hub surface (8), generated artifact (4), shared code file (2).
- Algorithm invariant: a per-line exclusion filter hides a caller whose import path contains the excluded directory name, so the reference map must be bucketed by file.
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
| Unit | deep-loop runtime library and script contracts | Vitest (`runtime/tests/unit`) |
| Integration | hub registry, router, manifest and metadata invariants | `parent-skill-check.cjs` |
| Manual | `loop-host.cjs` planning for both surviving lanes | direct `node -e` smoke test |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `@spec-kit/runtime` build | Internal | Green | `validate.sh` refuses to run and exits 3 with no rule output |
| `derive-command-bridges.cjs` | Internal | Green | advisor projection would have to be hand-edited, risking drift |
| `generate-leaf-manifest.cjs` | Internal | Green | `leaf-manifest.json` byte-drift check fails |
| Worktree npm installs | External | Green | vitest and the hub root-router contract check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any surviving deep mode fails to resolve, or a shared improvement lane breaks.
- **Procedure**: `git reset --hard a1faf0914a` in the worktree restores every tracked file, then delete this packet folder. Nothing was pushed and no history was rewritten.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Inventory) ──► Phase 2 (Delete + registry) ──► Phase 3 (Verify)
                                    │
                          Phase 2b (Docs sweep)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Delete, Docs |
| Delete + registry | Inventory | Regenerate, Verify |
| Regenerate | Delete + registry | Verify |
| Docs sweep | Delete | Verify |
| Verify | Regenerate, Docs sweep | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | High | 1 session, dominated by separating lane source from other packets' evidence |
| Core Implementation | High | 1 session across 196 deletions and ~40 edits |
| Verification | Medium | 1 hub gate run, 1 runtime suite run, 1 packet validation |
| **Total** | | **1 working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - every deleted file is tracked at `a1faf0914a`
- [ ] Feature flag configured - not applicable, the removal is structural
- [ ] Monitoring alerts set - not applicable, no deployed service

### Rollback Procedure
1. `git reset --hard a1faf0914a` inside the worktree.
2. Remove `specs/system-deep-loop/047-deprecate-skill-benchmark/`.
3. Re-run `parent-skill-check.cjs` and confirm the hub reports six modes again.
4. No stakeholder notification needed; nothing left the worktree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Inventory  │────►│   Delete    │────►│   Verify    │
│  + baseline │     │  + registry │     │             │
└─────────────┘     └──────┬──────┘     └─────────────┘
                           │
                    ┌──────▼──────┐
                    │ Regenerate  │
                    │ + docs      │
                    └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Inventory + baseline | None | file map, gate baseline | Delete, Docs |
| Delete + registry | Inventory | 5-mode hub | Regenerate, Verify |
| Regenerate | Delete + registry | manifest, advisor bridge | Verify |
| Docs sweep | Delete | link-clean docs | Verify |
| Verify | Regenerate, Docs sweep | evidence | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory and baseline** - establishes which of 1254 matching files are lane source and which are other packets' evidence - CRITICAL
2. **Delete + registry surgery** - the irreversible-looking step, though fully tracked - CRITICAL
3. **Regenerate generated artifacts** - byte-drift checks fail without it - CRITICAL

**Total Critical Path**: three sequential steps; verification follows.

**Parallel Opportunities**:
- The two documentation sweeps (packet docs, hub and runtime docs) ran simultaneously on disjoint file sets.
- The runtime test suite ran while documentation edits proceeded elsewhere.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Inventory complete | lane source separated from preserved evidence | Phase 1 |
| M2 | Lane removed | hub reports 5 modes, no broken imports | Phase 2 |
| M3 | Verified | hub gate green, packet validates PASSED | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Regenerate generated artifacts rather than hand-edit them

**Status**: Accepted

**Context**: `leaf-manifest.json` is compared byte-for-byte against a fresh regeneration by hub check 10b, and the advisor command-bridge projection spans three files in two languages kept in sync by a drift guard.

**Decision**: Edit only the human-owned sources (`mode-registry.json`, `hub-router.json`, `command-metadata.json`), then run `generate-leaf-manifest.cjs` and `derive-command-bridges.cjs`.

**Consequences**:
- The byte-drift and drift-guard invariants stay satisfied without manual reconciliation.
- It requires the generators to be runnable in the worktree, which needed two npm installs.

**Alternatives Rejected**:
- Hand-editing all four artifacts: guaranteed to drift, and the drift only surfaces in CI.

### ADR-002: Leave the dead mode constant in shared improvement type unions

**Status**: Accepted

**Context**: `'skill-benchmark'` remains as a string literal in shared union types, adjudication contracts, the write-set census and a legacy projection manifest. The dependency direction is lane to shared, never the reverse, so nothing imports the deleted code.

**Decision**: Leave them, record them as residue, and hand the decision to the operator.

**Consequences**:
- The removal breaks nothing and needs no change to two live lanes or five of their test files.
- A vestigial mode name remains readable in shared contracts until the operator decides.

**Alternatives Rejected**:
- Stripping them now: a shared-contract change across two surviving lanes, well outside the frozen scope, for no functional gain.

---

