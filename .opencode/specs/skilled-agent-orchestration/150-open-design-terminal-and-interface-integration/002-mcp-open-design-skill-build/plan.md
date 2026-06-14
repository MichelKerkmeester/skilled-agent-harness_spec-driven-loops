---
title: "Implementation Plan: mcp-open-design skill build"
description: "Plan record for the shipped mcp-open-design v1.0.0 build: wire Open Design via od mcp, map and gate the ~18-tool MCP surface, document the headless od verbs, modeled on mcp-magicpath. Already delivered as commit 0508518ac9."
trigger_phrases:
  - "mcp-open-design build plan"
  - "open design skill build plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/002-mcp-open-design-skill-build"
    last_updated_at: "2026-06-14T16:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Recorded the executed approach for the shipped v1.0.0 build"
    next_safe_action: "Operator reviews the record, then phase 003 de-vendor follows"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:69921e626fd51c2a22c66e8c625560537d48f674267226545c958d290e0d32dd"
      session_id: "session-150-002-mcp-open-design-skill-build"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: mcp-open-design skill build

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs (SKILL.md, three references, feature catalog, playbook, README, changelog, graph-metadata) |
| **Framework** | OpenCode skill structure, sk-doc templates, house voice |
| **Storage** | `.opencode/skills/mcp-open-design/` |
| **Testing** | `package_skill.py --check`, `validate.sh --strict` on this packet |

### Overview
Build the `mcp-open-design` skill from the phase 001 research ground-truth, modeled on the `mcp-magicpath` package shape. The skill carries the wire direction (`od mcp install <agent>`), the read direction (read-only tools and design-system reads), the run direction (headless generation), and a surface, gate, and omit policy that keeps mutating and destructive verbs off the default path. This plan records the approach that shipped as commit `0508518ac9`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The phase 001 terminal surface, tool tiers, and transport are documented
- [x] The `mcp-magicpath` package shape is available as the structural model
- [x] The tool-exposure policy (surface, gate, omit) is fixed

### Definition of Done
- [x] The skill package is complete with SKILL.md, references, catalog, playbook, README, changelog
- [x] Every mutating verb is gated and every destructive verb is omitted from the default path
- [x] `package_skill.py --check` PASS and the skill validates clean
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Model-on-sibling skill build. The `mcp-magicpath` package is the structural template, and the phase 001 research is the source of truth for Open Design's terminal surface.

### Key Components
- **SKILL.md**: the runtime contract. Carries the wire, read, and run directions and the ALWAYS/NEVER rules that lock the gate policy in.
- **references/**: `mcp_wiring.md` (the `od mcp install` wiring and config shape), `tool_surface.md` (the ~18 MCP tools and the surface/gate/omit policy), `od_cli_reference.md` (the headless `od` verbs and transport).
- **feature_catalog/ and manual_testing_playbook/**: the capability inventory and the operator scenarios, across wiring, reading, grounding, runs, and transport.

### Data Flow
Phase 001 research to SKILL.md and references to feature catalog and playbook to README and changelog to graph-metadata, then validation.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The only writes were to the new `mcp-open-design` skill and (in this packet) its control docs. No application code was touched.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/mcp-open-design/SKILL.md` | Runtime contract | Created at v1.0.0 | package check PASS |
| `.opencode/skills/mcp-open-design/references/` | Wiring, tools, CLI detail | Created | package check PASS |
| `.opencode/skills/mcp-open-design/feature_catalog/` | Capability inventory | Created | package check PASS |
| `.opencode/skills/mcp-open-design/manual_testing_playbook/` | Operator scenarios | Created | package check PASS |
| `.opencode/skills/mcp-open-design/changelog/` | Version history | v1.0.0.0 added | file present |
| `.opencode/skills/mcp-magicpath/graph-metadata.json` | Structural-model skill | Reciprocal edge added | skill graph valid |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the phase 001 research ground-truth (terminal surface, tool tiers, transport)
- [x] Read the `mcp-magicpath` package as the structural model
- [x] Fix the surface, gate, and omit policy for every verb class

### Phase 2: Core Implementation
- [x] Author SKILL.md with the wire, read, and run directions and the ALWAYS/NEVER rules
- [x] Author the three references (mcp_wiring, tool_surface, od_cli_reference)
- [x] Author the feature catalog, the manual testing playbook, the README, the v1.0.0.0 changelog, and graph-metadata

### Phase 3: Verification
- [x] `package_skill.py --check` PASS with no word-count warning
- [x] Confirm every mutating verb is gated and every destructive verb is omitted from the default path
- [x] `validate.sh --strict` on this packet reports zero errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Skill structure | The whole skill package | `package_skill.py --check` |
| Policy review | Every verb classified surface, gate, or omit | manual review of tool_surface.md |
| Voice | No em dashes, no prose semicolons in new prose | targeted grep |
| Spec validation | This packet's docs | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research ground-truth | Input | Green | Without it the skill has no source of truth for the terminal surface |
| `mcp-magicpath` package | Internal | Green | No structural model to follow |
| `package_skill.py` | Internal | Green | No skill-structure check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The skill is found inaccurate or fails its structure check and cannot be fixed.
- **Procedure**: Revert commit `0508518ac9`. The change is a new documentation-only skill, so there is no runtime or data state to unwind. The `mcp-magicpath` reciprocal edge would revert with it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Implementation) ──► Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 research | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read the research and the model skill |
| Implementation | Medium | Author the full skill package |
| Verification | Low | Package check, policy review, strict validate |
| **Total** | Medium | One focused session |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data changes, so no backup needed (verified) docs-only skill
- [x] No feature flag involved (verified) skill markdown has no runtime gate
- [x] The skill is additive (verified) a new skill, no existing surface removed

### Rollback Procedure
1. Revert commit `0508518ac9`.
2. Re-run `package_skill.py --check` on any sibling skill to confirm the registry is valid.
3. Confirm the `mcp-magicpath` reciprocal edge reverted with it.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, the change is documentation only
<!-- /ANCHOR:enhanced-rollback -->
