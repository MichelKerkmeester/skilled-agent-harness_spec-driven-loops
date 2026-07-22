---
title: "Feature Specification: Skill and Mode README Overhaul"
description: "Bring the bare and drifted skill READMEs to the current nine-section skill-readme-template in a marketing-reduced human voice: full rewrites for the eleven sk-doc modes, terse pitch-and-overview additions for the two sk-code surfaces, and an AT A GLANCE section for sk-git."
trigger_phrases:
  - "skill mode readme overhaul"
  - "bare readme rewrite"
  - "skill readme template migration"
importance_tier: "normal"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/021-documentation-quality-program/004-skill-mode-readme-overhaul"
    last_updated_at: "2026-07-22T12:54:04Z"
    last_updated_by: "claude"
    recent_action: "Shipped and validated all fourteen READMEs."
    next_safe_action: "Proceed to phase 005 (code READMEs)."
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-skill/README.md"
      - ".opencode/skills/sk-doc/create-readme/README.md"
      - ".opencode/skills/sk-git/README.md"
---

# Feature Specification: Skill and Mode README Overhaul

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

sk-doc owns the skill-readme-template, a nine-section narrative model in the same human voice the repo root README uses. Its own mode READMEs never migrated to it. The eleven `create-*` mode READMEs read as bare reference cards: most carry no frontmatter, no one-line pitch, no AT A GLANCE table, and a `WHAT'S INSIDE` inventory instead of a problem-first overview. The two sk-code surface READMEs (`code-opencode`, `code-webflow`) have frontmatter and an AT A GLANCE table but no pitch and no OVERVIEW. `sk-git/README.md` is otherwise rich and conformant but has no AT A GLANCE section as its opening. A reader opening any of these files gets a file inventory, not an orientation. The README audit confirmed the template is sound and the gap is an authoring backlog, not a template defect.

### Purpose

Rewrite the fourteen target READMEs to the current template so each one leads with the reader: a pitch, an AT A GLANCE table, a problem-first OVERVIEW, and the sections the skill actually earns. The eleven sk-doc modes get full nine-section rewrites at the mid-size tier the exemplars set. The two sk-code surfaces stay terse but gain a pitch and a real OVERVIEW. sk-git gets an AT A GLANCE section and a renumber, keeping its existing body.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Full rewrite of the eleven sk-doc mode READMEs (`create-agent`, `create-benchmark`, `create-changelog`, `create-command`, `create-diff`, `create-feature-catalog`, `create-flowchart`, `create-manual-testing-playbook`, `create-quality-control`, `create-readme`, `create-skill`) to the nine-section template, sourced from each mode's `SKILL.md` and real bundled files.
- Terse additions to the two sk-code surface READMEs (`code-opencode`, `code-webflow`): a blockquote pitch and a problem-first OVERVIEW, keeping them read-only surface docs, not workflow docs.
- A new AT A GLANCE section and a renumber for `sk-git/README.md`, keeping its existing content.
- The floor validator (`validate_document.py --type readme`) reports zero issues on every rewritten file.

### Out of Scope

- The thirty-four already-conformant skill READMEs. Churning good files is not in scope.
- The two structural-drift-only READMEs beyond sk-git that the audit flagged as optional. `system-spec-kit/README.md` keeps its grandfathered depth.
- The forty-one repo-wide Title-Case header offenders and the repo-wide HVR sweep, both deferred to the phase 008 optional-extension decision.
- Code and script READMEs (the per-folder `readme-code-template` work), which are phases 005 through 007.

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Sev | Requirement |
|----|-----|-------------|
| REQ-001 | P2 | Each of the eleven sk-doc mode READMEs carries five-field frontmatter, a one-line blockquote pitch, an AT A GLANCE table as section 1, and a problem-first numbered ALL-CAPS OVERVIEW. |
| REQ-002 | P2 | Each rewritten README sources its content from the mode's own `SKILL.md` and real bundled files, with every linked path resolving, and no spec-packet history pasted in. |
| REQ-003 | P2 | `code-opencode` and `code-webflow` gain a pitch and a problem-first OVERVIEW while staying terse surface docs (no QUICK START or FAQ inflation). |
| REQ-004 | P2 | `sk-git/README.md` gains an AT A GLANCE section as its first section with the rest renumbered, and its existing body is unchanged. |
| REQ-005 | P2 | `python3 .opencode/skills/sk-doc/scripts/validate_document.py <readme> --type readme` reports zero issues for every file in scope. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All fourteen target READMEs report VALID with zero issues under the floor validator.
- Each rewritten README opens with a pitch and an AT A GLANCE table, and its OVERVIEW states the problem before any feature list.
- The mid-size READMEs land near the exemplar tier (roughly 150 to 220 lines), and the two sk-code surfaces stay terse (roughly 45 to 70 lines).
- Spot HVR check on the rewritten files finds no em dashes, semicolons, or Oxford commas in the authored prose.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Voice drift toward inflation.** Mitigated by naming a concrete exemplar (`cli-claude-code/README.md`) and an explicit non-exemplar (`system-spec-kit/README.md`), and by keeping the two sk-code surfaces terse by rule.
- **Invented behavior.** Mitigated by requiring each author to source from the mode's own `SKILL.md` and verify every linked path resolves.
- **Depends on phase 003.** The floor validator path fix from phase 003 is what lets authors run the documented validator command as their gate.

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- The README is the human front door. `SKILL.md` stays the runtime instruction surface, and the two do not duplicate each other.
- The rewrites carry the explanation in prose. Tables appear only for genuine four-plus-item lookups.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- `create-benchmark` already had a 147-line README. It is restructured to the template rather than written from nothing, keeping any accurate content.
- The two sk-code surfaces mutate nothing, so their VERIFICATION and QUICK START sections are omitted rather than invented.
- sk-git already carries a valid frontmatter and pitch, so only the AT A GLANCE insert and renumber apply.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Whether to fold the thirty-four already-conformant READMEs into a light HVR pass is deferred to the phase 008 optional-extension decision.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` (this phase).
- `../spec.md` and `../context-index.md` (the 021 program parent).
- Previous phase: [`003-doc-tooling-and-template-fixes`](../003-doc-tooling-and-template-fixes/spec.md).

<!-- /ANCHOR:related-docs -->
