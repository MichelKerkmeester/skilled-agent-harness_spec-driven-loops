---
description: "Essential commands, common patterns, and troubleshooting for Figma MCP tools."
---
# Quick Reference

Ready-to-use commands, reusable patterns, and solutions to common issues.

## Essential Commands

| Task           | Tool                  | Example                                                                  |
| -------------- | --------------------- | ------------------------------------------------------------------------ |
| Get file       | `get_file`            | `figma.figma_get_file({ fileKey: "abc123" })`                            |
| Export image   | `get_image`           | `figma.figma_get_image({ fileKey: "abc", ids: ["1:2"], format: "png" })` |
| Get components | `get_file_components` | `figma.figma_get_file_components({ fileKey: "abc" })`                    |
| Get styles     | `get_file_styles`     | `figma.figma_get_file_styles({ fileKey: "abc" })`                        |
| Get comments   | `get_comments`        | `figma.figma_get_comments({ fileKey: "abc" })`                           |
| Post comment   | `post_comment`        | `figma.figma_post_comment({ fileKey: "abc", message: "..." })`           |

## Common Patterns

```typescript
// Get file structure
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({ fileKey: "abc123XYZ" });
    console.log('Pages:', file.document.children.map(p => p.name));
    return file;
  `
});

// Export multiple nodes as PNG
call_tool_chain({
  code: `
    const images = await figma.figma_get_image({
      fileKey: "abc123XYZ",
      ids: ["1:234", "1:235", "1:236"],
      format: "png",
      scale: 2
    });
    return images;
  `
});

// Get all components with metadata
call_tool_chain({
  code: `
    const components = await figma.figma_get_file_components({ fileKey: "abc123XYZ" });
    return components.meta.components.map(c => ({
      name: c.name,
      key: c.key,
      nodeId: c.node_id
    }));
  `
});
```

## Troubleshooting

| Issue                 | Solution                                                    |
| --------------------- | ----------------------------------------------------------- |
| "Invalid token" error | Regenerate token in Figma Settings -> Personal Access Tokens |
| File not found        | Verify fileKey from URL: `figma.com/file/{fileKey}/...`     |
| Rate limited          | Add delays between requests, reduce batch size              |
| Node ID not found     | Node IDs change on edit - re-fetch file to get current IDs  |
| Empty components list | File may not have published components                      |

## Cross References
- [[how-it-works]] — Detailed invocation workflow and examples
- [[rules]] — Mandatory rules for tool usage
- [[success-criteria]] — How to verify each operation succeeded
