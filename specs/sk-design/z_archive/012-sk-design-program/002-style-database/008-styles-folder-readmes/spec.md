---
title: "Spec: README for Every Folder in the sk-design Styles Library"
description: "Give every non-data folder under .opencode/skills/sk-design/styles a README.md stating its purpose, key files, and architecture fit — completing the restructured tree's documentation. Preserves existing READMEs; treats library/bundles as data (one top-level README, not per-bundle)."
trigger_phrases:
  - "styles folder readmes"
  - "sk-design styles library documentation"
  - "readme every styles folder lib engine tests"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/008-styles-folder-readmes"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Authored a README for every non-data styles folder."
    next_safe_action: "Validate + commit."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/README.md"
      - ".opencode/skills/sk-design/styles/tests/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-007-styles-readmes-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: README for Every Folder in the sk-design Styles Library

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-styles-folder-readmes |
| **Level** | 1 |
| **Status** | Complete |
| **Verification** | Every non-data styles folder has a README.md; existing READMEs preserved; no bundle data touched |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the `005-library-restructure`, the styles library is a clean named tree (`lib/`, `library/`,
`tests/`, `scripts/`, `database/`, `docs/`) but most folders had no README, so a reader could not tell
what each folder is for. This packet gives every non-data folder a README.md stating its purpose, key
files, and how it fits the styles architecture.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** a `README.md` in every folder under `.opencode/skills/sk-design/styles/` — `docs/`, `lib/`,
`lib/engine/`, `library/`, `library/bundles/`, `library/manifests/`, `tests/`, `tests/database/`,
`tests/engine/`, `tests/oracle/`, `tests/oracle/golden/`.

**Out of scope:** the 1,290 per-bundle folders (data — covered by one `library/bundles/README.md`, not
per-bundle); folders that already had a README (`styles`, `database`, `scripts`, `lib/database` —
preserved unchanged); any code or data content.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001** — Every non-data folder in the tree has a `README.md` covering purpose + key files + architecture fit.
- **REQ-002** — Existing READMEs are preserved unchanged; no bundle data file is modified.
- **REQ-003** — `library/bundles/` gets exactly one README explaining it is regenerated data, not per-bundle docs.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- A recursive scan finds a `README.md` in every non-data folder (0 missing).
- The 4 pre-existing READMEs are byte-unchanged.
- Each README names real key files that exist on disk.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|-----------|
| Describing files that do not exist | READMEs authored from a live `ls` of each folder |
| Per-bundle README explosion (1,290 folders) | One `library/bundles/README.md`; bundles treated as data |
| Overwriting a curated existing README | Only wrote into folders lacking one; existing four untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->
