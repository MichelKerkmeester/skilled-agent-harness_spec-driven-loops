<!-- SPECKIT_TEMPLATE_SOURCE: legacy-normalized | v2.2 -->

# Plan: Zero-Tolerance Documentation Formatting

> Implementation strategy for eliminating documentation formatting errors.

---

<!-- ANCHOR:summary -->
## Analysis Summary

### Gap Analysis: Current State vs Ideal

```
CURRENT WORKFLOW (write agent):
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  RECEIVE    │ ──► │  CLASSIFY   │ ──► │ LOAD TEMPLATE│ ──► │ FILL CONTENT│
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                              │                     │
                                              ▼                     ▼
                                         (SOFT GATE)          (NO VALIDATION)
                                         Often skipped         Headers reconstructed
                                                               from memory
```

**Gap 1: Template Loading is Soft Gate**
- Write agent says "LOAD TEMPLATE" but doesn't enforce it
- Agent can proceed without reading template
- No verification that template was actually loaded

**Gap 2: Header Copy vs Reconstruction**
- Template has correct headers: `## 1. 📖 OVERVIEW`
- Agents often reconstruct: `## 1. OVERVIEW` (missing emoji)
- No automated check catches this before delivery

**Gap 3: TOC Format Validation Missing**
- Template shows: `#1--overview` (double-dash)
- Common error: `#1-overview` (single-dash)
- No script validates TOC anchor format

**Gap 4: Validation Only at End**
- DQI scoring happens after document is "complete"
- By then, structure errors are baked in
- Should validate skeleton BEFORE filling content

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## Solution Architecture

### Three-Layer Defense

```
LAYER 1: TEMPLATE INJECTION (Prevention)
┌──────────────────────────────────────────────────────────────────────┐
│ Before creation: Auto-generate skeleton from template                │
│ - extract_skeleton.py [template] → JSON structure                    │
│ - Skeleton includes ALL headers with emojis, TOC with correct anchors│
│ - Agent fills content INTO pre-validated skeleton                    │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
LAYER 2: IN-PROCESS VALIDATION (Detection)
┌──────────────────────────────────────────────────────────────────────┐
│ During creation: Validate structure matches template                 │
│ - validate_structure.py [document] [template-type]                   │
│ - Checks: H2 emojis, TOC format, section order, required sections    │
│ - BLOCKING errors prevent delivery                                   │
└──────────────────────────────────────────────────────────────────────┘
                                │
                                ▼
LAYER 3: PRE-DELIVERY GATE (Enforcement)
┌──────────────────────────────────────────────────────────────────────┐
│ Before delivery: Final validation gate                               │
│ - Must pass validate_structure.py with exit code 0                   │
│ - DQI score >= 75 (Good band)                                        │
│ - No BLOCKING violations                                             │
└──────────────────────────────────────────────────────────────────────┘
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## Implementation Plan

### Phase 1: Validation Script (P0 - Critical)

**Create `validate_document.py`** - Automated README format checker

**Checks:**
1. **TOC Validation**
   - TOC section exists
   - Each entry has emoji
   - Anchors use double-dash format (`#1--overview`)
   - Anchors match section headers

2. **H2 Header Validation**
   - Pattern: `## N. [emoji] TITLE`
   - Sequential numbering (1, 2, 3...)
   - Required emojis per section name (from mapping)
   - No missing emojis in template-based docs

3. **Section Order Validation**
   - Section 1 is OVERVIEW (with 📖)
   - Last section is RELATED (with 📚 or 🔗)
   - No duplicate section numbers

4. **Required Sections**
   - README: Overview, Quick Start, Troubleshooting minimum
   - SKILL: Overview, When to Use, How it Works, Rules minimum

**Output:**
```json
{
  "valid": false,
  "blocking_errors": [
    { "line": 5, "error": "H2 missing emoji", "expected": "## 1. 📖 OVERVIEW", "found": "## 1. OVERVIEW" }
  ],
  "warnings": [],
  "auto_fixable": ["H2 emoji insertion possible"]
}
```

### Phase 2: Template Rules File (P0 - Critical)

**Create `template_rules.json`** - Machine-readable template specifications

```json
{
  "readme": {
    "required_sections": ["overview", "quick_start", "troubleshooting"],
    "section_emojis": {
      "overview": "📖",
      "quick_start": "🚀",
      "structure": "📁",
      "features": "⚡",
      "configuration": "⚙️",
      "usage_examples": "💡",
      "troubleshooting": "🛠️",
      "faq": "❓",
      "related_documents": "📚"
    },
    "toc_anchor_format": "#N--section-name",
    "h2_pattern": "## N. [emoji] SECTION_NAME"
  },
  "skill": {
    "required_sections": ["when_to_use", "smart_routing", "how_it_works", "rules"],
    "section_emojis": {
      "when_to_use": "🎯",
      "smart_routing": "🧭",
      "how_it_works": "🛠️",
      "rules": "📋",
      "success_criteria": "🏆",
      "integration_points": "🔌",
      "external_resources": "📚",
      "related_resources": "🔗"
    }
  }
}
```

### Phase 3: Write Agent Updates (P1 - High)

**Update write.md** with mandatory validation:

```markdown
## 1. CORE WORKFLOW (UPDATED)

1. **RECEIVE** → Parse documentation request
2. **CLASSIFY** → Determine document type
3. **LOAD TEMPLATE** → Read template file [HARD GATE]
   - MUST call Read() on template file
   - MUST extract header skeleton before proceeding
   - VIOLATION: Proceeding without template = HALT
4. **VALIDATE SKELETON** → Run validate_document.py on template [NEW]
   - Confirm skeleton has all required sections
   - Confirm all H2 emojis present
5. **FILL CONTENT** → Add content under copied headers
6. **VALIDATE STRUCTURE** → Run validate_document.py on output [NEW]
   - BLOCKING errors = fix before proceeding
7. **DQI SCORE** → Run extract_structure.py
8. **DELIVER** → Only if validation passes

### Hard Gates (BLOCKING)

| Gate | Check | Tool | Exit Code |
|------|-------|------|-----------|
| Template Loaded | Template file was Read() | Manual verify | - |
| Structure Valid | validate_document.py passes | Script | 0 |
| DQI Score | extract_structure.py >= 75 | Script | - |
```

### Phase 4: Auto-Fix Capability (P2 - Medium)

**Add `--fix` flag to validate_document.py:**

```bash
# Check only
python validate_document.py document.md

# Auto-fix safe violations
python validate_document.py document.md --fix

# Auto-fixable:
# - Add missing emoji to H2 (if section name matches known mapping)
# - Fix TOC anchor format (single-dash → double-dash)
# - Add missing TOC section
# - Fix section numbering
```

### Phase 5: Integration with workflows-documentation (P2 - Medium)

**Update SKILL.md Section 4 (RULES):**

```markdown
### Validation Gates (NEW)

#### Pre-Creation Gate
Before writing ANY documentation:
1. Load template: `Read(template_path)`
2. Extract skeleton: Headers + TOC structure
3. Verify skeleton valid: `validate_document.py --skeleton-only`

#### Pre-Delivery Gate
Before claiming completion:
1. Run validation: `python validate_document.py document.md`
2. Exit code 0 = proceed
3. Exit code 1 = fix blocking errors
4. Re-run until pass
```

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:dependencies -->
## File Changes

| File | Change Type | Priority |
|------|-------------|----------|
| `scripts/validate_document.py` | CREATE | P0 |
| `assets/template_rules.json` | CREATE | P0 |
| `write.md` (agent) | UPDATE | P1 |
| `SKILL.md` (workflows-documentation) | UPDATE | P2 |
| `readme_template.md` | NO CHANGE | - |

<!-- /ANCHOR:dependencies -->

---

## Validation Script Design

### `validate_document.py` - Detailed Specification

```python
"""
README/Documentation Format Validator

Usage:
    python validate_document.py <document.md> [--type readme|skill] [--fix] [--json]

Exit Codes:
    0 - Valid (no blocking errors)
    1 - Invalid (blocking errors found)
    2 - File not found / parse error

Checks:
    1. TOC exists and format correct
    2. H2 headers have emojis
    3. Section numbering sequential
    4. Required sections present
    5. Anchor format uses double-dash
"""
```

### Check Implementation

**Check 1: TOC Validation**
```python
def validate_toc(content, doc_type):
    """
    Validates TABLE OF CONTENTS section.

    Rules:
    - Must have "## TABLE OF CONTENTS" header
    - Each entry format: "- [N. [emoji] SECTION](#n--section)"
    - Anchors use double-dash: #1--overview NOT #1-overview
    - All TOC entries have corresponding H2 headers
    """
    errors = []

    # Find TOC section
    toc_match = re.search(r'## TABLE OF CONTENTS\n(.*?)(?=\n---|\n##)', content, re.DOTALL)
    if not toc_match:
        errors.append({"type": "missing_toc", "severity": "blocking"})
        return errors

    toc_content = toc_match.group(1)

    # Check each entry
    for line in toc_content.strip().split('\n'):
        if line.startswith('- ['):
            # Check anchor format
            anchor_match = re.search(r'\(#(\d+)-(.*?)\)', line)
            if anchor_match:
                if not anchor_match.group(0).startswith('(#' + anchor_match.group(1) + '--'):
                    errors.append({
                        "type": "toc_anchor_single_dash",
                        "line": line,
                        "severity": "blocking",
                        "fix": line.replace('#' + anchor_match.group(1) + '-',
                                           '#' + anchor_match.group(1) + '--')
                    })

            # Check emoji presence
            if not re.search(r'\d+\.\s+[^\w\s]', line):
                errors.append({
                    "type": "toc_missing_emoji",
                    "line": line,
                    "severity": "blocking"
                })

    return errors
```

**Check 2: H2 Header Validation**
```python
def validate_h2_headers(content, doc_type, rules):
    """
    Validates H2 header format.

    Rules:
    - Pattern: ## N. [emoji] TITLE
    - Emoji required for template-based docs
    - Sequential numbering
    """
    errors = []
    h2_pattern = re.compile(r'^## (\d+)\.\s+(.+)$', re.MULTILINE)

    matches = h2_pattern.findall(content)
    expected_num = 1

    for num, title in matches:
        # Check sequential numbering
        if int(num) != expected_num:
            errors.append({
                "type": "non_sequential_number",
                "found": num,
                "expected": expected_num,
                "severity": "warning"
            })
        expected_num = int(num) + 1

        # Check emoji presence
        # Emoji detection: first character is not alphanumeric or space
        title_stripped = title.strip()
        first_char = title_stripped[0] if title_stripped else ''

        # Check if emoji present (simplified: check for non-ASCII first char)
        has_emoji = ord(first_char) > 127 if first_char else False

        if not has_emoji:
            # Look up expected emoji
            section_key = title_stripped.lower().replace(' ', '_')
            expected_emoji = rules.get('section_emojis', {}).get(section_key, None)

            errors.append({
                "type": "h2_missing_emoji",
                "section": title_stripped,
                "expected_emoji": expected_emoji,
                "severity": "blocking",
                "fix": f"## {num}. {expected_emoji} {title_stripped}" if expected_emoji else None
            })

    return errors
```

---

## Testing Plan

### Test Cases

| Test | Input | Expected |
|------|-------|----------|
| Valid README | Complete template-compliant README | Exit 0, no errors |
| Missing TOC | README without TABLE OF CONTENTS | Exit 1, blocking error |
| Single-dash anchors | TOC with `#1-overview` | Exit 1, blocking + auto-fix |
| Missing H2 emoji | `## 1. OVERVIEW` | Exit 1, blocking + auto-fix |
| Non-sequential numbers | `## 1`, `## 3` (skip 2) | Exit 0, warning only |
| Missing required section | README without Troubleshooting | Exit 1, blocking |

### Validation Commands

```bash
# Test valid README
python validate_document.py tests/valid_readme.md
# Expected: exit 0

# Test invalid README
python validate_document.py tests/missing_emoji.md
# Expected: exit 1, JSON output with errors

# Test auto-fix
python validate_document.py tests/fixable.md --fix
# Expected: exit 0, file modified
```

---

<!-- ANCHOR:rollback -->
## Rollout Plan

### Phase 1: Script Development (This Session)
1. Create `validate_document.py`
2. Create `template_rules.json`
3. Test against existing READMEs

### Phase 2: Agent Integration (Next Session)
1. Update write.md with validation gates
2. Update workflows-documentation SKILL.md
3. Test end-to-end flow

### Phase 3: Monitoring (Ongoing)
1. Track validation failures
2. Tune rules based on false positives
3. Add new document types as needed

<!-- /ANCHOR:rollback -->

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| False positives blocking valid docs | Add `--severity warning` mode |
| Script too slow | Cache template rules, optimize regex |
| Agent ignores validation | Make gates BLOCKING in workflow |
| New section names not in mapping | Fallback to warning, not blocking |
