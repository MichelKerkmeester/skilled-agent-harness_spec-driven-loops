#!/usr/bin/env python3
# ───────────────────────────────────────────────────────────────
# COMPONENT: NEGATIVE CONTROL FOR THE SECTION-REFERENCE SCAN
# ───────────────────────────────────────────────────────────────

"""
Prove the reference scan can fail: renumber the headings but leave every reference as written,
then run the scan on that broken copy. A scan that reports 0 dangling here proves nothing.

Usage: python negative-control.py <file-list> --repo <dir> --out <dir>
"""

import argparse
import importlib.util
import shutil
import subprocess
import sys
from pathlib import Path


def load_tool(path: Path):
    spec = importlib.util.spec_from_file_location("renumber_references", path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("file_list")
    parser.add_argument("--repo", default=".")
    parser.add_argument("--out", required=True)
    args = parser.parse_args()

    tool = load_tool(Path(__file__).with_name("renumber-references.py"))
    repo = Path(args.repo).resolve()
    out = Path(args.out).resolve()
    rels = [line.strip() for line in Path(args.file_list).read_text().splitlines() if line.strip()]

    base = out / "head-tree"
    if base.exists():
        shutil.rmtree(base)
    for rel in rels:
        original = subprocess.run(
            ["git", "-c", "core.fsmonitor=false", "show", f"HEAD:{rel}"], cwd=repo, capture_output=True, text=True, check=True
        ).stdout
        (base / rel).parent.mkdir(parents=True, exist_ok=True)
        (base / rel).write_text(original, encoding="utf-8")

    tool.rewrite_refs = lambda text, refs, plan, maps: text
    plans, _ = tool.build_plans(base, rels)

    broken = out / "tree"
    if broken.exists():
        shutil.rmtree(broken)
    for rel, plan in plans.items():
        target = broken / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_text(tool.render(plan), encoding="utf-8")
        skill_rel = rel.split("/references")[0] + "/SKILL.md"
        skill_target = broken / skill_rel
        if not skill_target.exists():
            skill_target.parent.mkdir(parents=True, exist_ok=True)
            shutil.copy(repo / skill_rel, skill_target)
    return tool.cmd_verify(broken, rels, out, None)


if __name__ == "__main__":
    sys.exit(main())
