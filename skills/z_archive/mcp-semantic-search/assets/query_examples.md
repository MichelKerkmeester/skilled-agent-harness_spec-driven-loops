# 📚 Query Examples - Semantic Search in Practice

Categorized collection of example queries demonstrating effective semantic search usage patterns for CLI AI agents.

---

## 1. 📋 FEATURE DISCOVERY

**Find code by feature name or capability:**

```
"Find code that handles video playback initialization"
"Find code that validates email addresses in forms"
"Find the cookie consent modal implementation"
"Show me where we handle page load animations"
"Show me the navigation dropdown logic"
"Find form validation logic"
"Show me the video player code"
"Find the navigation dropdown implementation"
"Where is the contact form implementation?"
```

**When to use:** You know the feature name but not where it's implemented.

**Expected results:** Files implementing that specific feature, ranked by relevance.

---

## 2. 🎯 BEHAVIOR-BASED QUERIES

**Find code by what it does:**

```
"Find code that prevents duplicate form submissions"
"Find code that lazy-loads images on scroll"
"Find code that tracks user interactions"
"Find code that handles video loading errors"
"Find code that validates user input before submission"
"Show me code that handles page transitions"
"Find code that initializes components on page load"
"What code prevents XSS attacks?"
```

**When to use:** You know the behavior/action but not the implementation details.

**Expected results:** Code blocks performing that specific behavior.

---

## 3. 🔗 INTEGRATION & LIBRARY USAGE

**Find usage of specific libraries or integrations:**

```
"How do we use Motion.dev?"
"Find Webflow-specific code"
"Show me CDN initialization patterns"
"What code depends on Motion.dev library?"
"Find code that uses Voyage AI API"
"Show me where we integrate with external APIs"
"How do we use tree-sitter for parsing?"
```

**When to use:** Understanding how external libraries are integrated.

**Expected results:** Code using those libraries, integration patterns, configuration.

---

## 4. 🧩 COMPONENT DISCOVERY

**Find specific UI components:**

```
"Find modal components"
"Show me button components"
"Find navigation components"
"Where are the form input components?"
"Find hero section components"
"Show me dropdown menu implementations"
"Find video player components"
```

**When to use:** Locating UI component implementations.

**Expected results:** Component files, related styles, initialization code.

---

## 5. ✅ VALIDATION & ERROR HANDLING

**Find validation and error handling logic:**

```
"Find email validation in contact forms"
"Show me form validation logic"
"How do we handle video playback errors?"
"Find error handling for API requests"
"Where do we validate user input?"
"Show me error messages and handling"
"Find input sanitization code"
"How do we handle page load errors?"
```

**When to use:** Understanding validation rules and error handling patterns.

**Expected results:** Validation functions, error handling code, error messages.

---

## 6. ⚙️ INITIALIZATION & SETUP

**Find initialization and configuration code:**

```
"Find video initialization code"
"Show me page load initialization sequence"
"How do we initialize Motion.dev?"
"Find component setup and configuration"
"Where do we initialize event listeners?"
"Show me CDN script initialization"
"Find animation initialization on page load"
```

**When to use:** Understanding app/component initialization flow.

**Expected results:** Initialization functions, setup sequences, configuration code.

---

## 7. 🔄 CROSS-FILE RELATIONSHIPS

**Understand dependencies and interactions:**

```
"What code depends on the video player?"
"What components use the navigation dropdown?"
"How does navigation interact with page transitions?"
"What code imports form validation?"
"Show me dependencies between hero section and video player"
"What modules depend on Motion.dev?"
```

**When to use:** Understanding code relationships and dependencies.

**Expected results:** Files that import, use, or depend on specified code.

---

## 8. 🏗️ PROJECT-SPECIFIC (ANOBEL.COM)

**Queries specific to anobel.com project:**

```
"Find video player implementation in hero section"
"Show me modal components in the UI"
"Where is the contact form validation?"
"How do we handle page transitions?"
"Find cookie consent implementation"
"Show me navigation dropdown in header"
"Find animation configurations for hero"
"Where do we initialize Webflow interactions?"
```

**When to use:** Navigating the anobel.com codebase.

**Expected results:** Project-specific implementations.

---

## 9. 💡 GOOD VS BAD EXAMPLES

### Example Set 1: Email Validation

**❌ Bad (too generic):**

```
"Find email code"
```

**✅ Good (specific intent):**

```
"Find code that validates email addresses in contact forms"
```

**Why:** Specific about intent (validation), location (contact forms), and subject (email).

### Example Set 2: Video Player

**❌ Bad (grep syntax):**

```
"grep initVideoPlayer"
```

**✅ Good (natural language):**

```
"Find code that initializes video players on page load"
```

**Why:** Natural language describing behavior, not looking for specific function name.

### Example Set 3: Form Submission

**❌ Bad (symbol search):**

```
"Find submitForm function"
```

**✅ Good (behavior description):**

```
"Find code that handles form submissions and validation"
```

**Why:** If you know the symbol name, use grep. Semantic search is for finding by behavior.

### Example Set 4: Animation

**❌ Bad (file path):**

```
"Show me src/animations/hero.js"
```

**✅ Good (intent-based):**

```
"Find animation code for the hero section"
```

**Why:** If you know the file path, use Read(). Semantic search is for discovery.

---

## 11. 🔄 WORKFLOW EXAMPLES

### Workflow 1: Discover → Read → Analyze

**Goal:** Understand email validation implementation

```javascript
// Step 1: Discover with semantic search
semantic_search("Find email validation logic in contact forms")
// Result: src/form/form_validation.js

// Step 2: Read full context
Read("src/form/form_validation.js")

// Step 3: Analyze and understand
// Now you can see the full implementation
```

### Workflow 2: Feature → Dependencies → Integration

**Goal:** Understand video player and its dependencies

```javascript
// Step 1: Find main implementation
semantic_search("Find video player initialization code")
// Result: src/hero/hero_video.js

// Step 2: Find dependencies
semantic_search("What code depends on the video player?")
// Result: src/components/hero_section.js, others

// Step 3: Read integration points
Read("src/components/hero_section.js")
```

### Workflow 3: Problem → Solution Discovery

**Goal:** Find how duplicate submissions are prevented

```javascript
// Step 1: Problem-based query
semantic_search("How do we prevent duplicate form submissions?")
// Result: src/form/form_submission.js

// Step 2: Read implementation
Read("src/form/form_submission.js")

// Step 3: Find similar patterns
semantic_search("Find code that prevents duplicate actions")
```

---

## 12. 🧠 CONTEXT-ENHANCED QUERIES

### Adding "in [LOCATION]" Context

**Basic:**

```
"Find validation logic"
```

**Enhanced with location:**

```
✅ "Find validation logic in contact forms"
✅ "Find validation logic in user registration"
✅ "Find validation logic in checkout process"
```

### Adding "for [PURPOSE]" Context

**Basic:**

```
"Find error handling"
```

**Enhanced with purpose:**

```
✅ "Find error handling for form submission failures"
✅ "Find error handling for video playback issues"
✅ "Find error handling for API request timeouts"
```

### Adding "when [TRIGGER]" Context

**Basic:**

```
"Find initialization code"
```

**Enhanced with trigger:**

```
✅ "Find initialization code on page load"
✅ "Find initialization code when user clicks button"
✅ "Find initialization code after DOM ready"
```

---

## 13. 🔍 ADVANCED QUERY PATTERNS

### Pattern: Multi-Aspect Queries

**Combine what + where + when:**

```
"Find code that validates email addresses in contact forms before submission"

Aspects:
- What: validates email addresses
- Where: in contact forms
- When: before submission
```

**Result:** Highly targeted, relevant code.

### Pattern: Comparative Queries

**Compare implementations:**

```
"How do we handle errors in form submissions vs API requests?"
"Compare email validation in signup vs contact forms"
"What's different between modal and dropdown implementations?"
```

**Result:** Understanding different approaches to similar problems.

### Pattern: Discovery Queries

**Explore capabilities:**

```
"What validation logic exists in this project?"
"What animation libraries are used?"
"What external APIs do we integrate with?"
```

**Result:** Broad overview of codebase capabilities.

---

## 14. 📊 PROJECT-SPECIFIC INDEX STATS

**Current anobel.com index (as of 2025-11-25):**

- **Files:** 249 files indexed
- **Code blocks:** 496 chunks
- **Languages:** JavaScript, CSS, HTML, Markdown

**Main indexed directories:**

- `src/2_javascript/` - All JavaScript components
- `src/1_css/` - Styling and animations
- `src/0_html/` - HTML templates
- `.opencode/` - Knowledge base and skills

---

## 15. 💡 TIPS FOR BETTER RESULTS

### 1. Start Broad, Then Narrow

```javascript
// Broad discovery
semantic_search("Find video code")

// Review results, then narrow
semantic_search("Find video player initialization in hero section")
```

### 2. Use Natural Language

**Think like you're asking a person:**

- "How do we..."
- "Where do we..."
- "Find code that..."
- "Show me..."

### 3. Describe Behavior, Not Implementation

**Focus on what code does:**

✅ "Find code that prevents duplicate clicks"

**Not implementation details:**

❌ "Find clickCount variable"

### 4. Add Context When Needed

**If results aren't relevant:**

- Add location context: "in forms", "in hero section"
- Add purpose context: "for validation", "for error handling"
- Add trigger context: "on page load", "when clicked"

### 5. Trust the Judge Model

**Top results are reranked for relevance:**

- First result is usually most relevant
- Judge model understands nuanced intent
- If results seem off, rephrase query

---

## 16. ⚡ QUICK REFERENCE

### Query Patterns by Use Case

| Use Case | Pattern Template | Example |
|----------|------------------|---------|
| **Feature Discovery** | "Find code that handles [FEATURE]" | "Find code that handles video playback" |
| **Behavior Search** | "Find code that [DOES WHAT]" | "Find code that prevents duplicate submissions" |
| **Integration Discovery** | "How do we use [LIBRARY]?" | "How do we use Motion.dev?" |
| **Component Search** | "Find [COMPONENT] components" | "Find modal components" |
| **Validation Logic** | "Find [TYPE] validation in [WHERE]" | "Find email validation in contact forms" |
| **Initialization** | "Find [WHAT] initialization code" | "Find video initialization code" |
| **Dependencies** | "What code depends on [TARGET]?" | "What code depends on the video player?" |
| **Commit History** | "Find commits related to [FEATURE]" | "Find commits related to form validation" |

### When to Use Each Tool

| Your Knowledge State | Use This Tool | Example Query |
|---------------------|---------------|---------------|
| **Know exact path** | `Read(path)` | `Read("src/hero/hero_video.js")` |
| **Know what it does** | `semantic_search()` | "Find video playback code" |
| **Know exact symbol** | `Grep()` | `Grep("initVideoPlayer", output_mode="content")` |
| **Know file pattern** | `glob()` | `glob("**/*.js")` |

### Key Principles

1. **Use natural language** - Describe what you're looking for conversationally
2. **Focus on behavior** - What code does, not what it's called
3. **Add context** - Where, when, why to narrow scope
4. **Be specific** - Clear intent gets better results
5. **Trust reranking** - Top results are usually most relevant

### Query Enhancement Checklist

When results aren't perfect, add:
- **Location context**: "in contact forms", "in hero section"
- **Purpose context**: "for validation", "for error handling"
- **Trigger context**: "on page load", "when clicked"
- **Scope narrowing**: Be more specific about what the code does

**When in doubt**: Start broad → Review results → Refine with context → Iterate