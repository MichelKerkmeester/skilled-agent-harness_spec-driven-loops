---
title: "Verification Checklist: Multi-AI Council Output Protocol"
description: "P0/P1/P2 verification checklist for packet 080 across spec, agent, references, validator, and smoke-test surfaces."
trigger_phrases:
  - "ai-council checklist"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/015-multi-ai-council-output-protocol"
    last_updated_at: "2026-05-06T11:30:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Refactored checklist.md to CHK-XXX [P*] format"
    next_safe_action: "Verify P0 items as Phase 2 lands"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:2f5344b67e89c20565cd80121dbf9b0bd10bcf5c2a0de2aad6db24419c896ba9"
      session_id: "checklist-080-author"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---

# Verification Checklist: Multi-AI Council Output Protocol

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

- **P0** items are blockers — all must be checked with evidence (commit SHA, file path, or test output) before completion.
- **P1** items are required — must be checked OR explicitly deferred with reason.
- **P2** items are suggestions — review and lift-or-document.
- Items use `**CHK-XXX** [P*]` format per validator policy.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] **CHK-001** [P0] Spec.md describes the `ai-council/` folder layout, file shapes, and invocation contract unambiguously
- [x] **CHK-002** [P0] Plan.md sequences 3 phases with clear scope per phase
- [x] **CHK-003** [P0] Tasks.md ledger covers all required deliverables across Phase 1-3
- [x] **CHK-004** [P0] Checklist.md (this file) is authored before Phase 2 begins
- [x] **CHK-005** [P0] Decision-record.md documents 4 ADRs covering lightweight bound, folder layout, state schema, validator policy
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-010** [P0] Agent body in `.opencode/agents/multi-ai-council.md` documents the new output protocol (§13-§16; 683 LOC)
- [x] **CHK-011** [P0] Agent body stays under 750 LOC (current 683)
- [x] **CHK-012** [P0] Agent retains `write: deny` on source files; planning-only invariant preserved (orchestrator-level writes to `ai-council/` are a follow-on)
- [x] **CHK-013** [P0] All 4 runtime mirrors (`.opencode`, `.claude`, `.codex`, `.gemini`) agree on output protocol (4 sections each)
- [x] **CHK-014** [P1] Reference files under `system-spec-kit/references/multi-ai-council/` are concise (27-68 LOC each, under 300)
- [x] **CHK-015** [P1] No new skill folder created at `.opencode/skills/multi-ai-council/` (verified absent)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-020** [P0] Vitest regression test confirms validator does not flag `ai-council/` as unknown (codex dispatch reported targeted run passed: 1 file, 2 tests)
- [x] **CHK-021** [P0] Strict validation exit 0 on packet 080 after all phases land (validate.sh --strict)
- [x] **CHK-022** [P0] Smoke test: dispatched `@multi-ai-council` on packet 080 (round 1, then round 2). Canonical `ai-council/` artifacts produced via orchestrator-mediated persistence (agent stayed `write: deny`; Claude Code wrote artifacts based on agent's plan output): config + strategy + state.jsonl (14 append-only events) + 6 seat files + 2 deliberations + 1 critique + council-report.md.
- [x] **CHK-023** [P1] Round 2 produced `seats/round-002/`, `deliberations/round-002.md`, `critiques/round-002-critique.md` ALONGSIDE round-001 files (no overwrite of round-001). Round-2 verdict: "round-1 amended with addendum" — 6 refinements (ADD-1 through ADD-6) folded into council-report.md and packet-081 scope.
- [x] **CHK-024** [P1] State.jsonl schema documented with examples in `references/multi-ai-council/state-format.md` (68 LOC, includes worked examples and resume semantics)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] **CHK-030** [P0] Phase 1 tasks T001-T009 marked [x] in tasks.md (T010 deferred to combined commit)
- [x] **CHK-031** [P0] Phase 2 tasks T101-T114 marked [x] in tasks.md (T115 deferred to combined commit)
- [x] **CHK-032** [P0] Phase 3 tasks T201-T203, T207-T208, T210 marked [x]; T204-T206 deferred with reason (smoke-test agent permission gap)
- [x] **CHK-033** [P0] implementation-summary.md updated with real post-implementation content
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] **CHK-040** [P0] Agent permission block unchanged for source files (write/edit/bash/patch remain deny — verified across 4 runtimes)
- [x] **CHK-041** [P1] State.jsonl format documents that secrets must not be written to seat outputs or state events (agent body §15 + state-format.md)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-050** [P0] Agent body §13 Output Protocol section is plain-language readable (ASCII tree + bullet contracts)
- [x] **CHK-051** [P1] No README §3 agent count change required — @multi-ai-council was already documented; protocol additions are internal to its body
- [x] **CHK-052** [P1] Decision-record.md ADR-001 cites the lightweight bound (no skill folder) explicitly
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-060** [P0] `ai-council/` subfolder convention documented in spec.md §3 Files-to-Change and references throughout
- [x] **CHK-061** [P0] `system-spec-kit/references/multi-ai-council/` contains 4 reference files (folder-layout, seat-diversity-patterns, convergence-signals, state-format)
- [x] **CHK-062** [P0] No new skill folder at `.opencode/skills/multi-ai-council/` (verified absent)
- [x] **CHK-063** [P1] Reference files use lowercase-hyphen naming convention
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Surface | P0 Total | P1 Total | P2 Total | Status |
|---------|----------|----------|----------|--------|
| Pre-Implementation | 5 | 0 | 0 | Pending |
| Code Quality | 4 | 2 | 0 | Pending |
| Testing | 3 | 2 | 0 | Pending |
| Fix Completeness | 4 | 0 | 0 | Pending |
| Security | 1 | 1 | 0 | Pending |
| Documentation | 1 | 2 | 0 | Pending |
| File Organization | 3 | 1 | 0 | Pending |
| **Totals** | **21** | **8** | **0** | **In Progress** |

Final completion gate: all P0 = checked with evidence; all P1 = checked or deferred with user approval; strict validation exit 0; all 7 spec.md §5 success criteria evidenced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] **CHK-070** [P0] `ai-council/` mirrors the `research/` and `review/` structural conventions per ADR-002
- [ ] **CHK-071** [P0] No skill folder created (lightweight bound preserved per ADR-001)
- [ ] **CHK-072** [P0] State.jsonl schema documented per ADR-003 (convention-only validation for v1)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] **CHK-080** [P1] Validator overhead for `ai-council/` recognition <10ms per packet (NFR-P02)
- [ ] **CHK-081** [P1] Council dispatch round-trip <5 minutes for 3 seats at default models (NFR-P01)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] **CHK-090** [P0] Strict validation exit 0 on packet 080
- [ ] **CHK-091** [P0] All 4-runtime mirrors landed in same commit chain
- [ ] **CHK-092** [P0] Vitest regression test added and green
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] **CHK-100** [P0] Plan-only safety preserved: agent retains `write: deny` on source files
- [ ] **CHK-101** [P1] AGENTS.md / runtime mirror conventions followed (per memory `feedback_new_agent_mirror_all_runtimes`)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] **CHK-110** [P0] spec.md §4 documents `ai-council/` folder layout fully
- [ ] **CHK-111** [P0] Agent body §Output Protocol matches spec §4 layout
- [ ] **CHK-112** [P1] Reference files cross-link to agent body §Output Protocol
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Sign-Off | Date | Notes |
|------|----------|------|-------|
| Spec author | claude-opus-4-7 | 2026-05-06 | Spec lock-in complete |
| Implementation reviewer | (pending Phase 2 completion) | TBD | Verify agent body + mirrors |
| Validation reviewer | (pending Phase 3 completion) | TBD | Verify vitest + smoke test |
<!-- /ANCHOR:sign-off -->
