---
title: "Implementation Plan: A5 Trigger Coherence Assertion [template:level_2/plan.md]"
description: "Add a warn-tier cross-surface rule that reads trigger_phrases from spec.md frontmatter, description.json, and graph-metadata.derived, then asserts the indexed and derived sets are each a subset of the curated frontmatter set after extractor-matching normalization."
trigger_phrases:
  - "trigger phrases coherence"
  - "cross-surface assertion"
  - "subset coherence"
  - "description.json triggers"
  - "graph-metadata derived"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/005-trigger-coherence-assertion"
    last_updated_at: "2026-07-04T17:11:59.166Z"
    last_updated_by: "markdown-agent"
    recent_action: "Added benchmark, test and default-off gate to plan"
    next_safe_action: "Hold for implementation, no code has landed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-trigger-coherence.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/validator-registry.json"
      - ".opencode/skills/system-spec-kit/scripts/extractors/spec-folder-extractor.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A5 Trigger Coherence Assertion

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
| **Language/Stack** | Bash rule script reading JSON and frontmatter, normalization mirrored from a TypeScript extractor |
| **Framework** | spec-kit validator (`validate.sh` rule registry) |
| **Storage** | None, the rule reads spec.md frontmatter, `description.json`, and `graph-metadata.json` on disk |
| **Testing** | Rule-script fixtures plus a dry-run pass over `.opencode/specs` |

### Overview
This phase adds one warn-tier rule that reads the `trigger_phrases` concept from the three surfaces of a spec folder and asserts subset coherence. The indexed `description.json` set and the `graph-metadata.derived` set must each be a subset of the curated spec.md frontmatter set after the same case-fold, trim, and dedupe the extractor applies. The rule lands report-only so the legacy corpus never blocks on it, and it stays silent on a legitimately capped 12-entry derived set against a longer frontmatter list.
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
New validator rule plus one registry entry. No new abstraction and no surface rewrite. The rule is read-only and report-only.

### Key Components
- **`check-trigger-coherence.sh`**: new rule that parses `trigger_phrases` from spec.md frontmatter, the `description.json` trigger set, and the `graph-metadata.derived` trigger set, normalizes all three, then reports any indexed or derived phrase absent from the curated frontmatter set.
- **`validator-registry.json`**: owns the `severity` field, the single place the new warn-tier rule registers next to the description and graph-metadata shape rules.
- **`spec-folder-extractor.ts`**: read-only reference for the `dedupe([...]).slice(0, 12)` normalization at lines 387-390 the rule must mirror so the 12-entry cap never false-fires.

### Data Flow
`validate.sh` resolves the new rule from the registry and runs it against the packet. The rule reads the three surfaces, normalizes each set identically to the extractor, and emits a warn finding naming the orphan phrases when the indexed or derived set is not a subset of the frontmatter set. A missing or empty surface is treated as no-data and produces no finding.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-trigger-coherence.sh` | Does not exist yet | create the rule that reads three surfaces and asserts subset coherence at warn | grep shows the script reads spec.md frontmatter, `description.json`, and `graph-metadata.derived`, a crafted divergent fixture emits a warn finding |
| `validator-registry.json` | Declares the existing shape rule ids | register the new rule at `severity: warn` next to the description and graph-metadata shape rules | registry lists the new rule id at warn |
| `spec-folder-extractor.ts` | Builds the indexed set as `dedupe([...]).slice(0, 12)` at lines 387-390 | read-only reference, mirror the normalization exactly | grep confirms the case-fold, trim, dedupe, and slice the rule copies |

Required inventories:
- Same-class producers: `rg -n 'trigger_phrases' .opencode/skills/system-spec-kit/scripts`.
- Consumers of changed symbols: `rg -n 'TRIGGER_COHERENCE|check-trigger-coherence' .opencode/skills/system-spec-kit`.
- Matrix axes: divergent indexed set, divergent derived set, capped 12-entry derived set against a longer frontmatter list, missing derived surface, case-only difference, all surfaces empty.
- Algorithm invariant: the indexed and derived sets must each be a subset of the normalized frontmatter set, and a missing or empty surface is no-data not divergence.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read `spec-folder-extractor.ts` lines 387-390 and capture the exact normalization order (case-fold, trim, dedupe, slice 12)
- [ ] Confirm where the derived trigger set lives in live folders, sampling `graph-metadata.derived.trigger_phrases` and any legacy key variant
- [ ] Pick the parse path for spec.md frontmatter, `description.json`, and `graph-metadata.json` matching how existing rule scripts read those files

### Phase 2: Core Implementation
- [ ] Author `check-trigger-coherence.sh` to read the three surfaces and build three normalized sets
- [ ] Implement the subset comparison so an indexed or derived phrase absent from the curated frontmatter set emits a warn finding naming that phrase
- [ ] Treat a missing or empty surface as no-data so absent surfaces never report divergence
- [ ] Register the rule at `severity: warn` in `validator-registry.json` next to the shape rules

### Phase 3: Verification
- [ ] A crafted fixture with an indexed or derived trigger absent from frontmatter emits a warn finding listing that phrase
- [ ] A fixture with 15 frontmatter triggers and a capped 12-entry derived subset reports no finding
- [ ] A dry run across the live spec corpus exits non-error and lists current divergences as warn findings

### Benchmark

This is a detector phase so the benchmark is a planted-mismatch catch-rate, not recall. Prod search truncates to a 3-result floor, which is why recall does not measure a write-time validation rule. The metric pairs a catch-rate on planted cross-surface divergences with a false-positive count on coherent fixtures, plus a first-run floor on the live corpus.

- **Metric**: `trigger-coherence catch-rate`, the planted divergences flagged over the planted divergences staged, reported with a companion false-positive count over the coherent fixtures.
- **PROMOTION threshold**: catch-rate is 1.0 over at least 3 planted-divergence fixtures (indexed orphan, derived orphan and both-surface orphan) and false-positive count is 0 over the 4 coherent fixtures (capped 12-entry derived subset against 15 frontmatter triggers, case-only difference, missing derived surface and all surfaces empty). The warn-to-error flip is gated on this pair holding.
- **REGRESSION threshold**: any planted divergence missed (catch-rate below 1.0) or any coherent fixture emitting a finding (false-positive count above 0) is a regress and blocks the flip.
- **First-run floor**: a dry run across `.opencode/specs` surfaces at least 1 real divergence as a warn finding and exits non-error, proving the rail fires on real data and not only fixtures (SC-003).
- **Reproduce**: `npx vitest run .opencode/skills/system-spec-kit/scripts/tests/trigger-coherence.vitest.ts` for the fixture catch-rate and false-positive count, then a `SPECKIT_TRIGGER_COHERENCE=true` census loop calling `check-trigger-coherence.sh` across `.opencode/specs` for the first-run floor.
- **Status**: SPECIFIED, not run. No fixture is staged and no number is measured yet.

### Default Safety

- **Default OFF**: the rule registers at `severity: warn` in `validator-registry.json` and is gated behind `SPECKIT_TRIGGER_COHERENCE`, which defaults OFF.
- **Keep-off rationale**: until A2 backfills curated triggers into `description.json`, the legacy corpus carries known curated-versus-title-copy divergences, so the rule stays OFF to avoid warn noise on every validate pass and flips ON once A2 shrinks the backfill list.
- **No-regress**: with `SPECKIT_TRIGGER_COHERENCE` unset, `validate.sh --strict` output is byte-identical to the pre-rule baseline because the rule is skipped at the registry gate.
- **Default-off proof**: `SPECKIT_TRIGGER_COHERENCE` joins the `ALL_SPECKIT_FLAGS` roster and a `FLAG_CHECKERS` entry in `flag-ceiling.vitest.ts`, which asserts the flag reads OFF by default.
- **Reversibility**: `SPECKIT_TRIGGER_COHERENCE=false` disables the rule at runtime with no other change.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | A coherent fixture and a divergent fixture through the rule script | direct rule-script invocation |
| Integration | Warn-tier behavior over a valid packet under the strict gate | `validate.sh --strict` |
| Manual | Dry-run pass over `.opencode/specs` listing current divergences as warn findings | census pass plus grep evidence |
| Benchmark | Planted-mismatch catch-rate is 1.0 over the divergence fixtures and false-positive count is 0 over the coherent fixtures | `scripts/tests/trigger-coherence.vitest.ts` |
| Default-off | `validate.sh --strict` output is byte-identical with `SPECKIT_TRIGGER_COHERENCE` unset and the flag reads OFF by default | `scripts/tests/trigger-coherence.vitest.ts` plus `flag-ceiling.vitest.ts` roster |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A2 trigger propagation into `description.json` | Internal | Yellow | Without A2 many folders report a curated-versus-title-copy divergence A2 then closes |
| 026-shared-safe-fix-engine | Internal | Yellow | A5 reports divergence but the fix routes through the shared safe-fix engine, not here |
| A4 shape-error migration | Internal | Yellow | The warn-to-error flip for this rule rides the same four-beat migration as the shape rules |
| `spec-folder-extractor.ts` normalization at 387-390 | Internal | Green | Drift would false-fire or miss real divergence, so the rule mirrors it exactly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A coherent packet false-fires under the subset rule, or the dry run shows the rule mis-reads a legacy derived key.
- **Procedure**: Remove the rule entry from `validator-registry.json` so the rule stops running while the normalization or key-read gap is corrected.
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
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 3-5 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **5-9 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Coherent and divergent fixtures staged
- [ ] Capped 12-entry derived fixture staged to prove subset not byte equality
- [ ] Dry-run divergence list captured for the backfill beat

### Rollback Procedure
1. Remove the rule entry from `validator-registry.json`
2. Keep the rule script in place while the normalization or key-read gap is corrected
3. Re-run the dry-run pass to confirm the rule reads each surface correctly
4. Re-register the rule at warn once the fixtures pass

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the rule is read-only and report-only and mutates no surface
<!-- /ANCHOR:enhanced-rollback -->

---
