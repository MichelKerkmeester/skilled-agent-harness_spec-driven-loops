---
title: "Implementation Plan: Phase 3: hub-integration"
description: "Plan for registering mcp-aside-devtools in the mcp-tooling hub inside the 008-first serial window: registry and router entries, parent SKILL.md and hub metadata, changelog and hub_routing scenario, the .utcp_config.json aside manual, and advisor skill-graph regeneration."
trigger_phrases:
  - "mcp-aside hub integration plan"
  - "aside mode registry plan"
  - "aside utcp manual plan"
  - "phase 003 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/003-hub-integration"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the hub-registration plan with the serial-window guard"
    next_safe_action: "Begin hub registration after phase 002's packaging gate passes"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/003-hub-integration/tasks.md"
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
| **Language/Stack** | JSON registry/router/config edits plus Markdown hub doctrine |
| **Framework** | mcp-tooling hub canon: mode-registry.json discriminator, hub-router.json routing, name-keyed .utcp_config.json manuals |
| **Storage** | Hub files under `.opencode/skills/mcp-tooling/`, repo-root `.utcp_config.json`, advisor skill-graph artifacts |
| **Testing** | JSON parse checks, hub_routing scenario runs (new + existing modes), advisor regeneration output |

### Overview
Additively register the phase-002 packet as the hub's fourth mode. Every edit mirrors how the three live modes are registered: a registry entry on the workflow axis, router vocab, parent doctrine, hub metadata, changelog, and a hub_routing scenario — plus the one runtime edit outside the hub, the name-keyed `aside` manual in `.utcp_config.json`. Executed strictly inside the 008-first serial window shared with sibling packets 009/010.
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
Additive hub registration mirroring the existing three-mode shape; minimal diffs, existing entries byte-unchanged.

### Key Components
- **Registry entry**: `mcp-aside-devtools` in `mode-registry.json` with `packetKind: "workflow"`, `backendKind: "cli-plus-mcp"`, folder == packetSkillName, metadata routingClass consistent with the hub's advisorRouting contract.
- **Router update**: `hub-router.json` signals/vocab/tieBreak so aside/AI-browser queries resolve to the new mode without stealing chrome-devtools traffic.
- **Hub doctrine + metadata**: parent `SKILL.md` mode section; `description.json` and `graph-metadata.json` refresh.
- **Evidence surfaces**: hub `changelog/` entry and `manual_testing_playbook/hub_routing/` scenario.
- **Runtime manual**: name-keyed `aside` manual in `.utcp_config.json` exposing the Aside MCP server through Code Mode.
- **Advisor regeneration**: skill-graph rebuild reflecting the four-mode hub.

### Data Flow
An aside-shaped request → advisor routes the single `mcp-tooling` identity → hub-router.json resolves `mcp-aside-devtools` → the mode dispatches Aside CLI primary, or falls back to `call_tool_chain()` against the `aside` manual registered in `.utcp_config.json`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` / `hub-router.json` | Route the three live modes | Additive entry + vocab update; existing entries unchanged | JSON parse; diff shows additions only; existing hub_routing scenarios still pass |
| Hub `SKILL.md`, `description.json`, `graph-metadata.json` | Hub identity and doctrine | Update for the fourth mode | Cross-check mode names/counts against the registry |
| `.utcp_config.json` | Name-keyed manuals for Code Mode | Add `aside` manual; existing manuals byte-unchanged | JSON parse; diff confined to the new manual block |
| Advisor skill-graph artifacts | Advisor routing metadata | Regenerate | Regeneration output recorded; hub identity reflects four modes |
| Sibling packets 009/010 hub phases | Future editors of the same files | Not touched; serialized after this phase | Operator confirmation of the serial window |

Required inventories:
- Consumers of hub routing: existing `manual_testing_playbook/hub_routing/` scenarios re-run after the vocab change.
- Manual-name collision check: `rg -n '"aside"' .utcp_config.json` before adding the manual.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 002's `package_skill.py --check` exit 0 and the 008-first serial window is open (no concurrent 009/010 hub edits)
- [ ] Read the current `mode-registry.json`, `hub-router.json`, and `.utcp_config.json` shapes; check for `aside` name collisions
- [ ] Draft the registry entry and router vocab delta from the phase 002 packet's SKILL.md doctrine

### Phase 2: Core Implementation
- [ ] Land the `mode-registry.json` entry and `hub-router.json` signals/vocab/tieBreak update
- [ ] Update parent `SKILL.md`, hub `description.json`, and `graph-metadata.json`; add the hub changelog entry and hub_routing scenario
- [ ] Add the name-keyed `aside` manual to `.utcp_config.json` and regenerate the advisor skill-graph

### Phase 3: Verification
- [ ] JSON-parse all touched files; verify registry/router/SKILL.md/metadata mutual consistency on the new mode
- [ ] Run the hub_routing scenarios: the aside scenario resolves to `mcp-aside-devtools`, the three live-mode scenarios are unregressed
- [ ] Complete `checklist.md` with evidence and hand off to phase 004 inside the serial window
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | mode-registry, hub-router, hub metadata, .utcp_config | `node -e 'JSON.parse(...)'` or `python3 -m json.tool` per file |
| Routing scenarios | New aside scenario + three existing hub_routing scenarios | `manual_testing_playbook/hub_routing/` scenario runs |
| Advisor regeneration | Skill-graph artifacts | Regeneration command output recorded in the checklist |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 packaging gate | Internal | Pending (predecessor) | Cannot register an unvalidated packet |
| Serial window 008→009→010 | Process | Pending (operator-coordinated) | Concurrent hub edits risk shared-file corruption |
| Advisor skill-graph regeneration tooling | Internal | Green | Advisor metadata stays stale on the three-mode hub |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live-mode hub_routing scenario regresses, any touched JSON fails to parse, or a serial-window violation is detected mid-phase.
- **Procedure**: All edits are additive and confined to known files — `git checkout` of `.opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,SKILL.md,description.json,graph-metadata.json}`, the changelog/scenario additions, and `.utcp_config.json` restores the three-mode hub exactly; re-run the advisor regeneration against the restored state. The phase 002 packet tree is untouched by rollback.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
