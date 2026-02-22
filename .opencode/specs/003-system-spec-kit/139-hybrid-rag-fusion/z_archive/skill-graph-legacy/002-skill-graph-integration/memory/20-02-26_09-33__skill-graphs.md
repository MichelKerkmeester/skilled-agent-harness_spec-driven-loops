---
title: "To promote a memory to constitutional tier (always surfaced) [002-skill-graph-integration/20-02-26_09-33__skill-graphs]"
importance_tier: "normal"
contextType: "general"
---
<!-- TEMPLATE: context_template.md v2.2 - DO NOT EDIT GENERATED FILES -->
<!-- Constitutional Tier Promotion:
  To promote a memory to constitutional tier (always surfaced):
  
  1. Via MCP tool after indexing:
     memory_update({ id: <memory_id>, importanceTier: 'constitutional' })
  
  2. Criteria for constitutional:
     - Applies to ALL future conversations (not project-specific)
     - Core constraints/rules that should NEVER be forgotten
     - ~2000 token budget total for constitutional tier
     
  3. Add trigger phrases for proactive surfacing:
     memory_update({ 
       id: <memory_id>, 
       importanceTier: 'constitutional',
       triggerPhrases: ['fix', 'implement', 'create', 'modify', ...]
     })
     
  4. Examples of constitutional content:
     - "Always ask Gate 3 spec folder question before file modifications"
     - "Never modify production data directly"
     - "Memory files MUST use generate-context.js script"
-->

---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | 2026-02-20 |
| Session ID | session-1771576382067-x4av4oqhd |
| Spec Folder | ../.opencode/specs/002-commands-and-skills/036-skill-graphs |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 4 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-20 |
| Created At (Epoch) | 1771576382 |
| Last Accessed (Epoch) | 1771576382 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | /100 |  |
| Uncertainty Score | /100 |  |
| Context Score | /100 |  |
| Timestamp |  | Session start |

**Initial Gaps Identified:**

- No significant gaps identified at session start

**Dual-Threshold Status at Start:**
- Confidence: %
- Uncertainty: 
- Readiness: 
<!-- /ANCHOR:preflight -->

---

## TABLE OF CONTENTS

- [CONTINUE SESSION](#continue-session)
- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
- [IMPLEMENTATION GUIDE](#implementation-guide)
- [OVERVIEW](#overview)
- [DETAILED CHANGES](#detailed-changes)
- [DECISIONS](#decisions)
- [CONVERSATION](#conversation)
- [RECOVERY HINTS](#recovery-hints)
- [MEMORY METADATA](#memory-metadata)

---

<!-- ANCHOR:continue-session -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | IN_PROGRESS |
| Completion % | 23% |
| Last Activity | 2026-02-20T08:33:02.062Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Track migration truth via a 9-skill coverage matrix tied to TASK-310 t, Decision: Expand checklist/task/plan entries with executable verification and ev, Technical Implementation Details

**Decisions:** 4 decisions recorded

**Summary:** Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a lightweight graph query layer (SGQS), while explicitly excluding external Neo4j dependencies. Deepene...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume ../.opencode/specs/002-commands-and-skills/036-skill-graphs
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: ../.opencode/specs/002-commands-and-skills/036-skill-graphs
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/.../036-skill-graphs/spec.md, .opencode/.../036-skill-graphs/plan.md, .opencode/.../036-skill-graphs/tasks.md

- Last: Expanded the Skill Graph migration specification to include integration with Spe

<!-- /ANCHOR:continue-session -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/.../036-skill-graphs/spec.md |
| Last Action | Technical Implementation Details |
| Next Action | Continue implementation |
| Blockers | None |

**Key Topics:** `decision` | `skill` | `because` | `migration` | `task` | `../.opencode/specs/002 commands and skills/000 skills/004 skill graphs` | `existing` | `while` | `checklist` | `plan` | `verification` | `evidence` | 

---

<!-- ANCHOR:task-guide -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a...** - Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a lightweight graph query layer (SGQS), while explicitly excluding external Neo4j dependencies.

- **Technical Implementation Details** - rootCause: Spec documentation and migration tracking lacked enough operational detail to execute and audit complex rollout work safely.

**Key Files and Their Roles**:

- `.opencode/.../036-skill-graphs/spec.md` - Documentation

- `.opencode/.../036-skill-graphs/plan.md` - Documentation

- `.opencode/.../036-skill-graphs/tasks.md` - Documentation

- `.opencode/.../036-skill-graphs/checklist.md` - Documentation

- `.opencode/.../036-skill-graphs/decision-record.md` - Documentation

- `.opencode/.../036-skill-graphs/implementation-summary.md` - Documentation

- `.opencode/skill/sk-git/SKILL.md` - Documentation

- `.opencode/skill/mcp-chrome-devtools/SKILL.md` - Documentation

**How to Extend**:

- Use established template patterns for new outputs

- Apply validation patterns to new input handling

**Common Patterns**:

- **Validation**: Input validation before processing

- **Template Pattern**: Use templates with placeholder substitution

<!-- /ANCHOR:task-guide -->

---

<!-- ANCHOR:summary -->
<a id="overview"></a>

## 2. OVERVIEW

Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a lightweight graph query layer (SGQS), while explicitly excluding external Neo4j dependencies. Deepened execution detail across tasks, plan, and checklist with item-level inputs, outputs, verification steps, evidence expectations, and dependency chains. Also corrected spec document compliance issues and rebuilt implementation-summary.md into a template-aligned, anchored document that reflects true migration status and open work.

**Key Outcomes**:
- Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a...
- Decision: Keep SKILL.
- Decision: Scope SGQS as an in-process Neo4j-style query subset because we need g
- Decision: Track migration truth via a 9-skill coverage matrix tied to TASK-310 t
- Decision: Expand checklist/task/plan entries with executable verification and ev
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../036-skill-graphs/spec.md` | File modified (description pending) |
| `.opencode/.../036-skill-graphs/plan.md` | File modified (description pending) |
| `.opencode/.../036-skill-graphs/tasks.md` | File modified (description pending) |
| `.opencode/.../036-skill-graphs/checklist.md` | File modified (description pending) |
| `.opencode/.../036-skill-graphs/decision-record.md` | File modified (description pending) |
| `.opencode/.../036-skill-graphs/implementation-summary.md` | Updated implementation summary |
| `.opencode/skill/sk-git/SKILL.md` | File modified (description pending) |
| `.opencode/skill/mcp-chrome-devtools/SKILL.md` | File modified (description pending) |
| `.opencode/skill/mcp-figma/SKILL.md` | File modified (description pending) |
| `.opencode/skill/sk-code--full-stack/SKILL.md` | File modified (description pending) |

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:detailed-changes -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-expanded-skill-graph-migration-a57ec25a -->
### FEATURE: Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a...

Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a lightweight graph query layer (SGQS), while explicitly excluding external Neo4j dependencies. Deepened execution detail across tasks, plan, and checklist with item-level inputs, outputs, verification steps, evidence expectations, and dependency chains. Also corrected spec document compliance issues and rebuilt implementation-summary.md into a template-aligned, anchored document that reflects true migration status and open work.

**Details:** skill graph migration | SGQS graph-lite query | neo4j-style without neo4j | spec kit memory integration | 9-skill node coverage matrix | template-aligned implementation summary | check-links global validation | task plan checklist expansion
<!-- /ANCHOR:implementation-expanded-skill-graph-migration-a57ec25a -->

<!-- ANCHOR:implementation-technical-implementation-details-64f408ad -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: Spec documentation and migration tracking lacked enough operational detail to execute and audit complex rollout work safely.; solution: Strengthened spec artifacts with concrete execution contracts, verification artifacts, and dependency chains; aligned implementation summary to required anchored template format.; patterns: Progressive disclosure for skill graphs, compatibility-first migration strategy, checklist-driven validation, and in-process extension of existing memory architecture.

<!-- /ANCHOR:implementation-technical-implementation-details-64f408ad -->

<!-- /ANCHOR:detailed-changes -->

---

<!-- ANCHOR:decisions -->
<a id="decisions"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number depends on which optional sections are present:
  - Base: 2 (after Overview)
  - +1 if HAS_IMPLEMENTATION_GUIDE (adds section 1)
  - +1 if HAS_OBSERVATIONS (adds Detailed Changes)
  - +1 if HAS_WORKFLOW_DIAGRAM (adds Workflow Visualization)
  
  Result matrix:
  | IMPL_GUIDE | OBSERVATIONS | WORKFLOW | This Section # |
  |------------|--------------|----------|----------------|
  | No         | No           | No       | 2              |
  | No         | No           | Yes      | 3              |
  | No         | Yes          | No       | 3              |
  | No         | Yes          | Yes      | 4              |
  | Yes        | No           | No       | 3              |
  | Yes        | No           | Yes      | 4              |
  | Yes        | Yes          | No       | 4              |
  | Yes        | Yes          | Yes      | 5              |
-->
## 4. DECISIONS

<!-- ANCHOR:decision-keep-skillmd-compatibility-entrypoint-919ee768 -->
### Decision 1: Decision: Keep SKILL.md as a compatibility entrypoint during migration because existing loaders and routing behavior must remain stable while index.md + nodes adoption is phased.

**Context**: Decision: Keep SKILL.md as a compatibility entrypoint during migration because existing loaders and routing behavior must remain stable while index.md + nodes adoption is phased.

**Timestamp**: 2026-02-20T09:33:02Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Keep SKILL.md as a compatibility entrypoint during migration because existing loaders and routing behavior must remain stable while index.md + nodes adoption is phased.

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Keep SKILL.md as a compatibility entrypoint during migration because existing loaders and routing behavior must remain stable while index.md + nodes adoption is phased.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-keep-skillmd-compatibility-entrypoint-919ee768 -->

---

<!-- ANCHOR:decision-scope-sgqs-2f7f442d -->
### Decision 2: Decision: Scope SGQS as an in

**Context**: process Neo4j-style query subset because we need graph querying semantics without adding external database dependencies or breaking existing memory tool contracts.

**Timestamp**: 2026-02-20T09:33:02Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Scope SGQS as an in

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: process Neo4j-style query subset because we need graph querying semantics without adding external database dependencies or breaking existing memory tool contracts.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-scope-sgqs-2f7f442d -->

---

<!-- ANCHOR:decision-track-migration-truth-via-8648c0b1 -->
### Decision 3: Decision: Track migration truth via a 9

**Context**: skill coverage matrix tied to TASK-310 through TASK-318 because binary complete/incomplete claims were hiding rollout risk.

**Timestamp**: 2026-02-20T09:33:02Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Track migration truth via a 9

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: skill coverage matrix tied to TASK-310 through TASK-318 because binary complete/incomplete claims were hiding rollout risk.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-track-migration-truth-via-8648c0b1 -->

---

<!-- ANCHOR:decision-expand-checklisttaskplan-entries-executable-dc3d5b44 -->
### Decision 4: Decision: Expand checklist/task/plan entries with executable verification and evidence requirements because prior items were too terse for auditable execution.

**Context**: Decision: Expand checklist/task/plan entries with executable verification and evidence requirements because prior items were too terse for auditable execution.

**Timestamp**: 2026-02-20T09:33:02Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Expand checklist/task/plan entries with executable verification and evidence requirements because prior items were too terse for auditable execution.

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Expand checklist/task/plan entries with executable verification and evidence requirements because prior items were too terse for auditable execution.

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-expand-checklisttaskplan-entries-executable-dc3d5b44 -->

---

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:session-history -->
<a id="conversation"></a>

<!-- DYNAMIC SECTION NUMBERING:
  This section number = DECISIONS section + 1
  See DECISIONS section comment for the full matrix.
  Range: 3-6 depending on optional sections present.
-->
## 5. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **Linear Sequential** conversation pattern with **0** distinct phases.

##### Conversation Phases
- **Planning** - 2 actions
- **Discussion** - 3 actions
- **Verification** - 1 actions

---

### Message Timeline

> **User** | 2026-02-20 @ 09:33:02

Expanded the Skill Graph migration specification to include integration with Spec Kit Memory via a lightweight graph query layer (SGQS), while explicitly excluding external Neo4j dependencies. Deepened execution detail across tasks, plan, and checklist with item-level inputs, outputs, verification steps, evidence expectations, and dependency chains. Also corrected spec document compliance issues and rebuilt implementation-summary.md into a template-aligned, anchored document that reflects true migration status and open work.

---

<!-- /ANCHOR:session-history -->

---

<!-- ANCHOR:recovery-hints -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume ../.opencode/specs/002-commands-and-skills/036-skill-graphs` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "../.opencode/specs/002-commands-and-skills/036-skill-graphs" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts --status

# List memories for this spec folder
memory_search({ specFolder: "../.opencode/specs/002-commands-and-skills/036-skill-graphs", limit: 10 })

# Verify memory file integrity
ls -la ../.opencode/specs/002-commands-and-skills/036-skill-graphs/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js ../.opencode/specs/002-commands-and-skills/036-skill-graphs --force
```

### Recovery Priority

1. **Verify spec folder exists** - Check path is correct
2. **Load memory context** - Use memory_search to surface prior work
3. **Review last session state** - Check PROJECT STATE SNAPSHOT
4. **Validate pending tasks** - Review CONTINUE SESSION section
5. **Resume with handover prompt** - Use continuation template above

### Session Integrity Checks

| Check | Status | Details |
|-------|--------|---------|
| Memory File Exists |  |  |
| Index Entry Valid |  | Last indexed:  |
| Checksums Match |  |  |
| No Dedup Conflicts |  |  |
<!-- /ANCHOR:recovery-hints -->

---

<!-- ANCHOR:postflight -->
<a id="postflight-learning-delta"></a>

## POSTFLIGHT LEARNING DELTA

**Epistemic state comparison showing knowledge gained during session.**

<!-- Delta Calculation Formulas:
  DELTA_KNOW_SCORE = POSTFLIGHT_KNOW_SCORE - PREFLIGHT_KNOW_SCORE (positive = improvement)
  DELTA_UNCERTAINTY_SCORE = PREFLIGHT_UNCERTAINTY_SCORE - POSTFLIGHT_UNCERTAINTY_SCORE (positive = reduction, which is good)
  DELTA_CONTEXT_SCORE = POSTFLIGHT_CONTEXT_SCORE - PREFLIGHT_CONTEXT_SCORE (positive = improvement)
  DELTA_*_TREND = "↑" if delta > 0, "↓" if delta < 0, "→" if delta == 0
-->

| Metric | Before | After | Delta | Trend |
|--------|--------|-------|-------|-------|
| Knowledge |  |  |  | → |
| Uncertainty |  |  |  | → |
| Context |  |  |  | → |

**Learning Index:** /100

> Learning Index = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
> Higher is better. Target: ≥25 for productive sessions.

**Gaps Closed:**

- No gaps explicitly closed during session

**New Gaps Discovered:**

- No new gaps discovered

**Session Learning Summary:**
Learning metrics will be calculated when both preflight and postflight data are provided.
<!-- /ANCHOR:postflight -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1771576382067-x4av4oqhd"
spec_folder: "../.opencode/specs/002-commands-and-skills/036-skill-graphs"
channel: "main"

# Classification
importance_tier: "normal"  # constitutional|critical|important|normal|temporary|deprecated
context_type: "general"        # research|implementation|decision|discovery|general

# Memory Classification (v2.2)
memory_classification:
  memory_type: ""         # episodic|procedural|semantic|constitutional
  half_life_days:      # decay half-life in days (0 = never decays)
  decay_factors:
    base_decay_rate:            # 0.0-1.0, daily decay multiplier
    access_boost_factor:    # boost per access (default 0.1)
    recency_weight:              # weight for recent accesses (default 0.5)
    importance_multiplier:  # tier-based multiplier

# Session Deduplication (v2.2)
session_dedup:
  memories_surfaced:    # count of memories shown this session
  dedup_savings_tokens:    # tokens saved via deduplication
  fingerprint_hash: ""         # content hash for dedup detection
  similar_memories:

    []

# Causal Links (v2.2)
causal_links:
  caused_by:

    []

  supersedes:

    []

  derived_from:

    []

  blocks:

    []

  related_to:

    []

# Timestamps (for decay calculations)
created_at: "2026-02-20"
created_at_epoch: 1771576382
last_accessed_epoch: 1771576382
expires_at_epoch: 1779352382  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 4
tool_count: 0
file_count: 10
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "decision"
  - "skill"
  - "because"
  - "migration"
  - "task"
  - "../.opencode/specs/002 commands and skills/000 skills/004 skill graphs"
  - "existing"
  - "while"
  - "checklist"
  - "plan"
  - "verification"
  - "evidence"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
  - "../.opencode/specs/002 commands and skills/000 skills/004 skill graphs"
  - "item level"
  - "implementation summary"
  - "template aligned"
  - "neo4j style"
  - "task 310"
  - "task 318"
  - "decision record"
  - "workflows git"
  - "workflows chrome devtools"
  - "mcp figma"
  - "workflows code"
  - "full stack"
  - "decision keep skill.md compatibility"
  - "keep skill.md compatibility entrypoint"
  - "skill.md compatibility entrypoint migration"
  - "compatibility entrypoint migration existing"
  - "entrypoint migration existing loaders"
  - "migration existing loaders routing"
  - "existing loaders routing behavior"
  - "loaders routing behavior remain"
  - "routing behavior remain stable"
  - "behavior remain stable index.md"
  - "remain stable index.md nodes"
  - "stable index.md nodes adoption"
  - "index.md nodes adoption phased"
  - "../.opencode/specs/002"
  - "commands"
  - "and"
  - "skills/000"
  - "skills/004"
  - "skill"
  - "graphs"

key_files:
  - ".opencode/.../036-skill-graphs/spec.md"
  - ".opencode/.../036-skill-graphs/plan.md"
  - ".opencode/.../036-skill-graphs/tasks.md"
  - ".opencode/.../036-skill-graphs/checklist.md"
  - ".opencode/.../036-skill-graphs/decision-record.md"
  - ".opencode/.../036-skill-graphs/implementation-summary.md"
  - ".opencode/skill/sk-git/SKILL.md"
  - ".opencode/skill/mcp-chrome-devtools/SKILL.md"
  - ".opencode/skill/mcp-figma/SKILL.md"
  - ".opencode/skill/sk-code--full-stack/SKILL.md"

# Relationships
related_sessions:

  []

parent_spec: "../.opencode/specs/002-commands-and-skills/036-skill-graphs"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1

# Quality Signals
quality_score: 1.00
quality_flags:
  []
```

<!-- /ANCHOR:metadata -->

---

*Generated by system-spec-kit skill v1.7.2*

