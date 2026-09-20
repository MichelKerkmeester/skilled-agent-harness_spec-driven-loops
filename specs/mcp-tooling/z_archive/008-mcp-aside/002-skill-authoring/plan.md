---
title: "Implementation Plan: Phase 2: skill-authoring"
description: "Plan for authoring the mcp-aside-devtools nested mode packet: mirror the mcp-chrome-devtools exemplar inventory, ground every claim in the phase 001 research.md synthesis, and gate on package_skill.py --check."
trigger_phrases:
  - "mcp-aside authoring plan"
  - "aside devtools packet plan"
  - "aside skill inventory"
  - "phase 002 plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/008-mcp-aside/002-skill-authoring"
    last_updated_at: "2026-07-16T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Drafted the mode-authoring plan against the chrome-devtools exemplar"
    next_safe_action: "Begin authoring after the phase 001 research gate is reviewed"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/spec.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/plan.md"
      - ".opencode/specs/mcp-tooling/008-mcp-aside/002-skill-authoring/tasks.md"
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
| **Language/Stack** | Markdown skill packet (SKILL.md doctrine, guides, playbooks) plus optional helper scripts |
| **Framework** | sk-doc create-skill-parent standards for nested mode packets under a parent hub |
| **Storage** | New file tree at `.opencode/skills/mcp-tooling/mcp-aside-devtools/` |
| **Testing** | `package_skill.py --check` on the new packet; inventory diff against the `mcp-chrome-devtools` exemplar; citation audit against `research.md` |

### Overview
Author the `mcp-aside-devtools` mode as a structural 1:1 analog of `mcp-chrome-devtools`: same inventory, same CLI-primary / Code-Mode-MCP-fallback dispatch shape, but every Aside-specific fact (commands, MCP tools, auth, install) taken from the phase 001 `research.md` synthesis. Close with the `package_skill.py --check` gate.
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
Exemplar-mirrored authoring: copy the shape from `mcp-chrome-devtools`, fill the substance from `research.md`, never the other way around.

### Key Components
- **SKILL.md doctrine**: When to reach for Aside, CLI-primary dispatch, Aside MCP through `mcp__code_mode__call_tool_chain` as fallback, gating rules mirroring the sibling workflow modes.
- **Install/user surface**: `README.md` + `install-guide.md` with verified install, launch, and auth steps.
- **Playbook**: `manual-testing-playbook/` scenarios including `intra-routing-recall/` (≥2 holdouts, `negative.md`, `troubleshoot.md`).
- **Backend docs**: `mcp-servers/aside-cli/` and `mcp-servers/aside-mcp/` documenting both dispatch paths and their failure modes.
- **Support dirs**: `changelog/` (seed version), `examples/`, `references/`, `scripts/`.

### Data Flow
`../001-research/research/research.md` findings → authored packet content → `package_skill.py --check` → handoff to phase 003, which registers the (already valid) packet in the hub.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-tooling/mcp-aside-devtools/**` | Does not exist yet | Create (this phase's only skill-tree writes) | Directory listing matches the exemplar inventory; `package_skill.py --check` exit 0 |
| Hub registration files (`mode-registry.json`, `hub-router.json`, parent `SKILL.md`, hub metadata) | Route the three existing modes | Unchanged — phase 003 owns them | `git status` shows no hub-file modifications after this phase |
| `.opencode/skills/mcp-tooling/mcp-chrome-devtools/**` | Read-only exemplar | Unchanged | `git status` clean under the exemplar tree |

Required inventories:
- Exemplar inventory diff: listing of `mcp-chrome-devtools/` vs the new `mcp-aside-devtools/` tree before the gate.
- Citation inventory: every command/tool/auth claim in the packet mapped to a `research.md` finding.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Review the converged `research.md` and extract the verified CLI command surface, MCP tool list, auth model, and install/launch steps
- [ ] Snapshot the `mcp-chrome-devtools` exemplar inventory (files and playbook scenario shape)
- [ ] Confirm the `backendKind: cli-plus-mcp` posture still holds against the research findings (halt for amendment if not)

### Phase 2: Core Implementation
- [ ] Author `SKILL.md` (dispatch doctrine), `README.md`, and `install-guide.md`
- [ ] Author `mcp-servers/aside-cli/` and `mcp-servers/aside-mcp/` backend docs
- [ ] Author `manual-testing-playbook/` incl. `intra-routing-recall/` (≥2 holdouts, `negative.md`, `troubleshoot.md`), plus `changelog/`, `examples/`, `references/`, `scripts/`

### Phase 3: Verification
- [ ] Inventory diff against the exemplar: no missing top-level components
- [ ] Citation audit: zero uncited command/tool/auth claims
- [ ] Run `package_skill.py --check` on the packet and iterate to exit 0; complete `checklist.md` with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Packaging gate | The new mode packet | `package_skill.py --check` (exit 0 required) |
| Inventory diff | Packet tree vs exemplar | Directory listing comparison against `mcp-chrome-devtools/` |
| Citation audit | All operational claims | Manual cross-check against `../001-research/research/research.md` findings |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 converged synthesis | Internal | Pending (predecessor) | Authoring cannot start without verified surface facts |
| `mcp-chrome-devtools` exemplar tree | Internal | Green | Inventory and tone reference unavailable |
| sk-doc create-skill-parent standards | Internal | Green | Packet shape would drift from hub canon |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `package_skill.py --check` cannot reach exit 0, the citation audit finds invented surface, or research invalidates the `cli-plus-mcp` posture mid-phase.
- **Procedure**: The packet is a purely additive new tree — `git clean`/`git checkout` of `.opencode/skills/mcp-tooling/mcp-aside-devtools/` removes it completely without touching the hub or the three live modes. Re-author from the research findings after the blocking question is resolved.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
