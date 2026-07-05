---
title: "Packet 127: deep-agent-improvement cross-runtime promotion gate"
description: "Level 3 specification for hard four-runtime agent mirror verification and partial mirror recovery semantics."
trigger_phrases:
  - "packet 127"
  - "deep-agent-improvement cross-runtime promotion"
  - "mirror sync gate"
  - "DAI-006"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/007-cross-runtime-promotion"
    recent_action: "Implemented hard four-runtime mirror sync gate and authored Level 3 docs."
    last_updated_at: "2026-05-23T00:00:00Z"
    last_updated_by: "codex"
    next_safe_action: "Install local Vitest dependency or provide node_modules, then rerun the new Vitest file."
---
# Packet 127: deep-agent-improvement cross-runtime promotion gate

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Packet 127 closes three P1 items for `deep-agent-improvement`: a hard promotion gate for four-runtime agent mirror sync, explicit partial-runtime-success recovery semantics, and a reusable mirror verification helper. The promotion helper now rejects agent-definition promotion unless `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, and `.gemini/agents/` all contain the target agent and match the proposed body.

ADR-001 defines the Cross-Runtime Promotion Gate Contract. Codex TOML is compared by extracted `developer_instructions` body tokens instead of byte-equivalence, and partial mirror landings record `mirror_sync_state` with rollback as the default recovery action.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
| --- | --- |
| Level | 3 |
| Status | Implemented with Vitest runner blocked |
| Priority | P1 |
| Date | 2026-05-23 |
| Spec Folder | `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/007-cross-runtime-promotion/` |
| Target Skill | `.opencode/skills/deep-agent-improvement/` |
| Source Roadmap | `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/003-recommendations/improvement-roadmap.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Deep-agent-improvement can promote candidates that affect agent definitions, but the repository serves those agents through four runtime mirrors. Before this packet, promotion could check only for mirror presence via an opt-in flag. That left a failure mode where a candidate landed in one runtime while sibling runtime agents stayed stale or drifted.

The purpose is to make cross-runtime parity a promotion invariant for agent-definition targets and to give resume logic a machine-readable state when a previous operation left only N-of-4 mirrors landed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Hard promotion rejection for agent-definition targets when any of the four runtime mirrors is missing or content-drifted.
- Reusable `lib/mirror-sync-verify.cjs` helper returning present, missing, drift, and aggregate sync status.
- Codex TOML body-token comparison rather than TOML wrapper byte comparison.
- `mirror_sync_state` recording with `all_landed`, `partial:<runtime-list>`, and `verification_failed` states.
- Reducer/dashboard surfacing for mirror sync recovery state.
- Level 3 packet docs and ADR-001.

### Out of Scope

- Editing actual runtime agent definitions under `.opencode/agents/`, `.claude/agents/`, `.codex/agents/`, or `.gemini/agents/`.
- Changes to `deep-loop-runtime`, `deep-review`, `deep-research`, packet 128, or command YAMLs.
- Implementing an automatic mirror writer that mutates all four runtime files.

### Files to Change

| File Path | Change Type | Description |
| --- | --- | --- |
| `.opencode/skills/deep-agent-improvement/scripts/lib/mirror-sync-verify.cjs` | Create | Four-runtime mirror verifier. |
| `.opencode/skills/deep-agent-improvement/scripts/lib/promotion-gates.cjs` | Modify | Mirror sync state constants and gate evaluation. |
| `.opencode/skills/deep-agent-improvement/scripts/promote-candidate.cjs` | Modify | Hard gate plus structured rejection and state recording. |
| `.opencode/skills/deep-agent-improvement/scripts/reduce-state.cjs` | Modify | Resume/dashboard visibility for mirror sync state. |
| `.opencode/skills/deep-agent-improvement/scripts/tests/mirror-sync-verify.vitest.ts` | Create | Four-runtime verifier regression tests. |
| `.opencode/skills/deep-agent-improvement/references/*.md` | Modify | Promotion and mirror drift policy updates. |
| `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/005-deep-agent-improvement/007-cross-runtime-promotion/*` | Create | Level 3 docs and metadata. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
| --- | --- | --- |
| REQ-001 | Hard four-runtime sync gate | Promotion rejects agent-definition targets when any mirror is missing or drifted. |
| REQ-002 | Reusable verifier | `lib/mirror-sync-verify.cjs` exports `verifyMirrorSync(agentName, content, options)` returning `presentRuntimes`, `missingRuntimes`, `driftRuntimes`, and `allInSync`. |
| REQ-003 | Codex TOML exception | Codex mirror comparison extracts `developer_instructions` and compares body tokens, not TOML bytes. |
| REQ-004 | Partial state semantics | Promotion state records `mirror_sync_state` as `all_landed`, `partial:<list>`, or `verification_failed`. |
| REQ-005 | Resume recovery behavior | Reducer surfaces latest mirror sync state and recovery action; default recovery is rollback of partial mirrors. |
| REQ-006 | Regression coverage | New Vitest covers all-in-sync, missing mirror, and Codex body drift. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: All three P1 deliverables have implementation coverage.
- SC-002: Modified `.cjs` files pass `node --check`.
- SC-003: New Vitest file exists with the three requested fixtures.
- SC-004: Packet 127 strict validation exits 0.
- SC-005: Implementation summary includes the requested Commit Handoff section.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
| --- | --- | --- | --- |
| Dependency | Packet 124 mirror TODO | High | Replace opt-in presence check with hard content gate. |
| Dependency | Packet 126 promotion-gates helper | Medium | Extend existing helper instead of scattering state policy. |
| Risk | Codex TOML false drift | Medium | Compare extracted body tokens only. |
| Risk | Promotion becomes impossible for unsynced candidates | Medium | This is intentional; agent-definition promotion requires packaging parity first. |
| Risk | Partial mirror state lacks rollback automation | Medium | Record explicit default rollback action; actual agent files remain untouched by this packet. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Requirement | Target |
| --- | --- | --- |
| NFR-001 | Determinism | Same agent body and mirror files produce the same verifier result. |
| NFR-002 | Scope Control | No writes to actual runtime agent definitions. |
| NFR-003 | Compatibility | Existing promotion CLI required args remain unchanged; state file is optional. |
| NFR-004 | Operator Clarity | Mirror rejection is structured JSON with runtime lists. |
| NFR-005 | Reusability | Verifier helper is independent of `promote-candidate.cjs`. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Codex TOML exists but has no extractable `developer_instructions`: verifier marks Codex drift.
- Markdown mirrors differ only in runtime path references: runtime-specific path tokens are normalized.
- No mirrors are present: state becomes `verification_failed`.
- Some mirrors are present and some missing or drifted: state becomes `partial:<present-runtime-list>`.
- Promotion target is not an agent definition: existing promotion gates run without mirror sync enforcement.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Trigger |
| --- | ---: | --- |
| Scope | 16/25 | Promotion, helper, reducer, references, tests, docs. |
| Risk | 20/25 | Promotion gate affects canonical mutation safety. |
| Research | 14/20 | Requires 123/124/126 precedents and runtime mirror rules. |
| Multi-Agent | 6/15 | No sub-dispatch, but runtime agents are cross-runtime surfaces. |
| Coordination | 13/15 | Four runtime mirrors and resume semantics. |
| Total | 69/100 | Level 3 |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
| --- | --- | --- | --- | --- |
| R-001 | Token comparison misses semantic drift | Medium | Use symmetric token sets after runtime path normalization and keep drift details. |
| R-002 | Hard gate blocks previously allowed promotions | High | Limit enforcement to agent-definition targets only. |
| R-003 | Partial mirror rollback is only recorded | Medium | Packet scope forbids runtime agent writes; state directs operator/retry flow. |
| R-004 | Vitest runner unavailable locally | Medium | Test file is authored; local runner absence is documented until dependencies are installed. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Safe Agent Promotion

As a DAI operator, I want promotion to reject agent-definition candidates unless all four runtime mirrors match, so that one runtime cannot silently drift from another.

Acceptance: promotion returns `MIRROR_SYNC_GATE_FAILED` with missing and drift runtime lists when parity is incomplete.

### US-002: Codex Format-Aware Verification

As a maintainer, I want Codex TOML mirrors compared by body content, so that wrapper metadata does not create false failures.

Acceptance: a TOML wrapper difference passes when body tokens match, while Codex body drift fails.

### US-003: Resume After Partial Mirror Landing

As an operator resuming a failed promotion, I want a clear partial state and default recovery action, so that I know whether to retry mirrors, roll back, or pause for a decision.

Acceptance: state logs and reducer output show `mirror_sync_state` plus `recoveryAction`.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should a later packet add a dedicated four-runtime mirror writer that can safely land and rollback all agent mirrors?
- Should promotion state move from optional `--state-file` to a required packet-local runtime path once command YAMLs wire this helper?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Implementation plan: `plan.md`
- Task list: `tasks.md`
- Verification checklist: `checklist.md`
- Decision record: `decision-record.md`
- Implementation summary: `implementation-summary.md`
