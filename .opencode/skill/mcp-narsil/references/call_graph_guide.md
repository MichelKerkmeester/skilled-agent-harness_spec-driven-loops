---
title: Call Graph Analysis Guide - Narsil MCP
description: Deep code flow analysis workflow using Narsil's call graph, control flow, and data flow tools with phased execution and validation checkpoints.
---

# Call Graph Analysis Guide - Narsil MCP

Code flow analysis workflow using Narsil's call graph, control flow, and data flow tools.

---

## 1. 📖 OVERVIEW

### Core Principle

Start with `get_call_graph` for the big picture, then drill into `callers`/`callees` for specific functions.

### Analysis Capabilities

Narsil provides comprehensive code flow analysis:

| Capability | Tools | Purpose |
|------------|-------|---------|
| **Call Graph** | `get_call_graph`, `get_callers`, `get_callees` | Function relationships |
| **Path Analysis** | `find_call_path`, `get_function_hotspots` | Execution paths |
| **Control Flow** | `get_control_flow`, `find_dead_code` | Basic blocks and branches |
| **Data Flow** | `get_data_flow`, `find_dead_stores`, `find_uninitialized` | Variable tracking |
| **Complexity** | `get_complexity` | Cyclomatic/cognitive metrics |

### Analysis Tools Summary

| Tool | Purpose | Priority |
|------|---------|----------|
| `get_call_graph` | Function call relationships | HIGH |
| `get_callers` | Who calls this function? | HIGH |
| `get_callees` | What does this function call? | HIGH |
| `find_call_path` | Path between functions | HIGH |
| `get_complexity` | Complexity metrics | HIGH |
| `get_function_hotspots` | Highly connected functions | HIGH |
| `get_control_flow` | CFG with basic blocks | MEDIUM |
| `find_dead_code` | Unreachable code | MEDIUM |
| `get_data_flow` | Variable definitions/uses | MEDIUM |
| `find_dead_stores` | Unused assignments | MEDIUM |
| `find_uninitialized` | Variables used before init | MEDIUM |

---

## 2. 🎯 ANALYSIS WORKFLOW

You MUST complete each phase before proceeding to the next.

### Phase 1: Overview

**Purpose**: Get high-level understanding of code structure

**Actions**:
1. Get call graph for entire repository
2. Identify function hotspots
3. Understand main entry points

**Validation**: `overview_complete`

```typescript
call_tool_chain({
  code: `
    // Phase 1: Overview
    const graph = await narsil.narsil_get_call_graph({});
    
    const hotspots = await narsil.narsil_get_function_hotspots({
      limit: 10
    });
    
    console.log('Functions in graph:', graph.nodes?.length || 0);
    console.log('Top hotspots:', hotspots.map(h => h.name).join(', '));
    
    return { graph, hotspots };
  `
});
```

**Checkpoint Questions**:
- How many functions in the codebase?
- What are the central functions (hotspots)?
- Any obvious architectural patterns?

### Phase 2: Drill-Down

**Purpose**: Analyze specific function relationships

**Actions**:
1. Get callers for key functions
2. Get callees for key functions
3. Find paths between related functions

**Validation**: `relationships_mapped`

```typescript
call_tool_chain({
  code: `
    // Phase 2: Drill-down on a specific function
    const targetFunction = "processRequest";  // Replace with actual
    
    const callers = await narsil.narsil_get_callers({
      function_name: targetFunction
    });
    
    const callees = await narsil.narsil_get_callees({
      function_name: targetFunction
    });
    
    console.log('Callers:', callers.length);
    console.log('Callees:', callees.length);
    
    return { callers, callees };
  `
});
```

**Checkpoint Questions**:
- What functions depend on this one?
- What does this function depend on?
- Impact radius if this function changes?

### Phase 3: Path Analysis

**Purpose**: Trace execution paths

**Actions**:
1. Find paths between entry and target functions
2. Identify complexity along paths
3. Spot potential bottlenecks

**Validation**: `paths_traced`

```typescript
call_tool_chain({
  code: `
    // Phase 3: Path analysis
    const path = await narsil.narsil_find_call_path({
      from: "main",
      to: "saveToDatabase"
    });
    
    // Get complexity for functions along path
    const complexities = [];
    for (const func of path.path || []) {
      const complexity = await narsil.narsil_get_complexity({
        function_name: func
      });
      complexities.push({ func, complexity });
    }
    
    return { path, complexities };
  `
});
```

**Checkpoint Questions**:
- What's the shortest path between functions?
- Any highly complex functions along the path?
- Potential refactoring targets?

### Phase 4: Quality Analysis

**Purpose**: Find dead code and quality issues

**Actions**:
1. Find unreachable code
2. Find unused assignments
3. Find uninitialized variables

**Validation**: `quality_analyzed`

```typescript
call_tool_chain({
  code: `
    // Phase 4: Quality analysis
    const deadCode = await narsil.narsil_find_dead_code({});
    
    const deadStores = await narsil.narsil_find_dead_stores({});
    
    const uninitialized = await narsil.narsil_find_uninitialized({});
    
    console.log('Dead code blocks:', deadCode.length);
    console.log('Dead stores:', deadStores.length);
    console.log('Uninitialized:', uninitialized.length);
    
    return { deadCode, deadStores, uninitialized };
  `
});
```

**Checkpoint Questions**:
- How much dead code can be removed?
- Any variables assigned but never used?
- Any potential bugs from uninitialized variables?

---

## 3. 🔧 TOOL USAGE PATTERNS

### Get Full Call Graph

```typescript
// Entire repository
const graph = await narsil.narsil_get_call_graph({});

// Specific function with depth limit
const funcGraph = await narsil.narsil_get_call_graph({
  function_name: "main",
  depth: 3
});
```

### Find Callers and Callees

```typescript
// Who calls processPayment?
const callers = await narsil.narsil_get_callers({
  function_name: "processPayment"
});

// What does processPayment call?
const callees = await narsil.narsil_get_callees({
  function_name: "processPayment"
});
```

### Find Call Path

```typescript
// How does main reach validateUser?
const path = await narsil.narsil_find_call_path({
  from: "main",
  to: "validateUser"
});
```

### Complexity Analysis

```typescript
// Single function
const complexity = await narsil.narsil_get_complexity({
  function_name: "handleRequest"
});
// Returns: { cyclomatic: 15, cognitive: 12, lines: 50 }

// Find complex functions
const hotspots = await narsil.narsil_get_function_hotspots({
  limit: 10
});
```

### Control Flow Graph

```typescript
const cfg = await narsil.narsil_get_control_flow({
  function_name: "processOrder"
});
// Returns: basic blocks, branches, loops
```

### Data Flow Analysis

```typescript
// Variable tracking
const dataFlow = await narsil.narsil_get_data_flow({
  function_name: "calculateTotal"
});

// Find issues
const deadStores = await narsil.narsil_find_dead_stores({});
const uninitialized = await narsil.narsil_find_uninitialized({});
```

---

## 4. 💡 USE CASES

### Understanding New Codebase

1. **Get overview**: `get_call_graph({})` - See overall structure
2. **Find central code**: `get_function_hotspots({})` - Identify important functions
3. **Trace dependencies**: `get_callers()` / `get_callees()` - Understand relationships
4. **Semantic context**: Use `neural_search` for understanding what functions do

### Impact Analysis (Before Refactoring)

1. **Find callers**: Who depends on the function to change?
2. **Find paths**: What execution paths will be affected?
3. **Check complexity**: Is this a good refactoring target?

```typescript
// Before changing "validateUser"
const callers = await narsil.narsil_get_callers({ function_name: "validateUser" });
console.log(`${callers.length} functions will be affected`);
```

### Code Cleanup

1. **Find dead code**: `find_dead_code({})` - Remove unreachable code
2. **Find dead stores**: `find_dead_stores({})` - Remove unused assignments
3. **Check complexity**: `get_complexity({})` - Identify refactoring targets

### Debugging

1. **Trace path**: `find_call_path()` - How does execution reach the bug?
2. **Get CFG**: `get_control_flow()` - Understand branching logic
3. **Check data flow**: `get_data_flow()` - Track variable values

---

## 5. 🛠️ TROUBLESHOOTING

### Empty Call Graph

**Symptom**: Call graph returns no nodes

**Cause**: Repository not indexed or no functions found

**Solution**:
```typescript
// Check index status
call_tool_chain({
  code: `await narsil.narsil_get_index_status({})`
});

// Reindex if needed
call_tool_chain({
  code: `await narsil.narsil_reindex({})`
});
```

### Path Not Found

**Symptom**: `find_call_path` returns no path

**Cause**: Functions not connected or indirect connection

**Solution**: Try getting callees of source and callers of target to find intermediate functions.

### Complexity Returns Zero

**Symptom**: Complexity metrics are all zero

**Cause**: Function not found or parsing issue

**Solution**: Verify function name with `find_symbols` first.

---

## 6. 🔗 RELATED RESOURCES

### Guides

- [tool_reference.md](./tool_reference.md) - Complete tool documentation
- [security_guide.md](./security_guide.md) - Security scanning (uses call graph for taint)

### Complementary Analysis

- **Semantic**: Use `neural_search` for understanding what functions do
- **Structural**: Use call graph tools for relationships and flow
