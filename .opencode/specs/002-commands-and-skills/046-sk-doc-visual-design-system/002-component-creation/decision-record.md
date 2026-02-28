---
title: "Decision Record"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Decision Record: SK-Doc-Visual Additional Extraction (Phase 002)

<!-- ANCHOR:adr-001 -->
## ADR-001: Use Source-Anchored Extraction and Deterministic Preview Naming

### Metadata
| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-02-28 |
| **Deciders** | Michel Kerkmeester, OpenCode Agent |

<!-- ANCHOR:adr-001-context -->
### Context
Phase 001 established initial section/component previews and documented the design system baseline.
Phase 002 needs to expand coverage with 12 additional sections and 5 additional components while preserving current preview conventions.
Without fixed extraction anchors and naming conventions, implementation will likely drift from the canonical source template.

### Constraints
- Canonical source remains `.opencode/skill/sk-doc-visual/assets/templates/readme-guide-v2.html`.
- Existing previews already standardize imports to `../variables/*` and `../variables/template-defaults.js`.
- Current phase is planning-only; implementation and `implementation-summary.md` are deferred.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
**We chose**: Extract all remaining targets using line-cited source anchors and deterministic file names aligned to existing preview patterns.

**How it works**: Each section target maps to one `*-section.html` output file, and each component target maps to one standalone component preview file.
All future files inherit the same base scaffold used by current previews, and interaction contracts are preserved for `scroll-progress` and copy-code behavior.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Source-anchored deterministic extraction (chosen)** | Auditable, reproducible, aligned with existing conventions | Requires up-front matrix maintenance if source shifts | 9/10 |
| Visual-only extraction without line anchors | Fast initial drafting | High drift risk, harder review traceability | 4/10 |
| Automated bulk slicing script | Can accelerate volume extraction | Risky for interaction contracts and semantic grouping | 6/10 |

**Why this one**: It provides the highest fidelity and reviewability while matching how existing previews were prepared.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
**What improves**:
- Implementation can proceed file-by-file without re-discovery overhead.
- Reviewers can verify each output against exact source line evidence.
- Naming consistency reduces maintenance friction across section/component assets.

**What it costs**:
- The extraction matrix must be refreshed if source line positions move.
  Mitigation: include source revalidation as the first setup task.

**Risks**:
| Risk | Impact | Mitigation |
|------|--------|------------|
| Source edits invalidate line references | Medium | Re-run grep anchors before implementation starts. |
| Interaction behaviors are under-extracted | Medium | Require script-contract checks for copy-code and scroll-progress. |
| Scope creep into implementation during plan phase | Medium | Keep implementation tasks/checklist items pending until execution phase. |
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation
| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Additional targets are currently uncovered by standalone previews. |
| 2 | **Beyond Local Maxima?** | PASS | Compared source-anchored, visual-only, and scripted extraction approaches. |
| 3 | **Sufficient?** | PASS | Naming + source anchors + scaffold contract fully cover planning needs. |
| 4 | **Fits Goal?** | PASS | Goal is reproducible extraction planning, not runtime refactor. |
| 5 | **Open Horizons?** | PASS | Plan scales to future sections/components using same pattern. |

**Checks Summary**: 5/5 PASS.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation
**What changes**:
- Planning docs in this phase folder now contain target matrices, sequence plans, pending tasks, and verification states.
- Future implementation will create 12 section previews and 5 component previews with deterministic naming.

**How to roll back**:
1. Revert files in `specs/002-commands-and-skills/046-sk-doc-visual-design-system/002-component-creation/`.
2. Restore prior phase state from git history.
3. Re-run validation before reattempting planning updates.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
