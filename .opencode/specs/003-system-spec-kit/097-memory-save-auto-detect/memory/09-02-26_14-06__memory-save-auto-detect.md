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
| Session Date | 2026-02-09 |
| Session ID | session-1770642361771-03e6u06xf |
| Spec Folder | 003-memory-and-spec-kit/097-memory-save-auto-detect |
| Channel | main |
| Importance Tier | normal |
| Context Type | general |
| Total Messages | 1 |
| Tool Executions | 0 |
| Decisions Made | 5 |
| Follow-up Items Recorded | 0 |
| Created At | 2026-02-09 |
| Created At (Epoch) | 1770642361 |
| Last Accessed (Epoch) | 1770642361 |
| Access Count | 1 |

---

<!-- ANCHOR:preflight-session-1770642361771-03e6u06xf-005-anobel.com -->
## PREFLIGHT BASELINE

**Epistemic state captured at session start for learning delta calculation.**

| Metric | Value | Assessment |
|--------|-------|------------|
| Knowledge Score | [TBD]/100 | [Not assessed] |
| Uncertainty Score | [TBD]/100 | [Not assessed] |
| Context Score | [TBD]/100 | [Not assessed] |
| Timestamp | [TBD] | Session start |

**Initial Gaps Identified:**

- No significant gaps identified at session start

**Dual-Threshold Status at Start:**
- Confidence: [TBD]%
- Uncertainty: [TBD]
- Readiness: [TBD]
<!-- /ANCHOR:preflight-session-1770642361771-03e6u06xf-005-anobel.com -->

---

## Table of Contents

- [Continue Session](#continue-session)
- [Project State Snapshot](#project-state-snapshot)
- [Implementation Guide](#implementation-guide)
- [Overview](#overview)
- [Detailed Changes](#detailed-changes)
- [Decisions](#decisions)
- [Conversation](#conversation)
- [Recovery Hints](#recovery-hints)
- [Memory Metadata](#memory-metadata)

---

<!-- ANCHOR:continue-session-session-1770642361771-03e6u06xf-005-anobel.com -->
<a id="continue-session"></a>

## CONTINUE SESSION

**Quick resume context for session continuation and handover.**

### Session State

| Field | Value |
|-------|-------|
| Session Status | COMPLETED |
| Completion % | 100% |
| Last Activity | 2026-02-09T13:06:01.747Z |
| Time in Session | 0m |
| Continuation Count | 1 |

### Context Summary

**Phase:** RESEARCH

**Recent:** Decision: Used readonly mode for SQLite connection and close immediately after q, Decision: Synced AGENTS., Technical Implementation Details

**Decisions:** 5 decisions recorded

**Summary:** Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of a two-layer defense that prevents the AI agent from re-asking 'Which spec folder?' during memory saves. Added a Priorit...

### Pending Work

- No pending tasks - session completed successfully

### Quick Resume

**To continue this work, use:**
```
/spec_kit:resume 005-anobel.com
```

**Or paste this continuation prompt:**
```
CONTINUATION - Attempt 2
Spec: 005-anobel.com
Last: Technical Implementation Details
Next: Continue implementation
```

**Key Context to Review:**

- Files modified: .opencode/.../spec-folder/folder-detector.ts, .opencode/.../spec-folder/folder-detector.js, AGENTS.md

- Last: Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of

<!-- /ANCHOR:continue-session-session-1770642361771-03e6u06xf-005-anobel.com -->

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | RESEARCH |
| Active File | .opencode/.../spec-folder/folder-detector.ts |
| Last Action | Technical Implementation Details |
| Next Action | Continue implementation |
| Blockers | md said 'If NO folder argument → HARD BLOCK → Ask user' without checking if Gate 3 had already estab |

**Key Topics:** `detectspecfolder` | `implementation` | `implemented` | `fallthrough` | `immediately` | `consistency` | `gracefully` | `connection` | `completed` | `challenge` | 

---

<!-- ANCHOR:task-guide-anobel.com-005-anobel.com -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:

- **Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of a two-layer...** - Completed Spec 097 — Memory Save Auto-Detect Spec Folder.

- **Technical Implementation Details** - rootCause: The MEMORY SAVE RULE in AGENTS.

**Key Files and Their Roles**:

- `.opencode/.../spec-folder/folder-detector.ts` - File modified (description pending)

- `.opencode/.../spec-folder/folder-detector.js` - File modified (description pending)

- `AGENTS.md` - Documentation

- `/.../coder/AGENTS.md` - Documentation

- `specs/.../097-memory-save-auto-detect/tasks.md` - Documentation

- `specs/.../097-memory-save-auto-detect/spec.md` - Documentation

- `specs/.../097-memory-save-auto-detect/implementation-summary.md` - Documentation

**How to Extend**:

- Add new modules following the existing file structure patterns

- Maintain consistent error handling approach

**Common Patterns**:

- **Validation**: Input validation before processing

- **Graceful Fallback**: Provide sensible defaults when primary method fails

- **Module Pattern**: Organize code into importable modules

<!-- /ANCHOR:task-guide-anobel.com-005-anobel.com -->

---

<!-- ANCHOR:summary-session-1770642361771-03e6u06xf-005-anobel.com -->
<a id="overview"></a>

## 2. OVERVIEW

Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of a two-layer defense that prevents the AI agent from re-asking 'Which spec folder?' during memory saves. Added a Priority 2.5 step to the detectSpecFolder() cascade in folder-detector.ts that queries the session_learning DB table for the most recent spec_folder. The key implementation challenge was that better-sqlite3 needed an absolute require path (via CONFIG.PROJECT_ROOT) since the script runs from the project root where better-sqlite3 isn't in the local node_modules. Also synced the AGENTS.md MEMORY SAVE RULE fix (Layer 1, done in a prior session) across all 3 project locations: anobel.com, Public, and Barter/coder.

**Key Outcomes**:
- Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of a two-layer...
- Decision: Used absolute require path for better-sqlite3 via CONFIG.
- Decision: Placed Priority 2.
- Decision: Wrapped entire Priority 2.
- Decision: Used readonly mode for SQLite connection and close immediately after q
- Decision: Synced AGENTS.
- Technical Implementation Details

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
| `.opencode/.../spec-folder/folder-detector.ts` | That queries the session_learning DB table for the most r... |
| `.opencode/.../spec-folder/folder-detector.js` | File modified (description pending) |
| `AGENTS.md` | Anobel.com |
| `/.../coder/AGENTS.md` | Anobel.com |
| `specs/.../097-memory-save-auto-detect/tasks.md` | File modified (description pending) |
| `specs/.../097-memory-save-auto-detect/spec.md` | File modified (description pending) |
| `specs/.../097-memory-save-auto-detect/implementation-summary.md` | File modified (description pending) |

<!-- /ANCHOR:summary-session-1770642361771-03e6u06xf-005-anobel.com -->

---

<!-- ANCHOR:detailed-changes-session-1770642361771-03e6u06xf-005-anobel.com -->
<a id="detailed-changes"></a>

## 3. DETAILED CHANGES

<!-- ANCHOR:implementation-completed-spec-097-memory-1a0fd3ae-session-1770642361771-03e6u06xf -->
### FEATURE: Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of a two-layer...

Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of a two-layer defense that prevents the AI agent from re-asking 'Which spec folder?' during memory saves. Added a Priority 2.5 step to the detectSpecFolder() cascade in folder-detector.ts that queries the session_learning DB table for the most recent spec_folder. The key implementation challenge was that better-sqlite3 needed an absolute require path (via CONFIG.PROJECT_ROOT) since the script runs from the project root where better-sqlite3 isn't in the local node_modules. Also synced the AGENTS.md MEMORY SAVE RULE fix (Layer 1, done in a prior session) across all 3 project locations: anobel.com, Public, and Barter/coder.

**Details:** memory save auto-detect | folder-detector | session_learning | detectSpecFolder | Priority 2.5 | better-sqlite3 require path | Gate 3 reuse | MEMORY SAVE RULE | AGENTS.md sync | spec folder detection cascade
<!-- /ANCHOR:implementation-completed-spec-097-memory-1a0fd3ae-session-1770642361771-03e6u06xf -->

<!-- ANCHOR:implementation-technical-implementation-details-874be6a4-session-1770642361771-03e6u06xf -->
### IMPLEMENTATION: Technical Implementation Details

rootCause: The MEMORY SAVE RULE in AGENTS.md said 'If NO folder argument → HARD BLOCK → Ask user' without checking if Gate 3 had already established the folder. The folder-detector.ts detectSpecFolder() cascade had no step to check session_learning DB for recent preflight records.; solution: Layer 1 (prior session): Updated AGENTS.md MEMORY SAVE RULE with Priority 0 step to reuse Gate 3 answer. Layer 2 (this session): Added Priority 2.5 in folder-detector.ts that queries session_learning table for most recent spec_folder, validates folder exists, returns if valid, silently falls through on any error.; patterns: Silent fallthrough pattern with try/catch for optional cascade steps. Absolute module require via CONFIG.PROJECT_ROOT for cross-directory script execution. Readonly SQLite with immediate close for minimal resource footprint.

<!-- /ANCHOR:implementation-technical-implementation-details-874be6a4-session-1770642361771-03e6u06xf -->

<!-- /ANCHOR:detailed-changes-session-1770642361771-03e6u06xf-005-anobel.com -->

---

<!-- ANCHOR:decisions-session-1770642361771-03e6u06xf-005-anobel.com -->
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

<!-- ANCHOR:decision-absolute-require-path-better-bc097066-session-1770642361771-03e6u06xf -->
### Decision 1: Decision: Used absolute require path for better

**Context**: sqlite3 via CONFIG.PROJECT_ROOT because the script runs from the project root where better-sqlite3 is not installed locally — the module lives in .opencode/skill/system-spec-kit/node_modules/

**Timestamp**: 2026-02-09T14:06:01Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Used absolute require path for better

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: sqlite3 via CONFIG.PROJECT_ROOT because the script runs from the project root where better-sqlite3 is not installed locally — the module lives in .opencode/skill/system-spec-kit/node_modules/

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-absolute-require-path-better-bc097066-session-1770642361771-03e6u06xf -->

---

<!-- ANCHOR:decision-placed-priority-between-priority-b0298331-session-1770642361771-03e6u06xf -->
### Decision 2: Decision: Placed Priority 2.5 between Priority 2 (JSON data field) and Priority 3 (CWD detection) in the detectSpecFolder() cascade because session_learning is more specific than CWD but less explicit than JSON data

**Context**: Decision: Placed Priority 2.5 between Priority 2 (JSON data field) and Priority 3 (CWD detection) in the detectSpecFolder() cascade because session_learning is more specific than CWD but less explicit than JSON data

**Timestamp**: 2026-02-09T14:06:01Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Placed Priority 2.5 between Priority 2 (JSON data field) and Priority 3 (CWD detection) in the detectSpecFolder() cascade because session_learning is more specific than CWD but less explicit than JSON data

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Placed Priority 2.5 between Priority 2 (JSON data field) and Priority 3 (CWD detection) in the detectSpecFolder() cascade because session_learning is more specific than CWD but less explicit than JSON data

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-placed-priority-between-priority-b0298331-session-1770642361771-03e6u06xf -->

---

<!-- ANCHOR:decision-wrapped-entire-priority-block-0468be1b-session-1770642361771-03e6u06xf -->
### Decision 3: Decision: Wrapped entire Priority 2.5 block in try/catch with silent fallthrough because the DB, table, or folder may not exist and the cascade must continue gracefully

**Context**: Decision: Wrapped entire Priority 2.5 block in try/catch with silent fallthrough because the DB, table, or folder may not exist and the cascade must continue gracefully

**Timestamp**: 2026-02-09T14:06:01Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Wrapped entire Priority 2.5 block in try/catch with silent fallthrough because the DB, table, or folder may not exist and the cascade must continue gracefully

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Wrapped entire Priority 2.5 block in try/catch with silent fallthrough because the DB, table, or folder may not exist and the cascade must continue gracefully

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-wrapped-entire-priority-block-0468be1b-session-1770642361771-03e6u06xf -->

---

<!-- ANCHOR:decision-readonly-mode-sqlite-connection-167b0133-session-1770642361771-03e6u06xf -->
### Decision 4: Decision: Used readonly mode for SQLite connection and close immediately after query to minimize resource usage and avoid locking

**Context**: Decision: Used readonly mode for SQLite connection and close immediately after query to minimize resource usage and avoid locking

**Timestamp**: 2026-02-09T14:06:01Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Used readonly mode for SQLite connection and close immediately after query to minimize resource usage and avoid locking

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Used readonly mode for SQLite connection and close immediately after query to minimize resource usage and avoid locking

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-readonly-mode-sqlite-connection-167b0133-session-1770642361771-03e6u06xf -->

---

<!-- ANCHOR:decision-synced-agentsmd-all-locations-cc859e4f-session-1770642361771-03e6u06xf -->
### Decision 5: Decision: Synced AGENTS.md fix to all 3 locations (anobel.com, Public, Barter/coder) to ensure consistency across all projects using the framework

**Context**: Decision: Synced AGENTS.md fix to all 3 locations (anobel.com, Public, Barter/coder) to ensure consistency across all projects using the framework

**Timestamp**: 2026-02-09T14:06:01Z

**Importance**: medium

#### Options Considered

1. **Chosen Approach**
   Decision: Synced AGENTS.md fix to all 3 locations (anobel.com, Public, Barter/coder) to ensure consistency across all projects using the framework

#### Chosen Approach

**Selected**: Chosen Approach

**Rationale**: Decision: Synced AGENTS.md fix to all 3 locations (anobel.com, Public, Barter/coder) to ensure consistency across all projects using the framework

#### Trade-offs

**Confidence**: 80%
<!-- /ANCHOR:decision-synced-agentsmd-all-locations-cc859e4f-session-1770642361771-03e6u06xf -->

---

<!-- /ANCHOR:decisions-session-1770642361771-03e6u06xf-005-anobel.com -->

<!-- ANCHOR:session-history-session-1770642361771-03e6u06xf-005-anobel.com -->
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
- **Debugging** - 3 actions
- **Discussion** - 4 actions

---

### Message Timeline

> **User** | 2026-02-09 @ 14:06:01

Completed Spec 097 — Memory Save Auto-Detect Spec Folder. Implemented Layer 2 of a two-layer defense that prevents the AI agent from re-asking 'Which spec folder?' during memory saves. Added a Priority 2.5 step to the detectSpecFolder() cascade in folder-detector.ts that queries the session_learning DB table for the most recent spec_folder. The key implementation challenge was that better-sqlite3 needed an absolute require path (via CONFIG.PROJECT_ROOT) since the script runs from the project root where better-sqlite3 isn't in the local node_modules. Also synced the AGENTS.md MEMORY SAVE RULE fix (Layer 1, done in a prior session) across all 3 project locations: anobel.com, Public, and Barter/coder.

---

<!-- /ANCHOR:session-history-session-1770642361771-03e6u06xf-005-anobel.com -->

---

<!-- ANCHOR:recovery-hints-session-1770642361771-03e6u06xf-005-anobel.com -->
<a id="recovery-hints"></a>

## RECOVERY HINTS

**Diagnostic guidance for common session recovery scenarios.**

### Recovery Scenarios

| Scenario | Symptoms | Recovery Action |
|----------|----------|-----------------|
| Context Loss | Agent doesn't remember prior work | Run `/spec_kit:resume 005-anobel.com` |
| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "005-anobel.com" })` |
| Stale Context | Information seems outdated | Check `last_accessed_epoch` vs current time |
| Incomplete Handover | Missing continuation context | Review CONTINUE SESSION section above |
| Dedup Collision | Wrong memory surfaced | Check `fingerprint_hash` for conflicts |

### Diagnostic Commands

```bash
# Check memory index health
node .opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.js --status

# List memories for this spec folder
memory_search({ specFolder: "005-anobel.com", limit: 10 })

# Verify memory file integrity
ls -la 005-anobel.com/memory/

# Check for orphaned memories
memory_search({ query: "orphaned", anchors: ["state"] })

# Force re-index of this spec folder
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js 005-anobel.com --force
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
<!-- /ANCHOR:recovery-hints-session-1770642361771-03e6u06xf-005-anobel.com -->

---

<!-- ANCHOR:postflight-session-1770642361771-03e6u06xf-005-anobel.com -->
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
| Knowledge | [TBD] | [TBD] | [TBD] | → |
| Uncertainty | [TBD] | [TBD] | [TBD] | → |
| Context | [TBD] | [TBD] | [TBD] | → |

**Learning Index:** [TBD]/100

> Learning Index = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)
> Higher is better. Target: ≥25 for productive sessions.

**Gaps Closed:**

- No gaps explicitly closed during session

**New Gaps Discovered:**

- No new gaps discovered

**Session Learning Summary:**
Learning metrics will be calculated when both preflight and postflight data are provided.
<!-- /ANCHOR:postflight-session-1770642361771-03e6u06xf-005-anobel.com -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata-session-1770642361771-03e6u06xf-005-anobel.com -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "session-1770642361771-03e6u06xf"
spec_folder: "005-anobel.com"
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
created_at: "2026-02-09"
created_at_epoch: 1770642361
last_accessed_epoch: 1770642361
expires_at_epoch: 1778418361  # 0 for critical (never expires)

# Session Metrics
message_count: 1
decision_count: 5
tool_count: 0
file_count: 7
followup_count: 0

# Access Analytics
access_count: 1
last_search_query: ""
relevance_boost: 1  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
  - "detectspecfolder"
  - "implementation"
  - "implemented"
  - "fallthrough"
  - "immediately"
  - "consistency"
  - "gracefully"
  - "connection"
  - "completed"
  - "challenge"

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:

  []

key_files:
  - ".opencode/.../spec-folder/folder-detector.ts"
  - ".opencode/.../spec-folder/folder-detector.js"
  - "AGENTS.md"
  - "/.../coder/AGENTS.md"
  - "specs/.../097-memory-save-auto-detect/tasks.md"
  - "specs/.../097-memory-save-auto-detect/spec.md"
  - "specs/.../097-memory-save-auto-detect/implementation-summary.md"

# Relationships
related_sessions:

  []

parent_spec: "003-memory-and-spec-kit/097-memory-save-auto-detect"
child_sessions:

  []

# Embedding Info (populated by indexer)
embedding_model: "nomic-ai/nomic-embed-text-v1.5"
embedding_version: "1.0"
chunk_count: 1
```

<!-- /ANCHOR:metadata-session-1770642361771-03e6u06xf-005-anobel.com -->

---

*Generated by system-spec-kit skill v1.7.2*

