#!/usr/bin/env python3
"""Run sk-prompt's ROUTER.md Smart Router Pseudocode block verbatim against probe tasks."""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[5]
SKILL = ROOT / ".skilled" / "skills" / "sk-prompt"
text = (SKILL / "ROUTER.md").read_text()
block = re.search(r"### Smart Router Pseudocode\s+```python\n(.*?)```", text, re.S).group(1)
block = block.replace("Path(__file__).resolve().parent", f"Path({str(SKILL)!r})")
ns = {"load": lambda path: None}
exec(block, ns)

TASKS = [
    "$raw keep this prompt exactly as written",
    "raw passthrough",
    "raw passthrough mode for my prompt",
    "use $raw on this one",
    "improve this prompt",
    "$improve make this clearer",
    "$yaml turn this into frontmatter",
    "score this prompt with rcaf",
]
for task in TASKS:
    out = ns["route_prompt_improver_resources"](task)
    print(f"{task!r:45} intents={out['intents']} level={out.get('load_level', 'STANDARD')} resources={out['resources']}")
