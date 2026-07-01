---
title: "Implementation Plan: system-spec-kit integration [template:level_1/plan.md]"
description: "Document mk-goal as a first-class system-spec-kit OpenCode plugin surface without changing runtime behavior."
trigger_phrases:
  - "goal plugin system-spec-kit plan"
  - "mk-goal reference plan"
  - "active_goal docs plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/008-system-spec-kit-integration"
    last_updated_at: "2026-06-30T18:05:00Z"
    last_updated_by: "opencode-gpt"
    recent_action: "Completed system-spec-kit goal plugin docs integration"
    next_safe_action: "Phase complete; restart OpenCode before relying on changed plugin docs in a fresh session"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/SKILL.md"
      - ".opencode/skills/system-spec-kit/references/hooks/goal_plugin.md"
      - ".opencode/skills/system-spec-kit/feature_catalog/18--ux-hooks/goal-opencode-plugin.md"
    session_dedup:
      fingerprint: "sha256:db77967a702e6fea5b5523ade915f66cad9ca409938598eaf0a2a8f04d1d8873"
      session_id: "goal-system-spec-kit-integration-20260630"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: system-spec-kit integration

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown documentation plus existing JavaScript plugin references |
| **Framework** | OpenCode local plugin and command surfaces |
| **Storage** | Existing `.opencode/skills/.goal-state/` runtime JSON state |
| **Testing** | sk-doc structure extraction, OpenCode alignment check, goal plugin unit tests, strict spec validation |

### Overview
Add the smallest documentation layer needed for system-spec-kit to recognize and explain the goal plugin. The implementation updates existing routed references and catalog assets, creates a dedicated goal-plugin hook reference, and leaves runtime code unchanged.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified
- [x] Existing goal plugin and system-spec-kit plugin docs read before editing

### Definition of Done
- [x] Goal plugin reference, catalog, playbook, and env docs added
- [x] system-spec-kit `SKILL.md` routes goal-plugin intent
- [x] Targeted docs checks and strict parent validation pass
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation integration over existing OpenCode local plugin behavior.

### Key Components
- **Routed reference**: `references/hooks/goal_plugin.md` carries the detailed operator contract.
- **Skill router update**: `SKILL.md` maps goal-plugin terms to the new reference.
- **Catalog assets**: feature catalog and manual playbook entries make the plugin discoverable to operators.
- **Boundary docs**: architecture and bridge README clarify that `mk-goal` is standalone local plugin state, not a daemon bridge.

### Data Flow
The user calls `/goal`; `.opencode/commands/goal_opencode.md` dispatches to plugin tools; `.opencode/plugins/mk-goal.js` persists state and injects `[active_goal]`; system-spec-kit docs point operators to that contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/plugins/mk-goal.js` | Runtime owner | Unchanged | Existing plugin tests |
| `.opencode/commands/goal_opencode.md` | Thin command router | Unchanged | Read contract, docs cite state-free boundary |
| `system-spec-kit/SKILL.md` | Skill routing | Update | `rg` for `mk-goal` and `goal_plugin.md` |
| `references/hooks/goal_plugin.md` | New operator reference | Create | sk-doc structure extraction |

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
- [x] Create phase 008 scaffold under existing 032 packet
- [x] Read current goal plugin, command, and system-spec-kit plugin documentation patterns
- [x] Identify docs that should mention standalone versus bridge-backed plugins

### Phase 2: Core Implementation
- [x] Add `references/hooks/goal_plugin.md`
- [x] Update `SKILL.md`, hook-system docs, architecture docs, bridge README, and env reference
- [x] Add feature catalog and manual testing playbook entries

### Phase 3: Verification
- [x] Run targeted goal plugin tests
- [x] Run sk-doc structure extraction for new docs
- [x] Restamp metadata and run strict parent validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Existing goal plugin behavior | `node .opencode/plugins/__tests__/mk-goal-*.test.cjs` |
| Documentation | New reference/catalog/playbook structure | `python3 .opencode/skills/sk-doc/scripts/extract_structure.py ...` |
| Alignment | OpenCode skill docs and plugin docs | `verify_alignment_drift.py` |
| Spec | Parent packet and phase children | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing goal plugin implementation | Internal | Green | Docs cannot be verified against current behavior |
| system-spec-kit docs validator | Internal | Green | Cannot claim phase completion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Goal plugin docs misstate runtime ownership or validation fails.
- **Procedure**: Revert the phase-008 documentation edits and remove the new goal-plugin reference/catalog/playbook entries; runtime code is unaffected.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
