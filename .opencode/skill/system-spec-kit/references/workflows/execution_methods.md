---
title: Execution Methods Reference
description: How to execute spec folder operations - validation, completion checking, context saving, and template composition
---

# Execution Methods Reference

How to execute spec folder operations - validation, completion checking, context saving, and template composition.

---

## 1. 📖 OVERVIEW

This document covers validation, completion checking, context saving, folder creation, and template composition operations.

---

## 2. ✅ VALIDATION

### validate-spec.sh

Validates spec folder structure and content against level requirements.

**Usage:**
```bash
# Basic validation
bash .opencode/skill/system-spec-kit/scripts/validate-spec.sh specs/001-feature/

# Quiet mode (suppress non-essential output)
bash .opencode/skill/system-spec-kit/scripts/validate-spec.sh --quiet specs/001-feature/

# JSON output
bash .opencode/skill/system-spec-kit/scripts/validate-spec.sh --json specs/001-feature/
```

**Exit Codes:**
| Code | Meaning |
|------|---------|
| 0 | Validation passed |
| 1 | Warnings found (non-blocking) |
| 2 | Errors found (blocking) |

---

## 3. 🏁 COMPLETION CHECKING

### check-completion.sh

Verifies all checklist items are marked complete before claiming "done".

**Usage:**
```bash
# Check completion status
bash .opencode/skill/system-spec-kit/scripts/check-completion.sh specs/001-feature/

# JSON output for automation
bash .opencode/skill/system-spec-kit/scripts/check-completion.sh --json specs/001-feature/
```

**Requirements:**
- All `[x]` items must have evidence
- P0 items are hard blockers
- P1 items require completion OR user-approved deferral
- P2 items can be deferred without approval

---

## 4. 💾 CONTEXT SAVING

### generate-context.js

Generates memory files from conversation context for future session recovery.

**Usage:**
```bash
# Direct mode - pass spec folder path
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/001-feature/

# JSON mode - pass data file
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js /tmp/context-data.json
```

**Environment Variables:**
| Variable | Default | Purpose |
|----------|---------|---------|
| DEBUG | false | Enable debug logging |
| AUTO_SAVE_MODE | false | Skip alignment check |
| SPECKIT_QUIET | false | Suppress non-essential output |

---

## 5. 📁 SPEC FOLDER CREATION

### spec/create.sh

Creates new spec folders with appropriate templates.

**Usage:**
```bash
# Interactive mode
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh

# With arguments
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --level 2 --name "feature-name"

# Sub-folder mode
bash .opencode/skill/system-spec-kit/scripts/spec/create.sh --subfolder specs/001-parent/ --topic "iteration-2"
```

**Flags:**
| Flag | Purpose |
|------|---------|
| `--level N` | Set documentation level (1-3) |
| `--name NAME` | Feature name for folder |
| `--subfolder PATH` | Create as sub-folder of existing spec |
| `--topic NAME` | Topic name for sub-folder |
| `--sharded` | Create sharded sections (Level 3) |

---

## 6. 📊 LEVEL RECOMMENDATION

### recommend-level.sh

Recommends appropriate documentation level based on feature characteristics.

**Usage:**
```bash
# Basic recommendation
bash .opencode/skill/system-spec-kit/scripts/recommend-level.sh "Add user authentication"

# With feature flags
bash .opencode/skill/system-spec-kit/scripts/recommend-level.sh --auth --api "Add OAuth login"
```

**Feature Flags:**
| Flag | Effect |
|------|--------|
| `--auth` | Increases level (security-sensitive) |
| `--api` | Increases level (API changes) |
| `--db` | Increases level (database changes) |
| `--architectural` | Forces Level 3 |

---

## 7. 📦 TEMPLATE COMPOSITION

### compose.sh

Composes level-specific templates from core + addendum source components. Ensures consistency between source templates and composed outputs.

**Usage:**
```bash
# Compose all level templates
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh

# Preview changes without writing files
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --dry-run

# Verbose output during composition
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verbose

# Verify composed templates match sources
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh --verify

# Compose specific levels only
bash .opencode/skill/system-spec-kit/scripts/templates/compose.sh 2 3
```

**Flags:**
| Flag | Purpose |
|------|---------|
| `--dry-run, -n` | Preview changes without writing files |
| `--verbose, -v` | Show detailed output during composition |
| `--force, -f` | Overwrite existing files without prompting |
| `--verify` | Verify composed templates match sources |
| `--help, -h` | Show help message |

**Composition Rules:**
| Level | Components |
|-------|------------|
| Level 1 | Core only |
| Level 2 | Core + level2-verify addendum |
| Level 3 | Core + level2-verify + level3-arch addendums |
| Level 3+ | Core + all addendums |

**When to Use:**
- After modifying `core/` templates
- After modifying `addendum/` templates
- To verify template consistency in CI/CD
- Before releasing template updates

---

## 8. 🔗 RELATED RESOURCES

- [Validation Rules](../validation/validation_rules.md)
- [Folder Routing](../structure/folder_routing.md)
- [Quick Reference](../workflows/quick_reference.md)
- [Template Guide](../templates/template_guide.md)
