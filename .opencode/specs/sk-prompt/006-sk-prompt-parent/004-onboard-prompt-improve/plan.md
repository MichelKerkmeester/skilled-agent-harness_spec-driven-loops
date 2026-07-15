---
title: "Implementation Plan: Phase 4: onboard-prompt-improve"
description: "Plan the history-preserving relocation of today's sk-prompt prompt-improvement engine into the parent hub's prompt-improve workflow packet. The implementation approach is a narrow git mv plus command rename, two agent repoints, targeted reference cleanup, and a /prompt-improve smoke test."
trigger_phrases:
  - "prompt-improve implementation plan"
  - "sk-prompt git mv"
  - "prompt command rename"
  - "prompt-improver agent repoint"
  - "phase 004"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve"
    last_updated_at: "2026-07-09T16:00:00Z"
    last_updated_by: "claude"
    recent_action: "Executed as planned"
    next_safe_action: "Proceed to phase 005"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-onboard-prompt-improve"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: onboard-prompt-improve

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown, JSON/YAML frontmatter, OpenCode command and agent definitions |
| **Framework** | OpenCode skill parent-hub workflow packet pattern |
| **Storage** | Repository files only |
| **Testing** | Targeted grep checks, parent-skill gate, command smoke test, strict spec validation |

### Overview
This phase will move the active sk-prompt prompt-improvement skill into `.opencode/skills/sk-prompt/prompt-improve/` without changing its prompt-improvement behavior. The future implementation is intentionally mechanical: preserve history with `git mv`, rename `/prompt` to `/prompt-improve`, repoint both prompt-improver agent files, clean the named old-path consumers, and verify the relocated command resolves end-to-end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 hub skeleton and empty `prompt-improve/` packet are present.
- [ ] Current `.opencode/skills/sk-prompt/` source tree is intact before move.
- [ ] Phase 005 owns `.opencode/skills/sk-prompt-models/` and benchmark path repointing, so this phase can avoid that surface.

### Definition of Done
- [ ] Prompt-improvement files have been moved with `git mv` into `.opencode/skills/sk-prompt/prompt-improve/` with no behavior edits.
- [ ] `/prompt-improve` command file exists, resolves the relocated mode, and `/prompt` has been removed by rename.
- [ ] `.opencode/agents/prompt-improver.md` and `.claude/agents/prompt-improver.md` point at the relocated packet.
- [ ] Targeted grep checks and `/prompt-improve` smoke test pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Parent hub with nested workflow packet.

### Key Components
- **`prompt-improve/` workflow packet**: Future home for today's sk-prompt `SKILL.md`, README, assets, references, changelog, and manual testing playbook content, excluding duplicated packet-level graph metadata.
- **`/prompt-improve` command**: Renamed command surface that loads the relocated prompt-improvement workflow.
- **Prompt-improver agents**: OpenCode and Claude agent definitions that must reference the relocated mode after the move.
- **Named old-path consumers**: Explicit graph metadata and constitutional/preload references that must not retain dangling `sk-prompt/SKILL.md` paths.

### Data Flow
Users invoke `/prompt-improve` or the prompt-improver agent, those entrypoints load the relocated `prompt-improve/SKILL.md`, and the existing prompt-improvement workflow continues to use its moved assets and references without behavior change.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/sk-prompt/` | Current prompt-improvement engine source | Move into `prompt-improve/` with `git mv` | `git status --short` rename evidence and file inventory check |
| `.opencode/commands/prompt.md` | Current slash-command entrypoint | Rename to `.opencode/commands/prompt-improve.md` and update metadata | Command file inspection plus `/prompt-improve` smoke test |
| Prompt-improver agent files | Agent entrypoints for prompt improvement | Repoint to relocated packet | Grep for old and new paths in both agent files |
| Named graph/preload consumers | References to old `sk-prompt/SKILL.md` path | Update to new path or hub/mode wording as appropriate | Targeted grep against the named files |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 003 left the parent hub and empty `.opencode/skills/sk-prompt/prompt-improve/` packet location ready for population.
- [ ] Inventory today's `.opencode/skills/sk-prompt/` source tree before moving it, including `SKILL.md`, `README.md`, assets, references, changelog, and manual testing playbook content.
- [ ] Confirm `.opencode/skills/sk-prompt-models/` remains untouched for phase 005.

### Phase 2: Core Implementation
- [ ] Run a history-preserving move for the prompt-improvement tree, for example `git mv .opencode/skills/sk-prompt/<source-items> .opencode/skills/sk-prompt/prompt-improve/`, while keeping the single hub graph metadata identity rather than duplicating packet-local graph metadata.
- [ ] Rename `.opencode/commands/prompt.md` to `.opencode/commands/prompt-improve.md` and update command frontmatter/argument-hint text to reference the `prompt-improve` mode.
- [ ] Update `.opencode/agents/prompt-improver.md` and `.claude/agents/prompt-improver.md` so both load the relocated packet.
- [ ] Repoint old `sk-prompt/SKILL.md` references in `cli-claude-code/*`, `sk-code/graph-metadata.json`, `sk-doc/graph-metadata.json`, `system-deep-loop/graph-metadata.json`, and `system-spec-kit/constitutional/cli-dispatch-skill-preload.md`.

### Phase 3: Verification
- [ ] Verify `git status --short` reports rename-style movement for the relocated prompt-improvement files.
- [ ] Run targeted grep to prove no dangling old `sk-prompt/SKILL.md` references remain in the named consumers.
- [ ] Run `/prompt-improve` end-to-end once and confirm it resolves the relocated `SKILL.md`.
- [ ] Run the parent-skill check against the new hub layout and strict spec validation for this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | File inventory, moved paths, and old-reference cleanup | `git status --short`, `rg`/Grep |
| Integration | Parent-hub metadata and router compatibility after the move | `.opencode/commands/doctor/scripts/parent-skill-check.cjs` |
| Manual | `/prompt-improve` command resolves and completes one prompt-improvement run | OpenCode command smoke test |
| Spec | Phase documentation remains Level 1 compliant | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-prompt/006-sk-prompt-parent/004-onboard-prompt-improve --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 hub skeleton | Internal | Green, grounded in program context | Without the hub and packet location, this phase cannot move the prompt-improvement content into its target. |
| Current `.opencode/skills/sk-prompt/` tree | Internal | Green, grounded in program context | If the source tree changes before execution, re-inventory before running `git mv`. |
| Phase 005 prompt-models fold-in | Internal | Green, separate phase | Avoid touching prompt-models or benchmark paths here to preserve phase boundaries. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `/prompt-improve` does not resolve, the parent-skill check fails because of this phase's layout, or targeted grep shows unresolved old-path consumers after implementation.
- **Procedure**: Use `git mv` to move the prompt-improvement files and command file back to their previous locations, revert the two agent repoints and targeted reference edits, then re-run the same grep and smoke checks before retrying.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
