---
title: "Decision Record: Align the sk-design README Set to the create-readme Standard"
description: "Architecture decisions for the README alignment sweep: one monolithic Level 3 pass, README shape by folder type, and one data-README for the bundle corpus."
trigger_phrases:
  - "styles readme alignment decisions"
  - "create-readme sweep adr"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/009-styles-readme-create-readme-alignment"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Aligned ADRs to fixture sub-anchors"
    next_safe_action: "Hold ADRs as authoring contract"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/library/bundles/README.md"
      - ".opencode/skills/sk-doc/create-readme/assets/readme-code-template.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-008-readme-alignment-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Align the sk-design README Set to the create-readme Standard

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One Monolithic Level 3 Sweep, Not Phase Children

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

Twelve READMEs across the sk-design styles library need alignment to the create-readme standard. The work is uniform: each README is a small, self-contained folder document, and the sweep changes documentation only. The packet must decide whether to structure the work as a single Level 3 packet or to decompose it into phase children.

### Constraints

- The twelve edits share one workflow: classify, author, quality-gate
- No code, test or bundle-data changes, so risk and blast radius are low
- Phase children carry their own heavy docs and metadata overhead
- The phase-qualification guard requires both a complexity score of at least 25/50 and documentation level of at least 3
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**Summary**: Treat this as one monolithic Level 3 packet with a single spec, plan, tasks, checklist, decision-record and implementation-summary. Do not create phase children.

**Details**: The twelve READMEs are grouped inside `tasks.md` by folder family (skill root, lib tree, library data, scripts, tests, oracle golden) plus a shared quality gate. Grouping is enough structure; phase children would add doc overhead without reducing coordination cost.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Monolithic Level 3** | One workflow, one doc set, low overhead, matches the uniform edits | Single tasks.md tracks all twelve at once | 9/10 |
| Phase parent with children | Isolates each README family, parallel-friendly | Heavy per-child docs and metadata for trivial edits; fails the phase-qualification threshold | 5/10 |
| Level 2 packet | Lighter than Level 3 | The operator requested a full Level 3 doc set with a decision record | 6/10 |

**Why this one**: The work is uniform and low-risk, so a single Level 3 packet gives the requested rigor without the overhead of phase children.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One coherent doc set covers the whole sweep
- Task grouping keeps the twelve READMEs individually trackable
- No phase-parent metadata to maintain

**What it costs**:
- All twelve are tracked in one tasks.md. Mitigation: grouped by folder family with explicit per-grouping tasks

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Scope creep beyond the twelve files | M | `git diff` scope check gates completion |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The operator requested a full L3 doc set for the twelve-README sweep |
| 2 | **Beyond Local Maxima?** | PASS | Monolithic, phase-parent and Level 2 options were compared |
| 3 | **Sufficient?** | PASS | Task grouping tracks each README family without phase children |
| 4 | **Fits Goal?** | PASS | One workflow matches the uniform, low-risk edits |
| 5 | **Open Horizons?** | PASS | The packet can still split later if scope grows |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- The packet doc set (this folder)
- The twelve target README files at authoring time

**How to roll back**: Documentation only. Revert any README edit to restore prior state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: README Shape Follows Folder Type

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-002-context -->
### Context

The twelve targets are not all the same kind of folder. One is the `sk-design` skill root, several are source-code folders (`lib`, `lib/engine`, `lib/database`, `scripts`, `tests/*`), and several are regenerated data folders (`library`, `library/bundles`, `library/manifests`, `tests/oracle/golden`). The create-readme workflow provides distinct templates for these types.

### Constraints

- create-readme routes by artifact type: skill/general README versus code-folder README
- Data folders should not be documented as if they were source modules
- The skill root already uses a skill-README shape and should keep it
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**Summary**: Classify each README by folder type and author it to the matching shape. The skill root uses the skill/general README shape (`readme-template.md`). Code folders use the code-folder shape (`readme-code-template.md`). Data folders use a trimmed data-README shape focused on purpose, contents, do-not-hand-edit and architecture fit.

**Details**: `sk-design/README.md` stays a skill README. `lib`, `lib/engine`, `lib/database`, `scripts`, `tests/database`, `tests/engine` and `tests/oracle` become code-folder READMEs. `library`, `library/bundles`, `library/manifests` and `tests/oracle/golden` become data-READMEs that emphasize regenerated content and do-not-hand-edit.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Shape by folder type** | Matches create-readme routing, right depth per folder | Requires a per-folder classification step | 9/10 |
| One uniform shape for all twelve | Simplest to author | Forces code-folder sections onto data folders and vice versa | 4/10 |
| Skill shape everywhere | Consistent voice | Code and data folders do not need marketing-style overview sections | 3/10 |

**Why this one**: Matching README shape to folder type is what the create-readme workflow prescribes and keeps each README at the right depth.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Each README is the right depth for its folder
- Data folders stay lean and warn against hand-editing
- Code folders gain topology, key files and dependency direction

**What it costs**:
- Requires a classification pass first. Mitigation: Phase 1 handles it explicitly

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Misclassifying a folder type | L | Classification recorded in Phase 1 and re-checked in the quality gate |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The folders differ (skill, code, data), so one shape would misfit |
| 2 | **Beyond Local Maxima?** | PASS | Uniform-shape and skill-everywhere alternatives were compared |
| 3 | **Sufficient?** | PASS | Three shapes cover all twelve folders |
| 4 | **Fits Goal?** | PASS | Matches create-readme artifact routing |
| 5 | **Open Horizons?** | PASS | A folder can be reclassified if its type is wrong |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- All twelve target READMEs
- Template selection during authoring

**How to roll back**: Documentation only. Reclassify and re-author if a type is wrong.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: One Data-README for the Bundle Corpus

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-22 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-003-context -->
### Context

`styles/library/bundles/` holds roughly 1,290 per-style bundle folders (a raw listing shows 1,292 entries including the README). Each bundle is regenerated data produced by the extractor and read by the retrieval manifest and the database indexer. The packet must decide how much of this corpus to document.

### Constraints

- The bundles are data, not code, and are not individually meaningful to a reader
- Hand-editing a bundle desynchronizes it from the manifest fingerprints
- The `007` precedent already documents the corpus at the folder level
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**Summary**: Document the corpus with one data-README at `styles/library/bundles/README.md`. Do not create per-bundle documentation.

**Details**: The single data-README states that the folder is regenerated data, names the extractor and the manifest and indexer that consume it, warns against hand-editing and describes the folder's architecture fit. It cites the count as approximately 1,290, confirmed from a live listing at authoring.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **One data-README** | Lean, matches the `007` precedent, warns against hand-editing | The corpus size is only summarized, not enumerated | 9/10 |
| Per-bundle READMEs | Each bundle self-documents | ~1,290 stray files, all redundant, all data | 1/10 |
| No README at all | Zero maintenance | A reader landing in the folder has no orientation | 3/10 |

**Why this one**: One data-README gives full orientation with none of the noise of per-bundle docs.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- The corpus is oriented in one place
- No proliferation of redundant per-bundle files
- Clear do-not-hand-edit guidance protects manifest integrity

**What it costs**:
- The exact bundle count is summarized. Mitigation: confirm the number from a live listing at authoring and state it as approximate

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reader edits a bundle by hand | M | The data-README states the desync consequence explicitly |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | ~1,290 data folders cannot each carry a doc |
| 2 | **Beyond Local Maxima?** | PASS | Per-bundle and no-README alternatives were compared |
| 3 | **Sufficient?** | PASS | One data-README orients the whole corpus |
| 4 | **Fits Goal?** | PASS | Matches the `007` folder-level precedent |
| 5 | **Open Horizons?** | PASS | The exact count is confirmed at authoring |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `styles/library/bundles/README.md`
- The related `library/` and `library/manifests/` data-READMEs that reference the corpus

**How to roll back**: Documentation only. Revert the data-README to restore prior state.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->
