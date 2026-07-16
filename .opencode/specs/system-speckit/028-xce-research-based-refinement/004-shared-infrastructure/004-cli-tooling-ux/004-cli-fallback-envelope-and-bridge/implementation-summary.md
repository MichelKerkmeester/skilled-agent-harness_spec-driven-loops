---
title: "Implementation Summary"
description: "Implemented normalized warm-fallback envelopes across the three hook helpers and a spec-memory bridge allowlist."
trigger_phrases:
  - "004-cli-fallback-envelope-and-bridge summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/004-cli-fallback-envelope-and-bridge"
    last_updated_at: "2026-06-11T03:34:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed envelope normalization and bridge allowlist"
    next_safe_action: "No implementation action pending"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/warm-cli-fallback-envelope.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/spec-memory-cli-fallback.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/code-index-cli-fallback.ts"
      - ".opencode/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-004-cli-fallback-envelope-and-bridge"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-cli-fallback-envelope-and-bridge |
| **Completed** | 2026-06-11 |
| **Level** | 1 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Added `mcp_server/hooks/warm-cli-fallback-envelope.ts` with the shared spec-kit envelope shape `{ status, reason, exitCode, retryable }`.
- Updated `mcp_server/hooks/spec-memory-cli-fallback.ts` and `mcp_server/hooks/code-index-cli-fallback.ts` to emit the normalized envelope while retaining `payload`, `stdout`, `stderr`, and `durationMs`.
- Updated `system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` to emit the same runtime envelope shape while preserving the existing `AdvisorHookResult` fields.
- Added a prompt-time allowlist to `mcp_server/plugin_bridges/mk-spec-memory-bridge.mjs` so only `brief` and `status` requests map to `session_resume` and `memory_health`; mutation tool names reject before warm probing.
- Added vitest coverage for the envelope contract and bridge allowlist.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The spec-kit hook helpers share one normalizer. The skill-advisor helper duplicates the small normalizer locally to preserve existing skill isolation. The bridge guard runs before `warmProbe`, so a direct prompt-time request for a mutation tool returns a structured `skipped` response with `route: prompt_safe_policy`, `retryable: false`, and no daemon interaction.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep envelope changes additive | Hook consumers may depend on current shapes |
| Duplicate the tiny advisor normalizer locally | Skill-advisor has explicit isolation rules against new system-spec-kit imports |
| Use an allowlist (not a denylist) on the spec-memory bridge | The bridge only legitimately calls `brief/status`; an allowlist is the tighter default-deny posture |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run test:core --workspace=@spec-kit/mcp-server -- mcp_server/tests/warm-cli-fallback-envelope.vitest.ts mcp_server/tests/spec-memory-bridge-allowlist.vitest.ts` | Passed: 2 files, 4 tests |
| `npm run test -- tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts` | Passed: 1 file, 1 test |
| `npm run typecheck --workspace=@spec-kit/mcp-server` | Passed |
| `npm run typecheck` in `system-skill-advisor/mcp_server` | Passed |
| `npm run build --workspace=@spec-kit/mcp-server` | Passed |
| `npm run build` in `system-skill-advisor/mcp_server` | Passed |
| Existing spec-kit plugin bridge suite plus new tests | Passed: 3 files, 15 passed, 1 skipped |
| Existing advisor hook/bridge suites excluding settings parity | Passed: 5 files, 30 tests |
| Comment-hygiene checker with `python3` on all modified code/test files | Passed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. `tests/hooks/settings-driven-invocation-parity.vitest.ts` is an out-of-scope existing environment-parity suite failure in this checkout: `SETTINGS.hooks` is undefined, causing 35 assertions to fail. Runtime settings and command configuration are outside this sub-phase's allowed write paths.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
