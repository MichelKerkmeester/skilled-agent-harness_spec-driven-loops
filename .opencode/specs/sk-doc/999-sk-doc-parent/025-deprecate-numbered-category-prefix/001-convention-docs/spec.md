---
title: "Spec: drop the NN-- category-name mandate from the sk-doc convention"
description: "Phase 001 of the numbered-prefix deprecation. Update the two authoritative sk-doc convention skills (create-feature-catalog, create-manual-testing-playbook), their asset templates, and the /create:* command generators so the documented canonical category-folder name is the bare descriptive slug, not NN--slug. Ordering is documented as owned by the root index table. Docs-only phase — no folders are renamed here; it removes the mandate that would otherwise re-introduce numbers."
trigger_phrases:
  - "drop NN category mandate"
  - "de-number sk-doc convention"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/999-sk-doc-parent/025-deprecate-numbered-category-prefix/001-convention-docs"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Implement the doc edits"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Drop the NN-- Category-Name Mandate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 025/001-convention-docs |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 001 of 005 (foundation) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The sk-doc convention is the *source* of the numbered prefix: `create-feature-catalog/SKILL.md` and
`create-manual-testing-playbook/SKILL.md` mandate `NN--category-name` folders, and their templates plus the
`/create:*` command generators emit that shape. Deprecating the prefix in the tree (Phase 004) without first
removing the mandate would leave the docs instructing authors to re-introduce it. This phase makes the bare
descriptive slug the sole canonical form in the convention and documents that **display order is owned by the
root index table**, not the folder name.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope — edit the authoritative convention + its generators:**
- `.opencode/skills/sk-doc/create-feature-catalog/SKILL.md` — the sections mandating `NN--category-name`
  (approx. the folder-naming rule, the worked example, and the index-ordering note).
- `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` — the equivalent naming + example sections.
- Asset templates under `sk-doc/` that scaffold a numbered folder (catalog/playbook template snippets,
  frontmatter templates that show `category: NN--…`).
- The `/create:feature-catalog` and `/create:manual-testing-playbook` command definitions (command YAML/docs)
  that generate new folders — emit the bare slug and document index-owned ordering.

**Out of scope:** renaming existing folders (Phase 004); the validator/guard (Phase 002); any non-sk-doc skill.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** Neither convention SKILL.md instructs authors to prefix category folders with `NN--`; the documented
  form is the bare descriptive slug.
- **R2:** Every worked example / template snippet in those skills shows the de-numbered form.
- **R3:** Ordering guidance explicitly states the root index table (`feature_catalog.md` /
  `manual_testing_playbook.md`) is the ordering authority.
- **R4:** The `/create:*` generators produce de-numbered folders and index rows.
- **R5:** No behavioral claim in the docs contradicts the Phase 002 guard (which rejects new numbered folders).
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. Grep of the two convention skills + their templates + the `/create:*` generators shows zero surviving
   `NN--category` mandates or numbered examples (excluding historical/changelog text).
2. `validate.sh --strict` on this phase folder is Errors 0.
3. The convention text is internally consistent with `decision-record.md` ADR-006.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Risk:* a template edited here is also consumed by the Phase 003 migration script as the "target shape"
  reference → keep the edits purely descriptive-slug so the script and docs agree.
- *Dependency:* none blocking; can run in parallel with Phase 002.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None.
<!-- /ANCHOR:questions -->
