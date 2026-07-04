---
title: "Implementation Plan: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate [template:level_2/plan.md]"
description: "Plans a clone of the shipped AC_COVERAGE rule into a default-off REQ_COVERAGE gate plus EARS grammar, a constraint tier, and a soft EARS linter in the spec and tasks templates."
trigger_phrases:
  - "ears requirements plan"
  - "constraint tier plan"
  - "req coverage plan"
  - "ac coverage clone plan"
  - "ears linter plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/005-spec-data-quality/001-on-write-quality/007-ears-constraints-req-coverage"
    last_updated_at: "2026-07-04T17:12:00.863Z"
    last_updated_by: "markdown-agent"
    recent_action: "Specified detector benchmark and flags-off test"
    next_safe_action: "Build the REQ_COVERAGE clone"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/templates/manifest/spec.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A7 EARS Patterns, Constraint Tier, and REQ_COVERAGE Gate

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
| **Language/Stack** | Bash rule scripts, JSON registry, Markdown templates |
| **Framework** | Spec-kit validate.sh and its run_check registry loop |
| **Storage** | None new, the rule reads spec.md and tasks.md text |
| **Testing** | validate.sh strict, flag-on and flag-off runs, registry node-parse |

### Overview
This phase clones the shipped `AC_COVERAGE` rule into a `REQ_COVERAGE` gate that flags authored requirements with no task linkage. It adds EARS grammar and an always / ask-first / never constraint tier to the spec template, a soft EARS linter, and a requirement-reference marker in the tasks template so the gate has a canonical linkage location to read. Every new behavior lands default-off and warn so the legacy corpus never breaks.
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
Rule-as-plugin clone behind a feature flag, the same shape the shipped `AC_COVERAGE` rule already uses.

### Key Components
- **check-req-coverage.sh**: Scans authored requirement ids in spec.md against the task linkage in tasks.md and warns on any requirement with no covering task, modeled on `check-ac-coverage.sh:177-224`.
- **check-ears-lint.sh**: Advisory linter that reports requirement rows matching neither an EARS shape nor a constraint-tier class.
- **validator-registry.json**: Two new authored_template entries, `REQ_COVERAGE` and `EARS_LINT`, each behind its own flag and modeled on the `AC_COVERAGE` entry at `validator-registry.json:51-62`.
- **spec.md.tmpl and tasks.md.tmpl**: Template edits that carry the EARS patterns, the constraint tier, and the REQ-reference linkage marker.

### Data Flow
`validate.sh` reads the registry, dispatches each enabled rule through the realpath-guarded `run_check` loop (`validate.sh:636,685`), the new rule reads spec.md and tasks.md text, and emits a warn line when a requirement has no linked task. With the flags unset the rules are skipped and the result is byte-for-byte equal to today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| check-ac-coverage.sh | Shipped coverage rule that the clone copies | not a consumer, source pattern only | `rg -n 'AC_COVERAGE' scripts/rules/check-ac-coverage.sh` |
| validator-registry.json | Registry that validate.sh reads to dispatch rules | update, two new entries | `node`-parse of the registry after the edit |
| validate.sh run_check loop | Realpath-guarded dispatcher for every rule | unchanged, the new rule rides the existing loop | `rg -n 'run_check' scripts/spec/validate.sh` |
| spec.md.tmpl REQUIREMENTS anchor | Authoring guidance for requirement tables | update, add EARS and constraint tier | validate an existing Level 2 spec after the edit |
| tasks.md.tmpl task rows | Checkbox bullets with no REQ back-reference | update, add a REQ-reference marker | `rg -n 'REQ-' templates/manifest/tasks.md.tmpl` |

Required inventories:
- Same-class producers: `rg -n 'COVERAGE' scripts/rules scripts/lib/validator-registry.json`.
- Consumers of changed symbols: `rg -n 'REQ_COVERAGE|EARS_LINT|SPECKIT_REQ_COVERAGE|SPECKIT_EARS_LINT' . --glob '*.sh' --glob '*.json' --glob '*.md'`.
- Matrix axes: flag state (unset, true), requirement linkage state (linked, unlinked, no tasks column), fence state (in fence, out of fence).
- Algorithm invariant: with all new flags unset the validation result is byte-for-byte equal to the pre-phase result.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `check-ac-coverage.sh` and the registry entry at `validator-registry.json:51-62` to lock the clone contract
- [ ] Confirm the `run_check` dispatch path at `validate.sh:636,685` and the realpath guard at `validate.sh:664-666`
- [ ] Decide the REQ-to-task linkage shape, a tasks-table column or an inline `REQ-NNN` marker, see open question one

### Phase 2: Core Implementation
- [ ] Clone `check-ac-coverage.sh` into `check-req-coverage.sh`, retarget from checklist AC rows to tasks REQ linkage, keep fence-aware skipping (`check-ac-coverage.sh:84-85`)
- [ ] Register `REQ_COVERAGE` in `validator-registry.json` with severity info, category authored_template, and the `SPECKIT_REQ_COVERAGE` / `_ENFORCE` / `_FLOOR` flags
- [ ] Add the EARS patterns and the always / ask-first / never constraint tier to the spec template REQUIREMENTS anchor
- [ ] Add a REQ-reference marker to `tasks.md.tmpl`
- [ ] Create `check-ears-lint.sh` and register `EARS_LINT` behind `SPECKIT_EARS_LINT`

### Phase 3: Verification
- [ ] Run validate.sh strict with `SPECKIT_REQ_COVERAGE=true` on a spec with an unlinked REQ and confirm a warn line
- [ ] Run validate.sh strict with the flag unset on a 005 sibling and confirm the same exit code as before
- [ ] Confirm an existing Level 2 spec still validates clean after the template edits

### Benchmark

A7 is a detector-class phase on the adherence and logic readers, so its benchmark is a planted-mismatch catch-rate and a first-run real-defect floor, not recall. It does NOT route through the prod-mode completeRecall@3 gate that `015-prodmode-recall-gate` owns (`run-eval-v2.mjs:361` exports `buildSearchLenses`, `meanCompleteRecallProfile` and `MEASURABILITY_CLASSES` for that retrieval path), because A7 is floor-bypassing and touches no vector or ranking surface.

| Metric | Pass | Regress |
|--------|------|---------|
| REQ_COVERAGE catch-rate on the planted fixture | every planted unlinked REQ flagged, catch-rate 1.0 | any planted unlinked REQ left unflagged |
| REQ_COVERAGE false-positive rate on a fully-linked fixture | zero `REQ_COVERAGE WARNING` lines, rate 0.0 | any warn on a clean fixture |
| EARS_LINT swap-precision on fixtures | every planted free-form row flagged and every EARS or constraint-tier row silent, precision 1.0 | a free-form row missed or an EARS row flagged |
| First-run real-defect floor on the live 005 corpus | at least one real unlinked REQ surfaced, floor >= 1 | zero real defects, the gate is vacuous and is not promoted |
| Conformance-to-zero after backfill | linking the planted REQ drives the unlinked count to zero and clears the warn | the warn persists after the fix |
| Flags-off no-regress on a 005 sibling | byte-identical stdout and the pre-phase exit code | any byte delta or exit-code change |

Reproduce:
```bash
# Detector catch-rate and no-op, on the planted fixture
SPECKIT_REQ_COVERAGE=true bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/skills/system-spec-kit/scripts/tests/fixtures/req-coverage-unlinked --strict
# expect exactly one REQ_COVERAGE WARNING

# Flags-off byte-identical no-regress, on a real 005 sibling
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-speckit/028-memory-search-intelligence/005-spec-data-quality/003-retrieval-gated-tuning/015-prodmode-recall-gate --strict
# expect zero REQ_COVERAGE and EARS_LINT lines and the pre-phase exit code
```

Default-safety: both flags default OFF. The keep-off rationale is that the legacy corpus predates EARS grammar and the REQ-reference marker, so an enabled error tier would break clean historical packets. No-regress is the flags-off byte-identical row above. Runtime reversibility is `SPECKIT_REQ_COVERAGE=false` and `SPECKIT_EARS_LINT=false`, which silence both rules with no revert. This benchmark is SPECIFIED, not run, and completion stays 0.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | check-req-coverage.sh linkage scan, fence skipping, clamp | bash, fixture spec folders |
| Integration | validate.sh dispatch of both rules, flag-on and flag-off | validate.sh --strict |
| Manual | Registry node-parse, no-op equivalence on a 005 sibling | node, diff of exit codes |
| Benchmark | REQ_COVERAGE catch-rate, EARS_LINT swap-precision, first-run real-defect floor | scripts/tests/check-req-coverage.test.sh, scripts/tests/check-ears-lint.test.sh |
| Default-off proof | Both flags default OFF and a flags-off run is byte-identical to the pre-phase baseline | scripts/tests/check-req-coverage.test.sh no-op assertion plus a flags-unset `validate.sh` byte-diff on a 005 sibling |

### Benchmark Metric and Test Artifacts

- **Named metric**: the REQ_COVERAGE planted-mismatch catch-rate and the EARS_LINT swap-precision over `scripts/tests/fixtures/`, plus the first-run real-defect floor on the live 005 corpus. This is a detector-class metric, not recall, so it bypasses the `015` completeRecall@3 gate.
- **`scripts/tests/check-req-coverage.test.sh`** asserts a planted unlinked REQ yields exactly one `REQ_COVERAGE WARNING`, a fully-linked fixture yields the advisory pass message with zero warnings, a no-REQ fixture yields the `coverage gate is a no-op` message and an out-of-range `SPECKIT_REQ_COVERAGE_FLOOR` clamps to `[0,1]` with a clamp note, mirroring `check-ac-coverage.sh:177-224`.
- **`scripts/tests/check-ears-lint.test.sh`** asserts a planted free-form row yields one advisory line and an all-EARS or constraint-tier fixture yields zero, following the fixture-driven scorer pattern in `quality-loop.vitest.ts` (`computeMemoryQualityScore`, `QUALITY_WEIGHTS`).
- **Flags-off byte-identical proof**: `REQ_COVERAGE` and `EARS_LINT` are `validate.sh` rules registered in `validator-registry.json` next to `AC_COVERAGE`, which is itself absent from `flag-ceiling.vitest.ts`, so their default-off proof is not a ceiling entry. The proof is a flags-unset `validate.sh` run on a 005 sibling that diffs byte-identical to the pre-phase baseline, asserted by `check-req-coverage.test.sh`. The `flag-ceiling.vitest.ts` drift guard scans `search-flags.ts` runtime gates only and is not the registration surface for these validate.sh rule flags.
- **CI home**: `check-req-coverage.test.sh` and `check-ears-lint.test.sh` are local-reproduce commands only and are not wired into any CI workflow yet, so the declared test gate is unenforced in CI until a CI-wiring phase lands.
- **Status**: SPECIFIED, not run. No fixture, test or rule has landed and completion stays 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| AC_COVERAGE shipped rule | Internal | Green | The clone has no source pattern to copy |
| validate.sh run_check loop | Internal | Green | The new rule has no dispatcher |
| 026-shared-safe-fix-engine | Internal | Green, not applicable | None, A7 is independent and does not use the safe-fix engine |
| 015-prodmode-recall-gate | Internal | Green, not applicable | None, A7 is floor-bypassing and pays no prod-mode-recall tax |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A new rule emits a false warn on a clean spec, or a template edit breaks an existing Level 2 validation.
- **Procedure**: Unset `SPECKIT_REQ_COVERAGE` and `SPECKIT_EARS_LINT` to silence both rules, then git revert the registry and script edits, the template edits are additive and safe to revert in place.
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
| Setup | Low | 1-2 hours |
| Core Implementation | Medium | 4-6 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Unset `SPECKIT_REQ_COVERAGE` and `SPECKIT_EARS_LINT` to disable both rules at once
2. Git revert the registry and rule-script edits
3. Run validate.sh strict on a 005 sibling to confirm the pre-phase result returns
4. Notify the operator if any in-flight packet saw a warn line

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the phase writes no data, only template text, two scripts, and two registry entries
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
