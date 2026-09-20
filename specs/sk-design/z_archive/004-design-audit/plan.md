---
title: "Implementation Plan: Reconstruct the sk-design audit mode"
description: "This plan turns the intact design-audit source into a Level-2 reconstruction packet. The approach is source-first, read-only, and limited to the four requested packet documents, with no runtime audit execution, downstream script execution, or invented shared handoff schema."
trigger_phrases:
  - "audit reconstruction plan"
  - "design QA scoring plan"
  - "accessibility hardening plan"
  - "audit evidence workflow plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/004-design-audit"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful audit plan"
    next_safe_action: "Review plan against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/SKILL.md"
      - ".opencode/skills/sk-design/design-audit/references/"
      - ".opencode/skills/sk-design/design-audit/assets/"
      - ".opencode/skills/sk-design/design-audit/procedures/"
      - ".opencode/skills/sk-design/design-audit/scripts/"
      - ".opencode/specs/sk-design/004-design-audit/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-audit-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design audit mode
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with YAML frontmatter |
| **Framework** | System Spec Kit Level-2 manifest structure |
| **Storage** | None; this packet documents an existing skill |
| **Testing** | Source comparison and manual structural checks only |

### Overview
Read the intact audit source, all references, assets, procedures, scripts, supporting playbook material, required templates, and validated Level-2 example before drafting. Record the evidence, register, scoring, hardening, procedure, owner, handoff, and downstream-check contracts in the four packet documents without executing the skill or claiming runtime verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source of truth is fixed to design-audit/SKILL.md and its references, assets, procedures, and scripts.
- [x] The target packet path and four-file scope are pre-approved.
- [x] The Level-2 templates and validated Level-2 reference packet have been read.

### Definition of Done
- [ ] All four files carry the required frontmatter, continuity fields, Level-2 markers, and audit-specific content.
- [ ] spec.md contains the reconstruction banner, required Spec Folder metadata row, and Sources / Traceability section.
- [ ] Every template anchor is balanced and the packet contains no generated metadata files.
- [ ] The packet does not claim audit execution, browser or scan evidence, validator/generator execution, deterministic script execution, or applied fixes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-faithful Level-2 reconstruction packet for a read-only, findings-first design audit mode.

### Key Components
- Mode contract: `audit` owns review, scoring, severity, evidence, risk surfacing, and hardening while sibling modes own creation and repair.
- Smart routing: resolve the audit intent, load the always-needed corpus/register/context resources, discover guarded markdown/JSON resources, and load matching conditional domains.
- Evidence workflow: resolve one concrete target, state available and missing evidence, preserve confirmed/inferred/not-assessed labels, and complete the proof fields before readiness claims.
- Review workflow: produce P0-P3 findings before the five-dimension `/20` score, anti-pattern verdict, positive findings, owner actions, and evidence limits.
- Procedure selection: choose at most one matching private card or state `Procedure applied: none - baseline audit workflow`; direct fallback preserves the same proof bar with Read, Glob, and Grep only.
- Handoff and downstream checks: route accepted findings through the shared backlog envelope without applying fixes; leave the performance, polish, and fixture checks to Bash-capable downstream execution.

### Data Flow
The request selects public `audit` and an intent domain. The mode resolves the register and target, inventories evidence, conditionally loads references/assets, selects at most one procedure card, records findings and owner directions, scores the five dimensions, and emits a backlog handoff when findings are accepted. The mode remains non-mutating and does not execute the two local scripts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .opencode/skills/sk-design/design-audit/SKILL.md | Shipped audit mode contract | Unchanged; source of truth | Compare packet claims with activation, routing, workflow, rules, success, and integration sections. |
| .opencode/skills/sk-design/design-audit/references/ | Scoring, evidence, accessibility, critique, anti-pattern, hardening, routing, and provenance guidance | Unchanged; cited evidence | Confirm each cited path is real and its use is limited to stated guidance. |
| .opencode/skills/sk-design/design-audit/procedures/ | Two private audit-focus cards | Unchanged; selected conditionally | Confirm accessibility and AI-slop cards remain private, read-only, and at-most-one selection. |
| .opencode/skills/sk-design/design-audit/assets/ | Report, worksheet, fix, rubric, registry, self-defect, and fixture evidence | Unchanged; cited evidence | Confirm assets are described as report inputs or downstream evidence, not as executed checks. |
| .opencode/skills/sk-design/design-audit/scripts/ | Performance-evidence and polish-readiness gates | Unchanged; downstream only | Confirm the packet states Bash is unavailable to audit and no script run is claimed. |
| .opencode/skills/sk-design/shared/register.md and shared handoff/context pointers | Shared contracts named by the source | Unchanged; not redefined here | Preserve only the audit-owned fields and routing uses named by the source. |
| .opencode/specs/sk-design/004-design-audit/ | Reconstruction packet | Create exactly spec.md, plan.md, tasks.md, and checklist.md | Inspect file list, frontmatter, anchors, banner, metadata row, and traceability manually. |

Required inventories:
- Same-class producers: not applicable; this is documentation reconstruction and changes no runtime producer.
- Consumers of changed symbols: not applicable; no source symbol, API field, or implementation token changes.
- Matrix axes: audit intent, target type, evidence type and label, Brand-vs-Product register, resource-loading level, procedure-card selection, score dimensions, severity, owner, script gate, and downstream handoff.
- Algorithm invariant: findings and evidence labels precede score and readiness language; no packet statement grants write authority, applies a fix, runs a script, or expands an undisclosed shared schema.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read the complete design-audit SKILL.md.
- [ ] Read every file under references/, assets/, procedures/, and scripts/.
- [ ] Read the supporting README, feature catalog, manual playbook, changelog, Level-2 templates, and validated Level-2 example.
- [ ] Record target resolution, evidence labels, register gate, score, severity, hardening, procedure, owner, handoff, and script boundaries.

### Phase 2: Core Implementation
- [ ] Author spec.md with source-faithful audit ownership, evidence contract, scoring, edge cases, risks, and traceability.
- [ ] Author plan.md with the source-first approach, affected-surface map, phases, testing strategy, and downstream boundary.
- [ ] Author tasks.md with bounded setup, authoring, and structural-verification work.
- [ ] Author checklist.md with Level-2 protocol, source checks, N/A handling, and summary.

### Phase 3: Verification
- [ ] Inspect all frontmatter for four trigger phrases and the complete continuity block.
- [ ] Inspect every required anchor pair, the reconstruction banner, and the Spec Folder metadata row.
- [ ] Confirm the packet contains only the four requested files and no generated metadata.
- [ ] Confirm no claim says that the audit, browser, fixture, deterministic script, validator, generator, or downstream playbook executed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source fidelity | Mode ownership, activation, routing, evidence, scoring, hardening, procedures, handoff, and integration points | Read and manual comparison |
| Resource traceability | References, procedures, assets, scripts, and supporting paths cited in spec.md | Glob and manual path inspection |
| Report contract | Findings-first order, P0-P3 severity, five dimensions, evidence labels, and owner routing | Read and manual comparison |
| Packet structure | Frontmatter, markers, metadata row, balanced anchors, and Markdown tables | Read, Grep, and manual inspection |
| Scope check | Exactly four authored files under the target packet | Glob |
| Runtime behavior | Not executed by this reconstruction | None; downstream checks remain downstream |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Intact design-audit SKILL.md | Internal source | Available | The packet cannot make source-faithful claims without it. |
| Audit references, procedures, assets, and scripts | Internal source | Available | Evidence, scoring, hardening, card selection, fixture, and downstream-gate details would be incomplete. |
| Level-2 manifest templates | Internal format | Available | Missing markers or anchors would make the packet non-conformant. |
| Validated Level-2 reference packet | Internal example | Available | Depth and structure would be less directly calibrated. |
| Shared register, context-loading, and sk_code_handoff pointers | Sibling source | Named by SKILL.md | The packet must preserve pointers and avoid inventing their undisclosed schemas. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: A source comparison shows unsupported behavior, a required structural constraint fails, or the reconstruction is rejected.
- Procedure: Remove only the four newly authored packet files under .opencode/specs/sk-design/004-design-audit/ and leave the intact skill source, references, assets, procedures, scripts, and shared files unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Source and template review ──► Packet authoring ──► Structural and source-fidelity inspection

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source and template review | None | Packet authoring |
| Packet authoring | Source and template review | Structural inspection |
| Structural inspection | Packet authoring | Any later packet-use claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Source and template review | High | One complete reading pass across the shipped audit corpus |
| Packet authoring | Medium | One four-file drafting pass |
| Structural inspection | Low | One manual frontmatter, anchor, traceability, and scope pass |
| **Total** | | **Three bounded passes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No deployment, runtime change, data migration, or skill-source edit is in scope.
- [ ] The target packet contains only the four requested documents.
- [ ] Source-faithful claims, evidence limits, and the reconstruction banner remain explicit.
- [ ] No script, browser pass, fixture run, or validator/generator result is claimed.

### Rollback Procedure
1. Stop treating the packet as authoritative if source comparison finds drift.
2. Remove the four packet documents only if the reconstruction must be withdrawn.
3. Re-read the intact audit source and templates before recreating any packet content.
4. Keep generated metadata absent until the orchestrator handles it after acceptance.

### Data Reversal
- Has data migrations? No.
- Reversal procedure: N/A; this packet creates documentation only.
<!-- /ANCHOR:enhanced-rollback -->
