---
title: "RD-002: sk-code vs sk-doc Anti-Pattern Routing"
description: "Verify the skill advisor routes documentation-edit prompts to sk-doc, NOT sk-code, even when the prompt mentions code-related vocabulary."
---

# RD-002: sk-code vs sk-doc Anti-Pattern Routing

## 1. OVERVIEW

This scenario verifies that the skill advisor correctly distinguishes documentation work from code work. Prompts that mention code-related terms (skill names, file paths under `.opencode/skills/`, technical vocabulary) but actually request a documentation edit MUST route to `sk-doc`, not `sk-code`.

The risk this scenario guards against: sk-code's broad signal coverage ("opencode", "skill", "typescript", "python") could falsely capture doc-edit prompts that target SKILL.md, README.md, or other markdown files inside `.opencode/skills/` directories.

## 2. SCENARIO CONTRACT

**Realistic user request**: A skill maintainer wants to clarify the routing model in sk-code's SKILL.md by rewriting the headline section.

**Exact prompt**:
```
Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top.
```

**Why this is sk-doc, not sk-code**:
- The action is `Update the SKILL.md headline section` — pure documentation editing.
- The target is a `.md` file (markdown), not code.
- The deliverable is text content, not behavior change.
- sk-doc is the unified markdown specialist; sk-code is for executable code work.

**Expected advisor result**:
- Top-1 skill: `sk-doc`
- Top-1 score: ≥ 0.70 (sk-doc has strong "SKILL.md" + "documentation" + "headline" signal coverage)
- sk-code score: lower than sk-doc, ideally < 0.50
- Gap (sk-doc - sk-code): ≥ 0.15

**Expected behavior if sk-code wins anyway**: This is a misroute. Phase E5 should propose either:
- Adding "headline", "rewrite section", "documentation update" anti-signals to sk-code's `signals` array, OR
- Adding boost weight to sk-doc's `signals` for "SKILL.md" / ".md headline".

## 3. TEST EXECUTION

### Preconditions

1. Skill advisor binary callable.
2. `skill-graph.json` has both `sk-code` and `sk-doc` entries.

### Exact Command Sequence

1. **Advisor probe**:
   ```
   bash: python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "Update the sk-code SKILL.md headline section to clarify the two-axis routing model and add a one-line summary at the top." --threshold 0.8 > /tmp/skc-RD002-advisor.txt
   ```
2. **Parse**: extract top-1 skill, top-1 score, top-2 skill, top-2 score, gap.
3. **Verify**: top-1 == `sk-doc` AND sk-code is NOT in top-1.

### Pass/Fail Criteria

- **PASS** iff: top-1 == sk-doc AND sk-doc score ≥ 0.70 AND sk-code score < 0.70 (or sk-code not in top-3).
- **PARTIAL** iff: top-1 == sk-doc but sk-doc score < 0.70 (low confidence — advisor uncertain).
- **FAIL** iff: top-1 == sk-code (false positive — sk-code captured a doc-edit prompt).

### Failure Triage

1. If sk-code wins: dump full skill-graph.json sk-code entry. Check whether "skill" signal weight is dominating.
2. Propose anti-signals: add `negative_keywords: ["headline", "rewrite section", "documentation update"]` to sk-code's graph entry — but DO NOT commit without explicit user approval (Phase E5 gate).
3. Cross-check with `labeled-prompts.jsonl` golden set — does it have any sk-doc-labeled prompts that look like this one? If yes, why are they labeled correctly there but failing here?

## 4. SOURCE FILES

- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json` — Skill signals for both sk-code and sk-doc.
- `.opencode/skills/sk-code/SKILL.md` — sk-code routing scope.
- `.opencode/skills/sk-doc/SKILL.md` — sk-doc routing scope (markdown specialist).

## 5. SOURCE METADATA

- **Created**: 2026-05-04
- **Critical path**: Yes (validates skill advisor correctness for the most common false-positive risk)
- **Destructive**: No
- **Concurrent-safe**: Yes
- **Last validated**: pending first manual run + Phase E aggregate report
