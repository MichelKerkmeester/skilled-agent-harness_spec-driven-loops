# Sub-Folder Versioning - Iterative Work Separation Pattern

> Pattern for separating iterative work within existing spec folders while maintaining independent memory contexts.

---

## 1. 📖 PATTERN OVERVIEW

### Purpose

Enable clean separation of iterative work within a single spec folder while preserving historical context and maintaining independent memory directories for each iteration.

### When This Triggers

- User selects **Option A** (use existing folder)
- Spec folder has root-level content (spec.md, plan.md, etc.)
- AI agent detects need for iteration separation

---

## 2. 📂 DIRECTORY STRUCTURE

```
specs/###-name/
├── 001-original-topic/   # Auto-archived first iteration
│   ├── spec.md
│   ├── plan.md
│   └── memory/
│       └── {timestamp}__.md
├── 002-new-iteration/    # Second iteration
│   ├── spec.md
│   ├── plan.md
│   └── memory/
│       └── {timestamp}__.md
└── 003-another-task/     # Third iteration (current, active)
    ├── spec.md
    ├── plan.md
    └── memory/           # Independent context
        └── {timestamp}__.md
```

---

## 3. 🔄 WORKFLOW STEPS

### Step 1: Detection

AI detects root-level files in existing spec folder when user selects Option A.

### Step 2: User Prompt

AI displays: "📦 SUB-FOLDER VERSIONING WILL BE APPLIED"

AI asks: "Please provide a name for the new sub-folder (e.g., 'api-refactor')"

### Step 3: Archive Creation

Existing root-level files moved to `001-{topic}/` (numbered based on spec folder name).

### Step 4: New Sub-Folder

New sub-folder created with user-provided name: `002-{user-provided-name}/`

### Step 5: Template Copy

Fresh templates copied to new sub-folder from `.opencode/skills/system-spec-kit/templates/`.

### Step 6: Path Tracking

Spec folder path passed via CLI argument to generate-context.js (stateless - no marker file).

---

## 4. 🏷️ NAMING CONVENTION

- **Sub-folder format**: `{###}-{descriptive-name}` (automatic numbering)
- **Numbers**: 001, 002, 003, etc. (3-digit padded, sequential)
- **Archive**: `001-{original-topic}` (automatic, based on spec folder name)
- **New**: `002-{user-provided-name}` (user provides descriptive name)
- **Name rules**: lowercase, hyphens, 2-3 words (shorter is better)
- **Examples**: `001-mcp-code-mode`, `002-api-refactor`, `003-bug-fixes`

---

## 5. 🧠 MEMORY CONTEXT ROUTING

- Spec folder path passed explicitly via CLI argument (stateless)
- Writes to specified sub-folder's `memory/` directory
- Each iteration has isolated conversation history
- Root `memory/` preserved for legacy saves (backward compatibility)

---

## 6. 💡 EXAMPLE USE CASE

```
Scenario: Working on skill standardization across multiple skills

Initial work: specs/122-skill-standardization/
  └── (root files: spec.md, plan.md, etc.)

User: "Work on cli-codex alignment"
System: Creates → 001-cli-codex-alignment/ sub-folder

User: "Now work on system-spec-kit alignment"
System: Archives to 002-cli-codex-alignment/
System: Creates → 003-system-spec-kit-alignment/ sub-folder

Result: Clean separation of work, independent memory contexts
```

---

## 7. ✅ BENEFITS

- Clean separation of iterative work
- Preserves all historical work (no data loss)
- Independent memory/ contexts per iteration
- Automatic archival with timestamps
- Backward compatible (works with non-versioned folders)

---

## 8. 🔗 RELATED RESOURCES

### Reference Files
- [template_guide.md](./template_guide.md) - Template selection, adaptation, and quality standards
- [level_specifications.md](./level_specifications.md) - Complete Level 1-3 requirements and migration
- [quick_reference.md](./quick_reference.md) - Commands, checklists, and troubleshooting

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
- `system-memory` - Context preservation with semantic memory