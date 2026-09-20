---
title: "Plan: README for Every Folder in the sk-design Styles Library"
description: "Plan for authoring a README.md in every non-data folder of the restructured styles library, sourced from a live listing of each folder, preserving existing READMEs and treating library/bundles as data."
trigger_phrases:
  - "styles folder readmes plan"
  - "sk-design styles documentation plan"
  - "readme sweep styles library plan"
importance_tier: "standard"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/012-sk-design-program/002-style-database/008-styles-folder-readmes"
    last_updated_at: "2026-07-22T16:57:27Z"

    last_updated_by: "orchestrator"
    recent_action: "Authored READMEs per this plan."
    next_safe_action: "Validate + commit."
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/styles/lib/engine/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-015-007-styles-readmes-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: README for Every Folder in the sk-design Styles Library

<!-- ANCHOR:summary -->
## 1. SUMMARY

Discover the full folder tree under `styles/` (excluding bundle data + node_modules), then author a
`README.md` in each folder that lacks one, sourced from a live `ls` so every named file is real. Pure
documentation; no code or data changes.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- 0 non-data folders missing a README after the sweep.
- The 4 pre-existing READMEs are byte-unchanged.
- Only `README.md` files added; no `.mjs`/`.json`/data files staged.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The tree splits into code (`lib/` = `engine` + `database` + `paths.mjs`), data (`library/` = `bundles` +
`manifests`), tests (`tests/` = `engine` + `database` + `oracle/golden`), tooling (`scripts/`), mutable
output (`database/`), and docs (`docs/`). Each README explains its folder's role in that split.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **Discover** — recursive folder listing; identify which already have a README.
2. **Author** — write a README in each remaining folder from a live per-folder listing.
3. **Verify** — recursive scan confirms 0 missing; commit.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No code, so no unit tests. Verification is a recursive `find` for `README.md` presence (expect 0 missing)
plus a spot-check that each README's named key files exist on disk.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The `005-library-restructure` established the folder layout these READMEs document.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Docs-only, additive, single commit. Rollback is `git revert`; no runtime, code, or data is touched.
<!-- /ANCHOR:rollback -->
