# Query Patterns: Effective Semantic Search

Comprehensive guide for writing effective semantic search queries that return relevant results.

---

## 1. 📖 INTRODUCTION & PURPOSE

### What Is This Reference?

This reference provides comprehensive patterns and techniques for writing effective semantic search queries that return highly relevant results.

**Core Purpose**:
- **Query patterns** - 5 proven query structure patterns
- **Best practices** - Natural language, specificity, behavior focus
- **Common mistakes** - Anti-patterns to avoid
- **Query templates** - Reusable templates for common scenarios

**Progressive Disclosure Context**:
```
Level 1: SKILL.md metadata (name + description)
         └─ Always in context (~100 words)
            ↓
Level 2: SKILL.md body
         └─ When skill triggers (<5k words)
            ↓
Level 3: Reference files (this document)
         └─ Loaded as needed for query writing guidance
```

This reference file provides Level 3 deep-dive technical guidance on effective query writing.

### Core Principle

**"Describe what code does, not what it's called - semantic search finds by behavior, not symbols."**

**Prerequisites**: Understand tool selection from tool_comparison.md:
- **Tool choice**: Use semantic search for intent, grep for symbols
- **When to use**: See [tool_comparison.md](./tool_comparison.md) for decision framework
- **See**: [SKILL.md](../SKILL.md) for system overview

---

## 2. 📋 OVERVIEW

Semantic search understands **intent and context**, not just keywords. This guide teaches you how to write queries that leverage this capability for maximum relevance.

---

## 3. 🎯 QUERY STRUCTURE PATTERNS

### Pattern 1: Action-Based Queries

**Format:** "Find code that [ACTION] [OBJECT]"

**Examples:**

```
✅ "Find code that validates email addresses"
✅ "Find code that handles form submissions"
✅ "Find code that initializes video players"
✅ "Find code that prevents duplicate clicks"
```

**Why this works:** Focuses on behavior/action, which is what semantic search excels at understanding.

### Pattern 2: Question-Based Queries

**Format:** "How do we [ACTION]?" or "Where do we [ACTION]?"

**Examples:**

```
✅ "How do we handle page transitions?"
✅ "Where do we validate user input?"
✅ "How do we prevent form resubmission?"
✅ "Where do we initialize Motion.dev?"
```

**Why this works:** Natural language that clearly expresses intent.

### Pattern 3: Feature-Based Queries

**Format:** "Find [FEATURE] implementation" or "Show me [FEATURE] code"

**Examples:**

```
✅ "Find cookie consent implementation"
✅ "Show me the video player code"
✅ "Find the navigation dropdown logic"
✅ "Show me modal component implementation"
```

**Why this works:** Clearly specifies the feature you're looking for.

### Pattern 4: Relationship-Based Queries

**Format:** "What code [RELATIONSHIP] [TARGET]?"

**Examples:**

```
✅ "What code depends on the video player?"
✅ "What components use Motion.dev?"
✅ "What code interacts with navigation?"
✅ "What modules import form validation?"
```

**Why this works:** Helps discover cross-file relationships and dependencies.

### Pattern 5: Context-Specific Queries

**Format:** "Find [WHAT] in [WHERE]" or "Find [WHAT] for [CONTEXT]"

**Examples:**

```
✅ "Find validation logic in contact forms"
✅ "Find animation code for the hero section"
✅ "Find error handling in form submissions"
✅ "Find initialization code for video components"
```

**Why this works:** Narrows scope with context, improving relevance.

---

## 4. ✅ BEST PRACTICES

### 1. Be Specific About Intent

**Good examples:**

```
✅ "Find code that validates email addresses in contact forms"
✅ "Find code that handles video playback errors"
✅ "Find code that initializes the hero video on page load"
```

**Bad examples:**

```
❌ "Find email code"
❌ "Find video stuff"
❌ "Find hero things"
```

**Why:** Specific intent helps judge model understand exactly what you're looking for.


### 2. Use Natural Language

**Good examples:**

```
✅ "Show me where we handle page load errors"
✅ "How do we prevent duplicate form submissions?"
✅ "Find code that initializes video players on page load"
```

**Bad examples:**

```
❌ "grep error handler"
❌ "show video init function"
❌ "find modal.open()"
```

**Why:** Semantic search is designed for natural language, not code syntax or grep patterns.


### 3. Describe What Code Does (Behavior)

**Good examples:**

```
✅ "Find code that prevents form resubmission"
✅ "Find code that lazy-loads images"
✅ "Find code that tracks scroll position"
```

**Bad examples:**

```
❌ "Find submitForm function"
❌ "Find lazyLoad class"
❌ "Find scrollY variable"
```

**Why:** Semantic search finds by behavior, not symbol names. Use grep for specific symbols.


### 4. Focus on Behavior Over Symbols

**Good examples:**

```
✅ "How do we validate email addresses before submission?"
✅ "Find code that handles video player initialization"
✅ "Show me modal opening and closing logic"
```

**Bad examples:**

```
❌ "Find validateEmail function"
❌ "Find initPlayer call"
❌ "Find modal.show() usage"
```

**Why:** If you know the exact symbol, use grep. Semantic search is for when you don't know the implementation details.


### 5. Ask About Relationships

**Good examples:**

```
✅ "What code depends on Motion.dev library?"
✅ "What components use the video player?"
✅ "How does navigation interact with page transitions?"
```

**Bad examples:**

```
❌ "Find Motion imports"
❌ "Show video player references"
❌ "Find nav and page_transition files"
```

**Why:** Semantic search understands relationships and can find related code across files.

---

## 5. ❌ COMMON MISTAKES

### Mistake 1: Using Grep Syntax

```
❌ "grep -r 'initVideoPlayer' src/"
❌ "find . -name '*video*.js'"
❌ "search for TODO comments"
```

**Fix:**

```
✅ "Find code that initializes video players"
✅ "Find video-related JavaScript files"
✅ "Find unfinished or TODO items in the code"
```

**Why:** Semantic search uses natural language, not command-line syntax.


### Mistake 2: Too Generic

```
❌ "Find JavaScript code"
❌ "Show me functions"
❌ "Find form stuff"
```

**Fix:**

```
✅ "Find JavaScript code that handles form validation"
✅ "Show me functions that validate user input"
✅ "Find form submission and validation logic"
```

**Why:** Generic queries return too many irrelevant results. Be specific about what you're looking for.


### Mistake 3: Looking for Exact Symbols

```
❌ "Find all calls to initVideoPlayer"
❌ "Find validateEmail function definition"
❌ "Show me where modal.open() is used"
```

**Fix (use grep instead):**

```
✅ Grep("initVideoPlayer", output_mode="content")
✅ Grep("function validateEmail", output_mode="content")
✅ Grep("modal.open()", output_mode="content")
```

**Why:** If you know the exact symbol, grep is faster and more precise than semantic search.


### Mistake 4: File Path Queries

```
❌ "Find the content of hero_video.js"
❌ "Show me what's in src/components/modal.js"
```

**Fix (use view instead):**

```
✅ Read("src/hero/hero_video.js")
✅ Read("src/components/modal.js")
```

**Why:** If you know the file path, view is faster and doesn't require API calls.

---

## 6. 🔧 QUERY ENHANCEMENT TECHNIQUES

### Technique 1: Add Context

**Basic query:**

```
"Find email validation"
```

**Enhanced with context:**

```
✅ "Find email validation in contact forms"
✅ "Find email validation that runs before form submission"
✅ "Find email validation logic for user registration"
```

**Result:** More targeted, relevant results.


### Technique 2: Specify Scope

**Basic query:**

```
"Find animation code"
```

**Enhanced with scope:**

```
✅ "Find animation code in the hero section"
✅ "Find animation code for page transitions"
✅ "Find animation code using Motion.dev library"
```

**Result:** Narrows results to specific area.


### Technique 3: Ask About Purpose

**Basic query:**

```
"Find error handling"
```

**Enhanced with purpose:**

```
✅ "Find error handling for form submission failures"
✅ "Find error handling for video playback issues"
✅ "Find error handling for API request timeouts"
```

**Result:** Helps distinguish between different error handling scenarios.


### Technique 4: Describe Trigger/Timing

**Basic query:**

```
"Find video initialization"
```

**Enhanced with trigger:**

```
✅ "Find video initialization on page load"
✅ "Find video initialization when user clicks play"
✅ "Find video initialization after DOM is ready"
```

**Result:** Clarifies the specific initialization point you're looking for.


### Technique 5: Complete Query Transformations

**These examples show full before/after transformations with rationale:**

#### Transformation 1: Generic to Specific

**❌ BEFORE** (too generic):
```
"Find form code"
```

**Why it fails**: Returns hundreds of irrelevant results (all form-related files). Too broad to be useful.

**✅ AFTER** (specific intent):
```
"Find code that validates email addresses in contact forms before submission"
```

**Context added**:
- **What**: validates email addresses
- **Where**: in contact forms
- **When**: before submission

**Result**: 3 highly relevant files instead of 150+ form files. Pinpoints exact validation logic needed.


#### Transformation 2: Symbol-Based to Behavior-Based

**❌ BEFORE** (symbol search):
```
"Find validateEmail function"
```

**Why wrong tool**: If you know the symbol name, use grep instead:
```javascript
Grep("validateEmail", output_mode="content")
```

**✅ AFTER** (behavior description):
```
"Find code that checks if email format is valid"
```

**Why better**: Semantic search finds ALL email validation logic regardless of function names. Discovers alternative implementations you didn't know existed. Use semantic search when you don't know how it's implemented.


#### Transformation 3: File Path to Intent

**❌ BEFORE** (path-based):
```
"Show me src/form/validation.js"
```

**Why wrong tool**: If you know the path, use view directly:
```javascript
Read("src/form/validation.js")
```
Faster, no API call, no vector search needed.

**✅ AFTER** (intent-based):
```
"How do we validate user input in forms?"
```

**Why better**: Discovers validation logic across ALL form implementations, not just one file. Reveals patterns, relationships, and design decisions across the codebase.


#### Transformation 4: Vague to Contextual

**❌ BEFORE** (vague, no context):
```
"Find video stuff"
```

**Why it fails**: "Stuff" is meaningless. Returns everything video-related with no relevance ranking.

**✅ AFTER** (clear intent + context):
```
"Find code that initializes video players in the hero section on page load"
```

**Context added**:
- **Clear subject**: video players (not "stuff")
- **Location**: hero section
- **Trigger**: on page load

**Result**: Precisely targets hero video initialization code. From 200+ video files to 2-3 relevant ones.


#### Transformation 5: Keyword to Natural Language

**❌ BEFORE** (grep-style keywords):
```
"modal open close click"
```

**Why wrong approach**: Semantic search expects natural language, not keywords. This confuses the model.

**✅ AFTER** (natural language query):
```
"Show me how modals are opened and closed when users click buttons"
```

**Why better**: Natural language provides context and relationships. Model understands "opened", "closed", "users click buttons" as connected actions in a user flow, not isolated keywords.

---

## 7. 📝 QUERY TEMPLATES

### Template 1: Feature Discovery

```
"Find code that handles [FEATURE]"
"Show me the [FEATURE] implementation"
"Where do we implement [FEATURE]?"
"How does [FEATURE] work in this codebase?"
```

**Examples:**

- "Find code that handles cookie consent"
- "Show me the form validation implementation"
- "Where do we implement video playback?"
- "How does the navigation dropdown work?"

### Template 2: Behavior Search

```
"Find code that [DOES WHAT]"
"What code [PERFORMS ACTION]?"
"Show me code that [BEHAVIOR]"
```

**Examples:**

- "Find code that prevents duplicate submissions"
- "What code validates email addresses?"
- "Show me code that lazy-loads images"

### Template 3: Dependency Discovery

```
"What code depends on [LIBRARY/MODULE]?"
"What components use [FEATURE]?"
"How does [A] interact with [B]?"
```

**Examples:**

- "What code depends on Motion.dev?"
- "What components use the video player?"
- "How does navigation interact with page transitions?"

### Template 4: Problem Solving

```
"How do we handle [PROBLEM]?"
"How do we prevent [ISSUE]?"
"What protects against [VULNERABILITY]?"
```

**Examples:**

- "How do we handle video loading errors?"
- "How do we prevent form resubmission?"
- "What protects against XSS attacks?"

---

## 8. 🚀 ADVANCED QUERY PATTERNS

### Pattern: Multi-Aspect Queries

**Combine multiple aspects for precision:**

```
✅ "Find code that validates email addresses in contact forms before submission"
✅ "Find code that initializes video players on page load for the hero section"
✅ "Find code that handles form submission errors and displays user feedback"
```

**Aspects included:**

- **What:** validates email addresses
- **Where:** in contact forms
- **When:** before submission


### Pattern: Comparative Queries

**Compare implementations:**

```
✅ "How do we handle errors in form submissions vs API requests?"
✅ "What's the difference between modal and dropdown implementations?"
✅ "Compare email validation in signup vs contact forms"
```

**Use case:** Understanding different approaches to similar problems.


### Pattern: Discovery Queries

**Explore unknown areas:**

```
✅ "What validation logic exists in this project?"
✅ "What animation libraries are used?"
✅ "What external APIs do we call?"
```

**Use case:** Learning about codebase capabilities.

---

## 9. 🔄 WORKFLOW INTEGRATION

### Workflow 1: Discovery → Read → Edit

```javascript
// Step 1: Discover with semantic search
semantic_search("Find email validation logic")
// Returns: src/form/form_validation.js

// Step 2: Read full context
Read("src/form/form_validation.js")

// Step 3: Make changes
edit(...) or write(...)
```


### Workflow 2: Broad → Narrow

```javascript
// Step 1: Find general area
semantic_search("Find modal components")
// Returns: src/components/modal.js

// Step 2: Find specific usage
Grep("modal.open", output_mode="content")
// Shows all places where modal is opened
```


### Workflow 3: Related Code Discovery

```javascript
// Step 1: Find primary implementation
semantic_search("Find video player initialization")
// Returns: src/hero/hero_video.js

// Step 2: Find related components
semantic_search("What code depends on the video player?")
// Returns: Components that use video player

// Step 3: Understand integration
Read("src/components/hero_section.js")
```

---

## 10. 🔁 QUERY REFINEMENT WORKFLOW

### The 3 Phases

You should follow this process when results aren't relevant. Complete each phase before proceeding to the next.

#### Phase 1: Initial Query

**Purpose**: Submit natural language query describing behavior

**Actions**:
1. Write query in natural language describing what code does
2. Add context if known ("in forms", "for feature")
3. Submit to semantic_search
4. Review top 3-5 results for relevance

**Validation**: `initial_results_relevant`
- Do top results match your intent?
- Are result snippets related to query?
- Are file paths logical for the feature?

**If validation passes**: Task complete - use results
**If validation fails**: Proceed to Phase 2


#### Phase 2: Query Refinement

**Purpose**: Improve query specificity and context

**Actions**:
1. Add more context ("in contact forms", "for hero section")
2. Specify scope (component name, module, feature area)
3. Add trigger/timing information if relevant ("on page load", "before submission")
4. Rephrase using different query pattern (see Section 3)
5. Resubmit refined query

**Validation**: `refined_results_improved`
- Did result relevance improve vs Phase 1?
- Are top results now on-target for your intent?
- Do results provide actionable code locations?

**If validation passes**: Task complete - use improved results
**If validation fails**: Proceed to Phase 3


#### Phase 3: Tool Reassessment

**Purpose**: Verify you're using the right tool for your knowledge state

**Actions**:
1. Reassess what you know:
   - Know exact file path? → Use `Read(path)` instead
   - Know exact symbol/function name? → Use `Grep("symbol")` instead
   - Exploring file structure? → Use `glob("**/*.js")` instead
2. Check for query mistakes:
   - Using grep syntax? (use natural language instead)
   - Too generic? (add specificity)
   - Looking for exact symbols? (use grep instead)
3. Try alternative phrasing:
   - Action-based: "Find code that [action]"
   - Question-based: "How do we [action]?"
   - Feature-based: "Find [feature] implementation"

**Validation**: `correct_tool_selected`
- Is semantic search the right tool for this task?
- Have you verified query follows best practices? (Section 4)
- Have you checked common mistakes? (Section 5)

**If correct tool**: Return to Phase 1 with new query approach
**If wrong tool**: Switch to appropriate tool (grep/glob/Read)


### Workflow Summary

```
Phase 1: Initial Query
   ↓
Results relevant? ──YES──→ COMPLETE
   ↓
   NO
   ↓
Phase 2: Refine Query
   ↓
Results improved? ──YES──→ COMPLETE
   ↓
   NO
   ↓
Phase 3: Reassess Tool
   ↓
Right tool? ──NO──→ Switch to grep/glob/Read → COMPLETE
   ↓
   YES
   ↓
Return to Phase 1 with new approach
```

---

## 11. 🤖 TRUST THE JUDGE MODEL

### How Reranking Works

**Search process:**

1. Query converted to vector
2. Similar vectors retrieved from database
3. **Judge model (voyage-3) reranks results**
4. Top results returned

**Why trust it:**

- Judge model understands nuanced intent
- Trained specifically for relevance scoring
- Dramatically improves result quality
- Top results are usually most relevant

### When Results Seem Off

**If results don't match expectations:**

1. **Rephrase query more specifically**
   ```
   Original: "Find email code"
   Revised: "Find code that validates email addresses in contact forms"
   ```

2. **Add context**
   ```
   Original: "Find validation"
   Revised: "Find validation logic for user input in forms"
   ```

3. **Try different phrasing**
   ```
   Option 1: "How do we handle video playback?"
   Option 2: "Find code that initializes video players"
   Option 3: "Show me video player implementation"
   ```

4. **Check for typos or ambiguity**
   ```
   Ambiguous: "Find player code" (audio? video? user?)
   Clear: "Find video player code"
   ```

---

## 12. 💡 SUMMARY

### Key Principles

1. **Describe behavior, not symbols** - "what it does" not "what it's called"
2. **Use natural language** - Semantic search is designed for it
3. **Be specific** - Add context, scope, purpose
4. **Trust the judge** - Top results are reranked for relevance
5. **Iterate** - Rephrase if results aren't perfect

### Quick Decision Guide

- **Know the path?** → Use `Read()`
- **Know the symbol?** → Use `Grep()`
- **Know what it does?** → Use `semantic_search()`
- **Exploring structure?** → Use `glob()`

**When in doubt, use semantic search.** It's designed to help you discover what you don't know exists.