---
title: "Feature Specification: 128 — Deep-Agent-Improvement Mixed-Executor + Adjudication Methodology"
description: "Adopt mixed-executor dispatch (cli-devin SWE-1.6 breadth + cli-codex gpt-5.5 synthesis) and adjudication-iter false-positive filter patterns from arc 119 into deep-agent-improvement."
trigger_phrases:
  - "deep-agent-improvement methodology"
  - "mixed-executor pattern"
  - "adjudication iter"
  - "128 deep-agent-improvement"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication"
    last_updated_at: "2026-05-23T08:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Scaffolded packet folder."
    next_safe_action: "Author Level 3 spec docs."
    blockers: []
    completion_pct: 5
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
      session_id: "116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication"
      parent_session_id: null
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Feature Specification: 128 — Deep-Agent-Improvement Mixed-Executor + Adjudication Methodology

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 128 brings the methodology patterns proven in arc 119 (deep-research uplift) into deep-agent-improvement: mixed-executor dispatch (cli-devin SWE-1.6 breadth + cli-codex gpt-5.5 synthesis) and adjudication-iter false-positive filter. The 119 research demonstrated a 90%+ false-positive rate on adversarial passes without adjudication, and the mixed-executor pattern (8+2 split) provided better breadth/synthesis balance than single-executor approaches. This packet documents these patterns as recommended methodology for DAI multi-iter sweeps and adds DAI-004 audit logging for dynamic profiling.

**Key Decisions**: Mixed-executor pattern (ADR-001), adjudication-iter false-positive filter (ADR-001), profile-selection audit logging (DAI-004)

**Critical Dependencies**: Packets 124-127 must ship first (correctness, docs, evaluator hardening, cross-runtime promotion)

**Precedent**: Arc 119 deep-research uplift methodology (verified 10-iter research with adjudication at iter-7)
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

|| Field | Value |
||-------|-------|
|| **Level** | 3 (ADR for executor strategy + methodology) |
|| **Priority** | P2 |
|| **Status** | Active |
|| **Created** | 2026-05-23 |
|| **Branch** | `main` |
|| **Predecessor** | 116-deep-skill-evolution/005-deep-agent-improvement/007-cross-runtime-promotion (must ship first) |
|| **Precedent** | 116-deep-skill-evolution/004-deep-research (methodology source) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Deep-agent-improvement currently lacks the methodology patterns proven in arc 119's deep-research uplift: (1) mixed-executor dispatch for multi-iter sweeps, and (2) adjudication-iter false-positive filtering. The 119 research showed that single-executor approaches lose breadth/synthesis balance, and without adjudication, adversarial passes produce 90%+ false-positive findings. Additionally, DAI-004 (dynamic profiling auditability) remains open—profile selection rationale is not logged, making it difficult to debug or audit why a particular profile was chosen for a candidate.

### Purpose

Document and implement the mixed-executor + adjudication methodology from arc 119 as recommended patterns for DAI multi-iter evaluation sweeps, and add profile-selection rationale logging to address DAI-004. This brings DAI methodology to parity with sibling skills (deep-research, deep-review) and improves evaluator transparency.

> **Scope note**: This packet DOCUMENTS methodology patterns and adds light logging. It does NOT rewire the DAI YAML workflow to auto-dispatch mixed executors—that would be a future enhancement. The patterns are documented as RECOMMENDED for operators running multi-iter DAI sweeps.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Author Level 3 spec docs (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md, description.json, graph-metadata.json)
- Add "Mixed-Executor Dispatch (recommended)" section to DAI SKILL.md documenting the cli-devin/cli-codex split with 119 precedent
- Add "Adjudication-Iter Pattern (recommended)" section to DAI SKILL.md documenting the false-positive filter pass
- Create reference doc `references/mixed_executor_methodology.md` (NEW) documenting when to use the pattern, the 8+2 split, adjudication-iter mechanic, and cross-link to 119
- Create reference doc `references/profiling_audit_log.md` (NEW) addressing DAI-004: profile-selection log format + retention
- Edit `scripts/generate-profile.cjs` to add profile-selection rationale logging (additive only, no signature changes)
- Validate: strict-validate PASS, sk-doc validate PASS on new reference docs, node syntax check PASS on modified script

### Out of Scope

- Rewiring DAI YAML workflow to auto-dispatch mixed executors (future enhancement)
- Modifying deep-loop-runtime, deep-review, or deep-research skills
- Modifying packets 124/125/126/127 spec folders (already shipped)
- Changing DAI evaluator scoring logic or promotion gates (packet 126 scope)
- Multi-runtime agent definition sync (packet 127 scope)

### Files to Change

|| File Path | Change Type | Description |
||-----------|-------------|-------------|
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/spec.md` | Create | Level 3 spec |
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/plan.md` | Create | Implementation plan |
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/tasks.md` | Create | Task breakdown |
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/checklist.md` | Create | Verification checklist |
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/decision-record.md` | Create | ADR-001 |
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/implementation-summary.md` | Create | Implementation summary |
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/description.json` | Create | Packet metadata |
|| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/008-mixed-executor-adjudication/graph-metadata.json` | Create | Graph metadata |
|| `.opencode/skills/deep-agent-improvement/SKILL.md` | Edit | Add mixed-executor + adjudication sections |
|| `.opencode/skills/deep-agent-improvement/references/mixed_executor_methodology.md` | Create | Methodology reference |
|| `.opencode/skills/deep-agent-improvement/references/profiling_audit_log.md` | Create | Audit log reference |
|| `.opencode/skills/deep-agent-improvement/scripts/generate-profile.cjs` | Edit | Add profile-selection logging (additive) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

|| ID | Requirement | Acceptance |
||----|-------------|------------|
|| REQ-001 | Level 3 spec docs authored per template | All 8 files present, strict-validate PASS |
|| REQ-002 | DAI SKILL.md documents mixed-executor pattern | New section added with 119 cross-reference |
|| REQ-003 | DAI SKILL.md documents adjudication-iter pattern | New section added with false-positive filter description |
|| REQ-004 | Mixed-executor methodology reference doc created | `references/mixed_executor_methodology.md` with 8+2 split, adjudication, 119 link |
|| REQ-005 | Profiling audit log reference doc created | `references/profiling_audit_log.md` with log format + retention |
|| REQ-006 | Profile-selection logging added to generate-profile.cjs | Additive logging only, no signature changes, typed-error helper used |
|| REQ-007 | All validation gates pass | strict-validate PASS, sk-doc validate PASS (DQI ≥ 75), node --check PASS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Level 3 spec docs complete with all required anchors
- SC-002: strict-validate PASS on packet 128
- SC-003: DAI SKILL.md has two new sections (mixed-executor, adjudication-iter)
- SC-004: Two new reference docs exist with sk-doc DQI ≥ 75
- SC-005: generate-profile.cjs logs profile-selection rationale to `<state-dir>/profile-selection.log`
- SC-006: Existing tests still pass (no breaking changes)
- SC-007: Node syntax check passes on modified script
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

|| Type | Item | Mitigation |
||------|------|------------|
|| Dependency | Packet 124-127 must ship first | These are already marked complete in git history |
|| Risk | Documentation drift if patterns change | Cross-reference 119 as precedent; patterns are recommendations, not contracts |
|| Risk | Logging performance impact | Single-line append per profile generation; negligible |
|| Risk | Typed-error helper incompatibility | Use existing helper from 124's `_lib/typed-errors.cjs` (already imported) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-D01** (Documentation): sk-doc DQI ≥ 75 on new reference docs
- **NFR-P01** (Performance): profile-selection logging adds < 1ms overhead per generation
- **NFR-R01** (Reliability): logging failure must not crash profile generation (try/catch)
- **NFR-C01** (Compatibility): no breaking changes to generate-profile.cjs API
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **State directory missing**: Log write failure should be caught and silently ignored (not crash profile generation)
- **Log file permissions**: Use append mode; create file if missing
- **Concurrent profile generation**: Append-only log is safe for concurrent writes
- **Empty rationale**: Log entry should still be written with empty rationale field
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

|| Dimension | Score | Triggers |
||-----------|-------|----------|
|| Scope | 12/25 | Documentation + light code touch, no architecture changes |
|| Risk | 8/25 | Low risk; additive changes only |
|| Research | 10/20 | Methodology already proven in 119; adaptation work |
|| Multi-Agent | 0/15 | No multi-agent coordination |
|| Coordination | 5/15 | Single-skill changes, no cross-skill wiring |
|| **Total** | **35/100** | **Level 3 (ADR-focused)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

|| Risk ID | Description | Impact | Likelihood | Mitigation |
||---------|-------------|--------|------------|------------|
|| R-001 | Documentation drift if 119 patterns evolve | L | L | Cross-reference 119 as precedent; patterns are recommendations |
|| R-002 | Logging failure crashes profile generation | M | L | Try/catch around log write; silent ignore on failure |
|| R-003 | Typed-error helper changes in future | L | L | Use existing stable helper from 124 |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Methodology Parity (Priority: P2)

**As a** DAI operator, **I want** documented mixed-executor and adjudication patterns, **so that** I can run multi-iter evaluation sweeps with the same methodology proven in deep-research.

**Acceptance**: SKILL.md has two new sections with 119 cross-reference; reference doc details the 8+2 split and adjudication-iter mechanic.

### US-002: Profile Selection Auditability (Priority: P2)

**As a** DAI operator, **I want** profile-selection rationale logged, **so that** I can debug or audit why a particular profile was chosen for a candidate.

**Acceptance**: generate-profile.cjs writes to `<state-dir>/profile-selection.log` with timestamp, candidate_hash, chosen_profile, rationale, alternatives.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the mixed-executor pattern be enforced in the YAML workflow, or remain recommended-only? **RESOLVED: Recommended-only for this packet; future enhancement can auto-dispatch.**
- What is the retention policy for profile-selection.log? **RESOLVED: Document in reference doc as per-packet retention (same as other improvement state files).**
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Precedent**: `../004-deep-research/001-uplift-research-deep-review-changes/research/research-report.md` (methodology source)
- **Improvement roadmap**: `../005-deep-agent-improvement/003-recommendations/improvement-roadmap.md` (packet 128 scope)
- **DAI skill**: `../../skills/deep-agent-improvement/SKILL.md` (target for documentation updates)
- **Predecessor packets**: 124 (correctness), 125 (docs), 126 (evaluator hardening), 127 (cross-runtime promotion)
