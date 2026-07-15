---
title: "Implementation Plan: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/007-phased-spec-preference"
    last_updated_at: "2026-07-11T15:51:28.214Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/029-phased-spec-preference"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Analyze system-spec-kit routing docs and design enforcement of a phased-spec-over-new-folder preference policy

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown governance docs (system-spec-kit SKILL.md + references + constitutional) |
| **Framework** | system-spec-kit phase system + Gate 3 spec-folder-question protocol |
| **Storage** | N/A (no code, no DB) |
| **Testing** | Manual cross-check of GPT's proposal against the actual reference docs; `validate.sh --strict` on this packet |

### Overview
Dispatch `openai/gpt-5.6-sol-fast --variant xhigh` via cli-opencode to read system-spec-kit's full routing surface (SKILL.md, phase_system.md, phase_definitions.md, folder_routing.md, level_decision_matrix.md, spec-folder-naming.md, quick_reference.md, and both CLAUDE.md Gate 3 blocks) and draft concrete wording that makes "extend the active phased packet" the default over "create a new spec folder." This session then verifies the proposal is internally consistent with the existing phase-detection thresholds before handing it to the operator.
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
Research-dispatch-then-verify (not code architecture)

### Key Components
- **prompt-improver (CRAFT framework)**: builds the dispatch-ready GPT-5.6 prompt (policy-sensitive → Tier-3 escalation per `cli_prompt_quality_card.md`)
- **cli-opencode**: dispatches `openai/gpt-5.6-sol-fast --variant xhigh` with full repo runtime access to read the actual docs
- **This session**: cross-checks the returned proposal against `phase_system.md` / `folder_routing.md` before presenting it

### Data Flow
User request → prompt-improver builds ENHANCED_PROMPT → `opencode run` dispatch (JSON event stream) → raw output saved to `scratch/` → this session verifies + synthesizes → `implementation-summary.md` → present to operator for approval before any doc edits.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| [producer/helper/policy] | [what owns the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |
| [consumer/status/docs/tests] | [how it observes the behavior] | [update/unchanged/not a consumer] | [grep/test/doc evidence] |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffolded (this packet)
- [x] cli-opencode + cli-external SKILL.md contracts read (constitutional preload rule)
- [ ] Provider auth pre-flight for `openai` confirmed

### Phase 2: Dispatch + Synthesize
- [ ] prompt-improver builds CRAFT-framework dispatch prompt (Tier-3 escalation: policy/governance sensitivity)
- [ ] `opencode run --model openai/gpt-5.6-sol-fast --variant xhigh` dispatched, output captured to `scratch/`
- [ ] Proposal cross-checked against `phase_system.md`, `folder_routing.md`, Gate 3 prose

### Phase 3: Verification
- [ ] Proposal presented to operator with explicit file-path + wording-diff recommendations
- [ ] `implementation-summary.md` written
- [ ] `validate.sh --strict` clean on this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| N/A | No code — doc-analysis packet | — |
| Manual | Proposal cross-checked against live reference docs, not trusted blindly | Read + Grep |
| Structural | Spec packet itself | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `openai` provider configured in opencode | External | Unconfirmed (pre-flight pending) | Ask operator before falling back to `deepseek/deepseek-v4-pro` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: No policy edits ship in this packet, so there's nothing to roll back — it's an analysis + proposal only.
- **Procedure**: Delete `scratch/` contents if the dispatch is aborted; the spec folder itself stays as a record.
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
| Setup | [Low/Med/High] | [e.g., 1-2 hours] |
| Core Implementation | [Low/Med/High] | [e.g., 4-8 hours] |
| Verification | [Low/Med/High] | [e.g., 1-2 hours] |
| **Total** | | **[e.g., 6-12 hours]** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. [Immediate action - e.g., disable feature flag]
2. [Revert code - e.g., git revert or redeploy previous version]
3. [Verify rollback - e.g., smoke test critical paths]
4. [Notify stakeholders - if user-facing]

### Data Reversal
- **Has data migrations?** [Yes/No]
- **Reversal procedure**: [Steps or "N/A"]
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->

