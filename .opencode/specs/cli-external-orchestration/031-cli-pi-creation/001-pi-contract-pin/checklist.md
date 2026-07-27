---
title: "Verification Checklist: Pi CLI contract pin"
description: "Verification checklist for the Pi CLI contract-pin phase - not yet executed."
trigger_phrases:
  - "pi cli contract pin checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin"
    last_updated_at: "2026-07-27T08:03:00Z"
    last_updated_by: "claude-code"
    recent_action: "Checklist authored; no items verified yet, phase not executed."
    next_safe_action: "Execute tasks.md, then work through this checklist with real evidence."
    blockers: ["Pi CLI is not yet installed on this machine."]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi CLI contract pin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [ ] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..008)
- [ ] CHK-002 [P0] Technical approach defined in `plan.md` (install → core verification → cross-check)
- [ ] CHK-003 [P1] Dependencies identified and available: npm registry reachable, `pi.dev/docs/latest` reachable, at least one AI provider account available for the success-path headless dispatch probe
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

N/A - this phase produces no repository code; it installs an external CLI and records live-verification evidence.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-010 [P0] `pi --version` returns a live version/build string, confirming the binary is genuinely installed and reachable
- [ ] CHK-011 [P0] `.pi/` directory creation and `settings.json` project-over-global merge behavior confirmed live (not merely quoted from docs)
- [ ] CHK-012 [P0] Skills-discovery probe against `.opencode/skills/` completed, with an explicit finding on hub-level-only vs. flattened-nested exposure
- [ ] CHK-013 [P1] Prompt-template non-recursive discovery and `$1`/`${1:-default}` argument substitution confirmed against a real `/probe` invocation
- [ ] CHK-014 [P1] Extension auto-discovery confirmed via a loaded no-op probe extension
- [ ] CHK-015 [P0] Headless/programmatic dispatch tested on BOTH a success path and a failure path, with exit codes and full stdout/stderr recorded verbatim for each
- [ ] CHK-016 [P0] The `cursor-agent`-class "exit 0 on auth failure" gotcha explicitly checked against Pi's failure-path dispatch, with the actual result stated (shares the gotcha / fails closed correctly)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A - this phase is verification/contract-pinning, not a bug fix.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No provider API key, OAuth token, or other credential value is written into any tracked repo file or into `implementation-summary.md`'s evidence quotes
- [ ] CHK-031 [P1] Any interactive OAuth-style login flow (if Pi's auth requires one) is deliberately NOT completed non-interactively, matching the Devin/Cursor precedents' operator-only login deferral
- [ ] CHK-032 [P1] `pi install npm:<pkg>` commands verified to hit only the public npm registry, no unofficial mirrors
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] `implementation-summary.md` cites a live command's stdout/exit-code or a specific `pi.dev/docs` URL for every REQ in `spec.md`
- [ ] CHK-041 [P1] Every claim that could not be live-confirmed is explicitly marked "documented, unconfirmed" rather than stated as fact
- [ ] CHK-042 [P2] `spec.md`/`plan.md`/`tasks.md` continuity frontmatter (`completion_pct`, `open_questions`, `answered_questions`) updated to match actual execution results
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Any throwaway probe artifacts (`.pi/prompts/probe.md`, `.pi/extensions/probe.ts`, scratch `.pi/settings.json`) stay outside this repo's tracked tree - none committed
- [ ] CHK-051 [P1] `scratch/` in this phase folder cleaned before completion (or left empty if unused)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 7 | 0/7 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet executed - status Planned. This checklist is filled with real, falsifiable items ready to be checked off with evidence once phase 001 actually runs; no item is marked `[x]` prematurely.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md` (this phase)
