---
title: "Verification Checklist: Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro integration [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-01"
trigger_phrases:
  - "mimo provider integration checklist"
  - "xiaomi-token-plan-ams checklist"
  - "verification"
  - "checklist"
  - "name"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/020-cli-opencode-mimo-pro-optimization/001-mimo-provider-integration"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Phase-001 shipped; strict validate PASSED"
    next_safe_action: "Proceed to 002 (already implemented) / 003 research"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-126-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Xiaomi Token Plan (Europe) provider + MiMo-V2.5-Pro integration

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006) — present in spec.md §4
- [x] CHK-002 [P0] Technical approach defined in plan.md (additive, explicitly-selectable MiMo path; no default change) — additive path shipped; `opencode-go/deepseek-v4-pro` default unchanged
- [x] CHK-003 [P1] Live provider/model ids confirmed (`opencode models xiaomi-token-plan-ams`; live probe to `xiaomi-token-plan-ams/mimo-v2.5-pro` returned cleanly) — slug used verbatim across all touch points
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All touched JSON parses (`jq` on model-profiles.json + both graph-metadata.json + description.json) — all PASS this session
- [x] CHK-011 [P0] `mimo-v2.5-pro` entry: provider `xiaomi-token-plan-ams`, quota_pool `xiaomi-token-plan`, slug `xiaomi-token-plan-ams/mimo-v2.5-pro`, status active — confirmed via `jq` on model-profiles.json
- [x] CHK-012 [P0] `context_length: null` (no fabricated number) with a note that 126/003 research will confirm — entry has `context_length: null`; note in entry `notes` field
- [x] CHK-013 [P1] Registry `version` bumped; description active-rotation line names MiMo-V2.5-Pro via the Xiaomi Token Plan — `version` 1.3→1.4; description updated
- [x] CHK-014 [P1] Default unchanged: `opencode-go/deepseek-v4-pro` remains the skill default; MiMo is additive only (no MiniMax/DeepSeek rows altered) — `rg` confirms default unchanged
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] cli_reference.md §5 MiMo row = `xiaomi-token-plan-ams/mimo-v2.5-pro`; free sibling row = `opencode/mimo-v2.5-free` — both rows present (cli_reference.md:225, :226)
- [x] CHK-021 [P0] cli_reference.md + SKILL.md §4 pre-flight detect `xiaomi-token-plan-ams` — XIAOMI_OK routing rows present in both (cli_reference.md:183, SKILL.md:217)
- [x] CHK-022 [P1] Setup documented (`opencode auth login` → "Xiaomi Token Plan (Europe)" → provider `xiaomi-token-plan-ams`); no fabricated endpoint URL (provider-managed) — login shape documented; no invented URL
- [x] CHK-023 [P1] `--agent` omission caveat recorded (`--agent general` warns + falls back on 1.15.13); `--variant` omitted/unverified (pending 126/003) — omission caveat in routing rows; `--variant` marked unverified in §5
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer` — provider addition ripples through docs + registry + sentinel + cards + metadata — 12 files updated across the four surfaces
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n '"provider"|"quota_pool"' model-profiles.json` (registry is the single producer) — registry is the sole producer; `mimo-v2.5-pro` added
- [x] CHK-FIX-003 [P0] Consumer inventory: fallback-router reads `executors[].quota_pool`/`primary_quota_pool`/`fallback_target` (unchanged contract); cli-opencode docs + sentinel + cards updated — router contract unchanged; all consumers updated
- [x] CHK-FIX-004 [P0] No security/path/parser/redaction surface touched (docs + registry data only) — N/A by inspection — confirmed docs + JSON data only
- [x] CHK-FIX-005 [P1] Matrix axes listed: provider {xiaomi-token-plan-ams} × model {mimo-v2.5-pro, opencode/mimo-v2.5-free} × pool {xiaomi-token-plan, opencode-go free} — documented in cli_reference §5 rows
- [x] CHK-FIX-006 [P1] No process-wide state read by these docs/registry — N/A — confirmed
- [x] CHK-FIX-007 [P1] Evidence pinned to this session's edits (rg/jq output captured) — jq + rg output captured in implementation-summary.md Verification table
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (provider configured via `opencode auth login`; no API key in repo) — no secrets in any touched file
- [x] CHK-031 [P0] No input-handling surface introduced — N/A — confirmed
- [x] CHK-032 [P1] Auth model documented (subscription via `opencode auth login` → "Xiaomi Token Plan (Europe)"); no invented endpoint URL — documented; no URL fabricated
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist synchronized — spec Status→Complete, tasks/checklist marked, implementation-summary added
- [x] CHK-041 [P1] No ephemeral artifact pointers embedded in code comments (registry `notes` and markdown prose may cite 126/003 + 126/004; bash code-block comments must not) — packet refs live only in registry `notes` + markdown prose
- [x] CHK-042 [P1] Honest placeholders: `context_length` null, `--variant` unverified, best framework "pending 126/004 benchmark" — no TIDD-EC/RCAF/any winner claimed — placeholders honest; no framework winner asserted
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files written into the packet — none
- [x] CHK-051 [P1] scratch/ not used — confirmed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-01
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
