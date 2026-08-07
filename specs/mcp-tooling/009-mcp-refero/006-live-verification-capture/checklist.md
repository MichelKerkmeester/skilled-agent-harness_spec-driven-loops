---
title: "Verification Checklist: Phase 6: live-verification-capture (mcp-refero)"
description: "Verification Date: 2026-07-16"
trigger_phrases:
  - "verification"
  - "checklist"
  - "refero discovery checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/006-live-verification-capture"
    last_updated_at: "2026-07-16T16:30:00Z"
    last_updated_by: "claude-agent"
    recent_action: "All items verified with evidence"
    next_safe_action: "Close phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "agent-006-live-verification-capture-refero"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 6: live-verification-capture

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: spec.md REQUIREMENTS anchor, REQ-001 to REQ-007 with acceptance criteria, 7/7 rows]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: plan.md sections 1-7 plus FIX ADDENDUM affected-surfaces table, 7/7 surface rows]
- [x] CHK-003 [P1] Dependencies identified and available [evidence: plan.md DEPENDENCIES table 3/3 Green; fixture `capturedAt: 2026-07-16T13:49:06.282Z`]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No script changes needed or made [evidence: `rg -n "refero_refero" scripts/doctor.sh scripts/install.sh` shows only the correct doubled form at doctor.sh:87-88 and install.sh:75; 0 stale names, 0 edits]
- [x] CHK-011 [P0] Packet gate green [evidence: `package_skill.py --check --strict` printed "Skill is valid!" and "Result: PASS"; 2 warnings (SKILL.md word count, .json fixture in references/) accepted]
- [x] CHK-012 [P1] Naming presentation consistent [evidence: `rg -n "refero.refero.refero_" .opencode/skills/mcp-tooling/mcp-refero --glob '*.md'` shows the dotted form only in discovery contexts, 6/6 flipped docs]
- [x] CHK-013 [P1] Docs follow project patterns [evidence: fixture citation style matches siblings `mcp-aside-devtools` and `mcp-mobbin`, 3/3 packets share the dual-form presentation]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met [evidence: REQ-001 to REQ-007 verified through tasks.md T003-T009, 7/7 with command evidence]
- [x] CHK-021 [P0] Manual verification complete [evidence: `rg -n "conflicting derivations exist|after (I|you) authenticate|requires completed operator auth" .opencode/skills/mcp-tooling/mcp-refero` returns 0 hits outside changelog history]
- [x] CHK-022 [P1] Edge cases covered [evidence: the refuted single-prefix derivation kept as negative knowledge in `references/mcp-wiring.md` section 4, 1/1 losing form named]
- [x] CHK-023 [P1] Drift scenario validated [evidence: fail-closed drift rule retained in `SKILL.md` discovery paragraph and `mcp-wiring.md` operating rule, 2/2 surfaces]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class [evidence: two class-of-bug findings (hedged naming, OAuth-gated discovery) classified in `plan.md` affected-surfaces table, 7/7 rows]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed [evidence: `rg -n "doubled|conflict|pending|unconfirmed"` swept the packet; 7 producer files flipped, scripts and changelogs excluded with reasons]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed docs [evidence: `rg -ln "refero_refero"` cross-checked examples/ and feature-catalog/, 0 stale consumers; `package_skill.py` link check green]
- [x] CHK-FIX-004 [P0] Adversarial cases for parser/security fixes [evidence: not a parser/security fix; the pre-auth boundary is stated with both halves (discovery open, calls gated) in 4/4 flipped consumer docs]
- [x] CHK-FIX-005 [P1] Matrix axes and row count listed before completion [evidence: `plan.md` affected-surfaces names file-kind x claim-kind axes; 9 file rows (7 modified + fixture + changelog) match `git status` for the packet]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant [evidence: docs only, 0 script or env changes; `git diff --stat` for the packet shows .md and .json files only plus the new changelog]
- [x] CHK-FIX-007 [P1] Evidence pinned, not branch-relative [evidence: all evidence pinned to file paths and the dated fixture at verification date 2026-07-16 on branch `skilled/v4.0.0.0`]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets [evidence: fixture contains tool metadata only; `rg -n "Bearer|api[_-]?key|token" references/discovery-fixture-2026-07-16.json` returns 0 credential values]
- [x] CHK-031 [P0] No auth-state or config mutation [evidence: `.utcp_config.json` and `~/.mcp-auth` untouched; `git status` shows changes only inside the packet and this spec child]
- [x] CHK-032 [P1] OAuth boundary preserved [evidence: "Never claim OAuth works end-to-end" retained in `SKILL.md` NEVER rule 3 and `mcp-wiring.md` banner, 2/2 surfaces]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized [evidence: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/mcp-tooling/009-mcp-refero/006-live-verification-capture --strict --no-recursive` printed "RESULT: PASSED"]
- [x] CHK-041 [P1] Claims carry the durable WHY [evidence: flips explain WHY the doubled prefix arises (`{manual}.{manual}_{tool}` over tools already named `refero_*`) in 3/3 naming surfaces]
- [x] CHK-042 [P2] Changelog updated [evidence: `changelog/v1.1.1.0.md` with need/change/why sections and a 9-row files-changed table]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [evidence: no temp files created; `ls -A scratch/` shows only .gitkeep]
- [x] CHK-051 [P1] scratch/ cleaned before completion [evidence: `ls -A .opencode/specs/mcp-tooling/009-mcp-refero/006-live-verification-capture/scratch` returns only .gitkeep]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-16
<!-- /ANCHOR:summary -->
