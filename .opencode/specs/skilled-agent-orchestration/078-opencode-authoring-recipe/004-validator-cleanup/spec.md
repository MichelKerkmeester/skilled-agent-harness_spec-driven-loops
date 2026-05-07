---
title: "Feature Specification: 078/004 system-spec-kit Validator + MCP Tool Registry Cleanup"
description: "Add graph-metadata.json + description.json shape checks to validate.sh --strict. Fix ROLLOUT_FLAGS dir-resource (F-001-001). Document mcp-coco-index MCP coverage gap (only search exposed). Refresh search telemetry doc to match runtime fields."
trigger_phrases: ["078/004", "validator-cleanup", "graph-metadata-shape", "ROLLOUT_FLAGS"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/078-opencode-authoring-recipe/004-validator-cleanup"
    last_updated_at: "2026-05-05T19:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Phase 4 scaffolded; ready for cli-codex dispatch"
    next_safe_action: "Dispatch cli-codex"
    blockers: []
    key_files:
      - .opencode/skills/system-spec-kit/SKILL.md
      - .opencode/skills/system-spec-kit/scripts/rules/
      - .opencode/skills/system-spec-kit/scripts/lib/validator-registry.json
      - .opencode/skills/mcp-coco-index/SKILL.md
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "078-004-final"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 078/004 system-spec-kit Validator + MCP Tool Registry Cleanup

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
| **Predecessor** | 078/003 mcp-coco-index v1.1.0 |
| **Successor** | None (final phase of 078) |
| **Handoff Criteria** | New validator rules ship; ROLLOUT_FLAGS fixed; MCP coverage gap documented; telemetry doc refreshed; validate.sh --strict on 078/004 exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
077 surfaced 4+ findings in the validator + MCP tool docs cluster. F-001-001: system-spec-kit/SKILL.md `ROLLOUT_FLAGS` RESOURCE_MAP entry includes a directory path (`feature_catalog/19--feature-flag-reference/`), which violates the `_guard_in_skill` markdown-only rule. F-002-001 + F-002-002: `validate.sh --strict` does not validate `graph-metadata.json` or `description.json` shape — drift slips through. F-003-001: mcp-coco-index MCP server only exposes `search`; CLI has init/index/status/reset/daemon — coverage is documented inconsistently. F-004-002: search telemetry docs overstate emitted fields. F-008-003: verifier cannot catch markdown/resource-map drift.

### Purpose
Add two new validator rules (graph-metadata + description shape checks) registered in validator-registry.json. Fix ROLLOUT_FLAGS to point at a markdown file (or remove the directory entry). Document mcp-coco-index MCP coverage gap explicitly in mcp-coco-index/SKILL.md. Audit + refresh search telemetry doc to match runtime emitted fields. Closes 6 P1 + 3 P2 findings; final phase of 078 remediation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New validator rule `check-graph-metadata-shape.sh` (+ registry entry) — checks required keys, derived block, packet block
- New validator rule `check-description-shape.sh` (+ registry entry) — checks required keys, level field
- Fix `ROLLOUT_FLAGS` entry in system-spec-kit/SKILL.md line 208-210 (replace directory path with the leading markdown file inside it OR remove directory entry)
- Add MCP coverage section to mcp-coco-index/SKILL.md explicitly listing CLI-only operations (init/index/status/reset/daemon) vs MCP-exposed (search only)
- Audit + refresh search telemetry doc in mcp-coco-index references — align documented fields with actual `_ranked_result` emission (rankingSignals, score, raw_score, path_class)
- Bump system-spec-kit/SKILL.md frontmatter version (next minor)
- Bump mcp-coco-index/SKILL.md frontmatter version 1.1.0 → 1.1.1 (patch — doc-only)
- Author changelog entries for both skills

### Out of Scope
- Adding new MCP tools to mcp-coco-index server.py (would be a feature; this phase documents the gap, not closes it)
- Refactoring MCP tool dispatch in system-spec-kit MCP server
- Implementing new validator features beyond the 2 named shape checks
- Webflow stack changes
- Cross-runtime mirror updates (the validator scripts aren't mirrored)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `system-spec-kit/scripts/rules/check-graph-metadata-shape.sh` | Create | New validator rule |
| `system-spec-kit/scripts/rules/check-description-shape.sh` | Create | New validator rule |
| `system-spec-kit/scripts/lib/validator-registry.json` | Modify | Register 2 new rules |
| `system-spec-kit/SKILL.md` | Modify | Fix ROLLOUT_FLAGS entry |
| `mcp-coco-index/SKILL.md` | Modify | Add MCP Coverage section; version bump |
| `mcp-coco-index/references/<telemetry-doc>.md` | Modify (or audit-only if no drift) | Align with runtime fields |
| `mcp-coco-index/changelog/v1.3.1.0.md` | Create | Patch changelog |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria | 077 Finding |
|----|-------------|---------------------|-------------|
| REQ-001 | check-graph-metadata-shape.sh exists + executable + handles missing/malformed JSON | File present; bash -n parses; manual test on a sample folder returns expected pass/fail | F-002-001, F-002-004 |
| REQ-002 | check-description-shape.sh exists + executable | File present; bash -n parses | F-002-002 |
| REQ-003 | Both new rules registered in validator-registry.json with rule_id, aliases, script_path, severity | jq returns 2 new entries | F-002-001, F-002-002 |
| REQ-004 | ROLLOUT_FLAGS entry in SKILL.md no longer points at a bare directory | grep `feature_catalog/19--feature-flag-reference/$` returns 0 hits (no trailing-slash bare dir); replaced with .md file or removed | F-001-001 |
| REQ-005 | mcp-coco-index/SKILL.md adds MCP Coverage section listing exposed vs CLI-only operations | grep "MCP Coverage\|MCP-exposed\|CLI-only" returns ≥1 hit | F-003-001, F-004-001 |
| REQ-006 | mcp-coco-index telemetry doc audited + aligned (or marked as already-aligned with note) | grep `rankingSignals\|canonical_resource_boost\|implementation_boost` in telemetry doc | F-004-002 |
| REQ-007 | mcp-coco-index version 1.1.0 → 1.1.1 in SKILL.md | grep `^version: 1.1.1` SKILL.md | — |
| REQ-008 | mcp-coco-index changelog v1.3.1.0.md created | File present | — |
| REQ-009 | validate.sh --strict on 078/004 exits 0 | Validator returns 0/0 | — |
| REQ-010 | Existing `validate.sh --strict` runs (e.g., on 077, 078/001-003) still pass with new rules added | Spot-check on 1-2 prior packets | — |
| REQ-011 | One commit on main + pushed | `git push origin main` exit 0 | — |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-012 | New rules use existing helper conventions (RULE_NAME, RULE_STATUS, RULE_DETAILS array) | grep matches in both new rule scripts |
| REQ-013 | Telemetry doc references correct ranking_signals values from query.py _ranked_result | Cross-reference passes |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: validate.sh --strict catches `graph-metadata.json` / `description.json` shape drift on a sample folder with intentional drift.
- **SC-002**: A future audit doesn't re-discover F-001-001 / F-002-001 / F-002-002 / F-003-001 / F-004-001 / F-004-002 / F-008-003 as P1/P2 — they're closed.

### Given/When/Then Verification Scenarios

**Given** check-graph-metadata-shape.sh is registered, **When** running validate.sh --strict on a folder with malformed graph-metadata.json, **Then** the rule fails with descriptive error.

**Given** ROLLOUT_FLAGS no longer references a bare directory, **When** an AI agent loads system-spec-kit/SKILL.md and inspects RESOURCE_MAP, **Then** all entries are markdown-file-routable.

**Given** mcp-coco-index/SKILL.md has the MCP Coverage section, **When** a maintainer reads it, **Then** they see explicitly which operations are MCP-exposed vs CLI-only.

**Given** telemetry doc lists rankingSignals values, **When** comparing to query.py _ranked_result actual emissions, **Then** all documented values are emitted (no overstatement).

**Given** validate.sh --strict on a prior packet (e.g., 077), **When** running with new rules registered, **Then** no false-positive failures on previously-clean packets.

**Given** validate.sh --strict on 078/004, **When** running, **Then** 0 errors and 0 warnings.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | New shape-check rules cause regressions on prior packets | Med | REQ-010 explicitly spot-checks prior packets after rule addition |
| Risk | ROLLOUT_FLAGS fix breaks the router's ability to load feature-flag references | Low | Replace dir entry with the actual leading .md file inside the directory |
| Risk | Telemetry doc audit reveals fields that need RUNTIME changes (not just doc) | Low-Med | Out-of-scope: doc-only alignment. If runtime change needed, defer to follow-up |
| Dependency | jq for validator-registry.json edits | Green | Available |
| Dependency | bash + jq for new rule scripts | Green | Already used by existing rules |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Scope is concrete; finding IDs map to REQs.
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
