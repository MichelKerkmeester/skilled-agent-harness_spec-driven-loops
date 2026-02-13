---
title: "Templates"
description: "Spec folder templates implementing the CORE + ADDENDUM v2.2 architecture for progressive documentation enhancement."
trigger_phrases:
  - "templates"
  - "spec folder templates"
  - "template architecture"
importance_tier: "normal"
---

# Templates

> Spec folder templates implementing the CORE + ADDENDUM v2.2 architecture for progressive documentation enhancement.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. 💡 LEVEL SELECTION GUIDE](#3--level-selection-guide)
- [4. 📦 STANDALONE TEMPLATES](#4--standalone-templates)
- [5. 💡 USAGE GUIDE](#5--usage-guide)
- [6. 📚 RELATED DOCUMENTS](#6--related-documents)

<!-- /ANCHOR:table-of-contents -->

---

## 1. 📖 OVERVIEW
<!-- ANCHOR:overview -->

This directory contains all templates used by the system-spec-kit for creating spec folder documentation. Templates follow the CORE + ADDENDUM v2.2 architecture, where core files remain constant across all levels, and addendum sections are progressively added based on documentation level.

**Key Principles:**
- **Core files** (spec, plan, tasks, implementation-summary) remain structurally identical across all levels
- **Addendum sections** are injected at the end of core files based on level requirements
- **Level selection** is driven by LOC count, complexity, and governance requirements
- **Standalone templates** exist for special-purpose documentation (research, handover, debug-delegation)

<!-- /ANCHOR:overview -->

---

## 2. 📁 STRUCTURE
<!-- ANCHOR:structure -->

```
templates/
├── core/                              # Core templates (shared structure)
│   ├── spec-core.md                   # Feature specification (base)
│   ├── plan-core.md                   # Implementation plan (base)
│   ├── tasks-core.md                  # Task breakdown (base)
│   └── impl-summary-core.md           # Implementation summary (base)
│
├── addendum/                          # Addendum sections by level
│   ├── level2-verify/                 # Level 2: Verification addenda
│   ├── level3-arch/                   # Level 3: Architecture addenda
│   └── level3plus-govern/             # Level 3+: Governance addenda
│
├── level_1/                           # Level 1 complete templates (4 files)
│   ├── spec.md                        # Core only, no addenda
│   ├── plan.md                        # Core only, no addenda
│   ├── tasks.md                       # Core only, no addenda
│   └── implementation-summary.md      # Core only, no addenda
│
├── level_2/                           # Level 2 complete templates (5 files)
│   ├── spec.md                        # Core + L2 addenda
│   ├── plan.md                        # Core + L2 addenda
│   ├── tasks.md                       # Core only
│   ├── implementation-summary.md      # Core only (no addenda)
│   └── checklist.md                   # L2 verification checklist
│
├── level_3/                           # Level 3 complete templates (6 files)
│   ├── spec.md                        # Hardcoded (core + L2 + L3 content)
│   ├── plan.md                        # Core + L2 + L3 addenda
│   ├── tasks.md                       # Core only
│   ├── implementation-summary.md      # Core only (no addenda)
│   ├── checklist.md                   # L2 base + extended verification
│   └── decision-record.md             # L3 architecture decision record
│
├── level_3+/                          # Level 3+ complete templates (6 files)
│   ├── spec.md                        # Hardcoded (core + L2 + L3 + L3+ content)
│   ├── plan.md                        # Core + L2 + L3 + L3+ addenda
│   ├── tasks.md                       # Core only
│   ├── implementation-summary.md      # Core only (no addenda)
│   ├── checklist.md                   # L2 base + extended verification
│   └── decision-record.md             # L3 architecture decision record
│
├── examples/                          # Filled examples for reference
│   ├── level_1/                       # L1 example spec folder
│   ├── level_2/                       # L2 example spec folder
│   ├── level_3/                       # L3 example spec folder
│   └── level_3+/                      # L3+ example spec folder
│
├── memory/                            # Memory-related templates
│   └── (auto-generated via MCP)       # Memory files use MCP server
│
├── scratch/                           # Scratch file templates
│   └── (minimal/no templates)         # Scratch is free-form
│
├── context_template.md                # Standalone: Memory context template
├── research.md                        # Standalone: Feature research template
├── handover.md                        # Standalone: Session handover template
└── debug-delegation.md                # Standalone: Debug escalation template
```

<!-- /ANCHOR:structure -->

---

## 3. 💡 LEVEL SELECTION GUIDE
<!-- ANCHOR:level-selection-guide -->

Choose the documentation level based on **LOC (Lines of Code)**, **complexity**, and **governance requirements**.

| Level | LOC Range | Files | Use When |
|-------|-----------|-------|----------|
| **Level 1** | <100 | 4 files | Simple features, small changes, minimal risk |
| **Level 2** | 100-499 | 5 files | Medium features requiring verification and QA |
| **Level 3** | 500+ | 6 files | Large features, architecture changes, technical decisions |
| **Level 3+** | Complex | 6 files | Enterprise governance, multi-agent, formal approval workflows |

**Decision Factors:**
- **LOC** is soft guidance; complexity and risk can override
- **Level 2+** requires checklist.md for verification
- **Level 3+** requires decision-record.md for architecture decisions
- **Level 3+** includes governance sections (approval workflows, stakeholder matrices)

**When in doubt:** Choose the higher level for better documentation coverage.

<!-- /ANCHOR:level-selection-guide -->

---

## 4. 📦 STANDALONE TEMPLATES
<!-- ANCHOR:standalone-templates -->

These templates are used independently, not as part of a spec folder level.

| Template | Purpose | When to Use |
|----------|---------|-------------|
| **context_template.md** | Memory context saving | Preserving conversation context via MCP |
| **research.md** | Feature research | Deep technical investigation, 3+ domains |
| **handover.md** | Session handover | Session end, incomplete work, context transfer |
| **debug-delegation.md** | Debug escalation | After 3+ failed attempts, specialist needed |

**Notes:**
- `context_template.md` is auto-populated via `generate-context.ts` script (MCP integration; executed as compiled `.js`)
- `research.md` is comprehensive (16 sections, ~900 lines) for full technical documentation
- `handover.md` and `debug-delegation.md` are workflow-specific, created on-demand

<!-- /ANCHOR:standalone-templates -->

---

## 5. 💡 USAGE GUIDE
<!-- ANCHOR:examples -->

### For Templates

1. **Determine level** using LOC count and complexity assessment
2. **Use templates from `level_N/` folder** corresponding to chosen level
3. **Copy templates** to new spec folder: `specs/###-feature-name/`
4. **Fill in content** replacing placeholders with actual values
5. **Validate** using system-spec-kit validation scripts

**Example:**
```bash
# For a Level 2 feature (100-499 LOC)
cp templates/level_2/*.md specs/042-new-feature/
```

### For Standalone Templates

**Research:**
```bash
# Copy research template to spec folder
cp templates/research.md specs/042-new-feature/research.md
```

**Handover:**
```bash
# Use /spec_kit:handover command for automated creation
# Or manually copy template
cp templates/handover.md specs/042-new-feature/memory/handover-2026-01-21.md
```

**Debug Delegation:**
```bash
# Use /spec_kit:debug command for automated delegation
# Or manually copy template for documentation
cp templates/debug-delegation.md specs/042-new-feature/scratch/debug-report.md
```

### Memory Files (Special Case)

**DO NOT manually copy `context_template.md`.** Memory files are auto-generated via MCP server.

**Correct approach:**
```bash
# Use generate-context.js script
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/042-new-feature/

# Or use /memory:save command
```

<!-- /ANCHOR:examples -->

---

## 6. 📚 RELATED DOCUMENTS
<!-- ANCHOR:related -->

- **Template Mapping**: See `references/templates/template_guide.md` for selection logic
- **Template Style Guide**: See `references/templates/template_style_guide.md` for formatting rules
- **Level Specifications**: See `references/templates/level_specifications.md` for level requirements
- **Validation Rules**: See `references/validation/validation_rules.md` for quality checks
- **Example Spec Folders**: See `examples/` for filled-in reference implementations
<!-- /ANCHOR:related -->
