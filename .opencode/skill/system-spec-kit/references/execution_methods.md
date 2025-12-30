---
title: Execution Methods Reference
description: How to execute spec folder operations - validation, completion checking, context saving
---

# Execution Methods Reference

How to execute spec folder operations - validation, completion checking, context saving.

---

## 1. 📖 OVERVIEW

This document covers validation, completion checking, context saving, and folder creation operations.

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
node .opencode/skill/system-spec-kit/scripts/generate-context.js specs/001-feature/

# JSON mode - pass data file
node .opencode/skill/system-spec-kit/scripts/generate-context.js /tmp/context-data.json
```

**Environment Variables:**
| Variable | Default | Purpose |
|----------|---------|---------|
| DEBUG | false | Enable debug logging |
| AUTO_SAVE_MODE | false | Skip alignment check |
| SPECKIT_QUIET | false | Suppress non-essential output |

---

## 5. 📁 SPEC FOLDER CREATION

### create-spec-folder.sh

Creates new spec folders with appropriate templates.

**Usage:**
```bash
# Interactive mode
bash .opencode/skill/system-spec-kit/scripts/create-spec-folder.sh

# With arguments
bash .opencode/skill/system-spec-kit/scripts/create-spec-folder.sh --level 2 --name "feature-name"

# Sub-folder mode
bash .opencode/skill/system-spec-kit/scripts/create-spec-folder.sh --subfolder specs/001-parent/ --topic "iteration-2"
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

## 7. 🔗 RELATED RESOURCES

- [Validation Rules](./validation_rules.md)
- [Folder Routing](./folder_routing.md)
- [Quick Reference](./quick_reference.md)
