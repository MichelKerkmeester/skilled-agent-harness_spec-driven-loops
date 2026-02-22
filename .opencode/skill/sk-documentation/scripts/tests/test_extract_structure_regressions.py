#!/usr/bin/env python3
"""
Regression tests for extract_structure.py.
"""

import importlib.util
from pathlib import Path


def _load_module():
    scripts_dir = Path(__file__).resolve().parents[1]
    module_path = scripts_dir / "extract_structure.py"
    spec = importlib.util.spec_from_file_location("extract_structure", module_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def test_nested_example_fence_does_not_swallow_following_headings():
    module = _load_module()
    content = (
        "# Title\n\n"
        "```markdown\n"
        "```python\n"
        "print('x')\n"
        "```\n\n"
        "## 1. AFTER\n\n"
        "This heading should be visible to the parser.\n"
    )

    headings = module.extract_headings(content)
    heading_texts = [h["text"] for h in headings]
    assert "1. AFTER" in heading_texts

    code_blocks = module.extract_code_blocks(content)
    assert len(code_blocks) == 1
    assert code_blocks[0]["language"] == "markdown"
    assert code_blocks[0]["line_count"] >= 2


def test_detect_document_type_supports_command_path():
    module = _load_module()
    doc_type, source = module.detect_document_type(
        "/tmp/project/.opencode/command/create/skill.md"
    )
    assert doc_type == "command"
    assert source == "path"
