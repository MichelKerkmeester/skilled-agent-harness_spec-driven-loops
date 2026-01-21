# Verbose Templates

> Extended templates with comprehensive guidance for new users (v2.0-verbose).

---

## 1. 📖 OVERVIEW

### What are Verbose Templates?

Verbose templates provide extended scaffolding with comprehensive guidance, multiple-choice clarifications, and inline examples. They have the same structure as core templates but include additional prompts to ensure nothing is missed.

### When to Use

| Scenario | Description |
|----------|-------------|
| **New to SpecKit** | First-time users who need guidance on what content to provide |
| **Complex Requirements** | Features with many unknowns requiring clarification |
| **Team Onboarding** | Training team members on specification best practices |
| **Stakeholder Alignment** | Features requiring detailed requirements gathering |
| **Uncertainty** | When you need prompts to ensure nothing is missed |

### Template Comparison

| Template Type | Lines | Guidance Level | Best For |
|---------------|-------|----------------|----------|
| **Core** | ~60-90 | Minimal | Experienced users, simple features |
| **Verbose** | ~200-300 | Comprehensive | New users, complex requirements |

---

## 2. 📁 STRUCTURE

### Core Templates (Base)

| File | Purpose |
|------|---------|
| `core/spec-core-verbose.md` | Feature specification with full guidance |
| `core/plan-core-verbose.md` | Implementation plan with full guidance |
| `core/tasks-core-verbose.md` | Task breakdown with full guidance |
| `core/impl-summary-core-verbose.md` | Implementation summary with full guidance |

### Level-Specific Templates

| Level | Files | Description |
|-------|-------|-------------|
| `level_1/` | spec, plan, tasks, implementation-summary | Small features (<100 LOC) |
| `level_2/` | Level 1 + checklist | Medium features (100-499 LOC), QA validation |
| `level_3/` | Level 2 + decision-record | Large features (500+ LOC), architecture changes |
| `level_3+/` | Level 3 + governance sections | Large features with formal governance |

---

## 3. ⚡ FEATURES

### Verbose Patterns

#### `[YOUR_VALUE_HERE: description]`

**Purpose**: Placeholder requiring user input with contextual guidance.

```
[YOUR_VALUE_HERE: Describe the specific problem, pain point, or gap.
What is broken, missing, or inefficient today? Be specific about user impact.]
```

#### `[NEEDS CLARIFICATION: (a) (b) (c)]`

**Purpose**: Multiple-choice questions for ambiguous requirements.

```
[NEEDS CLARIFICATION: What authentication method is required?
  (a) JWT tokens - stateless, scalable
  (b) Session-based - simpler, server state
  (c) OAuth 2.0 - external identity providers
  (d) Existing system - inherit current auth]
```

#### `[example: specific content]`

**Purpose**: Inline examples demonstrating expected quality and format.

```
[example: Users currently cannot track their API usage, leading to unexpected
billing overages and inability to optimize consumption patterns.]
```

### Verbose-Only Sections

| Template | Verbose-Only Section | Purpose |
|----------|---------------------|---------|
| `spec-core-verbose.md` | **8. ASSUMPTIONS** | Documents assumptions to identify potential project risks |
| `plan-core-verbose.md` | **8. COMPLEXITY JUSTIFICATION** | Justifies complexity trade-offs when implementation exceeds simplest solution |

---

## 4. 🚀 QUICK START

### Migration: Verbose to Core

After completing a verbose template, convert to core format:

1. Remove all `[example: ...]` lines
2. Replace `[YOUR_VALUE_HERE: ...]` with actual content
3. Resolve all `[NEEDS CLARIFICATION: ...]` items
4. Delete guidance comments
5. Result: Clean core-format document

### Best Practices

1. **Don't skip clarifications** - `[NEEDS CLARIFICATION]` items often reveal hidden requirements
2. **Use examples as calibration** - Examples show expected depth and quality
3. **Delete placeholders after filling** - Clean document after completion
4. **Escalate unresolved items** - Move unresolved clarifications to "Open Questions"

---

## 5. 📚 RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [Core Templates](../core/README.md) | Minimal base templates |
| [Level 1 Templates](../level_1/README.md) | Small feature templates |
| [Level 2 Templates](../level_2/README.md) | Medium feature templates |
| [Level 3 Templates](../level_3/README.md) | Large feature templates |
| [Level 3+ Templates](../level_3+/README.md) | Enterprise governance templates |
