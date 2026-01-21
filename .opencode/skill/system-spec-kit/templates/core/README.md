# Core Templates

> Minimal base templates for spec folder documents (~270 LOC total) - the building blocks for all SpecKit documentation.

---

## 1. 📖 OVERVIEW

The core templates are the BASE building blocks for all SpecKit documentation. They provide the essential structure with minimal scaffolding - no guidance, no examples, no verbose placeholders.

**Key Characteristics:**
- **Minimal**: Only essential sections, no boilerplate
- **Flexible**: Used as building blocks for level-specific templates
- **Clean**: No `[YOUR_VALUE_HERE]` or `[example:]` patterns
- **Efficient**: ~60-90 lines per template

**Version**: v2.0-core

---

## 2. 📦 CONTENTS

| File | Lines | Purpose |
|------|-------|---------|
| `spec-core.md` | ~94 | Feature specification structure |
| `plan-core.md` | ~102 | Implementation plan structure |
| `tasks-core.md` | ~67 | Task breakdown structure |
| `impl-summary-core.md` | ~59 | Post-implementation summary |

**Total**: ~322 lines across 4 templates

---

## 3. ⚠️ IMPORTANT WARNING

**DO NOT copy directly from `core/` templates for new spec folders.**

These are BASE templates used to construct level-specific templates. For actual spec folders, use:

| Your Need | Use This |
|-----------|----------|
| **Level 1 spec** | `templates/level_1/spec.md` |
| **Level 2 spec** | `templates/level_2/spec.md` |
| **Level 3 spec** | `templates/level_3/spec.md` |
| **Level 3+ spec** | `templates/level_3+/spec.md` |

The `level_N/` folders contain **pre-composed templates** with the correct sections for that level (CORE + level-specific ADDENDUM sections).

---

## 4. 🏗️ TEMPLATE ARCHITECTURE

Core templates follow the **CORE + ADDENDUM** pattern (see `template_mapping.md`):

```
level_N/spec.md = spec-core.md (CORE)
                  + spec-l2-addendum.md (if Level 2+)
                  + spec-l3-addendum.md (if Level 3+)
                  + spec-l3plus-addendum.md (if Level 3+)
```

This modular approach allows:
- **Consistency**: All levels share the same core structure
- **Scalability**: Higher levels add sections without duplicating CORE
- **Maintainability**: Update CORE once, all levels inherit changes

---

## 5. 📚 RELATED DOCUMENTS

- **Level-specific templates**: `../level_1/`, `../level_2/`, `../level_3/`, `../level_3+/`
- **Verbose versions**: `../verbose/core/` - Extended templates with guidance for new users
- **Template mapping**: `../../assets/template_mapping.md` - Full composition rules
- **Style guide**: `../../references/templates/template_style_guide.md` - Formatting standards
