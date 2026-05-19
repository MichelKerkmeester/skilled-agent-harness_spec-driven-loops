---
title: "Feature Specification: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern [template:level_2/spec.md]"
description: "FORMAT.md and benchmarks_format.md lived in two separate sk-doc locations and were mirrored to sibling MCP skills via symlinks. This packet consolidates the trio into one benchmark_creation.md reference, adds a source_template.md scaffold, drops the FORMAT.md symlinks from sibling skills, and updates all cross-link references. sk-doc becomes the single source of truth with a clean *_creation.md-pattern entry point."
trigger_phrases:
  - "benchmark creation reference"
  - "benchmark_creation.md"
  - "benchmark format consolidation"
  - "FORMAT.md consolidation"
  - "sk-doc benchmark creation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc"
    last_updated_at: "2026-05-19T12:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Consolidation complete."
    next_safe_action: "ready to commit on main"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/references/benchmark_creation.md"
      - ".opencode/skills/sk-doc/assets/benchmark/source_template.md"
      - ".opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "consolidate-006-benchmark-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Symlink topology: drop symlinks entirely; sibling READMEs reference sk-doc canonical by absolute path."
      - "Consolidation shape: merge FORMAT.md + benchmarks_format.md into single benchmark_creation.md per *_creation.md pattern."
      - "source_template.md: add to assets/benchmark/ as fillable SOURCE.md scaffold."
      - "Short slug: 006-benchmark-format-to-sk-doc."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Consolidate benchmark format mechanics into a single sk-doc reference following the *_creation.md pattern

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-19 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The benchmark format mechanics for MCP skill-local benchmark folders were split across two separate files in sk-doc (`references/benchmarks/FORMAT.md` and `references/benchmarks_format.md`) and mirrored to sibling MCP skills via relative symlinks. This created three problems: readers had to consult two files to get the full picture; the symlink topology added maintenance overhead and path-resolution fragility; and the FORMAT.md and benchmarks_format.md naming did not follow the `*_creation.md` pattern used by sk-doc's other creation references (feature_catalog_creation.md, manual_testing_playbook_creation.md, agent_creation.md).

### Purpose

Consolidate the trio into one `benchmark_creation.md` reference that follows the `*_creation.md` pattern, add a `source_template.md` scaffold for SOURCE.md authoring, drop the FORMAT.md symlinks from sibling skills, and repoint all cross-link references to the new canonical path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Create `.opencode/skills/sk-doc/references/benchmark_creation.md` consolidating FORMAT.md + benchmarks_format.md into a single 10-section `*_creation.md`-pattern reference.
- Create `.opencode/skills/sk-doc/assets/benchmark/source_template.md` as a fillable SOURCE.md scaffold.
- Delete `.opencode/skills/sk-doc/references/benchmarks/FORMAT.md` and the empty `benchmarks/` directory.
- Delete `.opencode/skills/sk-doc/references/benchmarks_format.md`.
- Delete `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` (was a symlink).
- Delete `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` (was a symlink).
- Update all cross-link references in: `benchmark_report_template.md`, sibling skill READMEs, four historical spec.md files, and the four originating packet (004-skill-local-benchmarks-format) docs.

### Out of Scope

- Retroactive rewriting of historical spec.md content beyond a short "relocated to sk-doc in packet 006" note.
- Changes to shipped benchmark result folders or their benchmark_report.md, results.csv or per-probe.jsonl files.
- Changes to `.opencode/skills/sk-doc/scripts/validate_document.py`.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/references/benchmark_creation.md` | Create | New canonical, ~10 sections, *_creation.md pattern |
| `.opencode/skills/sk-doc/assets/benchmark/source_template.md` | Create | Fillable SOURCE.md scaffold |
| `.opencode/skills/sk-doc/references/benchmarks/FORMAT.md` | Delete | Consolidated into benchmark_creation.md |
| `.opencode/skills/sk-doc/references/benchmarks/` | Delete (dir) | Empty after FORMAT.md removal |
| `.opencode/skills/sk-doc/references/benchmarks_format.md` | Delete | Consolidated into benchmark_creation.md |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` | Delete (symlink) | Dropped; README references canonical by path |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` | Delete (symlink) | Dropped; README references canonical by path |
| `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | Modify | Usage comment repointed to benchmark_creation.md |
| `.opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md` | Modify | FORMAT.md references repointed to benchmark_creation.md |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md` | Modify | FORMAT.md references repointed to benchmark_creation.md |
| 4 historical spec.md files in `016-embedder-testing-and-architecture` | Modify | Canonical-mechanics pointer updated to benchmark_creation.md |
| `004-skill-local-benchmarks-format/{spec,plan,tasks,implementation-summary}.md` | Modify | Historical note appended naming packet 006 as the relocation event |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Create `benchmark_creation.md` at `.opencode/skills/sk-doc/references/benchmark_creation.md` with ten sections following the `*_creation.md` pattern | `test -f .opencode/skills/sk-doc/references/benchmark_creation.md` exits 0 |
| REQ-002 | Create `source_template.md` at `.opencode/skills/sk-doc/assets/benchmark/source_template.md` | `test -f .opencode/skills/sk-doc/assets/benchmark/source_template.md` exits 0 |
| REQ-003 | Delete the trio: `references/benchmarks/FORMAT.md`, `references/benchmarks/` directory and `references/benchmarks_format.md` | `test ! -e .opencode/skills/sk-doc/references/benchmarks` exits 0; `test ! -e .opencode/skills/sk-doc/references/benchmarks_format.md` exits 0 |
| REQ-004 | Delete both FORMAT.md symlinks from sibling skills | `test ! -e .opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` exits 0; `test ! -e .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Update `benchmark_report_template.md` usage comment to reference `benchmark_creation.md` | `rg "benchmarks/FORMAT\.md\|benchmarks_format\.md" .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` returns 0 matches |
| REQ-006 | Update sibling skill READMEs to reference `benchmark_creation.md` as canonical | `rg "benchmarks/FORMAT\.md\|benchmarks_format\.md" .opencode/skills/system-spec-kit/mcp_server/benchmarks/README.md .opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md` returns 0 matches |
| REQ-007 | Update 4 historical spec.md files in `016-embedder-testing-and-architecture` | `rg "references/benchmarks/FORMAT\.md" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/` returns 0 matches |
| REQ-008 | Update `004-skill-local-benchmarks-format/{spec,plan,tasks,implementation-summary}.md` with relocation historical note | Each file contains the phrase "relocated to sk-doc in packet 006" |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: New canonical exists. `test -f .opencode/skills/sk-doc/references/benchmark_creation.md` exits 0.
- **SC-002**: New source template exists. `test -f .opencode/skills/sk-doc/assets/benchmark/source_template.md` exits 0.
- **SC-003**: Trio deleted. `test ! -e .opencode/skills/sk-doc/references/benchmarks` and `test ! -e .opencode/skills/sk-doc/references/benchmarks_format.md` both exit 0.
- **SC-004**: Symlinks deleted. `test ! -e .opencode/skills/system-spec-kit/mcp_server/benchmarks/FORMAT.md` and `test ! -e .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md` both exit 0.
- **SC-005**: No stale references remain. `rg -l "sk-doc/references/benchmarks/FORMAT\.md|sk-doc/references/benchmarks_format\.md|system-spec-kit/mcp_server/benchmarks/FORMAT\.md" --glob '!z_archive/**' --glob '!z_future/**' --glob '!external/**' --glob '!**/006-benchmark-format-to-sk-doc/**'` returns 0 matches.
- **SC-006**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/006-benchmark-format-to-sk-doc --strict` exits 0.
- **SC-007**: Both shipped `benchmark_report.md` files still validate with `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `sk-doc/scripts/validate_document.py` | Path-agnostic. If it broke, SC-007 would fail. | Smoke-test on both shipped reports post-consolidation. |
| Dependency | `validate.sh --strict` | Must exit 0 for SC-006. | Run after all changes; placeholder warnings in implementation-summary are expected per `feedback_implementation_summary_placeholders` and do not block completion. |
| Risk | Stale references missed in historical spec.md files | Med | SC-005 rg sweep is the catch-all. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All questions were resolved before implementation:

- **Symlink topology** → DROP symlinks entirely. Sibling READMEs reference `sk-doc/references/benchmark_creation.md` by absolute path. No symlinks. Operator-confirmed.
- **Consolidation shape** → Merge FORMAT.md + benchmarks_format.md into a single `benchmark_creation.md` per `*_creation.md` pattern. Operator-confirmed.
- **source_template.md** → Add to `assets/benchmark/` as fillable SOURCE.md scaffold. Operator-confirmed.
- **Short slug** → `006-benchmark-format-to-sk-doc`. Operator-confirmed.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A (documentation consolidation, no runtime performance surface changes).

### Security
- **NFR-S01**: N/A (no auth, secrets or data-handling surface changes).

### Reliability
- **NFR-R01**: No symlinks created. All cross-references are by explicit path in prose.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Pre-existing file at `references/benchmark_creation.md`: none existed prior to this packet.
- Partial deletion: benchmarks/ dir only becomes removable after FORMAT.md is deleted first.

### Error Scenarios
- sk-doc validator on benchmark_report_template.md: updated usage comment must not break any required frontmatter or section checks.
- Historical spec.md files with no exact old-path match: four target spec.md files all confirmed to have the exact string `references/benchmarks/FORMAT.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | ~15 file touches, two new files created, five files deleted/removed |
| Risk | 5/25 | No code, no auth, no schema. Stale-reference rot mitigated by SC-005 rg sweep. |
| Research | 3/20 | Source docs read; *_creation.md pattern confirmed from three existing references. |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
