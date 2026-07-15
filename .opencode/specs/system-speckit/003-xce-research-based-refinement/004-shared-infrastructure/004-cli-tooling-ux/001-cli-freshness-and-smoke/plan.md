---
title: "Implementation Plan: CLI Freshness Gate Fix and Offline Smoke"
description: "Make the spec-memory freshness gate content-hash durable, surface an actionable stale-dist plugin status, and add a daemon-free offline smoke check of the 37/8/9 list-tools counts."
trigger_phrases:
  - "001-cli-freshness-and-smoke plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/004-shared-infrastructure/004-cli-tooling-ux/001-cli-freshness-and-smoke"
    last_updated_at: "2026-06-11T03:00:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Delivered content-hash freshness gates, stale-dist status surfacing, and offline smoke"
    next_safe_action: "Proceed to sibling CLI tooling UX sub-phases if needed"
    blockers: []
    key_files:
      - ".opencode/bin/spec-memory.cjs"
      - ".opencode/bin/code-index.cjs"
      - ".opencode/bin/skill-advisor.cjs"
      - ".opencode/bin/cli-offline-smoke.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-001-cli-freshness-and-smoke"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: CLI Freshness Gate Fix and Offline Smoke

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js shim (`.cjs`), TypeScript (mcp_server), tsc --build incremental |
| **Framework** | Spec Kit Memory MCP daemon + CLI front-door shim |
| **Storage** | n/a (offline check; no daemon, build, or scan) |
| **Testing** | vitest + offline smoke script run |

### Overview
Replace the mtime-based freshness gate with a content-hash gate (or make the build always touch dist), surface an actionable stale-dist state in plugin status while keeping stderr sanitized, and add one offline smoke command/script that verifies the 37/8/9 list-tools counts and stale-dist health with no daemon, build, or scan.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical fix to the spec-memory shim freshness gate plus an additive offline smoke script; plugin-status change is additive and keeps stderr sanitized.

### Key Components
- **Freshness gate (`spec-memory.cjs:24-42`)**: content-hash comparison of watched sources vs dist, or build-touches-dist invariant
- **Plugin status (`mk-spec-memory-bridge.mjs:266-280`)**: classify stale-dist into an actionable state; sanitized stderr marker preserved
- **Offline smoke script**: runs the three `list-tools` enumerations offline and asserts 37/8/9 + stale-dist verdict

### Data Flow
shim invocation -> freshness gate (content hash) -> dispatch OR actionable stale-dist exit; smoke script -> three offline list-tools -> assert counts + health -> pass/fail exit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Surfaces and verification live in the spec Files-to-Change table and the tasks below. Stale-dist gate is the bug; keep stderr sanitized as a hard guardrail.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/bin/spec-memory.cjs` freshness gate | mtime gate, trips on mtime-only bump | Make content-hash durable | Plain rebuild restores freshness; mtime-only touch no longer false-positives |
| `mk-spec-memory-bridge.mjs` status | redacts stderr, generic skipped/fail-open | Classify stale-dist, keep stderr sanitized | Status payload shows actionable stale-dist; raw stderr still redacted |
| Offline smoke script | none today | Create | Reports 37/8/9 + stale-dist health, no daemon/build/scan |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Reproduce the mtime-only stale-`69` false-positive on a content-clean dist
- [x] Confirm `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` yields `count=37` (gate-bug confirmation)

### Phase 2: Core
- [x] Implement content-hash freshness gate (or build-touches-dist invariant)
- [x] Classify stale-dist into an actionable plugin status; keep stderr sanitized
- [x] Add the offline smoke command/script for 37/8/9 + stale-dist health

### Phase 3: Verification
- [x] Plain rebuild restores freshness; mtime-only touch does not trip the gate
- [x] Smoke run reports 37/8/9 + stale-dist verdict with no daemon/build/scan
- [x] Plugin status shows actionable stale-dist with sanitized stderr
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Freshness-gate hash logic | vitest |
| Integration | Offline smoke 37/8/9 + stale-dist | smoke script run |
| Regression | mtime-only churn no longer trips gate | vitest + manual repro |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Parity playbook scenario (`cli-list-tools-parity.md:32-56`) | Internal | Available | Smoke reuses it as scenario source of truth |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Freshness-gate change masks a genuinely stale dist, or smoke check false-passes.
- **Procedure**: Revert the gate change; smoke script is additive and can be disabled independently.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
