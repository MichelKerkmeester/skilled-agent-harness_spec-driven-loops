---
title: Sub-Folder Versioning
description: Manual pattern for organizing iterative work within existing spec folders using memory-based context preservation.
---

# Sub-Folder Versioning - Iterative Work Organization Pattern

Manual pattern for organizing iterative work within existing spec folders using memory-based context preservation.

---

## 1. 📖 OVERVIEW

### Purpose

Enable clean separation of iterative work within a single spec folder while preserving historical context through memory files. Each iteration maintains its own memory directory for independent conversation history.

### Important Note

Sub-folder versioning is a **manual organizational pattern** - there is no automatic archiving. The AI agent guides users through the process but all file operations are explicit.

### When to Use

- Working on distinct phases of the same feature
- Separating unrelated tasks within a parent spec folder
- Creating clear boundaries between implementation iterations
- Preserving context when returning to old work

---

## 2. 📂 DIRECTORY STRUCTURE

```
specs/###-name/
├── 001-original-topic/   # First iteration
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

### Step 1: Recognition

When selecting Option A (existing folder), the AI agent checks for root-level content and suggests sub-folder organization if appropriate.

### Step 2: User Decision

User decides whether to:
- **Create sub-folder**: Organize new work in a numbered sub-folder
- **Continue in root**: Keep working in the existing structure

### Step 3: Manual Organization

If creating a sub-folder, the user (with AI guidance):
1. Chooses a descriptive name for the sub-folder
2. Creates the folder structure manually or via `scripts/spec/create.sh --subfolder`
3. Copies templates as needed

### Step 4: Path Tracking

Spec folder path passed via CLI argument to generate-context.js (stateless - no marker file).

---

## 4. 🏷️ NAMING CONVENTION

- **Sub-folder format**: `{###}-{descriptive-name}` (manually numbered)
- **Numbers**: 001, 002, 003, etc. (3-digit padded, sequential)
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

### Manual Sub-Folder Organization

**Scenario:** User wants to organize iterative work within an existing spec folder

1. **Initial State:**
   ```
   specs/007-auth-system/
   ├── spec.md
   ├── plan.md
   └── memory/
   ```

2. **After Manual Organization:**
   ```
   specs/007-auth-system/
   ├── 001-initial-implementation/    # Original content (manually moved)
   │   ├── spec.md
   │   ├── plan.md
   │   └── memory/
   └── 002-oauth-addition/            # New work
       ├── spec.md
       ├── plan.md
       └── memory/
   ```

**Key Points:**
- User manually creates and organizes sub-folders
- Original content can be moved to a sub-folder if desired
- Each sub-folder has independent memory/ context
- Numbering is sequential within the spec folder

### Step-by-Step Walkthrough

1. User runs `/spec_kit:complete` or similar
2. Gate 3 asks: "Spec folder?" → User selects **A) Existing**
3. User selects `specs/007-auth-system/`
4. AI suggests: "This folder has existing content. Would you like to organize work in a sub-folder?"
5. If yes:
   - User provides sub-folder name: "002-oauth-addition"
   - AI helps create the sub-folder with templates
   - Memory saves go to the sub-folder's memory/ directory
6. If no:
   - Continue working in root folder

---

## 7. ✅ BENEFITS

- Clean separation of iterative work
- Preserves all historical work (no data loss)
- Independent memory/ contexts per iteration
- Backward compatible (works with non-versioned folders)
- Flexible organization based on project needs

---

## 8. 🔗 RELATED RESOURCES

### Reference Files
- [template_guide.md](../templates/template_guide.md) - Template selection, adaptation, and quality standards
- [level_specifications.md](../templates/level_specifications.md) - Complete Level 1-3 requirements and migration
- [quick_reference.md](../workflows/quick_reference.md) - Commands, checklists, and troubleshooting

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
- `system-spec-kit` - Context preservation with semantic memory