---
title: Optimization Procedure - AI-Friendly Docs
description: The optimization procedure - quality heuristics, analysis workflow, README strategy, and iteration - for converting docs into question-answering format. Routes to the 16-pattern catalog.
trigger_phrases:
  - "doc optimization patterns"
  - "ai friendly documentation"
  - "question answering format"
  - "transformation patterns markdown"
importance_tier: normal
contextType: implementation
version: 1.8.0.17
---

# Optimization Procedure - AI-Friendly Docs

The procedure for converting reference-style documentation into question-answering format. `SKILL.md` §3 owns the executable optimization steps; this file is the overflow detail — the quality heuristics, the analysis workflow, the README priority strategy, the snippet checklist, and the iteration loop. The 16 transformation patterns each have a worked before/after example in the [transformation pattern catalog](./transformation-patterns.md).

---

## 1. OVERVIEW

### What Is Optimization?

Optimization transforms documentation from reference-style to question-answering format, making it highly AI-friendly through systematic application of 16 proven transformation patterns.

**Core Purpose**:
- **AI-friendliness** - Convert API docs to usage examples
- **Question coverage** - Answer 15-20 common developer questions
- **Code completeness** - Runnable, standalone examples with imports
- **Metadata removal** - Strip non-instructional content

> **📍 Context**: This is a Level 3 reference file (loaded on-demand). For the complete progressive disclosure architecture, see [skill_creation/overview.md § Skill Structure System](../../create-skill/references/shared/overview.md#3-skill-structure-system).

### Core Principle

**"Answer questions, don't document APIs"** - Developers ask "How do I...?", not "What is the signature of...?". Optimize for the questions that matter.

---

## 2. QUALITY HEURISTICS (NON-SCORING)

These heuristics describe what “good” looks like. This skill does not compute an external score; use them as guidance.

| Metric | Weight | Purpose | Target |
|--------|--------|---------|--------|
| **Question-Snippet Matching** | 80% | How well docs answer developer questions | 15-20 questions answered |
| **LLM Evaluation** | 10% | AI assistant friendliness | Clear, concise, actionable |
| **Formatting** | 5% | Consistent code blocks and structure | Valid syntax, language tags |
| **Metadata Removal** | 2.5% | Remove non-instructional content | No licenses, citations, trees |
| **Initialization** | 2.5% | Combine imports with usage | No import-only snippets |

**Quality rubric (rough guidance)**:
- **Excellent**: Comprehensive, question-focused, AI-friendly
- **Good**: Minor gaps or formatting issues
- **Acceptable**: Needs more examples or has duplicates
- **Needs Work**: Significant gaps; restructure required

**Optimization priority**: Focus most effort on question coverage and executable examples.

---

## 3. ANALYSIS WORKFLOW

**Step 1: Audit Current State**
- Count question-answering snippets vs API-only snippets
- Identify import-only snippets (no usage)
- Find metadata snippets (licenses, citations, directory trees)
- Detect duplicates or very similar content

**Step 2: Generate Questions** (15-20 common developer questions)
- How do I install and set up [library]?
- How do I [main feature]?
- How do I handle errors?
- How do I configure [common setting]?
- How do I integrate with [use case]?

**Step 3: Map Questions to Snippets**
- Which questions are well-answered?
- Which have weak or missing answers?
- Which snippets don't answer important questions?

**Step 4: Apply Transformation Patterns**
- Pick the patterns that close the observed gaps and apply the before/after transform from the [pattern catalog](./transformation-patterns.md).

---

## 4. TRANSFORMATION PATTERNS

The 16 patterns, with a worked before/after example for each, live in the [transformation pattern catalog](./transformation-patterns.md). `SKILL.md` §3 Step 3 lists all 16 by name and impact/effort so you can choose without opening the catalog; open the catalog when you need the exact transform shape.

Pattern quick-index (see catalog for code):

1. API Reference → Usage Example
2. Import-Only → Complete Setup
3. Multiple Small → One Comprehensive
4. Remove Metadata
5. Add Error Handling
6. Combine Installation + First Usage
7. Add Configuration Examples
8. Demonstrate OAuth/Auth Patterns
9. Show Batch/Bulk Operations
10. Add Testing Examples
11. Provide Advanced Use Cases
12. Add Integration Examples
13. Clarify Common Pitfalls
14. Add Output Examples
15. Consolidate Duplicates
16. Fix Formatting

---

## 5. README OPTIMIZATION STRATEGY

**High Priority Sections**:
1. **Quick Start** - Installation + first usage (Pattern 2, Pattern 6)
2. **Common Use Cases** - Each major feature with complete example (Pattern 1, Pattern 3)
3. **Error Handling** - Realistic error scenarios (Pattern 5)
4. **Configuration** - Common config examples (Pattern 7)

**Medium Priority**:
5. **Advanced Features** - Complex use cases (Pattern 11)
6. **Integration Examples** - Popular tool integrations (Pattern 12)
7. **Testing** - How to test code using library (Pattern 10)

**Low Priority**:
8. **API Reference** - Keep but ensure each method has usage example

**Remove/Minimize**:
- Installation-only snippets (always combine with usage)
- Long feature lists (convert to example-driven)
- Project governance (move to a separate governance doc)
- Licensing text (link to LICENSE)
- Directory trees (unless essential)
- Academic citations

---

## 6. QUALITY CHECKLIST

Before finalizing, verify each snippet:

- ✅ **Runnable standalone** - Copy-paste works with minimal setup
- ✅ **Answers a question** - Clearly addresses "how do I..."
- ✅ **Unique content** - No duplication
- ✅ **Proper format** - Title, description, code with language tag
- ✅ **Practical focus** - Real-world usage, not just theory
- ✅ **Complete imports** - All necessary imports included
- ✅ **No metadata** - No licenses, citations, directory trees
- ✅ **Valid syntax** - Code would actually run

**Question coverage matrix** (aim for 15-20):
- [ ] Installation and setup
- [ ] Basic initialization
- [ ] Authentication methods
- [ ] Primary use cases (3-5)
- [ ] Configuration options
- [ ] Error handling
- [ ] Advanced features
- [ ] Integration examples
- [ ] Testing approaches

---

## 7. ITERATION PROCESS

1. Extract structure JSON (scripts)
2. Identify missing questions / weak sections (AI judgment)
3. Apply targeted patterns (from the [catalog](./transformation-patterns.md))
4. Re-extract JSON and re-evaluate
5. Repeat until docs are complete and usable

**Metric-specific improvements**:
- **Low question-snippet** (< 60/80): Add Patterns 1, 2, 3, 11
- **Low formatting** (< 4/5): Apply Pattern 16
- **High metadata** (> 0): Apply Pattern 4
- **High initialization** (> 0): Apply Pattern 6
- **Low LLM eval**: Apply Patterns 5, 13, 14

---

## 8. RELATED RESOURCES

### Reference Files
- [transformation-patterns.md](./transformation-patterns.md) - The 16 patterns with worked before/after examples
- [workflows.md](./workflows.md) - Execution modes for the create-quality-control workflow
- [README.md](./README.md) - create-quality-control reference route map
- [core-standards.md](../../shared/references/core-standards.md) - Document type rules and structural requirements
- [validation.md](../../shared/references/validation.md) - Quality scoring and validation workflows
- [quick-reference.md](../../shared/references/quick-reference.md) - Quick command reference
- [skill-creation.md](../../create-skill/references/README.md) - Skill creation workflow
- [create-readme references](../../create-readme/references/README.md) - Install guide standards and workflow

### Templates
- [skill-md-template.md](../../create-skill/assets/skill/skill-md-template.md) - SKILL.md file templates
- [skill-asset-template.md](../../create-skill/assets/skill/skill-asset-template.md) - Bundled asset structure
- [readme-template.md](../../create-readme/assets/readme-template.md) - Comprehensive README guide (13 sections)
- [command-template.md](../../create-command/assets/command-template.md) - Command creation guide (19 sections)
- [install-guide-template.md](../../create-readme/assets/install-guide-template.md) - Install guide template (14 sections)
- [llmstxt-templates.md](../../shared/assets/llmstxt-templates.md) - llms.txt with decision framework
- [frontmatter-templates.md](../../shared/assets/frontmatter-templates.md) - Frontmatter validation & templates (11 sections)
