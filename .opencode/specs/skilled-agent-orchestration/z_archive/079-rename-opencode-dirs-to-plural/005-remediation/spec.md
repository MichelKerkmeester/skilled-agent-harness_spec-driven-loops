---
title: "Feature Specification: 100 - 099 deep-review remediation"
description: "Resolves all 13 active P1 findings raised by packet 099 deep-review of the 093-098 track. P1-026 was initially scoped as deferred but fixed in a follow-on pass within this same packet."
trigger_phrases:
  - "100 remediation"
  - "099 findings remediation"
  - "post-098 hardening"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/005-remediation"
    last_updated_at: "2026-05-07T20:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Resolved 13 of 13 P1 findings in flat Level 2 packet"
    next_safe_action: "Phase complete; track release-ready"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/aliases.ts"
      - ".opencode/skills/system-spec-kit/shared/review-research-paths.cjs"
      - ".opencode/skills/system-spec-kit/scripts/spec/check-smart-router.sh"
      - ".opencode/commands/doctor/scripts/audit_descriptions.py"
      - ".opencode/skills/sk-code-review/SKILL.md"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/004-symlinks/spec.md"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/003-remediation/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-07"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 100 - 099 deep-review remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 (release-unblocking) |
| **Status** | Complete |
| **Created** | 2026-05-07 |
| **Branch** | `main` |
| **Findings resolved** | All 13 P1s: P1-007, P1-015, P1-016, P1-017, P1-018, P1-019, P1-020, P1-021, P1-022, P1-023, P1-024, P1-025, P1-026 |
| **Deferred** | All 13 P1s resolved (P1-026 fixed in follow-on pass) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Packet 099 deep-review (10 iterations, gpt-5.5 high fast) confirmed P0=0 holding (098/001 dist rebuild succeeded) but verdict remained FAIL on 13 active P1 findings: 1 carryover (P1-007) plus 12 NEW findings surfaced by the remediation itself, including source/dist parity gaps (P1-015, P1-016), security spec_folder shell injection in YAML (P1-019), 098 sub-phase strict-validate failures (P1-024), advisor missing deep-review alias (P1-025), validator zero-inventory false-pass (P1-020), shared-CLI path resolver gap (P1-021), 095 internally contradictory results (P1-017), 096/004 anchor mismatch (P1-022), playbooks not linked from owning SKILL.md (P1-018), and continuity blockers field empty despite documented deferrals (P1-023).

### Purpose
Convert each of the 13 P1 findings into a spec-governed change with file:line evidence. All 13 P1s land here; P1-026 (reducer findings extraction) was initially scoped as deferred but fixed in a follow-on pass.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
All 13 P1 fixes (P1-007, 015, 016, 017, 018, 019, 020, 021, 022, 023, 024, 025, 026) — see implementation-summary.md §What Was Built for per-finding evidence.

### Out of Scope
- 6 P2 advisories — schedule after P1 closure

### Files to Change
See implementation-summary.md §Files Changed table for the canonical list (~25 files touched).
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | All 13 P1s resolved with file:line evidence | implementation-summary.md §What Was Built |
| REQ-002 | `validate.sh --strict` on 098 + adjacent packets exits 0 | run output |
| REQ-003 | Smart-router scans 16 plural skills + accepts shared CLI paths | `check-smart-router.sh` PATHS PASS |
| REQ-004 | audit_descriptions.py exits non-zero on zero-inventory | Stub repo test |
| REQ-005 | Native advisor returns command-spec-kit at threshold ≥0.8 for `/speckit:deep-review` | Smoke test |

### P1 - Required
| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-010 | Source TS + dist JS parity for skill-graph globs | source has plural defaults |
| REQ-011 | resolveArtifactRoot rejects shell metacharacters | Adversarial smoke test passes |
| REQ-012 | All 098 sub-phases pass strict validation | `validate.sh --strict 098/00N` exit 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 13 P1s have file:line resolution evidence in implementation-summary.md
- **SC-002**: `validate.sh --strict 098-097-remediation` recursive PASS (now ALSO per-child PASS)
- **SC-003**: `validate.sh --strict 096-rename-opencode-dirs-to-plural` recursive PASS
- **SC-004**: `validate.sh --strict 100-099-remediation` PASS
- **SC-005**: P1-026 fully resolved with file:line evidence in implementation-summary.md (was deferred-then-fixed)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | resolveArtifactRoot containment breaks legitimate edge cases | Low | Test fixture uses `/tmp/...` paths; metacharacter check doesn't reject them |
| Risk | check-smart-router resolver fallback adds noise | Low | Fallback only kicks in when primary fails |
| Dependency | Packet 099 review-report.md | Required | Available |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: All edits + rebuild < 5 minutes total wall-clock
- **NFR-P02**: Validator runs < 60s per packet

### Security
- **NFR-S01**: P1-019 closes a real shell injection vector in deep-review YAML
- **NFR-S02**: No new env-script execution paths introduced

### Reliability
- **NFR-R01**: Source/dist parity restored — next rebuild won't regress
- **NFR-R02**: All edits idempotent
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- spec_folder containing shell metacharacter: rejected by P1-019 fix
- skills_root with sibling skills only: smart-router fallback resolver covers
- Stub repo with no skills/commands/agents: audit_descriptions.py fails closed

### Error Scenarios
- Build fails: investigate; do not weaken constraints
- Adjacent packet regresses: revert + investigate

### State Transitions
- Phase status: draft → in_progress → complete
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 13 P1 fixes across 14+ files + 7 098 sub-phase docs + reducer code |
| Risk | 12/25 | Reversible per-edit; security fix is bounded |
| Research | 10/20 | Surface inventory complete from 099 review-report |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

(none — surface inventory complete)
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor**: `.opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/004-track-rereview/review/review-report.md`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Checklist**: `checklist.md`
- **Implementation Summary**: `implementation-summary.md`
