---
title: "Feature Specification: 078/003 mcp-coco-index Canonical-Priority + Portability"
description: "Add CANONICAL_RESOURCE_PATHS setting + per-project canonical_resource_paths field that bypasses **/.* exclusion. Add canonical_resource_boost signal in query._ranked_result. Add smoke test asserting fresh-clone ingestion of .opencode/skills/sk-code/assets/opencode/. Document rank-priority contract in mcp-coco-index/SKILL.md. Bump 1.0.0 → 1.1.0."
trigger_phrases: ["078/003", "coco-priority", "canonical_resource_paths", "canonical_resource_boost"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/066-opencode-authoring-recipe/003-coco-priority"
    last_updated_at: "2026-05-05T18:30:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 3 scaffolded; ready for cli-codex dispatch"
    next_safe_action: "Dispatch cli-codex for Python settings + query updates"
    blockers: []
    key_files:
      - .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/settings.py
      - .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py
      - .opencode/skills/mcp-coco-index/tests/test_settings.py
      - .opencode/skills/mcp-coco-index/SKILL.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-003-final"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 078/003 mcp-coco-index Canonical-Priority + Portability

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent** | `../spec.md` (078-opencode-authoring-recipe) |
| **Predecessor** | 078/002 spec-kit-load (cross-skill load contract) |
| **Successor** | 078/004 validator-cleanup |
| **Handoff Criteria** | mcp-coco-index 1.1.0 ships canonical-paths bypass + rank boost; smoke test PASS; pytest --strict-markers PASS on tests/test_settings.py |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
077 finding F-001-002: `DEFAULT_EXCLUDED_PATTERNS` includes `**/.*` (hidden directories) which excludes `.opencode/skills/sk-code/assets/opencode/` from default ingestion. The user's local repo has overrides, but a fresh clone won't ingest sk-code resources by default, breaking discoverability for new contributors. F-005-001 (portability), F-005-002 / F-005-004 / F-007-005 / F-008-005 (canonical resources have no rank priority over playbook/spec scaffolds), F-009-003 / F-009-004 (excluded-by-design but no smoke test). Without an explicit canonical-resource opt-in mechanism + rank boost + smoke test, sk-code's freshly-shipped authoring assets (Phase 1 v3.2.0.0) are second-class citizens in semantic search.

### Purpose
Add a `CANONICAL_RESOURCE_PATHS` default list + per-project `canonical_resource_paths` field on `ProjectSettings`. Paths in this list bypass `**/.*` exclusion (always ingested) AND get a +0.10 ranking boost in `query._ranked_result`. Smoke test in `tests/test_settings.py` asserts `.opencode/skills/sk-code/assets/opencode/` is not excluded under defaults. Document the contract in `mcp-coco-index/SKILL.md`. Closes 3 P1 + 5 P2 findings: F-001-002, F-005-001, F-005-002, F-005-004, F-007-005, F-008-005, F-009-003, F-009-004.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `CANONICAL_RESOURCE_PATHS: list[str]` constant in `settings.py` (default contains `.opencode/skills/*/assets/opencode/**`, `.opencode/skills/*/assets/motion_dev/**`, and similar known-canonical sk-code patterns)
- Add `canonical_resource_paths: list[str]` field on `ProjectSettings` dataclass (`field(default_factory=lambda: list(CANONICAL_RESOURCE_PATHS))`)
- Add `is_canonical_path()` helper that checks if a relative path matches any pattern in canonical_resource_paths
- Update YAML `to_dict` / `from_dict` serialization to include `canonical_resource_paths`
- Update path-filter logic (wherever `exclude_patterns` is consulted) so canonical paths bypass exclusion
- Update `query._ranked_result` to add `canonical_resource_boost` signal (+0.10 score boost) when path matches canonical patterns
- Add tests in `tests/test_settings.py`: (a) default canonical_resource_paths contains expected sk-code paths, (b) canonical path bypasses `**/.*` exclusion, (c) round-trip YAML serialize/deserialize preserves canonical_resource_paths
- Update `mcp-coco-index/SKILL.md` with a Canonical Resource Paths section explaining the rank-priority contract + how to opt in
- Bump SKILL.md frontmatter version 1.0.0 → 1.1.0
- Author `changelog/v1.3.0.0.md` (compact format)

### Out of Scope
- Sweeping refactor of query.py path-class detection logic (use existing path_class machinery)
- Re-indexing of existing repos (this is a default-update; users with existing indexes can `ccc reset && ccc index` to pick up new defaults)
- Webflow stack canonical paths (motion_dev included for symmetry, but Webflow-specific canonical paths are not in scope)
- Cross-CLI canonical-priority documentation in cli-codex/cli-copilot/cli-opencode (those skills don't consume mcp-coco-index directly)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/cocoindex_code/settings.py` | Modify | Add CANONICAL_RESOURCE_PATHS constant; add canonical_resource_paths field on ProjectSettings; update to_dict/from_dict; add is_canonical_path() helper |
| `mcp_server/cocoindex_code/query.py` | Modify | Add canonical_resource_boost in _ranked_result (+0.10 score) |
| `tests/test_settings.py` | Modify | Add 3 tests for canonical_resource_paths behavior |
| `SKILL.md` | Modify | Add Canonical Resource Paths section; bump version 1.0.0 → 1.1.0 |
| `changelog/v1.3.0.0.md` | Create | Compact-format changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | 077 Finding |
|----|-------------|---------------------|-------------|
| REQ-001 | CANONICAL_RESOURCE_PATHS constant exists with default sk-code asset patterns | `grep "CANONICAL_RESOURCE_PATHS" settings.py` returns ≥1 hit; default includes `.opencode/skills/*/assets/opencode/**` | F-001-002, F-005-001 |
| REQ-002 | ProjectSettings has canonical_resource_paths field | `grep "canonical_resource_paths" settings.py` returns ≥3 hits (constant + field + serialization) | F-001-002 |
| REQ-003 | YAML serialization round-trips canonical_resource_paths | tests/test_settings.py round-trip test PASS | F-005-001 |
| REQ-004 | canonical paths bypass exclusion under defaults | tests/test_settings.py canonical-bypass test PASS for `.opencode/skills/sk-code/assets/opencode/skill_authoring.md` | F-001-002, F-009-004 |
| REQ-005 | _ranked_result includes canonical_resource_boost signal | `grep "canonical_resource_boost" query.py` returns ≥1 hit; +0.10 score adjustment | F-005-002, F-007-005 |
| REQ-006 | mcp-coco-index/SKILL.md documents Canonical Resource Paths contract | `grep -i "canonical resource paths" SKILL.md` returns ≥1 hit | F-008-005, F-009-003 |
| REQ-007 | SKILL.md frontmatter version 1.0.0 → 1.1.0 | grep `^version: 1.1.0` SKILL.md | — |
| REQ-008 | changelog/v1.3.0.0.md created (compact format) | File present at `.opencode/skills/mcp-coco-index/changelog/v1.3.0.0.md` | — |
| REQ-009 | All 3 new tests pass (default content + bypass + round-trip) | `pytest tests/test_settings.py -k "canonical"` exit 0 | — |
| REQ-010 | Existing tests still pass (no regression) | `pytest tests/test_settings.py` exit 0 | — |
| REQ-011 | validate.sh --strict on 078/003 exits 0 | Validator returns 0/0 | — |
| REQ-012 | One commit on main + pushed | `git push origin main` exit 0 | — |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | is_canonical_path() helper handles glob patterns (e.g., `**/assets/opencode/**`) | Test asserts `.opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md` matches pattern `.opencode/skills/*/assets/opencode/**` |
| REQ-014 | canonical_resource_boost is documented in SKILL.md alongside the bypass behavior | Same Canonical Resource Paths section explains both ingestion bypass + rank boost |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fresh-clone smoke test asserts `.opencode/skills/sk-code/assets/opencode/` is ingested under defaults (closes the portability gap surfaced by F-001-002 + F-005-001).
- **SC-002**: An AI agent searching for "skill authoring checklist" via mcp-coco-index gets the new sk-code authoring asset ranked AHEAD of unrelated playbook scenarios that mention "skill authoring" (closes F-005-002 + F-007-005).

### Given/When/Then Verification Scenarios

**Given** CANONICAL_RESOURCE_PATHS is shipped with default sk-code patterns, **When** a fresh ProjectSettings instance is created, **Then** canonical_resource_paths includes `.opencode/skills/*/assets/opencode/**`.

**Given** canonical_resource_paths is set, **When** the path filter checks `.opencode/skills/sk-code/assets/opencode/checklists/skill_authoring.md`, **Then** is_canonical_path() returns True and exclusion is bypassed.

**Given** _ranked_result is called for a row whose file_path matches canonical_resource_paths, **When** ranking is computed, **Then** score gets +0.10 boost and ranking_signals includes "canonical_resource_boost".

**Given** YAML round-trip with canonical_resource_paths populated, **When** settings.from_dict(settings.to_dict(s)), **Then** canonical_resource_paths is preserved verbatim.

**Given** existing test suite (10+ tests in test_settings.py), **When** pytest runs, **Then** all pre-existing tests still pass.

**Given** validate.sh --strict on 078/003, **When** running, **Then** 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New canonical-paths logic regresses existing search behavior | Med | Existing tests must still pass; canonical_resource_boost adds to score (additive), doesn't replace; path filter additively bypasses exclusion |
| Risk | Default CANONICAL_RESOURCE_PATHS is too aggressive (over-includes) | Low | Default scoped to `.opencode/skills/*/assets/opencode/**` and motion_dev, NOT all hidden dirs; users can opt-out via empty list |
| Risk | YAML round-trip drops the new field for users with old YAML files | Low | from_dict has a `.get("canonical_resource_paths", list(CANONICAL_RESOURCE_PATHS))` fallback |
| Risk | +0.10 boost is wrong magnitude | Low | Mirrors existing implementation_boost magnitude (also 0.05); 0.10 is intentionally larger to ensure canonical resources outrank borderline matches but not enough to dominate genuinely-better unrelated matches |
| Dependency | sk-code assets/opencode/ exists with shipped checklists (Phase 1) | Green | Just shipped in 078/001 v3.2.0.0 |
| Dependency | pytest available + tests/conftest.py present | Green | Existing test infra works |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Scope is concrete; finding IDs from 077 map directly to REQs.
<!-- /ANCHOR:questions -->

---

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
