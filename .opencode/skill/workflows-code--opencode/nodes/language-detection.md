---
description: "Quick language identification table mapping file extensions and keywords to resource loading paths"
---
# Language Detection

Quick-reference table for identifying which language context applies and which resources to load.

## Where Am I?

| Language   | You're here if...                                    | Load these resources          |
| ---------- | ---------------------------------------------------- | ----------------------------- |
| JavaScript | File is `.js/.mjs/.cjs`, or MCP/Node code            | `javascript/*` + quality      |
| TypeScript | File is `.ts/.tsx/.mts/.d.ts`, or interface/type/tsc | `typescript/*` + quality      |
| Python     | File is `.py`, or pytest/argparse keywords           | `python/*` + quality          |
| Shell      | File is `.sh/.bash`, or shebang keywords             | `shell/*` + quality           |
| Config     | File is `.json/.jsonc`, or schema keywords           | `config/*`                    |
| Unknown    | No extension, no keywords match                      | Ask user, use shared patterns |

## Detection Priority

1. **File extension** - Checked first, provides deterministic match
2. **Keyword signals** - Weighted scoring when extension is absent
3. **User clarification** - Prompted when detection is ambiguous

## Cross References
- [[smart-routing]] - Full routing logic with weighted scoring
- [[how-it-works]] - Standards workflow that uses language detection