<!-- TEMPLATE: context_template.md v2.1 - DO NOT EDIT GENERATED FILES -->
<!-- Template Configuration Comments (stripped during generation) -->

<!-- Context Type Detection:
  - "research": >50% Read/Grep/Glob tools, minimal Write/Edit
  - "implementation": >30% Write/Edit tools
  - "decision": User choice recorded OR explicit decision recording
  - "discovery": WebSearch/WebFetch used significantly
  - "general": fallback when no clear pattern

  Detection Logic (pseudo-code):
  ```
  tool_counts = count_by_category(tools_used)
  read_tools = tool_counts['Read'] + tool_counts['Grep'] + tool_counts['Glob']
  write_tools = tool_counts['Write'] + tool_counts['Edit']
  web_tools = tool_counts['WebSearch'] + tool_counts['WebFetch']
  total = sum(tool_counts.values())

  if decision_count > 0 or user_choice_recorded:
    return 'decision'
  elif web_tools / total > 0.3:
    return 'discovery'
  elif read_tools / total > 0.5 and write_tools / total < 0.1:
    return 'research'
  elif write_tools / total > 0.3:
    return 'implementation'
  else:
    return 'general'
  ```
-->

<!-- Importance Tier Guidelines:
  - critical: Core architectural decisions, never expires
    * System-wide patterns that affect multiple components
    * Security decisions and authentication flows
    * Database schema changes
    * API contract definitions

  - important: Key implementation details, long-term retention (90+ days)
    * Feature implementation decisions
    * Integration patterns
    * Performance optimizations
    * Bug fix root causes

  - normal: Standard session notes (default, 30-day retention)
    * Regular implementation work
    * Documentation updates
    * Refactoring sessions

  - temporary: Debug notes, expires after 7 days
    * Debugging sessions
    * Exploratory research
    * Quick fixes and workarounds

  - deprecated: Outdated info, excluded from search
    * Superseded decisions
    * Removed features
    * Old approaches replaced by new ones

  Auto-Detection Hints:
  - Files modified in /architecture/ or /core/ -> suggest 'critical'
  - Multiple decisions recorded -> suggest 'important'
  - High tool count but low file changes -> suggest 'temporary'
  - User explicitly marks importance in conversation
-->

<!-- Constitutional Tier Promotion:
  To promote a memory to constitutional tier (always surfaced):
  
  1. Via MCP tool after indexing:
     memory_update({ id: <memory_id>, importanceTier: 'constitutional' })
  
  2. Criteria for constitutional:
     - Applies to ALL future conversations (not project-specific)
     - Core constraints/rules that should NEVER be forgotten
     - ~500 token budget total for constitutional tier
     
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

<!-- Channel/Branch Association:
  The channel field captures the git branch at session creation time.
  This enables filtering memories by feature work and tracking
  which decisions were made in which development context.

  Format: {branch_name} or "detached:{commit_hash}" if detached HEAD
-->

---

# SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Session Date | {{DATE}} |
| Session ID | {{SESSION_ID}} |
| Spec Folder | {{SPEC_FOLDER}} |
| Channel | {{CHANNEL}} |
| Importance Tier | {{IMPORTANCE_TIER}} |
| Context Type | {{CONTEXT_TYPE}} |
| Total Messages | {{MESSAGE_COUNT}} |
| Tool Executions | {{TOOL_COUNT}} |
| Decisions Made | {{DECISION_COUNT}} |
| Follow-up Items Recorded | {{FOLLOWUP_COUNT}} |
| Created At | {{DATE}} |
| Created At (Epoch) | {{CREATED_AT_EPOCH}} |
| Last Accessed (Epoch) | {{LAST_ACCESSED_EPOCH}} |
| Access Count | {{ACCESS_COUNT}} |

---

## Table of Contents

- [Project State Snapshot](#project-state-snapshot)
{{#HAS_IMPLEMENTATION_GUIDE}}- [Implementation Guide](#implementation-guide)
{{/HAS_IMPLEMENTATION_GUIDE}}- [Overview](#overview)
{{#HAS_OBSERVATIONS}}- [Detailed Changes](#detailed-changes)
{{/HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}- [Workflow Visualization](#workflow-visualization)
{{/HAS_WORKFLOW_DIAGRAM}}- [Decisions](#decisions)
- [Conversation](#conversation)
- [Memory Metadata](#memory-metadata)

---

<a id="project-state-snapshot"></a>

## PROJECT STATE SNAPSHOT

| Field | Value |
|-------|-------|
| Phase | {{PROJECT_PHASE}} |
| Active File | {{ACTIVE_FILE}} |
| Last Action | {{LAST_ACTION}} |
| Next Action | {{NEXT_ACTION}} |
| Blockers | {{BLOCKERS}} |

{{#HAS_FILE_PROGRESS}}
### File Progress

| File | Status |
|------|--------|
{{#FILE_PROGRESS}}| {{FILE_NAME}} | {{FILE_STATUS}} |
{{/FILE_PROGRESS}}
{{/HAS_FILE_PROGRESS}}

{{#HAS_SPEC_FILES}}

**Related Documentation:**
{{#SPEC_FILES}}- [`{{FILE_NAME}}`]({{FILE_PATH}}) - {{DESCRIPTION}}
{{/SPEC_FILES}}
{{/HAS_SPEC_FILES}}

{{#HAS_KEY_TOPICS}}
**Key Topics:** {{#TOPICS}}`{{.}}`{{^LAST}} | {{/LAST}}{{/TOPICS}}
{{/HAS_KEY_TOPICS}}

---

{{#HAS_IMPLEMENTATION_GUIDE}}
<!-- ANCHOR:task-guide-{{TOPIC}}-{{SPEC_FOLDER}} -->
<a id="implementation-guide"></a>

## 1. IMPLEMENTATION GUIDE

**What Was Built**:
{{#IMPLEMENTATIONS}}
- **{{FEATURE_NAME}}** - {{DESCRIPTION}}
{{/IMPLEMENTATIONS}}
{{^IMPLEMENTATIONS}}
- No specific implementations recorded
{{/IMPLEMENTATIONS}}

**Key Files and Their Roles**:
{{#IMPL_KEY_FILES}}
- `{{FILE_PATH}}` - {{ROLE}}
{{/IMPL_KEY_FILES}}
{{^IMPL_KEY_FILES}}
- No key files identified
{{/IMPL_KEY_FILES}}

**How to Extend**:
{{#EXTENSION_GUIDES}}
- {{GUIDE_TEXT}}
{{/EXTENSION_GUIDES}}
{{^EXTENSION_GUIDES}}
- No extension guides available
{{/EXTENSION_GUIDES}}

**Common Patterns**:
{{#PATTERNS}}
- **{{PATTERN_NAME}}**: {{USAGE}}
{{/PATTERNS}}
{{^PATTERNS}}
- No patterns identified
{{/PATTERNS}}
<!-- /ANCHOR:task-guide-{{TOPIC}}-{{SPEC_FOLDER}} -->

---
{{/HAS_IMPLEMENTATION_GUIDE}}

<!-- ANCHOR:summary-{{SESSION_ID}}-{{SPEC_FOLDER}} -->
<a id="overview"></a>

## {{#HAS_IMPLEMENTATION_GUIDE}}2{{/HAS_IMPLEMENTATION_GUIDE}}{{^HAS_IMPLEMENTATION_GUIDE}}1{{/HAS_IMPLEMENTATION_GUIDE}}. OVERVIEW

{{SUMMARY}}

**Key Outcomes**:
{{#OUTCOMES}}- {{OUTCOME}}
{{/OUTCOMES}}
{{^OUTCOMES}}
- No specific outcomes recorded.
{{/OUTCOMES}}
{{#HAS_FILES}}

**Key Files:**

| **File** | **Description** |
|:---------|:----------------|
{{#FILES}}| `{{FILE_PATH}}` | {{DESCRIPTION}} |
{{/FILES}}
{{/HAS_FILES}}
<!-- /ANCHOR:summary-{{SESSION_ID}}-{{SPEC_FOLDER}} -->

---
{{#HAS_OBSERVATIONS}}

<!-- ANCHOR:detailed-changes-{{SESSION_ID}}-{{SPEC_FOLDER}} -->
<a id="detailed-changes"></a>

## {{#HAS_IMPLEMENTATION_GUIDE}}3{{/HAS_IMPLEMENTATION_GUIDE}}{{^HAS_IMPLEMENTATION_GUIDE}}2{{/HAS_IMPLEMENTATION_GUIDE}}. DETAILED CHANGES

{{#OBSERVATIONS}}
{{^IS_DECISION}}
<!-- ANCHOR:{{ANCHOR_ID}}-{{SESSION_ID}} -->
### {{TYPE}}: {{TITLE}}

{{NARRATIVE}}

{{#HAS_FILES}}**Files:** {{FILES_LIST}}{{/HAS_FILES}}
{{#HAS_FACTS}}**Details:** {{FACTS_LIST}}{{/HAS_FACTS}}
<!-- /ANCHOR:{{ANCHOR_ID}}-{{SESSION_ID}} -->

{{/IS_DECISION}}
{{/OBSERVATIONS}}
<!-- /ANCHOR:detailed-changes-{{SESSION_ID}}-{{SPEC_FOLDER}} -->

---
{{/HAS_OBSERVATIONS}}
{{#HAS_WORKFLOW_DIAGRAM}}

<a id="workflow-visualization"></a>

## {{#HAS_IMPLEMENTATION_GUIDE}}{{#HAS_OBSERVATIONS}}4{{/HAS_OBSERVATIONS}}{{^HAS_OBSERVATIONS}}3{{/HAS_OBSERVATIONS}}{{/HAS_IMPLEMENTATION_GUIDE}}{{^HAS_IMPLEMENTATION_GUIDE}}{{#HAS_OBSERVATIONS}}3{{/HAS_OBSERVATIONS}}{{^HAS_OBSERVATIONS}}2{{/HAS_OBSERVATIONS}}{{/HAS_IMPLEMENTATION_GUIDE}}. WORKFLOW VISUALIZATION

**Pattern Type**: {{PATTERN_TYPE}}

**Use Case**: {{USE_CASE_TITLE}}

```
{{WORKFLOW_FLOWCHART}}
```

{{#HAS_PHASES}}
### Phase Breakdown

{{#PHASES}}
**Phase {{INDEX}}: {{PHASE_NAME}}** - Duration: {{DURATION}}
{{#ACTIVITIES}}
- {{.}}
{{/ACTIVITIES}}

{{/PHASES}}
{{/HAS_PHASES}}

### Key Features Demonstrated

{{#FEATURES}}
- **{{FEATURE_NAME}}**: {{FEATURE_DESC}}
{{/FEATURES}}

### When to Use This Pattern

{{#USE_CASES}}
- {{.}}
{{/USE_CASES}}

**Reading Guide**:
- Rounded boxes = Start/End points
- Standard boxes = Process steps
- Arrows = Flow direction (top to bottom)

> **Pattern Reference**: This workflow uses the **{{PATTERN_TYPE}}** pattern.
>
> **Workflow Pattern Guide**:
> - **Linear workflows**: Sequential phase execution, ideal for <=4 phases
> - **Parallel workflows**: Concurrent phase execution, ideal for >4 phases
> - **This session**: {{PATTERN_TYPE}} pattern with {{PHASE_COUNT}} phases
>
> For detailed pattern examples, see:
> `.opencode/skill/system-memory/references/`

---
{{/HAS_WORKFLOW_DIAGRAM}}

<!-- ANCHOR:decisions-{{SESSION_ID}}-{{SPEC_FOLDER}} -->
<a id="decisions"></a>

## {{#HAS_IMPLEMENTATION_GUIDE}}{{#HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}5{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}4{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{^HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}4{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}3{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{/HAS_IMPLEMENTATION_GUIDE}}{{^HAS_IMPLEMENTATION_GUIDE}}{{#HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}4{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}3{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{^HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}3{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}2{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{/HAS_IMPLEMENTATION_GUIDE}}. DECISIONS
{{#DECISIONS}}

<!-- ANCHOR:{{DECISION_ANCHOR_ID}}-{{SESSION_ID}} -->
### Decision {{INDEX}}: {{TITLE}}

**Context**: {{CONTEXT}}

**Timestamp**: {{TIMESTAMP}}

**Importance**: {{DECISION_IMPORTANCE}}

{{#HAS_DECISION_TREE}}

#### Visual Decision Tree

```
{{DECISION_TREE}}
```
{{/HAS_DECISION_TREE}}

#### Options Considered
{{#OPTIONS}}

{{OPTION_NUMBER}}. **{{LABEL}}**
   {{DESCRIPTION}}
{{/OPTIONS}}

#### Chosen Approach

**Selected**: {{CHOSEN}}

**Rationale**: {{RATIONALE}}

#### Trade-offs
{{#HAS_PROS}}

**Advantages**:
{{#PROS}}- {{PRO}}
{{/PROS}}
{{/HAS_PROS}}
{{#HAS_CONS}}

**Disadvantages**:
{{#CONS}}- {{CON}}
{{/CONS}}
{{/HAS_CONS}}
{{#HAS_EVIDENCE}}

**Supporting Evidence**:
{{#EVIDENCE}}- {{EVIDENCE_ITEM}}
{{/EVIDENCE}}
{{/HAS_EVIDENCE}}
{{#HAS_CAVEATS}}

**Caveats**:
{{#CAVEATS}}- {{CAVEAT_ITEM}}
{{/CAVEATS}}
{{/HAS_CAVEATS}}
{{#HAS_FOLLOWUP}}

**Follow-up Actions**:
{{#FOLLOWUP}}- {{FOLLOWUP_ITEM}}
{{/FOLLOWUP}}
{{/HAS_FOLLOWUP}}

**Confidence**: {{CONFIDENCE}}%
<!-- /ANCHOR:{{DECISION_ANCHOR_ID}}-{{SESSION_ID}} -->

---
{{/DECISIONS}}
{{^DECISIONS}}

This session did not involve significant architectural or technical decisions. The work was primarily implementation, bug fixes, documentation, or research.

---
{{/DECISIONS}}
<!-- /ANCHOR:decisions-{{SESSION_ID}}-{{SPEC_FOLDER}} -->

<!-- ANCHOR:session-history-{{SESSION_ID}}-{{SPEC_FOLDER}} -->
<a id="conversation"></a>

## {{#HAS_IMPLEMENTATION_GUIDE}}{{#HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}6{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}5{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{^HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}5{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}4{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{/HAS_IMPLEMENTATION_GUIDE}}{{^HAS_IMPLEMENTATION_GUIDE}}{{#HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}5{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}4{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{^HAS_OBSERVATIONS}}{{#HAS_WORKFLOW_DIAGRAM}}4{{/HAS_WORKFLOW_DIAGRAM}}{{^HAS_WORKFLOW_DIAGRAM}}3{{/HAS_WORKFLOW_DIAGRAM}}{{/HAS_OBSERVATIONS}}{{/HAS_IMPLEMENTATION_GUIDE}}. CONVERSATION

Complete timestamped dialogue capturing all user interactions, AI responses, tool executions, and code changes during the session.

This session followed a **{{FLOW_PATTERN}}** conversation pattern with **{{PHASE_COUNT}}** distinct phases.

##### Conversation Phases
{{#PHASES}}- **{{PHASE_NAME}}** - {{DURATION}}
{{/PHASES}}
{{^PHASES}}
- Single continuous phase
{{/PHASES}}

---

### Message Timeline
{{#MESSAGES}}

> **{{ROLE}}** | {{TIMESTAMP}}

{{CONTENT}}
{{#TOOL_CALLS}}

**Tool: {{TOOL_NAME}}**
{{DESCRIPTION}}
{{#HAS_RESULT}}

<details>
<summary>Result Preview</summary>

```
{{RESULT_PREVIEW}}
```

</details>
{{/HAS_RESULT}}
{{/TOOL_CALLS}}

---
{{/MESSAGES}}
{{^MESSAGES}}

No conversation messages were captured. This may indicate an issue with data collection or the session has just started.

---
{{/MESSAGES}}
<!-- /ANCHOR:session-history-{{SESSION_ID}}-{{SPEC_FOLDER}} -->

---

<a id="memory-metadata"></a>

## MEMORY METADATA

<!-- ANCHOR:metadata-{{SESSION_ID}}-{{SPEC_FOLDER}} -->

> **Machine-Readable Section** - This YAML block is parsed by the semantic memory indexer for search optimization and decay calculations.

```yaml
# Core Identifiers
session_id: "{{SESSION_ID}}"
spec_folder: "{{SPEC_FOLDER}}"
channel: "{{CHANNEL}}"

# Classification
importance_tier: "{{IMPORTANCE_TIER}}"  # critical|important|normal|temporary|deprecated
context_type: "{{CONTEXT_TYPE}}"        # research|implementation|decision|discovery|general

# Timestamps (for decay calculations)
created_at: "{{DATE}}"
created_at_epoch: {{CREATED_AT_EPOCH}}
last_accessed_epoch: {{LAST_ACCESSED_EPOCH}}
expires_at_epoch: {{EXPIRES_AT_EPOCH}}  # 0 for critical (never expires)

# Session Metrics
message_count: {{MESSAGE_COUNT}}
decision_count: {{DECISION_COUNT}}
tool_count: {{TOOL_COUNT}}
file_count: {{FILE_COUNT}}
followup_count: {{FOLLOWUP_COUNT}}

# Access Analytics
access_count: {{ACCESS_COUNT}}
last_search_query: "{{LAST_SEARCH_QUERY}}"
relevance_boost: {{RELEVANCE_BOOST}}  # 1.0 default, increased by access patterns

# Content Indexing
key_topics:
{{#TOPICS}}  - "{{.}}"
{{/TOPICS}}

# Trigger Phrases (auto-extracted for fast <50ms matching)
trigger_phrases:
{{#TRIGGER_PHRASES}}  - "{{.}}"
{{/TRIGGER_PHRASES}}
{{^TRIGGER_PHRASES}}  []
{{/TRIGGER_PHRASES}}

key_files:
{{#KEY_FILES}}  - "{{FILE_PATH}}"
{{/KEY_FILES}}

# Relationships
related_sessions:
{{#RELATED_SESSIONS}}  - "{{.}}"
{{/RELATED_SESSIONS}}
{{^RELATED_SESSIONS}}  []
{{/RELATED_SESSIONS}}

parent_spec: "{{PARENT_SPEC}}"
child_sessions:
{{#CHILD_SESSIONS}}  - "{{.}}"
{{/CHILD_SESSIONS}}
{{^CHILD_SESSIONS}}  []
{{/CHILD_SESSIONS}}

# Embedding Info (populated by indexer)
embedding_model: "{{EMBEDDING_MODEL}}"
embedding_version: "{{EMBEDDING_VERSION}}"
chunk_count: {{CHUNK_COUNT}}
```

<!-- /ANCHOR:metadata-{{SESSION_ID}}-{{SPEC_FOLDER}} -->

---

*Generated by system-memory skill v{{SKILL_VERSION}}*

<!--
  SESSION CONTEXT DOCUMENTATION v2.0

  IMPROVEMENTS IN THIS VERSION:
  - Session ID for unique identification across branches
  - Channel/branch association for context filtering
  - Importance tiers with decay calculations
  - Context type auto-detection
  - Epoch timestamps for programmatic access
  - Access tracking for relevance boosting
  - Machine-readable YAML metadata block
  - Enhanced anchor naming with session IDs

  DECAY CALCULATION:
  - critical: never expires (expires_at_epoch = 0)
  - important: 90 days base, extended by access
  - normal: 30 days base, extended by access
  - temporary: 7 days, no extension
  - deprecated: excluded from search immediately

  ACCESS BOOST FORMULA:
  relevance_boost = 1.0 + (access_count * 0.1) + (recent_access_bonus)
  where recent_access_bonus = 0.5 if accessed in last 7 days

  INDEXING NOTES:
  - Anchors include session_id for cross-session uniqueness
  - YAML metadata block is primary source for indexer
  - Topics extracted from section headers and decision titles
  - Embeddings generated per-section, not whole document
-->
