---
description: "Completion gates and validation checkpoints for Figma MCP operations."
---
# Success Criteria

Defines when each type of Figma MCP operation is considered complete, with specific validation checkpoints.

## File Access Complete

**File access complete when**:
- `get_file` returns file structure
- File name and pages accessible
- Node hierarchy navigable

## Image Export Complete

**Image export complete when**:
- `get_image` returns image URLs
- URLs are accessible and valid
- Format and scale as requested

## Component Extraction Complete

**Component extraction complete when**:
- `get_file_components` returns component list
- Component names and keys accessible
- Node IDs available for further queries

## Style Extraction Complete

**Style extraction complete when**:
- `get_file_styles` returns style list
- Style types categorized (FILL, TEXT, EFFECT, GRID)
- Style names and keys accessible

## Validation Checkpoints

| Checkpoint         | Validation                           |
| ------------------ | ------------------------------------ |
| `tools_discovered` | `search_tools()` returns Figma tools |
| `auth_verified`    | `check_api_key()` confirms token     |
| `file_accessible`  | `get_file()` returns file data       |
| `export_working`   | `get_image()` returns URLs           |

## Cross References
- [[rules]] —Mandatory rules that must be followed during validation
- [[quick-reference]] —Commands to run for each checkpoint
