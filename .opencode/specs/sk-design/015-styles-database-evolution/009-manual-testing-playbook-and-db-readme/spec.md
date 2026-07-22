---
title: "Spec: Realign the Styles Manual-Testing Playbook + Database README to Canon"
description: "Bring the styles manual-testing playbook into conformance with the sk-doc create-manual-testing-playbook standard and move it out of docs/ into its canonical location; and expand styles/database/README.md to match the README style used by the spec-kit database folders. Documentation-only; no runtime, schema, or data change."
trigger_phrases:
  - "styles manual testing playbook realign"
  - "create-manual-testing-playbook conformance styles"
  - "styles database readme speckit alignment"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/015-styles-database-evolution/009-manual-testing-playbook-and-db-readme"
    last_updated_at: "2026-07-22T11:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Scaffolded spec-only folder capturing the playbook-realign + db-readme-alignment request."
    next_safe_action: "Plan (add plan.md/tasks.md), then execute."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/docs/manual-testing-playbook.md"
      - ".opencode/skills/sk-design/styles/database/README.md"
      - ".opencode/skills/sk-doc/create-manual-testing-playbook/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-009-playbook-db-readme-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: Realign the Styles Manual-Testing Playbook + Database README to Canon

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-manual-testing-playbook-and-db-readme |
| **Level** | 1 |
| **Status** | Planned |
| **Verification** | The playbook conforms to create-manual-testing-playbook at its canonical (non-`docs/`) location; `styles/database/README.md` matches the spec-kit database-folder README shape; documentation-only diff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Two styles-library documents are off-canon. `styles/docs/manual-testing-playbook.md` (≈49 lines) does not
follow the sk-doc **create-manual-testing-playbook** standard and is mislocated under a generic `docs/`
folder rather than the playbook's own canonical location. And `styles/database/README.md` is a 3-line stub
that does not resemble the informative README shape the spec-kit database folders use. This packet realigns
both to their governing conventions.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Rewrite the styles manual-testing playbook to the **create-manual-testing-playbook** template and move it
  out of `styles/docs/` to the standard's canonical location (resolve the exact path via the standard at
  planning time). Remove the now-empty `docs/` folder if nothing else lives there.
- Expand `styles/database/README.md` to align with the README style found in the spec-kit database folders
  (structure, purpose, what is git-ignored vs tracked, how it is generated/used).

**Out of scope:** the twelve create-readme READMEs (owned by sibling packet `008`); any database schema,
generation code, engine, or test logic; the corpus/bundle data.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — The playbook conforms to the sk-doc create-manual-testing-playbook template and workflow.
- **REQ-002** — The playbook lives at the standard's canonical location, not under `styles/docs/`; references to its old path are updated.
- **REQ-003** — Real, executable manual-test steps are preserved or improved (no fabricated procedures).
- **REQ-004** — `styles/database/README.md` matches the spec-kit database-folder README conventions and accurately describes the git-ignored database dir.
- **REQ-005** — Documentation-only: no runtime, schema, generation, or data change.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The playbook passes create-manual-testing-playbook validation at its canonical path.
- `styles/database/README.md` reads like — and covers the same concerns as — the spec-kit database READMEs.
- No `styles/docs/manual-testing-playbook.md` remains; inbound references updated.
- `git diff` is documentation-only (playbook move/rewrite + one README).
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Moving the playbook breaks inbound links | Grep for references before the move; update them in the same change |
| Canonical playbook location ambiguous | Resolve the exact target path from create-manual-testing-playbook at planning time |
| DB README drifts from real on-disk behavior | Author from the live `database/` dir + the spec-kit database README as the shape reference |
| Deleting `docs/` removes a needed file | Only remove `docs/` if it is empty after the move |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What is the canonical target path for the playbook under the create-manual-testing-playbook standard (own folder vs `tests/`)? Resolve at planning.
- Which spec-kit database README is the reference exemplar for `styles/database/README.md`? Resolve at planning.
<!-- /ANCHOR:questions -->
