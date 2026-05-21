---
title: "Verification Checklist: 115/001 — preflight scope-map"
description: "Verification Date: 2026-05-21"
trigger_phrases:
  - "115 preflight checklist"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/115-deep-ai-council-rename/001-preflight-scope-map"
    last_updated_at: "2026-05-21T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 115/001 checklist.md"
    next_safe_action: "Compose 3 cli-devin prompts"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000115001"
      session_id: "115-001-checklist-init"
      parent_session_id: "115-001-spec-init"
    completion_pct: 60
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 115/001 — preflight scope-map

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER |
| **[P1]** | Required (or user-approved deferral) |
| **[P2]** | Optional |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] 001/spec.md authored with required Level 2 anchors [EVIDENCE: 001/spec.md ANCHOR:metadata..ANCHOR:complexity present]
- [x] CHK-002 [P0] 001/plan.md authored with required Level 2 anchors [EVIDENCE: 001/plan.md ANCHOR:phase-deps/effort/enhanced-rollback present]
- [x] CHK-003 [P0] Pre-rename rg baseline captured [EVIDENCE: scratch/rg/rg-baseline-before-files.txt = 415 lines]
- [x] CHK-004 [P1] Resource-map.md drafted [EVIDENCE: scratch/resource-map.md authored]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] 3 cli-devin prompt files authored at `scratch/cli-devin/job-{1,2,3}-prompt.md`
- [ ] CHK-011 [P0] 3 cli-devin SWE-1.6 dispatches completed (exit 0 each)
- [ ] CHK-012 [P0] Bundle gate (grep + smoke-run) applied to each returned bundle per [[feedback_cli_devin_bundle_verification]]
- [ ] CHK-013 [P1] Unclassified count = 0 in all 3 bundles
- [ ] CHK-014 [P0] `scratch/rename-plan.json` emitted with disjoint phase scopes
- [ ] CHK-015 [P0] jq intersection check on rename-plan.json phase scopes returns empty set
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] `validate.sh --strict 001/` exits 0
- [ ] CHK-021 [P0] `scratch/rg-classification.json` covers every baseline hit (415 entries)
- [ ] CHK-022 [P1] Case-insensitive sweep per [[feedback_rename_grep_case_insensitive]] applied; any case-variants identified
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each rename hit classified into live or historical via spec.md §3 In Scope / Out of Scope [EVIDENCE: resource-map.md §1-§2]
- [ ] CHK-FIX-002 [P0] Same-class producer inventory: 415 baseline files; ~125 live + ~290 historical (refined estimate)
- [ ] CHK-FIX-003 [P0] Consumer inventory: 4 sibling skills + 2 TS code/test + git hook + root docs + 4 runtime agents covered
- [ ] CHK-FIX-004 [P0] Adversarial table tests N/A (recon-only phase; substituted by disjoint-scope invariant on rename-plan.json)
- [ ] CHK-FIX-005 [P1] Matrix axes: {live × historical} × {skill-body × sibling × root × memory × hook × runtime} listed in spec.md §3 + resource-map.md §1-§2
- [ ] CHK-FIX-006 [P1] Hostile env variant N/A
- [ ] CHK-FIX-007 [P1] Evidence pinned to commit SHA at packet close
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced (recon-only) [EVIDENCE: phase makes no mutations outside 001/]
- [x] CHK-031 [P0] No new input handling [EVIDENCE: recon-only]
- [x] CHK-032 [P1] No auth/authz changes [EVIDENCE: recon-only]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec.md + plan.md + tasks.md + checklist.md + impl-summary.md synchronized
- [x] CHK-041 [P1] resource-map.md exists [EVIDENCE: scratch/resource-map.md]
- [ ] CHK-042 [P1] README updated N/A (recon-only)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `001/scratch/` [EVIDENCE: scratch/rg/, scratch/cli-devin/, scratch/resource-map.md]
- [ ] CHK-051 [P1] scratch/ retained for phase 002-005 reference (rename-plan.json is the contract)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 5/11 (pending cli-devin dispatches + contract emission + strict validate) |
| P1 Items | 13 | 5/13 |
| P2 Items | 0 | n/a |

**Verification Date**: 2026-05-21
<!-- /ANCHOR:summary -->
