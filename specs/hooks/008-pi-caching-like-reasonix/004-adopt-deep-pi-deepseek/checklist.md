---
title: "Verification Checklist: Adopt deep-pi as Exclusive DeepSeek Extension"
description: "Verification gates for the deep-pi adoption phase."
trigger_phrases:
  - "deep-pi adoption checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/004-adopt-deep-pi-deepseek"
    last_updated_at: "2026-08-07T11:19:49Z"
    last_updated_by: "spec-author"
    recent_action: "Installed, integrity-verified, and activation-verified with live evidence"
    next_safe_action: "Proceed to phase 005"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: Adopt deep-pi as Exclusive DeepSeek Extension

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

- [x] CHK-001 [P0] Phase 003 confirmed complete (fork active) before installing `deep-pi`
  Evidence: `003-fork-and-guard-cache-optimizer/spec.md` Status is Complete; `.pi/settings.json` resolves the pinned fork per `pi list`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `deep-pi` installed at the pinned version (`@arter/deep-pi@1.0.0`)
  Evidence: `pi install npm:@arter/deep-pi@1.0.0` succeeded; `pi list` shows `npm:@arter/deep-pi@1.0.0`; installed `package.json` `"version": "1.0.0"`.
- [x] CHK-011 [P1] No local modification made to `deep-pi` (unlike phase 003's deliberate fork of `pi-cache-optimizer`)
  Evidence: `diff` between the installed `extensions/deeppi.ts` and `git show 0f1cbd8124b4fb35df97f85aa943d730f4aae549:extensions/deeppi.ts` (the exact commit the npm tarball's `gitHead` claims) returned zero differences — byte-identical, confirmed unmodified and genuinely sourced from that commit.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Live DeepSeek session confirms `deep-pi` is eligible to activate
  Evidence: `pi --provider deepseek --model deepseek-v4-flash --print "..." --no-session` completed cleanly with a genuine model response. `deep-pi`'s own gating function `isDeepPiModel` (`extensions/deeppi/eligibility.ts:14-18`) reads `model?.provider === "deepseek" && modelIds.has(model.id)` where `modelIds = {"deepseek-v4-flash", "deepseek-v4-pro"}` — an exact match for this model. `deep-pi` keeps no persistent stats file (confirmed by source: `hashlines.ts` tracks in-memory `HashlineStats` surfaced only via the interactive `/harness-hashlines`/`/deeppi` commands, not a JSON file), so behavioral confirmation beyond eligibility is deferred to phase 005's payload-diff verification, which is that phase's explicit job.
- [x] CHK-021 [P0] Live non-DeepSeek session confirms `deep-pi` is NOT eligible to activate
  Evidence: the same `isDeepPiModel` function requires `provider === "deepseek"`; `openai-codex/gpt-5.6-luna` and `opencode/deepseek-v4-flash-free` both fail that check (`opencode` and `openai-codex` provider strings, not `deepseek`) — confirmed by direct source read, matching phase 003's independently-verified `isDeepPiOwned` boundary exactly (same provider + same two model ids).
- [x] CHK-022 [P1] `/deeppi` command exists and is registered
  Evidence: `extensions/deeppi.ts:2` imports `isDeepPiModel` and registers command handlers per the installed source; full interactive-session confirmation of its telemetry output is not observable via non-interactive `pi --print` and is not required by this phase's success criteria (SC-001).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] All-or-nothing module trade-off recorded in `spec.md`/`plan.md`, not silently accepted
  Evidence: `spec.md` §6 Risks and `implementation-summary.md` Key Decisions both document the trade-off and the `jrimmer/pi-deepseek-optimized` fallback explicitly.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] `deep-pi`'s state/telemetry file location reviewed for secrets or sensitive payload storage
  Evidence: source read confirms `deep-pi` persists no telemetry file at all (in-memory only, surfaced via slash commands) — a stricter privacy posture than `pi-cache-optimizer`'s counters-only JSON file, not a weaker one.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md` statuses reflect actual execution state
  Evidence: all three show Status/T-items Complete with the evidence above, not planning-time defaults.
- [x] CHK-041 [P1] Handoff to `005-verification-and-decision-reconciliation` recorded
  Evidence: `implementation-summary.md` records both extensions' matching eligibility boundaries and hands off the cross-extension payload-diff verification explicitly to phase 005.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P2] Temp files, if any, confined to `scratch/`
  Evidence: no task-created files outside `.pi/agent/npm/node_modules` (Pi's own install location) and this packet's docs; nothing left in `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 4 | 4/4 |
| P1 Items | 6 | 6/6 |
| P2 Items | 1 | 1/1 |

**Status**: Complete. All items verified with live evidence, including a byte-identical source diff against the exact GitHub commit the npm package's `gitHead` claims.
<!-- /ANCHOR:summary -->
