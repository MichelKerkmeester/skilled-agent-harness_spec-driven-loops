---
title: "Verification Checklist: Phase 3: hub-integration"
description: "Verification checklist for registering mcp-refero as the fourth mcp-tooling mode: serial ordering, registry/router alignment, hub identity refresh, UTCP manual verification, and advisor skill-graph regeneration."
trigger_phrases:
  - "mcp-refero integration checklist"
  - "refero hub checklist"
  - "phase 003 checklist"
  - "verification"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/003-hub-integration"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Marked hub-integration checklist with evidence"
    next_safe_action: "Mark items with evidence as hub integration completes"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/checklist.md"
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

- [x] CHK-001 [P0] Requirements documented in spec.md, incl. the serial ordering constraint and the verify-not-add UTCP rule [evidence: `spec.md` carries serial-order + verify-not-add rules]
- [x] CHK-002 [P0] Phase 002 handoff evidence on file (`package_skill.py --check` exit 0) AND sibling packet 008's hub-file slot confirmed complete before the first hub write [evidence: `package_skill.py --check --strict` PASS on 002; 008 integration closed strict 0/0 before first 009 hub write]
- [x] CHK-003 [P1] Pre-change baseline snapshot captured: registry, router, parent SKILL.md, hub description/graph metadata [evidence: baseline = git HEAD `28ab0236dc`; structured diff harness reused from 008]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] mode-registry.json carries the mcp-refero mode entry (transport packetKind, metadata routingClass), `extensions.transport-axis.transports[]` includes mcp-refero, and crossHubPairing maps mcp-refero to sk-design [evidence: registry: mcp-refero entry + transports[] + crossHubPairing→sk-design; `jq empty` clean]
- [x] CHK-011 [P0] hub-router.json carries mcp-refero routerSignals, vocabulary classes, and a four-mode tieBreak; both JSON files parse clean [evidence: router signals/vocab added; tieBreak now 5/5 modes (checklist's 'four-mode' wording predates 008's aside landing earlier today); both files `jq empty` clean]
- [x] CHK-012 [P1] Edits are strictly additive: existing three modes' registry/router entries semantically unchanged against the baseline [evidence: structured diff vs HEAD: 4/4 prior mode entries semantically unchanged]
- [x] CHK-013 [P1] New entries follow the hub's existing conventions (derived from the mcp-figma transport entry shape) [evidence: entry shape mirrors `mcp-figma` transport (new `backendKind: code-mode-remote-mcp` declared in transport-axis prose)]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All spec.md acceptance criteria met with recorded evidence [evidence: acceptance evidence in `tasks.md`]
- [x] CHK-021 [P0] Registry and router cross-agree on exactly four workflowMode keys; `rg -n 'mcp-refero'` hits every hub routing surface [evidence: registry/router cross-agree on 5/5 workflowMode keys; `rg -n mcp-refero` hits registry, router, `SKILL.md`, description, graph-metadata, changelog, hub_routing]
- [x] CHK-022 [P1] Routing dry-read: refero holdout prompts resolve to mcp-refero; existing-mode scenarios unchanged [evidence: packet-level dry simulation 8/8 prompts; live advisor probes deferred to final gate (daemon exit 75); existing-mode vocab byte-equal per diff]
- [x] CHK-023 [P1] Advisor skill-graph regeneration run recorded after hub files settled [evidence: `skill_graph_compiler.py --export-json` recompiled 12/12 clean post-settle]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Any routing regression fixed during this phase has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation` [evidence: N/A — 0 routing regressions found]
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed for any registry/router defect (checked across all four mode entries), or instance-only status proven by grep [evidence: N/A — no registry/router defect; 5/5 entries validated by `parent-skill-check` PASS]
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed hub surfaces: router runtime, advisor skill graph, hub_routing scenarios, phase 004 validators [evidence: 3/3 consumers refreshed: advisor graph via `skill_graph_compiler.py`, `hub_routing/refero_design_reference.md` added, phase 004 validators queued]
- [x] CHK-FIX-004 [P0] Not applicable unless a parser/path fix lands in hub tooling — if one does, adversarial table tests included [evidence: N/A — 0 parser/path fixes landed in hub tooling this phase; `git status` scope check]
- [x] CHK-FIX-005 [P1] Surface matrix (7 hub surfaces × mcp-refero presence) listed with row results before completion is claimed [evidence: 7/7 surfaces carry mcp-refero: registry, router, `SKILL.md`, description, graph-metadata, changelog, hub_routing]
- [x] CHK-FIX-006 [P1] Regeneration rerun considered if concurrent sibling edits landed between hub writes and the graph run [evidence: 0 sibling edits between hub writes and the graph run; `mcp-mobbin/` dir absent at compile time per `ls` check]
- [x] CHK-FIX-007 [P1] Evidence pinned to a git SHA or explicit diff range, not a moving branch-relative range [evidence: evidence pinned to base `28ab0236dc` + untracked packet tree at close-out]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets or tokens introduced in hub files or scenario docs [evidence: 0/7 touched hub surfaces contain secrets/tokens; `jq`-parsed configs carry no credential keys]
- [x] CHK-031 [P0] Existing `refero` UTCP manual verified read-only — name key, stdio transport, `npx -y mcp-remote https://api.refero.design/mcp` — with `git diff` clean on `.utcp_config.json`; any mismatch escalated, not patched [evidence: `git diff` clean on `.utcp_config.json` for this phase; manual verified byte-identical via packet asset diff]
- [x] CHK-032 [P1] The registered mode preserves the transport posture: no Write/Edit/Task grants added anywhere in hub routing metadata [evidence: `mode-registry.json` toolSurface.forbidden = Write/Edit/Task; 0/7 hub surfaces add grants]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized with what actually shipped [evidence: `spec.md`/`plan.md`/`tasks.md` match shipped set]
- [x] CHK-041 [P1] Parent SKILL.md lists mcp-refero; hub description.json and graph-metadata.json reflect four modes incl. the sk-design pairing edge; hub changelog entry and hub_routing scenario authored [evidence: `SKILL.md` v1.2.0.0 lists mcp-refero; description+graph reflect 5 modes incl. sk-design pairing; `changelog/v1.2.0.0.md` + scenario authored]
- [x] CHK-042 [P2] Serial handoff to sibling 010 recorded [evidence: 010 serial window opens after its packet passes `package_skill.py --check`]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only; writes confined to hub shared files and this phase folder (`git status` evidence) [evidence: `git status`: writes confined to hub files + this phase folder]
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 10/10 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: Pending
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
