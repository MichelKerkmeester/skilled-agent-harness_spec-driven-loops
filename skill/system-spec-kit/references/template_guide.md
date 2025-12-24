# Template Guide - Template Selection, Adaptation & Quality Standards

> Comprehensive guide to template selection, copying, adaptation, and quality standards using the progressive enhancement model.

**Progressive Enhancement Model:**
```
Level 1 (Baseline):     spec.md + plan.md + tasks.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research.md
```

---

## 1. 💡 TEMPLATE PHILOSOPHY

### Core Principles

1. **Never create from scratch** - Always copy from `.opencode/skill/system-spec-kit/templates/`
2. **Always adapt to feature** - Templates are starting points, not final documents
3. **Preserve structure** - Maintain numbering, emojis, and section organization
4. **Remove placeholders** - Replace ALL `[PLACEHOLDER]` text with actual content
5. **Delete samples** - Remove `<!-- SAMPLE CONTENT -->` blocks before delivery

### Why Templates Matter

**Without templates:**
- Inconsistent documentation structure
- Missing critical sections
- Ad-hoc format that's hard to navigate
- Wasted time deciding what to document

**With templates:**
- Consistent structure across all specs
- Complete coverage (no forgotten sections)
- Easy to scan and find information
- Faster documentation creation

---

## 2. 🎯 TEMPLATE SELECTION BY LEVEL (Progressive Enhancement)

### Level 1: Baseline Documentation (LOC guidance: <100)

**Required Templates:** `spec.md` + `plan.md` + `tasks.md`

**Copy commands:**
```bash
cp .opencode/skill/system-spec-kit/templates/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/tasks.md specs/###-name/tasks.md
```

**When to use:**
- **All features start here** - this is the minimum documentation
- <100 LOC (soft guidance)
- Localized to one component or trivial changes
- Clear requirements
- Low to moderate complexity

**spec.md sections to fill:**
- Metadata block (created, status, level, LOC estimate)
- Problem statement
- Proposed solution
- Files to change
- Testing approach
- Success criteria

**plan.md sections to fill:**
- Implementation approach
- File changes breakdown
- Testing strategy
- Dependencies

**tasks.md sections to fill:**
- Task breakdown by user story
- Dependencies between tasks
- Estimated effort per task

**Adaptation tips:**
- Keep problem statement focused and specific
- For trivial changes (typos, single-line fixes), keep spec concise
- Proposed solution should be clear and actionable
- List specific files (not just "various files")
- Testing approach should match scope (unit tests? manual verification?)
- Success criteria should be measurable

**Enforcement:** Hard block if any required file missing

---

### Level 2: Verification Added (LOC guidance: 100-499)

**Required Templates:** Level 1 + `checklist.md`

**Copy commands:**
```bash
# First copy all Level 1 files, then add:
cp .opencode/skill/system-spec-kit/templates/checklist.md specs/###-name/checklist.md
```

**When to use:**
- Features needing systematic QA validation
- 100-499 LOC (soft guidance)
- Multiple files/components
- Moderate complexity
- High risk areas (security, config cascades)

**All Level 1 sections PLUS:**

**checklist.md sections to fill:**
- Pre-implementation checks
- Implementation validation
- Testing checklist
- Deployment verification
- Security checks (if applicable)

**Adaptation tips:**
- All Level 1 tips apply
- Make checklist specific to feature (not generic)
- Include edge cases and error scenarios
- Add security checks if relevant
- Include rollback verification

**Enforcement:** Hard block if `checklist.md` missing

---

### Level 3: Full Documentation (LOC guidance: >=500)

**Required Templates:** Level 2 + `decision-record.md`

**Copy commands:**
```bash
# First copy all Level 2 files, then add:
cp .opencode/skill/system-spec-kit/templates/decision-record.md specs/###-name/decision-record-[topic].md
```

**Optional Templates:**
```bash
cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md
```

**When to use:**
- Complex features, architecture changes, major decisions
- >=500 LOC (soft guidance)
- Multiple systems involved
- Significant architectural impact
- Major technical decisions need documentation

**All Level 2 sections PLUS:**

**decision-record-[topic].md sections to fill:**
- Context and problem
- Options considered (2-4 typically)
- Decision made
- Rationale
- Consequences and trade-offs

**Adaptation tips:**
- All Level 2 tips apply
- Present 2-4 viable options (not every possible choice)
- Fair comparison (pros/cons for each)
- Clear decision with rationale
- Document trade-offs honestly
- Note what was sacrificed for chosen path

**Enforcement:** Hard block if `decision-record.md` missing

---

## 3. 📐 TEMPLATE STRUCTURE STANDARDS

### 1. Numbered H2 Sections

**Format:** `## N. EMOJI TITLE`

**Example:**
```markdown
## 1. 🎯 OBJECTIVE
## 2. 📊 SCOPE
## 3. 🛠️ IMPLEMENTATION
```

**Rules:**
- Keep numbering sequential (1, 2, 3, ...)
- Never remove emojis (they provide visual scanning cues)
- Use ALL CAPS for section titles
- Maintain consistent spacing

### 2. Metadata Block

**Level 1 metadata:**
```markdown
---
created: 2025-11-23
status: active
level: 1
estimated_loc: 85
complexity: low
---
```

**Level 2/3 metadata:**
```markdown
---
title: Feature Name
category: Implementation
tags: [feature, authentication, security]
priority: P1
status: active
created: 2025-11-23
level: 2
estimated_loc: 350
---
```

### 3. Placeholder Conventions

**Placeholder types:**

- `[PLACEHOLDER]` - **MUST** be replaced with actual content
- `[NEEDS CLARIFICATION: ...]` - Unknown requirement (flag for user)
- `<!-- SAMPLE CONTENT -->` - Remove before delivery

**Example before adaptation:**
```markdown
## Problem

[PLACEHOLDER: Describe the problem this solves]

<!-- SAMPLE CONTENT
The form submission button doesn't show loading state, causing users to
double-click and submit forms multiple times.
-->
```

**Example after adaptation:**
```markdown
## Problem

The form submission button doesn't show loading state, causing users to
double-click and submit forms multiple times. Analytics show 23% of form
submissions are duplicates.
```

### 4. Template Footer

**Appears at bottom of template:**
```html
<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
  - Remove this footer before delivery
-->
```

**Action:** Delete this footer after filling template

---

## 4. 🔄 TEMPLATE ADAPTATION PROCESS

### Step-by-Step Adaptation

**Step 1: Copy Template**
```bash
cp .opencode/skill/system-spec-kit/templates/[template].md specs/###-name/[target].md
```

**Step 2: Fill Metadata Block**
- Set created date (today)
- Set status (usually "draft" or "active")
- Set level (0/1/2/3)
- Set estimated LOC
- Add other metadata as needed

**Step 3: Replace ALL Placeholders**
- Search for `[PLACEHOLDER]`
- Replace with actual content
- Verify no placeholders remain

**Step 4: Review Sample Content**
- Search for `<!-- SAMPLE CONTENT -->`
- Read sample for context
- Write actual content
- Delete sample blocks

**Step 5: Fill All Sections**
- Go section by section
- Replace generic text with specifics
- Keep sections relevant (use "N/A" if not applicable)
- Don't delete sections (maintain structure)

**Step 6: Cross-Reference Sibling Docs**
- Link spec.md ↔ plan.md
- Link plan.md ↔ tasks.md
- Link to decision records and research documents
- Create navigation between documents

**Step 7: Delete Instructional Content**
- Remove template footer
- Remove instructional comments
- Remove sample blocks
- Keep only actual content

**Step 8: Final Review**
- No placeholders remain
- All sections filled with actual content
- Cross-references working
- Metadata accurate
- Structure preserved

---

## 5. 📦 SUPPORTING TEMPLATES

### research.md - Comprehensive Feature Research

**When to use:** Before implementation for complex features requiring deep technical investigation

**Purpose:** Comprehensive research documentation spanning multiple technical areas

**Template:** `research.md`

**Copy command:**
```bash
cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md
```

**Sections to fill:**
- Investigation report (request summary, current behavior, findings, recommendations)
- Executive overview (summary, architecture diagram, quick reference)
- Core architecture (components, data flow, integration points, dependencies)
- Technical specifications (API docs, attributes, events, state management)
- Constraints & limitations (platform, security, performance, compatibility)
- Integration patterns (third-party services, auth, error handling, retries)
- Implementation guide (markup, JavaScript, CSS, configuration)
- Code examples & snippets (initialization, helpers, API usage, edge cases)
- Testing & debugging (strategies, E2E examples, diagnostic tools)
- Performance optimization (tactics, benchmarks, caching)
- Security considerations (validation, data protection, auth)
- Maintenance & future-proofing (upgrades, compatibility, SPA support)
- API reference (attributes table, methods, events, cleanup)
- Troubleshooting guide (common issues, error messages, solutions)

**Adaptation tips:**
- Use for larger research efforts spanning multiple areas
- Serves as authoritative reference during implementation
- Remove N/A sections or mark clearly as not applicable
- Consider creating decision-record-*.md for significant technical choices discovered during research

---

### tasks.md - Task Breakdown

**When to use:** After plan.md, before coding

**Purpose:** Break implementation plan into actionable tasks

**Template:** `tasks.md`

**Copy command:**
```bash
cp .opencode/skill/system-spec-kit/templates/tasks.md specs/###-name/tasks.md
```

**Sections to fill:**
- Task list (ordered by dependencies)
- Estimated effort per task
- Dependencies between tasks
- Task ownership (if multi-person)

**Adaptation tips:**
- Each task should be completable in <1 day
- Clear dependencies (Task 2 requires Task 1)
- Specific and actionable ("Add email validation" not "Fix form")

---

### checklist.md - Validation Checklist

**When to use:** When systematic validation needed

**Purpose:** QA steps, deployment checks, security review

**Template:** `checklist.md`

**Copy command:**
```bash
cp .opencode/skill/system-spec-kit/templates/checklist.md specs/###-name/checklist.md
```

**Sections to fill:**
- Pre-implementation checks
- Implementation validation
- Testing checklist
- Deployment verification

**Adaptation tips:**
- Make checklist specific to feature (not generic)
- Include edge cases and error scenarios
- Add security checks if relevant
- Include rollback verification

---

### decision-record-[name].md - Architecture Decision Record (ADR)

**When to use:** Major technical decisions

**Purpose:** Document significant choices with rationale

**Template:** `decision-record.md`

**Copy command:**
```bash
cp .opencode/skill/system-spec-kit/templates/decision-record.md specs/###-name/decision-record-[topic].md
```

**Use descriptive name:** `decision-record-database.md`, `decision-record-auth-library.md`

**Sections to fill:**
- Context and problem
- Options considered (2-4 typically)
- Decision made
- Rationale
- Consequences and trade-offs

**Adaptation tips:**
- Present 2-4 viable options (not every possible choice)
- Fair comparison (pros/cons for each)
- Clear decision with rationale
- Document trade-offs honestly
- Note what was sacrificed for chosen path

**When to create:**
- Database or framework choice
- Architectural pattern selection
- Library/tool selection
- Infrastructure/deployment strategy
- Major refactoring approach

---

## 6. 📋 SESSION MANAGEMENT TEMPLATES

These templates support session continuity, temporary workspaces, and context preservation.

### handover.md - Full Session Handover

**When to use:** End of complex work sessions requiring comprehensive context transfer

**Purpose:** Comprehensive session handover document for complex, multi-phase work

**Created by:** `/spec_kit:handover:full` command

**Location:** Spec folder root

**Copy command:**
```bash
cp .opencode/skill/system-spec-kit/templates/handover.md specs/###-name/handover.md
```

**Sections to fill:**
- Session summary (what was accomplished)
- Current state (where things stand)
- Key decisions made (with rationale)
- Blockers and open questions
- Next steps (prioritized)
- Files modified (with change descriptions)
- Context needed for continuation

**Adaptation tips:**
- Be thorough - future sessions depend on this context
- Document decisions even if they seem obvious now
- List specific blockers with attempted solutions
- Prioritize next steps (what's most important first)
- Include links to relevant files and line numbers

**Size:** ~100-150 lines (comprehensive)

---

### Scratch Folder (Not a Template)

The `scratch/` folder is a directory for temporary, disposable files - NOT a template file.

**Usage:**
- Place debug logs, test scripts, prototypes in `scratch/`
- Files in scratch/ are gitignored and disposable
- Clean up scratch/ contents when done

**Location:** `specs/###-name/scratch/` subfolder (NEVER in spec root)

**Creation:**
```bash
mkdir -p specs/###-name/scratch
# Create ad-hoc files as needed - no formal template
```

**Example contents (informal, ad-hoc):**
- Debug output and logs
- Test results (temporary)
- Ideas and notes to self
- Command history
- Temporary findings

**Note:** There is no `scratch-notes.md` template. Create ad-hoc files in the scratch/ folder as needed.

**Cleanup rule:** Delete or archive `scratch/` contents when task completes. Move valuable findings to `memory/` before cleanup.

---

### Memory Files (Auto-Generated)

Memory files in the `memory/` folder are NOT created from templates. They are auto-generated by the `generate-context.js` script.

**Creation:** `node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]`

**Format:** `DD-MM-YY_HH-MM__topic.md` (auto-generated filename)

**Location:** `specs/###-name/memory/` subfolder

**Example creation:**
```bash
node .opencode/skill/system-memory/scripts/generate-context.js specs/007-feature
```

**Sections (auto-generated with ANCHOR format):**
- Context summary
- Key decisions with rationale
- Blockers and attempted solutions
- Session state snapshot
- Related files and references

**IMPORTANT:**
- **NEVER create memory files manually** - always use `generate-context.js`
- Files are auto-indexed by semantic memory system
- ANCHOR format enables semantic search retrieval
- Manual creation bypasses indexing and loses searchability

**Note:** Never manually create memory files using Write/Edit tools. Always use the generate-context.js script per AGENTS.md Gate 5.

---

### debug-delegation.md - Debug Task Delegation

**Purpose:** Structured handoff document for delegating debugging tasks to a specialized sub-agent.

**Created By:** `/spec_kit:debug` command (or manually)

**Location:** Spec folder root (preserved for reference)

**When to Use:**
- Stuck on same error after 3+ fix attempts
- Complex multi-file debugging
- Need fresh perspective on persistent issue
- Architectural or logic-heavy debugging

**Workflow:**

```
1. TRIGGER
   ├── Manual: Run /spec_kit:debug
   └── Auto-suggested: After repeated failures or frustration keywords

2. MODEL SELECTION (MANDATORY)
   ├── Claude - Anthropic (Sonnet/Opus)
   ├── Gemini - Google (Pro/Ultra)
   ├── Codex - OpenAI (GPT-4/o1)
   └── Other - User specified

3. REPORT GENERATION
   ├── Error details captured
   ├── Previous attempts documented
   ├── Relevant code extracted
   └── Hypothesis recorded

4. SUB-AGENT DISPATCH
   ├── Task tool invoked
   ├── Full context passed
   └── Parallel execution

5. INTEGRATION
   ├── Findings presented
   ├── Fix proposed
   └── User decides: Apply/Iterate/Manual
```

**Template Sections:**

| Section | Purpose |
|---------|---------|
| Problem Summary | Error category, message, affected files |
| Attempted Fixes | Document what was tried and why it failed |
| Context for Specialist | Code snippets, docs, hypothesis |
| Recommended Next Steps | Suggestions for the debugging agent |
| Handoff Checklist | Verification that context is complete |

**Model Selection Guidance:**

| Scenario | Recommended Model |
|----------|-------------------|
| Common error patterns | Claude |
| Type errors, syntax issues | Claude |
| Architectural problems | Claude |
| Complex state management | Claude |
| Logic puzzles, algorithms | Codex |
| Large codebase context | Gemini |

**Example Usage:**

```bash
# Manual trigger
/spec_kit:debug specs/007-feature/

# Auto-suggested after repeated failures
💡 Debug Delegation Suggested - Run: /spec_kit:debug
```

**Integration with SpecKit:**
- Saved to spec folder root for reference
- Can be loaded in future sessions via memory
- Documents debugging history for the feature

---

## 7. ✅ QUALITY STANDARDS

### Adherence Rules

**Non-negotiable:**

1. **Always copy from `.opencode/skill/system-spec-kit/templates/`** - Never freehand
2. **Preserve numbering and emojis** - Maintain visual scanning pattern
3. **Fill every placeholder** - Replace `[PLACEHOLDER]` with actual content
4. **Remove instructional comments** - Delete `<!-- SAMPLE -->` blocks
5. **Use descriptive filenames** - `decision-record-[topic].md`, not `decision-record-final.md`
6. **Keep sections relevant** - State "N/A" instead of deleting sections
7. **Link sibling documents** - Cross-reference spec.md ↔ plan.md ↔ tasks.md
8. **Document level changes** - Note upgrades/downgrades in changelog
9. **Keep history immutable** - Append to history, don't rewrite
10. **Validate before coding** - Complete pre-implementation checklist first

### Pre-Delivery Checklist

Before presenting documentation to user, verify:

- [ ] All templates copied from `.opencode/skill/system-spec-kit/templates/` (not created from scratch)
- [ ] All placeholders replaced (`[PLACEHOLDER]`, `[NEEDS CLARIFICATION: ...]`)
- [ ] All sample content removed (`<!-- SAMPLE CONTENT -->`)
- [ ] Template footer deleted
- [ ] Metadata block filled correctly
- [ ] All sections filled with actual content (or marked "N/A")
- [ ] Cross-references to sibling documents working
- [ ] Numbering and emojis preserved
- [ ] Structure matches template
- [ ] Descriptive filenames used (for decision records)

**If ANY unchecked → Fix before presenting to user**

---

## 8. ⚠️ COMMON MISTAKES

### Mistake 1: Creating from Scratch

**Wrong:**
```bash
echo "# Spec" > specs/042-feature/spec.md
```

**Right:**
```bash
cp .opencode/skill/system-spec-kit/templates/spec.md specs/042-feature/spec.md
```

**Why wrong:** Loses structure, misses sections, inconsistent format

---

### Mistake 2: Leaving Placeholders

**Wrong:**
```markdown
## Problem

[PLACEHOLDER: Describe the problem]
```

**Right:**
```markdown
## Problem

The form submission button doesn't show loading state, causing duplicate submissions.
```

**Why wrong:** Template not adapted, incomplete documentation

---

### Mistake 3: Deleting "Irrelevant" Sections

**Wrong:**
```markdown
## 1. OBJECTIVE
[...]

## 3. IMPLEMENTATION
[...]
```

**Right:**
```markdown
## 1. OBJECTIVE
[...]

## 2. SCOPE
N/A - Single file change, no scope considerations

## 3. IMPLEMENTATION
[...]
```

**Why wrong:** Breaks structure, loses numbering, unclear if section was forgotten or intentionally skipped

---

### Mistake 4: Generic Filenames

**Wrong:**
```bash
decision-record-final.md
```

**Right:**
```bash
decision-record-database-choice.md
```

**Why wrong:** Not descriptive, unclear what decision is about

---

### Mistake 5: Skipping Cross-References

**Wrong:**
spec.md and plan.md exist but don't reference each other

**Right:**
```markdown
<!-- In spec.md -->
**Implementation Plan**: See [plan.md](plan.md) for detailed approach

<!-- In plan.md -->
**Requirements**: See [spec.md](spec.md) for complete specification
```

**Why wrong:** Documents feel disconnected, harder to navigate

---

## 9. 🔧 TROUBLESHOOTING

### "I don't know what to put in this section"

**Solutions:**
- If truly not applicable → Mark "N/A" with brief reason
- If uncertain → Flag `[NEEDS CLARIFICATION: ...]` and ask user
- If blocked → Create research document to research and inform decision

### "Template doesn't fit my feature"

**Solutions:**
- Use closest template as starting point
- Adapt structure to fit (add subsections if needed)
- Document modifications in changelog
- Consider creating custom template for future use (consult user first)

### "Should I include this in spec or plan?"

**Rule of thumb:**
- **spec.md** = WHAT and WHY (requirements, rationale, alternatives)
- **plan.md** = HOW and WHEN (implementation steps, timeline, approach)

**Example:**
- "We need authentication" → spec.md
- "We'll use OAuth 2.0" → spec.md (technical approach)
- "Step 1: Install passport.js, Step 2: Configure routes..." → plan.md

---

## 10. 🗂️ USING SUB-FOLDERS FOR ORGANIZATION

There are **two distinct sub-folder systems**:

### 9.1 Automatic Sub-Folder Versioning (Workflow-Triggered)

**Triggered when:** User selects Option A to reuse existing spec folder with root-level content.

**How it works:**
1. Workflow detects existing spec.md/plan.md at root level
2. Prompts user for new sub-folder name (lowercase, hyphens, 2-3 words)
3. Automatically creates numbered archive: `001-original-work/`
4. Creates new numbered sub-folder: `002-{user-name}/`
5. Spec folder path passed via CLI argument (stateless - no marker file)
6. Each sub-folder gets independent `memory/` context

**Example:**
```
specs/122-skill-standardization/
├── 001-original-work/  (auto-archived)
│   ├── spec.md
│   └── plan.md
├── 002-api-refactor/   (completed)
│   └── ...
└── 003-bug-fixes/      (current work - path passed via CLI)
    ├── spec.md
    ├── plan.md
    └── memory/
```

**See:** `system-spec-kit SKILL.md` Section 3.4 for full versioning workflow.

### 9.2 Manual Sub-Folders for Organization

Create sub-folders **manually** within spec folders when:
- **Complex umbrella projects** require organizing multiple related work streams
- **Parallel work** on different components of the same feature
- **Iterative analysis** needs separate workspace (e.g., alignment work, research phases)
- **Keeping related artifacts together** under a parent spec

### Sub-Folder Structure Pattern

```
specs/###-parent-feature/
  spec.md              # Parent feature specification
  plan.md              # Overall implementation plan
  README.md            # Optional: Parent overview (if sub-folders exist)

  sub-analysis-1/
    README.md          # Sub-folder purpose and organization
    analysis.md        # Specific analysis work
    findings.md        # Results and conclusions

  sub-implementation-2/
    README.md          # Sub-folder purpose and organization
    component-spec.md  # Component-specific specification
    testing-plan.md    # Component-specific testing

  memory/              # Created by manual context save (/memory/save)
    YYYY-MM-DD_HH-MM__context-name.md
    metadata.json
```

### Creating a Sub-Folder

**1. Determine if sub-folder is appropriate:**
- Does this work relate to a larger feature? (Use sub-folder)
- Is this independent work? (Create new top-level spec folder)

**2. Create sub-folder with descriptive name:**
```bash
# Example: Analysis work for skill standardization
mkdir -p specs/122-skill-standardization/spec-enforcement-improvements
```

**3. Create README.md:**
- Document the sub-folder's purpose
- Link to parent spec
- Explain organization and structure

**4. Fill out the README:**
- Parent spec reference (link to `../spec.md` or parent folder)
- Sub-folder purpose and scope
- Key documents and their roles
- Status and progress tracking
- References to related sub-folders (if applicable)

### Sub-Folder Naming Conventions

- **Lowercase with hyphens:** `spec-enforcement-improvements`, `cli-codex-alignment`
- **Descriptive:** Clearly indicates the sub-folder's purpose
- **Consistent with sibling folders:** Follow established patterns in the parent spec
- **Avoid generic names:** `analysis`, `work` (too vague)
- **Use specific names:** `api-integration-analysis`, `performance-optimization-work`

### Real-World Example

**Parent Spec:** `specs/122-skill-standardization/`
**Purpose:** Standardize all skills across the project

**Sub-Folders:**
```
specs/122-skill-standardization/
  cli-codex-alignment/
    README.md           # Purpose: Align cli-codex skill with standards
    analysis.md         # Current state analysis
    changes_summary.md  # Changes needed
    validation_report.md # Post-change validation

  cli-gemini-alignment/
    README.md           # Purpose: Align cli-gemini skill with standards
    analysis.md
    changes_summary.md
    validation_report.md

  spec-enforcement-improvements/
    README.md           # Purpose: Improve spec folder template enforcement
    spec.md             # Feature specification (Level 2)
    plan.md             # Implementation plan
    validation_rules.md # Detailed validation logic
    testing_checklist.md # Test procedures
```

**Benefits of this organization:**
- Clear separation of concerns (each skill gets own sub-folder)
- Consistent structure across sub-folders
- Easy navigation with README files
- Parent spec ties everything together
- Can work on sub-folders in parallel

### When NOT to Use Sub-Folders

**Create a new top-level spec folder instead when:**
- Work is independent from existing specs
- Feature doesn't relate to an umbrella project
- Sub-folder would have only 1-2 files (overkill for organization)
- Work deserves its own spec number for tracking

**Use the parent spec folder directly when:**
- Simple feature with 2-5 related files
- No need for additional organization
- All work fits naturally in flat structure

### Sub-Folder Validation

The enforce-spec-folder workflow includes sub-folder detection:
- **Automatic suggestion:** When working in a sub-folder without README
- **Template recommendation:** Suggests creating a README.md to document the sub-folder
- **Non-blocking:** Suggestion only, not enforced
- **Skips memory/ folder:** No README needed for auto-generated context

### Best Practices

1. **Always create README first** - Documents purpose before diving into work
2. **Link to parent spec** - Maintain traceability with `../spec.md` references
3. **Use consistent naming** - Follow patterns established in parent or sibling sub-folders
4. **Update parent README** - If parent has README, list sub-folders there
5. **Keep sub-folders focused** - One clear purpose per sub-folder
6. **Clean up when complete** - Consider archiving or consolidating after work is done

### Integration with Parent Spec

**In parent spec.md:**
```markdown
## Related Work

This feature includes work organized in sub-folders:
- `spec-enforcement-improvements/` - Template structure validation enhancements
- `template-marker-system/` - Template source tracking implementation
- `hybrid-validation/` - Existing vs new spec folder validation

See each sub-folder's README.md for details.
```

**In sub-folder README.md:**
```markdown
## Parent Spec

- **Parent**: [Skill Standardization](../spec.md)
- **Related Sub-Folders**:
  - [template-marker-system](../template-marker-system/)
  - [hybrid-validation](../hybrid-validation/)
```

---

## 11. 🔗 RELATED RESOURCES

### Reference Files
- [quick_reference.md](./quick_reference.md) - Commands, checklists, and troubleshooting
- [level_specifications.md](./level_specifications.md) - Complete Level 1-3 requirements and migration
- [path_scoped_rules.md](./path_scoped_rules.md) - Path-scoped validation rules reference

### Templates

**Core Templates (Progressive Enhancement):**
- [spec.md](../templates/spec.md) - Requirements and user stories template
- [plan.md](../templates/plan.md) - Technical implementation plan template
- [tasks.md](../templates/tasks.md) - Task breakdown template
- [checklist.md](../templates/checklist.md) - Validation checklist template (Level 2+)
- [decision-record.md](../templates/decision-record.md) - Architecture Decision Records template (Level 3)

- [research.md](../templates/research.md) - Comprehensive research template (Level 3 optional)

**Session Management Templates:**
- [handover.md](../templates/handover.md) - Full session handover document (~100-150 lines)
- [debug-delegation.md](../templates/debug-delegation.md) - Debug task delegation for sub-agents

**Summary Templates:**
- [implementation-summary.md](../templates/implementation-summary.md) - Post-implementation summary for memory save
- [planning-summary.md](../templates/planning-summary.md) - Post-planning summary for memory save

**Non-Template Folders (for reference):**
- `scratch/` - Temporary workspace folder (create ad-hoc files as needed, no template)
- `memory/` - Context preservation folder (files auto-generated via `generate-context.js`)

### Related Skills
- `workflows-code` - Implementation, debugging, and verification lifecycle
- `system-memory` - Context preservation with semantic memory
- `workflows-git` - Git workspace setup and clean commits