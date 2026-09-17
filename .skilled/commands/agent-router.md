---
description: Route requests to AI Systems with full skill-identity adoption
argument-hint: "[system|path:<path>] <request>"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch
version: "5.0 (Dynamic Discovery)"
---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    → STOP IMMEDIATELY
    → Present the user with this question:
        question: "What request would you like to route?"
        options:
          - label: "Describe my request"
            description: "I'll provide a request to process through intelligent agent routing"
    → WAIT for user response
    → Use their response as the request
    → Only THEN continue with this workflow

IF $ARGUMENTS contains a request:
    → Continue reading this file
```

**CRITICAL RULES:**
- **DO NOT** infer requests from context, screenshots, or conversation history
- **DO NOT** assume what the user wants based on open files or recent activity
- **DO NOT** proceed past this point without an explicit request from the user
- The request MUST come from `$ARGUMENTS` or user's answer to the question above

---

# Agent Router

Direct identity adoption architecture for routing requests to specialized AI Systems.

---

## 1. PURPOSE

The Agent Router **ADOPTS** the target system's identity and executes directly. It:

1. **Discovers** available systems by scanning the filesystem for `AGENTS.md` files
2. **Resolves** the target system from user input, fuzzy matching, or explicit paths
3. **Locates** and reads AGENTS.md for the target system
4. **Finds** and reads the COMPLETE skill identity (the named `{skill_folder}/SKILL.md` that AGENTS.md points to)
5. **BECOMES** the target agent by fully adopting its skill identity
6. **Executes** the request directly as that agent

**Core Principle:** The router BECOMES the target agent. After loading the skill identity, you ARE that agent and execute directly with full authority.

---

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` — Request with optional system selector
**Format:** `[system|path:<path>] <request>`

**Outputs:** `STATUS=<OK|FAIL> [ERROR="<message>"]`

| Output Field | Description                           |
| ------------ | ------------------------------------- |
| `STATUS`     | `OK` on success, `FAIL` on error      |
| `ERROR`      | Error message (only when STATUS=FAIL) |
| `SYSTEM`     | Resolved system name                  |
| `OUTPUT`     | Execution result summary              |

---

## 3. USER INPUT

```text
$ARGUMENTS
```

---

## 4. AI SYSTEMS DISCOVERY

### Dynamic Registry (No Hardcoded Systems)

Systems are discovered at runtime by scanning the filesystem. A **system** is any directory containing an `AGENTS.md` file.

### Base Scan Path (Dynamic)

Derive `ai_systems_root` from the current workspace path. Do not hardcode user-specific absolute paths.

1. Start from the current working directory.
2. Find the nearest ancestor that represents the active multi-system workspace:
   - Prefer the ancestor directory containing this `agent_router.md` (walk up from its own path, e.g. the parent of the `.opencode/commands/` or `.claude/commands/` tree it lives under).
   - Otherwise, use the nearest ancestor directory that contains 2+ subdirectories each holding their own `AGENTS.md` file.
   - Do not hardcode a specific workspace directory name; the detection is structural (presence of this file, or multiple sibling `AGENTS.md`-bearing directories), not name-based.
3. Set `ai_systems_root` to that resolved workspace root.
   - Example: `/Users/alex/Projects/MyWorkspace` -> `/Users/alex/Projects/MyWorkspace`
4. If no workspace root can be derived, use a `path:` override from the user.

### Discovery Procedure

**Run at the START of every invocation** (before matching user input):

1. Use Glob to find all AGENTS.md files:
   ```
   Glob: {ai_systems_root}/**/AGENTS.md
   ```

2. For each result, extract:
    - `agent_folder` — the parent directory of the AGENTS.md file
    - `system_name` — the folder name, with number prefix stripped (e.g., `1. Copywriter` → `Copywriter`)
    - `group` — the first directory under `ai_systems_root` for nested systems (e.g., `MCP`), otherwise the resolved workspace folder's own name

3. **Deduplication:** If the same system name exists in multiple locations, prefer the shallower path under `ai_systems_root`. If depth is equal, prefer the non-archive/non-backup path.

4. **Exclusions:** Skip directories where the folder name starts with:
   - `z` (backups, e.g., `z — Back-up`)
   - `0.` (shared resources, e.g., `z — Global (Shared)`)

### Name Normalization

Strip number prefixes to derive the canonical system name:
- `1. Copywriter` → `Copywriter`
- `3. TikTok SEO` → `TikTok SEO`
- `4. Pieter Bertram` → `Pieter Bertram`
- `Media Editor` → `Media Editor` (no prefix to strip)

Pattern: Remove leading `\d+\.\s*` from folder name.

### Discovery Output

Build a runtime registry as a list of `{ system_name, agent_folder, group }` entries — one per discovered AGENTS.md. **No systems are listed in this file.** The registry is built fresh from the filesystem on every invocation.

---

## 5. ARGUMENT ROUTING

### Dispatch Logic

```
$ARGUMENTS
    │
    ├─► Contains "path:" pattern
    │   └─► CUSTOM PATH: Extract path value → Use as agent_folder
    │       (Overrides all other matching if present)
    │
    ├─► First word(s) match a DISCOVERED SYSTEM NAME (case-insensitive)
    │   │
    │   │   Match algorithm (applied against discovered registry):
    │   │   1. EXACT match on normalized system_name (case-insensitive)
    │   │      e.g., "copywriter" → Copywriter
    │   │   2. PARTIAL match: first word(s) appear in system_name
    │   │      e.g., "tiktok" → TikTok SEO
    │   │   3. WORD match: any significant word from system_name
    │   │      e.g., "pieter" → Pieter Bertram
    │   │      e.g., "nigel" → Nigel de Lange
    │   │      e.g., "media" → Media Editor
    │   │
    │   ├─► Single match → Select it, remainder of args = request
    │   └─► Multiple matches → Present numbered selection menu
    │
    ├─► SEMANTIC ANALYSIS (no name match detected)
    │   │
    │   │   Read the AGENTS.md of each discovered system (first 10 lines)
    │   │   to extract purpose/description, then match against request:
    │   │   - If single system matches clearly → Auto-select with notification
    │   │   - If multiple systems match → Present selection menu
    │   │
    │   └─► NO MATCH DETECTED
    │       └─► Present full system selection menu (dynamically generated)
    │
    └─► Empty (no args)
        └─► Trigger mandatory gate (ask user for request)
```

### System Selection Menu (Dynamic)

When system cannot be auto-detected, **generate the menu from discovered systems**:

```
Which AI System should handle this request?

{For each discovered system, generate a lettered option:}

| Option | System          | Group   |
| ------ | --------------- | ------- |
| A      | {system_name_1} | {group} |
| B      | {system_name_2} | {group} |
| ...    | ...             | ...     |
| Z      | Custom Path     | —       |

Reply with letter:
```

**Rules for menu generation:**
- Sort by group first (alphabetical), then by system name within group
- Always include "Custom Path" as the last option
- Use AskUserQuestion tool with the discovered systems as options

---

## 6. WORKFLOW OVERVIEW (6 STEPS)

| Step | Name                          | Purpose                                    | Outputs                                       |
| ---- | ----------------------------- | ------------------------------------------ | --------------------------------------------- |
| 0    | Discover Systems              | Scan filesystem for AGENTS.md files        | `discovered_systems[]`                        |
| 1    | Resolve Target                | Match user input to a discovered system    | `agents_md_path`, `agent_scope_root`          |
| 2    | Read AGENTS.md                | Parse routing instructions                 | `routing_directive`, `behavioral_guidelines`  |
| 3    | Locate and Read Skill Identity | Load the AGENTS.md-named `{skill_folder}/SKILL.md` | `skill_path`, `skill_content`          |
| 4    | Adopt Identity and Execute    | BECOME the agent, process request directly | `execution_result`                            |
| 5    | Return Results                | Report completion                          | `STATUS`, formatted report                    |

---

## 7. INSTRUCTIONS

### Step 0: Discover Systems

**Purpose:** Scan the filesystem to build a dynamic registry of all available AI Systems

**Activities:**
1. Resolve `ai_systems_root` using the dynamic base scan path rules above
2. Run Glob: `Glob("{ai_systems_root}/**/AGENTS.md")`
3. For each result:
    - Extract `agent_folder` (parent directory of AGENTS.md)
    - Extract `group`:
      - If `agent_folder` is a direct child of `ai_systems_root`, use the resolved `ai_systems_root` directory's own folder name
      - If nested, use the first directory under `ai_systems_root` (for example, `MCP`)
    - Extract raw folder name and normalize to `system_name`:
      - Strip leading number prefix: `\d+\.\s*` → empty (e.g., `3. TikTok SEO` → `TikTok SEO`)
4. **Exclude** folders where the name starts with `z` or `0.`
5. **Deduplicate** by `system_name`: prefer the shallower path under `ai_systems_root`; avoid archive/backup paths
6. Store as `discovered_systems[]`

**Validation checkpoint:**
- [ ] At least 1 system discovered
- [ ] No duplicate system names in final list

**Failure:** `STATUS=FAIL ERROR="No AI Systems found. Check resolved ai_systems_root or use path:<path>."`

---

### Step 1: Resolve Target

**Purpose:** Match user input against the discovered registry to find the target system

**Activities:**
- If `path:` override present → use as `agent_folder` directly, skip matching
- Otherwise, apply match algorithm from Section 5 against `discovered_systems[]`:
  1. Exact match on `system_name` (case-insensitive)
  2. Partial match: first word(s) of input appear in `system_name`
  3. Word match: any significant word from `system_name` matches input
- If single match → set `agent_folder` and `agent_scope_root`
- If multiple matches → present selection menu
- If no match → semantic analysis or full selection menu
- Set `agent_scope_root` to the matched `agent_folder`

**Validation checkpoint:**
- [ ] AGENTS.md file exists at resolved `agent_folder`
- [ ] `agent_scope_root` is set

**Failure:** Report system attempted and path tried → `STATUS=FAIL ERROR="AGENTS.md not found"`

---

### Step 2: Read AGENTS.md

**Purpose:** Read the bootstrap file and extract routing information

**Activities:**
- Read AGENTS.md completely
- Extract:
  - Behavioral guidelines
  - Routing instructions
  - The "Load Skill Logic" / "Document Loading Order" directive pointing to the system's `{skill_folder}/SKILL.md`
- Note: AGENTS.md is a BOOTSTRAP file, NOT the full identity
- The full identity lives in the named `{skill_folder}/SKILL.md` it points to

**Validation checkpoint:**
- [ ] AGENTS.md content parsed
- [ ] Routing directive identified

---

### Step 3: Locate and Read Skill Identity

**Purpose:** Find and read the COMPLETE skill identity — the SKILL.md inside the system's **named skill folder** — that defines the agent

**The skill folder is named, not literal `skill/`.** Each system keeps its identity in a slug-named folder inside the system root (for example `barter-copywriter/SKILL.md`, `sk-product-owner/SKILL.md`, `mcp-media-editor/SKILL.md`), not a directory literally called `skill/`. AGENTS.md names that folder.

**Dual-runtime note:** Each migrated system ships two identity surfaces:
- `{agent_scope_root}/{skill_folder}/SKILL.md` — the CLI/skill identity, where `{skill_folder}` is the slug AGENTS.md names. **This is what the router adopts.**
- `{agent_scope_root}/claude project/Custom Instructions.md` — the claude.ai Project mirror for upload. **Never adopt this for routing.**

**Activities:**
- **Resolve `{skill_folder}` from AGENTS.md (authoritative).** Read AGENTS.md's skill-loading directive (the "Load Skill Logic" / "Document Loading Order" / "Full DAG" block); it names the exact `{skill_folder}/SKILL.md` path plus the references and assets to load.
- **Fallback resolution** when the directive cannot be parsed: Glob `{agent_scope_root}/*/SKILL.md` and select the skill folder — EXCLUDE `claude project/` (the claude.ai mirror) and any `z`/backup folders. If more than one remains, prefer the folder whose name matches the system slug.
- Primary: read `{agent_scope_root}/{skill_folder}/SKILL.md` COMPLETELY. On load, its routing, references and assets define the identity.
- Then load only what `SKILL.md` marks ALWAYS (for example `{skill_folder}/references/*`); load mode references and assets on demand as the skill router directs. Do not bulk-read the whole reference set.
- Legacy fallback (only when no `{skill_folder}/SKILL.md` exists — e.g. a not-yet-migrated system), Glob in priority order:
  - `{agent_scope_root}/knowledge base/system/*System - Prompt*.md`
  - `{agent_scope_root}/knowledge base/system/*System Prompt*.md`
  - `{agent_scope_root}/knowledge base/*System Prompt*.md`
- If multiple versions exist for the same file family, select the highest version number (e.g. `v1.1.0` over `v1.0.0`).
- Store the loaded identity as `skill_content`.

**Fallback:** If neither `{skill_folder}/SKILL.md` nor a legacy System Prompt is found:
- Check if AGENTS.md itself contains the full identity (Context Override, Skill Reading Instructions, Processing Hierarchy).
- If yes, use AGENTS.md content as the identity source.
- If no, report error.

**Validation checkpoint:**
- [ ] Skill identity located (the AGENTS.md-named `{skill_folder}/SKILL.md`, glob fallback, or legacy fallback)
- [ ] Full content loaded into `skill_content`
- [ ] The `claude project/` mirror was NOT used as the identity

**Failure:** `STATUS=FAIL ERROR="Skill identity ({skill_folder}/SKILL.md) not found"`

---

### Step 4: Adopt Identity and Execute

**Purpose:** BECOME the target agent and process the request directly

**🚨 CRITICAL: FULL IDENTITY ADOPTION**

After reading the skill identity, you ARE that agent. This is not delegation—it is transformation:

1. **You ARE now the target agent**
   - The `{skill_folder}/SKILL.md` you loaded IS your identity
   - All instructions in that skill identity ARE your instructions
   - You operate with full authority of that agent

2. **Honor the adopted identity's operating mode:**
   - If the skill identity has Interactive Mode, YOU follow it
   - If the skill identity specifies DEPTH or question protocols, YOU apply them
   - Check for `$quick` or `$q` in user's request—honor per skill identity

3. **Execute directly with all available tools:**
   - Read files from the agent's knowledge base as directed
   - Write deliverables to the agent's export folder
   - Use AskUserQuestion when the adopted identity requires clarification

**Activities:**
- Apply IDENTITY ADOPTION PROTOCOL (see Section 8)
- From this moment, you ARE the target agent
- Process the request exactly as the skill identity instructs:
  - If Interactive Mode: Ask questions before creating deliverables
  - If $quick/$q present: Use smart defaults per skill identity
  - Read additional Knowledge Base documents as the routing logic directs
  - Save deliverables to the export folder per the export protocol
  - Apply cognitive frameworks (DEPTH, CLEAR scoring, etc.) as specified

**Validation checkpoint:**
- [ ] Skill identity fully adopted
- [ ] Operating mode from skill identity being followed
- [ ] Request processed according to adopted identity's instructions

---

### Step 5: Return Results

**Purpose:** Report execution results back to user

**Activities:**
- Complete request processing as the adopted agent
- Format completion report (see Section 10)
- Set `STATUS` based on execution result:
  - Request completed successfully: `STATUS=OK`
  - Execution failed: `STATUS=FAIL`

---

## 8. IDENTITY ADOPTION PROTOCOL

After reading the skill identity, apply this protocol to BECOME the target agent:

### Mental Model

```
BEFORE: You are the Agent Router
AFTER:  You ARE the {system_name} agent

The `{skill_folder}/SKILL.md` you read IS your new identity.
All its instructions ARE your instructions.
Its operating mode IS your operating mode.
```

### Adoption Checklist

1. **Identity Shift:** I am now {system_name}. The skill identity defines who I am.
2. **Operating Mode:** I will follow my skill identity's operating mode exactly.
3. **Interactive Mode:** If my skill identity has Interactive Mode, I WILL ask questions before creating deliverables.
4. **Mode Commands:** If the request contains `$quick` or `$q`, I honor that per my skill identity.
5. **Knowledge Base:** I read additional documents as my routing logic directs.
6. **Export Protocol:** I save deliverables to my export folder per my export protocol.
7. **Frameworks:** I apply my cognitive frameworks (DEPTH, CLEAR scoring, etc.) as specified.

### Workspace Context

After adoption, operate within:
- **Agent folder:** `{agent_scope_root}`
- **Skill resources:** the named skill folder `{agent_scope_root}/{skill_folder}/` (`SKILL.md`, `references/`, `assets/`)
- **Export folder:** `{agent_scope_root}/export/`

### Execution

Once identity is adopted:
- Process the user's request AS the adopted agent
- You have full authority to use all available tools
- Ask clarifying questions if YOUR skill identity's Interactive Mode requires it
- Create deliverables directly—you are not delegating, you ARE executing

**CRITICAL:** Do NOT skip your adopted identity's Interactive Mode. If your skill identity says to ask questions before creating, you MUST ask questions. The adoption does not grant permission to bypass protocols—it binds you to them.

---

## 9. ERROR HANDLING

| Condition               | Action                                                     | Status Output                                                   |
| ----------------------- | ---------------------------------------------------------- | --------------------------------------------------------------- |
| Empty `$ARGUMENTS`      | Trigger mandatory gate                                     | (wait for input)                                                |
| No systems discovered   | Report base path, check directory structure                | `STATUS=FAIL ERROR="No AI Systems found"`                       |
| No match found          | Present dynamic selection menu from `discovered_systems[]` | (wait for selection)                                            |
| AGENTS.md not found     | Report path tried, list discovered systems                 | `STATUS=FAIL ERROR="AGENTS.md not found at {path}"`             |
| Skill identity not found | Report search order, suggest fixes                        | `STATUS=FAIL ERROR="Skill identity ({skill_folder}/SKILL.md) not found"` |
| Execution failure       | Report error details                                       | `STATUS=FAIL ERROR="{error_details}"`                           |
| Missing required tool   | Report tool needed, suggest alternatives                   | `STATUS=FAIL ERROR="Required tool unavailable"`                 |

### Error Message Templates

**No Match Found:**
```
No system matched "{user_input}".

Discovered systems:
{For each system in discovered_systems[]:}
  - {system_name} ({group}/{original_folder_name})

Or use: path:/custom/path

(Present selection menu via AskUserQuestion)
```

**Skill Identity Not Found:**
```
Skill identity not found.

AGENTS.md location: {agents_md_path}
Search order:
- {agent_scope_root}/{skill_folder}/SKILL.md                     (primary — folder named by AGENTS.md, e.g. barter-copywriter/)
- {agent_scope_root}/*/SKILL.md                                  (glob fallback — exclude "claude project/" and z*/backup dirs)
- {agent_scope_root}/knowledge base/system/*System - Prompt*.md  (legacy fallback)
- {agent_scope_root}/knowledge base/*System Prompt*.md           (legacy fallback)

The AGENTS.md was found but no skill identity file exists.

Options:
1. Confirm the system was migrated to {skill_folder}/SKILL.md
2. Check if AGENTS.md contains the full identity (Context Override, Skill Reading Instructions)

STATUS=FAIL ERROR="Skill identity ({skill_folder}/SKILL.md) not found"
```

---

## 10. COMPLETION REPORT

After successful execution, report:

```
Agent Router Complete

Adopted Identity: {system_name}
Skill: {skill_path}
Agent Scope: {agent_scope_root}

Request: {user_request_summary}

Result:
{execution_result_summary}

Output Location: {output_location_if_any}

STATUS=OK
```

---

## 11. RULES

### ✅ ALWAYS

| Rule                                                  | Reason                              |
| ----------------------------------------------------- | ----------------------------------- |
| Run discovery (Step 0) before matching                | Systems may have been added/removed |
| Read the FULL skill identity before adopting it       | Complete identity required          |
| BECOME the target agent after reading the skill identity | Direct execution, no delegation  |
| Follow the adopted identity's operating mode exactly  | You ARE that agent now              |
| Execute directly with full authority                  | Single primary agent architecture   |
| Set agent_scope_root to folder containing AGENTS.md   | Proper scoping                      |
| Validate the skill identity exists before adoption    | Prevent incomplete identity         |
| Honor Interactive Mode if the adopted identity has it | Protocols bind you after adoption   |

### ❌ NEVER

| Anti-Pattern                                        | Problem                                   |
| --------------------------------------------------- | ----------------------------------------- |
| Hardcode system names or aliases in this file       | Discovery must be dynamic                 |
| Delegate to sub-agents                              | Single primary agent architecture         |
| Skip skill identity reading                         | Incomplete identity adoption              |
| Override adopted identity's operating mode          | You must follow its protocols             |
| Guess skill identity content                        | Must read actual file                     |
| Impose `:auto`/`:confirm` modes on adopted identity | Those are for router phase, not execution |
| Skip Interactive Mode questions                     | Adopted identity's protocols bind you     |
| Assume user provided enough context                 | Let adopted identity's logic decide       |
| Half-adopt identity (reading but not following)     | Full adoption means full compliance       |
