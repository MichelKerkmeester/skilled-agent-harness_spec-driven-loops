---
title: "Feature Specification: Deep-context native agent runtime mirror parity"
description: "The native @deep-context analyzer agent existed only in .opencode/agents/, so running /deep:start-context-loop from Claude Code or Codex silently lost its native seats. This packet adds the two missing runtime mirrors and a maintenance note."
trigger_phrases:
  - "deep-context runtime mirror"
  - "deep-context agent claude codex"
  - "native seat dispatch parity"
  - "deep-loop agent mirror"
  - "runtime mirror parity"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering/005-runtime-mirror-parity"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Created .claude/.codex deep-context mirrors plus skill mirror notes"
    next_safe_action: "Run validate.sh --strict and reconcile completion metadata"
    blockers: []
    key_files:
      - ".opencode/agents/deep-context.md"
      - ".claude/agents/deep-context.md"
      - ".codex/agents/deep-context.toml"
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-005-runtime-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Fork commands per runtime or mirror the agent? -> mirror the agent (commands are shared symlinks)."
      - "Where does the maintenance note live? -> deep-context SKILL.md + deep-loop-runtime SKILL.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-context native agent runtime mirror parity

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-07 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The framework supports three runtimes — OpenCode, Claude Code, Codex — whose `agents/` directories are real, separate folders (unlike `commands`/`skills`/`specs`, which are symlinks to `.opencode/`). The native `@deep-context` analyzer agent existed only as `.opencode/agents/deep-context.md`; it was the only one of 13 agents missing its `.claude/agents/*.md` and `.codex/agents/*.toml` mirrors. Because `/deep:start-context-loop` dispatches native seats **by name** from the host runtime's own `agents/` dir, running the loop from Claude Code or Codex silently lost the two native seats from the default pool, degrading the cross-executor agreement signal.

### Purpose
Make the native `@deep-context` seat dispatch correctly in all three runtimes and add a durable note so future updates keep the runtime mirrors in sync.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Create `.claude/agents/deep-context.md` (Claude mirror, read-only `tools:` frontmatter, canonical body).
- Create `.codex/agents/deep-context.toml` (Codex mirror, read-only sandbox, body in `developer_instructions`).
- Add a "Runtime Mirrors" note + ALWAYS rule to `.opencode/skills/deep-context/SKILL.md`.
- Add a general "Per-runtime agent mirrors" convention note to `.opencode/skills/deep-loop-runtime/SKILL.md`.
- Neutralize the one runtime-specific model word (`(Opus)`) in the shared command.

### Out of Scope
- Forking the command/loop YAML per runtime - they are shared symlinks by design; forking would break ~30 commands.
- Touching the 12 sibling agents - they already have three-way parity.
- A CI parity guard - valuable but a separate packet; the SKILL notes are the immediate control.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/agents/deep-context.md` | Create | Claude runtime mirror of the canonical agent |
| `.codex/agents/deep-context.toml` | Create | Codex runtime mirror of the canonical agent |
| `.opencode/skills/deep-context/SKILL.md` | Modify | Runtime Mirrors note + ALWAYS rule + neutralize "native Claude agents" |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modify | General per-runtime mirror convention note |
| `.opencode/commands/deep/start-context-loop.md` | Modify | Neutralize "(Opus)" on the native-only pool option |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `.claude/agents/deep-context.md` exists with read-only `tools:` frontmatter and the canonical body | File present; `tools:` line has no Write/Edit/Bash/Task/WebFetch; body byte-identical to canonical lines 25-387 |
| REQ-002 | `.codex/agents/deep-context.toml` exists, parses, and is read-only | TOML parses; `sandbox_mode = "read-only"`; `developer_instructions` body identical to canonical |
| REQ-003 | Three-way agent parity restored | `deep-context` present in `.opencode/agents`, `.claude/agents`, `.codex/agents` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | deep-context SKILL.md documents the runtime-mirror requirement | "Runtime Mirrors" subsection + an ALWAYS rule present |
| REQ-005 | deep-loop-runtime SKILL.md documents the general mirror convention | "Per-runtime agent mirrors" note present, covering all deep-loop agents |
| REQ-006 | Shared command carries no model-specific assumption on native seats | No `Opus`/model-on-native token remains in command or either YAML |

### Acceptance Criteria (Given/When/Then)

- **Given** the loop runs from Claude Code, **When** the default pool dispatches a native seat, **Then** `.claude/agents/deep-context.md` resolves by name and the seat runs.
- **Given** the loop runs from Codex, **When** the default pool dispatches a native seat, **Then** `.codex/agents/deep-context.toml` resolves by name and the seat runs.
- **Given** the three agent files, **When** their bodies are diffed, **Then** they are byte-identical (only frontmatter differs).
- **Given** the Codex mirror, **When** it is parsed as TOML, **Then** it parses and `sandbox_mode == "read-only"`.
- **Given** a future edit to the canonical agent, **When** an author reads the SKILL, **Then** the ALWAYS rule directs them to re-sync both mirrors.
- **Given** the shared command, **When** grepped for native-seat model tokens, **Then** no `Opus` or fixed model name remains.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Three-way parity matrix shows `deep-context | OpenCode ✓ | Claude ✓ | Codex ✓`.
- **SC-002**: Both mirror bodies are byte-identical to the canonical agent; Codex TOML parses with `sandbox_mode = "read-only"`.
- **SC-003**: Both SKILL.md notes are present and `validate.sh --strict` passes for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Canonical `.opencode/agents/deep-context.md` body | Mirrors must track it | ALWAYS rule + general convention note; mirrors built from the canonical slice |
| Risk | Future drift between canonical and mirrors | Med - native seats fail in a runtime | Documented sync rule in two SKILLs; parity grep in verification |
| Risk | Codex TOML escaping of the markdown body | Low - invalid TOML | Verified body contains no `'''`; TOML parsed in verification |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime cost change — mirrors are static agent definitions resolved at dispatch.
- **NFR-P02**: Native seats now contribute to the parallel sweep in all runtimes, restoring the intended agreement signal.

### Security
- **NFR-S01**: Mirrors preserve the read-only LEAF contract (no Write/Edit/Bash/Task; Codex `sandbox_mode = "read-only"`).
- **NFR-S02**: No secrets or credentials introduced; agent bodies are identical to the audited canonical.

### Reliability
- **NFR-R01**: Three-way parity for `deep-context` (and the convention to keep it) prevents silent native-seat dispatch failure.
- **NFR-R02**: CLI seats are unaffected; degraded-pool behavior only ever drops to documented graceful agreement degradation.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: N/A — no user input surface; this is a static agent-definition change.
- Maximum length: Codex `developer_instructions` holds the full body inside a `'''` literal; verified no `'''` collision.
- Invalid format: Codex TOML validated by a parser in the verification step.

### Error Scenarios
- Missing mirror in a runtime: native seats silently fail there — the exact condition this packet removes and documents.
- Canonical edited without mirror sync: covered by the ALWAYS rule and the general convention note.
- Wildcard MCP tool grant: avoided — code-graph tools listed explicitly, not via `mcp__mk_code_index__*`.

### State Transitions
- Partial completion: each file is independent; a missing file is caught by the parity grep.
- Session expiry: N/A.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 2 files created (mechanical mirrors) + 3 small doc edits |
| Risk | 6/25 | No logic change; read-only agents; reversible |
| Research | 6/20 | Convention discovery done; pattern fully established by siblings |
| **Total** | **20/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. Approach and note location were confirmed with the user before implementation.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
