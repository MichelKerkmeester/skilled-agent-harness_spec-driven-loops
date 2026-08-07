---
title: "Verification Checklist: Devin feature catalog"
description: "Level 3 verification checklist for the cli-devin feature-catalog phase, with special emphasis on event-specific hook evidence accuracy."
trigger_phrases: ["devin feature catalog checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/010-devin-feature-catalog"
    last_updated_at: "2026-07-24T17:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored verification checklist; all items unchecked, phase Planned"
    next_safe_action: "Work through items once dependency phases land and implementation starts"
    blockers: ["Depends on 003/005/009 for full content"]
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup: { fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000", session_id: "cli-devin-revival-followups", parent_session_id: null }
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin feature catalog

<!-- ANCHOR:protocol -->
## Verification Protocol
| Priority | Handling | Completion Impact |
|---|---|---|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
- [ ] CHK-001 [P0] Current `Status` field of phases 003/005/009 confirmed before drafting any category content.
- [ ] CHK-002 [P0] Corrected-schema hook matrix re-verified if the installed Devin version differs from `3000.2.17`.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## CODE QUALITY
- [ ] CHK-010 [P0] Root catalog exists at `feature-catalog/feature-catalog.md`, built from the packet template.
- [ ] CHK-011 [P0] Exactly 7 category folders, kebab-case, no numeric prefix.
- [ ] CHK-012 [P0] `hooks` category has exactly 8 per-feature files, one per Devin lifecycle event.
- [ ] CHK-013 [P0] Every hook file uses the 3-value evidence set (`observed live` / `registered, unobserved` / `no adapter, explicit empty registration`).
- [ ] CHK-014 [P1] Every per-feature file has frontmatter with title, description, at least 3 `trigger_phrases`, and a four-part version.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing
- [ ] CHK-020 [P0] `check_no_hyphenated_catalog_content.py` passes against the staging root.
- [ ] CHK-021 [P0] `validate_document.py` passes on the root catalog and every per-feature leaf.
- [ ] CHK-022 [P1] `extract_structure.py` passes on the root catalog.
- [ ] CHK-023 [P0] Every root entry links to exactly one per-feature file, manually verified.
- [ ] CHK-024 [P0] Every hook evidence state cross-checked against `../hook-testing-results.md` tests 10-14 and the event-specific caveats.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness
N/A - this phase authors a new package, it is not a bug fix.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security
- [ ] CHK-030 [P1] No credentials, tokens, or auth flows referenced in any catalog entry.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation
- [ ] CHK-040 [P0] No category describes a not-yet-shipped capability (phase 003/005/009 still Planned) as current behavior -- explicit stub language used instead.
- [ ] CHK-041 [P1] The `model-dispatch` per-feature file links to phase 005's spec.md rather than duplicating the 7-model table.
- [ ] CHK-042 [P1] Cross-references to `../006-devin-manual-testing-playbook/`'s hooks category are consistent in both directions (catalog links to playbook, playbook links to catalog per phase 006's own amendment).
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization
- [ ] CHK-050 [P1] Package lives at `cli-external-orchestration/cli-devin/feature-catalog/`, matching `create-feature-catalog`'s canonical shape.
- [ ] CHK-051 [P1] No packet-local `graph-metadata.json` added inside the catalog package.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION
- [ ] CHK-100 [P0] ADR-001 (event evidence-state set) documented in `decision-record.md` with Context, Decision, Alternatives, Consequences, Five Checks and Implementation sections.
- [ ] CHK-101 [P1] ADR-001 has a recorded status.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION
- [ ] CHK-110 [P2] N/A -- static documentation package, no runtime performance surface.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS
- [ ] CHK-120 [P0] Rollback tested: deleting `cli-devin/feature-catalog/` leaves no other surface touched.
- [ ] CHK-121 [P0] No feature flag needed - additive documentation only.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION
- [ ] CHK-130 [P2] No new third-party dependency introduced.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION
- [ ] CHK-140 [P1] Every per-feature file's Source Files table cites a real, stable path.
- [ ] CHK-141 [P1] Every per-feature file's Validation And Tests table cites real evidence, never a fabricated test reference.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF
| Approver | Role | Status | Date |
|---|---|---|---|
| Operator | Product Owner | [ ] Approved | |
| Implementing agent | Technical Lead | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

<!-- ANCHOR:summary -->
## Verification Summary
| Category | Total | Verified |
|---|---|---|
| P0 Items | 12 | [ ]/12 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: Not yet started - phase is Planned.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`, `decision-record.md`
