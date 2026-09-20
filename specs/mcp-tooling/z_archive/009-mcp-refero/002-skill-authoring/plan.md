---
title: "Implementation Plan: Phase 2: skill-authoring"
description: "Plan for authoring the mcp-refero transport packet: mirror the mcp-figma exemplar inventory minus CLI machinery, ground all content in the phase 001 research synthesis, author references and the routing-recall playbook, then gate with package_skill.py --check."
trigger_phrases:
  - "mcp-refero authoring plan"
  - "refero transport packet plan"
  - "refero skill plan"
  - "phase 002 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/009-mcp-refero/002-skill-authoring"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the packet-authoring implementation plan"
    next_safe_action: "Begin packet authoring once the phase 001 synthesis is accepted"
    blockers:
      - "Phase 001 research synthesis must converge first"
    key_files:
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/009-mcp-refero/002-skill-authoring/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-002-skill-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: skill-authoring

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
| **Language/Stack** | Markdown skill packet plus a JSON UTCP manual snippet asset |
| **Framework** | sk-doc create-skill-parent standards; mcp-tooling nested-mode conventions |
| **Storage** | New tree at `.opencode/skills/mcp-tooling/mcp-refero/` |
| **Testing** | `package_skill.py --check` on the packet; link/reference resolution sweep; playbook scenario dry-read |

### Overview
Author the `mcp-refero` transport packet by walking the mcp-figma exemplar inventory, dropping its CLI machinery, and filling every surface from the phase 001 research synthesis. SKILL.md carries the transport contract (read-only, Code Mode dispatch, sk-design pairing); references split wiring, tool surface, and troubleshooting; the manual-testing playbook proves routing recall with holdouts and a negative case. The structural gate is `package_skill.py --check` exit 0.
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
Exemplar-mirroring packet authoring: inventory diff (mcp-figma minus CLI) → research-grounded fill → structural gate.

### Key Components
- **SKILL.md (transport contract)**: Declares `packetKind: transport` semantics for hub consumption — `mutatesWorkspace:false`, allowed-tools without Write/Edit/Task, mandatory `sk-design` cross-hub judgment pairing, all Refero calls via Code Mode `call_tool_chain()` against the existing `refero` manual.
- **references/**: `mcp_wiring` (mcp-remote stdio bridge, manual key, Code Mode naming `refero.refero_<tool>`), `tool_surface` (verified tool inventory with parameters and tier notes from research.md), `troubleshooting` (auth failures, rate limits, remote-down, surface drift).
- **manual-testing-playbook/**: Scenario set incl. `intra-routing-recall/` with ≥2 holdout prompts that must route to mcp-refero, `negative.md` (prompts that must NOT route here — e.g. Figma edits, local design builds), `troubleshoot.md`.
- **assets/**: Ready-to-paste UTCP manual snippet mirroring the live `refero` manual shape for fresh installs.
- **mcp-servers/refero-mcp/README.md**: Endpoint-level notes (URL, transport, auth posture) for the remote server.

### Data Flow
`../001-research/research/research.md` findings flow into references and SKILL.md; the packet's docs then drive agent dispatch: hub route → mcp-refero SKILL.md → Code Mode `refero.*` calls → results paired with sk-design judgment.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-tooling/mcp-refero/**` | Does not exist yet | Create (only writable surface besides this phase folder) | `git status` shows adds confined to the packet tree and this phase folder |
| Hub shared files + sibling modes | Live routing surfaces | Unchanged this phase | `git diff --stat` on `.opencode/skills/mcp-tooling/` shows only `mcp-refero/` adds |
| `.utcp_config.json` | Holds the live `refero` manual | Unchanged; source of truth for the assets snippet | Snippet diffed against the live manual entry |

Required inventories:
- Same-class producers: the mcp-figma packet is the exemplar; diff its inventory to derive the minus-CLI target list before authoring.
- Consumers of changed symbols: phase 003 consumes the packet's SKILL.md name and path for registry/router entries; no code symbols change.
- Matrix axes: inventory item × content source (exemplar structure vs research.md facts) tracked in tasks.
- Algorithm invariant: the packet must remain dispatchable read-only — no doc may instruct Write/Edit/Task usage or local workspace mutation.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Derive the target inventory: mcp-figma tree listing minus CLI machinery, mapped to the deliverables in spec.md
- [ ] Extract the authoring fact base from `../001-research/research/research.md` (tools, params, auth, limits, tiers)
- [ ] Confirm sk-doc create-skill-parent standards and nested-mode frontmatter requirements

### Phase 2: Core Implementation
- [ ] Author SKILL.md, README.md, install-guide.md with the transport contract and verified surface summary
- [ ] Author references/ (mcp_wiring, tool_surface, troubleshooting) and mcp-servers/refero-mcp/README.md
- [ ] Author manual-testing-playbook/ incl. intra-routing-recall holdouts, negative.md, troubleshoot.md; seed changelog/, feature-catalog/, scripts/, assets/ (UTCP snippet)

### Phase 3: Verification
- [ ] Run `package_skill.py --check` and fix findings to exit 0
- [ ] Sweep internal links/paths for resolution; diff the assets UTCP snippet against the live manual
- [ ] Trace each documented capability claim to a research.md finding; run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural gate | Packet inventory and frontmatter | `package_skill.py --check` on the packet |
| Reference resolution | Internal links and paths across the packet | grep sweep for broken relative paths |
| Grounding audit | Capability claims in SKILL.md and tool_surface | Manual trace to research.md finding ids |
| Playbook dry-read | Routing-recall holdouts and negative case | Human read: each prompt unambiguously routes (or not) per scenario intent |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 `research/research.md` | Internal | Red until 001 closes | No grounded fact base; authoring cannot start |
| mcp-figma exemplar tree | Internal | Green | Inventory derivation falls back to sk-doc standards alone |
| `package_skill.py` checker | Internal | Green | No structural gate; handoff criteria unverifiable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate cannot reach exit 0, a write escapes the packet tree/phase folder, or research grounding proves insufficient mid-authoring.
- **Procedure**: The packet is a pure additive tree — `git clean`/`git checkout` the `mcp-refero/` subtree to revert. If grounding is the blocker, return to phase 001 for corrective iterations rather than authoring from guesses.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
