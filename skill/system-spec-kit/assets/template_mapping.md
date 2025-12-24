# Template Mapping - Template-to-Level Guide with Copy Commands

> Complete mapping of documentation levels to templates using the progressive enhancement model.

---

## 1. 📍 TEMPLATE LOCATION

**All templates located in:** `.opencode/skill/system-spec-kit/templates/`

**Critical Rule:** ALWAYS copy templates from this directory - NEVER create documentation files from scratch.

---

## 2. 📋 REQUIRED TEMPLATES BY LEVEL (Progressive Enhancement)

```
Level 1 (Baseline):     spec.md + plan.md + tasks.md
                              ↓
Level 2 (Verification): Level 1 + checklist.md
                              ↓
Level 3 (Full):         Level 2 + decision-record.md + optional research.md
```

| Level               | Required Files                     | Adds To Previous        | Copy Commands              |
| ------------------- | ---------------------------------- | ----------------------- | -------------------------- |
| **1: Baseline**     | `spec.md` + `plan.md` + `tasks.md` | (foundation)            | See Level 1 commands below |
| **2: Verification** | Level 1 + `checklist.md`           | QA checklist            | See Level 2 commands below |
| **3: Full**         | Level 2 + `decision-record.md`     | ADR + optional research | See Level 3 commands below |

**Level 1 Copy Commands (Baseline):**
```bash
cp .opencode/skill/system-spec-kit/templates/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/tasks.md specs/###-name/tasks.md
```

**Level 2 Copy Commands (adds to Level 1):**
```bash
# First copy all Level 1 files, then add:
cp .opencode/skill/system-spec-kit/templates/checklist.md specs/###-name/checklist.md
```

**Level 3 Copy Commands (adds to Level 2):**
```bash
# First copy all Level 2 files, then add:
cp .opencode/skill/system-spec-kit/templates/decision-record.md specs/###-name/decision-record-[topic].md
# Optional:
cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md
```

---

## 3. 📦 OPTIONAL TEMPLATES (Level 3 Only)

These templates are OPTIONAL and only apply to Level 3 documentation:

| Template File  | Copy As       | When to Use                          | Copy Command                                                                          |
| -------------- | ------------- | ------------------------------------ | ------------------------------------------------------------------------------------- |
| `research.md`  | `research.md` | Comprehensive research documentation | `cp .opencode/skill/system-spec-kit/templates/research.md specs/###-name/research.md` |

**Notes:**
- These are OPTIONAL - only copy when research is needed
- `decision-record.md` is REQUIRED at Level 3, not optional

---

## 4. 🗂️ FOLDER STRUCTURE BY LEVEL (Progressive Enhancement)

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

## 5. 📐 TEMPLATE STRUCTURE REQUIREMENTS

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

**Generation:** Use `node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]` to auto-generate properly formatted memory files.

---

## 6. ✅ TEMPLATE ADHERENCE RULES

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

## 7. 🎯 STEP-BY-STEP TEMPLATE USAGE (Progressive Enhancement)

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

### Step 4: Copy Required Templates (Progressive)

**Level 1 (Baseline) - ALL features start here:**
```bash
cp .opencode/skill/system-spec-kit/templates/spec.md specs/###-name/spec.md
cp .opencode/skill/system-spec-kit/templates/plan.md specs/###-name/plan.md
cp .opencode/skill/system-spec-kit/templates/tasks.md specs/###-name/tasks.md
```

**Level 2 (Verification) - Add to Level 1:**
```bash
# Copy all Level 1 files first, then add:
cp .opencode/skill/system-spec-kit/templates/checklist.md specs/###-name/checklist.md
```

**Level 3 (Full) - Add to Level 2:**
```bash
# Copy all Level 2 files first, then add:
cp .opencode/skill/system-spec-kit/templates/decision-record.md specs/###-name/decision-record-[topic].md
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

## 8. 🔗 RELATED RESOURCES

### Asset Files
- [parallel_dispatch_config.md](./parallel_dispatch_config.md) - Complexity scoring and agent dispatch
- [level_decision_matrix.md](./level_decision_matrix.md) - Level selection decision matrix

### Reference Files
- [template_guide.md](../references/template_guide.md) - Template selection, adaptation, and quality standards
- [level_specifications.md](../references/level_specifications.md) - Complete Level 1-3 requirements
- [quick_reference.md](../references/quick_reference.md) - Commands, checklists, and troubleshooting

### Templates
- [spec.md](../templates/spec.md) - Requirements and user stories template
- [plan.md](../templates/plan.md) - Technical implementation plan template
- [tasks.md](../templates/tasks.md) - Task breakdown template
- [checklist.md](../templates/checklist.md) - Validation checklist template (Level 2+)
- [decision-record.md](../templates/decision-record.md) - Architecture Decision Records template (Level 3)

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
- `workflows-documentation` - Document quality and skill creation