---
title: "Implementation Plan: Phase 3: hub-integration"
description: "Plan for wiring mcp-mobbin into the mcp-tooling hub inside the serial 008→009→010 window: registry first, router second, docs/metadata third, .utcp_config.json manual fourth, advisor skill-graph regeneration last, with JSON parse checks and a cross-file consistency sweep."
trigger_phrases:
  - "mcp-mobbin integration plan"
  - "mobbin registry wiring"
  - "mobbin serial hub edits"
  - "phase 003 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/003-hub-integration"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the hub-integration implementation plan"
    next_safe_action: "Start hub edits only after phase 002 gate passes AND siblings 008/009 land"
    blockers:
      - "Phase 002 packet must pass package_skill.py --check first"
      - "Serial ordering: sibling packets 008 and 009 must complete their hub edits before 010 touches shared hub files"
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/tasks.md"
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
| **Language/Stack** | JSON registry/router/config edits + Markdown hub docs |
| **Framework** | mcp-tooling hub conventions (mode-registry.json discriminator, hub-router.json signals); UTCP manual config |
| **Storage** | Live hub files under `.opencode/skills/mcp-tooling/` + root `.utcp_config.json` |
| **Testing** | JSON parse checks per edit, cross-file consistency sweep, advisor skill-graph regeneration, hub_routing playbook scenario |

### Overview
Wire the validated mcp-mobbin packet into live hub routing in dependency order: registry (source of truth) → router (signals/vocab/tieBreak) → hub docs and metadata (SKILL.md, description.json, graph-metadata.json, changelog, playbook scenario) → `.utcp_config.json` `mobbin` manual → advisor skill-graph regeneration. All edits are additive, run inside the serial 008→009→010 window, and each JSON file is parse-checked immediately after editing.
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
Registry-first additive integration: the mode-registry.json entry is the single source of truth; every other surface (router, SKILL.md, metadata, manual, advisor graph) projects from it.

### Key Components
- **mode-registry.json entry**: mcp-mobbin with packetKind `transport`, backendKind reflecting the Code Mode call path, routingClass `metadata`, `extensions.transport-axis.transports[]` extended, `crossHubPairing: mcp-mobbin → sk-design`.
- **hub-router.json projection**: routerSignals block (weight consistent with siblings), `mobbin-aliases` / `design-research` vocabulary classes, tieBreak order extended with mcp-mobbin.
- **Hub docs/metadata**: parent SKILL.md mode row, description.json, graph-metadata.json edge to sk-design, changelog entry, hub_routing playbook scenario.
- **`.utcp_config.json` manual**: the name-keyed `mobbin` manual pasted from phase 002 assets/.
- **Advisor regeneration**: skill-graph rebuild so the four-mode hub identity is discoverable.

### Data Flow
The phase 002 packet (contract + UTCP snippet) feeds the registry entry and the manual; the registry feeds the router and hub docs; the regenerated advisor graph consumes the final hub identity. At runtime: advisor → mcp-tooling hub → membership routing → mcp-mobbin → Code Mode → `mobbin` manual → Mobbin MCP server.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mode-registry.json` / `hub-router.json` | Live hub routing source of truth | Additive mcp-mobbin entries | JSON parse + cross-file consistency sweep; existing three modes byte-preserved in spirit (diff shows additions only) |
| `.utcp_config.json` | Live Code Mode manual config | Add `mobbin` manual only | JSON parse; pre-existing manuals unchanged in the diff |
| Hub SKILL.md, description.json, graph-metadata.json, changelog/, playbook | Hub identity + docs | Additive updates | Grep sweep: every surface names mcp-mobbin consistently; no dangling refs |
| Advisor skill graph | Discovery layer | Regenerate | Regeneration exit 0; hub identity present in output |

Required inventories:
- Same-class producers: `rg -n 'mcp-figma' .opencode/skills/mcp-tooling/{mode-registry.json,hub-router.json,SKILL.md}` — the transport precedent rows mcp-mobbin must mirror.
- Consumers of changed symbols: `rg -n 'mcp-mobbin|mobbin' .opencode/skills/mcp-tooling .utcp_config.json --glob '*.json' --glob '*.md'` after edits — every hit must be intentional and consistent.
- Matrix axes: surface (registry/router/SKILL/metadata/changelog/playbook/manual/advisor) × property (mode name, packetKind, pairing, vocabulary) — sweep all rows before handoff.
- Algorithm invariant: integration is strictly additive; no existing mode entry, manual, or edge may change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 002 gate evidence (`package_skill.py --check` exit 0) and locate the UTCP snippet in the packet assets/
- [ ] Confirm sibling packets 008 and 009 have landed their serial hub edits; record the evidence
- [ ] Read the current mode-registry.json / hub-router.json and pin the mcp-figma transport precedent rows to mirror

### Phase 2: Core Implementation
- [ ] Edit mode-registry.json: mode entry, transport-axis transports[], crossHubPairing to sk-design; parse-check
- [ ] Edit hub-router.json (signals/vocab/tieBreak), parent SKILL.md, description.json, graph-metadata.json (sk-design edge), changelog, hub_routing scenario; parse-check each JSON
- [ ] Add the `mobbin` manual to `.utcp_config.json` from the snippet; parse-check; regenerate the advisor skill graph

### Phase 3: Verification
- [ ] Run the cross-file consistency sweep (mode name, packetKind, pairing, vocabulary) across all edited surfaces
- [ ] Verify pre-existing manuals and mode entries are unchanged in the diff; confirm no writes outside scoped files + this phase folder
- [ ] Complete checklist.md with evidence and run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| JSON validity | mode-registry.json, hub-router.json, description.json, graph-metadata.json, .utcp_config.json | `python3 -m json.tool` / node JSON.parse after every edit |
| Consistency sweep | All edited hub surfaces | rg for `mcp-mobbin|mobbin` + manual cross-check of packetKind/pairing/vocab |
| Additivity check | Existing modes and manuals | `git diff` review: additions only on shared files |
| Discovery | Advisor skill graph | Regeneration command exit 0; hub identity spot-check |
| Routing scenario | hub_routing playbook | New mobbin scenario resolves to mcp-mobbin via membership routing |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 packet gate (check exit 0) | Internal | Yellow (pending phase 002) | Cannot wire an unvalidated packet |
| Sibling packets 008 and 009 serial completion | Internal | Yellow (external packets) | Shared-file collisions on registry/router/config |
| Advisor skill-graph regeneration tooling | Internal | Green | New mode stays undiscoverable to the advisor |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: JSON parse failure, routing regression on the existing three modes, consistency sweep failure that cannot be resolved additively, or a serial-window violation discovered mid-edit.
- **Procedure**: All edits are additive on tracked files — `git checkout --` each affected hub file and `.utcp_config.json` to restore the pre-phase state, then re-run the advisor skill-graph regeneration against the restored files. Re-enter the serial window cleanly before retrying.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
