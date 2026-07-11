---
title: "Implementation Plan: Version-Suffix Flag-Name Cleanup [template:level_2/plan.md]"
description: "Plan for the hard clean rename that drops the _V1 suffix from twelve live SPECKIT flags. The rename runs as a single exact-name substitution over an explicit live-file list, excludes every archived and historical record, and is proven by a zero-occurrence search, both mcp_server typechecks, and the affected vitest suite."
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/004-dark-flag-graduation/005-flag-name-cleanup"
    last_updated_at: "2026-06-24T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Planned the exact-name rename over an explicit live-file list"
    next_safe_action: "User reviews the deliberate non-renames and commits"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/search-flags.ts"
    completion_pct: 100
---
# Implementation Plan: Version-Suffix Flag-Name Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript MCP server plus markdown reference docs |
| **Framework** | spec-kit memory search flag readers and the live testing-playbook and feature-catalog |
| **Storage** | None, this is a name substitution only |
| **Testing** | Both `mcp_server` typechecks plus the affected vitest suite, including the `flag-ceiling` drift guard |

### Overview
This phase drops the `_V1` suffix from twelve live SPECKIT flags. The substitution runs over an explicit list of fifty-two live files: the readers in `mcp_server/lib`, the eval scripts, the rerank benchmark arm, every vitest that sets or asserts one of the names, and the live reference docs. The pattern matches only the twelve exact names so a near-miss token such as the eval-harness `SPECKIT_EVAL_V2_OUTPUT` is never touched. No alias is added, so a stale export of an old `_V1` name resolves to the unset default and does nothing. The rename excludes every `z_archive`, `z_future`, dead-log and 028 spec-doc record, because those carry the historical name as it stood at ship time.
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
Exact-name substitution over an explicit live-file allowlist. The set of live files is computed by searching for the twelve names under the live tree, then the substitution strips `_V1` from only those twelve names. There is no central flag registry keyed on these names, so a per-file string substitution is the complete and sufficient change.

### Key Components
- **`search-flags.ts` reader**: the primary reader, holding both the `isFeatureEnabled('SPECKIT_..._V1')` literal-arg readers and the `process.env.SPECKIT_..._V1` direct reads, all renamed to the suffix-less name.
- **Live consumers in `lib/search` and `lib/response`**: the doc comments and reads in `progressive-disclosure.ts`, `session-state.ts`, `confidence-scoring.ts`, `recovery-payload.ts`, `result-explainability.ts` and `profile-formatters.ts`.
- **Vitest suite**: every test that sets or asserts a name, plus the `flag-ceiling.vitest.ts` acknowledged-flag list that the drift guard compares against the live tokens in `search-flags.ts`.
- **Reference docs**: `ENV_REFERENCE.md`, `environment_variables.md`, the `manual_testing_playbook`, the `feature_catalog` and the `/memory:search` command surfaces.

### Data Flow
The reader reads `process.env` by the literal flag name, so the contract is the spelling of that name shared by the code, the tests, the docs and the operator. Renaming the literal in every live producer and consumer in lockstep keeps the contract internally consistent while changing only the spelling.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `search-flags.ts` flag readers | Read the twelve flags by literal `_V1` name | rename each literal to the suffix-less name in both the `isFeatureEnabled` arg and the `process.env` read | `rg` over the file shows zero `_V1` names and the suffix-less readers in place |
| `lib/search` and `lib/response` consumers | Reference the flag names in doc comments and reads | rename every occurrence to the suffix-less name | `rg` over `lib` shows zero of the twelve `_V1` names |
| `flag-ceiling.vitest.ts` drift guard | Enumerates the live `SPECKIT_*` tokens and asserts each is acknowledged | add the renamed flags to the acknowledged list so the live tokens match | the drift-guard test passes with the renamed flags acknowledged |
| Every other affected vitest | Sets or asserts a flag name via `process.env` | rename every set and assert to the suffix-less name | the affected vitest suite runs green |
| Eval scripts and the rerank benchmark arm | Reference a flag name in a live script | rename to the suffix-less name | `rg` over `scripts/evals` and `benchmarks` shows zero of the twelve `_V1` names |
| Reference docs and command surfaces | Name the operator-facing env var | rename to the suffix-less name | `rg` over `ENV_REFERENCE.md`, the playbook, the catalog and the command surfaces shows zero of the twelve `_V1` names |
| Archived records, dead logs and the 028 spec-doc tree | Record the historical name as it stood at ship time | no change, these are immutable records | no file under `z_archive`, `z_future`, a dead-log path or the 028 `.opencode/specs` record tree is modified |

Required inventories:
- Full version-flag set: `rg -oN 'SPECKIT_[A-Z0-9_]*_V[0-9]+' .opencode | sort -u`.
- Live readers: `rg -n 'process.env.SPECKIT_[A-Z0-9_]*_V[0-9]+' .opencode/skills`.
- Live-versus-archived split: partition every hit by `z_archive`, `z_future`, dead-log path, 028 spec-doc record, versus live code and live docs.
- Algorithm invariant: only the twelve exact names are renamed, every live producer and consumer is renamed in lockstep, no alias is added, and no archived record is touched.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Enumerate the full `SPECKIT_*_V[0-9]+` set with `rg` and confirm the twelve named flags plus the non-target families
- [x] Classify each non-target family: `SPECKIT_PIPELINE_V2` is documented dead, the `SPECKIT_EVAL_V2_*` knobs are harness config, the rest live only in archives or records
- [x] Compute the explicit live-file list by searching for the twelve names under the live tree and excluding archives

### Phase 2: Core Implementation
- [x] Run the exact-name substitution over the live-file list, stripping `_V1` from only the twelve names
- [x] Confirm zero of the twelve `_V1` names remain in `.opencode/skills`
- [x] Add the renamed flags to the `flag-ceiling.vitest.ts` acknowledged list the rename surfaced was already drifting

### Phase 3: Verification
- [x] Run `tsc --noEmit --composite false` in the spec-kit and code-graph trees, both exit 0
- [x] Run the affected vitest suite, all green including the drift guard
- [x] Confirm no archived record, dead log or 028 spec-doc record was modified
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Both `mcp_server` typechecks clean after the rename | `tsc --noEmit --composite false` |
| Unit | Every vitest that sets or asserts a renamed name, plus the drift guard | the affected `*.vitest.ts` files |
| Search | Zero of the twelve `_V1` names remain in the live tree | `rg` over `.opencode/skills` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The full version-flag set from `rg` | Internal | Green | Enumerated before any edit, the twelve plus the non-target families are known |
| The live-versus-archived classification | Internal | Green | Each hit is partitioned so the rename stays in the live tree |
| The `flag-ceiling` drift guard | Internal | Green | The renamed flags are acknowledged so the guard recognises the live tokens |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live consumer was missed and a flag silently never fires, or the rename leaked into a record.
- **Procedure**: Revert the working-tree changes, the rename is uncommitted, so a single `git restore` on the affected files returns to the pre-rename names with no data involved.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1 hour |
| Core Implementation | Low | 1 hour |
| Verification | Low | 1 hour |
| **Total** | | **3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Zero of the twelve `_V1` names remain in the live tree
- [x] Both typechecks exit 0
- [x] The affected vitest suite is green

### Rollback Procedure
1. `git restore` the affected live files to drop the rename, the change is uncommitted
2. Re-run the affected vitest suite to confirm it returns to the pre-rename state
3. Re-run both typechecks to confirm they stay clean

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is a name substitution, no data is written
<!-- /ANCHOR:enhanced-rollback -->

---
