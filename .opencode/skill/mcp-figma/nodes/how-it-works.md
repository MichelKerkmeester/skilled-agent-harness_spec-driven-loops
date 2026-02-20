---
description: "Core workflow for invoking Figma tools via Code Mode, including naming conventions and examples."
---
# How It Works

Figma MCP is accessed through Code Mode's `call_tool_chain()` for token efficiency. This node covers the invocation pattern, naming convention, and practical examples.

## Code Mode Invocation

**Naming Convention**:
```
figma.figma_{tool_name}
```

**Process Flow**:
```
STEP 1: Discover Tools
       |-- Use search_tools() for capability-based discovery
       |-- Use tool_info() for specific tool details
       +-- Output: Tool name and parameters
       |
STEP 2: Execute via Code Mode
       |-- Use call_tool_chain() with TypeScript code
       |-- Await figma.figma_{tool_name}({params})
       +-- Output: Tool results
       |
STEP 3: Process Results
       +-- Parse and present findings
```

## Tool Invocation Examples

```typescript
// Discover Figma tools
search_tools({ task_description: "figma design components" });

// Get tool details
tool_info({ tool_name: "figma.figma_get_file" });

// Get a Figma file
call_tool_chain({
  code: `
    const file = await figma.figma_get_file({
      fileKey: "abc123XYZ"
    });
    console.log('File:', file.name);
    return file;
  `
});

// Export as image
call_tool_chain({
  code: `
    const images = await figma.figma_get_image({
      fileKey: "abc123XYZ",
      ids: ["1:234"],
      format: "png",
      scale: 2
    });
    return images;
  `
});

// Get components
call_tool_chain({
  code: `
    const components = await figma.figma_get_file_components({
      fileKey: "abc123XYZ"
    });
    return components;
  `
});
```

## Finding Your File Key

The file key is in your Figma URL:
```
https://www.figma.com/file/ABC123xyz/My-Design
                           +----------+
                           This is fileKey
```

## Cross References
- [[integration-points]] — Code Mode dependency and configuration details
- [[quick-reference]] — Ready-to-use command table and common patterns
- [[rules]] — Mandatory rules for tool invocation
