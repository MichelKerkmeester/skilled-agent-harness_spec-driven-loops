---
title: "Feature Specification: Reference and Asset Template Alignment"
description: "Conform the three flagged create-skill reference and asset files to the sk-doc reference/asset standard: numbered ALL-CAPS H2 headers, frontmatter, and the section model. The asset file also gains an OVERVIEW so it passes the blocking validator."
trigger_phrases:
  - "reference asset template alignment"
  - "all caps header conformance"
  - "parent-skill smart routing template fix"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/002-reference-asset-template-alignment"
    last_updated_at: "2026-07-22T12:29:01Z"
    last_updated_by: "claude"
    recent_action: "Renamed 15 headers to ALL-CAPS and restructured the asset file; all three now VALID."
    next_safe_action: "Proceed to phase 003 (doc-tooling fixes)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/references/parent-skill/compiled-routing-architecture.md"
      - ".opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md"
      - ".opencode/skills/sk-doc/create-skill/assets/parent-skill/parent-skill-smart-routing-template.md"
---

# Feature Specification: Reference and Asset Template Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-22 |
| **Branch** | `sk-doc/0097-documentation-quality` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

sk-doc's reference/asset standard requires numbered ALL-CAPS H2 headers (`## 1. OVERVIEW`), a five-field frontmatter block, and a fixed section model. Three files under `create-skill` violated it: `compiled-routing-architecture.md` and `parent-skills-nested-packets.md` used Title-Case headers, and `parent-skill-smart-routing-template.md` had no frontmatter, an em dash in its H1, non-numbered headers, and no OVERVIEW section (the only one of the three that failed the blocking validator). The blocking validator could not catch the header casing because `h2UppercaseRequired` is `false` for the reference and asset types, so the drift only showed in the advisory DQI score.

### Purpose

Bring the three files into conformance so they match the standard the template audit extracted, and so the asset file passes the blocking validator.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Rename the 7 Title-Case H2 headers in `compiled-routing-architecture.md` to ALL-CAPS.
- Rename the 8 Title-Case H2 headers in `parent-skills-nested-packets.md` to ALL-CAPS.
- Restructure `parent-skill-smart-routing-template.md`: add frontmatter, fix the H1, add `## 1. OVERVIEW`, wrap the routing block under `## 2. INTENT SIGNALS AND RESOURCE MAP`, renumber the last header, add `## 4. RELATED RESOURCES`, and remove its em dashes and semicolons.

### Out of Scope

- The `h2UppercaseRequired: true` config flip in `template-rules.json`. Flipping it now would immediately fail the 41 repo-wide Title-Case offenders the audit found, so it belongs with that scope decision, not this three-file fix.
- The deep HVR prose pass (em dash and semicolon removal) on the two reference files. The audit scoped it as a separate, larger pass.
- The 41 additional Title-Case offenders elsewhere in the fleet.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | Every H2 in the two reference files is numbered ALL-CAPS. |
| REQ-002 | P2 | The asset file carries the five-field frontmatter and a numbered ALL-CAPS section model with an OVERVIEW. |
| REQ-003 | P2 | The asset file's H1 uses a hyphen subtitle, not an em dash, and its body has no em dashes or semicolons. |
| REQ-004 | P2 | All three files report VALID with zero issues under `validate_document.py`. |
| REQ-005 | P2 | The two reference files keep their existing (already-valid) frontmatter and content unchanged apart from header casing. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <file> --type reference|asset` reports VALID, 0 issues, for all three.
- The asset file, previously INVALID (`missing_required_section: overview`), now passes.
- Header casing across all three is numbered ALL-CAPS.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Header-rename over-reach.** Mitigated by exact old-to-new string replacement for each of the 15 headers, verified by a follow-up grep.
- **Asset restructure changing intent.** Mitigated by preserving the code block and the read-instructions content verbatim, changing only structure and HVR.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- The reference-file content (guidance, tables, code blocks) is unchanged apart from header casing.
- The asset file stays a copy-paste scaffold: placeholders, the Python block, and the routing rules are preserved.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- The header `## 6. THE BOUNDARY: \`ready\` MINTS A MANIFEST...` keeps the `ready` inline code span lowercase (a literal token) while the prose is capitalized.
- The asset file's Python code block is fenced, so its `INTENT_SIGNALS`/`RESOURCE_MAP` content is not parsed as headers.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether to flip `h2UppercaseRequired: true` (and fix or accept the 41 offenders) is deferred to the program's optional-extension decision at phase 008.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`001-json-cleanup-and-conventions`](../001-json-cleanup-and-conventions/spec.md). Next phase: [`003-doc-tooling-and-template-fixes`](../003-doc-tooling-and-template-fixes/spec.md).

<!-- /ANCHOR:related-docs -->
