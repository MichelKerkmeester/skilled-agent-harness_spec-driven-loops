"""Run the review mode's detect_surface_evidence pseudocode on fixed inputs.

Usage, from the repository root:
    python3 -I <this file> [path to sk-code-review/SKILL.md]

It takes the python block under "### Smart Router Pseudocode" from SKILL.md,
runs it with stand-ins for the undefined `load` call, and prints one line per
case: `<case>: <surface>`. The first three cases are the foreign-repository
inputs from the round-three research; the last three are controls.
"""
import re
import sys
from pathlib import Path
from types import SimpleNamespace

DEFAULT_SKILL = ".skilled/skills/sk-code/sk-code-review/SKILL.md"

CASES = [
    ("generic-node-src", "fix a null deref in the parser", ["src/api/client.ts"], {}),
    ("dependency-bump", "review my dependency bump", ["package.json"], {}),
    ("obsidian-prompt", "code review my obsidian plugin", ["main.ts"], {}),
    ("hub-file", "review this change", [".skilled/agents/code.md"], {}),
    ("webflow-path", "review this change", ["src/2_javascript/hero.js"], {}),
    ("obsidian-manifest", "review this change", ["manifest.json", "src/main.ts"], {"manifest.json": '{"minAppVersion": "1.4.0"}'}),
]


def load_detector(skill_path):
    text = Path(skill_path).read_text(encoding="utf-8")
    marker = text.index("### Smart Router Pseudocode")
    block = re.search(r"```python\n(.*?)```", text[marker:], re.S)
    if block is None:
        raise SystemExit("no python block under Smart Router Pseudocode")
    namespace = {"__file__": str(Path(skill_path).resolve()), "load": lambda path: None, "__name__": "probe"}
    exec(compile(block.group(1), skill_path, "exec"), namespace)
    return namespace["detect_surface_evidence"]


def main():
    skill_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SKILL
    detect = load_detector(skill_path)
    for name, prompt, changed, contents in CASES:
        task = SimpleNamespace(text=prompt, keywords=[])
        try:
            result = detect(task, [], changed, lambda path, c=contents: c.get(path, ""))
        except TypeError:
            # The older detector takes no file reader; contents are ignored there.
            result = detect(task, [], changed)
        print(f"{name}: {result}")


if __name__ == "__main__":
    main()
