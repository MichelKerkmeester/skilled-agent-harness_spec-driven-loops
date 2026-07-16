---
title: "Verification Checklist: Phase 4 — Deep Review Remediation"
description: "Phase 4 deep-review remediation docs and job reports for 067-mcp-figma-transfer."
trigger_phrases:
  - "067 phase 4 remediation"
  - "deep review remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/003-mcp-figma-transfer/004-deep-review-remediation"
    last_updated_at: "2026-05-05T12:45:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Job3 report authored"
    next_safe_action: "Review phase closeout"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/003-mcp-figma-transfer/004-deep-review-remediation/job3-report.md"
    session_dedup:
      fingerprint: "sha256:dc36e9037d5f613708677c95ac9e96994d7575d9bb75f339a4d55569757eeebc"
      session_id: "067-004-checklist-2026-05-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 4 — Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Phase 4 remediation contract section for checklist.md.
<!-- /ANCHOR:summary -->

### Original Authored Content

---

### Verification Protocol

| Priority | Handling |
|---|---|
| **[P0]** | HARD BLOCKER — cannot claim Phase 4 done until complete |
| **[P1]** | Required OR documented deferral |
| **[P2]** | Optional |

---

### Pre-Implementation

- [ ] CHK-001 [P0] `review/review-report.md` is the source of truth — all 21 R-tasks mapped to T010-T210
- [ ] CHK-002 [P0] Phase 4 spec.md, plan.md (this file is plan-substitute), tasks.md, checklist.md authored

### P0 Remediation (Phase 4A)

- [ ] CHK-010 [P0] R-001: All 3 child --strict validators exit 0 (confirm with `bash validate.sh <child> --strict`)
- [ ] CHK-011 [P0] R-002: All P0 checklist items in 3 children's checklist.md marked `[x]` with EVIDENCE
- [ ] CHK-012 [P0] R-003: review/deep-review-state.jsonl has 7 iteration records; review/deep-review-strategy.md Completed Dimensions table populated

### P1 Remediation (Phase 4B)

- [ ] CHK-020 [P1] R-004: Both INSTALL_GUIDE.md files use `${figma_FIGMA_API_KEY}` at lines 341-365
- [ ] CHK-021 [P1] R-005: 3 implementation-summary commit ledgers complete with all 7 commits across 3 repos
- [ ] CHK-022 [P1] R-006: ADR-009 marked superseded; Phase 2 spec/implementation-summary reflect internal-only scope
- [ ] CHK-023 [P1] R-007: Phase 2 Decision Index includes ADR-014
- [ ] CHK-024 [P1] R-008: Phase 3 ledger has Commit 5b row
- [ ] CHK-025 [P1] R-009: skill index counts consistent (line 44 and 54 both = 17)
- [ ] CHK-026 [P1] R-010: install_guides counts reconciled across all 4+ count occurrences
- [ ] CHK-027 [P1] R-011: ADR-005 body rewritten to gitignored pattern
- [ ] CHK-028 [P1] R-012: Hook F = 1 failure documented in Phase 3 + parent
- [ ] CHK-029 [P1] R-013: Broken symlink deleted; install_guides/README.md:83 cleaned
- [ ] CHK-030 [P1] R-014: Dead source-skill links removed from Barter + Public Figma READMEs + Combined Workflows
- [ ] CHK-031 [P1] R-015: Public Figma INSTALL_GUIDE cwd is Public path
- [ ] CHK-032 [P1] R-016: Barter + Public Figma AGENTS.md byte-equivalent (cmp -s exits 0)

### P2 Remediation (Phase 4C)

- [ ] CHK-040 [P2] R-017: figd_your_token → figd_your_token_here in 2 KB docs
- [ ] CHK-041 [P2] R-018: handover.md authored OR deferred
- [ ] CHK-042 [P2] R-019: Telemetry decision documented
- [ ] CHK-043 [P2] R-020: System Prompt orphan ref fixed
- [ ] CHK-044 [P2] R-021: verify.sh / INSTALL_GUIDE alignment

### Final Verification (Phase 4D)

- [ ] CHK-050 [P0] All 3 children + parent validate.sh --strict exit 0
- [ ] CHK-051 [P0] No new findings on re-run deep review (sanity)
- [ ] CHK-052 [P0] All 3 repos on main; commits landed; ledgers up-to-date
- [ ] CHK-053 [P0] Phase 4 implementation-summary.md authored
- [ ] CHK-054 [P0] Parent 067 spec.md Phase Documentation Map updated to include Phase 4 ✅ Complete
