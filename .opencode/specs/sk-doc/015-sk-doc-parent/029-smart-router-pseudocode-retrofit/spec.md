---
title: "Feature Specification: Smart-router pseudocode retrofit (sk-doc mode packets)"
description: "The sk-doc mode packets carried simplified prose smart-router sections instead of the canonical def route_… pseudocode that create-skill defines, and the package_skill.py validator could be dodged by merging the SMART ROUTING heading into another H2. Retrofit every packet with a proper tiered router and close the validator loophole."
trigger_phrases:
  - "smart router pseudocode retrofit"
  - "014 sk-doc phase 029"
  - "sk-doc mode packet routers"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/029-smart-router-pseudocode-retrofit"
    last_updated_at: "2026-07-14T16:56:15.126Z"
    last_updated_by: "claude-opus"
    recent_action: "Router retrofit + loophole fix; 11 packets + hub verified"
    next_safe_action: "Commit the worktree change set and push non-force to origin/skilled/v4.0.0.0"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/scripts/package_skill.py"
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/sk-doc/create-flowchart/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Smart-router pseudocode retrofit (sk-doc mode packets)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The nested `sk-doc` mode packets carried simplified prose smart-router sections (call-sequence text blocks or terse routing notes) instead of the canonical `def route_…` pseudocode that `create-skill` defines in `assets/skill/skill_smart_router.md` (runtime discovery + in-skill sandbox guard + multi-tier `UNKNOWN_FALLBACK`). Separately, `package_skill.py::validate_smart_router` used a start-anchored heading regex, so a merged heading such as `## 1. When To Use + Smart Routing` failed to match and the router marker check was silently skipped — even though `validate_sections` accepted the merged heading via a substring test. `create-flowchart` was in exactly that state.

### Purpose
Every `sk-doc` mode packet carries a proper `def route_<packet>_request` pseudocode block with all three canonical markers, and the validator can no longer be dodged by merging the SMART ROUTING heading into another section.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a canonical `### Smart Router Pseudocode` block (three markers: `discover_markdown_resources`, `_guard_in_skill`, `UNKNOWN_FALLBACK`) to the nine packets that lacked one.
- Split `create-flowchart`'s merged `## 1. When To Use + Smart Routing` heading into standalone `## 1. WHEN TO USE` + `## 2. SMART ROUTING` and renumber the trailing sections.
- Close the `validate_smart_router` loophole so a merged/non-standalone SMART ROUTING heading is flagged and strict-promoted to an error.
- Verify the `sk-doc` parent hub router works (registry-driven), without reshaping it into the pseudocode form.

### Out of Scope
- `create-command` and `create-skill` — already carry full `def route_…` routers; left untouched.
- Reshaping the parent hub `SKILL.md` router into `def route_…` form — the hub routes to packets via `mode-registry.json` (validated by `parent-skill-check.cjs`), a different contract; per the operator's scope answer it is only verified, not rewritten.
- Any change to packet routing *vocabulary* (`Keyword triggers:` lines) or `mode-registry.json`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/create-agent/SKILL.md` | Modify | TIER-FLAT `route_agent_request` block |
| `.opencode/skills/sk-doc/create-benchmark/SKILL.md` | Modify | TIER-KEYED compact `route_benchmark_request` + redundancy trims to stay under the 5000-word strict cap |
| `.opencode/skills/sk-doc/create-changelog/SKILL.md` | Modify | TIER-FLAT `route_changelog_request` (golden reference block) |
| `.opencode/skills/sk-doc/create-diff/SKILL.md` | Modify | TIER-FLAT `route_diff_request` (no `references/` dir → graceful happy path) |
| `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md` | Modify | TIER-FLAT `route_feature_catalog_request` block |
| `.opencode/skills/sk-doc/create-flowchart/SKILL.md` | Modify | Split merged heading + renumber + `route_flowchart_request` block |
| `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` | Modify | TIER-FLAT `route_manual_testing_playbook_request` block |
| `.opencode/skills/sk-doc/create-quality-control/SKILL.md` | Modify | TIER-FLAT `route_quality_control_request` block |
| `.opencode/skills/sk-doc/create-readme/SKILL.md` | Modify | TIER-FLAT `route_readme_request` block |
| `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py` | Modify | Loophole fix: detect merged SMART ROUTING heading, warn + strict-promote |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every mode packet carries a canonical router block | All 11 packet SKILL.md files contain the three markers and a `def route_<packet>_request`; `grep` table confirms per packet |
| REQ-002 | SMART ROUTING is a standalone H2 in every packet | Each packet has exactly one `## N. SMART ROUTING` heading; `grep -c` returns 1 |
| REQ-003 | Validator loophole closed | A merged SMART ROUTING heading is flagged and strict-promoted; a standalone heading with 3 markers is clean (unit test) |
| REQ-004 | All packets pass strict packaging | `package_skill.py <pkt> --check --strict` = PASS for all 11 packets |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | create-benchmark stays under the strict word cap | `package_skill.py create-benchmark --check --strict` reports < 5000 words and PASS |
| REQ-006 | Parent hub router verified (not reshaped) | `parent-skill-check.cjs <hub>` exits 0 with 0 warnings; hub SKILL.md router remains registry-driven |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 11 `sk-doc` mode packets PASS `package_skill.py --check --strict`.
- **SC-002**: The `validate_smart_router` loophole is closed and proven by a unit test (merged heading flagged; standalone+3-markers clean).
- **SC-003**: The parent hub router passes `parent-skill-check.cjs` STRICT with 0 warnings and stays registry-driven.
- **SC-004**: `validate.sh --recursive --strict` on the 029 packet reports Errors:0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | create-benchmark at 4989/5000 words pre-edit | Adding a full router breaches the strict word cap | Compact TIER-KEYED block that references the shared canonical helpers + trim triple-stated lane-ownership prose (unique facts preserved) |
| Risk | Renumbering create-flowchart sections could break cross-refs | Broken "section N" prose references | Re-point the affected "Pattern Selection" cross-refs; re-run `--check --strict` |
| Dependency | `skill_smart_router.md` canonical pattern | Router shape derives from it | Mirror its four resilience patterns; keep the three markers verbatim |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Router pseudocode is documentation, not executed code — no runtime performance impact.

### Security
- **NFR-S01**: Every router keeps the `_guard_in_skill` sandbox marker so resource loading stays inside the skill directory.

### Reliability
- **NFR-R01**: Every router keeps a multi-tier `UNKNOWN_FALLBACK` path so an unclear request degrades to a disambiguation checklist rather than a wrong load.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Packet with no `references/<key>/` subdirs: TIER-FLAT routers load the flat refs/assets that exist; intent selects the documented template, not a keyed subtree.
- Packet with no `references/` dir at all (create-diff): the happy-path loop is a graceful no-op; the marker helpers still validate.
- create-benchmark word ceiling: the compact block references the shared helper in prose (guard marker present once) rather than re-inlining the body.

### Error Scenarios
- Merged/non-standalone SMART ROUTING heading: validator now emits `SMART ROUTING must be its own H2 section` and strict-promotes it to an error.
- Low-confidence intent: router returns `load_level: UNKNOWN_FALLBACK` with a disambiguation checklist.

### State Transitions
- Heading renumber (create-flowchart): trailing sections 3-12 shift by one; internal "section N" cross-refs updated to match.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 10 files; ~670 insertions, but overwhelmingly repetitive router prose |
| Risk | 6/25 | Documentation + a 15-line validator tweak; no runtime code paths |
| Research | 4/20 | Pattern is fixed by create-skill canon; minimal investigation |
| **Total** | **22/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope and the two extra items (loophole fix + parent-hub verify-only) were resolved with the operator before implementation.
<!-- /ANCHOR:questions -->
