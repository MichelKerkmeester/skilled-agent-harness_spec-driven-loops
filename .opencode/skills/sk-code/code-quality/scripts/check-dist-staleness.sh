#!/usr/bin/env python3
"""
Dist staleness checker for edited source files.

Usage: check-dist-staleness.sh <file>

Always exits 0. If the edited file belongs to a watched TypeScript build
surface and the corresponding dist output is stale, prints a warning banner to
stdout for the caller to surface in-session.
"""
import json
import os
import subprocess
import sys


def repo_root_from_script() -> str:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.abspath(os.path.join(script_dir, "../../../.."))


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(0)

    file_path = os.path.abspath(sys.argv[1])
    if not os.path.isfile(file_path):
        sys.exit(0)

    repo_root = os.getcwd()
    checker = os.path.join(repo_root, ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs")
    if not os.path.isfile(checker):
        repo_root = repo_root_from_script()
        checker = os.path.join(repo_root, ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs")

    if not os.path.isfile(checker):
        print("WARNING: dist freshness checker not found", file=sys.stderr)
        sys.exit(0)

    try:
        result = subprocess.run(
            ["node", checker, "check-file", "--file", file_path, "--json"],
            capture_output=True,
            text=True,
            timeout=8,
            cwd=repo_root,
        )
    except (OSError, subprocess.TimeoutExpired, Exception) as exc:
        print(f"WARNING: dist freshness checker failed: {exc}", file=sys.stderr)
        sys.exit(0)

    try:
        payload = json.loads(result.stdout.strip() or "{}")
    except json.JSONDecodeError:
        sys.exit(0)

    if payload.get("stale") is True:
        package_name = payload.get("packageName") or payload.get("packageId") or "unknown package"
        rebuild_command = payload.get("rebuildCommand") or "npm run build"
        print(f"STALE DIST WARNING: {package_name} -- run: {rebuild_command}")

    sys.exit(0)


if __name__ == "__main__":
    main()
