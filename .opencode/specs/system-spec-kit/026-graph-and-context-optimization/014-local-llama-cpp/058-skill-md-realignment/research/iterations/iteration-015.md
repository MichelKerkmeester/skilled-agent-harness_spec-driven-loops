---
title: "Iter 015 — Track 7: propagate-enhances + skill-graph-extraction-plan specs"
iteration: 15
track: 7
focus: "propagate-enhances + skill-graph-extraction-plan specs"
status: complete
newInfoRatio: 1.00
findings: 8
timestamp: 2026-05-15T17:29:47Z
---

## Iter 015 Findings

### propagate-enhances.md Spec

**Frontmatter shape:**
```yaml
---
title: "Skill Graph Propagate Enhances Tool"
description: "Internal MCP tool for detecting and applying missing inbound enhances edges across skills"
trigger_phrases:
  - "propagate enhances"
  - "missing enhances edges"
  - "enhances edge propagation"
---
```

**Section outline:**

1. **OVERVIEW**
   - Tool role: Internal MCP tool `skill_graph_propagate_enhances` for detecting and optionally applying missing inbound `enhances` edges across skills
   - Uses composite scoring with three detection rules
   - Requires trusted caller authentication

2. **DETECTION RULES**
   - Family-inference (max contribution 0.45): Detects when source skill already enhances many peers in target's family
   - Asset-shape (max contribution 0.30): Checks if target has files/assets matching source's `enhance_when` rules
   - Sibling-transitivity (max contribution 0.15): If source enhances B, and B has target as sibling

3. **OPERATION MODES**
   - report: Return candidates without making any changes (default)
   - propose: Return candidates without making any changes (alias for report)
   - apply: Apply selected candidates to source graph-metadata.json files

4. **INVARIANTS**
   - Requires trusted caller authentication via `requireTrustedCaller`
   - Workspace escape guard: resolved skillsRoot must stay under cwd
   - Default mode is 'report' (no writes) unless explicitly set to 'apply'
   - Default dryRun is true unless explicitly set to false
   - Only applies candidates explicitly selected by ID OR high-confidence with applyAllHighConfidence=true

5. **WHEN IT RUNS**
   - Manually invoked via MCP tool call with trusted caller context
   - Not automatically triggered by other operations
   - Used for maintenance operations to discover and apply missing enhances relationships

**Critical facts per section:**
- OVERVIEW: Tool is the 9th skill-graph tool, requires trusted caller, uses composite scoring (0-1 confidence)
- DETECTION RULES: Three rules with weighted contributions, family-inference is strongest (0.45), requires minimum 3 existing enhances entries
- OPERATION MODES: Three modes (report/propose/apply), default is report, apply mode writes to graph-metadata.json files
- INVARIANTS: Trusted caller required, workspace escape guard, dry-run defaults to true, apply requires explicit selection or high-confidence flag
- WHEN IT RUNS: Manual invocation only, not automatic, maintenance use case for discovering missing enhances edges

---

### skill-graph-extraction-plan.md Spec

**Frontmatter shape:**
```yaml
---
title: "Skill Graph Library Extraction Status"
description: "Current state and roadmap for lib/skill-graph/ extraction from system-spec-kit to system-skill-advisor"
trigger_phrases:
  - "skill graph extraction"
  - "lib/skill-graph"
  - "skill graph database"
---
```

**Section outline:**

1. **CURRENT LOCATION**
   - lib/skill-graph/ currently resides in `.opencode/skills/system-skill-advisor/mcp_server/lib/skill-graph/`
   - Contains 3 files: README.md, skill-graph-db.ts, skill-graph-queries.ts
   - Owns SQLite schema, indexing logic, and relationship query helpers

2. **DOCUMENTATION DRIFT**
   - SKILL.md line 189 states: "lib/skill-graph/ database/query logic remains in system-spec-kit until the pending packet 011 cleanup"
   - This statement is OUTDATED - extraction has already been completed
   - No skill-graph folder exists in system-spec-kit (verified via file search)

3. **EXTRACTION STATUS**
   - EXTRACTION COMPLETE: lib/skill-graph/ is fully migrated to system-skill-advisor
   - No pending extraction work required
   - Packet 011 cleanup reference is obsolete

4. **ROADMAP**
   - Update SKILL.md line 189 to reflect current state (extraction complete)
   - Remove "pending packet 011 cleanup" reference as no longer applicable
   - Consider adding migration note to preserve historical context if needed

**Critical facts per section:**
- CURRENT LOCATION: lib/skill-graph/ is in system-skill-advisor/mcp_server/lib/skill-graph/ with 3 files (README, db, queries)
- DOCUMENTATION DRIFT: SKILL.md line 189 is outdated, claims lib/skill-graph/ remains in system-spec-kit but it's already in system-skill-advisor
- EXTRACTION STATUS: Extraction complete, no pending work, packet 011 reference is obsolete
- ROADMAP: Documentation update needed for SKILL.md line 189, remove obsolete packet 011 reference

ITER_015_COMPLETE: 8 findings, newInfoRatio=1.00
