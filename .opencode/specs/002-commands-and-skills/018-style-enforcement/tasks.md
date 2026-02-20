<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Tasks: Zero-Tolerance Documentation Formatting

> Implementation tasks for eliminating documentation formatting errors.

---

<!-- ANCHOR:notation -->
## Task Overview

| ID | Task | Priority | Status | Dependencies |
|----|------|----------|--------|--------------|
| T001 | Create `template_rules.json` | P0 | Pending | None |
| T002 | Create `validate_document.py` | P0 | Pending | T001 |
| T003 | Test validator against existing READMEs | P0 | Pending | T002 |
| T004 | Add auto-fix capability | P1 | Pending | T002 |
| T005 | Update write.md agent | P1 | Pending | T002 |
| T006 | Update workflows-documentation SKILL.md | P2 | Pending | T005 |
| T007 | Create test suite | P2 | Pending | T002 |

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## P0 Tasks (Critical)

### T001: Create `template_rules.json`

**Location:** `.opencode/skill/workflows-documentation/assets/template_rules.json`

**Content:**
```json
{
  "version": "1.0.0",
  "document_types": {
    "readme": {
      "required_sections": ["overview", "quick_start", "troubleshooting"],
      "optional_sections": ["structure", "features", "configuration", "usage_examples", "faq", "related_documents"],
      "section_emojis": {
        "overview": "📖",
        "quick_start": "🚀",
        "structure": "📁",
        "features": "⚡",
        "configuration": "⚙️",
        "usage_examples": "💡",
        "troubleshooting": "🛠️",
        "faq": "❓",
        "related_documents": "📚",
        "related_resources": "🔗"
      },
      "toc_required": true,
      "toc_anchor_format": "double_dash",
      "h2_emoji_required": true,
      "first_section": "overview",
      "last_section_pattern": "related"
    },
    "skill": {
      "required_sections": ["when_to_use", "smart_routing", "how_it_works", "rules"],
      "optional_sections": ["success_criteria", "integration_points", "external_resources", "related_resources"],
      "section_emojis": {
        "when_to_use": "🎯",
        "smart_routing": "🧭",
        "how_it_works": "🛠️",
        "rules": "📋",
        "success_criteria": "🏆",
        "integration_points": "🔌",
        "external_resources": "📚",
        "related_resources": "🔗"
      },
      "toc_required": false,
      "h2_emoji_required": true
    },
    "reference": {
      "required_sections": ["overview"],
      "section_emojis": {
        "overview": "📖",
        "usage": "💡",
        "examples": "📝",
        "related_resources": "🔗"
      },
      "h2_emoji_required": true
    },
    "asset": {
      "required_sections": ["overview"],
      "section_emojis": {
        "overview": "📖",
        "related_resources": "🔗"
      },
      "h2_emoji_required": true
    }
  },
  "validation_rules": {
    "h2_pattern": "^## (\\d+)\\.\\s+(.+)$",
    "h2_with_emoji_pattern": "^## (\\d+)\\.\\s+[^\\w\\s]\\s+(.+)$",
    "toc_entry_pattern": "^- \\[(.+?)\\]\\(#(.+?)\\)$",
    "toc_anchor_double_dash": "^(\\d+)--([a-z-]+)$",
    "toc_anchor_single_dash": "^(\\d+)-([a-z-]+)$"
  },
  "severity_levels": {
    "blocking": ["missing_h2_emoji", "toc_single_dash_anchor", "missing_required_section", "missing_toc"],
    "warning": ["non_sequential_numbering", "missing_optional_section"],
    "info": ["extra_section", "deprecated_section_name"]
  }
}
```

**Acceptance Criteria:**
- [ ] JSON is valid and parseable
- [ ] All document types covered (readme, skill, reference, asset)
- [ ] All standard section emojis mapped
- [ ] Severity levels defined

---

### T002: Create `validate_document.py`

**Location:** `.opencode/skill/workflows-documentation/scripts/validate_document.py`

**Features:**
1. Load and parse template_rules.json
2. Detect document type from content/path
3. Validate TOC format (if required)
4. Validate H2 header format and emojis
5. Validate required sections present
6. Output JSON report
7. Return appropriate exit code

**CLI Interface:**
```bash
# Basic validation
python validate_document.py <file.md>

# Specify document type
python validate_document.py <file.md> --type readme

# JSON output
python validate_document.py <file.md> --json

# Show only blocking errors
python validate_document.py <file.md> --blocking-only
```

**Exit Codes:**
- 0: Valid (no blocking errors)
- 1: Invalid (blocking errors found)
- 2: File not found or parse error

**Acceptance Criteria:**
- [ ] Detects missing TOC
- [ ] Detects single-dash TOC anchors
- [ ] Detects missing H2 emojis
- [ ] Detects missing required sections
- [ ] JSON output mode works
- [ ] Exit codes correct

---

### T003: Test Validator Against Existing READMEs

**Test Files:**
1. `mcp_server/lib/README.md` - Should pass
2. `mcp_server/formatters/README.md` - Should pass (just fixed)
3. `scripts/renderers/README.md` - Should pass (just fixed)

**Process:**
```bash
# Run against each README
for f in $(find .opencode/skill/system-spec-kit -name "README.md"); do
    echo "Testing: $f"
    python validate_document.py "$f" --json
done
```

**Acceptance Criteria:**
- [ ] All recently-fixed READMEs pass
- [ ] Validator catches known-bad patterns
- [ ] No false positives on valid files

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## P1 Tasks (High Priority)

### T004: Add Auto-Fix Capability

**Enhancements to `validate_document.py`:**

```bash
# Auto-fix mode
python validate_document.py <file.md> --fix

# Dry-run (show what would be fixed)
python validate_document.py <file.md> --fix --dry-run
```

**Auto-fixable Issues:**
1. Single-dash TOC anchors → double-dash
2. Missing H2 emoji (if section name matches known mapping)
3. TOC entries without emojis (add from mapping)

**Non-auto-fixable (require human):**
1. Missing required sections (need content)
2. Wrong section order (may need restructure)

**Acceptance Criteria:**
- [ ] --fix mode modifies file
- [ ] --dry-run shows changes without modifying
- [ ] Only safe fixes are applied

---

### T005: Update write.md Agent

**Changes:**

1. **Section 1 (CORE WORKFLOW)** - Add validation gates:
```markdown
3. **LOAD TEMPLATE** → Read template file [HARD GATE]
   - MUST call Read() on template file
   - HALT if template not loaded
4. **COPY SKELETON** → Copy H2 headers verbatim
   - NEVER reconstruct from memory
5. **VALIDATE SKELETON** → Run validate_document.py [NEW GATE]
6. **FILL CONTENT** → Add content under headers
7. **VALIDATE OUTPUT** → Run validate_document.py [NEW GATE]
   - BLOCKING errors = fix before delivery
```

2. **Section 9 (OUTPUT VERIFICATION)** - Add script check:
```markdown
### Script Validation (MANDATORY)

Before claiming completion, run:
\`\`\`bash
python .opencode/skill/workflows-documentation/scripts/validate_document.py <file>
\`\`\`

- Exit 0 = proceed to delivery
- Exit 1 = fix errors, re-run
```

**Acceptance Criteria:**
- [ ] Workflow includes validation gates
- [ ] HARD GATE terminology used
- [ ] Script command documented

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## P2 Tasks (Medium Priority)

### T006: Update workflows-documentation SKILL.md

**Changes:**

1. **Section 4 (RULES)** - Add validation rules:
```markdown
### Validation Gates

#### ✅ ALWAYS
1. **ALWAYS run validate_document.py before delivery**
2. **ALWAYS fix blocking errors before claiming completion**
3. **ALWAYS use double-dash anchors in TOC**

#### ❌ NEVER
1. **NEVER reconstruct H2 headers from memory**
2. **NEVER skip template loading**
3. **NEVER deliver with blocking validation errors**
```

2. **Section 6 (INTEGRATION POINTS)** - Add script:
```markdown
| Script | Purpose | Usage |
|--------|---------|-------|
| `validate_document.py` | Pre-delivery format check | `validate_document.py doc.md` |
```

**Acceptance Criteria:**
- [ ] ALWAYS/NEVER rules added
- [ ] Script documented in integration table

---

### T007: Create Test Suite

**Location:** `.opencode/skill/workflows-documentation/scripts/tests/`

**Test Files:**
```
tests/
├── valid_readme.md          # Complete valid README
├── missing_toc.md           # README without TOC
├── single_dash_anchors.md   # TOC with wrong anchor format
├── missing_emojis.md        # H2 without emojis
├── missing_sections.md      # Missing required sections
└── test_validator.py        # Automated test runner
```

**Acceptance Criteria:**
- [ ] Test for each error type
- [ ] Automated test runner
- [ ] All tests pass

<!-- /ANCHOR:phase-3 -->

---

## Implementation Order

```
T001 (rules) ──► T002 (script) ──► T003 (test existing)
                      │
                      ├──► T004 (auto-fix)
                      │
                      └──► T005 (write.md) ──► T006 (SKILL.md)
                                    │
                                    └──► T007 (test suite)
```
