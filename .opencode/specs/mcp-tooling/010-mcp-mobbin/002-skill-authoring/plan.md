---
title: "Implementation Plan: Phase 2: skill-authoring"
description: "Plan for authoring the mcp-mobbin transport packet: derive the inventory from the mcp-figma exemplar minus CLI machinery, ground all content in the phase 001 research synthesis, author contract-first (SKILL.md) then references, guides, assets, and playbooks, and gate with package_skill.py --check."
trigger_phrases:
  - "mcp-mobbin authoring plan"
  - "mobbin packet inventory"
  - "mobbin package_skill check"
  - "phase 002 plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/010-mcp-mobbin/002-skill-authoring"
    last_updated_at: "2026-07-16T10:30:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the skill-authoring implementation plan"
    next_safe_action: "Begin packet authoring once phase 001 research.md is converged"
    blockers:
      - "Phase 001 synthesis (research/research.md) must converge first"
    key_files:
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/tasks.md"
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
| **Language/Stack** | Markdown skill documentation + JSON assets (UTCP manual snippet) |
| **Framework** | sk-doc create-skill standards; mcp-tooling transport-packet conventions |
| **Storage** | New packet tree `.opencode/skills/mcp-tooling/mcp-mobbin/` |
| **Testing** | `package_skill.py --check`, placeholder grep, research.md traceability review |

### Overview
Author the `mcp-mobbin` transport packet contract-first: SKILL.md pins the transport rules, then references (tool_surface, mcp_wiring, troubleshooting) encode the verified facts from phase 001, then user-facing docs (README, INSTALL_GUIDE), assets (UTCP snippet), feature catalog, changelog, scripts, and the manual-testing playbook. The `mcp-figma` sibling is the structural exemplar, explicitly minus its CLI/daemon machinery, because Mobbin is a plain remote MCP server reached through Code Mode.
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
Exemplar-derived documentation packet: transport contract at the root (SKILL.md), evidence-bearing references, install/runbook layer, and a testing playbook — all read-only surfaces over an external MCP server.

### Key Components
- **SKILL.md (contract)**: Declares the read-only Mobbin design-research surface, `mutatesWorkspace:false`, forbidden tools (Write/Edit/Task), Code Mode as the call path, and the mandatory sk-design cross-hub pairing for design judgment.
- **references/**: `tool-surface.md` (verified tool list with inputs/outputs and gating), `mcp-wiring.md` (Code Mode call path and manual naming), `troubleshooting.md` (auth failures, gating errors, rate limits).
- **assets/**: Ready-to-paste UTCP `mobbin` manual snippet plus credential env template.
- **manual_testing_playbook/**: Routing-recall holdouts (2+), negative.md, troubleshoot.md, plus surface smoke scenarios.
- **mcp-servers/mobbin-mcp/README.md**: Upstream pin — repo URL, version verified against, credential requirement.

### Data Flow
Phase 001 findings flow into references/ and the UTCP snippet; the snippet flows to phase 003 for application to `.utcp_config.json`; the playbook holdouts flow to phase 004 validation. At runtime the skill routes callers through Code Mode (`call_tool_chain`) to the Mobbin server and hands design judgment to sk-design.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-tooling/mcp-mobbin/**` | Does not exist yet | Create (this phase's only skill-tree write surface) | `package_skill.py --check` exit 0; `git status` confined to this tree + phase folder |
| Hub files (mode-registry.json, hub-router.json, SKILL.md, metadata) + `.utcp_config.json` | Live hub routing and Code Mode config | Unchanged this phase | `git diff --stat` shows zero hub/config modifications |

Required inventories:
- Not a fix phase; the invariant is additive-only creation inside the new packet tree.
- Algorithm invariant: no doc in the packet may grant or imply Write/Edit/Task capability; the transport contract must be internally consistent across all files.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Re-read phase 001 `research/research.md` and extract the verified tool list, auth model, and gating facts
- [ ] Derive the target inventory from the mcp-figma exemplar and record the explicit minus-list (CLI machinery excluded)
- [ ] Load sk-doc create-skill standards and confirm the `package_skill.py --check` invocation

### Phase 2: Core Implementation
- [ ] Author SKILL.md with the full transport contract, then README.md and INSTALL_GUIDE.md
- [ ] Author references/ (mcp_wiring, tool_surface, troubleshooting), assets/ (UTCP snippet + env template), feature_catalog/, changelog/, scripts/, mcp-servers/mobbin-mcp/README.md
- [ ] Author manual_testing_playbook/ including intra-routing-recall/ with 2+ holdouts, negative.md, troubleshoot.md

### Phase 3: Verification
- [ ] Run `package_skill.py --check` and iterate to exit 0
- [ ] Placeholder grep across the packet returns zero; traceability spot-check of tool-surface.md against research.md
- [ ] Complete checklist.md with evidence and run phase-folder validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packaging gate | Whole mcp-mobbin packet | `package_skill.py --check` |
| Placeholder scan | All authored packet files | rg for bracketed placeholders / template prose |
| Traceability review | tool-surface.md + UTCP snippet vs research.md | Manual cross-check with citations |
| JSON validity | UTCP manual snippet in assets/ | `python3 -m json.tool` (or node JSON.parse) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 converged research.md | Internal | Yellow (pending phase 001) | Cannot ground the tool surface; authoring must not start |
| mcp-figma exemplar tree (read-only) | Internal | Green | Inventory shape would need first-principles design |
| sk-doc create-skill standards + package_skill.py | Internal | Green | No authoritative gate for packet completeness |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `package_skill.py --check` cannot reach exit 0, the transport contract turns out infeasible against verified facts, or writes escape the packet tree.
- **Procedure**: The packet is additive and unreferenced until phase 003 wires it — delete or `git checkout --` the `mcp-mobbin` tree to roll back cleanly. Escalate contract infeasibility to the parent packet as an amendment decision before any workaround.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
