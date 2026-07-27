---
title: "Feature Specification: Template conformance for design-md-generator and design-mcp-open-design"
description: "The two sk-design modes the hub-wide audit never reached: design-md-generator's off-enum importance_tier and four exemplar DESIGN.md files with an off-enum contextType, and design-mcp-open-design's five of nine reference files with unnumbered H2 headings."
trigger_phrases:
  - "remaining mode conformance"
  - "design-md-generator conformance"
  - "design-mcp-open-design conformance"
  - "unnumbered H2 headings"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/012-remaining-mode-conformance"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec covering design-md-generator + design-mcp-open-design conformance"
    next_safe_action: "Decide relocate-vs-exempt for the four examples/**/DESIGN.md files before touching them"
    blockers:
      - "The four examples/**/DESIGN.md files need an operator or executor decision: relocate out of references/ or document an exemption, not a content rewrite"
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
      - ".opencode/skills/sk-design/design-md-generator/references/examples/vercel/DESIGN.md"
      - ".opencode/skills/sk-design/design-md-generator/references/examples/linear/DESIGN.md"
      - ".opencode/skills/sk-design/design-md-generator/references/examples/supabase/DESIGN.md"
      - ".opencode/skills/sk-design/design-md-generator/references/examples/stripe/DESIGN.md"
      - ".opencode/skills/sk-design/design-mcp-open-design/references/guarded-proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Template conformance for design-md-generator and design-mcp-open-design
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned — no work started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `011-retirement-residue` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The program parent's hub-wide audit covered `design-interface`, `design-motion`, `shared`, and the hub root, but never reached `design-md-generator` or `design-mcp-open-design`. A targeted look finds: `design-md-generator/references/extraction-workflow.md:10` carries `importance_tier: "high"`, which is off the documented enum (`normal`|`important`); four `references/examples/{vercel,linear,supabase,stripe}/DESIGN.md` files carry `contextType: reference` at their own `:9`, also off the documented enum (`planning`|`research`|`implementation`|`general`) — but these are output exemplars demonstrating the DESIGN.md format the mode produces, not authored guidance, so the fix is a placement/exemption decision, not a content rewrite. Separately, five of `design-mcp-open-design/references/`'s nine files (`cli-child-pairing.md`, `freshness-invalidation.md`, `guarded-proxy.md` — worst at 234 lines, `inner-generator-binding.md`, `smart-router-pseudocode.md`) use unnumbered `## Heading` H2s instead of the required `## N. HEADING` form; the other four (`design-parity-transport.md`, `mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md`) are already conformant.

### Purpose

Close both modes' conformance gaps: fix the one real enum violation (`extraction-workflow.md`'s `importance_tier`), decide and execute relocate-out-of-`references/` versus a documented exemption for the four exemplar `DESIGN.md` files, and number/uppercase the five non-conformant `design-mcp-open-design` reference files' H2 headings. Sibling `003-design-motion`'s own conformance leaves are superseded by `010-motion-merge` — motion's content gets audited as part of `design-interface` after the merge, not separately here or there.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Fixing `extraction-workflow.md:10`'s `importance_tier` from `"high"` to an in-enum value (`important`, given the file's role in the extraction pipeline).
- Deciding relocate-vs-exempt for the four `examples/**/DESIGN.md` files: either move them out of `references/` (e.g. to an `examples/` sibling outside the frontmatter-checked tree, if the tooling distinguishes) or document a written exemption explaining why an output exemplar legitimately carries `contextType: reference` despite the enum, without touching their content.
- Numbering and upper-casing H2 headings in the 5 non-conformant `design-mcp-open-design/references/*.md` files: `cli-child-pairing.md`, `freshness-invalidation.md`, `guarded-proxy.md`, `inner-generator-binding.md`, `smart-router-pseudocode.md`.
- Stating, without re-doing, that sibling `003-design-motion`'s conformance leaves are superseded by `010-motion-merge`.

### Out of Scope

- Any content/guidance rewrite inside the four exemplar `DESIGN.md` files — they are measured output artifacts, not authored prose; only their placement or documented exemption changes.
- `design-md-generator`'s or `design-mcp-open-design`'s design judgment, extraction pipeline, or transport logic — structural/frontmatter conformance only.
- `003-design-motion`'s conformance work — fully superseded by `010-motion-merge`; not touched, not re-scoped here.
- The already-conformant 4 `design-mcp-open-design/references/*.md` files (`design-parity-transport.md`, `mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-md-generator/references/extraction-workflow.md` | Modify (frontmatter only) | `importance_tier: "high"` -> in-enum value |
| `design-md-generator/references/examples/vercel/DESIGN.md` | Relocate or document exemption | Off-enum `contextType: reference`; decision-dependent |
| `design-md-generator/references/examples/linear/DESIGN.md` | Relocate or document exemption | Off-enum `contextType: reference`; decision-dependent |
| `design-md-generator/references/examples/supabase/DESIGN.md` | Relocate or document exemption | Off-enum `contextType: reference`; decision-dependent |
| `design-md-generator/references/examples/stripe/DESIGN.md` | Relocate or document exemption | Off-enum `contextType: reference`; decision-dependent |
| `design-mcp-open-design/references/cli-child-pairing.md` | Modify | Number + uppercase H2 headings |
| `design-mcp-open-design/references/freshness-invalidation.md` | Modify | Number + uppercase H2 headings |
| `design-mcp-open-design/references/guarded-proxy.md` | Modify | Number + uppercase H2 headings (worst case, 234 lines) |
| `design-mcp-open-design/references/inner-generator-binding.md` | Modify | Number + uppercase H2 headings |
| `design-mcp-open-design/references/smart-router-pseudocode.md` | Modify | Number + uppercase H2 headings |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `extraction-workflow.md:10`'s `importance_tier` is an in-enum value | `rg -n "importance_tier" design-md-generator/references/extraction-workflow.md` shows `normal` or `important`, not `high` |
| REQ-002 | The four exemplar `DESIGN.md` files' `contextType` conformance is resolved by relocation or documented exemption, never by rewriting their content | Either the files no longer sit under a frontmatter-checked `references/` path, or a written exemption note exists explaining the legitimate off-enum use; content is byte-identical either way |
| REQ-003 | All 5 non-conformant `design-mcp-open-design` reference files use `## N. HEADING` form | `grep -c "^## [0-9]" ` for each of the 5 files matches its total H2 count |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The already-conformant 4 `design-mcp-open-design` reference files are left untouched | `git diff` shows no change to `design-parity-transport.md`, `mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md` |
| REQ-005 | `003-design-motion`'s supersession by `010-motion-merge` is explicitly stated, not silently dropped | Spec's Out of Scope section names this explicitly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `design-md-generator` carries no off-enum `importance_tier`, and the four exemplar `DESIGN.md` files' `contextType` situation is resolved and documented, not silently left inconsistent.
- **SC-002**: All 9 `design-mcp-open-design/references/*.md` files use numbered, upper-cased H2 headings.
- **SC-003**: This packet's scope boundary with `010-motion-merge` (for `003-design-motion`) is unambiguous to a future reader.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rewriting the exemplar `DESIGN.md` files' content instead of relocating/exempting them | Corrupts real extraction output that other tooling or documentation may reference verbatim | Treat content as immutable; only placement or a frontmatter exemption note changes |
| Risk | Renumbering H2s in `guarded-proxy.md` (234 lines, worst case) introduces a heading/content mismatch | Broken cross-references from other files that cite a specific heading | Diff each renumbered file against its pre-edit heading list before committing |
| Dependency | `010-motion-merge` for `003-design-motion`'s conformance | This packet must not duplicate that work | Explicit Out of Scope carve-out |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The four exemplar `DESIGN.md` files' content is never rewritten as part of resolving their `contextType` conformance — only their placement or a documented exemption changes.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **Relocating the exemplar files breaks a citation from elsewhere in `design-md-generator`** (e.g. `SKILL.md` or a procedure card pointing at `references/examples/...`): update the citation in the same commit; do not leave a dangling reference.
- **A sixth `design-mcp-open-design` reference file turns out unnumbered on closer inspection** (beyond the 5 named): treat as in-scope — the requirement is "all 9 files conformant," not "only these 5."
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- **Relocate vs. exempt for the four exemplar `DESIGN.md` files**: moving them out of `references/` avoids the enum check entirely but may break any tooling or documentation that expects them at their current path; a documented exemption is lower-risk but leaves a permanent enum carve-out in the checker's conscience. This is a placement/exemption tradeoff for the operator or executing agent to decide before Phase 2, not something this spec pre-resolves.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
- **Predecessor**: `../011-retirement-residue/`
- **Superseded sibling**: `../003-design-motion/` (conformance leaves superseded by `../010-motion-merge/`)
