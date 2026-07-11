---
title: "Checklist: make the Lane C playbook loader number-agnostic + add a no-new-numbered-snippet guard"
description: "Verification checklist for the content-gate loader change, the oracle re-base, the optional `stage:` field, and the no-new-numbered-snippet regression guard."
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/026-deprecate-numbered-snippet-filenames/001-loader-and-guard"
    last_updated_at: "2026-07-11T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase checklist authored"
    next_safe_action: "Implement the loader content-gate change"
    blockers: []
    completion_pct: 0
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
- [ ] Confirmed the `^\d{3}-.*\.md$` gate at `load-playbook-scenarios.cjs:302` and the oracle's identical
  test at `code-opencode-playbook-ids.vitest.ts:28` are the only two sites re-implementing the filename
  ordinal rule.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality
- [ ] Loader and oracle changed onto the same content-gate condition (no drift between the two).
- [ ] No ephemeral spec/ADR/phase ids embedded in code comments; comments keep the durable WHY.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] De-numbered scenario file → loaded by `loadYamlFrontmatterScenarios()`.
- [ ] Numbered `NNN-slug.md` scenario file → still loaded.
- [ ] Root `manual_testing_playbook.md` / `feature_catalog.md` index file → NOT loaded as a scenario.
- [ ] Non-scenario `.md` file with no parseable frontmatter in a category subfolder → NOT loaded (negative
  case).
- [ ] Scenario with `stage: holdout` (or `negative`) → surfaces that value; scenario with no `stage:` field →
  surfaces `routing`.
- [ ] `countFeatureFiles()` oracle count agrees with the loader's parsed count on the live `code-opencode`
  playbook tree.
- [ ] New numbered snippet file → no-new-numbered-snippet guard FAILS; de-numbered file → guard PASSES.
- [ ] Existing skill-benchmark vitest suite passes (no regression).
- [ ] `validate.sh --strict` Errors 0 on this phase folder.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
- [ ] Loader, vitest oracle, and the new guard script + its fixtures all updated — no surface missed.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] Change only widens what the loader accepts and adds a fail-closed guard; no gate, allowlist, or
  execution-path behavior weakened.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] No documentation changes required in this phase (convention docs live in Phase 002); confirm none of
  this phase's code comments reference a stale filename-ordinal rule.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] Edits confined to `load-playbook-scenarios.cjs`, `code-opencode-playbook-ids.vitest.ts`, and the new
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
