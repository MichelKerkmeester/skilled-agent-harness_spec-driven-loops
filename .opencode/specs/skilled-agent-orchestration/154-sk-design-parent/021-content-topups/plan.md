---
title: "Plan: sk-design targeted per-mode content top-ups"
description: "Execution plan for the completed per-mode content top-ups: authored the interface redesign intake, foundations examples, motion advanced-craft top-up, audit worksheet and calibration rubric, and the md-generator wrapper, smoke lane, probes and exemplar, then packaged and validated."
trigger_phrases:
  - "sk-design content topups plan"
  - "md-generator wrapper plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/021-content-topups"
    last_updated_at: "2026-06-27T08:55:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Marked the plan complete after package, benchmark and backend verification"
    next_safe_action: "Use the refreshed packet and benchmark reports as the handoff state"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-021-content-topups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design targeted per-mode content top-ups

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope and remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references and assets (sk-doc) plus one md-generator orchestration wrapper |
| **Framework** | sk-design five mode packets, `package_skill.py` check, HVR rules |
| **Storage** | The interface, foundations, motion, audit, and md-generator packets |
| **Testing** | `package_skill.py --check` on touched skills, `validate.sh --strict`, HVR review |

### Overview
Add the one evidence-backed content gap each lineage named, keeping the family lean. Interface gets a redesign intake with a never-silently-change list. Foundations gets two annotated worked examples marked illustrative. Motion gets a compact advanced-craft top-up. Audit gets an evidence worksheet and a 0-4 Anti-Patterns calibration rubric. Md-generator gets a guided preflight/run wrapper that orchestrates the existing tools without auto-authoring, a smoke lane, schema-aligned probes, and one non-SaaS exemplar. Every addition is checked against the unanimous do-not list and the Human Voice Rules.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The five lineage content findings and the do-not list read
- [x] The live five mode packets confirmed for each addition's home, avoiding duplication
- [x] The md-generator fidelity boundary confirmed so the wrapper never auto-authors

### Definition of Done
- [x] Each of the five modes gains its named content top-up
- [x] The foundations examples are marked illustrative, not presets, and the wrapper never auto-authors
- [x] `package_skill.py --check` passes on every touched skill
- [x] `validate.sh --strict` passes on this packet and all new prose is HVR-clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted content top-up: add only the one evidence-backed gap per mode, each compact and traceable, with the md-generator wrapper as an orchestrator of existing tools rather than a new capability.

### Key Components
- **interface redesign intake**: greenfield vs preserve vs overhaul, plus the never-silently-change list.
- **foundations annotated examples**: a dense product dashboard and a generous brand landing, both marked illustrative.
- **motion advanced-craft top-up**: origin-aware popovers, instant follow-up tooltips, `@starting-style`, slow-motion debugging, the Framer Motion shorthand caveat.
- **audit evidence worksheet and Anti-Patterns rubric**: confirmed/inferred/not-assessed labels into findings, plus the 0-4 calibration ladder.
- **md-generator wrapper, smoke lane, probes, exemplar**: a guided preflight/run that orchestrates extract to write-prompt to validate to report without auto-authoring, a 3-step smoke lane, schema-aligned probes, and one non-SaaS exemplar.

### Data Flow
`five lineage content findings + do-not list + HVR rules` -> author each per-mode top-up against its packet -> `package_skill.py --check` on touched skills -> `validate.sh --strict` and HVR review -> record the acceptance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds one evidence-backed content top-up per mode. It adds no forward-authoring capability and weakens no fidelity rule.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-interface/` | no explicit redesign intake | edit | redesign intake plus never-silently-change list present |
| `design-foundations/` | no completed worked example | edit | two annotated examples marked illustrative, not presets |
| `design-motion/` | residual craft uncaptured | edit | compact advanced-craft top-up present |
| `design-audit/` | strong evidence rules, no worksheet | edit | evidence worksheet plus 0-4 Anti-Patterns rubric present |
| `design-md-generator/` | explicit multi-command workflow | edit | guided wrapper (no auto-author), smoke lane, schema-aligned probes, non-SaaS exemplar present |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the five lineage content findings and the `../015-per-skill-improvement-research/decision-record.md` do-not list
- [x] Confirm each addition's home in the live five mode packets, avoiding duplication of existing content
- [x] Confirm the md-generator fidelity boundary so the wrapper orchestrates without auto-authoring

### Phase 2: Core Implementation
- [x] Author the interface redesign intake (greenfield vs preserve vs overhaul) with the never-silently-change list
- [x] Author the two foundations annotated examples, each marked illustrative and not a preset
- [x] Author the motion compact advanced-craft top-up reference
- [x] Author the audit evidence worksheet and the 0-4 Anti-Patterns calibration rubric
- [x] Author the md-generator guided preflight/run wrapper, the smoke lane, the schema-aligned probes and one non-SaaS exemplar

### Phase 3: Verification
- [x] Run `package_skill.py --check` on every touched skill (exit 0)
- [x] Run `validate.sh --strict` on this packet and confirm all new prose is HVR-clean
- [x] Confirm the wrapper never auto-authors and the foundations examples are marked illustrative
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | The five per-mode top-ups | sk-doc review plus HVR check |
| Packaging | Every touched sk-design skill | `package_skill.py --check` (exit 0) |
| Behavior | The md-generator wrapper boundary | Confirm the wrapper orchestrates existing tools and never auto-authors |
| Static | This packet's spec docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The five lineage content findings | Internal | Green | The additions cannot be grounded |
| `../015-per-skill-improvement-research/decision-record.md` do-not list | Internal | Green | A change could violate the unanimous constraints |
| `package_skill.py` and the HVR rules | Internal | Green | The acceptance and voice cannot be recorded |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:phase-deps -->
## 7. PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 Setup | `../015-per-skill-improvement-research` | The per-mode content gaps and do-not list come from the lineages |
| Phase 2 Implementation | Phase 1 | Each top-up needs its confirmed home and the fidelity boundary |
| Phase 3 Verification | Phase 2 | Packaging, validation, and HVR review need the content in place |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## 8. EFFORT ESTIMATE

| Phase | Effort | Notes |
|-------|--------|-------|
| Phase 1 Setup | S | Read five lineages, the do-not list, and the five packet homes |
| Phase 2 Implementation | L | Five content additions plus the md-generator wrapper and exemplar |
| Phase 3 Verification | M | `package_skill.py --check`, `validate.sh --strict`, and HVR review across all new prose |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:rollback -->
## 9. ROLLBACK PLAN

- **Trigger**: An addition reads as a preset, the wrapper auto-authors, or packaging or HVR review fails.
- **Procedure**: Each top-up is additive. To revert, delete the added reference, asset, or wrapper. No existing content or fidelity rule is mutated, so rollback is a file delete plus removing any wired router reference.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

| Trigger | Detection | Action | Owner |
|---------|-----------|--------|-------|
| Foundations example read as a preset | Review finds copyable values without the illustrative marker | Add the not-a-preset marking and reframe values as illustrative | implementing subagent |
| Md-generator wrapper auto-authors | The wrapper writes DESIGN.md content | Reduce the wrapper to orchestration only and restate the no-auto-author rule | implementing subagent |
| New prose fails HVR | The HVR check flags em dashes, semicolons, or Oxford commas | Rewrite the flagged lines to HVR-clean voice and recheck | implementing subagent |
<!-- /ANCHOR:enhanced-rollback -->
