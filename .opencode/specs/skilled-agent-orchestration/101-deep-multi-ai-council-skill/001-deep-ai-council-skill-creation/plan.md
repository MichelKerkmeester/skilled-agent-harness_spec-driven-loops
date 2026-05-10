---
title: "Implementation Plan: 101/001 Deep AI Council Skill Creation"
description: "Create the dedicated deep-ai-council skill package, move council workflow assets out of system-spec-kit, rename runtime agents, and update advisor routing without adding graph support."
trigger_phrases:
  - "101/001 plan"
  - "deep-ai-council implementation plan"
  - "council skill extraction plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/101-deep-multi-ai-council-skill/001-deep-ai-council-skill-creation"
    last_updated_at: "2026-05-10T08:10:34Z"
    last_updated_by: "openai-gpt-5.5-opencode"
    recent_action: "Executed skill creation, runtime rename, advisor routing, and council test path updates"
    next_safe_action: "Index Phase 001 continuity"
    blockers: []
    key_files:
      - .opencode/skills/deep-ai-council/
      - .opencode/agents/
      - .claude/agents/
      - .codex/agents/
      - .gemini/agents/
      - .opencode/skills/system-spec-kit/mcp_server/skill_advisor/
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "101-001-skill-creation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase 001 excludes graph support."
      - "Compatibility shim is not required by active runtime mirror evidence."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: 101/001 Deep AI Council Skill Creation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, JavaScript, TypeScript, Python, TOML |
| **Framework** | OpenCode skills and runtime agents, Spec Kit skill advisor |
| **Storage** | Existing council artifact files and JSONL state only |
| **Testing** | Advisor regression tests, skill graph validation, script tests, spec validation |

### Overview
This phase extracts council deliberation into `.opencode/skills/deep-ai-council/` and renames the runtime agent surface to `deep-ai-council`. The implementation should move ownership cleanly, update routing and tests, and defer all graph storage work to Phase 002.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Existing `multi-ai-council` agent mirrors and council references have been read.
- [x] Old-name consumers have been searched before deleting or renaming files.
- [x] Skill advisor metadata and test surfaces are identified.

### Definition of Done
- [x] `deep-ai-council` skill package exists with required metadata and references.
- [x] Runtime mirrors use the renamed `deep-ai-council` agent.
- [x] Advisor source scorer and generated skill graph route council prompts to the new skill.
- [x] Council artifact script tests pass after path changes.
- [x] `validate.sh --strict` passes for this phase folder.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dedicated workflow skill with runtime-agent mirrors and moved council artifact utilities.

### Key Components
- **Skill package**: `.opencode/skills/deep-ai-council/` owns workflow instructions, references, metadata, and test assets.
- **Runtime agents**: `.opencode`, `.claude`, `.codex`, and `.gemini` mirrors expose one `deep-ai-council` identity.
- **Artifact utilities**: Persistence, audit trail, rollback, and completion advice scripts move with the skill if they remain council-specific.
- **Advisor integration**: Skill advisor metadata and regressions learn that council deliberation belongs to `deep-ai-council`.

### Data Flow
User asks for council deliberation, skill advisor recommends `deep-ai-council`, runtime dispatch loads the renamed agent, and the agent writes packet-local `ai-council/**` artifacts using the skill-owned persistence contract.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Runtime agent mirrors | Expose `multi-ai-council` | Rename to `deep-ai-council` | Grep old/new names across `.opencode`, `.claude`, `.codex`, `.gemini` |
| `system-spec-kit` council references | Own council workflow docs | Move/adapt into new skill | Path existence and docs search |
| Council scripts | Persist/audit/rollback council artifacts | Move/adapt if council-specific | Targeted script tests |
| Skill advisor | Routes skill recommendations | Add new skill metadata and tests | Advisor validation and regression tests |
| Skill graph | Indexes skill relationships | Add `deep-ai-council` node | Skill graph scan and validate |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This is not a bug-fix packet, but it changes shared routing and dispatch names. The implementation must inventory both producers and consumers before deleting old names.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Agent definitions | Producer of callable council personas | Rename and mirror | `rg -n "multi-ai-council|deep-ai-council" .opencode .claude .codex .gemini` |
| Commands and docs | Possible consumers of old agent name | Update or prove not a consumer | `rg -n "multi-ai-council" .opencode .claude .codex .gemini specs` |
| Tests and fixtures | Possible hard-coded old paths | Update expected skill ID/path | Targeted advisor and script tests |
| Skill advisor graph | Discovery and routing producer | Add new skill metadata | Advisor validation and skill graph validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Inventory old-name producers and consumers.
- [ ] Create the `deep-ai-council` skill directory structure.
- [ ] Decide whether any compatibility shim is justified by concrete consumer evidence.

### Phase 2: Core Implementation
- [ ] Add `SKILL.md`, `description.json`, and `graph-metadata.json` for `deep-ai-council`.
- [ ] Move/adapt references, assets, testing playbook, and council scripts.
- [ ] Rename runtime agent mirrors.
- [ ] Update advisor metadata, aliases, generated graph, and regressions.

### Phase 3: Verification
- [ ] Run advisor validation for council prompts.
- [ ] Run skill graph scan and validation.
- [ ] Run moved council script tests.
- [ ] Run `.opencode` alignment verification for touched OpenCode surfaces.
- [ ] Run `validate.sh --strict` on this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Search inventory | Old-name producers and consumers | `rg` or Grep over runtime and spec surfaces |
| Advisor regression | Council prompts route to `deep-ai-council` | Advisor validation scripts/MCP validation |
| Skill graph | New skill metadata compiles and validates | Skill graph scan/validate |
| Script behavior | Artifact persistence, audit, rollback, completion advice | Existing moved script tests |
| Spec validation | Phase docs and metadata | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `multi-ai-council` files | Internal | Green | Required for rename and migration inventory |
| sk-doc skill creation guidance | Internal | Green | Required for skill structure and manual testing playbook |
| system-spec-kit advisor implementation | Internal | Green | Required for routing update |
| Phase 002 graph support | Future phase | Deferred | Not required for Phase 001 completion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Advisor routing fails, runtime agent mirrors diverge, or moved council scripts lose artifact behavior.
- **Procedure**: Revert the Phase 001 file moves and renames as one change set, restore `system-spec-kit` council references/scripts, and restore old runtime agent filenames only if implementation cannot be fixed quickly.
<!-- /ANCHOR:rollback -->
