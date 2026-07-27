---
title: "Verification Checklist: Pi manual-testing playbook (planning)"
description: "Verification checklist for the Pi manual-testing playbook planning phase. Status: Planned - all items unchecked; the playbook they verify does not exist yet."
trigger_phrases:
  - "pi manual testing playbook checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/010-pi-manual-testing-playbook"
    last_updated_at: "2026-07-27T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md; planning-doc items reviewed"
    next_safe_action: "Run validate.sh --strict and report status"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi manual-testing playbook (planning)

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

**Status note**: This phase is **Planned**, not built. Every item below is left unchecked `[ ]` by design - this checklist verifies the FUTURE authored Pi manual-testing playbook, which does not exist yet; its authoring is gated on phases 001, 003, 007, 008, and 009 landing live-verified facts. Items marked (this-phase) describe evidence a reviewer can confirm right now about the 4 planning docs themselves; items marked (future) can only be confirmed once the real playbook exists.

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

- [ ] CHK-001 [P0] (this-phase) Requirements documented in `spec.md` (§4 REQUIREMENTS, REQ-001..REQ-012)
- [ ] CHK-002 [P0] (this-phase) Technical approach defined in `plan.md` (§1-4)
- [ ] CHK-003 [P1] (this-phase) `cli-cursor/manual-testing-playbook/manual-testing-playbook.md` (root) + `../030-cli-cursor-creation/006-cursor-manual-testing-playbook/` (spec-kit precedent) + `.opencode/skills/sk-doc/create-manual-testing-playbook/SKILL.md` all read as the structural template before authoring
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] (future) 8 category subdirectories confirmed via `find cli-pi/manual-testing-playbook -type f`: `cli-invocation`, `skill-discovery`, `command-dispatch`, `agent-bridge`, `mcp-host-integration`, `hook-extension-layer`, `model-dispatch`, `prompt-quality` - each with `>=1` file
- [ ] CHK-011 [P0] (future) `grep -rhoE "PI-[0-9]{3}" cli-pi/manual-testing-playbook | sort -u` yields a sequential, gap-free, duplicate-free `PI-NNN` range in the 17-20 count
- [ ] CHK-012 [P1] (this-phase) This planning phase's own Scenario Coverage Plan (`spec.md` §9) satisfies the gap-free/count constraints in draft form: 19 rows, `PI-001`..`PI-019`, 8 categories
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] (future) The hallucination-fixture scenario file's Fail condition explicitly names the fabricated flag/syntax pattern once phase 001 confirms what "fake" looks like for Pi
- [ ] CHK-021 [P0] (future) `python3 validate_document.py` run on the root file + all 19 scenario files results in zero structural errors
- [ ] CHK-022 [P1] (this-phase) This phase's own 4 planning docs preserve every ANCHOR comment-pair marker and every SPECKIT_TEMPLATE_SOURCE / SPECKIT_LEVEL header marker from the Level-2 scaffold
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P2] (this-phase) Not a bug fix - documented as N/A by convention (docs-planning phase, no code change, no finding to classify)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] (this-phase) A secret-shaped-value grep across this phase's 4 planning docs returns zero matches; only env-var names ever appear in prose, never a value
- [ ] CHK-031 [P0] (this-phase) No hardcoded secrets, tokens, or credential-shaped values anywhere in `spec.md`/`plan.md`/`tasks.md`/`checklist.md`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] (this-phase) `spec.md`/`plan.md`/`tasks.md`/`checklist.md` synchronized: all four reference the same 8-category/19-`PI-NNN` Scenario Coverage Plan and the same phase-001/003/007/008/009 dependency chain
- [ ] CHK-041 [P1] (this-phase) Every Pi-specific behavioral claim in this phase's docs is marked UNKNOWN and routed to a named owning phase (self-invocation signal to 001/003; stdio MCP support to 007; extension lifecycle events to 008; `pi install` syntax to 001/006/007) rather than asserted as confirmed
- [ ] CHK-042 [P2] (this-phase) No changelog/version-history section anywhere in this phase's docs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] (this-phase) No scratch/temp files created outside `scratch/`; this folder contains only the 4 intended planning docs plus `scratch/`
- [ ] CHK-051 [P1] (this-phase) `scratch/` left empty (no working files needed for this docs-only planning pass)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 - Planned, not yet verified |
| P1 Items | 7 | 0/7 - Planned, not yet verified |
| P2 Items | 2 | 0/2 - Planned, not yet verified |

**Verification Date**: Not yet run. This phase is **Planned**, not built - every item above is unchecked by design. Run this checklist for real (this-phase items now reviewable, future items reviewable only after the FUTURE authoring pass creates `cli-pi/manual-testing-playbook/`).
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
