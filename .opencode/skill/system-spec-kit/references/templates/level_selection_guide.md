---
title: Level Selection Guide
description: Guide to selecting appropriate documentation levels based on task complexity.
---

# Level Selection Guide - Complexity Scoring Algorithm

Guide to selecting appropriate documentation levels based on task complexity.

> **Note:** This guide provides conceptual guidance for level selection. The automated detection scripts (`detect-complexity.js`, `expand-template.js`) have been deprecated in favor of pre-expanded level folders. Use `--level N` with `scripts/spec/create.sh` to select a level directly.

---

## 1. 📖 OVERVIEW

The complexity detection system automatically analyzes task descriptions to:
- Recommend appropriate documentation levels (1, 2, 3, or 3+)
- Enable level-appropriate template features via COMPLEXITY_GATE markers
- Scale section counts dynamically based on complexity

**Why Auto-Detection?**
- Evidence from specs 056-068 shows documentation ranges from 60 LOC (simple) to 3,315 LOC (complex)
- Static templates don't support this variance
- Manual level selection often leads to under-documentation

---

## 2. 🎯 5-DIMENSION SCORING ALGORITHM

The algorithm scores tasks across 5 weighted dimensions (0-100 scale):

| Dimension       | Weight | What It Measures                          |
|-----------------|--------|-------------------------------------------|
| **Scope**       | 25%    | Files affected, LOC estimate, systems     |
| **Risk**        | 25%    | Security, auth, config, breaking changes  |
| **Research**    | 20%    | Investigation, unknowns, external deps    |
| **Multi-Agent** | 15%    | Parallel workstreams, agent coordination  |
| **Coordination**| 15%    | Cross-system deps, blocking relationships |

### Dimension Details

#### Scope (25%)
Evaluates the breadth of changes:
- LOC estimates (100+ LOC adds points)
- File count mentions
- System/component count
- "Comprehensive", "large-scale" indicators

#### Risk (25%)
Identifies high-risk areas:
- Authentication/authorization work
- API changes
- Database modifications
- Configuration changes
- Security-sensitive code
- Breaking changes

#### Research (20%)
Detects investigation needs:
- "Investigate", "analyze", "research" keywords
- Unknown factors mentioned
- External dependencies
- Exploration requirements

#### Multi-Agent (15%)
Identifies parallel work needs:
- Multiple workstreams mentioned
- Agent coordination required
- Parallel task execution
- Team coordination

#### Coordination (15%)
Measures dependency complexity:
- Cross-system dependencies
- Blocking relationships
- Integration requirements
- External service dependencies

---

## 3. 📊 LEVEL MAPPING

| Score     | Level | Name         | Description                              |
|-----------|-------|--------------|------------------------------------------|
| 0-25      | 1     | Baseline     | Minimal templates, simple tasks          |
| 26-55     | 2     | Verification | Standard docs + checklist                |
| 56-79     | 3     | Full         | Complete documentation + ADR             |
| 80-100    | 3+    | Extended     | Full + AI protocols + dependency graphs  |

### Level 3+ (Extended) Features

Level 3+ includes everything from Level 3 plus:
- AI Execution Protocol section
- Dependency graph visualization (ASCII/DAG)
- Effort estimation framework
- Extended checklist items (100-150 items)
- Sign-off requirements

---

## 4. 🔧 CLI TOOL

### spec/create.sh

Create spec folder with pre-expanded templates from level-specific folders:

```bash
# Create Level 1 spec folder (default)
./scripts/spec/create.sh "Simple bugfix"

# Create Level 2 spec folder
./scripts/spec/create.sh "Add OAuth2 authentication" --level 2

# Create Level 3 spec folder
./scripts/spec/create.sh "Major architecture redesign" --level 3

# Create Level 3+ spec folder (extended)
./scripts/spec/create.sh "Platform migration" --level 3+

# Use verbose templates (for new users or complex requirements)
./scripts/spec/create.sh "Complex feature" --style verbose
```

### Template Style Preference

Templates are available in two styles:

| Style | When to Use | Configuration |
|-------|-------------|---------------|
| **Minimal** (default) | Experienced users, quick iteration | `SPECKIT_TEMPLATE_STYLE=minimal` |
| **Verbose** | New users, complex requirements, onboarding | `SPECKIT_TEMPLATE_STYLE=verbose` |

**Configure preference:**
```bash
# Via environment variable (persistent)
export SPECKIT_TEMPLATE_STYLE=verbose

# Via CLI flag (per invocation)
./scripts/spec/create.sh "Feature name" --style verbose
```

**Verbose templates include:**
- `[YOUR_VALUE_HERE: description]` - Placeholders with guidance
- `[NEEDS CLARIFICATION: (a) (b) (c)]` - Multiple-choice questions
- `[example: content]` - Inline examples

See `templates/verbose/README.md` for detailed pattern documentation.

**Level Folders:**
Templates are pre-expanded and ready to use in level-specific folders:
- `templates/level_1/` - 4 files (spec.md, plan.md, tasks.md, implementation-summary.md)
- `templates/level_2/` - 5 files (adds checklist.md)
- `templates/level_3/` - 6 files (adds decision-record.md)
- `templates/level_3+/` - 6 files (extended versions with AI protocols)

> **Deprecated:** The `--complexity` and `--expand` flags, along with `detect-complexity.js` and `expand-template.js`, have been removed. Use `--level N` to select the appropriate level directly.

---

## 5. 📝 COMPLEXITY_GATE MARKERS

> **Note**: COMPLEXITY_GATE markers are deprecated as of Spec 069/071.
> Templates are now pre-expanded in level folders (`level_1/`, `level_2/`, `level_3/`, `level_3+/`).
> The marker syntax is retained for backward compatibility only.

Templates use COMPLEXITY_GATE markers to conditionally include content:

### Syntax

```markdown
<!-- COMPLEXITY_GATE: level>=3, feature=ai-protocol -->
Content only visible at Level 3+
<!-- /COMPLEXITY_GATE -->
```

### Supported Conditions

| Condition | Examples | Meaning |
|-----------|----------|---------|
| `level>=N` | `level>=2`, `level>=3` | Minimum level required |
| `level=N` | `level=2`, `level=3+` | Exact level match |
| `feature=X` | `feature=ai-protocol` | Feature must be enabled |
| `specType=X` | `specType=research` | Spec type must match |

### Multiple Conditions

```markdown
<!-- COMPLEXITY_GATE: level>=3, specType=research -->
Research-specific content at Level 3+
<!-- /COMPLEXITY_GATE -->
```

### Features

| Feature | Auto-enabled | Description |
|---------|--------------|-------------|
| `ai-protocol` | Level 3+ | AI execution protocol section |
| `dep-graph` | Level 2+ | Dependency visualization |
| `effort-est` | Level 2+ | Effort estimation framework |
| `ext-checklist` | Level 3+ | Extended checklist items |

---

## 6. 📈 DYNAMIC SECTION SCALING

Sections scale based on detected complexity:

| Section | Level 1 | Level 2 | Level 3 | Level 3+ |
|---------|---------|---------|---------|----------|
| User Stories (spec.md) | 1-2 | 2-4 | 4-8 | 8-15 |
| Phases (plan.md) | 2-3 | 3-5 | 5-8 | 8-12 |
| Tasks (tasks.md) | 5-15 | 15-50 | 50-100+ | 100+ |
| Checklist Items | 10-20 | 30-50 | 60-100 | 100-150 |
| AI Protocol | None | None | Optional | Required |
| Dependency Graph | None | Table | ASCII | Full DAG |

---

## 7. ✅ VALIDATION RULES

Four validation rules ensure complexity consistency:

### check-complexity.sh
Validates declared level matches actual content metrics:
- User story count within expected range
- Phase count within expected range
- Task count within expected range
- AI protocol present for Level 3+

### check-section-counts.sh
Validates section counts for declared level:
- H2 section minimums per file
- H3 section minimums per file
- Requirements count
- Acceptance scenarios count

### check-ai-protocols.sh
For Level 3+ specs, validates AI protocol components:
- Pre-Task Checklist present
- Execution Rules table present
- Status Reporting Format present
- Blocked Task Protocol present

### check-level-match.sh
Validates level consistency across all spec files:
- spec.md, plan.md, checklist.md declare same level
- Required files exist for declared level

### Running Validation

```bash
# Run all complexity validation rules
./scripts/rules/check-complexity.sh specs/XXX/
./scripts/rules/check-section-counts.sh specs/XXX/
./scripts/rules/check-ai-protocols.sh specs/XXX/
./scripts/rules/check-level-match.sh specs/XXX/

# Exit codes:
# 0 = PASS
# 1 = WARN (non-blocking)
# 2 = FAIL (blocking)
```

---

## 8. ⚙️ CONFIGURATION

Configuration file: `config/complexity-config.jsonc`

```jsonc
{
  "weights": {
    "scope": 25,
    "risk": 25,
    "research": 20,
    "multiAgent": 15,
    "coordination": 15
  },
  "levels": {
    "1": { "min": 0, "max": 25, "name": "Baseline" },
    "2": { "min": 26, "max": 55, "name": "Verification" },
    "3": { "min": 56, "max": 79, "name": "Full" },
    "3+": { "min": 80, "max": 100, "name": "Extended" }
  },
  "signals": {
    "scope": {
      "keywords": ["comprehensive", "large-scale", "multiple", "systems"],
      "patterns": ["\\d+\\s*(files|components|modules)"]
    }
    // ... more signals
  }
}
```

### Customization

Override weights for project-specific needs:

```bash
# Use custom config
node scripts/detect-complexity.js --request "..." --config ./my-config.jsonc
```

---

## 9. 🔗 RELATED RESOURCES

### Core Modules
- `lib/complexity/detector.js` - Main detection orchestrator
- `lib/complexity/classifier.js` - Score to level mapping
- `lib/complexity/scorers/` - Dimension scorers
- `lib/expansion/preprocessor.js` - Template preprocessing
- `lib/expansion/marker-parser.js` - COMPLEXITY_GATE parser

### Templates (Level-Based Organization)

Templates are now pre-expanded in level folders, eliminating runtime gate processing:

| Level | Folder | Pre-expanded Content |
|-------|--------|---------------------|
| Level 1 | `templates/level_1/` | Baseline templates (spec, plan, tasks, implementation-summary) |
| Level 2 | `templates/level_2/` | Level 1 + checklist |
| Level 3 | `templates/level_3/` | Level 2 + decision-record, research |
| Level 3+ | `templates/level_3+/` | Level 3 + AI protocol, extended checklist |

**Example paths:**
- `templates/level_1/spec.md` - Level 1 spec template
- `templates/level_2/checklist.md` - Level 2 checklist template
- `templates/level_3/decision-record.md` - Level 3 ADR template
- `templates/level_3+/spec.md` - Level 3+ spec with AI protocol sections

### Legacy Conditional Content Blocks (Deprecated)

> **Note**: These blocks were used with COMPLEXITY_GATE markers and are now
> integrated directly into the level-specific templates above.

- `templates/complexity/ai-protocol.md` - Now in `level_3+/` templates
- `templates/complexity/dependency-graph.md` - Now in `level_2+/` templates
- `templates/complexity/effort-estimation.md` - Now in `level_2+/` templates
- `templates/complexity/extended-checklist.md` - Now in `level_3+/` templates

### Reference Documentation
- [level_specifications.md](./level_specifications.md) - Complete level requirements
- [template_guide.md](./template_guide.md) - Template selection and adaptation
