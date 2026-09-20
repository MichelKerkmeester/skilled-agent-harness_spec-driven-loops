#!/usr/bin/env python3
"""Copy canonical repository skills into the Python package."""

from pathlib import Path
import shutil


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "skills"
DESTINATION = ROOT / "src" / "jev_cli" / "bundled_skills"


def main() -> None:
    shutil.rmtree(DESTINATION, ignore_errors=True)
    DESTINATION.mkdir(parents=True)
    for skill in sorted(SOURCE.iterdir()):
        if skill.is_dir() and (skill / "SKILL.md").is_file():
            shutil.copytree(skill, DESTINATION / skill.name)


if __name__ == "__main__":
    main()
