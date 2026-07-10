#!/usr/bin/env python3
"""
Dist staleness checker for edited source files.

Usage:
  check-dist-staleness.sh <file>   Check the one watched package that owns <file>.
  check-dist-staleness.sh --all    Check every watched package.

Always exits 0. If a watched TypeScript build surface is stale, or the checker
reports it could not verify a package, prints a bounded banner to stdout for the
caller to surface in-session.

Coverage contract: the default (single-file) mode is intentionally
edited-file-scoped -- it warns only for the package that owns the just-edited
file, keeping each PostToolUse invocation fast and targeted. Cross-package
coverage (a package left stale by an edit elsewhere) is provided by the --all
mode, which the Claude SessionStart hook runs once per session. This mirrors the
OpenCode plugin, which likewise checks all packages at session start and warns
per-turn while scoping per-edit work to the edited file.
"""
import json
import os
import subprocess
import sys

CHECKER_REL = ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"


def repo_root_from_script() -> str:
    script_dir = os.path.dirname(os.path.abspath(__file__))
    # scripts -> code-quality -> sk-code -> skills -> .opencode -> repo root
    return os.path.abspath(os.path.join(script_dir, "../../../../.."))


def resolve_checker():
    repo_root = os.getcwd()
    checker = os.path.join(repo_root, CHECKER_REL)
    if not os.path.isfile(checker):
        repo_root = repo_root_from_script()
        checker = os.path.join(repo_root, CHECKER_REL)
    return repo_root, checker


def run_checker(checker, repo_root, command_args):
    try:
        result = subprocess.run(
            ["node", checker, *command_args],
            capture_output=True,
            text=True,
            timeout=8,
            cwd=repo_root,
        )
    except (OSError, subprocess.TimeoutExpired, Exception) as exc:
        print(f"WARNING: dist freshness checker failed: {exc}", file=sys.stderr)
        return None

    try:
        return json.loads(result.stdout.strip() or "{}")
    except json.JSONDecodeError:
        return None


def print_stale(payload) -> None:
    package_name = payload.get("packageName") or payload.get("packageId") or "unknown package"
    rebuild_command = payload.get("rebuildCommand") or "npm run build"
    print(f"STALE DIST WARNING: {package_name} -- run: {rebuild_command}")


def print_error(payload) -> None:
    package_name = payload.get("packageName") or payload.get("packageId") or "unknown package"
    message = payload.get("message") or "dist freshness could not be verified"
    print(f"DIST FRESHNESS CHECK ERROR: {package_name} -- {message}")


def surface_result(payload) -> None:
    if payload.get("stale") is True:
        print_stale(payload)
    elif payload.get("status") == "error":
        print_error(payload)


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit(0)

    repo_root, checker = resolve_checker()
    if not os.path.isfile(checker):
        print("WARNING: dist freshness checker not found", file=sys.stderr)
        sys.exit(0)

    if sys.argv[1] == "--all":
        payload = run_checker(checker, repo_root, ["check-all", "--json"])
        if not isinstance(payload, dict):
            sys.exit(0)
        results = payload.get("results")
        if isinstance(results, list):
            for item in results:
                if isinstance(item, dict):
                    surface_result(item)
        sys.exit(0)

    file_path = os.path.abspath(sys.argv[1])
    if not os.path.isfile(file_path):
        sys.exit(0)

    payload = run_checker(checker, repo_root, ["check-file", "--file", file_path, "--json"])
    if not isinstance(payload, dict):
        sys.exit(0)

    surface_result(payload)
    sys.exit(0)


if __name__ == "__main__":
    main()
