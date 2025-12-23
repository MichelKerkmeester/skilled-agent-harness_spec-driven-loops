# Tool Comparison: Semantic Search vs Grep vs Glob

Comprehensive decision framework for selecting the right code discovery tool based on your search intent and knowledge.

---

## 1. 📖 INTRODUCTION & PURPOSE

### What Is This Reference?

This reference provides a complete decision framework for selecting the optimal code discovery tool based on your search intent and existing knowledge.

**Core Purpose**:
- **Tool selection** - Choose between semantic search, grep, and glob
- **Decision framework** - Flowchart-based routing to correct tool
- **Scenario guidance** - When to use each tool with examples
- **Combined workflows** - Patterns for using tools together

**Progressive Disclosure Context**:
```
Level 1: SKILL.md metadata (name + description)
         └─ Always in context (~100 words)
            ↓
Level 2: SKILL.md body
         └─ When skill triggers (<5k words)
            ↓
Level 3: Reference files (this document)
         └─ Loaded as needed for tool selection guidance
```

This reference file provides Level 3 deep-dive technical guidance on tool comparison and selection logic.

### Core Principle

**"Use the right tool for the job: semantic search for intent, grep for symbols, glob for structure."**

**Prerequisites**: Understanding semantic search from SKILL.md:
- **Intent-based discovery**: When you know what code does, not where it is
- **Tool philosophy**: Different tools for different knowledge states
- **See**: [SKILL.md](../SKILL.md) for semantic search overview
- **See**: [query_patterns.md](./query_patterns.md) for effective query writing

---

## 2. 📊 OVERVIEW

This guide helps AI agents choose between semantic search, grep, and glob tools for code discovery tasks. Each tool has specific strengths and use cases.

| Tool | Best For | Speed | Precision | Use When |
|------|----------|-------|-----------|----------|
| **Semantic Search** | Intent-based discovery | Moderate | High (with context) | You know what code does, not where it is |
| **Grep** | Literal text matching | Fast | Very High | You know exact symbols/keywords |
| **Glob** | File pattern matching | Very Fast | Exact | You know file naming patterns |

---

## 3. 🗺️ DECISION FLOWCHART

```
Need to find code?
    ↓
Do you know the exact file path?
├─> YES: Use Read(path)
│         Fast, no API latency
│         Example: Read("src/hero/hero_video.js")
│
└─> NO: Do you know what the code does?
        ↓
    ├─> YES: Use semantic_search("what it does")
    │         Intent-based discovery
    │         Example: semantic_search("Find code that handles video playback")
    │
    └─> NO: Is it a literal text/symbol search?
            ↓
        ├─> YES: Use Grep("literal text")
        │         Exact keyword matching
        │         Example: Grep("initVideoPlayer", output_mode="content")
        │
        └─> NO: Are you exploring file structure?
                ↓
            ├─> YES: Use glob("**/*.js")
            │         File pattern matching
            │         Example: glob("src/**/*.js")
            │
            └─> Still unsure: Use semantic_search
                              Let intent-based search help discover
```

---

## 4. 🔍 TOOL 1: SEMANTIC SEARCH (semantic_search)

### When to Use

**Primary scenarios:**

1. **Exploring unfamiliar code**
   - You don't know where functionality lives
   - You need to understand how features work
   - You're new to the codebase

2. **Finding by behavior**
   - "Find code that validates email addresses"
   - "Show me where we handle form submissions"
   - "Locate animation initialization logic"

3. **Understanding patterns**
   - "How do we use Motion.dev library?"
   - "Find all modal implementations"
   - "Show me cookie consent patterns"

4. **Cross-file relationships**
   - "How does navigation interact with page transitions?"
   - "What code depends on the video player?"
   - "Find related components across files"

### When NOT to Use

**Use different tools instead:**

1. **Known exact file path**
   ```
   ❌ semantic_search("Find hero_video.js content")
   ✅ Read("src/hero/hero_video.js")
   ```
   **Why:** Read is faster, no API latency

2. **Looking for specific symbols**
   ```
   ❌ semantic_search("Find all calls to initVideoPlayer")
   ✅ Grep("initVideoPlayer", output_mode="content")
   ```
   **Why:** Literal text matching is more precise

3. **Simple keyword searches**
   ```
   ❌ semantic_search("Find all TODO comments")
   ✅ Grep("TODO:", output_mode="content")
   ```
   **Why:** Keyword search is sufficient

4. **File structure exploration**
   ```
   ❌ semantic_search("Show me all JavaScript files")
   ✅ glob("**/*.js")
   ```
   **Why:** File navigation doesn't need semantic understanding

### Strengths

- ✅ Understands intent ("what code does")
- ✅ Finds code by behavior, not keywords
- ✅ Discovers related code across files
- ✅ Works with natural language queries
- ✅ Judge model reranks for relevance

### Limitations

- ⚠️ Requires API calls (slight latency)
- ⚠️ Overkill for known file paths
- ⚠️ Not needed for exact symbol searches
- ⚠️ Requires MCP access (CLI AI agents only)

---

## 5. 🔎 TOOL 2: GREP (Literal Text Search)

### When to Use

**Primary scenarios:**

1. **Exact symbol searches**
   - Finding all calls to a function
   - Locating variable usages
   - Searching for specific error messages

2. **Keyword matching**
   - Finding TODO/FIXME comments
   - Locating specific strings
   - Searching for exact text patterns

3. **Debugging**
   - Finding where errors are thrown
   - Locating console.log statements
   - Searching for specific values

### Examples

```javascript
// Find all calls to specific function
Grep("initVideoPlayer", output_mode="content")

// Find TODO comments
Grep("TODO:", output_mode="content")

// Find error messages
Grep("throw new Error", output_mode="content")

// Find import statements
Grep("import.*Motion", output_mode="content")
```

### Strengths

- ✅ Very fast (no API calls)
- ✅ Extremely precise (exact matches)
- ✅ Supports regex patterns
- ✅ Great for known symbols

### Limitations

- ⚠️ Requires knowing exact text
- ⚠️ No semantic understanding
- ⚠️ Can't find by "what code does"
- ⚠️ May return too many results for common terms

---

## 6. 📁 TOOL 3: GLOB (File Pattern Matching)

### When to Use

**Primary scenarios:**

1. **File structure exploration**
   - Finding all files of a type
   - Exploring directory structure
   - Locating files by naming pattern

2. **Batch operations**
   - Processing multiple files
   - Finding files by extension
   - Locating files in specific directories

### Examples

```javascript
// Find all JavaScript files
glob("**/*.js")

// Find all files in src/components/
glob("src/components/**/*")

// Find all CSS files
glob("**/*.css")

// Find files matching pattern
glob("src/**/*_video.js")
```

### Strengths

- ✅ Extremely fast
- ✅ Perfect for file navigation
- ✅ Supports wildcards and patterns
- ✅ No API calls needed

### Limitations

- ⚠️ Only matches file names/paths
- ⚠️ No content understanding
- ⚠️ Can't find by behavior
- ⚠️ Requires knowing file naming conventions

---

## 7. 📋 COMPARISON MATRIX

### Scenario-Based Tool Selection

| Scenario | Use This Tool | Example |
|----------|--------------|---------|
| **You know the file path** | `Read()` | `Read("src/hero/hero_video.js")` |
| **Find by behavior/intent** | `semantic_search()` | `semantic_search("Find video playback code")` |
| **Find specific function calls** | `Grep()` | `Grep("initVideoPlayer", output_mode="content")` |
| **Find all files of type** | `glob()` | `glob("**/*.js")` |
| **Understand how feature works** | `semantic_search()` | `semantic_search("How do we handle form validation?")` |
| **Find TODO comments** | `Grep()` | `Grep("TODO:", output_mode="content")` |
| **Explore directory structure** | `glob()` | `glob("src/components/**/*")` |
| **Find related components** | `semantic_search()` | `semantic_search("Find code related to navigation")` |
| **Locate exact error message** | `Grep()` | `Grep("Invalid email address", output_mode="content")` |

---

## 8. 🔄 COMBINED WORKFLOW PATTERNS

### Pattern 1: Discovery → Read → Edit

**Use semantic search for discovery, then view for details:**

```javascript
// Step 1: Discover with semantic search
semantic_search("Find email validation logic")
// Returns: src/form/form_validation.js

// Step 2: Read full context
Read("src/form/form_validation.js")

// Step 3: Make changes
edit(...) or write(...)
```

### Pattern 2: Broad Search → Narrow Down

**Start with semantic, refine with grep:**

```javascript
// Step 1: Find general area
semantic_search("Find modal components")
// Returns: src/components/modal.js

// Step 2: Find specific usage
Grep("modal.open", output_mode="content")
// Shows all places where modal is opened
```

### Pattern 3: Structure → Content

**Use glob for structure, semantic for understanding:**

```javascript
// Step 1: Find all component files
glob("src/components/**/*.js")

// Step 2: Understand specific component
semantic_search("How does the video player component work?")
```

---

## 9. ✅ BEST PRACTICES

### For Semantic Search Queries

| Practice | Good Example | Bad Example |
|----------|-------------|-------------|
| **Be specific about intent** | "Find code that validates email addresses in contact forms" | "Find email code" |
| **Use natural language** | "Show me where we handle page load errors" | "grep error handler" |
| **Describe what code does** | "Find code that initializes video players on page load" | "Find initVideoPlayer" |
| **Focus on behavior** | "How do we prevent duplicate form submissions?" | "Find form code" |
| **Ask about relationships** | "What code depends on Motion.dev library?" | "Show Motion imports" |

### For Grep Searches

- ✅ Use exact symbols when known
- ✅ Use regex for pattern matching
- ✅ Specify output_mode for better results
- ✅ Combine with context flags (-A, -B, -C) when needed

### For Glob Searches

- ✅ Use wildcards (**/*) for recursive searches
- ✅ Specify file extensions explicitly
- ✅ Use directory paths to narrow scope
- ✅ Combine with other tools for content search

---

## 10. ❌ COMMON MISTAKES

### Mistake 1: Using Semantic Search for Known Paths

```
❌ semantic_search("Find the content of hero_video.js")
✅ Read("src/hero/hero_video.js")
```

**Why:** If you know the path, view is faster and doesn't require API calls.

### Mistake 2: Using Grep for Intent-Based Discovery

```
❌ Grep("video", output_mode="content")  // Too broad, many false positives
✅ semantic_search("Find code that handles video playback")
```

**Why:** Semantic search understands intent and context better than keyword matching.

### Mistake 3: Using Glob for Content Search

```
❌ glob("**/*video*")  // Only matches filenames containing "video"
✅ semantic_search("Find code related to video functionality")
```

**Why:** Glob only matches file names/paths, not content. Use semantic search for behavior-based discovery.

---

## 11. 🔍 DECISION HELPER

**Ask yourself these questions:**

1. **Do I know the exact file path?**
   - YES → Use `Read()`
   - NO → Continue

2. **Do I know what the code does (behavior/intent)?**
   - YES → Use `semantic_search()`
   - NO → Continue

3. **Am I searching for exact text/symbols?**
   - YES → Use `Grep()`
   - NO → Continue

4. **Am I exploring file structure/patterns?**
   - YES → Use `glob()`
   - NO → Default to `semantic_search()`

---

## 12. 📝 SUMMARY

**Core principle:** Choose tools based on what you know:

- **Know the path** → `Read()`
- **Know the intent** → `semantic_search()`
- **Know the text** → `Grep()`
- **Know the pattern** → `glob()`

When in doubt, use semantic search. It's designed to help you discover what you don't know exists.