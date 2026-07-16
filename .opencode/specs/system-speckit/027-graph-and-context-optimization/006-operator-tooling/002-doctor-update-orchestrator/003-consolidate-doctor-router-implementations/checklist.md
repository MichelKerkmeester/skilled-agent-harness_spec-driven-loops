---
title: "Checklist: Doctor Router Phase 1 [system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-skill-advisor-routing-engine-consolidation/checklist]"
description: "Verification gates and completion criteria for Phase 1 (additive /doctor router + /doctor:mcp + _routes.yaml + 4-runtime mirrors)."
trigger_phrases:
  - "013/004 router phase checklist"
  - "doctor router verification"
  - "route-validate checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/006-operator-tooling/002-doctor-update-orchestrator/003-consolidate-doctor-router-implementations"
    last_updated_at: "2026-05-11T16:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Phase 1 router shipped + verified"
    next_safe_action: "Phase 2 lives in 004-cutover-doctor-router-from-legacy-files"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-014-001-router-phase-2026-05-11"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Doctor Router Phase 1 (Additive)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim done until complete |
| **[P1]** | Required quality gate | Must complete or get explicit deferral |
| **[P2]** | Nice-to-have / audit support | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [ ] CHK-001 [P0]: 013 phase parent has lean trio (`spec.md`, `description.json`, `graph-metadata.json`) — no heavy docs at parent.
- [ ] CHK-002 [P0]: 013 phase parent `graph-metadata.json` `parent_id` = `system-spec-kit/026-graph-and-context-optimization`.
- [ ] CHK-003 [P0]: 013 phase parent `children_ids` includes `system-spec-kit/026-graph-and-context-optimization/010-doctor-update-orchestrator/003-skill-advisor-routing-engine-consolidation`.
- [ ] CHK-004 [P0]: 001-router-phase has full Level 2 doc set (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `description.json`, `graph-metadata.json`).
- [ ] CHK-005 [P1]: 001-router-phase `description.json` `parentChain` = `["system-spec-kit", "027-graph-and-context-optimization", "010-doctor-update-orchestrator"]`.
- [ ] CHK-006 [P0]: Both packets pass `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <path> --strict` (exit 0).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

### Routing Manifest (`_routes.yaml`)

- [ ] CHK-101 [P0]: `_routes.yaml` exists at `.opencode/commands/doctor/_routes.yaml`.
- [ ] CHK-102 [P0]: Manifest parses as valid YAML.
- [ ] CHK-103 [P0]: `.routes` is a list with EXACTLY 7 entries.
- [ ] CHK-104 [P0]: Targets are: `memory`, `causal-graph`, `code-graph`, `deep-loop`, `cocoindex`, `skill-advisor`, `skill-budget` (alphabetical sort OK; order doesn't affect routing).
- [ ] CHK-105 [P0]: Each route has all 8 required keys: `target`, `yaml`, `setup_vars`, `allowed_flags`, `mutating`, `gate3_location`, `mcp_tools`, `trigger_phrases`.
- [ ] CHK-106 [P0]: Each route's `yaml` value references an existing file in `.opencode/commands/doctor/assets/`.
- [ ] CHK-107 [P0]: Each route's `mutating` is one of: `read-only`, `add-only`, `mutates`.
- [ ] CHK-108 [P0]: Mutation classifications match reality:
  - `skill-budget` -> `read-only`
  - `causal-graph` -> `add-only`
  - `memory`, `code-graph`, `deep-loop`, `cocoindex`, `skill-advisor` -> `mutates`

### Router Command (`.opencode/commands/doctor.md`)

- [ ] CHK-201 [P0]: File exists at `.opencode/commands/doctor.md` (NOT inside `doctor/`).
- [ ] CHK-202 [P1]: Frontmatter `description` <= 110 chars (Skill Advisor soft target).
- [ ] CHK-203 [P1]: Frontmatter `argument-hint` = `"<target> [flags] | list | ?"`.
- [ ] CHK-204 [P0]: Frontmatter `allowed-tools` covers the union of all 7 routes' `mcp_tools` PLUS the tools `/doctor:mcp` needs.
- [ ] CHK-205 [P1]: Body has EXECUTION PROTOCOL block (verbatim from existing Gen-A commands).
- [ ] CHK-206 [P1]: Body has CONSTRAINTS block (verbatim).
- [ ] CHK-207 [P1]: Body has SUBSYSTEM MANIFEST narrative table referencing `_routes.yaml` as the canonical source.
- [ ] CHK-208 [P0]: Body has GATE 3 STATUS table with one row per target, columns: target, Location, Reason, Alternative, Mutation class.
- [ ] CHK-209 [P0]: Body has UNIFIED SETUP PHASE with Tier 1 (target resolution) and Tier 2 (per-target case block).
- [ ] CHK-210 [P0]: Tier 1 logic: positional arg -> target; missing -> menu; `list`/`?` -> manifest table; unknown -> error.
- [ ] CHK-211 [P0]: Tier 2 logic: per-target `case` block parses ONLY that target's `allowed_flags`; unknown flags raise a clear error citing the correct target.
- [ ] CHK-212 [P1]: Body has EXAMPLES section showing argv-positional invocations for all 7 targets.
- [ ] CHK-213 [P2]: Body documents `--target=<name>` as a compatibility alias.

### MCP Command (`.opencode/commands/doctor/mcp.md`)

- [ ] CHK-301 [P0]: File exists at `.opencode/commands/doctor/mcp.md`.
- [ ] CHK-302 [P1]: Frontmatter `description` <= 110 chars.
- [ ] CHK-303 [P1]: Frontmatter `argument-hint` = `"<install|debug> [--server <name>] [--runtime <name>] [--fix]"`.
- [ ] CHK-304 [P0]: Frontmatter `allowed-tools` covers union of `mcp_install.yaml` + `mcp_debug.yaml` tool needs.
- [ ] CHK-305 [P0]: Body has two-sub-action selector: `install` -> `doctor_mcp_install.yaml`, `debug` -> `doctor_mcp_debug.yaml`.
- [ ] CHK-306 [P1]: Unknown sub-action raises a clear error.

### CI Assertion Script (`route-validate.sh`)

- [ ] CHK-401 [P0]: File exists at `.opencode/commands/doctor/scripts/route-validate.sh`.
- [ ] CHK-402 [P0]: `chmod +x` applied; `bash -n` passes.
- [ ] CHK-403 [P1]: Script depends on `yq` (or pure-bash YAML parse if yq unavailable; document the dependency).
- [ ] CHK-404 [P0]: Asserts manifest parses + has >=1 route + each route has all required keys.
- [ ] CHK-405 [P0]: Asserts every `yaml` value references an existing file in `assets/`.
- [ ] CHK-406 [P0]: Asserts every `mcp_tools` entry exists in the router's frontmatter `allowed-tools` union.
- [ ] CHK-407 [P0]: Asserts no duplicate `target` names.
- [ ] CHK-408 [P2]: Warns on flag collisions across targets (informational only).
- [ ] CHK-409 [P1]: Has self-tests at the bottom — intentionally corrupt fixtures cause non-zero exit.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

### 4-Runtime Mirrors

- [ ] CHK-501 [P1]: `.claude/commands/doctor.md` exists, body-equivalent to `.opencode`.
- [ ] CHK-502 [P1]: `.claude/commands/doctor/mcp.md` exists, body-equivalent.
- [ ] CHK-503 [P1]: `.gemini/commands/doctor.md` exists, body-equivalent.
- [ ] CHK-504 [P1]: `.gemini/commands/doctor/mcp.md` exists, body-equivalent.
- [ ] CHK-505 [P1]: `.codex/commands/doctor.toml` exists with TOML envelope + body matching `.opencode/commands/doctor.md` markdown.
- [ ] CHK-506 [P1]: `.codex/commands/doctor/mcp.toml` exists with TOML envelope + body matching `.opencode/commands/doctor/mcp.md`.
- [ ] CHK-507 [P2]: Codex TOML body inspected manually for drift (per `feedback_codex_toml_body_drift`).

### Smoke Tests

- [ ] CHK-601 [P0]: `/doctor` (no args) -> menu, no YAML load.
- [ ] CHK-602 [P0]: `/doctor memory --dry-run` -> loads `doctor_memory.yaml`, equivalent first-message to `/doctor:memory --dry-run`.
- [ ] CHK-603 [P0]: `/doctor causal-graph --dry-run` -> loads `doctor_causal-graph.yaml`.
- [ ] CHK-604 [P0]: `/doctor code-graph` -> loads `doctor_code-graph.yaml`.
- [ ] CHK-605 [P0]: `/doctor deep-loop --scope=both --dry-run` -> loads `doctor_deep-loop.yaml`.
- [ ] CHK-606 [P0]: `/doctor cocoindex --dry-run` -> loads `doctor_cocoindex.yaml`.
- [ ] CHK-607 [P0]: `/doctor skill-advisor --skip-tests --dry-run` -> loads `doctor_skill-advisor.yaml`.
- [ ] CHK-608 [P0]: `/doctor skill-budget --json --fail-over=5600` -> loads `doctor_skill-budget.yaml`.
- [ ] CHK-609 [P0]: `/doctor:mcp install --server spec-kit-memory` -> loads `doctor_mcp_install.yaml`.
- [ ] CHK-610 [P0]: `/doctor:mcp debug --fix` -> loads `doctor_mcp_debug.yaml`.
- [ ] CHK-611 [P0]: `/doctor:update --dry-run` -> byte-equivalent output to pre-router-consolidation state (unchanged).
- [ ] CHK-612 [P0]: `/doctor memory --confidence-threshold=0.8` -> clean error (cross-target flag injection rejected).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

### Skill Advisor

- [ ] CHK-701 [P1]: `skill_advisor.py "memory continuity index drift" --threshold 0.8` -> recommends `/doctor`.
- [ ] CHK-702 [P1]: `skill_advisor.py "causal edges drift" --threshold 0.8` -> recommends `/doctor`.
- [ ] CHK-703 [P1]: `skill_advisor.py "deep-loop coverage" --threshold 0.8` -> recommends `/doctor`.
- [ ] CHK-704 [P1]: `skill_advisor.py "cocoindex daemon hung" --threshold 0.8` -> recommends `/doctor`.
- [ ] CHK-705 [P1]: `skill_advisor.py "skill budget audit" --threshold 0.8` -> recommends `/doctor`.
- [ ] CHK-706 [P1]: `skill_advisor.py "MCP install" --threshold 0.8` -> recommends `/doctor:mcp`.
- [ ] CHK-707 [P1]: `skill_advisor.py "spec-kit version migration" --threshold 0.8` -> recommends `/doctor:update` (unchanged).

### Non-Regression

- [ ] CHK-801 [P0]: `git diff .opencode/commands/doctor/assets/` shows ZERO changes (YAMLs untouched).
- [ ] CHK-802 [P0]: `git diff .opencode/commands/doctor/update.md` shows ZERO changes (orchestrator untouched).
- [ ] CHK-803 [P0]: `git diff .opencode/commands/doctor/scripts/` shows only the new `route-validate.sh` addition.
- [ ] CHK-804 [P0]: `git diff .opencode/commands/doctor/{causal-graph,cocoindex,code-graph,deep-loop,memory,skill-advisor,skill-budget,mcp_debug,mcp_install}.md` shows ZERO changes (Phase 1 is additive).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- Existing command authorization stays explicit in markdown frontmatter.
- The router's `allowed-tools` union is validated against per-target `mcp_tools`.
- Cross-target flags are rejected before YAML handoff.
- Phase 1 does not delete, rewrite, or hide the legacy command files.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [ ] CHK-901 [P1]: `generate-context.js` run for this packet; updated `description.json` + `graph-metadata.json`.
- [ ] CHK-902 [P1]: Phase-parent `graph-metadata.json` `derived.last_active_child_id` = `003-skill-advisor-routing-engine-consolidation`.
- [ ] CHK-903 [P2]: Phase-parent `_memory.continuity.next_safe_action` updated to `Scaffold 004-cutover-doctor-router-from-legacy-files`.
- [ ] CHK-904 [P1]: `_memory.continuity.completion_pct` on this packet = 100.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- Parent docs stay lean: `spec.md`, `description.json`, and `graph-metadata.json`.
- Phase 1 Level 2 docs stay under `001-router-phase/`.
- Runtime command files stay under their existing runtime command directories.
- This strict-validation pass may only modify the packet documentation files listed in the task.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Area | Required Evidence | Status |
|------|-------------------|--------|
| Strict template compliance | `validate.sh <this-packet> --strict` exits 0 | Pending |
| Route manifest | `route-validate.sh` exits 0 | Pending |
| Runtime smoke | 7 router targets + 2 MCP sub-actions pass | Pending |
| Non-regression | Existing YAMLs, `/doctor:update`, and legacy commands unchanged | Pending |
| Memory continuity | Packet metadata refreshed at completion | Pending |
<!-- /ANCHOR:summary -->
