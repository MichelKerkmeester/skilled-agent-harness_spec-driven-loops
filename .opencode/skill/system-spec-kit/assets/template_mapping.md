---
title: Template Mapping
description: Complete mapping of documentation levels to templates with copy commands.
---

# Template Mapping - Level to File Assignments

Maps documentation levels to required templates with ready-to-use copy commands.

---

## 1. 📖 OVERVIEW

### Purpose

This asset provides the definitive source for which templates are required at each documentation level. Use it to ensure spec folders contain all mandatory files before claiming completion.

### Usage

1. Determine your documentation level (1, 2, or 3)
2. Choose template style: **Core** (minimal) or **Verbose** (comprehensive guidance)
3. Copy the required templates using the provided bash commands
4. Follow the step-by-step template usage guide for proper folder setup
5. Verify all placeholders are filled before proceeding

---

## 2. 📍 TEMPLATE LOCATION

### Directory Structure

```
templates/
├── core/                    # Source components (DO NOT USE DIRECTLY)
├── addendum/                # Level additions (DO NOT USE DIRECTLY)
├── verbose/                 # Verbose templates with full guidance
│   └── core/                # Verbose core templates
├── level_1/                 # Composed Level 1 (ready to use)
├── level_2/                 # Composed Level 2 (ready to use)
├── level_3/                 # Composed Level 3 (ready to use)
└── level_3+/                # Composed Level 3+ (ready to use)
```

### Path Conventions

| Path | Purpose | When to Use |
|------|---------|-------------|
| `templates/level_N/` | Ready-to-use composed templates | **ALWAYS use this for new specs** |
| `templates/verbose/core/` | Verbose templates with guidance | New users who need detailed guidance |
| `templates/core/` | Source components | Reference only (compose script uses these) |
| `templates/addendum/` | Level-specific additions | Reference only (compose script uses these) |

**Primary Path:** `.opencode/skill/system-spec-kit/templates/level_N/` (where N is 1, 2, 3, or 3+)

**Critical Rule:** ALWAYS copy templates from `level_N/` directories - NEVER create documentation files from scratch.

### Template Style Options

| Style | Best For | Templates Path |
|-------|----------|----------------|
| **Core** (default) | Experienced users, simple features | `templates/level_N/` |
| **Verbose** | New users, complex requirements, training | `templates/verbose/core/` |

**Verbose Template Features:**
- `[YOUR_VALUE_HERE: description]` - Contextual guidance for each field
- `[NEEDS CLARIFICATION: (a) (b) (c)]` - Multiple-choice for ambiguous requirements
- `[example: content]` - Inline examples showing expected quality

### Compose Script

The compose script generates level-specific templates from core + addendum components:

```bash
# Location
.opencode/skill/system-spec-kit/scripts/templates/compose.sh

# Usage
compose.sh [OPTIONS] [LEVELS...]

# Examples
compose.sh                    # Compose all levels
compose.sh 2 3                # Compose only Level 2 and 3
compose.sh --dry-run          # Preview changes
compose.sh --verify           # Check if templates are current
```

**Composition Rules:**
- Level 1: Core only
- Level 2: Core + level2-verify addendum
- Level 3: Core + level2-verify + level3-arch addendums
- Level 3+: Core + all addendums

---

## 3. 📋 REQUIRED TEMPLATES BY LEVEL (Progressive Enhancement)

```
Level 1 (Baseline):     spec.md + plan.md + tasks.md + implementation-summary.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research.md
```

| Level               | Required Files                     | Adds To Previous        | Copy Commands              |
| ------------------- | ---------------------------------- | ----------------------- | -------------------------- |
| **1: Baseline**     | `spec.md` + `plan.md` + `tasks.md` + `implementation-summary.md` | (foundation)            | See Level 1 commands below |
| **2: Verification** | Level 1 + `checklist.md`           | QA checklist            | See Level 2 commands below |
| **3: Full**         | Level 2 + `decision-record.md`     | ADR + optional research | See Level 3 commands below |

**Level 1 Copy Commands (Baseline) - Core Style:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-name/implementation-summary.md
```

**Level 1 Copy Commands (Baseline) - Verbose Style:**
```bash
cp .opencode/skill/system-spec-kit/templates/verbose/core/spec-core-verbose.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/verbose/core/plan-core-verbose.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/verbose/core/tasks-core-verbose.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/verbose/core/impl-summary-core-verbose.md specs/###-name/implementation-summary.md
```

**Level 2 Copy Commands (complete set):**
```bash
cp .opencode/skill/system-spec-kit/templates/level_2/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_2/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_2/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/###-name/checklist.md
```

**Level 3 Copy Commands (complete set):**
```bash
cp .opencode/skill/system-spec-kit/templates/level_3/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3/decision-record.md specs/###-name/decision-record-[topic].md
# Optional:
cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md
```

---

## 4. 📦 OPTIONAL TEMPLATES (Level 3 Only)

These templates are OPTIONAL and only apply to Level 3 documentation:

| Template File | Copy As       | When to Use                          | Copy Command                                                                          |
| ------------- | ------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `research.md` | `research.md` | Comprehensive research documentation | `cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md` |

**Notes:**
- These are OPTIONAL - only copy when research is needed
- `decision-record.md` is REQUIRED at Level 3, not optional

---

## 5. 🗂️ FOLDER STRUCTURE BY LEVEL (Progressive Enhancement)

### Level 1: Baseline Documentation

```
specs/043-add-email-validation/
├── spec.md                      (REQUIRED - from spec.md)
├── plan.md                      (REQUIRED - from plan.md)
├── tasks.md                     (REQUIRED - from tasks.md)
└── memory/                      (OPTIONAL - context preservation)
    └── *.md                     (auto-generated via generate-context.js)
```

**Content expectations:**
- **spec.md**: Problem statement, requirements, success criteria
- **plan.md**: Implementation approach, file changes, testing strategy
- **tasks.md**: Task breakdown by user story, ordered by dependencies

**Enforcement:** Hard block if any required file missing

---

### Level 2: Verification Added

```
specs/044-modal-component/
├── spec.md                      (REQUIRED - from Level 1)
├── plan.md                      (REQUIRED - from Level 1)
├── tasks.md                     (REQUIRED - from Level 1)
├── checklist.md                 (REQUIRED - adds QA validation)
└── memory/                      (OPTIONAL - context preservation)
    └── *.md                     (auto-generated via generate-context.js)
```

**Additional expectations:**
- **checklist.md**: Pre-implementation checks, implementation validation, testing checklist, deployment verification

**Enforcement:** Hard block if `checklist.md` missing

---

### Level 3: Full Documentation

```
specs/045-user-dashboard/
├── spec.md                      (REQUIRED - from Level 2)
├── plan.md                      (REQUIRED - from Level 2)
├── tasks.md                     (REQUIRED - from Level 2)
├── checklist.md                 (REQUIRED - from Level 2)
├── decision-record-[topic].md   (REQUIRED - architecture decisions)
├── research.md                  (OPTIONAL - comprehensive research)
└── memory/                      (OPTIONAL - context preservation)
    └── *.md                     (auto-generated via generate-context.js)
```

**Additional expectations:**
- **decision-record.md**: Context, options considered, decision made, rationale, consequences

**Enforcement:** Hard block if `decision-record.md` missing

---

## 6. 📐 TEMPLATE STRUCTURE REQUIREMENTS

All templates follow consistent structure:

### 1. Numbered H2 Sections

**Format:** `## N. EMOJI TITLE`

**Example:** `## 3. 🛠️ IMPLEMENTATION`

**Rules:**
- Keep numbering sequential
- Never remove emojis (visual scanning pattern)
- Maintain consistent formatting

### 2. Metadata Block

First section sets expectations:

**Level 1:** Metadata + Complexity + Success Criteria

**Level 2/3:** Category, Tags, Priority, Status

### 3. Placeholder Conventions

- `[PLACEHOLDER]` - Must be replaced with actual content
- `[NEEDS CLARIFICATION: ...]` - Unknown requirement (flag for user)
- `<!-- SAMPLE CONTENT -->` - Remove before delivery

### 4. Template Footer

Accountability reminder (remove after filling):

```html
<!--
  REPLACE SAMPLE CONTENT IN FINAL OUTPUT
  - This template contains placeholders and examples
  - Replace them with actual content
-->
```

### 5. Memory File Anchors

Memory files in `memory/` folders MUST use paired anchors for semantic indexing:

**Required Format:**
```markdown
<!-- ANCHOR:section-name -->
Content that will be indexed...
<!-- /ANCHOR:section-name -->
```

**Rules:**
- Every opening `<!-- ANCHOR:name -->` MUST have a closing `<!-- /ANCHOR:name -->`
- Anchor names must match exactly (case-sensitive)
- Content between anchors is indexed for semantic search
- Orphaned anchors (missing pair) will cause validation errors

**Common Anchor Names:**
- `summary` - Executive summary of the memory
- `decisions` - Key decisions made
- `blockers` - Current blockers or issues
- `next-steps` - Planned next actions
- `context` - Background context

**Generation:** Use `node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js [spec-folder-path]` to auto-generate properly formatted memory files.

---

## 7. ✅ TEMPLATE ADHERENCE RULES

**Non-negotiable rules:**

1. **Always copy from `.opencode/skill/system-spec-kit/templates/`** - Never freehand documentation
2. **Preserve numbering and emojis** - Maintain visual scanning pattern
3. **Fill every placeholder** - Replace `[PLACEHOLDER]` with actual content
4. **Remove instructional comments** - Delete `<!-- SAMPLE -->` blocks
5. **Use descriptive filenames** - `decision-record-[topic].md`, not `decision-record-final.md`
6. **Keep sections relevant** - State "N/A" instead of deleting sections
7. **Link sibling documents** - Cross-reference spec.md ↔ plan.md ↔ tasks.md
8. **Document level changes** - Note upgrades/downgrades in changelog
9. **Keep history immutable** - Append to history, don't rewrite
10. **Validate before coding** - Complete pre-implementation checklist first
11. **Organize by priority** - Use P0/P1/P2 priority markers in checklists (P0=blocker, P1=must-do, P2=can-defer)
12. **Cite evidence** - Mark completed items with verification evidence (e.g., `[x] Item - verified via grep/test output`)

---

## 8. 🎯 STEP-BY-STEP TEMPLATE USAGE (Progressive Enhancement)

### Step 1: Determine Level
Use LOC as soft guidance + complexity/risk factors

### Step 2: Find Next Number
```bash
ls -d specs/[0-9]*/ | sed 's/.*\/\([0-9]*\)-.*/\1/' | sort -n | tail -1
```
Add 1 to get next number.

### Step 3: Create Folder
```bash
mkdir -p specs/###-short-name/
```

### Step 4: Copy Required Templates (Complete Sets)

**Level 1 (Baseline) - ALL features start here:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_1/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_1/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_1/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_1/implementation-summary.md specs/###-name/implementation-summary.md
```

**Level 2 (Verification) - Complete set:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_2/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_2/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_2/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_2/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_2/checklist.md specs/###-name/checklist.md
```

**Level 3 (Full) - Complete set:**
```bash
cp .opencode/skill/system-spec-kit/templates/level_3/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/level_3/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/level_3/tasks.md specs/###-name/tasks.md
cp .opencode/skill/system-spec-kit/templates/level_3/implementation-summary.md specs/###-name/implementation-summary.md
cp .opencode/skill/system-spec-kit/templates/level_3/checklist.md specs/###-name/checklist.md
cp .opencode/skill/system-spec-kit/templates/level_3/decision-record.md specs/###-name/decision-record-[topic].md
```

### Step 5: Copy Optional Templates (Level 3 Only - If Needed)

```bash
# Comprehensive Research
cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md
```

### Step 6: Fill Templates
- Replace ALL `[PLACEHOLDER]` text
- Remove sample/example sections
- Adapt to specific feature
- Remove instructional comments

### Step 7: Present to User
- Show level chosen
- Show folder path
- Show which templates used (required vs optional)
- Explain approach

### Step 8: Wait for Approval
Get explicit "yes/go ahead/proceed" before ANY file changes.

**Enforcement:** Verify required templates exist before claiming completion for the chosen level.

---

## 9. 📚 WHEN TO USE EACH TEMPLATE STYLE

### Core Templates (Default)

Use **Core templates** when:
- You are familiar with SpecKit documentation conventions
- The requirements are well-understood and straightforward
- You want minimal template overhead
- The feature scope is clear and well-defined

**Characteristics:**
- ~60-90 lines per template
- Minimal inline guidance
- Standard placeholders like `[NAME]`, `[PLACEHOLDER]`
- Focused on structure, not explanation

### Verbose Templates

Use **Verbose templates** when:
- **New to SpecKit** - First-time users who need guidance on what content to provide
- **Complex Requirements** - Features with many unknowns requiring clarification
- **Team Onboarding** - Training team members on specification best practices
- **Stakeholder Alignment** - Features requiring detailed requirements gathering
- **Uncertainty** - When you need prompts to ensure nothing is missed

**Characteristics:**
- ~200-300 lines per template
- Comprehensive inline guidance with examples
- `[YOUR_VALUE_HERE: detailed description]` format
- `[NEEDS CLARIFICATION: (a) (b) (c)]` multiple-choice questions
- `[example: concrete content]` inline demonstrations

### Migration: Verbose to Core

After completing a verbose template, optionally convert to core format:

1. Remove all `[example: ...]` lines
2. Replace `[YOUR_VALUE_HERE: ...]` with actual content
3. Resolve all `[NEEDS CLARIFICATION: ...]` items
4. Delete guidance comments
5. Result: Clean core-format document

---

## 10. 🔗 RELATED RESOURCES

### Asset Files
- [parallel_dispatch_config.md](./parallel_dispatch_config.md) - Complexity scoring and agent dispatch
- [level_decision_matrix.md](./level_decision_matrix.md) - Level selection decision matrix

### Reference Files
- [template_guide.md](../references/template_guide.md) - Template selection, adaptation, and quality standards
- [level_specifications.md](../references/templates/level_specifications.md) - Complete Level 1-3 requirements
- [quick_reference.md](../references/workflows/quick_reference.md) - Commands, checklists, and troubleshooting

### Scripts
- [compose.sh](../scripts/templates/compose.sh) - Template composition script

### Templates (Organized by Level)

**Level 1 Templates (Baseline):**
- [spec.md](../templates/level_1/spec.md) - Requirements and user stories template
- [plan.md](../templates/level_1/plan.md) - Technical implementation plan template
- [tasks.md](../templates/level_1/tasks.md) - Task breakdown template
- [implementation-summary.md](../templates/level_1/implementation-summary.md) - Completion summary template

**Level 2 Templates (Verification):**
- [spec.md](../templates/level_2/spec.md) - Requirements template with extended sections
- [plan.md](../templates/level_2/plan.md) - Implementation plan with verification
- [tasks.md](../templates/level_2/tasks.md) - Task breakdown template
- [implementation-summary.md](../templates/level_2/implementation-summary.md) - Completion summary template
- [checklist.md](../templates/level_2/checklist.md) - Validation checklist template

**Level 3 Templates (Full Documentation):**
- [spec.md](../templates/level_3/spec.md) - Comprehensive requirements template
- [plan.md](../templates/level_3/plan.md) - Full implementation plan template
- [tasks.md](../templates/level_3/tasks.md) - Detailed task breakdown template
- [implementation-summary.md](../templates/level_3/implementation-summary.md) - Completion summary template
- [checklist.md](../templates/level_3/checklist.md) - Full validation checklist template
- [decision-record.md](../templates/level_3/decision-record.md) - Architecture Decision Records template

**Verbose Templates (With Full Guidance):**
- [spec-core-verbose.md](../templates/verbose/core/spec-core-verbose.md) - Specification with comprehensive guidance
- [plan-core-verbose.md](../templates/verbose/core/plan-core-verbose.md) - Implementation plan with guidance
- [tasks-core-verbose.md](../templates/verbose/core/tasks-core-verbose.md) - Task breakdown with guidance
- [impl-summary-core-verbose.md](../templates/verbose/core/impl-summary-core-verbose.md) - Summary with guidance

**Optional Templates:**
- [research.md](../templates/research.md) - Comprehensive research template (Level 3 only)

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
- `workflows-documentation` - Document quality and skill creation