---
title: "Feature Specification: sk-design targeted per-mode content top-ups"
description: "Completed Level-2 implementation phase: added the evidence-backed content each lineage named as a real gap. Interface gained a redesign intake, foundations gained worked examples, motion gained an advanced-craft top-up, audit gained an evidence worksheet plus an Anti-Patterns rubric, and md-generator gained a guided wrapper, smoke lane and non-SaaS exemplar."
trigger_phrases:
  - "sk-design content topups phase"
  - "interface redesign intake"
  - "md-generator preflight run wrapper"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/021-content-topups"
    last_updated_at: "2026-06-27T08:55:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Completed the per-mode content top-ups and refreshed verification evidence"
    next_safe_action: "Use the refreshed packet and benchmark reports as the handoff state"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-021-content-topups"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design targeted per-mode content top-ups

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-27 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../020-benchmark-fixtures/spec.md |
| **Successor** | None (final planned phase of the plumbing frontier) |
| **Handoff Criteria** | Each per-mode top-up is authored as an evidence-backed addition (interface redesign intake, foundations two annotated examples, motion advanced-craft top-up, audit evidence worksheet plus Anti-Patterns calibration rubric, md-generator guided wrapper plus smoke lane plus schema-aligned probes plus one non-SaaS exemplar), `validate.sh --strict` passes, `package_skill.py --check` passes on every touched skill, and all new prose follows the Human Voice Rules (no em dashes, no semicolons, no Oxford commas) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 015 synthesis ruled content largely landed, but each lineage still named a small, evidence-backed content gap worth filling without bloating the family. Interface lacks an explicit redesign intake that classifies greenfield versus preserve versus overhaul and a never-silently-change list, which the external corpus calls the biggest source of bad redesign output (`../015-per-skill-improvement-research/001-interface/research/lineages/gpt55fast/research.md`, P1 redesign intake). Foundations has no completed worked example showing what a good token answer looks like (`../015-per-skill-improvement-research/002-foundations/research/lineages/gpt55fast/research.md`, P2-2). Motion has residual high-value craft not yet captured: origin-aware popovers, instant follow-up tooltips, `@starting-style`, slow-motion debugging, and the Framer Motion shorthand-under-load caveat (`../015-per-skill-improvement-research/003-motion/research/lineages/gpt55fast/research.md`, P1 advanced craft). Audit needs an evidence worksheet that carries confirmed, inferred, and not-assessed labels into findings, plus a calibration rubric for the Anti-Patterns score (`../015-per-skill-improvement-research/004-audit/research/lineages/gpt55fast/research.md`, R3 and R5). Md-generator needs a guided preflight/run wrapper, a smoke lane, schema-aligned validation probes, and one non-SaaS extraction exemplar (`../015-per-skill-improvement-research/005-md-generator/research/lineages/gpt55fast/research.md`, P1 wrapper, P1 smoke lane, P2 exemplar).

### Purpose
Add the targeted, evidence-backed content each lineage named, and nothing more, so each mode closes its one real content gap while the family stays lean. Every addition is illustrative or operational, not a reusable preset, and the md-generator wrapper orchestrates the existing extract-to-write-to-validate-to-report tools without auto-authoring or weakening fidelity.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Interface: a redesign intake that classifies greenfield versus preserve versus overhaul, with a never-silently-change list (URLs, nav labels, form fields, legal copy).
- Foundations: two fully-worked annotated examples (a dense product dashboard and a generous brand landing), each clearly marked illustrative and NOT a reusable preset.
- Motion: a compact advanced-craft top-up reference (origin-aware popovers, instant follow-up tooltips, `@starting-style`, slow-motion debugging, the Framer Motion shorthand-under-load caveat).
- Audit: an evidence worksheet carrying confirmed, inferred, and not-assessed labels into findings, plus a 0-4 calibration rubric for the Anti-Patterns score.
- Md-generator: a guided preflight/run wrapper (checks Node, deps, Chromium, output path, then orchestrates extract to write-prompt to validate to report and must not auto-author or weaken fidelity), a 3-step smoke lane, schema-aligned validation probes, and one non-SaaS extraction exemplar.

### Out of Scope
- The plumbing fixes in the sibling phases: the shared-register loader (016), the two real bugs (017), the routing wiring (018), the handoff schema (019), and the benchmark fixtures (020).
- Any forward-authoring capability for md-generator or any weakening of the cardinal fidelity rule. The wrapper orchestrates the existing tools only.
- Bulk corpus import, mode splitting, or redundant basics, all on the unanimous do-not list.

### Inputs (read-only)
- The per-mode content gaps: the interface (P1 redesign intake), foundations (P2-2 examples), motion (P1 advanced craft), audit (R3 worksheet, R5 calibration), and md-generator (P1 wrapper, P1 smoke lane, P2 exemplar) lineage research.
- The do-not constraints: `../015-per-skill-improvement-research/decision-record.md` (the do-not list) and the md-generator authoring boundary that keeps forward-authoring out of scope.
- The live five mode packets and their references, assets, and manual playbooks, to confirm each addition's home and avoid duplicating existing content.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/` | Updated | A redesign intake (greenfield vs preserve vs overhaul) with a never-silently-change list |
| `.opencode/skills/sk-design/design-foundations/` | Updated | Two annotated worked examples marked illustrative, not presets |
| `.opencode/skills/sk-design/design-motion/` | Updated | A compact advanced-craft top-up reference for the residual Emil craft |
| `.opencode/skills/sk-design/design-audit/` | Updated | An evidence worksheet and a 0-4 Anti-Patterns calibration rubric |
| `.opencode/skills/sk-design/design-md-generator/` | Updated | A guided preflight/run wrapper, a smoke lane, schema-aligned probes, and one non-SaaS exemplar |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The md-generator wrapper preserves the fidelity boundary | The guided preflight/run wrapper checks Node, deps, Chromium, and output path and orchestrates extract to write-prompt to validate to report, and it does NOT auto-author DESIGN.md or weaken the cardinal fidelity rule |
| REQ-002 | Each addition is evidence-backed and not a preset | Every per-mode top-up traces to its lineage finding, the foundations examples are marked illustrative and not reusable presets, and nothing on the do-not list is added |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The interface, motion, and audit top-ups are authored | Interface gains the redesign intake with the never-silently-change list, motion gains the advanced-craft top-up, and audit gains the evidence worksheet and the 0-4 Anti-Patterns calibration rubric |
| REQ-004 | The phase validates, packages, and reads as human voice | `validate.sh --strict` passes on this packet, `package_skill.py --check` passes (exit 0) on every touched skill, and all new prose follows the Human Voice Rules (no em dashes, no semicolons, no Oxford commas) |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of the five modes gains its one evidence-backed content top-up, the foundations examples are marked illustrative, and the md-generator wrapper orchestrates the existing tools without auto-authoring or weakening fidelity.
- **SC-002**: `package_skill.py --check` passes on every touched skill, `validate.sh --strict` passes on this packet, and all new prose is HVR-clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The foundations examples are read as reusable presets | Operators copy values instead of designing | Mark each example illustrative and state explicitly it is not a preset, per the foundations lineage |
| Risk | The md-generator wrapper drifts into auto-authoring | The cardinal fidelity rule weakens | Keep the wrapper an orchestrator of existing tools, never a writer, and state the no-auto-author rule in the wrapper |
| Risk | The top-ups collectively bloat the family | Routing precision drops | Add only the named gaps, keep each compact, and confirm packaging stays clean |
| Dependency | The five lineage content findings | The additions cannot be grounded | Read each lineage's named content gap for the exact shape |
| Dependency | `../015-per-skill-improvement-research/decision-record.md` do-not list | A change could violate the unanimous constraints | Check each addition against the do-not list before authoring |
| Dependency | `package_skill.py` and the HVR rules | The acceptance cannot be recorded | Run `--check` on every touched skill and apply the HVR rules to all new prose |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| Fidelity | The md-generator wrapper never auto-authors and never weakens the cardinal fidelity rule |
| Voice | All new prose follows the Human Voice Rules: no em dashes, no semicolons, no Oxford commas |
| Leanness | Only the named per-mode gaps are added, so the family stays lean and routing precision holds |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- A redesign prompt that is genuinely greenfield must route through the intake to the greenfield path, not be forced into a preserve audit.
- The md-generator wrapper run with a missing Chromium or unwritable output path must fail at preflight with a clear message, not part-way through extraction.
- An audit finding with no rendered evidence must be labelled not-assessed in the worksheet rather than inferred or confirmed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

Moderate. Five independent content additions across five modes, each small and evidence-backed, plus an md-generator wrapper that must orchestrate existing tools without crossing the fidelity boundary. The main care points are keeping the foundations examples non-preset and the wrapper non-authoring, and holding every new line to the Human Voice Rules.
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Whether the interface redesign intake is a standalone reference or folded into the real-UI loop: the interface lineage recommends standalone only if the router can load it narrowly for redesign terms, so the implementing subagent confirms the routing before choosing.
- Whether the md-generator wrapper lives in the backend as a script or as a documented orchestration in the SKILL.md: the implementing subagent picks the form that preserves the phase boundaries and the no-auto-author rule against the live pipeline.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
