---
title: Python Quality Standards
description: Code quality requirements, validation rules, and best practices for Python scripts in the OpenCode development environment.
---

# Python Quality Standards

Code quality requirements, validation rules, and best practices for Python scripts in the OpenCode development environment.

---

## 1. 📖 OVERVIEW

### Purpose

Establishes quality gates and validation criteria that all Python code must meet before being committed or deployed.

### Quality Tiers

| Tier | Requirement Level | Enforcement |
|------|-------------------|-------------|
| P0 | HARD BLOCKER | Must fix before commit |
| P1 | Required | Must fix or get approval |
| P2 | Recommended | Can defer with justification |

---

## 2. 📌 P0 - HARD BLOCKERS

These items MUST be fixed before any commit.

### File Header Present

Every Python script must have the standard header:

```python
#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: [COMPONENT NAME]
# ───────────────────────────────────────────────────────────────
```

**Evidence**: `skill_advisor.py:1-4`

### Module Docstring

Every script must have a module-level docstring explaining purpose and usage:

```python
"""
Brief description of what this module does.

Usage: python script_name.py [arguments]
"""
```

**Evidence**: `skill_advisor.py:6-16`

### snake_case Functions

All function names must use snake_case:

```python
# Correct
def validate_frontmatter(content: str) -> bool:
    pass

# WRONG - will fail validation
def validateFrontmatter(content: str) -> bool:  # camelCase
    pass

def ValidateFrontmatter(content: str) -> bool:  # PascalCase
    pass
```

**Evidence**: `skill_advisor.py:379`, `package_skill.py:87`

### UPPER_SNAKE_CASE Constants

Module-level constants must use UPPER_SNAKE_CASE:

```python
# Correct
MAX_FILE_SIZE = 5000
REQUIRED_FIELDS = ['name', 'description']

# WRONG
maxFileSize = 5000  # camelCase
required_fields = ['name', 'description']  # snake_case (looks like variable)
```

**Evidence**: `skill_advisor.py:31-49`

### No Commented-Out Code

Remove all commented-out code blocks. Use version control for history.

```python
# WRONG - remove this
# def old_function():
#     return "deprecated"

# OK - explanatory comments
# Note: This approach chosen because...
```

### WHY Comments for Non-Obvious Code

Complex logic must include comments explaining WHY, not WHAT:

```python
# WRONG - describes what (obvious from code)
# Set x to 5
x = 5

# CORRECT - explains why
# Use 5 retries to handle transient network failures (per SLA requirement)
max_retries = 5
```

---

## 3. 📌 P1 - REQUIRED

These items must be addressed or receive explicit approval to defer.

### Type Hints

All function signatures should include type hints:

```python
# Required for all functions
def process_data(
    input_data: Dict[str, Any],
    strict: bool = True
) -> Tuple[bool, str, List[str]]:
    pass
```

**Evidence**: `package_skill.py:87`

### Google-Style Docstrings

Public functions must have Google-style docstrings:

```python
def validate_config(config_path: Path) -> Tuple[bool, str]:
    """
    Validate configuration file against schema.

    Args:
        config_path: Path to the configuration file

    Returns:
        Tuple of (is_valid, error_message)

    Raises:
        FileNotFoundError: If config_path doesn't exist
    """
    pass
```

**Evidence**: `package_skill.py:87-93`

### Specific Exception Handling

Catch specific exceptions, never bare `except`:

```python
# Required
try:
    data = json.loads(content)
except json.JSONDecodeError as e:
    logger.error(f"JSON parse error: {e}")
    return None

# WRONG - too broad
try:
    data = json.loads(content)
except:
    return None
```

### Early Return Pattern

Use guard clauses and early returns to reduce nesting:

```python
# Required pattern
def process(data):
    if not data:
        return None

    if not validate(data):
        return None

    # Main logic at base level
    return transform(data)

# WRONG - deep nesting
def process(data):
    if data:
        if validate(data):
            return transform(data)
    return None
```

**Evidence**: `package_skill.py:98-104`

### TODO Format

TODOs must include context (ticket number or owner):

```python
# Required format
# TODO(username): Description of what needs to be done
# TODO(TICKET-123): Implement caching for performance

# WRONG - no context
# TODO: fix this later
```

---

## 4. 📌 P2 - RECOMMENDED

These items improve quality but can be deferred with justification.

### Import Ordering

Follow PEP 8 import order with blank lines between groups:

```python
# 1. Standard library
import os
import sys
from pathlib import Path

# 2. Third-party
import yaml

# 3. Local
from .utils import helper
```

### Consistent String Quotes

Use double quotes for strings consistently:

```python
# Preferred
message = "Hello world"
config = {"key": "value"}

# Acceptable but less preferred
message = 'Hello world'
```

### Line Length

- Target: 88-100 characters
- Maximum: 120 characters
- Break at logical points for readability

### Docstring Coverage

Aim for docstrings on all public functions and classes, even simple ones:

```python
def get_version() -> str:
    """Return the current version string."""
    return VERSION
```

---

## 5. 💡 VALIDATION PATTERNS

### Function Validation Pattern

Standard pattern for functions that validate input:

```python
def validate_something(input_data: Any) -> Tuple[bool, str, List[str]]:
    """
    Validate input against requirements.

    Args:
        input_data: The data to validate

    Returns:
        Tuple of (is_valid, error_message, warnings)
    """
    warnings = []

    # Guard clause - required field
    if not input_data:
        return False, "Input data is required", warnings

    # Type validation
    if not isinstance(input_data, dict):
        return False, "Input must be a dictionary", warnings

    # Business rule validation
    if 'name' not in input_data:
        return False, "Missing required field 'name'", warnings

    # Optional validation (warnings, not errors)
    if 'description' not in input_data:
        warnings.append("Consider adding a description")

    return True, "", warnings
```

**Evidence**: `package_skill.py:87-145`

### Return Value Pattern

Use tuples for functions that return status + data:

```python
# Pattern: (success, error_or_result, optional_metadata)
def parse_file(path: Path) -> Tuple[bool, str, Dict]:
    """
    Returns:
        Tuple of (success, error_message_or_content, metadata)
    """
    if not path.exists():
        return False, f"File not found: {path}", {}

    content = path.read_text()
    metadata = extract_metadata(content)
    return True, content, metadata
```

---

## 6. 🚨 ERROR MESSAGE STANDARDS

### Include Context

Error messages must include relevant context:

```python
# Good - includes context
return False, f"Name '{name}' must be hyphen-case (lowercase letters, digits, and hyphens only)"
return False, f"Missing required field '{field}' in frontmatter"
return False, f"File not found: {file_path}"

# Bad - vague
return False, "Invalid name"
return False, "Missing field"
return False, "File error"
```

**Evidence**: `package_skill.py:117-121`

### Actionable Guidance

When possible, include guidance on how to fix:

```python
# Good - tells user what to do
return False, "Description cannot contain angle brackets (< or >) - breaks OpenCode parsing"

# Better - includes fix
return False, f"Name '{name}' cannot start or end with hyphen. Use: '{name.strip('-')}'"
```

**Evidence**: `package_skill.py:134`

---

## 7. 🧪 TESTING REQUIREMENTS

### Test File Naming

Test files must follow the pattern `test_[module_name].py`:

```
scripts/
├── skill_advisor.py
└── tests/
    └── test_skill_advisor.py
```

### Minimum Coverage

- P0: Critical paths must be tested
- P1: 80% line coverage target
- P2: Edge cases and error paths

### Test Structure

```python
import pytest
from pathlib import Path

from ..skill_advisor import validate_request

class TestValidateRequest:
    """Tests for validate_request function."""

    def test_valid_input_returns_true(self):
        """Valid input should return success."""
        result = validate_request("create a skill")
        assert result[0] is True

    def test_empty_input_returns_error(self):
        """Empty input should return error with message."""
        is_valid, error = validate_request("")
        assert is_valid is False
        assert "required" in error.lower()

    def test_special_characters_handled(self):
        """Special characters should not cause crashes."""
        result = validate_request("test <script>alert</script>")
        assert isinstance(result, tuple)
```

---

## 8. ✅ CODE REVIEW CHECKLIST

Before submitting Python code for review:

```markdown
P0 - HARD BLOCKERS:
[ ] Shebang line present (#!/usr/bin/env python3)
[ ] File header present (COMPONENT comment block)
[ ] Module docstring present
[ ] All functions use snake_case
[ ] All constants use UPPER_SNAKE_CASE
[ ] No commented-out code
[ ] WHY comments for complex logic

P1 - REQUIRED:
[ ] Type hints on all function signatures
[ ] Google-style docstrings on public functions
[ ] Specific exception handling (no bare except)
[ ] Early return pattern used
[ ] TODOs have context (ticket/owner)

P2 - RECOMMENDED:
[ ] Import ordering (stdlib, third-party, local)
[ ] Consistent string quotes
[ ] Line length under 120 chars
[ ] Full docstring coverage
```

---

## 9. 🔗 RELATED RESOURCES

### Internal References
- [style_guide.md](./style_guide.md) - Formatting and conventions
- [quick_reference.md](./quick_reference.md) - Quick lookup for patterns

### External Standards
- [PEP 8](https://peps.python.org/pep-0008/) - Style Guide for Python Code
- [PEP 257](https://peps.python.org/pep-0257/) - Docstring Conventions
