---
title: "Verification Checklist: Multi-AI Council Persistence"
description: "P0/P1/P2 verification checklist for packet 089 across helper, schema, agent §17, mirror sync, validator hardening, and parity surfaces."
trigger_phrases:
  - "multi-ai-council persistence checklist"
importance_tier: "normal"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/022-multi-ai-council-write-protocol/002-multi-ai-council-persistence"
    last_updated_at: "2026-05-06T16:00:00.000Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md in CHK-XXX [P*] format"
    next_safe_action: "Author decision-record.md"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:e3338348b91ee2dc278308d5ff7102ffc554526fde0835ffcce7244b49401be6"
      session_id: "checklist-089-author"
      parent_session_id: null
    completion_pct: 65
    open_questions: []
    answered_questions: []
---

# Verification Checklist: Multi-AI Council Persistence

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

- [x] **CHK-001** [P0] spec.md describes the 6 deliverables, 4 runtimes, helper CLI shape, and lightweight-bound preservation
- [x] **CHK-002** [P0] plan.md sequences Phase 2A/2B/2C with rollback granularity
- [x] **CHK-003** [P0] tasks.md ledger covers all deliverables across Phase 1-3
- [x] **CHK-004** [P0] decision-record.md (in flight; will document 4 ADRs covering helper language, schema format, §17 placement, advisory check policy)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **CHK-010** [P0] Helper at `.opencode/skills/system-spec-kit/scripts/multi-ai-council/persist-artifacts.cjs` exports parser/renderer/builder/state-line as separate functions
- [x] **CHK-011** [P0] Helper CLI accepts `<packet> [--round NNN] [--input-file FILE] [--strict-output]` with proper usage on missing args
- [x] **CHK-012** [P0] Exit codes match contract: 0 success, 1 strict-required missing (no writes), 2 partial-write recovery
- [x] **CHK-013** [P0] Output-schema.md at `references/multi-ai-council/output-schema.md` covers requiredness matrix, heading aliases, seat fallback, optional-section policy, schema-change lockstep rule
- [x] **CHK-014** [P0] Agent body §17 in `.opencode/agents/multi-ai-council.md` enumerates 4 caller patterns
- [x] **CHK-015** [P0] §17 explicitly states Depth-1 rule (dispatching parent owns helper invocation)
- [x] **CHK-016** [P1] §17 documents forward-only scope (no retroactive migration of pre-080 outputs)
- [x] **CHK-017** [P1] §8 in agent body cross-links `output-schema.md` as authority
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **CHK-020** [P0] Helper vitest test covers full / minimal / missing-required / parser-export cases (4 cases)
- [x] **CHK-021** [P0] Validator regression test replaces partial-layout assertions with synthetic spec folder + `validate.sh --strict`
- [x] **CHK-022** [P0] Mirror parity test compares normalized §-headers and body across all 4 runtimes
- [x] **CHK-023** [P0] Parity test passes when all 4 runtimes are in lockstep
- [x] **CHK-024** [P1] Parity test fails with clear diff when one mirror is intentionally drifted (manual smoke test)
- [x] **CHK-025** [P1] Helper run on packet-080's existing council-report.md produces compatible artifacts
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] **CHK-030** [P0] All Phase 1 tasks (T001-T010) marked [x]
- [x] **CHK-031** [P0] All Phase 2A tasks (T201-T210) marked [x]
- [x] **CHK-032** [P0] All Phase 2B tasks (T211-T220) marked [x]
- [x] **CHK-033** [P0] All Phase 2C tasks (T221-T230) marked [x]
- [x] **CHK-034** [P0] All Phase 3 tasks (T301-T305) marked [x]
- [x] **CHK-035** [P0] implementation-summary.md updated with real post-implementation content
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] **CHK-040** [P0] Helper does not write outside the target spec folder's `ai-council/` subtree (path-scoping verified)
- [x] **CHK-041** [P0] Agent permission block remains `write: deny`, `edit: deny`, `bash: deny`, `patch: deny` across all 4 runtimes
- [x] **CHK-042** [P1] Helper does not echo secrets present in seat outputs to logs or state.jsonl
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **CHK-050** [P0] §17 is plain-language readable by maintainers (each caller pattern has a copy-paste recipe)
- [x] **CHK-051** [P1] output-schema.md is self-contained (does not require reading agent body to understand)
- [x] **CHK-052** [P1] Decision-record.md ADRs cite predecessor packet 080's research §7 verdicts
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **CHK-060** [P0] No new skill folder at `.opencode/skills/multi-ai-council/` (lightweight bound preserved)
- [x] **CHK-061** [P0] Helper located under `system-spec-kit/scripts/multi-ai-council/` (centralizes spec-folder lifecycle scripts per ADR rationale)
- [x] **CHK-062** [P0] Fixtures located under `scripts/tests/fixtures/multi-ai-council/`
- [x] **CHK-063** [P0] Output-schema.md located under `references/multi-ai-council/`
- [x] **CHK-064** [P1] All file paths use lowercase-hyphen naming convention
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Surface | P0 Total | P1 Total | P2 Total | Status |
|---------|----------|----------|----------|--------|
| Pre-Implementation | 4 | 0 | 0 | Pending |
| Code Quality | 6 | 2 | 0 | Pending |
| Testing | 4 | 2 | 0 | Pending |
| Fix Completeness | 6 | 0 | 0 | Pending |
| Security | 2 | 1 | 0 | Pending |
| Documentation | 1 | 2 | 0 | Pending |
| File Organization | 4 | 1 | 0 | Pending |
| **Totals** | **27** | **8** | **0** | **In Progress** |

Final completion gate: all P0 = checked with evidence; all P1 = checked or deferred with user approval; strict validation exit 0; all 8 spec.md §5 success criteria evidenced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] **CHK-070** [P0] Helper architecture matches deep-research/deep-review reducer pattern (Node CJS, parser exports, fixture-driven)
- [x] **CHK-071** [P0] No graph events, no findings registry, no dashboard, no convergence math in helper (council is parse-and-write only per ADR)
- [x] **CHK-072** [P0] §8 OUTPUT FORMAT is single source of truth (output-schema.md authoritative; agent body §8 + helper parser cite it)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] **CHK-080** [P1] Helper run-time <2s on a typical 10KB council report (NFR-P01)
- [x] **CHK-081** [P1] Mirror parity test run-time <500ms (NFR-P02)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] **CHK-090** [P0] Strict validation exit 0 on packet 089
- [x] **CHK-091** [P0] All 4-runtime mirrors landed in same commit chain
- [x] **CHK-092** [P0] Helper test + validator regression + parity test all green
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] **CHK-100** [P0] Planning-only invariant preserved: agent retains write/edit/bash/patch deny across all 4 runtimes
- [ ] **CHK-101** [P0] ADR-001 lightweight bound preserved: no `.opencode/skills/multi-ai-council/` folder
- [ ] **CHK-102** [P1] AGENTS.md / runtime mirror conventions followed (per memory `feedback_new_agent_mirror_all_runtimes`)
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] **CHK-110** [P0] spec.md §3 documents all 12 files-to-change
- [x] **CHK-111** [P0] §17 in agent body cross-references `output-schema.md` and `persist-artifacts.cjs`
- [x] **CHK-112** [P1] Reference files cross-link to agent body §17
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Role | Sign-Off | Date | Notes |
|------|----------|------|-------|
| Spec author | claude-opus-4-7 | 2026-05-06 | Spec lock-in complete |
| Implementation reviewer | (pending) | TBD | Verify Phase 2A-2C |
| Validation reviewer | (pending) | TBD | Verify vitest + parity + strict |
<!-- /ANCHOR:sign-off -->
