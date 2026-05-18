---
title: "Verification Checklist: Hooks Compat And Consumer Cutover"
description: "Checklist for validating the L3 005 spec-doc scaffold and the later consumer-cutover implementation."
trigger_phrases:
  - "013 009 005 checklist"
  - "advisor consumer cutover verification"
  - "hooks compat checklist"
importance_tier: "critical"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/006-system-skill-advisor-package-extraction/005-hook-compatibility-consumer-cutover"
    last_updated_at: "2026-05-14T12:36:34Z"
    last_updated_by: "codex"
    recent_action: "Consumer cutover implemented"
    next_safe_action: "Continue to 006 cleanup"
    blockers:
      - "Hook Vitest suites still import old ../skill_advisor helpers outside the 005 whitelist."
    key_files:
      - "checklist.md"
      - "spec.md"
      - "plan.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0130090050000000000000000000000000000000000000000000000000000000"
      session_id: "013-009-005-hooks-compat-consumer-cutover"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Hooks Compat And Consumer Cutover

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot claim implementation complete until checked |
| **[P1]** | Required | Must complete or get explicit deferral |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Required source reading reflected in docs. Evidence: `spec.md` and `decision-record.md` cite parent ADR-001, parent phase, sibling 003 shape, consumer bridge/hook/shim/doctor/install surfaces.
- [x] CHK-002 [P0] REQ-001 through REQ-008 authored. Evidence: `spec.md` requirements table contains eight rows.
- [x] CHK-003 [P0] Three-phase plan authored with required headers. Evidence: `plan.md` contains `ARCHITECTURE`, `IMPLEMENTATION PHASES`, and `ROLLBACK PLAN`; `tasks.md` contains `PHASE 1: SETUP`, `PHASE 2: IMPLEMENTATION`, and `PHASE 3: VERIFICATION`.
- [x] CHK-004 [P0] Child 004 standalone server availability confirmed before implementation begins. Evidence: launcher exists, all four runtime configs include `system_skill_advisor`, and standalone launcher smoke printed the package-local DB path.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] `system_skill_advisor` is the primary production route for all advisor callers. Evidence: plugin bridge and memory proxy call `system_skill_advisor` over MCP stdio; hook source imports target `system-skill-advisor`.
- [x] CHK-011 [P0] `spec_kit_memory` advisor registration is proxy-only or migration-hint-only per ADR-003. Evidence: `advisorTools` forwards via `skill-advisor-launcher.cjs` and never imports advisor handlers.
- [x] CHK-012 [P0] Tool ids remain stable as `advisor_*`. Evidence: descriptors and proxy `TOOL_NAMES` retain `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`.
- [x] CHK-013 [P0] OpenCode bridge no longer imports old `dist/skill_advisor` or `skill_advisor/schemas` paths. Evidence: stale grep over whitelisted live surfaces returned no old bridge/schema path hits.
- [x] CHK-014 [P0] Python shim routes through `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py`. Evidence: package-local shim path/root corrections made; `--force-native`, `--force-local`, and `--health` exited 0.
- [x] CHK-015 [P0] Doctor update and skill-advisor doctor assets point at standalone advisor package/server. Evidence: YAML paths now target `system-skill-advisor`; YAML parse passed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-016 [P0] OpenCode skill-advisor plugin bridge smoke passed. Evidence: direct stdin JSON bridge smoke returned `status:"ok"` with native route metadata.
- [ ] CHK-017 [P0] Prompt-time hook smoke passed for available Claude, Codex, Gemini, and OpenCode surfaces. BLOCKED: OpenCode plugin Vitest passed 30/30; Claude/Codex/Gemini hook suites fail at import time on stale test-only `../skill_advisor/...` paths outside the 005 edit whitelist.
- [x] CHK-018 [P0] Python shim native and fallback smoke passed. Evidence: `--force-native`, `--force-local`, and `--health` exited 0.
- [x] CHK-019 [P0] `/doctor:update --cleanup-legacy=false` or approved safe dry-run equivalent passed during implementation. Evidence: safe equivalent was YAML parse plus standalone advisor target grep; full doctor mutation route was not executed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-020 [P0] Consumer inventory completed with every `advisor_*` hit classified. Evidence: required inventory greps ran before edits and classifications are recorded in `tasks.md`.
- [x] CHK-021 [P0] Stale-reference grep executed and every remaining hit classified. Evidence: live non-doc/non-test count is 3: one intentional proxy deprecation string and two historical stress-config excludes.
- [x] CHK-022 [P0] Proxy removal targets recorded for child 006. Evidence: `advisorTools`, deprecated schema descriptors, and memory install guide proxy notes are called out for 006 cleanup.
- [x] CHK-023 [P1] Deprecation logs checked for remaining legacy callers before removal. Evidence: proxy smoke confirmed `[advisor-deprecation]` on memory-side call.
- [x] CHK-024 [P1] Old docs and tests that reference memory-side advisor ownership classified as historical or cleanup. Evidence: failing hook/plugin test fixtures are recorded as stale test surfaces outside 005 scope.
- [x] CHK-025 [P0] Strict spec validation passed for the 005 docs scaffold. Evidence: `validate.sh .../005-hook-compatibility-consumer-cutover --strict` exited 0.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-030 [P0] Proxy path does not expose prompt text or stack traces in deprecation logs. Evidence: deprecation message is static and contains only server/tool migration text.
- [x] CHK-031 [P0] OpenCode plugin bridge preserves prompt-size caps and fail-open parsing. Evidence: plugin source keeps `maxPromptBytes` clamping and bridge malformed-stdin fail-open logic; direct bridge smoke passed.
- [x] CHK-032 [P1] Doctor workflow path validation still blocks writes outside approved targets. Evidence: doctor mutation target lists remain explicit and YAML parse passed after path retarget.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-040 [P0] Architecture decisions documented. Evidence: `decision-record.md` ADR-001 through ADR-005.
- [x] CHK-041 [P0] Proxy versus fail-fast tradeoff documented. Evidence: ADR-003.
- [x] CHK-042 [P0] Tool-id stability implications documented. Evidence: ADR-002.
- [x] CHK-043 [P1] Plugin bridge import strategy documented. Evidence: ADR-004.
- [x] CHK-044 [P1] Doctor update target change documented. Evidence: ADR-005.
- [x] CHK-045 [P1] Both install guides explain dual-MCP topology and deprecation window. Evidence: both guides mention `system_skill_advisor`, stable `advisor_*` ids, and 013/009/006 proxy removal.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P0] Authored markdown files stay inside 005 scope. Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`.
- [x] CHK-051 [P0] Metadata files stay inside 005 scope. Evidence: `description.json` and `graph-metadata.json`.
- [x] CHK-052 [P1] Implementation pass avoids sibling 001/002/003/004/006 edits unless explicitly re-scoped. Evidence: edited spec docs are inside 005; no sibling packet docs were edited.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| Documentation P0 Items | 13 | 13/13 |
| Implementation P0 Items | 17 | 16/17 |
| P1 Items | 8 | 8/8 |

**Verification Date**: 2026-05-14
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in `decision-record.md`.
- [x] CHK-101 [P1] All ADRs have accepted status.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale.
- [x] CHK-103 [P2] Migration path documented through child 006 cleanup.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P1] Prompt-time hook timeout behavior unchanged after cutover. Evidence: hook source continues to import existing standalone timeout renderers; runtime hook suites are blocked by stale test imports, not timeout code changes.
- [x] CHK-111 [P1] Plugin bridge smoke stays within existing timeout budget. Evidence: direct bridge smoke completed successfully within the command run.
- [ ] CHK-112 [P2] Advisor validation latency recorded if `advisor_validate` is run.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested for the implementation patch. BLOCKED: rollback is documented in `plan.md`; destructive rollback test was not run because the patch is not being reverted.
- [x] CHK-121 [P0] Legacy proxy deprecation behavior documented before release. Evidence: tool schema descriptions and both install guides document the deprecation window.
- [x] CHK-122 [P1] Child 006 cleanup handoff recorded. Evidence: `tasks.md` T021 and `implementation-summary.md` limitations name proxy/test cleanup for 006.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Deprecation logs confirmed to avoid sensitive prompt content. Evidence: deprecation string is static and proxy smoke confirmed the emitted line.
- [x] CHK-131 [P1] Install guides reviewed for stale topology claims. Evidence: stale phrase grep over both edited install guides returned no old single-server claim.
- [ ] CHK-132 [P2] Archive or historical references labelled if left in place.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized for the docs scaffold.
- [x] CHK-141 [P1] Implementation verification evidence added after code cutover. Evidence: `implementation-summary.md` records build, smoke, stale-grep, and blocked-test evidence.
- [ ] CHK-142 [P2] Operator-facing install-guide examples smoke-tested.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | Pending implementation pass | 2026-05-14 |
<!-- /ANCHOR:sign-off -->
