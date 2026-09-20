---
title: "Styles playbook + database-README canon alignment (phase parent)"
description: "Phase-parent packet: realign two off-canon styles-library documents. Child 001 rewrites the manual-testing playbook to the sk-doc create-manual-testing-playbook standard and relocates it out of docs/; child 002 expands styles/database/README.md to the spec-kit database-folder README style. Documentation-only."
trigger_phrases:
  - "styles playbook db-readme canon parent"
  - "manual-testing-playbook realign phase parent"
  - "styles database readme speckit alignment parent"
importance_tier: "standard"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/010-manual-testing-playbook-and-db-readme"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Decomposed into two Level-2 child phases (playbook realign+relocate; database README alignment)."
    next_safe_action: "Plan/execute child 001, then child 002; documentation-only, no runtime change."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
      - ".opencode/skills/sk-design/styles/database/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-playbook-db-readme-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->

# Styles playbook + database-README canon alignment

## 1. METADATA

- **Track:** sk-design
- **Packet:** 009-manual-testing-playbook-and-db-readme (phase parent)
- **Parent program:** `015-styles-database-evolution`
- **Sibling:** `008-styles-readme-create-readme-alignment` (the create-readme sweep; disjoint file set)

## 2. PROBLEM & PURPOSE

Two styles-library documents are off-canon. The manual-testing playbook does not follow the sk-doc
**create-manual-testing-playbook** standard and is mislocated under a generic `docs/` folder; and
`styles/database/README.md` is a 3-line stub that does not resemble the informative README shape the
spec-kit database folders use. This packet realigns both to their governing conventions. The two fixes are
independent — different source documents, different governing standards — so each is its own Level-2 child
phase, keeping scope and rollback separate.

## 3. SCOPE

- **In:** the two child phases below — the playbook realign+relocate, and the database README alignment.
- **Out:** the twelve create-readme READMEs (sibling `008`); any database schema, generation code, engine,
  or test logic; corpus/bundle data. Documentation-only across both children.

<!-- ANCHOR:phase-map -->
## 4. PHASE DOCUMENTATION MAP

| Phase | Child | Purpose | Gate | Status |
|---|---|---|---|---|
| 1 | `001-playbook-realign-and-relocate` | Rewrite the manual-testing playbook to create-manual-testing-playbook and move it out of `styles/docs/` to the standard's canonical location; update the inbound reference. | Playbook validates against the standard at its canonical path; inbound reference resolves. | Planned |
| 2 | `002-database-readme-speckit-alignment` | Expand `styles/database/README.md` to the spec-kit database-folder README shape (purpose, structure, tracked-vs-ignored, generation/use). | README matches the cited spec-kit exemplar; accurate to the real `database/` dir. | Planned |

<!-- /ANCHOR:phase-map -->

## 5. PHASE TRANSITION & HANDOFF

The two children are independent and may run in either order; neither gates the other. Both are
documentation-only, so blast radius is low and rollback is per-child. Resume follows
`graph-metadata.json.derived.last_active_child_id`; when unset, either child may start.

## 6. OPEN QUESTIONS

- Confirm the exact canonical playbook path from create-manual-testing-playbook (resolved in child 001 as `styles/manual-testing-playbook/`).
- After the move, `styles/docs/` still holds `README.md` documenting the playbook — resolve its fate in child 001 before removing `docs/`.

## 7. RELATED DOCUMENTS

- Sibling: `../008-styles-readme-create-readme-alignment/`.
- Standard: `.opencode/skills/sk-doc/create-manual-testing-playbook/`.
- Phase children: `001-playbook-realign-and-relocate/`, `002-database-readme-speckit-alignment/`.
