---
title: Sub-Folder Versioning
description: Workflow-assisted pattern for organizing iterative work within existing spec folders using versioned sub-folders and isolated continuity support artifacts.
trigger_phrases:
  - "sub-folder versioning"
  - "versioned sub-folders"
  - "iterative work organization"
  - "isolated continuity artifacts"
importance_tier: normal
contextType: general
version: 3.6.0.27
---

# Sub-Folder Versioning - Iterative Work Organization Pattern

Workflow-assisted pattern for organizing iterative work within existing spec folders using canonical packet continuity plus generated support artifacts.

---

## 1. OVERVIEW

### Purpose

Enable clean separation of iterative work within a single spec folder while preserving historical context through packet continuity. Each iteration maintains its own canonical continuity (the `_memory.continuity` block in its `implementation-summary.md`) plus a git-ignored `scratch/` workspace tied to that child packet.

### Important Note

Sub-folder versioning is **workflow-assisted**: the AI can suggest it during Option A flows and `create.sh --subfolder` creates numbered sub-folders with a `scratch/` directory and `graph-metadata.json` automatically. Legacy `[spec]/memory/*.md` artifacts are no longer produced. Existing root docs are not auto-moved; archival/reorganization remains explicit.

### When to Use

- Working on distinct phases of the same feature
- Separating unrelated tasks within a parent spec folder
- Creating clear boundaries between implementation iterations
- Preserving context when returning to old work

---

## 2. DIRECTORY STRUCTURE

```
specs/###-name/
├── 001-original-topic/   # First iteration
│   ├── spec.md
│   ├── plan.md
│   ├── implementation-summary.md   # _memory.continuity block (canonical context)
│   └── scratch/                    # git-ignored working files
├── 002-new-iteration/    # Second iteration
│   ├── spec.md
│   ├── plan.md
│   ├── implementation-summary.md
│   └── scratch/
└── 003-another-task/     # Third iteration (current, active)
    ├── spec.md
    ├── plan.md
    ├── implementation-summary.md   # Independent continuity
    └── scratch/
```

---

## 3. WORKFLOW STEPS

### Step 1: Recognition

When selecting Option A (existing folder), the AI agent checks for root-level content and suggests sub-folder organization if appropriate.

### Step 2: User Decision

User decides whether to:
- **Create sub-folder**: Organize new work in a numbered sub-folder
- **Continue in root**: Keep working in the existing structure

### Step 3: Manual Organization

If creating a sub-folder, the user (with AI guidance):
1. Chooses a descriptive name for the sub-folder
2. Creates the folder structure manually or via `.opencode/skills/system-spec-kit/scripts/spec/create.sh --subfolder`
3. Copies templates as needed

**Script-assisted example:**

```bash
.opencode/skills/system-spec-kit/scripts/spec/create.sh \
  --subfolder specs/<track> \
  --topic memory-overhaul \
  --level 3+ \
  "Wave 1 follow-up"
```

### Step 4: Path Tracking

Routine saves pass the target spec folder alongside structured JSON.

---

## 4. NAMING CONVENTION

- **Sub-folder format**: `{###}-{descriptive-name}` (script-generated or manual)
- **Numbers**: 001, 002, 003, etc. (3-digit padded, sequential)
- **Name rules**: lowercase, hyphens, 2-3 words (shorter is better)
- **Examples**: `001-mcp-code-mode`, `002-api-refactor`, `003-bug-fixes`

---

## 5. MEMORY CONTEXT ROUTING

- Spec folder path passed explicitly alongside structured JSON for routine saves
- `generate-context.js` refreshes canonical continuity in the specified sub-folder's `implementation-summary.md` `_memory.continuity` block (legacy `[spec]/memory/*.md` writes are retired)
- Each iteration has isolated continuity history
- Sub-folder creation also provisions isolated `scratch/` directories
- Older packets may still contain a root `memory/` directory from before the retirement; current saves write only canonical continuity

---

## 6. EXAMPLE USE CASE

### Manual Sub-Folder Organization

**Scenario:** User wants to organize iterative work within an existing spec folder

1. **Initial State:**
   ```
   specs/007-auth-system/
   ├── spec.md
   ├── plan.md
   └── implementation-summary.md
   ```

2. **After Manual Organization:**
   ```
   specs/007-auth-system/
   ├── 001-initial-implementation/    # Original content (manually moved)
   │   ├── spec.md
   │   ├── plan.md
   │   └── implementation-summary.md
   └── 002-oauth-addition/            # New work
       ├── spec.md
       ├── plan.md
       └── implementation-summary.md
   ```

**Key Points:**
- User manually creates and organizes sub-folders
- Original content can be moved to a sub-folder if desired
- Each sub-folder has independent continuity in its `implementation-summary.md`
- Numbering is sequential within the spec folder

### Step-by-Step Walkthrough

1. User runs `/spec_kit:complete` or similar
2. Gate 3 asks: "Spec folder?" → User selects **A) Existing**
3. User selects `specs/007-auth-system/`
4. AI suggests: "This folder has existing content. Would you like to organize work in a sub-folder?"
5. If yes:
   - User provides sub-folder name: "002-oauth-addition"
   - AI helps create the sub-folder with templates
   - Continuity saves update the sub-folder's `implementation-summary.md` `_memory.continuity` block
6. If no:
   - Continue working in root folder

---

## 7. BENEFITS

- Clean separation of iterative work
- Preserves all historical work (no data loss)
- Independent continuity per iteration
- Backward compatible (works with non-versioned folders)
- Flexible organization based on project needs

---

## 8. PHASES VS VERSIONS

Sub-folder versioning and phases serve distinct purposes:

| Aspect | Sub-Folder Versioning | Phase Decomposition |
|--------|----------------------|---------------------|
| **Purpose** | Sequential iterations of the same work | Parallel decomposition of different work streams |
| **Relationship** | Each version builds on or replaces the previous | Each phase addresses a distinct part of the whole |
| **Naming** | `001-original/`, `002-iteration/` | `001-foundation/`, `002-api-layer/` |
| **Trigger** | Option A reuse with existing content | Complexity score >= 25 AND level >= 3 |
| **Workflow** | One active version at a time | Multiple phases may be active simultaneously |
| **Parent spec** | Optional (root docs may exist) | Required (Phase Documentation Map in parent spec.md) |
| **Back-reference** | Not required | Child spec.md references parent via `parent:` metadata |

**Key distinction:** Versions are **temporal** (this work, then that work). Phases are **spatial** (this part and that part, potentially in parallel).

Both systems use the same `###-name/` naming convention for child folders and both keep independent canonical continuity (`implementation-summary.md` `_memory.continuity`) per child.

---

## 9. GENERATE-CONTEXT.JS INTEGRATION

When using subfolder versioning, the spec-doc record save script (`generate-context.js`) fully supports nested paths.

### Supported Input Formats

| Input                                  | Resolution                                        |
| -------------------------------------- | ------------------------------------------------- |
| `003-parent/121-child`                 | Resolves to `{specsDir}/003-parent/121-child/`    |
| `002-track/022-feature/011-phase`      | Resolves three-level nested packet path           |
| `121-child` (bare)                     | Searches all parents, requires unique match        |
| `specs/003-parent/121-child`           | Strips prefix, resolves nested                     |
| Internal design notes | Strips prefix, resolves nested                     |

### Continuity Save Location

Canonical continuity is always written to the CHILD folder's `implementation-summary.md`:
- `specs/003-parent/121-child/implementation-summary.md` (correct)
- `specs/003-parent/implementation-summary.md` (wrong — parent-level, not child)

### Bare Child Ambiguity

If a child name like `121-audit` exists under multiple parents, the script requires the full path:

```
Error: Ambiguous child folder "121-audit" found in multiple parents:
  - <spec-folder>
  - specs/005-<user-repo>/121-audit/
Please specify the full path: parent/child
```

---

## 10. RELATED RESOURCES

### Reference Files
- [template_guide.md](../templates/template_guide.md) - Template selection, adaptation, and quality standards
- level specifications reference - Complete Level 1-3 requirements and migration
- [quick_reference.md](../workflows/quick_reference.md) - Commands, checklists, and troubleshooting

### Related Skills
- `system-spec-kit` - Spec folder workflow orchestrator
- `system-spec-kit` - Context preservation with semantic memory

---
