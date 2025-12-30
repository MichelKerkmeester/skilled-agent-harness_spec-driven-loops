---
title: Tool Categories - Priority Classification
description: Categorization of all 18 Figma MCP tools with priority levels for efficient usage.
---

# Tool Categories - Priority Classification

Quick reference for choosing the right Figma tool by priority level.

---

## 1. 📋 PRIORITY LEVELS

### Definitions

| Priority | Description | Usage |
|----------|-------------|-------|
| **HIGH** | Core functionality, frequently used | Use actively for most tasks |
| **MEDIUM** | Useful but situational | Use when specific need arises |
| **LOW** | Rarely needed | Use sparingly |

### Summary Statistics

| Priority | Count | Percentage |
|----------|-------|------------|
| HIGH | 5 | 28% |
| MEDIUM | 7 | 39% |
| LOW | 6 | 33% |
| **Total** | **18** | **100%** |

---

## 2. ⭐ HIGH PRIORITY TOOLS (5)

Core design file access - use actively.

| Tool | Category | Purpose | Rationale |
|------|----------|---------|-----------|
| `get_file` | File | Get complete file | Primary file access |
| `get_file_nodes` | File | Get specific nodes | Targeted extraction |
| `get_image` | Images | Export as image | Asset export |
| `get_file_components` | Components | List components | Design system docs |
| `get_file_styles` | Styles | List styles | Token extraction |

### When to Use HIGH Priority

- Starting any Figma workflow
- Exporting design assets
- Documenting design systems
- Extracting design tokens

---

## 3. 📊 MEDIUM PRIORITY TOOLS (7)

Useful but situational - use when needed.

| Tool | Category | Purpose | Rationale |
|------|----------|---------|-----------|
| `get_image_fills` | Images | Get embedded images | Image URL extraction |
| `get_comments` | Comments | Read comments | Collaboration |
| `post_comment` | Comments | Post comment | Feedback workflow |
| `get_team_projects` | Team | List projects | Team navigation |
| `get_project_files` | Team | List files | Project discovery |
| `get_component` | Components | Get one component | Specific lookup |
| `get_style` | Styles | Get one style | Specific lookup |

### When to Use MEDIUM Priority

- Reading or posting design feedback
- Navigating team structure
- Looking up specific components or styles
- Getting embedded image URLs

---

## 4. ⚠️ LOW PRIORITY TOOLS (6)

Rarely needed - use sparingly.

| Tool | Category | Purpose | Rationale |
|------|----------|---------|-----------|
| `set_api_key` | File | Set API key | One-time setup |
| `check_api_key` | File | Verify key | Debugging only |
| `delete_comment` | Comments | Remove comment | Rare operation |
| `get_team_components` | Components | Team components | Team-level query |
| `get_team_component_sets` | Components | Team component sets | Team-level query |
| `get_team_styles` | Styles | Team styles | Team-level query |

### When to Use LOW Priority

- Initial setup (set_api_key)
- Debugging authentication (check_api_key)
- Removing comments (delete_comment)
- Team-wide inventory (team_* tools)

---

## 5. 📂 TOOLS BY CATEGORY

### File Management (4)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_file` | HIGH | Get complete file |
| `get_file_nodes` | HIGH | Get specific nodes |
| `set_api_key` | LOW | Set API key |
| `check_api_key` | LOW | Verify key configured |

### Images (2)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_image` | HIGH | Export nodes as images |
| `get_image_fills` | MEDIUM | Get embedded image URLs |

### Comments (3)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_comments` | MEDIUM | Read all comments |
| `post_comment` | MEDIUM | Post new comment |
| `delete_comment` | LOW | Delete a comment |

### Team & Projects (2)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_team_projects` | MEDIUM | List team projects |
| `get_project_files` | MEDIUM | List project files |

### Components (4)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_file_components` | HIGH | Get file components |
| `get_component` | MEDIUM | Get specific component |
| `get_team_components` | LOW | Get team components |
| `get_team_component_sets` | LOW | Get team component sets |

### Styles (3)

| Tool | Priority | Description |
|------|----------|-------------|
| `get_file_styles` | HIGH | Get file styles |
| `get_style` | MEDIUM | Get specific style |
| `get_team_styles` | LOW | Get team styles |

---

## 6. 🔄 DECISION FLOWCHART

```
What do you need?
     │
     ├─► File structure or content
     │   └─► HIGH: get_file, get_file_nodes
     │
     ├─► Export images
     │   └─► HIGH: get_image
     │       └─► MEDIUM: get_image_fills (for embedded)
     │
     ├─► Component information
     │   ├─► File-level → HIGH: get_file_components
     │   ├─► Specific → MEDIUM: get_component
     │   └─► Team-level → LOW: get_team_components
     │
     ├─► Style/token information
     │   ├─► File-level → HIGH: get_file_styles
     │   ├─► Specific → MEDIUM: get_style
     │   └─► Team-level → LOW: get_team_styles
     │
     ├─► Team/project navigation
     │   └─► MEDIUM: get_team_projects, get_project_files
     │
     └─► Comments/feedback
         ├─► Read → MEDIUM: get_comments
         ├─► Post → MEDIUM: post_comment
         └─► Delete → LOW: delete_comment
```

---

## 7. 🔗 RELATED RESOURCES

### Guides

- [tool_reference.md](../references/tool_reference.md) - Complete tool documentation
- [quick_start.md](../references/quick_start.md) - Getting started

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions
