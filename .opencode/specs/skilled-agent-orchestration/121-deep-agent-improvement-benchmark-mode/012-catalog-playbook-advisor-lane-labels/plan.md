---
title: "Implementation Plan: Phase 12: catalog-playbook-advisor-fp25"
description: "Plan for adding lane labels to catalog and playbook plus a display-only mode mix line in reduce-state.cjs, verified by vitest."
trigger_phrases:
  - "lane legend"
  - "lane note"
  - "mode mix"
  - "reduce-state"
  - "plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/121-deep-agent-improvement-benchmark-mode/012-catalog-playbook-advisor-lane-labels"
    last_updated_at: "2026-05-29T09:41:00Z"
    last_updated_by: "build-agent"
    recent_action: "Plan lane labels + reduce-state mode mix display"
    next_safe_action: "Run vitest then validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs"
      - ".opencode/skills/deep-agent-improvement/scripts/tests/reduce-state-mode-mix.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/012-catalog-playbook-advisor-lane-labels"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: catalog-playbook-advisor-fp25

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS (reduce-state.cjs), Markdown docs |
| **Framework** | None |
| **Storage** | None (reads JSONL ledger, writes registry JSON and dashboard markdown) |
| **Testing** | vitest |

### Overview
Add lane labels to feature_catalog.md and manual_testing_playbook.md so each entry and scenario states its lane. In reduce-state.cjs, count the existing `mode` field per profile bucket and globally, then render a "Lane (mode) mix" line in the per-profile section and the dashboard global summary. A new vitest feeds records with mode=model-benchmark and asserts the mix appears in both the registry and the dashboard.
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
Reducer over a JSONL ledger that emits a registry JSON and a dashboard markdown.

### Key Components
- **Profile bucket builder**: gains a `modes` map seeded with both lane keys at zero.
- **Registry builder**: increments `bucket.modes[mode]` and a global `modes` map per record, defaulting a missing mode to agent-improvement.
- **Profile-section and dashboard renderers**: print a "Lane (mode) mix" line via a shared `formatLaneModeMix` helper.

### Data Flow
Each ledger record carries a `mode` field. The registry builder reads it, increments the per-profile and global counts, exposes `registry.modes` and `bucket.modes`, and the renderers format both into the dashboard.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| reduce-state.cjs registry builder | Aggregates ledger records into the registry | update (add mode counts) | reduce-state-mode-mix.vitest.ts asserts registry.modes |
| reduce-state.cjs renderers | Produce dashboard markdown | update (add mix line) | vitest asserts both dashboard mix lines |
| score-candidate.cjs / run-benchmark.cjs | Producers that stamp the mode field | unchanged (read-only consumer of mode) | rg confirms mode is already emitted |

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
- [x] Read feature_catalog.md, manual_testing_playbook.md, and reduce-state.cjs
- [x] Confirm the `mode` field is stamped by score-candidate.cjs and run-benchmark.cjs

### Phase 2: Core Implementation
- [x] Add lane legend and per-category tags to feature_catalog.md
- [x] Add lane note to manual_testing_playbook.md
- [x] Surface the mode mix in reduce-state.cjs registry, profile section, and dashboard

### Phase 3: Verification
- [x] Add and run reduce-state-mode-mix.vitest.ts
- [x] Run the full vitest suite green
- [x] Update spec, plan, tasks, and implementation summary
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | reduce-state mode mix in registry and dashboard | vitest |
| Regression | Full deep-agent-improvement script suite | vitest |
| Manual | Read catalog and playbook to confirm lane labels | none |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| mode field on records | Internal | Green | Mix would show all agent-improvement; mitigated by default |
| vitest | Internal | Green | Cannot prove the display change without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Vitest fails or the mode mix double-counts records.
- **Procedure**: Revert the reduce-state.cjs and doc edits via git; the change is additive and self-contained.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

