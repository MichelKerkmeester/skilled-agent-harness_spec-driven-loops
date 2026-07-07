---
title: "Implementation Summary: Deep-context native agent runtime mirror parity"
description: "Deep-context's native seat now dispatches in all three runtimes: the two missing agent mirrors are created and the mirror convention is documented in two skills."
trigger_phrases:
  - "deep-context mirror summary"
  - "runtime mirror parity done"
  - "deep-context claude codex mirror"
  - "deep-loop agent mirror convention"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/025-deep-context-gathering/005-runtime-mirror-parity"
    last_updated_at: "2026-06-07T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Created Claude and Codex deep-context mirrors plus two skill notes"
    next_safe_action: "Optional: add a CI three-way parity guard in a follow-up packet"
    blockers: []
    key_files:
      - ".opencode/agents/deep-context.md"
      - ".claude/agents/deep-context.md"
      - ".codex/agents/deep-context.toml"
      - ".opencode/skills/deep-context/SKILL.md"
      - ".opencode/skills/deep-loop-runtime/SKILL.md"
      - ".opencode/commands/deep/start-context-loop.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-134-005-runtime-mirror-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mirror the agent vs fork the command? -> mirror (commands are shared symlinks)."
      - "Note location? -> deep-context SKILL.md + deep-loop-runtime SKILL.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-runtime-mirror-parity |
| **Completed** | 2026-06-07 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Deep-context's native analyzer seat now runs no matter which runtime you start the loop from. Before this change, `@deep-context` existed only in `.opencode/agents/`, so launching `/deep:start-context-loop` from Claude Code or Codex quietly dropped the two native seats from the default pool and weakened the cross-executor agreement signal. It was the only one of 13 agents missing its runtime mirrors.

### Two runtime mirrors

You can now dispatch the native seat by name from any runtime. `.claude/agents/deep-context.md` carries a read-only `tools:` allow-list (Read, Grep, Glob, the spec-memory MCP surface, and the two read-only code-graph tools); `.codex/agents/deep-context.toml` carries a read-only sandbox, the `gpt-5.4` model fields, and the body inside `developer_instructions`. Both reuse the canonical body verbatim, so the seat behaves identically everywhere.

### A convention that keeps the mirrors honest

The deep-context skill now explains that the native seat needs three files (one canonical source plus two mirrors) and adds an ALWAYS rule to re-sync the mirrors whenever the canonical agent changes. The deep-loop-runtime skill carries the same rule generalized to every deep-loop agent, so the next person who adds a deep-loop agent knows to create all three files.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.claude/agents/deep-context.md` | Created | Claude mirror (read-only `tools:` frontmatter + canonical body) |
| `.codex/agents/deep-context.toml` | Created | Codex mirror (read-only sandbox + `developer_instructions` body) |
| `.opencode/skills/deep-context/SKILL.md` | Modified | Runtime Mirrors note, ALWAYS rule, neutralized "native Claude agents" |
| `.opencode/skills/deep-loop-runtime/SKILL.md` | Modified | General per-runtime mirror convention note |
| `.opencode/commands/deep/start-context-loop.md` | Modified | Neutralized "(Opus)" on the native-only pool option |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both mirrors were assembled from the canonical body slice (lines 25-387) rather than retyped, so the bodies are guaranteed byte-identical. Verification ran four checks: a three-way parity matrix (now `deep-context ✓ ✓ ✓`), a body diff (identical across all three files), a TOML parse (valid, `sandbox_mode = "read-only"`), and a read-only tools-line check on the Claude mirror. A grep confirmed no model-on-native token remains in the command or either loop YAML.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Mirror the agent, do not fork the command | Commands and the loop YAML are shared symlinks; the YAML already dispatches the native seat by name, so only the per-runtime agent files were missing |
| Build mirrors from the canonical body slice | Guarantees byte-identical bodies and avoids transcription drift |
| Use the wildcard `mcp__mk_spec_memory__*` plus explicit code-graph tools | Matches the sibling read-only convention while granting the code-graph tools deep-context actually needs, without a broad `mcp__mk_code_index__*` wildcard |
| Codex `sandbox_mode = "read-only"` | deep-context is a read-only analyzer, so it mirrors `context.toml`, not the workspace-write `deep-research.toml` |
| Document in two places | The deep-context skill covers this agent; the deep-loop-runtime skill generalizes the rule to all deep-loop agents |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Three-way agent parity (`deep-context`) | PASS, present in `.opencode/agents`, `.claude/agents`, `.codex/agents` |
| Body diff canonical vs Claude mirror | PASS, byte-identical |
| Body diff canonical vs Codex `developer_instructions` | PASS, byte-identical |
| Codex TOML parse | PASS, keys present, `sandbox_mode = "read-only"`, `model = "gpt-5.4"` |
| Claude `tools:` read-only | PASS, no Write/Edit/Bash/Task/WebFetch |
| Residual model-on-native tokens in command/YAML | PASS, none found |
| `validate.sh --strict` (this packet) | PASS (see checklist evidence) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Mirrors are hand-maintained.** No automated converter or CI guard exists yet; the two SKILL notes plus the verification grep are the current control. A three-way parity CI check is a sensible follow-up packet.
2. **Codex model pinned to `gpt-5.4`.** This matches every other `.codex/agents/*.toml`; if the house default bumps, update all Codex agents together, not just this one.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
