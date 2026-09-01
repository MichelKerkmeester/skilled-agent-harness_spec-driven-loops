---
title: "Implementation Plan: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode"
description: "Re-pin each stale authored manifest and rebuild the promoted mirror, restore the verify gate to the manifest-sensitive signal, then move the human voice vocabulary to its owning mode under a replay harness proved against the live engine."
trigger_phrases:
  - "re-pin a stale activation manifest"
  - "rebuild the promoted routing mirror"
  - "counterfactual routing replay"
  - "hub vocabulary ownership plan"
importance_tier: "high"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Restore compiled routing to serving authority and give the human voice vocabulary to its owning mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

A parent hub compiles its router from `hub-router.json` and `mode-registry.json`. An
activation manifest pins the hash of that compiled policy, and at serve time the resolver
compares the pin against what the engine actually produces. When they disagree the resolver
falls back to legacy and reports `stale-manifest`. Nothing bumps the pin on its own, so a
hub whose vocabulary changed keeps a compiled router nobody reads.

The promoted mirror under `.opencode/bin/lib/compiled-routing` is a copy of an authored
closure that lives in the router unification program. Editing the mirror directly makes it
diverge from its source, so the pin has to be refreshed in the authored tree and promoted.

### Overview

Three moves, each proved before the next. Re-pin and rebuild so the hubs serve. Restore the
verify gate that a previous fix had widened past the manifest. Then change vocabulary, with
a harness that scores candidates through the production compiler and router rather than a
re-implementation of their semantics.
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
- [x] Tests passing: manifest suite 42 of 42, bin suite 34 of 34
- [x] Docs updated (spec/plan/tasks/acceptance-criteria/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Compile-then-pin. A hub's routing policy is compiled from authored inputs, hashed, and the
hash is pinned in an activation manifest that the resolver checks before it will serve.

### Key Components

- **`registry-compiler.cjs`**: turns a hub's router and registry into a routing model, and
  unions each mode's compiled keywords from its registry aliases and its router classes
- **`router.cjs`**: scores modes by how many keywords the text contains, times the mode's
  weight, then keeps everything within the ambiguity delta
- **`compiled-route-manifest.cjs`**: mints, refreshes and freshness-checks the pin
- **`compiled-route-sync.cjs`**: traces the authored closure and promotes it, retaining a
  rollback sibling until the publication is finalized

### Data Flow

Authored inputs compile to a policy, the policy hashes to a pin, the pin is promoted with
the closure, and at serve time the resolver re-compiles and compares. Equal means compiled
serving. Unequal means legacy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compiled-route-sync.cjs` verify gate | Decides whether a promoted root may serve | Update: return the promoted-root test to the manifest-sensitive route | Manifest suite reported `pass 42 fail 0`, including the missing, malformed and invalid manifest cases |
| `compiled-route-sync.cjs` authored gates | Decide whether the authored closure may be promoted | Unchanged from the prior fix: reachability is the right question there, since a stale pin is what a rebuild clears | The rebuild ran and promoted 48 closure files |
| `hub-router.json` vocabulary classes | One half of a mode's compiled keywords | Update: rehome the human voice terms, narrow the quality-action verbs | Frozen 207-probe replay through the shipped engine |
| `mode-registry.json` aliases | The other half of a mode's compiled keywords | Update: the same terms, or the change is half-applied and silently inert | A first attempt that touched only the router measured zero effect, which is how the registry half was found |
| Activation manifests, authored | The pin the resolver checks | Update: re-pin three hubs | `compiled-route-status.cjs --all` reports `compiled-serving` for all five |
| Activation manifests, promoted | The copy the resolver reads | Update: rebuilt from the authored closure, never edited in place | `--verify` reports 0 reads under the spec tree |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Manifest mint, refresh, freshness, runtime-root binding, build guards | `node --test` |
| Unit | Compiled routing foundation and flag propagation | Vitest, `vitest.config.bin.ts` |
| Integration | Every hub's serving authority and the move simulation | `compiled-route-status.cjs`, `compiled-route-sync.cjs --verify` |
| Replay | A frozen 207-probe corpus, scored through the production compiler and router | Purpose-built harness, validated by a no-op control |
| Regression | Stage-one advisor decisions | `skill_advisor_regression.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Authored closure under the router unification program | Internal | Green | No rebuild is possible, and the hubs stay on legacy |
| The publication writer lease | Internal | Green | Manifest writes report `publication-locked` until the open publication is finalized |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any hub failing to reach `compiled-serving`, or the manifest suite failing
- **Procedure**: `compiled-route-sync.cjs --revert <rollback>` while the publication is open,
  otherwise `git checkout` the authored manifests and the two skill JSON files, then rebuild
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
| Setup | Medium | Locating the pin, the authored root and the two vocabulary halves |
| Core Implementation | Medium | Re-pin, rebuild, restore the gate, rehome the vocabulary |
| Verification | High | Building a replay harness and proving it reproduces the live engine |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured: the pin, generation and serving authority of all five hubs
- [x] Rollback named before the first write, and the build retains a rollback sibling
- [x] Gates identified and run before the publication was finalized

### Rollback Procedure
1. While the publication is open, `compiled-route-sync.cjs --revert <rollback>`
2. Otherwise `git checkout` the three authored manifests and the two skill JSON files
3. Rebuild with `compiled-route-sync.cjs`, then confirm with `--verify` and `--all` status
4. No stakeholder notice needed: routing is internal to this workspace

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

