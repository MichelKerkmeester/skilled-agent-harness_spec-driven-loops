# Iteration 007 — cli-devin + cli-codex skill consistency

**Scope:** .opencode/skills/cli-devin/SKILL.md, .opencode/skills/cli-codex/SKILL.md

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1 — None

### P2 — None

### INFO

**INFO-001: cli-devin/SKILL.md no CocoIndex references**
- **File:** .opencode/skills/cli-devin/SKILL.md
- **Issue:** None found. This is the prompt context for the current deep-review task.
- **Evidence:** The file contains the RCAF framework and 10-iteration deep-review instructions for this specific review task.
- **Note:** This is the task prompt, not a skill documentation file. It doesn't contain CocoIndex references.

**INFO-002: cli-codex/SKILL.md no CocoIndex module path references**
- **File:** .opencode/skills/cli-codex/SKILL.md
- **Issue:** None found. No mcp-coco-index module path references.
- **Evidence:** The skill focuses on Codex CLI orchestration, model selection (gpt-5.5), and agent delegation patterns.
- **Note:** Line 294 mentions "codex mcp" for connecting to MCP servers generically, but doesn't reference specific CocoIndex paths or models.

**INFO-003: No stale model defaults found**
- **Issue:** No CocoIndex-specific model references found in either CLI skill.
- **Evidence:** Both skills focus on their respective CLI orchestration (Devin/Codex) and don't document CocoIndex internals.
- **Note:** CLI skills are orchestrators that dispatch to external binaries; they don't contain CocoIndex model configuration.

**INFO-004: No broken module paths found**
- **Issue:** No stale module paths found.
- **Evidence:** No Python module imports or file path references to mcp-coco-index.
- **Note:** These are CLI orchestrator skills that don't directly import CocoIndex modules.

**INFO-005: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found.
- **Evidence:** No spec packet references.
- **Note:** These are CLI orchestrator skills that don't reference spec packets.

---

## Summary

**Status:** CLEAN

Both CLI orchestrator skills are clean with respect to CocoIndex documentation alignment:
- cli-devin/SKILL.md is the task prompt for this review, not a skill doc
- cli-codex/SKILL.md focuses on Codex CLI orchestration and doesn't reference CocoIndex internals
- No mcp-coco-index module path references
- No stale model defaults (CLI skills don't document CocoIndex models)
- No broken module paths
- No stale 023 slugs

**Recommendation:** No changes needed. The CLI skills are orchestrators that dispatch to external binaries and don't contain CocoIndex-specific documentation.
