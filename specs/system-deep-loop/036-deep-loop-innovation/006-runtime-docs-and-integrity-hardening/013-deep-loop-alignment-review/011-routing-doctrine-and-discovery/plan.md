---
title: "Implementation Plan: routing doctrine and discovery vocabulary"
description: "One always-loaded statement per hub in the artifact the runtime reads, and the deep-loop discovery vocabulary pruned to live families."
trigger_phrases:
  - "implementation plan"
  - "routing doctrine"
  - "enforcement trace"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: routing doctrine and discovery vocabulary

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON policy artifacts, Markdown documents, CommonJS compiler |
| **Framework** | The compiled-routing compiler chain under `.opencode/bin/lib/compiled-routing/` |
| **Storage** | Activation manifests, runtime copy plus authored copy |
| **Testing** | The runtime vitest suite, the compiled-route guard, and the root-metadata gate |

### Overview

The two artifacts had to be adjudicated by what actually runs, and the answer decides the edit.
Reading the live compiled policies for all five graduated hubs shows no `defaultResource` key in
any of them, and the compiled-policy schema is `additionalProperties: false` with no such property,
so a compiled route can never carry one. The field is an authored policy expression that the
running router does not read. What the field *describes*, though, is a real and distinct concept, and
the repository's own authoring contract names it: `parent-hub-router-schema.md` §4 defines
`defaultResource` as the paths loaded when no more specific resource wins, describes the defer-routed
hub pattern by name, and names `system-deep-loop`, `mcp-tooling` and `cli-external-orchestration` as
that shape.

Consumer support was measured per hub rather than assumed, and it is uneven. `sk-code`'s `SKILL.md`
route loop calls `load_if_available("shared/README.md")` on its zero-signal branch three times, the
same path its JSON carries. `sk-doc`'s loop reads
`hub_router.routerPolicy.defaultResource` by name. `mcp-tooling` states the fallback-only contract in
both its `SKILL.md` and a playbook scenario that asserts it. `system-deep-loop` and
`cli-external-orchestration` have no pseudo-code site referencing the field at all; their JSON values
are sanctioned by the schema's defer-routed pattern rather than by a measured consumer.

That makes `hub-router.json` the authoritative artifact for the fallback concept and `ROUTER.md`'s
`DEFAULT_RESOURCE` the authoritative artifact for the preamble concept, and each hub's JSON now
says so in a key a reader can act on.
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
- [x] Guard and metadata gate passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two artifacts per hub, one concept each, named rather than merged.

### Key Components

- **`routerPolicy.defaultResource`**: the zero-signal fallback, consumed by the hub's `SKILL.md` route loop.
- **`ROUTER.md` `DEFAULT_RESOURCE`**: the stage-two always-loaded preamble, parsed by the deterministic router-replay.
- **`defaultResourceSemantics`**: the discriminator, already precedented by `mcp-tooling` and asserted `fallback-only` by the standalone-rollout harness.
- **`defaultResourceContract`**: the prose form of the same statement, precedented by `mcp-tooling`.

### Data Flow

`hub-router.json` bytes feed `sourceBytes` in each hub's compiler, so any edit to the policy block
changes `sourceHashes` and therefore `effectivePolicyHash`. The activation manifest binds that hash,
so the edit and the re-mint belong in one change or the hub serves legacy against a manifest nobody
re-minted.

### The enforcement trace

This is the measurement the finding rested on, re-run rather than quoted:

| Probe | Result |
|-------|--------|
| Live `loadHubEngine()` policy keys, all five hubs | No `defaultResource` key in any policy |
| `compiled-policy.v1.schema.json` | `additionalProperties: false`, no such property — a compiled route cannot carry it |
| Each hub's `registry-compiler.cjs` | `002`/`001`/`003` never reference the field; `004` hardcodes `null`; `007` reads `defaultResource?.[0]` |
| `grep -r DEFAULT_RESOURCE .opencode/bin/lib/compiled-routing/` | Zero hits |
| `compiled-route.cjs` decision for three hubs | No preamble field in any decision |
| `root-router-contract.cjs` §`pushLegacyDefaultResidue` | The only cross-artifact check, and it rejects only a literal legacy smart-router path |

So the runtime enforces neither statement, and no gate compares them. Both halves of the finding
are confirmed rather than contradicted.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hub-router.json` `routerPolicy` | Authored zero-signal fallback | update — add the two keys | `compiled-route-guard.cjs` recompiles all five hubs |
| `ROUTER.md` `DEFAULT_RESOURCE` | Authored stage-two preamble | unchanged, and named as the other concept in the contract key | `root-router-contract.cjs` via `ci-skill-root-metadata.cjs` |
| Hub `SKILL.md` route loop | Fallback consumer where present | unchanged | `sk-code` calls `load_if_available("shared/README.md")` on its zero-signal branch, matching its JSON; `sk-doc` reads the field by name; `mcp-tooling` asserts the contract in prose. `system-deep-loop` and `cli-external-orchestration` have no such site. |
| Activation manifests | Bind `effectivePolicyHash` | update — re-mint four hubs, both copies | `compiled-route-guard.cjs` exit 0, five fresh |
| `graph-metadata.json` discovery terms | Advisory discovery input | update — prune two retired terms | Key contract via `ci-skill-root-metadata.cjs` |
| `parent-skill-check.cjs` 5d | Resolves `defaultResource` paths on disk | unchanged, still passes | Full gate run |
| Root-metadata gate | Validates every hub class | unchanged, still passes | `ci-skill-root-metadata.cjs` 13/13 |

Required inventories:

- Same-class producers: `rg -n 'defaultResource' .opencode/skills/*/hub-router.json` — six hubs, five carrying the key.
- Consumers of changed symbols: `rg -n 'defaultResource' .opencode --glob '*.cjs'` — the manifest library, two rollout compilers, the doctor check, and the root-metadata gate.
- Matrix axes: hub (six) × artifact (two). Every row resolved to one of three shapes: JSON-only fallback, both distinct, or preamble-only.
- Algorithm invariant: no invariant is touched. The field carries no path resolution in the live runtime, and the guard resolves every path it does read.
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
| Guard | Compiled policy freshness and authored/runtime manifest parity | `node .opencode/bin/compiled-route-guard.cjs` |
| Contract | Every hub root against its class contract | `ci-skill-root-metadata.cjs` |
| Routing contract | Root-router two-state fixtures | `root-router-contract.test.cjs` |
| Suite | The deep-loop runtime | `npx vitest run --no-coverage` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The findings registries | Internal | Green | The sites and the enforcement evidence come from there |
| The compiled-routing compiler chain | Internal | Green | Re-minting runs through its own refresh API |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard reports a hub that is neither fresh nor excused after the change.
- **Procedure**: `git revert` the commit. The manifests are generated artifacts, so reverting the inputs and re-minting is equally valid and is what the refresh API does.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Measure) ──► Phase 2 (Edit) ──► Phase 3 (Re-mint and verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Measure | None | Edit |
| Edit | Measure | Re-mint |
| Re-mint | Edit | None |
| Verify | Re-mint | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Measure | Med | 1-2 hours |
| Edit | Low | Under an hour |
| Re-mint and verify | Low | Under an hour |
| **Total** | | **2-4 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration
- [x] Pre-change manifest hashes recorded before re-mint
- [x] Guard run before and after

### Rollback Procedure
1. `git revert` the commit, or restore the recorded manifests.
2. Re-run `compiled-route-guard.cjs`.
3. Confirm all five hubs report fresh.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
