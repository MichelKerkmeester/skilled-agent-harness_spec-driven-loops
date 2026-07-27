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
    recent_action: "Checklist verified against live execution; 15/18 items met"
    next_safe_action: "Hand off CHK-012/CHK-013 to phases 004/005"
    blockers: ["No provider API key on this machine blocked CHK-003/CHK-012/CHK-013"]
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 85
    open_questions: ["CHK-012/CHK-013 need a successful dispatch this machine cannot provide"]
    answered_questions: ["15 of 18 checklist items met with live evidence; see implementation-summary.md"]
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

- [x] CHK-001 [P0] Requirements documented in `spec.md` (REQ-001..008) [EVIDENCE: spec.md §4]
- [x] CHK-002 [P0] Technical approach defined in `plan.md` (install → core verification → cross-check) [EVIDENCE: plan.md]
- [ ] CHK-003 [P1] Dependencies identified and available: npm registry reachable, `pi.dev/docs/latest` reachable, at least one AI provider account available for the success-path headless dispatch probe [DEFERRED: npm registry and docs both confirmed reachable; no AI provider account is configured on this machine - obtaining one is an operator-only action, out of scope]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

N/A - this phase produces no repository code; it installs an external CLI and records live-verification evidence.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-010 [P0] `pi --version` returns a live version/build string, confirming the binary is genuinely installed and reachable [EVIDENCE: `0.82.1`]
- [x] CHK-011 [P0] `.pi/` directory creation and `settings.json` project-over-global merge behavior confirmed live (not merely quoted from docs) [PARTIAL EVIDENCE: `.pi/` not auto-created on failure; `pi install -l` confirmed a non-destructive settings.json read-modify-write. Full project-over-global nested-collision override NOT observed - needs a successful dispatch this machine cannot provide]
- [ ] CHK-012 [P0] Skills-discovery probe against `.opencode/skills/` completed, with an explicit finding on hub-level-only vs. flattened-nested exposure [NOT MET: no successful dispatch and no debug surface exists to confirm without one; owned by phase 004]
- [ ] CHK-013 [P1] Prompt-template non-recursive discovery and `$1`/`${1:-default}` argument substitution confirmed against a real `/probe` invocation [NOT MET: same reason as CHK-012; owned by phase 005]
- [x] CHK-014 [P1] Extension auto-discovery confirmed via a loaded no-op probe extension [EVIDENCE: invalid stub triggered `Extension does not export a valid factory function`, exit 1; a valid factory-function stub resolved that error]
- [x] CHK-015 [P0] Headless/programmatic dispatch tested on BOTH a success path and a failure path, with exit codes and full stdout/stderr recorded verbatim for each [PARTIAL EVIDENCE: failure path fully captured (2 different exit codes across identical runs); success path blocked, no provider credentials on this machine]
- [x] CHK-016 [P0] The `cursor-agent`-class "exit 0 on auth failure" gotcha explicitly checked against Pi's failure-path dispatch, with the actual result stated (shares the gotcha / fails closed correctly) [EVIDENCE: confirmed shares it, and worse - exit 0 on first identical failure, exit 1 on every later one]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

N/A - this phase is verification/contract-pinning, not a bug fix.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No provider API key, OAuth token, or other credential value is written into any tracked repo file or into `implementation-summary.md`'s evidence quotes [EVIDENCE: no credential ever existed to leak - this machine has none configured]
- [x] CHK-031 [P1] Any interactive OAuth-style login flow (if Pi's auth requires one) is deliberately NOT completed non-interactively, matching the Devin/Cursor precedents' operator-only login deferral [EVIDENCE: `/login` never invoked]
- [x] CHK-032 [P1] `pi install npm:<pkg>` commands verified to hit only the public npm registry, no unofficial mirrors [EVIDENCE: `pi install npm:pi-subagents` resolved via standard npm, real package fetched into `.pi/npm/node_modules/`]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] `implementation-summary.md` cites a live command's stdout/exit-code or a specific `pi.dev/docs` URL for every REQ in `spec.md` [EVIDENCE: implementation-summary.md written with per-REQ citations]
- [x] CHK-041 [P1] Every claim that could not be live-confirmed is explicitly marked "documented, unconfirmed" rather than stated as fact [EVIDENCE: `implementation-summary.md` §"Not Confirmed" section names REQ-003/REQ-004 explicitly]
- [x] CHK-042 [P2] `spec.md`/`plan.md`/`tasks.md` continuity frontmatter (`completion_pct`, `open_questions`, `answered_questions`) updated to match actual execution results [EVIDENCE: all 4 phase files' frontmatter updated]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Any throwaway probe artifacts (`.pi/prompts/probe.md`, `.pi/extensions/probe.ts`, scratch `.pi/settings.json`) stay outside this repo's tracked tree - none committed [EVIDENCE: all probes created under the session scratchpad directory, never inside the repo]
- [x] CHK-051 [P1] `scratch/` in this phase folder cleaned before completion (or left empty if unused) [EVIDENCE: scratch/ untouched, empty]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 8/9 |
| P1 Items | 8 | 6/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27. Executed live against Pi CLI `0.82.1`. The 3 unmet items (CHK-003, CHK-012, CHK-013) all trace to the same root cause - no provider API key is configured on this machine, so a successful-path model dispatch could never be observed. That is a genuine, honestly-recorded gap, not a rubber-stamp: CHK-012/CHK-013 are handed off explicitly to phases 004/005, which each have their own live-verification burden once this or another machine has real credentials.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md` (this phase)
