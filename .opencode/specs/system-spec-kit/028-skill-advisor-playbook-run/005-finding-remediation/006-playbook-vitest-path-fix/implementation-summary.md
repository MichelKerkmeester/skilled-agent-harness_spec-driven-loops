---
title: "Implementation Summary: Playbook Vitest Path Fix (F5) — Pending"
description: "Planned, not yet implemented. Specifies correcting the NC-004/NC-005 stale vitest invocation to the canonical system-skill-advisor/mcp_server tests path."
trigger_phrases:
  - "F5 implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-skill-advisor-playbook-run/005-finding-remediation/006-playbook-vitest-path-fix"
    last_updated_at: "2026-05-26T20:40:00Z"
    last_updated_by: "deep-research-remediation"
    recent_action: "Specced F5; pending implementation"
    next_safe_action: "Implement via /speckit:implement"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "028-005-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 028-skill-advisor-playbook-run/005-finding-remediation/006-playbook-vitest-path-fix |
| **Completed** | Pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet implemented. Specified and ready for `/speckit:implement`. When implemented it replaces the stale pre-extraction vitest command (`npm --prefix .../system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/...`) in NC-004 and NC-005 with the canonical `cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/...` form (verified: 49/49 tests pass), and re-greps to confirm no residual stale paths remain.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.../01--native-mcp-tools/004-ambiguous-brief-rendering.md` | Modify (planned) | Correct vitest command |
| `.../01--native-mcp-tools/005-lifecycle-redirect-metadata.md` | Modify (planned) | Correct vitest command |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Pending. Delivery: `/speckit:implement`, then run both corrected commands (expect 49/49) and re-grep for residual `skill-advisor/tests/` references.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Doc-only fix | The tests pass at the correct path; only the documented invocation is stale (pre-extraction) |
| Audit the whole playbook | Confirm no other scenario carries the same stale pattern (only NC-004/005 found) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Corrected commands run 49/49 | Pending |
| No residual `skill-advisor/tests/` in playbook | Pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** Canonical command verified in `../research/research.md` §3 F5.
2. **Lowest-risk finding** — doc-only, recommended first in the implementation order.
<!-- /ANCHOR:limitations -->
