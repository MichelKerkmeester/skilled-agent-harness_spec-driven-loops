---
title: "Implementation Summary"
description: "The catalog and skill package validators no longer report a committed symlink, a gitignored runtime file, a fixture tree, a hub's missing standalone sections or .ts and .txt files in scripts/ as defects."
trigger_phrases:
  - "validator false positives implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/014-skill-authoring-ux-research/010-validator-false-positives"
    last_updated_at: "2026-10-10T21:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase with every goal criterion passing"
    next_safe_action: "Start the next phase"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "summary-014-010-validator-false-positives"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 010-validator-false-positives |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The catalog and skill package validators no longer report a committed symlink, a gitignored runtime file, a fixture tree, a hub's missing standalone sections or .ts and .txt files in scripts/ as defects.

### Phase 10: validator-false-positives

In `validate_catalog_package.py`, the prose-path and SOURCE FILES checks consult one helper before reporting a missing path: a path that exists as a link or file without resolving it (os.path.lexists) is present, and a path `git check-ignore` matches is skipped; any git failure counts as not ignored. In `package_skill.py`, any directory whose name ends in fixture or fixtures is exempt from the kebab-case rule (so `runtime-fixture/` is covered), a hub gets no recommended-section warnings, `.ts` is a script extension, and `.txt` data files are accepted in scripts/.

Dropped under prevent-overengineering, with the feature-catalog track told: exempting output file names (DESIGN.md, research/research.md, handover.md) in root catalog rows, because no rule separates an output name from a missing leaf without a per-document allowlist, a second source of truth, and those findings are warnings; and allowlisting the `.opencode/specs` alias, because it names a path absent from the checkout and an allowlist would also hide a really broken path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py` | Modify | lexists and gitignore helper |
| `.skilled/skills/sk-doc/scripts/tests/test_validate_catalog_package.py` | Modify | Two cases |
| `.skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py` | Modify | Fixture, hub sections, script extensions |
| `.skilled/skills/sk-doc/scripts/tests/test_create_skill_contract.py` | Modify | Five cases |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator ran the validators in the feature-catalog worktree read-only to see the handed-off findings and weighed each one. Two DeepSeek V4.1 Flash max builds through cli-pi on the LLM gateway ran in parallel on disjoint files. The orchestrator ran every new test against the committed validators to see it fail, and widened the fixture rule back to a superset of the old one.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Check the unresolved path for presence | A tracked symlink is part of the tree even when its build target is absent |
| Skip gitignored paths | A deliberately ignored path can never be committed, so its absence says nothing about the document |
| Exempt hubs from recommended sections only | Required sections stay required; the three recommended ones belong to standalone skills and to a hub's modes |
| No version bump | The master bumps each hub once at merge, and the sk-create-skill packet already moved in this branch |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `test_validate_catalog_package.py` | exit 0; against the committed validator 2 FAILED |
| `pytest test_create_skill_contract.py` | 29 passed (baseline 24); against the committed validator 3 failed |
| `test_package_skill_regressions.py` with the contract tests | 51 passed |
| `test_validator_fixtures.py` | ALL PASS |
| package_skill --check on sk-git, Unexpected file type | 0 (was 2) |
| package_skill --check on sk-code, recommended section | 0 (was 3) |
| `validate.sh --strict` on this phase | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The root-row output names and the .opencode/specs alias stay as findings; the feature-catalog track can reword those documents.
2. A gitignored path is accepted even if a citation to it is stale.
<!-- /ANCHOR:limitations -->

---
