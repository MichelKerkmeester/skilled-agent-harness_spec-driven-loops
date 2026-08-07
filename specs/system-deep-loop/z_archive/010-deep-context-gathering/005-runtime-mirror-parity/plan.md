---
title: "Implementation Plan: Deep-context native agent runtime mirror parity"
description: "Mirror the canonical .opencode/agents/deep-context.md into the Claude (.md) and Codex (.toml) runtime agent dirs, then document the mirror convention in two SKILLs and neutralize one model-specific word in the shared command."
trigger_phrases:
  - "deep-context mirror plan"
  - "runtime agent mirror approach"
  - "deep-context claude codex plan"
  - "agent parity implementation"
  - "deep-loop mirror convention"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/010-deep-context-gathering/005-runtime-mirror-parity"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan for deep-context runtime mirror parity"
    next_safe_action: "Verify parity, TOML, body diff, validate.sh --strict"
    blockers: []
    key_files:
      - ".claude/agents/deep-context.md"
      - ".codex/agents/deep-context.toml"
      - ".opencode/skills/deep-context/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-005-runtime-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deep-context native agent runtime mirror parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent defs (Claude `.md`), TOML agent defs (Codex `.toml`), Markdown skill docs |
| **Framework** | OpenCode / Claude Code / Codex multi-runtime agent dirs |
| **Storage** | Filesystem agent definitions (no DB) |
| **Testing** | `validate.sh --strict`, three-way parity grep, TOML parse, body diff |

### Overview
The canonical `.opencode/agents/deep-context.md` is the source of truth. We build the two missing runtime mirrors by reusing its body verbatim and swapping only the frontmatter to each runtime's format (Claude `tools:` allow-list; Codex TOML `developer_instructions` with read-only sandbox). We then document the mirror requirement so the gap cannot silently recur.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (the canonical agent + sibling mirror conventions)

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (parity, TOML parse, body diff, validate.sh --strict)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical-source + runtime-mirror packaging. One canonical OpenCode agent; per-runtime mirrors carry the same body with runtime-specific frontmatter. Commands/YAML are shared (symlinks) and dispatch native seats by name, resolved per runtime.

### Key Components
- **Canonical agent**: `.opencode/agents/deep-context.md` (`mode: subagent` + `permission:` block).
- **Claude mirror**: `.claude/agents/deep-context.md` (`tools:` allow-list).
- **Codex mirror**: `.codex/agents/deep-context.toml` (`developer_instructions` + `# Converted from:` header + `sandbox_mode`).

### Data Flow
`/deep:start-context-loop` (shared) -> loop YAML `agent: deep-context` -> host runtime resolves the name from its own `agents/` dir -> native seat runs read-only and returns findings to the host.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/agents/deep-context.md` | Canonical native-seat definition | unchanged (source) | body diff vs mirrors |
| `.claude/agents/deep-context.md` | Claude native-seat resolution target | create | `ls .claude/agents`; tools-line read-only grep |
| `.codex/agents/deep-context.toml` | Codex native-seat resolution target | create | TOML parse; `sandbox_mode` check |
| `.opencode/commands/deep/start-context-loop.md` (shared) | Loop entrypoint, names native pool | update wording | grep no `Opus` remains |
| `deep_start-context-loop_{auto,confirm}.yaml` (shared) | Dispatch native seat by name | unchanged | grep `agent: deep-context` present |
| `deep-context` / `deep-loop-runtime` SKILL.md | Convention docs | update | grep mirror note present |

Required inventories:
- Three-way parity: `ls .opencode/agents .claude/agents .codex/agents`.
- Native dispatch refs: `rg -n 'agent: deep-context|agent_file' .opencode/commands/deep/assets/deep_start-context-loop_*.yaml`.
- Residual model tokens: `rg -n 'Opus|native Claude' <command + yamls>`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm symlink-vs-real-dir structure and three-way parity gap
- [x] Confirm canonical body line range (25-387) and TOML safety (no `'''`)
- [x] Confirm read-only frontmatter pattern from `context.md` / `context.toml`

### Phase 2: Core Implementation
- [x] Assemble `.claude/agents/deep-context.md` from canonical body + Claude frontmatter
- [x] Assemble `.codex/agents/deep-context.toml` from canonical body + Codex frontmatter
- [x] Add Runtime Mirrors note + ALWAYS rule to deep-context SKILL.md (and neutralize "native Claude agents")
- [x] Add general mirror convention to deep-loop-runtime SKILL.md
- [x] Neutralize "(Opus)" in the shared command

### Phase 3: Verification
- [x] Three-way parity grep; body diff; TOML parse; read-only tools check
- [x] Confirm no residual model-on-native tokens in command/YAML
- [x] `validate.sh --strict` for this packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Three-way parity, body diff | `ls`, `diff`, `sed` |
| Format | Codex TOML validity, Claude read-only tools | python `tomllib`/`tomli`, `grep` |
| Doc | SKILL notes present, spec docs valid | `rg`, `validate.sh --strict` |
| Manual | Native seat resolves by name per runtime | inspect `agents/` dirs + YAML `agent:` field |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `.opencode/agents/deep-context.md` (canonical) | Internal | Green | No source body to mirror |
| Sibling mirror convention (`deep-research`, `context`) | Internal | Green | No template to follow |
| `validate.sh` strict contract | Internal | Green | Cannot confirm completion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A mirror causes a dispatch error in any runtime.
- **Procedure**: Delete the offending mirror file(s); native seats revert to the prior (OpenCode-only) behavior. Doc edits are independently revertible via git.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1 (Discovery) ──┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | discovery already complete |
| Core Implementation | Low | mechanical mirror + small edits |
| Verification | Low | scripted checks |
| **Total** | Low | **~1-2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Canonical body confirmed as source of truth
- [x] No data migrations (static files)
- [x] Reversible via git

### Rollback Procedure
1. Remove `.claude/agents/deep-context.md` and/or `.codex/agents/deep-context.toml`.
2. `git checkout` the SKILL.md and command edits.
3. Re-run the three-way parity grep to confirm prior state.
4. No stakeholder notification needed (internal tooling).

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
