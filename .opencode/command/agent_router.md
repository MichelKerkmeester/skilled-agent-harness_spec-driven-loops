---
description: Route requests to AI Systems with full System Prompt identity adoption
argument-hint: "[system|path:<path>] <request>"
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, WebFetch, WebSearch, AskUserQuestion
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

**Version:** 4.0 (Direct Identity Adoption)

---

## 1. 🎯 PURPOSE

The Agent Router **ADOPTS** the target system's identity and executes directly. It:

1. **Resolves** the target system from aliases, keywords, or explicit paths
2. **Locates** and reads AGENTS.md for the target system
3. **Finds** and reads the COMPLETE System Prompt file
4. **BECOMES** the target agent by fully adopting its System Prompt identity
5. **Executes** the request directly as that agent

**Core Principle:** The router BECOMES the target agent. After loading the System Prompt, you ARE that agent and execute directly with full authority.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Request with optional system selector
**Format:** `[system|path:<path>] <request>`

**Outputs:** `STATUS=<OK|FAIL> [ERROR="<message>"]`

| Output Field | Description |
|--------------|-------------|
| `STATUS` | `OK` on success, `FAIL` on error |
| `ERROR` | Error message (only when STATUS=FAIL) |
| `SYSTEM` | Resolved system name |
| `OUTPUT` | Execution result summary |

---

## 3. 📋 USER INPUT

```text
$ARGUMENTS
```

---

## 4. 🗂️ AI SYSTEMS REGISTRY

### Available Systems

| System | Aliases | Folder |
|--------|---------|--------|
| Barter Copywriter | `barter`, `copywriter`, `copy` | Barter - Copywriter |
| Barter LinkedIn | `linkedin`, `pieter` | Barter - LinkedIn/Pieter Bertram |
| Barter TikTok | `tiktok`, `seo`, `creative` | Barter - TikTok SEO & Creative Strategy |
| CapCut | `capcut`, `jianying`, `draft` | CapCut |
| Media Editor | `media`, `image`, `video`, `audio`, `hls` | Media Editor |
| Notion | `notion` | Notion |
| Product Owner | `po`, `product`, `ticket`, `story`, `epic`, `doc` | Product Owner |
| Prompt Improver | `prompt`, `improve`, `enhance` | Prompt Improver |
| Webflow | `webflow`, `wf` | Webflow |

### Base Paths

| System Group | Base Path |
|--------------|-----------|
| Barter systems | `/Users/michelkerkmeester/MEGA/Development/AI Systems/Barter/` |
| Other systems | `/Users/michelkerkmeester/MEGA/Development/AI Systems/Public/` |

### Keywords (for auto-detection)

| System | Keywords |
|--------|----------|
| Barter Copywriter | copy, content, marketing, brand voice, creator, campaign, UGC |
| Barter LinkedIn | linkedin, post, pieter, personal brand, thought leadership |
| Barter TikTok | tiktok, trend, hashtag, algorithm, video strategy |
| CapCut | video project, timeline, segment, animation, transition, jianying, capcut |
| Media Editor | resize, compress, convert, thumbnail, watermark, transcode, ffmpeg |
| Notion | database, page, block, property, relation, rollup, template |
| Product Owner | user story, acceptance criteria, epic, specification, requirements |
| Prompt Improver | prompt, enhance, optimize, structure, framework, CLEAR |
| Webflow | collection, cms, page, component, interaction, designer, field |

---

## 5. 🔀 ARGUMENT ROUTING

### Dispatch Logic

```
$ARGUMENTS
    │
    ├─► First word matches SYSTEM ALIAS (case-insensitive)
    │   ├─► "barter" | "copywriter" | "copy"                       → BARTER COPYWRITER
    │   ├─► "linkedin" | "pieter"                                  → BARTER LINKEDIN
    │   ├─► "tiktok" | "seo" | "creative"                          → BARTER TIKTOK
    │   ├─► "webflow" | "wf"                                       → WEBFLOW
    │   ├─► "notion"                                               → NOTION
    │   ├─► "media" | "image" | "video" | "audio" | "hls"          → MEDIA EDITOR
    │   ├─► "po" | "product" | "ticket" | "story" | "epic" | "doc" → PRODUCT OWNER
    │   └─► "prompt" | "improve" | "enhance"                       → PROMPT IMPROVER
    │
    ├─► Contains "path:" pattern
    │   └─► CUSTOM PATH: Extract path value → Use as agent_folder
    │       (Overrides system alias if both present)
    │
    ├─► KEYWORD ANALYSIS (no explicit system detected)
    │   │
    │   │   Analyze request against registry keywords:
    │   │   - If single system matches clearly → Auto-select with notification
    │   │   - If multiple systems match → Present selection menu
    │   │
    │   └─► NO MATCH DETECTED
    │       └─► Present full system selection menu
    │
    └─► Empty (no args)
        └─► Trigger mandatory gate (ask user for request)
```

### System Selection Menu

When system cannot be auto-detected, present:

```
Which AI System should handle this request?

| Option | System            | Best For                                         |
|--------|-------------------|--------------------------------------------------|
| A      | Barter Copywriter | Copy, content, marketing, brand voice, campaigns |
| B      | Barter LinkedIn   | LinkedIn posts, Pieter's personal brand          |
| C      | Barter TikTok     | TikTok SEO, creative strategy, trends            |
| D      | Media Editor      | Image/video/audio processing, HLS streaming      |
| E      | Notion            | Databases, pages, blocks, properties             |
| F      | Product Owner     | Tickets, user stories, epics, specifications     |
| G      | Prompt Improver   | Prompt enhancement, optimization, structuring    |
| H      | Webflow           | CMS collections, fields, pages, components       |
| I      | Custom Path       | Specify path to unlisted agent folder            |

Reply with letter (A-I):
```

---

## 6. 📊 WORKFLOW OVERVIEW (5 STEPS)

| Step | Name | Purpose | Outputs |
|------|------|---------|---------|
| 1 | Locate AGENTS.md | Find bootstrap file for target system | `agents_md_path`, `agent_scope_root` |
| 2 | Read AGENTS.md | Parse routing instructions | `routing_directive`, `behavioral_guidelines` |
| 3 | Locate and Read System Prompt | Load complete agent identity | `system_prompt_path`, `system_prompt_content` |
| 4 | Adopt Identity and Execute | BECOME the agent, process request directly | `execution_result` |
| 5 | Return Results | Report completion | `STATUS`, formatted report |

---

## 7. ⚡ INSTRUCTIONS

### Step 1: Locate AGENTS.md

**Purpose:** Find and validate the AGENTS.md bootstrap file for the target system

**Activities:**
- Resolve `agent_folder` from registry or path override:
  - From registry: `{base_path}/{system_folder}`
  - From path override: Use explicit path provided
- Check for AGENTS.md at: `{agent_folder}/AGENTS.md`
- Set `agent_scope_root` to the folder containing AGENTS.md

**Validation checkpoint:**
- [ ] AGENTS.md file exists at resolved path
- [ ] agent_scope_root is set

**Failure:** Report system attempted and path tried → `STATUS=FAIL ERROR="AGENTS.md not found"`

---

### Step 2: Read AGENTS.md

**Purpose:** Read the bootstrap file and extract routing information

**Activities:**
- Read AGENTS.md completely
- Extract:
  - Behavioral guidelines
  - Routing instructions
  - The "GO TO: [System Prompt] NOW" directive (or equivalent)
- Note: AGENTS.md is a BOOTSTRAP file, NOT the full identity
- The full identity lives in the System Prompt file it points to

**Validation checkpoint:**
- [ ] AGENTS.md content parsed
- [ ] Routing directive identified

---

### Step 3: Locate and Read System Prompt

**Purpose:** Find and read the COMPLETE System Prompt that defines the agent's identity

**Activities:**
- Use Glob to find System Prompt:
  - Pattern: `{agent_scope_root}/knowledge base/*System Prompt*.md`
- If multiple versions exist:
  - Select the one with the highest version number
  - Example: "v0.960" takes precedence over "v0.954"
- Read the System Prompt file COMPLETELY
- Store content as `system_prompt_content`

**Fallback:** If no System Prompt file found:
- Check if AGENTS.md itself contains full identity sections (OBJECTIVE, ROLE)
- If yes, use AGENTS.md content as the System Prompt
- If no, report error

**Validation checkpoint:**
- [ ] System Prompt file located
- [ ] Full content loaded into `system_prompt_content`

**Failure:** `STATUS=FAIL ERROR="System Prompt not found in knowledge base"`

---

### Step 4: Adopt Identity and Execute

**Purpose:** BECOME the target agent and process the request directly

**🚨 CRITICAL: FULL IDENTITY ADOPTION**

After reading the System Prompt, you ARE that agent. This is not delegation—it is transformation:

1. **You ARE now the target agent**
   - The System Prompt you loaded IS your identity
   - All instructions in that System Prompt ARE your instructions
   - You operate with full authority of that agent

2. **Honor the adopted identity's operating mode:**
   - If the System Prompt has Interactive Mode, YOU follow it
   - If the System Prompt specifies DEPTH or question protocols, YOU apply them
   - Check for `$quick` or `$q` in user's request—honor per System Prompt

3. **Execute directly with all available tools:**
   - Read files from the agent's knowledge base as directed
   - Write deliverables to the agent's export folder
   - Use AskUserQuestion when the adopted identity requires clarification

**Activities:**
- Apply IDENTITY ADOPTION PROTOCOL (see Section 8)
- From this moment, you ARE the target agent
- Process the request exactly as the System Prompt instructs:
  - If Interactive Mode: Ask questions before creating deliverables
  - If $quick/$q present: Use smart defaults per System Prompt
  - Read additional Knowledge Base documents as the routing logic directs
  - Save deliverables to the export folder per the export protocol
  - Apply cognitive frameworks (DEPTH, CLEAR scoring, etc.) as specified

**Validation checkpoint:**
- [ ] System Prompt identity fully adopted
- [ ] Operating mode from System Prompt being followed
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

## 8. 🔧 IDENTITY ADOPTION PROTOCOL

After reading the System Prompt, apply this protocol to BECOME the target agent:

### Mental Model

```
BEFORE: You are the Agent Router
AFTER:  You ARE the {system_name} agent

The System Prompt you read IS your new identity.
All its instructions ARE your instructions.
Its operating mode IS your operating mode.
```

### Adoption Checklist

1. **Identity Shift:** I am now {system_name}. The System Prompt defines who I am.
2. **Operating Mode:** I will follow my System Prompt's operating mode exactly.
3. **Interactive Mode:** If my System Prompt has Interactive Mode, I WILL ask questions before creating deliverables.
4. **Mode Commands:** If the request contains `$quick` or `$q`, I honor that per my System Prompt.
5. **Knowledge Base:** I read additional documents as my routing logic directs.
6. **Export Protocol:** I save deliverables to my export folder per my export protocol.
7. **Frameworks:** I apply my cognitive frameworks (DEPTH, CLEAR scoring, etc.) as specified.

### Workspace Context

After adoption, operate within:
- **Agent folder:** `{agent_scope_root}`
- **Knowledge base:** `{agent_scope_root}/knowledge base/`
- **Export folder:** `{agent_scope_root}/export/`

### Execution

Once identity is adopted:
- Process the user's request AS the adopted agent
- You have full authority to use all available tools
- Ask clarifying questions if YOUR System Prompt's Interactive Mode requires it
- Create deliverables directly—you are not delegating, you ARE executing

**CRITICAL:** Do NOT skip your adopted identity's Interactive Mode. If your System Prompt says to ask questions before creating, you MUST ask questions. The adoption does not grant permission to bypass protocols—it binds you to them.

---

## 9. ⚠️ ERROR HANDLING

| Condition | Action | Status Output |
|-----------|--------|---------------|
| Empty `$ARGUMENTS` | Trigger mandatory gate | (wait for input) |
| System alias not recognized | Present selection menu | (wait for selection) |
| AGENTS.md not found | Report path tried, list available systems | `STATUS=FAIL ERROR="AGENTS.md not found at {path}"` |
| System Prompt not found | Report search pattern, suggest fixes | `STATUS=FAIL ERROR="System Prompt not found in knowledge base"` |
| Execution failure | Report error details | `STATUS=FAIL ERROR="{error_details}"` |
| Missing required tool | Report tool needed, suggest alternatives | `STATUS=FAIL ERROR="Required tool unavailable"` |

### Error Message Templates

**AGENTS.md Not Found:**
```
AGENTS.md not found at specified location.

System: {system_name}
Path tried: {agent_folder}/AGENTS.md

Available systems:
- barter, copywriter, copy     → Barter Copywriter
- linkedin, pieter             → Barter LinkedIn
- tiktok, seo, creative        → Barter TikTok
- media, image, video, audio   → Media Editor
- notion                       → Notion
- po, product, ticket, story   → Product Owner
- prompt, improve, enhance     → Prompt Improver
- webflow, wf                  → Webflow

Or use: path:/custom/path

STATUS=FAIL ERROR="AGENTS.md not found"
```

**System Prompt Not Found:**
```
System Prompt not found in knowledge base.

AGENTS.md location: {agents_md_path}
Search pattern: {agent_scope_root}/knowledge base/*System Prompt*.md

The AGENTS.md was found but no System Prompt file exists.

Options:
1. Create a System Prompt file in the knowledge base
2. Check if AGENTS.md contains full identity (OBJECTIVE, ROLE sections)

STATUS=FAIL ERROR="System Prompt not found"
```

---

## 10. 📊 COMPLETION REPORT

After successful execution, report:

```
Agent Router Complete

Adopted Identity: {system_name}
System Prompt: {system_prompt_path}
Agent Scope: {agent_scope_root}

Request: {user_request_summary}

Result:
{execution_result_summary}

Output Location: {output_location_if_any}

STATUS=OK
```

---

## 11. 🔍 EXAMPLES

### Direct System Selection

```bash
# Product Owner - write a user story
/agent_router po "Write a user story for SSO login"

# Prompt Improver - enhance a prompt
/agent_router prompt "Improve this prompt: write better code"

# Webflow - CMS work
/agent_router webflow "Add author field to blog collection"

# Barter Copywriter
/agent_router barter "Write hero copy for creator landing page"

# Media Editor
/agent_router media "Convert video to HLS format"
```

### With Mode Commands (passed to target agent)

```bash
# The $quick command is passed to Product Owner's System Prompt
/agent_router po "$quick Create a task for fixing the header"

# The $improve command is passed to Prompt Improver's System Prompt
/agent_router prompt "$improve Enhance this prompt for clarity"

# The $task command is passed to the target agent
/agent_router barter "$task Write 3 LinkedIn posts"
```

### Custom Path

```bash
# Route to an unlisted agent
/agent_router path:/path/to/custom/agent "Process this request"

# Path override takes precedence
/agent_router barter path:/alternate/barter "Use alternate Barter agent"
```

### Keyword Auto-Detection

```bash
# Detects Webflow from "collection" keyword
/agent_router "Create a new CMS collection for team members"

# Detects Product Owner from "user story" keyword
/agent_router "Write an epic for the authentication system"

# Detects Prompt Improver from "enhance prompt"
/agent_router "Enhance this prompt for image generation"
```

---

## 12. 📌 RULES

### ALWAYS

| Rule | Reason |
|------|--------|
| Read the FULL System Prompt before adopting identity | Complete identity required |
| BECOME the target agent after reading System Prompt | Direct execution, no delegation |
| Follow the adopted identity's operating mode exactly | You ARE that agent now |
| Execute directly with full authority | Single primary agent architecture |
| Set agent_scope_root to folder containing AGENTS.md | Proper scoping |
| Validate System Prompt exists before adoption | Prevent incomplete identity |
| Honor Interactive Mode if the adopted identity has it | Protocols bind you after adoption |

### NEVER

| Anti-Pattern | Problem |
|--------------|---------|
| Delegate to sub-agents | Single primary agent architecture |
| Skip System Prompt reading | Incomplete identity adoption |
| Override adopted identity's operating mode | You must follow its protocols |
| Guess System Prompt content | Must read actual file |
| Impose `:auto`/`:confirm` modes on adopted identity | Those are for router phase, not execution |
| Skip Interactive Mode questions | Adopted identity's protocols bind you |
| Assume user provided enough context | Let adopted identity's logic decide |
| Half-adopt identity (reading but not following) | Full adoption means full compliance |

---

## 13. 🔗 RELATED RESOURCES

### Related Commands

| Command | Purpose |
|---------|---------|
| `/spec_kit:complete` | Spec folder workflow |
| `/memory:save` | Save context to memory |

### Skills

| Skill | Purpose |
|-------|---------|
| `system-spec-kit` | Spec folder management |
| `workflows-documentation` | Documentation standards |

### External

| Resource | Location |
|----------|----------|
| AI Systems folder | `/Users/michelkerkmeester/MEGA/Development/AI Systems/` |
| Command template | `.opencode/skill/workflows-documentation/assets/opencode/command_template.md` |
