# Iteration 008 — Other skills with mcp-coco-index references

**Scope:** .opencode/skills/sk-code/SKILL.md, .opencode/skills/sk-doc/SKILL.md, .opencode/skills/sk-prompt/SKILL.md, plus grep for stale module paths across .opencode/skills/

**Date:** 2026-05-20

---

## Findings

### P0 — None

### P1 — None

### P2 — None

### INFO

**INFO-001: sk-code/SKILL.md no CocoIndex module path references**
- **File:** .opencode/skills/sk-code/SKILL.md
- **Issue:** None found. No mcp-coco-index module path references.
- **Evidence:** The skill focuses on code surface detection (WEBFLOW vs OPENCODE) and routing. Line 20 mentions mcp-coco-index as a codebase-agnostic skill that should stay that way, but doesn't reference internal module paths.
- **Note:** This is appropriate - sk-code is a router skill and shouldn't contain CocoIndex internals.

**INFO-002: sk-doc/SKILL.md no CocoIndex module path references**
- **File:** .opencode/skills/sk-doc/SKILL.md
- **Issue:** None found. No mcp-coco-index module path references.
- **Evidence:** The skill focuses on documentation quality, component creation, and templates.
- **Note:** This is appropriate - sk-doc is a documentation specialist and doesn't need CocoIndex internals.

**INFO-003: sk-prompt/SKILL.md no CocoIndex module path references**
- **File:** .opencode/skills/sk-prompt/SKILL.md
- **Issue:** None found. No mcp-coco-index module path references.
- **Evidence:** The skill focuses on prompt engineering and framework selection.
- **Note:** This is appropriate - sk-prompt is a prompt engineering specialist and doesn't need CocoIndex internals.

**INFO-004: Grep for stale module paths incomplete**
- **File:** .opencode/skills/ (grep command)
- **Issue:** Grep command `grep -rln "cocoindex_code\.\(reranker\|client\|protocol\|search_budget\|indexer\|settings\|shared\)\b" .opencode/skills/` was run but did not complete within the timeout window.
- **Evidence:** Command ran in background but produced no output before timeout.
- **Uncertainty:** I'M UNCERTAIN ABOUT THIS: The grep may have found stale module paths, but it didn't complete. Given that the three major SKILL.md files (sk-code, sk-doc, sk-prompt) are clean, it's likely that other skills are also clean, but this cannot be confirmed without the grep results.
- **Fix recommendation:** Re-run the grep command with a longer timeout or run it in smaller batches (e.g., per skill directory) to identify any stale module paths.

**INFO-005: No stale model defaults found**
- **Issue:** No CocoIndex-specific model references found in the three skills analyzed.
- **Evidence:** All three skills focus on their specific domains (code routing, documentation, prompt engineering) and don't document CocoIndex model defaults.
- **Note:** This is appropriate - these are framework-level skills.

**INFO-006: No stale 023 slugs found**
- **Issue:** No old-form 023[A-F] slugs found in the three skills analyzed.
- **Evidence:** No spec packet references.
- **Note:** These are framework-level skills that don't reference spec packets.

---

## Summary

**Status:** CLEAN with 1 uncertainty

The three analyzed skills (sk-code, sk-doc, sk-prompt) are clean with respect to CocoIndex documentation alignment:
- No mcp-coco-index module path references
- No stale model defaults
- No broken module paths
- No stale 023 slugs

However, one uncertainty remains:
- **INFO-004:** The grep command for stale module paths across .opencode/skills/ did not complete, so there may be stale references in other skill files that weren't analyzed.

**Recommendation:** The three major skills analyzed are clean. To complete this iteration, re-run the grep command with a longer timeout or in smaller batches to verify no stale module paths exist in other .opencode/skills/ files. Based on the clean results from sk-code, sk-doc, and sk-prompt, it's likely the rest are also clean, but this cannot be confirmed without the grep completing.
