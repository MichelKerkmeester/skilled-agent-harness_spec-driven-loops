---
title: "Runtime Command and Agent Alignment Audit"
description: "OpenCode, Claude and Gemini command and agent docs were audited for drift against the current tool surface, hook matrix, Node floor, code-graph apply contract, advisor rebuild path and evergreen rules. Safe fixes were applied. Codex TOML agent drift was recorded as blocked by sandbox policy."
trigger_phrases:
  - "runtime command agent alignment"
  - "007-runtime-command-agent-alignment-audit"
  - "cross-runtime agent consistency"
  - "agent alignment audit"
  - "codex toml agent drift"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-30

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit/007-runtime-command-agent-alignment-audit` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/002-audit`

### Summary

Command and agent runtime docs across OpenCode, Claude and Gemini had drifted from the current tool surface after graph, hook, matrix and schema changes landed in earlier packets. References to stale Node floor versions, removed tool names, outdated hook wording and pre-migration advisor and memory tool names were scattered across doctor commands, memory commands, deep-loop YAML assets and agent definition files.

All editable runtimes were audited and corrected. Doctor command docs now cite the current Node floor, the code-graph apply contract and the `advisor_rebuild` tool. Memory command docs surface the `memory_retention_sweep` lifecycle. Agent files in OpenCode, Claude and Gemini now use runtime-generic hook matrix citations and carry the evergreen-doc rule. Codex TOML agents could not be patched because sandbox policy blocked writes to those files. That drift was documented with EPERM evidence in the remediation log so it remains visible rather than silently passing.

### Added

- `audit-findings.md` classifying every discovered command and agent file with pass, drift, missing, fixed or blocked status
- `remediation-log.md` mapping each finding to its outcome with evidence
- `cross-runtime-diff.md` recording aligned and intentionally divergent agents across runtimes

### Changed

- `.opencode/commands/doctor/` command docs refreshed: Node floor claim, code-graph apply contract and `advisor_rebuild` path updated
- `.opencode/commands/memory/` command docs updated to surface the `memory_retention_sweep` lifecycle
- `.opencode/commands/deep/assets/` deep-loop YAML assets updated to replace stale authority-guard packet prose
- `.opencode/agents/*.md` aligned to runtime-generic hook matrix citations, directory rule and evergreen-doc rule
- `.claude/agents/*.md` mirrored with equivalent fixes applied to all writable Claude agent definitions
- `.gemini/agents/*.md` mirrored with equivalent fixes applied to all writable Gemini agent definitions

### Fixed

- Stale Node floor claims in doctor command docs that no longer matched the active runtime prerequisite
- Outdated `advisor_rebuild` and `memory_retention_sweep` tool name references replaced with current names
- Over-specific Claude hook references in OpenCode, Claude and Gemini agents replaced with runtime-generic hook matrix language
- Missing evergreen-doc rule in write agents that would have caused future drift silently

### Verification

| Check | Result |
|-------|--------|
| Stale-reference grep on touched command and agent files | PASS, no output |
| Updated-reference grep for `memory_retention_sweep`, `advisor_rebuild`, hook matrix, directory rule and evergreen rule | PASS, all expected references present |
| Strict packet validator (`validate.sh --strict`) | PASS |
| CHK-001 Requirements documented in spec.md | PASS, evidence: spec.md |
| CHK-002 Technical approach defined in plan.md | PASS, evidence: plan.md |
| CHK-003 Dependencies identified and available | PASS, packets 042, 047, 048 summaries read plus canonical schemas |
| CHK-010 Documentation edits are syntax-safe | PASS, strict validator passed |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/commands/doctor/*.md` | Modified | Node floor, code-graph apply contract and advisor rebuild claims refreshed |
| `.opencode/commands/memory/*.md` | Modified | Retention sweep lifecycle surfaced in memory command docs |
| `.opencode/commands/deep/assets/*.yaml` | Modified | Stale authority-guard packet prose replaced |
| `.opencode/agents/*.md` | Modified | Hook, directory, evergreen and phase wording aligned to current matrix |
| `.claude/agents/*.md` | Modified | Same fixes mirrored to Claude agent definitions |
| `.gemini/agents/*.md` | Modified | Same fixes mirrored to Gemini agent definitions |
| `audit-findings.md` (NEW) | Created | Per-file classification of every command and agent discovered |
| `remediation-log.md` (NEW) | Created | Finding-to-outcome mapping with evidence per file |
| `cross-runtime-diff.md` (NEW) | Created | Aligned and intentionally divergent agent comparison across runtimes |

### Follow-Ups

- Apply Codex TOML agent fixes outside the sandbox. Files `.codex/agents/context.toml`, `.codex/agents/deep-research.toml`, `.codex/agents/orchestrate.toml` and `.codex/agents/write.toml` still need the documented path and hook wording corrections that were blocked here by sandbox EPERM policy.
