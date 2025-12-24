---
name: system-spec-kit
description: "Mandatory spec folder workflow orchestrating documentation level selection (1-3), template selection, and folder creation for all file modifications through documentation enforcement."
allowed-tools: [Read, Write, Edit, Bash, Glob, Grep, Task]
version: 15.0.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3), template usage, and context preservation through AGENTS.md-enforced workflows.

---

## 1. 🎯 WHEN TO USE

### Activation Triggers

**MANDATORY for ALL file modifications:**
- Code files: JS, TS, Python, CSS, HTML
- Documentation: Markdown, README, guides
- Configuration: JSON, YAML, TOML, env templates
- Templates, knowledge base, build/tooling files

**Request patterns that trigger activation:**
- "Add/implement/create [feature]"
- "Fix/update/refactor [code]"
- "Modify/change [configuration]"
- Any keyword: add, implement, fix, update, create, modify, rename, delete, configure, analyze

**Example triggers:**
- "Add email validation to the signup form" → Level 1-2
- "Refactor the authentication module" → Level 2-3
- "Fix the button alignment bug" → Level 1
- "Implement user dashboard with analytics" → Level 3

### When NOT to Use

- Pure exploration/reading (no file modifications)
- Single typo fixes (<5 characters in one file)
- Whitespace-only changes
- Auto-generated file updates (package-lock.json)
- User explicitly selects Option D (skip documentation)

**Rule of thumb:** If modifying ANY file content → Activate this skill.

### Utility Template Triggers

| Template              | Trigger Keywords                                                                                                              | Action                    |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `handover.md`         | "handover", "next session", "continue later", "pass context", "ending session", "save state", "multi-session", "for next AI"  | Suggest creating handover |
| `debug-delegation.md` | "stuck", "can't fix", "tried everything", "same error", "fresh eyes", "hours on this", "still failing", "need help debugging" | Suggest `/spec_kit:debug` |

**Rule:** When detected, proactively suggest the appropriate action.

---

## 2. 🧭 SMART ROUTING

### Activation Detection

```
User Request
    │
    ├─► Contains "spec", "plan", "document", "checklist"?
    │   └─► YES → Activate SpecKit
    │
    ├─► File modification requested?
    │   └─► Gate 3 triggered → Ask spec folder question
    │
    ├─► Contains "debug", "stuck", "help"?
    │   └─► Route to /spec_kit:debug
    │
    └─► Contains "continue", "resume", "pick up"?
        └─► Route to /spec_kit:resume
```

### Resource Router

**Phase-Based Loading:**

| Phase              | Trigger                               | Load Resources                             | Execute             |
| ------------------ | ------------------------------------- | ------------------------------------------ | ------------------- |
| **Planning**       | New feature, "plan", "design"         | level_specifications.md, template_guide.md | /spec_kit:plan      |
| **Research**       | "investigate", "explore", "analyze"   | quick_reference.md, worked_examples.md     | /spec_kit:research  |
| **Implementation** | "implement", "build", "code"          | validation_rules.md, template_guide.md     | /spec_kit:implement |
| **Debugging**      | "stuck", "error", "not working"       | quick_reference.md, troubleshooting        | /spec_kit:debug     |
| **Completion**     | "done", "finished", "complete"        | validation_rules.md, checklists/           | /spec_kit:complete  |
| **Handover**       | "stopping", "break", "continue later" | quick_reference.md                         | /spec_kit:handover  |
| **Resume**         | "continue", "pick up", "resume"       | quick_reference.md                         | /spec_kit:resume    |

**Command → Resource Mapping:**

| Command               | Primary Resources                                 | Templates Used                 |
| --------------------- | ------------------------------------------------- | ------------------------------ |
| `/spec_kit:plan`      | level_specifications.md, level_decision_matrix.md | spec.md, plan.md               |
| `/spec_kit:research`  | quick_reference.md                                | research.md                    |
| `/spec_kit:implement` | validation_rules.md, template_guide.md            | tasks.md, checklist.md         |
| `/spec_kit:debug`     | quick_reference.md, parallel_dispatch_config.md   | debug-delegation.md            |
| `/spec_kit:complete`  | validation_rules.md                               | —                              |
| `/spec_kit:handover`  | quick_reference.md                                | handover.md                    |
| `/spec_kit:resume`    | quick_reference.md                                | —                              |

### Resource Inventory

**Templates (`templates/`):**

| Level | Required Files               | Optional Files                                      |
| ----- | ---------------------------- | --------------------------------------------------- |
| 1     | spec.md, plan.md, tasks.md   | —                                                   |
| 2     | Level 1 + checklist.md       | —                                                   |
| 3     | Level 2 + decision-record.md | research.md                                         |
| Any   | —                            | handover.md, debug-delegation.md                    |

**References (`references/`):**
| File                     | Purpose                  | When to Load               |
| ------------------------ | ------------------------ | -------------------------- |
| level_specifications.md  | Complete Level 1-3 specs | Planning phase             |
| template_guide.md        | Template selection rules | Planning, Implementation   |
| validation_rules.md      | All validation rules     | Implementation, Completion |
| quick_reference.md       | Commands, checklists     | Any phase                  |
| path_scoped_rules.md     | Path-scoped rules        | Advanced usage             |
| worked_examples.md       | Real-world examples      | Learning, Research         |
| sub_folder_versioning.md | Sub-folder workflow      | Reusing spec folders       |

**Assets (`assets/`):**
- `level_decision_matrix.md` - LOC thresholds, complexity factors
- `template_mapping.md` - Template-to-level mapping
- `parallel_dispatch_config.md` - Agent dispatch configuration

**Scripts (`scripts/`):**
- `validate-spec.sh` - Validation orchestrator (runs automatically)
- `create-spec-folder.sh` - Create new spec folders
- `recommend-level.sh` - Suggest documentation level
- `archive-spec.sh` - Archive completed specs
- `lib/` - Shared libraries
- `rules/` - Validation rule plugins

### Commands

| Command               | Args            | Purpose                                  |
| --------------------- | --------------- | ---------------------------------------- |
| `/spec_kit:plan`      | `[spec-folder]` | Start planning phase, create spec folder |
| `/spec_kit:research`  | `[spec-folder]` | Deep investigation before implementation |
| `/spec_kit:implement` | `[spec-folder]` | Implementation with validation           |
| `/spec_kit:debug`     | —               | Delegate debugging to sub-agent          |
| `/spec_kit:complete`  | `[spec-folder]` | Verify completion, run validation        |
| `/spec_kit:handover`  | `[spec-folder]` | Create handover for session break        |
| `/spec_kit:resume`    | `[spec-folder]` | Resume from handover                     |

> **Note:** Validation runs automatically during `/spec_kit:complete` and `/spec_kit:implement`. No separate validate command needed.

---

## 3. ⚙️ HOW IT WORKS

### Gate 3 Integration

> **See AGENTS.md Section 2** for the complete Gate 3 spec folder question flow. This skill implements that gate.

**Quick Reference:** When file modification detected, AI MUST ask:

```
**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip
```

| Option          | Description                        | Best For                        |
| --------------- | ---------------------------------- | ------------------------------- |
| **A) Existing** | Continue in related spec folder    | Iterative work, related changes |
| **B) New**      | Create `specs/###-name/`           | New features, unrelated work    |
| **C) Update**   | Add to existing documentation      | Extending existing docs         |
| **D) Skip**     | No spec folder (creates tech debt) | Trivial changes only            |

**First Message Protocol:**
1. Gate 3 question is your FIRST response
2. No analysis first ("let me understand the scope")
3. No tool calls first ("let me check what exists")
4. Ask immediately, wait for answer, then proceed

**Why:** Large tasks feel urgent. Urgency bypasses process. Ask first, analyze after.

**Enforcement:** Constitutional-tier memory surfaces automatically via `memory_match_triggers()`. See `specs/005-memory/018-gate3-enforcement/` for implementation details.

**Example First Response:**
```
Before proceeding with file modifications, please choose:

**Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

I found these potentially related specs:
- 005-user-auth/ (active) - User authentication system
- 006-login-form/ (complete) - Login form implementation

Reply with your choice (A/B/C/D).
```

### 3-Level Progressive Enhancement

```
Level 1 (Baseline):     spec.md + plan.md + tasks.md
         ↓
Level 2 (Verification): Level 1 + checklist.md
         ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research.md
```

| Level | LOC Guidance | Required Files               | Use When                     |
| ----- | ------------ | ---------------------------- | ---------------------------- |
| **1** | <100         | spec.md, plan.md, tasks.md   | All features (minimum)       |
| **2** | 100-499      | Level 1 + checklist.md       | QA validation needed         |
| **3** | ≥500         | Level 2 + decision-record.md | Complex/architecture changes |

**Level Selection Examples:**

| Task                 | LOC Est. | Level | Rationale                      |
| -------------------- | -------- | ----- | ------------------------------ |
| Fix CSS alignment    | 10       | 1     | Simple, low risk               |
| Add form validation  | 80       | 1-2   | Borderline, low complexity     |
| Modal component      | 200      | 2     | Multiple files, needs QA       |
| Auth system refactor | 600      | 3     | Architecture change, high risk |
| Database migration   | 150      | 3     | High risk overrides LOC        |

**Override Factors (can push to higher level):**
- High complexity or architectural changes
- Risk (security, config cascades, authentication)
- Multiple systems affected (>5 files)
- Integration vs unit test requirements

**Decision rule:** When in doubt → choose higher level. Better to over-document than under-document.

### Checklist as Verification Tool (Level 2+)

The `checklist.md` is an **ACTIVE VERIFICATION TOOL**, not passive documentation:

| Priority | Meaning      | Deferral Rules                          |
| -------- | ------------ | --------------------------------------- |
| **P0**   | HARD BLOCKER | MUST complete, cannot defer             |
| **P1**   | Required     | MUST complete OR user-approved deferral |
| **P2**   | Optional     | Can defer without approval              |

**AI Workflow:**
1. Load checklist.md at completion phase
2. Verify items in order: P0 → P1 → P2
3. Mark `[x]` with evidence for each verified item
4. Cannot claim "done" until all P0/P1 items verified

**Evidence formats:**
- `[Test: npm test - all passing]`
- `[File: src/auth.ts:45-67]`
- `[Commit: abc1234]`
- `[Screenshot: evidence/login-works.png]`
- `(verified by manual testing)`
- `(confirmed in browser console)`

**Example checklist entry:**
```markdown
## P0 - Blockers
- [x] Auth flow working [Test: npm run test:auth - 12/12 passing]
- [x] No console errors [Screenshot: evidence/console-clean.png]

## P1 - Required  
- [x] Unit tests added [File: tests/auth.test.ts - 8 new tests]
- [ ] Documentation updated [DEFERRED: Will complete in follow-up PR]
```

### Folder Naming Convention

**Format:** `specs/###-short-name/`

**Rules:**
- 2-3 words (shorter is better)
- Lowercase, hyphen-separated
- Action-noun structure
- 3-digit padding: `001`, `042`, `099` (no padding past 999)

**Good examples:** `fix-typo`, `add-auth`, `mcp-code-mode`, `cli-codex`
**Bad examples:** `new-feature-implementation`, `UpdateUserAuthSystem`, `fix_bug`

**Find next number:**
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

### Sub-Folder Versioning

When reusing spec folders with existing content:
- Trigger: Option A selected + root-level content exists
- Pattern: `001-original/`, `002-new-work/`, `003-another/`
- Memory: Each sub-folder has independent `memory/` directory
- Tracking: Spec folder path passed via CLI argument (stateless)

**Example structure:**
```
specs/007-auth-system/
├── 001-initial-implementation/
│   ├── spec.md
│   ├── plan.md
│   └── memory/
├── 002-oauth-addition/
│   ├── spec.md
│   ├── plan.md
│   └── memory/
└── 003-security-audit/
    ├── spec.md
    └── memory/
```

**Full documentation:** See [sub_folder_versioning.md](./references/sub_folder_versioning.md)

### Context Preservation

**Manual context save (MANDATORY workflow):**
- Trigger: `/memory:save`, "save context", or "save memory"
- **MUST use:** `node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]`
- **NEVER:** Create memory files manually via Write/Edit (AGENTS.md Gate 5)
- Location: `specs/###-folder/memory/`
- Filename: `DD-MM-YY_HH-MM__topic.md` (auto-generated by script)
- Content includes: PROJECT STATE SNAPSHOT with Phase, Last Action, Next Action, Blockers

**Memory File Structure:**
```markdown
<!-- ANCHOR:context -->
## Project Context
[Auto-generated summary of conversation and decisions]
<!-- /ANCHOR:context -->

<!-- ANCHOR:state -->
## Project State Snapshot
- Phase: Implementation
- Last Action: Completed auth middleware
- Next Action: Add unit tests for login flow
- Blockers: None
<!-- /ANCHOR:state -->

<!-- ANCHOR:artifacts -->
## Key Artifacts
- Modified: src/middleware/auth.ts
- Created: src/utils/jwt.ts
<!-- /ANCHOR:artifacts -->
```

### Two-Stage Question Flow

When returning to an active spec folder:

```
STAGE 1: SPEC FOLDER
"Continue in '006-commands' or start fresh?"
  A) Continue in 006-commands
  B) Create new spec folder
  D) Skip documentation

[If A chosen AND memory files exist]

STAGE 2: MEMORY LOADING
"Found 3 previous session files. Load context?"
  A) Load most recent
  B) Load all recent (1-3)
  C) List and select specific
  D) Skip (start fresh)
```

**Key Insight:** "D" means different things:
- Stage 1 "D" = Skip documentation entirely
- Stage 2 "D" = Skip memory loading (stay in spec folder)

**AI Actions by Stage 2 Choice:**
- **A:** Read most recent memory file
- **B:** Read 3 most recent files (parallel)
- **C:** List up to 10 files, wait for selection
- **D:** Proceed without loading context

### Debug Delegation Workflow

**When to Trigger:**
- Manual: `/spec_kit:debug` or "delegate this to a debug agent"
- Auto-suggest when detecting:
  - Same error 3+ times after fix attempts
  - Frustration keywords: "stuck", "can't fix", "tried everything"
  - Extended debugging: >15 minutes with 2+ fix attempts

**Model Selection (MANDATORY - never skip):**

| Model      | Best For                         | Characteristics                |
| ---------- | -------------------------------- | ------------------------------ |
| **Claude** | General debugging, code analysis | Anthropic models (Sonnet/Opus) |
| **Gemini** | Multi-modal, large context       | Google models (Pro/Ultra)      |
| **Codex**  | Code generation, reasoning       | OpenAI models (GPT-4/o1)       |
| **Other**  | User-specified model             | Custom selection               |

**Workflow:**
1. Ask which model to use
2. Generate `debug-delegation.md` with: error category, message, files, attempts, hypothesis
3. Dispatch sub-agent via Task tool
4. Present findings: Apply fix / Iterate / Manual review
5. Update debug-delegation.md with resolution

**Auto-suggestion display:**
```
💡 Debug Delegation Suggested - You've been working on this issue for a while.
Run: /spec_kit:debug
```

### Command Pattern Protocol

Commands in `.opencode/command/**/*.yaml` are **Reference Patterns**:

1. **Scan** available commands for relevance to task
2. **Extract** logic (decision trees), sequencing (order of ops), structure (outputs)
3. **Adapt** if <80% match; apply directly if >80%
4. **Report** contributions in `implementation-summary.md`

> **Exception:** Explicitly invoked commands (e.g., `/spec_kit:complete`) are **ENFORCED LAW**, not just reference.

### Parallel Dispatch Configuration

SpecKit supports smart parallel sub-agent dispatch based on 5-dimension complexity scoring:
- **<20% complexity:** Proceed directly
- **≥20% + 2 domains:** Ask user for dispatch preference
- **Step 6 Planning:** Auto-dispatches 4 parallel exploration agents

**Full configuration:** See [parallel_dispatch_config.md](./assets/parallel_dispatch_config.md)

---

## 4. 📏 RULES

### ALWAYS

1. **Determine level (1/2/3) before ANY file changes** - Count LOC, assess complexity/risk
2. **Copy templates from `templates/`** - NEVER create from scratch
3. **Fill ALL placeholders** - Remove `[PLACEHOLDER]` and sample content
4. **Ask A/B/C/D when file modification detected** - Present options, wait for selection
5. **Check for related specs before creating new folders** - Search keywords, review status
6. **Get explicit user approval before changes** - Show level, path, templates, approach
7. **Use consistent folder naming** - `specs/###-short-name/` format
8. **Use checklist.md to verify (Level 2+)** - Load before claiming done
9. **Mark items `[x]` with evidence** - Include links, test outputs, screenshots
10. **Complete P0/P1 before claiming done** - No exceptions
11. **Suggest handover.md on session-end keywords** - "continue later", "next session"
12. **Run validate-spec.sh before completion** - Gate 6 requirement

### NEVER

1. **Create documentation from scratch** - Use templates only
2. **Skip spec folder creation** - Unless user explicitly selects D
3. **Make changes before spec + approval** - Spec folder is prerequisite
4. **Leave placeholders in final docs** - All must be replaced
5. **Decide autonomously update vs create** - Always ask user
6. **Claim done without checklist verification** - Level 2+ requirement
7. **Proceed without spec folder confirmation** - Wait for A/B/C/D
8. **Skip validation before completion** - Gate 6 hard block

### ESCALATE IF

1. **Scope grows during implementation** - Add higher-level templates, document change in changelog
2. **Uncertainty about level <80%** - Present level options to user, default to higher
3. **Template doesn't fit requirements** - Adapt closest template, document modifications
4. **User requests skip (Option D)** - Warn about tech debt, explain debugging challenges, confirm consent
5. **Validation fails with errors** - Report specific failures, provide fix guidance, re-run after fixes

---

## 5. ✅ VALIDATION

### Overview

`validate-spec.sh` provides automated validation of spec folder contents based on documentation level.

**Location:** `.opencode/skill/system-spec-kit/scripts/validate-spec.sh`

### Usage

```bash
./validate-spec.sh <folder-path>              # Basic validation
./validate-spec.sh <folder-path> --json       # JSON output for tooling
./validate-spec.sh <folder-path> --strict     # Warnings as errors
./validate-spec.sh <folder-path> --verbose    # Detailed output with timing
./validate-spec.sh <folder-path> --quiet      # Exit code only
```

### Exit Codes

| Code | Meaning                         | Action                       |
| ---- | ------------------------------- | ---------------------------- |
| 0    | Passed (no errors, no warnings) | Proceed with completion      |
| 1    | Passed with warnings            | Address or document warnings |
| 2    | Failed (errors found)           | MUST fix before completion   |

### Validation Rules

| Rule                 | Severity | Description                      |
| -------------------- | -------- | -------------------------------- |
| `FILE_EXISTS`        | ERROR    | Required files present for level |
| `PLACEHOLDER_FILLED` | ERROR    | No unfilled `[YOUR_VALUE_HERE:]` |
| `SECTIONS_PRESENT`   | WARN     | Required markdown sections exist |
| `LEVEL_DECLARED`     | INFO     | Level in spec.md metadata        |
| `PRIORITY_TAGS`      | WARN     | P0/P1/P2 on checklist items      |
| `EVIDENCE_CITED`     | WARN     | Completed P0/P1 cite evidence    |
| `ANCHORS_VALID`      | ERROR    | Memory anchor pairs matched      |

### Quick Fixes

| Issue                | Fix Command/Action                                               |
| -------------------- | ---------------------------------------------------------------- |
| Missing file         | `cp templates/spec.md specs/007-feature/`                        |
| Unfilled placeholder | Replace `[YOUR_VALUE_HERE: description]` with actual content     |
| Missing section      | Add `## Section Name` header to file                             |
| No level declared    | Add `\| **Level** \| 2 \|` to spec.md metadata table             |
| No priority context  | Add `## P0` headers or `[P1]` inline tags to checklist           |
| Missing evidence     | Add `[Test: npm test - 15/15 passing]` to completed items        |
| Unclosed anchor      | Add `<!-- /ANCHOR:id -->` closing tag                            |
| Mismatched anchor    | Ensure opening/closing anchor IDs match exactly (case-sensitive) |

**Detailed rule documentation:** See [validation_rules.md](./references/validation_rules.md)

### Gate 6 Integration

Before claiming "done":
1. Run: `.opencode/skill/system-spec-kit/scripts/validate-spec.sh <spec-folder>`
2. Exit 2 (errors) → FIX the issues
3. Exit 1 (warnings) → ADDRESS or DOCUMENT
4. Exit 0 (pass) → Proceed with completion claim
5. Also verify checklist.md items manually

### Configuration

Override defaults via `.speckit.yaml` (in spec folder or project root):

```yaml
validation:
  rules:
    FILE_EXISTS: error        # error | warn | info | skip
    PLACEHOLDER_FILLED: error
    SECTIONS_PRESENT: warn
    LEVEL_DECLARED: info
    PRIORITY_TAGS: warn
    EVIDENCE_CITED: warn
    ANCHORS_VALID: error
  skip:
    - "**/scratch/**"
    - "**/memory/**"
    - "**/templates/**"
  rule_order:              # Optional custom execution order
    - FILE_EXISTS
    - LEVEL_DECLARED
    - SECTIONS_PRESENT
```

**Priority:** CLI args > Environment vars > Config file > Defaults

### Environment Variables

| Variable             | Default | Description                       |
| -------------------- | ------- | --------------------------------- |
| `SPECKIT_VALIDATION` | true    | Set to `false` to skip validation |
| `SPECKIT_STRICT`     | false   | Set to `true` to fail on warnings |
| `SPECKIT_JSON`       | false   | Set to `true` for JSON output     |
| `SPECKIT_VERBOSE`    | false   | Set to `true` for verbose output  |

### Troubleshooting

| Problem                     | Cause                     | Solution                                |
| --------------------------- | ------------------------- | --------------------------------------- |
| "Folder not found"          | Path incorrect            | Use absolute or correct relative path   |
| False placeholder positives | Placeholder in code block | Move to `scratch/` or wrap in backticks |
| Section not detected        | Wrong header format       | Use `##` or `###`, check spelling       |
| Level detection wrong       | Missing metadata          | Add explicit `\| **Level** \| N \|` row |

---

## 6. 🏆 SUCCESS CRITERIA

### Documentation Created

- [ ] Spec folder exists at `specs/###-short-name/`
- [ ] Folder name follows convention (2-3 words, lowercase, hyphen-separated)
- [ ] Number is sequential (no gaps or duplicates)
- [ ] Correct level templates copied (not created from scratch)
- [ ] All placeholders replaced with actual content
- [ ] Sample content and instructional comments removed
- [ ] Cross-references to sibling documents work (spec.md ↔ plan.md ↔ tasks.md)

### User Approval

- [ ] Asked user for A/B/C/D choice when file modification detected
- [ ] Documentation level presented with rationale
- [ ] Spec folder path shown before creation
- [ ] Templates to be used listed
- [ ] Explicit approval ("yes", "go ahead", "proceed") received before file changes

### Context Preservation

- [ ] Context saved via `generate-context.js` script (NEVER manual Write/Edit)
- [ ] Memory files contain PROJECT STATE SNAPSHOT section
- [ ] Manual saves triggered via `/memory:save` or keywords
- [ ] Anchor pairs properly formatted and closed

### Checklist Verification (Level 2+)

- [ ] Loaded checklist.md before claiming completion
- [ ] Verified items in priority order (P0 → P1 → P2)
- [ ] All P0 items marked `[x]` with evidence
- [ ] All P1 items marked `[x]` with evidence
- [ ] P2 items either verified or deferred with documented reason
- [ ] No unchecked P0/P1 items remain

### Validation Passed

- [ ] Ran `validate-spec.sh` on spec folder
- [ ] Exit code is 0 (pass) or 1 (warnings only)
- [ ] All ERROR-level issues resolved
- [ ] WARNING-level issues addressed or documented

---

## 7. 🔗 INTEGRATION POINTS

### Priority System

| Priority | Level    | Deferral                                 |
| -------- | -------- | ---------------------------------------- |
| **P0**   | Blocker  | Cannot proceed without resolution        |
| **P1**   | Warning  | Must address or defer with user approval |
| **P2**   | Optional | Can defer without approval               |

### Validation Triggers

- **AGENTS.md Gate 3** → Validates spec folder existence and template completeness
- **AGENTS.md Gate 6** → Runs validate-spec.sh before completion claims
- **Manual `/memory:save`** → Context preservation on demand
- **Template validation** → Checks placeholder removal and required field completion

### Related Skills

| Direction      | Skill                   | Integration                                        |
| -------------- | ----------------------- | -------------------------------------------------- |
| **Upstream**   | None                    | This is the foundational workflow                  |
| **Downstream** | workflows-code          | Uses spec folders for implementation tracking      |
| **Downstream** | workflows-git           | References spec folders in commit messages and PRs |
| **Downstream** | workflows-documentation | Validates spec folder documentation quality        |
| **Downstream** | system-memory           | Saves conversation context to spec/memory/         |

### Cross-Skill Workflows

**Spec Folder → Implementation:**
```
system-spec-kit (creates spec folder)
    → workflows-code (implements from spec + plan)
    → workflows-git (commits with spec reference)
    → system-memory (preserves conversation to spec/memory/)
```

**Documentation Quality:**
```
system-spec-kit (creates spec documentation)
    → workflows-documentation (validates structure, scores quality)
    → Feedback loop: Iterate if scores <90
```

**Validation Workflow:**
```
Implementation complete
    → validate-spec.sh (automated checks)
    → Fix ERROR-level issues
    → Address WARNING-level issues
    → Claim completion with confidence
```

### External Dependencies

| Resource       | Location                                                    | Purpose                   |
| -------------- | ----------------------------------------------------------- | ------------------------- |
| Templates (12) | `templates/`                                                | All spec folder templates |
| Validation     | `scripts/validate-spec.sh`                                  | Automated validation      |
| Gates          | `AGENTS.md` Section 2                                       | Gate definitions          |
| Memory gen     | `.opencode/skill/system-memory/scripts/generate-context.js` | Memory file creation      |

### Common Failure Patterns

| Pattern                       | Trigger                                 | Prevention                                |
| ----------------------------- | --------------------------------------- | ----------------------------------------- |
| Skip Gate 3 on exciting tasks | "comprehensive", "fix all", "15 agents" | STOP → Ask spec folder → Wait for A/B/C/D |
| Rush to code                  | "straightforward", "simple fix"         | Analyze → Verify → Simplest solution      |
| Create docs from scratch      | Time pressure                           | Always copy from templates/               |
| Skip checklist verification   | "trivial edit"                          | Load checklist.md, verify ALL items       |
| Manual memory file creation   | "quick save"                            | MUST use generate-context.js script       |
| Autonomous update vs create   | "obvious choice"                        | Always ask user for A/B/C/D               |

### Quick Reference Commands

**Create new spec folder:**
```bash
.opencode/skill/system-spec-kit/scripts/create-spec-folder.sh 007-feature-name 2
```

**Validate spec folder:**
```bash
.opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/007-feature/
```

**Save context:**
```bash
node .opencode/skill/system-memory/scripts/generate-context.js specs/007-feature/
```

**Find next spec number:**
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```

**Calculate documentation completeness:**
```bash
.opencode/skill/system-spec-kit/scripts/calculate-completeness.sh specs/007-feature/
```

---

**Remember**: This skill is the foundational documentation orchestrator. It enforces structure, template usage, context preservation, and validation for all file modifications. Every conversation that modifies files MUST have a spec folder.