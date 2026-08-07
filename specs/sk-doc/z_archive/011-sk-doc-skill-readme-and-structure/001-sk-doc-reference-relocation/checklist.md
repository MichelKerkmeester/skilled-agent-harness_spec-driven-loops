---
title: "Verification Checklist: sk-doc reference relocation"
description: "Verification checklist for sk-doc reference relocation."
trigger_phrases:
  - "sk-doc reference relocation"
importance_tier: "important"
contextType: "validation"
_memory:
  continuity:
    packet_pointer: "sk-doc/z_archive/011-sk-doc-skill-readme-and-structure/001-sk-doc-reference-relocation"
    last_updated_at: "2026-05-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Relocated sk-doc creation references and updated stale paths"
    next_safe_action: "Continue with Phase 2 after reviewing Phase 1 handoff"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "102-sk-doc-skill-readme-and-structure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: sk-doc reference relocation

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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: `spec.md` lists REQ-001 through REQ-003.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: `plan.md` phases and testing strategy are complete.
- [x] CHK-003 [P1] Dependencies identified and available. Evidence: six source guides existed before relocation and validators ran locally.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Documentation paths are valid. Evidence: relocated guide files exist under `.opencode/skills/sk-doc/references/`.
- [x] CHK-011 [P0] No stale references remain. Evidence: `rg -n "sk-doc/references/specific|references/specific" .opencode/skills/sk-doc .opencode/agents .opencode/commands` returned no matches.
- [x] CHK-012 [P1] Error handling implemented where scripts change. Evidence: no scripts changed, so no script error handling was required.
- [x] CHK-013 [P1] Changes follow project patterns. Evidence: `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/sk-doc --check` passed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: six guides moved, old directory removed, stale references cleared.
- [x] CHK-021 [P0] Manual verification complete. Evidence: exact `rg` and `test ! -d` checks passed.
- [x] CHK-022 [P1] Edge cases tested. Evidence: Markdown, YAML, TXT and JSON metadata consumers were included after broad `rg` discovery.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: initial broad search found missed YAML/TXT/JSON references and they were corrected before final verification.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable item has a finding class or scope classification. Evidence: resource map lists skill docs, command docs/assets and agents as verification scopes.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Evidence: broad `rg` inventory covered `.opencode/skills/sk-doc`, `.opencode/commands` and `.opencode/agents`.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed paths and docs. Evidence: consumers in SKILL, README, assets, playbooks, commands and metadata were updated.
- [x] CHK-FIX-004 [P0] Path fixes include adversarial checks for old and new locations. Evidence: old `references/specific` and singular `skill/sk-doc` searches returned no matches.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Evidence: implementation summary lists the axes and changed-surface groups.
- [x] CHK-FIX-006 [P1] Runtime mirror variant executed where runtime files change. Evidence: create command YAML assets and command README mirrors were updated.
- [x] CHK-FIX-007 [P1] Evidence is pinned to explicit command output. Evidence: verification summary records exact commands.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: changes are path/reference-only documentation and metadata updates.
- [x] CHK-031 [P0] Input validation implemented where commands change. Evidence: command execution logic did not change, only reference source paths changed.
- [x] CHK-032 [P1] Agent write-scope boundaries remain explicit. Evidence: no agent files required changes and `.opencode/agents` stale-path search returned no matches.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized. Evidence: all phase tasks are marked complete.
- [x] CHK-041 [P1] Resource map updated. Evidence: resource map now includes command README/YAML and graph metadata surfaces.
- [x] CHK-042 [P2] README updated if applicable. Evidence: `sk-doc/README.md`, `.opencode/commands/README.txt` and `.opencode/commands/create/README.txt` paths were updated.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. Evidence: no temp files were created outside the packet.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` contains only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-10
<!-- /ANCHOR:summary -->
