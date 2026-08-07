---
title: "Implementation Plan: Phase 006 Routing Precision Fixes"
description: "Execution plan for remediating the 9 routing audit findings from Phase 005, with P0 fixes first, exact resource contracts second, and parser/verification hardening last."
trigger_phrases:
  - "phase 006 plan"
  - "routing precision plan"
  - "packet 069 remediation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/z_archive/007-sk-code-motion-dev-and-playbook/006-routing-precision-fixes"
    last_updated_at: "2026-05-05T13:30:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned Phase 006 routing remediation"
    next_safe_action: "Patch P0 router and advisor rules"
    blockers: []
    key_files:
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: Phase 006 Routing Precision Fixes

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | OPENCODE docs, generated routing graph JSON, and Bash runner scripts |
| **Primary Skills** | `system-spec-kit`, `sk-doc`, `sk-code` |
| **Source Audit** | Phase 005 cross-CLI execution report |
| **Verification** | strict spec validation, parent validation, JSON parse check, mini recheck matrix |

### Overview
Patch the routing contract in dependency order: first make doc-only markdown edits prefer `sk-doc`, then make explicit non-Webflow prompts block WEBFLOW detection before any animation marker can fire. After the P0 path is stable, tighten exact resource loads, add regression examples, harden the runner parser, and document the final evidence.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase 006 spec folder was pre-approved by user dispatch.
- [x] Phase 005 audit report and P0 evidence YAMLs were read.
- [x] Actual skill-graph path was verified as `mcp_server/skill_advisor/scripts/skill-graph.json`.
- [x] Approved write scope is known.

### Definition of Done

- [ ] F-001 through F-009 are remediated or explicitly marked partial/deferred with evidence.
- [ ] RD-002, CS-002, and LS-001 recheck result YAMLs exist under Phase 006.
- [ ] Phase 006 strict validation exits 0.
- [ ] Parent Packet 069 strict validation exits 0.
- [ ] `skill-graph.json` parses as valid JSON.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation-first router contract hardening with generated-result parser guards.

### Key Components

- **Router SKILL contract**: top-level `SKILL.md` gives runtime-facing rules for surface detection and skill exclusion.
- **Router references**: `code_surface_detection.md`, `intent_classification.md`, and `resource_loading.md` hold exact deterministic contracts used by playbook prompts.
- **Advisor graph**: `skill-graph.json` supplies explicit signal and anti-signal hints for advisor top-1 selection.
- **Runner parsers**: four Bash wrappers embed the same Python normalizer and now emit quality flags for malformed outputs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-code` SKILL/router docs | Own surface and reference-loading contracts | Add negative doc-edit and non-Webflow rules | Recheck RD-002 and CS-002 |
| `skill-graph.json` | Advisor signal input | Add sk-doc positives, sk-code/system-spec-kit anti-signals, executable-code positives | JSON parse and LS-001 recheck |
| Motion.dev refs/assets | Contract examples for future audits | Add regression examples with exact expected paths | Grep exact filenames |
| Phase 005 runner scripts | Normalize cross-CLI YAML evidence | Reject directory placeholders and record quality flags | Recheck result schema |

Required inventories:
- Same-class producers: router docs and `SKILL.md` for surface/resource decisions.
- Consumers: Phase 005 runner scripts and playbook universal prompt.
- Matrix axes: doc-only vs executable edit, explicit non-Webflow vs Webflow-owned animation, exact files vs directory placeholders, empty vs populated response excerpts.
- Parser invariant: output YAML must never represent missing references as directory placeholders or missing responses as a bare literal marker.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Planning Artifacts
- [ ] Create `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json`.

### Phase 2: P0 Router Remediation
- [ ] Patch F-001 doc-only markdown routing to `sk-doc`.
- [ ] Patch F-002 explicit non-Webflow guard before WEBFLOW marker detection.

### Phase 3: P1/P2 Contract Remediation
- [ ] Patch F-003 through F-008 resource precision, implementation trio, advisor weighting, and regression examples.
- [ ] Patch F-009 runner parser quality flags in all four CLI wrappers.

### Phase 4: Parent and Verification
- [ ] Add Phase 006 row to the parent phase map and verify `children_ids`.
- [ ] Run mini rechecks and copy results to Phase 006.
- [ ] Run strict validation and JSON parse check.
- [ ] Write `implementation-summary.md` with line references and evidence.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Spec validation | Phase 006 docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook/006-routing-precision-fixes --strict` |
| Parent validation | Packet 069 phase parent | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/sk-code/z_archive/007-sk-code-motion-dev-and-playbook --strict` |
| JSON validation | Skill-advisor graph | `python3 -c "import json; json.load(open('.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json'))"` |
| Mini matrix | RD-002, CS-002, LS-001 | Phase 005 `run_codex.sh` commands from the dispatch |
| Result presence | Copied recheck YAMLs | `ls specs/.../006-routing-precision-fixes/spot-recheck-results/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Nested `codex` CLI | External/runtime | Available but network may be restricted | Rechecks may fail before model output |
| Spec validator | Internal | Available | Required before completion claim |
| Existing Motion/Webflow refs | Internal | Available | Source for exact canonical filenames |
| Skill advisor graph JSON | Internal | Available at `scripts/skill-graph.json` | Required for signal tuning |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Revert only Phase 006 planning files if spec validation cannot be made valid.
- Revert router doc changes finding-by-finding if a recheck regresses the opposite route.
- Revert runner parser blocks together across all four scripts if one wrapper diverges.
- Preserve historical Phase 005 result YAMLs regardless of recheck outcome.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
audit evidence -> planning docs -> P0 router fixes -> P1/P2 contract fixes -> rechecks -> summary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Planning artifacts | Audit evidence | All implementation and validation |
| P0 router fixes | Source router docs and graph JSON | RD-002 and CS-002 rechecks |
| P1/P2 fixes | Canonical filename inventory | Final PASS_WITH_NOTES restoration |
| Verification | All patches | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Planning artifacts | Low | 30 minutes |
| P0 router fixes | Medium | 45 minutes |
| P1/P2 contract fixes | Medium | 60 minutes |
| Rechecks and summary | Medium | 45 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist

- [x] Target audit evidence read before edits.
- [x] Target files read before edits.
- [x] Existing unrelated dirty files identified and ignored.
- [ ] Validation evidence recorded after all edits.

### Data Reversal

- No production data, memory index, or external service state is modified.
<!-- /ANCHOR:enhanced-rollback -->
