---
title: "Feature Specification: Authoring and enforcement hardening"
description: "Phase parent for the authoring-hardening program: fix the authoring templates that omitted the element their own contract required, fix the validator false positives that punished correct documents, and make playbook enforcement fail closed per root instead of trusting a fleet run."
trigger_phrases:
  - "authoring hardening"
  - "playbook enforcement hardening"
  - "authoring template conformance gaps"
  - "032-authoring-hardening"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/032-authoring-hardening"
    last_updated_at: "2026-08-29T12:40:00Z"
    last_updated_by: "claude"
    recent_action: "Grouped template gaps, validator false positives, and per-root enforcement"
    next_safe_action: "None; all three child phases complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:df882166141f890a55e6cd4df8fa9b1707f4c3e8bce8da8074bac90350785174"
      session_id: "2026-08-29-sk-code-032"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration narratives and reorganization history
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Authoring and enforcement hardening

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-29 |
| **Branch** | `main` |
| **Packet Type** | Phase parent (lean trio) |
| **Children** | 3 (001, 002, 003) |
| **Active Child** | 003-per-root-enforcement |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Manual testing playbooks across the skill fleet had drifted to roughly 2,600 contract violations, and no build ever failed. A number that large is never a run of individual authoring mistakes; it is a system that cannot report its own state. Three separate mechanisms kept it invisible. The authoring templates that generate this material omitted elements their own governing contracts required, so every artifact produced from them inherited the omission. The validator that grades the material reported violations that were not there, which taught readers to distrust it and taught remediation agents to contort correct source until a regex was satisfied. And the enforcement gate reported success over packages it had never opened, so a growing backlog and a clean build were indistinguishable.

### Purpose

Close all three gaps at their source rather than at their symptoms: repair the templates so the next artifact authored from them cannot reproduce the omission, repair the validator so a correct document passes and a broken one still fails, and repair enforcement so a green gate means every root was actually examined. Each child phase owns one gap, carries its own control evidence, and records the hypotheses it had to withdraw as well as the ones it confirmed.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, decisions, verification evidence, and continuity live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The authoring templates under `.opencode/skills/sk-doc/` and the SKILL.md contracts that govern them.
- `validate-playbook-package.cjs`, the scanner that grades manual-testing-playbook packages, and its test suite.
- The fail-closed enforcement surface: the CI workflow, the fail-closed allowlist, the corpus manifest, and the SKILL.md discipline that explains them.
- Negative controls proving each fix both preserves real detection and removes the reported defect.

### Out of Scope

- Remediating the remaining backlog inside packages still held at warn tier; graduating those is downstream work, not this packet's.
- The routing-gold contract, skill routing blocks, and mode registries; this packet touches the operator-scenario contract only.
- Any change to what a playbook scenario must contain. The contract is unchanged; only its templates, its grader, and its gate are.

### Files to Change

Summary of aggregate scope for audit trail only. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/sk-doc/sk-create-agent/assets/agent-template.md` | Modify | 001-template-conformance-gaps | Add the related-resources section its own contract required |
| `.opencode/skills/sk-doc/sk-create-command/assets/command-template.md` | Modify | 001-template-conformance-gaps | Add the mandatory input gate for required arguments |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs` | Modify | 002-validator-false-positives | Stop reading fenced code samples as markdown links |
| `.github/workflows/playbook-operator-contract.yml` | Create | 003-per-root-enforcement | Fail-closed gate plus an assertion that every listed root is still scanned |
| `.opencode/skills/sk-doc/sk-create-manual-testing-playbook/playbook-failclosed-allowlist.txt` | Create | 003-per-root-enforcement | The fail-closed root set and the rule that governs it |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, decisions, verification, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-template-conformance-gaps/ | Two authoring templates omitted the element their own SKILL.md contract required, and every artifact generated from them inherited the omission. A third template was blamed and then cleared by a negative control. | Complete |
| 2 | 002-validator-false-positives/ | The playbook validator scanned raw markdown for links without excluding fenced code, so ordinary bracket-index call syntax in a code sample was reported as a missing path. Fixed at the root, with the downstream source workarounds reverted. | Complete |
| 3 | 003-per-root-enforcement/ | A fleet run could report success over roots it never opened, so a sub-package could carry hundreds of violations behind a green build. The first version of the gate written for this phase was itself false-green and was caught by control before shipping. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as an integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-template-conformance-gaps | 002-validator-false-positives | Every template defect is confirmed against its own written contract, and every cleared hypothesis is disproved by a control rather than by argument | The fixed elements are present in the shipped templates; the cleared template carries no edit |
| 002-validator-false-positives | 003-per-root-enforcement | The validator no longer reports a false path violation, still catches a real one, and its own suite passes | Three-way fence control plus the packet's test suite at exit 0 |
| 003-per-root-enforcement | (none; packet complete) | Enforcement is fail-closed per root, and a root leaving scan range fails the build rather than silently passing | Gate green at baseline, red on an injected regression naming the package, green again after restore |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None open. Each phase resolved its own questions against a control rather than an argument, and the one hypothesis that did not survive its control is recorded in 001-template-conformance-gaps rather than dropped. The remaining backlog inside the single still-warn-listed package is known, measured, and deliberately left to downstream remediation.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec, plan, tasks, and implementation summary
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
