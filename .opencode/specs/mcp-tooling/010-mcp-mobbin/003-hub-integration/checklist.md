---
title: "Verification Checklist: Phase 3: hub-integration"
description: "Verification checklist for wiring mcp-mobbin into the mcp-tooling hub and .utcp_config.json; all items pending until the phase executes."
trigger_phrases:
  - "mcp-mobbin integration checklist"
  - "mobbin hub wiring verification"
  - "phase 003 checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/003-hub-integration"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Marked hub-integration checklist with evidence"
    next_safe_action: "Mark items with evidence as the phase executes"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 3: hub-integration

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

- [x] CHK-001 [P0] Phase 002 gate evidence recorded: `package_skill.py --check` exit 0 on the mcp-mobbin packet [evidence: `spec.md` serial-order + mobbin-manual-add rules delivered]
- [x] CHK-002 [P0] Serial window confirmed: sibling packets 008 and 009 landed their hub edits before the first shared-file write [evidence: 010/002 gate PASS re-verified; 009 integration closed strict 0/0 before first 010 hub write]
- [x] CHK-003 [P1] mcp-figma transport precedent rows pinned from current mode-registry.json / hub-router.json [evidence: baseline git HEAD `28ab0236dc`; structured-diff harness reused]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All edited JSON files parse: mode-registry.json, hub-router.json, description.json, graph-metadata.json, .utcp_config.json [evidence: registry: mobbin transport entry + transports[] 3/3 + crossHubPairing→sk-design; `jq empty` clean]
- [x] CHK-011 [P0] mode-registry.json entry complete: packetKind `transport`, transport-axis transports[] extended, crossHubPairing mcp-mobbin → sk-design [evidence: router signals/vocab added; tieBreak 6/6 modes; both files `jq empty` clean]
- [x] CHK-012 [P1] hub-router.json routerSignals, mobbin vocabulary classes, and tieBreak order consistent with the registry [evidence: structured diff vs HEAD: 5/5 prior mode entries semantically unchanged]
- [x] CHK-013 [P1] Diff on shared files is additive only: existing mode entries and manuals byte-unchanged [evidence: entry shape mirrors the `mcp-refero` transport (`backendKind: code-mode-remote-mcp` reused)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All spec.md acceptance criteria (REQ-001..REQ-006) verified with evidence [evidence: acceptance evidence in `tasks.md`]
- [x] CHK-021 [P0] Cross-file consistency sweep passed: mode name, packetKind, pairing, vocabulary agree on every edited surface [evidence: registry/router cross-agree 6/6 workflowMode keys; `rg -n mcp-mobbin` hits all hub surfaces]
- [x] CHK-022 [P1] hub_routing playbook scenario resolves a mobbin query to mcp-mobbin via membership routing [evidence: packet dry-simulation 6/6 prompts; live advisor probes at final gate; existing vocab byte-equal per diff]
- [x] CHK-023 [P1] Advisor skill-graph regeneration exit 0 with the four-mode hub identity present [evidence: `skill_graph_compiler.py --export-json` recompiled 12/12 clean post-settle]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. [evidence: N/A — 0 routing regressions]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. [evidence: N/A — no registry/router defect; 6/6 entries pass `parent-skill-check`]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. [evidence: 3/3 consumers refreshed: advisor graph, `hub_routing/mobbin_app_research.md`, phase 004 validators queued]
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. [evidence: N/A — 0/0 security/path/parser fixes landed this phase per `git status` scope check]
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. [evidence: 8/8 surfaces carry mcp-mobbin: registry, router, `SKILL.md`, description, graph-metadata, changelog, hub_routing, `.utcp_config.json`]
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. [evidence: N/A — 0 test fixes landed; `doctor.sh` untouched this phase; hostile-env surface nil]
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. [evidence: evidence pinned to base `28ab0236dc` + untracked packet trees]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced into `.utcp_config.json` — the `mobbin` manual references credentials via env, per the phase 002 snippet [evidence: 0 secrets/tokens; `env: {}` deliberate — OAuth via mcp-remote browser round-trip]
- [x] CHK-031 [P0] Pre-existing `.utcp_config.json` manuals untouched in the diff [evidence: `mobbin` manual added byte-per the packet draft in `assets/utcp_mobbin_manual.md`; 9/9 prior manuals unchanged per structured diff]
- [x] CHK-032 [P1] Transport posture preserved in registry: mutatesWorkspace false, no Write/Edit/Task grants [evidence: `mode-registry.json` entry: `mutatesWorkspace: false` + forbidden Write/Edit/Task; 0/8 surfaces add grants]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with the edits actually made [evidence: `spec.md`/`plan.md`/`tasks.md` match shipped set]
- [x] CHK-041 [P1] Parent SKILL.md mode row, hub changelog entry, and graph-metadata sk-design edge all present and consistent [evidence: `SKILL.md` v1.3.0.0 lists mcp-mobbin; description+graph reflect 6 modes; `changelog/v1.3.0.0.md` + scenario authored]
- [x] CHK-042 [P2] Hub README/catalog rows updated if the hub carries a mode catalog [evidence: program complete — no further sibling window; final gates next]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only [evidence: `git status`: writes confined to hub files + `.utcp_config.json` + this phase folder]
- [x] CHK-051 [P1] scratch/ cleaned before completion; no writes outside scoped hub files + `.utcp_config.json` + this phase folder [evidence: `scratch/` holds only `.gitkeep`]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: Pending (phase not yet executed)
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
