---
title: "Implementation Plan: Reconstruct the sk-design shared backbone"
description: "This plan turns the intact shared, benchmark, and feature-catalog source into a Level-2 reconstruction packet. The approach is source-first and documentation-only, with the shared contracts, recorded benchmark evidence, and hub catalog boundaries kept distinct from runtime execution."
trigger_phrases:
  - "shared backbone reconstruction plan"
  - "sk-design context proof plan"
  - "design benchmark evidence plan"
  - "design procedure card plan"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/008-design-shared-backbone"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Draft shared backbone reconstruction plan"
    next_safe_action: "Review plan against source files"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/"
      - ".opencode/skills/sk-design/benchmark/"
      - ".opencode/skills/sk-design/feature_catalog/"
      - ".opencode/specs/sk-design/008-design-shared-backbone/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-shared-backbone-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Reconstruct the sk-design shared backbone
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown with YAML frontmatter |
| **Framework** | System Spec Kit Level-2 manifest structure |
| **Storage** | None; this packet documents existing skill sources and report artifacts |
| **Testing** | Source comparison and manual structural checks only |

### Overview
Read the complete shared, benchmark, and feature-catalog source sets, the four Level-2 manifest templates, and the validated Level-2 reference packet before drafting. Record the source-defined register, context, proof, dispatch, token, procedure, script, benchmark, and catalog contracts in four packet documents without executing the skill or claiming fresh verification.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The source of truth is fixed to shared/, benchmark/, and feature_catalog/.
- [x] The target packet path and four-file scope are pre-approved.
- [x] The Level-2 templates and validated Level-2 reference packet have been read.

### Definition of Done
- [ ] All four files carry the required frontmatter, four trigger phrases, continuity fields, Level-2 markers, and source-specific content.
- [ ] spec.md contains the reconstruction banner, required Spec Folder metadata row, and Sources / Traceability section.
- [ ] Every template anchor is balanced and the packet contains no generated metadata files.
- [ ] The packet does not claim validator, generator, benchmark, script, transport, or runtime execution results.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-faithful Level-2 reconstruction packet for a shared design-contract layer.

### Key Components
- **Register and context**: Brand or Product posture, six dials, register-first loading, context manifests, and smallest useful bundles.
- **Proof and boundaries**: proof cards, hard gates, dispatch manifests, content-bound tokens, canonicalization, and fail-closed validation.
- **Vocabulary and procedures**: token roles, cognitive and numeric law references, variant parameters, private-card schema, and shared polish orchestration.
- **Deterministic checks**: command-surface parity, AI-fingerprint catalog and fixtures, proof fields, numeric-law completeness, procedure-card shape, and variant transport coverage.
- **Evidence catalogs**: benchmark reports with trace-mode caveats and feature-catalog descriptions of intake, proof cadence, transport separation, and card inventory.

### Data Flow
The hub gathers intake, resolves the smallest useful mode or bundle, sets the register, names loaded context, and applies the relevant shared proof fields. Mode-owned craft and acceptance remain in the selected mode; transports return evidence or artifacts to that mode or audit. Accepted design output can move through the shared sk-code handoff, while benchmark snapshots and feature-catalog files remain evidence about the surrounding system rather than execution inputs to this packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| .opencode/skills/sk-design/shared/ | Shared registers, contracts, cards, procedure, vocabulary, and deterministic scripts | Unchanged; source of truth | Compare each packet claim with the named source file. |
| .opencode/skills/sk-design/benchmark/ | Baseline and after-run benchmark evidence | Unchanged; recorded evidence only | Preserve trace mode, scores, coverage, unscored dimensions, and browser-harness caveats. |
| .opencode/skills/sk-design/feature_catalog/ | Current-state hub and procedure-card inventory | Unchanged; catalog evidence only | Attribute manager-shell, proof, transport, and card-count claims to the catalog files. |
| .opencode/specs/sk-design/008-design-shared-backbone/ | Reconstruction packet | Create exactly spec.md, plan.md, tasks.md, and checklist.md | Inspect file list, frontmatter, markers, anchors, banner, metadata row, and traceability manually. |

Required inventories:
- Same-class producers: not applicable; this is documentation reconstruction and does not change runtime producers.
- Consumers of changed symbols: not applicable; no source symbol, API field, transport, or implementation token is changed.
- Matrix axes: register posture, context bundle, proof lane, boundary envelope, procedure selection, deterministic check, benchmark trace mode, catalog feature, and downstream owner.
- Algorithm invariant: no packet statement may expand behavior beyond the intact source; benchmark evidence must retain its recorded scope; no script or transport execution is attributed to this authoring pass.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read every file under .opencode/skills/sk-design/shared/.
- [ ] Read every file under .opencode/skills/sk-design/benchmark/.
- [ ] Read every file under .opencode/skills/sk-design/feature_catalog/.
- [ ] Read the four Level-2 manifest templates and the validated Level-2 reference packet.
- [ ] Record the register, context, proof, boundary, token, procedure, script, benchmark, and catalog contracts.

### Phase 2: Core Implementation
- [ ] Author spec.md with source-faithful requirements, edge cases, complexity, benchmark evidence, and full traceability.
- [ ] Author plan.md with source-first phases, affected surfaces, evidence boundaries, and rollback.
- [ ] Author tasks.md with bounded setup, authoring, and structural-verification work.
- [ ] Author checklist.md with Level-2 protocol, source checks, N/A treatment, and summary.
- [ ] Preserve the required frontmatter fields and continuity values in all four files.

### Phase 3: Verification
- [ ] Inspect all frontmatter for exactly four trigger phrases and the complete continuity block.
- [ ] Inspect every required anchor pair, metadata table, reconstruction banner, and Sources / Traceability section.
- [ ] Confirm the packet contains only the four requested files and no generated metadata.
- [ ] Confirm no claim says that a validator, generator, benchmark, deterministic script, transport, or runtime skill execution was performed.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Source fidelity | Shared contracts, cards, procedure, scripts, benchmark README and snapshots, feature-catalog claims | Read and manual comparison |
| Source traceability | Listed shared, benchmark, and feature-catalog files | rg and manual path inspection |
| Packet structure | Frontmatter, markers, metadata row, required anchors, and Markdown tables | Read, rg, and manual inspection |
| Evidence caveats | Router versus live reports, unscored dimensions, coverage, and browser-stage gaps | Read and manual comparison |
| Scope check | Exactly four authored files under the target packet | rg --files |
| Runtime behavior | Not executed by this reconstruction | None; source-defined downstream checks remain downstream |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Intact shared backbone files | Internal source | Available | Register, proof, boundary, token, procedure, vocabulary, and script claims would be incomplete. |
| Benchmark README and snapshot reports | Internal evidence | Available | Recorded dimensions, scores, coverage, and measurement gaps could not be traced. |
| Feature-catalog files | Internal catalog | Available | Manager-shell, verifier cadence, transport separation, and inventory claims would be incomplete. |
| Level-2 manifest templates | Internal format | Available | Missing markers, anchors, or metadata tables would make the packet non-conformant. |
| Validated Level-2 reference packet | Internal example | Available | Structure and reconstruction depth would be less directly calibrated. |
| Mode-owned contracts and downstream consumers | Sibling source | Named but outside this packet | Keep ownership pointers and avoid inventing their undisclosed behavior. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Trigger: A source comparison shows unsupported behavior, a required structural constraint fails, or the reconstruction must be withdrawn.
- Procedure: Remove only the four newly authored packet files under .opencode/specs/sk-design/008-design-shared-backbone/ and leave all intact shared, benchmark, feature-catalog, and other repository files unchanged.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Source and template review ──► Packet authoring ──► Structural and source-fidelity inspection
```

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
| Source and template review | High | One complete reading pass across the requested source sets |
| Packet authoring | Medium | One four-file drafting pass |
| Structural inspection | Low | One manual inspection pass |
| **Total** | | **Three bounded passes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No deployment, runtime change, data migration, transport invocation, or skill-source edit is in scope.
- [ ] The target packet contains only the four requested documents.
- [ ] Source-faithful claims and the reconstruction banner remain explicit.

### Rollback Procedure
1. Stop treating the packet as authoritative if source comparison finds drift.
2. Remove the four packet documents only if the reconstruction must be withdrawn.
3. Re-read the intact source and templates before recreating any packet content.
4. Keep generated metadata absent until the orchestrator handles it after acceptance.

### Data Reversal
- Has data migrations? No.
- Reversal procedure: N/A; this packet creates documentation only.
<!-- /ANCHOR:enhanced-rollback -->
