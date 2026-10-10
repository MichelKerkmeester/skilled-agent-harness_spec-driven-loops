"""Run the review mode's route_review_resources pseudocode on an Obsidian-only diff.

Usage, from the repository root:
    python3 -I <this file> [path to sk-code-review/SKILL.md]

It takes the python block under "### Smart Router Pseudocode" from SKILL.md and
prints the `surface_evidence` the full route reports for a changed manifest.json
whose text carries `"minAppVersion"`, so it proves the route hands file text to
the detector and not only the detector in isolation.
"""
import re
import sys
from pathlib import Path
from types import SimpleNamespace

DEFAULT_SKILL = ".skilled/skills/sk-code/sk-code-review/SKILL.md"


def main():
    skill_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_SKILL
    text = Path(skill_path).read_text(encoding="utf-8")
    marker = text.index("### Smart Router Pseudocode")
    block = re.search(r"```python\n(.*?)```", text[marker:], re.S).group(1)
    namespace = {"__file__": str(Path(skill_path).resolve()), "load": lambda path: None, "__name__": "probe"}
    exec(compile(block, skill_path, "exec"), namespace)
    route = namespace["route_review_resources"]
    task = SimpleNamespace(text="review this change for security", keywords=[])
    contents = {"manifest.json": '{"minAppVersion": "1.4.0"}'}
    try:
        result = route(task, [], ["manifest.json", "src/main.ts"], lambda path: contents.get(path, ""))
    except TypeError:
        result = route(task, [], ["manifest.json", "src/main.ts"])
    print(f"route-obsidian-manifest: {result['surface_evidence']}")


if __name__ == "__main__":
    main()
