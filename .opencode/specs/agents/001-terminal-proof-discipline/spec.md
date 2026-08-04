---
title: "Feature Specification: Terminal-Proof Discipline and Directive Injection"
description: "Integrate terminal-proof mechanics into AGENTS.md's existing authorities and extend the per-turn governor directive capsule with a proof-over-appearance directive."
trigger_phrases:
  - "terminal proof discipline"
  - "governor directive injection"
  - "AGENTS.md improvement"
  - "hidden test final state"
  - "proof over appearance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "agents/001-terminal-proof-discipline"
    last_updated_at: "2026-08-05T00:00:00Z"
    last_updated_by: "pi-terminal-engineer"
    recent_action: "Integrated AGENTS.md proof rules and validated the packet"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-05-agents-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Terminal-Proof Discipline and Directive Injection

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-05 |
| **Completed** | 2026-08-05 |
| **Track** | agents |
| **Packet** | 001-terminal-proof-discipline |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | AGENTS.md carries the terminal discipline through its existing authorities; the standalone block is absent; the per-turn capsule carries the proof directive; strict validation exits 0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A terminal-engineer benchmark prompt encodes a verification protocol that AGENTS.md did not express: encode every requirement as an objective pass-or-fail command, watch the check fail before fixing, fix the root cause once, and close with a clean re-run plus a stray-file sweep. The existing framework covered the spirit (Iron Law, confirmed-versus-inferred) but not the mechanics, so terminal-graded tasks were run without a mandatory final gate.

Separately, the per-turn governor directive injection exists (renderer, plugin mirror, pi bridge) but is undocumented in AGENTS.md, and whether the same mechanism could carry a second dispositional directive was unverified.

### Purpose

Integrate the terminal-proof mechanics into AGENTS.md's existing hard gates, evidence standards, blast-radius rules, execution behavior, tool routing, recovery guidance, and quick reference; verify the governor injection chain end to end; and extend the per-turn capsule with a proof-over-appearance directive so the disposition is restated every turn exactly like the governor.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- AGENTS.md: distributed terminal-proof mechanics in the existing authorities named by the review Placement Plan, plus removal of the superseded standalone Terminal Discipline block.
- The per-turn directive capsule: a new one-line proof-over-appearance directive appended in the canonical renderer and mirrored in the OpenCode plugin fallback, followed by a dist rebuild and the test suites.
- A Level 2 spec packet under the agents track with spec, plan, tasks, checklist, decision-record, and implementation-summary.
- Strict validation of the packet (exit 0).

### Out of Scope

- Changing the advisor recommendation logic, token caps, or routing.
- Any behavioral change to the comment-hygiene or governor capsules.
- Modifying the pi extension symlink layout or any runtime registration file.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `AGENTS.md` | Modify | Distribute terminal-proof mechanics across existing framework authorities and remove the standalone protocol block |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/render.ts` | Modify | Add TERMINAL_PROOF_DIRECTIVE and append it in the composition points |
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Mirror the directive in FALLBACK_DIRECTIVE |
| `specs/agents/001-terminal-proof-discipline/` | Create | Level 2 packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | AGENTS.md integrates the protocol through the eleven planned placements without weakening existing hard blockers | grep finds the distributed owners and no standalone protocol heading; focused git diff shows only the scoped integration |
| REQ-002 | The proof directive is injected through the canonical renderer | render.ts contains TERMINAL_PROOF_DIRECTIVE appended in all three composition points |
| REQ-003 | The OpenCode plugin fallback mirrors the directive | mk-skill-advisor.js FALLBACK_DIRECTIVE contains the same text |
| REQ-004 | The advisor server builds and its tests pass | npm build exits 0; vitest and the plugin node test exit 0 |
| REQ-005 | The packet passes strict validation | validate.sh --strict exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The injection chain is documented with file evidence | decision-record.md names renderer, plugin, and pi symlink with line references |
| REQ-007 | The stray probe file is removed | no probe.txt remains under the agents track |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A machine-state task following AGENTS.md passes the post-execution Final-State Verification hard gate: the exact artifact exists, objective checks and the authoritative gate pass on a final rerun, and no task-created residue remains.
- **SC-002**: Every session receives the proof-over-appearance directive per turn through the same mechanism as the governor capsule.
- **SC-003**: The packet is validated strictly green with all checklist items evidenced.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Rebuilding the shared advisor server changes every runtime's per-turn injection | Med — fleet-wide prompt change | Additive one-line capsule; rollback is git revert plus rebuild |
| Risk | Exact-string test assertions on the fallback directive | Med — test suite may need a matching update | Run the full vitest and plugin test suites and update assertions to the new capsule text |
| Risk | Dist rebuild fails on the workstation | High — hook change cannot ship | Keep the source change; record build output and re-run at next opportunity |
| Dependency | npm toolchain at .opencode/skills/system-skill-advisor/mcp-server | Required for build and tests | Already present in the repo (package.json scripts verified) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The per-turn-versus-docs question was resolved as both: one-line disposition in the capsule, full protocol in AGENTS.md.
<!-- /ANCHOR:questions -->
