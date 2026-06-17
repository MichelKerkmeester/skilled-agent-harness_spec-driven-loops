---
title: "Implementation Plan: Mobbin and Refero design-reference integration"
description: "Wire Mobbin and Refero into Code Mode via the mcp-remote stdio bridge, then integrate them into sk-interface-design as a critique-against reference with a new reference doc and SKILL.md routing. Documentation and config only, no generation, no copied content."
trigger_phrases:
  - "mobbin refero integration plan"
  - "mcp-remote bridge code mode plan"
  - "design references mcp plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/009-mobbin-refero-design-reference-integration"
    last_updated_at: "2026-06-15T11:20:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Wired both MCPs and authored the skill integration"
    next_safe_action: "User OAuth plus Code Mode reload, then verify the tools resolve"
    blockers: []
    key_files:
      - ".utcp_config.json"
      - ".opencode/skills/sk-interface-design/references/design_references_mcp.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-009-mobbin-refero-design-reference-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Mobbin and Refero design-reference integration

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON config (Code Mode UTCP) plus Markdown skill docs |
| **Framework** | Code Mode UTCP manuals; the `mcp-remote` stdio bridge for remote OAuth endpoints |
| **Storage** | None (references are read live, never cached) |
| **Testing** | `package_skill --check`, JSON parse, endpoint liveness probe |

### Overview
Add two `mcp-remote` stdio manuals to `.utcp_config.json` so Code Mode can reach the Mobbin and Refero reference APIs, then integrate them into sk-interface-design as a critique-against reference through a new `design_references_mcp.md` and matching SKILL.md routing. The skill owns the judgment; Code Mode owns the transport.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (Code Mode, mcp-remote, user OAuth)

### Definition of Done
- [x] Both manuals valid in `.utcp_config.json`
- [x] Skill integration authored; `package_skill --check` passes
- [ ] Live tool resolution verified (blocked on user OAuth plus Code Mode reload)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Reference-as-judgment-input. A real-world reference is resolved one at a time and used as the named default to deviate from, mirroring the design-system path in `design_inventory.md`. No generation, no chooser.

### Key Components
- **Code Mode manuals** (`mobbin`, `refero`): the stdio transport to the remote reference APIs via `mcp-remote`.
- **`references/design_references_mcp.md`**: the critique-against use and the hard rules.
- **SKILL.md routing**: an ON_DEMAND row, a references entry, a Related Skills bullet, and a loading note.

### Data Flow
Brief -> ground the subject (`design_principles.md` STEP 0) -> resolve one real-world reference via Code Mode -> name the default -> deviate deliberately -> quality floor gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix, but the change touches a shared config and a shared skill, so the surfaces are recorded.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.utcp_config.json` | Code Mode manual registry | add `mobbin` + `refero` mcp-remote manuals | JSON parses; both manuals present |
| sk-interface-design SKILL.md + references | The skill's routing and reference docs | add the critique-against reference + routing | `package_skill --check` PASS |
| `references/design_inventory.md` | The design-system critique-against path | add a cross-pointer to the new reference | grep shows the pointer |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the Mobbin and Refero MCP endpoints, auth model, and the mcp-remote bridge
- [x] Back up `.utcp_config.json`

### Phase 2: Core Implementation
- [x] Add the `mobbin` and `refero` mcp-remote manuals to `.utcp_config.json`
- [x] Author `references/design_references_mcp.md` (critique-against use plus hard rules)
- [x] Integrate into SKILL.md and add the `design_inventory.md` cross-pointer

### Phase 3: Verification
- [x] JSON parse, endpoint liveness probe, `package_skill --check`, house-voice sweep
- [ ] Live tool resolution after the user's OAuth and a Code Mode reload
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Config + skill structure | JSON parse, `package_skill --check`, grep |
| Integration | Endpoint reachability | `curl` liveness probe (auth challenge expected) |
| Manual | Tool resolution in Code Mode | `search_tools` / `list_tools` after the user OAuths and reloads |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Code Mode (UTCP) | Internal | Yellow | Manuals load at startup; new ones need a reload |
| `mcp-remote` | External | Green | Bridges the remote OAuth endpoints to stdio |
| User OAuth (paid subs) | External | Yellow | Tools do not resolve until the user authorizes |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A manual misbehaves, or the integration needs to be withdrawn.
- **Procedure**: `git checkout -- .utcp_config.json` removes the two manuals (open_design stays); revert the skill doc edits with `git revert` of the scoped commit. The changes are additive config and docs with no runtime state.
<!-- /ANCHOR:rollback -->
