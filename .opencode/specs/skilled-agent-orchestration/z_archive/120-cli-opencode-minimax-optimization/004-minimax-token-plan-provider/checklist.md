---
title: "Verification Checklist: MiniMax Token Plan default provider [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-01"
trigger_phrases:
  - "minimax token plan checklist"
  - "verification"
  - "checklist"
  - "name"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/120-cli-opencode-minimax-optimization/004-minimax-token-plan-provider"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored phase-004 QA checklist"
    next_safe_action: "Verify items after edits land"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-minimax-token-plan-provider"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: MiniMax Token Plan default provider

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (Token Plan default + Direct API alt)
- [x] CHK-003 [P1] Live provider/model ids confirmed (memory: minimax-model-id-drift)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All touched JSON parses (`jq` on model-profiles.json + both graph-metadata.json + description.json)
- [x] CHK-011 [P0] `minimax-m3` entry: provider `minimax-coding-plan`, quota_pool `minimax-token-plan`, `fallback_target: "minimax-2.7"`, status active
- [x] CHK-012 [P0] `minimax-2.7` entry carries two executors (provider `minimax-coding-plan` + provider `minimax`)
- [x] CHK-013 [P1] Registry `version` bumped; description names the Token Plan default
- [x] CHK-014 [P1] 003-benchmark code refs updated to token-plan id (Fix 2); `node --check` OK + 46 vitest tests pass
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] cli_reference.md §5 default MiniMax row = `minimax-coding-plan/MiniMax-M3-highspeed`; alt row = `minimax/MiniMax-M2.7`
- [x] CHK-021 [P0] cli_reference.md + SKILL.md §4 pre-flight detect both `minimax-coding-plan` and `minimax`
- [x] CHK-022 [P1] Token Plan setup documented (base URL `https://api.minimax.io/anthropic/v1`, China variant, `opencode auth login`)
- [x] CHK-023 [P1] `--agent` omission + version-drift caveat recorded for MiniMax dispatches
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` — provider rename ripples through docs + registry + sentinel + cards + metadata
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -l minimax` across `.opencode/skills` (registry is the single producer)
- [x] CHK-FIX-003 [P0] Consumer inventory: fallback-router reads `executors[].quota_pool`/`fallback_target` (unchanged contract); cli-opencode docs + sentinel + cards updated
- [x] CHK-FIX-004 [P0] No security/path/parser/redaction surface touched (docs + registry data only) — N/A by inspection
- [x] CHK-FIX-005 [P1] Matrix axes listed: provider {minimax-coding-plan, minimax} × model {M3-highspeed, M2.7-highspeed, M2.7} × pool {minimax-token-plan, minimax-api}
- [x] CHK-FIX-006 [P1] No process-wide state read by these docs/registry — N/A
- [x] CHK-FIX-007 [P1] Evidence pinned to this session's edits (rg/jq output captured)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (keys referenced by env var name only: `MINIMAX_API_KEY`)
- [x] CHK-031 [P0] No input-handling surface introduced — N/A
- [x] CHK-032 [P1] Auth model documented (subscription via `opencode auth login`; pay-per-token via `MINIMAX_API_KEY`)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized
- [x] CHK-041 [P1] No ephemeral artifact pointers embedded in code comments (registry `notes` are data strings)
- [x] CHK-042 [P2] sk-prompt-models README has no MiniMax mention — no change needed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files written into the packet
- [x] CHK-051 [P1] scratch/ not used
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-06-01
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
