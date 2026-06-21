---
title: "Implementation Plan: A10 Per-Surface Gates [template:level_2/plan.md]"
description: "Add write-time conformance gates to the skill-doc command and context-eng surfaces. Five report-only detectors land default-off and warn-only first, reusing shipped route-validate, advisor, and canary machinery."
trigger_phrases:
  - "per-surface gates plan"
  - "skill-doc frontmatter gate"
  - "route-validate generalization"
  - "workflow yaml schema gate"
  - "trigger vocabulary canary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/010-a10-per-surface-gates"
    last_updated_at: "2026-06-21T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored plan from spec seams"
    next_safe_action: "Author tasks and checklist"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-plan-010-a10-per-surface-gates"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: A10 Per-Surface Gates

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
| **Language/Stack** | TypeScript detectors plus Python route-validate |
| **Framework** | system-spec-kit validation harness |
| **Storage** | None for this phase. Skill graph stays in skill-graph.sqlite |
| **Testing** | Vitest for detectors plus validate.sh census runs |

### Overview
Each non-spec-doc authoring surface gains a write-time conformance gate. The plan reuses the shipped route-validate assertion harness, the shipped advisor rebuild and validate tools, and the rule-canary-sync pattern so grammar drift, router-contract breaks, malformed workflow YAML, and triple-copy vocabulary divergence are caught at authoring time. All five gates land report-only, default-off, and warn-only first per the packet four-beat migration discipline.
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
Detector-registry plus check-tier composition over existing validation harness.

### Key Components
- **SKILL.md grammar detector**: Reads SKILL.md frontmatter, pins one version grammar, reports the non-conforming grammar as a warn finding.
- **Route-contract gate**: Runs route-validate assertions D, E, and F across all 28 command docs from a non-doctor entry.
- **Workflow-YAML schema detector**: Checks the workflow YAML census against a structural schema and reports malformed structure.
- **Skill-graph drift gate**: Wires advisor_rebuild to advisor_validate as a check tier so drift and signal-collision findings surface without new graph logic.
- **Trigger-vocabulary canary**: Compares three hand-synced copies and reports a finding on divergence, modeled on rule-canary-sync.

### Data Flow
A validate run invokes each detector over its target surface, collects warn-tier findings, and reports them without blocking. No authored body is mutated and no embedding path is touched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `route-validate.py` assertion harness | Owns the eight router-contract assertions | update | Wrap assertions D, E, F into a non-doctor entry, no rewrite |
| `advisor-rebuild.ts` plus advisor_validate | Owns skill-graph rebuild and validation | not a consumer | Call tools as-is, no new graph traversal |
| `gate-3-classifier.ts` FILE_WRITE_TRIGGERS | Canary input at line 67 | unchanged | Read-only source, grep confirms the constant |
| `prompt-policy.default.json` WORK_INTENT_VERBS | Canary input read at prompt-policy.ts:42 | unchanged | Read-only source |
| `CLAUDE.md` intent-trigger prose | Third canary input | unchanged | Read-only source |
| `validator-registry.json` | Owns rule registration | update | Register the new detectors as warn-tier entries |

Required inventories:
- Same-class producers: `rg -n 'FILE_WRITE_TRIGGERS|WORK_INTENT_VERBS' .opencode`.
- Consumers of changed symbols: `rg -n 'route-validate|advisor_rebuild|advisor_validate' . --glob '*.ts' --glob '*.py' --glob '*.md'`.
- Matrix axes: three surfaces, five gates, two new detectors plus one generalization plus one wiring plus one canary.
- Algorithm invariant: the canary compares set coherence, not byte equality, with an allow-list for surface-specific verbs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the shipped route-validate, advisor, and rule-canary-sync contracts
- [ ] Confirm the validator-registry warn-tier entry shape
- [ ] Resolve the canonical SKILL.md version grammar question with the operator

### Phase 2: Core Implementation
- [ ] Build the SKILL.md frontmatter grammar and uniformity detector
- [ ] Build the workflow-YAML schema detector
- [ ] Generalize route-validate assertions D, E, F across all 28 command docs
- [ ] Wire advisor_rebuild to advisor_validate as a check tier
- [ ] Build the triple-copy trigger-vocabulary canary
- [ ] Register all five gates as default-off warn-tier entries

### Phase 3: Verification
- [ ] Run each detector over its target corpus and confirm warn-tier non-blocking
- [ ] Confirm the route gate covers all 28 docs
- [ ] Confirm the canary reports drift when one copy is mutated out of sync
- [ ] Update spec, plan, and tasks
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each detector and the canary set comparison | Vitest |
| Integration | Route-validate 28-doc census run | Python harness |
| Manual | Mutate one canary copy and confirm a drift finding | Shell |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026-shared-safe-fix-engine | Internal | Yellow | Detectors register as fixClass none warn-tier entries, no engine fix path |
| Shipped route-validate.py harness | Internal | Green | Generalization wraps the existing assertions |
| Shipped advisor_rebuild and advisor_validate | Internal | Green | Drift gate is wiring not new logic |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A gate produces blocking behavior or a false-positive storm on the legacy corpus.
- **Procedure**: Set the gate default-off flag so the detector stops running and revert the registry entry.
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
| Core Implementation | Med | 6-10 hours |
| Verification | Low | 1-2 hours |
| **Total** | | **8-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Each gate ships behind a default-off flag
- [ ] Warn-tier entry confirmed in the registry
- [ ] No gate flips to error in this phase

### Rollback Procedure
1. Set the gate default-off flag so the detector stops running
2. Revert the validator-registry entry
3. Re-run validate.sh to confirm a clean census
4. Note the false-positive cause in the open questions

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
