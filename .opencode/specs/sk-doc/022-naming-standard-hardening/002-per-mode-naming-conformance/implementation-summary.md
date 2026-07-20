---
title: "Implementation Summary: Per-Mode Naming Conformance"
description: "Implemented one shared authored-name kebab checker, wired every generating mode to a conformance step, scoped legacy-sensitive catalog guards to new content, and reconciled remaining mode documentation to the filesystem-naming canon."
trigger_phrases:
  - "per-mode conformance summary"
  - "implemented phase 002"
  - "kebab conformance implemented"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/002-per-mode-naming-conformance"
    last_updated_at: "2026-07-20T12:28:09Z"
    last_updated_by: "codex"
    recent_action: "Implemented per-mode kebab checks and captured focused verification"
    next_safe_action: "Operator can run central metadata generation and packet validation"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-per-mode-naming-conformance |
| **Status** | Implemented |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

One shared checker now validates an authored artifact basename or slug against `^[a-z0-9]+(?:-[a-z0-9]+)*$`. It delegates exemption decisions to `check_no_new_snake_case.py`, so Python files and package directories, tool-mandated names, generated and vendored trees, test-runner magic, lockfiles, and frozen history use the same boundary as the repository guard.

The six prose-only generating modes invoke the shared checker in their documented workflows. Catalog and playbook creation invoke the existing content guard only against an isolated new-content staging root. create-quality-control cites the filesystem-naming canon and reports filename case as a non-scored signal without changing DQI components. The benchmark guide and skill asset counter-example now match the on-disk and canonical naming rules.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `shared/scripts/check_authored_name_kebab.py` | Added | Shared authored basename/slug validation with reused exemptions |
| `scripts/tests/test_authored_name_kebab.py` | Added | Kebab pass, underscore failure, and exemption tests |
| `create-{agent,readme,command,changelog,flowchart,benchmark}/SKILL.md` | Updated | Reachable authored-name conformance step |
| `create-{feature-catalog,manual-testing-playbook}/SKILL.md` | Updated | New-content-only catalog/playbook guard step |
| `create-quality-control/{README.md,SKILL.md}` | Updated | Canon pointer and non-scored filename-case signal |
| `create-benchmark/references/model-benchmark/model-benchmark-fixture-guide.md` | Updated | Kebab directory reality and identifier exemption citation |
| `create-skill/assets/skill/skill-asset-template.md` | Updated | Correct underscore counter-example |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Updated | Implemented state and verification evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Phase A added and tested the shared checker, then documented its invocation in all six prose-only modes. Phase B scoped the legacy-sensitive content guard to isolated new content and reconciled quality-control, benchmark, and template documentation. Phase C ran focused Python, guard-regression, grep, on-disk, and Markdown validation checks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use one shared authored-name checker instead of bespoke per-mode checks | Keeps the enforcement surface small and consistent across the generating modes |
| Scope the catalog/playbook guard to new content only | The shipped underscore roots on disk would otherwise hard-error the guard |
| Keep filename case outside the DQI score | Adds visible conformance evidence without changing scorer components |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `python3 -m pytest -q .opencode/skills/sk-doc/scripts/tests/test_authored_name_kebab.py` | PASS: `3 passed in 2.73s` |
| Shared checker on `deliberate_snake_name.md` / `deliberate-kebab-name.md` | PASS: snake_case exit `1`; kebab exit `0` |
| `PYTHONPYCACHEPREFIX=/private/tmp/skdoc-pycache python3 -m py_compile ...` | PASS: checker and test compile |
| Scoped `check_no_hyphenated_catalog_content.py <new-content-staging-root>` | PASS: exit `0`; new canonical content accepted |
| `test_category_classification_denumbered.py` | PASS: `ALL PASS`; canonical content accepted and underscore content rejected |
| Whole-tree catalog guard baseline | Expected exit `2` on shipped `system-spec-kit/manual_testing_playbook`; proves staging scope is required |
| Grep for shared-checker workflow reachability | PASS: all six prose-only mode `SKILL.md` files reference the checker |
| Grep for create-quality-control canon pointer | PASS: README and SKILL point to `filesystem-naming-convention.md`; no `core-standards.md` pointer remains |
| Grep for a snake_case filename rule in touched mode docs | PASS: no matching rule found |
| On-disk benchmark directory + guide lines 67-70 | PASS: `model-benchmark/` exists and guide states kebab-case; §6 identifier citation present |
| `validate_document.py` on 16 changed mode and phase docs | PASS: all 16 exit `0` |
| `validate.sh --strict` on this phase | Not run by operator instruction; central orchestrator owns packet validation |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. Shipped underscore catalog/playbook roots still make a repository-wide content-guard scan exit `2`. The mode workflows isolate new content; root migration remains a separate follow-up.
2. Central `validate.sh`, description generation, and graph-metadata backfill were intentionally not run in this handoff because the operator reserved them for the orchestrator.
<!-- /ANCHOR:limitations -->
