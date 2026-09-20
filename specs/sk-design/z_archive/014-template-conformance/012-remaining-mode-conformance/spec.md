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
    last_updated_at: "2026-07-27T18:03:42Z"
    last_updated_by: "conformance-executor"
    recent_action: "Executed and verified all fixes across both packets, 20 files"
    next_safe_action: "Packet complete, no further action required"
    blockers: []
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
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Relocate vs. exempt for the four exemplar DESIGN.md files: documented exemption (see references/examples/README.md)"
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
| **Status** | Complete — all in-scope fixes landed, verified, gate green |
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
- **Exhaustive sweep addendum (found during execution, same conformance class, kept in-scope per this spec's own edge case "a sixth file turns out unnumbered... treat as in-scope"):** the same two off-enum bugs (`importance_tier: "high"`, `contextType: reference`) and the same missing-`OVERVIEW` structural defect recur beyond the files named above. All instances were fixed under the identical rule already governing REQ-001/REQ-002/REQ-003:
  - `design-md-generator/assets/cardinal-rules-card.md` — second `importance_tier: "high"` instance.
  - `design-md-generator/references/guided-run.md` — `contextType: reference` (off-enum) plus missing `## 1. OVERVIEW`.
  - `design-md-generator/references/authoring-boundary.md` — missing `## 1. OVERVIEW` (renumbered 1-7 -> 2-8).
  - `design-md-generator/assets/source-of-truth-router-card.md` — missing `## 1. OVERVIEW` (renumbered 1-5 -> 2-6).
  - `design-md-generator/references/writing-style-guide.md` — intro paragraph exceeded the 1-2 sentence limit; second paragraph moved into `## 1. OVERVIEW`.
  - `design-md-generator/references/design-md-format.md` — sections 3-15 used literal backtick-quoted output heading text instead of an ALL-CAPS title (fixed by adding an ALL-CAPS title with the literal quoted inline); trailing `## Section presence` renumbered to `## 16. SECTION PRESENCE`. The file's `## 0.`-based numbering and absent `OVERVIEW` section were NOT restructured — see Key Decisions in `implementation-summary.md` for the cross-reference blast-radius rationale.
  - `design-md-generator/references/examples/{linear,stripe,supabase,vercel}/writing-notes.md` (4 files) and `references/examples/editorial-exemplar.md` — same off-enum `contextType: reference` as the 4 `DESIGN.md` files. The 4 `writing-notes.md` files are exempted alongside their paired `DESIGN.md` (companion editorial notes on the same exemplar, same rationale). `editorial-exemplar.md` is genuine agent guidance, not an output mockup, so it was brought fully into conformance (added `## 1. OVERVIEW`, renumbered 1-4 -> 2-5) rather than exempted.
  - `design-md-generator/references/examples/README.md` (new file) — records the relocate-vs-exempt decision for the 4 `DESIGN.md` + 4 `writing-notes.md` files per REQ-002.
  - `design-md-generator/manual-testing-playbook/authoring-boundary/authoring-boundary.md` and `.../source-of-truth/source-of-truth-card.md` — stray `contextType: reference` field not part of the manual-testing-playbook scenario template (`title`/`description`/`version` only); removed.
  - `design-mcp-open-design/references/design-parity-transport.md` — a 6th `design-mcp-open-design` reference file, not in the originally-named 5, found missing `## 1. OVERVIEW` during the exhaustive sweep; renumbered 1-5 -> 2-6 and trailing `## RELATED` -> `## 7. RELATED RESOURCES`.

### Out of Scope

- Any content/guidance rewrite inside the four exemplar `DESIGN.md` files or their `writing-notes.md` companions — they are measured output artifacts and editorial annotations, not authored prose; only their frontmatter `contextType` and a documented exemption changed.
- `design-md-generator`'s or `design-mcp-open-design`'s design judgment, extraction pipeline, or transport logic — structural/frontmatter conformance only.
- `003-design-motion`'s conformance work — fully superseded by `010-motion-merge`; not touched, not re-scoped here.
- The already-conformant `design-mcp-open-design/references/*.md` files (`mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md`).
- Renaming `INSTALL-GUIDE.md` or the exemplar `DESIGN.md` files to satisfy `package_skill.py --check --strict`'s kebab-case filename rule — both filenames are mandated by their own governing conventions (the install-guide convention repo-wide; `DESIGN.md` must match the literal output filename it demonstrates). This is a pre-existing gap in the shared, not-packet-owned checker script (it exempts `README.md`/`SKILL.md` but not these), predating this packet.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-md-generator/references/extraction-workflow.md` | Modify (frontmatter only) | `importance_tier: "high"` -> `important` |
| `design-md-generator/assets/cardinal-rules-card.md` | Modify (frontmatter only) | `importance_tier: "high"` -> `important` |
| `design-md-generator/references/guided-run.md` | Modify | `contextType: reference` -> `implementation`; added `## 1. OVERVIEW`, renumbered |
| `design-md-generator/references/authoring-boundary.md` | Modify | Added `## 1. OVERVIEW`, renumbered 1-7 -> 2-8 |
| `design-md-generator/assets/source-of-truth-router-card.md` | Modify | Added `## 1. OVERVIEW`, renumbered 1-5 -> 2-6 |
| `design-md-generator/references/writing-style-guide.md` | Modify | Intro trimmed to 1-2 sentences; moved paragraph into OVERVIEW |
| `design-md-generator/references/design-md-format.md` | Modify | Sections 3-15 ALL-CAPS titled (literal quote kept inline); `## Section presence` -> `## 16. SECTION PRESENCE` |
| `design-md-generator/references/examples/vercel/DESIGN.md` | Documented exemption | Off-enum `contextType: reference` -> `general` |
| `design-md-generator/references/examples/linear/DESIGN.md` | Documented exemption | Off-enum `contextType: reference` -> `general` |
| `design-md-generator/references/examples/supabase/DESIGN.md` | Documented exemption | Off-enum `contextType: reference` -> `general` |
| `design-md-generator/references/examples/stripe/DESIGN.md` | Documented exemption | Off-enum `contextType: reference` -> `general` |
| `design-md-generator/references/examples/{vercel,linear,supabase,stripe}/writing-notes.md` | Documented exemption | Off-enum `contextType: reference` -> `general` |
| `design-md-generator/references/examples/editorial-exemplar.md` | Modify (conformant, not exempt) | `contextType` fixed; added `## 1. OVERVIEW`, renumbered 1-4 -> 2-5 |
| `design-md-generator/references/examples/README.md` | New file | Records the relocate-vs-exempt decision |
| `design-md-generator/manual-testing-playbook/authoring-boundary/authoring-boundary.md` | Modify | Removed stray `contextType` field |
| `design-md-generator/manual-testing-playbook/source-of-truth/source-of-truth-card.md` | Modify | Removed stray `contextType` field |
| `design-mcp-open-design/references/cli-child-pairing.md` | Modify | Number + uppercase H2 headings, added `## 1. OVERVIEW` |
| `design-mcp-open-design/references/freshness-invalidation.md` | Modify | Number + uppercase H2 headings, added `## 1. OVERVIEW` |
| `design-mcp-open-design/references/guarded-proxy.md` | Modify | Number + uppercase H2 headings (worst case, 234 lines), added `## 1. OVERVIEW` |
| `design-mcp-open-design/references/inner-generator-binding.md` | Modify | Number + uppercase H2 headings, added `## 1. OVERVIEW` |
| `design-mcp-open-design/references/smart-router-pseudocode.md` | Modify | Number + uppercase H2 headings, added `## 1. OVERVIEW` |
| `design-mcp-open-design/references/design-parity-transport.md` | Modify | 6th file found via sweep; added `## 1. OVERVIEW`, renumbered |
| `sk-design/leaf-manifest.json` | Regenerated | New `references/examples/README.md` leaf added |
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

- **RESOLVED — Relocate vs. exempt for the four exemplar `DESIGN.md` files (+ their 4 `writing-notes.md` companions)**: a citing-site check (`rg -n "examples/(vercel|linear|supabase|stripe)/(DESIGN|writing-notes)\.md"`) found the files referenced from `SKILL.md`, the feature-catalog, and 3 manual-testing-playbook scenarios by path, with no fragment/section-number anchors. Relocating would require updating every one of those citations for zero functional gain, since the underlying issue (a universal, content-independent frontmatter schema field) is fully resolved by fixing the field value. Decision: **documented exemption**, recorded in the new `references/examples/README.md`. Body structure stays untouched (the files ARE the DESIGN.md format being demonstrated); only the `contextType` field value changed to the in-enum `general`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
- **Predecessor**: `../011-retirement-residue/`
- **Superseded sibling**: `../003-design-motion/` (conformance leaves superseded by `../010-motion-merge/`)
