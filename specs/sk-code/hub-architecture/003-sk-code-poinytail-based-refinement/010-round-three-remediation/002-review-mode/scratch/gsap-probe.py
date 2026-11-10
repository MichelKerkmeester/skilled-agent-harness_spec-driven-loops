"""Run the review mode's detect_surface_evidence pseudocode on a gsap call.

Usage, from the repository root:
    python3 -I <this file> [path to sk-code-review/SKILL.md]

The shared detection contract lists `gsap.(to|from|set|timeline|registerPlugin)`
as a WEBFLOW content marker, so a file whose text calls `gsap.to(` must detect
as WEBFLOW. Prints one line, `gsap-call: <surface>`.
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
    detect = namespace["detect_surface_evidence"]
    task = SimpleNamespace(text="review this change", keywords=[])
    print(f"gsap-call: {detect(task, [], ['hero.js'], lambda path: 'gsap.to(el, { x: 1 })')}")


if __name__ == "__main__":
    main()
