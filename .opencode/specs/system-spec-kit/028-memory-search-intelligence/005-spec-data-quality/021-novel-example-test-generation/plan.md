---
title: "Implementation Plan: Novel GO Automatic Example and Test Generation From Specs [template:level_2/plan.md]"
description: "Plans an additive human-approved generator that reads a spec REQUIREMENTS anchor and proposes worked examples and test stubs as a separate artifact, default-off, never a rewrite of requirement prose."
trigger_phrases:
  - "example generation plan"
  - "test generation from specs plan"
  - "additive adherence artifacts plan"
  - "novel go floor bypass plan"
  - "ears ac coverage consumer plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/021-novel-example-test-generation"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "plan-bench-agent"
    recent_action: "Specified GEN_COVERAGE benchmark and named test"
    next_safe_action: "Hold for implementation, no code landed"
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
# Implementation Plan: Novel GO Automatic Example and Test Generation From Specs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript generator script, JSON registry, Markdown templates |
| **Framework** | Spec-kit sweep scripts and the manifest template set |
| **Storage** | None new, the generator reads a spec REQUIREMENTS anchor and writes one additive artifact |
| **Testing** | validate.sh strict, flag-on dry-run and confirm runs, flag-off no-op on a 005 sibling |

### Overview
This phase adds an additive generator that reads a spec REQUIREMENTS anchor and proposes one worked example or test stub per requirement into a separate examples-and-tests artifact. It never edits requirement prose in place, it writes nothing without an explicit human-approval confirm and it lands default-off behind a flag so the legacy corpus and the existing save and validate paths stay untouched. The generated artifacts carry their REQ ids so the sibling A7 `REQ_COVERAGE` and `AC_COVERAGE` gates have concrete per-requirement artifacts to count.
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
Additive-only producer behind a feature flag, gated by an explicit human confirm, never a registered fix class and never a body mutation.

### Key Components
- **gen-examples-tests.ts**: Reads a spec REQUIREMENTS anchor and emits one proposed worked example or test stub per requirement into a separate examples-and-tests artifact that is default-off behind a flag and never edits requirement prose. The requirement scan is fence-aware so a code-fenced line is not mistaken for a requirement, matching the shipped counter at `check-ac-coverage.sh:84-85`.
- **spec.md.tmpl**: Documents an optional EXAMPLES anchor or a separate examples-and-tests artifact as the named additive landing surface the generator writes into.
- **tasks.md.tmpl**: Documents the generated test-stub linkage so a task row can reference the stub that exercises its REQ, giving `REQ_COVERAGE` and `AC_COVERAGE` a concrete artifact to count.
- **validator-registry.json**: Registers the generator flag default-off so its presence is discoverable next to the existing rules, without registering it as a blocking validation rule.

### Data Flow
The operator invokes the generator on a single spec. The generator reads the REQUIREMENTS anchor text fence-aware and produces a dry-run report of one proposed example or stub per requirement, each tagged with its REQ id and a pending-review marker. Nothing lands until the explicit confirm. On confirm the generator writes only the named examples-and-tests artifact under the active spec folder. With the flag unset the generator never runs and the save and validate results are byte-for-byte equal to today.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| check-ac-coverage.sh | Shipped fence-aware counter the generator copies its scan discipline from | not a consumer, source pattern only | `rg -n 'fence' scripts/rules/check-ac-coverage.sh` |
| validator-registry.json | Registry that validate.sh reads to dispatch rules | update, one default-off flag entry, not a blocking rule | `node`-parse of the registry after the edit |
| spec.md.tmpl REQUIREMENTS anchor | Authoring guidance and the prose the generator must never edit | update, add the named EXAMPLES landing surface only | validate an existing Level 2 spec after the edit |
| tasks.md.tmpl task rows | Checkbox bullets with no generated-stub back-reference | update, document the stub linkage marker | `rg -n 'REQ-' templates/manifest/tasks.md.tmpl` |
| examples-and-tests artifact | New additive output under the spec folder | create at confirm time only | confirm the source spec.md REQUIREMENTS prose is byte-for-byte unchanged |

Required inventories:
- Same-class producers: `rg -n 'gen-|generate' scripts/sweep scripts/lib/validator-registry.json`.
- Consumers of changed symbols: `rg -n 'SPECKIT_GEN_EXAMPLES|examples-and-tests|REQ-' . --glob '*.ts' --glob '*.json' --glob '*.md'`.
- Matrix axes: flag state (unset, true), confirm state (declined dry-run, confirmed), requirement state (present, empty anchor, in fence, out of fence), artifact state (absent, already present).
- Algorithm invariant: the generator never writes to the REQUIREMENTS prose and writes nothing at all without an explicit confirm. With the flag unset the validation result is byte-for-byte equal to the pre-phase result.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the fence-aware scan in `check-ac-coverage.sh:84-85` to lock the requirement-scan discipline the generator reuses
- [ ] Confirm the `AC_COVERAGE` registry entry shape so the generator flag registers as default-off and not as a blocking rule
- [ ] Decide the artifact landing shape, a new examples file under the spec folder or a marked EXAMPLES anchor, see open question one in spec.md

### Phase 2: Core Implementation
- [ ] Create `gen-examples-tests.ts` that reads the REQUIREMENTS anchor fence-aware and emits one proposed example or stub per requirement, each tagged with its REQ id and a pending-review marker (REQ-001, REQ-004, REQ-006)
- [ ] Make the generator dry-run by default and require an explicit confirm before any write, so an unconfirmed run writes nothing (REQ-003)
- [ ] Make an empty or absent REQUIREMENTS anchor a clean no-op with a no-requirements notice and no artifact (REQ-005)
- [ ] Add the named EXAMPLES landing surface to `spec.md.tmpl` so the additive artifact has a documented home that never touches REQUIREMENTS prose (REQ-001)
- [ ] Document the generated test-stub linkage in `tasks.md.tmpl` so a task row can reference its stub for the A7 gates (REQ-004)
- [ ] Register the generator flag default-off in `validator-registry.json` so an unset run is a verified no-op (REQ-002)

### Phase 3: Verification
- [ ] Run the generator on a Level 2 spec and confirm one example or stub per requirement with the source REQUIREMENTS prose byte-for-byte unchanged (REQ-001)
- [ ] Run the generator with no confirm and confirm nothing is written, then confirm and check the artifact lands (REQ-003)
- [ ] Run validate.sh strict flag-unset on a 005 sibling and confirm the same exit code and the same files as before (REQ-002)

### Benchmark

This is a write-time generator phase, so the metric is NOT recall. The item is floor-bypassing and writes additive artifacts not vector rows, so it routes through no prod-mode `completeRecall@3` gate and the C2 gate owned by `015-c2-prodmode-recall-gate` does not apply. The bar is a per-requirement generation-conformance count driven to zero plus a fence-decoy planted-mismatch catch-rate.

| Field | Value |
|-------|-------|
| **Metric** | `GEN_COVERAGE`, the count of fixture requirements left without a tagged proposed artifact, driven to zero, paired with the fenced-decoy false-positive count and the source REQUIREMENTS-prose bytes-changed count |
| **Class** | conformance-count-driven-to-zero plus planted-mismatch catch-rate, drawn from the write-time detector family not the retrieval family |
| **Fixture** | A planted Level 2 spec under `scripts/tests/fixtures` carrying N out-of-fence requirement rows plus at least one in-fence decoy requirement-shaped row, mirroring the fence-aware scan at `check-ac-coverage.sh:84-85` |
| **PROMOTION threshold** | A first run on the fixture passes only when the un-covered-requirement count is 0 so every REQ id gets exactly one tagged proposed artifact, the source REQUIREMENTS-anchor bytes-changed count is 0 and the fenced-decoy false-positive count is 0 |
| **REGRESSION threshold** | Any un-covered requirement, any byte changed in the source REQUIREMENTS prose or any fenced decoy tagged fails the gate with a generator-conformance non-zero exit distinct from a crash code |
| **Baseline** | The first clean fixture run freezes per-class coverage at N/N and the prose-immutability invariant at zero bytes, stored next to the test fixture |
| **Reproduce** | `SPECKIT_GEN_EXAMPLES=true node .opencode/skills/system-spec-kit/scripts/sweep/gen-examples-tests.ts --dry-run <fixture-spec>` then assert the coverage, fence-decoy and prose-immutability counts. SPECIFIED-not-run while the phase is PLANNED |

The default-off safety proof rides the shipped flag ceiling. `SPECKIT_GEN_EXAMPLES` registers in `ALL_SPECKIT_FLAGS` and `FLAG_CHECKERS` in `flag-ceiling.vitest.ts` so the existing default-off assertions cover it with no new harness, and runtime reversibility is `SPECKIT_GEN_EXAMPLES=false` which returns the byte-for-byte no-op proven by REQ-002.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | REQUIREMENTS scan, fence skipping, per-REQ tagging, empty-anchor no-op | bash, fixture spec folders |
| Integration | Dry-run report then confirm-gated write, flag-on and flag-off | validate.sh --strict, node generator run |
| Manual | Registry node-parse, no-op equivalence on a 005 sibling, byte-for-byte prose check | node, diff of exit codes and source prose |
| Benchmark | `GEN_COVERAGE` un-covered count driven to 0, fenced-decoy false-positives 0 and REQUIREMENTS-prose bytes-changed 0 on the planted fixture, see section 4 Benchmark | `gen-examples-tests.ts --dry-run`, planted fixture under `scripts/tests/fixtures` |
| Named test | `scripts/tests/gen-examples-tests.vitest.ts` pins per-REQ coverage N/N, REQUIREMENTS byte-identity, fence-decoy skip and the dry-run-writes-nothing gate | vitest, planted fixture spec |
| Default-off proof | `mcp_server/tests/flag-ceiling.vitest.ts` pins `SPECKIT_GEN_EXAMPLES` off by default so a flag-unset run is byte-identical, reversible at runtime via `SPECKIT_GEN_EXAMPLES=false` | vitest, ALL_SPECKIT_FLAGS plus FLAG_CHECKERS |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 007-a7-ears-constraints-req-coverage | Internal | Green, consumer | None for the producer, the generated artifacts simply wait for the A7 gates to count them |
| check-ac-coverage.sh fence-aware scan | Internal | Green | The generator has no fence-aware scan pattern to copy |
| 026-shared-safe-fix-engine | Internal | Green, not applicable | None, the generator writes a new additive artifact and is never a registered fix class |
| 015-c2-prodmode-recall-gate | Internal | Green, not applicable | None, the item is floor-bypassing and emits no vector rows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A low-quality generated example or a template edit that breaks an existing Level 2 validation.
- **Procedure**: Unset the generator flag to silence it, then git revert the script and registry edits, the template edits are additive and safe to revert in place. Any landed examples-and-tests artifact is a separate file and can be deleted without touching requirement prose.
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
| Core Implementation | Medium | 5-8 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **7-12 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Unset the generator flag to disable the generator at once
2. Git revert the script and registry edits
3. Run validate.sh strict on a 005 sibling to confirm the pre-phase result returns
4. Delete any landed examples-and-tests artifact, which is a separate file and never touches requirement prose

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the phase writes no data, only one generator script, template text, one registry flag and the additive artifacts the generator proposes
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
