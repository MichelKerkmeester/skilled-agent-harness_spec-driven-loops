---
title: "Implementation Summary: Devin hook truth and runtime README parity"
description: "Phase 011 reconciles current Devin hook truth, aligns runtime discovery READMEs, restores the Cursor route-guard mirror and removes obsolete secret-bearing Zed MCP registrations."
trigger_phrases:
  - "Devin hook truth implementation"
  - "runtime README parity summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes"
    last_updated_at: "2026-07-26T19:05:13Z"
    last_updated_by: "opencode"
    recent_action: "Completed phase 011 with recursive strict validation"
    next_safe_action: "Rotate or revoke the removed credentials in the provider dashboards"
    blockers: []
    key_files: ["spec.md", "tasks.md", "checklist.md", "../hook-testing-results.md", "../handover.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-hook-truth"
      parent_session_id: null
    completion_pct: 100
    open_questions: ["Provider-side credential rotation requires operator access."]
    answered_questions: ["Current hook truth and runtime discovery surfaces are reconciled.", "Local secret-bearing Zed registrations are removed."]
---
# Implementation Summary: Devin Hook Truth and Runtime README Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-hook-truth-and-runtime-readmes |
| **Status** | Complete |
| **Started** | 2026-07-25 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 011 establishes one current operational account of Devin hooks. The corrected top-level `.devin/hooks.v1.json` schema and tests 10-14 lead every current summary; tests 1-9 remain as explicitly superseded evidence explaining how the unsupported wrapper shape produced a false packet-wide dormancy conclusion.

The delivery includes:

- Current-state corrections in the parent packet and phases 004, 006, 008 and 010.
- Seven event-specific Devin adapter READMEs and four runtime discovery READMEs aligned to current files and wiring.
- A relative Cursor `mcp-route-guard.mjs` discovery symlink with `.cursor/hooks.json` unchanged.
- Removal of the approved obsolete Zed MCP registrations and their local credential copies.
- Correction of the Zed Code Mode entrypoint to `.opencode/skills/mcp-code-mode/mcp-server/dist/index.js`.
- Updated handover and continuation guidance that retain all unobserved-event and branch caveats.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation used a fixed target allowlist because the shared branch contains extensive unrelated concurrent work. Current behavior was sourced from the registration file, captured payloads and a bounded live rerun rather than inferred from historical silence.

The phase append command initially produced a Level 1 child despite the Level 3 request. The upgrade helper then encountered a missing legacy addendum and safely restored its backup. The documented manifest renderer produced the Level 3 contract, and the backup residue was moved to the approved temporary area so the packet remains clean without losing rollback material.

The external Zed edit removed complete obsolete server blocks rather than masking values. A string-aware JSONC check then parsed the settings, asserted the approved key inventory and confirmed the canonical Code Mode entrypoint exists.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Preserve tests 1-9 as superseded history | Their observations explain the failure, while explicit supersession prevents them from being mistaken for current behavior. |
| Use event-specific observation states | Six lifecycle events are observed; two events and two behavioral branches remain unobserved end to end. |
| Keep the Cursor mirror discovery-only | The shared source becomes discoverable without changing working execution registration. |
| Remove obsolete Zed blocks | Disabled blocks still retained exposed credentials and stale paths. |
| Hand remote rotation to the operator | Local repository access cannot verify provider-side revocation. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Registration contract | PASS: 8 events, 11 matcher groups, 19 commands and no wrapper keys. |
| Live injected-context rerun | PASS: `devin --model glm-5-2 -p ...` returned `YES`. |
| README validation | PASS: all 11 target READMEs report zero issues. |
| Cursor mirror | PASS: relative symlink resolves and compares byte-for-byte equal to the shared source. |
| Cursor execution wiring | PASS: `.cursor/hooks.json` has no diff. |
| Zed JSONC and key inventory | PASS: obsolete keys and affected credential keys are absent; required entries remain. |
| Focused truth scan | PASS: surviving dormancy references are superseded history or independently current conditions. |
| Recursive strict packet validation | PASS: parent plus all 11 children completed with 0 errors and 0 warnings. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Provider rotation**: Local credential copies are removed, but revocation and replacement in provider dashboards remains operator-only and unverified.
2. **Unobserved hook surfaces**: `PermissionRequest`, `PostCompaction`, `run_subagent` and the dispatch deny branch remain unobserved end to end.
3. **Interactive mode**: True interactive Devin mode remains outside the available headless test environment.
<!-- /ANCHOR:limitations -->
