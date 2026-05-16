---
title: "Implementation Summary: 002-bug-fixes (skeleton)"
description: "Pending — fills after bug fixes ship."
trigger_phrases:
  - "002 bug fixes summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "006-docs-quality-refactor/002-bug-fixes"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Closed P0 bugs"
    next_safe_action: "Move to child 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-impl"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `006-docs-quality-refactor/002-bug-fixes` |
| **Completed** | 2026-05-16 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Closed 8 audit-confirmed bug findings from 001 research.md P0 catalog plus the 5 primary-surface em-dash HVR violations I had introduced in earlier edits. Skill package now has no broken ADR-001 path references, no broken hook-reference links, no wrong build commands, no tool-count contradictions, no stale skill-graph location claims, and a canonically copied hook reference doc that the skill owns directly.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified | F1 ADR-001 path insertion of `001-skill-graph/` segment (4 instances); F2 primary em dash → comma swap |
| `.opencode/skills/system-skill-advisor/ARCHITECTURE.md` | Modified | F1 ADR-001 path (1 instance); F25 build command path; F26 skill-graph location claim (3 narrative paragraphs + 1 future-work bullet removed); F2 primary em dash swap (2 instances) |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | F5 hook-reference link to local path; F2 primary em dash swap |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Modified | F5 hook-reference link to local path + manual_testing_playbook path fix; F32 tool list completion (8 public + 1 internal in §1 OVERVIEW + intro); F2 primary em dash swap |
| `.opencode/skills/system-skill-advisor/references/tool-ids-reference.md` | Modified | F3 contradiction fixed: "nine public tools + one internal" → "eight public tools plus one internal trusted-caller (9 total)" |
| `.opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` | Created | F5 canonical copy from system-spec-kit/references/hooks/; source-canonicalized note appended |
| `.opencode/skills/system-skill-advisor/hooks/{claude,gemini,codex,codex/lib}/README.md` (4 files) | Modified | F8 audit packet path insertion of `001-skill-graph/` segment |
| `.opencode/skills/system-skill-advisor/mcp_server/{stress_test/search-quality,lib/scorer/lanes,lib/scorer/lanes/__tests__,scripts/routing-accuracy,lib/context}/README.md` (5 files) | Modified | F8 audit packet path insertion |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Direct main-agent edits ordered by P0 impact-rank: F1 ADR path → F25 build command → F26 skill-graph location → F3 tool count → F5 hook reference (with canonical copy) → F32 INSTALL_GUIDE tool listing → F8 nested READMEs (bulk sed across 9 files) → F2 primary em dashes (5 instances in SKILL/README/ARCH/INSTALL). Each fix verified by re-grep immediately after edit. No regressions: validate.sh --strict on 002 packet stays green.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Copy hook-reference into skill package (instead of fixing relative link) | Per Open Question 2: self-contained skill, no cross-skill `../../` traversal; source-canonicalized note appended for future-sync clarity |
| Defer F4 (.devin/hooks.v1.json runtime config update) | NEW devin hooks dir lacks `session-start.js`; partial-fix would break SessionStart hook. Requires session-start.js to be built first or runtime config explicit user approval |
| Defer bulk HVR sweep (85 em + 139 semicolons + 941 Oxford commas in secondary surfaces) | High-volume mechanical churn (1100+ edits) needs context-aware editing for semicolons; better as a focused cli-codex dispatch or a 005-content-additions-and-hvr child pass |
| Remove the "Packet 011 future work" bullet from ARCHITECTURE.md §9 | The skill-graph library is already package-local; the future-work bullet was stale |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --strict` on 002 packet | PASS (0 errors, 0 warnings) |
| `grep -rln "008-skill-advisor/006-system-skill-advisor-extraction" .opencode/skills/system-skill-advisor/ \| grep -v shadow-deltas` returns 0 | PASS — only generated `shadow-deltas.jsonl` retains old path; no authored docs do |
| `grep -E "nine public tools" tool-ids-reference.md` returns 0 | PASS — contradiction removed |
| `grep -E "Packet 011" .opencode/skills/system-skill-advisor/` returns 0 | PASS — stale future-work bullet + 3 narrative claims removed |
| `grep -E "../../references/hooks/" README.md INSTALL_GUIDE.md` returns 0 | PASS — both links now point to local `./references/hooks/skill-advisor-hook.md` |
| `ls .opencode/skills/system-skill-advisor/references/hooks/skill-advisor-hook.md` exists | PASS — canonical copy in place |
| `grep -c "—" SKILL.md README.md ARCHITECTURE.md INSTALL_GUIDE.md` returns 0 | PASS — primary-surface em dashes cleared |
| Em-dash count package-wide | 85 remaining (secondary surfaces — changelogs, feature_catalog, manual_testing_playbook); deferred per spec scope |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- F4 deferred — `.devin/hooks.v1.json` UserPromptSubmit + SessionStart still point to OLD `system-spec-kit` paths. Cannot point to NEW until `session-start.js` is built at the NEW location, or requires explicit runtime-config approval to leave SessionStart on the OLD path.
- F6 not addressed — dual hook locations (OLD `system-spec-kit/mcp_server/hooks/` + NEW `system-skill-advisor/hooks/`) still both exist. This is an architectural decision: deprecate OLD or document migration timeline. Belongs in a separate cleanup packet.
- F23, F24 not addressed — INSTALL_GUIDE.md references `compat/` and `plugin_bridges/` directories that do not exist. Either docs are stale or directories were never created. Defer to a separate packet that decides directory-vs-doc resolution.
- F44 not addressed — INSTALL_GUIDE.md regression command points to missing `fixtures/skill_advisor_regression_cases.jsonl`. Same defer pattern as F23/F24.
- Bulk HVR sweep (85 em dashes + 139 semicolons + 941 Oxford commas in secondary surfaces) deferred. Sweep is mechanical for em dashes but context-sensitive for semicolons. Best as a focused cli-codex dispatch in child 005-content-additions-and-hvr.
<!-- /ANCHOR:limitations -->
