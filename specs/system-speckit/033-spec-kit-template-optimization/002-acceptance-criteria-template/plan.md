---
title: "Implementation Plan: Acceptance Criteria Template as Packet Closure Gate"
description: "How the gated acceptance-criteria template, its Level contract entry and the AC_CLOSURE rule are built, verified and rolled out forward-only."
trigger_phrases:
  - "acceptance criteria plan"
  - "ac closure rollout"
  - "closure gate implementation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/002-acceptance-criteria-template"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Built the acceptance-criteria template, contract entry and closure gate"
    next_safe_action: "Execute the reference sweep and close the remaining criteria"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-ac-closure.sh"
    session_dedup:
      fingerprint: "sha256:d626919caf0a4b0d7ef0fad0a4bc4a07d7a0ab0f66559c3fe7cc2088026f7ca9"
      session_id: "2026-08-29-033-002-acceptance-criteria-template"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Acceptance Criteria Template as Packet Closure Gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash 3.2 (validation rules), JSON (Level contract), Markdown templates |
| **Framework** | spec-kit validation orchestrator, inline gate renderer |
| **Storage** | None; the contract and rules are files on disk |
| **Testing** | Purpose-built shell fixture driving `run_check` plus end-to-end `validate.sh --json` |

### Overview
A gated `acceptance-criteria.md` becomes the canonical home for acceptance criteria at Levels 2, 3 and 3+, and a new `AC_CLOSURE` rule turns it into the gate a packet must pass before it may be closed. The rule reuses the existing dated-cutoff pattern so the 2,588 packets already at those levels stay advisory, and it verifies waivers against `decision-record.md` rather than trusting the cell.
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
Contract-driven validation: the Level contract declares the document set, the gated template renders it, and a registry-bridged shell rule enforces the semantics. No rule logic lives in `validate.sh`, which delegates every decision to the orchestrator.

### Key Components
- **`templates/addons/acceptance-criteria.md.tmpl`**: the gated document, emitting nothing at Level 1
- **`templates/spec-kit-docs.json`**: declares the document, its version and its section gates per level
- **`scripts/rules/check-ac-closure.sh`**: the closure gate, including cutoff and waiver verification
- **`scripts/lib/validator-registry.json`**: binds the rule id, severity and flags to the script

### Data Flow
`validate.sh` resolves the orchestrator, which reads the registry, bridges each shell rule by sourcing it and calling `run_check`, and maps the returned `RULE_STATUS` to an entry severity. `AC_CLOSURE` reads `spec.md` for the packet's level and creation date, `acceptance-criteria.md` for the criterion rows, and `decision-record.md` to confirm any cited ADR exists.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `spec-kit-docs.json` (policy) | Declares the document set per level | update | `template-structure.js docs 2` still resolves core-only |
| `check-files.sh` (consumer) | Hard-errors on missing required docs, cutoff-blind | unchanged | Left untouched deliberately; see ADR-002 |

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

### Phase 1: Setup

Read the Level contract, the file-presence resolver and the existing cutoff constants before writing anything. This phase exists to answer one question: can the document be made required without breaking the packets already on disk? The answer shaped ADR-002.

### Phase 2: Implementation

Author the gated template, declare it in the Level contract, build the closure rule with its cutoff and waiver verification, register it, and repoint the coverage advisory at the canonical document. Gate the acceptance-criteria column out of `spec.md` above Level 1 last, so the counter has a fallback while the rest lands.

### Phase 3: Verification

Render the template at every level, drive the closure rule through a fixture covering both negative controls, confirm the rule reaches the report end to end, then sweep the reference surfaces and re-run the recursive strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `run_check` across eight fixture packets | Bash fixture harness |
| Integration | Rule reaching the report through the registry bridge | `validate.sh --json` |
| Manual | Template renders per level | `inline-gate-renderer.sh --level N` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `AC_COVERAGE` rule from phase 001 | Internal | Green | Without it there is no counter to repoint; the closure gate would need to build one |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the gate blocks packets it should have grandfathered, or the reference sweep proves the contract change is wrong.
- **Procedure**: set `SPECKIT_AC_CLOSURE=false` for an immediate, file-free stop. To remove it, delete the registry entry and `check-ac-closure.sh`, drop `acceptance-criteria.md` from `optionalAddonDocs` and `sectionGates`, and revert the two template edits.
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
| Setup | Low | Contract read and cutoff pattern confirmed |
| Core Implementation | Medium | Template, contract entry, closure rule, coverage repoint |
| Verification | Medium | Eight-case fixture plus end-to-end integration |
| **Total** | | **One working session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Set `SPECKIT_AC_CLOSURE=false` to disable the gate without editing files
2. Revert the template, contract and rule commits if the gate is being removed outright
3. Re-run `validate.sh --strict` on a Level 2 and a Level 3 packet and confirm the prior result
4. Note the reversal in the packet changelog, since the Level contract is operator-facing

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. No packet content is rewritten; the rollout is forward-only by cutoff.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │    Core     │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │  Phase 2b │
                    │  Parallel │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Gated template | None | `acceptance-criteria.md` render | Contract entry, worked examples |
| Contract entry | Gated template | Level document set | Closure rule |
| Closure rule | Gated template | `AC_CLOSURE` verdict | Reference sweep |
| Reference sweep | Contract entry, closure rule | Published Level contract | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Gated template** - renders per level - CRITICAL
2. **Closure rule and registry entry** - the gate itself - CRITICAL
3. **Negative controls** - proves the gate catches what it exists to catch - CRITICAL

**Total Critical Path**: template to proven gate, in one session.

**Parallel Opportunities**:
- The reference sweep and the worked examples can run alongside the rule work
- Documentation of flags and rules can follow once the rule's behavior is fixed
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Template gated | Level 1 renders nothing; 2/3/3+ render the document | Phase 1 |
| M2 | Gate enforcing | Eight-case fixture behaves as specified | Phase 2 |
| M3 | Contract published | Every reference surface names the document | Phase 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Acceptance criteria become canonical and closure-gating

**Status**: Accepted

**Context**: Criteria were authored in two places and enforced in neither; coverage was advisory only. Full record in `decision-record.md`.

**Decision**: `acceptance-criteria.md` is canonical at Levels 2, 3 and 3+, and `AC_CLOSURE` gates closure with ADR-backed waivers.

**Consequences**:
- Completion becomes a claim about criteria rather than about a checklist
- One more document per gated packet; it is scaffolded and replaces duplicated content

**Alternatives Rejected**:
- Promote `AC_COVERAGE` to ERROR: rejected, it counts table cells and has no waiver concept

---

