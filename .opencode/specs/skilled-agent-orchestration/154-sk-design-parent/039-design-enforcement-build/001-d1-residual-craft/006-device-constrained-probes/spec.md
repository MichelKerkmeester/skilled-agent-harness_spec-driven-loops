---
title: "Feature Specification: Device And Constrained-Context Probes"
description: "The hardening matrix has no row for the device a surface runs on, so low-power, data-saver, throttled, reconnect, and slow-media failures go unaudited. This adds a Device And Constrained Context section of five probes, each with a pass/fail/skip verdict and evidence."
trigger_phrases:
  - "d1-r6 constrained context probes"
  - "device constrained probes design build"
  - "low-power save-data throttle offline slow-media probes"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/001-d1-residual-craft/006-device-constrained-probes"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgraded spec to Level 2; recorded advisory-reference vs future docs-benchmark ceiling"
    next_safe_action: "Run validate.sh --strict; let orchestrator regenerate description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Whether the probes need a checker resolved to no — the matrix is a walked reference, so the bite is an auditor filing a finding, not a script exit code"
---
# Feature Specification: Device And Constrained-Context Probes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `006-device-constrained-probes` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The hardening edge-case matrix (`hardening_edge_cases.md`) proves a surface survives long text, network errors, permission states, concurrency, RTL, text expansion, CJK and emoji, and trapped overlays — but it has no row for the device the surface actually runs on. A phone in battery-saver, a data-capped connection, a low-end CPU, a connection that drops and returns mid-flow, and a large asset arriving over a slow link are all real production conditions, and the matrix leaves every one of them unaudited. The impeccable corpus covers exactly this device/constrained-context gap (`harden.md:18`).

### Purpose
Give the audit a concrete probe for each of those five conditions, in the matrix's own house style, with each probe recording a pass/fail/skip verdict plus evidence so a reviewer can confirm the condition was walked, not skipped silently. The acceptance is an advisory review: the matrix is a reference the audit walks, and the probe bites by an auditor filing a finding on the symptom, the same as every existing row.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `Device And Constrained Context` section added to `design-audit/references/hardening_edge_cases.md`, inserted immediately before `## 9. ROUTING SUMMARY`.
- Five probes: low-power / battery-saver, Save-Data / data-saver, CPU-throttle / low-end device, offline-to-online recovery, slow media.
- The recording shape: each probe carries a probe description, the unhardened symptom, the finding to file, and a `verdict: pass | fail | skip` plus an `evidence:` slot.
- A closing routing/boundary note that routes measurable evidence to its owners and distinguishes the recovery probe from the existing §3 offline-failure row.

### Out of Scope
- Any checker or script over the matrix — `hardening_edge_cases.md` is a walked reference with no code-enforced gate; adding enforcement would invent a false trust signal.
- Performance-measurement content (Core Web Vitals, rendering, motion performance), which `accessibility_performance.md` §3-5 owns; the section routes measurable evidence there rather than restating thresholds.
- Implementing the hardening itself, which is `sk-code` work after the user accepts the fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-audit/references/hardening_edge_cases.md` | Modify | Additive `## 8B. DEVICE AND CONSTRAINED CONTEXT` section; no section removed or renumbered |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The matrix carries a `Device And Constrained Context` section with all five probes (low-power, Save-Data, CPU-throttle, offline-to-online, slow media) | The five conditions each appear as their own probe row in the section's three-column table |
| REQ-002 | Each probe records a `pass / fail / skip` verdict and an evidence slot | Every finding cell carries the verdict convention and names the evidence to capture, or, for a skip, the reason and the confirming probe needed |
| REQ-003 | Additive only — no existing probe section is rewritten and no existing heading is renumbered | The diff is an inserted section; §8A and §9 heading numbers are unchanged (`git diff --stat` reports insertions only) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | House-style consistency | The section has an intro sentence, the three-column probe table in fixed order, and a closing routing/boundary note — the same shape as §2-8A |
| REQ-005 | Boundary honesty | The section routes measurable evidence to `accessibility_performance.md` rather than restating thresholds, and the offline-to-online probe covers recovery, distinct from the §3 offline-failure row |
| REQ-006 | Evergreen | The authored section embeds no spec, packet, or phase identifiers and no `specs/` paths — only evergreen owner-doc references |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewer walking the section finds all five probes, each with a probe, an unhardened symptom, a finding to file, and a recorded `pass / fail / skip` verdict with an evidence slot.
- **SC-002**: The change is strictly additive — `git diff --stat` reports insertions only, no existing probe section is rewritten, and no existing section number changes.
- **SC-003**: The section holds its boundaries: measurable evidence is routed to `accessibility_performance.md` (no thresholds copied in), and the offline-to-online probe reads as a recovery probe, not a restatement of the §3 offline-failure row.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The section is advisory only — a walked reference with no checker, so a probe can be skipped without anything failing | Med | The verdict convention forces a recorded `pass / fail / skip`, and a skip stays inferred and names the confirming evidence; the honesty is in the recording, not a gate |
| Risk | The constrained-context resilience could be mistaken for a measured performance result | Med | The closing note routes measurable evidence to `accessibility_performance.md` and states the section proves the question is asked, not that the surface survives |
| Risk | The offline-to-online probe could duplicate the existing §3 offline-failure row | Low | The closing note states the new probe covers clean reconnect (recovery), the §3 row covers contained failure — the two axes do not overlap |
| Dependency | `accessibility_performance.md` §3-5 (performance boundary) | Performance findings have no owner to route measurable evidence to | Reference by evergreen path + section, never line numbers |
| Dependency | `evidence_capture.md` (evidence model), `audit_contract.md` (severity) | The verdict/evidence slot has no capture convention or severity model to cite | Both are stable owner docs cited by evergreen path |
| Dependency | impeccable `harden.md` (corpus source for the constrained-context gap) | The build loses its grounding for which constraints to probe | Corpus is read-only source, captured in the spec evidence |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The section matches the matrix house style so a future editor extends it the same way they extend §2-8A — intro sentence, three-column table, closing routing note.

### Reliability
- **NFR-R01**: The section is additive and referenced by no script, asset, or downstream consumer, so reverting it restores the prior file exactly with nothing to reconcile.

### Honesty
- **NFR-H01**: The acceptance is stated as an advisory review, not a checker run; nothing in the section implies an automated check fires on a constrained-context failure.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Verdict Boundaries
- A probe that degrades gracefully records `pass` with the captured artifact that shows it.
- A probe that surfaces the unhardened symptom records `fail`, and the symptom becomes the filed finding.
- A probe that cannot be run on the available evidence records `skip`, stays inferred per the file's §1 rule, and names the confirming probe still needed.

### Boundary Scenarios
- Measurable evidence (load, layout-shift, long-task, interaction-latency, motion): routed to `accessibility_performance.md`, never restated as a threshold in this section.
- A connection that drops and returns mid-flow: covered by the new offline-to-online recovery probe, not the existing §3 offline-failure row.

### Scope Boundaries
- Only `hardening_edge_cases.md` is in this phase's change; sibling template/script edits in the working tree belong to a different phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | One additive matrix section of five probes; no script, no asset |
| Risk | 5/25 | Additive only, no existing craft prose touched, reversible by reverting the inserted section |
| Research | 6/20 | Grounding the five constraints from the corpus and binding the boundary to `accessibility_performance.md` and the §3 offline-failure row |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- **Advisory-reference vs future docs-benchmark ceiling.** This section makes the audit *ask* the five constrained-context questions and record a verdict with evidence, but it is a walked reference with no checker — its quality is a judgment, not a number a script returns. A future docs-benchmark lane could score whether walked audits actually exercise these probes (coverage over a fixture corpus of real surfaces), which would turn the advisory signal into a measured one. Today that stays out of scope: `hardening_edge_cases.md` is not a hubRoute scenario source (only `manual_testing_playbook/` feeds the routing corpus), so the section does not enter any existing benchmark, and the honest ceiling is recorded here rather than implied as a stronger guarantee.
- Should the five constrained-context conditions become a shared, named probe vocabulary if other modes start auditing device resilience? Today the conditions live in this section; promoting them would make the constrained-context contract explicit across modes.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
