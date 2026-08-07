---
title: "Implementation Plan: Phase 3: hub-integration"
description: "Plan for registering mcp-refero as the fourth mcp-tooling mode: additive registry and router edits on the transport axis, hub SKILL.md and metadata refresh, changelog and routing scenario, read-only verification of the existing refero UTCP manual, and advisor skill-graph regeneration — executed serially after sibling packet 008."
trigger_phrases:
  - "mcp-refero integration plan"
  - "refero registry plan"
  - "refero router plan"
  - "phase 003 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/003-hub-integration"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the hub-integration implementation plan"
    next_safe_action: "Start hub integration once phase 002 gates pass and the 008 sibling slot is done"
    blockers:
      - "Phase 002 packet must pass package_skill.py --check first"
      - "SERIAL ordering across sibling packets: 008 before 009"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/003-hub-integration/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-003-hub-integration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: hub-integration

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | JSON routing metadata (mode-registry.json, hub-router.json, graph/description JSON) plus hub Markdown |
| **Framework** | mcp-tooling hub conventions (workflowMode/packetKind discriminator, transport-axis extension, metadata routingClass) |
| **Storage** | Hub shared files under `.opencode/skills/mcp-tooling/`; advisor skill-graph artifacts |
| **Testing** | JSON parse + registry/router cross-agreement checks; grep sweeps; routing dry-reads; regeneration run output |

### Overview
Extend the mcp-tooling hub from three modes to four with strictly additive edits: a transport-axis registry entry with sk-design crossHubPairing, router signals/vocabulary/tieBreak for mcp-refero, hub SKILL.md and metadata refresh, changelog and a hub_routing scenario. Verify (never edit) the existing `refero` UTCP manual, then regenerate the advisor skill graph. All hub writes wait for sibling packet 008's slot per the 008 → 009 → 010 serial rule.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive hub-registration: serialize on shared files → extend registry/router → refresh hub identity → verify transport wiring → regenerate advisor graph.

### Key Components
- **mode-registry.json extension**: New mode object keyed `workflowMode: mcp-refero` with transport packetKind and metadata routingClass mirroring mcp-figma's shape (Code-Mode backend instead of a desktop daemon); `extensions.transport-axis.transports[]` gains `mcp-refero`; a `crossHubPairing` maps mcp-refero → sk-design as the mandatory judgment partner.
- **hub-router.json extension**: routerSignals entry for mcp-refero (refero/design-reference vocabulary classes + hub-identity), tieBreak appended with the fourth mode, defaultMode and ambiguityDelta unchanged.
- **Hub identity refresh**: Parent SKILL.md routed-mode listing, hub description.json, hub graph-metadata.json with an edge to sk-design for the pairing.
- **Transport verification**: Read-only check of the `refero` manual in `.utcp_config.json` (name key, stdio `mcp-remote`, endpoint URL) with a recorded result.
- **Advisor regeneration**: Skill-graph regeneration run after hub files settle, output recorded.

### Data Flow
A design-reference prompt hits the advisor → single hub identity mcp-tooling → hub-router signals resolve mcp-refero → SKILL.md transport contract → Code Mode `refero.*` calls over the verified manual → results paired with sk-design judgment.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` / `hub-router.json` | Live routing source of truth for three modes | Additive extension to four modes | JSON parse; workflowMode key sets cross-agree; existing entries byte-stable except formatting |
| Hub SKILL.md + description/graph metadata | Hub identity and advisor-visible surface | Refresh to list mcp-refero; add sk-design edge | grep `mcp-refero` hits all surfaces; graph edge present |
| `.utcp_config.json` (`refero`) | Live transport manual | Verify only — no edit | Recorded read of name key, args, URL; `git diff` clean on the file |
| Sibling packets 008/010 hub edits | Same shared files | Serialized, not merged concurrently | Execution record shows 008 done before first hub write here |

Required inventories:
- Same-class producers: the three existing mode entries in registry/router are the pattern source; diff-derive the fourth entry from mcp-figma's transport entry.
- Consumers of changed symbols: hub router runtime, advisor skill graph, hub_routing playbook scenarios, phase 004 validators.
- Matrix axes: hub surface × mcp-refero presence (registry, router, SKILL.md, description, graph, changelog, scenario) — 7 rows checked in tasks.
- Algorithm invariant: integration is additive — no existing mode's routing signal, tieBreak position relative to peers, or registry semantics may change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 002 gate evidence and that sibling packet 008's hub slot is complete (serial rule)
- [ ] Snapshot current registry/router JSON and hub metadata as the pre-change baseline
- [ ] Derive the fourth mode entry shape from the existing mcp-figma transport entry

### Phase 2: Core Implementation
- [ ] Extend mode-registry.json: mode entry, transport-axis transports[], crossHubPairing mcp-refero → sk-design
- [ ] Extend hub-router.json: routerSignals, vocabulary classes, tieBreak; refresh parent SKILL.md and hub description/graph metadata (sk-design edge)
- [ ] Author the hub changelog entry and hub_routing refero scenario; verify the existing refero UTCP manual read-only

### Phase 3: Verification
- [ ] Parse + cross-agreement checks on registry/router; grep sweep for mcp-refero across all hub surfaces
- [ ] Dry-read routing scenarios: refero prompts resolve to mcp-refero, existing-mode prompts unchanged
- [ ] Run advisor skill-graph regeneration, record output, notify the 010 sibling, and run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse + cross-agreement | mode-registry.json, hub-router.json | JSON parse script; workflowMode key-set comparison |
| Surface sweep | All 7 hub surfaces | `rg -n 'mcp-refero' .opencode/skills/mcp-tooling/` |
| Routing dry-read | refero holdouts + existing-mode scenarios | hub_routing playbook scenarios read against router signals |
| Transport verification | `refero` manual in `.utcp_config.json` | Read + recorded evidence; `git diff` clean on the file |
| Regeneration audit | Advisor skill graph | Regeneration run output recorded in the phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 gate (`package_skill.py --check` exit 0) | Internal | Red until 002 closes | Registering a structurally invalid mode |
| Sibling packet 008 hub slot complete | Process | Yellow (serial queue) | Concurrent edits to shared hub files conflict |
| Advisor skill-graph regeneration tooling | Internal | Green | Advisor stays blind to the fourth mode until rerun |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Registry/router cross-agreement fails, existing-mode routing regresses in dry-reads, or the serial rule is found violated mid-phase.
- **Procedure**: Revert the hub shared files to the pre-change baseline snapshot (`git checkout` the touched hub paths), re-run the regeneration against the restored three-mode state, and re-enter the serial queue. The mcp-refero packet tree itself is untouched by rollback.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
