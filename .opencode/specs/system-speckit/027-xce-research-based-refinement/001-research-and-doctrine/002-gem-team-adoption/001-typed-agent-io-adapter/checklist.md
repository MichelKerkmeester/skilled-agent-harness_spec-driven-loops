---
title: "Verification Checklist: 027/006/001 Typed Agent I/O Adapter"
description: "Verification checklist for the optional typed agent I/O adapter: shared contract, optional dispatch header and result envelope, Wave-1 planning wiring, and full backward compatibility."
trigger_phrases:
  - "027 phase 006/001"
  - "typed agent io adapter"
  - "agent-io-contract"
  - "AGENT_IO_DISPATCH header"
  - "AGENT_IO_RESULT envelope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed checklist evidence for typed agent I/O adapter"
    next_safe_action: "Ready for handoff"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-001-typed-agent-io-adapter-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: 027/006/001 Typed Agent I/O Adapter

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

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach documented in `plan.md`.
- [x] CHK-003 [P0] The five target agent docs, runtime mirrors, and the two plan YAMLs read before editing.
- [x] CHK-004 [P1] Preservation baseline captured (`@code` first-line `RETURN:`; `@context` six required sections).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `agent-io-contract.md` exists with `schema_version` and the five grouped sections; every field documented as optional.
- [x] CHK-011 [P0] The `AGENT_IO_RESULT` envelope is documented as appended AFTER the existing body, never before `@code`'s first-line `RETURN:`.
- [x] CHK-012 [P0] The numeric-to-band confidence mapping is defined and the numeric value is derived from the band.
- [x] CHK-013 [P1] The optional sections follow existing agent-doc structure and reference the shared contract rather than restating divergent copies.
- [x] CHK-014 [P1] The dispatch header stays compact (target under 15 lines) to avoid bloating the planning fan-out.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] An agent that emits NO `AGENT_IO_RESULT` envelope still works unchanged and `@orchestrate` falls back to the existing markdown contract.
- [x] CHK-021 [P0] The four `@context` dispatches in `/speckit:plan` Step 5 emit the `AGENT_IO_DISPATCH` header in both `speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml`.
- [x] CHK-022 [P0] `@orchestrate` documents and follows the never-reject-envelope-less degrade path.
- [x] CHK-023 [P0] `@code`'s first-line `RETURN:` contract is preserved (grep-confirmed) after the additive edit.
- [x] CHK-024 [P0] `@context`'s six required Context-Package sections are preserved and no seventh required section was added.
- [x] CHK-025 [P1] `failure_type` is mapped from existing `@code` escalation classes and `@review` P0/P1/P2 severities, with no net-new taxonomy imported.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class documented as `cross-consumer` for the shared contract that `@orchestrate` and the four leaf agents consume.
- [x] CHK-FIX-002 [P0] Same-class producer inventory confirms `@orchestrate` is the only dispatch-header emitter and result-envelope consumer in Wave-1 scope.
- [x] CHK-FIX-003 [P0] Consumer inventory confirms the existing canonical surfaces (`@code` `RETURN:`, `@context` six sections, `@review` severities) are preserved.
- [x] CHK-FIX-004 [P1] Out-of-wave surfaces (`/speckit:implement`, `/speckit:complete`, `/deep:start-review-loop`, `/deep:start-research-loop`, `/memory:save`) confirmed unchanged.
- [x] CHK-FIX-005 [P1] The `context_snapshot` one-shot-versus-progressive decision is recorded as one-shot in `plan.md` and contract headers.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the contract doc or agent edits.
- [x] CHK-031 [P0] No new network, provider, or runtime-execution behavior introduced (docs/contract only).
- [x] CHK-032 [P1] Governance stays authoritative: Four Laws, Gate 3, and Logic-Sync text in `AGENTS.md` unchanged except the small optional/advisory pointer.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, and `tasks.md` remain synchronized.
- [x] CHK-041 [P1] `agent-io-contract.md` is versioned and its grouped sections leave room for 002/003 to extend within a group.
- [x] CHK-042 [P2] Validators (`validate.sh`, `check-completion.sh`, `spec-doc-structure`) confirmed unchanged (advisory contract, no enforcement).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files left outside this packet.
- [x] CHK-051 [P1] No files outside the approved logical surfaces, runtime mirrors, YAML assets, `AGENTS.md`, contract doc, and phase docs changed during implementation.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-10
<!-- /ANCHOR:summary -->
</content>
