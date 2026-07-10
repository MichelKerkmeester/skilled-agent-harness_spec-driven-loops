---
title: "Feature Specification: Doc-alignment and missing-README fill-in [template:level_3/spec.md]"
description: "Align five doc-quality drift items under system-spec-kit/ with sk-doc canonical templates; add two missing folder READMEs; merge skill_advisor operator_runbook into manual_testing_playbook."
trigger_phrases:
  - "doc alignment phase 053"
  - "multi-ai-council frontmatter"
  - "extension guide migration frontmatter"
  - "predicates folder readme"
  - "code_graph utils folder readme"
  - "operator_runbook merge manual_testing_playbook"
  - "release cleanup phase 053"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in"
    last_updated_at: "2026-05-07T11:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Authored spec, resource-map, decision-record"
    next_safe_action: "Dispatch Wave A via cli-codex"
    blockers: []
    key_files:
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/spec.md"
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/resource-map.md"
      - "specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/028-documentation-alignment-readme-fill-in/decision-record.md"
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Packet name: 028-documentation-alignment-readme-fill-in (user-specified)"
      - "Merge scope: preserve all 43 operator_runbook scenarios; absorb 4 SAD overlaps"
      - "ID prefix scheme: keep multi-prefix NC/CL/CP/OP/AU/AI/LC/SC/PC"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Doc-alignment and missing-README fill-in

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-05-07 |
| **Branch** | `main` (stay-on-main per project memory) |
| **Parent Spec** | ../spec.md |
| **Phase** | 53 of 53 |
| **Predecessor** | 027-missing-code-readme-resource-map |
| **Successor** | None |
| **Handoff Criteria** | All five work-blocks pass sk-doc DQI validation, strict spec validate exits 0 or 1, operator_runbook directory deleted, no stale `operator_runbook` or `SAD-00[1-4]` references remain. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 53** of the `000-release-cleanup` parent under `026-graph-and-context-optimization`.

**Scope Boundary**: Five disjoint doc-quality work-blocks plus one folder merge under `.opencode/skills/system-spec-kit/`. No executable-code changes. No content-semantics changes to existing scenarios — only structural alignment with sk-doc templates.

**Dependencies**:
- `sk-doc` skill provides canonical templates (`skill_reference_template.md`, `readme_code_template.md`, `manual_testing_playbook_template.md`) and the validator script.
- Phase 052 README-template guidance establishes the baseline for code-folder README authoring.

**Deliverables**:
- 6 multi-ai-council reference files updated with sk-doc reference frontmatter.
- 2 manifest maintainer docs (EXTENSION_GUIDE, MIGRATION) updated with reference frontmatter, kept in `templates/manifest/`.
- 2 new folder READMEs (`shared/predicates/`, `mcp_server/code_graph/lib/utils/`).
- 1 merged manual_testing_playbook (43 + 4 absorbed scenarios) replacing operator_runbook.
- Phase docs (this packet) with detailed resource-map.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Five doc-quality drift items have accumulated under `.opencode/skills/system-spec-kit/`: (1) the `references/multi-ai-council/` directory has 6 files with inconsistent frontmatter (only 1 of 6 conforms to `skill_reference_template.md`); (2) two manifest maintainer docs (`templates/manifest/EXTENSION_GUIDE.md`, `MIGRATION.md`) lack reference frontmatter entirely; (3) `shared/predicates/` (560 LOC, 1 source + tests) has no folder README despite all 9 sibling directories under `shared/` having one; (4) `mcp_server/code_graph/lib/utils/` (64 LOC) has no folder README; (5) `mcp_server/skill_advisor/` carries two parallel manual-testing surfaces — `operator_runbook/` (43 scenarios, full subsystem coverage) and `manual_testing_playbook/` (4 scenarios, narrow critical path) — whose existence in parallel violates the sk-doc single-source-of-truth contract. Each item is small in isolation, but together they erode template adherence and make sk-doc governance harder to enforce.

### Purpose
Bring all five surfaces into alignment with sk-doc's canonical templates in a single orchestrated pass, so the next batch of phase parents inherits a clean precedent.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Frontmatter + structure alignment of 6 files under `references/multi-ai-council/` against `skill_reference_template.md`.
- Frontmatter + structure alignment of `templates/manifest/EXTENSION_GUIDE.md` and `MIGRATION.md` against `skill_reference_template.md`. Files stay at `templates/manifest/`; **no relocation**.
- Creation of `.opencode/skills/system-spec-kit/shared/predicates/README.md` using `readme_code_template.md`.
- Creation of `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/README.md` using `readme_code_template.md`.
- Merger of `mcp_server/skill_advisor/operator_runbook/` (43 scenarios) into `mcp_server/skill_advisor/manual_testing_playbook/`. Operator_runbook directory **physically deleted** post-merge (no archival, no symlink, no tombstone). All cross-repo references updated.

### Out of Scope
- Sk-code surface alignment work — handled by separate sibling packet `002-sk-code-opencode-alignment` under same parent.
- Executable-code changes in `predicates/` or `utils/` — README addition only.
- Scenario-content semantic changes inside operator_runbook or manual_testing_playbook — only structural reframing to sk-doc per-feature template.
- Renaming category dirs in the merged playbook (`10--python-compat/` stays at `10--`; no renumbering to close the `09--` gap).
- Updating skill_advisor's `SKILL.md` to reference the merged playbook unless `rg` finds an explicit `operator_runbook` link in it (in which case it falls into "update cross-references").

### Files to Change

See `resource-map.md` for the complete enumerated path catalog. Summary:

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/references/multi-ai-council/*.md` (6) | Modify | Add reference frontmatter, intro, divider, numbered H2 |
| `.opencode/skills/system-spec-kit/templates/manifest/{EXTENSION_GUIDE,MIGRATION}.md` (2) | Modify | Add reference frontmatter, intro, divider, numbered H2 |
| `.opencode/skills/system-spec-kit/shared/predicates/README.md` | Create | New folder README (readme_code_template) |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/lib/utils/README.md` | Create | New folder README (readme_code_template) |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/**` | Modify/Create | Rewrite entry-point file; add 9 category dirs and 43 per-test scaffolds; absorb 4 SAD overlaps |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/operator_runbook/**` | Delete | Entire directory `rm -rf` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Six multi-ai-council files have valid sk-doc reference frontmatter | All 6 files start with `---`; YAML parses; required keys (`title`, `description`) present; `validate_document.py` exits 0 |
| REQ-002 | Two manifest maintainer docs (EXTENSION_GUIDE, MIGRATION) have valid sk-doc reference frontmatter | Both files start with `---`; YAML parses; required keys present; both still located under `templates/manifest/` |
| REQ-003 | `shared/predicates/README.md` exists and validates | File present; passes `validate_document.py`; documents `boolean-expr.ts` exports + Stable API |
| REQ-004 | `mcp_server/code_graph/lib/utils/README.md` exists and validates | File present; passes validator; documents `workspace-path.ts` + 3 caller fan-in |
| REQ-005 | `operator_runbook/` directory deleted | `test ! -d <path>` returns true |
| REQ-006 | Merged `manual_testing_playbook/` contains all 43 ported scenarios + entry-point | Per-test file count = 43; entry-point file follows sk-doc §1–6 + per-category sections |
| REQ-007 | All four SAD-NNN scenarios absorbed into NC/CL counterparts | `rg '\bSAD-00[1-4]\b' .opencode/` returns hits only in cross-reference appendix of `manual_testing_playbook.md` |
| REQ-008 | No stale references to `operator_runbook` outside this packet | `rg -ln 'operator_runbook' .opencode/ specs/` empty (excluding this packet's own docs) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Strict spec validate exits 0 on this packet | `bash scripts/spec/validate.sh <packet> --strict` exit 0 |
| REQ-010 | Each merged per-test file has 9-column contract table | Spot-check 2 random merged files for the §3 TEST EXECUTION 9-column header |
| REQ-011 | Implementation-summary.md filled before completion claim | No `[YOUR_VALUE_HERE` markers remain in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 8 modified-in-place files (6 multi-ai-council + 2 manifest) pass sk-doc DQI ≥75.
- **SC-002**: Both new folder READMEs pass sk-doc DQI ≥75.
- **SC-003**: Merged manual_testing_playbook contains exactly 43 per-test files distributed across 9 category directories that mirror operator_runbook's structure.
- **SC-004**: `rg -ln 'operator_runbook'` over `.opencode/` and `specs/` (excluding this packet) returns 0 hits.
- **SC-005**: Strict spec validate on packet 053 exits 0 (or 1 with documented warnings).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | cli-codex parallelism corrupts shared files | High | Cap parallel WBs at 3; ensure WB-1..WB-4 touch disjoint trees (verified); WB-5 runs solo |
| Risk | sk-doc validate over-strict on EXTENSION_GUIDE/MIGRATION (maintainer audience, not user reference) | Medium | Use `contextType: "reference"` first; if validator rejects, fall back to a maintainer-appropriate value documented in decision-record D-3 |
| Risk | Hidden cross-references to `operator_runbook` outside `.opencode/` and `specs/` | Medium | Run `rg -ln 'operator_runbook' --hidden -uu` before WB-5 to map ALL references; update each |
| Risk | Phase parent `graph-metadata.json` regeneration overwrites manual fields | Low | Per memory `feedback_generate_context_regenerates_parent_metadata`, restore `parent_id`, `manual.depends_on`, `derived.last_active_child_id` after each generate-context run |
| Risk | `create.sh` auto-branched to `scaffold/053-…` | Low | Per memory `feedback_stay_on_main_no_feature_branches`, immediately switched back to main; --phase mode used --skip-branch implicitly (verified: still on main) |
| Risk | Implementation-summary unfilled at completion | Low | Per memory `project_implementation_summary_unfilled_gap`, explicit task in tasks.md ensures fill before completion-claim |
| Risk | Codex CLI not in fast mode | Low | Per memory `feedback_codex_cli_fast_mode`, every dispatch passes `-c service_tier="fast"` explicitly |
| Dependency | `sk-doc` validator script | Critical | `python3 .opencode/skills/sk-doc/scripts/validate_document.py` runs on each modified file |
| Dependency | `system-spec-kit` strict validate | Critical | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None at scaffold time. All three pre-implementation choices (packet name, merge scope, ID prefix scheme) answered by user during plan approval; recorded in `decision-record.md` ADRs D-1..D-3.
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
