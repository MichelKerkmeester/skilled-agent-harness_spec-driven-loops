---
title: Universal Patterns - Cross-Language Code Standards
description: Patterns applicable to ALL languages in OpenCode system code including naming principles, commenting philosophy, and reference comment patterns.
trigger_phrases:
  - "opencode universal patterns"
  - "cross language naming principles"
  - "commenting philosophy why"
  - "reference comment patterns"
importance_tier: normal
contextType: implementation
version: 1.0.0.22
---

# Universal Patterns - Cross-Language Code Standards

Patterns applicable to ALL languages in OpenCode system code.

---

## 1. OVERVIEW

### Purpose

This reference defines patterns that apply universally across JavaScript, TypeScript, Python, Shell, Rust, and JSON/JSONC in the OpenCode codebase. These principles ensure consistency regardless of language choice.

### Core Principle

> **Clarity over cleverness.** Code is read far more often than written. Optimize for the reader, not the writer.

### When to Use

- Before writing any new OpenCode system code
- When reviewing code for consistency
- When onboarding to OpenCode development patterns
- As the foundation before applying language-specific rules

### Key Sources (Evidence)

| Pattern | Source File | Line Reference |
|---------|-------------|----------------|
| Reference comments | `.opencode/skills/system-spec-kit/mcp-server/context-server.ts` | Near file top and import blocks |
| Section organization | `.opencode/skills/system-spec-kit/scripts/core/config.ts` | Numbered divider blocks |
| Naming conventions | `.opencode/skills/system-spec-kit/mcp-server/handlers/memory-search.ts` | Throughout |
| Python docstrings | `.opencode/skills/system-skill-advisor/mcp-server/scripts/skill_advisor.py` | Module and function docstrings |

---

## 2. NAMING PRINCIPLES

### Descriptive Names

Names should describe what something IS or DOES without requiring context:

**Good** (JS/TS use camelCase, Python/Shell use snake_case):
```javascript
// JavaScript
calculateMemoryScore()
validateInputLengths()
handleMemorySearch()
```
```typescript
// TypeScript (same as JS for functions; PascalCase for types)
calculateMemoryScore()
validateInputLengths()
interface SearchResult { }
type MemoryState = 'active' | 'archived';
```
```python
# Python
calculate_memory_score()
validate_input_lengths()
handle_memory_search()
```

**Bad**:
```
calcScore()
validateLengths()
handle()
```

### Avoid Abbreviations

Spell out words unless industry-standard:

| Use | Don't Use | Exception |
|-----|-----------|-----------|
| `configuration` | `cfg` | - |
| `database` | `db` | OK for `DB` in constants |
| `message` | `msg` | - |
| `request` | `req` | OK in route handlers |
| `response` | `res` | OK in route handlers |
| `HTTP` | `http` | OK - industry standard |
| `URL` | `url` | OK - industry standard |
| `ID` | `id` | OK - industry standard |

### Consistency Rule

Same concept = same name across the entire codebase:

```javascript
// GOOD: Consistent naming (JS/TS)
memorySearch()          // in handlers
handleMemorySearch()    // wrapper
MemorySearchResult      // type/interface (PascalCase)

// BAD: Inconsistent naming
memorySearch()          // in handlers
handle_search()         // wrapper - wrong convention!
SearchMemoryResult      // type - different word order!
```

### Boolean Naming

Booleans should read as questions:

```javascript
// JavaScript / TypeScript (camelCase)
isValid
hasResults
canProceed
shouldRetry
enableDedup
```

```typescript
// TypeScript — with type annotation
const isValid: boolean = true;
const hasResults: boolean = items.length > 0;
```

```python
# Python / Shell (snake_case)
is_valid
has_results
can_proceed
should_retry
enable_dedup
```

```
// BAD (any language)
valid      // is it valid? or make it valid?
results    // what about results?
proceed    // noun or verb?
```

### Plural Naming for Collections

Arrays and collections use plural names:

```
// GOOD
const memories = [];
const results = searchResults.items;
for (const entry of entries) { ... }

// BAD
const memory = [];        // misleading - it's an array
const result = results.items;  // confusing
for (const entry of entry) { ... }  // very confusing
```

---

## 3. COMMENTING PHILOSOPHY

### Core Principles

1. **Quantity limit:** Maximum 3 comments per 10 lines of code
2. **Focus on purposeful semantics:** Explain WHY something is done, not WHAT it does
3. **No commented-out code:** Delete unused code (git preserves history)
4. **Function purpose comments:** Single line above function describing intent
5. **Capitalization:** Every inline comment sentence MUST start with a capital letter
   - `// Process items in reverse order` (correct)
   - `// process items in reverse order` (wrong)
   - Exception: `eslint-disable`, `@ts-` directives, and technical identifiers (e.g., `// e.g. ...`)

### WHY Not WHAT

Comments explain **reasoning**, not **mechanics**:

**Bad - describes WHAT**:
```javascript
// Loop through items
for (const item of items) { ... }

// Increment counter
counter++;

// Check if valid
if (isValid) { ... }
```

**Good - explains WHY**:
```javascript
// Process in reverse order for dependency resolution
for (const item of items.reverse()) { ... }

// Track retry count for exponential backoff control
retryCount++;

// Skip invalid entries to avoid downstream embedding errors
if (!isValid) return null;
```

### When to Comment

| Situation | Comment? | Example |
|-----------|----------|---------|
| Non-obvious logic | YES | `// Sort timestamp DESC so newest appears first` |
| Business rule | YES | `// Constitutional tier must always surface regardless of score` |
| Workaround | YES | `// Works around an SDK hang on empty payloads` |
| Security concern | YES | `// SEC: sanitize input to prevent stored XSS (CWE-79)` |
| Self-explanatory code | NO | `const sum = a + b;` needs no comment |
| Obvious loops | NO | `for (let i = 0; i < 10; i++)` needs no comment |

### Comment Placement

Place comments on the line BEFORE the code they describe:

```javascript
// GOOD: Comment before
// Calculate weighted score using decay function
const score = calculateDecay(baseScore, age);

// BAD: Comment after
const score = calculateDecay(baseScore, age); // weighted decay
```

---

## 4. REFERENCE COMMENT PATTERNS

> **Governed by the canonical rule.** Comments must never embed an ephemeral-artifact pointer — a spec folder/number, a packet/phase/task/checklist/requirement id, a feature-catalog entry, an ADR id, or a ticket id. See [`../../universal/code-style-guide.md`](../../../../shared/references/universal/code-style-guide.md) §4 "No ephemeral-artifact pointers" for the allowed-vs-forbidden contract. Only a **durable** external standard may be cited in a comment.

### Hard-Block Comment-Hygiene Gate

Comment hygiene is not a soft style preference in OpenCode system code. Ephemeral-artifact pointers are a HARD-BLOCK gate for code comments: do not write spec-folder paths, ADR ids, requirement ids, checklist ids, task ids, packet/phase ids, or ticket-local references into comments. Replace them with the durable WHY that will still be true after a packet is renamed, archived, or deleted.

This is enforced in two real hooks:

- `.opencode/hooks/pre-commit` runs the shared checker against staged code files and blocks the commit when violations are found.
- `.opencode/skills/sk-code/code-quality/scripts/hooks/claude-posttooluse.sh` runs the same checker after Write/Edit tool use and surfaces immediate comment-hygiene warnings for the edited file.

### Allowed Reference Comments

| Prefix | Purpose | Allowed because | Example |
|--------|---------|-----------------|---------|
| `SEC:` | Security note tied to a stable standard | CWE/CVE/RFC ids are externally versioned and durable | `// SEC: sanitize user input to prevent stored XSS (CWE-79)` |
| `PERF:` | Performance constraint | Names a durable behavioral requirement, no artifact id | `// PERF: debounce to one reflow per frame` |
| `BUG` | Workaround for a durable external bug | Names the symptom + a durable tracker, not a spec-folder bug list | `// Works around an upstream SDK hang on empty payloads` |

### Removed prefixes — DO NOT USE

`T###`, `REQ-###`, and `CHK-###` are **removed**. They point into `tasks.md` / `spec.md` / `checklist.md` inside a spec folder that is renamed or archived independently of the code — exactly the dangling pointer the canonical rule forbids. Replace the id with the durable WHY:

```typescript
// BAD — points into an archived spec folder
// T043-T047: Causal Memory Graph handlers

// GOOD — names the behavior, which never gets archived
// Causal Memory Graph handlers: drift-why, causal-link, causal-stats, causal-unlink
handleMemoryDriftWhy, handleMemoryCausalLink, handleMemoryCausalStats, handleMemoryCausalUnlink,
```

### When to Use Reference Comments

1. **Security-sensitive code**: cite the durable standard (CWE/CVE/RFC) and the mitigation.
2. **Documented workaround**: name the durable external tracker plus the symptom.
3. **Never** to point at a spec folder, task, requirement, checklist, packet, phase, or ADR — capture the WHY instead.

### Design Principles Gate (KISS/DRY/SOLID)

Apply this gate before finalizing implementation:

1. **KISS**: remove speculative layers that do not serve current behavior.
2. **DRY**: centralize repeated literals/rules into a single source.
3. **SOLID**: flag SRP/OCP/LSP/ISP/DIP violations and simplify before merge.

Carry-over from 139: keep rule constants centralized and test imports referencing those constants (avoid duplicate local literals).

---

