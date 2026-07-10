---
title: "Implementation Summary: CLI Freshness Gate Fix and Offline Smoke"
description: "Implemented content-hash CLI freshness gates, actionable stale-dist plugin status, and a daemon-free offline 37/8/9 smoke command."
trigger_phrases:
  - "001-cli-freshness-and-smoke summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/001-cli-freshness-and-smoke"
    last_updated_at: "2026-06-11T03:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Delivered hash freshness gates, stale-dist status, and offline smoke"
    next_safe_action: "Proceed to sibling CLI tooling UX sub-phases if needed"
    blockers: []
    key_files:
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/bin/code-index.cjs"
      - ".opencode/bin/skill-advisor.cjs"
      - ".opencode/bin/cli-offline-smoke.cjs"
      - ".opencode/bin/cli-offline-smoke.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-001-cli-freshness-and-smoke"
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
| **Spec Folder** | 001-cli-freshness-and-smoke |
| **Completed** | Yes |
| **Level** | 1 |
| **Status** | Completed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Content-hash freshness gates in `.opencode/bin/spec-memory.cjs`, `.opencode/bin/code-index.cjs`, and `.opencode/bin/skill-advisor.cjs`.
- Build-time source fingerprint writing in `.opencode/skills/system-spec-kit/mcp_server/scripts/finalize-dist.mjs` so a plain spec-memory build refreshes the shim gate.
- Actionable stale-dist plugin status classification in the spec-memory, code-graph, and skill-advisor plugin bridges while keeping stderr redacted to `[stderr-present]`.
- Unified offline smoke command at `.opencode/bin/cli-offline-smoke.cjs` plus `.opencode/bin/cli-offline-smoke.test.cjs`, wrapping the playbook scenario and checking 37/8/9 counts plus freshness without a daemon, build, or scan.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The shims now hash watched source contents and compare the current hash to a stored dist-side source fingerprint before falling back to the conservative mtime check. A source mtime-only touch keeps the same hash and passes after a normal build; a real source-content change without a rebuild still exits `69`. The plugin bridges classify exit `69` stale or missing dist output as `dist_stale_rebuild_required` with an action string and sanitized stderr marker. The smoke script runs `list-tools --format json` for all three CLI shims in an isolated socket directory and asserts the expected counts and daemon-free status.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Gate on content hash rather than removing the freshness gate | Removing the gate would mask a genuinely stale dist; a content hash keeps the safety while fixing the mtime-only false-positive |
| Keep stderr sanitized when surfacing stale-dist status | Assessment #10 guardrail: surface a classified state plus a sanitized marker, never raw stderr |
| Keep the smoke command daemon-free | `list-tools` is local schema enumeration; the smoke should not cold-spawn daemons, build, or scan |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Reproduce mtime-only stale-`69` | Passed: code-index baseline returned stale exit `69`; spec-memory `list-tools` with dev stale override returned `count=37` |
| Plain rebuild restores freshness | Passed: after `touch spec-memory-cli.ts && npm run build`, `spec-memory list-tools` returned `ok 37` without stale override |
| Offline smoke reports 37/8/9 + stale-dist verdict | Passed: `node .opencode/bin/cli-offline-smoke.cjs` reported spec-memory `37/37`, code-index `8/8`, skill-advisor `9/9`, all `fresh`, all `daemonFree=true` |
| Plugin status shows actionable stale-dist with sanitized stderr | Passed: `node .opencode/bin/cli-offline-smoke.test.cjs` exercised the exported stale-dist classifiers and verified `dist_stale_rebuild_required` plus `[stderr-present]` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The broad `.opencode` alignment verifier still reports unrelated existing issues under `.opencode/specs/z_future/...` and `.opencode/bin/worktree-guard.sh`; those paths are out of this sub-phase scope and were not modified.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
