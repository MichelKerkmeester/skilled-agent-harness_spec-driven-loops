---
title: "Decision Record: Phase 053 doc-alignment and README fill-in [template:decision-record.md]"
description: "Three architecture decisions taken before phase 053 dispatch: full-coverage merge scope, multi-prefix retention for merged playbook IDs, and in-place stay for manifest maintainer docs."
trigger_phrases:
  - "phase 053 decisions"
  - "operator_runbook merge scope"
  - "multi-prefix scheme"
  - "manifest doc placement"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/003-cross-cutting-cleanup-pass/028-documentation-alignment-readme-fill-in"
    last_updated_at: "2026-05-07T11:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Recorded ADRs D-1, D-2, D-3"
    next_safe_action: "Cite ADRs in Wave dispatches"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Phase 053

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Operator-runbook -> manual-testing-playbook merge scope

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-07 |
| **Deciders** | User (plan-mode AskUserQuestion answer) |

---

### Context

`mcp_server/skill_advisor/` carries two parallel manual-testing surfaces:
- `operator_runbook/` (43 scenarios, 9 categories, full subsystem coverage)
- `manual_testing_playbook/` (4 SAD-NNN scenarios, 3 categories, narrow critical path)

The `manual_testing_playbook` entry-point file already documents the `operator_runbook` as "previous material" (line 42), so the two are not equal-weight peers — the playbook was meant to be a leaner re-frame but never absorbed the full operator coverage. Three of the four SAD scenarios overlap operator scenarios (NC-001, NC-004, NC-006); SAD-003 is a subset of CL-001.

### Constraints

- sk-doc enforces a single canonical playbook per skill via `assets/testing_playbook/manual_testing_playbook_template.md`.
- Memory rule `feedback_delete_not_archive_or_comment` prohibits archival; the source folder must be deleted, not z_archived or symlinked.
- User explicit preference: "preserve all 43 + absorb 4 overlaps".

---

### Decision

**Summary**: Preserve all 43 operator_runbook scenarios. Absorb the 4 SAD overlaps into their NC/CL counterparts (better content kept). Delete operator_runbook directory.

**Details**:
- SAD-001 -> fold real-user-request + RCAF prompt into NC-001; delete SAD-001 file.
- SAD-002 -> fold into NC-004; delete SAD-002 file.
- SAD-003 -> fold claude-specific signals into CL-001; delete SAD-003 file.
- SAD-004 -> fold rebuild repair-path into NC-006; delete SAD-004 file.
- Each receiver gets a "Absorbed from former SAD-NNN at 2026-05-07" note.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Full preservation + 4-way absorption** | No coverage loss; matches operator depth; cleans the parallel-folder violation | Larger surface to validate; absorption care required for receiver edits | 9/10 |
| Trim to critical-path subset (~10–15) | Lean output; matches manual_testing_playbook's pre-merge scale | Coverage regression: NC-002/003/005, CP-*, OP-*, AU-*, AI-*, LC-*, SC-*, PC-* lost; would force re-authoring later | 4/10 |
| Preserve all 43 + keep 4 SAD docs as-is | No merge work on overlap | Redundancy violates sk-doc single-source rule; two parallel happy-path docs | 3/10 |

**Why Chosen**: Full preservation maintains coverage; 4-way absorption resolves the only existing redundancy; the cost is upfront merge effort which is one-time.

---

### Consequences

**Positive**:
- Single canonical manual-testing surface for skill_advisor.
- All subsystem coverage retained (NC/CL/CP/OP/AU/AI/LC/SC/PC).
- Sk-doc template compliance achieved without coverage loss.

**Negative**:
- WB-5 is the largest work-block (~50 file mutations); must run solo to avoid cli-codex parallelism races.
- Receiver-edit care required for the 4 absorption points; spot-check per-test files for completeness.

<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Post-merge ID prefix scheme

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-07 |
| **Deciders** | User (plan-mode AskUserQuestion answer) |

---

### Context

After the merge, all scenarios live in one playbook. Two prefix schemes are in play:
- operator_runbook uses semantic multi-prefix: NC (native MCP), CL (CLI), CP (compat), OP (operator H5), AU (auto-update), AI (auto-indexing), LC (lifecycle), SC (scorer), PC (Python compat).
- manual_testing_playbook uses single SAD prefix.

Pattern anchor `cli-claude-code/manual_testing_playbook/` uses a single skill-wide prefix (CC-NNN), but `cli-claude-code` is a single-domain skill. Skill_advisor has 9 distinct subsystems.

### Constraints

- 43 of 47 scenarios already use multi-prefix; 4 use SAD.
- Sk-doc per-feature template requires PREFIX-NNN format but does not constrain prefix length or scheme.
- Cross-references in code (test files, hooks) likely refer to NC/CL IDs.

---

### Decision

**Summary**: Keep operator_runbook's multi-prefix scheme (NC/CL/CP/OP/AU/AI/LC/SC/PC). Deprecate SAD-NNN with a cross-reference appendix mapping SAD-001..SAD-004 to their NC/CL absorbers.

**Details**:
- 43 IDs unchanged (NC-001..NC-006, CL-001..CL-004, etc.).
- 4 SAD IDs mapped: SAD-001 -> NC-001, SAD-002 -> NC-004, SAD-003 -> CL-001, SAD-004 -> NC-006.
- Cross-reference table appended to merged `manual_testing_playbook.md` so future readers can resolve SAD-NNN references.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Multi-prefix retained** | Subsystem semantics preserved; matches existing 43-of-47 IDs; no cross-repo grep updates needed for unchanged IDs | One additional cross-ref appendix entry; new readers need to learn 9 prefixes | 9/10 |
| Unify under single SA-NNN | Cleaner global numbering; matches cli-claude-code shape | Loses subsystem signal in ID; requires cross-ref table for ALL 43 old IDs; cross-repo grep churn | 5/10 |
| Standardize to 2-letter codes | Already 2-letter except confirmed unique | No actual conflict found; renaming for cosmetics | 3/10 |

**Why Chosen**: Subsystem semantics in IDs are a feature, not noise — they let a reader skim the playbook index and immediately know which subsystem a scenario tests. Cost of preservation is near-zero (4 SAD remappings).

---

### Consequences

**Positive**:
- Zero cross-repo grep churn for the 43 preserved IDs.
- Cross-reference appendix isolates the SAD->NC/CL legacy mapping in one place.
- Future authors continue using subsystem prefixes when adding new scenarios.

**Negative**:
- New readers face 9 prefix codes (mitigated by per-category section headers in the entry-point file).

<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Manifest maintainer docs stay in place

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-07 |
| **Deciders** | User (explicit instruction in original prompt) |

---

### Context

`templates/manifest/EXTENSION_GUIDE.md` (45 LOC) and `templates/manifest/MIGRATION.md` (30 LOC) are internal maintainer docs:
- EXTENSION_GUIDE describes the 5-step process to add a new document type to the spec-kit manifest system.
- MIGRATION describes legacy marker support, broad-document-list derivation, and sunset policy.

Neither has YAML frontmatter. The user asked to "treat them as references but keep them in their current location" — i.e., apply `skill_reference_template.md` frontmatter shape, but do NOT move them out of `templates/manifest/`.

### Constraints

- These docs co-locate with the manifest assets they describe (`spec-kit-docs.json`, `*.tmpl` files).
- Moving them to `references/` would orphan them from the manifest assets and break maintainer mental model.
- sk-doc routing might classify them as "reference" or "maintainer" — validator accepts `contextType: "reference"`; "maintainer" not listed as canonical value.

---

### Decision

**Summary**: Apply `skill_reference_template.md` frontmatter (`contextType: "reference"`) to both files, kept at `templates/manifest/`. Add a header comment on each: "Lives at `templates/manifest/` (not `references/`) because it co-locates with the manifest assets it documents."

**Details**:
- Add YAML frontmatter: `title`, `description`, `trigger_phrases` (maintainer-audience phrases like "manifest extension", "migration policy"), `importance_tier: "normal"`, `contextType: "reference"`.
- Add 1–2 sentence intro after H1, then `---` divider.
- Renumber existing H2 sections to `## 1. ...`, `## 2. ...`, etc.

---

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stay at templates/manifest/ + reference frontmatter** (chosen) | Co-location preserved; sk-doc compliance achieved; user's stated preference | Slightly unusual `contextType: "reference"` for a non-`references/` doc | 9/10 |
| Move to `references/manifest/EXTENSION_GUIDE.md` | Convention: reference docs live under `references/` | Orphans them from manifest assets; maintainer mental model broken; user explicitly rejected this | 2/10 |
| Use `contextType: "maintainer"` | Semantically accurate | Not a canonical sk-doc value; validator would reject or warn | 3/10 |

**Why Chosen**: Co-location with the manifest assets is more valuable than path-uniformity. The `contextType: "reference"` is fine because sk-doc routes by content/audience, not by parent directory.

---

### Consequences

**Positive**:
- Maintainer mental model preserved (find manifest docs alongside manifest files).
- sk-doc DQI passes on both files.
- No relocation churn or git rename history complications.

**Negative**:
- One small irregularity: `templates/manifest/*.md` files exist outside the canonical `references/` tree. Mitigated by header comment explaining the co-location rationale.

**Verification clause**: If sk-doc validator rejects `contextType: "reference"` outside `references/` (it should not, per current implementation), fall back to omitting `contextType` entirely — `validate_document.py` does not require it.

<!-- /ANCHOR:adr-003 -->
