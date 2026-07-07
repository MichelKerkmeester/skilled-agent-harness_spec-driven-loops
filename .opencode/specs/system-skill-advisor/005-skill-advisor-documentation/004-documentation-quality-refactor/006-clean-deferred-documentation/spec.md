---
title: "Feature Specification: 006-clean-deferred-documentation (Tier A+B+C-subset closure pass)"
description: "Close the deferred backlog from children 002-005 that can ship without architectural decisions or context-aware editing: F30 cross-links, F33 SOURCE FILES, F23/F24/F44 re-verify, bulk Oxford comma sweep."
trigger_phrases:
  - "skill-advisor deferred cleanup"
  - "006 deferred cleanup"
  - "oxford comma sweep skill-advisor"
  - "F30 F33 cleanup"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/006-clean-deferred-documentation"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Scaffolded child 006"
    next_safe_action: "Begin Tier A F30 edits"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/skill-graph-status.md"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/skill-graph-query.md"
      - ".opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/skill-graph-validate.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "006-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Feature Specification: 006-clean-deferred-documentation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Children 002-005 deferred a set of findings from the 001 research synthesis. Each Known Limitations section enumerated what was punted plus why. Most of those deferrals fall into 3 categories: easy mechanical (Tier A), false-positive re-verify (Tier B), bulk-safe HVR (Tier C subset). This child closes those categories. Tier C non-safe (semicolons) plus Tier D (architectural decisions plus structural sweeps) stay deferred to a future packet.

### Purpose
Clear the deferred backlog that can ship without decisions or context-aware editing. Leave the residual decision-dependent backlog clearly documented in this packet's Known Limitations plus the parent spec's PHASE DOCUMENTATION MAP.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

Tier A (easy mechanical, no decisions):
- F30: convert 3 plain-text refs in `references/skill-graph-extraction-plan.md` to markdown links where targets exist
- F33: add SOURCE FILES section to 3 playbook scenarios (007/008/009 under `01--native-mcp-tools/`)

Tier B (re-verify likely-false-positives):
- F23: confirm `mcp_server/compat/index.ts` matches INSTALL_GUIDE.md path
- F24: confirm `mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` matches
- F44: confirm `mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl` matches

Tier C subset (bulk-safe HVR):
- Oxford comma sweep: ~943 instances of `, and ` plus `, or ` across ~30 markdown files. Mechanical sed `s/, and / and /g`, `s/, or / or /g` preserves the conjunction while removing the Oxford comma.

### Out of Scope
- Tier C semicolons (135 instances) — context-aware editing required.
- Tier C F34 — 20-file TEST EXECUTION restructure.
- Tier D F4 `.devin/hooks.v1.json` migration — runtime config, needs decision.
- Tier D F6 dual hook location resolution — architectural decision.
- Tier D F35/F36/F37 catalog/playbook numbering — needs Open Q4/Q9 decisions.
- 3 of 5 new ref docs (skill-graph-query-cookbook, validation-baselines, daemon-lease-contract, skill-graph-drift) — partially redundant, defer until specific operator need surfaces.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-skill-advisor/references/skill-graph-extraction-plan.md` | Modify | F30 — 3 link conversions |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/skill-graph-status.md` | Modify | F33 — add SOURCE FILES |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/skill-graph-query.md` | Modify | F33 — add SOURCE FILES |
| `.opencode/skills/system-skill-advisor/manual_testing_playbook/01--native-mcp-tools/skill-graph-validate.md` | Modify | F33 — add SOURCE FILES |
| `.opencode/skills/system-skill-advisor/INSTALL_GUIDE.md` | Conditional | Tier B — only if path mismatch |
| ~30 .md files under `.opencode/skills/system-skill-advisor/` (excluding `changelog/`) | Modify | Oxford comma sweep |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/spec.md` | Modify | Add 006 row to PHASE DOCUMENTATION MAP |
| `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/graph-metadata.json` | Modify | Append 006 to children_ids, advance last_active_child_id |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Oxford comma count package-wide drops to 0 | `grep -roE ', (and\|or) ' .opencode/skills/system-skill-advisor --include='*.md' --exclude-dir=changelog \| wc -l` returns 0 |
| REQ-002 | All 3 playbook scenarios show SOURCE FILES section | `grep -c "SOURCE FILES"` returns >= 1 for each |
| REQ-003 | No grammar regressions from Oxford sweep | Manual spot-check 5 random files confirms intact conjunctions |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | F30 refs converted to markdown links where target resolves | grep shows 0 of the 3 original plain-text patterns |
| REQ-005 | Tier B paths confirmed or fixed | All 4 INSTALL_GUIDE paths match disk |
| REQ-006 | Parent metadata refreshed | `children_ids[]` has 6 entries, `last_active_child_id` points to 006 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `validate.sh --strict` on this child passes (0 errors, 0 warnings)
- **SC-002**: Oxford comma count drops 943 → 0
- **SC-003**: All 6 children + parent pass validate (001 still WARN per research.md exemption)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Oxford sweep introduces grammar errors (like the prior 003 incident) | Medium | Use correct regex that preserves conjunctions (`s/, and / and /g` not `s/, and /, /g`); spot-check 5 random files post-sweep |
| Risk | Sed touches code blocks containing literal `, and ` strings | Low | Code blocks rarely contain English conjunctions; risk acceptable |
| Dependency | Sibling pattern (e.g. `native-recommend-happy-path.md` SOURCE FILES block) | Green | Verified to exist; will be used as F33 template |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None for this scope. Tier D questions (F4/F6/F35/F36/F37) remain in research.md Open Questions list, deferred to follow-on packet.
<!-- /ANCHOR:questions -->
