---
title: "Checklist: make the Lane C playbook loader number-agnostic + add a no-new-numbered-snippet guard"
description: "Verification checklist for the content-gate loader change, the oracle re-base, the optional `stage:` field, and the no-new-numbered-snippet regression guard."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/001-loader-and-guard"
    last_updated_at: "2026-07-11T17:41:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Loader content-gate + no-new-numbered guard shipped"
    next_safe_action: "Complete"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Checklist: Make the Lane C Playbook Loader Number-Agnostic + Add a No-New-Numbered-Snippet Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol
Every item carries a fixture result, test-run, or grep evidence line.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [x] Confirmed the `^\d{3}-.*\.md$` gate at `load-playbook-scenarios.cjs:302` and the oracle's identical
  test at `code-opencode-playbook-ids.vitest.ts:28` are the only two sites re-implementing the filename
  ordinal rule.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [x] Loader and oracle changed onto the same content-gate condition — `load-playbook-scenarios.cjs` and
  `code-opencode-playbook-ids.vitest.ts` share one predicate (no drift between the two).
- [x] No ephemeral spec/ADR/phase ids embedded in code comments (`grep` of the changed files clean); comments
  keep the durable WHY.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [x] De-numbered scenario file → loaded by `loadYamlFrontmatterScenarios()`.
- [x] Numbered `NNN-slug.md` scenario file → still loaded.
- [x] Root `manual_testing_playbook.md` / `feature_catalog.md` index file → NOT loaded as a scenario.
- [x] Non-scenario `.md` file with no parseable frontmatter in a category subfolder → NOT loaded by
  `loadYamlFrontmatterScenarios()` (negative case).
- [x] Scenario with `stage: holdout` (or `negative`) → surfaces that value; scenario with no `stage:` field →
  surfaces `routing`.
- [x] `countFeatureFiles()` oracle count agrees with the loader's parsed count on the live `code-opencode`
  playbook tree.
- [x] New numbered snippet file → `check_no_numbered_snippet_files.py` FAILS (`exit 1`); de-numbered file →
  guard PASSES (`exit 0`).
- [x] Existing skill-benchmark vitest suite passes (no regression).
- [x] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [x] Loader, vitest oracle, and the new guard script + its fixtures all updated — no surface missed.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [x] Change only widens what the loader accepts (`isFile` + frontmatter content-gate) and adds a fail-closed
  guard; no gate, allowlist, or execution-path behavior weakened.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [x] No documentation changes required in this phase (convention docs live in Phase 002); `grep` confirms none
  of this phase's code comments reference a stale filename-ordinal rule.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [x] Edits confined to `load-playbook-scenarios.cjs`, `code-opencode-playbook-ids.vitest.ts`, and the new
  guard script + its fixtures.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary
The Lane C loader tolerates numbered + de-numbered snippet filenames and excludes the root index; the
optional `stage:` field parses with a `routing` default; the vitest oracle agrees with the loader; the
no-new-numbered-snippet guard rejects new numbered files; existing suite green; validate --strict Errors 0.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off
Loader is number-agnostic and internally consistent with decision-record ADR-002 (tolerate-then-rename
sequencing), ADR-003 (content-gate selection), ADR-004 (explicit `stage:` grouping), and ADR-005 (no-new-
numbered-snippet guard).
<!-- /ANCHOR:sign-off -->
